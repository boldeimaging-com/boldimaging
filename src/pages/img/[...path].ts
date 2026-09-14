import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

/**
 * GET /img/<uploads path> — images and the hero video, out of Backblaze B2.
 *
 * Why this exists rather than a second hostname. Images were briefly served
 * from img-boldimaging.10xid.com, a proxied CNAME to B2. Every check runnable
 * from the build sandbox passed -- 320 of 320 URLs 200 across all 19 pages,
 * cold cache, browser-like concurrency, correct range requests -- and they were
 * still broken in a real browser, on every page, including the logo.
 *
 * A whole hostname failing in a browser while passing every server-side check
 * points at TLS, and TLS is precisely what this sandbox cannot observe: it
 * intercepts HTTPS and re-signs it, so every certificate seen here reads
 * issuer=Anthropic even over a raw socket. Certificate Transparency did not
 * settle it either -- it shows no certificate for boldeimaging.10xid.com
 * either, and that host demonstrably works.
 *
 * So this route removes the unobservable instead of guessing at it. Requests
 * go to the SAME origin as the page, over the certificate that is already
 * proven to work in the visitor's browser, and B2 stays the store. There is no
 * second hostname, no CNAME and no transform rule left to be wrong -- and
 * nothing here depends on the shared 10xid.com zone, whose rules have already
 * been clobbered once today by another writer.
 *
 * The cost is a Worker invocation per cache MISS. Responses are immutable and
 * cached at the edge, so that is roughly once per object per colo; everything
 * after is served from cache without touching this code. Image bytes are
 * uploads-addressed and never change in place, which is what makes `immutable`
 * honest here.
 */
export const prerender = false;

/**
 * Bump to invalidate every cached image at once. Needed because a Worker
 * subrequest's cache entry lives under the upstream Backblaze URL by default,
 * which this account cannot purge -- see the cacheKey note in the handler.
 */
const CACHE_EPOCH = 2;

const BUCKET = 'boldeimaging-img';
const ORIGIN = 'https://f005.backblazeb2.com';

/** Uploads paths look like `2021/04/name.jpg`. Nothing else is fetchable. */
const SAFE = /^[A-Za-z0-9][A-Za-z0-9._\-\/]*$/;

export const GET: APIRoute = async ({ params, request }) => {
  const path = params.path ?? '';

  // Reject traversal and anything not shaped like an uploads path. Without
  // this, `..` segments would let this route address other buckets -- the same
  // scoping the transform rule used to provide.
  //
  // Traversal means a path SEGMENT of `.` or `..`, not the two characters
  // appearing anywhere. A blanket `path.includes('..')` also rejects
  // `…-SGH.1.1.0-1.1.1..jpg`, a real file in this bucket whose name carries a
  // double dot before the extension, and it 404'd on the gallery page because
  // of it.
  const segments = path.split('/');
  const traversal = segments.some((s) => s === '' || s === '.' || s === '..');
  if (!path || !SAFE.test(path) || traversal) {
    return new Response('Not found', { status: 404 });
  }

  const upstream = `${ORIGIN}/file/${BUCKET}/${path}`;
  const assets = (env as unknown as { ASSETS: Fetcher }).ASSETS;

  // Forward Range so <video> can seek. Without it the 18.7 MB hero video is
  // only playable as a single whole-file download, and scrubbing does nothing.
  const range = request.headers.get('range');

  // Caching is done explicitly through the Cache API, NOT through fetch's `cf`
  // options, because the useful ones are plan-gated and fail silently:
  // `cacheKey` and `cacheTtlByStatus` are Enterprise-only, so on this zone they
  // are ignored without any error. The plain `cacheTtl` that DOES work applies
  // to every status, which cached a transient Backblaze 503 for a year under
  // the upstream f005.backblazeb2.com URL -- a key in Backblaze's zone that
  // this account cannot purge. tribute14.jpg was stuck broken that way, and no
  // amount of purging boldeimaging.10xid.com could shift it.
  //
  // caches.default works on every plan, the key is a URL we own, and bumping
  // CACHE_EPOCH invalidates everything at once. Only successes are ever stored.
  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(`https://boldeimaging.10xid.com/__img/${CACHE_EPOCH}/${path}`);

  // Range requests are served straight from the origin: a 206 is a partial
  // response and must never be stored as if it were the whole object.
  if (!range) {
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
  }

  const fetchOnce = () =>
    fetch(upstream, { headers: range ? { range } : undefined, cf: { cacheEverything: false } });

  // Retry 503 with exponential backoff, which is what Backblaze asks for.
  //
  // This is the whole bug, not a nicety. B2 throttles with
  // `{"code":"too_busy"}` under burst load, and one page view asks for ~66
  // objects at once -- so on a cold cache a large share of a page's images come
  // back 503 and render as broken, everywhere, at once. That is the reported
  // symptom. Retrying immediately is useless against a throttle; the delay is
  // the part that works, and the cache above means a given object runs this
  // gauntlet about once per colo rather than on every view.
  const BACKOFF_MS = [200, 600, 1400];
  let res = await fetchOnce();
  for (let i = 0; res.status === 503 && i < BACKOFF_MS.length; i++) {
    await new Promise((r) => setTimeout(r, BACKOFF_MS[i]));
    res = await fetchOnce();
  }

  if (!res.ok && res.status !== 206) {
    // Backblaze reports faults as a JSON body with a `code`; echo it, because
    // otherwise the route collapses every upstream fault into an opaque 502
    // and there is nothing to debug from outside the Worker.
    const why = (await res.text().catch(() => '')).slice(0, 180).replace(/[\r\n]+/g, ' ');

    // Fall back to the copy bundled in the Worker rather than showing a broken
    // image. B2 answers `{"code":"too_busy"}` under load and can keep doing so
    // for a single hot object well past any backoff worth making a visitor
    // wait through -- tribute14.jpg sat throttled for half an hour while every
    // other object served fine. public/media is deployed anyway, so the bytes
    // are already here; there is no good reason to serve a broken hero image
    // while holding a correct copy.
    if (res.status !== 404) {
      const local = await assets.fetch(new URL(`/media/${path}`, request.url));
      if (local.ok) {
        const h = new Headers(local.headers);
        h.set('cache-control', 'public, max-age=31536000, immutable');
        h.set('x-img-source', 'worker-assets-fallback');
        h.set('x-upstream-status', String(res.status));
        return new Response(local.body, { status: 200, headers: h });
      }
    }

    return new Response('Upstream error', {
      status: res.status === 404 ? 404 : 502,
      headers: { 'x-upstream-status': String(res.status), 'x-upstream-body': why },
    });
  }

  const headers = new Headers();
  for (const h of ['content-type', 'content-length', 'content-range', 'etag', 'last-modified', 'accept-ranges']) {
    const v = res.headers.get(h);
    if (v) headers.set(h, v);
  }
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  // B2 announces its own file id and sha1 on every response; they are internal
  // bookkeeping and not something to publish on the client's site.
  headers.set('x-content-type-options', 'nosniff');

  const out = new Response(res.body, { status: res.status, headers });

  // Store only whole, successful responses. `immutable` is honest here because
  // uploads paths are content-addressed by filename and never change in place.
  if (!range && res.status === 200) {
    await cache.put(cacheKey, out.clone());
  }
  return out;
};
