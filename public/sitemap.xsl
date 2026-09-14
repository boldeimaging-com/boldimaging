<?xml version="1.0" encoding="UTF-8"?>
<!--
  Makes the sitemaps readable in a browser.

  A sitemap is XML, so opening one shows a raw tree or a "no style information"
  warning. WordPress attached wp-sitemap.xsl for exactly this reason, and the
  old site's sitemaps rendered as a real page; this restores that.

  It is presentation only. The xml-stylesheet instruction that pulls this in is
  a processing instruction, which every XML parser ignores, so crawlers see
  precisely the same document they did before.

  XSLT 1.0 deliberately: it is what browsers implement, and none of them ship
  2.0. One stylesheet handles both document shapes — <sitemapindex> renders as
  a diagram of the set, <urlset> as a table of addresses.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  exclude-result-prefixes="s image">

<xsl:output method="html" encoding="UTF-8" indent="yes"
  doctype-system="about:legacy-compat" />

<xsl:template match="/">
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <!-- A sitemap rendered for a human is not a page worth indexing. -->
      <meta name="robots" content="noindex,follow" />
      <title>XML Sitemap – BolDe Imaging</title>
      <style>
        /* Tokens lifted from the site so this does not look like a stray page:
           #3a3a3a is the header and footer band, #018be3 the brand blue. */
        :root {
          --ink: #3a3a3a;
          --muted: #7a7a7a;
          --blue: #018be3;
          --line: #e3e6e8;
          --stripe: #f6f7f8;
          --bg: #fff;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          background: var(--bg);
          color: var(--ink);
          font: 16px/1.6 'Titillium Web', -apple-system, BlinkMacSystemFont,
                'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        .bar { background: var(--ink); height: 6px; }
        .wrap { max-width: 1140px; margin: 0 auto; padding: 32px 20px 64px; }
        h1 { font-size: 30px; margin: 24px 0 8px; font-weight: 600; letter-spacing: .2px; }
        .lede { color: var(--muted); margin: 0 0 4px; max-width: 70ch; }
        a { color: var(--blue); text-decoration: none; word-break: break-word; }
        a:hover, a:focus-visible { text-decoration: underline; }

        .count {
          display: inline-block; margin: 18px 0 24px; padding: 6px 12px;
          background: var(--stripe); border: 1px solid var(--line);
          border-radius: 999px; font-size: 14px; color: var(--muted);
        }
        .count strong { color: var(--ink); }

        /* The index as a diagram: one root, a spine, a card per child. */
        .graph { margin: 8px 0 0; }
        .root {
          display: inline-block; padding: 10px 16px; border-radius: 8px;
          background: var(--ink); color: #fff; font-weight: 600; font-size: 15px;
        }
        .branches { list-style: none; margin: 0; padding: 0 0 0 26px; position: relative; }
        /* The vertical spine, ending at the last child's elbow rather than
           running past it. */
        .branches::before {
          content: ''; position: absolute; left: 0; top: 0;
          width: 2px; height: calc(100% - 28px); background: var(--line);
        }
        .branches li { position: relative; padding: 14px 0 0 26px; }
        .branches li::before {             /* the elbow into each card */
          content: ''; position: absolute; left: 0; top: 42px;
          width: 24px; height: 2px; background: var(--line);
        }
        .node {
          display: block; padding: 14px 18px; border: 1px solid var(--line);
          border-left: 4px solid var(--blue); border-radius: 8px;
          background: #fff; transition: background .15s, border-color .15s;
        }
        .node:hover, .node:focus-within { background: var(--stripe); border-left-color: var(--ink); }
        .node .name { font-weight: 600; font-size: 16px; }
        .node .url { display: block; color: var(--muted); font-size: 13px; margin-top: 2px; }
        .node .what { display: block; color: var(--muted); font-size: 13px; margin-top: 6px; }

        table { border-collapse: collapse; width: 100%; margin-top: 8px; font-size: 15px; }
        caption { text-align: left; color: var(--muted); font-size: 14px; padding-bottom: 8px; }
        th, td { text-align: left; padding: 11px 14px; border-bottom: 1px solid var(--line); }
        th { background: var(--ink); color: #fff; font-weight: 600; font-size: 14px; }
        tbody tr:nth-child(odd) { background: var(--stripe); }
        tbody tr:hover { background: #eef6fc; }
        td.num { text-align: right; color: var(--muted); white-space: nowrap; }
        td.when { color: var(--muted); white-space: nowrap; font-variant-numeric: tabular-nums; }

        .back { display: inline-block; margin-top: 28px; font-size: 14px; }
        footer { margin-top: 40px; color: var(--muted); font-size: 13px; }

        /* Phone: the table would otherwise force the page to scroll sideways. */
        @media (max-width: 700px) {
          h1 { font-size: 24px; }
          .scroll { overflow-x: auto; }
          table { min-width: 560px; }
          .branches li { padding-left: 18px; }
        }
      </style>
    </head>
    <body>
      <div class="bar"></div>
      <div class="wrap">
        <xsl:apply-templates select="s:sitemapindex | s:urlset" />
        <footer>
          Presentation only — crawlers read the same XML either way.
          <a href="https://www.sitemaps.org/protocol.html">About the sitemap protocol</a>.
        </footer>
      </div>
    </body>
  </html>
</xsl:template>

<!-- ============================ the index ============================ -->
<xsl:template match="s:sitemapindex">
  <h1>XML Sitemap</h1>
  <p class="lede">
    The index for boldeimaging.com. It points at one sitemap per kind of page,
    mirroring how the site was split under WordPress.
  </p>
  <p class="count">
    <strong><xsl:value-of select="count(s:sitemap)" /></strong>
    <xsl:text> sitemaps in this index</xsl:text>
  </p>

  <div class="graph">
    <span class="root">/sitemap.xml</span>
    <ul class="branches">
      <xsl:for-each select="s:sitemap">
        <li>
          <a class="node" href="{s:loc}">
            <span class="name">
              <!-- Last path segment, e.g. "sitemap-portfolio.xml". Recursion is
                   how XSLT 1.0 does "split on the last delimiter". -->
              <xsl:call-template name="after-last-slash">
                <xsl:with-param name="text" select="s:loc" />
              </xsl:call-template>
            </span>
            <span class="url"><xsl:value-of select="s:loc" /></span>
            <span class="what">
              <xsl:call-template name="describe">
                <xsl:with-param name="loc" select="s:loc" />
              </xsl:call-template>
            </span>
          </a>
        </li>
      </xsl:for-each>
    </ul>
  </div>
</xsl:template>

<!-- ======================= a urlset (leaf sitemap) ======================= -->
<xsl:template match="s:urlset">
  <h1>XML Sitemap</h1>
  <p class="lede">
    Addresses in this sitemap. Every one is a page on boldeimaging.com — follow
    any of them, or go back up to the index.
  </p>
  <p class="count">
    <strong><xsl:value-of select="count(s:url)" /></strong>
    <xsl:text> URLs</xsl:text>
    <xsl:if test="count(//image:image) &gt; 0">
      <xsl:text>, </xsl:text>
      <strong><xsl:value-of select="count(//image:image)" /></strong>
      <xsl:text> images</xsl:text>
    </xsl:if>
  </p>

  <div class="scroll">
    <table>
      <thead>
        <tr>
          <th>URL</th>
          <xsl:if test="count(//image:image) &gt; 0"><th>Images</th></xsl:if>
          <xsl:if test="count(s:url/s:lastmod) &gt; 0"><th>Last modified</th></xsl:if>
        </tr>
      </thead>
      <tbody>
        <xsl:for-each select="s:url">
          <tr>
            <td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td>
            <xsl:if test="count(//image:image) &gt; 0">
              <td class="num"><xsl:value-of select="count(image:image)" /></td>
            </xsl:if>
            <xsl:if test="count(//s:url/s:lastmod) &gt; 0">
              <td class="when">
                <!-- Just the date; the time of day is noise at this scale. -->
                <xsl:value-of select="substring(s:lastmod, 1, 10)" />
              </td>
            </xsl:if>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </div>

  <a class="back" href="/sitemap.xml">&#8592; Back to the sitemap index</a>
</xsl:template>

<!-- ============================== helpers ============================== -->

<!-- XSLT 1.0 has no "last index of", so chew through the string recursively. -->
<xsl:template name="after-last-slash">
  <xsl:param name="text" />
  <xsl:choose>
    <xsl:when test="contains($text, '/')">
      <xsl:call-template name="after-last-slash">
        <xsl:with-param name="text" select="substring-after($text, '/')" />
      </xsl:call-template>
    </xsl:when>
    <xsl:otherwise><xsl:value-of select="$text" /></xsl:otherwise>
  </xsl:choose>
</xsl:template>

<xsl:template name="describe">
  <xsl:param name="loc" />
  <xsl:choose>
    <xsl:when test="contains($loc, 'sitemap-pages')">
      The standalone pages: home, Our Work, FTP, Contact and Gallery.
    </xsl:when>
    <xsl:when test="contains($loc, 'sitemap-portfolio')">
      One entry per signage type in the portfolio.
    </xsl:when>
    <xsl:when test="contains($loc, 'sitemap-categories')">
      The interior and exterior category archives.
    </xsl:when>
    <xsl:when test="contains($loc, 'sitemap-images')">
      Every image on the site, listed against the page it appears on.
    </xsl:when>
    <xsl:otherwise>A sitemap in this set.</xsl:otherwise>
  </xsl:choose>
</xsl:template>

</xsl:stylesheet>
