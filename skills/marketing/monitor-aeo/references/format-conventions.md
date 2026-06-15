# Format Conventions — AEO Monitor Artifacts

> Load this when writing or reading `docs/forsvn/artifacts/marketing/aeo-monitor/[slug]/`. Conventions are contract-level — schema changes break trend computation across runs and the `optimize-seo` handoff consumer.

---

## Artifact directory

```
docs/forsvn/artifacts/marketing/aeo-monitor/[slug]/
  report.md                            # rewritten in place each run
  query-set.md                         # rewritten in place each run
  handoff-optimize-seo.md              # rewritten in place each run
  snapshots/
    [YYYY-MM-DD]-ai-citations.json
    [YYYY-MM-DD]-geo-overview.json
    [YYYY-MM-DD]-ai-referrals.json
    [YYYY-MM-DD]-readiness.json
```

`[slug]` = kebab-cased subject domain (e.g., `example-com` for `example.com`; `forsvn-com` for `forsvn.com`).

Snapshots are **append-only**. One set per date. Trend computation reads `snapshots/*.json` ordered by filename.

Rewritten-in-place files (`report.md`, `query-set.md`, `handoff-optimize-seo.md`) rely on git history for diffs. Operators should commit per run.

---

## `report.md` frontmatter (REQUIRED)

```yaml
---
skill: monitor-aeo
mode: ai-citations | geo-overview | ai-referrals | bing-readiness | llms-readiness | full-report
subject: example.com
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
evidence-classes:
  observed-test: <int>
  single-run: <int>
  unavailable: <int>
  practitioner-inference: 0
  hypothesis: 0
---
```

All six top-level fields REQUIRED. `evidence-classes` object counts every evidence-tagged cell across the report body. `practitioner-inference` and `hypothesis` SHOULD be 0 — non-zero values indicate strategy leakage (critic FAIL gate 7).

---

## `report.md` body sections (REQUIRED, in order)

```markdown
# AEO Monitor: [subject]

**Date:** YYYY-MM-DD
**Mode:** [mode label]
**Subject:** [domain]
**Geo + language:** [scope]
**Run window:** [export date range]

## 1. Subject + Scope
[Domain, geo+language, run window, what this snapshot covers.]

## 2. Provider Readiness
[Ledger table from provider-readiness-agent — verbatim.]

## 3. AI Citations
[Matrix from citation-monitor — verbatim if ≤25 rows, else top-10 + "full matrix in snapshots/[date]-ai-citations.json".]

## 4. GEO (AI Overview)
[Matrix from geo-monitor — verbatim or summarized similarly.]

## 5. AI Referrals
[Inventory + roll-up from traffic-monitor — verbatim. Coverage caveats included.]

## 6. Technical Readiness
[Both tables from readiness-agent — verbatim.]

## 7. Trend (vs. prior snapshot)
[Per-snapshot-type deltas, or `n/a — first snapshot`. Only meaningful deltas (≥5pp citation rate change, new top-5 competitor, AI Overview presence flip, ≥25% referral volume change).]

## 8. Competitor Cited-Domain Share
[Merged inventory across citation-monitor + geo-monitor. Surface-tagged. Sorted descending.]

## 9. Gaps for Strategy (→ handoff)
[5-15 bullet-point summaries. Full clustered gaps in `handoff-optimize-seo.md`.]

## 10. Methodology + Evidence Class Index
[One-paragraph methodology. Evidence-class counts table matching frontmatter object.]
```

---

## `query-set.md` body (REQUIRED)

```markdown
# Query Set — [subject] — [date]

## Source
[ICP path § / operator-supplied / prior-snapshot delta]

## Query × Provider Matrix
[Verbatim from query-set-agent. Each query carries a query-type category (branded/category/comparison/problem/long-tail) and a volume tier (head/mid/long-tail).]

## Competitor Set
[Verbatim from query-set-agent.]

## Coverage Map
[Verbatim from query-set-agent — both the category × volume-tier table AND the intent-class table. Confirms the locked set is balanced: every category the subject competes in is covered and ≥2 volume tiers are present. Query-set design contract: `references/procedures/pre-dispatch.md` § "Query-set design".]

## Change vs prior query-set
[Added queries / removed queries / unchanged count. `n/a — first run` on initial snapshot.]
```

This file locks the query set used for THIS run. Future trend computation against this snapshot requires query stability — added/removed queries are flagged in this section.

---

## `handoff-optimize-seo.md` body (REQUIRED)

```markdown
# Handoff to optimize-seo — [subject] — [date]

Source snapshot: `docs/forsvn/artifacts/marketing/aeo-monitor/[slug]/report.md` ([date])

## Gaps (clustered, evidence-tagged)

### Gap — [short label]
- **Evidence:** [report section + row(s)]
- **Evidence class:** observed-test (n=N) / single-run / unavailable / etc.
- **Subject status:** [what's true now]
- **Competitor status:** [what they're doing that subject isn't]
- **Strategy question for optimize-seo:** [the question to answer — never a prescribed fix]

[Repeat for 5-15 clustered gaps. Cluster by evidence pattern, not per query.]
```

---

## Snapshot JSON schemas

All snapshot files share a common envelope and a payload that depends on snapshot type. Trend computation reads these — schema stability matters.

### Common envelope

```json
{
  "schema_version": 1,
  "snapshot_type": "ai-citations | geo-overview | ai-referrals | readiness",
  "subject": "example.com",
  "date": "YYYY-MM-DD",
  "run_window_start": "YYYY-MM-DD",
  "run_window_end": "YYYY-MM-DD",
  "query_set_ref": "query-set.md",
  "evidence_classes_summary": { "observed-test": 0, "single-run": 0, "unavailable": 0 },
  "payload": { /* per snapshot_type */ }
}
```

### `ai-citations` payload

```json
{
  "rows": [
    {
      "query_id": "Q1",
      "query": "best spatial note-taking app",
      "provider": "OpenAI (gpt-4o)",
      "run_type": "multi-run | single-run | unavailable",
      "n_runs": 5,
      "subject_cited": "yes | no | unavailable",
      "subject_cite_count": 3,
      "subject_mention_type": "linked citation | unlinked mention | paraphrased without attribution | none | unavailable",
      "cited_domains": [
        { "domain": "obsidian.md", "cites": 5, "owner": "competitor" },
        { "domain": "notion.so", "cites": 4, "owner": "competitor" }
      ],
      "subject_median_rank": 2,
      "evidence_class": "observed-test"
    }
  ]
}
```

### `geo-overview` payload

```json
{
  "rows": [
    {
      "keyword_id": "K1",
      "keyword": "best spatial note-taking app",
      "geo": "US-en",
      "ai_overview_present": "yes | no | yes (probabilistic 30%)",
      "subject_cited": "yes | no | n/a",
      "subject_mention_type": "linked citation | unlinked mention | none",
      "cited_domains_ordered": ["obsidian.md", "notion.so", "theverge.com"],
      "serp_feature_mix": ["AI Overview", "PAA", "organic"],
      "evidence_class": "observed-test"
    }
  ]
}
```

### `ai-referrals` payload

```json
{
  "referrers": [
    {
      "host": "chat.openai.com",
      "provider": "OpenAI ChatGPT",
      "sessions": 412,
      "pageviews": 1038,
      "date_range_start": "YYYY-MM-DD",
      "date_range_end": "YYYY-MM-DD",
      "evidence_class": "observed-test"
    }
  ],
  "provider_rollup": [
    { "provider": "OpenAI ChatGPT", "sessions": 499, "pageviews": 1236, "share_of_ai_referrals": 0.57 }
  ],
  "coverage_caveats": [
    "ChatGPT iOS app referrals appear as (direct) in GA4",
    "Cookieless visits not represented"
  ]
}
```

### `readiness` payload

```json
{
  "bing_indexnow": [
    {
      "check": "Bing Webmaster site verified",
      "status": "ready | partial | missing | unavailable",
      "observation": "...",
      "resolves_with": "..." | null,
      "evidence_class": "observed-test"
    }
  ],
  "bing_traffic": [
    {
      "metric": "Bing organic clicks | Bing organic impressions | avg position",
      "value": 1820,
      "date_range_start": "YYYY-MM-DD",
      "date_range_end": "YYYY-MM-DD",
      "source": "Bing Webmaster Tools — Search Performance export",
      "evidence_class": "observed-test | unavailable"
    }
  ],
  "llms_crawlers": [
    {
      "check": "/llms.txt present",
      "status": "ready | partial | missing",
      "observation": "200 OK, 2.1 KB",
      "resolves_with": null,
      "evidence_class": "observed-test"
    }
  ]
}
```

---

## Status field guidance

- `done` — every Layer-1 agent that ran produced complete output, no provider gaps, critic PASS within 2 cycles
- `done_with_concerns` — analysis delivered with labeled provider gaps (credentials/exports missing on at least one provider), critic PASS
- `blocked` — query set un-derivable (no ICP source AND no operator queries) OR subject domain not supplied
- `needs_context` — single-mode route invoked with sole input unavailable

---

## What goes where — quick reference

| Content | Lives in |
|---|---|
| Per-cell evidence with metadata | snapshot JSON (`snapshots/*.json`) |
| Human-readable per-section tables | `report.md` |
| Operator-actionable gap list | `handoff-optimize-seo.md` |
| Locked query × provider matrix for this run | `query-set.md` |
| Prescriptions ("rewrite X", "add Y") | NOWHERE in monitor artifacts — those live in `optimize-seo` outputs after handoff consumption |
