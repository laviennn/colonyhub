# Launch QA and acceptance checklist

**Status:** Draft checklist for manual/automated testing. Checked items must be evidence-backed.

## Brand and copy

- [ ] `colonyhub` spelling and lowercase consistently applied.
- [ ] Official tagline used accurately where present.
- [ ] Logo is approved master asset, correct variants, spacing and sizes.
- [ ] Brand palette, fonts, visual metaphors consistent with source.
- [ ] Six Colony Units and scopes accurately represented.
- [ ] No invented results, logos, clients, team members or testimonials.
- [ ] Concept/internal projects visibly and unambiguously labeled.
- [ ] Each page has one distinct message and one clearly emphasized CTA.

## Page coverage

- [ ] Home matches the approved baseline: hero, network map, statement, route, tickets, Insights, about and CTA (selected work stays hidden until real work exists).
- [ ] Work listing and all published case detail pages render correctly.
- [ ] All six service pages have deliverables and relevant next action.
- [ ] Approach reflects approved operating process rather than unverified claims.
- [ ] Insights list, categories and article detail function.
- [ ] About content contains real historical and team information.
- [ ] Contact handles validation, spam, server errors and confirmed success.
- [ ] Footer, privacy and true 404 routes are present.

## UI / responsive

- [ ] Desktop, tablet, phone and narrow viewport layouts inspected.
- [ ] No horizontal overflow or clipped headings.
- [ ] Correct image crops, aspect ratio and fallback.
- [ ] Navigation works on touch and keyboard.
- [ ] All components have hover, focus, active, disabled and loading states as relevant.
- [ ] Sticky elements do not obscure headings or inputs.
- [ ] Reduced-motion preference is respected.
- [ ] Every item in the parity checklist of `../04-design/ui-ux-baseline.md` §9 passes against the prototype.
- [ ] Mobile menu, Services accordion and floating chat animate per baseline; no panel toggles via `hidden`.
- [ ] Hero WebGL falls back to the static mark (reduced motion, Save-Data, low-end, no WebGL2) and pauses off-screen.

## Accessibility

- [ ] Semantic landmarks and H1/H2 structure.
- [ ] Accessible names and visible focus for links/buttons.
- [ ] Contrast verified in intended text/state combinations.
- [ ] Keyboard-only flows tested, including mobile menu and forms.
- [ ] Form errors tied to fields and announced meaningfully.
- [ ] Images have useful alt or are decorative.
- [ ] Touch targets are usable, zoom and reflow tested.
- [ ] Automated scan and manual screen-reader sampling documented.

## SEO / content publishing

- [ ] Correct unique titles, descriptions and canonical URLs.
- [ ] XML sitemap reflects published pages only.
- [ ] robots.txt, noindex preview and staging protection checked.
- [ ] Valid Organization, Service, Article and breadcrumb schema where appropriate.
- [ ] Open Graph previews and image dimensions correct.
- [ ] Internal links, pagination and redirects tested.
- [ ] Article dates, authors, citations and facts reviewed.
- [ ] Slug changes preserve suitable redirects.
- [ ] No placeholder content or lorem ipsum indexed.

## Security / operations

- [ ] CMS permissions and authentication reviewed.
- [ ] Form input validated on server, rate limited and delivered securely.
- [ ] Secrets only in approved server-side configuration.
- [ ] Privacy notice reflects actual data handling.
- [ ] Inquiry retention/deletion ownership defined.
- [ ] CI passes tests, deploy and rollback rehearsed.
- [ ] Backups and monitoring configured and reviewed.

## Performance

- [ ] Real images and actual production content used in performance tests.
- [ ] LCP asset strategy reviewed; no unnecessary preload/lazy-load misuse.
- [ ] CLS from fonts/images and third-party scripts controlled.
- [ ] JavaScript and image budgets reviewed.
- [ ] CWV measurement installed and alerts/owner documented.

## Acceptance evidence log template

| Item | Tester | Environment/device | Evidence/link | Status | Follow-up |
|---|---|---|---|---|---|
| Contact flow | | | | Not tested | |
| Article publish | | | | Not tested | |
| Mobile navigation | | | | Not tested | |
| Structured data | | | | Not tested | |

**Release blocker:** Any false public claim, broken inquiry delivery, security/privacy defect, inaccessible core navigation, or major indexing error.
