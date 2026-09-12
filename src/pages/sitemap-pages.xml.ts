import type { APIRoute } from 'astro';
import { originOf, urlset, xml } from '../lib/sitemap';

/**
 * The five standalone pages, in the order wp-sitemap-posts-page-1.xml listed
 * them. /gallery/ is here rather than in the image sitemap because it is a
 * page in its own right; its 232 images are listed there as well.
 */
export const prerender = true;

const PATHS = ['/', '/services/', '/ftp/', '/contact/', '/gallery/'];

export const GET: APIRoute = ({ site }) =>
  xml(urlset(originOf(site), PATHS.map((path) => ({ path }))));
