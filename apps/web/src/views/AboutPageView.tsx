import type { Metadata } from 'next';
import Link from 'next/link';
import {
  alternateUrls,
  buildWebPageJsonLd,
  canonicalUrl,
  getDictionary,
  getPublicPagesContent,
  localePath,
  serializeJsonLd,
  type Locale,
} from '@colonyhub/content';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export function buildAboutMetadata(locale: Locale): Metadata {
  const pages = getPublicPagesContent(locale);
  const canonical = canonicalUrl(locale, '/about');
  return {
    title: pages.aboutPage.seoTitle,
    description: pages.aboutPage.seoDescription,
    alternates: { canonical, languages: alternateUrls('/about') },
    openGraph: {
      type: 'website',
      siteName: 'colonyhub',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: locale === 'id' ? ['en_US'] : ['id_ID'],
      url: canonical,
      title: pages.aboutPage.seoTitle,
      description: pages.aboutPage.seoDescription,
      images: [
        { url: '/opengraph-image', width: 1200, height: 630, alt: pages.aboutPage.seoTitle },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pages.aboutPage.seoTitle,
      description: pages.aboutPage.seoDescription,
      images: ['/twitter-image'],
    },
  };
}

export function AboutPageView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pages = getPublicPagesContent(locale);
  const a = pages.aboutPage;
  const aboutJsonLd = serializeJsonLd(
    buildWebPageJsonLd({
      type: 'AboutPage',
      canonical: canonicalUrl(locale, '/about'),
      name: a.seoTitle,
      description: a.seoDescription,
      inLanguage: locale,
    }),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: aboutJsonLd }}
      />

      <SiteHeader locale={locale} dict={dict} currentPath="/about" />

      <main id="main">
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: pages.breadcrumbs.home, href: localePath(locale, '/') },
              { label: pages.breadcrumbs.about },
            ]}
          />
        </div>

        <section className="page-hero" aria-labelledby="about-h1">
          <div className="wrap page-hero-grid">
            <p className="col-label col-label--dark">{a.label}</p>
            <div className="page-hero-main">
              <h1 id="about-h1">{a.title}</h1>
              <p className="page-hero-lead">{a.lead}</p>
            </div>
          </div>
        </section>

        <section className="band band--white">
          <div className="wrap band-grid">
            <p className="col-label col-label--dark">{a.purposeLabel}</p>
            <div className="band-main">
              <h2>{a.purposeTitle}</h2>
              <p className="band-lead">{a.purposeBody}</p>
              <div className="two-col-cards">
                <div className="spec-card">
                  <h3>{a.visionTitle}</h3>
                  <p style={{ color: 'var(--slate)' }}>{a.visionBody}</p>
                </div>
                <div className="spec-card">
                  <h3>{a.missionTitle}</h3>
                  <ul className="bullet-list">
                    {a.missionItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap band-grid">
            <p className="col-label col-label--dark">{a.valuesLabel}</p>
            <div className="band-main">
              <h2>{a.valuesTitle}</h2>
              <dl className="values" style={{ gridColumn: 'auto', marginTop: 8 }}>
                {dict.about.values.map((val) => (
                  <div key={val.name}>
                    <dt>{val.name}</dt>
                    <dd>{val.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="band band--mist">
          <div className="wrap band-grid">
            <p className="col-label col-label--dark">{a.whoLabel}</p>
            <div className="band-main">
              <h2>{a.whoTitle}</h2>
              <div className="audience-grid">
                {a.audiences.map((aud) => (
                  <article key={aud.title} className="audience-card">
                    <h3>{aud.title}</h3>
                    <p>{aud.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="band band--white">
          <div className="wrap band-grid">
            <p className="col-label col-label--dark">{a.teamLabel}</p>
            <div className="band-main">
              <h2>{a.teamTitle}</h2>
              <p className="notice-box">{a.teamBody}</p>
            </div>
          </div>
        </section>

        <section className="inner-cta">
          <div className="wrap inner-cta-inner">
            <div>
              <h2>{a.ctaTitle}</h2>
              <p>{a.ctaLead}</p>
            </div>
            <Link
              className="btn btn--lime btn--lg"
              href={localePath(locale, '/contact')}
              data-cta-id="about_bottom_cta"
              data-cta-location="about_cta"
            >
              {a.ctaButton}
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
