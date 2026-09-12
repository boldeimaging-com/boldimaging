import type { APIRoute } from 'astro';
import { CLIENTS, ASSOCIATIONS, PROJECT_GALLERIES } from '../data/home';
import { GALLERY_ITEMS } from '../data/gallery';
import { PORTFOLIO } from '../data/portfolio';
import { originOf, urlset, xml, type UrlEntry } from '../lib/sitemap';

/**
 * Image sitemap: every image on the site, listed against the page it appears
 * on. WordPress core never emitted one of these; it is added because the work
 * IS the product for a signage company, so image search is a real channel.
 *
 * Built from the same data modules the pages render from, so an image added to
 * a page is in the sitemap automatically -- and it resolves through the same
 * MEDIA_BASE, so it follows the images to img.boldeimaging.com when the
 * Backblaze bucket goes live, with nothing here to edit.
 *
 * Only <image:loc> is emitted. Google deprecated <image:caption>, <image:title>
 * and <image:license> in 2022 and ignores them; alt text on the page itself is
 * what carries the description now.
 *
 * The gallery lists `full`, not `thumb` -- the full-size file is what the
 * lightbox opens and what should rank, not the 300px derivative.
 *
 * Limits are 1,000 images per page entry and 50,000 URLs per sitemap. The
 * biggest entry here is /gallery/ at 232, so there is a lot of headroom.
 */
export const prerender = true;

const ENTRIES: UrlEntry[] = [
  {
    path: '/',
    images: [
      ...CLIENTS.map((i) => i.src),
      ...ASSOCIATIONS.map((i) => i.src),
      ...PROJECT_GALLERIES.map((i) => i.src),
    ],
  },
  { path: '/services/', images: PORTFOLIO.map((i) => i.grid) },
  { path: '/gallery/', images: GALLERY_ITEMS.map((i) => i.full) },
  ...PORTFOLIO.map((item) => ({
    path: `/portfolio/${item.slug}/`,
    images: [item.image],
  })),
];

export const GET: APIRoute = ({ site }) => {
  // De-duplicate within each page: the same file can legitimately appear twice
  // in a page's data (a portfolio grid image reused as its own hero), and a
  // repeated <image:loc> under one <url> is invalid.
  const deduped = ENTRIES.map(({ path, images }) => ({
    path,
    images: [...new Set(images ?? [])],
  }));
  return xml(urlset(originOf(site), deduped));
};
