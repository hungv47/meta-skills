---
title: Platform Evidence Research — Evidence Protocol
lifecycle: canonical
status: stable
produced_by: research-platform
load_class: PROCEDURE
---

# Evidence Protocol

**Load when:** any agent intakes, tags, validates, or reasons about a datum. This file defines the five evidence-source types, the intake and validation rules, and the coverage-flag thresholds. It is the contract that makes "no fabricated metrics" mechanical.

---

## The five evidence-source types

Every datum in a platform-evidence artifact is exactly one of these. The tag is fixed by where the datum *actually came from* — not by how strong the agent wishes it were.

| Source type | What it is | Trust | How to get it |
|---|---|---|---|
| `owned_analytics` | The operator's native platform analytics — X Analytics, YouTube Studio, LinkedIn page analytics, TikTok Creator analytics, Instagram Insights | Highest — instrumented by the platform for the account owner | Operator exports / screenshots it and pastes it in |
| `manual_export` | A CSV, spreadsheet, or tracker the operator maintains by hand | High — but only as good as the operator's logging discipline | Operator pastes it in |
| `prior_eval` | A figure inside a prior `.forsvn/loops/*/evals/*.md` artifact — an eval cycle score, a published-post outcome | High for what it measured — already critic-gated by the eval skill | Read from the loop's eval artifacts |
| `public_metrics` | A metric visible on a public post or profile page without login — a public view or like count | Moderate — real, but partial and platform-curated | Web fetch of the public page |
| `forum_observation` | A qualitative pattern the operator or a public discussion noted ("our Tuesday posts feel flat") | Low — directional only, not a measurement | Operator states it, or it surfaces in public discussion |

**Trust ordering:** `owned_analytics` ≥ `manual_export` ≈ `prior_eval` > `public_metrics` > `forum_observation`. Every type is reportable — the ordering tells a downstream reader how much weight a number carries, and a recommendation's confidence is bounded by the trust of its weakest cited source.

## The API enrichment path (documented, never called)

Each platform schema in `platforms/` documents the platform's API — what it exposes, its limits — as an **optional enrichment**. The skill never calls an API and never holds a credential. If the operator runs an API pull themselves and pastes the result in, that result is intaken as `owned_analytics` (it is their instrumented data) or `manual_export` (if they post-processed it). The skill's job is to tell the operator what the API offers; running it is theirs.

## Intake rules

1. **Transcribe, do not interpret.** Record the figure exactly as supplied. The reading of it happens in synthesis (against a benchmark) and recommendation — never at intake.
2. **Every item gets a `measured_at`.** This is the date the *source* measured the metric — pulled from the export's date range or the screenshot's window. Never today's date. A datum with no determinable measurement date is intaken at `confidence: L` with a `scope_note` saying the date is unknown.
3. **Every item gets a `scope_note`.** What the figure covers: the date range, the post set, account-wide vs. single-post. A number without scope is ambiguous and half-useless downstream.
4. **A missing metric is a gap, not a number.** If a metric was not supplied and is not publicly observable, it goes in Evidence Gaps with a concrete capture step. It never gets an estimated value.
5. **No upgrading.** A `public_metrics` figure cannot be re-tagged `owned_analytics` because it would look stronger. A benchmark range cannot be intaken as the account's evidence at all — benchmarks are context, handled by benchmark-agent.

## Validation rules

Before an intake record leaves evidence-intake-agent, each item must satisfy:

- [ ] Has a `source_type` from the five — never blank
- [ ] Has a `measured_at` date (or an explicit unknown-date note + confidence L)
- [ ] Has a `scope_note` defining what the figure covers
- [ ] Has a `confidence` label (H/M/L per `_shared/confidence-labeling.md`)
- [ ] The metric exists in that platform's schema (`platforms/[platform].md`) — no metric the platform does not expose
- [ ] The value is a transcribed figure or `qualitative` — never an estimate, never a `~`-prefixed guess

An item that fails any check is fixed or moved to Evidence Gaps. It does not ship as captured evidence.

## Coverage-flag thresholds

Each platform gets exactly one flag, assigned by evidence-intake-agent and verified by the critic (rubric #3).

| Flag | Threshold | Downstream effect |
|---|---|---|
| **MEASURED** | `owned_analytics` (or `manual_export` / `prior_eval`) present for the platform's core metrics, OR ≥3 corroborating items across ≥2 source types | Recommendations claimed normally; confidence up to H |
| **PARTIAL** | Some evidence, but thin (1–2 items) or single-source — e.g., only `public_metrics`, or one screenshot | Recommendations allowed but capped at confidence M and marked directional |
| **NO_EVIDENCE** | No usable evidence supplied or retrievable | No recommendations — only a "what to export" gap note in §"Missing Evidence" |

**Core metrics** are defined per platform in `platforms/[platform].md` — typically a reach/impressions metric, an engagement metric, and one platform-signature metric (e.g., average view duration for YouTube). MEASURED requires owned-grade evidence on those, not on a single peripheral number.

**Threshold rationale:** ≥3 items across ≥2 source types is the minimum for corroboration — two items from one screenshot is one observation, not three. A single source, however rich, is PARTIAL: it cannot be cross-checked. NO_EVIDENCE is declared honestly and often — most operators have not instrumented all five platforms equally, and a clean NO_EVIDENCE flag is worth more than a padded section.

## Source independence

Three figures from the same export are *one source*, not three — they corroborate nothing about each other. The "≥2 source types" half of the MEASURED threshold exists for exactly this reason. When all evidence for a platform traces to a single export or a single screenshot, the flag is PARTIAL regardless of how many individual numbers were transcribed. Confidence labeling (`_shared/confidence-labeling.md` § source independence) applies the same rule at the per-claim level.

## Freshness windows

Two windows, two timestamps — so one fresh date never masks a stale truth.

| Window | Frontmatter field | Refresh | Warn | Governs |
|---|---|---|---|---|
| Metrics | `metrics_window_date` | 30d | 60d | Performance numbers — impressions, engagement, views, follower counts |
| Algorithm context | `algorithm_context_date` | 90d | 180d | Platform-mechanic context — what the algorithm currently rewards |

Each datum's `measured_at` is checked against the applicable window: `fresh` inside refresh, `warn` between refresh and warn, `stale` beyond warn. A `warn` or `stale` item is flagged in its table row and named in Open Risks — never silently treated as current.
