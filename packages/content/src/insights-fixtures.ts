import type { Locale } from './locales';

export type InsightCategorySlug = 'design' | 'engineering' | 'growth' | 'strategy' | 'field-notes';

export type InsightCategory = {
  slug: InsightCategorySlug;
  name: Record<Locale, string>;
};

export type RichTextBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: readonly string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'table'; headers: readonly string[]; rows: readonly (readonly string[])[] }
  | { type: 'code'; language: string; code: string }
  | { type: 'figure'; src: string; alt: string; caption?: string; width: number; height: number };

export type PublicArticle = {
  id: string;
  locale: Locale;
  translationGroupId: string;
  slug: string;
  title: string;
  dek: string;
  categorySlug: InsightCategorySlug;
  authorName: string;
  authorRole: Record<Locale, string>;
  publishedAt: string;
  updatedAt?: string;
  featured?: boolean;
  isPreviewFixture: boolean;
  artVariant: 'a' | 'b' | 'c';
  relatedServices: readonly string[];
  references: readonly { title: string; url: string }[];
  blocks: readonly RichTextBlock[];
  seo?: {
    title?: string;
    description?: string;
  };
};

export const INSIGHT_CATEGORIES: readonly InsightCategory[] = [
  { slug: 'strategy', name: { en: 'Strategy', id: 'Strategi' } },
  { slug: 'design', name: { en: 'Design', id: 'Desain' } },
  { slug: 'engineering', name: { en: 'Engineering', id: 'Engineering' } },
  { slug: 'growth', name: { en: 'Growth', id: 'Growth' } },
  { slug: 'field-notes', name: { en: 'Field Notes', id: 'Catatan Lapangan' } },
];

/**
 * Preview fixtures for Phase 02 dynamic Insights routes (/insights & /insights/[slug]).
 * Replaced by live Colony Command Center (Postgres + Drizzle) queries in Phase 03.
 * Includes both paired EN/ID articles and one EN-only article to validate SEO.md hreflang rules.
 */
export const PREVIEW_ARTICLES: readonly PublicArticle[] = [
  {
    id: '11111111-1111-4111-8111-111111111101',
    locale: 'en',
    translationGroupId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    slug: 'separating-business-problems-from-website-feature-requests',
    title: 'Separating business problems from website feature requests',
    dek: 'Why a list of requested pages and animations rarely fixes lead quality until the underlying buyer question is named first.',
    categorySlug: 'strategy',
    authorName: 'colonyhub Editorial',
    authorRole: { en: 'Strategy Unit', id: 'Strategy Unit' },
    publishedAt: '2026-11-15T09:00:00+07:00',
    featured: true,
    isPreviewFixture: true,
    artVariant: 'a',
    relatedServices: ['strategy', 'web-development'],
    references: [
      {
        title: 'Web.dev: Core Web Vitals overview',
        url: 'https://web.dev/articles/vitals',
      },
    ],
    blocks: [
      {
        type: 'p',
        text: 'Most agency briefs arrive as a feature list: a new hero video, a dark mode toggle, a chatbot widget, and five extra landing pages. When we ask what business metric is stuck, the real issue is usually much narrower.',
      },
      { type: 'h2', text: 'Start from the buyer decision, not the component list' },
      {
        type: 'p',
        text: 'A prospective client visits your site to answer four practical questions: what you do, whether you have solved similar problems, how working with you runs, and what happens after they reach out.',
      },
      {
        type: 'table',
        headers: ['Feature request', 'Underlying business question', 'Practical first check'],
        rows: [
          [
            'Add interactive 3D hero',
            'Visitors bounce before understanding our offer',
            'Test headline clarity and LCP speed on mobile',
          ],
          [
            'Add live chat widget',
            'Prospects hesitate to fill out a long form',
            'Cut required form fields to name, email and short brief',
          ],
          [
            'Rebuild entire blog',
            'Organic traffic is not bringing qualified inquiries',
            'Audit search intent and internal links to service pages',
          ],
        ],
      },
      { type: 'h2', text: 'Trade-offs when trimming scope' },
      {
        type: 'ul',
        items: [
          'Cutting decorative features early frees budget for real photography, clearer copy and QA.',
          'Saying no to a feature requires agreement from stakeholders who originally suggested it.',
          'Some experiments are still worth building once core conversion paths are measurable.',
        ],
      },
      {
        type: 'quote',
        text: 'A smaller website that answers the buyer clearly beats a heavy showcase that hides the next step.',
      },
    ],
  },
  {
    id: '11111111-1111-4111-8111-111111111102',
    locale: 'id',
    translationGroupId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    slug: 'memisahkan-masalah-bisnis-dari-daftar-fitur-website',
    title: 'Memisahkan masalah bisnis dari daftar fitur website',
    dek: 'Mengapa daftar halaman dan animasi yang diminta jarang memperbaiki kualitas lead sebelum pertanyaan utama pembeli dirumuskan.',
    categorySlug: 'strategy',
    authorName: 'colonyhub Editorial',
    authorRole: { en: 'Strategy Unit', id: 'Strategy Unit' },
    publishedAt: '2026-11-15T09:00:00+07:00',
    featured: true,
    isPreviewFixture: true,
    artVariant: 'a',
    relatedServices: ['strategy', 'web-development'],
    references: [
      {
        title: 'Web.dev: Core Web Vitals overview',
        url: 'https://web.dev/articles/vitals',
      },
    ],
    blocks: [
      {
        type: 'p',
        text: 'Sebagian besar brief website datang sebagai daftar fitur: video hero baru, tombol dark mode, widget chat, dan lima landing page tambahan. Saat kita telusuri masalah bisnisnya, akar persoalannya biasanya jauh lebih spesifik.',
      },
      { type: 'h2', text: 'Mulai dari keputusan pembeli, bukan daftar komponen' },
      {
        type: 'p',
        text: 'Calon klien membuka situs Anda untuk menjawab empat hal praktis: apa yang Anda kerjakan, bukti cara kerja Anda, bagaimana alur kolaborasinya, dan apa langkah pertama untuk menghubungi Anda.',
      },
      {
        type: 'table',
        headers: ['Permintaan fitur', 'Pertanyaan bisnis di baliknya', 'Pengecekan awal yang konkret'],
        rows: [
          [
            'Tambah hero 3D interaktif',
            'Pengunjung keluar sebelum paham penawaran utama',
            'Uji kejelasan headline dan kecepatan LCP di ponsel',
          ],
          [
            'Pasang widget live chat',
            'Prospek enggan mengisi formulir yang terlalu panjang',
            'Ringkas kolom wajib jadi nama, email, dan ringkasan masalah',
          ],
          [
            'Rombak total halaman blog',
            'Traffic organik belum membawa inquiry relevan',
            'Audit intent pencarian dan tautan internal ke halaman layanan',
          ],
        ],
      },
      { type: 'h2', text: 'Trade-off saat menyederhanakan cakupan' },
      {
        type: 'ul',
        items: [
          'Memangkas fitur hiasan di awal membuka ruang anggaran untuk copy yang lebih tajam dan QA menyeluruh.',
          'Menunda suatu fitur perlu kesepakatan terbuka dengan stakeholder yang mengusulkannya.',
          'Eksperimen visual tetap layak dikerjakan setelah jalur konversi inti berjalan dan terukur.',
        ],
      },
      {
        type: 'quote',
        text: 'Website yang ringkas dan menjawab pertanyaan pembeli lebih berguna daripada tampilan berat yang menyembunyikan langkah berikutnya.',
      },
    ],
  },
  {
    id: '11111111-1111-4111-8111-111111111103',
    locale: 'en',
    translationGroupId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    slug: 'choosing-a-cms-for-your-editors',
    title: 'Choosing a CMS for your editors, not for the framework trend',
    dek: 'How editorial workflows, preview links, slug redirects and role permissions should drive CMS architecture.',
    categorySlug: 'engineering',
    authorName: 'colonyhub Editorial',
    authorRole: { en: 'Build Unit', id: 'Build Unit' },
    publishedAt: '2026-11-17T10:00:00+07:00',
    updatedAt: '2026-11-19T14:00:00+07:00',
    isPreviewFixture: true,
    artVariant: 'b',
    relatedServices: ['web-development', 'data-analytics'],
    references: [
      {
        title: 'Next.js App Router: Draft Mode',
        url: 'https://nextjs.org/docs/app/guides/draft-mode',
      },
    ],
    blocks: [
      {
        type: 'p',
        text: 'Teams often pick a CMS because of a benchmark chart, then discover six months later that editors still ping developers to change a headline or redirect a renamed slug.',
      },
      { type: 'h2', text: 'Four checks before locking a CMS' },
      {
        type: 'ul',
        items: [
          'Can an editor preview an unpublished draft privately without exposing it to search engines?',
          'Does publishing a new slug work immediately without triggering a full code deploy?',
          'When an article is unpublished, is it removed from routes, caches and sitemap.xml right away?',
          'Can EN and ID translations keep independent publication status and locale-specific slugs?',
        ],
      },
      { type: 'h3', text: 'Keep the public contract typed' },
      {
        type: 'code',
        language: 'ts',
        code: `type ArticleLookup = {\n  locale: 'en' | 'id';\n  slug: string;\n  includeDraft?: boolean;\n};`,
      },
      {
        type: 'p',
        text: 'Keeping one shared server query for the HTML page, generateMetadata and JSON-LD avoids drift between what readers see and what search crawlers index.',
      },
    ],
  },
  {
    id: '11111111-1111-4111-8111-111111111104',
    locale: 'id',
    translationGroupId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    slug: 'memilih-cms-untuk-editor-anda',
    title: 'Memilih CMS untuk editor Anda, bukan karena tren framework',
    dek: 'Mengapa alur kerja editor, pratinjau privat, redirect slug, dan hak akses peran harus menjadi dasar arsitektur CMS.',
    categorySlug: 'engineering',
    authorName: 'colonyhub Editorial',
    authorRole: { en: 'Build Unit', id: 'Build Unit' },
    publishedAt: '2026-11-17T10:00:00+07:00',
    updatedAt: '2026-11-19T14:00:00+07:00',
    isPreviewFixture: true,
    artVariant: 'b',
    relatedServices: ['web-development', 'data-analytics'],
    references: [
      {
        title: 'Next.js App Router: Draft Mode',
        url: 'https://nextjs.org/docs/app/guides/draft-mode',
      },
    ],
    blocks: [
      {
        type: 'p',
        text: 'Banyak tim memilih CMS berdasarkan tren teknologi, lalu enam bulan kemudian editor tetap harus menghubungi developer hanya untuk mengganti judul atau mengalihkan slug lama.',
      },
      { type: 'h2', text: 'Empat pertanyaan sebelum mengunci arsitektur CMS' },
      {
        type: 'ul',
        items: [
          'Apakah editor bisa membuka pratinjau draft secara privat tanpa terindeks mesin pencari?',
          'Apakah slug baru langsung tayang setelah publish tanpa perlu deploy ulang kode?',
          'Saat artikel ditarik (unpublish), apakah rute, cache, dan sitemap.xml ikut bersih?',
          'Apakah terjemahan EN dan ID bisa punya status terbit serta slug masing-masing?',
        ],
      },
      { type: 'h3', text: 'Jaga satu kontrak data publik yang terketik' },
      {
        type: 'code',
        language: 'ts',
        code: `type ArticleLookup = {\n  locale: 'en' | 'id';\n  slug: string;\n  includeDraft?: boolean;\n};`,
      },
      {
        type: 'p',
        text: 'Memakai satu fungsi query server yang sama untuk HTML halaman, generateMetadata, dan JSON-LD mencegah perbedaan antara isi yang dibaca pengguna dan data yang dibaca crawler.',
      },
    ],
  },
  {
    id: '11111111-1111-4111-8111-111111111105',
    locale: 'en',
    translationGroupId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    slug: 'technical-seo-vs-writing-for-ai-answer-engines',
    title: 'Technical SEO vs. writing for AI answer engines',
    dek: 'What overlaps between classic search crawling and GEO, and where teams waste time chasing myths.',
    categorySlug: 'growth',
    authorName: 'colonyhub Editorial',
    authorRole: { en: 'Growth Unit', id: 'Growth Unit' },
    publishedAt: '2026-11-19T08:30:00+07:00',
    isPreviewFixture: true,
    artVariant: 'c',
    relatedServices: ['growth', 'web-development'],
    references: [
      {
        title: 'Google Search Central: AI features and your website',
        url: 'https://developers.google.com/search/docs/appearance/ai-features',
      },
    ],
    blocks: [
      {
        type: 'p',
        text: 'Search engines and AI answer systems rely on the same foundation: crawlable server-rendered HTML, accurate canonical URLs, clear page structure and verifiable statements.',
      },
      { type: 'h2', text: 'What still does the heavy lifting' },
      {
        type: 'ul',
        items: [
          'One clear topic per page with a direct answer near the top.',
          'Factual structured data (Organization, Service, BlogPosting) matching visible copy.',
          'Clean internal links connecting guides to the exact service scope they explain.',
        ],
      },
      {
        type: 'figure',
        src: '/assets/stories/story-growth.svg',
        alt: 'Visual diagram representing Growth Unit channels',
        caption: 'Sample editorial media block demonstrating responsive aspect ratio and alt text.',
        width: 1080,
        height: 1920,
      },
      {
        type: 'p',
        text: 'Files such as llms.txt can help summarize key canonical URLs for machine readers, but they never replace indexable HTML or original writing.',
      },
    ],
  },
  {
    id: '11111111-1111-4111-8111-111111111106',
    locale: 'id',
    translationGroupId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    slug: 'seo-teknis-vs-menulis-untuk-mesin-jawaban-ai',
    title: 'SEO teknis vs. menulis untuk mesin jawaban AI',
    dek: 'Bagian mana yang saling beririsan antara crawl pencarian klasik dan GEO, serta hal yang sering membuang waktu.',
    categorySlug: 'growth',
    authorName: 'colonyhub Editorial',
    authorRole: { en: 'Growth Unit', id: 'Growth Unit' },
    publishedAt: '2026-11-19T08:30:00+07:00',
    isPreviewFixture: true,
    artVariant: 'c',
    relatedServices: ['growth', 'web-development'],
    references: [
      {
        title: 'Google Search Central: AI features and your website',
        url: 'https://developers.google.com/search/docs/appearance/ai-features',
      },
    ],
    blocks: [
      {
        type: 'p',
        text: 'Mesin pencari dan mesin jawaban AI bertumpu pada fondasi yang sama: HTML server yang bisa di-crawl, URL canonical yang akurat, struktur heading yang jelas, dan pernyataan yang dapat diverifikasi.',
      },
      { type: 'h2', text: 'Hal yang tetap paling menentukan' },
      {
        type: 'ul',
        items: [
          'Satu topik jelas per halaman dengan jawaban langsung di bagian awal.',
          'Structured data faktual (Organization, Service, BlogPosting) yang persis cocok dengan isi halaman.',
          'Tautan internal yang menghubungkan panduan dengan unit layanan yang relevan.',
        ],
      },
      {
        type: 'figure',
        src: '/assets/stories/story-growth.svg',
        alt: 'Diagram visual yang merepresentasikan kanal Growth Unit',
        caption: 'Contoh blok media editorial dengan rasio aspek stabil dan teks alt.',
        width: 1080,
        height: 1920,
      },
      {
        type: 'p',
        text: 'Berkas seperti llms.txt membantu merangkum tautan canonical utama untuk pembacaan mesin, namun tidak menggantikan HTML yang terindeks atau tulisan orisinal.',
      },
    ],
  },
  {
    id: '11111111-1111-4111-8111-111111111107',
    locale: 'en',
    translationGroupId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
    slug: 'why-direct-consultation-channels-beat-long-forms',
    title: 'Why direct consultation channels beat long forms',
    dek: 'Field notes on replacing multi-page agency intake forms with contextual WhatsApp and email entry points so prospective clients reach a human faster.',
    categorySlug: 'field-notes',
    authorName: 'colonyhub Editorial',
    authorRole: { en: 'Build Unit', id: 'Build Unit' },
    publishedAt: '2026-11-20T11:00:00+07:00',
    isPreviewFixture: true,
    artVariant: 'a',
    relatedServices: ['web-development', 'data-analytics'],
    references: [],
    blocks: [
      {
        type: 'p',
        text: 'When a prospective client already knows something is broken on their website or ad account, forcing them through twelve mandatory form fields before they can speak to a human creates friction and drop-off.',
      },
      { type: 'h2', text: 'Match the contact channel to how buyers actually talk' },
      {
        type: 'p',
        text: 'In Indonesia and Southeast Asia, founders and marketing leads often prefer starting with a quick WhatsApp message for scope checks, while teams with formal RFPs prefer sending a structured email with attachments.',
      },
      { type: 'h2', text: 'Keep context without storing unnecessary personal data' },
      {
        type: 'p',
        text: 'Passing the selected service or package into a pre-filled WhatsApp message or email subject gives the team clear context on the first reply while keeping the website free of stored form PII.',
      },
    ],
  },
];

export function estimateReadingTimeMinutes(blocks: readonly RichTextBlock[]): number {
  let words = 0;
  for (const b of blocks) {
    if (b.type === 'h2' || b.type === 'h3' || b.type === 'p' || b.type === 'quote') {
      words += b.text.trim().split(/\s+/).length;
    } else if (b.type === 'ul') {
      for (const item of b.items) words += item.trim().split(/\s+/).length;
    } else if (b.type === 'table') {
      words += b.headers.join(' ').split(/\s+/).length;
      for (const row of b.rows) words += row.join(' ').split(/\s+/).length;
    } else if (b.type === 'code') {
      words += b.code.trim().split(/\s+/).length;
    }
  }
  return Math.max(1, Math.ceil(words / 200));
}

export function listPublishedArticles(options: {
  locale: Locale;
  category?: string;
  page?: number;
  pageSize?: number;
}): {
  items: PublicArticle[];
  total: number;
  page: number;
  totalPages: number;
} {
  const pageSize = options.pageSize ?? 6;
  const filtered = PREVIEW_ARTICLES.filter(
    (a) => a.locale === options.locale && (!options.category || a.categorySlug === options.category),
  ).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, options.page ?? 1), totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    total,
    page,
    totalPages,
  };
}

export function getPublishedArticleBySlug(locale: Locale, slug: string): PublicArticle | undefined {
  return PREVIEW_ARTICLES.find((a) => a.locale === locale && a.slug === slug);
}

export function getArticleTranslation(
  article: PublicArticle,
  targetLocale: Locale,
): PublicArticle | undefined {
  if (article.locale === targetLocale) return article;
  return PREVIEW_ARTICLES.find(
    (a) => a.translationGroupId === article.translationGroupId && a.locale === targetLocale,
  );
}

export function getRelatedArticles(article: PublicArticle, limit = 2): PublicArticle[] {
  return PREVIEW_ARTICLES.filter(
    (a) => a.locale === article.locale && a.slug !== article.slug,
  ).slice(0, limit);
}

export function isInsightCategory(value: string): value is InsightCategorySlug {
  return INSIGHT_CATEGORIES.some((c) => c.slug === value);
}

export function getCategoryName(slug: InsightCategorySlug, locale: Locale): string {
  return INSIGHT_CATEGORIES.find((c) => c.slug === slug)?.name[locale] ?? slug;
}
