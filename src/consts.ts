/**
 * Site-wide constants.
 *
 * MEDIA_BASE is the single place every image and the hero video resolve
 * through. It defaults to `/media`, which is served out of `public/media` in
 * this repo -- so a build has zero references to the old WordPress server.
 *
 * When the Backblaze bucket is live behind Cloudflare (gates 4-7 of the
 * migration), set PUBLIC_MEDIA_BASE=https://img.boldeimaging.com at build time
 * and every reference moves with it. Nothing else needs editing.
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
