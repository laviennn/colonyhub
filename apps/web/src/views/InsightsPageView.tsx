import type { Metadata } from 'next';
import Link from 'next/link';
import {
  INSIGHT_CATEGORIES,
  alternateUrls,
  buildWebPageJsonLd,
  canonicalUrl,
  estimateReadingTimeMinutes,
  getCategoryName,
  getDictionary,
  getPublicPagesContent,
  isInsightCategory,
  localePath,
  serializeJsonLd,
  type Locale,
} from '@colonyhub/content';
import { listPublicArticles } from '@/lib/cms';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export type InsightsSearchParams = {
  category?: string;
  page?: string;
};

export function buildInsightsMetadata(
  locale: Locale,
  searchParams: InsightsSearchParams,
): Metadata {
  const pages = getPublicPagesContent(locale);
  const category =
    searchParams.category && isInsightCategory(searchParams.category)
      ? searchParams.category
      : undefined;
  const pageNum = Math.max(1, Number.parseInt(searchParams.page ?? '1', 10) || 1);

  const baseCanonical = canonicalUrl(locale, '/insights');
  // SEO.md §2: normalize ?page=1 to listing canonical; ?page=2+ has self-canonical; filtered views noindex.
  const canonical =
    !category && pageNum > 1 ? `${baseCanonical}?page=${pageNum}` : baseCanonical;

  return {
    title: pages.insightsPage.seoTitle,
    description: pages.insightsPage.seoDescription,
    alternates: category
      ? { canonical }
      : { canonical, languages: alternateUrls('/insights') },
    ...(category ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'website',
      siteName: 'colonyhub',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: locale === 'id' ? ['en_US'] : ['id_ID'],
      url: canonical,
      title: pages.insightsPage.seoTitle,
      description: pages.insightsPage.seoDescription,
      images: [
        { url: '/opengraph-image', width: 1200, height: 630, alt: pages.insightsPage.seoTitle },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pages.insightsPage.seoTitle,
      description: pages.insightsPage.seoDescription,
      images: ['/twitter-image'],
    },
  };
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

export async function InsightsPageView({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: InsightsSearchParams;
}) {
  const dict = getDictionary(locale);
  const pages = getPublicPagesContent(locale);
  const copy = pages.insightsPage;

  const activeCategory =
    searchParams.category && isInsightCategory(searchParams.category)
      ? searchParams.category
      : undefined;
  const requestedPage = Math.max(1, Number.parseInt(searchParams.page ?? '1', 10) || 1);

  const { items, page, totalPages } = await listPublicArticles({
    locale,
    category: activeCategory,
    page: requestedPage,
    pageSize: 6,
  });

  const baseHref = localePath(locale, '/insights');
  const buildPageHref = (targetPage: number) => {
    const qs = new URLSearchParams();
    if (activeCategory) qs.set('category', activeCategory);
    if (targetPage > 1) qs.set('page', String(targetPage));
    const q = qs.toString();
    return q ? `${baseHref}?${q}` : baseHref;
  };

  const collectionJsonLd = serializeJsonLd(
    buildWebPageJsonLd({
      type: 'CollectionPage',
      canonical: canonicalUrl(locale, '/insights'),
      name: copy.seoTitle,
      description: copy.seoDescription,
      inLanguage: locale,
    }),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: collectionJsonLd }}
      />

      <SiteHeader locale={locale} dict={dict} currentPath="/insights" />

      <main id="main">
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: pages.breadcrumbs.home, href: localePath(locale, '/') },
              { label: pages.breadcrumbs.insights },
            ]}
          />
        </div>

        <section className="page-hero" aria-labelledby="insights-h1">
          <div className="wrap page-hero-grid">
            <p className="col-label col-label--dark">{copy.label}</p>
            <div className="page-hero-main">
              <h1 id="insights-h1">{copy.title}</h1>
              <p className="page-hero-lead">{copy.lead}</p>
            </div>
          </div>
        </section>

        <section className="band band--white">
          <div className="wrap">
            <nav className="filter-bar" aria-label={copy.label}>
              <Link
                className="filter-pill"
                href={baseHref}
                aria-current={!activeCategory ? 'true' : undefined}
              >
                {copy.allCategories}
              </Link>
              {INSIGHT_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  className="filter-pill"
                  href={`${baseHref}?category=${cat.slug}`}
                  aria-current={activeCategory === cat.slug ? 'true' : undefined}
                >
                  {cat.name[locale]}
                </Link>
              ))}
            </nav>

            {items.length === 0 ? (
              <div className="empty-state">
                <h2>{copy.emptyTitle}</h2>
                <p style={{ color: 'var(--slate)', maxWidth: '52ch' }}>{copy.emptyBody}</p>
                <Link className="btn btn--lime" href={baseHref}>
                  {copy.emptyReset}
                </Link>
              </div>
            ) : (
              <>
                <div className="article-grid">
                  {items.map((article, idx) => {
                    const isFeatured =
                      idx === 0 && page === 1 && !activeCategory && article.featured;
                    const readMin = estimateReadingTimeMinutes(article.blocks);
                    return (
                      <Link
                        key={article.id}
                        className={
                          isFeatured ? 'article-card article-card--featured' : 'article-card'
                        }
                        href={localePath(locale, `/insights/${article.slug}`)}
                      >
                        <div style={{ display: 'grid', gap: 12 }}>
                          <div className="article-card-meta">
                            {isFeatured ? (
                              <span className="badge-lime">{copy.featuredBadge}</span>
                            ) : null}
                            {article.isPreviewFixture ? (
                              <span className="ph">{copy.previewBadge}</span>
                            ) : null}
                            <span>{getCategoryName(article.categorySlug, locale)}</span>
                          </div>
                          <h2>{article.title}</h2>
                          <p>{article.dek}</p>
                          <div className="article-card-foot">
                            <span>
                              {article.authorName} · {formatDate(article.publishedAt, locale)}
                            </span>
                            <span>
                              {readMin} {copy.minRead}
                            </span>
                          </div>
                        </div>
                        {isFeatured ? (
                          <div
                            className={`article-card-art ins-art--${article.artVariant}`}
                            aria-hidden="true"
                          />
                        ) : null}
                      </Link>
                    );
                  })}
                </div>

                {totalPages > 1 ? (
                  <nav className="pagination" aria-label="Pagination">
                    {page > 1 ? (
                      <Link className="filter-pill" href={buildPageHref(page - 1)}>
                        ← {copy.prevPage}
                      </Link>
                    ) : (
                      <span />
                    )}
                    <span className="mono" style={{ fontSize: '0.8125rem', color: 'var(--slate)' }}>
                      {copy.pageOf} {page} / {totalPages}
                    </span>
                    {page < totalPages ? (
                      <Link className="filter-pill" href={buildPageHref(page + 1)}>
                        {copy.nextPage} →
                      </Link>
                    ) : (
                      <span />
                    )}
                  </nav>
                ) : null}
              </>
            )}
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
