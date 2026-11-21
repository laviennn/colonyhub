export const CONSENT_STORAGE_KEY = 'colonyhub_consent_v1';
export const CONSENT_CHANGED_EVENT = 'colonyhub:consent-changed';
export const CONSENT_OPEN_EVENT = 'colonyhub:open-consent';

export type ConsentPreferences = {
  version: 1;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export function readConsent(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
    if (
      parsed.version !== 1 ||
      typeof parsed.analytics !== 'boolean' ||
      typeof parsed.marketing !== 'boolean'
    ) {
      return null;
    }
    return {
      version: 1,
      necessary: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveConsent(input: { analytics: boolean; marketing: boolean }): ConsentPreferences {
  const next: ConsentPreferences = {
    version: 1,
    necessary: true,
    analytics: Boolean(input.analytics),
    marketing: Boolean(input.marketing),
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore private browsing storage errors
    }
    window.dispatchEvent(new CustomEvent<ConsentPreferences>(CONSENT_CHANGED_EVENT, { detail: next }));
  }

  return next;
}

export function openConsentPreferences(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}
