---
title: SEO/AEO-Eval Format Conventions
lifecycle: canonical
status: stable
produced_by: evaluate-seo
load_class: PROCEDURE
---

# SEO/AEO-Eval Format Conventions

> Format rules for the evaluate-seo cycle artifact + results.tsv row + learnings.md promotion. Cited from SKILL.md "Artifact Contract" section. Schema changes require atomic update across `_shared/eval-loop-spec.md` + the eval-loop owner + optimize-seo / monitor-aeo (which produce the source change read by evaluate-seo).

Aligned with the eval siblings (`evaluate-content`, `evaluate-ad`) where cross-eval consistency matters (frontmatter schema, Results Row 8-column schema, Evidence 6-column schema, side-effect order). SEO-specific extensions are clearly marked.

## Output locations

| Path | Lifecycle | Behavior |
|---|---|---|
| `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` | evaluation | Primary artifact, one per cycle, scoped to a single keyword cluster + surface |
| `.forsvn/loops/[slug]/results.tsv` | evaluation | Append exactly one row via `bun scripts/append-loop-result.ts` (validated 8-column helper) |
| `.forsvn/loops/[slug]/learnings.md` | learning | Update ONLY for high-confidence keep/discard lessons reusable beyond this exact keyword; critic gates the promotion |

## File naming

- **Eval artifact:** `YYYY-MM-DD-cycle-N.md` — ISO date + cycle number resolved from `last results.tsv cycle + 1`
- **Slug** = the eval-loop slug (from `program.md` frontmatter)
- **One cycle = one keyword cluster + surface.** If the operator scores organic-SERP and AI-answers reads of the same cluster, the cycles number sequentially; the ledger description disambiguates by including the cluster + surface.

## Frontmatter schema (10 fields + generation provenance)

```yaml
---
skill: evaluate-seo
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
summary: "[cluster-surface] cycle N seo/aeo evaluation"
purpose: "Post-change visibility-delta snapshot for an SEO/AEO eval loop, scoped to one keyword cluster + surface over a lag-respecting window"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current SEO/AEO cycle"
do_not_use_when: "Applying on-page fixes or authoring content without reading the latest loop context and results"
upstream: ".forsvn/loops/[slug]/program.md, context.md, docs/forsvn/artifacts/marketing/optimize-seo/[date]-<slug>.md or monitor-aeo/[date]-[slug].md, ranking-data source"
downstream: "results.tsv, learnings.md, optimize-seo / monitor-aeo next-cycle target"
provenance:
  skill: evaluate-seo
  run_date: YYYY-MM-DD
  input_artifacts:
    - docs/forsvn/artifacts/marketing/optimize-seo/[date]-<slug>.md
    - research/icp-research.md
  output_eval: null
---
```

Date format: ISO `YYYY-MM-DD`. `lifecycle: evaluation` is required (eval-loop spec — see `_shared/eval-loop-spec.md`). `provenance` is the generation-provenance contract — see `_shared/artifact-contract-template.md` § Generation provenance. For an `ai-answers` cycle, the `input_artifacts` source is the `monitor-aeo/[date]-[slug].md` artifact instead.

## Body section structure (8 sections, in order)

1. **Title** — H1 `# [Cluster-Surface] Cycle N Evaluation`
2. **Verdict** — 5 bullets: Status / Confidence / Cluster+Surface / Primary metric / Decision (one sentence, includes the window length)
3. **Evidence** — table (Signal / Current / Baseline / Window / Source / Caveat columns) — scoped to the cluster; signals include primary metric, target-keyword position, organic clicks, impressions, CTR, AI-citation inclusion
4. **What Changed This Cycle** — source optimize-seo/monitor-aeo link + the on-page/technical/AEO change since prior cycle
5. **Diagnosis** — Visibility-Signal Read + Lag & Volatility Check + Cross-Surface Context + Confounders (4 H3 subsections)
6. **Next Cycle Recommendation** — Keep / Discard / Watch / Route-next-work-to lines (target granularity, not "the SEO")
7. **Results Row** — fenced TSV block with the 8-column row — description includes the cluster + surface + window length
8. **Learning Promotion** — Promote to learnings.md (yes/no) + Lesson + Expiry/caveat (keyword/surface scoped, next-core-update expiry)

## Full evaluation artifact template

Save to `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`:

```markdown
---
skill: evaluate-seo
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
summary: "[cluster-surface] cycle N seo/aeo evaluation"
purpose: "Post-change visibility-delta snapshot for an SEO/AEO eval loop, scoped to one keyword cluster + surface over a lag-respecting window"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current SEO/AEO cycle"
do_not_use_when: "Applying on-page fixes or authoring content without reading the latest loop context and results"
upstream: ".forsvn/loops/[slug]/program.md, context.md, docs/forsvn/artifacts/marketing/optimize-seo/[date]-<slug>.md or monitor-aeo/[date]-[slug].md, ranking-data source"
downstream: "results.tsv, learnings.md, optimize-seo / monitor-aeo next-cycle target"
provenance:
  skill: evaluate-seo
  run_date: YYYY-MM-DD
  input_artifacts:
    - docs/forsvn/artifacts/marketing/optimize-seo/[date]-<slug>.md
    - research/icp-research.md
  output_eval: null
---

# [Cluster-Surface] Cycle N Evaluation

## Verdict

- Status: keep | discard | watch | blocked
- Confidence: high | medium | low | blocked
- Cluster / Surface: [target keyword/cluster] · [organic-serp | ai-answers]
- Primary metric: [name] = [value] vs [baseline] (window: [N] days vs [lag floor])
- Decision: [one sentence — includes the cluster + surface + window]

## Evidence

| Signal | Current | Baseline | Window | Source | Caveat |
|---|---:|---:|---|---|---|
| primary metric |  |  |  |  |  |
| target-keyword position |  |  |  |  |  |
| organic clicks |  |  |  |  |  |
| impressions (vanity) |  |  |  |  |  |
| ctr |  |  |  |  |  |
| ai-citation inclusion |  |  |  |  |  |
| organic conversions |  |  |  |  |  |

## What Changed This Cycle

- Source artifact: `docs/forsvn/artifacts/marketing/optimize-seo/[date]-<slug>.md` (or `monitor-aeo/[date]-[slug].md`)
- On-page / technical / AEO change since prior cycle:

## Diagnosis

### Visibility-Signal Read

- meaningful_visibility: [position + clicks + citation + conversions — absolute + delta]
- vanity_signals: [impressions + keyword-count + indexed pages]
- meaningful_to_vanity_read: strong | mixed | vanity-heavy | weak

### Lag & Volatility Check

- window_vs_lag_floor: meets | below ([N] days vs [floor])
- volatility_read: stable | volatile
- core_update_overlap: [none | named update + dates — confounder]
- short_window_caution: [if below floor, say the move may be noise]

### Cross-Surface Context

- [secondary surface]: [headline metric] — [one-line read] — CONTEXT ONLY, not a verdict input

### Confounders

- [core/algorithm update, seasonality, cannibalization, indexation change, SERP-feature volatility, AEO churn, GSC data lag]

## Next Cycle Recommendation

- Keep: [target-level, not "the SEO"]
- Discard:
- Watch:
- Route next work to: optimize-seo | monitor-aeo | write-copy | run-pipeline | none

## Results Row

```tsv
cycle	date	artifact	primary_metric	value	baseline	status	description
N	YYYY-MM-DD	evals/YYYY-MM-DD-cycle-N.md	metric	value	baseline	keep|discard|watch|blocked	[cluster / surface / window] description
```

## Learning Promotion

- Promote to `learnings.md`: yes | no
- Lesson: [keyword/surface-scoped, durable, evidence-backed]
- Expiry / caveat: [next core update? keyword scope? surface scope? what would break this lesson?]
```

## Evidence table format

Six columns mandatory:

| Signal | Current | Baseline | Window | Source | Caveat |

- **Signal** — name of the metric (primary metric mandatory; secondary signals: target-keyword position, organic clicks, impressions, CTR, AI-citation inclusion, organic conversions)
- **Current** — current cycle's value with units (right-aligned)
- **Baseline** — comparison value (right-aligned)
- **Window** — measurement window (date range + days; note if it meets the lag floor)
- **Source** — tool/system the metric came from (GSC / Ahrefs / Semrush / AEO monitor / operator-supplied)
- **Caveat** — sub-floor-window warning, core-update overlap, seasonality, cannibalization, GSC data-lag flag

Unknown values stay unknown. Manual notes are allowed only when labeled operator-supplied + tied to a date/window/source.

**SEO-specific signal expectations:** the primary metric is always populated (Critical Gate 2). Visibility is always reported as the meaningful-vs-vanity breakdown — never a single blended number (Visibility-Signal dim). The Window column always notes whether the window meets the lag floor (Lag & Volatility dim).

## Results Row format (8 columns mandatory)

```text
cycle	date	artifact	primary_metric	value	baseline	status	description
```

Rules:

- `artifact` is relative to the loop folder, e.g. `evals/2026-06-01-cycle-1.md`
- `status` must be `keep`, `discard`, `watch`, or `blocked` (Critic Hard Fail #7 otherwise)
- `description` is one sentence without tabs AND must include the cluster + surface + window tag (Critic Hard Fail #8 otherwise)
- Use the validated helper to append:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include cluster + surface + window>"
```

Example description: `"ai-coding-agent / organic-serp / 30d — avg position 8.1->4.2, clicks +22% — keep, deepen cluster page"`. The `ai-coding-agent / organic-serp / 30d` prefix is the cluster + surface + window tag.

- Do NOT append a row if the Critic verdict is FAIL. Return `BLOCKED`.

### Known limitation — custom schemas

The validated helper enforces the 8-column standard schema. Loops with custom 10+ column `results.tsv` schemas require hand-edit — flag affected loops to the eval-loop owner before manual append.

## Learning Promotion rules

`learnings.md` is the loop's **durable** record of validated lessons. Promotion is conservative — most cycles do NOT promote (most SEO cycles land on `watch`). Keyword/surface scope + a next-core-update expiry are mandatory in the lesson.

| Promotion | Criteria |
|---|---|
| **yes** | High-confidence (`confidence: high`) AND status = `keep` or `discard` AND window met the lag floor AND lesson reusable beyond this exact keyword (e.g., "adding FAQ schema to comparison-intent cluster pages lifts AI-citation inclusion" generalizes; "this one URL hit position 4 in March" does not) |
| **no** | Low-confidence OR `watch`/`blocked` status OR sub-lag-floor window OR core-update-confounded OR lesson is keyword-specific OR lesson rests on an impression spike (Critic Hard Fail #9) |

Critic Hard Fail #9 enforces — learning promoted from low-confidence-or-blocked-or-vanity evidence triggers FAIL.

Lesson format:

```markdown
## YYYY-MM-DD — [one-line lesson — include keyword/surface scope]

- **Cycle:** [loop-slug] cycle N
- **Cluster / Surface:** [cluster] · [organic-serp | ai-answers]
- **Evidence:** [primary metric delta with window length + confidence]
- **Expiry / caveat:** [next core update may reset this — re-measure after the next confirmed core update]
```

## Side effects (executed in order after critic PASS)

1. **Write eval artifact** at `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`
2. **Append ledger row** via `bun scripts/append-loop-result.ts` (validated helper, 8-column schema)
3. **Update learnings.md** ONLY if critic approved promotion (high-confidence keyword/surface-scoped keep/discard lesson over a lag-respecting window)
4. **Run manifest-sync** via `bun scripts/manifest-sync.ts` to refresh the manifest

If critic FAIL after revision: skip all 4 side effects. Return BLOCKED with the missing evidence. If operator overrides on a `PASS_WITH_CONCERNS` verdict, the override-log invocation (`scripts/log-critic-override.ts`) precedes side effect #2.

## Cross-stack contract

This skill produces:

- `evals/[date]-cycle-N.md` — consumed by future SEO-eval cycles (trend), by `optimize-seo` / `monitor-aeo` (latest eval seeds the next target), and by humans reviewing loop progress
- `results.tsv` row — appended to the loop's ledger; consumed by any skill reading the loop's status
- `learnings.md` update — high-confidence keyword/surface-scoped lessons reusable beyond this keyword, with a next-core-update expiry

This skill reads the source optimize-seo / monitor-aeo artifact (stored in provenance.input_artifacts) + the ranking/visibility data. The coordination contract is at the eval-loop boundary + the provenance pointer, not at a shared-schema boundary.

Schema changes (frontmatter fields, body section structure, Evidence table columns, Results Row columns, learnings.md format) require atomic update of `format-conventions.md` + `_shared/eval-loop-spec.md` + downstream callers — never silently drift.
