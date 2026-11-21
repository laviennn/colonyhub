# UI/UX guidelines — Creative × Technology

**Source:** Brand Guidelines pp.5–11. New UX rules are project proposals, not existing brand mandates.

> **Baseline:** the approved prototype (`prototype/`, spec in `ui-ux-baseline.md`) is the concrete reference for everything below. When a rule here is generic and the baseline is specific, follow the baseline.

## Design thesis

An independent creative studio's sense of composition, paired with the discipline of a reliable technology partner. Typography and selected work provide visual confidence. Interfaces stay functional, fast, readable and inclusive.

## Principles

1. **Proof over pitch:** show real work early, explain what was solved.
2. **Editorial not templated:** clear hierarchy, varied but controlled layouts.
3. **Purposeful interactions:** animation communicates change or focus.
4. **Content-first composition:** designs accommodate real titles, images and long case studies.
5. **Accessible by default:** keyboard, focus, contrast, semantics and reduced motion.
6. **Performance is design:** images and JS are deliberately budgeted.
7. **One dominant action:** don't compete with the central decision on each view.

## Layout behavior

### Desktop >= 1200px (PROPOSED breakpoint)

12-column grid with generous gutters; 1120–1280px max content width; editorial sections can vary between 5/7, 4/8 and full width. Use alternating pacing for long pages; do not force each section into a bento card.

### Tablet 768–1199px

Reduce columns; retain consistent reading order; navigation may collapse when necessary, not only at a hard breakpoint.

### Mobile < 768px

Single main column, 16–24px horizontal safe padding, 44x44 CSS px touch target goal, buttons with strong hit area, short hero, genuinely responsive work images, no hover-dependent functionality. Avoid sideways page scroll.

**Note:** Breakpoints are proposals; test with content and font rendering.

## Hero

- Navy background and strong Sora H1 as default starting point.
- One compelling real visual, if available; no generic AI-generated “technology blob.”
- 1 primary CTA and at most 1 secondary link.
- Headline and key action visible/recognizable without interaction; do not rely on animation to reveal essential text.

## Composition

- Alternate light and dark sections deliberately; default body content on Cloud White.
- Use navy/periwinkle/lime meaningfully, not in every component simultaneously.
- Typography may break a strict grid for expression while preserving reading order.
- Use negative space and strong project imagery rather than card clutter.
- Avoid app-style KPI dashboards unless real relevant data exists.

## Navigation

- Sticky navigation only if it aids long-page use; consider reduced height or subtle backdrop on scroll.
- Mobile menu: focus management, Escape, visible close action, no hidden body scroll traps.
- Link text should describe destination.
- Active route indicated visually and via `aria-current="page"` where appropriate.

## Cards and lists

- Case study cards: image dominant, clear title, role/category, meaningful hover/focus affordance.
- Service list: typographic numbered rows with clear detail link; avoid six indistinguishable glass cards.
- Article cards: category, headline, excerpt, date and author; clean editorial grid.

## Motion

Brand source suggests 200–400ms, ease-out, node-convergence theme. Apply to hover, drawer, card reveals only if useful. Use `prefers-reduced-motion` to remove non-essential movement. Never delay content visibility while loading animation completes. No scroll-jacking, perpetual particles, aggressive parallax or cursor hijacking.

**Hero WebGL exception (APPROVED, 2026-11-21, revised):** the hero uses the raymarched "living colony": the Hub Mark nodes melt together through liquid bridges, lime colonists travel the chain and the pointer becomes a merging drop. It enhances a static SVG mark that renders first; headline and CTA never wait for it. Runs lighter on phones; disabled under reduced motion, Save-Data and low-end devices. No 3D anywhere else on the site. Exact spec: `ui-ux-baseline.md` §5.

**Motion baseline:** every interaction uses the tokens in `ui-ux-baseline.md` §3 (expo-out `--ease` to open or enter, a faster closing ease to dismiss). Panels animate with class + `inert`, never by toggling `hidden`.

## Interaction and feedback

| Context | State | Expected behavior |
|---|---|---|
| Links/buttons | Hover/focus/active/disabled | Distinct visible styling, focus clearly outlined |
| Inquiry form | Invalid | Inline errors tied to fields and error summary if needed |
| Inquiry form | Sending | Prevent duplicate submit, indicate progress |
| Inquiry form | Success | Confirm server response and show useful next action |
| Article filter | No results | Clear feedback and reset filter |
| CMS images | Missing | Stable fallback aspect ratio, no layout shift |
| Route | 404 | Friendly copy and links to recovery |

## Image policy

- Prefer real portfolio art, product screens, authentic team photos and process documentation.
- Real work photo > generic stock. AI illustration only when intentionally used as design work and not pretending to be a client case.
- Preserve aspect ratio, add captions for explanatory imagery, provide alt based on meaning.
- Avoid unlicensed client logos or imagery.

## Accessibility / usability checkpoints

- Content hierarchy is semantic; avoid multiple irrelevant H1s.
- All controls keyboard accessible with visible focus; sensible reading and tab order.
- No critical content on hover only. No autoplay audio or intrusive video.
- Color is not the sole means of conveying state.
- Form labels persist, errors readable, consent clear.
- Cross-browser responsive tests on mobile, tablet and desktop.

## UX success tests (PROPOSED)

- Five-second read: participant states what colonyhub offers in own words.
- Find a matching project in <=3 navigational steps without site search.
- Find and read an article category on mobile without horizontal overflow.
- Submit a contact request with screen reader and keyboard only.
- Understand when a case study is internal/concept vs client work.

## Anti-slop review

Before approval, ask: Is this visual tied to brand/proof? Is the copy specific? Is animation informative? Does the layout work with real content? Is it distinguishable from a generic agency theme? Remove any element that cannot justify its contribution.
