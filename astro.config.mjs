// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// The adapter is here for one reason only: the /api/* routes and /admin/ stay on
// demand. Every content page sets `prerender = true`, so the site is still
// served as static files out of ./dist/client.
//
// Hosted on Railway as a plain Node server. `standalone` mode builds the
// static + on-demand handler; server.mjs wraps it to add the response headers
// a static host would otherwise set (noindex off production, cache lifetimes).
/**
 * The site's own address. Everything derived from it moves together: the
 * canonical tags, og:url, and every <loc> in the sitemaps.
 *
 * *** AT CUTOVER, CHANGE THIS TO https://boldeimaging.com ***
 *
 * It points at the preview host today because that is where the site actually
 * lives. With the production domain here, the sitemap listed
 * boldeimaging.com addresses -- so opening the sitemap on the preview and
 * clicking anything took you to the OLD WordPress site, which made the sitemap
 * useless for reviewing the new one.
 *
 * The cost is that the preview no longer canonicalises to the production
 * domain. That is acceptable here and only here: the preview is kept out of
 * search by the X-Robots-Tag that server.mjs sets on every response from a
 * non-production host, plus an HTML noindex meta tag emitted in the page
 * itself, both stronger
 * than a canonical hint, and `npm run build` prints the origin it used so this
 * cannot drift unnoticed.
 *
 * Override per build without editing the file:  SITE_URL=... npm run build
 */
// Reached through globalThis so this file type-checks without Node's types.
/** @type {{ env?: Record<string, string | undefined> } | undefined} */
const nodeProcess = /** @type {any} */ (globalThis).process;

const SITE_URL =
  nodeProcess?.env?.SITE_URL || 'https://stage.boldeimaging.com';

console.log(`[site] building for ${SITE_URL}`);

export default defineConfig({
  site: SITE_URL,
  adapter: node({ mode: 'standalone' }),
  // 'ignore', not 'always'. Pages are still BUILT and LINKED with trailing
  // slashes (build.format 'directory' below, the canonical tags, the
  // sitemaps), and server.mjs 301s a slashless page address to its slashed
  // form, so the trailing-slash policy for pages is the same as on Workers.
  //
  // 'always' would also make Astro's own static handler 301 every slashless
  // request, POSTs included -- and a browser follows a 301 on a POST as a GET,
  // which would silently drop a form submission sent to /api/contact. Doing
  // the redirect in server.mjs keeps it to GET/HEAD on real page directories.
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
