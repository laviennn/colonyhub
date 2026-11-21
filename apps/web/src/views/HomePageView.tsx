import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PRODUCTION_ORIGIN,
  alternateUrls,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  canonicalUrl,
  getCategoryName,
  getDictionary,
  localePath,
  serializeJsonLd,
  type Locale,
} from '@colonyhub/content';
import { listPublicArticles } from '@/lib/cms';
import { FloatingChat } from '@/components/FloatingChat';
import { HeroSection } from '@/components/HeroSection';
import { NetworkSection } from '@/components/NetworkSection';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { StatementSection } from '@/components/StatementSection';
import { StoriesSection } from '@/components/StoriesSection';

export function buildBaseLayoutMetadata(): Metadata {
  return {
    metadataBase: new URL(PRODUCTION_ORIGIN),
    openGraph: {
      siteName: 'colonyhub',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'colonyhub: Grow together. Move as one.',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/twitter-image'],
    },
    ...(process.env.VERCEL_ENV === 'preview'
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}

export function buildHomeMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  const canonical = canonicalUrl(locale, '/');
  const languages = alternateUrls('/');

  return {
    title: dict.seo.homeTitle,
    description: dict.seo.homeDescription,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: 'website',
      siteName: 'colonyhub',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: locale === 'id' ? ['en_US'] : ['id_ID'],
      url: canonical,
      title: dict.seo.homeTitle,
      description: dict.seo.homeDescription,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'colonyhub: Grow together. Move as one.',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.seo.homeTitle,
      description: dict.seo.homeDescription,
      images: ['/twitter-image'],
    },
  };
}

export async function HomePageView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const orgJsonLd = serializeJsonLd(
    buildOrganizationJsonLd({ logoUrl: `${PRODUCTION_ORIGIN}/apple-icon` }),
  );
  const siteJsonLd = serializeJsonLd(buildWebSiteJsonLd(locale));
  const latestArticles = (await listPublicArticles({ locale, pageSize: 3 })).items;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: orgJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: siteJsonLd }}
      />

      <SiteHeader locale={locale} dict={dict} currentPath="/" />

      <main id="main">
        {/* 1 · HERO */}
        <HeroSection locale={locale} dict={dict} />

        {/* 2 · NETWORK MAP (Services) */}
        <NetworkSection locale={locale} dict={dict} />

        {/* 3 · STATEMENT (Type moment) */}
        <StatementSection dict={dict} />

        {/* 4 · ROUTE (Approach) */}
        <section className="route" id="route" aria-labelledby="route-title">
          <div className="wrap">
            <div className="route-head">
              <p className="col-label col-label--dark">{dict.route.label}</p>
              <h2 id="route-title">{dict.route.title}</h2>
              <p className="route-lead">{dict.route.lead}</p>
            </div>
            <ol className="route-line">
              {dict.route.steps.map((step) => (
                <li
                  key={step.name}
                  className={step.live ? 'stop stop--live' : 'stop'}
                >
                  <span className="stop-node" aria-hidden="true" />
                  <h3>{step.name}</h3>
                  <p>{step.body}</p>
                  <p className="stop-out mono">
                    <span>{dict.route.out}</span> <span>{step.output}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5 · TICKETS (Seed / Grow / Scale) */}
        <section className="tickets" id="tickets" aria-labelledby="tk-title">
          <div className="wrap">
            <div className="tk-head">
              <p className="col-label col-label--dark">{dict.tk.label}</p>
              <h2 id="tk-title">{dict.tk.title}</h2>
            </div>
            <div className="tk-row">
              <article className="ticket ticket--seed">
                <div className="tk-main">
                  <p className="tk-kind mono">{dict.pkg.seed.kicker}</p>
                  <h3>Seed</h3>
                  <p>{dict.pkg.seed.body}</p>
                </div>
                <dl className="tk-stub mono">
                  <div>
                    <dt>{dict.tk.lines}</dt>
                    <dd>Strategy · Creative · Build</dd>
                  </div>
                  <div>
                    <dt>{dict.tk.term}</dt>
                    <dd>{dict.tk.project}</dd>
                  </div>
                </dl>
                <Link
                  className="tk-link"
                  href={localePath(locale, '/contact?package=seed')}
                  data-cta-id="package_seed_cta"
                  data-cta-location="home_packages"
                >
                  {dict.pkg.seed.cta}
                </Link>
              </article>

              <article className="ticket ticket--grow">
                <div className="tk-main">
                  <p className="tk-kind mono">{dict.pkg.grow.kicker}</p>
                  <h3>Grow</h3>
                  <p>{dict.pkg.grow.body}</p>
                </div>
                <dl className="tk-stub mono">
                  <div>
                    <dt>{dict.tk.lines}</dt>
                    <dd>Growth · Social · Data</dd>
                  </div>
                  <div>
                    <dt>{dict.tk.term}</dt>
                    <dd>{dict.tk.monthly}</dd>
                  </div>
                </dl>
                <Link
                  className="tk-link"
                  href={localePath(locale, '/contact?package=grow')}
                  data-cta-id="package_grow_cta"
                  data-cta-location="home_packages"
                >
                  {dict.pkg.grow.cta}
                </Link>
              </article>

              <article className="ticket ticket--scale">
                <div className="tk-main">
                  <p className="tk-kind mono">{dict.pkg.scale.kicker}</p>
                  <h3>Scale</h3>
                  <p>{dict.pkg.scale.body}</p>
                </div>
                <dl className="tk-stub mono">
                  <div>
                    <dt>{dict.tk.lines}</dt>
                    <dd>{dict.tk.all}</dd>
                  </div>
                  <div>
                    <dt>{dict.tk.term}</dt>
                    <dd>{dict.tk.ongoing}</dd>
                  </div>
                </dl>
                <Link
                  className="tk-link"
                  href={localePath(locale, '/contact?package=scale')}
                  data-cta-id="package_scale_cta"
                  data-cta-location="home_packages"
                >
                  {dict.pkg.scale.cta}
                </Link>
              </article>
            </div>
            <p className="tk-note">{dict.tk.note}</p>
          </div>
        </section>

        {/* 5b · SOCIAL CONTENT SHOWCASE */}
        <StoriesSection locale={locale} dict={dict} />

        {/* 6 · INSIGHTS */}
        <section className="insights" id="insights" aria-labelledby="ins-title">
          <div className="wrap">
            <div className="ins-head">
              <p className="col-label col-label--dark">{dict.ins.label}</p>
              <h2 id="ins-title">{dict.ins.title}</h2>
              <Link className="link-quiet link-quiet--dark" href={localePath(locale, '/insights')}>
                {dict.ins.all}
              </Link>
            </div>
            <ul className="ins-list">
              {latestArticles.map((article) => (
                <li key={article.id}>
                  <Link
                    className="ins-row"
                    href={localePath(locale, `/insights/${article.slug}`)}
                  >
                    <span className="ins-meta mono">
                      {article.isPreviewFixture ? (
                        <span className="ph">{dict.ins.ph}</span>
                      ) : null}
                      <span>{getCategoryName(article.categorySlug, locale)}</span>
                    </span>
                    <span className="ins-title">{article.title}</span>
                    <span
                      className={`ins-art ins-art--${article.artVariant}`}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7 · ABOUT */}
        <section className="about" id="about" aria-labelledby="about-title">
          <div className="wrap about-inner">
            <p className="col-label col-label--dark">{dict.about.label}</p>
            <div>
              <h2 id="about-title">{dict.about.title}</h2>
              <p className="about-lead">{dict.about.lead}</p>
            </div>
            <dl className="values">
              {dict.about.values.map((val) => (
                <div key={val.name}>
                  <dt>{val.name}</dt>
                  <dd>{val.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 8 · CTA */}
        <section className="cta" id="contact" aria-labelledby="cta-title">
          <div className="wrap">
            <h2 className="cta-title" id="cta-title">
              <span className="ct-1">{dict.cta.l1}</span>
              <span className="ct-2">{dict.cta.l2}</span>
            </h2>
            <div className="cta-foot">
              <p>{dict.cta.lead}</p>
              <Link
                className="btn btn--lime btn--lg"
                href={localePath(locale, '/contact')}
                data-cta-id="home_bottom_cta"
                data-cta-location="home_cta"
              >
                <span>{dict.cta.long}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} dict={dict} />

      <FloatingChat dict={dict} />
    </>
  );
}
