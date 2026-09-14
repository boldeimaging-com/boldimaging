/**
 * Site-wide constants.
 *
 * MEDIA_BASE is the single place every image and the hero video resolve
 * through -- pages, components and the image sitemap all go via `media()`.
 *
 * It now points at the Backblaze B2 bucket `boldeimaging-img`, served through
 * Cloudflare at img-boldimaging.10xid.com (a proxied CNAME to
 * f005.backblazeb2.com plus a transform rule that prefixes /file/boldeimaging-img
 * and so scopes the hostname to that one bucket).
 *
 * The value is committed rather than left to PUBLIC_MEDIA_BASE in a .env,
 * because .env is gitignored: a CI build would silently fall back to the
 * default, and a default of `/media` would quietly serve images from the
 * Worker again with nothing to show it had happened.
 *
 * Override for a specific build with PUBLIC_MEDIA_BASE:
 *
 *   PUBLIC_MEDIA_BASE=/media npm run build                    # Worker's own copies
 *   PUBLIC_MEDIA_BASE=https://img.boldeimaging.com npm run build   # at cutover
 *
 * The client's own img.boldeimaging.com cannot be used yet: that zone is still
 * pending on Cloudflare.
 */
// `/img` is served by src/pages/img/[...path].ts, which streams from the
// Backblaze bucket. B2 is still the store; the difference from the earlier
// attempt is that images now come from the SAME origin as the page, over a
// certificate already proven to work in the visitor's browser, instead of from
// img-boldimaging.10xid.com. That hostname served correctly to every check
// this sandbox can run and was still broken in a real browser on every page,
// and the sandbox intercepts TLS so the real certificate cannot be inspected
// from here to prove it either way.
//
// Two other bases remain available:
//
//   PUBLIC_MEDIA_BASE=/media npm run build   # the copies bundled in the Worker
//   PUBLIC_MEDIA_BASE=https://img.boldeimaging.com npm run build   # at cutover
//
// The second is the eventual target under AD-9, once the client's own zone
// leaves pending and its certificate can be confirmed in a browser.
export const MEDIA_BASE: string =
  import.meta.env.PUBLIC_MEDIA_BASE?.replace(/\/$/, '') || '/img';

/** Resolve an uploads-relative path, e.g. `2021/04/tribute14.jpg`. */
export function media(path: string): string {
  return `${MEDIA_BASE}/${path.replace(/^\//, '')}`;
}

export const SITE = {
  title: 'BolDe Imaging',
  tagline: 'We Build Brands',
  phone: '(416) 241 2800',
  phoneHref: 'tel:4162412800',
  email: 'info@boldeimaging.com',
  address: '5648 McAdam Rd, Mississauga, ON L4Z 1T2',
  mapsUrl:
    'https://www.google.com/maps?ll=43.624335,-79.66363&z=10&t=m&hl=en-US&gl=US&mapclient=embed&daddr=5648+McAdam+Rd+Mississauga,+ON+L4Z+1T2@43.6243353,-79.6636302',
  facebook: 'https://www.facebook.com/BolDeImaging',
  instagram: 'https://www.instagram.com/boldeimaginggroup/',
  copyright: 'Copyright © 2025 - Bolde Imaging Inc.  All Rights Reserved',
} as const;

/** The four-item menu, used by both the header and the footer. */
export const NAV = [
  { label: 'Home', href: '/', icon: 'fa-home' },
  { label: 'Our Work', href: '/services/', icon: 'fa-wrench' },
  { label: 'FTP', href: '/ftp/', icon: 'fa-folder-open' },
  { label: 'Contact', href: '/contact/', icon: 'fa-envelope' },
] as const;
