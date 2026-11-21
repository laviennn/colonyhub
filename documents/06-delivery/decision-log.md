# Decisions, assumptions and open questions

**Updated:** 13 November 2026. This log prevents speculative details from being mistaken for brand/source requirements.

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
| O-006 | What is approved domain and actual contact email? | Launch metadata, CTAs and legal |
| O-007 | Which framework, CMS, host, image pipeline? | Engineering implementation |
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
