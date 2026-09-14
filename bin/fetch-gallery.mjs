#!/usr/bin/env node
/**
 * Pull the /gallery/ content out of D1 before the Astro build runs.
 *
 * This is a separate Node step, not a query inside a .astro page, for one
 * reason: credentials must never enter the bundle. Page rendering happens
 * inside workerd, where `process.env` is empty, so the only token visible from
 * there is `import.meta.env` -- and Vite INLINES those values into the emitted
 * server code, which is then deployed to the Worker. Reading the token here, in
 * plain Node, keeps it out of dist entirely.
 *
 * Writes src/data/gallery.d1.json on success and leaves it absent otherwise.
 * The page falls back to the committed src/data/gallery.ts, so a build with no
 * credentials -- a fresh clone, or CI before the token is set -- still works.
 *
 * Not fatal by design: a database blip should not break a deploy of a site
 * whose gallery changes twice a year.
 */
import { writeFileSync, unlinkSync, existsSync } from 'node:fs';

const ACCOUNT_ID = '47a82355b575e264047206a36c2cd05c';
const DATABASE_ID = 'ebc4c786-bf6b-4b66-ba8b-4bf2a7c5ff7a';
const OUT = new URL('../src/data/gallery.d1.json', import.meta.url);

const token = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN;

async function query(sql) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ sql }),
    },
  );
  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(`${res.status} ${JSON.stringify(body.errors).slice(0, 200)}`);
  }
  return body.result?.[0]?.results ?? [];
}

function giveUp(why) {
  console.log(`[gallery] ${why}; the build will use src/data/gallery.ts`);
  // Remove any stale copy, so a failed refresh never leaves yesterday's rows
  // silently in place looking like a successful read.
  if (existsSync(OUT)) unlinkSync(OUT);
  process.exit(0);
}

if (!token) giveUp('no CLOUDFLARE_API_TOKEN');

try {
  const filters = await query('SELECT name FROM gallery_filters ORDER BY position');
  const items = await query(
    'SELECT filter_id AS tag, thumb, full, title, w, h FROM gallery_items ORDER BY position',
  );
  if (!filters.length || !items.length) giveUp('D1 returned no rows (migration not applied?)');

  writeFileSync(
    OUT,
    JSON.stringify({ filters: filters.map((f) => f.name), items }, null, 2) + '\n',
  );
  console.log(`[gallery] read ${items.length} items and ${filters.length} filters from D1`);
} catch (e) {
  giveUp(`D1 unavailable (${e.message})`);
}
