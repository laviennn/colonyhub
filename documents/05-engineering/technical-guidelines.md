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

## 2. Architecture

**DECIDED (2026-11-21):** Next.js (App Router, TypeScript) + custom-built CMS, the **Colony Command Center**, hosted on Vercel. Headless SaaS CMS options are out.

### Confirmed structure (2026-11-21)

```text
apps/
  web/              public site: Next.js App Router, [locale] routes (en default, /id), SSG + ISR
  command-center/   internal app: content, inquiries, and future colony operations; auth + roles
packages/
  db/               Postgres schema + migrations (Drizzle ORM), typed queries shared by both apps
  ui/               tokens and components ported from the prototype baseline (plain CSS / CSS modules)
  content/          content types, validation (Zod), slug + SEO helpers
  config/           tsconfig, eslint, prettier
```

| Concern | Proposal | Why |
|---|---|---|
| Monorepo | Turborepo + pnpm | One schema and one token set for both apps |
| Public rendering | Server Components, static generation, `revalidateTag` on publish | Fast pages, no rebuild per edit |
| Interactivity | Client components only for the baseline interactions (hero WebGL, network map, accordion, story viewer, menus, chat) | Keep JS small; port prototype logic, not redesign |
| Styling | Prototype CSS kept as CSS variables + CSS modules (no Tailwind for the port) | Parity with the baseline |
| i18n | `[locale]` segment with middleware, `hreflang`, dictionaries from `prototype/i18n.js` | EN default, ID second |
| Database | Postgres (e.g. Neon via Vercel Marketplace) | Relational data for content and operations |
| Auth (command center) | Auth.js or Better Auth, role-based access, MFA, own subdomain | Internal tool, separated from the public site |
| Media | Vercel Blob + `next/image` | Uploads from the command center, optimised delivery |
| Inquiry form | Server Action → validation (Zod) → `inquiries` table + email (Resend) + Turnstile + rate limit | Lands in the command-center inbox |
| Preview | Draft mode in `apps/web`, toggled from the command center | Editors see drafts before publishing |
| Analytics | Vercel Web Analytics (cookieless) | No consent banner needed for basic metrics |
| Testing | Vitest (units), Playwright (E2E + visual parity vs prototype screenshots), axe, Lighthouse CI | Enforce the baseline parity checklist |

**OPEN:** database and auth providers, command-center feature scope beyond CMS/inquiries, backup/restore policy.

### 2.1 Dynamic Menu-Based RBAC (Colony Command Center) — DECIDED (2026-11-22)

Command Center access control is **menu-driven and managed by `superadmin`**, not hardcoded to fixed role enums:

1. **Single Menu Registry (`ADMIN_MENUS`):** Every backoffice screen/module is registered in one central typed registry (`key`, `label`, `href`, `defaultActions[]`, e.g. `view`, `create`, `edit`, `publish`, `delete`).
2. **Automatic RBAC provisioning on new menus:** Whenever a developer adds a new menu to `ADMIN_MENUS`, the RBAC sync layer automatically registers all corresponding `<menu_key>:<action>` permissions in the `permissions` / `role_permissions` tables on boot/migration — no manual permission seeding required.
3. **Fail-closed default:** New menus are automatically accessible to `superadmin` (`*`), while all custom roles default to **deny** until `superadmin` explicitly enables permissions for that menu.
4. **Custom roles managed by `superadmin`:**
   - Tables: `roles` (`id`, `slug`, `name`, `description`, `is_system`), `menu_permissions` / `role_menu_permissions` (`role_id`, `menu_key`, `can_view`, `can_create`, `can_edit`, `can_publish`, `can_delete`), and `users.role_id`.
   - `superadmin` can create/edit/delete custom roles (e.g. *Editorial Lead*, *Content Writer*, *Sales / BD*) and toggle per-menu checkboxes from the Command Center Roles & Permissions UI.
   - `superadmin` role itself is protected (`is_system = true`) and cannot be locked out or deleted.
5. **Dual enforcement:**
   - **UI layer:** Desktop sidebar and mobile native bottom tab bar render only menus where the user has `can_view = true`.
   - **Server layer (authoritative):** Every page, Server Action, and API route enforces `requireMenuPermission(menuKey, action)` on the server and returns `403 Forbidden` when denied.

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
