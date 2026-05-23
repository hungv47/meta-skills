# Technical SEO Audit Reference

Detailed audit report template and site-type-specific checklists.

> **Companion:** `references/technical-crawler-checklist.md` holds the per-URL 12-check crawler-style technical ledger (title / meta / H1-H2 / OG / canonical / hreflang / JSON-LD / robots / sitemap / orphans / alt / thin-lang-icons) and the vendor-agnostic crawler-tool adapter pattern. **This file is the strategic audit shape (Executive Summary, layer status, prioritized plan, re-audit schedule, CWV thresholds, URL structure, internal linking, architecture deliverables). That file is the per-URL technical ledger.** Run the checklist on every page audited at the technical layer; map every `FAIL:` row into the `Issue / Impact / Evidence / Fix / Priority` schema from `references/format-conventions.md`.

---

## Audit Report Template

Use this structure for the audit deliverable:

```markdown
# SEO Technical Audit: [Site Name]

**Date:** [date]
**Auditor:** [name/skill]
**Site:** [URL]
**Site Type:** [SaaS / E-commerce / Content-Blog / Local Business / Hybrid]

## Executive Summary

[2-3 sentences: overall health, biggest blocker, top priority action]

**Overall Score:** [Red / Yellow / Green] per layer:

| Layer | Status | Critical Issues |
|-------|--------|----------------|
| Crawlability & Indexation | 🟢/🟡/🔴 | [count] |
| Technical Foundations | 🟢/🟡/🔴 | [count] |
| On-Page Optimization | 🟢/🟡/🔴 | [count] |
| Content Quality | 🟢/🟡/🔴 | [count] |
| Authority & Links | 🟢/🟡/🔴 | [count] |

## Findings by Layer

### Layer 1: Crawlability & Indexation

#### [Finding Title]
- **Issue:** [what's wrong]
- **Impact:** [how it affects SEO — be specific]
- **Evidence:** [URL, screenshot, data point]
- **Fix:** [exactly what to do]
- **Priority:** Critical / High / Medium / Low

[Repeat for each finding]

### Layer 2: Technical Foundations
[Same format]

### Layer 3: On-Page Optimization
[Same format]

### Layer 4: Content Quality
[Same format]

### Layer 5: Authority & Links
[Same format]

## Prioritized Action Plan

| Priority | Action | Layer | Effort | Expected Impact |
|----------|--------|-------|--------|----------------|
| 1 | [action] | [layer] | [hours/days] | [what improves] |
| 2 | [action] | [layer] | [hours/days] | [what improves] |

## Re-Audit Schedule

- **Critical fixes:** Verify within 1 week
- **Full re-audit:** [date — typically quarterly]
- **Ongoing monitoring:** [what to watch weekly]
```

---

## Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5-4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | < 200ms | 200-500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1-0.25 | > 0.25 |

**Quick fixes for each:**
- **LCP:** Compress images (WebP), preload hero image, use CDN, reduce server response time
- **INP:** Reduce JavaScript execution, break up long tasks, optimize event handlers
- **CLS:** Set explicit dimensions on images/embeds, avoid inserting content above existing content

---

## URL Structure Patterns by Page Type

| Page Type | URL Pattern | Example |
|-----------|------------|---------|
| Homepage | `/` | `example.com` |
| Product/Feature | `/product/[feature]` | `/product/analytics` |
| Blog post | `/blog/[slug]` | `/blog/seo-guide-2026` |
| Category | `/blog/[category]` | `/blog/marketing` |
| Comparison | `/vs/[competitor]` | `/vs/hubspot` |
| Alternatives | `/alternatives/[competitor]` | `/alternatives/salesforce` |
| Integration | `/integrations/[tool]` | `/integrations/slack` |
| Documentation | `/docs/[section]/[page]` | `/docs/api/authentication` |
| Landing page | `/[pattern-derived]` | `/project-management` |

**Avoid:**
- Date-based URLs for evergreen content (`/2026/03/17/seo-guide` — limits updating)
- Parameter-heavy URLs (`/page?id=123&cat=seo` — hard to crawl and share)
- Over-nesting (`/blog/category/subcategory/year/post` — dilutes link equity)

---

## Internal Linking Strategy

### Link Types

| Type | Purpose | Example |
|------|---------|---------|
| **Navigational** | Site-wide navigation, header/footer | Main menu links |
| **Contextual** | In-content links to related pages | "Learn more about [topic]" in body copy |
| **Hub-and-spoke** | Topic cluster architecture | Pillar page links to subtopic pages and vice versa |

### Guidelines

- **5-10 contextual links per 1,000 words** of content
- **Descriptive anchor text** — "our SEO audit guide" not "click here"
- **Link to deep pages** — not just homepage and top-level navigation
- **Fix orphan pages** — every page should have ≥1 internal link pointing to it
- **Limit links per page** — Google recommends keeping total links (internal + external) reasonable; prioritize quality over quantity

### Link Audit Checklist

- [ ] No broken internal links (404s)
- [ ] Key pages have ≥3 internal links pointing to them
- [ ] No orphan pages (0 internal links)
- [ ] Anchor text is descriptive and varied (not all exact-match keywords)
- [ ] Topic clusters are connected (pillar → subtopic → pillar)
- [ ] New content links to and from existing relevant content

---

## Site Architecture Deliverables

When site architecture redesign is needed, produce these 3 outputs:

### 1. Hierarchy Tree (ASCII)

```
Homepage
├── Product
│ ├── Features
│ ├── Pricing
│ └── Integrations
│ ├── /integrations/slack
│ └── /integrations/zapier
├── Blog
│ ├── /blog/category-1
│ └── /blog/category-2
├── Resources
│ ├── /docs
│ └── /templates
└── Company
 ├── /about
 └── /contact
```

### 2. URL Map Table

| Page | URL | Parent | Depth | Priority |
|------|-----|--------|-------|----------|
| Homepage | `/` | — | 0 | Highest |
| Features | `/product/features` | Product | 2 | High |
| Blog Post | `/blog/[slug]` | Blog | 2 | Medium |

### 3. Navigation Spec

**Header (4-7 items max):**
| Position | Label | Links To | Dropdown? |
|----------|-------|----------|-----------|
| 1 | Product | `/product` | Yes: Features, Pricing, Integrations |
| 2 | Blog | `/blog` | No |

**Footer groups:** Product / Resources / Company / Legal
