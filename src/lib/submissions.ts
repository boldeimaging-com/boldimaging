/**
 * Recording form submissions in Postgres.
 *
 * The rule both handlers follow: **write the row before attempting delivery.**
 * Email is the notification, the row is the record. A Resend outage or an unset
 * API key then costs a notification rather than the enquiry itself, which is
 * what used to happen.
 *
 * The second rule: **a database failure must never cost a submission either.**
 * Every function here swallows its own errors and reports them, so a handler
 * can still store files, send mail and answer 200 when Postgres is unreachable. That
 * is the right trade for a contact form -- refusing a customer's enquiry
 * because our logging is down would be a worse outage than the one we are
 * logging. The failure is surfaced in the response headers instead, so it is
 * visible without being fatal.
 */
import { getPool } from './db';

export type Delivery = 'pending' | 'sent' | 'failed' | 'unconfigured';

/** Rows we could not write, reported on the response rather than thrown. */
export interface RecordResult {
  id: number | null;
  error: string | null;
}

/** bigint identity columns come back from pg as strings; the ids stay small. */
const toId = (v: string | undefined) => (v === undefined ? null : Number(v));

const problem = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 500);

/**
 * Coarse request context for spam triage. Deliberately not the IP address --
 * personal data we have no need for; see the migration for the reasoning.
 *
 * `cf-ipcountry` was set by Cloudflare's edge. Railway sets no equivalent, so
 * country is null there unless the site is put behind Cloudflare's proxy again.
 */
export function requestContext(request: Request): { country: string | null; userAgent: string | null } {
  return {
    country: request.headers.get('cf-ipcountry'),
    userAgent: request.headers.get('user-agent')?.slice(0, 500) ?? null,
  };
}

export async function recordContact(
  row: {
    name: string;
    lastName: string;
    email: string;
    website: string;
    message: string;
    attachmentName: string | null;
    attachmentBytes: number | null;
    country: string | null;
    userAgent: string | null;
  },
): Promise<RecordResult> {
  const db = getPool();
  if (!db) return { id: null, error: 'no DATABASE_URL' };
  try {
    const res = await db.query<{ id: string }>(
      `INSERT INTO contact_submissions
         (name, last_name, email, website, message,
          attachment_name, attachment_bytes, country, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        row.name,
        row.lastName || null,
        row.email || null,
        row.website || null,
        row.message || null,
        row.attachmentName,
        row.attachmentBytes,
        row.country,
        row.userAgent,
      ],
    );
    return { id: toId(res.rows[0]?.id), error: null };
  } catch (e) {
    return { id: null, error: problem(e) };
  }
}

/**
 * Opens an upload batch. Written before a single byte goes to the bucket, so
 * an upload that dies mid-way still leaves evidence that somebody tried to
 * send files.
 */
export async function openUpload(
  row: {
    fullName: string;
    email: string;
    task: string;
    rep: string;
    message: string;
    fileCount: number;
    totalBytes: number;
    storagePrefix: string;
    country: string | null;
    userAgent: string | null;
  },
): Promise<RecordResult> {
  const db = getPool();
  if (!db) return { id: null, error: 'no DATABASE_URL' };
  try {
    const res = await db.query<{ id: string }>(
      `INSERT INTO ftp_uploads
         (full_name, email, task, rep, message,
          file_count, total_bytes, storage_prefix, country, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        row.fullName,
        row.email,
        row.task,
        row.rep,
        row.message || null,
        row.fileCount,
        row.totalBytes,
        row.storagePrefix,
        row.country,
        row.userAgent,
      ],
    );
    return { id: toId(res.rows[0]?.id), error: null };
  } catch (e) {
    return { id: null, error: problem(e) };
  }
}

/** One row per file, written as each object actually lands in the bucket. */
export async function recordUploadFiles(
  uploadId: number | null,
  files: Array<{ key: string; name: string; bytes: number; type: string | null }>,
): Promise<string | null> {
  const db = getPool();
  if (!db || uploadId === null || !files.length) return null;
  try {
    // One statement, so the batch lands all-or-nothing like D1's batch() did.
    const values: unknown[] = [];
    const tuples = files.map((f, i) => {
      values.push(uploadId, f.key, f.name, f.bytes, f.type);
      const b = i * 5;
      return `($${b + 1}, $${b + 2}, $${b + 3}, $${b + 4}, $${b + 5})`;
    });
    await db.query(
      `INSERT INTO ftp_upload_files (upload_id, object_key, original_name, bytes, content_type)
       VALUES ${tuples.join(', ')}`,
      values,
    );
    return null;
  } catch (e) {
    return problem(e);
  }
}

export async function setUploadStatus(
  uploadId: number | null,
  status: 'stored' | 'failed',
  error?: string,
): Promise<void> {
  const db = getPool();
  if (!db || uploadId === null) return;
  try {
    await db.query(`UPDATE ftp_uploads SET upload_status = $1, upload_error = $2 WHERE id = $3`, [
      status,
      error?.slice(0, 500) ?? null,
      uploadId,
    ]);
  } catch {
    // Deliberately ignored: the row already exists and the caller is mid-flight
    // serving a visitor. A lost status update is a reporting gap, not a lost
    // submission, and is visible as a row still sitting at 'receiving'.
  }
}

export async function setDelivery(
  table: 'contact_submissions' | 'ftp_uploads',
  id: number | null,
  status: Delivery,
  opts: { error?: string; resendId?: string } = {},
): Promise<void> {
  const db = getPool();
  if (!db || id === null) return;
  try {
    await db.query(
      `UPDATE ${table} SET delivery_status = $1, delivery_error = $2, resend_id = $3 WHERE id = $4`,
      [status, opts.error?.slice(0, 500) ?? null, opts.resendId ?? null, id],
    );
  } catch {
    // Same reasoning as setUploadStatus: never fail a visitor's request over a
    // bookkeeping write. A row stuck at 'pending' is the visible symptom.
  }
}
