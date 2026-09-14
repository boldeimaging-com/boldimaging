/**
 * Recording form submissions in D1.
 *
 * The rule both handlers follow: **write the row before attempting delivery.**
 * Email is the notification, the row is the record. A Resend outage or an unset
 * API key then costs a notification rather than the enquiry itself, which is
 * what used to happen.
 *
 * The second rule: **a database failure must never cost a submission either.**
 * Every function here swallows its own errors and reports them, so a handler
 * can still store files, send mail and answer 200 when D1 is unreachable. That
 * is the right trade for a contact form -- refusing a customer's enquiry
 * because our logging is down would be a worse outage than the one we are
 * logging. The failure is surfaced in the response headers instead, so it is
 * visible without being fatal.
 */
// D1Database and friends are global, from the committed worker-configuration.d.ts
// that `wrangler types` generates -- @cloudflare/workers-types is not a
// dependency of this project and importing from it would not resolve.

export type Delivery = 'pending' | 'sent' | 'failed' | 'unconfigured';

/** Rows we could not write, reported on the response rather than thrown. */
export interface RecordResult {
  id: number | null;
  error: string | null;
}

const problem = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 500);

/**
 * Coarse request context for spam triage. Deliberately not the IP address --
 * personal data we have no need for; see the migration for the reasoning.
 */
export function requestContext(request: Request): { country: string | null; userAgent: string | null } {
  return {
    country: request.headers.get('cf-ipcountry'),
    userAgent: request.headers.get('user-agent')?.slice(0, 500) ?? null,
  };
}

export async function recordContact(
  db: D1Database | undefined,
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
  if (!db) return { id: null, error: 'no D1 binding' };
  try {
    const res = await db
      .prepare(
        `INSERT INTO contact_submissions
           (name, last_name, email, website, message,
            attachment_name, attachment_bytes, country, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         RETURNING id`,
      )
      .bind(
        row.name,
        row.lastName || null,
        row.email || null,
        row.website || null,
        row.message || null,
        row.attachmentName,
        row.attachmentBytes,
        row.country,
        row.userAgent,
      )
      .first<{ id: number }>();
    return { id: res?.id ?? null, error: null };
  } catch (e) {
    return { id: null, error: problem(e) };
  }
}

/**
 * Opens an upload batch. Written before a single byte goes to R2, so an upload
 * that dies mid-way still leaves evidence that somebody tried to send files.
 */
export async function openUpload(
  db: D1Database | undefined,
  row: {
    fullName: string;
    email: string;
    task: string;
    rep: string;
    message: string;
    fileCount: number;
    totalBytes: number;
    r2Prefix: string;
    country: string | null;
    userAgent: string | null;
  },
): Promise<RecordResult> {
  if (!db) return { id: null, error: 'no D1 binding' };
  try {
    const res = await db
      .prepare(
        `INSERT INTO ftp_uploads
           (full_name, email, task, rep, message,
            file_count, total_bytes, r2_prefix, country, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         RETURNING id`,
      )
      .bind(
        row.fullName,
        row.email,
        row.task,
        row.rep,
        row.message || null,
        row.fileCount,
        row.totalBytes,
        row.r2Prefix,
        row.country,
        row.userAgent,
      )
      .first<{ id: number }>();
    return { id: res?.id ?? null, error: null };
  } catch (e) {
    return { id: null, error: problem(e) };
  }
}

/** One row per file, written as each object actually lands in R2. */
export async function recordUploadFiles(
  db: D1Database | undefined,
  uploadId: number | null,
  files: Array<{ key: string; name: string; bytes: number; type: string | null }>,
): Promise<string | null> {
  if (!db || uploadId === null || !files.length) return null;
  try {
    const stmt = db.prepare(
      `INSERT INTO ftp_upload_files (upload_id, object_key, original_name, bytes, content_type)
       VALUES (?, ?, ?, ?, ?)`,
    );
    await db.batch(files.map((f) => stmt.bind(uploadId, f.key, f.name, f.bytes, f.type)));
    return null;
  } catch (e) {
    return problem(e);
  }
}

export async function setUploadStatus(
  db: D1Database | undefined,
  uploadId: number | null,
  status: 'stored' | 'failed',
  error?: string,
): Promise<void> {
  if (!db || uploadId === null) return;
  try {
    await db
      .prepare(`UPDATE ftp_uploads SET upload_status = ?, upload_error = ? WHERE id = ?`)
      .bind(status, error?.slice(0, 500) ?? null, uploadId)
      .run();
  } catch {
    // Deliberately ignored: the row already exists and the caller is mid-flight
    // serving a visitor. A lost status update is a reporting gap, not a lost
    // submission, and is visible as a row still sitting at 'receiving'.
  }
}

export async function setDelivery(
  db: D1Database | undefined,
  table: 'contact_submissions' | 'ftp_uploads',
  id: number | null,
  status: Delivery,
  opts: { error?: string; resendId?: string } = {},
): Promise<void> {
  if (!db || id === null) return;
  try {
    await db
      .prepare(
        `UPDATE ${table} SET delivery_status = ?, delivery_error = ?, resend_id = ? WHERE id = ?`,
      )
      .bind(status, opts.error?.slice(0, 500) ?? null, opts.resendId ?? null, id)
      .run();
  } catch {
    // Same reasoning as setUploadStatus: never fail a visitor's request over a
    // bookkeeping write. A row stuck at 'pending' is the visible symptom.
  }
}
