---
name: evaluate-landing-page
description: "Scores a launched landing page from real performance evidence inside an existing eval loop — writes a cycle eval snapshot and appends the loop results ledger. Use for post-launch CRO cycles backed by analytics, experiment results, recordings, form-funnel data, or qualified manual metric notes. Not for designing the next page brief or a redesign (use brief-landing-page), channel strategy (use plan-campaign), best-practice audits without evidence, or scaffolding the loop (use run-pipeline)."
argument-hint: "[loop slug or path] [page URL/route] [metric window]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.1"
  budget: standard
  estimated-cost: "$0.75-1.50"
---

# Landing Page Eval — Orchestrator

<!-- BUDGET_EXCEPTION: Eval skills carry artifact-schema-as-contract (8 body sections + 8-col results row + cross-stack consumer contract) that is load-bearing and cannot move to references/. Cycle ledger discipline requires the schema be visible in the SKILL.md body. ~300 tokens over the standard cap is the legitimate cost. -->

*Evaluation skill. Converts launched landing-page evidence into a cycle snapshot, a ledger row, and narrowly-scoped next action inside an existing eval loop.*

**Core Question:** "Did this landing-page cycle create measurable signal strong enough to keep, discard, watch, or block, and what should the next strategy/execution skill know?"

> Why, philosophy, methodology, when NOT to use, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates

1. **Existing eval loop required.** If `.forsvn/loops/[slug]/program.md` + `context.md` absent → `NEEDS_CONTEXT`, recommend `/run-pipeline`. This skill does not create loops.
2. **Measurement evidence required.** Not a generic heuristic audit. Require ≥1 metric source, measurement window, and current value for the loop's primary metric.
3. **One primary metric decides the ledger row.** Secondary metrics and qualitative evidence explain diagnosis; they do not override the primary metric unless `program.md` defines an explicit guardrail failure.
4. **No fabricated analytics.** Unknown values stay unknown. Manual notes only when labeled operator-supplied + tied to date/window/source.
5. **Attribution confidence must be explicit.** Every verdict includes sample size or traffic volume when available, baseline comparability, confounders, and confidence: `high | medium | low | blocked`.
6. **Evaluation does not redesign.** Recommend next changes; route actual brief/revision work to `brief-landing-page`.

## Responsibility Split

`/run-pipeline` owns loop setup, `program.md`, `context.md`, `results.tsv` schema, durable learning ledger. **This skill** owns post-launch landing-page evidence snapshots for a loop cycle. `/brief-landing-page` owns new-page and redesign briefs after an eval identifies what should change.

## Inputs

**Required:** loop slug/path · page URL/route · measurement window · primary metric value + source.

**Recommended/optional:** baseline or prior cycle row · traffic/sample size · guardrail metrics (bounce, form completion, qualified lead rate, revenue, page speed, spend efficiency) · experiment notes (variant split, assignment, test integrity) · qualitative evidence (heatmaps, recordings, comments, sales notes) · strategy/execution artifacts (what was changed).

## Outputs

Primary artifact: `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`.

Side effects: append one row to `.forsvn/loops/[slug]/results.tsv` via `scripts/append-loop-result.ts`; update `learnings.md` ONLY for high-confidence keep/discard reusable lessons (critic-gated); run `manifest-sync.ts`.

## Agent Manifest + Dispatch

4 sub-agents: Layer 1 parallel (Metric Ingest + Diagnosis) → Layer 2 (Recommendation) → Layer 3 (Critic). Critic FAIL → revise once; still FAIL → no ledger row + return `BLOCKED`. Cycle number = `last results.tsv cycle + 1` unless operator names a cycle that has no existing eval artifact. Full per-agent focus + per-layer dispatch tables + critic revision-cycle semantics + side-effects ALL-OR-NOTHING on FAIL: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE].

## Pre-Dispatch

Canonical: `references/_shared/pre-dispatch-protocol.md` + `_shared/eval-loop-spec.md`. **Hard-blocks:** missing `program.md`/`context.md` → NEEDS_CONTEXT + recommend `/run-pipeline`; no measurement evidence → BLOCKED; custom 10+ col `results.tsv` → warn + require hand-edit. **Cold Start:** 5 bundled questions (loop slug · page URL · window · primary metric value/baseline · what changed). Full read-order + warm/cold templates + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Artifact Contract

- **Path:** `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`. **Lifecycle:** `evaluation`.
- **Body sections (8):** Title · Verdict · Evidence (6-col table) · What Changed · Diagnosis · Next Cycle Recommendation · Results Row · Learning Promotion.
- **Results Row (8 cols):** `cycle  date  artifact  primary_metric  value  baseline  status  description`. `status` ∈ `keep|discard|watch|blocked` (Critic Hard Fail #6 otherwise).
- **Cross-stack contract:** consumed by future lp-eval cycles, `brief-landing-page --rev=N+1`, human loop reviewers. Schema changes require atomic update across `_shared/eval-loop-spec.md` + downstream callers.

Full byte-identical template + frontmatter spec + Evidence/Results/Learning formats + custom-schema limitation: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

## Results Row Helper

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" --value "<current>" --baseline "<baseline>" \
  --status "<keep|discard|watch|blocked>" --description "<one sentence>"
```

Do not append on Critic FAIL — return `BLOCKED` instead.

## Critic Override Protocol

When operator ships a cycle despite critic FAIL — **log the override BEFORE writing artifact or ledger row:** `bun scripts/log-critic-override.ts --skill evaluate-landing-page …`. Full protocol (invocation, 3-override escalation, two rules an override never relaxes): [`references/_shared/critic-override-protocol.md`](references/_shared/critic-override-protocol.md) [PROCEDURE].

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — 10 lp-eval patterns + 4 cross-cutting marketing-stack rows. Most common: scope drift to redesign (Gate 6 + Critic "Boundary Control"), confidence inflation (Gate 5 + Critic "Attribution Honesty"), low-confidence learning promotion (Critic Hard Fail #7), missing primary metric source-window (Critic Hard Fail #2).

## Worked Example

Landing-page CRO cycle (section-level bottleneck diagnosis from conversion evidence, critic PASS): [`references/examples/landing-page-eval-cycle-walkthrough.md`](references/examples/landing-page-eval-cycle-walkthrough.md).

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — eval artifact written, ledger row appended, critic passed
- **DONE_WITH_CONCERNS** — artifact + row written, but confidence low/medium or confounders material
- **NEEDS_CONTEXT** — missing loop or required metric evidence
- **BLOCKED** — contradictory data, filesystem failure, or critic failed after revision

## References

- `references/playbook.md`, `format-conventions.md`, `anti-patterns.md`
- `references/procedures/{pre-dispatch, dispatch-mechanics}.md`
- `references/_shared/{eval-loop-spec, before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol, anti-sycophancy, artifact-contract-template, thin-critic-rubric, critic-override-protocol}.md`
- `references/_shared/execution-policy.md` — session execution profile (single-vs-multi)
- 4 sub-agents in `agents/`; `critic-agent.md` holds the 6-dimension 0-10 rubric (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Boundary Control / Ledger Correctness) + 4-tier Verdict + 7 Hard Fails
- **Sibling coordination:** `brief-landing-page` (this skill routes recommendations TO it but does not produce briefs); `run-pipeline` (owns loop scaffolding + ledger schema + durable learnings)
