# AGENTS.md — colonyhub

Instructions for any AI coding agent working in this repository.

## What this project is

The marketing + editorial website for **colonyhub**, an integrated digital agency (strategy, creative, build, growth, social, data). Direction: **Creative × Technology** — editorial art direction backed by credible engineering. Tagline: *Grow together. Move as one.*

Status: approved homepage prototype (`prototype/`, live at https://colonyhub.vercel.app). Production stack decided: **Next.js** (App Router, TypeScript) + a **custom-built CMS, the Colony Command Center**, on Vercel (decision log 2026-11-21). Proposed monorepo layout and open choices: `documents/05-engineering/technical-guidelines.md` §2. The planning kit lives in `documents/`.

## UI/UX baseline (binding)

The prototype v0.4 in `prototype/` is the **approved UI/UX baseline**. Spec and parity checklist: `documents/04-design/ui-ux-baseline.md`.

- When rebuilding in the production stack, **port at parity first** (tokens → layout → components → motion → WebGL hero), then refactor. Do not redesign, re-time or "simplify" motion while porting.
- Use the tokens in the baseline §3 only; no new colours, easings or durations without an approved decision.
- Panels animate with class + `inert`, never by toggling `hidden`. Every motion has a static, reduced-motion-safe state.
- Copy and service data move to the CMS/locale files unchanged (`prototype/i18n.js`, `prototype/services-data.js`).
- A change to the baseline is a decision: record it in `documents/06-delivery/decision-log.md` and update the baseline doc.

## Source of truth (in priority order)

1. `documents/Brand Identity Guidelines — colonyhub 2.pdf` — identity, voice, colors, type, service names.
2. `refference/visual.jpg` — **final logo direction** (C-shaped Hub Mark, wordmark, variants).
3. `documents/06-delivery/decision-log.md` — confirmed decisions and open questions. Read it before making product, copy or design choices.
4. The rest of `documents/` — proposals; treat as recommendations unless the decision log confirms them.

Brand rules always override generic skills or style preferences (e.g. anti-slop skills that ban Inter: colonyhub mandates Inter for body).

`refference/refference-*.{jpg,png}` are mood references only. Take layout ideas, not their fake stats, logo strips, glassmorphism or floating cards.

## Confirmed decisions (summary)

- Name is always `colonyhub` — lowercase, one word.
- Bilingual site, **English default**, Indonesian second locale; write each locale natively.
- No portfolio yet: Work section, client logos, testimonials and metrics stay hidden until real content exists. Never fabricate clients, numbers, quotes or awards.
- "Free consultation" / "Konsultasi Gratis" is a real offer and may be the primary CTA.
- Six official service names: Strategy Unit, Creative Unit, Build Unit, Growth Unit, Social Unit, Data Unit. Packages: Seed, Grow, Scale (no published prices).
- three.js only for the hero "living colony" (raymarched SDF), as progressive enhancement over a static SVG, lighter on phones (see decision log).
- Mobile floating chat opens WhatsApp with a default message; the business number is still pending (O-006).
- Command Center RBAC is **Superadmin-managed Dynamic Menu-Based RBAC** (`technical-guidelines.md` §2.1): every admin menu must be registered in one central `ADMIN_MENUS` registry so adding a new menu automatically registers its RBAC permissions (accessible to `superadmin`, fail-closed/deny by default for custom roles until granted).

## Brand tokens

Colors: Hub Navy `#0B1230`, Colony Periwinkle `#8A94F2`, Signal Lime `#C6F432`, Cloud White `#F6F4EE`, Slate `#5A6178`, Mist `#E4E6F0`, Coral Pulse `#FF6B4A`, Deep Indigo `#3F4BB8`. Ratio 60/25/10/5. Gradient "Colony Glow" periwinkle → indigo at 135°; lime is always solid.

Contrast: navy text on lime/periwinkle; white on navy/indigo; never white on lime or lime text on white.

Type: Sora 600–700 (display), Inter 400–500 (body/UI), JetBrains Mono 400–500 (labels, data, tags). Sentence case or lowercase headlines.

Shape and motion: radius 12–20px, 1.5px connector lines, outline icons 1.5–2px, motion 200–400ms ease-out, always honor `prefers-reduced-motion`.

## Voice

Clear, warm, confident, to the point. No hype ("#1", "best in Indonesia", "innovative leading solutions", "instant"), no guaranteed rankings or results, don't force colony/ant metaphors. Show work and trade-offs instead of claims.

## Engineering bar

- Performance is design: Core Web Vitals good at p75 (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1). Minimal JS, static/ISR where possible.
- Accessibility: WCAG 2.2 AA, keyboard + visible focus, semantic HTML, labeled forms.
- SEO/GEO: unique metadata, canonical, sitemap, robots, valid JSON-LD (Organization/Service/Article) only with truthful fields, `hreflang` for EN/ID, `llms.txt`.
- Production origin is `https://colonyhub.id`. Follow `documents/05-engineering/SEO.md` for localized metadata, dynamic articles, publication and indexing.
- Typed code, central design tokens (no stray hex values), semantic HTML before custom JS.
- Secrets never in client code or commits. Inquiry form: client + server validation, rate limiting, consent.
- Don't claim work is done without running the relevant checks.

## Global skills

Agents working in this repository should actively leverage the following global skills installed under `~/.gemini/config/skills/` (and Marketplace plugins). **colonyhub brand rules and the UI/UX baseline always take precedence** over generic skill preferences.

- **`superpowers`** *(Marketplace plugin, with hooks)* — TDD, systematic debugging, implementation planning, code review, and verification before claiming completion.
- **`design-taste-frontend`** — Anti-AI-slop art direction and layout craft for marketing pages and internal app screens (honor colonyhub's brand tokens and Inter body font).
- **`antislop*`** (`antislop`, `antislop-ui`, `antislop-copywriting`, `antislop-code`, `antislop-layoutmobile`, `antislop-human`) — Anti-AI-slop guardrails for UI craft, human copywriting, mobile layout, clean code, and WCAG/contrast checks (colonyhub brand rules take precedence).
- **`impeccable`** — UI critique, audit, polish, typography (`typeset`), and layout refinement.
- **`web-design-guidelines`** — 100+ accessibility, performance, and UX UI review checks.
- **`composition-patterns`** — Clean, scalable React component composition patterns.
- **`threejs-*`** (`threejs-fundamentals`, `threejs-shaders`, `threejs-performance`, etc.) — WebGL / Three.js raymarched SDF hero optimization and shader work.
- **`seo-geo-aeo`** — Technical SEO, Generative Engine Optimization (GEO), and Answer Engine Optimization (AEO) alongside `documents/05-engineering/SEO.md`.
- **`code-review-skill`** — Structured pre-merge and post-implementation code reviews.

## Repository layout

```
documents/   planning kit (strategy, product, content, design, engineering, delivery) + brand PDF
prototype/   approved static homepage prototype = UI/UX baseline (deployed by Vercel)
refference/  logo direction (visual.jpg) and mood references
vercel.json  serves only prototype/ on Vercel
```

## Deploy

- GitHub `main` auto-deploys to production at https://colonyhub.vercel.app (Vercel project `laviennns-projects/colonyhub`). Other branches get protected preview URLs.
- Push to `main` only when the user asks; prefer a branch + preview for larger changes.

## Git

- Remote: `git@github-creosphera:laviennn/colonyhub.git` (SSH host alias `github-creosphera`).
- Commit only when asked; short imperative commit messages.
