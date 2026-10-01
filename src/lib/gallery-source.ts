/**
 * Where the /gallery/ page gets its content.
 *
 * Postgres is the source of truth; `src/data/gallery.ts` is the seed it was
 * loaded from and the fallback when the database cannot be reached. The rows
 * are fetched by `bin/fetch-gallery.mjs` BEFORE the Astro build (see the
 * `build` script) into `src/data/gallery.db.json`, and this module simply
 * prefers that file when it exists.
 *
 * The page therefore stays prerendered like every other page: editing the
 * database changes the site on the next build, not on every request.
 *
 * **No credentials appear in this file, deliberately.** The only way a page
 * could read a connection string at build time is `import.meta.env`, and Vite
 * inlines those values into the emitted server bundle. The prebuild script
 * reads it in plain Node instead, and nothing secret reaches the bundle.
 *
 * import.meta.glob is used rather than a plain import because the JSON is
 * generated and often absent: a bare `import` of a missing file fails the
 * build, while glob resolves to an empty object.
 */
import { GALLERY_FILTERS, GALLERY_ITEMS, type GalleryItem } from '../data/gallery';

const generated = import.meta.glob<{ filters: string[]; items: GalleryItem[] }>(
  '../data/gallery.db.json',
  { eager: true, import: 'default' },
);

export interface Gallery {
  filters: string[];
  items: GalleryItem[];
  source: 'database' | 'module';
}

export function loadGallery(): Gallery {
  const fromDb = Object.values(generated)[0];
  if (fromDb?.filters?.length && fromDb?.items?.length) {
    return { filters: fromDb.filters, items: fromDb.items, source: 'database' };
  }
  return { filters: GALLERY_FILTERS, items: GALLERY_ITEMS, source: 'module' };
}
