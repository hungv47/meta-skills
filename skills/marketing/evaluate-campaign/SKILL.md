---
name: evaluate-campaign
description: "Score a launched multi-channel campaign from real metrics inside an existing eval loop — verdict, per-channel breakdown, unit economics. Aggregate-only: one cycle = whole campaign, all channels. Requires an eval-loop workspace. Not for loop setup (use run-pipeline), re-planning (use plan-campaign), or per-asset eval — single ad uses evaluate-ad, post evaluate-content, page evaluate-landing-page, short-form evaluate-shortform."
argument-hint: "[loop slug or path] [campaign name] [metric window]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.1"
  budget: standard
  estimated-cost: "$0.75-1.50"
---

# Campaign Eval — Orchestrator

<!-- BUDGET_EXCEPTION: Eval skills carry artifact-schema-as-contract (8 body sections + 8-col results row + cross-stack consumer contract) that is load-bearing and cannot move to references/. Cycle ledger discipline requires the schema be visible in the SKILL.md body. Campaign-eval also surfaces per-channel breakdown + fully-loaded-spend + attribution-model rules (channel-mix is the point of a campaign eval). ~800 tokens over the standard cap is the legitimate cost. -->

*Evaluation skill. Converts launched multi-channel campaign evidence into a cycle snapshot + a ledger row + a narrowly-scoped next action inside an existing eval loop. One cycle = the whole campaign across every channel. Aggregate-only — single ads/posts/pages/videos route to their own eval siblings.*

**Core Question:** "Did this campaign cycle, across all channels, create measurable signal strong enough to keep / discard / watch / block — which channels drove it, are the unit economics honest, and what should the next strategy skill know?"

> Why, methodology, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK]. Capability metadata (route triggers, prerequisites, load map): [`routing.yaml`](routing.yaml).

## Critical Gates

1. **Existing eval loop required.** `program.md` + `context.md` absent → `NEEDS_CONTEXT`, recommend `/run-pipeline`. This skill does not create loops.
2. **Aggregate-only, whole-campaign scope.** Scores campaign-level outcomes from channel-rollup metrics across every channel in one cycle. Per-asset eval artifacts are context only, never re-scored, never drive the verdict. Single-asset OR one-channel-per-cycle splitting → `NEEDS_CONTEXT`, route to the sibling (`evaluate-ad` / `evaluate-content` / `evaluate-landing-page` / `evaluate-shortform`).
3. **Measurement evidence required + primary metric decides the row.** Need ≥1 metric source, window, and current value for the loop's primary metric (operator-pick via `program.md`: new customers · leads · revenue · blended CAC · ROI). Secondary metrics explain diagnosis; they don't override unless `program.md` defines an explicit guardrail failure.
4. **No fabricated analytics.** Unknown values stay unknown. Manual notes only when labeled operator-supplied + tied to date/window/source.
5. **Attribution confidence must be explicit.** Every verdict includes sample size, baseline comparability, attribution-model honesty (last-click vs multi-touch, assisted conversions, window), confounders (seasonality, concurrent campaign, channel cannibalization, price/promo, organic drift), and confidence: `high | medium | low | blocked`.
6. **Evaluation does not generate strategy.** Recommend changes; route re-planning to `plan-campaign`, ad creative to `write-ad`, organic copy to `write-social`, asset-level diagnosis to the asset eval skills.

## Responsibility Split

`/run-pipeline` owns loop setup + `program.md` / `context.md` / `results.tsv` schema + durable learnings. **This skill** owns post-launch campaign-level evidence snapshots scored across all channels as one aggregate. `/plan-campaign` owns next-cycle planning. `/evaluate-ad` / `/evaluate-content` / `/evaluate-landing-page` / `/evaluate-shortform` own asset-level lanes.

**Channel store — read-only here.** Diagnosis may **read** per-channel history for trend context — `bun scripts/query-performance.ts <channel> --json` ([`references/_shared/performance-data.md`](references/_shared/performance-data.md)). evaluate-campaign **never appends** to the channel store: post-level keyed snapshots are owned solely by `evaluate-content`'s metric-ingest agent; aggregate campaign rollups stay in the loop's `results.tsv`.

## Inputs

**Required:** loop slug/path · campaign name/tag · source plan-campaign artifact (`docs/forsvn/artifacts/marketing/campaign-plan.md`) · measurement window · primary metric value + source · per-channel rollup (spend / effort / reach / leads / conversions / revenue) · total fully-loaded spend (media + production + tooling).

**Recommended:** baseline/prior-cycle row · revenue + new-customer count · attribution model · guardrails from `program.md` · per-asset eval artifacts (CONTEXT ONLY).

## Outputs

`.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` + append one row to `results.tsv` via `bun scripts/append-loop-result.ts` (8-col helper) + update `learnings.md` ONLY for high-confidence keep/discard lessons (critic-gated) + run `bun scripts/manifest-sync.ts`.

## Agent Manifest + Dispatch

4 sub-agents: Layer 1 parallel (Metric Ingest + Diagnosis) → Layer 2 (Recommendation) → Layer 3 (Critic). Critic FAIL → revise once; still FAIL → no ledger row + `BLOCKED`. Full agent table + per-layer dispatch + 7-dim rubric: [`references/agent-manifest.md`](references/agent-manifest.md). Domain rubric: [`references/rubric.md`](references/rubric.md). Shared frame: `_shared/evaluation-loop-rubric.md`.

## Pre-Dispatch

Canonical: `_shared/pre-dispatch-protocol.md` + `_shared/eval-loop-spec.md`. **Hard-blocks (BEFORE Cold Start):** missing `program.md`/`context.md` → `NEEDS_CONTEXT` + `/run-pipeline`; single-asset under eval → route to sibling; no measurement evidence OR incomplete channel rollup → `BLOCKED`; custom 10+ col `results.tsv` → warn + hand-edit. **Cold Start:** 6 bundled questions (loop · campaign name · source plan path · window · primary metric value/baseline · per-channel rollup + fully-loaded spend). Full read-order + templates + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Artifact Contract

- **Path:** `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`. **Lifecycle:** `evaluation`.
- **Frontmatter (10 fields):** `skill` / `version` / `date` / `status` / `summary` / `purpose` / `lifecycle` / `use_when` / `do_not_use_when` / `upstream` / `downstream` + provenance (`input_artifacts` = source plan-campaign + `brand/BRAND.md` + `research/icp-research.md`; `output_eval: null`).
- **Body sections (8):** Title · Verdict · Evidence (6-col table) · What Changed This Cycle · Diagnosis (Likely Drivers + Channel-Mix Signals (per-channel breakdown table) + Unit-Economics Signals + Confounders) · Next Cycle Recommendation · Results Row (8-col TSV) · Learning Promotion. Verdict block must name the campaign; Evidence table scopes to campaign-level aggregate signals.
- **Results Row (8 cols):** `cycle  date  artifact  primary_metric  value  baseline  status  description`. `status` ∈ `keep|discard|watch|blocked` (Critic Hard Fail otherwise); description includes the campaign tag.
- **Cross-stack contract:** consumed by future campaign-eval cycles (trend analysis) + `plan-campaign --rev=N+1` (hypothesis seeding) + human reviewers. Schema changes require atomic update across `_shared/eval-loop-spec.md` + downstream callers.

Full template + Evidence/Channel-Breakdown/Results/Learning formats + helper invocation: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

## Results Row Helper

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" --value "<current>" --baseline "<baseline>" \
  --status "<keep|discard|watch|blocked>" --description "<one sentence — include campaign tag>"
```

Do not append on Critic FAIL — return `BLOCKED` instead.

## Critic Override Protocol

Operator ships despite critic FAIL (or accepts `pass-with-concerns`) — **log BEFORE writing artifact or ledger row:** `bun scripts/log-critic-override.ts --skill evaluate-campaign …`. Three overrides → rubric-revision escalation. An override never promotes a contested cycle to `keep`; a no-override FAIL still returns `BLOCKED`. Full protocol: [`references/_shared/critic-override-protocol.md`](references/_shared/critic-override-protocol.md) [PROCEDURE].

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — 8 campaign-eval rows + 4 cross-cutting marketing-stack rows. Most common: rider-channel contamination (Gate 2 + Critic "Channel-Mix Discrimination"), blended-CAC laundering (Critic "Unit-Economics Discipline" + Hard Fail #11), scope drift to plan-campaign (Gate 6 + Critic "Decision Discipline"), missing source plan-campaign artifact (Critic Hard Fail).

## Worked Example

Multi-channel campaign cycle (per-channel breakdown, blended CAC, fully-loaded spend, critic PASS_WITH_CONCERNS): [`references/examples/campaign-eval-cycle-walkthrough.md`](references/examples/campaign-eval-cycle-walkthrough.md).

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — eval artifact written, ledger row appended, critic PASS.
- **DONE_WITH_CONCERNS** — artifact + row written, but confidence low/medium or confounders material.
- **NEEDS_CONTEXT** — missing loop, source plan-campaign artifact, campaign tag, channel rollup, or required metric evidence; OR thing under eval is a single ad/post/page/video (route to asset-level sibling).
- **BLOCKED** — contradictory data, no measurement evidence, filesystem failure, or critic failed after revision.

## References

- `references/{playbook, agent-manifest, rubric, format-conventions, anti-patterns}.md` + `procedures/{pre-dispatch, dispatch-mechanics}.md`
- `_shared/{eval-loop-spec, evaluation-loop-rubric, pre-dispatch-protocol, critic-override-protocol, quality-dashboard-spec}.md`
- **Siblings:** `plan-campaign` (downstream), `run-pipeline` (loop scaffolding), `evaluate-{ad, content, landing-page, shortform}` (asset lanes)
