# Technical Crawler Checklist

> Load when Route A (Technical Audit) is active, or when Route B/E (AI SEO / Full) needs to gate retrieval-layer work on technical crawl health. Companion to `references/technical-audit.md` — that file holds the strategic audit template + URL structure + CWV; this file holds the per-URL crawler-style technical checklist that maps into `Issue / Impact / Evidence / Fix / Priority` findings.

Crawler-style checks are tool-friendly: an external crawl tool (Screaming Frog, Sitebulb, Lumar, ahrefs Site Audit, semrush Site Audit, OnCrawl, JetOctopus — vendor-agnostic) produces a per-URL ledger, and `crawl-agent` / `foundations-agent` map each finding into a standard finding row. Below is the 12-check ledger every page audited at this layer must clear.

---

## When to ingest a crawl tool vs walk manually

| Site scale | Approach |
|---|---|
| ≤ 30 URLs | Manual page-by-page with browser DevTools + Rich Results Test + curl for headers. Faster than ingesting a tool dump. |
| 30-2,000 URLs | Recommended: a crawler dump. Ingest the JSON/CSV/Markdown export, map per-URL findings into the schema below. Vendor-agnostic — record `crawl_source` and `crawl_date` in the audit. |
| 2,000+ URLs | Required: a crawler dump. Manual is infeasible; sample-only audits at this scale miss systematic template bugs. |

**Tool adapter pattern:** the export field names differ per vendor. The audit normalizes every row into the 12-check ledger below. When a vendor exposes a check this list doesn't have (e.g., a proprietary content-quality score), the audit treats it as supplementary — never a P1 driver, since it's vendor-specific.

---

## The 12-check ledger

Every page audited at the technical-crawler layer clears these 12 checks. A check that fails produces a finding in the `Issue / Impact / Evidence / Fix / Priority` schema (per `references/format-conventions.md`). A check that passes is recorded as `OK` in the per-URL summary table but doesn't generate a finding — the audit's signal-to-noise depends on this.

### 1. Title tag — length, presence, uniqueness

| Check | Pass criteria |
|---|---|
| Present | Non-empty `<title>` on every indexable page |
| Length | Approximately 50-60 characters (the rendered SERP width — exact pixel limit varies; 50-60 chars is the safe band) |
| Unique | No two indexable URLs share an identical title |
| Brand suffix | Consistent format across the site (e.g., `Page Title | Brand` or `Brand: Page Title` — not mixed) |

**Common failure modes:**
- Default CMS title ("Untitled Page", "Page", or the H1 verbatim)
- Truncated SERP display because >60 chars in a font-wide language
- Hundreds of pages share `Home | Brand` (template bug — only the homepage should be Home)

### 2. Meta description — length, presence, uniqueness

| Check | Pass criteria |
|---|---|
| Present | `<meta name="description">` on every indexable page (optional for archive/tag pages) |
| Length | Approximately 150-160 characters |
| Unique | No two indexable URLs share an identical description |
| Useful content | Describes the page's value; not boilerplate from the brand bio repeated everywhere |

**Note:** Google may rewrite the description in the SERP. Having one still helps when Google uses it and signals page-level intent to the crawler.

### 3. H1 / H2 structure

| Check | Pass criteria |
|---|---|
| Exactly one H1 | One H1 per page (CMS sometimes injects a second H1 in a sidebar widget — common bug) |
| H1 matches intent | H1 describes the page's primary topic; not "Welcome to [Brand]" on every page |
| H2 hierarchy | H2s subdivide the page; no skipped levels (H1 → H3 without H2 is a failure) |
| Headings as text | Headings are `<h1>`-`<h6>` elements, not styled `<div>`s (crawlers ignore non-semantic heading equivalents) |

### 4. OG / Twitter cards

| Check | Pass criteria |
|---|---|
| `og:title` | Present and matches `<title>` semantically (slight wording variation OK) |
| `og:description` | Present |
| `og:image` | Present, ≥ 1200×630 px, accessible URL (returns 200 + image MIME type) |
| `og:url` | Matches canonical URL |
| `twitter:card` | Set to `summary_large_image` (or `summary` for content without hero images); not missing |

**Failure costs:** social shares render as link-only "naked URL" cards; click-through rate drops materially.

### 5. Canonical — host / path / status

| Check | Pass criteria |
|---|---|
| Present | `<link rel="canonical">` on every indexable HTML page |
| Self-referential | The canonical URL points to the current URL (or to a definitive other URL when this is a duplicate) |
| Host normalized | Canonical uses the same protocol (https) and host (with or without `www`) consistently across the site |
| Resolves 200 | The canonical URL itself returns HTTP 200 (a canonical pointing at a 404 or 301 is a critic-FAIL technical issue) |
| Not blocked | The canonical target isn't blocked by `robots.txt` or `noindex` |

**Common failure modes:** canonical points to the un-canonical host (`example.com` vs `www.example.com`); paginated archive canonicals all point at page-1, hiding pages 2+; mobile separate-URL setups (m-dot) without correct canonical+alternate pairing.

### 6. hreflang (multi-language / multi-region sites only)

| Check | Pass criteria |
|---|---|
| Present | `<link rel="alternate" hreflang="...">` on every page that has language/region variants |
| Symmetric | Every variant cross-references every other variant (and itself, with `hreflang="x-default"` when appropriate) |
| Valid codes | ISO 639-1 language codes + optional ISO 3166-1 alpha-2 region codes (e.g., `en`, `en-US`, `en-GB`, `vi-VN`) |
| Self-link | Each variant page includes a self-referential hreflang to itself |

**Skip if:** single-language single-region site.

### 7. JSON-LD — presence + validity

| Check | Pass criteria |
|---|---|
| Schema present | Each page-type carries appropriate schema (Article on articles, Product on product pages, FAQPage on FAQ blocks, BreadcrumbList where breadcrumbs render, Organization on homepage/about) |
| Validates | Passes Google Rich Results Test (or `npx schema-org-validator` equivalent) with no errors; warnings reviewed |
| Matches visible content | Schema describes what users actually see (Google demotes for schema-vs-rendered mismatch) |
| Required fields | Each schema type's required fields are populated (Article needs `headline`, `datePublished`, `author`; Product needs `name`, `offers`, `aggregateRating` if used; FAQPage needs `mainEntity` with Q&A pairs) |

**Cross-reference:** `references/schema-reference.md` for the per-type field list and CMS injection caveats.

### 8. Robots / noindex / X-Robots-Tag

| Check | Pass criteria |
|---|---|
| `robots.txt` reachable | Returns 200 at `/robots.txt` |
| No accidental disallow | Indexable pages aren't blocked by a `Disallow:` pattern (common bug: `Disallow: /` left over from staging) |
| Sitemap directive present | `Sitemap: https://example.com/sitemap.xml` line in robots.txt |
| Meta robots aligned | Pages intended for indexing have no `<meta name="robots" content="noindex">` (or have `index, follow`) |
| `X-Robots-Tag` aligned | HTTP header doesn't override (`X-Robots-Tag: noindex` from the server is a common silent killer) |
| AI crawler directives | GPTBot / ClaudeBot / PerplexityBot / GoogleOther / Bingbot / Applebot-Extended / cohere-ai are explicitly allowed (or intentionally blocked with a recorded reason) — see `references/ai-seo.md` § robots.txt AI Bot Allowlist |

### 9. Sitemap

| Check | Pass criteria |
|---|---|
| Present | Valid XML sitemap at the URL declared in `robots.txt` |
| Returns 200 | URL itself fetchable |
| Lists indexable URLs | Every URL the sitemap lists returns 200, is canonical, isn't `noindex`'d |
| Doesn't list non-indexable | No `noindex` pages, 4xx URLs, or redirected URLs in the sitemap (these waste crawl budget and signal stale data) |
| Submitted | Sitemap submitted to Google Search Console + Bing Webmaster Tools |
| Lastmod accurate | `<lastmod>` reflects actual page updates (when present; static-stale lastmod is worse than absent) |

### 10. Orphan pages

| Check | Pass criteria |
|---|---|
| No orphans | Every indexable URL has ≥1 internal link pointing to it from a crawler-reachable page |
| Discovered set matches sitemap | Pages in sitemap appear in crawl; pages in crawl appear in sitemap (asymmetric = bug to investigate) |
| Pagination / archive reachable | Paginated pages 2+ are linked from page-1 (with `rel="next"`/`rel="prev"` or numeric pagination), not orphaned |

**Tool adapter note:** crawler tools' "orphan" detection compares the crawl set vs the sitemap. Both inputs are required for the check to be meaningful.

### 11. Image alt coverage

| Check | Pass criteria |
|---|---|
| Alt present | Every `<img>` has an `alt` attribute (empty `alt=""` is OK for decorative images; missing is not) |
| Alt useful | Descriptive alt text for content images; not `image1.jpg` or `[brand] logo logo logo` |
| Filenames | Image filenames are descriptive when possible (`team-photo-2026.jpg` beats `IMG_4823.jpg`) |
| Lazy loading | Below-the-fold images use `loading="lazy"`; LCP image does not lazy-load |

### 12. Content thinness / language / app-icon basics

| Check | Pass criteria |
|---|---|
| Word count | Indexable pages have ≥ 300 words of unique content (the threshold shifts with site type — a hub page can be lower if it's a navigation surface, but a content page below 300 words is thin) |
| Language declared | `<html lang="en">` (or appropriate code) on every page; mismatched with content language is a translation/i18n bug |
| Charset | `<meta charset="utf-8">` declared in `<head>` |
| Favicon | `/favicon.ico` returns 200 (or `<link rel="icon">` declared); missing favicon is a small but persistent crawler warning |
| Apple touch icon | `<link rel="apple-touch-icon">` set when the site is consumed on mobile (recommended for iOS home-screen bookmarks; 180×180 px) |
| Mobile viewport | `<meta name="viewport" content="width=device-width, initial-scale=1">` present |

---

## Per-URL summary table — the audit output shape

The audit normalizes the 12-check ledger into a per-URL summary table that lives in the audit artifact (`docs/forsvn/artifacts/marketing/seo-audit.md`).

| URL | Title | Meta Desc | H1/H2 | OG | Canonical | hreflang | JSON-LD | Robots | Sitemap | Orphan | Alt | Thin/Lang/Icons | Findings |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | OK | OK | OK | FAIL: missing og:image | OK | n/a | OK | OK | OK | OK | OK | OK | 1 (F-001) |
| `/pricing` | FAIL: 7-char title | OK | OK | OK | OK | n/a | FAIL: Product schema missing | OK | OK | OK | OK | OK | 2 (F-002, F-003) |
| `/blog/seo-guide` | OK | OK | OK | OK | OK | n/a | OK | OK | OK | OK | FAIL: 12 imgs no alt | OK | 1 (F-004) |

Each `FAIL:` row becomes a finding with the standard fields (Issue / Impact / Evidence / Fix / Priority). The summary table is the audit's audit-trail and the operator's at-a-glance dashboard.

---

## Mapping crawler-tool output → findings

When ingesting an external crawler dump (vendor-agnostic), normalize the export rows into the 12-check ledger and emit findings. The mapping pattern:

| Crawler-tool row field | Maps to ledger check | Finding template (when failing) |
|---|---|---|
| `title` / `title_length` / `title_duplicate` | Check #1 | Issue: "Title on [URL] is [N] chars / duplicated across [M] URLs"; Fix: specific rewrite |
| `meta_description` / `meta_description_length` / `meta_description_duplicate` | Check #2 | Same shape |
| `h1` / `h2_count` / `h1_count` | Check #3 | Issue: "[URL] has [N] H1s" / "[URL] skips from H1 to H3"; Fix: specific restructure |
| `og:title` / `og:image` / `twitter:card` | Check #4 | Issue: "[URL] missing og:image"; Fix: add 1200×630 image |
| `canonical` / `canonical_status` | Check #5 | Issue: "Canonical on [URL] points to [target], which returns [status]"; Fix: update or remove canonical |
| `hreflang_*` | Check #6 | Issue: "[URL] declares hreflang en-US but no symmetric link from /es-MX/[URL]"; Fix: add symmetric hreflang |
| `structured_data_*` | Check #7 | Issue: "Article schema on [URL] missing required `datePublished`"; Fix: add the field |
| `robots_meta` / `x_robots_tag` / `robots_txt_blocks` | Check #8 | Issue: "[URL] returns X-Robots-Tag: noindex"; Fix: remove the header or remove from indexable set |
| `sitemap_*` | Check #9 | Issue: "Sitemap lists 47 noindex URLs"; Fix: regenerate sitemap excluding noindex |
| `internal_links_in` | Check #10 | Issue: "[URL] has 0 inbound internal links (orphan)"; Fix: link from [specific candidate source pages] |
| `images_missing_alt` | Check #11 | Issue: "[URL] has [N] images missing alt"; Fix: add descriptive alt to each |
| `word_count` / `lang_attribute` / `meta_viewport` | Check #12 | Issue: "[URL] is [N] words / declares lang=en but content is Vietnamese"; Fix: specific |

The audit never reports the vendor's proprietary score as a P1 driver — those are noted in a "Crawler tool notes" appendix for context, not as the failure mechanism. The 12-check ledger is the durable surface.

---

## Cross-references

- `references/technical-audit.md` — strategic audit template (Executive Summary, layer status, prioritized action plan, re-audit schedule) + Core Web Vitals thresholds + URL structure patterns + internal linking strategy. **That file is the audit deliverable shape; this file is the per-URL technical ledger.**
- `references/format-conventions.md` — the `Issue / Impact / Evidence / Fix / Priority` finding schema each `FAIL:` row produces
- `references/schema-reference.md` — JSON-LD per-type required fields (check #7)
- `references/ai-seo.md` § robots.txt AI Bot Allowlist — the AI-crawler subset of check #8
- `references/retrieval-layer-seo.md` — the technical-audit gate this checklist enforces before AI-SEO retrieval-layer work runs
- `agents/crawl-agent.md` + `agents/foundations-agent.md` — own this ledger when Route A is active
