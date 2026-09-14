import type { APIRoute } from 'astro';
// Worker bindings and secrets. `Astro.locals.runtime.env` was removed in
// Astro 6; this is the supported way to read them.
import { env } from 'cloudflare:workers';
import {
  openUpload,
  recordUploadFiles,
  requestContext,
  setDelivery,
  setUploadStatus,
} from '../../lib/submissions';

/**
 * POST /api/ftp — the /ftp/ production-file upload form.
 *
 * The original stores uploads in the WordPress media library and emails the
 * chosen rep. Here the files go to an R2 bucket bound as UPLOADS and the rep
 * gets a notification with the object keys.
 *
 * A D1 row is opened BEFORE the first byte goes to R2 and one row per file is
 * written as each object actually lands, so a batch that dies halfway leaves a
 * truthful partial record rather than silence. `upload_status` and
 * `delivery_status` are tracked separately on purpose: files safe in R2 with
 * the rep never notified is recoverable, and has to look different from a
 * clean success.
 *
 * Both halves are wired at gate 11 of the migration. Until the bindings exist
 * this answers 503 with a message the form shows the visitor, rather than
 * accepting a 350 MB upload and dropping it.
 */
export const prerender = false;

interface Env {
  RESEND_API_KEY?: string;
  UPLOADS?: { put: (key: string, value: ReadableStream | ArrayBuffer) => Promise<unknown> };
  UPLOADS_PUBLIC_BASE?: string;
  DB?: D1Database;
  CONTACT_FROM?: string;
  CONTACT_TO?: string;
}

const MAX_TOTAL = 350 * 1024 * 1024; // "Maximum file size: 350 MB"
const MAX_FILES = 50;

const REPS = new Set([
  'joe@boldeimaging.com',
  'tony.r@boldeimaging.com',
  'ed@boldeimaging.com',
  'mo@boldeimaging.com',
  'dan@boldeimaging.com',
  'jarrod@boldeimaging.com',
  'suzy@boldeimaging.com',
]);

/** See the note in api/contact.ts: storage failures ride on a header. */
const json = (status: number, message: string, dbError?: string | null) =>
  new Response(JSON.stringify({ message }), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(dbError ? { 'x-record-error': dbError.slice(0, 200) } : {}),
    },
  });

function text(form: FormData, key: string, max = 5000): string {
  const v = form.get(key);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Keep uploaded names to a safe, predictable object key. */
const safeName = (name: string) =>
  name
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'file';

export const POST: APIRoute = async ({ request }) => {
  const bindings = env as unknown as Env;
  const db = bindings.DB;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, 'That upload could not be read.');
  }

  const fullName = text(form, 'full_name', 200);
  const email = text(form, 'your_email', 200);
  const task = text(form, 'your_task', 200);
  const rep = text(form, 'your_rep', 200);
  const message = text(form, 'your_message');

  if (!fullName) return json(422, 'Please enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(422, 'Please check the email address.');
  if (!task) return json(422, 'Please enter a task name.');
  if (!REPS.has(rep)) return json(422, 'Please choose your rep.');

  const files = form.getAll('your_files').filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return json(422, 'Please choose at least one file.');
  if (files.length > MAX_FILES) return json(422, `Please send at most ${MAX_FILES} files at a time.`);

  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > MAX_TOTAL) return json(413, 'That is over the 350 MB limit.');

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const prefix = `${stamp}/${safeName(task)}`;

  // Open the record before touching R2, so an upload that dies partway still
  // leaves evidence that somebody tried to send us files.
  const { country, userAgent } = requestContext(request);
  const record = await openUpload(db, {
    fullName,
    email,
    task,
    rep,
    message,
    fileCount: files.length,
    totalBytes: total,
    r2Prefix: prefix,
    country,
    userAgent,
  });

  if (!bindings.UPLOADS || !bindings.RESEND_API_KEY) {
    await setUploadStatus(db, record.id, 'failed', 'UPLOADS or RESEND_API_KEY binding missing');
    await setDelivery(db, 'ftp_uploads', record.id, 'unconfigured');
    return json(
      503,
      'File upload is not connected yet. Please email your files to info@boldeimaging.com or call (416) 241 2800.',
      record.error
    );
  }

  const keys: string[] = [];
  const stored: Array<{ key: string; name: string; bytes: number; type: string | null }> = [];

  for (const file of files) {
    const key = `${prefix}/${safeName(file.name)}`;
    try {
      await bindings.UPLOADS.put(key, await file.arrayBuffer());
    } catch (e) {
      // Record what did land before giving up, so the rep can be told which
      // files to ask for again rather than the whole batch.
      await recordUploadFiles(db, record.id, stored);
      await setUploadStatus(db, record.id, 'failed', e instanceof Error ? e.message : String(e));
      return json(
        502,
        'Some files could not be stored. Please try again or email info@boldeimaging.com.',
        record.error
      );
    }
    keys.push(key);
    stored.push({ key, name: file.name, bytes: file.size, type: file.type || null });
  }

  const filesError = await recordUploadFiles(db, record.id, stored);
  await setUploadStatus(db, record.id, 'stored');

  const base = bindings.UPLOADS_PUBLIC_BASE?.replace(/\/$/, '');
  const list = keys
    .map((k) => (base ? `<li><a href="${base}/${k}">${esc(k)}</a></li>` : `<li>${esc(k)}</li>`))
    .join('');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${bindings.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: bindings.CONTACT_FROM || 'BolDe Imaging <noreply@boldeimaging.com>',
      to: [rep],
      cc: bindings.CONTACT_TO ? bindings.CONTACT_TO.split(',').map((s) => s.trim()) : undefined,
      reply_to: email,
      subject: `File upload: ${task}`,
      html:
        `<p><strong>From:</strong> ${esc(fullName)} &lt;${esc(email)}&gt;</p>` +
        `<p><strong>Task:</strong> ${esc(task)}</p>` +
        (message ? `<p><strong>Message:</strong><br>${esc(message).replace(/\n/g, '<br>')}</p>` : '') +
        `<p><strong>Files (${files.length}, ${Math.round(total / 1024 / 1024)} MB):</strong></p><ul>${list}</ul>`,
    }),
  });

  if (!res.ok) {
    await setDelivery(db, 'ftp_uploads', record.id, 'failed', {
      error: `resend ${res.status}: ${(await res.text().catch(() => '')).slice(0, 300)}`,
    });
    return json(
      502,
      'Your files were received but the notification failed to send. Please let us know at info@boldeimaging.com.',
      record.error ?? filesError
    );
  }

  const resendId = await res
    .json<{ id?: string }>()
    .then((b) => b?.id)
    .catch(() => undefined);
  await setDelivery(db, 'ftp_uploads', record.id, 'sent', { resendId });

  return json(
    200,
    'Thanks — your files have been sent to your rep.',
    record.error ?? filesError
  );
};
