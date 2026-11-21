# CMS content models & validation contracts

**Status:** Proposed platform-agnostic schema. Final types depend on selected CMS/framework.

## Common conventions

- Stable UUID/ID internal; unique public slug.
- `status`: draft | review | published | archived.
- `publishedAt`, `updatedAt` stored with timezone-aware values.
- SEO title/description optional with deliberate page-level fallback; do not silently replicate generic homepage title.
- Rich content sanitized and rendered through an approved component allowlist.
- Media: URL/asset reference, width/height, alt, caption, license/permission info where necessary.
- Never publish preview content in public sitemap or recommendation feed.

## Project / Work

```ts
type Project = {
  id: string;
  slug: string;
  title: string;
  status: 'draft'|'review'|'published'|'archived';
  kind: 'client'|'internal'|'concept';
  clientName?: string;            // only with disclosure approval
  year?: number;
  summary: string;
  heroImage: Media;
  categories: string[];
  serviceSlugs: string[];
  challenge: RichText;
  approach: RichText;
  execution: RichText;
  outcomes?: RichText;            // verified; no fabricated KPIs
  verifiedMetrics?: Metric[];
  gallery?: Media[];
  permissionsApproved: boolean;
  featured?: boolean;
  seo?: SeoFields;
  publishedAt?: string;
};
```

**Validation:** do not publish a purported client project without permissions approval; if metric is displayed it requires evidence owner and units/context.

## Service

```ts
type Service = {
  slug: string;
  unit: 'Strategy Unit'|'Creative Unit'|'Build Unit'|'Growth Unit'|'Social Unit'|'Data Unit';
  headline: string;
  description: string;
  problems: string[];
  deliverables: string[];
  exclusions?: string[];
  process?: RichText;
  relatedProjects?: string[];
  faq?: Array<{ question: string; answer: string }>;
  seo?: SeoFields;
};
```

Unit values must map to official source scope. Public display can add human-readable subtitles but may not replace canonical nomenclature internally.

## Article

```ts
type Article = {
  id: string;
  slug: string;
  title: string;
  dek: string;
  status: 'draft'|'review'|'published'|'archived';
  categorySlug: string;
  tagSlugs?: string[];
  authorId: string;
  reviewerId?: string;
  heroImage?: Media;
  content: RichText;
  references?: Array<{title: string; url: string; accessedAt?: string}>;
  relatedServices?: string[];
  relatedProjects?: string[];
  featured?: boolean;
  publishedAt?: string;
  updatedAt?: string;
  seo?: SeoFields;
};
```

Reading time is derived from word count at render/build time, not manually faked. Dates and bylines reflect real publishing events.

## Author / Category

```ts
type Author = { id: string; displayName: string; role?: string; bio?: string; avatar?: Media; consentApproved: boolean; };
type Category = { slug: string; name: string; description?: string; sortOrder?: number; };
```

## Inquiry (server-side only)

```ts
type Inquiry = {
  name: string;
  email: string;
  description: string;
  services?: string[];
  company?: string;
  budgetRange?: string;
  timeline?: string;
  consent?: boolean;
  submittedAt: string;
};
```

Limit field lengths, sanitize outputs, enforce rate limits and data retention. Never store payment details or sensitive IDs in this form.

## Shared interfaces

```ts
type Media = { src: string; width: number; height: number; alt: string; caption?: string; };
type Metric = { label: string; value: string; context: string; evidenceOwner: string; };
type SeoFields = { title?: string; description?: string; canonical?: string; ogImage?: Media; noindex?: boolean; };
type RichText = unknown; // defined by selected editor and validated renderer
```

## Relationships

Project many-to-many Service. Article belongs to Category and Author; Article optionally links Projects and Services. Service lists related Projects. Use explicit IDs/references, not fuzzy matching by title. Build optional auto-related suggestions only after data volume justifies.

## Editorial constraints

- Unpublished item must never be returned through public API without privileged authorization.
- Slugs unique within type; redirects on changes.
- Required alt on informative editorial image; decorative image explicitly marked.
- Media asset ownership and license checked at publish time.
- Preview links expire or are access-controlled.
- Enforce author and reviewer attribution accurately.
