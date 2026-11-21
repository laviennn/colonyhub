# Decisions, assumptions and open questions

**Updated:** 21 November 2026. This log prevents speculative details from being mistaken for brand/source requirements.

## Confirmed

| ID | Decision | Basis |
|---|---|---|
| D-001 | Brand name is `colonyhub` lowercase | Source brand guide p.1 |
| D-002 | Website direction is **Creative × Technology** | User selection |
| D-003 | Blog/articles are part of core website | User requirement |
| D-004 | Official tagline `Grow together. Move as one.` | Source p.3 |
| D-005 | Six service units retain source names/scopes | Source pp.3–4 |
| D-006 | Brand palette Sora/Inter/JetBrains Mono | Source pp.6–7 |
| D-007 | Clarity, transparency and measurement are central | Source pp.1–3, 8–10 |

## Proposed for approval

| ID | Proposal | Rationale |
|---|---|---|
| P-001 | Work first in desktop navigation | Proof-forward creative agency framing |
| P-002 | Use `Insights` as main article navigation label | Aligned with `colonyhub Insights` source |
| P-003 | Seven top-level destinations | Focus without overcrowding |
| P-004 | Indonesia-first body copy, selective English headline | Local-market readability with creative tone |
| P-005 | Four-step Discover/Define/Create/Improve approach | Simple client-friendly process explanation |
| P-006 | Editorial typography and restrained motion | Creative × Technology translation |
| P-007 | Build service detail pages for all six units | Clarity and discoverability |
| P-008 | CMS editing for articles/projects | Editorial independence |
| P-009 | Contact brief with minimal required fields | Reduce friction and avoid abandonment |

## Open / must resolve before design freeze

| ID | Question | Blocked deliverable |
|---|---|---|
| O-001 | Which logo concept is final and where are SVG assets? | Visual identity approval |
| O-002 | Who is primary buyer and which services lead acquisition? | Hero positioning and service emphasis |
| O-003 | What client work can be published with evidence/permissions? | Work and homepage proof |
| O-004 | Are Seed/Grow/Scale operational offers with scope/prices? | Service CTA and engagement copy |
| O-005 | Final language strategy: ID, EN or bilingual? | Localization / content production |
| O-006 | Production domain confirmed: `colonyhub.id`. Business email and WhatsApp number remain open. | Live contact, CTAs and legal |
| O-007 | ~~Which framework, CMS, host, image pipeline?~~ **Resolved 2026-11-21:** Next.js + custom-built CMS ("Colony Command Center") on Vercel. Remaining: database, auth, storage and command-center feature scope (see below) | Engineering implementation |
| O-008 | Where do inquiries go and who responds? | Contact delivery and policies |
| O-009 | Who owns editorial sign-off and source checks? | Publishing governance |
| O-010 | What real KPIs/analytics baseline and consent model apply? | Success measurement |
| O-011 | Who approves privacy policy and retention procedures? | Contact form launch |
| O-012 | Approved real team bios, founding story, photos? | About page |

## Source vs proposal rules

- **SOURCE:** a rule/text explicitly contained in original PDF.
- **USER DECISION:** a direction explicitly selected by user.
- **PROPOSED:** an operational/design/product elaboration not yet approved.
- **OPEN:** requires owner decision or actual evidence.

## Decision updates

### 2026-11-21 — O-001 Logo
- New decision: logo follows `refference/visual.jpg` — C-shaped Hub Mark (one large node + connected smaller nodes, one Signal Lime accent node), wordmark `colony` navy / `hub` periwinkle, tagline in spaced caps. Variants: Primary (dark), Secondary (light), Inverse (periwinkle), Favicon (lime).
- Note: visual.jpg states minimum size 24px / 8mm; PDF p.5 states 16px symbol / 96px horizontal. Treat visual.jpg as newer; confirm.
- Still needed: master SVG files and exact wordmark font.
- Approved by: user.

### 2026-11-21 — O-003 Portfolio
- New decision: no publishable work yet. Work section/routes stay empty/hidden at launch; no concept studies or placeholder projects.
- Affected: Home Selected Work, `/work`, related-work modules, credibility strip, testimonials (all hidden until real content exists).
- Approved by: user.

### 2026-11-21 — Free consultation offer
- New decision: "Konsultasi Gratis" / free consultation is a real offer and may be used as primary CTA (source p.8).
- Approved by: user.

### 2026-11-21 — O-005 Language
- New decision: bilingual site, **English default**, Indonesian as second locale. Each locale written natively; correct `hreflang`/`lang`.
- Supersedes P-004 (Indonesia-first body copy).
- Approved by: user.

### 2026-11-21 — Three.js scope
- New decision: three.js (WebGL) is allowed **only** for the hero node-convergence animation (nodes gathering into the C Hub Mark). No 3D elsewhere, no decorative 3D spectacle, no post-processing glow.
- Constraints: progressive enhancement (static SVG/CSS fallback renders first and is the LCP element), lazy-load after first paint, pause when off-screen or tab hidden, disabled under `prefers-reduced-motion` and on low-power devices, must not regress LCP/INP/CLS budgets.
- Approved by: user.

### 2026-11-21 — UI/UX baseline approved (prototype v0.3)
- New decision: the homepage prototype in `prototype/` (live at colonyhub.vercel.app) is the approved UI/UX baseline: "colony transit map" world, split-wordmark hero with media panel, network map with stop explanations, mobile accordion, statement moment, route, tickets, floating WhatsApp chat, and all motion specs.
- The production rebuild ports it at parity before any redesign. Spec and parity checklist: `documents/04-design/ui-ux-baseline.md`.
- Supersedes the earlier homepage layout proposals in `page-content-blueprints.md` §1 and `wireframe-specs.md` §1.
- Approved by: user.

### 2026-11-21 — Three.js scope (revised)
- Previous position: hero node convergence with flat nodes and lines; skipped on narrow screens.
- New decision: hero uses the raymarched "living colony" (SDF spheres + liquid bridges + lime colonists + pointer drop). It now also runs on phones in a lighter mode (0.5× render scale, 32 steps, ~30 fps cap, auto-downscale). Still skipped for reduced motion, Save-Data/2G, ≤ 2 cores, no WebGL2; static SVG remains the LCP element. Still no 3D anywhere else.
- Approved by: user.

### 2026-11-21 — Floating chat (mobile)
- New decision: mobile-only floating chat that opens WhatsApp with a language-aware default message.
- Blocked on: verified business WhatsApp number (O-006). Until then it links to the on-page contact section.
- Approved by: user.

### 2026-11-21 — Colony Stories (Instagram)
- New decision: add a "Colony Stories" section for the official account @colonyhub.id: designed story-engagement frames with a story viewer. No Instagram embed, no video files: the 2D/3D brand art and stickers are the final content. Follower count is not shown.
- Current content: five frames (poll, quiz, slider, question, this-or-that), one per unit theme. The CTA links to the Instagram profile.
- Spec: `documents/04-design/ui-ux-baseline.md` §5. Approved by: user.

### 2026-11-21 — Stories section reframed as portfolio
- Previous position: "Colony Stories" presented the frames as colonyhub's own Instagram activity, with CTAs to the profile.
- New decision: the section is a **social content showcase**: story-engagement formats colonyhub makes for client brands, shown as samples in colonyhub's own brand. CTAs lead to the free consultation; no Instagram link or follower count in the section.
- Approved by: user.

### 2026-11-21 — Tech stack (O-007)
- Previous position: open; Astro + Sanity was proposed and declined.
- New decision: **Next.js** (App Router, TypeScript) for the public site, and a **custom-built CMS** instead of a headless SaaS CMS. The CMS is not only content admin: it becomes the **Colony Command Center**, an internal operations hub with more features over time. Hosting stays on **Vercel**.
- Proposed (awaiting confirmation): monorepo with `apps/web` (public site) and `apps/command-center` (internal, authenticated, own subdomain); shared `packages/db`, `packages/ui` (tokens + components from the baseline), `packages/config`; Postgres + Drizzle ORM; Auth.js/Better Auth with roles and MFA; Vercel Blob for media; cache tags + on-demand revalidation from the command center to the site. Details: `documents/05-engineering/technical-guidelines.md` §2.
- Still open: command-center feature scope (beyond content: e.g. inquiries inbox, clients, projects, reporting), database provider, auth provider, who administers access.
- Approved by: user (Next.js + custom CMS).

### 2026-11-21 — Production domain (O-006)
- New decision: `https://colonyhub.id` is the public production origin for canonical URLs, sitemap, structured data, and social metadata.
- Current prototype: `colonyhub.vercel.app`. Verify DNS, TLS and redirects during production cutover.
- Still needed: verified business email and WhatsApp number (user confirmed 2026-11-21 these will follow later; use Brand Identity PDF content and keep `#contact` fallback until verified).
- Approved by: user.

### 2026-11-21 — Monorepo structure confirmed (O-007)
- Previous position: monorepo layout proposed in `technical-guidelines.md` §2 awaiting confirmation.
- New decision: confirmed Turborepo + pnpm monorepo (`apps/web`, `apps/command-center`, `packages/db`, `packages/ui`, `packages/content`, `packages/config`) with Next.js App Router + TypeScript, plain CSS tokens/stylesheets for baseline parity, Drizzle ORM schema scaffold, and Vitest + Playwright verification.
- Still open (for Phase 03): hosted Postgres provider (Neon vs alternative), Auth provider (Auth.js vs Better Auth) + admin access owner, Command Center feature scope beyond CMS/inquiries, and backup/restore policy.
- Approved by: user.

### 2026-11-21 — Statement pre-lit color kept at baseline parity
- Previous position: Phase 01 tested changing `.st-text.is-armed .w` from `#C9CBD6` (1.47:1) to `var(--slate)` (`#5A6178`, 5.59:1) for pre-scroll contrast.
- New decision: keep `#C9CBD6` verbatim per prototype v0.4 and `ui-ux-baseline.md` §5 to preserve the dim-to-lit scroll micro-interaction. The pre-scroll state is treated as a decorative transition stage; words light to `#0B1230` (16.70:1) and `#3F4BB8` (6.56:1) as they enter reading position, and `prefers-reduced-motion` / no-JS render the full final state immediately.
- Affected docs/routes: `packages/ui/src/styles/homepage.css`, `documents/06-delivery/implementation/01-foundation/checkpoint.md`.
- Approved by: user.

### 2026-11-21 — Floating Restrained Glassmorphism Navbar (Baseline update)
- Previous position: full-width sticky header (`68px`, `62px` mobile) with bottom hairline border and opaque navy transition on mobile menu open.
- New decision: non-full-width floating pill navbar (`max-width: 1080px` desktop, `760px` tablet, inset mobile bar with `10px` top and `--pad` side breathing room) using **Restrained Glassmorphism** (`rgba(246, 244, 238, 0.78)` + `blur(18px) saturate(145%)`, subtle specular top hairline, soft outer ring and shadow). Nav text uses `rgba(11, 18, 48, 0.78)` so contrast stays ≥ 5.9:1 even when floating over solid Hub Navy sections. On mobile menu open, the full-viewport frosted Hub Navy sheet (`position: fixed; inset: 0;`) reveals beneath the floating pill while the pill cross-fades to dark navy glass (`rgba(17, 26, 64, 0.84)`) with zero layout jump.
- Affected docs/routes: `packages/ui/src/styles/{tokens,homepage}.css`, `apps/web/src/components/SiteHeader.tsx`, `documents/04-design/ui-ux-baseline.md` §3–§5.
- Approved by: user.

## Change record template

```md
### YYYY-MM-DD — Decision ID
- Previous position:
- New decision:
- Reason and evidence:
- Approved by:
- Affected docs/routes:
- Follow-up owner:
```

### 2026-11-22 — Phase 03 Command Center architecture, auth, inquiry, and mobile native-app UX
- Database: Postgres/Neon-compatible Drizzle ORM (`packages/db`) with atomic local JSON fallback store (`.colonyhub-local-data.json`) when `DATABASE_URL` is unset so local development runs zero-config.
- Auth & RBAC: HTTP-only Postgres-backed sessions (`scrypt` password hashing, MFA-ready schema) with server-enforced roles (`admin`, `reviewer`, `editor`). Command Center sets `X-Robots-Tag: noindex, nofollow, noarchive` on all routes.
- Inquiry flow: `POST /api/inquiries` stores leads in `inquiries` (visible in Command Center Inbox) with Zod validation, honeypot, rate limiting, and `x-idempotency-key` deduplication, plus optional Resend email notification adapter ready for `O-006`.
- Backoffice UI/UX: Hub Navy desktop sidebar + Cloud White workspace; mobile (`<= 768px`) adopts a native-app shell (fixed 56px top app bar, fixed 64px + safe-area bottom tab bar, native tappable cards, segmented editor tabs, and PWA manifest).
- Approved by: user.

### 2026-11-22 — Dynamic Menu-Based RBAC (Colony Command Center)
- Previous position: static hardcoded roles (`admin`, `reviewer`, `editor`) with fixed permission helpers.
- New decision: **Superadmin-managed Dynamic Menu-Based RBAC**.
  - `superadmin` is the highest system role and has full unrestricted access (`*`) plus sole control over Role & Permission management.
  - Permissions are structured **per admin menu** (e.g. `overview`, `insights`, `inquiries`, `settings`, `roles`, and any future menu) with granular actions (`view`, `create`, `edit`, `publish`, `delete`).
  - `superadmin` can create, rename, and configure custom roles and toggle which menus and actions each role is allowed to access, then assign those roles to team accounts.
  - **Auto-RBAC on new menus:** every admin menu must be declared in a single typed Menu Registry (`ADMIN_MENUS`). Adding a new menu automatically registers its RBAC permissions in the DB/sync layer; `superadmin` gets access automatically, while all other custom roles default to deny (fail-closed) until `superadmin` grants access.
  - Sidebar/mobile bottom-bar visibility and server-side route/API guards both read from this same permission matrix.
- Spec added to: `documents/05-engineering/technical-guidelines.md` §2.1 and `AGENTS.md`.
- Approved by: user.

### 2026-11-22 — Direct Contact (O-006 Resolved), Dynamic Tracking (GA4/GTM/Meta Pixel), Consent Mode v2 & UU PDP Privacy Policy
- **O-006 Resolved:** Official business email is `hello@colonyhub.id` and official WhatsApp is `+62 896-7529-3838` (`6289675293838`). Floating mobile WhatsApp chat is now active by default.
- **Direct Contact only (no Inquiry Form):** Removed embedded inquiry form on `/contact`, `/api/inquiries`, and the `Inquiries` menu in Colony Command Center. Visitors connect directly via WhatsApp (with contextual pre-filled message) or Email (`mailto:` + Copy button).
- **Dynamic Tracking in Backoffice:** Added `site_settings` table (`0002_site_settings_tracking.sql`) and `tracking` menu in `ADMIN_MENUS` (automatically enrolled in Dynamic Menu-Based RBAC; superadmin allow, custom roles fail-closed). Stores validated IDs only (GA4 `G-...`, GTM `GTM-...`, Meta Pixel digits — zero raw script injection) and syncs live to `apps/web` via on-demand layout revalidation.
- **Strict Opt-in Cookie Consent & UU PDP Privacy Policy:** Added bilingual Cookie Consent Banner + Preferences Modal (`colonyhub_consent_v1`) implementing Google Consent Mode v2 (`denied` by default, zero third-party scripts loaded before explicit opt-in) and updated `/privacy` & `/id/privacy` per UU No. 27 Tahun 2022 (UU PDP) with Cookie Settings re-open links in Footer and Privacy Policy.
- **GA4-ready CTA Tracking:** All primary CTAs, WhatsApp links, Email links, Service pages, and Articles emit zero-PII events (`cta_click`, `whatsapp_click`, `email_click`, `generate_lead`, `service_view`, `article_view`) to `gtag`, `dataLayer`, and Meta Pixel (`Contact` / `ViewContent`) once consented.
- Approved by: user.

### 2026-11-22 — SEO / GEO / AEO & Antislop Copywriting Audit Refinements (Baseline update)
- **Titles & Zero Em Dashes (`R-02`):** Standardized all 28 EN/ID route `<title>` tags to ≤ 60 characters without duplicate brand names or em dashes (`—`), including homepage (`colonyhub | Integrated digital agency in Indonesia` / `colonyhub | Digital agency terintegrasi di Indonesia`). Removed all remaining em dashes across UI copy, OG image, email subjects, and a11y labels.
- **Production Hygiene (`R-38`):** Replaced the prototype v0.4 footer note with `Jakarta, Indonesia · WIB (UTC+7)`. Preview fixture articles are strictly `noindex, follow` (and automatically replaced once live Command Center articles exist); replaced the outdated inquiry-form fixture with a direct-contact field note and removed dead inquiry form dictionary fields.
- **Heading Hierarchy, GEO & AEO Structure:** Fixed skipped `H1 → H3` headings on all 12 Service Detail pages and `/insights` + `/id/insights`; enriched `Organization` JSON-LD (`description`, `areaServed`, `knowsAbout`, raster PNG `/apple-icon` logo), `Service` (`areaServed`), `ItemList`, `AboutPage`, `ContactPage`, `CollectionPage`, and `BlogPosting` (`Person` author support + conditional real image only per `SEO.md §3`); upgraded `/llms.txt` to dynamic output with EN/ID routes, Instagram, and live published Insights; added a Seed vs. Grow vs. Scale HTML comparison table, concise unit direct-answer blocks, and truthful, non-generic Q&As (`FAQPage` JSON-LD) on `/services`, `/services/[slug]`, and `/approach`.
- **Direct-Contact CTA & Voice Alignment (`R-15`, `R-36`):** Aligned primary consultation CTAs (`Start a free consultation` / `Mulai konsultasi gratis`, `Start a chat` / `Mulai obrolan`) and `/contact` buttons to match the direct WhatsApp/Email/Instagram flow (no implied booking calendar), removed forced colony metaphor on 404, and unified sentence case across legal/footer labels.
- Approved by: user.
