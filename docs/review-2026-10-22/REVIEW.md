# Bolde Imaging review 22 October 2026

Website Desk site 0003. Source: boldeimaging-com/boldimaging main 3475cc2. Old WordPress: https://boldeimaging.com/. Astro staging: https://stage.boldeimaging.com/. Production remains unchanged.

## Baseline and scope
Read current Neon site/job0007 and domain records, repository README, source design comments, open PR6, SEO/build/configuration and Railway metadata. Compared all 19 main, category and portfolio URLs on old WordPress and Astro: each returned 200. See routes-before.json. Five primary pages retain headings and form counts (contact and FTP each have one). Image element counts differ because WordPress uses background/lazy gallery images and Astro emits image markup; counts alone do not establish image loss or complete visual parity. The original Elementor measurements, Titillium typography and brand colours remain the design baseline.

Railway project 854c1ea7-98f6-4b03-83c8-559994aa5e69 (boldeimaging-stage), environment e5379f81-83d2-4111-8714-7b8fff14e136 (named production by Railway, but this project serves staging), service 521f9b50-c053-45c3-9270-e236d605b3d1 web. Domains are stage.boldeimaging.com and web-production-26ee5.up.railway.app only. Previous successful deployment 4d6b35da-5213-4d32-87ae-aee52576ad9e. Old WordPress remains separately reachable. GoDaddy registrar/DNS records retained, not independently reverified.

## Changes
Reviewed and cherry-picked the six functional commits from existing PR6, preserving authorship: distinct navigation labels, darker solid navigation background and active state, readable contact/FTP text and submit colour, darker hero/about overlays, close mobile menu when keyboard focus leaves it, and max-width on the FTP file input. PR6 itself was not merged.

Added a descriptive Mississauga signage title/description to /services/, a direct request-a-quote link and gallery link with scoped spacing and visible focus treatment. Corrected portfolio item headings from H3 to H2 beneath the page H1 without changing their CSS class. Changed /contact/ title to Request a Signage Quote with business/location context. Existing facts, imagery, forms, APIs, admin, migrations, canonical/sitemap logic and tracking were preserved.

Affected files: src/components/Header.astro; src/components/Footer.astro; src/pages/index.astro; src/pages/contact.astro; src/pages/ftp.astro; src/pages/services.astro; src/styles/tokens.css.

## Verification and accepted limitations
npm ci completed. npm run build exited 0: preview noindex mode, 7 prerendered pages, 7 JSON-LD blocks, 174 images with alt, 42 decorative images, zero missing alt and zero SEO lint failures. Services/category/portfolio pages render on demand and are not included in the seven static pages. Local gallery uses committed fallback because no database credentials were copied. git diff --check passed. Reviewed the complete source diff and existing PR6 patch.

Automated browser/viewport checks, complete visual parity, gallery interaction and successful CAPTCHA/form/upload/database/email tests were not performed in this run; explicitly waived by the user 22 October 2026. No real lead, upload or external test message was sent. These are accepted limitations, not passed tests. No SEO ranking, conversion uplift or tracking delivery result is claimed.

## Deployment and rollback
Publish only the reviewed feature branch and pin staging to its full remote SHA. Keep existing staging bindings, database and upload services. No new migration is added. Record deployment completion and ID separately in Neon and handoff. Existing source deployment rollback is 4d6b35da-5213-4d32-87ae-aee52576ad9e; a rollback does not reverse database writes. Production deployment and DNS/cutover remain the user's responsibility.

For future manual production release: review the PR and accepted limitations; preserve WordPress recovery/backups; use the approved SHA; set production SITE_URL deliberately; retain required secrets/bindings; verify canonical/sitemap origins and remove staging noindex only for production. Check navigation, gallery, contact/FTP behavior and delivered notifications after cutover as desired. Restore the prior production host/configuration if necessary. Do not assume the staging project name or Railway environment label authorizes production changes.
