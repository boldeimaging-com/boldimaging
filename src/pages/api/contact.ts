import type { APIRoute } from 'astro';
// Worker bindings and secrets. `Astro.locals.runtime.env` was removed in
// Astro 6; this is the supported way to read them.
import { env } from 'cloudflare:workers';

/**
 * POST /api/contact — the /contact/ form.
 *
 * This is the only on-demand route on the site (every page is prerendered);
 * it is the reason the Cloudflare adapter is in astro.config.mjs at all.
 *
 * Delivery is wired at gate 11 of the migration. Until RESEND_API_KEY and
 * CONTACT_TO are set as Worker secrets, this answers 503 with a message the
 * form shows the visitor, rather than swallowing the submission silently.
 */
export const prerender = false;

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

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

export const POST: APIRoute = async ({ request }) => {
  const secrets = env as unknown as Env;

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
  if (attachment instanceof File && attachment.size > 0) {
    if (attachment.size > 10 * 1024 * 1024) {
      return json(413, 'That attachment is over the 10 MB limit.');
    }
    fields.push(['Attachment', `${attachment.name} (${Math.round(attachment.size / 1024)} KB)`]);
  }

  if (!secrets.RESEND_API_KEY || !secrets.CONTACT_TO) {
    return json(
      503,
      'The contact form is not connected yet. Please email info@boldeimaging.com or call (416) 241 2800.'
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
    return json(502, 'Sorry, that could not be sent. Please try again or email us directly.');
  }

  return json(200, 'Thanks — your message has been sent. We will be in touch shortly.');
};
