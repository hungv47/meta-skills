---
name: evaluate-ad
description: "Score a launched Meta ad from real metrics (CTR, CPA, ROAS, frequency, fatigue, spend) inside an existing eval loop — verdict + diagnosis + creative-fatigue signals. One cycle per audience-temp. Meta-only at v1. Not for loop setup (use run-pipeline), writing new creative (use write-ad), channel-mix retrospectives (use plan-campaign), or campaign-level scoring (use evaluate-campaign)."
argument-hint: "[loop slug or path] [audience-temp: cold-traffic|retargeting] [metric window]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.2"
  budget: standard
  estimated-cost: "$0.75-1.50"
---

# Ad Eval — Orchestrator

<!-- BUDGET_EXCEPTION: Eval skills carry artifact-schema-as-contract (8 body sections + 8-col results row + cross-stack consumer contract) that is load-bearing and cannot move to references/. Cycle ledger discipline requires the schema be visible in the SKILL.md body. Ad-eval also surfaces the audience-temp scoping rule (one cycle = one audience-temp) and creative-fatigue signal columns. ~300 tokens over the standard cap is the legitimate cost. -->

*Evaluation skill. Converts launched Meta-ad evidence into a cycle snapshot + ledger row + narrowly-scoped next action inside an existing eval loop. One cycle = one audience-temp.*

**Core Question:** "Did this ad cycle, for this audience-temp, create measurable signal strong enough to keep / discard / watch / block — and what should the next strategy/execution skill know?"

> Why, methodology, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK]. Capability metadata (route triggers, prerequisites, load map): [`routing.yaml`](routing.yaml).

## Critical Gates

1. **Existing eval loop required.** `program.md` + `context.md` absent → `NEEDS_CONTEXT`, recommend `/run-pipeline`. This skill does not create loops.
2. **Measurement evidence required + primary metric decides the row.** Need ≥1 metric source, window, current value for the loop's primary metric (CTR / CPA / ROAS / conversion rate — operator-pick via `program.md`). Secondary metrics (frequency, fatigue indicators, qualitative) explain diagnosis; don't override unless `program.md` defines a guardrail failure (e.g., frequency > 4).
3. **One audience-temp per cycle.** Cold-traffic and retargeting evaluated in separate cycles. Mirrors write-ad's one-artifact-per-audience-temp. Mixed-audience metrics → split before ingest or return `BLOCKED`.
4. **No fabricated analytics.** Unknown stays unknown. Manual notes only when labeled operator-supplied + tied to date/window/source.
5. **Attribution confidence must be explicit.** Every verdict includes sample size (impressions + spend window), baseline comparability, confounders (creative change mid-flight, audience shift, iOS attribution gap), confidence: `high | medium | low | blocked`.
6. **Evaluation does not generate creative.** Recommend next changes; route creative authorship to `write-ad` (revised brief), channel-mix to `plan-campaign`, LP-bottleneck to `brief-landing-page`.

## Responsibility Split

`/run-pipeline` owns loop setup + `program.md` / `context.md` / `results.tsv` schema + durable learnings. **This skill** owns post-launch Meta-ad evidence snapshots for a loop cycle, scoped to a single audience-temp. `/write-ad` owns next-cycle creative.

## Inputs

**Required:** loop slug/path · audience-temp tag (`cold-traffic` OR `retargeting`) · source ad-copy artifact (`docs/forsvn/artifacts/marketing/write-ad/[audience-temp]-[date]-[slug].md`) · measurement window · primary metric value + source · spend window.

**Recommended:** baseline/prior cycle row · frequency at window close (Creative-Fatigue scoring) · conversion count + CPA · audience size + reach · guardrails from `program.md` · qualitative evidence (comments, sentiment, click-quality).

## Outputs

`.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` + append one row to `results.tsv` via `bun scripts/append-loop-result.ts` (8-col helper) + update `learnings.md` ONLY for high-confidence keep/discard reusable lessons (critic-gated) + run `bun scripts/manifest-sync.ts`.

## Agent Manifest + Dispatch

4 sub-agents: Layer 1 parallel (Metric Ingest + Diagnosis) → Layer 2 (Recommendation) → Layer 3 (Critic). Critic FAIL → revise once; still FAIL → no ledger row + `BLOCKED`. Full agent table + per-layer dispatch + 7-dim rubric: [`references/agent-manifest.md`](references/agent-manifest.md). Domain rubric: [`references/rubric.md`](references/rubric.md). Shared frame: `_shared/evaluation-loop-rubric.md`.

## Pre-Dispatch

Canonical: `_shared/pre-dispatch-protocol.md` + `_shared/eval-loop-spec.md`. **Hard-blocks (BEFORE Cold Start):** missing `program.md`/`context.md` → `NEEDS_CONTEXT` + `/run-pipeline`; no measurement evidence → `BLOCKED`; mixed-audience metrics with no clean split → `BLOCKED`; custom 10+ col `results.tsv` → warn + hand-edit. **Cold Start:** 6 bundled questions (loop · audience-temp · source ad-copy path · window · primary metric value/baseline · spend window). Full read-order + warm/cold templates + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Artifact Contract

- **Path:** `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`. **Lifecycle:** `evaluation`.
- **Frontmatter (10 fields):** `skill` / `version` / `date` / `status` / `summary` / `purpose` / `lifecycle` / `use_when` / `do_not_use_when` / `upstream` / `downstream` + provenance (`input_artifacts` = source ad-copy + `brand/BRAND.md` + `research/icp-research.md`; `output_eval: null` — eval cycles are typically terminal).
- **Body sections (8):** Title · Verdict · Evidence (6-col table) · What Changed This Cycle · Diagnosis (Likely Drivers + Confounders + Creative-Fatigue Signals) · Next Cycle Recommendation · Results Row (8-col TSV) · Learning Promotion. Verdict block must name the audience-temp (Gate 3); Evidence table scopes metrics to that audience-temp.
- **Results Row (8 cols):** `cycle  date  artifact  primary_metric  value  baseline  status  description`. `status` ∈ `keep|discard|watch|blocked` (Critic Hard Fail otherwise); description includes the audience-temp tag.
- **Cross-stack contract:** consumed by future ad-eval cycles (trend analysis) + `write-ad --rev=N+1` (hypothesis seeding) + human reviewers. Ad-eval does NOT directly consume write-ad output — sibling coordination is at the eval-loop boundary. Schema changes require atomic update across `_shared/eval-loop-spec.md` + downstream callers.

Full byte-identical template + Evidence/Results/Learning formats + helper invocation: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

## Results Row Helper

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" --value "<current>" --baseline "<baseline>" \
  --status "<keep|discard|watch|blocked>" --description "<one sentence — include audience-temp>"
```

Do not append on Critic FAIL — return `BLOCKED` instead.

## Critic Override Protocol

Operator ships despite critic FAIL — **log BEFORE writing artifact or ledger row:** `bun scripts/log-critic-override.ts --skill evaluate-ad …`. Three overrides → rubric-revision escalation. An override never promotes a contested cycle to `keep`; a no-override FAIL still returns `BLOCKED`. Full protocol: [`references/_shared/critic-override-protocol.md`](references/_shared/critic-override-protocol.md) [PROCEDURE].

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — 7 ad-eval rows + 4 cross-cutting marketing-stack. Most common: mixed-audience contamination (Gate 3 + Critic "Audience-Temp Fidelity"), confidence inflation on low-spend (Gate 5 + Critic "Attribution Honesty"), scope drift to write-ad (Gate 6 + Critic "Decision Discipline"), missing source ad-copy artifact (Critic Hard Fail).

## Worked Example

Ad-eval cold-traffic cycle (creative-fatigue keep→watch, critic PASS): [`references/examples/ad-eval-cycle-walkthrough.md`](references/examples/ad-eval-cycle-walkthrough.md).

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — eval artifact written, ledger row appended, critic PASS.
- **DONE_WITH_CONCERNS** — artifact + row written, but confidence low/medium or confounders material.
- **NEEDS_CONTEXT** — missing loop, source ad-copy artifact, audience-temp tag, or required metric evidence.
- **BLOCKED** — contradictory data, mixed-audience ingest, filesystem failure, or critic failed after revision.

## References

- `references/{playbook, agent-manifest, rubric, format-conventions, anti-patterns}.md` + `procedures/{pre-dispatch, dispatch-mechanics}.md`
- `_shared/{eval-loop-spec, evaluation-loop-rubric, pre-dispatch-protocol, critic-override-protocol, quality-dashboard-spec}.md`
- **Siblings:** `write-ad` (downstream — this skill routes recommendations TO it but does not produce briefs), `run-pipeline` (loop scaffolding + ledger schema + durable learnings), `evaluate-campaign` (multi-channel aggregate sibling)
