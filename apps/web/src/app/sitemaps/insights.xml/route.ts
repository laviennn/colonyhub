import { alternateUrls, canonicalUrl, type Locale } from '@colonyhub/content';
import { listSitemapPublishedArticles } from '@/lib/cms';
import { renderUrlSet, xmlResponse, type SitemapUrlEntry } from '@/lib/sitemap-xml';

export const dynamic = 'force-dynamic';

const INDEX_LAST_MODIFIED = '2026-11-21T00:00:00.000Z';

/**
 * Dynamic Insights sitemap.
 * Lists /insights, /id/insights, and every real published article from Colony Command Center
 * with real lastmod timestamps and translation-only symmetric hreflang links.
 * Drafts, archived articles, and preview fixtures are strictly excluded.
 */
export async function GET() {
  const articles = await listSitemapPublishedArticles();
  const byGroup = new Map<string, Partial<Record<Locale, string>>>();
  for (const a of articles) {
    const entry = byGroup.get(a.translationGroupId) ?? {};
    entry[a.locale] = canonicalUrl(a.locale, `/insights/${a.slug}`);
    byGroup.set(a.translationGroupId, entry);
  }

  const latestArticleMod =
    articles.length > 0
      ? articles
          .map((a) => a.lastmod)
          .sort()
          .at(-1) ?? INDEX_LAST_MODIFIED
      : INDEX_LAST_MODIFIED;

  const indexAlternates = alternateUrls('/insights');
  const entries: SitemapUrlEntry[] = [
    { loc: canonicalUrl('en', '/insights'), lastmod: latestArticleMod, alternates: indexAlternates },
    { loc: canonicalUrl('id', '/insights'), lastmod: latestArticleMod, alternates: indexAlternates },
  ];

  for (const article of articles) {
    const group = byGroup.get(article.translationGroupId);
    const hasBoth = Boolean(group?.en && group?.id);
    entries.push({
      loc: canonicalUrl(article.locale, `/insights/${article.slug}`),
      lastmod: article.lastmod,
      ...(hasBoth && group?.en && group?.id
        ? {
            alternates: {
              en: group.en,
              id: group.id,
              'x-default': group.en,
            },
          }
        : {}),
    });
  }

  return xmlResponse(renderUrlSet(entries));
}
