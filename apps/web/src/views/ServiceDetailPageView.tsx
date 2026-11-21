import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  COLONY_UNITS,
  alternateUrls,
  buildFaqPageJsonLd,
  buildServiceJsonLd,
  canonicalUrl,
  getDictionary,
  getPublicPagesContent,
  getServiceDetailBySlug,
  localePath,
  serializeJsonLd,
  type Locale,
} from '@colonyhub/content';
import { TrackPageEvent } from '@/components/AnalyticsBridge';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export function buildServiceDetailMetadata(locale: Locale, slug: string): Metadata {
  const detail = getServiceDetailBySlug(slug);
  if (!detail) return {};
  const path = `/services/${slug}`;
  const canonical = canonicalUrl(locale, path);
  return {
    title: detail.seoTitle[locale],
    description: detail.seoDescription[locale],
    alternates: { canonical, languages: alternateUrls(path) },
    openGraph: {
      type: 'website',
      siteName: 'colonyhub',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: locale === 'id' ? ['en_US'] : ['id_ID'],
      url: canonical,
      title: detail.seoTitle[locale],
      description: detail.seoDescription[locale],
      images: [
        { url: '/opengraph-image', width: 1200, height: 630, alt: detail.seoTitle[locale] },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: detail.seoTitle[locale],
      description: detail.seoDescription[locale],
      images: ['/twitter-image'],
    },
  };
}

export function ServiceDetailPageView({ locale, slug }: { locale: Locale; slug: string }) {
  const unit = COLONY_UNITS.find((u) => u.slug === slug);
  const detail = getServiceDetailBySlug(slug);
  if (!unit || !detail) {
    notFound();
  }

  const dict = getDictionary(locale);
  const pages = getPublicPagesContent(locale);
  const labels = pages.serviceDetail;
  const path = `/services/${unit.slug}`;
  const canonical = canonicalUrl(locale, path);

  const serviceJsonLd = serializeJsonLd(
    buildServiceJsonLd({
      canonical,
      name: unit.officialName,
      serviceType: unit.sub[locale],
      description: detail.seoDescription[locale],
      inLanguage: locale,
    }),
  );

  const faqItems = detail.faq[locale];
  const faqJsonLd = serializeJsonLd(buildFaqPageJsonLd(faqItems));

  const relatedUnits = detail.relatedSlugs
    .map((s) => COLONY_UNITS.find((u) => u.slug === s))
    .filter((u): u is (typeof COLONY_UNITS)[number] => Boolean(u));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serviceJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />
      <TrackPageEvent
        name="service_view"
        payload={{ locale, service_slug: unit.slug }}
      />

      <SiteHeader locale={locale} dict={dict} currentPath={path} />

      <main id="main">
        <section
          className="page-hero page-hero--navy"
          style={{ '--c': unit.color } as React.CSSProperties}
          aria-labelledby="unit-h1"
        >
          <div className="wrap">
            <Breadcrumbs
              dark
              items={[
                { label: pages.breadcrumbs.home, href: localePath(locale, '/') },
                { label: pages.breadcrumbs.services, href: localePath(locale, '/services') },
                { label: unit.officialName },
              ]}
            />
          </div>
          <div className="wrap page-hero-grid" style={{ marginTop: 28 }}>
            <p className="col-label">
              <span className="unit-swatch-bar">
                <i aria-hidden="true" />
                {unit.officialName}
              </span>
            </p>
            <div className="page-hero-main">
              <h1 id="unit-h1">{detail.headline[locale]}</h1>
              <p className="page-hero-lead">{detail.intro[locale]}</p>
              <p className="service-direct-answer">{detail.directAnswer[locale]}</p>
              <div className="page-hero-actions">
                <Link
                  className="btn btn--lime"
                  href={localePath(locale, `/contact?service=${unit.slug}`)}
                  data-cta-id={`service_${unit.slug}_hero_cta`}
                  data-cta-location="service_hero"
                >
                  {labels.ctaButtonPrefix} {unit.officialName}
                </Link>
                <Link className="link-quiet" href={localePath(locale, '/services')}>
                  {labels.allServices}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          className="band band--navy"
          style={{ '--c': unit.color } as React.CSSProperties}
          aria-labelledby="unit-capabilities-h2"
        >
          <div className="wrap band-grid">
            <p className="col-label">{labels.stopsLabel}</p>
            <div className="band-main">
              <h2 id="unit-capabilities-h2" className="band-heading">
                {labels.capabilitiesHeading}
              </h2>
              <div className="stops-grid">
                {unit.stops[locale].map(([name, desc]) => (
                  <article key={name} className="stop-card">
                    <h3>{name}</h3>
                    <p>{desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="band"
          style={{ '--c': unit.color } as React.CSSProperties}
          aria-labelledby="unit-scope-h2"
        >
          <div className="wrap band-grid">
            <p className="col-label col-label--dark">{labels.problemsTitle}</p>
            <div className="band-main">
              <h2 id="unit-scope-h2" className="band-heading">
                {labels.scopeHeading}
              </h2>
              <div className="two-col-cards">
                <div className="spec-card">
                  <h3>{labels.problemsTitle}</h3>
                  <ul className="bullet-list">
                    {detail.problems[locale].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="spec-card">
                  <h3>{labels.deliverablesTitle}</h3>
                  <ul className="bullet-list">
                    {detail.deliverables[locale].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="two-col-cards">
                <div className="spec-card">
                  <h3>{labels.exclusionsTitle}</h3>
                  <ul className="bullet-list">
                    {detail.exclusions[locale].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="spec-card spec-card--navy">
                  <h3>{labels.workflowTitle}</h3>
                  <p style={{ color: 'var(--on-dark-2)' }}>{detail.workflowNote[locale]}</p>
                  <Link className="link-quiet" href={localePath(locale, '/approach')}>
                    {dict.nav.approach} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="band band--white" aria-labelledby="unit-faq-h2">
          <div className="wrap band-grid">
            <p className="col-label col-label--dark">{labels.faqLabel}</p>
            <div className="band-main">
              <h2 id="unit-faq-h2" className="band-heading">
                {labels.faqHeading}
              </h2>
              <div className="faq-list">
                {faqItems.map((item) => (
                  <article key={item.question} className="faq-item">
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="band" aria-labelledby="unit-related-h2">
          <div className="wrap band-grid">
            <p className="col-label col-label--dark">{labels.relatedTitle}</p>
            <div className="band-main">
              <h2 id="unit-related-h2" className="band-heading">
                {labels.relatedHeading}
              </h2>
              <div className="related-links">
                {relatedUnits.map((rel) => (
                  <Link
                    key={rel.slug}
                    className="related-unit-card"
                    href={localePath(locale, `/services/${rel.slug}`)}
                    style={{ '--c': rel.color } as React.CSSProperties}
                  >
                    <span className="swatch" aria-hidden="true" />
                    <strong>{rel.officialName}</strong>
                    <span>{rel.sub[locale]}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="inner-cta">
          <div className="wrap inner-cta-inner">
            <div>
              <h2>
                {labels.ctaButtonPrefix} {unit.officialName}
              </h2>
              <p>{dict.cta.lead}</p>
            </div>
            <Link
              className="btn btn--lime btn--lg"
              href={localePath(locale, `/contact?service=${unit.slug}`)}
              data-cta-id={`service_${unit.slug}_bottom_cta`}
              data-cta-location="service_cta"
            >
              {dict.cta.long}
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
