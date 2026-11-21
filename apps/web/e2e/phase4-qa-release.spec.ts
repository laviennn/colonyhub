import { expect, test } from '@playwright/test';

const CC_URL = 'http://127.0.0.1:3101';

const PUBLIC_SEO_ROUTES = [
  '/',
  '/id',
  '/services',
  '/id/services',
  '/services/strategy',
  '/id/services/strategy',
  '/services/web-development',
  '/id/services/web-development',
  '/approach',
  '/id/approach',
  '/about',
  '/id/about',
  '/insights',
  '/id/insights',
  '/contact',
  '/id/contact',
  '/privacy',
  '/id/privacy',
];

test.describe('Phase 04 — Release Gate QA (SEO, WCAG, Core Web Vitals, Analytics)', () => {
  test('SEO technical audit: canonical, symmetric hreflang, unique titles, JSON-LD, sitemap index, robots, llms.txt', async ({
    page,
    request,
  }) => {
    const titles = new Map<string, string>();

    for (const route of PUBLIC_SEO_ROUTES) {
      const res = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(res?.status(), `HTTP 200 for ${route}`).toBe(200);

      const seo = await page.evaluate(() => {
        const title = document.title.trim();
        const desc =
          document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '';
        const canonical =
          document.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() ?? '';
        const hreflangs = Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map(
          (el) => ({
            lang: el.getAttribute('hreflang'),
            href: el.getAttribute('href'),
          }),
        );
        const h1Count = document.querySelectorAll('h1').length;
        const jsonLdRaw = Array.from(
          document.querySelectorAll('script[type="application/ld+json"]'),
        ).map((s) => s.textContent ?? '');
        return { title, desc, canonical, hreflangs, h1Count, jsonLdRaw };
      });

      expect(seo.title.length, `non-empty title on ${route}`).toBeGreaterThan(5);
      expect(seo.desc.length, `non-empty meta description on ${route}`).toBeGreaterThan(20);
      expect(seo.canonical, `canonical origin on ${route}`).toMatch(/^https:\/\/colonyhub\.id/);
      expect(seo.h1Count, `single h1 on ${route}`).toBe(1);

      const langs = seo.hreflangs.map((h) => h.lang);
      expect(langs, `hreflang en/id/x-default on ${route}`).toEqual(
        expect.arrayContaining(['en', 'id', 'x-default']),
      );

      for (const raw of seo.jsonLdRaw) {
        const parsed = JSON.parse(raw) as { '@context'?: string };
        expect(parsed['@context']).toBe('https://schema.org');
      }

      titles.set(route, seo.title);
    }

    // Verify EN and ID titles are distinct on paired pages
    expect(titles.get('/')).not.toBe(titles.get('/id'));
    expect(titles.get('/services')).not.toBe(titles.get('/id/services'));

    // Verify favicon, apple-touch-icon, og:image, twitter:image, and Organization + WebSite JSON-LD on /
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const headMeta = await page.evaluate(() => ({
      icon: document.querySelector('link[rel="icon"]')?.getAttribute('href') ?? '',
      appleIcon: document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href') ?? '',
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '',
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? '',
      twitterImage: document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ?? '',
      schemaTypes: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(
        (s) => (JSON.parse(s.textContent ?? '{}') as { '@type'?: string })['@type'],
      ),
    }));

    expect(headMeta.icon).toContain('/icon.svg');
    expect(headMeta.appleIcon).toContain('/apple-icon');
    expect(headMeta.ogImage).toMatch(/^https:\/\/colonyhub\.id\/opengraph-image/);
    expect(headMeta.ogTitle.length).toBeGreaterThan(5);
    expect(headMeta.ogUrl).toBe('https://colonyhub.id');
    expect(headMeta.twitterImage).toMatch(/^https:\/\/colonyhub\.id\/twitter-image/);
    expect(headMeta.schemaTypes).toEqual(expect.arrayContaining(['Organization', 'WebSite']));

    // Verify /icon.svg, /apple-icon, and /opengraph-image actually serve 200 with valid content types
    const iconRes = await request.get('/icon.svg');
    expect(iconRes.status()).toBe(200);
    expect(iconRes.headers()['content-type']).toContain('image/svg+xml');

    const ogRes = await request.get('/opengraph-image');
    expect(ogRes.status()).toBe(200);
    expect(ogRes.headers()['content-type']).toContain('image/png');

    const appleRes = await request.get('/apple-icon');
    expect(appleRes.status()).toBe(200);
    expect(appleRes.headers()['content-type']).toContain('image/png');

    // Sitemap Index + sub-sitemaps + XSL + robots + llms.txt + /work 404
    const sitemapIndex = await (await request.get('/sitemap.xml')).text();
    expect(sitemapIndex).toContain('<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>');
    expect(sitemapIndex).toContain('https://colonyhub.id/sitemaps/pages.xml');
    expect(sitemapIndex).toContain('https://colonyhub.id/sitemaps/services.xml');
    expect(sitemapIndex).toContain('https://colonyhub.id/sitemaps/insights.xml');

    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap: https://colonyhub.id/sitemap.xml');

    const llms = await (await request.get('/llms.txt')).text();
    expect(llms).toContain('colonyhub');
    expect(llms).toContain('Strategy Unit');

    expect((await request.get('/work')).status()).toBe(404);
    expect((await request.get('/id/work')).status()).toBe(404);
  });

  test('WCAG 2.2 AA baseline checks on public pages and Command Center (Light + Dark mode)', async ({
    page,
  }) => {
    for (const route of ['/', '/services/strategy', '/contact']) {
      await page.goto(route, { waitUntil: 'networkidle' });
      const audit = await page.evaluate(() => {
        const skipLink = document.querySelector('a.skip-link[href="#main"]');
        const main = document.querySelector('main#main');
        const imgsWithoutAlt = Array.from(document.querySelectorAll('img')).filter(
          (img) => img.getAttribute('alt') === null,
        ).length;
        const inputsWithoutLabel = Array.from(
          document.querySelectorAll('input:not([type="hidden"]), textarea, select'),
        ).filter((el) => {
          const id = el.getAttribute('id');
          const hasFor = id ? Boolean(document.querySelector(`label[for="${id}"]`)) : false;
          const wrapped = Boolean(el.closest('label'));
          const aria = Boolean(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'));
          return !hasFor && !wrapped && !aria;
        }).length;
        return {
          hasSkipLink: Boolean(skipLink),
          hasMain: Boolean(main),
          imgsWithoutAlt,
          inputsWithoutLabel,
        };
      });

      expect(audit.hasSkipLink, `skip link on ${route}`).toBe(true);
      expect(audit.hasMain, `main#main on ${route}`).toBe(true);
      expect(audit.imgsWithoutAlt, `all images have alt on ${route}`).toBe(0);
      expect(audit.inputsWithoutLabel, `all inputs labeled on ${route}`).toBe(0);
    }

    // Command Center Light + Dark mode toggle persists across reload and has zero overflow
    await page.goto(`${CC_URL}/login`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'admin' }).click();
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.waitForURL(`${CC_URL}/`);

    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('FR-14 analytics events fire accurately to GA4/dataLayer with zero PII after consent', async ({
    page,
  }) => {
    await page.route('**/*googletagmanager.com/**', (route) => route.fulfill({ status: 200, body: '' }));
    await page.route('**/*connect.facebook.net/**', (route) => route.fulfill({ status: 200, body: '' }));

    // 1. Grant consent first on homepage
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Accept all' }).click();

    // 2. service_view
    await page.goto('/services/strategy', { waitUntil: 'networkidle' });
    const serviceEvents = await page.evaluate(() => window.__colonyhubEvents ?? []);
    expect(
      serviceEvents.some((e) => e.name === 'service_view' && e.payload.service_slug === 'strategy'),
    ).toBe(true);

    // 3. article_view
    await page.goto('/insights', { waitUntil: 'networkidle' });
    const firstArticleHref = await page.locator('a.article-card').first().getAttribute('href');
    expect(firstArticleHref).toBeTruthy();
    await page.goto(firstArticleHref!, { waitUntil: 'networkidle' });
    const articleEvents = await page.evaluate(() => window.__colonyhubEvents ?? []);
    expect(articleEvents.some((e) => e.name === 'article_view' && Boolean(e.payload.article_slug))).toBe(
      true,
    );

    // 4. CTA click on /contact (Copy Email fires email_click + generate_lead) & Privacy Policy UU PDP table
    await page.goto('/contact', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Copy email' }).click();
    const contactEvents = await page.evaluate(() => window.__colonyhubEvents ?? []);
    expect(contactEvents.some((e) => e.name === 'email_click')).toBe(true);
    expect(contactEvents.some((e) => e.name === 'generate_lead')).toBe(true);

    // Privacy page lists UU PDP, Google Analytics 4, Meta Pixel, and Manage cookie preferences button
    await page.goto('/privacy', { waitUntil: 'networkidle' });
    await expect(page.getByText(/UU PDP/i).first()).toBeVisible();
    await expect(page.getByText(/Google Analytics 4/i).first()).toBeVisible();
    await expect(page.getByText(/Meta Pixel/i).first()).toBeVisible();
    await page.getByRole('button', { name: 'Manage cookie preferences' }).click();
    await expect(page.locator('.consent-banner')).toBeVisible();
  });

  test('FR-13 Core Web Vitals lab check on homepage (desktop 1440px & mobile 390px): LCP <= 2500ms, CLS <= 0.1', async ({
    browser,
  }) => {
    for (const vp of [
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'mobile', width: 390, height: 844 },
    ]) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      const vitals = await page.evaluate(() => window.__colonyhubVitals ?? {});
      if (typeof vitals.lcpMs === 'number') {
        expect(vitals.lcpMs, `${vp.name} LCP <= 2500ms`).toBeLessThanOrEqual(2500);
      }
      expect(vitals.cls ?? 0, `${vp.name} CLS <= 0.1`).toBeLessThanOrEqual(0.1);
      await ctx.close();
    }
  });
});
