import { expect, test } from '@playwright/test';

const CC_URL = 'http://127.0.0.1:3101';

test.describe('Phase 03 — Colony Command Center CMS, Dynamic RBAC & Tracking Sync', () => {
  test('enforces authentication, noindex headers, and RBAC boundaries', async ({ request }) => {
    // Unauthenticated API access returns 401
    const unauthArticles = await request.get(`${CC_URL}/api/articles`);
    expect(unauthArticles.status()).toBe(401);

    const unauthTracking = await request.get(`${CC_URL}/api/tracking`);
    expect(unauthTracking.status()).toBe(401);

    // Unauthenticated web preview token returns 401
    const badPreview = await request.get('/api/preview?token=invalid.token');
    expect(badPreview.status()).toBe(401);

    // Command Center sends noindex header on login page
    const loginPage = await request.get(`${CC_URL}/login`);
    expect(loginPage.status()).toBe(200);
    expect(loginPage.headers()['x-robots-tag']).toContain('noindex');

    // Unauthenticated redirect to /login
    const rootRedirect = await request.get(`${CC_URL}/`, { maxRedirects: 0 });
    expect(rootRedirect.status()).toBe(307);
    expect(rootRedirect.headers().location).toContain('/login');

    // Sign in as editor
    const editorLogin = await request.post(`${CC_URL}/api/auth/login`, {
      data: { email: 'editor@colonyhub.local', password: 'colonyhub-editor-dev' },
    });
    expect(editorLogin.status()).toBe(200);

    // Editor cannot publish directly (403)
    const editorPublishAttempt = await request.post(`${CC_URL}/api/articles`, {
      data: {
        locale: 'en',
        slug: 'editor-forbidden-publish',
        title: 'Editor Forbidden Publish',
        dek: 'Testing RBAC enforcement.',
        status: 'published',
        categorySlug: 'strategy',
        blocks: [{ type: 'p', text: 'Content.' }],
      },
    });
    expect(editorPublishAttempt.status()).toBe(403);

    // Editor cannot view tracking (403), settings (403), or roles (403)
    expect((await request.get(`${CC_URL}/api/tracking`)).status()).toBe(403);
    expect((await request.get(`${CC_URL}/api/settings`)).status()).toBe(403);
    expect((await request.get(`${CC_URL}/api/roles`)).status()).toBe(403);

    await request.post(`${CC_URL}/api/auth/logout`);
  });

  test('full CMS editorial lifecycle: draft -> private preview -> publish -> slug 308 -> unpublish 404', async ({
    browser,
    request,
  }) => {
    const editorLogin = await request.post(`${CC_URL}/api/auth/login`, {
      data: { email: 'editor@colonyhub.local', password: 'colonyhub-editor-dev' },
    });
    expect(editorLogin.status()).toBe(200);

    const createRes = await request.post(`${CC_URL}/api/articles`, {
      data: {
        locale: 'en',
        slug: 'phase3-live-article-v1',
        title: 'How Integrated Teams Ship Faster',
        dek: 'A real CMS article created during E2E verification.',
        status: 'draft',
        categorySlug: 'engineering',
        blocks: [
          { type: 'h2', text: 'Why handoffs slow teams down' },
          {
            type: 'p',
            text: 'When strategy, design, and engineering share one hub, feedback loops shrink.',
          },
        ],
      },
    });
    expect(createRes.status()).toBe(201);
    const created = (await createRes.json()) as { article: { id: string } };
    const articleId = created.article.id;

    expect((await request.get('/insights/phase3-live-article-v1')).status()).toBe(404);
    expect(await (await request.get('/sitemaps/insights.xml')).text()).not.toContain(
      'phase3-live-article-v1',
    );

    const previewRes = await request.post(`${CC_URL}/api/articles/${articleId}/preview`);
    expect(previewRes.status()).toBe(200);
    const { previewUrl } = (await previewRes.json()) as { previewUrl: string };

    const previewContext = await browser.newContext();
    const previewPage = await previewContext.newPage();
    await previewPage.goto(previewUrl);
    await expect(previewPage.getByText('DRAFT PREVIEW')).toBeVisible();
    await expect(previewPage.locator('h1')).toHaveText('How Integrated Teams Ship Faster');
    const robotsMeta = await previewPage.locator('meta[name="robots"]').getAttribute('content');
    expect(robotsMeta).toContain('noindex');
    await previewContext.close();

    await request.post(`${CC_URL}/api/auth/logout`);
    const reviewerLogin = await request.post(`${CC_URL}/api/auth/login`, {
      data: { email: 'reviewer@colonyhub.local', password: 'colonyhub-reviewer-dev' },
    });
    expect(reviewerLogin.status()).toBe(200);

    expect(
      (await request.patch(`${CC_URL}/api/articles/${articleId}`, { data: { status: 'published' } }))
        .status(),
    ).toBe(200);

    const publicLiveRes = await request.get('/insights/phase3-live-article-v1');
    expect(publicLiveRes.status()).toBe(200);
    expect(await publicLiveRes.text()).toContain('How Integrated Teams Ship Faster');
    expect(await (await request.get('/sitemaps/insights.xml')).text()).toContain(
      'https://colonyhub.id/insights/phase3-live-article-v1',
    );

    expect(
      (
        await request.patch(`${CC_URL}/api/articles/${articleId}`, {
          data: { slug: 'phase3-live-article-v2', status: 'published' },
        })
      ).status(),
    ).toBe(200);

    const oldSlugRes = await request.get('/insights/phase3-live-article-v1', { maxRedirects: 0 });
    expect(oldSlugRes.status()).toBe(308);
    expect(oldSlugRes.headers().location).toContain('/insights/phase3-live-article-v2');
    expect((await request.get('/insights/phase3-live-article-v2')).status()).toBe(200);

    expect(
      (await request.patch(`${CC_URL}/api/articles/${articleId}`, { data: { status: 'archived' } }))
        .status(),
    ).toBe(200);

    expect((await request.get('/insights/phase3-live-article-v2')).status()).toBe(404);
    expect(await (await request.get('/sitemaps/insights.xml')).text()).not.toContain(
      'phase3-live-article-v2',
    );

    await request.post(`${CC_URL}/api/auth/logout`);
  });

  test('Superadmin saves GA4, GTM, and Meta Pixel IDs -> synced to frontend with Strict Opt-in Cookie Consent', async ({
    browser,
    request,
  }) => {
    await request.post(`${CC_URL}/api/auth/login`, {
      data: { email: 'admin@colonyhub.local', password: 'colonyhub-admin-dev' },
    });

    // Rejects invalid/XSS payload
    const badRes = await request.patch(`${CC_URL}/api/tracking`, {
      data: { enabled: true, ga4MeasurementId: '<script>evil()</script>' },
    });
    expect(badRes.status()).toBe(400);

    // Saves valid GA4, GTM, and Meta Pixel IDs
    const saveRes = await request.patch(`${CC_URL}/api/tracking`, {
      data: {
        enabled: true,
        ga4MeasurementId: 'G-TEST123456',
        gtmContainerId: 'GTM-TEST123',
        metaPixelId: '123456789012345',
      },
    });
    expect(saveRes.status()).toBe(200);

    // Fresh visitor on public site: Strict Opt-in -> ZERO tracking scripts loaded before consent
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    // Intercept external tracking script requests so tests stay fast and offline-safe
    await page.route('**/*googletagmanager.com/**', (route) => route.fulfill({ status: 200, body: '' }));
    await page.route('**/*connect.facebook.net/**', (route) => route.fulfill({ status: 200, body: '' }));

    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('.consent-banner')).toBeVisible();
    await expect(page.locator('#colonyhub-ga4-script')).toHaveCount(0);
    await expect(page.locator('#colonyhub-gtm-script')).toHaveCount(0);
    await expect(page.locator('#colonyhub-meta-pixel-script')).toHaveCount(0);

    // Accept all -> GA4, GTM, and Meta Pixel scripts inject immediately
    await page.getByRole('button', { name: 'Accept all' }).click();
    await expect(page.locator('.consent-banner')).toBeHidden();
    await expect(page.locator('#colonyhub-ga4-script')).toHaveCount(1);
    await expect(page.locator('#colonyhub-gtm-script')).toHaveCount(1);
    await expect(page.locator('#colonyhub-meta-pixel-script')).toHaveCount(1);

    await ctx.close();
    await request.post(`${CC_URL}/api/auth/logout`);
  });

  test('Command Center mobile native-app shell has fixed top/bottom bars and zero horizontal overflow at 375px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${CC_URL}/login`);

    await page.getByLabel('Email', { exact: true }).fill('admin@colonyhub.local');
    await page.getByLabel('Password', { exact: true }).fill('colonyhub-admin-dev');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
    await expect(page.locator('.cc-mobile-topbar')).toBeVisible();
    await expect(page.locator('.cc-mobile-tabbar')).toBeVisible();
    await expect(page.locator('.cc-sidebar')).toBeHidden();

    // Check zero horizontal overflow across all 5 native mobile tabs (Overview, Insights, Tracking, Log, Settings)
    for (const tabName of ['Overview', 'Insights', 'Tracking', 'Log', 'Settings']) {
      await page.locator('.cc-mobile-tabbar').getByRole('link', { name: tabName }).click();
      await page.waitForLoadState('networkidle');
      if (tabName === 'Log') {
        await expect(page.getByRole('heading', { name: 'Changelog' })).toBeVisible();
        await page.getByRole('button', { name: 'SEO & Analytics' }).click();
        await expect(page.locator('.cc-changelog-card')).toHaveCount(1);
        await page.getByRole('button', { name: 'All releases' }).click();
        await expect(page.locator('.cc-changelog-card')).toHaveCount(5);
      }
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    }

    await expect(page.getByText('Roles & Menu Permissions (Dynamic RBAC)')).toBeVisible();
  });

  test('Superadmin manages custom menu-based roles and non-superadmin is denied /api/roles (403)', async ({
    request,
  }) => {
    await request.post(`${CC_URL}/api/auth/login`, {
      data: { email: 'editor@colonyhub.local', password: 'colonyhub-editor-dev' },
    });
    expect((await request.get(`${CC_URL}/api/roles`)).status()).toBe(403);
    await request.post(`${CC_URL}/api/auth/logout`);

    await request.post(`${CC_URL}/api/auth/login`, {
      data: { email: 'admin@colonyhub.local', password: 'colonyhub-admin-dev' },
    });
    const createRoleRes = await request.post(`${CC_URL}/api/roles`, {
      data: {
        name: 'Growth Tracking',
        description: 'Manages GA4/GTM/Meta Pixel IDs only.',
        permissions: {
          overview: { view: true },
          tracking: { view: true, edit: true },
        },
      },
    });
    expect(createRoleRes.status()).toBe(201);
    const createdRole = (await createRoleRes.json()) as {
      role: { id: string; slug: string; permissions: Record<string, { view: boolean }> };
    };
    expect(createdRole.role.permissions.tracking?.view).toBe(true);
    expect(createdRole.role.permissions.insights?.view).toBe(false);

    expect((await request.delete(`${CC_URL}/api/roles/${createdRole.role.id}`)).status()).toBe(200);
    await request.post(`${CC_URL}/api/auth/logout`);
  });
});
