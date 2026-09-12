import type { APIRoute } from 'astro';
import { originOf, urlset, xml } from '../lib/sitemap';

/**
 * The two category archives, matching wp-sitemap-taxonomies-category-1.xml.
 *
 * Neither carries a lastmod, and that is faithful rather than an omission:
 * WordPress leaves it off taxonomy sitemaps because a term has no modification
 * date of its own. See src/data/lastmod.ts.
 */
export const prerender = true;

const PATHS = ['/category/exterior/', '/category/interior/'];

export const GET: APIRoute = ({ site }) =>
  xml(urlset(originOf(site), PATHS.map((path) => ({ path }))));
