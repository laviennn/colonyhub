import type { Metadata } from 'next';
import {
  alternateUrls,
  canonicalUrl,
  getDictionary,
  getPublicPagesContent,
  localePath,
  type Locale,
} from '@colonyhub/content';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ManageConsentButton } from '@/components/ManageConsentButton';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export function buildPrivacyMetadata(locale: Locale): Metadata {
  const pages = getPublicPagesContent(locale);
  const canonical = canonicalUrl(locale, '/privacy');
  return {
    title: pages.privacyPage.seoTitle,
    description: pages.privacyPage.seoDescription,
    alternates: { canonical, languages: alternateUrls('/privacy') },
    openGraph: {
      type: 'website',
      siteName: 'colonyhub',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: locale === 'id' ? ['en_US'] : ['id_ID'],
      url: canonical,
      title: pages.privacyPage.seoTitle,
      description: pages.privacyPage.seoDescription,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: pages.privacyPage.seoTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pages.privacyPage.seoTitle,
      description: pages.privacyPage.seoDescription,
      images: ['/twitter-image'],
    },
  };
}

export function PrivacyPageView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pages = getPublicPagesContent(locale);
  const p = pages.privacyPage;

  return (
    <>
      <SiteHeader locale={locale} dict={dict} currentPath="/privacy" />

      <main id="main">
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: pages.breadcrumbs.home, href: localePath(locale, '/') },
              { label: pages.breadcrumbs.privacy },
            ]}
          />
        </div>

        <section className="page-hero" aria-labelledby="privacy-h1">
          <div className="wrap page-hero-grid">
            <p className="col-label col-label--dark">{p.label}</p>
            <div className="page-hero-main">
              <h1 id="privacy-h1">{p.title}</h1>
              <p className="page-hero-lead">{p.lead}</p>
            </div>
          </div>
        </section>

        <section className="band band--white">
          <div className="wrap band-grid">
            <p className="col-label col-label--dark">{p.label}</p>
            <div className="band-main">
              <p className="notice-box">{p.draftNotice}</p>

              <div className="legal-prose">
                {p.sections.map((sec) => (
                  <section key={sec.heading}>
                    <h2>{sec.heading}</h2>
                    <p>{sec.body}</p>
                  </section>
                ))}

                <section>
                  <h2>{p.cookieTableTitle}</h2>
                  <div className="cookie-table-wrap">
                    <table className="cookie-table">
                      <thead>
                        <tr>
                          {p.cookieTableHeaders.map((h) => (
                            <th key={h} scope="col">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {p.cookieRows.map((row) => (
                          <tr key={row.category}>
                            <td>
                              <strong>{row.category}</strong>
                            </td>
                            <td className="mono">{row.providers}</td>
                            <td>{row.purpose}</td>
                            <td>{row.basis}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <div style={{ marginTop: 24 }}>
                  <ManageConsentButton
                    label={p.manageConsentButton}
                    className="btn btn--lime"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
