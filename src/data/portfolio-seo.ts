/**
 * Search copy for the twelve portfolio addresses.
 *
 * AUTHORED, not scraped — which is why it is here and not in `portfolio.ts`,
 * whose header says to regenerate that file from the live site.
 *
 * Two fields, both of which the old WordPress site left empty:
 *
 *   description  The old site had no meta description on any address. Each of
 *                these is condensed from that page's own body copy, so nothing
 *                here claims anything the client does not already say. The
 *                bodies themselves run 185-371 characters, past the 160 where
 *                Google truncates, so they cannot be used raw — and
 *                `push-thru-signs` has no body at all.
 *
 *   imageAlt     The hero photograph on each of these pages shipped with
 *                `alt=""` — the single largest, most relevant image on the
 *                page, invisible to Google Images and to a screen reader.
 *
 * `bin/check-seo.mjs` fails the build if a portfolio address ever renders
 * without either.
 */

export interface PortfolioSeo {
  description: string;
  imageAlt: string;
}

export const PORTFOLIO_SEO: Record<string, PortfolioSeo> = {
  wayfinding: {
    description:
      'Wayfinding signs from BolDe Imaging orient staff, visitors and patrons around malls, warehouses and event grounds so they reach their destination easily.',
    imageAlt: 'Wayfinding sign fabricated and installed by BolDe Imaging',
  },
  'pylon-signs': {
    description:
      'Streetside pylon signs from BolDe Imaging show passersby and motorists which businesses are featured at your mall, plaza or retail location.',
    imageAlt: 'Illuminated streetside pylon sign built by BolDe Imaging',
  },
  'push-thru-signs': {
    description:
      'Push thru signs from BolDe Imaging: acrylic letters and shapes pushed through the face of a sign cabinet for a crisp, evenly illuminated result.',
    imageAlt: 'Push thru acrylic sign built by BolDe Imaging',
  },
  interiors: {
    description:
      'Interior signage fabricated and installed by BolDe Imaging, with creative solutions and expert installation that finish the space as a whole.',
    imageAlt: 'Interior signage installation by BolDe Imaging',
  },
  'hoarding-signs': {
    description:
      'Construction hoarding by BolDe Imaging — safe, to code, and first-party advertising space that gets your new development noticed.',
    imageAlt: 'Printed construction hoarding installed by BolDe Imaging',
  },
  'cut-out-letters': {
    description:
      'Cut out letters from BolDe Imaging in acrylic, plastic, glass and more — a clean option for storefronts, interior displays and window displays.',
    imageAlt: 'Cut out dimensional letters fabricated by BolDe Imaging',
  },
  'construction-development-sales-offices': {
    description:
      'Signage for construction sites, developments and sales offices: wayfinding, safety warnings, traffic diversions and promotional material.',
    imageAlt: 'Sales office and development site signage by BolDe Imaging',
  },
  awnings: {
    description:
      'Awnings from BolDe Imaging get your storefront noticed and shelter patrons from sun and rain, so products can be displayed outdoors with confidence.',
    imageAlt: 'Branded storefront awning fabricated by BolDe Imaging',
  },
  'fascia-signs': {
    description:
      'Fascia signs from BolDe Imaging sit above your storefront and make your brand tangible — the sign that tells the street who you are.',
    imageAlt: 'Storefront fascia sign fabricated and installed by BolDe Imaging',
  },
  'custom-signage': {
    description:
      'Custom signage from BolDe Imaging: professional tradespeople and current technology make every imaging project possible, whatever you have in mind.',
    imageAlt: 'Custom fabricated signage project by BolDe Imaging',
  },
  'channel-letters': {
    description:
      'Channel letters from BolDe Imaging: 3D letters fabricated individually in metal or plastic, with LED illumination available in every letter.',
    imageAlt: 'Illuminated channel letters fabricated by BolDe Imaging',
  },
  banners: {
    description:
      'Banners from BolDe Imaging printed on durable material that withstands the elements — any length, and we can install them on a construction crane.',
    imageAlt: 'Large-format printed banner produced by BolDe Imaging',
  },
};
