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
// ROLLED BACK to the Worker's own copies on 2026-09-14: images served from
// img-boldimaging.10xid.com were reported broken in a browser on every page,
// while every check runnable from the build sandbox passed -- 320 of 320 URLs
// 200 across all 19 pages, cold cache, browser-like concurrency, correct video
// range requests, transform rule and CNAME intact.
//
// The untested suspect is TLS. This sandbox intercepts HTTPS and re-signs it
// (every certificate here reads issuer=Anthropic, even over a raw socket), so
// the real Cloudflare certificate for that hostname cannot be observed from
// the build environment at all. A certificate not covering the host would
// break every image in a browser and be invisible to every check above.
//
// The bucket, the CNAME and the transform rule are all left in place. To try
// again once the certificate is confirmed good in a real browser, restore:
//   'https://img-boldimaging.10xid.com'
export const MEDIA_BASE: string =
  import.meta.env.PUBLIC_MEDIA_BASE?.replace(/\/$/, '') || '/media';

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
