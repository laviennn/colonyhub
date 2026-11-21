import { PRODUCTION_ORIGIN } from '@colonyhub/content';
import { listSitemapPublishedArticles } from '@/lib/cms';
import { renderSitemapIndex, xmlResponse } from '@/lib/sitemap-xml';

export const dynamic = 'force-dynamic';

const STATIC_LAST_MODIFIED = '2026-11-22T00:00:00.000Z';

/**
 * Sitemap Index (SEO.md §5).
 * Splits public canonical URLs by content type so growing Insights articles and future sections
 * scale cleanly well below Google's 50,000-URL / 50MB per-sitemap limit.
 */
export async function GET() {
  const published = await listSitemapPublishedArticles();
  const insightsLastMod =
    published.length > 0
      ? published
          .map((a) => a.lastmod)
          .sort()
          .at(-1) ?? STATIC_LAST_MODIFIED
      : STATIC_LAST_MODIFIED;

  const xml = renderSitemapIndex([
    { loc: `${PRODUCTION_ORIGIN}/sitemaps/pages.xml`, lastmod: STATIC_LAST_MODIFIED },
    { loc: `${PRODUCTION_ORIGIN}/sitemaps/services.xml`, lastmod: STATIC_LAST_MODIFIED },
    { loc: `${PRODUCTION_ORIGIN}/sitemaps/insights.xml`, lastmod: insightsLastMod },
  ]);
  return xmlResponse(xml);
}
