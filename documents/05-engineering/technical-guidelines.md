# Technical & development guidelines

**Status:** Architecture recommendations, NOT a confirmed technology decision.  
**Product:** editorial agency website with CMS, project portfolio and inquiry form.

## 1. Engineering goals

- Fast page loading and excellent reading experience on low-powered mobile devices.
- Strong technical SEO and accessible semantic output.
- Easy editorial updates without developer intervention.
- Small, understandable codebase and reusable view components.
- Secure collection of prospect information.
- Responsive art direction without sacrificing image performance.

## 2. Architecture option matrix

| Option | Strength | Cost / trade-off | Recommendation |
|---|---|---|---|
| Astro + headless CMS | Light client JS, content-first rendering | App-like interactions need islands/integrations | Strong candidate for marketing + editorial |
| Next.js + headless CMS | Flexible SSR/SSG/ISR and rich React ecosystem | Greater runtime/build complexity if overused | Strong candidate if team already React-heavy |
| Static site + Git-based content | Simple deploy, minimal infrastructure | Editor workflow may be technical | Suitable for small editorial team |

**OPEN:** framework, rendering, hosting, CMS, data ownership, operational capacity. Do not assume an existing app stack. Prioritize needs and maintainer expertise over fashion.

## 3. Delivery model

Most content should be pre-rendered or cached where appropriate. Only forms, filters (if client-side), menus and interactive media require browser scripting. Content update strategy must define revalidation, preview and webhook behavior, including failure recovery.

## 4. Recommended project structure (ILLUSTRATIVE, stack-neutral)

```text
src/
  app-or-pages/            # Routes and page shells
  components/
    layout/                # header, footer, section
    ui/                    # button, input, filter, breadcrumb
    editorial/             # article components
    work/                  # project components
  content/                 # schemas, queries, adapters
  lib/                     # seo, validation, utilities
  styles/                  # tokens, global styles
  assets/                   # static brand files
  tests/
```

Actual directories should follow chosen framework conventions.

## 5. CMS requirements

Required types: site settings, services, projects, articles, authors, categories, reusable SEO metadata, global navigation/footer configuration (with safe editorial permissions). Editorial workflow: draft → review → published; preview must be protected/noindex; uploads optimized with meaningful alt text.

CMS candidates should be compared for editing UX, schema validation, roles, backups, price, hosting model, image transformations, localization and preview integration. No CMS is selected in this kit.

## 6. Form processing and privacy

- Validate inputs both client and server; schema allowlist and length limits.
- Rate-limit server endpoint, anti-spam challenge/honeypot as warranted, and do not expose secret tokens.
- Deliver inquiries to approved destination (mail, CRM or database); log success/failure without collecting unnecessary personal content.
- Require TLS; include CSRF protection when using cookie-authenticated submission, secure cookie attributes and strict CORS where applicable.
- Define retention and deletion policy for inquiry PII. Only send marketing communications with appropriate consent.
- Never assert response SLA until business operations approve it.
- Include success ID/log trace for support if needed, but do not expose sensitive internal identifiers.

## 7. Security checklist

- Server-side input validation; escape untrusted output; prevent XSS in rich-text rendering.
- Use CSP compatible with the selected framework, security headers, and dependency updates.
- Keep CMS and hosting API keys server-side; rotate leaked secrets.
- Role-based editorial access and MFA where supported.
- Back up content and document restore testing.
- Sanitize embeds and restrict file upload type/size if enabled.
- Avoid leaking draft routes and preview tokens in indexed pages or logs.

## 8. Coding standards

- TypeScript or typed schema validation where ecosystem supports.
- Feature-oriented components; no giant, page-spanning one-off JSX/CSS without reason.
- Semantic HTML and native controls before custom scripts.
- Central design tokens; no arbitrary unrelated color hex in components.
- Accessible component state coverage and meaningful tests.
- Document content contracts and service-specific reusable templates.
- Keep vendor-specific logic inside adapters to allow replacement.
- Avoid complex motion libraries until simple CSS/native animation is insufficient.
- three.js is permitted only for the hero "living colony" (raymarched SDF shader on one full-screen quad): dynamically imported after first paint, isolated in one component/island, static SVG fallback as LCP, render loop paused off-screen/hidden tab, reduced render scale with auto-downscale (lighter on phones), skipped for `prefers-reduced-motion`, `saveData`/2G, ≤ 2 cores or no WebGL2, resources disposed on unmount, and its JS budget tracked in CI. Port `prototype/hero-nodes.js` as-is first; see `../04-design/ui-ux-baseline.md` §5.
- The rebuild must reach parity with the approved prototype before refactoring behaviour (`../04-design/ui-ux-baseline.md` §1 and §9).

## 9. Testing pyramid

- Unit: schemas, slugs, metadata construction, validation, date formatting.
- Component: menu, cards, filters, article renderer, form states.
- Integration: CMS fetch, preview, inquiry delivery, redirects.
- E2E: navigation, mobile menu, article browsing, contact submission, 404.
- A11y: automated checks plus keyboard/screen reader manual audit.
- Performance: mobile synthetic tests and post-launch real-user metrics.

## 10. Environments and deployment

Dev, preview/staging (noindex, restricted where possible), production. CI checks format, lint, typecheck, unit tests, build, link health and smoke tests. Document deploy permissions, DNS, environment variable ownership, backup, rollback, monitoring, and incident contact.

## 11. Observability

Track uptime, broken routes, form errors, CMS fetch errors, Core Web Vitals, 404 frequency and indexability. Avoid capturing form free text into general analytics. Alert recipient and threshold to be approved.

## 12. Definition of a production-safe feature

A feature is complete only when real content renders, keyboard works, errors are handled, mobile layout is checked, SEO/metadata are sane, analytics events are privacy-reviewed, test coverage matches risk and owner knows how to maintain it.
