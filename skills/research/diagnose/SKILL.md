---
name: diagnose
description: "Structured diagnosis of business and strategic problems — builds MECE logic trees, forms testable If/Then/Because hypotheses, scans external factors, and identifies root causes with evidence. Use when a metric is underperforming, something went wrong, or you need to find what's causing a problem before acting. Not for code bugs (use clean-code), brainstorming solutions to a known problem (use prioritize), or scoping a new idea (use discover); for market trends, see research-market."
argument-hint: "[metric or problem to diagnose]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$1-3"
---

# Problem Analysis — Orchestrator

*Strategy — Step 1 of 4. Defines the business problem, builds falsifiable reasoning via testable hypotheses, and identifies root-cause with evidence-backed tests.*

**Core Question:** "What's actually causing this, and what does the evidence prove?"

> Why this skill exists, Watanabe MECE philosophy, 3-tree-type calibration, always-cold-start rationale, 10-gate quality summary, Inconclusive-is-valid philosophy, external-factor 6-factor rationale, when NOT to use: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

---

## Critical Gates — Read First

1. **Problem statement MUST be: "[Metric] is [current] instead of [target]."** No vague business problems. If the user says "things aren't going well," interview for the specific metric, current value, and target value before dispatching any agent.
2. **Do NOT skip external factors — 30%+ of problems have external root-causes.** The external-check-agent runs in Layer 1 alongside the tree builder. Skipping it leads to treating a symptom when the cause is environmental.
3. **If/Then/Because format required — hypotheses without "because" are unfalsifiable.** The "because" clause is the reasoning mechanism. Without it, a rejected hypothesis teaches nothing and the tests prove nothing.
4. **Do NOT confirm hypotheses without evidence — "seems likely" is not Confirmed.** Every verdict must cite a specific data point that matches or contradicts the "then" clause. Inconclusive is a valid verdict. **When multiple causes changed in the same window, a matching timeline is correlation, not confirmation:** a Confirmed verdict must cite evidence that DISCRIMINATES it from the co-timed alternatives (an A/B null, a per-capita/per-segment normalization, a same-segment-flat reading), and must rule out a **composition/mix-shift** artifact (every segment flat but the blended metric moved → the cause is the mix, not any within-segment factor). No discriminating evidence → Inconclusive. Never distribute the gap across un-discriminated candidates or invent a cause to reach ~100%.

---

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK], then run the diagnose-specific pre-flight per [`references/procedures/before-starting.md`](references/procedures/before-starting.md) [PROCEDURE] — mode resolution (Cold Start STILL fires under `--fast`), canonical-path check, prior-run staleness signal, then Pre-Dispatch entry.

Pre-Dispatch detail (always-cold-start contract, 4-question Cold Start prompt, read order, Write-back map Q1-Q4 → goals.md verbatim): [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

---

## Artifact Contract

- **Path:** `docs/forsvn/canonical/research/DIAGNOSE.md` (canonical singleton — the current diagnosis of record; re-run overwrites in place and bumps `version`. Prior runs live in git history, NOT as concurrent files.)
- **Lifecycle:** `canonical`; `type: canonical`; `review_surface: none`; `decision_state: not_required` (diagnose stays un-gated)
- **Frontmatter:** `skill`, `version` (integer, increment on re-run), `date`, `status`, `stack: research`, `review_surface: none`, `id: diagnose`, `type: canonical`, `keywords: [diagnose, root-cause, hypothesis-tree, metric-decline, if-then-because]`. Schema in [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md).
- **Required body sections (cross-stack contract — load-bearing):** Phase 1 (Problem Statement, Logic Tree, MECE Check, External Factor Scan 6-row table) · Phase 2 (Hypotheses with If/Then/Because + 6 sub-fields each) · Phase 3 (Verdict Table + Root Cause Statement) · Next Step block. Full schemas + Logic Tree code-fence + Verdict Table columns in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE]. Optional: Known Issues · Change Log.
- **Side effects (mandatory on PASS / done_with_concerns):** Goals write-back (Q1 Metric, Q2 Current, Q3 Target append to `experience/goals.md`; **Q4 Tried NOT persisted** — lives in the canonical record only). Re-run overwrites `DIAGNOSE.md` in place and bumps `version`; no `.v[N].md` siblings. Mechanics: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).
- **Consumed by:** `prioritize` (Root Cause feeds Initiative "because" clauses — recommended input, not a hard gate); `plan-funnel` (Root Cause baselines feed Target Table); `plan-campaign` (Root Cause + Verdicts filter channel-level execution); future `diagnose` re-runs (prior tree as context).
- **Cross-stack contract:** Phase 1/2/3 schemas + Verdict Table columns + Next Step block + Logic Tree code-fence — schema changes require atomic consumer update (see `anti-patterns.md` "Cross-stack contract drift").

---

## Agent Manifest

| # | Agent | Layer | Focus |
|---|-------|-------|-------|
| 1 | [tree-builder-agent](agents/tree-builder-agent.md) | L1 (parallel) | MECE logic tree (Math/Issue/Yes-No) — 2-3 levels, ≥3 leaves |
| 2 | [external-check-agent](agents/external-check-agent.md) | L1 (parallel) | 6-factor external scan via WebSearch (competitor, market/seasonal, platform, regulatory, technology, macro) |
| 3 | [hypothesis-agent](agents/hypothesis-agent.md) | L2 (sequential) | If/Then/Because formation; ranked by testability (speed × gap explained) |
| 4 | [data-mapper-agent](agents/data-mapper-agent.md) | L2 (sequential) | Data requirement table (deciding data, source, owner, confirming, rejecting) |
| 5 | [verdict-agent](agents/verdict-agent.md) | L2 (sequential) | Evidence evaluation + root cause statement with gap %s summing to ~100%; 3-strikes escalation |
| 6 | [critic-agent](agents/critic-agent.md) | L2 (final) | 10-point quality gate (rubric + failure routing in `agents/critic-agent.md`). Max 2 rewrite cycles |

---

## Routing + Dispatch

Two routes; chosen after Cold Start (the 4 questions always fire) and echoed in confirmation:

| Route | When | Graph |
|---|---|---|
| **B — Full Analysis** (default) | Non-trivial metric decline or strategic problem | L1 parallel (tree-builder + external-check) → merge → L2 sequential (hypothesis → data-mapper → [Data Gathering Pause] → verdict → critic) |
| **A — Quick Diagnosis** | User provides data inline AND problem clearly internal AND user CONFIRMS skipping external scan (preserves Critical Gate 2) | hypothesis → data-mapper → Data Gathering Pause → verdict → critic |

**Data Gathering Pause is NON-SKIPPABLE in both routes.** Verdicts without evidence are speculation; critic Gate 9 will FAIL.

Mechanics (Route Selection, Layer 1/2 spawn, merge, Pause handling, critic FAIL routing, Inconclusive Handling, 3-strikes escalation, post-write side effects, chain position, skill deference): [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — 13-pattern catalog (covered by critic gates 1-10 in `agents/critic-agent.md` plus 3 Additional Checks for correlation/3-strikes/external-factors) + 2 cross-cutting failures (cross-stack contract drift + goals write-back skipped). Re-read before any output ships.

---

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

Every run ends with explicit status:

- **DONE** — root causes traced via MECE tree, hypotheses validated against data, verdict written, critic PASS
- **DONE_WITH_CONCERNS** — root causes identified but data validation thin (small sample, estimated baselines, or inconclusive evidence); verdict notes confidence and what would strengthen it
- **BLOCKED** — metric/baseline cannot be obtained from any source (data unavailable, access denied, or measurement undefined); analysis would be speculation
- **NEEDS_CONTEXT** — problem statement missing the metric+current+target triad required for dispatch; ask the user before invoking agents

## Next Step

After verdict + root cause ship: hand to `prioritize` for initiative selection (Root Cause Statement is a recommended input, not a hard gate). For metric-tracking initiatives, also feed `plan-funnel` baselines. Re-run `diagnose` when the metric shifts significantly or new data surfaces (operator-judgment, not auto-flagged).

---

## References

- `references/playbook.md` [PLAYBOOK] — philosophy, 3-tree calibration, when NOT to use
- `references/format-conventions.md` [PROCEDURE] — artifact template, Phase 1/2/3 schemas, Logic Tree code-fence, Next Step block
- `references/anti-patterns.md` [ANTI-PATTERN] — 13 patterns + 2 cross-cutting failures
- `references/procedures/{before-starting, pre-dispatch, dispatch-mechanics}.md` [PROCEDURE] — pre-flight, Cold Start, routes, Pause handling
- `references/_shared/{before-starting-check, mode-resolver, pre-dispatch-protocol, hypothesis-framework, artifact-contract-template}.md`
- `references/_shared/execution-policy.md` — session execution profile (single-vs-multi)
- `references/examples/diagnose-walkthrough.md` [EXAMPLE] — full Route B walkthrough on signup decline (10 critic gates traced)
- `references/{watanabe-framework, logic-tree-examples}.md` — MECE methodology + 4 worked trees (SaaS churn, e-commerce, content ROI, B2B pipeline)
- `research-skills/CLAUDE.md` — stack-level conventions
