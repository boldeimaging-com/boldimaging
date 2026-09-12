/**
 * `lastmod` values carried verbatim from the WordPress sitemaps, so the new
 * site tells crawlers the same modification history the old one did.
 *
 * Taken from wp-sitemap-posts-page-1.xml and wp-sitemap-posts-portfolio-1.xml
 * on the live site. These are WordPress's own post_modified timestamps -- they
 * are not invented here and must not be "refreshed" to the build date. A
 * sitemap that claims every page changed today teaches Google to ignore the
 * field.
 *
 * The two category archives are absent on purpose: WordPress omits lastmod
 * from taxonomy sitemaps, because a term has no modification date of its own.
 */
export const LASTMOD: Readonly<Record<string, string>> = {
  '/': '2021-04-22T13:05:07+00:00',
  '/services/': '2021-04-23T13:13:35+00:00',
  '/ftp/': '2021-04-23T18:27:53+00:00',
  '/contact/': '2021-04-22T15:33:41+00:00',
  '/gallery/': '2025-04-26T17:38:35+00:00',

  '/portfolio/wayfinding/': '2021-04-22T14:36:29+00:00',
  '/portfolio/pylon-signs/': '2021-04-22T14:37:51+00:00',
  '/portfolio/push-thru-signs/': '2021-04-22T14:39:03+00:00',
  '/portfolio/interiors/': '2021-04-22T14:40:23+00:00',
  '/portfolio/hoarding-signs/': '2021-04-22T14:41:57+00:00',
  '/portfolio/cut-out-letters/': '2021-04-22T14:43:14+00:00',
  '/portfolio/construction-development-sales-offices/':
    '2021-04-22T14:44:28+00:00',
  '/portfolio/awnings/': '2021-04-22T14:45:46+00:00',
  '/portfolio/fascia-signs/': '2021-04-22T14:47:07+00:00',
  '/portfolio/custom-signage/': '2021-04-22T14:48:35+00:00',
  '/portfolio/channel-letters/': '2021-04-22T14:50:12+00:00',
  '/portfolio/banners/': '2021-04-22T14:52:44+00:00',
} as const;
