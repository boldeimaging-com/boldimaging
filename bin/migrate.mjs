#!/usr/bin/env node
/**
 * Apply migrations/*.sql to Postgres, in filename order, each exactly once.
 *
 * Run by Railway as the service's Pre-Deploy Command (Settings -> Deploy:
 * `npm run db:migrate`), which executes
 * after the build with the service's variables and the private network, so
 * DATABASE_URL resolves. A failure exits non-zero, and Railway then refuses
 * to roll out the new deployment -- the old one keeps serving.
 *
 * Each file runs in its own transaction together with its schema_migrations
 * row, so a file is either fully applied and recorded, or not at all. An
 * advisory lock stops two deploys migrating at once.
 *
 *   npm run db:migrate              # uses DATABASE_URL
 */
import { readdirSync, readFileSync } from 'node:fs';
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('[migrate] DATABASE_URL is not set');
  process.exit(1);
}

const dir = new URL('../migrations/', import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

const client = new pg.Client({ connectionString: url });
await client.connect();

try {
  await client.query('SELECT pg_advisory_lock(727274)');
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name       TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
  const done = new Set(
    (await client.query('SELECT name FROM schema_migrations')).rows.map((r) => r.name),
  );

  for (const file of files) {
    if (done.has(file)) {
      console.log(`[migrate] ${file} already applied`);
      continue;
    }
    const sql = readFileSync(new URL(file, dir), 'utf8');
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`[migrate] ${file} applied`);
    } catch (e) {
      await client.query('ROLLBACK');
      throw new Error(`${file}: ${e.message}`);
    }
  }
} catch (e) {
  console.error(`[migrate] FAILED — ${e.message}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
