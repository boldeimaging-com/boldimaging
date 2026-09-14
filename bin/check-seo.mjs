#!/usr/bin/env node
/**
 * Fails the build on missing or unparseable metadata.
 *
 * Runs after every build, forever — not once at migration. A five-second lint
 * that catches a missing title beats a seven-minute Lighthouse run nobody
 * waits for.
 *
 * This duplicates some of what the Zod schema in src/components/SEO.astro
 * already guarantees, on purpose: the schema checks what a page PASSES, this
 * checks what actually reached the HTML. A component edit that drops a tag
 * would sail past the schema and be caught here.
 *
 * `JSON.parse` on every JSON-LD block is the important half. Checking that a
 * <script type="application/ld+json"> tag merely exists is the check that
 * passed for years on brandingcentres.com while Google silently discarded the
 * contents over a line break inside a string.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// dist/client, not dist: the Cloudflare adapter splits the build into
// client (pages and assets) and server (the Worker).
const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'client');

const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : n.endsWith('.html') ? [p] : [];
  });

const need = {
  title: /<title[^>]*>([^<]{10,})<\/title>/i,
  description: /<meta[^>]+name=["']description["'][^>]+content=["']([^"']{50,})/i,
  canonical: /<link[^>]+rel=["']canonical["'][^>]+href=["']https?:\/\/[^"']+/i,
  ogImage: /<meta[^>]+property=["']og:image["'][^>]+content=["']https?:\/\/[^"']+/i,
  ogDescription: /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']{50,})/i,
  twitterCard: /<meta[^>]+name=["']twitter:card["']/i,
};

// Whatever origin the canonicals use, every sitemap <loc> must use the same
// one. A site that canonicalises to addresses its own sitemap does not list is
// the classic way to waste a migration, and it is invisible without a check.
function canonicalOrigin(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["'](https?:\/\/[^/"']+)/i);
  return m ? m[1] : null;
}
const origins = new Set();

const fails = [];
let pages = 0,
  ld = 0,
  alt = 0,
  decorative = 0,
  noalt = 0;

for (const f of walk(dist)) {
  const html = readFileSync(f, 'utf8');
  pages++;
  const rel = relative(dist, f);

  for (const [k, re] of Object.entries(need)) {
    if (!re.test(html)) fails.push([rel, `missing ${k}`]);
  }

  const origin = canonicalOrigin(html);
  if (origin) origins.add(origin);

  // A description over 160 is not invalid, but it is invisible past the cut,
  // so it is worth failing on rather than reporting.
  const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i);
  if (desc && desc[1].length > 160) {
    fails.push([rel, `description is ${desc[1].length} chars; Google truncates at 160`]);
  }

  const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  if (!blocks.length) fails.push([rel, 'no JSON-LD']);
  for (const b of blocks) {
    ld++;
    try {
      JSON.parse(b[1]);
    } catch (e) {
      fails.push([rel, `JSON-LD does not parse — ${e.message}`]);
    }
  }

  for (const img of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = img[0];
    // Three cases, and they are not the same thing. `alt="text"` is described;
    // `alt=""` OR a valueless `alt` is a deliberately decorative image, which
    // Astro emits for the marquee's duplicated logos; no alt attribute at all
    // is the actual defect. Matching only /\salt\s*=/ misses the valueless
    // form and reports 41 correct images as faults.
    if (/\salt\s*=\s*["'][^"']+["']/i.test(tag)) alt++;
    else if (/\salt\s*=\s*["']["']/i.test(tag) || /\salt(?=[\s/>])/i.test(tag)) decorative++;
    else noalt++;
  }
}

// Cross-check the sitemaps against the canonical origin.
import { existsSync } from 'node:fs';
const sitemapLocs = [];
for (const f of ['sitemap.xml', 'sitemap-pages.xml', 'sitemap-portfolio.xml',
                 'sitemap-categories.xml', 'sitemap-images.xml']) {
  const path = join(dist, f);
  if (!existsSync(path)) { fails.push([f, 'sitemap missing from the build']); continue; }
  for (const m of readFileSync(path, 'utf8').matchAll(/<loc>(https?:\/\/[^/<]+)/g)) {
    sitemapLocs.push(m[1]);
  }
}
const sitemapOrigins = new Set(sitemapLocs);
for (const o of sitemapOrigins) {
  if (!origins.has(o)) {
    fails.push(['sitemaps', `declare ${o} but pages canonicalise to ${[...origins].join(', ')}`]);
  }
}

const p = (l, n) => console.log(`  ${l.padEnd(34, '.')} ${n}`);
console.log('\nSEO LINT\n');
p('origin', [...origins].join(', ') || '(none)');
p('sitemap <loc> origins', [...sitemapOrigins].join(', ') || '(none)');
p('pages', pages);
p('JSON-LD blocks', ld);
p('images with alt text', alt);
p('images marked decorative', decorative);
p('images with no alt attribute', noalt);
p('failures', fails.length);

if (fails.length) {
  console.log('\nFAILURES:');
  for (const [f, why] of fails) console.log(`  ${f}\n    ${why}`);
  console.log('\nSEO LINT FAILED.\n');
  process.exit(1);
}
console.log('\nSEO LINT PASSED.\n');
