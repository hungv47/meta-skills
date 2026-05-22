# Scoring Rubrics

Shared scoring rules used by `evidence-intake-agent`, `synthesis-agent`, `recommendation-agent`, and `critic-agent`. These rules apply to every run and are NOT renegotiable per-platform or per-account.

---

## Coverage Flags

Every per-platform section declares exactly one flag, based on the evidence intaken for that platform. Assigned by evidence-intake-agent; verified by critic-agent rubric #3.

| Flag | Threshold | What it means downstream |
|---|---|---|
| **MEASURED** | `owned_analytics` / `manual_export` / `prior_eval` present for the platform's core metrics, OR ≥3 corroborating items across ≥2 source types | Recommendations claimed normally; confidence up to H |
| **PARTIAL** | Some evidence but thin (1–2 items) or single-source | Recommendations allowed, capped at confidence M, marked directional |
| **NO_EVIDENCE** | No usable evidence supplied or retrievable | NO recommendations; only a "what to export" gap note |

The flag carries to:
- Frontmatter: `coverage_per_platform[platform]: { items: <int>, flag: <FLAG> }`
- Evidence Base table row
- Per-Platform Evidence section header: `### [Platform] — [FLAG] ([n] items)`
- Open Risks: every PARTIAL and NO_EVIDENCE platform listed explicitly

**Threshold rationale:** corroboration needs ≥3 items across ≥2 *source types* — three numbers off one screenshot is one observation, not three (see `evidence-protocol.md` § Source independence). A single rich source is PARTIAL: uncross-checkable. NO_EVIDENCE is honest and common — a clean NO_EVIDENCE flag beats a padded section.

---

## Evidence Citation Rules

Every metric, number, and named figure must trace to a tagged evidence source. Critic rubric #1 enforces.

### What needs a source tag

- **Every metric value** — `engagement_rate 2.4%` → `(owned_analytics, measured 2026-05-10)`
- **Every figure in the Cross-Platform Comparison** — each cell carries its source-type tag, or is `—`
- **Every number in the TL;DR** — must trace to a body evidence item
- **Every metric a recommendation cites** — must appear in that platform's Per-Platform Evidence table

### What does NOT need a source tag

- A **benchmark range** — it carries benchmark-agent's source + date instead, and is never written as the account's own metric
- A **structural fact** about the platform (e.g., "YouTube exposes average view duration in Studio") — sourced indirectly via the `platforms/[platform].md` schema

### Citation format

Table: dedicated `Source type` / `Measured` / `Confidence` columns. Prose: inline `"<metric> <value> (<source_type>, measured <YYYY-MM-DD>, confidence <H|M|L>)"`. See `format-conventions.md`.

A number with no source tag and no `measured_at` is an orphan → rubric #1 FAIL → re-dispatch.

---

## Freshness Windows

| Window | Frontmatter field | Refresh | Warn | Enforcement |
|---|---|---|---|---|
| Metrics | `metrics_window_date` | 30d | 60d | Every performance datum's `measured_at` checked against this window |
| Algorithm context | `algorithm_context_date` | 90d | 180d | Every platform-mechanic context item checked against this window |

**Why these windows:**
- Metrics: platform performance shifts month to month — a 30d refresh keeps numbers live; past 60d they no longer describe the current account.
- Algorithm context: platforms ship mechanic changes roughly quarterly — 90d keeps context live; 180d is when it becomes questionable.

A datum past its window is flagged `warn` or `stale` in its table row AND named in Open Risks. Critic rubric #5 fails if a stale datum is presented as current.

---

## Recommendation Attribution

Every recommendation carries a four-part attribution. Critic rubric #4 enforces.

| Line | Content |
|---|---|
| **Evidence** | The metric(s) + benchmark comparison that drive the recommendation |
| **Source** | The `source_type` of that evidence |
| **Freshness window** | The metric's `measured_at` + fresh/warn/stale — when to re-check the recommendation |
| **Confidence** | H / M / L, bounded by the rules below |

**Confidence bounding** (a recommendation's confidence cannot exceed any of these):
- The coverage flag — PARTIAL platform → max M.
- The weakest cited datum — a recommendation on confidence-L evidence is at most L.
- Freshness — a recommendation on `warn`/`stale` evidence drops one level and the staleness is named in the Freshness window line.

A recommendation must be **falsifiable and specific** — it names a move, a platform, and the metric it should change. Generic advice ("post more", "improve engagement") that names no metric → rubric #4 FAIL.

---

## The Five Critic Rubrics

All five must PASS for an overall PASS. Each is binary — no partial credit.

1. **Evidence Citation** — every metric traces to a tagged source with `measured_at`; no orphan numbers.
2. **Source-Type Honesty** — every datum tagged with one of the 5 types; no public/benchmark figure laundered as `owned_analytics`; no blank tag.
3. **Coverage-Flag Accuracy** — each platform's flag matches the threshold rule for its evidence count + source mix; no NO_EVIDENCE platform carries a recommendation.
4. **Recommendation Completeness** — every recommendation has all 4 attribution lines; no generic recommendation; no confidence-H recommendation on a PARTIAL platform or confidence-L evidence.
5. **Freshness** — both window dates populated; every datum carries `measured_at`; stale items flagged in-table and in Open Risks.

---

## Loop Cap

Critic loops max at **2 cycles**. After cycle 2 with any remaining FAIL, the artifact ships as `done_with_concerns` with the failed rubrics' evidence pinned at the top of the artifact.

This is a cost-discipline rule. A third cycle compounds spend with diminishing returns — and a transparently-flagged concern is more useful than a forced PASS.
