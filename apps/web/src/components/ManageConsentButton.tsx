'use client';

import { openConsentPreferences } from '@/lib/consent';

export function ManageConsentButton({
  label,
  className = 'footer-consent-btn',
}: {
  label: string;
  className?: string;
}) {
  return (
    <button type="button" className={className} onClick={openConsentPreferences}>
      {label}
    </button>
  );
}
