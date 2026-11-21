# PRD — colonyhub agency website

**Version:** 0.1 | **Status:** Proposed requirements | **Direction:** Creative × Technology  
**Owner:** To be assigned | **Source:** Brand Guidelines v1.0; agreed brainstorm and selected identity.

## 1. Executive summary

Create a high-craft, fast, accessible digital agency website that communicates what colonyhub does, demonstrates genuine work and cross-disciplinary thinking, educates through an Insights publication, and collects qualified project inquiries.

This is a public-facing marketing and editorial website, not a client portal or internal project-management application. Portfolio evidence, technical accuracy, ease of editing and conversion clarity take priority over spectacle.

## 2. Problem

A visitor must quickly understand why colonyhub is relevant, what it delivers, how it works and how to start a conversation. A generic agency site offers service labels without credible depth; a purely aesthetic creative site may fail to establish delivery reliability. The product balances both.

## 3. Goals and success criteria

| Goal | Observable outcome | Measurement proposal |
|---|---|---|
| Explain the offer | Visitor can identify primary services | Qualitative five-second test |
| Establish trust | Visitors inspect work and process | Work-detail engagement, scroll events |
| Generate inquiries | Prospective clients submit viable briefs | Inquiry submissions + qualification rate |
| Build organic visibility | Useful content can be discovered/indexed | Search Console clicks and indexing |
| Enable publishing | Editor can publish projects and articles | Successful editor task without code deploy |
| Express brand | Usability tests recognize clear, modern, connected identity | Brand recall and qualitative feedback |

**No numeric conversion or traffic targets are set yet.** Baseline and targets require real analytics and commercial capacity data.

## 4. Non-goals (initial release)

- No account login, customer dashboard, billing, payments or project management **on the public site**. (The internal Colony Command Center, the custom CMS, is a separate authenticated app; its feature scope is decided separately, see decision log 2026-11-21.)
- No AI chatbot by default.
- No fabricated awards, project data or auto-generated “proof”.
- No multilingual site unless resourcing and editorial ownership are approved.
- No complex animation framework for decorative transitions.

## 5. Target audience

SMEs/local brands, startups and B2B teams defined in source (p.2). Inferred buying journeys are detailed in `../01-strategy/positioning-and-audiences.md`.

## 6. Information architecture

| Route | Type | Primary job |
|---|---|---|
| `/` | Static + dynamic | Introduce, orient, prove, convert |
| `/work` | Dynamic index | Browse evidence |
| `/work/[slug]` | Dynamic template | Understand project approach and outcome |
| `/services` | Static + CMS content | Find relevant capabilities |
| `/services/[slug]` | Dynamic/static template | Evaluate a specific offer |
| `/approach` | Static | Understand process, collaboration and scope |
| `/insights` | Dynamic index | Discover editorial content |
| `/insights/[slug]` | Dynamic template | Read article with sources and related content |
| `/about` | Static + optional team CMS | Understand brand and real team |
| `/contact` | Form | Start a project inquiry |
| `/privacy` | Legal | Explain data practices (legal copy required) |
| `/404` | System | Recover from missing route |

## 7. User stories and acceptance criteria

### FR-01 Navigation / orientation — P0
**As a visitor,** I can navigate core destinations from any page.
- Desktop navigation exposes Work, Services, Approach, Insights, About, project CTA.
- Mobile menu is keyboard operable, labeled and dismissible via Escape.
- Logo returns home; active page is indicated appropriately.
- Breadcrumbs appear on nested pages where helpful; footer links are complete.

### FR-02 Home content — P0
**As a prospect,** I understand what the studio does within the first screen and can explore proof.
- Hero contains specific offer, supporting sentence and one primary CTA.
- Work and capabilities appear before generic company narrative.
- Includes selected articles and a final contact CTA.
- No placeholder clients or fictitious performance numbers in live build.

### FR-03 Work listing — P0
**As a prospect,** I can browse representative work.
- Each project has title, category, visual, short scope description and working detail link.
- A project with no publishable case study can remain draft; empty state is designed.
- Optional category filters are accessible and do not break linkability.

### FR-04 Work details — P0
**As a prospect,** I can understand project context, decisions and result.
- Show challenge, role/scope, approach, work imagery, outcomes *if verified*.
- Clear disclosures for concept work / internal experiments.
- Related work and contact CTA available.

### FR-05 Service overview and detail — P0
**As a prospect,** I can select among six official Colony Units.
- All six services retain official name and correctly summarized scope.
- Each detail describes problems, deliverables, workflow, related work and appropriate CTA.
- Do not publish prices, guaranteed outcomes or SLAs not commercially approved.

### FR-06 Approach — P0
**As a prospect,** I understand how collaboration is structured.
- Show discovery, definition, creation, improvement as **proposed website explanation**, not claimed pre-existing SOP.
- Explain client inputs, review checkpoints and what outputs are expected.

### FR-07 Insights index — P0
**As a reader,** I can discover articles by subject.
- Show featured and recent articles, category browsing, card summaries, date and author.
- Index supports pagination or progressive loading with crawlable URLs.
- Empty category/search state provides recovery.

### FR-08 Article page — P0
**As a reader,** I can read substantial original content comfortably.
- Semantic headings, author, date, update date when relevant, reading time estimate.
- Rich content supports images with alt, tables, code blocks, references, quotes.
- Related articles and relevant non-intrusive CTA; correct metadata.

### FR-09 Inquiry form — P0
**As a prospect,** I can submit a project brief without excessive friction.
- Required: name, reply email, brief description, consent check (as legal policy requires).
- Optional: service needs, company, budget range, timeline, attachment only if secure upload implemented.
- Client-side + server-side validation, bot protection and rate limiting.
- Explicit success and failure states; never claim submission succeeded before backend confirmation.
- Server stores/sends inquiries to an approved destination; avoid secrets in client code.

### FR-10 CMS editing — P0
**As an editor,** I can draft, preview and publish articles and projects.
- Slug uniqueness, publication status, author/byline, image metadata and SEO fields.
- Scheduled publication desirable but can be P1 if CMS cannot support reliably.
- Admin routes securely authenticated; role boundaries documented.

### FR-11 Technical discoverability — P0
- Unique titles/descriptions/canonical URLs and XML sitemap.
- robots.txt, correct index/noindex behavior, Organization/Service/Article structured data where valid.
- Article feed optional P1; `llms.txt` as source-recommended artifact, not a substitute for SEO.

### FR-12 Accessibility — P0
- Target WCAG 2.2 AA, with a documented audit covering navigation, form errors, contrast, focus states, screen reader labeling and reduced motion.

### FR-13 Performance — P0
- Aim for good Core Web Vitals at 75th percentile in real user data (LCP <= 2.5s, INP <= 200ms, CLS <= 0.1), tracked separately for mobile/desktop.
- Prefer static/ISR delivery where appropriate, image optimization and minimal JS.

### FR-14 Analytics — P0
- Privacy-aware events: `project_cta_click`, `service_view`, `work_detail_view`, `article_view`, `inquiry_submit_success`, `inquiry_submit_error`.
- Consent and regional privacy requirements reviewed before enabling non-essential tracking.

### FR-15 System states — P0
- 404, form errors, empty collections, loading and image fallback states are designed and tested.

## 8. Key flows

**Discovery → inquiry:** Search/referral → Homepage/Service → relevant Work → Approach (optional) → Contact → validated send → confirmation.

**Thought leadership → inquiry:** Organic article → related article/service → proof/work → Contact.

**Portfolio proof:** Home → Work → Case study → next work/Contact.

## 9. Required content inputs

Real project list, client permissions, art assets, team bios/photos with consent, legal contact name/address where applicable, approved service scope, response policy, legal/privacy notices, at least a few publishable articles, editorial owner.

## 10. Dependencies and risks

| Risk | Impact | Mitigation |
|---|---|---|
| No publishable work | Low credibility | Use clearly marked internal concepts; do not claim clients |
| Six capabilities with limited capacity | Overpromise | Define approved scope and primary lead services |
| Strong visuals harm speed | SEO/UX regression | Performance budgets, compressed media, motion restraint |
| CMS complexity | Slow delivery | Select based on editor workflow, not hype |
| Articles without original knowledge | Weak authority | Field notes and real practitioner review |
| Inquiry spam / privacy risk | Operational burden | Validation, consent, anti-spam, retention policy |

## 11. Definition of done for v1

All P0 flows work; route and metadata QA complete; responsive and accessibility tests pass agreed thresholds; no placeholder claims; inquiries reliably delivered and monitored; editorial CMS demonstrated to an editor; real published content available; privacy/legal review completed; deployment and rollback documented.

## 12. Open decisions

See `../06-delivery/decision-log.md`. Most significant: logo master; lead service and audience; live content availability; locale; tech stack/CMS; inquiry destination; analytics/legal obligations.
