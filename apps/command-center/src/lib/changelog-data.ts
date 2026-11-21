export type ChangelogScope = 'public-site' | 'command-center' | 'seo-analytics';

export type ChangelogEntry = {
  version: string;
  date: string;
  dateLabel: string;
  title: string;
  scope: ChangelogScope;
  scopeLabel: string;
  summary: string;
  changes: readonly string[];
};

/**
 * Concise, factual release log of verified changes shipped across colonyhub.id and Command Center.
 * Written following antislop-copywriting: zero em dashes, zero buzzwords, active factual bullets.
 */
export const CHANGELOG_ENTRIES: readonly ChangelogEntry[] = [
  {
    version: 'v0.9',
    date: '2026-11-22',
    dateLabel: '22 Nov 2026',
    title: 'SEO, GEO, AEO, and copywriting audit pass',
    scope: 'seo-analytics',
    scopeLabel: 'SEO & Analytics',
    summary:
      'Fixed heading skips, over-length titles, preview fixture indexing, and AI search signals across all 28 EN/ID routes.',
    changes: [
      'Shortened all 28 EN and ID route titles to 60 characters or fewer and removed repeated brand names.',
      'Fixed skipped H1 to H3 heading levels on all 12 Colony Unit detail pages and both Insights index pages.',
      'Set preview fixture articles to noindex, follow and hid fixtures from public listings once real Command Center articles are published.',
      'Switched /llms.txt and /sitemap.xml to dynamic output so live published Insights, Indonesian routes, and @colonyhub.id stay current without redeploying.',
      'Added FAQPage, ItemList, AboutPage, ContactPage, and CollectionPage JSON-LD, switched Organization logo to PNG, added Person author support, and kept generic OG images out of BlogPosting schema.',
      'Added the Seed vs. Grow vs. Scale HTML comparison table, concise direct-answer blocks on service pages, and real client Q&As on Services and Approach.',
      'Removed all em dashes, stale prototype footer text, and dead inquiry form copy; aligned consultation CTAs to direct WhatsApp and email contact.',
    ],
  },
  {
    version: 'v0.8',
    date: '2026-11-22',
    dateLabel: '22 Nov 2026',
    title: 'Direct contact, dynamic tracking sync, and UU PDP consent',
    scope: 'public-site',
    scopeLabel: 'Public Site',
    summary:
      'Replaced embedded inquiry forms with direct WhatsApp, email, and Instagram channels, paired with backoffice-managed tracking and strict opt-in consent.',
    changes: [
      'Removed the embedded inquiry form, /api/inquiries endpoint, and backoffice Inquiries menu in favor of WhatsApp (+62 896-7529-3838), email (hello@colonyhub.id), and Instagram (@colonyhub.id).',
      'Added Contact to the main navbar, balanced the three channel cards on /contact, and cleaned up footer legal links.',
      'Built the Tracking backoffice screen to validate and store GA4, Google Tag Manager, and Meta Pixel IDs and sync them live to apps/web.',
      'Added strict opt-in cookie consent (Google Consent Mode v2 denied by default) and updated the bilingual Privacy Policy for Indonesia UU PDP No. 27/2022.',
      'Wired zero-PII GA4 and Meta Pixel events (cta_click, whatsapp_click, email_click, generate_lead, service_view, article_view) across public CTAs and pages.',
      'Added dynamic icon.svg, apple-icon, opengraph-image, and twitter-image routes, and fixed background grid rules overlapping inner-page tables.',
    ],
  },
  {
    version: 'v0.7',
    date: '2026-11-22',
    dateLabel: '22 Nov 2026',
    title: 'Dynamic menu-based RBAC and dark mode',
    scope: 'command-center',
    scopeLabel: 'Command Center',
    summary:
      'Moved backoffice authorization to a central menu registry controlled by superadmin and shipped Light/Dark themes.',
    changes: [
      'Replaced static roles with Superadmin-managed Dynamic Menu-Based RBAC driven by ADMIN_MENUS in packages/db.',
      'Enrolled every newly added admin menu automatically: superadmin gets full access while custom roles stay denied until granted in Settings.',
      'Added role creation, menu-action permission toggles, and user role assignment in Settings with server-side guards on every route and API.',
      'Redesigned the internal login screen and added Light and Dark mode across Command Center with zero-FOUC theme initialization.',
    ],
  },
  {
    version: 'v0.6',
    date: '2026-11-22',
    dateLabel: '22 Nov 2026',
    title: 'Colony Command Center CMS and mobile app shell',
    scope: 'command-center',
    scopeLabel: 'Command Center',
    summary:
      'Built the internal editorial CMS, live publishing pipeline, and mobile workstation layout.',
    changes: [
      'Built apps/command-center on Drizzle ORM (packages/db) with HTTP-only scrypt sessions and X-Robots-Tag noindex headers.',
      'Added bilingual Insights authoring with structured rich-text blocks, time-limited private draft preview, live on-demand revalidation, automatic 308 slug redirects, and unpublish cleanup.',
      'Shipped the mobile native-app shell at 768px and below with fixed top bar, bottom tab navigation, and responsive editor tabs.',
    ],
  },
  {
    version: 'v0.5',
    date: '2026-11-21',
    dateLabel: '21 Nov 2026',
    title: 'Public website foundation and bilingual parity',
    scope: 'public-site',
    scopeLabel: 'Public Site',
    summary:
      'Ported the approved v0.4 homepage prototype to Next.js App Router and built all bilingual public routes.',
    changes: [
      'Ported design tokens, layout, motion, floating frosted navbar, interactive transit map, story viewer, and Three.js SDF hero at parity with prototype v0.4.',
      'Built EN (/) and ID (/id) routes for Services, six Colony Unit detail pages, Approach, About, Insights, Contact, and Privacy while keeping /work at 404.',
      'Set up modular XML sitemaps (/sitemap.xml with pages, services, and insights sub-sitemaps), robots.txt, and Playwright E2E checks for Core Web Vitals and WCAG 2.2 AA.',
    ],
  },
];
