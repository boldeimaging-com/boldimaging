/**
 * The /admin/ login: one shared password, ADMIN_PASSWORD, set as a Railway
 * variable. There is one client and two settings to edit, so user accounts
 * would be machinery with nothing to manage.
 *
 * A session is a cookie holding its expiry and an HMAC of it. The key is
 * ADMIN_SESSION_SECRET if set, else the password itself, so changing the
 * password signs everybody out. Nothing is stored server side.
 *
 * Cross-site POSTs are already refused by Astro's same-origin check (see
 * server.mjs), and the cookie is SameSite=Strict on top of that.
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';

export const COOKIE = 'bolde_admin';
const SESSION_SECONDS = 12 * 60 * 60;

const key = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || '';

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

const sign = (payload: string) => createHmac('sha256', key()).update(payload).digest('base64url');

/** Hash both sides first so the comparison is constant time whatever the lengths. */
const same = (a: string, b: string) =>
  timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());

export function isSignedIn(cookies: AstroCookies): boolean {
  if (!adminConfigured()) return false;
  const value = cookies.get(COOKIE)?.value ?? '';
  const [exp, mac] = value.split('.');
  if (!exp || !mac || !/^\d+$/.test(exp)) return false;
  if (Number(exp) * 1000 < Date.now()) return false;
  return same(mac, sign(exp));
}

export function signIn(cookies: AstroCookies, secure: boolean): void {
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  cookies.set(COOKIE, `${exp}.${sign(exp)}`, {
    path: '/admin',
    httpOnly: true,
    sameSite: 'strict',
    secure,
    maxAge: SESSION_SECONDS,
  });
}

export function signOut(cookies: AstroCookies): void {
  cookies.delete(COOKIE, { path: '/admin' });
}

/**
 * Failed attempts per client, in memory. Enough to make guessing slow; a
 * restart clears it, which is fine for a single small process.
 */
const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; first: number }>();

export function clientKey(request: Request): string {
  // Railway's edge appends the real client address to X-Forwarded-For.
  const xff = request.headers.get('x-forwarded-for') ?? '';
  return xff.split(',').pop()?.trim() || 'unknown';
}

export function lockedOut(client: string): boolean {
  const f = failures.get(client);
  if (!f) return false;
  if (Date.now() - f.first > WINDOW_MS) {
    failures.delete(client);
    return false;
  }
  return f.count >= MAX_FAILURES;
}

export function checkPassword(client: string, attempt: string): boolean {
  const ok = adminConfigured() && same(attempt, process.env.ADMIN_PASSWORD ?? '');
  if (ok) {
    failures.delete(client);
  } else {
    const f = failures.get(client);
    if (!f || Date.now() - f.first > WINDOW_MS) failures.set(client, { count: 1, first: Date.now() });
    else f.count++;
    // Keep the map from growing without bound under a spray of addresses.
    if (failures.size > 5000) failures.delete(failures.keys().next().value!);
  }
  return ok;
}
