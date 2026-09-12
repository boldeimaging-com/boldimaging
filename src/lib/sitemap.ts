/**
 * Shared sitemap plumbing.
 *
 * Every sitemap route resolves its addresses against `Astro.site`, which is
 * https://boldeimaging.com -- the real domain, never the preview hostname. A
 * sitemap generated against *.workers.dev lists addresses that do not exist
 * for anyone but us, and Google drops the lot.
 *
 * Trailing slashes matter here more than anywhere: the canonical tags, this
 * sitemap and the Worker must agree, or the site canonicalises to addresses
 * its own sitemap does not list. The three places that have to match are
 * `trailingSlash: 'always'` in astro.config.mjs, the paths below, and
 * `"html_handling": "auto-trailing-slash"` in wrangler.jsonc.
 */
import { MEDIA_BASE } from '../consts';
import { LASTMOD } from '../data/lastmod';

/** The five XML predefined entities, the only escaping a sitemap needs. */
export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Absolute https URL for a site path, e.g. `/services/`. */
export function pageUrl(origin: string, path: string): string {
  return origin + path;
}

/**
 * Absolute URL for an uploads-relative image, e.g. `2021/04/tribute14.jpg`.
 *
 * Image sitemaps require absolute URLs, but MEDIA_BASE is `/media` by default
 * (images served from the Worker's own assets) and becomes an absolute
 * https://img.boldeimaging.com once the Backblaze bucket is live behind
 * Cloudflare. Handle both, so the sitemap follows the images without an edit.
 */
export function imageUrl(origin: string, path: string): string {
  const rel = path.replace(/^\//, '');
  return /^https?:\/\//.test(MEDIA_BASE)
    ? `${MEDIA_BASE}/${rel}`
    : `${origin}${MEDIA_BASE}/${rel}`;
}

export interface UrlEntry {
  path: string;
  /** uploads-relative image paths appearing on this page */
  images?: string[];
}

const HEAD = '<?xml version="1.0" encoding="UTF-8"?>\n';
const NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const IMG_NS = 'http://www.google.com/schemas/sitemap-image/1.1';

/**
 * A `<urlset>` document. `lastmod` is emitted only where WordPress actually
 * published one -- an absent date is honest, a fabricated one is not.
 */
export function urlset(origin: string, entries: UrlEntry[]): string {
  const withImages = entries.some((e) => e.images?.length);
  const body = entries
    .map(({ path, images }) => {
      const lastmod = LASTMOD[path];
      const lines = [`    <loc>${xmlEscape(pageUrl(origin, path))}</loc>`];
      if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
      for (const img of images ?? []) {
        lines.push(
          '    <image:image>',
          `      <image:loc>${xmlEscape(imageUrl(origin, img))}</image:loc>`,
          '    </image:image>',
        );
      }
      return `  <url>\n${lines.join('\n')}\n  </url>`;
    })
    .join('\n');

  const ns = withImages ? `xmlns="${NS}" xmlns:image="${IMG_NS}"` : `xmlns="${NS}"`;
  return `${HEAD}<urlset ${ns}>\n${body}\n</urlset>\n`;
}

/** A `<sitemapindex>` document pointing at the child sitemaps. */
export function sitemapIndex(origin: string, paths: string[]): string {
  const body = paths
    .map((p) => `  <sitemap>\n    <loc>${xmlEscape(origin + p)}</loc>\n  </sitemap>`)
    .join('\n');
  return `${HEAD}<sitemapindex xmlns="${NS}">\n${body}\n</sitemapindex>\n`;
}

export function xml(body: string): Response {
  return new Response(body, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}

/** `Astro.site` is set in astro.config.mjs; the fallback keeps types honest. */
export function originOf(site: URL | undefined): string {
  return (site ?? new URL('https://boldeimaging.com')).origin;
}
