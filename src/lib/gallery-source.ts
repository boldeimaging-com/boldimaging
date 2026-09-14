/**
 * Where the /gallery/ page gets its content.
 *
 * D1 is the source of truth; `src/data/gallery.ts` is the seed it was loaded
 * from and the fallback when the database cannot be reached. The rows are
 * fetched by `bin/fetch-gallery.mjs` BEFORE the Astro build (see the `build`
 * script) into `src/data/gallery.d1.json`, and this module simply prefers that
 * file when it exists.
 *
 * The page therefore stays prerendered like every other page: editing the
 * database changes the site on the next build, not on every request.
 *
 * **No credentials appear in this file, deliberately.** Page rendering happens
 * inside workerd, where `process.env` is empty, so the only token reachable
 * from here would be `import.meta.env` -- and Vite inlines those values into
 * the emitted server bundle, which is deployed to the Worker. Querying D1 from
 * a page would have shipped a Cloudflare API token to production. The prebuild
 * script reads it in plain Node instead, and nothing secret reaches the bundle.
 *
 * import.meta.glob is used rather than a plain import because the JSON is
 * generated and often absent: a bare `import` of a missing file fails the
 * build, while glob resolves to an empty object.
 */
import { GALLERY_FILTERS, GALLERY_ITEMS, type GalleryItem } from '../data/gallery';

const generated = import.meta.glob<{ filters: string[]; items: GalleryItem[] }>(
  '../data/gallery.d1.json',
  { eager: true, import: 'default' },
);

export interface Gallery {
  filters: string[];
  items: GalleryItem[];
  source: 'd1' | 'module';
}

export function loadGallery(): Gallery {
  const fromD1 = Object.values(generated)[0];
  if (fromD1?.filters?.length && fromD1?.items?.length) {
    return { filters: fromD1.filters, items: fromD1.items, source: 'd1' };
  }
  return { filters: GALLERY_FILTERS, items: GALLERY_ITEMS, source: 'module' };
}
