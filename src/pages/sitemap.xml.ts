import type { APIRoute } from 'astro';
import { PORTFOLIO } from '../data/portfolio';

/**
 * Every address this site serves, in the order the WordPress sitemap listed
 * them. The old site split this across /wp-sitemap.xml and three child files;
 * preserving those old addresses is a redirect job at the Cloudflare edge, not
 * this repo's.
 */
export const prerender = true;

const PATHS = [
  '/',
  '/services/',
  '/ftp/',
  '/contact/',
  '/gallery/',
  ...PORTFOLIO.map((item) => `/portfolio/${item.slug}/`),
  '/category/exterior/',
  '/category/interior/',
];

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://boldeimaging.com')).origin;
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    PATHS.map((p) => `  <url><loc>${origin}${p}</loc></url>`).join('\n') +
    '\n</urlset>\n';

  return new Response(body, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
};
