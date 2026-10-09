import type { APIRoute } from 'astro';
import { getUploadStore, LINK_TTL_SECONDS } from '../../lib/uploads';
import { getContactRecipients, getReps } from '../../lib/settings';
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
 * chosen rep. Here the files go to an S3-compatible bucket (see
 * src/lib/uploads.ts) and the rep gets a notification with a download link
 * per file.
 *
 * A Postgres row is opened BEFORE the first byte goes to the bucket and one
 * row per file is written as each object actually lands, so a batch that dies
 * halfway leaves a truthful partial record rather than silence.
 * `upload_status` and `delivery_status` are tracked separately on purpose:
 * files safe in the bucket with the rep never notified is recoverable, and
 * has to look different from a clean success.
 *
 * Both halves are wired at gate 11 of the migration. Until the variables exist
 * this answers 503 with a message the form shows the visitor, rather than
 * accepting a 350 MB upload and dropping it.
 */
export const prerender = false;

const MAX_TOTAL = 350 * 1024 * 1024; // "Maximum file size: 350 MB"
const MAX_FILES = 50;

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
  // Read per request from the server's environment, never import.meta.env,
  // which Vite would inline into the built bundle.
  const bindings = process.env;
  const store = getUploadStore();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, 'That upload could not be read.');
  }

  const fullName = text(form, 'full_name', 200);
  const email = text(form, 'your_email', 200);
  const task = text(form, 'your_task', 200);
  const rep = text(form, 'your_rep', 200).toLowerCase();
  const message = text(form, 'your_message');

  if (!fullName) return json(422, 'Please enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(422, 'Please check the email address.');
  if (!task) return json(422, 'Please enter a task name.');
  // The list the client edits at /admin/ (the built-in one if Postgres is down).
  const { reps } = await getReps();
  if (!reps.some((r) => r.email === rep)) return json(422, 'Please choose your rep.');

  const files = form.getAll('your_files').filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return json(422, 'Please choose at least one file.');
  if (files.length > MAX_FILES) return json(422, `Please send at most ${MAX_FILES} files at a time.`);

  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > MAX_TOTAL) return json(413, 'That is over the 350 MB limit.');

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const prefix = `${stamp}/${safeName(task)}`;

  // Open the record before touching the bucket, so an upload that dies partway still
  // leaves evidence that somebody tried to send us files.
  const { country, userAgent } = requestContext(request);
  const record = await openUpload({
    fullName,
    email,
    task,
    rep,
    message,
    fileCount: files.length,
    totalBytes: total,
    storagePrefix: prefix,
    country,
    userAgent,
  });

  if (!store || !bindings.RESEND_API_KEY) {
    await setUploadStatus(record.id, 'failed', 'UPLOADS_* or RESEND_API_KEY variable missing');
    await setDelivery('ftp_uploads', record.id, 'unconfigured');
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
      await store.put(key, await file.arrayBuffer(), file.type || null);
    } catch (e) {
      // Record what did land before giving up, so the rep can be told which
      // files to ask for again rather than the whole batch.
      await recordUploadFiles(record.id, stored);
      await setUploadStatus(record.id, 'failed', e instanceof Error ? e.message : String(e));
      return json(
        502,
        'Some files could not be stored. Please try again or email info@boldeimaging.com.',
        record.error
      );
    }
    keys.push(key);
    stored.push({ key, name: file.name, bytes: file.size, type: file.type || null });
  }

  const filesError = await recordUploadFiles(record.id, stored);
  await setUploadStatus(record.id, 'stored');

  // The bucket is private, so each file gets a presigned link. If signing
  // fails the key is still listed: the file is safe and findable in the
  // bucket, the rep just has to fetch it by hand.
  const items = await Promise.all(
    keys.map(async (k) => {
      const href = await store.signedGetUrl(k).catch(() => null);
      return href ? `<li><a href="${esc(href)}">${esc(k)}</a></li>` : `<li>${esc(k)}</li>`;
    }),
  );
  const list = items.join('');
  const linkDays = Math.round(LINK_TTL_SECONDS / 86400);

  const cc = (await getContactRecipients()).recipients;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${bindings.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: bindings.CONTACT_FROM || 'BolDe Imaging <noreply@boldeimaging.com>',
      to: [rep],
      cc: cc.length ? cc : undefined,
      reply_to: email,
      subject: `File upload: ${task}`,
      html:
        `<p><strong>From:</strong> ${esc(fullName)} &lt;${esc(email)}&gt;</p>` +
        `<p><strong>Task:</strong> ${esc(task)}</p>` +
        (message ? `<p><strong>Message:</strong><br>${esc(message).replace(/\n/g, '<br>')}</p>` : '') +
        `<p><strong>Files (${files.length}, ${Math.round(total / 1024 / 1024)} MB):</strong></p><ul>${list}</ul>` +
        `<p>Download links expire after ${linkDays} days.</p>`,
    }),
  });

  if (!res.ok) {
    await setDelivery('ftp_uploads', record.id, 'failed', {
      error: `resend ${res.status}: ${(await res.text().catch(() => '')).slice(0, 300)}`,
    });
    return json(
      502,
      'Your files were received but the notification failed to send. Please let us know at info@boldeimaging.com.',
      record.error ?? filesError
    );
  }

  const resendId = await res
    .json()
    .then((b) => (b as { id?: string } | null)?.id)
    .catch(() => undefined);
  await setDelivery('ftp_uploads', record.id, 'sent', { resendId });

  return json(
    200,
    'Thanks — your files have been sent to your rep.',
    record.error ?? filesError
  );
};
