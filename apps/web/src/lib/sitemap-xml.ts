export type SitemapIndexEntry = {
  loc: string;
  lastmod: string;
};

export type SitemapUrlEntry = {
  loc: string;
  lastmod: string;
  alternates?: {
    en?: string;
    id?: string;
    'x-default'?: string;
  };
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function renderSitemapIndex(entries: readonly SitemapIndexEntry[]): string {
  const rows = entries
    .map(
      (entry) =>
        `  <sitemap>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n  </sitemap>`,
    )
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    rows,
    '</sitemapindex>',
    '',
  ].join('\n');
}

export function renderUrlSet(entries: readonly SitemapUrlEntry[]): string {
  const rows = entries
    .map((entry) => {
      const lines = [
        '  <url>',
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
      ];
      if (entry.alternates?.en) {
        lines.push(
          `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(entry.alternates.en)}" />`,
        );
      }
      if (entry.alternates?.id) {
        lines.push(
          `    <xhtml:link rel="alternate" hreflang="id" href="${escapeXml(entry.alternates.id)}" />`,
        );
      }
      if (entry.alternates?.['x-default']) {
        lines.push(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(entry.alternates['x-default'])}" />`,
        );
      }
      lines.push('  </url>');
      return lines.join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    rows,
    '</urlset>',
    '',
  ].join('\n');
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
