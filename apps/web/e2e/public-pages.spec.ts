import { expect, test } from '@playwright/test';

const SERVICE_SLUGS = [
  'strategy',
  'creative',
  'web-development',
  'growth',
  'social',
  'data-analytics',
] as const;

test.describe('Phase 02 — Public pages, navigation & SEO', () => {
  test('renders all EN and ID public routes with breadcrumbs, zero overflow, and /work stays 404', async ({
    page,
    request,
  }) => {
    const paths = [
      '/services',
      ...SERVICE_SLUGS.map((s) => `/services/${s}`),
      '/approach',
      '/about',
      '/insights',
      '/contact',
      '/privacy',
    ];

    for (const p of paths) {
      const enRes = await request.get(p);
      expect(enRes.status(), `EN ${p}`).toBe(200);
      const idRes = await request.get(`/id${p}`);
      expect(idRes.status(), `ID /id${p}`).toBe(200);
    }

    // Work routes remain hidden (O-003)
    expect((await request.get('/work')).status()).toBe(404);
    expect((await request.get('/work/sample')).status()).toBe(404);
    expect((await request.get('/id/work')).status()).toBe(404);

    // Services sub-sitemap contains all 6 services and excludes /work
    const servicesSitemap = await (await request.get('/sitemaps/services.xml')).text();
    for (const slug of SERVICE_SLUGS) {
      expect(servicesSitemap).toContain(`https://colonyhub.id/services/${slug}`);
      expect(servicesSitemap).toContain(`https://colonyhub.id/id/services/${slug}`);
    }
    expect(servicesSitemap).not.toContain('/work');

    // Visual & overflow check on desktop and mobile for key inner pages
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/services/strategy');
    await expect(page.locator('nav[aria-label="Breadcrumb"]')).toBeVisible();
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLdScripts.some((s) => s.includes('"@type":"Service"'))).toBe(true);
    expect(jsonLdScripts.some((s) => s.includes('"@type":"BreadcrumbList"'))).toBe(true);
    await page.screenshot({ path: 'test-results/parity/service-strategy-1440.png', fullPage: true });

    // Locale switch from inner page preserves route
    await page.locator('.header-actions .lang a[hreflang="id"]').click();
    await expect(page).toHaveURL(/\/id\/services\/strategy$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'id');

    // Mobile 375px zero overflow on /services and /contact
    await page.setViewportSize({ width: 375, height: 812 });
    for (const p of ['/services', '/approach', '/about', '/insights', '/contact', '/privacy']) {
      await page.goto(p);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `overflow on ${p} at 375px`).toBeLessThanOrEqual(0);
    }
  });

  test('Insights category filter, empty state, paired EN/ID article, single-language hreflang rule, and 404', async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/insights');
    await expect(page.locator('.article-card')).toHaveCount(4);

    // Category filter with results
    await page.getByRole('link', { name: 'Engineering', exact: true }).click();
    await expect(page).toHaveURL(/category=engineering/);
    await expect(page.locator('.article-card')).toHaveCount(1);

    // Category filter empty state + recovery
    await page.getByRole('link', { name: 'Design', exact: true }).click();
    await expect(page.locator('.empty-state')).toBeVisible();
    await page.getByRole('link', { name: 'View all articles' }).click();
    await expect(page).toHaveURL(/\/insights$/);

    // Paired EN/ID article renders rich text, BlogPosting JSON-LD, symmetric hreflang, and switches to translated slug
    await page.goto('/insights/separating-business-problems-from-website-feature-requests');
    await expect(page.locator('.rich-table')).toBeVisible();
    await expect(page.locator('blockquote')).toBeVisible();
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.some((s) => s.includes('"@type":"BlogPosting"'))).toBe(true);
    await expect(page.locator('link[rel="alternate"][hreflang="id"]')).toHaveAttribute(
      'href',
      'https://colonyhub.id/id/insights/memisahkan-masalah-bisnis-dari-daftar-fitur-website',
    );
    await page.locator('.header-actions .lang a[hreflang="id"]').click();
    await expect(page).toHaveURL(/\/id\/insights\/memisahkan-masalah-bisnis-dari-daftar-fitur-website$/);

    // Single-language EN article must NOT emit hreflang="id" to listing
    await page.goto('/insights/why-direct-consultation-channels-beat-long-forms');
    await expect(page.locator('link[rel="alternate"][hreflang="id"]')).toHaveCount(0);
    await expect(page.locator('.header-actions .lang a[hreflang="id"]')).toHaveAttribute(
      'href',
      '/id/insights',
    );

    // Unknown article slug returns HTTP 404
    expect((await request.get('/insights/unknown-slug-check')).status()).toBe(404);
    expect((await request.get('/id/insights/unknown-slug-check')).status()).toBe(404);
  });

  test('Contact page provides direct WhatsApp and Email channels with context (no inquiry form)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/contact?service=web-development');

    // No inquiry form exists on /contact
    await expect(page.locator('form')).toHaveCount(0);

    // Selected service context is reflected in WhatsApp & Email links
    await expect(page.getByText('Selected context: Build Unit')).toBeVisible();
    const waLink = page.locator('a[data-cta-id="contact_whatsapp_cta"]');
    await expect(waLink).toHaveAttribute('href', /https:\/\/wa\.me\/6289675293838\?text=.*Build%20Unit/);

    const emailLink = page.locator('a[data-cta-id="contact_email_cta"]');
    await expect(emailLink).toHaveAttribute('href', /mailto:hello@colonyhub\.id\?subject=.*Build%20Unit/);
    await expect(page.getByRole('button', { name: 'Copy email' })).toBeVisible();
  });
});
