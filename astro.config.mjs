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
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
