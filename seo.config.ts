/**
 * Everything site-wide about this site's search presence, in the repo where it
 * can be found and reviewed — rather than in a plugin database, which is
 * exactly why WordPress sites lose all of it at migration.
 *
 * WHAT THE OLD SITE ACTUALLY HAD, harvested from all nineteen live addresses
 * on 2026-09-09 while boldeimaging.com was still up:
 *
 *   <title>                 yes, WordPress core defaults ("Page – BolDe Imaging")
 *   <link rel=canonical>    yes on 17, MISSING on the two /category/ pages
 *   robots max-image-preview yes
 *   meta description        NONE, on any page
 *   Open Graph / Twitter    NONE, on any page
 *   JSON-LD structured data NONE, on any page
 *   verification tokens     NONE (no Google, Bing, Pinterest, Ahrefs, Statvoo)
 *   robots.txt              "User-agent: * / Crawl-delay: 30", no Sitemap line
 *   sitemap                 /wp-sitemap.xml + three children, 19 addresses
 *
 * There was no Yoast and no RankMath. So there is nothing to carry verbatim
 * under layer 5 of `astro-seo-kit` — no hand-written schema to preserve, and no
 * verification token that disappears when the old site is switched off. Every
 * JSON-LD node this site emits is GENERATED, and that is recorded here
 * deliberately: a later reader should not have to re-derive it.
 *
 * The titles ARE carried, byte for byte, on eighteen of nineteen addresses.
 * The home page's is the single exception — see PAGE-LEVEL NOTES below.
 */

import { SITE, media } from './src/consts';

/** The real domain. Never the workers.dev preview host — a sitemap or a
 *  canonical generated against the preview would point at addresses the client
 *  does not own. `bin/check-seo.mjs` fails the build if that ever slips. */
export const SITE_URL = 'https://boldeimaging.com';

/** Stable JSON-LD node ids, so per-page nodes can reference the business and
 *  the site rather than restating them. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Resolve an uploads-relative image to an absolute URL.
 *
 * og:image must be absolute — a relative one is silently dropped by every
 * scraper. MEDIA_BASE is `/media` today and becomes
 * `https://img.boldeimaging.com` at gate 7 of the migration; resolving against
 * SITE_URL is correct in both states, so nothing here needs editing at cutover.
 */
export function absoluteMedia(path: string): string {
  const src = media(path);
  return src.startsWith('http') ? src : new URL(src, SITE_URL).href;
}

/**
 * The default sharing image: the home page's own banner artwork.
 *
 * It is 1896x584 (3.2:1), so Facebook and X will crop it to their own ratio.
 * That is the best of what the client's media library actually holds — there
 * is no purpose-made 1200x630 asset. Worth asking them for one; until then
 * this is a real brand image rather than a missing tag.
 */
export const DEFAULT_OG_IMAGE = '2021/04/tribute14.jpg';

/**
 * Verification tokens for Search Console, Bing and the rest.
 *
 * Empty, and that is a harvested fact rather than an omission: the old site's
 * <head> carried none on any of the nineteen addresses, so there is no
 * property to lose at switch-off. When the client verifies boldeimaging.com in
 * Search Console after the cutover, add the token here and it appears on every
 * page.
 */
export const VERIFICATION: { name: string; content: string }[] = [];

/**
 * The business, as one node every page can point at.
 *
 * Every field is taken from something the site itself states — the footer
 * address and phone, the "Since 1976" line on the home page, the copyright
 * line's legal name, the Google Maps link's coordinates — except `areaServed`,
 * which is inferred from the project names on the site (Mississauga,
 * Scarborough, Markham, Hamilton, Ottawa). Confirm that one with the client.
 */
export const ORGANIZATION = {
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': ORG_ID,
  name: SITE.title,
  legalName: 'Bolde Imaging Inc.',
  alternateName: 'BolDe Imaging Group',
  url: `${SITE_URL}/`,
  slogan: SITE.tagline,
  foundingDate: '1976',
  description:
    'Sign fabrication and installation in Mississauga, Ontario: channel letters, ' +
    'pylon and fascia signs, push thru and cut out letters, awnings, banners, ' +
    'construction hoarding, wayfinding and interior signage.',
  telephone: '+1-416-241-2800',
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '5648 McAdam Rd',
    addressLocality: 'Mississauga',
    addressRegion: 'ON',
    postalCode: 'L4Z 1T2',
    addressCountry: 'CA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.624335,
    longitude: -79.66363,
  },
  hasMap: SITE.mapsUrl,
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Ontario, Canada',
  },
  logo: {
    '@type': 'ImageObject',
    url: absoluteMedia('2021/04/Bolde_logo_White.png'),
    width: 512,
    height: 512,
  },
  image: absoluteMedia(DEFAULT_OG_IMAGE),
  sameAs: [SITE.facebook, SITE.instagram],
} as const;

/** The site itself, published by the business above. */
export const WEBSITE = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE.title,
  inLanguage: 'en-US',
  publisher: { '@id': ORG_ID },
} as const;
