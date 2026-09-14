// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// The adapter is here for one reason only: the two /api/* form routes stay on
// demand. Every content page sets `prerender = true`, so the site is still
// served as static files out of ./dist/client.
//
// `session: false` and `imageService: 'passthrough'` keep the adapter from
// injecting a SESSION KV namespace and an IMAGES binding into the deploy
// config -- this site uses neither, and an unresolved KV binding fails the
// deploy.
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
 * search by an X-Robots-Tag header at the Cloudflare edge, which is stronger
 * than a canonical hint, and `npm run build` prints the origin it used so this
 * cannot drift unnoticed.
 *
 * Override per build without editing the file:  SITE_URL=... npm run build
 */
const SITE_URL =
  globalThis.process?.env?.SITE_URL || 'https://boldeimaging.10xid.com';

console.log(`[site] building for ${SITE_URL}`);

export default defineConfig({
  site: SITE_URL,
  adapter: cloudflare({ imageService: 'passthrough' }),
  session: false,
  // 'ignore', not 'always'. Pages are still BUILT and LINKED with trailing
  // slashes -- build.format 'directory' below, the canonical tags, the sitemaps
  // and the Worker's html_handling: auto-trailing-slash are all unchanged, so
  // the trailing-slash policy for pages is exactly as before.
  //
  // What 'always' additionally did was refuse to MATCH any request without a
  // trailing slash, which silently 404s the on-demand /img/[...path] route:
  // /img/2021/05/adi.png is a file URL and cannot carry one. The page rules are
  // a canonicalisation concern; this is a routing one, and only the latter
  // needs relaxing.
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
