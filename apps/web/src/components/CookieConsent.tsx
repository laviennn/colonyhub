'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { localePath, type Locale } from '@colonyhub/content';
import {
  CONSENT_OPEN_EVENT,
  readConsent,
  saveConsent,
} from '@/lib/consent';

const COPY = {
  en: {
    bannerTitle: 'Cookie preferences',
    bannerBody:
      'We use essential storage to keep this site working, and optional Analytics (GA4/GTM) and Marketing (Meta Pixel) cookies only if you accept.',
    acceptAll: 'Accept all',
    rejectAll: 'Reject non-essential',
    customize: 'Customize',
    save: 'Save preferences',
    privacyLink: 'Privacy & cookie policy',
    necessaryTitle: 'Necessary',
    necessaryDesc: 'Always active. Stores your language and cookie consent preferences.',
    analyticsTitle: 'Analytics (GA4 & GTM)',
    analyticsDesc: 'Helps us measure page performance and CTA effectiveness without personal text.',
    marketingTitle: 'Marketing (Meta Pixel)',
    marketingDesc: 'Measures ad campaign effectiveness and conversion attribution on Meta.',
    alwaysOn: 'Always on',
    close: 'Close',
  },
  id: {
    bannerTitle: 'Preferensi cookie',
    bannerBody:
      'Kami menggunakan penyimpanan esensial agar situs bekerja baik, serta cookie Analitik (GA4/GTM) dan Pemasaran (Meta Pixel) opsional hanya jika Anda menyetujui.',
    acceptAll: 'Terima semua',
    rejectAll: 'Tolak non-esensial',
    customize: 'Atur preferensi',
    save: 'Simpan pilihan',
    privacyLink: 'Kebijakan privasi & cookie',
    necessaryTitle: 'Esensial',
    necessaryDesc: 'Selalu aktif. Menyimpan preferensi bahasa dan pilihan persetujuan cookie Anda.',
    analyticsTitle: 'Analitik (GA4 & GTM)',
    analyticsDesc: 'Membantu mengukur performa halaman dan efektivitas CTA tanpa data teks pribadi.',
    marketingTitle: 'Pemasaran (Meta Pixel)',
    marketingDesc: 'Mengukur efektivitas kampanye dan atribusi konversi iklan Meta.',
    alwaysOn: 'Selalu aktif',
    close: 'Tutup',
  },
} as const;

export function CookieConsent({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const [visible, setVisible] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    }

    const handleOpen = () => {
      const current = readConsent();
      setAnalytics(Boolean(current?.analytics));
      setMarketing(Boolean(current?.marketing));
      setShowCustom(true);
      setVisible(true);
    };

    window.addEventListener(CONSENT_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, handleOpen);
  }, []);

  if (!visible) return null;

  const commit = (nextAnalytics: boolean, nextMarketing: boolean) => {
    saveConsent({ analytics: nextAnalytics, marketing: nextMarketing });
    setAnalytics(nextAnalytics);
    setMarketing(nextMarketing);
    setShowCustom(false);
    setVisible(false);
  };

  return (
    <aside
      className="consent-banner"
      role="dialog"
      aria-label={copy.bannerTitle}
      aria-modal={showCustom ? 'true' : undefined}
    >
      <div className="consent-card">
        <div className="consent-head">
          <div>
            <p className="consent-title">{copy.bannerTitle}</p>
            <p className="consent-body">
              {copy.bannerBody}{' '}
              <Link href={localePath(locale, '/privacy')} className="consent-link">
                {copy.privacyLink}
              </Link>
              .
            </p>
          </div>
          {showCustom ? (
            <button
              type="button"
              className="consent-close"
              onClick={() => setVisible(false)}
              aria-label={copy.close}
            >
              ×
            </button>
          ) : null}
        </div>

        {showCustom ? (
          <div className="consent-options">
            <div className="consent-row">
              <div>
                <strong>{copy.necessaryTitle}</strong>
                <p>{copy.necessaryDesc}</p>
              </div>
              <span className="consent-pill mono">{copy.alwaysOn}</span>
            </div>

            <label className="consent-row consent-row--toggle">
              <div>
                <strong>{copy.analyticsTitle}</strong>
                <p>{copy.analyticsDesc}</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
            </label>

            <label className="consent-row consent-row--toggle">
              <div>
                <strong>{copy.marketingTitle}</strong>
                <p>{copy.marketingDesc}</p>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
            </label>
          </div>
        ) : null}

        <div className="consent-actions">
          <button
            type="button"
            className="btn btn--lime consent-btn"
            onClick={() => commit(true, true)}
          >
            {copy.acceptAll}
          </button>
          <button
            type="button"
            className="consent-btn-outline"
            onClick={() => commit(false, false)}
          >
            {copy.rejectAll}
          </button>
          {showCustom ? (
            <button
              type="button"
              className="consent-btn-outline"
              onClick={() => commit(analytics, marketing)}
            >
              {copy.save}
            </button>
          ) : (
            <button
              type="button"
              className="consent-btn-text"
              onClick={() => setShowCustom(true)}
            >
              {copy.customize}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
