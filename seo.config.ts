/**
 * Everything site-wide that a WordPress SEO plugin used to hold in its database.
 *
 * In the repo, findable, and reviewable in a diff — which is the whole point:
 * the plugin's copy of this disappears the moment the plugin does.
 *
 * HARVESTED FROM THE LIVE SITE, 2026-09-14, while it was still up:
 *
 *   verification tokens ..... 0    (scanned every page's <head>)
 *   JSON-LD blocks .......... 0    (on all 19 addresses)
 *   analytics / tag systems . 0
 *
 * That is unusual and worth stating plainly: boldeimaging.com runs no SEO
 * plugin output at all. There is nothing to carry over and nothing to lose, so
 * every structured-data block below is GENERATED, not ported. If a token is
 * ever added to the old site before switch-off, it belongs in `verification`.
 */

export interface Verification {
  name: string;
  content: string;
}

const SITE_URL = 'https://boldeimaging.com';

/**
 * Absolute, because Open Graph consumers do not resolve relative URLs. It has
 * to stay a literal rather than going through `media()`: MEDIA_BASE is `/img`,
 * a path, and an og:image of "/img/..." is silently dropped by every scraper.
 */
export const OG_IMAGE = `${SITE_URL}/img/2021/04/tribute14.jpg`;

/**
 * Organization + WebSite, as one @graph so the two nodes can reference each
 * other. Generated from src/consts.ts SITE — the same phone, address and social
 * profiles the footer renders, so they cannot drift apart.
 *
 * LocalBusiness rather than plain Organization: this is a single fabrication
 * facility with a street address and a service area, which is what the type is
 * for, and it is what earns a knowledge panel for brand searches.
 */
export const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#organization`,
      name: 'BolDe Imaging',
      legalName: 'Bolde Imaging Inc.',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/img/2021/04/Bolde_logo_White.png`,
      image: OG_IMAGE,
      description:
        'Signage manufacturer in Mississauga, Ontario. 2D and 3D signs, channel letters, ' +
        'backlit signs, full-colour LED panels, banners, awnings, construction hoarding, ' +
        'wayfinding and fascia signs, from a 40,000 square foot facility.',
      telephone: '+1-416-241-2800',
      email: 'info@boldeimaging.com',
      foundingDate: '1976',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '5648 McAdam Rd',
        addressLocality: 'Mississauga',
        addressRegion: 'ON',
        postalCode: 'L4Z 1T2',
        addressCountry: 'CA',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 43.6243353, longitude: -79.6636302 },
      sameAs: [
        'https://www.facebook.com/BolDeImaging',
        'https://www.instagram.com/boldeimaginggroup/',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'BolDe Imaging',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-CA',
    },
  ],
};

export default {
  siteUrl: `${SITE_URL}/`,
  defaultOgImage: OG_IMAGE,

  /**
   * Empty because the live site has none — see the harvest note above. Left in
   * place so adding one later is a one-line change rather than a rediscovery.
   */
  verification: [] as Verification[],

  organizationJsonld: ORGANIZATION_JSONLD,
};
