#!/usr/bin/env node
/**
 * Layer 4 of `astro-seo-kit`: a five-second lint over the built HTML, run by
 * `npm run build`, forever — not a one-off audit at migration.
 *
 * The point is not to re-state what src/components/SEO.astro already emits.
 * It is to catch the two failures a component cannot catch on its own:
 *
 *   1. A page that renders WITHOUT going through that component at all.
 *   2. A JSON-LD block that is present and does not parse. Checking that a
 *      <script type="application/ld+json"> tag exists is the check that has
 *      been passing on brandingcentres.com for years while Google silently
 *      discarded the contents. JSON.parse is the whole point of that half.
 *
 * Exits non-zero on any failure. If a Workers Build fails here, the build is
 * right — fix the page, do not remove the check to get a deploy out.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist', 'client');

/** Must match `site` in astro.config.mjs and SITE_URL in seo.config.ts. */
const SITE_ORIGIN = 'https://boldeimaging.com';

if (!existsSync(dist)) {
  console.error(`\nSEO LINT: no build at ${dist}. Run astro build first.\n`);
  process.exit(1);
}

const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : n.endsWith('.html') ? [p] : [];
  });

/** dist/client/services/index.html -> /services/ ; index.html -> / */
const addressOf = (file) => {
  const rel = relative(dist, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
};

const one = (html, re) => {
  const m = html.match(re);
  return m ? m[1] : null;
};

/**
 * Lengths are counted on what a reader sees, not on the encoded source.
 * "Construction, Development &amp; Sales Offices" is 45 characters in a search
 * result and 49 in the HTML; measuring the wrong one puts a page over Google's
 * 60 that is not over it.
 */
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

const fails = [];
const fail = (page, why) => fails.push([page, why]);

let pages = 0;
let ldBlocks = 0;
let ldNodes = 0;
let withAlt = 0;
let decorative = 0;
let noAltAttr = 0;
let noindexPages = 0;
const indexable = new Set();

for (const file of walk(dist)) {
  pages++;
  const html = readFileSync(file, 'utf8');
  const page = addressOf(file);

  // --- title, carried verbatim from WordPress on 18 of 19 addresses ---------
  const title = one(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const titleText = title === null ? null : decode(title);
  if (titleText === null) fail(page, 'no <title>');
  else if (titleText.length < 10)
    fail(page, `title is ${titleText.length} chars, under 10`);
  else if (titleText.length > 60)
    fail(page, `title is ${titleText.length} chars — Google truncates at 60: ${titleText}`);

  // --- description, which the old site had on no address at all -------------
  const rawDesc = one(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
  );
  const desc = rawDesc === null ? null : decode(rawDesc);
  if (desc === null) fail(page, 'no meta description');
  else if (desc.length < 50) fail(page, `description is ${desc.length} chars, under 50`);
  else if (desc.length > 160)
    fail(page, `description is ${desc.length} chars — invisible past 160`);

  // --- canonical, and that it points at the real domain ---------------------
  const canonical = one(
    html,
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
  );
  if (!canonical) fail(page, 'no rel=canonical');
  else if (!canonical.startsWith(`${SITE_ORIGIN}/`))
    fail(page, `canonical is not on ${SITE_ORIGIN}: ${canonical}`);
  else if (canonical !== `${SITE_ORIGIN}${page}` && page !== '/404.html')
    // trailingSlash: 'always' in astro.config.mjs, "html_handling":
    // "auto-trailing-slash" in wrangler.jsonc, and the sitemap must all agree,
    // or the site canonicalises to addresses its own sitemap does not list.
    //
    // 404.html is exempt because it is the one page not served at the address
    // it was built at: Workers returns it for every unknown address, via
    // "not_found_handling": "404-page". It is noindex, so its canonical is
    // inert either way.
    fail(page, `canonical ${canonical} does not match the address it was built at`);

  // --- Open Graph, absolute or scrapers drop it silently --------------------
  const og = one(
    html,
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  );
  if (!og) fail(page, 'no og:image');
  else if (!/^https:\/\//.test(og)) fail(page, `og:image is not an absolute https URL: ${og}`);

  const robots =
    one(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i) ?? '';
  if (!robots) fail(page, 'no meta robots');
  if (/noindex/i.test(robots)) noindexPages++;
  else indexable.add(page);

  // --- JSON-LD: present, and it PARSES -------------------------------------
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  if (!blocks.length) fail(page, 'no JSON-LD');
  for (const b of blocks) {
    ldBlocks++;
    let parsed;
    try {
      parsed = JSON.parse(b[1]);
    } catch (e) {
      fail(page, `JSON-LD does not parse — ${e.message}`);
      continue;
    }
    const nodes = parsed['@graph'] ?? [parsed];
    ldNodes += nodes.length;
    for (const node of nodes)
      if (!node['@type']) fail(page, 'a JSON-LD node has no @type');
  }

  // --- alt text -------------------------------------------------------------
  // An <img> with no alt attribute at all is a failure: every image on this
  // site comes from a template in this repo, so there is no excuse for one.
  // alt="" is counted, not failed — it is correct for a decorative image and
  // no script can tell which is which. Watch that number; on the sites worth
  // copying it is the carousel clones and nothing else.
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    if (/\salt\s*=\s*["'][^"']+["']/i.test(tag)) withAlt++;
    else if (/\salt\s*=\s*["']["']/i.test(tag) || /\salt(?=[\s/>])/i.test(tag)) decorative++;
    else {
      noAltAttr++;
      fail(page, `<img> with no alt attribute: ${tag.slice(0, 100)}`);
    }
  }
}

// --- the sitemap must list addresses that exist, and only indexable ones -----
const sitemapFile = join(dist, 'sitemap.xml');
let listed = [];
if (!existsSync(sitemapFile)) {
  fails.push(['/sitemap.xml', 'not built']);
} else {
  const xml = readFileSync(sitemapFile, 'utf8');
  listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!listed.length) fails.push(['/sitemap.xml', 'lists no addresses']);
  for (const loc of listed) {
    if (!loc.startsWith(`${SITE_ORIGIN}/`)) {
      fails.push(['/sitemap.xml', `address is not on ${SITE_ORIGIN}: ${loc}`]);
      continue;
    }
    const path = loc.slice(SITE_ORIGIN.length);
    if (!indexable.has(path))
      fails.push([
        '/sitemap.xml',
        `lists ${path}, which is not a built, indexable page ` +
          '(a sitemap must never list a noindexed or missing address)',
      ]);
  }
  for (const path of indexable)
    if (path !== '/404.html' && !listed.includes(`${SITE_ORIGIN}${path}`))
      fails.push(['/sitemap.xml', `does not list ${path}, which is indexable`]);
}

const p = (label, n) => console.log(`  ${label.padEnd(32, '.')} ${n}`);
console.log('\nSEO LINT\n');
p('pages', pages);
p('indexable', indexable.size);
p('noindex (deliberate)', noindexPages);
p('sitemap addresses', listed.length);
p('JSON-LD blocks', ldBlocks);
p('JSON-LD nodes (all parsed)', ldNodes);
p('images with alt text', withAlt);
p('images alt="" (decorative)', decorative);
p('images with no alt attribute', noAltAttr);
p('failures', fails.length);

if (fails.length) {
  console.log('\nFAILURES:');
  for (const [page, why] of fails) console.log(`  ${page}\n    ${why}`);
  console.log('\nSEO LINT FAILED.\n');
  process.exit(1);
}
console.log('\nSEO LINT PASSED.\n');
