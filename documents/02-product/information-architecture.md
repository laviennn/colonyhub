# Information architecture & user journeys

**Status:** Proposed website structure; derived from source brand navigation recommendation and user brainstorming.

## 1. Top-level architecture

```text
/
├── work/
│   └── [slug]/
├── services/
│   └── [slug]/
├── approach/
├── insights/
│   └── [slug]/
├── about/
├── contact/
├── privacy/
└── 404
```

### Recommended navigation

Desktop: logo | **Work** | **Services** | **Approach** | **Insights** | **About** | **Start a Project** (CTA).  
Mobile: logo + labeled menu trigger; menu items same; CTA separated at bottom.  
Footer: Work, Services, Approach, Insights, About, Contact, Privacy; real social channels only.

The source's suggested menu is Layanan · Portofolio · Cara Kerja · Insight · Tentang · Kontak (p.10). English labels above are a **website direction choice**, not a verbatim source requirement.

## 2. Route behavior

| Route | Primary CTA | Secondary CTA | SEO intent |
|---|---|---|---|
| `/` | Start a Project | Explore Work | Branded/home |
| `/work` | Discuss a Project | View Case Study | Brand work/portfolio |
| `/work/[slug]` | Start a Similar Project | Next Project | Project-specific |
| `/services` | Discuss Your Needs | Explore a Unit | Agency capabilities |
| `/services/[slug]` | Discuss This Service | See Related Work | Service-specific |
| `/approach` | Start a Conversation | View Work | Agency process |
| `/insights` | Read an Article | Explore Categories | Editorial categories |
| `/insights/[slug]` | Related Service/Work | Next Article | Informational |
| `/about` | Meet the Team / Contact | Read Approach | Brand/team |
| `/contact` | Submit Inquiry | Email Directly | Contact |

## 3. Information scent

- Use human-readable service descriptions in addition to internal names (`Build Unit — Websites & digital products`).
- Make project title descriptive and let category and outcomes reinforce orientation.
- Use explicit article categories, not obscure internal terminology.
- Every page must offer an onward path that matches current reading intent.

## 4. User journeys

### A. Buyer evaluating website build

`Search/Referral → Service detail (Build) → related Work → Approach → Contact → success state`

Questions to answer in order: Can you do this? Have you done this? How will you work? What is the next step?

### B. Design/brand buyer

`Homepage → Selected Work → Case Study → Creative Unit → Contact`

Use design quality first, backed by challenge and rationale rather than visual theater.

### C. Organic article reader

`Search → Article → related article or service → relevant Work → Contact`

Avoid intrusive signup walls, auto-open popups and ungrounded upsell.

### D. Prospective collaborator or candidate

`Homepage → About → work/people → general inquiry` (Careers is a future route only if hiring workflow exists).

## 5. Future IA, not in v1

`/careers`, `/academy`, `/labs`, `/insights/tag/[tag]`, `/search`, localization `/en` or `/id`, dedicated solutions pages, downloadable reports. Only add when content and ownership justify them.

## 6. Naming / slug policy

- Use lowercase ASCII, hyphen-separated, stable slugs.
- Keep a redirect map when slugs change.
- Service slugs proposed: `strategy`, `creative`, `web-development`, `growth`, `social`, `data-analytics`. This URL naming is **not** the official Colony Unit name; display names remain Strategy Unit etc.
- No dates in default article path; preserve publication date in content and structured data.
- Prefer canonical one-route-per-content; avoid duplicated articles under categories.

## 7. Breadcrumbs

For details: `Home / Work / Project`; `Home / Services / Service`; `Home / Insights / Article`. Display and structured data should match.
