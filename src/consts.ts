/**
 * Site-wide constants.
 *
 * MEDIA_BASE is the single place every image resolves through -- pages,
 * components and the image sitemap all go via `media()`.
 *
 * It is https://img.boldeimaging.com (AD-9): the public Backblaze bucket
 * `boldeimaging-img` behind a proxied Cloudflare CNAME, with an edge cache
 * rule in front. The cache matters: B2 throttles bursts
 * (`{"code":"too_busy"}`) and one page view asks for ~66 objects, so the
 * bucket must never be reached except through Cloudflare. The bucket holds
 * the 351 images that used to sit in public/media/, verified by SHA-1.
 *
 * The hero video is not an image and stays on this site's own server under
 * /media (see src/pages/index.astro).
 *
 * Override for a specific build with PUBLIC_MEDIA_BASE.
 */
export const MEDIA_BASE: string =
  import.meta.env.PUBLIC_MEDIA_BASE?.replace(/\/$/, '') || 'https://img.boldeimaging.com';

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
