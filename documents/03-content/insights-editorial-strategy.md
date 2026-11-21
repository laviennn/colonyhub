# Insights / Journal — editorial and publishing strategy

**Status:** Proposed content program. **Source anchor:** brand guide uses `colonyhub Insights` for content/research (p.12); SEO+GEO, articles and editorial channels described pp.3, 10–12.

## Publication identity

Name in navigation: **Insights**. Optional editorial label: **The Journal** (proposed).  
Mission: explain how strategy, design, engineering and growth decisions get made; publish genuine experience, experiments and useful analytical work. This is not a general tech news aggregator.

## Audience and conversion

- Client prospects: evaluate depth and judgment.
- Designers/developers/marketing peers: find practical, replicable learning.
- Search readers: solve a specific question then discover relevant work/services.

Editorial CTAs should fit topic, e.g. a site-speed article links to Build Unit, but not every paragraph becomes a sales pitch.

## Initial taxonomy (PROPOSED)

| Category | Includes | Example story (IDEA, not a published post) |
|---|---|---|
| Design | Identity, UX, systems, art direction | Mengapa design system bukan sekadar kumpulan komponen |
| Engineering | Web apps, architecture, automation, performance | Kapan sebuah website perlu dibangun secara custom? |
| Growth | SEO, GEO, content, analytics, ads | Traffic bertambah, tetapi lead tidak: apa yang diperiksa? |
| Strategy | Positioning, customer insight, decisions | Kapan bisnis membutuhkan rebranding? |
| Field Notes | Project lessons, experiments, workflow | Catatan dari proses menyederhanakan inquiry form |

Avoid category proliferation. One primary category per post; optional tags where editorially useful.

## Content mix proposal

- 40% practical explainers, grounded in first-hand work or cited documentation.
- 25% case-linked technical/creative breakdowns.
- 20% field notes, experiments and retrospectives.
- 15% researched perspectives and comparisons.

These are planning ratios, not brand source requirements. Prefer 1 excellent article over multiple thin posts. The source's 90-day launch plan suggests 2 SEO/GEO articles per week (p.12), but **capacity and quality should determine actual cadence**.

## Article template

```md
---
title: "Specific title that describes the question"
slug: "human-readable-slug"
description: "A concrete, accurate summary (not keyword stuffing)."
category: "Engineering"
author: "Approved author display name"
publishedAt: "YYYY-MM-DD"
updatedAt: null
coverImage: "/approved/path.webp"
coverAlt: "Meaningful description"
status: "draft"
featured: false
relatedServices: ["build"]
---

# Article title

Short lead: what the reader will learn and why it matters.

## The problem

Context and constraints.

## How we approached it

Specific decisions, experiments, sources and results.

## Trade-offs

What this solution does not solve.

## What we'd do next

A pragmatic closing with relevant references.
```

## Editorial quality gate

1. Identify reader question and actual first-hand contribution.
2. Verify facts, dates, statistics, specs and claims; link to primary sources where possible.
3. Check whether examples are real, hypothetical or anonymized; label clearly.
4. Provide useful screenshots, measurements, citations, diagrams or code when relevant.
5. Edit out filler, repetitive abstractions, artificial intros and clickbait.
6. Confirm author ownership and substantive human review.
7. Check accessibility, internal linking, preview and metadata.
8. Publish and monitor performance; revise when evidence changes.

## Editorial voice

Prefer: `Kami menguji dua cara memuat gambar dan mengukur dampaknya.`  
Avoid: `Di era digital yang terus berkembang pesat, optimalisasi website adalah kunci kesuksesan.`

Use SEO as a discovery mechanism, not a reason to publish shallow, duplicated or automated pages. Include original data only where legitimately available.

## Index UX

Featured card, topic filters, recently published feed, stable pagination and explicit empty results. Search functionality is P1 unless article inventory makes it necessary. On mobile, filters must remain usable without horizontal overflow.

## Article UX

Comfortable text measure ~65–75ch, 16–18px body, persistent or inline ToC for long posts, readable code blocks with horizontal scrolling, responsive tables, source list, published/updated timestamps and related content. Avoid disruptive sticky popups.

## Technical essentials

Unique metadata and canonical, valid `Article`/`BlogPosting` JSON-LD only for truthful fields, XML sitemap, `hreflang` only if true language alternates exist, open graph image, RSS optional, image compression, article-byline accountability. Avoid automatically generating fake author profiles.

## Draft launch editorial backlog (TOPICS ONLY)

1. Memisahkan masalah bisnis dari permintaan fitur website.
2. Mengapa website portfolio membutuhkan studi kasus, bukan sekadar gallery.
3. Cara mengevaluasi Core Web Vitals tanpa terpaku pada satu skor.
4. Apa beda SEO teknis dan optimasi konten untuk mesin jawaban AI?
5. Kapan automasi operasional justru menambah kompleksitas?
6. Memilih CMS berdasarkan alur kerja editor, bukan tren framework.
7. Kenapa CTA sederhana kadang lebih efektif daripada banyak formulir.
8. Bagaimana menyusun design tokens yang masuk akal untuk tim kecil.
9. Pelajaran dari audit navigasi mobile pada sebuah website (hanya jika audit benar dilakukan).
10. Membandingkan static delivery, SSR dan ISR untuk situs agency.

Do not publish these titles as if articles already exist.

## Editorial ownership / governance (OPEN)

Define editor in chief, expert reviewer, publication permissions, image licensing, correction policy, publication cadence and archival approach. Plan quarterly content audits; update or unpublish inaccurate posts.
