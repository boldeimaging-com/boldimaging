/**
 * What both public forms (/api/contact and /api/ftp) check before they
 * record or send anything.
 *
 * Turnstile: the form carries `cf-turnstile-response` (the widget on the
 * page adds it). The token must be valid AND issued on the hostname this
 * request came to, so a token minted on another site is refused. The secret
 * is TURNSTILE_SECRET_KEY, a runtime variable, read per request from
 * process.env and never from import.meta.env (Vite would inline it).
 *
 * Staging: with LIVE_HOSTS and STAGING_TO both set, a form sent to any other
 * hostname (stage.boldeimaging.com) goes to STAGING_TO instead of the client
 * or a rep, so testing staging never emails them. With either unset, the
 * forms behave as they did before.
 */

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const list = (value: string | undefined) =>
  (value ?? '').split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);

/** The public hostname the visitor used: Railway passes it through as Host. */
export function requestHost(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-host');
  const host = forwarded ? forwarded.split(',')[0] : new URL(request.url).host;
  return host.trim().toLowerCase().replace(/:\d+$/, '');
}

export async function turnstile(
  request: Request,
  form: FormData
): Promise<'ok' | 'failed' | 'unconfigured'> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return 'unconfigured';
  const token = form.get('cf-turnstile-response');
  if (typeof token !== 'string' || !token) return 'failed';
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetch(SITEVERIFY, { method: 'POST', body });
    const out = (await res.json()) as { success?: boolean; hostname?: string };
    return out.success === true && String(out.hostname ?? '').toLowerCase() === requestHost(request)
      ? 'ok'
      : 'failed';
  } catch {
    return 'failed';
  }
}

/** STAGING_TO when this is not the live site; null on the live site. */
export function stagingRecipients(request: Request): string[] | null {
  const live = list(process.env.LIVE_HOSTS).map((h) => h.toLowerCase());
  const staging = list(process.env.STAGING_TO);
  if (!live.length || !staging.length) return null;
  return live.includes(requestHost(request)) ? null : staging;
}
