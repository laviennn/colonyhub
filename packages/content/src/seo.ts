import {
  CONTACT_EMAIL,
  CONTACT_INSTAGRAM_URL,
  CONTACT_WHATSAPP_E164,
  PRODUCTION_ORIGIN,
  type Locale,
} from './locales';

/**
 * Safely serialize JSON-LD for embedding inside <script type="application/ld+json"> (SEO.md §4).
 * Escapes `<` to prevent script-tag breakout when CMS strings are included.
 */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function buildOrganizationJsonLd(options?: {
  logoUrl?: string;
  sameAs?: readonly string[];
}): Record<string, unknown> {
  const org: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${PRODUCTION_ORIGIN}/#organization`,
    name: 'colonyhub',
    url: PRODUCTION_ORIGIN,
    description:
      'Integrated digital agency in Indonesia uniting strategy, creative, web engineering, SEO/GEO, social media, and data analytics in one connected team.',
    slogan: 'Grow together. Move as one.',
    email: CONTACT_EMAIL,
    areaServed: [
      { '@type': 'Country', name: 'Indonesia' },
      { '@type': 'AdministrativeArea', name: 'Southeast Asia' },
    ],
    knowsAbout: [
      'Brand Strategy',
      'Digital Roadmap',
      'Visual Identity Design',
      'Web Development',
      'Technical SEO',
      'Generative Engine Optimization (GEO)',
      'Social Media Management',
      'Web Analytics and CRM',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: CONTACT_EMAIL,
        telephone: CONTACT_WHATSAPP_E164,
        areaServed: 'ID',
        availableLanguage: ['en', 'id'],
      },
    ],
  };
  if (options?.logoUrl) {
    org.logo = {
      '@type': 'ImageObject',
      url: options.logoUrl,
    };
  }
  const sameAs =
    options?.sameAs && options.sameAs.length > 0
      ? [...options.sameAs]
      : [CONTACT_INSTAGRAM_URL];
  org.sameAs = sameAs;
  return org;
}

export function buildWebSiteJsonLd(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${PRODUCTION_ORIGIN}/#website`,
    url: locale === 'id' ? `${PRODUCTION_ORIGIN}/id` : PRODUCTION_ORIGIN,
    name: 'colonyhub',
    inLanguage: locale,
    publisher: {
      '@id': `${PRODUCTION_ORIGIN}/#organization`,
    },
  };
}

export function buildWebPageJsonLd(input: {
  type: 'AboutPage' | 'ContactPage' | 'CollectionPage';
  canonical: string;
  name: string;
  description: string;
  inLanguage: Locale;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': input.type,
    '@id': `${input.canonical}#webpage`,
    url: input.canonical,
    name: input.name,
    description: input.description,
    inLanguage: input.inLanguage,
    isPartOf: {
      '@id': `${PRODUCTION_ORIGIN}/#website`,
    },
    about: {
      '@id': `${PRODUCTION_ORIGIN}/#organization`,
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: readonly { name: string; url?: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export function buildServiceJsonLd(input: {
  canonical: string;
  name: string;
  serviceType: string;
  description: string;
  inLanguage: Locale;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${input.canonical}#service`,
    url: input.canonical,
    name: input.name,
    serviceType: input.serviceType,
    description: input.description,
    inLanguage: input.inLanguage,
    areaServed: [
      { '@type': 'Country', name: 'Indonesia' },
      { '@type': 'AdministrativeArea', name: 'Southeast Asia' },
    ],
    provider: {
      '@id': `${PRODUCTION_ORIGIN}/#organization`,
    },
  };
}

export function buildServicesItemListJsonLd(input: {
  canonical: string;
  name: string;
  items: readonly { name: string; description: string; url: string }[];
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${input.canonical}#services-list`,
    name: input.name,
    itemListElement: input.items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      description: item.description,
      url: item.url,
    })),
  };
}

export function buildFaqPageJsonLd(
  items: readonly { question: string; answer: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function resolveAuthorType(authorName: string, explicitType?: 'Person' | 'Organization'): 'Person' | 'Organization' {
  if (explicitType) return explicitType;
  const normalized = authorName.trim().toLowerCase();
  if (normalized === 'colonyhub' || normalized.startsWith('colonyhub ')) {
    return 'Organization';
  }
  return 'Person';
}

export function buildBlogPostingJsonLd(input: {
  canonical: string;
  headline: string;
  description: string;
  inLanguage: Locale;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorRole?: string;
  authorType?: 'Person' | 'Organization';
  imageUrl?: string;
}): Record<string, unknown> {
  const authorType = resolveAuthorType(input.authorName, input.authorType);
  const author: Record<string, unknown> =
    authorType === 'Person'
      ? {
          '@type': 'Person',
          name: input.authorName,
          ...(input.authorRole ? { jobTitle: input.authorRole } : {}),
          worksFor: { '@id': `${PRODUCTION_ORIGIN}/#organization` },
        }
      : {
          '@type': 'Organization',
          name: input.authorName,
          url: PRODUCTION_ORIGIN,
        };

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${input.canonical}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.canonical,
    },
    headline: input.headline,
    description: input.description,
    inLanguage: input.inLanguage,
    datePublished: input.datePublished,
    author,
    publisher: {
      '@id': `${PRODUCTION_ORIGIN}/#organization`,
    },
  };
  if (input.dateModified) {
    schema.dateModified = input.dateModified;
  }
  // SEO.md §3: only emit schema image when the article has a real representative image (never generic brand OG fallback).
  if (input.imageUrl) {
    schema.image = input.imageUrl;
  }
  return schema;
}
