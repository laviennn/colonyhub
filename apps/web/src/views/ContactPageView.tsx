import type { Metadata } from 'next';
import {
  COLONY_UNITS,
  CONTACT_EMAIL,
  CONTACT_INSTAGRAM_HANDLE,
  CONTACT_INSTAGRAM_URL,
  CONTACT_WHATSAPP_DIGITS,
  CONTACT_WHATSAPP_DISPLAY,
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
import { CopyEmailButton } from '@/components/CopyEmailButton';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export type ContactSearchParams = {
  service?: string;
  package?: string;
};

export function buildContactMetadata(locale: Locale): Metadata {
  const pages = getPublicPagesContent(locale);
  const canonical = canonicalUrl(locale, '/contact');
  return {
    title: pages.contactPage.seoTitle,
    description: pages.contactPage.seoDescription,
    alternates: { canonical, languages: alternateUrls('/contact') },
    openGraph: {
      type: 'website',
      siteName: 'colonyhub',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      alternateLocale: locale === 'id' ? ['en_US'] : ['id_ID'],
      url: canonical,
      title: pages.contactPage.seoTitle,
      description: pages.contactPage.seoDescription,
      images: [
        { url: '/opengraph-image', width: 1200, height: 630, alt: pages.contactPage.seoTitle },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pages.contactPage.seoTitle,
      description: pages.contactPage.seoDescription,
      images: ['/twitter-image'],
    },
  };
}

function buildContextMessage(locale: Locale, searchParams: ContactSearchParams): {
  whatsappText: string;
  emailSubject: string;
  contextLabel: string | null;
} {
  const matchedUnit = COLONY_UNITS.find((u) => u.slug === searchParams.service);
  const pkg = searchParams.package?.trim().toLowerCase();
  const validPkg = pkg === 'seed' || pkg === 'grow' || pkg === 'scale' ? pkg.toUpperCase() : null;

  if (matchedUnit) {
    return {
      whatsappText:
        locale === 'id'
          ? `Halo colonyhub, saya ingin memulai konsultasi gratis mengenai ${matchedUnit.officialName}.`
          : `Hi colonyhub, I would like to start a free consultation about ${matchedUnit.officialName}.`,
      emailSubject:
        locale === 'id'
          ? `Konsultasi gratis: ${matchedUnit.officialName}`
          : `Free consultation: ${matchedUnit.officialName}`,
      contextLabel: matchedUnit.officialName,
    };
  }

  if (validPkg) {
    return {
      whatsappText:
        locale === 'id'
          ? `Halo colonyhub, saya ingin mendiskusikan paket ${validPkg} untuk proyek kami.`
          : `Hi colonyhub, I would like to discuss the ${validPkg} collaboration model for our project.`,
      emailSubject:
        locale === 'id' ? `Diskusi paket ${validPkg}: colonyhub` : `${validPkg} model inquiry: colonyhub`,
      contextLabel: locale === 'id' ? `Paket ${validPkg}` : `${validPkg} model`,
    };
  }

  return {
    whatsappText:
      locale === 'id'
        ? 'Halo colonyhub, saya ingin memulai konsultasi gratis untuk proyek kami.'
        : 'Hi colonyhub, I would like to start a free consultation for our project.',
    emailSubject:
      locale === 'id' ? 'Konsultasi gratis: colonyhub' : 'Free consultation: colonyhub',
    contextLabel: null,
  };
}

export function ContactPageView({
  locale,
  searchParams,
}: {
  locale: Locale;
  searchParams: ContactSearchParams;
}) {
  const dict = getDictionary(locale);
  const pages = getPublicPagesContent(locale);
  const c = pages.contactPage;
  const ctx = buildContextMessage(locale, searchParams);

  const whatsappHref = `https://wa.me/${CONTACT_WHATSAPP_DIGITS}?text=${encodeURIComponent(ctx.whatsappText)}`;
  const emailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(ctx.emailSubject)}`;

  const contactJsonLd = serializeJsonLd(
    buildWebPageJsonLd({
      type: 'ContactPage',
      canonical: canonicalUrl(locale, '/contact'),
      name: c.seoTitle,
      description: c.seoDescription,
      inLanguage: locale,
    }),
  );

  const copy =
    locale === 'id'
      ? {
          waTag: 'Respon tercepat',
          waTitle: 'Chat via WhatsApp',
          waBody:
            'Langsung terhubung dengan tim colonyhub untuk memulai sesi konsultasi gratis 30 menit atau berbagi konteks awal proyek Anda.',
          waBtn: 'Chat di WhatsApp',
          emailTag: 'Untuk brief lengkap & RFP',
          emailTitle: 'Kirim email',
          emailBody:
            'Cocok untuk mengirimkan dokumen brief, deck proyek, atau daftar kebutuhan tim lintas unit.',
          emailBtn: 'Kirim brief via email',
          igTag: 'Update & DM cepat',
          igTitle: 'Instagram',
          igBody:
            'Lihat pembaruan visual, eksplorasi desain, dan kirim DM singkat langsung ke tim kami di Instagram.',
          igBtn: 'Ikuti atau DM di Instagram',
          prepTitle: 'Yang membantu kami merespons lebih cepat',
          prepItems: [
            'Tujuan bisnis utama atau masalah yang sedang ingin diselesaikan.',
            'Unit layanan atau model kerja sama (Seed, Grow, Scale) yang paling relevan.',
            'Perkiraan target waktu mulai atau peluncuran.',
          ],
          selectedPrefix: 'Konteks terpilih:',
        }
      : {
          waTag: 'Fastest response',
          waTitle: 'Chat on WhatsApp',
          waBody:
            'Reach the colonyhub team directly to start a free 30-minute consultation or share a quick overview of what you are building.',
          waBtn: 'Start WhatsApp chat',
          emailTag: 'For detailed briefs & decks',
          emailTitle: 'Send an email',
          emailBody:
            'Best when sharing a project brief, RFP document, or multi-unit scope requirements.',
          emailBtn: 'Send brief via email',
          igTag: 'Updates & quick DM',
          igTitle: 'Instagram',
          igBody:
            'Follow our visual notes, creative explorations, or drop a quick DM directly to the colonyhub team.',
          igBtn: 'Follow or DM on Instagram',
          prepTitle: 'What helps us reply faster',
          prepItems: [
            'Your core business objective or the bottleneck you want to solve.',
            'The Colony Units or collaboration model (Seed, Grow, Scale) you have in mind.',
            'Your target timeline or launch window.',
          ],
          selectedPrefix: 'Selected context:',
        };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: contactJsonLd }}
      />

      <SiteHeader locale={locale} dict={dict} currentPath="/contact" />

      <main id="main">
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: pages.breadcrumbs.home, href: localePath(locale, '/') },
              { label: pages.breadcrumbs.contact },
            ]}
          />
        </div>

        <section className="page-hero" aria-labelledby="contact-h1">
          <div className="wrap page-hero-grid">
            <p className="col-label col-label--dark">{c.label}</p>
            <div className="page-hero-main">
              <h1 id="contact-h1">{c.title}</h1>
              <p className="page-hero-lead">{c.lead}</p>
              <p className="contact-location-meta mono">{c.locationLabel}</p>
              {ctx.contextLabel ? (
                <p className="mono" style={{ fontSize: '0.8125rem', color: 'var(--indigo)' }}>
                  {copy.selectedPrefix} {ctx.contextLabel}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap direct-contact-grid">
            <article className="contact-channel-card contact-channel-card--primary">
              <span className="contact-channel-tag mono">{copy.waTag}</span>
              <h2>{copy.waTitle}</h2>
              <p className="contact-channel-value mono">{CONTACT_WHATSAPP_DISPLAY}</p>
              <p className="contact-channel-body">{copy.waBody}</p>
              <div className="contact-channel-actions">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--lime btn--lg"
                  data-cta-id="contact_whatsapp_cta"
                  data-cta-location="contact_page"
                >
                  <span>{copy.waBtn}</span>
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
                </a>
              </div>
            </article>

            <article className="contact-channel-card">
              <span className="contact-channel-tag mono">{copy.emailTag}</span>
              <h2>{copy.emailTitle}</h2>
              <p className="contact-channel-value mono">{CONTACT_EMAIL}</p>
              <p className="contact-channel-body">{copy.emailBody}</p>
              <div className="contact-channel-actions">
                <a
                  href={emailHref}
                  className="btn btn--navy btn--lg"
                  data-cta-id="contact_email_cta"
                  data-cta-location="contact_page"
                >
                  <span>{copy.emailBtn}</span>
                </a>
                <CopyEmailButton locale={locale} />
              </div>
            </article>

            <article className="contact-channel-card">
              <span className="contact-channel-tag mono">{copy.igTag}</span>
              <h2>{copy.igTitle}</h2>
              <p className="contact-channel-value mono">{CONTACT_INSTAGRAM_HANDLE}</p>
              <p className="contact-channel-body">{copy.igBody}</p>
              <div className="contact-channel-actions">
                <a
                  href={CONTACT_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--navy btn--lg"
                  data-cta-id="contact_instagram_cta"
                  data-cta-location="contact_page"
                >
                  <span>{copy.igBtn}</span>
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </article>

            <aside className="contact-prep-card">
              <h2 style={{ fontSize: '1.15rem' }}>{copy.prepTitle}</h2>
              <ul className="bullet-list">
                {copy.prepItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
