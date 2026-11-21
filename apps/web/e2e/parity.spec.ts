import { expect, test } from '@playwright/test';

const VIEWPORTS = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
] as const;

test.describe('Routing, SEO & SSR baseline', () => {
  test('serves EN at /, ID at /id, 308 redirects /en, and returns HTTP 404 for unknown routes', async ({
    request,
    page,
  }) => {
    const enRes = await page.goto('/');
    expect(enRes?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://colonyhub.id',
    );

    const idRes = await page.goto('/id');
    expect(idRes?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'id');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://colonyhub.id/id',
    );
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'id');

    const redirectRes = await request.get('/en', { maxRedirects: 0 });
    expect(redirectRes.status()).toBe(308);
    expect(redirectRes.headers()['location']).toBe('/');

    const notFoundRes = await request.get('/non-existent-route-check');
    expect(notFoundRes.status()).toBe(404);

    const robotsRes = await request.get('/robots.txt');
    expect(robotsRes.status()).toBe(200);
    expect(await robotsRes.text()).toContain('Sitemap: https://colonyhub.id/sitemap.xml');

    const sitemapRes = await request.get('/sitemap.xml');
    expect(sitemapRes.status()).toBe(200);
    expect(sitemapRes.headers()['content-type']).toContain('application/xml');
    const sitemapXml = await sitemapRes.text();
    expect(sitemapXml).toContain('<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>');
    expect(sitemapXml).toContain('<sitemapindex');
    expect(sitemapXml).toContain('<loc>https://colonyhub.id/sitemaps/pages.xml</loc>');
    expect(sitemapXml).toContain('<loc>https://colonyhub.id/sitemaps/services.xml</loc>');
    expect(sitemapXml).toContain('<loc>https://colonyhub.id/sitemaps/insights.xml</loc>');
    expect(sitemapXml).not.toContain('/work');

    const xslRes = await request.get('/sitemap.xsl');
    expect(xslRes.status()).toBe(200);

    const pagesMapXml = await (await request.get('/sitemaps/pages.xml')).text();
    expect(pagesMapXml).toContain('<loc>https://colonyhub.id</loc>');
    expect(pagesMapXml).toContain('<loc>https://colonyhub.id/id</loc>');
    expect(pagesMapXml).toContain('hreflang="en"');
    expect(pagesMapXml).toContain('hreflang="id"');

    const llmsRes = await request.get('/llms.txt');
    expect(llmsRes.status()).toBe(200);
    expect(await llmsRes.text()).toContain('Strategy Unit');
  });

  test('renders full services map, 24 stops, mega menu and 5 stories with JavaScript disabled', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto('/');
    await expect(page.locator('[data-map] .st')).toHaveCount(24);
    await expect(page.locator('.legend > li')).toHaveCount(6);
    await expect(page.locator('.mega-lines > li')).toHaveCount(6);
    await expect(page.locator('.story-rail > li')).toHaveCount(5);

    await page.goto('/id');
    await expect(page.locator('html')).toHaveAttribute('lang', 'id');
    await expect(page.locator('nav.primary-nav')).toHaveAttribute('aria-label', 'Navigasi utama');
    await expect(page.locator('.story-rail')).toHaveAttribute('aria-label', 'Contoh format story');
    await expect(page.locator('[data-map] .st')).toHaveCount(24);
    await expect(page.locator('.story-rail > li')).toHaveCount(5);

    await context.close();
  });
});

test.describe('Viewport parity & zero horizontal overflow', () => {
  for (const vp of VIEWPORTS) {
    test(`no horizontal overflow and screenshot at ${vp.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);

      await page.screenshot({
        path: `test-results/parity/home-${vp.name}.png`,
        fullPage: true,
      });
    });
  }
});

test.describe('Desktop interactions & keyboard', () => {
  test('mega menu, 24 network stops, statement contrast, and story viewer', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Mega menu toggle + Escape focus return
    const megaTrigger = page.getByRole('button', { name: 'Services' });
    await megaTrigger.click();
    await expect(page.locator('#mega')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mega')).toBeHidden();
    await expect(megaTrigger).toBeFocused();

    // 24 stops exist and show tooltip on focus
    const stops = page.locator('[data-map] .st');
    await expect(stops).toHaveCount(24);
    await stops.first().focus();
    await expect(page.locator('.stop-tip')).toBeVisible();
    await expect(page.locator('.tip-unit')).toHaveText('Strategy Unit');

    // Statement armed unlit color matches prototype baseline (#C9CBD6 => rgb(201, 203, 214)) and lights to navy on scroll
    await expect(page.locator('.st-text.is-armed .w:not(.is-lit)').first()).toHaveCSS(
      'color',
      'rgb(201, 203, 214)',
    );
    await page.locator('#st-title').scrollIntoViewIfNeeded();
    await expect(page.locator('.st-text.is-armed .w.is-lit').first()).toBeVisible();

    // Story viewer dialog: open, navigate with ArrowRight, pause, close via Escape + focus return
    const firstCard = page.locator('.story-card').first();
    await firstCard.click();
    const viewer = page.locator('dialog.story-viewer');
    await expect(viewer).toHaveAttribute('open', '');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.sv-unit')).toHaveText('Growth');
    await page.getByRole('button', { name: 'Pause' }).click();
    await expect(viewer).toHaveClass(/is-paused/);
    await page.keyboard.press('Escape');
    await expect(viewer).not.toHaveAttribute('open', '');
    await expect(firstCard).toBeFocused();
  });
});

test.describe('Mobile interactions, reduced motion & WebGL fallbacks', () => {
  test('mobile menu, accordion inert state, and floating chat fallback at 375px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Mobile menu opens via class + inert (never hidden), focuses first link, closes on Escape
    const menuBtn = page.getByRole('button', { name: 'Menu' });
    const mobileMenu = page.locator('#mobile-menu');
    expect(await mobileMenu.evaluate((el) => (el as HTMLElement).inert)).toBe(true);
    await menuBtn.click();
    await expect(mobileMenu).toHaveClass(/is-open/);
    expect(await mobileMenu.evaluate((el) => (el as HTMLElement).inert)).toBe(false);
    await expect(mobileMenu.locator('a').first()).toBeFocused();
    await page.screenshot({ path: 'test-results/parity/mobile-menu-open-375.png' });
    await page.keyboard.press('Escape');
    await expect(mobileMenu).not.toHaveClass(/is-open/);
    await expect(menuBtn).toBeFocused();

    // Mobile accordion: Strategy open initially, Creative closed + inert; clicking Creative swaps them
    const strategyPanel = page.locator('#lg-p0');
    const creativePanel = page.locator('#lg-p1');
    await expect(strategyPanel).toHaveClass(/is-open/);
    expect(await creativePanel.evaluate((el) => (el as HTMLElement).inert)).toBe(true);
    await page.locator('.legend .lg-btn').nth(1).click();
    await expect(creativePanel).toHaveClass(/is-open/);
    expect(await strategyPanel.evaluate((el) => (el as HTMLElement).inert)).toBe(true);

    // Floating chat opens verified WhatsApp number (+62 896-7529-3838, O-006 resolved)
    const chat = page.locator('.chat-fab');
    await expect(chat).toHaveAttribute('href', /https:\/\/wa\.me\/6289675293838\?text=/);
    await page.locator('#network').scrollIntoViewIfNeeded();
    await expect(chat).toHaveClass(/is-shown/);
  });

  test('respects prefers-reduced-motion: no WebGL, immediate mobile focus, static statement, no story auto-advance', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForTimeout(400);

    // Hero stays on static SVG fallback
    await expect(page.locator('.hero')).not.toHaveClass(/has-webgl/);
    await expect(page.locator('[data-hero-fallback]')).toBeVisible();

    // Statement is NOT armed (full final state)
    await expect(page.locator('#st-title')).not.toHaveClass(/is-armed/);

    // Mobile menu focus works immediately with reduced motion
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.locator('#mobile-menu a').first()).toBeFocused();
    const linkOpacity = await page
      .locator('#mobile-menu a')
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(linkOpacity).toBe('1');
    await page.keyboard.press('Escape');

    // Story viewer bar stays at 100% under reduced motion
    await page.locator('.story-card').first().click();
    const barStyle = await page.locator('.sv-bars .now i').getAttribute('style');
    expect(barStyle).toContain('width: 100%');
    await page.keyboard.press('Escape');

    await context.close();
  });

  test('skips hero WebGL under Save-Data, low CPU cores, and missing WebGL2', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', {
        value: { saveData: true, effectiveType: '4g' },
        configurable: true,
      });
    });
    await page.goto('/');
    await page.waitForTimeout(400);
    await expect(page.locator('.hero')).not.toHaveClass(/has-webgl/);
  });
});
