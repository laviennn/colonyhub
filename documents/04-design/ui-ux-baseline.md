# UI/UX baseline — homepage prototype v0.4

**Status:** APPROVED by user, 2026-11-21. This is the visual and interaction baseline for the production rebuild.
**Source of truth:** the running prototype in `prototype/` (live: https://colonyhub.vercel.app). Where this document and the prototype disagree, the prototype wins; fix this document.
**Stack:** not yet decided (decision log O-007). Everything below is stack-agnostic; the rebuild ports it, it does not redesign it.

---

## 1. Porting rules (read first)

1. **Parity before improvement.** The first production build must match the prototype at 375, 768, 1280, 1440 and 1920 px. Visual or motion changes are separate, approved tasks.
2. **Copy is content, not code.** EN/ID strings (`prototype/i18n.js`, HTML defaults) and the Colony Unit data (`prototype/services-data.js`) move to the CMS/locale files. Keep keys and structure.
3. **Tokens move first.** Colours, type, radius, easing and durations in §3 become the single token source (CSS variables or the framework's theme). No new hex values in components.
4. **Progressive enhancement stays.** Every motion and the WebGL hero must render a complete, usable page without JS, without WebGL and with `prefers-reduced-motion: reduce`.
5. **No regressions on the checks in §9.** They are part of the definition of done for the rebuild.

## 2. Visual world

**"Colony transit map."** The Hub Mark is already nodes on a line, so the site reads like a metro map: six Colony Units are six coloured lines meeting at one interchange (the hub). Supporting grammar taken from the approved references (Alture, Granger, achtzehngrad):

- Giant type set across the grid; visible column rules across the page (`.rules`, 5 lines at container edges and quarters, `rgba(138,148,242,0.16)`).
- Small coral mono column labels in the left column next to headings (not eyebrows above headings).
- Light Cloud White page with navy media panels and navy sections for rhythm.
- One authored type moment (statement), one WebGL moment (hero). Nothing else performs.

## 3. Tokens (prototype `:root`)

| Group | Token | Value |
|---|---|---|
| Brand | navy / navy-2 | `#0B1230` / `#111A40` |
| | periwinkle / peri-soft | `#8A94F2` / `#B7BDF8` |
| | lime | `#C6F432` |
| | cloud / mist / slate | `#F6F4EE` / `#E4E6F0` / `#5A6178` |
| | coral / indigo / indigo-lt | `#FF6B4A` / `#3F4BB8` / `#6C76E0` |
| Text on dark | on-dark / on-dark-2 | `#F6F4EE` / `#BFC3D9` |
| Labels | col-label on navy / cloud / mist | `#FF6B4A` / `#C2401F` / `#A8351A` |
| Rules | rule / rule-strong | periwinkle at 16% / 32% |
| Type | display / body / mono | Sora 400–700 / Inter 400–600 / JetBrains Mono 400–500 |
| Radius | cards, panels, tickets | 12 / 16 / 20 / 24 px, pills 999 px |
| Layout | max width / gutter | 1440 px / `clamp(16px, 3.2vw, 48px)` |
| Header | height | 68 px (62 px < 768) |
| Motion | `--ease` (expo-out) | `cubic-bezier(0.16, 1, 0.3, 1)` |
| | fast / base | 160 ms / 260 ms |
| | closing ease | `cubic-bezier(0.4, 0, 1, 1)` |
| | node pop | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

Service line colours: Strategy `#8A94F2`, Creative `#FF6B4A`, Build `#C6F432`, Growth `#B7BDF8`, Social `#F6F4EE`, Data `#6C76E0`.

All text pairs used were checked at ≥ 4.5:1 (normal text) with the antislop-human contrast checker.

## 4. Page structure (homepage)

| # | Section | Ground | Key behaviour |
|---|---|---|---|
| — | Header | Cloud (turns navy with mobile menu) | Services mega menu (6 units + Seed/Grow/Scale), EN/ID switch, lime CTA |
| 1 | Hero | Cloud + navy media panel | Split wordmark `colony … hub`; panel with unit tabs, Jakarta clock, H1, lead, free-consultation card; WebGL "living colony" |
| 2 | Network (Services) | Navy | Transit map of 6 lines with stops; legend; stop info card; mobile accordion |
| 3 | Statement | Cloud | Words light up with scroll (the type moment) |
| 4 | Route (Approach) | Cloud | Discover → Define → Create → Improve on one thick line, last stop lime |
| 5 | Tickets | Mist | Seed / Grow / Scale as tickets with perforation and stub |
| 5b | Social content showcase | Navy | Rail of 9:16 story-format samples (poll, quiz, slider, question) the Social/Creative units make for brands; full-screen viewer; CTA to the free consultation |
| 6 | Insights | White | Row list; items carry a visible **Placeholder** tag until real articles exist |
| 7 | About | Cloud | Five values in a ruled row |
| 8 | CTA | Navy | Giant `tell us where / you're headed.` + lime button |
| — | Footer | Navy | Link columns, tagline, wordmark sized to container |

Work/portfolio, client logos, testimonials and metrics stay hidden (decision log, O-003).

## 5. Components and interaction specs

### Header and navigation
- Desktop (> 1100 px): Services opens a mega menu on hover (160 ms close delay) or click; Escape and outside click close it; focus leaving closes it.
- Mobile menu (≤ 1100 px):
  - Panel stays in the DOM, toggled with a class plus `inert` (never `hidden`, which pops).
  - Open: `clip-path: inset(0 0 100% 0) → inset(0)` 640 ms `--ease`; header background and text cross-fade to navy (420 ms) so header and panel read as one surface; links rise 14 px and fade in, staggered 55 ms (`--k`); each link's rule draws left-to-right (720 ms); CTA and language switch follow last.
  - Close: 300 ms closing ease, all items together.
  - Focus moves to the first link 180 ms after opening, returns to the toggle on Escape; Tab is trapped in the open menu; page scroll is locked.

### Hero
- Wordmark: Sora 700, `clamp(4.2rem, 17.2vw, 15.5rem)`, line-height 1.04 (clears the `y` descender), `colony` navy / `hub` indigo, justified to the container edges; entrance rise 1000 ms, `hub` +80 ms.
- Media panel: radius 24, Colony Glow gradient (navy → `#141E58` → indigo, plus periwinkle and faint lime glows), dot grid masked to the mark area; height `clamp(520px, 100svh − header − wordmark − 56px, 760px)`.
- Unit tabs across the panel top (6 columns; 3 × 2 on mobile); Jakarta clock (`Asia/Jakarta`, tabular numerals); H1 + lead bottom-left; light consultation card bottom-right with a full-width lime button.

### Hero WebGL — "living colony" (`prototype/hero-nodes.js`)
- Full-screen quad, fragment-shader raymarch of signed-distance spheres (the seven Hub Mark nodes) joined by capsule "liquid bridges" with smooth-min union; clay-like shading (diffuse, specular, fresnel rim); soft periwinkle halo on miss.
- Intro 2.2 s: nodes start scattered and small, converge staggered (40 ms each), melt together (`k` 0 → 0.075) and grow bridges (0 → 0.028) in the second half.
- Idle: nodes breathe and bob slightly; six lime "colonists" travel the chain from the lime tip toward the hub.
- Pointer/touch within the colony's reach becomes a cloud-white drop that merges into the mark (smin k 0.14); it never wanders over the copy.
- Performance: static SVG mark renders first (LCP); three.js loads after `load` + idle; render scale 0.8 × DPR (0.5 on phones), 40 march steps (32 on phones), bounding-circle early discard, phones capped at ~30 fps, auto-downscale when the first second after the intro averages < 40 fps (< 24 on phones); paused off-screen and in hidden tabs; disposed on `pagehide`.
- Skipped (static mark only) for reduced motion, Save-Data / 2G, ≤ 2 CPU cores, no WebGL2.

### Network map (Services)
- SVG 1200 × 600; six lines with 45° bends from the hub at (600, 300); stops evenly placed on each outer segment; labels rotated −32° above (top and middle lines) or +32° below (bottom lines); terminus label in Sora 26.
- Hovering a line or legend item dims the others to 18% and thickens the active line; clicking a legend item pins it.
- **Stops are focusable buttons** (`tabindex=0`, `aria-label="name: explanation"`). Hover, focus or tap shows the **stop card**: unit name (mono), service name, one-line explanation, top border in the line colour. Card sits below the stop for top and middle lines and above for bottom lines; it is clamped inside the map.
- Copy rule for explanations: describe the work, never promise results.

### Network on mobile (≤ 767 px): accordion
- Map hidden; each unit is a row (colour bar, name, sub-line, ＋/－ button), one open at a time, Strategy open on load.
- Open: height via `grid-template-rows 0fr → 1fr` 480 ms `--ease`; line grows top-down (620 ms); stop dots pop in (520 ms, node-pop ease); text rises staggered 60 ms; colour bar lengthens; ＋ rotates to － on the line colour.
- Close: 260 ms closing ease, items fade together.
- **The tapped row is held in place** while other panels resize (scroll compensation until the legend height is stable; native `overflow-anchor` disabled on the list).
- Closed panels are `inert`. Rows show a faint press state.

### Statement (type moment)
- Words are wrapped as spans; with motion allowed they start at `#C9CBD6` and light to navy as the section crosses the viewport; key words light to indigo. The heading keeps an `aria-label` with the full sentence. Reduced motion shows the final state.

### Route, tickets, insights, about, CTA, footer
- Route: 7 px navy line, last quarter lime; stop nodes 41 px rings; outputs in mono under a hairline. Mobile: vertical line on the left.
- Tickets: 20 px radius; perforation notches cut in the section ground at the stub line; dashed stub; hover lifts 4 px and tilts −0.4°.
- Insights: row grid (meta / title / art); hover recolours the title and scales the art 0.92 → 1.
- Footer wordmark: inside container padding, font size `(min(100vw, 1440px) − 2 × gutter) × 0.2012`, so it spans the container exactly; 28–52 px clearance above the base rule.

### Social content showcase (story formats)
- **Purpose:** portfolio proof for the Social and Creative units. It shows the story-engagement formats colonyhub makes for client brands, not colonyhub's own Instagram activity. Samples are set in colonyhub's own brand (no client work is shown until approved, O-003). Copy: "Stories people answer, not just watch."
- **Never an Instagram embed** (weight, third-party cookies, foreign styling, login walls). **No video files either**: the stories are final designed content made of 2D/3D brand art plus HTML stickers (decision 2026-11-21).
- **Story frame component** (one component for card and viewer): 9:16, radius 22–24, container-query sized type; top bar, avatar with Hub Mark ringed in the unit colour, unit pill, hook (Sora 600), engagement sticker, caption. Sticker types: poll, quiz, emoji slider (thumb is the Hub Mark, not an emoji), question box. Backgrounds: `prototype/assets/stories/*.svg` (1080×1920, one per unit theme).
- **Rail:** horizontal scroll-snap aligned to the container edge, cards `clamp(210px, 19.5vw, 270px)` (64vw on phones); hover lifts 6 px, draws a unit-colour ring and nudges the sticker.
- **Viewer:** native `<dialog>` (focus trap, Escape), blurred navy backdrop, opens with scale 0.96 → 1 (420 ms `--ease`), story swap 360 ms; live progress bars (6 s per frame); tap/click right two-thirds = next, left third = previous; ← → keys; press-and-hold pauses; pause/play button; swipe down closes on touch; backdrop click closes; pauses while the pointer is on the CTA; closes after the last story; page scroll locked; floating chat hidden while open.
- **CTA:** section link "Plan your social content" and viewer button "Get stories like this" both go to the free consultation (the viewer closes first). No Instagram link and no follower count in this section.
- Reduced motion: no auto-advance, bars shown full, manual navigation only.
- Data: `prototype/stories-data.js` (future CMS `stories`: unit, background art, hook, sticker, caption, EN/ID). New stories are made in the same way: a 1080×1920 brand background plus one sticker.

### Floating chat (mobile only)
- Lime pill, navy text, navy icon disc with outline chat icon and lime dot (not WhatsApp green); 56 px tall; bottom-right with safe-area inset.
- Appears after the hero leaves the viewport (rise + fade, one dot pulse), shows "Chat on WhatsApp" / "Chat via WhatsApp", folds to the 56 px icon after ~3.2 s.
- Hidden while the CTA section or footer is on screen and while the mobile menu is open.
- Opens `https://wa.me/<number>?text=<message>` with the default message in the page language. **Number pending (O-006)**; until set, the button falls back to `#contact`.

## 6. Responsive breakpoints

| Range | Notes |
|---|---|
| ≥ 1101 px | Full nav, mega menu, desktop map |
| 768–1100 px | Hamburger menu, map still shown, legend 3 × 2, tickets 2 + 1 |
| ≤ 767 px | Single column, hero stacks (tabs 3 × 2, mark, copy, card), map → accordion, route vertical, floating chat |

No horizontal overflow at any width (checked at 375, 1280, 1440, 1920).

## 7. Bilingual behaviour
- English default, Indonesian via the EN/ID switch; choice stored per visitor (localStorage, guarded).
- Generated parts (map, legend, mega menu, footer units, statement, chat message) rebuild on language change.
- Production: real locale routes (`/` and `/id/`) with `hreflang`, not a client-side switch only.

## 8. Accessibility baseline
- Skip link; visible focus rings (indigo on light, lime on dark) on every control, including map stops.
- Menus: Escape closes, focus is returned, Tab trapped in the open mobile menu, closed panels `inert`.
- Every animated element has a complete static state; `prefers-reduced-motion` removes motion globally.
- Decorative visuals `aria-hidden`; the map has a `<desc>`.

## 9. Parity checklist for the rebuild

- [ ] Tokens in §3 are the only colour, type, radius and easing values used.
- [ ] Hero wordmark and footer wordmark align to container edges at 1280 / 1440 / 1920; `y` descender clears the panel and the base rule.
- [ ] Hero WebGL: static SVG first, intro, colonists, pointer drop, all fallbacks and throttles in §5.
- [ ] Network map: line hover/pin, stop card on hover/focus/tap, 24 explanations EN/ID.
- [ ] Mobile accordion: animated open/close, tapped row stays in place, `inert` closed panels.
- [ ] Mobile menu: reveal, header-to-navy, staggered links, drawn rules, focus handling, scroll lock.
- [ ] Statement word-lighting, with reduced-motion final state.
- [ ] Floating chat: visibility rules, fold, language-aware WhatsApp link, fallback while the number is missing.
- [ ] Social content showcase: designed sample frames (no IG embed, no video), rail, viewer controls (tap, keys, hold, swipe, close), progress, CTA to consultation, reduced-motion behaviour.
- [ ] EN/ID parity of every string.
- [ ] No horizontal overflow at 375, 768, 1280, 1440, 1920; contrast ≥ 4.5:1 for text.
- [ ] Lighthouse/CWV within the budgets in `../05-engineering/seo-performance-accessibility.md`.

## 10. Prototype file map

| File | Contents |
|---|---|
| `prototype/index.html` | Markup for all sections, Hub Mark SVG symbol |
| `prototype/styles.css` | Tokens and all component styles, responsive rules |
| `prototype/main.js` | Nav, mega and mobile menu, clock, network map + stop card, accordion, statement, chat, language |
| `prototype/hero-nodes.js` | WebGL "living colony" (three.js r160, raymarched SDF) |
| `prototype/services-data.js` | Colony Units, line paths, stops with EN/ID explanations (future CMS `services`) |
| `prototype/i18n.js` | Indonesian strings |
| `prototype/stories-data.js` | Story-format samples for the social content showcase (future CMS `stories`) |
| `prototype/assets/stories/*.svg` | Branded 1080×1920 story backgrounds, one per unit theme (final art) |
