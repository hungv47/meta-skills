---
name: evaluate-campaign
description: "Score a launched multi-channel campaign from real metrics inside an existing eval loop — verdict, per-channel breakdown, unit economics. Aggregate-only: one cycle = whole campaign, all channels. Requires an eval-loop workspace. Not for loop setup (use run-eval-loop), re-planning (use plan-campaign), or per-asset eval — single ad uses evaluate-ad, post evaluate-content, page evaluate-landing-page, short-form evaluate-shortform."
argument-hint: "[loop slug or path] [campaign name] [metric window]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "0.2.0"
  budget: standard
  estimated-cost: "$0.75-1.50"
---

# Campaign Eval — Orchestrator

Converts launched multi-channel campaign evidence into a cycle snapshot + a ledger row + a narrowly-scoped next action inside an existing eval loop. One cycle = the whole campaign across every channel. Aggregate-only — individual ads, posts, pages are scored by their own eval skills. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + 7-dim rubric + critic-override protocol: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology: [`references/playbook.md`](references/playbook.md).

**Core question:** Did this campaign cycle, across all channels, create measurable signal strong enough to keep / discard / watch / block — which channels drove it, are the unit economics honest, and what should the next strategy skill know?

## Critical Gates — load first

1. **Existing eval loop required.** If `.forsvn/loops/[slug]/program.md` and `context.md` do not exist → `NEEDS_CONTEXT`, recommend `/run-eval-loop`. This skill does not create loops.
2. **Aggregate-only campaign scope.** Scores campaign-level outcomes (reach, leads, revenue, CAC, channel breakdown) from channel-rollup metrics. Does NOT re-score individual ads, organic posts, or landing pages — those are `evaluate-ad` / `evaluate-content` / `evaluate-landing-page` / `evaluate-shortform`. Per-asset eval artifacts in the loop are cited as optional context — never re-scored, never drive the verdict. Single-asset request → `NEEDS_CONTEXT`, route to the right sibling.
3. **Measurement evidence required.** Not a generic campaign-quality audit. Require at least one metric source, measurement window, and current value for the loop's primary metric (new customers · leads · revenue · blended CAC · ROI — operator-pick-per-cycle via `program.md`).
4. **One primary metric decides the ledger row.** Secondary metrics (reach, impressions, single-channel CTR) explain diagnosis; they do not override the loop's primary metric unless `program.md` defines an explicit guardrail failure.
5. **Whole-campaign, all-channels scope.** Each cycle covers the entire campaign across every channel with a per-channel breakdown table. A campaign is NOT evaluated one channel per cycle — splitting destroys the cross-channel mix analysis that is the point of a campaign eval. Breakdown lives in Diagnosis § Channel-Mix Signals.
6. **No fabricated analytics.** Unknown values stay unknown. Manual notes only when labeled as operator-supplied and tied to a date/window/source.
7. **Attribution confidence must be explicit.** Every verdict includes sample size (spend + reach + window), baseline comparability (campaign type + channel mix + window), attribution-model honesty (last-click vs multi-touch; assisted conversions; window), confounders (seasonality, concurrent campaign, channel cannibalization, price/promo change, organic baseline drift), and confidence: `high | medium | low | blocked`.
8. **Evaluation does not generate strategy.** Recommend next changes; route actual re-planning to `plan-campaign`, ad creative to `write-ad`, organic copy to `write-social`, asset-level diagnosis to the asset-level eval skills.

## Responsibility Split

- `/run-eval-loop` owns loop setup, `program.md`, `context.md`, `results.tsv` schema, durable learning ledger.
- `/evaluate-campaign` owns post-launch campaign-level evidence snapshots for a loop cycle, scored across all channels as one aggregate.
- `/plan-campaign` owns next-cycle campaign planning after an eval identifies what should change.
- `/evaluate-ad`, `/evaluate-content`, `/evaluate-landing-page`, `/evaluate-shortform` own asset-level lanes — single ad, single post, single page, single video.

## Inputs

| Input | Required? | What it provides |
|---|---:|---|
| Loop slug or path | **required** | Locates `.forsvn/loops/[slug]/` |
| Campaign name/tag | **required** | Scopes + identifies the cycle; appears in the ledger description |
| Source plan-campaign artifact | **required** | The campaign hypothesis being scored — `.forsvn/artifacts/mkt/campaign-plan.md` |
| Measurement window | **required** | Date range for the current cycle (start + end + days) |
| Primary metric value + source | **required** | Ledger decision metric (e.g., net-new customers = 180 from CRM) |
| Channel-rollup metrics | **required** | Per-channel spend / effort / reach / leads / conversions / revenue — one row per channel |
| Total spend (fully loaded) | **required** | Denominator for honest CAC — media + production + tooling |
| Baseline or prior cycle row | required if available | Comparable campaign type + channel mix |
| Revenue + new-customer count | recommended | Revenue attribution + CAC + payback / LTV diagnosis |
| Attribution model in use | recommended | Last-click / multi-touch / data-driven — gates Attribution Honesty |
| Per-asset eval artifacts | optional | Existing per-asset cycle artifacts in the loop — CONTEXT ONLY, never re-scored |
| Guardrail metrics from `program.md` | optional | Auto-fail thresholds |

## Outputs

Primary artifact: `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`.

Side effects:

- Append one row to `.forsvn/loops/[slug]/results.tsv` with `bun scripts/append-loop-result.ts` (8-column validated helper).
- Update `.forsvn/loops/[slug]/learnings.md` ONLY for high-confidence `keep` or `discard` lessons that generalize beyond this exact campaign (critic gates promotion).
- Run `bun scripts/manifest-sync.ts` after writing.

## Pre-Dispatch

Hard-block conditions fire BEFORE Cold Start:

1. `program.md` or `context.md` absent → `NEEDS_CONTEXT`, recommend `/run-eval-loop`.
2. Thing under evaluation is a single ad / post / page / video, not a multi-channel campaign → `NEEDS_CONTEXT`, route to the asset-level sibling.
3. No measurement evidence for current cycle → `BLOCKED` with missing-evidence list.
4. Channel-rollup metrics missing for one or more channels → `BLOCKED`, ask operator for complete breakdown.
5. Custom 10+ column `results.tsv` schema → warn + flag to eval-loop owner; require hand-edit.

Read Order: `program.md` → `context.md` → `results.tsv` → latest `strategy/` + `execution/` + `evals/` files → source plan-campaign artifact → any per-asset eval artifacts in the loop (context only) → canonical artifacts (`brand/BRAND.md`, `research/product-context.md`, `research/icp-research.md`). Stale `.forsvn/index/manifest.json` → run `bun scripts/manifest-sync.ts`.

**Warm Start** (loop exists + metric evidence present + channel rollup complete): summarize loop + campaign name + primary metric + baseline/prior + latest plan-campaign artifact + current evidence window; proceed to cycle N.

**Cold Start** (loop exists but cycle context missing): ask 6 bundled questions — loop slug/path + campaign name + source plan-campaign artifact path + measurement window + primary metric value/baseline + per-channel rollup + total fully-loaded spend. If the loop itself does not exist, return `NEEDS_CONTEXT` and recommend `/run-eval-loop`.

Full Warm/Cold Start templates + hard-block conditions + Needed dimensions + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

## Quality Gate

7-dim rubric (5 shared + 2 campaign-specific). Critic FAIL → revise once; persistent FAIL → write no ledger row, return `BLOCKED`. Full rubric + Hard Fails + override protocol: [`references/agent-manifest.md`](references/agent-manifest.md). Domain rubric in [`references/rubric.md`](references/rubric.md); shared frame (pass gate, scoring scale, universal Hard Fails, falsifiability discipline) in `references/_shared/evaluation-loop-rubric.md`.

## Artifact Contract

- **Primary artifact:** `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`.
- **Side effects:** append one row to `results.tsv` via validated helper · update `learnings.md` ONLY for high-confidence keep/discard reusable lessons (critic gates) · run `manifest-sync.ts`.
- **Lifecycle:** `evaluation`.
- **Frontmatter:** 10 fields (`skill` / `version` / `date` / `status` / `summary` / `purpose` / `lifecycle` / `use_when` / `do_not_use_when` / `upstream` / `downstream`) + provenance block (`provenance.input_artifacts` lists source plan-campaign path + `brand/BRAND.md` + `research/icp-research.md`; `provenance.output_eval: null`).
- **Body:** 8 sections — Title · Verdict · Evidence (6-col table) · What Changed This Cycle · Diagnosis (Likely Drivers + Channel-Mix Signals (per-channel breakdown table) + Unit-Economics Signals + Confounders) · Next Cycle Recommendation · Results Row (8-col TSV) · Learning Promotion.
- **Campaign field:** Verdict block must name the campaign explicitly; Evidence table scopes to campaign-level aggregate signals.
- **Results Row schema:** 8 columns — `cycle` / `date` / `artifact` / `primary_metric` / `value` / `baseline` / `status` / `description`. `status` must be `keep | discard | watch | blocked` (Critic Hard Fail otherwise); description includes the campaign tag.
- **Cross-stack contract:** consumed by future campaign-eval cycles (trend analysis) + `plan-campaign --rev=N+1` (hypothesis seeding) + humans reviewing loop progress. Schema changes require atomic update across `_shared/eval-loop-spec.md` + downstream callers.

Full evaluation artifact template byte-identical + Evidence table + Channel Breakdown table + Results Row + Learning Promotion + `append-loop-result.ts` invocation: [`references/format-conventions.md`](references/format-conventions.md).

## Results Row Discipline

Append exactly one row in this shape:

```text
cycle	date	artifact	primary_metric	value	baseline	status	description
```

Rules:

- `artifact` is relative to the loop folder (e.g., `evals/2026-05-20-cycle-1.md`).
- `status` must be `keep | discard | watch | blocked`.
- `description` is one sentence without tabs (include campaign tag).
- Use the validated helper:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include campaign tag>"
```

- Do NOT append a row if Critic verdict is FAIL. Return `BLOCKED`.

## Critic Override Protocol

Operator ships despite a critic FAIL — or accepts a flagged `pass-with-concerns` — **log the override BEFORE writing the artifact or appending the ledger row**: `bun scripts/eval/log-critic-override.ts --skill evaluate-campaign …`. Feeds the shared quality system. Three overrides → rubric-revision escalation. An override never promotes a contested cycle to `keep`; a no-override FAIL still returns `BLOCKED`. Full protocol: [`references/_shared/critic-override-protocol.md`](references/_shared/critic-override-protocol.md).

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before any cycle artifact ships. Campaign-eval-specific (rider-channel contamination of the verdict, blended-CAC laundering of an underwater paid channel, missing-channel breakdown, fabricated revenue attribution, scope drift to re-planning the campaign, lane drift into asset-level eval territory, learning promotion from a seasonal/concurrent-campaign spike, killing a cycle without a comparable-campaign baseline) + 4 cross-cutting marketing-stack rows.

Most common in practice: rider-channel contamination (Critical Gate 5 + critic dim "Channel-Mix Discrimination"), blended-CAC laundering (dim "Unit-Economics Discipline" + Hard Fail #11), scope drift to plan-campaign (Critical Gate 8 + critic dim "Decision Discipline"), missing source plan-campaign artifact (Critic Hard Fail).

## Completion Status

- `DONE` — eval artifact written, ledger row appended, critic PASS.
- `DONE_WITH_CONCERNS` — artifact + row written, but confidence is low/medium or confounders are material.
- `NEEDS_CONTEXT` — missing loop, source plan-campaign artifact, campaign tag, channel rollup, or required metric evidence; OR thing under eval is a single ad/post/page/video (route to asset-level sibling).
- `BLOCKED` — contradictory data, no measurement evidence, filesystem failure, or critic failed after revision.
