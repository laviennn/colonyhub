'use client';

import { useState } from 'react';
import { CONTACT_EMAIL, type Locale } from '@colonyhub/content';
import { trackEvent } from '@/lib/analytics';

export function CopyEmailButton({ locale }: { locale: Locale }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    trackEvent('email_click', {
      locale,
      cta_id: 'contact_copy_email',
      location: 'contact_page',
    });
    trackEvent('generate_lead', {
      locale,
      method: 'email_copy',
      location: 'contact_page',
    });
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback: ignore if clipboard API unavailable
    }
  };

  return (
    <button
      type="button"
      className="btn-copy-email"
      onClick={handleCopy}
      data-cta-id="contact_copy_email"
      data-cta-location="contact_page"
    >
      {copied
        ? locale === 'id'
          ? 'Email tersalin'
          : 'Email copied'
        : locale === 'id'
          ? 'Salin email'
          : 'Copy email'}
    </button>
  );
}
