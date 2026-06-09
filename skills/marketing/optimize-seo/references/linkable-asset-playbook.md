# Linkable-Asset Playbook

When to **build a linkable asset** (a sourced statistics / research page that earns
inbound links and AI citations for years) versus **pitch a placement directly** for a
one-off mention. Plus the rendering rule that makes the asset accrue authority instead of
leaking it.

> A direct pitch lands one quote in one article. A linkable asset — one URL a topic-
> roundup ranks for — earns recurring citations: the next journalist who searches
> "[topic] statistics [year]" finds it and cites it without you pitching again, and
> AI-answer surfaces preferentially cite pages with structured, numbered, sourced facts
> (see `geo-citation-readiness-checklist.md`). The asset is the compounding play; the
> direct pitch is the one-off. This classifier decides which a given opportunity warrants.

## The 8-signal viability classifier

Score the opportunity / keyword cluster on these eight signals. Sum the weights.

| # | Signal | Weight |
|---|---|---|
| 1 | **Topic breadth** — broad enough that public data exists (e.g. "AI in marketing", "remote-work trends") | +2 |
| 2 | **Business fit** — the site's business already touches the topic, so the page earns recurring relevant traffic, not a one-time citation | +2 |
| 3 | **Cluster size** — multiple opportunities or keywords on the same topic, so one page supports 3+ pitches/pages | +2 |
| 4 | **Explicit data demand** — the request/intent explicitly wants "statistics", "data", "research", or "trends" | +3 |
| 5 | **Deadline feasibility** — enough lead time (≥24-48h) to research and publish properly | +1 if ≥24h; **-3 if <12h** (skip the asset, pitch direct) |
| 6 | **Niche penalty** — topic is hyper-niche / relevant to one outlet only (a stats page still works but the addressable set is small) | -1 |
| 7 | **Anecdote ask** — the request wants a personal founder story / opinion / case study, where no data is needed | -3 |
| 8 | **Paid-placement flag** — a pay-to-appear opportunity with different ROI math | -2 |

## The build-vs-pitch-direct decision

| Total score | Decision |
|---|---|
| **≥ 2** | **Build the linkable asset**, then point the pitch(es) at it. State the score so the rationale is visible. |
| **< 2** | **Pitch direct** — the effort doesn't pay back for this opportunity. |

Hard overrides regardless of total:

- Deadline < 12h (signal 5) → pitch direct; there is no time to research and publish well.
- Pure anecdote/opinion ask (signal 7) → pitch direct; a stats page is the wrong format.

If multiple opportunities cluster on one topic (signal 3), **build the asset once and
reuse it across every pitch in that batch** — the cluster is what makes the asset pay back.

## Source-quality hierarchy

Every stat on a linkable asset must trace to a real, fetched source. Prefer sources in
this order; if you cannot find a primary source for a stat, drop the stat.

1. **Primary analyst research** — Gartner, Forrester, McKinsey, Deloitte, IDC, BCG.
2. **Vendor "State of X" reports with a stated methodology** — e.g. HubSpot State of
   Marketing, Salesforce State of Sales, Semrush, Ahrefs, Stripe.
3. **Trade publications with original reporting** — and only when they cite a primary report.
4. **Government / inter-governmental data** — BLS, Census, Eurostat, OECD, UN, WIPO.
5. **Academic / peer-reviewed** — Google Scholar, arXiv for technical topics.
6. **Reputable market-sizing firms** — Grand View Research, Mordor Intelligence, Statista
   (cite via the report, not a paywall snippet).
7. **Reputable surveys** — Pew, Gallup, Edelman, YouGov.

**Avoid:** listicle blogs that cite each other (trace to the primary source or drop it);
press releases without underlying data; AI-generated stat roundups (the main source of
hallucinated numbers — never propagate them); stats older than ~3 years unless they are
the only authoritative number (label the year); Wikipedia (cite its primary source instead).

**Quality bar — every stat must pass all of these:** named source · a year · a specific
number (not a vague modifier) · a real URL you actually fetched · quoted faithfully (no
rounding or extrapolation) · the URL works at time of writing.

> Anti-hallucination rule: never invent a statistic. One fabricated number caught by a
> journalist or surfaced by an AI fact-check torpedoes credibility. Attribute every figure
> to its source and its nature (analyst-reported, vendor-reported, survey) rather than
> stating an unsourced precise number.

## The zero-outbound-link rule ("hoard the juice")

A linkable asset's job is to **attract** inbound links — not **distribute** authority
outward. Every outbound `<a href>` to another domain leaks a little ranking signal and
gives crawlers a reason to leave the site.

**Rule: the rendered page contains ZERO `<a>` tags pointing to any domain other than its
own.** No `nofollow` workaround — `nofollow` is a hint and crawlers still follow it; zero
outbound `<a>` tags is the only provably leak-free posture.

| Pattern | Allowed? |
|---|---|
| Source attribution as **plain text** — `(Source: HubSpot State of Marketing, 2026)` | Required |
| Source attribution as a clickable link | Forbidden — strip it |
| Internal TOC anchor (`href="#section"`) | Fine |
| Author-bio CTA to the page's **own** domain | Fine |
| Link to an analyst firm, a social profile, or the publisher | Forbidden — strip it |

Where the source URLs live: in the research record (the audit trail proving each stat was
not hallucinated) and, optionally, in an HTML comment at the bottom of the page for a human
reviewer to spot-check. Never as a rendered clickable link.

**Audit:** `grep 'href="http'` on the rendered file should return only the canonical
`<head>` link and on-domain internal links.

**One trade-off:** outbound links to authority are a mild positive ranking signal, so on a
brand-new zero-authority domain a no-outbound page may rank slightly slower at first.
Mitigate with rich on-page signals (Article + FAQPage schema, author bio, date stamps,
named plain-text sources) and strong internal linking. On a domain that already has
authority, the no-outbound posture is a pure win.

## Topic clustering

A linkable asset is strongest as the hub of a topic cluster, not a standalone page:

- Build the asset on the broad cluster head (signal 1), then internally link the cluster's
  supporting pages (Glossary, Comparisons, Personas — see `programmatic-template-playbooks.md`)
  up to it, and link the asset down to them.
- One asset can serve every opportunity in its cluster — that reuse (signal 3) is what
  makes the build pay back versus a per-opportunity direct pitch.
- The cluster compounds: internal links concentrate authority on the asset, the asset's
  rankings lift the cluster, and the cluster's coverage makes the asset the obvious citation.

## Page shape (when you do build)

- 1,500-3,500 words — stats pages are scanned, not read; "ultimate guides" rank worse.
- 40-80 stats total, 5-12 per section, ≥8 unique source domains, ≥60% from the current or
  prior year.
- Boring exact-match title: "[TOPIC] Statistics You Need to Know in [YEAR]" — the phrase
  journalists actually search.
- Article + FAQPage JSON-LD; 1-3 charts only where there is a real data story; tables for
  4+ row comparison data.
- Canonical version lives on the site's **own** domain first — never syndicate to Medium/
  LinkedIn before the owned page exists, or the backlinks land on the wrong domain.

**Source grounding:** the classifier weights, source hierarchy, zero-outbound rule, and
page shape derive from the qwoted statistics-page playbook. This file ports the
*methodology*; building and pitching the page is execution outside this skill's scope.
