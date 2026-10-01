/**
 * Indexing policy derived from the configured site origin (astro.config.mjs
 * `site`, i.e. SITE_URL). Only the production hostname is indexable; any other
 * origin (the *.workers.dev preview, localhost) is a preview build:
 * HTML noindex, no canonical/og:url, and no sitemap advertised in robots.txt.
 */
const PRODUCTION_HOSTS = new Set(['boldeimaging.com', 'www.boldeimaging.com']);

export function isProductionSite(site: URL | undefined): boolean {
  return !!site && PRODUCTION_HOSTS.has(site.hostname);
}
