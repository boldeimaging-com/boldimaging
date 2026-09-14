import type { APIRoute } from 'astro';
// Worker bindings and secrets. `Astro.locals.runtime.env` was removed in
// Astro 6; this is the supported way to read them.
import { env } from 'cloudflare:workers';
import { recordContact, requestContext, setDelivery } from '../../lib/submissions';

/**
 * POST /api/contact — the /contact/ form.
 *
 * This is the only on-demand route on the site (every page is prerendered);
 * it is the reason the Cloudflare adapter is in astro.config.mjs at all.
 *
 * Every submission is written to D1 BEFORE delivery is attempted, so the
 * enquiry survives a Resend outage or an unset key -- the email is the
 * notification, the row is the record. A D1 failure is reported on the
 * response headers but never fails the request: refusing a customer's enquiry
 * because our logging is down would be the worse outage.
 *
 * Delivery is wired at gate 11 of the migration. Until RESEND_API_KEY and
 * CONTACT_TO are set as Worker secrets, this answers 503 with a message the
 * form shows the visitor -- but the row is already saved by then, so nothing
 * is lost while that is outstanding.
 */
export const prerender = false;

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  DB?: D1Database;
}

/**
 * `dbError` rides on a header rather than in the body: the visitor should never
 * read about our storage layer, but the failure must be visible to anyone
 * looking at the response.
 */
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

export const POST: APIRoute = async ({ request }) => {
  const secrets = env as unknown as Env;
  const db = secrets.DB;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, 'That submission could not be read.');
  }

  const name = text(form, 'name', 200);
  const email = text(form, 'email', 200);
  const confirm = text(form, 'confirm_email', 200);
  const message = text(form, 'message');

  if (!name) return json(422, 'Please enter your first name.');
  if (email && confirm && email !== confirm) {
    return json(422, 'The two email addresses do not match.');
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(422, 'Please check the email address.');
  }

  const fields: Array<[string, string]> = [
    ['First name', name],
    ['Last name', text(form, 'last_name', 200)],
    ['Email', email],
    ['Website', text(form, 'website', 500)],
    ['Message', message],
  ];

  const attachment = form.get('attachment');
  let attachmentName: string | null = null;
  let attachmentBytes: number | null = null;
  if (attachment instanceof File && attachment.size > 0) {
    if (attachment.size > 10 * 1024 * 1024) {
      return json(413, 'That attachment is over the 10 MB limit.');
    }
    attachmentName = attachment.name;
    attachmentBytes = attachment.size;
    fields.push(['Attachment', `${attachment.name} (${Math.round(attachment.size / 1024)} KB)`]);
  }

  // Record first. Everything below here can fail without losing the enquiry.
  const { country, userAgent } = requestContext(request);
  const record = await recordContact(db, {
    name,
    lastName: text(form, 'last_name', 200),
    email,
    website: text(form, 'website', 500),
    message,
    attachmentName,
    attachmentBytes,
    country,
    userAgent,
  });

  if (!secrets.RESEND_API_KEY || !secrets.CONTACT_TO) {
    await setDelivery(db, 'contact_submissions', record.id, 'unconfigured');
    return json(
      503,
      'The contact form is not connected yet. Please email info@boldeimaging.com or call (416) 241 2800.',
      record.error
    );
  }

  const body = fields
    .filter(([, value]) => value)
    .map(([label, value]) => `<p><strong>${esc(label)}:</strong><br>${esc(value).replace(/\n/g, '<br>')}</p>`)
    .join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${secrets.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: secrets.CONTACT_FROM || 'BolDe Imaging <noreply@boldeimaging.com>',
      to: secrets.CONTACT_TO.split(',').map((s) => s.trim()),
      reply_to: email || undefined,
      subject: `Website enquiry from ${name}`,
      html: body,
    }),
  });

  if (!res.ok) {
    await setDelivery(db, 'contact_submissions', record.id, 'failed', {
      error: `resend ${res.status}: ${(await res.text().catch(() => '')).slice(0, 300)}`,
    });
    return json(
      502,
      'Sorry, that could not be sent. Please try again or email us directly.',
      record.error
    );
  }

  const resendId = await res
    .json<{ id?: string }>()
    .then((b) => b?.id)
    .catch(() => undefined);
  await setDelivery(db, 'contact_submissions', record.id, 'sent', { resendId });

  return json(
    200,
    'Thanks — your message has been sent. We will be in touch shortly.',
    record.error
  );
};
