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
export default defineConfig({
  site: 'https://boldeimaging.com',
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
