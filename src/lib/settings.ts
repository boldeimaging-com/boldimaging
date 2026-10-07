/**
 * The values the client edits at /admin/: the /ftp/ rep list and where
 * /contact/ enquiries go. See migrations/0003_admin_settings.sql.
 *
 * Reads never throw. If Postgres is unreachable (or the migration has not run
 * yet) the reps fall back to DEFAULT_REPS and the recipients to the
 * CONTACT_TO variable, which is exactly how the forms behaved before these
 * tables existed. Writes do throw: the admin page has to say when a save
 * did not happen.
 */
import { getPool, moveByPosition } from './db';

export interface Rep {
  id: number | null;
  name: string;
  email: string;
}

/** What was hardcoded before the admin existed, and the migration's seed. */
export const DEFAULT_REPS: Rep[] = [
  { id: null, name: 'Joe Husami', email: 'joe@boldeimaging.com' },
  { id: null, name: 'Tony Roy', email: 'tony.r@boldeimaging.com' },
  { id: null, name: 'Ed Pawluk', email: 'ed@boldeimaging.com' },
  { id: null, name: 'Mo Husami', email: 'mo@boldeimaging.com' },
  { id: null, name: 'Dan Lethbridge', email: 'dan@boldeimaging.com' },
  { id: null, name: 'Jarrod Hickey', email: 'jarrod@boldeimaging.com' },
  { id: null, name: 'Suzy Costa', email: 'suzy@boldeimaging.com' },
];

export const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;

const CONTACT_RECIPIENTS = 'contact_recipients';

const problem = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 300);

export async function getReps(): Promise<{ reps: Rep[]; source: 'database' | 'fallback'; error?: string }> {
  const db = getPool();
  if (!db) return { reps: DEFAULT_REPS, source: 'fallback', error: 'no DATABASE_URL' };
  try {
    const res = await db.query<{ id: string; name: string; email: string }>(
      'SELECT id, name, email FROM ftp_reps ORDER BY position, id',
    );
    // An empty table would leave /ftp/ with nothing to choose. The admin
    // refuses to remove the last rep, so this only happens if rows were
    // deleted by hand.
    if (!res.rows.length) return { reps: DEFAULT_REPS, source: 'fallback', error: 'ftp_reps is empty' };
    return {
      reps: res.rows.map((r) => ({ id: Number(r.id), name: r.name, email: r.email })),
      source: 'database',
    };
  } catch (e) {
    return { reps: DEFAULT_REPS, source: 'fallback', error: problem(e) };
  }
}

const fromEnv = () =>
  (process.env.CONTACT_TO ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/** Where /contact/ enquiries go, and who is CC'd on /ftp/ uploads. */
export async function getContactRecipients(): Promise<{
  recipients: string[];
  source: 'database' | 'variable' | 'none';
}> {
  const db = getPool();
  if (db) {
    try {
      const res = await db.query<{ value: unknown }>('SELECT value FROM site_settings WHERE key = $1', [
        CONTACT_RECIPIENTS,
      ]);
      const value = res.rows[0]?.value;
      if (Array.isArray(value)) {
        const list = value.filter((v): v is string => typeof v === 'string' && EMAIL_RE.test(v));
        if (list.length) return { recipients: list, source: 'database' };
      }
    } catch (e) {
      console.error('[settings] contact recipients:', problem(e));
    }
  }
  const env = fromEnv();
  return { recipients: env, source: env.length ? 'variable' : 'none' };
}

function requirePool() {
  const db = getPool();
  if (!db) throw new Error('DATABASE_URL is not set');
  return db;
}

export async function saveContactRecipients(list: string[]): Promise<void> {
  await requirePool().query(
    `INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2::jsonb, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [CONTACT_RECIPIENTS, JSON.stringify(list)],
  );
}

const isUniqueViolation = (e: unknown) => (e as { code?: string })?.code === '23505';

export async function addRep(name: string, email: string): Promise<void> {
  try {
    await requirePool().query(
      `INSERT INTO ftp_reps (name, email, position)
       SELECT $1, $2, COALESCE(MAX(position), 0) + 1 FROM ftp_reps`,
      [name, email],
    );
  } catch (e) {
    if (isUniqueViolation(e)) throw new Error(`${email} is already on the list.`);
    throw e;
  }
}

export async function updateRep(id: number, name: string, email: string): Promise<void> {
  try {
    const res = await requirePool().query(
      'UPDATE ftp_reps SET name = $2, email = $3, updated_at = now() WHERE id = $1',
      [id, name, email],
    );
    if (!res.rowCount) throw new Error('That rep no longer exists.');
  } catch (e) {
    if (isUniqueViolation(e)) throw new Error(`${email} is already on the list.`);
    throw e;
  }
}

export async function removeRep(id: number): Promise<void> {
  // getReps() still falls back to DEFAULT_REPS if the table somehow ends up
  // empty, so this guard is for the form's sake, not the only line of defence.
  const res = await requirePool().query(
    'DELETE FROM ftp_reps WHERE id = $1 AND (SELECT count(*) FROM ftp_reps) > 1',
    [id],
  );
  if (!res.rowCount) {
    throw new Error('That rep could not be removed. The list needs at least one rep, so the last one cannot go.');
  }
}

/** Swap a rep with its neighbour above (-1) or below (+1). */
export const moveRep = (id: number, dir: -1 | 1) => moveByPosition('ftp_reps', id, dir);
