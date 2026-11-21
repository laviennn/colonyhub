import { describe, expect, it } from 'vitest';
import {
  COLONY_UNITS,
  DICTIONARIES,
  INSIGHT_CATEGORIES,
  PREVIEW_ARTICLES,
  PRODUCTION_ORIGIN,
  SERVICE_DETAILS,
  STORY_SAMPLES,
  alternateUrls,
  buildBlogPostingJsonLd,
  buildOrganizationJsonLd,
  canonicalUrl,
  getArticleTranslation,
  getPublishedArticleBySlug,
  inquirySchema,
  listPublishedArticles,
  localePath,
  serializeJsonLd,
} from '../index';

describe('locales and URLs', () => {
  it('uses https://colonyhub.id as single production origin', () => {
    expect(PRODUCTION_ORIGIN).toBe('https://colonyhub.id');
    expect(canonicalUrl('en', '/')).toBe('https://colonyhub.id');
    expect(canonicalUrl('id', '/')).toBe('https://colonyhub.id/id');
    expect(canonicalUrl('en', '/services/strategy')).toBe('https://colonyhub.id/services/strategy');
    expect(canonicalUrl('id', '/services/strategy')).toBe(
      'https://colonyhub.id/id/services/strategy',
    );
  });

  it('produces symmetric alternates with x-default pointing to EN', () => {
    expect(alternateUrls('/')).toEqual({
      en: 'https://colonyhub.id',
      id: 'https://colonyhub.id/id',
      'x-default': 'https://colonyhub.id',
    });
    expect(localePath('id', '/insights/test/')).toBe('/id/insights/test');
  });
});

describe('brand and baseline content parity', () => {
  it('keeps all 6 official Colony Units and 24 stops in both EN and ID', () => {
    expect(COLONY_UNITS).toHaveLength(6);
    const totalEn = COLONY_UNITS.reduce((sum, u) => sum + u.stops.en.length, 0);
    const totalId = COLONY_UNITS.reduce((sum, u) => sum + u.stops.id.length, 0);
    expect(totalEn).toBe(24);
    expect(totalId).toBe(24);
  });

  it('keeps 5 story samples with root-relative SVG paths', () => {
    expect(STORY_SAMPLES).toHaveLength(5);
    for (const story of STORY_SAMPLES) {
      expect(story.bg).toMatch(/^\/assets\/stories\/story-[a-z]+\.svg$/);
      expect(story.hook.en.length).toBeGreaterThan(0);
      expect(story.hook.id.length).toBeGreaterThan(0);
    }
  });

  it('keeps matching structure across EN and ID dictionaries', () => {
    expect(DICTIONARIES.en.route.steps).toHaveLength(4);
    expect(DICTIONARIES.id.route.steps).toHaveLength(4);
    expect(DICTIONARIES.en.about.values).toHaveLength(5);
    expect(DICTIONARIES.id.about.values).toHaveLength(5);
    expect(DICTIONARIES.en.ins.items).toHaveLength(3);
    expect(DICTIONARIES.id.ins.items).toHaveLength(3);
  });
});

describe('SEO and schema safety', () => {
  it('escapes < in serialized JSON-LD', () => {
    const out = serializeJsonLd({ name: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('</script>');
    expect(out).toContain('\\u003c/script>');
  });

  it('builds factual Organization JSON-LD without fabricated fields', () => {
    const org = buildOrganizationJsonLd();
    expect(org['@id']).toBe('https://colonyhub.id/#organization');
    expect(org.name).toBe('colonyhub');
    expect(org.logo).toBeUndefined();
    expect(org.sameAs).toEqual(['https://instagram.com/colonyhub.id']);
  });

  it('validates inquiry payload', () => {
    expect(
      inquirySchema.safeParse({
        name: 'Ayu',
        email: 'ayu@example.com',
        description: 'We need a website rebuild and SEO plan.',
      }).success,
    ).toBe(true);
    expect(
      inquirySchema.safeParse({
        name: 'A',
        email: 'bad-email',
        description: 'short',
      }).success,
    ).toBe(false);
  });

  it('provides detail content for every Colony Unit and valid Insights fixtures', () => {
    expect(SERVICE_DETAILS).toHaveLength(6);
    for (const unit of COLONY_UNITS) {
      expect(SERVICE_DETAILS.some((d) => d.slug === unit.slug)).toBe(true);
    }

    expect(INSIGHT_CATEGORIES).toHaveLength(5);
    const enList = listPublishedArticles({ locale: 'en' });
    const idList = listPublishedArticles({ locale: 'id' });
    expect(enList.total).toBeGreaterThanOrEqual(4);
    expect(idList.total).toBeGreaterThanOrEqual(3);

    const paired = getPublishedArticleBySlug(
      'en',
      'separating-business-problems-from-website-feature-requests',
    );
    expect(paired).toBeDefined();
    expect(getArticleTranslation(paired!, 'id')?.slug).toBe(
      'memisahkan-masalah-bisnis-dari-daftar-fitur-website',
    );

    const singleLang = getPublishedArticleBySlug(
      'en',
      'why-direct-consultation-channels-beat-long-forms',
    );
    expect(singleLang).toBeDefined();
    expect(getArticleTranslation(singleLang!, 'id')).toBeUndefined();

    const blogLd = buildBlogPostingJsonLd({
      canonical: 'https://colonyhub.id/insights/test',
      headline: 'Test',
      description: 'Desc',
      inLanguage: 'en',
      datePublished: '2026-11-15T09:00:00+07:00',
      authorName: 'colonyhub Editorial',
    });
    expect(blogLd['@type']).toBe('BlogPosting');
    expect((blogLd.author as { '@type': string })['@type']).toBe('Organization');
    expect(blogLd.image).toBeUndefined();

    const personBlogLd = buildBlogPostingJsonLd({
      canonical: 'https://colonyhub.id/insights/test-person',
      headline: 'Test Person',
      description: 'Desc',
      inLanguage: 'en',
      datePublished: '2026-11-15T09:00:00+07:00',
      authorName: 'Raka Pratama',
      authorRole: 'Lead Engineer',
    });
    expect((personBlogLd.author as { '@type': string })['@type']).toBe('Person');
    expect(PREVIEW_ARTICLES.every((a) => a.isPreviewFixture)).toBe(true);
  });
});
