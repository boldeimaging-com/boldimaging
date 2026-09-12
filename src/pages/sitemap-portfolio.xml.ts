import type { APIRoute } from 'astro';
import { PORTFOLIO } from '../data/portfolio';
import { originOf, urlset, xml } from '../lib/sitemap';

/**
 * The twelve portfolio entries, the custom post type WordPress published at
 * wp-sitemap-posts-portfolio-1.xml. PORTFOLIO is already in sitemap order, so
 * adding an entry to that file adds it here with nothing else to remember.
 */
export const prerender = true;

export const GET: APIRoute = ({ site }) =>
  xml(
    urlset(
      originOf(site),
      PORTFOLIO.map((item) => ({ path: `/portfolio/${item.slug}/` })),
    ),
  );
