import type { APIRoute } from 'astro';
import { PORTFOLIO } from '../data/portfolio';
import { SITE_URL } from '../../seo.config';

/**
 * Every address this site wants indexed, in the order the WordPress sitemap
 * listed them. The old site split this across /wp-sitemap.xml and three child
 * files; preserving those old addresses is a redirect job at the Cloudflare
 * edge, not this repo's.
 *
 * Two addresses the WordPress sitemap listed are deliberately NOT here:
 * /category/exterior/ and /category/interior/. Both render an empty archive
 * and are served `noindex, follow` -- see the note in
 * src/pages/category/[slug].astro. A sitemap must never list a noindexed
 * address; Search Console reports that pairing as an error. The pages
 * themselves still serve 200, so nothing that links to them breaks.
 *
 * No <lastmod>, <changefreq> or <priority>. There is no honest modification
 * date to give -- the content was scraped, not authored here -- and a lastmod
 * a crawler learns to distrust is worse than none. Google ignores changefreq
 * and priority outright.
 */
export const prerender = true;

export const PATHS = [
  '/',
  '/services/',
  '/ftp/',
  '/contact/',
  '/gallery/',
  ...PORTFOLIO.map((item) => `/portfolio/${item.slug}/`),
];

export const GET: APIRoute = () => {
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    PATHS.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n') +
    '\n</urlset>\n';

  return new Response(body, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
};
