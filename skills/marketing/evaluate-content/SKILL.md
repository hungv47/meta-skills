---
name: evaluate-content
description: "Score a published organic post (text / image / carousel) from real metrics inside an existing eval loop — one primary platform per cycle, verdict + engagement-quality diagnosis. Not for short-form video (use evaluate-shortform), paid-ad performance (use evaluate-ad), writing next-cycle copy (use write-social), or scaffolding the loop (use run-eval-loop)."
argument-hint: "[loop slug or path] [primary-platform] [metric window]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "0.2.0"
  budget: standard
  estimated-cost: "$0.75-1.50"
---

# Content Eval — Orchestrator

Converts published organic-content evidence into a cycle snapshot + ledger row + narrowly-scoped next action inside an existing eval loop. One primary platform per cycle; secondary platforms are context. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + 7-dim rubric + critic-override protocol: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Core question:** Did this content cycle, on its primary platform, create measurable signal strong enough to keep / discard / watch / block — and what should the next strategy/execution skill know?

## Critical Gates — load first

1. **Existing eval loop required.** If `.forsvn/loops/[slug]/program.md` and `context.md` do not exist → `NEEDS_CONTEXT`, recommend `/run-eval-loop`. This skill does not create loops.
2. **Organic non-video content only.** Scores text / image / carousel organic posts. Short-form video defers to `evaluate-shortform`. Paid-ad placements defer to `evaluate-ad`. Content under eval is video or paid → `NEEDS_CONTEXT`, route to sibling.
3. **Measurement evidence required.** Not a generic content-quality audit. Require at least one metric source, measurement window, and current value for the loop's primary metric (engagement rate / save rate / CTR / conversion rate — operator-pick-per-cycle via `program.md`).
4. **One primary metric decides the ledger row.** Secondary metrics (likes, impressions, comment sentiment) explain diagnosis; they do not override the loop's primary metric unless `program.md` defines an explicit guardrail failure.
5. **One primary platform per cycle.** Each cycle is scoped to one operator-designated primary platform. Secondary platforms appear in `Cross-Platform Context` subsection — they inform diagnosis but DO NOT drive the keep/discard verdict. A 9-platform campaign is evaluated as separate cycles, one primary platform each.
6. **No fabricated analytics.** Unknown values stay unknown. Manual notes only when labeled as operator-supplied and tied to date/window/source.
7. **Attribution confidence must be explicit.** Every verdict includes sample size (impressions/reach + window), baseline comparability (same platform, same content type, comparable window), confounders (algorithm change, posting-time shift, follower-count change, cross-post cannibalization), and confidence: `high | medium | low | blocked`.
8. **Evaluation does not generate content.** Recommend next changes; route copy authorship to `write-social` (with revised brief), distribution work to `publish-social`, visual-asset work to `produce-asset`.

## Responsibility Split

- `/run-eval-loop` owns loop setup, `program.md`, `context.md`, `results.tsv` schema, durable learning ledger.
- `/evaluate-content` owns post-publish organic-content evidence snapshots for a loop cycle, scoped to a single primary platform.
- `/write-social` owns next-cycle copy after an eval identifies what should change.
- `/evaluate-shortform` owns short-form video; `/evaluate-ad` owns paid-ad performance.

## Inputs

| Input | Required? | What it provides |
|---|---:|---|
| Loop slug or path | **required** | Locates `.forsvn/loops/[slug]/` |
| Primary-platform tag | **required** | Scopes the cycle; gates Critical Gate 5 (`linkedin`, `instagram`, `x`, `facebook`, `threads`) |
| Source write-social artifact | **required** | Brief's hypothesis — typically `.forsvn/artifacts/mkt/copy/[platform]-[date]-[slug].md` |
| Measurement window | **required** | Date range (start + end + days) |
| Primary metric value + source | **required** | Ledger decision metric (e.g., save rate = 3.1% from native platform analytics) |
| Reach / impressions | **required** | Sample-size confidence floor |
| Baseline or prior cycle row | required if available | Same platform, same content type |
| Engagement breakdown | recommended | Likes / saves / shares / comments split — Engagement-Quality scoring |
| Click-through + conversion | recommended | Funnel-depth diagnosis |
| Qualitative evidence | recommended | Comment sentiment, replies, DMs — handled honestly, not fabricated |
| Secondary-platform metrics | optional | Headline metrics for other platforms (Cross-Platform Context) |
| Guardrail metrics from `program.md` | optional | Auto-fail thresholds |

## Outputs

Primary artifact: `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`.

Side effects:

- Append one row to `.forsvn/loops/[slug]/results.tsv` with `bun scripts/append-loop-result.ts` (8-column validated helper).
- Update `.forsvn/loops/[slug]/learnings.md` ONLY for high-confidence `keep` or `discard` lessons that generalize beyond this content piece (critic gates).
- Run `bun scripts/manifest-sync.ts` after writing.

## Pre-Dispatch

Hard-block conditions fire BEFORE Cold Start:

1. `program.md` or `context.md` absent → `NEEDS_CONTEXT`, recommend `/run-eval-loop`.
2. Content under eval is short-form video → `NEEDS_CONTEXT`, route to `evaluate-shortform`.
3. No measurement evidence for current cycle → `BLOCKED` with missing-evidence list.
4. Primary-platform tag missing → `BLOCKED`, ask operator to declare it.
5. Custom 10+ column `results.tsv` schema → warn + flag to eval-loop owner; require hand-edit.

Read Order: `program.md` → `context.md` → `results.tsv` → latest `strategy/` + `execution/` + `evals/` files → source write-social artifact → publish-social bundle manifest if present → canonical artifacts (`brand/BRAND.md`, `research/product-context.md`, `research/icp-research.md`). Stale `.forsvn/index/manifest.json` → run `bun scripts/manifest-sync.ts`.

**Warm Start** (loop exists + metric evidence present + primary-platform tagged): summarize loop + primary platform + primary metric + baseline/prior + latest content artifact + current evidence window; proceed to cycle N.

**Cold Start** (loop exists but cycle context missing): ask 6 bundled questions — loop slug/path + primary platform + source write-social artifact path + measurement window + primary metric value/baseline + reach. If loop itself does not exist → `NEEDS_CONTEXT`, recommend `/run-eval-loop`.

Full Warm/Cold Start templates + hard-block conditions + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

## Quality Gate

7-dim rubric (5 shared + 2 content-specific). Critic FAIL → revise once; persistent FAIL → write no ledger row, return `BLOCKED`. Full rubric + Hard Fails + override protocol: [`references/agent-manifest.md`](references/agent-manifest.md). Domain rubric in [`references/rubric.md`](references/rubric.md); shared frame in `references/_shared/evaluation-loop-rubric.md`.

## Artifact Contract

- **Primary artifact:** `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`.
- **Side effects:** append one row to `results.tsv` · update `learnings.md` ONLY for high-confidence keep/discard reusable lessons (critic gates) · run `manifest-sync.ts`.
- **Lifecycle:** `evaluation`.
- **Frontmatter:** 10 fields (`skill` / `version` / `date` / `status` / `summary` / `purpose` / `lifecycle` / `use_when` / `do_not_use_when` / `upstream` / `downstream`) + provenance (`provenance.input_artifacts`: source write-social path + `brand/BRAND.md` + `research/icp-research.md`; `provenance.output_eval: null`).
- **Body:** 8 sections — Title · Verdict · Evidence (6-col table) · What Changed This Cycle · Diagnosis (Likely Drivers + Engagement-Quality Signals + Cross-Platform Context + Confounders) · Next Cycle Recommendation · Results Row (8-col TSV) · Learning Promotion.
- **Primary-platform field:** Verdict block must name the primary platform explicitly (Critical Gate 5); Evidence table scopes metrics to that platform.
- **Results Row schema:** 8 columns — `cycle` / `date` / `artifact` / `primary_metric` / `value` / `baseline` / `status` / `description`. `status` must be `keep | discard | watch | blocked` (Critic Hard Fail otherwise); description includes the primary-platform tag.
- **Cross-stack contract:** consumed by future content-eval cycles (trend analysis) + `write-social --rev=N+1` (hypothesis seeding) + humans reviewing loop progress. Schema changes require atomic update across `_shared/eval-loop-spec.md` + downstream callers.

Full evaluation artifact template byte-identical + Evidence table + Results Row + Learning Promotion + `append-loop-result.ts` invocation: [`references/format-conventions.md`](references/format-conventions.md).

## Results Row Discipline

Append exactly one row in this shape:

```text
cycle	date	artifact	primary_metric	value	baseline	status	description
```

Rules:

- `artifact` is relative to the loop folder (e.g., `evals/2026-05-19-cycle-1.md`).
- `status` must be `keep | discard | watch | blocked`.
- `description` is one sentence without tabs (include primary-platform tag).
- Use the validated helper:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include primary-platform>"
```

- Do NOT append a row if Critic verdict is FAIL. Return `BLOCKED`.

## Critic Override Protocol

Operator ships despite a critic FAIL — or accepts a flagged `pass-with-concerns` — **log the override BEFORE writing the artifact or appending the ledger row**: `bun scripts/eval/log-critic-override.ts --skill evaluate-content …`. Feeds the shared quality system. Three overrides → rubric-revision escalation. Override never promotes a contested cycle to `keep`; a no-override FAIL still returns `BLOCKED`. Full protocol: [`references/_shared/critic-override-protocol.md`](references/_shared/critic-override-protocol.md).

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before any cycle artifact ships. Content-eval-specific (vanity-metric inflation, cross-platform contamination of the verdict, fabricated qualitative sentiment, scope drift to rewriting the content, lane drift into evaluate-shortform / evaluate-ad territory, learning promotion from an algorithm-spike window, killing a cycle without same-platform baseline comparability) + 4 cross-cutting marketing-stack rows.

Most common in practice: vanity-metric inflation (Critical Gate 4 + critic dim Engagement-Quality Discrimination), cross-platform contamination (Critical Gate 5 + critic dim Platform-Fit), scope drift to write-social (Critical Gate 8 + critic dim Decision Discipline), missing source write-social artifact (Critic Hard Fail).

## Completion Status

- `DONE` — eval artifact written, ledger row appended, critic PASS.
- `DONE_WITH_CONCERNS` — artifact + row written, but confidence is low/medium or confounders are material.
- `NEEDS_CONTEXT` — missing loop, source write-social artifact, primary-platform tag, or required metric evidence; OR content is short-form video / paid ad (route to right sibling).
- `BLOCKED` — contradictory data, no measurement evidence, filesystem failure, or critic failed after revision.
