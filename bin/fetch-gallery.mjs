#!/usr/bin/env node
/**
 * Pull the /gallery/ content out of Postgres before the Astro build runs.
 *
 * A separate Node step, not a query inside a .astro page, so the page stays
 * prerendered and the connection string never goes near the bundle.
 *
 * It needs Postgres's PUBLIC address. Railway's private network does not
 * exist during the build, so DATABASE_URL (postgres.railway.internal) cannot
 * be reached from here; set GALLERY_DATABASE_URL to
 * `${{Postgres.DATABASE_PUBLIC_URL}}` on the service instead.
 *
 * Writes src/data/gallery.db.json on success and leaves it absent otherwise.
 * The page falls back to the committed src/data/gallery.ts, so a build with no
 * database -- a fresh clone, or the very first deploy, which builds before the
 * pre-deploy migration has created the tables -- still works.
 *
 * Not fatal by design: a database blip should not break a deploy of a site
 * whose gallery changes twice a year.
 */
import { writeFileSync, unlinkSync, existsSync } from 'node:fs';
import pg from 'pg';

const OUT = new URL('../src/data/gallery.db.json', import.meta.url);
const url = process.env.GALLERY_DATABASE_URL || process.env.DATABASE_PUBLIC_URL;

function giveUp(why) {
  console.log(`[gallery] ${why}; the build will use src/data/gallery.ts`);
  // Remove any stale copy, so a failed refresh never leaves yesterday's rows
  // silently in place looking like a successful read.
  if (existsSync(OUT)) unlinkSync(OUT);
  process.exit(0);
}

if (!url) giveUp('no GALLERY_DATABASE_URL');

const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 10_000 });
try {
  await client.connect();
  const filters = (await client.query('SELECT name FROM gallery_filters ORDER BY position')).rows;
  const items = (
    await client.query(
      'SELECT filter_id AS tag, thumb, "full", title, w, h FROM gallery_items ORDER BY position',
    )
  ).rows;
  await client.end();
  if (!filters.length || !items.length) giveUp('database returned no rows (migration not applied?)');

  writeFileSync(
    OUT,
    JSON.stringify({ filters: filters.map((f) => f.name), items }, null, 2) + '\n',
  );
  console.log(`[gallery] read ${items.length} items and ${filters.length} filters from Postgres`);
} catch (e) {
  await client.end().catch(() => {});
  giveUp(`database unavailable (${e.message})`);
}
