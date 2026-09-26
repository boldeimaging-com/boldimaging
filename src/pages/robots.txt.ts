import type { APIRoute } from 'astro';
import { isProductionSite } from '../lib/site-mode';

/**
 * Generated so the sitemap line follows the build's configured origin.
 * No Disallow on either: crawlers must be able to fetch pages to see the HTML
 * noindex (preview) and the edge X-Robots-Tag. Production advertises the
 * sitemap index; preview advertises none.
 *
 * The original WordPress `Crawl-delay: 30` stays dropped on purpose: Google
 * ignores it and Bing's honouring of it would slow post-migration discovery.
 */
export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const prod = isProductionSite(site);
  const lines = ['User-agent: *', 'Allow: /', ''];
  if (prod) lines.push(`Sitemap: ${new URL('/sitemap.xml', site).href}`);
  else lines.push('# Preview build: no sitemap advertised; pages are noindex.');
  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
