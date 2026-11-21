import {
  PREVIEW_ARTICLES,
  getArticleTranslation as getFixtureTranslation,
  getPublishedArticleBySlug as getFixtureBySlug,
  getRelatedArticles as getFixtureRelated,
  type InsightCategorySlug,
  type Locale,
  type PublicArticle,
} from '@colonyhub/content';
import {
  getCmsArticleByLocaleSlug,
  getCmsArticleTranslation,
  listAllCmsArticles,
  type CmsArticle,
} from '@colonyhub/db';

const ART_VARIANTS: Array<PublicArticle['artVariant']> = ['a', 'b', 'c'];

function pickArtVariant(slug: string): PublicArticle['artVariant'] {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return ART_VARIANTS[Math.abs(hash) % ART_VARIANTS.length] ?? 'a';
}

function toInsightArticle(item: CmsArticle): PublicArticle & {
  isDraftPreview?: boolean;
  cmsStatus?: CmsArticle['status'];
} {
  return {
    id: item.id,
    translationGroupId: item.translationGroupId,
    locale: item.locale,
    slug: item.slug,
    title: item.title,
    dek: item.dek,
    categorySlug: item.categorySlug,
    authorName: item.authorName,
    authorRole: {
      en: item.authorRole,
      id: item.authorRole,
    },
    publishedAt: item.publishedAt ?? item.createdAt,
    updatedAt: item.updatedAt,
    featured: item.featured,
    artVariant: pickArtVariant(item.slug),
    isPreviewFixture: false,
    relatedServices: item.relatedServices,
    blocks: item.blocks,
    references: item.references,
    seo:
      item.seo?.title || item.seo?.description
        ? {
            title: item.seo.title,
            description: item.seo.description,
          }
        : undefined,
    isDraftPreview: item.status !== 'published',
    cmsStatus: item.status,
  };
}

export async function listPublicArticles(options: {
  locale: Locale;
  category?: InsightCategorySlug;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.max(1, options.pageSize ?? 6);

  const dbPublished = await listAllCmsArticles({ locale: options.locale, status: 'published' });
  const dbArticles = dbPublished.map(toInsightArticle);

  // Once real published articles exist in Command Center, serve only real published content.
  // Preview fixtures are shown solely as fallback before the first article is published (and marked noindex).
  const sourceArticles =
    dbArticles.length > 0
      ? dbArticles
      : PREVIEW_ARTICLES.filter((a) => a.locale === options.locale);

  const combined = sourceArticles
    .filter((a) => (!options.category ? true : a.categorySlug === options.category))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const total = combined.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: combined.slice(start, start + pageSize),
    total,
    page: safePage,
    totalPages,
  };
}

export type ResolvedPublicArticle =
  | {
      kind: 'found';
      article: PublicArticle & { isDraftPreview?: boolean; cmsStatus?: string };
    }
  | { kind: 'redirect'; toSlug: string }
  | { kind: 'not_found' };

export async function resolvePublicArticle(
  locale: Locale,
  slug: string,
  options?: { includeDraft?: boolean },
): Promise<ResolvedPublicArticle> {
  const res = await getCmsArticleByLocaleSlug(locale, slug, {
    includeDrafts: options?.includeDraft,
  });

  if (res.article) {
    return { kind: 'found', article: toInsightArticle(res.article) };
  }
  if (res.redirectToSlug) {
    return { kind: 'redirect', toSlug: res.redirectToSlug };
  }

  const fixture = getFixtureBySlug(locale, slug);
  if (fixture) {
    return { kind: 'found', article: fixture };
  }

  return { kind: 'not_found' };
}

export async function getPublicArticleTranslation(
  article: PublicArticle,
  targetLocale: Locale,
): Promise<PublicArticle | undefined> {
  if (!article.isPreviewFixture) {
    const match = await getCmsArticleTranslation(article.translationGroupId, targetLocale, {
      includeDrafts: false,
    });
    return match ? toInsightArticle(match) : undefined;
  }
  return getFixtureTranslation(article, targetLocale);
}

export async function getPublicRelatedArticles(
  article: PublicArticle,
  limit = 2,
): Promise<PublicArticle[]> {
  const { items } = await listPublicArticles({ locale: article.locale, pageSize: 20 });
  const related = items.filter((a) => a.id !== article.id).slice(0, limit);
  if (related.length > 0) return related;
  return getFixtureRelated(article, limit);
}

export async function listSitemapPublishedArticles(): Promise<
  Array<{
    locale: Locale;
    slug: string;
    lastmod: string;
    translationGroupId: string;
  }>
> {
  const published = await listAllCmsArticles({ status: 'published' });
  return published.map((a) => ({
    locale: a.locale,
    slug: a.slug,
    lastmod: a.updatedAt || a.publishedAt || a.createdAt,
    translationGroupId: a.translationGroupId,
  }));
}
