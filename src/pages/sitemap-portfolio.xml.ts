import type { APIRoute } from 'astro';
import { getPortfolio } from '../lib/portfolio-source';
import { originOf, urlset, xml } from '../lib/sitemap';

/**
 * The portfolio entries, the custom post type WordPress published at
 * wp-sitemap-posts-portfolio-1.xml. On demand, from the same rows as the
 * pages, so an entry added at /admin/work/ is listed at once. <lastmod> is
 * the row's updated_at, seeded with WordPress's own dates.
 */
export const prerender = false;

export const GET: APIRoute = async ({ site }) => {
  const { items } = await getPortfolio();
  return xml(
    urlset(
      originOf(site),
      items.map((item) => ({ path: `/portfolio/${item.slug}/`, lastmod: item.updatedAt })),
    ),
  );
};
