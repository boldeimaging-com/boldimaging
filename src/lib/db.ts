/**
 * The Postgres connection, shared by the on-demand routes.
 *
 * DATABASE_URL is Railway's reference to the Postgres service
 * (`${{Postgres.DATABASE_URL}}`), which resolves over the private network at
 * runtime. It is read from process.env when a request arrives, never from
 * import.meta.env, so the value is not inlined into the built bundle.
 *
 * One pool per process, created on first use. A missing DATABASE_URL is not
 * fatal: callers get `null` and record that as the reason the row was not
 * written, which is the same contract the D1 binding had.
 */
import pg from 'pg';

let pool: pg.Pool | null | undefined;

export function getPool(): pg.Pool | null {
  if (pool !== undefined) return pool;
  const url = process.env.DATABASE_URL;
  if (!url) return (pool = null);
  pool = new pg.Pool({ connectionString: url, max: 5 });
  // An idle client dropping (a Postgres restart, a network blip) emits on the
  // pool; unhandled, that would crash the whole server.
  pool.on('error', (e) => console.error('[db] idle client error:', e.message));
  return pool;
}
