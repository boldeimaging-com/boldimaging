import type { APIRoute } from 'astro';
// Worker bindings and secrets. `Astro.locals.runtime.env` was removed in
// Astro 6; this is the supported way to read them.
import { env } from 'cloudflare:workers';

/**
 * POST /api/ftp — the /ftp/ production-file upload form.
 *
 * The original stores uploads in the WordPress media library and emails the
 * chosen rep. Here the files go to an R2 bucket bound as UPLOADS and the rep
 * gets a notification with the object keys.
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

const json = (status: number, message: string) =>
  new Response(JSON.stringify({ message }), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
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

  if (!bindings.UPLOADS || !bindings.RESEND_API_KEY) {
    return json(
      503,
      'File upload is not connected yet. Please email your files to info@boldeimaging.com or call (416) 241 2800.'
    );
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const prefix = `${stamp}/${safeName(task)}`;
  const keys: string[] = [];

  for (const file of files) {
    const key = `${prefix}/${safeName(file.name)}`;
    await bindings.UPLOADS.put(key, await file.arrayBuffer());
    keys.push(key);
  }

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
    return json(
      502,
      'Your files were received but the notification failed to send. Please let us know at info@boldeimaging.com.'
    );
  }

  return json(200, 'Thanks — your files have been sent to your rep.');
};
