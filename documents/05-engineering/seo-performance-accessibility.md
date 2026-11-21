# SEO, performance & accessibility requirements

**Status:** Implementable technical recommendations. Source brand guide requires SEO + GEO readiness, clean sitemap/robots, Organization and Service schema, `llms.txt`, and good Core Web Vitals (pp.3,10).

Use [SEO.md](SEO.md) for the production domain, localized metadata, article publishing, structured data, sitemap, and crawler controls. This document also covers performance budgets and accessibility.

## 1. Search discoverability

- One unique descriptive `<title>` and meta description per indexable page.
- Canonical tags correspond to public permalink; prevent duplicate content from filter/query URLs.
- Generate XML sitemap with published canonical pages only; update on publish/unpublish.
- `robots.txt` allows public content and excludes private/preview/admin routes as appropriate; ensure preview is explicitly noindex (robots blocking alone is not sufficient to hide all URLs).
- Use sensible internal links: article → relevant service/project; project → service; service → real work.
- Implement redirects for renamed routes with no redirect loops.
- Supply Open Graph and Twitter/X summary metadata using genuine images and copy.
- Add source-recommended `llms.txt` only if maintained accurately; do not assume it guarantees AI citations/indexing.

## 2. Structured data

- `Organization` schema on relevant brand page with factual name, url, logo only when final, real social profiles.
- `Service` schema on service pages if representation truly matches offer.
- `Article`/`BlogPosting` on editorial pages with actual headline, author, published date, modified date and image.
- `BreadcrumbList` where breadcrumbs are displayed.
- Test JSON-LD against current validation tools; no fake review/rating/FAQ rich result markup.

## 3. Content SEO

- Clear search intent and distinct value on each service page.
- Articles should add experience and original analysis; cite relevant primary sources and dates.
- Keep headings coherent and avoid repetition/keyword stuffing.
- Handle archived/deleted posts intentionally: redirect only to true equivalents; else valid 404/410.
- Set `lang` accurately; implement hreflang only after independently reviewed translations exist.

## 4. Core Web Vitals acceptance targets (PROPOSED)

At the 75th percentile of real-user page loads: **LCP <= 2.5s, INP <= 200ms, CLS <= 0.1**. These are widely used 'good' thresholds; results require monitoring after launch. Synthetic Lighthouse scores are supplementary, not proof of real-world performance.

## 5. Performance controls

- Keep hero payload small; preload only actual LCP asset if beneficial.
- Responsive `<picture>`/`srcset`, modern image formats, explicit dimensions, thoughtful crop and lazy loading below fold.
- Never lazy-load critical above-the-fold imagery by default.
- Fonts self-hosted/optimized where licensing allows; use subsets, font-display strategy, fallbacks and limited font weights.
- Avoid heavy universal hydration, third-party trackers and scroll animation libraries.
- Budget bundle and media per template; review actual network waterfall before locking numbers.
- CDN caching, content revalidation and edge delivery selected per stack.

## 6. Accessibility goal

**Target WCAG 2.2 AA**, subject to manual verification. Check:

- Semantic landmarks and heading order, meaningful link names.
- Keyboard access and focus visibility for all actions.
- Sufficient contrast for text, icons and focus controls.
- Responsive text reflow and zoom at 200%/400% as applicable.
- Alt text for informative images; decorative images hidden appropriately.
- Menus and dialogs use appropriate labels and focus behavior.
- Forms use persistent labels, instructions, `aria-describedby` error text and success announcements.
- No color-only feedback or animation required for comprehension.
- Respect reduced motion; ensure touch target size/spacing.

## 7. Prelaunch SEO QA

- Crawl all public routes; no accidental staging canonical URLs.
- Validate sitemap and robots response.
- Check HTML source contains primary copy and relevant metadata.
- Check page-specific social share previews.
- Confirm 404 returns true HTTP 404, not soft-404 with 200.
- Confirm pagination crawlable and no infinite-only article feed.
- Verify data schema output on representative service/article/project pages.
- Check redirects, trailing slash policy and HTTPS canonical consistency.

## 8. Postlaunch reporting

Weekly during initial launch: availability, form delivery, critical errors, indexed pages, sitemap coverage and mobile Core Web Vitals trend. Monthly: qualified inquiries, high-performing services/articles, conversion paths and page-level content changes. Use actual data; do not set ungrounded performance claims.
