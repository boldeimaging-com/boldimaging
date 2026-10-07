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

/**
 * Swap a row with its neighbour above (-1) or below (+1) in a table ordered
 * by an explicit `position` column, renumbering the whole list 1..n so gaps
 * and ties repair themselves. Throws, for the admin to report.
 */
export async function moveByPosition(table: 'ftp_reps' | 'portfolio_items', id: number, dir: -1 | 1) {
  const db = getPool();
  if (!db) throw new Error('DATABASE_URL is not set');
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const rows = (
      await client.query<{ id: string }>(`SELECT id FROM ${table} ORDER BY position, id FOR UPDATE`)
    ).rows.map((r) => Number(r.id));
    const i = rows.indexOf(id);
    const j = i + dir;
    if (i >= 0 && j >= 0 && j < rows.length) {
      [rows[i], rows[j]] = [rows[j], rows[i]];
      await client.query(
        `UPDATE ${table} AS r SET position = v.pos
         FROM unnest($1::bigint[]) WITH ORDINALITY AS v(id, pos) WHERE r.id = v.id`,
        [rows],
      );
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}
