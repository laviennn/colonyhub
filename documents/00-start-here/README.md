# colonyhub — Website Documentation Kit

**Direction:** Creative × Technology  
**Version:** Planning v0.1 · 13 November 2026  
**Status:** Draft for product/design alignment, not production approval.

## Product premise

colonyhub is a digital agency combining strategy, creativity, technology, and data through a connected team. Its website is both a business-development channel and a first-party demonstration of craft: an editorial visual language with credible engineering and measurable outcomes.

**Brand tagline:** Grow together. Move as one.  
**Brand name rule:** always `colonyhub` (lowercase, one word), except formal legal contexts.

## Source of truth and precedence

1. **Brand Identity Guidelines — colonyhub, v1.0, 13 pages** (user-provided PDF) governs identity, voice, colors, typography, service nomenclature, brand positioning.
2. The user's selected direction **Creative × Technology** governs the website creative direction.
3. This kit elaborates a proposed product, copy, UX, implementation and rollout plan. These are **recommendations until approved**; they must not be mistaken for claims in the brand PDF.
4. For any conflict, use the source document for established brand rules and record proposed exceptions in `decision-log.md`.

## Read in order

| File | Purpose |
|---|---|
| `01-strategy/brand-foundation.md` | Brand rules and open identity decisions |
| `01-strategy/positioning-and-audiences.md` | Audience/jobs-to-be-done, differentiation hypothesis |
| `02-product/PRD.md` | Product goals, scope, functional requirements, acceptance criteria |
| `02-product/information-architecture.md` | Routes, navigation, user flows, page ownership |
| `03-content/page-content-blueprints.md` | Sections and sample copy for all main pages |
| `03-content/insights-editorial-strategy.md` | Article taxonomy, SEO editorial process, templates |
| `03-content/copywriting-guidelines.md` | Brand voice, writing rules, microcopy |
| `04-design/ui-ux-guidelines.md` | UX principles, responsive behavior, interaction specs |
| `04-design/ui-ux-baseline.md` | **Approved UI/UX baseline** (prototype v0.4): tokens, sections, interaction and motion specs, parity checklist for the rebuild |
| `04-design/design-system.md` | Color/font/layout/component tokens and states |
| `04-design/wireframe-specs.md` | Text wireframes, block-level page hierarchy |
| `05-engineering/technical-guidelines.md` | Architecture options, CMS, data, testing, security |
| `05-engineering/seo-performance-accessibility.md` | Technical SEO, performance and WCAG testing |
| `05-engineering/content-models.md` | Content schema for projects, services, articles |
| `06-delivery/implementation-roadmap.md` | Phases, deliverables, dependencies |
| `06-delivery/qa-acceptance-checklist.md` | Release checklist and QA cases |
| `06-delivery/decision-log.md` | Confirmed vs recommended vs unresolved choices |

## Navigation proposal

Primary desktop: **Work · Services · Approach · Insights · About** plus **Start a Project** CTA. Home reachable via logo. Contact may be linked as CTA, and present in footer. Small screens use accessible menu and explicit CTA.

Canonical routes: `/`, `/work`, `/work/[slug]`, `/services`, `/services/[slug]`, `/approach`, `/insights`, `/insights/[slug]`, `/about`, `/contact`. Legal utility routes: `/privacy` and, if applicable, `/terms`. Not-found route: `/404`.

## Quality bar

- No invented client names, testimonials, statistics, certifications, or results.
- No generic “leading innovative solution” copy, stock handshake imagery, gratuitous 3D blobs, excessive glassmorphism, or decorative motion.
- Each page has one dominant purpose, one primary CTA, and relevant proof.
- Demonstrate craft through genuine screenshots, decisions, and outcomes.
- Design for responsive, accessible, fast and maintainable behavior.
- Publish articles with original insight, identifiable authors and credible sourcing.

## How to use

1. Resolve decisions marked **OPEN** in the decision log.
2. Convert blueprints into low-fidelity wireframes and a shared content inventory.
3. Build a component library before implementing all page variants.
4. Use acceptance criteria and QA checklist as the definition of done.
5. Version docs alongside code; change product assumptions intentionally.

**Not included:** finished logo assets, verified market research, actual portfolio projects, live business contact details, final technology selection or real performance measurements. Those inputs must be supplied or validated before launch.
