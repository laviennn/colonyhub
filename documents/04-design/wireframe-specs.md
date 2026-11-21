# Low-fidelity wireframe specifications

**Status:** Proposed layouts. No final pixel-perfect UI assets are included.

## 1. Home desktop (top to bottom)

```text
┌──────────────────────────────────────────────────────────────┐
│ logo       Work Services Approach Insights About  [Start]   │
├──────────────────────────────────────────────────────────────┤
│ HERO: 7-col editorial headline | 5-col restrained visual    │
│ 1 sentence + primary/secondary CTA                         │
├──────────────────────────────────────────────────────────────┤
│ Trust strip (real approved proof only)                      │
├──────────────────────────────────────────────────────────────┤
│ SELECTED WORK               featured project large         │
│                 project B      project C                    │
├──────────────────────────────────────────────────────────────┤
│ WHAT WE DO             01 Strategy  02 Creative             │
│ editorial service list 03 Build     04 Growth               │
│                        05 Social    06 Data                │
├──────────────────────────────────────────────────────────────┤
│ HOW WE WORK: Discover → Define → Create → Improve           │
├──────────────────────────────────────────────────────────────┤
│ THE COLONY MINDSET: narrative + subtle node diagram         │
├──────────────────────────────────────────────────────────────┤
│ FROM THE JOURNAL: lead article + 2 smaller cards            │
├──────────────────────────────────────────────────────────────┤
│ CONTACT CTA / layered dark footer                           │
└──────────────────────────────────────────────────────────────┘
```

**Mobile:** navigation drawer; hero single-column; work cards stack; services become full-width rows; avoid horizontal marquee dependency; article cards stack or 2 across only at viable widths.

## 2. Work index

```text
Page intro → featured work (large) → optional category filters
→ project gallery (varied layout but logical reading order)
→ contact CTA
```

Do not expose inactive category filters where no work exists. Use clear internal/concept labels.

## 3. Work detail

```text
Breadcrumb
Project header: title / type / year / role
Hero imagery
Project facts + summary
Challenge / constraints
Decision process / strategy
Execution gallery / technical notes
Verified outcomes OR honest deliverables
Reflection + Related Work + CTA
```

Avoid burying project context beneath an enormous decorative hero.

## 4. Service overview

```text
Intro / what we do
6 numbered service rows + descriptions
Collaboration models (Seed/Grow/Scale) with clear definitions
Selected relevant work
FAQ (only real answers)
Contact CTA
```

## 5. Service detail

```text
Unit eyebrow + outcome H1
Where we can help (problem scenarios)
What is included / deliverables
Related work
Process / checkpoints
Optional pricing/engagement model IF approved
Questions / CTA
```

## 6. Insights index

```text
Title + editorial introduction
Featured article
Category filters
Recent articles (cards and stable pagination)
Editorial CTA / footer
```

## 7. Article detail

```text
Breadcrumb / category
H1 + dek
Author · published · updated · estimated read
Hero / lead image
Desktop: narrow reading column + optional ToC aside
Mobile: full-width readable column, inline ToC
References, author and related reading
Service/work CTA when relevant
```

## 8. About

```text
Why colonyhub exists
Brand story with real historical facts
Values with actual work behaviors
Team portraits and individual roles (when approved)
Behind the scenes gallery
Let's work together CTA
```

## 9. Contact

```text
Heading / low-pressure explanation
Required: name, email, project description
Optional: service, company, budget, timeline
Consent and Send action
Alternative verified contact method
Success/error responses; privacy link
```

## 10. Edge states

- No portfolio items: curated honest introduction, no placeholder fake agency work.
- No articles: do not advertise journal as content-rich; launch should include actual articles or temporarily make section compact.
- 404: on-brand source copy plus return paths.
- CMS preview: visually distinct preview environment to prevent accidental indexing.
- Form failure: retain input and show retry; never clear on error.
