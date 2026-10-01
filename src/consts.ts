/**
 * Site-wide constants.
 *
 * MEDIA_BASE is the single place every image and the hero video resolve
 * through -- pages, components and the image sitemap all go via `media()`.
 *
 * On Railway it is `/media`: the copies committed under public/media/, served
 * by this site's own Node server (server.mjs marks them immutable). They are
 * byte-identical to the Backblaze bucket `boldeimaging-img` -- 351 files,
 * verified by count, bytes and SHA-1.
 *
 * Why not stream from Backblaze as the Workers build did through /img: that
 * route only held up because Cloudflare's edge cache sat in front of it. B2
 * throttles bursts (`{"code":"too_busy"}`) and one page view asks for ~66
 * objects, so without a cache every cold visit would hit the throttle.
 * Railway has no edge cache, and the bytes are already on the server.
 *
 * Override for a specific build with PUBLIC_MEDIA_BASE, e.g. once images get
 * their own hostname under AD-9:
 *
 *   PUBLIC_MEDIA_BASE=https://img.boldeimaging.com npm run build
 */
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
