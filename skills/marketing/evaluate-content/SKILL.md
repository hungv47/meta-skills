---
name: evaluate-content
description: "Score a published organic post (text / image / carousel) from real metrics inside an existing eval loop — one primary platform per cycle, verdict + engagement-quality diagnosis. Not for short-form video (use evaluate-shortform), paid-ad performance (use evaluate-ad), writing next-cycle copy (use write-social), or scaffolding the loop (use run-pipeline)."
argument-hint: "[loop slug or path] [primary-platform] [metric window]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.1"
  budget: standard
  estimated-cost: "$0.75-1.50"
---

# Content Eval — Orchestrator

<!-- BUDGET_EXCEPTION: Eval skills carry artifact-schema-as-contract (8 body sections + 8-col results row + cross-stack consumer contract) that is load-bearing and cannot move to references/. Content-eval also surfaces primary-platform scoping + engagement-quality discrimination rules (which are the point of an organic-content eval). Cycle ledger discipline requires the schema be visible in the SKILL.md body. ~800 tokens over the standard cap is the legitimate cost (matches evaluate-campaign sibling). -->

*Evaluation skill. Converts published organic-content evidence into a cycle snapshot + ledger row + narrowly-scoped next action inside an existing eval loop. One primary platform per cycle; secondary platforms are context only.*

**Core Question:** "Did this content cycle, on its primary platform, create measurable signal strong enough to keep / discard / watch / block — and what should the next strategy/execution skill know?"

> Why, methodology, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK]. Capability metadata (route triggers, prerequisites, load map): [`routing.yaml`](routing.yaml).

## Critical Gates

1. **Existing eval loop required.** `program.md` + `context.md` absent → `NEEDS_CONTEXT`, recommend `/run-pipeline`. This skill does not create loops.
2. **Organic non-video content only.** Text / image / carousel posts. Short-form video → `evaluate-shortform`; paid-ad → `evaluate-ad`. Otherwise → `NEEDS_CONTEXT`, route to sibling.
3. **Measurement evidence + primary metric decides the row.** Need ≥1 metric source, window, and current value for the loop's primary metric (engagement rate · save rate · CTR · conversion rate — operator-pick via `program.md`). Secondary metrics explain diagnosis; they don't override unless `program.md` defines a guardrail failure.
4. **One primary platform per cycle.** Secondary platforms live in `Cross-Platform Context` subsection — they inform diagnosis but DO NOT drive the verdict. A 9-platform campaign = 9 separate cycles, one primary platform each.
5. **No fabricated analytics.** Unknown values stay unknown. Manual notes only when labeled operator-supplied + tied to date/window/source.
6. **Attribution confidence must be explicit.** Every verdict includes sample size (impressions/reach + window), baseline comparability (same platform, same content type, comparable window), confounders (algorithm change, posting-time shift, follower-count change, cross-post cannibalization), and confidence: `high | medium | low | blocked`.
7. **Evaluation does not generate content.** Recommend changes; route copy authorship to `write-social`, distribution to `publish-social`, visual assets to `produce-asset`.

## Responsibility Split

`/run-pipeline` owns loop setup + `program.md` / `context.md` / `results.tsv` schema + durable learnings. **This skill** owns post-publish organic-content evidence snapshots scored against one primary platform. `/write-social` owns next-cycle copy. `/evaluate-shortform` + `/evaluate-ad` own their lanes.

**Channel store — single write direction.** This skill's **metric-ingest agent is the sole writer** of the cross-initiative channel store (fully-keyed Metric Packets → `.forsvn/performance/<platform>.tsv` + ledger advance; see the agent's Channel Store Append step). Diagnosis may **read** it for trend context — `bun scripts/query-performance.ts <platform> --json` ([`references/_shared/performance-data.md`](references/_shared/performance-data.md)) — but never opens a second append path.

## Inputs

**Required:** loop slug/path · primary-platform tag (`linkedin` · `instagram` · `x` · `facebook` · `threads`) · source write-social artifact (`docs/forsvn/artifacts/marketing/copy/[platform]-[date]-[slug].md`) · measurement window · primary metric value + source · reach/impressions (sample-size floor).

**Recommended:** baseline/prior-cycle row · engagement breakdown (likes/saves/shares/comments split — drives Engagement-Quality dim) · click-through + conversion · qualitative evidence (comment sentiment, replies, DMs — honest, not fabricated) · secondary-platform headline metrics (Cross-Platform Context) · guardrails from `program.md`.

## Outputs

`.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` + append one row to `results.tsv` via `bun scripts/append-loop-result.ts` (8-col helper) + update `learnings.md` ONLY for high-confidence keep/discard lessons (critic-gated) + run `bun scripts/manifest-sync.ts`.

## Agent Manifest + Dispatch

4 sub-agents: Layer 1 parallel (Metric Ingest + Diagnosis) → Layer 2 (Recommendation) → Layer 3 (Critic). Critic FAIL → revise once; still FAIL → no ledger row + `BLOCKED`. Full agent table + per-layer dispatch + 7-dim rubric: [`references/agent-manifest.md`](references/agent-manifest.md). Domain rubric: [`references/rubric.md`](references/rubric.md). Shared frame: `_shared/evaluation-loop-rubric.md`.

## Pre-Dispatch

Canonical: `_shared/pre-dispatch-protocol.md` + `_shared/eval-loop-spec.md`. **Hard-blocks (BEFORE Cold Start):** missing `program.md`/`context.md` → `NEEDS_CONTEXT` + `/run-pipeline`; content is short-form video → route to `evaluate-shortform`; no measurement evidence OR missing primary-platform tag → `BLOCKED`; custom 10+ col `results.tsv` → warn + hand-edit. **Cold Start:** 6 bundled questions (loop · primary platform · source write-social artifact path · window · primary metric value/baseline · reach). Full read-order + templates + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Artifact Contract

- **Path:** `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`. **Lifecycle:** `evaluation`.
- **Frontmatter (10 fields):** `skill` / `version` / `date` / `status` / `summary` / `purpose` / `lifecycle` / `use_when` / `do_not_use_when` / `upstream` / `downstream` + provenance (`input_artifacts` = source write-social + `brand/BRAND.md` + `research/icp-research.md`; `output_eval: null`).
- **Body sections (8):** Title · Verdict · Evidence (6-col table) · What Changed This Cycle · Diagnosis (Likely Drivers + Engagement-Quality Signals + Cross-Platform Context + Confounders) · Next Cycle Recommendation · Results Row (8-col TSV) · Learning Promotion. Verdict block must name the primary platform explicitly (Gate 4); Evidence table scopes metrics to that platform.
- **Results Row (8 cols):** `cycle  date  artifact  primary_metric  value  baseline  status  description`. `status` ∈ `keep|discard|watch|blocked` (Critic Hard Fail otherwise); description includes the primary-platform tag.
- **Cross-stack contract:** consumed by future content-eval cycles (trend analysis) + `write-social --rev=N+1` (hypothesis seeding) + human reviewers. Schema changes require atomic update across `_shared/eval-loop-spec.md` + downstream callers.

Full template + Evidence/Engagement-Quality/Results/Learning formats + helper invocation: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

## Results Row Helper

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" --value "<current>" --baseline "<baseline>" \
  --status "<keep|discard|watch|blocked>" --description "<one sentence — include primary-platform>"
```

Do not append on Critic FAIL — return `BLOCKED` instead.

## Critic Override Protocol

Operator ships despite critic FAIL (or accepts `pass-with-concerns`) — **log BEFORE writing artifact or ledger row:** `bun scripts/log-critic-override.ts --skill evaluate-content …`. Three overrides → rubric-revision escalation. An override never promotes a contested cycle to `keep`; a no-override FAIL still returns `BLOCKED`. Full protocol: [`references/_shared/critic-override-protocol.md`](references/_shared/critic-override-protocol.md) [PROCEDURE].

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — content-eval rows + 4 cross-cutting marketing-stack rows. Most common: vanity-metric inflation (Gate 3 + Critic "Engagement-Quality Discrimination"), cross-platform contamination of the verdict (Gate 4 + Critic "Platform-Fit"), scope drift to write-social (Gate 7 + Critic "Decision Discipline"), missing source write-social artifact (Critic Hard Fail).

## Worked Example

Organic content cycle (engagement-quality vs vanity, algorithm-spike → watch, critic PASS): [`references/examples/content-eval-cycle-walkthrough.md`](references/examples/content-eval-cycle-walkthrough.md).

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — eval artifact written, ledger row appended, critic PASS.
- **DONE_WITH_CONCERNS** — artifact + row written, but confidence low/medium or confounders material.
- **NEEDS_CONTEXT** — missing loop, source write-social artifact, primary-platform tag, or required metric evidence; OR content is short-form video / paid ad (route to right sibling).
- **BLOCKED** — contradictory data, no measurement evidence, filesystem failure, or critic failed after revision.

## References

- `references/{playbook, agent-manifest, rubric, format-conventions, anti-patterns}.md` + `procedures/{pre-dispatch, dispatch-mechanics}.md`
- `_shared/{eval-loop-spec, evaluation-loop-rubric, pre-dispatch-protocol, critic-override-protocol, quality-dashboard-spec}.md`
- **Siblings:** `write-social` (downstream), `run-pipeline` (loop scaffolding), `evaluate-{ad, shortform, landing-page, campaign}` (sibling lanes)
