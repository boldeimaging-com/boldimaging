#!/usr/bin/env node
/**
 * The Railway entry point:  node server.mjs  (after `npm run build`).
 *
 * Astro's Node adapter builds a handler that serves dist/client as static
 * files and falls through to the two on-demand /api/* routes. This file wraps
 * it to do what Cloudflare used to do from public/_headers, because a Node
 * server has no equivalent file:
 *
 *   1. X-Robots-Tag: noindex on EVERY response from a host that is not the
 *      client's production domain -- pages, robots.txt, sitemaps, images, the
 *      API. The HTML noindex meta tag cannot reach anything that is not HTML.
 *   2. Cache lifetimes for /media (uploads-addressed, never change in place)
 *      and the sitemap stylesheet's content type.
 *   3. A 301 from a slashless page address to its slashed form, GET/HEAD only.
 *   4. Telling Astro the request arrived over HTTPS when Railway's edge says
 *      so, which the form routes' same-origin check depends on.
 *
 * The noindex rule is decided by an allowlist of production hostnames, never
 * by "is this a preview": the client's own domain can only be noindexed if it
 * is missing from PRODUCTION_HOSTS, and it is spelled out right there.
 */
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Must be set before the entry is imported, or it starts its own server on
// the same port.
process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler } = await import('./dist/server/entry.mjs');

const PRODUCTION_HOSTS = new Set(['boldeimaging.com', 'www.boldeimaging.com']);
const CLIENT_DIR = fileURLToPath(new URL('./dist/client/', import.meta.url));

const bare = (v) => String(v ?? '').split(',')[0].trim().toLowerCase().replace(/:\d+$/, '');

/**
 * Production if EITHER Host or X-Forwarded-Host names the client's domain.
 * Checking both errs towards indexable: if a proxy ever rewrote one of them,
 * the failure mode is a preview briefly missing its header, never the live
 * site quietly telling Google to drop it.
 */
function isProductionRequest(req) {
  return (
    PRODUCTION_HOSTS.has(bare(req.headers.host)) ||
    PRODUCTION_HOSTS.has(bare(req.headers['x-forwarded-host']))
  );
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://local');
  const path = url.pathname;

  // /admin/ is never indexed, on production either.
  if (!isProductionRequest(req) || path === '/admin' || path.startsWith('/admin/')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  if ((req.method === 'GET' || req.method === 'HEAD') && !path.endsWith('/') && !extname(path)) {
    let decoded = path;
    try {
      decoded = decodeURIComponent(path);
    } catch {}
    // Only real page directories: /contact -> /contact/. Anything else (a
    // typo, an /api route) falls through to the normal 404 or handler.
    if (!decoded.includes('..') && existsSync(join(CLIENT_DIR, decoded, 'index.html'))) {
      res.statusCode = 301;
      res.setHeader('Location', path + '/' + url.search);
      res.end();
      return;
    }
  }

  // Both are honoured by the static handler (`send` keeps a Content-Type or
  // Cache-Control that is already set).
  if (path.startsWith('/media/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (path === '/sitemap.xsl') {
    res.setHeader('Content-Type', 'text/xsl; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }

  // Railway terminates TLS at its edge and speaks plain HTTP to this process,
  // and Astro takes the request's protocol from the socket alone. Without
  // this, Astro sees http://stage.boldeimaging.com while the browser's Origin
  // header says https://stage.boldeimaging.com, and its built-in cross-site
  // check rejects every form POST with a 403. Trusting the header is safe for
  // that check: a browser cannot be made to send a forged X-Forwarded-Proto.
  req.socket.encrypted = req.headers['x-forwarded-proto'] === 'https';

  handler(req, res);
});

const port = Number(process.env.PORT) || 8080;
const host = process.env.HOST || '0.0.0.0';
server.listen(port, host, () => {
  console.log(`[server] listening on http://${host}:${port}`);
});
