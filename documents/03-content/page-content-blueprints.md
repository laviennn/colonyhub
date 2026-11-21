# Page content blueprints — colonyhub

**Status:** Proposed architecture and sample copy, not approved final marketing claims.  
**Language direction:** Indonesia-first body content; selective English display labels. **OPEN** pending locale decision.  
**Voice:** Clear, warm, precise, not hyperbolic (source pp.8–9).

## Global content rules

- Every page: clear H1, 1 primary action, specific subject matter and useful internal links.
- Show the real work before abstract value statements; never create fictional case studies or testimonials.
- Copy below is **illustrative working copy**, not sourced business facts.
- Prefer short paragraphs, meaningful names, no empty slogan stacking.
- Avoid forced “colony / nest / hive” metaphors outside their useful context.

## 1. Homepage `/`

> **Superseded by the approved baseline (2026-11-21).** The homepage now follows prototype v0.4: Hero (split wordmark + media panel) → Network map (Services, with 24 stop explanations) → Statement → Route (Approach) → Tickets (Seed/Grow/Scale) → Colony Stories → Insights → About → CTA → Footer. Live copy: `prototype/index.html`, `prototype/i18n.js`, `prototype/services-data.js`. Section spec: `../04-design/ui-ux-baseline.md` §4. The table below is kept as the original proposal for reference.

**Goal:** Establish Creative × Technology identity, demonstrate work, direct relevant inquiries.  
**Sample SEO title:** `colonyhub — Creative & Technology Digital Agency`.

| Order | Section | Required content | Suggested treatment |
|---|---|---|---|
| 01 | Hero | H1, one-sentence proposition, main CTA, work link | Editorial typography, navy base, subtle node motif |
| 02 | Credibility strip | Actual clients/capabilities or approved factual context | No invented logos |
| 03 | Selected Work | 2–4 publishable projects | Strong imagery, alternating editorial grid |
| 04 | What We Do | All six Colony Units + simple description | Numbered typographic index |
| 05 | How We Work | Four-stage process, intended outputs | Quiet process layout |
| 06 | The Colony Mindset | Meaning of connected disciplines | Compact brand statement + diagram |
| 07 | From the Journal | 3 actual articles | Editorial cards, category/author/date |
| 08 | Final CTA | Contact invite and next step | High-contrast navy/lime |

**Proposed hero:**

> Independent thinking. Connected execution.  
> Strategi, desain, dan teknologi yang bekerja dalam satu arah. Kami membantu merancang, membangun, dan mengembangkan pengalaman digital yang dibutuhkan bisnis Anda.

Buttons: **Lihat pekerjaan kami** and **Diskusikan proyek**. Choose one primary visual emphasis (usually project inquiry if evidence is ready).

**Selected work heading:** `Built with intent.` / `Pekerjaan yang berangkat dari masalah nyata.`

**Services intro:** `Berbeda disiplin. Satu proses kerja.` (Do not promise complete staffing before staffing confirmed.)

**Insights heading:** `Notes from the work.` / `Catatan tentang desain, engineering, dan pertumbuhan digital.`

**Footer CTA:** `Have something in mind? Let's make it work.`

## 2. Work `/work`

**Goal:** Let prospective clients inspect real work.  
**H1 suggestion:** `Our work, in context.`

Sections: short intro → featured case (optional) → project index → filters (only if inventory warrants) → project inquiry CTA.

**Card fields:** cover; name; year; service categories; short scope; destination; optional verified result label. Default sorting curated featured first, then publish date/year. Accessible filter changes update results count.

**Empty inventory rule:** If fewer than 2 eligible projects, feature real internal experiments clearly labeled and keep the index proportionate; do not invent commercial client logos.

## 3. Case study `/work/[slug]`

1. Hero: title, client/public name as approved, project type, year, cover and 1-sentence summary.
2. At a glance: services, delivery context, team role, scope and timeline if publicly permissible.
3. Context and challenge: business/user problem and constraints.
4. Strategy and decisions: the rationale behind creative and technical choices.
5. Execution: identity work, IA, UX, development, technical architecture, campaign work as applicable.
6. Gallery: responsive screenshots, detailed imagery, media captions and alt text.
7. Outcomes: verified metrics only; if unavailable, describe delivered outputs and what remains unmeasured.
8. Reflection: what changed, what was learned, or next steps.
9. Related work / start a project CTA.

**Sample opening:** `A clearer path from product discovery to purchase.` (Only use where case evidence supports it.)

**Status label:** `Client project`, `Internal project`, or `Concept study`.

## 4. Services `/services`

**H1 suggestion:** `What we do, together.`

Intro: Explain connected strategy, creative, build and growth, grounded by six official units. Present as editorial index instead of identical card overload.

| Official unit | Human-readable subheading | Supporting topics |
|---|---|---|
| Strategy Unit | Find the right direction | Brand strategy, research, positioning, roadmap |
| Creative Unit | Make the idea visible | Identity, graphics, motion, content/video |
| Build Unit | Turn ideas into working products | Websites, e-commerce, web apps, automation |
| Growth Unit | Find and improve demand | SEO, GEO, content, paid campaigns |
| Social Unit | Build the conversation | Social management, community, KOL |
| Data Unit | Know what's working | Analytics, CRM, reporting and dashboards |

After units: explain Seed/Grow/Scale as **collaboration models**, with descriptions from source and clear no-price disclaimer where appropriate; related work and CTA.

## 5. Service detail `/services/[slug]`

Template order:

1. Eyebrow official unit + H1 explaining outcome.
2. Problem to solve (2–4 realistic contexts).
3. What is included: specific deliverables and what is not included.
4. Related work: real matching projects.
5. Workflow: how discovery, production and review happen.
6. Engagement model (if approved) and common questions.
7. Contextual CTA: `Diskusikan kebutuhan [layanan]`.

**Build Unit proposed copy:**

> Websites that work beyond the first impression.  
> Dari struktur konten hingga implementasi, kami menghubungkan desain dan pengembangan untuk membangun website yang jelas, cepat, dan mudah dikelola.

**SEO/GEO copy caution:** Do not promise rank positions, AI answer inclusion, or a measurable uplift absent evidence.

## 6. Approach `/approach`

**H1:** `A clearer way to work together.`

Sections: collaboration principle → four **proposed** stages (Discover / Define / Create / Improve) → checkpoints and communication → what the client prepares → outputs → related project → CTA.

Describe inputs: objectives, stakeholder, current assets, access requirements. Describe review cycles and approvals only when operationally agreed. If not, write as intended future process, not established client procedure.

## 7. Insights `/insights`

**H1:** `Ideas, experiments, and everything in between.`

Sections: editorial intro → featured article (real) → categories → recent articles with pagination → optional newsletter **only if a real subscription system and consent exist** → contextual footer.

Card: image, category, headline, excerpt (1–2 sentences), author, date. Avoid clickbait thumbnails.

## 8. Article `/insights/[slug]`

Structure: breadcrumb → category → H1 → dek → author/date/reading time → hero → structured content with H2/H3 → useful references → related reading → context-aware service/work CTA. Optional ToC for longer articles; share links as standard URLs; update history only when meaningful.

## 9. About `/about`

**H1:** `Different minds. One direction.`

Sections: real founding story → why connected disciplines → 5 values expressed through behaviors → people (with permissions) → documentary work photos → roles/collaboration → contact CTA.

Never invent founding date, number of members, names, office, credentials or culture rituals as existing facts merely because they are aspirational in the brand guide.

## 10. Contact `/contact`

**H1:** `Tell us what you're working on.`

Intro: `Ceritakan kebutuhan Anda. Mulai dari konteks dan tujuan, belum harus berupa brief yang sempurna.`

Fields: name*; email*; description*; service(s) optional; company optional; budget optional; timeline optional; consent checkbox if required. Optional alternative direct business email only if verified. Avoid a mandatory attachment upload in MVP.

**Error:** `Ada beberapa bagian yang belum lengkap. Periksa kolom yang ditandai.`  
**Success:** `Pesan terkirim. Terima kasih sudah menghubungi colonyhub.` (Show only after confirmed submission.)

Response time: do not promise `24 hours` unless an owner confirms staffing/SLA.

## 11. 404 & legal

404 source phrase (p.9): `Halaman ini keluar dari koloni. Mari kita antar kembali ke beranda.` Provide Home/Work/Insights recovery links. Privacy page requires a real legal review of data collected, storage, processors, retention and contact owner; this kit does not supply legal policy text.

## 12. Footer

Oversized but simple CTA → contact/social links (real) → navigation → privacy → legal copyright statement → official tagline. Do not display placeholder emails/domain as functional links.
