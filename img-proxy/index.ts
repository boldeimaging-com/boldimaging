// img.boldeimaging.com — serves the public B2 bucket boldeimaging-img.
//
// Runs as a Railway Function (Bun) in the boldeimaging-stage project,
// service "img", with img.boldeimaging.com as its custom domain. DNS for
// boldeimaging.com stays at GoDaddy, so the usual proxied Cloudflare
// CNAME is not available; this service holds the certificate instead. This file
// is the source of record: paste it into the function after editing.
//
// B2 throttles bursts ({"code":"too_busy"}) and there is no edge cache in front,
// so objects are kept in memory once fetched (the whole bucket is ~50 MB) and
// concurrent requests for the same object share one origin fetch.

const ORIGIN = 'https://f005.backblazeb2.com/file/boldeimaging-img';
const MAX_BYTES = 256 * 1024 * 1024; // memory cap for the cache
const MISS_TTL_MS = 60_000; // how long a 404 is remembered

type Entry = { body: Uint8Array; type: string; etag: string; at: number };
const cache = new Map<string, Entry>(); // insertion order = LRU order
const misses = new Map<string, number>();
const inflight = new Map<string, Promise<Entry | null>>();
let bytes = 0;

function remember(key: string, e: Entry) {
  cache.set(key, e);
  bytes += e.body.byteLength;
  for (const [k, v] of cache) {
    if (bytes <= MAX_BYTES) break;
    cache.delete(k);
    bytes -= v.body.byteLength;
  }
}

async function fromOrigin(key: string): Promise<Entry | null> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(ORIGIN + key);
    if (res.ok) {
      const body = new Uint8Array(await res.arrayBuffer());
      return {
        body,
        type: res.headers.get('content-type') || 'application/octet-stream',
        etag: `"${res.headers.get('x-bz-content-sha1') || body.byteLength}"`,
        at: Date.now(),
      };
    }
    if (res.status === 404) return null;
    // 429 / 503 too_busy and other transient errors: back off and retry
    await Bun.sleep(250 * 2 ** attempt);
  }
  throw new Error(`origin failed for ${key}`);
}

async function lookup(key: string): Promise<Entry | null> {
  const hit = cache.get(key);
  if (hit) {
    cache.delete(key); // refresh LRU position
    cache.set(key, hit);
    return hit;
  }
  const missAt = misses.get(key);
  if (missAt && Date.now() - missAt < MISS_TTL_MS) return null;
  let p = inflight.get(key);
  if (!p) {
    p = fromOrigin(key).finally(() => inflight.delete(key));
    inflight.set(key, p);
  }
  const e = await p;
  if (e) { if (!cache.has(key)) remember(key, e); misses.delete(key); }
  else misses.set(key, Date.now());
  return e;
}

Bun.serve({
  port: Number(Bun.env.PORT) || 3000,
  async fetch(req) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    // Path only: a query string never reaches the bucket.
    // Kept percent-encoded, which is how B2 expects file names in a URL.
    const key = new URL(req.url).pathname;
    // Block a ".." path segment (the URL parser has already resolved plain ones);
    // ".." inside a file name, e.g. "Quote-SGH.1.1.1..jpg", is a real object.
    if (key === '/' || /(^|\/)(\.|%2e){2}(\/|$)/i.test(key)) {
      return new Response('Not Found', { status: 404 });
    }
    let e: Entry | null;
    try {
      e = await lookup(key);
    } catch {
      return new Response('Bad Gateway', { status: 502, headers: { 'Cache-Control': 'no-store' } });
    }
    if (!e) return new Response('Not Found', { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } });
    const headers = {
      'Content-Type': e.type,
      'Cache-Control': 'public, max-age=86400',
      ETag: e.etag,
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
    };
    if (req.headers.get('if-none-match') === e.etag) return new Response(null, { status: 304, headers });
    return new Response(req.method === 'HEAD' ? null : e.body, { headers: { ...headers, 'Content-Length': String(e.body.byteLength) } });
  },
});
