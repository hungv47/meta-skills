---
title: Platform Evidence Research — Format Conventions
lifecycle: canonical
status: stable
produced_by: research-platform
load_class: PROCEDURE
---

# Format Conventions

**Load when:** synthesis-agent is composing the artifact OR critic-agent is verifying citation / tagging / freshness formatting. These conventions are enforced by critic rubrics #1, #2, and #5.

---

## Date format

All dates ISO 8601 (`YYYY-MM-DD`). No locale variants, no prose dates. Frontmatter date fields, inline `measured_at` tags, and freshness references all use this format.

## Frontmatter schema

```yaml
type: platform-evidence
status: done | done_with_concerns | blocked | needs_context
date: YYYY-MM-DD                       # when this artifact was produced
account_scope: <free text>             # whose accounts this covers
platforms_analyzed: [list]             # in-scope platforms, canonical order
metrics_window_date: YYYY-MM-DD        # the fast window — performance metrics
algorithm_context_date: YYYY-MM-DD     # the slow window — platform-mechanic context
evidence_sources_logged:               # one entry per distinct evidence source
  - platform: <name>
    source_type: <owned_analytics | manual_export | prior_eval | public_metrics | forum_observation>
    measured_at: YYYY-MM-DD
coverage_per_platform:                  # one entry per in-scope platform
  x: { items: <int>, flag: MEASURED | PARTIAL | NO_EVIDENCE }
  linkedin: { items: <int>, flag: ... }
  ...
```

`coverage_per_platform` and `evidence_sources_logged` are mechanically derived from the evidence-intake records — they must not drift from the body. The artifact is `pipeline` lifecycle; review fields are absent (a pipeline artifact defaults to `decision_state: not_required` — see the stack's reviewable-artifact contract; this skill does not opt in).

## Metric-citation format

Every metric in a body table or prose carries its source-type tag and measurement date. In a table, that is the dedicated columns:

```
| Metric | Value | Source type | Measured | Freshness | Confidence | vs. benchmark |
|---|---|---|---|---|---|---|
| engagement_rate | 2.4% | owned_analytics | 2026-05-10 | fresh | H | within typical band |
```

In prose, inline:

```
"average view duration 38% (owned_analytics, measured 2026-05-09, confidence H)"
```

Pattern: `"<metric> <value> (<source_type>, measured <YYYY-MM-DD>, confidence <H|M|L>)"`.

A benchmark range, when cited, names its source separately and is never written as if it were the account's own metric:

```
"below the 50–55% typical band for the niche (benchmark-agent: [source], 2026-03-30)"
```

## Coverage-flag placement

Each platform's flag appears in three places, all consistent:
- Frontmatter: `coverage_per_platform[platform]: { items: <int>, flag: <FLAG> }`
- Evidence Base table: the platform's row
- Per-Platform Evidence section header: `### [Platform] — [FLAG] ([n] items)`

A flag that differs between these three is a critic rubric #3 FAIL.

## Per-platform section order

Always in this order (skip absent platforms; never reorder):

1. X
2. LinkedIn
3. TikTok
4. YouTube
5. Instagram

Downstream consumers read per-platform sections positionally — reordering breaks them.

## Body section headers (verbatim)

The 8 body sections appear in this order with these exact H2 headers (downstream parsers match on H2):

1. `## TL;DR`
2. `## Evidence Base`
3. `## Per-Platform Evidence`
4. `## Cross-Platform Comparison`
5. `## Recommendations`
6. `## Missing Evidence & How to Close It`
7. `## Open Risks & Caveats`
8. `## What This Evidence Doesn't Cover`

Per-platform subsections under §3 and §5 use H3 with the platform name (e.g., `### X`).

## Slug convention

Artifact filename: `docs/forsvn/artifacts/research/platform-evidence/[slug].md`. The slug is a kebab-case rendering of the account scope (e.g., `forsvn-company`, `founder-personal`). One artifact per account scope + platform set.

## When critic catches a format violation

Critic FAIL → re-dispatch synthesis-agent with the specific format rule cited. Format violations are rubric #1 (citation), #2 (source-type tag), or #5 (freshness/date) failures — usually one-shot fixes; do not loop past cycle 1 for format-only issues.
