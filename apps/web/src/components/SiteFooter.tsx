import Link from 'next/link';
import {
  COLONY_UNITS,
  CONTACT_EMAIL,
  CONTACT_INSTAGRAM_HANDLE,
  CONTACT_INSTAGRAM_URL,
  CONTACT_WHATSAPP_DIGITS,
  localePath,
  type Dictionary,
  type Locale,
} from '@colonyhub/content';
import { ManageConsentButton } from '@/components/ManageConsentButton';

type SiteFooterProps = {
  locale: Locale;
  dict: Dictionary;
};

export function SiteFooter({ locale, dict }: SiteFooterProps) {
  const waHref = `https://wa.me/${CONTACT_WHATSAPP_DIGITS}?text=${encodeURIComponent(dict.chat.defaultMessage)}`;

  return (
    <footer className="site-footer">
      <div className="wrap footer-cols">
        <div>
          <p className="f-title">{dict.nav.services}</p>
          <ul>
            {COLONY_UNITS.map((unit) => (
              <li key={unit.slug}>
                <Link href={localePath(locale, `/services/${unit.slug}`)}>
                  {unit.officialName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="f-title">{dict.ft.company}</p>
          <ul>
            <li>
              <Link href={localePath(locale, '/approach')}>{dict.nav.approach}</Link>
            </li>
            <li>
              <Link href={localePath(locale, '/insights')}>{dict.nav.insights}</Link>
            </li>
            <li>
              <Link href={localePath(locale, '/about')}>{dict.nav.about}</Link>
            </li>
            <li>
              <Link href={localePath(locale, '/contact')}>{dict.ft.contact}</Link>
            </li>
            <li>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                data-cta-id="footer_whatsapp_link"
                data-cta-location="footer"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                data-cta-id="footer_email_link"
                data-cta-location="footer"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={CONTACT_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cta-id="footer_instagram_link"
                data-cta-location="footer"
              >
                Instagram ({CONTACT_INSTAGRAM_HANDLE})
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="f-title">{dict.ft.legal}</p>
          <ul>
            <li>
              <Link href={localePath(locale, '/privacy')}>{dict.ft.privacy}</Link>
            </li>
            <li>
              <ManageConsentButton
                label={locale === 'id' ? 'Pengaturan cookie' : 'Cookie settings'}
              />
            </li>
          </ul>
        </div>
        <p className="f-tag">
          Grow together.
          <br />
          Move as one.
        </p>
      </div>
      <p className="f-word" aria-hidden="true">
        colony<span>hub</span>
      </p>
      <div className="wrap f-base mono">
        <span>© 2026 colonyhub</span>
        <span>{dict.ft.proto}</span>
      </div>
    </footer>
  );
}
