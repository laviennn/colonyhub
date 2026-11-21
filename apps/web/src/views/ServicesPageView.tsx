import type { Metadata } from 'next';
import Link from 'next/link';
import {
  COLONY_UNITS,
  alternateUrls,
  buildFaqPageJsonLd,
  buildServicesItemListJsonLd,
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

export function buildServicesMetadata(locale: Locale): Metadata {
  const pages = getPublicPagesContent(locale);
  const canonical = canonicalUrl(locale, '/services');
  return {
    title: pages.servicesPage.seoTitle,
    description: pages.servicesPage.seoDescription,
    alternates: { canonical, languages: alternateUrls('/services') },
    openGraph: {
      type: 'website',
      siteName: 'colonyhub',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: locale === 'id' ? ['en_US'] : ['id_ID'],
      url: canonical,
      title: pages.servicesPage.seoTitle,
      description: pages.servicesPage.seoDescription,
      images: [
        { url: '/opengraph-image', width: 1200, height: 630, alt: pages.servicesPage.seoTitle },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pages.servicesPage.seoTitle,
      description: pages.servicesPage.seoDescription,
      images: ['/twitter-image'],
    },
  };
}

export function ServicesPageView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pages = getPublicPagesContent(locale);
  const s = pages.servicesPage;
  const canonical = canonicalUrl(locale, '/services');

  const itemListJsonLd = serializeJsonLd(
    buildServicesItemListJsonLd({
      canonical,
      name: s.seoTitle,
      items: COLONY_UNITS.map((unit) => ({
        name: unit.officialName,
        description: unit.sub[locale],
        url: canonicalUrl(locale, `/services/${unit.slug}`),
      })),
    }),
  );

  const faqJsonLd = serializeJsonLd(buildFaqPageJsonLd(s.faq));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: itemListJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />

      <SiteHeader locale={locale} dict={dict} currentPath="/services" />

      <main id="main">
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: pages.breadcrumbs.home, href: localePath(locale, '/') },
              { label: pages.breadcrumbs.services },
            ]}
          />
        </div>

        <section className="page-hero" aria-labelledby="services-h1">
          <div className="wrap page-hero-grid">
            <p className="col-label col-label--dark">{s.label}</p>
            <div className="page-hero-main">
              <h1 id="services-h1">{s.title}</h1>
              <p className="page-hero-lead">{s.lead}</p>
            </div>
          </div>
        </section>

        <section className="band band--white" aria-label={dict.a11y.colonyUnits}>
          <div className="wrap">
            <ul className="service-index">
              {COLONY_UNITS.map((unit, idx) => (
                <li key={unit.slug}>
                  <Link
                    className="service-row"
                    href={localePath(locale, `/services/${unit.slug}`)}
                    style={{ '--c': unit.color } as React.CSSProperties}
                  >
                    <span className="service-row-num">
                      <i aria-hidden="true" />
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h2 className="service-row-title">{unit.officialName}</h2>
                      <p className="service-row-sub">{unit.sub[locale]}</p>
                    </div>
                    <div className="service-row-stops">
                      {unit.stops[locale].map(([name]) => (
                        <span key={name} className="stop-pill">
                          {name}
                        </span>
                      ))}
                    </div>
                    <span className="service-row-go">{s.exploreUnit} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="tickets" id="models" aria-labelledby="models-h2">
          <div className="wrap">
            <div className="tk-head">
              <p className="col-label col-label--dark">{s.modelsLabel}</p>
              <h2 id="models-h2">{s.modelsTitle}</h2>
              <p className="route-lead">{s.modelsLead}</p>
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
                  data-cta-id="services_package_seed_cta"
                  data-cta-location="services_models"
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
                  data-cta-id="services_package_grow_cta"
                  data-cta-location="services_models"
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
                  data-cta-id="services_package_scale_cta"
                  data-cta-location="services_models"
                >
                  {dict.pkg.scale.cta}
                </Link>
              </article>
            </div>
            <p className="tk-note">{dict.tk.note}</p>

            <div className="compare-block">
              <h3>{s.compareTitle}</h3>
              <div className="compare-table-wrap">
                <table className="compare-table">
                  <thead>
                    <tr>
                      {s.compareHeaders.map((header) => (
                        <th key={header} scope="col">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.compareRows.map((row) => (
                      <tr key={row.model}>
                        <td>{row.model}</td>
                        <td>{row.units}</td>
                        <td>{row.cadence}</td>
                        <td>{row.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="band band--white" aria-labelledby="services-faq-h2">
          <div className="wrap band-grid">
            <p className="col-label col-label--dark">{s.faqLabel}</p>
            <div className="band-main">
              <h2 id="services-faq-h2">{s.faqTitle}</h2>
              <div className="faq-list">
                {s.faq.map((item) => (
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
              <h2>{s.ctaTitle}</h2>
              <p>{s.ctaLead}</p>
            </div>
            <Link
              className="btn btn--lime btn--lg"
              href={localePath(locale, '/contact')}
              data-cta-id="services_bottom_cta"
              data-cta-location="services_cta"
            >
              {s.ctaButton}
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
