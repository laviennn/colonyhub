# Design system spec — colonyhub

**Status:** Base tokens from Brand Guidelines pp.5–7, 9–10; implementation tokens and component inventory **PROPOSED**.

## 1. Color tokens (SOURCE)

```css
:root {
  --brand-navy: #0B1230;
  --brand-periwinkle: #8A94F2;
  --brand-lime: #C6F432;
  --brand-cloud-white: #F6F4EE;
  --brand-slate: #5A6178;
  --brand-mist: #E4E6F0;
  --brand-coral: #FF6B4A;
  --brand-indigo: #3F4BB8;
}
```

Source guidance: brand balance 60/25/10/5; navy text on lime/periwinkle; white text on navy/indigo; lime should stay solid, not gradient. Brand gradient `linear-gradient(135deg, #8A94F2, #3F4BB8)`.

## 2. Semantic color aliases (PROPOSED)

```css
:root {
  --surface-page: var(--brand-cloud-white);
  --surface-inverse: var(--brand-navy);
  --surface-subtle: var(--brand-mist);
  --text-primary: var(--brand-navy);
  --text-secondary: var(--brand-slate);
  --text-on-dark: var(--brand-cloud-white);
  --action-primary-bg: var(--brand-lime);
  --action-primary-fg: var(--brand-navy);
  --link-on-light: var(--brand-indigo);
  --border-default: var(--brand-mist);
}
```

Do not assume every pairing passes WCAG for small text: audit actual combinations, font sizes and states.

## 3. Typography (SOURCE base)

Display **Sora** 600–700; body **Inter** 400–500; data **JetBrains Mono** 400–500. Desktop reference: H1 56/64, H2 40, H3 28, H4 20, body 16–18, caption 13. Headline sentence case/lowercase.

### Fluid scale (PROPOSED)

```css
:root {
  --font-display: 'Sora', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-hero: clamp(2.5rem, 5vw, 4rem);
  --text-h2: clamp(2rem, 3.4vw, 2.5rem);
  --text-h3: clamp(1.5rem, 2.6vw, 1.75rem);
  --text-body: 1rem;
  --text-lead: clamp(1.05rem, 1.4vw, 1.125rem);
  --leading-body: 1.6;
}
```

Adjust font metrics and wrapping through visual QA; test localization.

## 4. Spacing / grid (PROPOSED)

Use 4px base spacing: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`. Section gaps depend on content, with 64–120px desktop and 48–72px mobile as starting points. Twelve-column desktop grid, 24px typical gap, responsive max container width 1200–1280px. Do not prescribe arbitrary whitespace if content needs tighter grouping.

## 5. Radius / borders (SOURCE + PROPOSAL)

Brand source: cards/buttons/images radius 12–20px and node connectors ~1.5px. Proposed radii: `sm=8` for compact UI, `md=12`, `lg=16`, `xl=20`, `pill=9999`. 8px is an implementation convenience, not an official brand source value. Fine strokes must retain usable contrast.

## 6. Elevation and shadows (PROPOSED)

Prefer borders, whitespace, tone and contrast. Use shadow sparingly for popovers and raised menus. Do not add shadows to the logo (source prohibition).

## 7. Interaction tokens (SOURCE + PROPOSAL)

Motion: 200–400ms ease-out from source. Proposed `fast=150ms` for tiny control feedback and `base=240ms`, `slow=360ms`. Honor reduced-motion and eliminate nonessential reveals.

Focus: visible ring, tested against both navy and white backgrounds; not solely a faint color change. Disabled states maintain legible labels and remain semantically disabled.

## 8. Components to design first

| Priority | Component | Variants/states |
|---|---|---|
| P0 | Header + mobile navigation | Light/dark, open/closed, active |
| P0 | Button | Primary/secondary/text, hover/focus/disabled/loading |
| P0 | Text link | Normal/hover/focus/external if indicated |
| P0 | Project card | Featured/standard, responsive aspect, image fallback |
| P0 | Service row | Icon/index, detail, hover/focus |
| P0 | Article card | Featured/standard, metadata/empty |
| P0 | Category filter | Active/inactive/focus/empty results |
| P0 | Form fields | Text/email/textarea/select, validation and success |
| P0 | Breadcrumbs | Nested pages, mobile wrap |
| P0 | Rich text | H2/H3, list, quote, table, image, code, callout |
| P0 | Footer + CTA | Dark/light themes |
| P1 | Table of contents | Desktop stickiness/mobile inline |
| P1 | Search | Debounced/empty/no-results/error |
| P1 | Metrics / proof block | Only real verified figures |

## 9. Illustrative design tokens JSON

```json
{
  "color": {
    "navy": "#0B1230",
    "periwinkle": "#8A94F2",
    "lime": "#C6F432",
    "cloud": "#F6F4EE",
    "slate": "#5A6178",
    "mist": "#E4E6F0",
    "coral": "#FF6B4A",
    "indigo": "#3F4BB8"
  },
  "type": {"display": "Sora", "body": "Inter", "mono": "JetBrains Mono"},
  "radius": {"card": "16px", "button": "12px", "pill": "9999px"},
  "motion": {"default": "240ms ease-out", "reduced": "none"}
}
```

## 10. Logo implementation blocker

Use a labeled temporary text wordmark in prototypes only, never export it as final approved logo. Final vector versions, safe area and usage tests must be delivered by design owner before production sign-off.

## 11. Component QA

Contrast, semantic button/link roles, touch targets, no hover-only action, responsive image crop, heading wraps, RTL only if future language requires, keyboard focus, error recovery, dark/light surface testing, reduced-motion snapshot.
