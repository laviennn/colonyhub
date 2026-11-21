<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>XML Sitemap — colonyhub</title>
        <style>
          :root {
            --navy: #0B1230;
            --periwinkle: #8A94F2;
            --lime: #C6F432;
            --cloud: #F6F4EE;
            --slate: #5A6178;
            --mist: #E4E6F0;
            --indigo: #3F4BB8;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--cloud);
            color: var(--navy);
            font: 400 15px/1.6 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          header {
            background: var(--navy);
            color: var(--cloud);
            padding: 36px 24px;
            border-bottom: 1px solid rgba(138, 148, 242, 0.28);
          }
          .wrap { max-width: 1120px; margin: 0 auto; }
          .brand {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            color: var(--lime);
          }
          h1 { margin: 8px 0 6px; font-size: 28px; letter-spacing: -0.03em; }
          header p { margin: 0; color: #BFC3D9; max-width: 66ch; font-size: 14px; }
          header a { color: var(--lime); }
          main { padding: 32px 24px 64px; }
          .meta-bar {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 18px;
            font-size: 13px;
            color: var(--slate);
          }
          .count {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            background: var(--navy);
            color: var(--lime);
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-weight: 600;
          }
          .back {
            color: var(--indigo);
            text-decoration: none;
            font-weight: 600;
          }
          .back:hover { text-decoration: underline; }
          .table-wrap {
            background: #fff;
            border: 1px solid var(--mist);
            border-radius: 16px;
            overflow-x: auto;
          }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th {
            padding: 13px 16px;
            font: 600 12px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--slate);
            background: var(--cloud);
            border-bottom: 1px solid var(--mist);
          }
          td {
            padding: 13px 16px;
            border-bottom: 1px solid var(--mist);
            vertical-align: top;
            font-size: 14px;
          }
          tr:last-child td { border-bottom: 0; }
          tr:hover td { background: #FAF9F6; }
          td a {
            color: var(--indigo);
            text-decoration: none;
            word-break: break-all;
            font-weight: 500;
          }
          td a:hover { text-decoration: underline; }
          .mono {
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 12.5px;
            color: var(--slate);
            white-space: nowrap;
          }
          .alts { display: flex; flex-wrap: wrap; gap: 6px; }
          .pill {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 999px;
            background: var(--mist);
            color: var(--navy);
            font: 500 11.5px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
            text-decoration: none;
          }
          .pill:hover { background: var(--periwinkle); color: var(--navy); text-decoration: none; }
        </style>
      </head>
      <body>
        <header>
          <div class="wrap">
            <span class="brand">colonyhub · XML Sitemap</span>
            <xsl:choose>
              <xsl:when test="sm:sitemapindex">
                <h1>Sitemap Index</h1>
                <p>This XML Sitemap Index lists all public sub-sitemaps for <a href="https://colonyhub.id">colonyhub.id</a>, grouped by content type for search engine crawlers.</p>
              </xsl:when>
              <xsl:otherwise>
                <h1>XML Sitemap</h1>
                <p>Canonical, indexable URLs for <a href="https://colonyhub.id">colonyhub.id</a> with localized EN/ID alternates. Search engines read the raw XML directly.</p>
              </xsl:otherwise>
            </xsl:choose>
          </div>
        </header>
        <main>
          <div class="wrap">
            <xsl:choose>
              <xsl:when test="sm:sitemapindex">
                <div class="meta-bar">
                  <span>
                    <span class="count"><xsl:value-of select="count(sm:sitemapindex/sm:sitemap)" /></span>
                    <xsl:text> sub-sitemaps</xsl:text>
                  </span>
                </div>
                <div class="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Sitemap URL</th>
                        <th>Last Modified</th>
                      </tr>
                    </thead>
                    <tbody>
                      <xsl:for-each select="sm:sitemapindex/sm:sitemap">
                        <tr>
                          <td>
                            <a href="{sm:loc}"><xsl:value-of select="sm:loc" /></a>
                          </td>
                          <td class="mono"><xsl:value-of select="sm:lastmod" /></td>
                        </tr>
                      </xsl:for-each>
                    </tbody>
                  </table>
                </div>
              </xsl:when>
              <xsl:otherwise>
                <div class="meta-bar">
                  <span>
                    <span class="count"><xsl:value-of select="count(sm:urlset/sm:url)" /></span>
                    <xsl:text> canonical URLs</xsl:text>
                  </span>
                  <a class="back" href="/sitemap.xml">&#8592; Back to Sitemap Index</a>
                </div>
                <div class="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>URL</th>
                        <th>Alternates (hreflang)</th>
                        <th>Last Modified</th>
                      </tr>
                    </thead>
                    <tbody>
                      <xsl:for-each select="sm:urlset/sm:url">
                        <tr>
                          <td>
                            <a href="{sm:loc}"><xsl:value-of select="sm:loc" /></a>
                          </td>
                          <td>
                            <div class="alts">
                              <xsl:for-each select="xhtml:link[@rel='alternate']">
                                <a class="pill" href="{@href}"><xsl:value-of select="@hreflang" /></a>
                              </xsl:for-each>
                            </div>
                          </td>
                          <td class="mono"><xsl:value-of select="sm:lastmod" /></td>
                        </tr>
                      </xsl:for-each>
                    </tbody>
                  </table>
                </div>
              </xsl:otherwise>
            </xsl:choose>
          </div>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
