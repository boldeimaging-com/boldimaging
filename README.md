# boldeimaging.com — Astro

A faithful port of the live WordPress site at <https://boldeimaging.com> to
Astro 7, hosted on Railway (a Node server plus Railway Postgres). Same nineteen
addresses, same design, no WordPress, no Elementor, no jQuery, no Swiper.

The design was not rebuilt by eye. It was taken from the site's own generated
stylesheets (the Elementor kit `post-9.css`, the header/footer templates
`post-783.css` / `post-73.css`, and one `post-*.css` per page) and from
computed styles read out of a real browser rendering the original with its own
JavaScript running. Every ported block carries the Elementor element id it came
from in a comment, so a later change can be traced back.

## Running it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # -> dist/client (pages + assets) and dist/server (the handler)
npm start          # node server.mjs, the same entry Railway runs
npm run preview    # build, then start
npm run check      # astro check — 0 errors expected
npm run db:migrate # apply migrations/*.sql to DATABASE_URL
```

## Deploying — Railway

Moved from Cloudflare Workers + D1 + R2 on 2026-10-01. One Railway project with
three pieces:

| Piece | What it is |
|---|---|
| **web** service | this repo, built by Railpack, run by `node server.mjs` |
| **Postgres** | Railway's Postgres template — the forms and the gallery |
| **Bucket** | a Railway Storage Bucket — files sent through `/ftp/` |

**Railway does not read a config file from this repo.** `railway.json` is
deprecated and new services cannot opt into it, so the settings live in the
service's dashboard:

| Service setting | Value |
|---|---|
| Build command | `npm run build` *(Railpack's default for this repo)* |
| Start command | `npm start` *(Railpack's default for this repo)* |
| **Pre-deploy command** | **`npm run db:migrate`** — must be set by hand |
| Healthcheck path | `/` |
| Node version | from `engines` in `package.json` (22.12+) |

The pre-deploy command runs after the build with the private network up, so it
can reach Postgres. If a migration fails the deploy stops and the previous one
keeps serving.

**Variables on the web service.** `${{...}}` are Railway reference variables;
type them exactly, with the service names your project actually uses:

| Variable | Value | For |
|---|---|---|
| `SITE_URL` | `https://stage.boldeimaging.com` | canonical/sitemap origin (build time) |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | forms, at runtime (private network) |
| `GALLERY_DATABASE_URL` | `${{Postgres.DATABASE_PUBLIC_URL}}` | gallery read at **build** time |
| `UPLOADS_ENDPOINT` | `${{Bucket.ENDPOINT}}` | `/ftp/` storage |
| `UPLOADS_BUCKET` | `${{Bucket.BUCKET}}` | |
| `UPLOADS_ACCESS_KEY_ID` | `${{Bucket.ACCESS_KEY_ID}}` | |
| `UPLOADS_SECRET_ACCESS_KEY` | `${{Bucket.SECRET_ACCESS_KEY}}` | |
| `UPLOADS_REGION` | `${{Bucket.REGION}}` | |
| `RESEND_API_KEY` | from Resend | both forms' notification email |
| `CONTACT_TO` | comma-separated addresses | where enquiries land (CC'd on FTP) until a list is saved in `/admin/` |
| `ADMIN_PASSWORD` | a long random password | signs in to `/admin/`; unset = admin disabled |
| `ADMIN_SESSION_SECRET` | optional | signs the admin cookie; defaults to the password |
| `CONTACT_FROM` | optional | defaults to `BolDe Imaging <noreply@boldeimaging.com>` |

`GALLERY_DATABASE_URL` is separate from `DATABASE_URL` because **the private
network does not exist during the build**: `postgres.railway.internal` cannot
be reached from `npm run build`. Without it the build simply uses the committed
gallery module, which is identical today.

**The first deploy builds before the tables exist** (the build runs before the
pre-deploy migration). The gallery falls back to the committed module, so
nothing is wrong, but the build log says `from module`; the next deploy reads
Postgres.

**`stage.boldeimaging.com` with DNS left at GoDaddy.** In the web service,
Settings → Networking → Custom Domain → `stage.boldeimaging.com`. Railway shows
a CNAME target and a TXT verification record; add both in GoDaddy's DNS and
nothing else there changes. The apex `boldeimaging.com` cannot be pointed at
Railway while DNS is at GoDaddy, because GoDaddy has no CNAME flattening or
ALIAS records; that is a cutover decision, not a stage one.

Never commit a lockfile produced by `npm install --omit=optional`: it strips
the rolldown native binding and the build then fails with *"Cannot find native
binding."* The committed lockfile carries all 15 `@rolldown/binding-*`
platforms.

The Cloudflare Worker `boldimaging`, its D1 database `boldeimaging-forms` and
the `boldimaging.ash-47a.workers.dev` URL were left in place, not deleted. D1
held no form submissions, and its 116 gallery rows were checked identical to
the Postgres seed before the move.

### Forms and uploads: Postgres is the record, email is the notification

`/contact/` and `/ftp/` both write to Postgres *before* attempting delivery.
That ordering is the whole point: before it existed, a Resend outage — or
simply an unset API key — meant a submission was read off the wire and
dropped, with nobody aware a customer had written in.

| Table | One row per |
|---|---|
| `contact_submissions` | enquiry from `/contact/` |
| `ftp_uploads` | upload batch from `/ftp/` |
| `ftp_upload_files` | file that actually landed in the bucket |
| `gallery_filters` | filter tab on `/gallery/` (12) |
| `gallery_items` | image in the gallery (116) |
| `ftp_reps` | "Your Rep" choice on `/ftp/`, edited at `/admin/` |
| `site_settings` | admin-edited value (`contact_recipients`) |
| `schema_migrations` | migration file applied by `bin/migrate.mjs` |

**Two status columns on `ftp_uploads`, not one.** `upload_status` covers the
files reaching the bucket; `delivery_status` covers the rep being told. Files
safe in storage with the notification lost is recoverable and has to look
different from a clean success. A row still reading `receiving` or `pending`
means the handler died mid-flight, which is a different fault from `failed`.

**A database failure never costs a submission either.** Every helper in
`src/lib/submissions.ts` swallows its own error and reports it on an
`x-record-error` response header rather than throwing — refusing a customer's
enquiry because our logging is down would be the worse outage. Check that
header when a submission seems to have vanished.

**No IP addresses are stored.** The IP is personal data under PIPEDA and is not
needed to answer an enquiry. `country` came from Cloudflare's `cf-ipcountry`
header, which Railway does not set, so it is empty on Railway; user agent is
still recorded.

**The bucket is private**, so the rep's email carries a presigned download link
per file, valid for seven days (the SigV4 maximum). After that the file is
still in the bucket — open the Bucket in Railway → Files.

Astro's same-origin check rejects a cross-site `POST` with `403 Cross-site POST
form submissions are forbidden`. That is expected, and testing with `curl`
needs an `Origin` header. Behind Railway it only works because `server.mjs`
marks the request as HTTPS when Railway's edge says so — see Hosting below.
Both forms post to a **trailing-slash** action (`/api/contact/`).

### /admin/: the client edits the reps and the contact recipients

`/admin/` (on demand, signed in with `ADMIN_PASSWORD`) edits two things that
used to need a developer:

- **The /ftp/ "Your Rep" list** — add, rename, reorder, remove. The rep a
  customer picks is the one emailed their files. `/ftp/` stays prerendered
  with the built-in list (`DEFAULT_REPS` in `src/lib/settings.ts`) and swaps
  in the live list from `/api/reps/` on load; `/api/ftp/` validates against
  the same table. The last rep cannot be removed.
- **Where /contact/ enquiries go** (also CC'd on file uploads). Until a list
  is saved there, `CONTACT_TO` still applies, so deploying this changed nothing.

Edits apply immediately, with no rebuild. If Postgres is unreachable the
forms fall back to the built-in reps and `CONTACT_TO`, and the admin says it
cannot save. Login is one shared password with a signed, `SameSite=Strict`
cookie (12 hours), and ten wrong attempts lock that address out for 15
minutes. `/admin/` is noindexed on every host, production included.

### The gallery lives in Postgres, and is read at build time

`gallery_items` and `gallery_filters` are the source of truth for `/gallery/`.
`src/data/gallery.ts` remains committed as the seed they were loaded from and
as the fallback.

```
bin/fetch-gallery.mjs   runs BEFORE astro build (see the `build` script)
   -> src/data/gallery.db.json   (gitignored, regenerated every build)
src/lib/gallery-source.ts  prefers that file, else src/data/gallery.ts
```

**The page stays prerendered.** Editing the database changes the site on the
next build, not on every request — the gallery changes perhaps twice a year.

**The read is a separate Node step, not a query in the .astro page.** The only
way a page could see a connection string at build time is `import.meta.env`,
and Vite *inlines* those values into the emitted server bundle. The prebuild
script reads it in plain Node, so nothing secret reaches `dist/`.

**A build without a database still works** and falls back to the committed
module. Both paths were verified to produce byte-identical HTML, which is what
makes the fallback trustworthy rather than merely present. Each build logs
which source it used, and a failed refresh deletes any stale `gallery.db.json`
rather than leaving yesterday's rows looking fresh.

To change the gallery, edit the rows (Railway → Postgres → Data, or `psql`)
and redeploy:

```sql
UPDATE gallery_items SET title = 'New title' WHERE id = 42;
```

`position` is explicit rather than implied by `id`, because the gallery renders
in a fixed order and ordering by an identity column would quietly start lying
the first time a row is replaced.

### SEO is enforced at build time, not audited later

WordPress emitted metadata from a plugin. Astro emits nothing by default, so a
migration silently loses every tag unless it is rebuilt — and nothing anywhere
reports that it happened.

```
seo.config.ts                site-wide: canonical host, OG image, JSON-LD, tokens
src/components/SEO.astro     every tag, one file, Zod-validated props
src/lib/seo.ts               fitting page copy into a 160-char description
bin/check-seo.mjs            lint over dist/client; runs in `npm run build`
```

**The build fails on bad metadata.** `SEO.astro` validates its props with Zod
and throws, naming the page — a missing description, a title over 70, a
description over 160. That is the structural replacement for the box Yoast put
on every edit screen. It is props rather than a content collection because
these are hand-ported Elementor layouts, not markdown with frontmatter;
restructuring nineteen bespoke templates into collections buys nothing the
schema does not already give.

**`JSON.parse` on every JSON-LD block is the point of the lint.** Checking that
the tag merely *exists* is the check that passes while Google discards the
contents over a stray line break. The block is built with `JSON.stringify` from
a real object, so an unescaped control character cannot occur by construction.
Both failure modes are proven, not assumed: breaking a description and
corrupting a block each fail the build.

**What the harvest found, 2026-09-14, while the old site was still up:**

```
verification tokens ..... 0        JSON-LD blocks .......... 0
analytics / tag systems . 0
```

The old site runs **no SEO plugin output at all**. Nothing was at risk of being
lost, and every structured-data block here is therefore **generated, not
carried** — the distinction the kit asks to be recorded. If a token is ever
added before switch-off, it goes in `seo.config.ts` under `verification`.

Current lint output:

```
  pages ............................. 20
  JSON-LD blocks .................... 20
  images with alt text .............. 187
  images marked decorative .......... 54
  images with no alt attribute ...... 0
  failures .......................... 0
```

The 54 decorative images are the clients marquee's duplicated logos, which
carry `alt=""` and `aria-hidden="true"` — correct, not a gap. A lint matching
only `/\salt\s*=/` reports them as faults, because Astro emits the valueless
form `alt`; this one distinguishes all three cases.

**Not done: layer 6, the editor handover (Keystatic).** Nobody at the client
can currently edit a meta description without a code change, and switching off
WordPress removes the only place they can edit anything. That is a deliberate
gap, not an oversight — it needs a decision and its own work.

### Sitemaps

`/sitemap.xml` is a **sitemap index** — the one address `robots.txt` advertises.
Its children mirror how WordPress split this site, so the shape Google has
crawled for years survives the migration:

| New | Replaces | Contents |
|---|---|---|
| `sitemap-pages.xml` | `wp-sitemap-posts-page-1.xml` | 5 pages |
| `sitemap-portfolio.xml` | `wp-sitemap-posts-portfolio-1.xml` | 12 portfolio entries |
| `sitemap-categories.xml` | `wp-sitemap-taxonomies-category-1.xml` | 2 category archives |
| `sitemap-images.xml` | *(no counterpart)* | 195 images across 15 pages |

All generated from the same data modules the pages render from, so adding a
portfolio entry or a gallery image updates the sitemaps with nothing else to
remember.

**Every address comes from `site` in `astro.config.mjs`, and it points at the
preview host today.** *** AT CUTOVER, CHANGE IT TO `https://boldeimaging.com`.
***

That one value drives the sitemaps, the canonical tags and `og:url` together,
which is the point: with the production domain set while the site lives on the
preview, the sitemaps listed `boldeimaging.com` addresses, so opening a sitemap
and clicking anything took you to the **old WordPress site** rather than the
build you were reviewing.

The cost is that the preview no longer canonicalises to the production domain.
Acceptable here and only here — the preview is kept out of search by an
`X-Robots-Tag` header at the edge, which is stronger than a canonical hint. Two
things stop this drifting unnoticed: every build prints `[site] building for …`,
and the SEO lint **fails** if any sitemap `<loc>` uses an origin the pages do
not canonicalise to. A site that canonicalises to addresses its own sitemap
does not list is the classic way to waste a migration, and it is invisible
without that check.

Override for one build without editing the file: `SITE_URL=… npm run build`.

**`lastmod` is carried verbatim from WordPress** (`src/data/lastmod.ts`), not
regenerated. A sitemap claiming every page changed at build time teaches Google
to ignore the field. The two category archives carry none, faithfully:
WordPress omits it from taxonomy sitemaps because a term has no modification
date of its own.

The image sitemap lists full-size files only, never the `-300x225` derivatives,
so a thumbnail never competes with its own original. It emits `<image:loc>` and
nothing else — Google deprecated `<image:caption>`, `<image:title>` and
`<image:license>` in 2022 and ignores them.

**The sitemaps render as a page in a browser**, not as a raw XML tree.
`public/sitemap.xsl` is an XSLT 1.0 stylesheet pulled in by an
`<?xml-stylesheet?>` instruction — the same thing WordPress did with
`wp-sitemap.xsl`, so opening one by hand still shows something readable. The
index draws the set as a diagram (root, spine, a clickable card per child, each
saying what it holds); a leaf sitemap draws a striped table of clickable
addresses, with an images column where there is one.

It is presentation only: a processing instruction is ignored by every XML
parser, so crawlers see byte-for-byte the document they saw before. Verified —
all five still parse with the same root and child counts.

**On a preview host the rendered links are repointed to that host**, by a small
script in the stylesheet, with a banner saying so. The `<loc>` values must keep
declaring `boldeimaging.com` — that is what a crawler reads and what the
canonical tags agree with — but on the preview host every one of those
links would otherwise walk a reviewer straight over to the *old WordPress
site*. The script only runs in a browser, after the transform; crawlers never
execute it, and on the production domain the origins match so it does nothing.

**`server.mjs` sets `Content-Type: text/xsl` for it, deliberately.** A static
server derives `application/xml` from the extension, and Chromium does apply
the transform at that type (tested), but `text/xsl` is what browsers actually
document for XSLT and Firefox and Safari could not be tested from the build
environment. The explicit header costs nothing and removes the question.

XSLT 1.0 because that is what browsers implement — none of them ship 2.0.

The old `/wp-sitemap*.xml` addresses are **not** served here. Keeping old
addresses working is a redirect job at the hosting edge, covering all of them
at once, rather than something to reimplement piecemeal in the app.

### The stage is noindexed — by hostname, in server.mjs

Every response from any host other than `boldeimaging.com` /
`www.boldeimaging.com` carries `X-Robots-Tag: noindex, nofollow, noarchive`:
pages, `robots.txt`, the sitemaps, every image, the API. It is set in
`server.mjs`, because the HTML `<meta name="robots">` tag cannot reach anything
that is not HTML.

**It is an allowlist of production hostnames, never "is this a preview".** The
build is what gets attached to `boldeimaging.com` at cutover, so a rule that
guessed at previews could quietly de-index the client's real site the day it
goes live. The production list is spelled out in two places — `server.mjs`
(the header, per request) and `src/lib/site-mode.ts` (the HTML noindex, per
build) — and the SEO lint fails the build if they ever differ. A request counts
as production if either `Host` or `X-Forwarded-Host` names the client's domain,
so a proxy rewriting one of them errs towards indexable, never the reverse.

**`robots.txt` must keep allowing crawlers, and does.** A `Disallow: /` would
be counterproductive: a crawler that is not allowed to fetch the page can never
see the noindex header, and the address can still surface in results. Allow
the crawl, refuse the index.

### Images: served from this site's own /media

Every image and the hero video are served from `public/media/`, by the same
Node server as the pages, marked `immutable` for a year. Those files are
byte-identical to the Backblaze B2 bucket `boldeimaging-img` — 351 files,
verified by count, bytes and SHA-1 — which stays as the canonical store.

**Why not stream from Backblaze, as the Workers build did.** That `/img` route
only held up because Cloudflare's edge cache sat in front of it. B2 throttles
bursts with `{"code":"too_busy"}`, and one page view asks for ~66 objects, so
without a cache every cold visit hits the throttle. Railway has no edge cache,
and the bytes were already being deployed.

Every image reference in the build was checked against the files on disk: 321
distinct `/media/` addresses, 0 missing.

```bash
PUBLIC_MEDIA_BASE=https://img.boldeimaging.com npm run build   # if images move to their own hostname
```

### Where it is reviewed

**https://stage.boldeimaging.com** once the custom domain is attached in
Railway (see Deploying). Railway's own `*.up.railway.app` address also works
and is noindexed the same way.

`boldeimaging.10xid.com` was the reviewed preview until 2026-10-01, when it was
removed: the Worker Custom Domain was detached in Cloudflare. Its entry in the
shared `10xid.com` noindex rule ("10xid preview hosts — noindex") was left in
place, because that rule also covers three other clients' previews.


## How it is put together

```
src/
  consts.ts              MEDIA_BASE, site details, the four-item menu
  data/                  content scraped from the live site
    portfolio.ts           the twelve portfolio entries, in site order
    home.ts                the three home-page image lists
    gallery.ts             the 116 gallery images and their twelve filters
  styles/
    tokens.css           the Elementor kit's colours, fonts and container width
    fonts.css            self-hosted Titillium Web / Roboto / Open Sans faces
    icons.css            Font Awesome 5 Free + eicons, only the glyphs used
    global.css           the base layer that actually computes on the original
  layouts/Base.astro     head, header, footer
  components/            Header, Footer, ThemeArchive, the two carousels
  pages/                 one file per address, plus 404 and /api/*
public/
  media/                 every image and the hero video, path-preserved
  fonts/                 the webfont files
```

### Hosting

`@astrojs/node` in `standalone` mode, with **every content page prerendered**
(`export const prerender = true`). The adapter is present for one reason: the
`/api/*` routes and `/admin/` stay on demand. A page without `prerender = true`
would be rendered on every request for no reason —
`grep -rL 'prerender = true' src/pages --include='*.astro'` is the check.

`server.mjs` is the entry point. It imports the adapter's handler (with its
own autostart switched off) and wraps it to do what a static host's
`_headers` file used to:

1. **Noindex off production**, by hostname — see "The stage is noindexed".
2. **Cache lifetimes:** `/media/*` immutable for a year, `/sitemap.xsl` an hour
   with `Content-Type: text/xsl`. `/_astro/*` is already immutable from the
   adapter.
3. **Trailing slashes:** a slashless page address (`/contact`) gets a 301 to
   `/contact/`, for GET/HEAD only, and only when that page exists. Astro's own
   `trailingSlash: 'always'` would also redirect POSTs, and a browser follows a
   301 on a POST as a GET, silently dropping a form submission.
4. **HTTPS behind the proxy:** Railway terminates TLS and talks plain HTTP to
   the container, and Astro takes the protocol from the socket alone. Without
   marking the request HTTPS when `X-Forwarded-Proto: https`, Astro sees
   `http://stage…` while the browser sends `Origin: https://stage…`, and its
   same-origin check rejects **every** form submission with a 403.

`src/pages/404.astro` is prerendered and served, with a 404 status, for any
address nothing else matches.

### Images and the hero video

Everything resolves through `MEDIA_BASE` in `src/consts.ts`, which defaults to
`/media` and is served from `public/media` in this repo. **A build has zero
references to the old WordPress server** — verify with:

```bash
npm run build && grep -rE 'boldeimaging\.com/wp-content' dist | head
```

### Forms

`/contact/` and `/ftp/` post to `/api/contact/` and `/api/ftp/`. Both endpoints
validate the submission, record it, and then need configuration to deliver
it — see the variables table under Deploying. Until those are set each
endpoint answers `503` with a message the form shows the visitor, naming the
phone number and email address instead; it never accepts a submission it
cannot deliver. Bad input answers `422` with the specific problem.

Verified locally against Postgres 16 and a mock S3 endpoint before the move:
rows written before delivery, `unconfigured` with no Resend key, both files of
a two-file upload stored with SigV4-signed PUTs and recorded one row each,
`stored` + `failed` when the email was rejected, cross-site POSTs refused.


## What is deliberately identical to the original, oddities included

- **The two category pages are empty.** `/category/exterior/` and
  `/category/interior/` are what the "Our Work" tiles link to, and on the live
  site they render the theme's page header and nothing else — the portfolio
  post type is not in the category archive loop. Ported as-is. Worth raising
  with the client; inventing a listing here would be a redesign, not a port.
- **The near-duplicate greys and blues are kept where they are** (`#3A3A3A`
  header, `#363636` "Be BolDe.", `#454545` galleries band, `#303030`
  copyright). That is Elementor drift on the original, not a mistake to tidy;
  collapsing them into one token would be a visible change.
- **The FTP submit button is the theme's ghost button** (1px `#c36`), not a
  filled one — hello-elementor's link colour showing through an unstyled
  button. Same for the one inline "contact page" link on the home page.
- **The flip boxes fade, they do not flip.** The widget is set to `fade`.
- **The header's left third is empty**, as on the original.
- **The header is transparent only on the home page.** Every other page on the
  live site carries an extra `.sticky-header { background-color:
  rgba(58,58,58,0.5) !important; ... }` rule in its inline `<style>` block, so
  the bar is dark from the top — without it the white logo and white menu would
  sit invisibly on those pages' white backgrounds. The logo shrink stays tied to
  scrolling on every page.

## Known differences from the original

1. **The gallery's row density on phones.** The justified layout is computed in
   the browser, as it is on the original, and the row-break rule here was
   fitted against the live site's own rows: it reproduces 18 of 19 rows exactly
   at 1600px and all sampled rows at 900px, heights included. At 390px the
   original fits two thumbnails per row where this fits three — Elementor's
   rule tips differently at that width and could not be reproduced from the
   outside. The page is still the same 116 images in justified rows.
2. **Spacing lives on the element, not on a wrapper.** Elementor puts a
   widget's 20px bottom margin and any extra padding on a wrapper `div` around
   the heading; here it is on the heading itself. Net spacing is identical —
   every section measures the same height as the original at 1600, 900 and
   390px — but a heading's own box is taller than the original's.
3. **Markup is leaner.** No `<center>` inside menu links, no Elementor wrapper
   divs, `<h1>` for each page title (the original's Elementor pages have no
   `h1` at all, and the page title is an `h2`). Nothing here changes rendering.
4. **The carousels are hand-written**, matching the original's measured Swiper
   parameters: the clients strip is a continuous scroll at one logo per 5s
   (`slidesPerView: 4`, `spaceBetween: 100`, `speed: 5000`, `delay: 0`), and
   the project galleries carousel is 3-per-view with arrows and a 5s autoplay
   that stops for good on interaction (`disableOnInteraction: true`).
5. **The gallery lightbox is a native `<dialog>`** rather than Elementor's, with
   arrow-key navigation and Prev/Next scoped to the active filter.

## Checking a change against the original

`npm run preview`, and compare landmark geometry and
computed styles page by page at 1600 / 900 / 390px. The differences that remain
should be the ones listed above and nothing else.
