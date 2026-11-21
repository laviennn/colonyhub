import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  COLONY_UNITS,
  PRODUCTION_ORIGIN,
  buildBlogPostingJsonLd,
  canonicalUrl,
  estimateReadingTimeMinutes,
  getCategoryName,
  getDictionary,
  getPublicPagesContent,
  localePath,
  serializeJsonLd,
  type Locale,
  type RichTextBlock,
} from '@colonyhub/content';
import { TrackPageEvent } from '@/components/AnalyticsBridge';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RichTextRenderer } from '@/components/RichTextRenderer';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import {
  getPublicArticleTranslation,
  getPublicRelatedArticles,
  resolvePublicArticle,
} from '@/lib/cms';

function resolveRepresentativeArticleImage(blocks: readonly RichTextBlock[]): string | undefined {
  const firstFigure = blocks.find(
    (b): b is Extract<RichTextBlock, { type: 'figure' }> => b.type === 'figure' && Boolean(b.src),
  );
  if (!firstFigure) return undefined;
  if (/^https?:\/\//i.test(firstFigure.src)) return firstFigure.src;
  const normalized = firstFigure.src.startsWith('/') ? firstFigure.src : `/${firstFigure.src}`;
  return `${PRODUCTION_ORIGIN}${normalized}`;
}

export async function buildArticleMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const draft = await draftMode();
  const resolved = await resolvePublicArticle(locale, slug, { includeDraft: draft.isEnabled });
  if (resolved.kind !== 'found') return {};

  const { article } = resolved;
  const path = `/insights/${article.slug}`;
  const canonical = canonicalUrl(locale, path);
  const otherLocale: Locale = locale === 'en' ? 'id' : 'en';
  const translation = await getPublicArticleTranslation(article, otherLocale);

  // SEO.md §1: Emit symmetric hreflang (en, id, x-default -> en) only when a true published translation exists.
  const languages = translation
    ? {
        [locale]: canonical,
        [otherLocale]: canonicalUrl(otherLocale, `/insights/${translation.slug}`),
        'x-default':
          locale === 'en'
            ? canonical
            : canonicalUrl('en', `/insights/${translation.slug}`),
      }
    : undefined;

  const title = article.seo?.title ?? `${article.title} | colonyhub`;
  const description = article.seo?.description ?? article.dek;
  const isDraftPreview = Boolean(article.isDraftPreview);
  const isFixture = Boolean(article.isPreviewFixture);

  return {
    title,
    description,
    alternates: languages ? { canonical, languages } : { canonical },
    ...(isDraftPreview
      ? { robots: { index: false, follow: false } }
      : isFixture
        ? { robots: { index: false, follow: true } }
        : {}),
    openGraph: {
      type: 'article',
      siteName: 'colonyhub',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      ...(translation ? { alternateLocale: [locale === 'id' ? 'en_US' : 'id_ID'] } : {}),
      url: canonical,
      title,
      description,
      publishedTime: article.publishedAt,
      ...(article.updatedAt ? { modifiedTime: article.updatedAt } : {}),
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/twitter-image'],
    },
  };
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso));
}

export async function ArticleDetailPageView({ locale, slug }: { locale: Locale; slug: string }) {
  const draft = await draftMode();
  const resolved = await resolvePublicArticle(locale, slug, { includeDraft: draft.isEnabled });

  if (resolved.kind === 'redirect') {
    permanentRedirect(localePath(locale, `/insights/${resolved.toSlug}`));
  }
  if (resolved.kind === 'not_found') {
    notFound();
  }

  const { article } = resolved;
  const dict = getDictionary(locale);
  const pages = getPublicPagesContent(locale);
  const copy = pages.articlePage;
  const insightsCopy = pages.insightsPage;

  const otherLocale: Locale = locale === 'en' ? 'id' : 'en';
  const translation = await getPublicArticleTranslation(article, otherLocale);
  const alternateLocaleHref = translation
    ? localePath(otherLocale, `/insights/${translation.slug}`)
    : localePath(otherLocale, '/insights');

  const path = `/insights/${article.slug}`;
  const canonical = canonicalUrl(locale, path);
  const readMin = estimateReadingTimeMinutes(article.blocks);
  const articleImageUrl = resolveRepresentativeArticleImage(article.blocks);

  const blogJsonLd = serializeJsonLd(
    buildBlogPostingJsonLd({
      canonical,
      headline: article.title,
      description: article.dek,
      inLanguage: locale,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      authorName: article.authorName,
      authorRole: article.authorRole[locale],
      ...(articleImageUrl ? { imageUrl: articleImageUrl } : {}),
    }),
  );

  const relatedArticles = await getPublicRelatedArticles(article, 2);
  const relatedUnits = article.relatedServices
    .map((s) => COLONY_UNITS.find((u) => u.slug === s))
    .filter((u): u is (typeof COLONY_UNITS)[number] => Boolean(u));

  return (
    <>
      {!article.isDraftPreview ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: blogJsonLd }}
          />
          <TrackPageEvent
            name="article_view"
            payload={{
              locale,
              article_slug: article.slug,
              category_slug: article.categorySlug,
            }}
          />
        </>
      ) : null}

      <SiteHeader
        locale={locale}
        dict={dict}
        currentPath={path}
        alternateLocaleHref={alternateLocaleHref}
      />

      <main id="main">
        {article.isDraftPreview ? (
          <div
            role="status"
            style={{
              background: 'var(--navy)',
              color: 'var(--white)',
              padding: '12px 0',
              borderBottom: '2px solid var(--lime)',
            }}
          >
            <div
              className="wrap"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                fontSize: '0.875rem',
              }}
            >
              <span>
                <strong style={{ color: 'var(--lime)' }}>DRAFT PREVIEW:</strong>{' '}
                {locale === 'id'
                  ? `Pratinjau privat (${article.cmsStatus ?? 'draft'}). Halaman ini bersifat noindex dan belum tayang ke publik.`
                  : `Private preview (${article.cmsStatus ?? 'draft'}). This page is noindex and not publicly visible.`}
              </span>
              <a
                href={`/api/preview/exit?redirect=${encodeURIComponent(localePath(locale, '/insights'))}`}
                className="mono"
                style={{ color: 'var(--lime)', textDecoration: 'underline' }}
              >
                {locale === 'id' ? 'Keluar pratinjau' : 'Exit preview'}
              </a>
            </div>
          </div>
        ) : null}

        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: pages.breadcrumbs.home, href: localePath(locale, '/') },
              { label: pages.breadcrumbs.insights, href: localePath(locale, '/insights') },
              { label: article.title },
            ]}
          />
        </div>

        <article>
          <header className="article-header">
            <div className="wrap article-header-inner">
              <div className="article-card-meta">
                {article.isPreviewFixture ? (
                  <span className="ph">{insightsCopy.previewBadge}</span>
                ) : null}
                <span>{getCategoryName(article.categorySlug, locale)}</span>
                <span>
                  {readMin} {insightsCopy.minRead}
                </span>
              </div>
              <h1>{article.title}</h1>
              <p className="article-dek">{article.dek}</p>
              <div className="article-byline">
                <span>
                  {copy.authorLabel}: {article.authorName} ({article.authorRole[locale]})
                </span>
                <span>
                  {copy.publishedLabel}:{' '}
                  <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
                </span>
                {article.updatedAt ? (
                  <span>
                    {copy.updatedLabel}:{' '}
                    <time dateTime={article.updatedAt}>{formatDate(article.updatedAt, locale)}</time>
                  </span>
                ) : null}
              </div>
              {article.isPreviewFixture ? (
                <p className="notice-box">{copy.previewNotice}</p>
              ) : null}
              {!translation ? (
                <p className="notice-box">
                  {copy.singleLangNotice}{' '}
                  <Link
                    href={localePath(otherLocale, '/insights')}
                    style={{ color: 'var(--indigo)', fontWeight: 600 }}
                  >
                    {copy.singleLangAction} →
                  </Link>
                </p>
              ) : null}
            </div>
          </header>

          <div className="wrap article-body-wrap">
            <div>
              <RichTextRenderer blocks={article.blocks} />

              {article.references.length > 0 ? (
                <section
                  style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--mist)' }}
                >
                  <h2 style={{ fontSize: '1.25rem', marginBottom: 12 }}>{copy.referencesTitle}</h2>
                  <ul className="bullet-list">
                    {article.references.map((ref) => (
                      <li key={ref.url}>
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--indigo)' }}
                        >
                          {ref.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            <aside className="article-aside">
              {relatedUnits.length > 0 ? (
                <div className="aside-card">
                  <h2>{copy.relatedServicesTitle}</h2>
                  <div className="aside-links">
                    {relatedUnits.map((unit) => (
                      <Link key={unit.slug} href={localePath(locale, `/services/${unit.slug}`)}>
                        {unit.officialName} →
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {relatedArticles.length > 0 ? (
                <div className="aside-card">
                  <h2>{copy.relatedArticlesTitle}</h2>
                  <div className="aside-links">
                    {relatedArticles.map((rel) => (
                      <Link key={rel.id} href={localePath(locale, `/insights/${rel.slug}`)}>
                        {rel.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              <Link className="link-quiet link-quiet--dark" href={localePath(locale, '/insights')}>
                ← {copy.backToInsights}
              </Link>
            </aside>
          </div>
        </article>

        <section className="inner-cta">
          <div className="wrap inner-cta-inner">
            <div>
              <h2>{copy.ctaTitle}</h2>
              <p>{copy.ctaLead}</p>
            </div>
            <Link
              className="btn btn--lime btn--lg"
              href={localePath(locale, '/contact')}
              data-cta-id="article_bottom_cta"
              data-cta-location="article_cta"
            >
              {copy.ctaButton}
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
