import type { APIRoute } from 'astro';
import { originOf, sitemapIndex, xml } from '../lib/sitemap';

/**
 * The sitemap index -- the one address robots.txt advertises.
 *
 * The children mirror how WordPress split this site, so the shape Google has
 * already crawled for years survives the migration:
 *
 *   wp-sitemap-posts-page-1.xml        -> sitemap-pages.xml
 *   wp-sitemap-posts-portfolio-1.xml   -> sitemap-portfolio.xml
 *   wp-sitemap-taxonomies-category-1.xml -> sitemap-categories.xml
 *
 * sitemap-images.xml has no WordPress counterpart: core never emitted one.
 * It is added because this is a signage portfolio, where the work itself is
 * the product and image search is a real channel.
 *
 * The old /wp-sitemap*.xml addresses are deliberately NOT served here. Keeping
 * old addresses alive is a redirect job at the Cloudflare edge, covering every
 * old address at once, not something to reimplement piecemeal in the app.
 */
export const prerender = true;

export const GET: APIRoute = ({ site }) =>
  xml(
    sitemapIndex(originOf(site), [
      '/sitemap-pages.xml',
      '/sitemap-portfolio.xml',
      '/sitemap-categories.xml',
      '/sitemap-images.xml',
    ]),
  );
