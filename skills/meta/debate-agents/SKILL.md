---
name: debate-agents
description: "Runs a problem through multiple expert perspectives via debate (agents argue in rounds and converge) or poll (agents analyze independently, then aggregate by consensus). Use to pressure-test a decision or trade-off with no clear winner. Standalone, or invoked by another skill as a sub-routine. Not for implementation (use architect-system) or code verification (use review-work)."
argument-hint: "[problem or decision to analyze]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
user-invocable: true
metadata:
  version: "1.0.1"
  budget: standard
  estimated-cost: "$0.15-0.50"
---

# Agent Room — Stochastic Multi-Agent Discussion

*Meta — Multi-perspective panel. Spawns expert agents with distinct stances, surfaces real tradeoffs on high-stakes decisions with no clear winner, recommends a path with reasoning. Standalone or sub-routine.*

**Core Question:** "What do multiple perspectives converge on — and where do they genuinely disagree?"

> Why this skill, methodology, principles, when NOT to use, constraint-vs-perspective assignment: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates

1. **Right mode** — debate for trade-offs; poll for filtering hallucinations / finding consensus. Default debate.
2. **Specific problem** — Cold Start before spawning if vague. Don't spawn into ambiguity.
3. **Structured output** — POSITION/REASONING/PROPOSAL/CONCERNS (debate); ranking/recommendation/binary/scoring (poll). Freeform prose can't be aggregated.
4. **Cost** — debate 3×3 ≈ $0.30-0.50; poll 10 ≈ $0.30-0.50. Default sonnet; opus ~10× and requires explicit request.

## Quality Gate

Synthesis must name real **tradeoffs** (not collapse to consensus), surface where stances **genuinely disagree**, recommend an action + reversibility cost, flag unresolved risks honestly (status → DONE_WITH_CONCERNS if no convergence). Critic auto-fails synthesis that manufactures consensus, hides outliers, or forces a tiebreaker.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK]. **Step 0 — Mode resolution:** load [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]; `standard` default; auto-downgrade ≤3-sentence single-decision → `fast` (debate 2×2 / poll 5×1). `--fast` does NOT skip structured-output or early-convergence detection. **Sub-routine invocations skip steps 1+2** — caller owns problem framing and context. No `experience/` read — each invocation is fresh.
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Pre-Dispatch

Entry points (standalone vs sub-routine), Warm/Cold Start prompts, sub-routine protocol: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Decision Tree

Mode routing keywords, debate path (A1–A4), poll path (B1–B5), config table, edge cases, costs: [`references/decision-tree.md`](references/decision-tree.md) [PROCEDURE]. Step prompts in [`references/procedures/debate.md`](references/procedures/debate.md) and [`references/procedures/poll.md`](references/procedures/poll.md).

## Artifact Contract

- **Path (standalone):** `docs/forsvn/artifacts/meta-debate-agents-[YYYY-MM-DD]-<slug>.md` (flat v2; dated; immutable per-run)
- **Path (sub-routine):** none — inline synthesis to caller
- **Lifecycle:** `decision` (audit trail; never overwritten)
- **Frontmatter:** `skill`, `produced_by`, `version`, `date`, `status`, `stack` (=meta), `review_surface` (html standalone / none sub-routine), `decision_state`, `review_tool`, `reviewed_at`, `reviewer`, `mode`, `agents`, `rounds` (debate only), `provenance`
- **Sections (debate):** Participants / Consensus / Key Disagreements / Recommended Action / Unresolved Risks / Debate Highlights
- **Sections (poll):** Consensus / Divergences / Outliers / Raw Data / High-Variance Flags
- **Consumed by:** operator (decision audit trail). No machine consumer in v1.


Full frontmatter + report bodies (debate + poll) + slug convention: [`references/report-template.md`](references/report-template.md) [PROCEDURE].

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — re-read before spawning into vague problems, claiming consensus that didn't emerge, forcing a tiebreaker, or writing a sub-routine result to disk.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — debate converged, OR poll yielded clear synthesis
- **DONE_WITH_CONCERNS** — unresolved disagreement / split; flagged under Unresolved Risks / Divergences
- **BLOCKED** — agents couldn't engage (under-specified after Cold Start, scope unclear, rounds exhausted)
- **NEEDS_CONTEXT** — needs upstream artifact (spec, ICP, architecture); sub-routine returns to caller with what's missing

## Next Step

Standalone: operator reviews dated file (Roughdraft / HTML preview), records `decision_state`. Sub-routine: integrate recommendation into caller's flow.

## Chain Position

Standalone or sub-routine. Typical sub-routine callers: `prioritize`, `architect-system`, `discover`.

## Worked Example

[`references/examples/debate-walkthrough.md`](references/examples/debate-walkthrough.md) [EXAMPLE] — 3-agent debate, mind-change, early convergence.

## References

- `references/playbook.md` [PLAYBOOK], `references/decision-tree.md` [PROCEDURE], `references/report-template.md` [PROCEDURE], `references/anti-patterns.md` [ANTI-PATTERN]
- `references/procedures/{pre-dispatch, debate, poll}.md` [PROCEDURE]
- `references/examples/debate-walkthrough.md` [EXAMPLE]
- `references/_shared/{before-starting-check, mode-resolver, pre-dispatch-protocol}.md`
