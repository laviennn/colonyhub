export const LOCALES = ['en', 'id'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Single production origin for canonical URLs, sitemap, JSON-LD and Open Graph (SEO.md §1).
 * Never build canonicals from request headers or preview hosts.
 */
export const PRODUCTION_ORIGIN = 'https://colonyhub.id';

export const CONTACT_EMAIL = 'hello@colonyhub.id';
export const CONTACT_WHATSAPP_DISPLAY = '+62 896-7529-3838';
export const CONTACT_WHATSAPP_DIGITS = '6289675293838';
export const CONTACT_WHATSAPP_E164 = '+6289675293838';
export const CONTACT_INSTAGRAM_HANDLE = '@colonyhub.id';
export const CONTACT_INSTAGRAM_URL = 'https://instagram.com/colonyhub.id';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Consistent trailing-slash policy (trailingSlash: false).
 * EN lives at `/` (and `/services`, etc.); ID lives at `/id` (and `/id/services`, etc.).
 */
export function localePath(locale: Locale, path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const clean = normalized === '/' ? '' : normalized.replace(/\/+$/, '');
  if (locale === DEFAULT_LOCALE) {
    return clean || '/';
  }
  return clean ? `/id${clean}` : '/id';
}

export function canonicalUrl(locale: Locale, path = '/'): string {
  const rel = localePath(locale, path);
  return rel === '/' ? PRODUCTION_ORIGIN : `${PRODUCTION_ORIGIN}${rel}`;
}

export function alternateUrls(path = '/'): { en: string; id: string; 'x-default': string } {
  const en = canonicalUrl('en', path);
  const id = canonicalUrl('id', path);
  return {
    en,
    id,
    'x-default': en,
  };
}
