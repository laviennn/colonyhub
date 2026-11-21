# AGENTS.md — colonyhub

Instructions for any AI coding agent working in this repository.

## What this project is

The marketing + editorial website for **colonyhub**, an integrated digital agency (strategy, creative, build, growth, social, data). Direction: **Creative × Technology** — editorial art direction backed by credible engineering. Tagline: *Grow together. Move as one.*

Status: planning. No application code or stack chosen yet. The planning kit lives in `documents/`.

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
- three.js only for the hero node-convergence animation, as progressive enhancement over a static SVG (see decision log).

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
- Typed code, central design tokens (no stray hex values), semantic HTML before custom JS.
- Secrets never in client code or commits. Inquiry form: client + server validation, rate limiting, consent.
- Don't claim work is done without running the relevant checks.

## Repository layout

```
documents/   planning kit (strategy, product, content, design, engineering, delivery) + brand PDF
refference/  logo direction (visual.jpg) and mood references
```

## Git

- Remote: `git@github-creosphera:laviennn/colonyhub.git` (SSH host alias `github-creosphera`).
- Commit only when asked; short imperative commit messages.
