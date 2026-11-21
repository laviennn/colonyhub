import type { Metadata } from 'next';
import Link from 'next/link';
import {
  alternateUrls,
  buildFaqPageJsonLd,
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

export function buildApproachMetadata(locale: Locale): Metadata {
  const pages = getPublicPagesContent(locale);
  const canonical = canonicalUrl(locale, '/approach');
  return {
    title: pages.approachPage.seoTitle,
    description: pages.approachPage.seoDescription,
    alternates: { canonical, languages: alternateUrls('/approach') },
    openGraph: {
      type: 'website',
      siteName: 'colonyhub',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: locale === 'id' ? ['en_US'] : ['id_ID'],
      url: canonical,
      title: pages.approachPage.seoTitle,
      description: pages.approachPage.seoDescription,
      images: [
        { url: '/opengraph-image', width: 1200, height: 630, alt: pages.approachPage.seoTitle },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pages.approachPage.seoTitle,
      description: pages.approachPage.seoDescription,
      images: ['/twitter-image'],
    },
  };
}

export function ApproachPageView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pages = getPublicPagesContent(locale);
  const a = pages.approachPage;
  const faqJsonLd = serializeJsonLd(buildFaqPageJsonLd(a.faq));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />

      <SiteHeader locale={locale} dict={dict} currentPath="/approach" />

      <main id="main">
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: pages.breadcrumbs.home, href: localePath(locale, '/') },
              { label: pages.breadcrumbs.approach },
            ]}
          />
        </div>

        <section className="page-hero" aria-labelledby="approach-h1">
          <div className="wrap page-hero-grid">
            <p className="col-label col-label--dark">{a.label}</p>
            <div className="page-hero-main">
              <h1 id="approach-h1">{a.title}</h1>
              <p className="page-hero-lead">{a.lead}</p>
            </div>
          </div>
        </section>

        <section className="band band--white">
          <div className="wrap band-grid">
            <p className="col-label col-label--dark">{a.principleLabel}</p>
            <div className="band-main">
              <h2>{a.principleTitle}</h2>
              <p className="band-lead">{a.principleBody}</p>
            </div>
          </div>
        </section>

        <section className="band" aria-labelledby="stages-h2">
          <div className="wrap band-grid">
            <p className="col-label col-label--dark">{a.stagesLabel}</p>
            <div className="band-main">
              <h2 id="stages-h2">{a.stagesTitle}</h2>
              <ol className="stage-list">
                {a.stages.map((stage) => (
                  <li
                    key={stage.step}
                    className={stage.live ? 'stage-card stage-card--live' : 'stage-card'}
                  >
                    <div className="stage-head">
                      <span className="stage-step">{stage.step}</span>
                      <h3>{stage.name}</h3>
                    </div>
                    <p className="stage-summary">{stage.summary}</p>
                    <dl className="stage-meta">
                      <div>
                        <dt>{a.inputLabel}</dt>
                        <dd>{stage.clientInput}</dd>
                      </div>
                      <div>
                        <dt>{a.checkpointLabel}</dt>
                        <dd>{stage.checkpoint}</dd>
                      </div>
                      <div>
                        <dt>{a.outputLabel}</dt>
                        <dd>{stage.output}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ol>
              <p className="notice-box">{a.note}</p>
            </div>
          </div>
        </section>

        <section className="band band--white" aria-labelledby="approach-faq-h2">
          <div className="wrap band-grid">
            <p className="col-label col-label--dark">{a.faqLabel}</p>
            <div className="band-main">
              <h2 id="approach-faq-h2">{a.faqTitle}</h2>
              <div className="faq-list">
                {a.faq.map((item) => (
                  <article key={item.question} className="faq-item">
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </article>
                ))}
              </div>
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
              data-cta-id="approach_bottom_cta"
              data-cta-location="approach_cta"
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
