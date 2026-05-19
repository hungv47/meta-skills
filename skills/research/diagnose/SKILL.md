---
name: diagnose
description: "Structured diagnosis of business and strategic problems — builds logic trees, forms testable hypotheses, and identifies root causes with evidence. Produces `.agents/skill-artifacts/meta/records/diagnose-*.md`. Not for code bugs (use code-cleanup) or brainstorming solutions to a known problem (use prioritize). Not for clarifying what to build or scoping an idea from scratch (use discover). For market-level trends and competitive context, see market-research."
argument-hint: "[metric or problem to diagnose]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
license: MIT
metadata:
  author: hungv47
  version: "2.0.0"
  budget: deep
  estimated-cost: "$1-3"
  refactor_history:
    - refactored_at: 2026-05-18
      refactored_for: implementation-roadmap v6 Phase 2 Wave 2 (body-diet + playbook ref + chain hardening, structural root-cause-analysis skill)
      body_before: 471
      body_after: 108
      body_delta_pct: -77.1
      note: |
        Body-only line counts (frontmatter excluded). Cross-stack contract preserved
        BYTE-IDENTICAL (consumed by prioritize + funnel-planner + campaign-plan +
        system-architecture):
          - 4 Critical Gates
          - Frontmatter
          - Phase 1 (Problem Statement + Logic Tree code-fence + MECE Check +
            6-row External Factor Scan)
          - Phase 2 hypothesis format (If/Then/Because + 6 sub-fields per
            hypothesis: Deciding data / Source / Owner / Confirming / Rejecting /
            Potential gap explained)
          - Phase 3 Verdict Table 5-column schema + Root Cause Statement format
          - Next Step block (verbatim "Run `prioritize` targeting:")
          - Write-back map (Q1-Q4 to goals.md — Q1-Q3 persist, Q4 does NOT,
            preserved verbatim from original SKILL.md per anti-smuggle rule)
          - Inconclusive Handling table (3 rows)
          - Completion Status verdicts
        Agent Manifest + Route A/B semantics unchanged; mechanics extracted to ref.
        2 existing data-catalog refs (watanabe-framework, logic-tree-examples) +
        1 _shared ref (hypothesis-framework) untouched. 6 sub-agents (agents/)
        untouched — including the canonical 10-point quality gate in critic-agent.md.
        Bulk movement to refs:
          - Watanabe MECE philosophy + 3-tree-type calibration + always-cold-start
            rationale + 10-gate summary + Inconclusive valid-verdict philosophy +
            external-factor 6-factor list + when-NOT-to-use → playbook
          - Cold Start prompt (4 questions) + read order + Write-back map (verbatim)
            + staleness check + always-cold-start rationale → procedures/pre-dispatch
          - Route Selection + Layer 1/2 spawn details + merge step + Data Gathering
            Pause (interactive checkpoint) + critic FAIL routing + Inconclusive
            Handling table + 3-strikes escalation + post-write side effects + chain
            position + skill deference → procedures/dispatch-mechanics
          - Artifact Template (98 lines) + Logic Tree code-fence + Phase 1/2/3
            schemas + Next Step block + date/number/citation format →
            format-conventions
          - Worked Example (~100 lines, signup decline case) →
            examples/diagnose-walkthrough
          - Body Anti-Patterns (28 lines, 13 patterns) → anti-patterns (NEW —
            extracted + expanded with detection + bad/good examples + verified
            agent ownership against agents/critic-agent.md Failure Routing table)
promptSignals:
  phrases:
    - "root cause"
    - "why is"
    - "what went wrong"
    - "metric decline"
    - "diagnose the problem"
    - "what is causing"
  allOf:
    - [problem, diagnosis]
    - [root, cause]
  anyOf:
    - "hypothesis"
    - "logic tree"
    - "metric decline"
    - "metric drop"
    - "performance gap"
    - "diagnose"
    - "if/then/because"
  noneOf:
    - "market size"
    - "competitor analysis"
    - "what should we build"
    - "scope this"
    - "clarify requirements"
    - "i have an idea"
  minScore: 6
routing:
  intent-tags:
    - problem-diagnosis
    - root-cause
    - hypothesis-testing
    - metric-decline
    - logic-tree
  position: pipeline
  lifecycle: snapshot
  produces:
    - .agents/skill-artifacts/meta/records/diagnose-*.md
  consumes:
    - product-context.md
  requires: []
  defers-to:
    - skill: market-research
      when: "need market landscape, not root cause diagnosis"
    - skill: prioritize
      when: "already know the problem, need solutions"
  parallel-with:
    - market-research
  interactive: false
  estimated-complexity: heavy
---

# Problem Analysis — Orchestrator

*Strategy — Step 1 of 4. Defines the problem, forms testable hypotheses, and identifies root causes.*

**Core Question:** "What's actually causing this, and what does the evidence prove?"

[Read [`references/playbook.md`](references/playbook.md) [PLAYBOOK] for why this skill exists, the Watanabe MECE philosophy, 3-tree-type calibration, always-cold-start rationale, 10-gate quality summary, Inconclusive-is-valid philosophy, external-factor scan rationale, and when NOT to use.]

---

## Critical Gates — Read First

1. **Problem statement MUST be: "[Metric] is [current] instead of [target]."** No vague problems. If the user says "things aren't going well," interview for the specific metric, current value, and target value before dispatching any agent.
2. **Do NOT skip external factors — 30%+ of problems have external causes.** The external-check-agent runs in Layer 1 alongside the tree builder. Skipping it leads to treating a symptom when the cause is environmental.
3. **If/Then/Because format required — hypotheses without "because" are unfalsifiable.** The "because" clause explains the mechanism. Without it, a rejected hypothesis teaches nothing.
4. **Do NOT confirm hypotheses without evidence — "seems likely" is not Confirmed.** Every verdict must cite a specific data point that matches or contradicts the "then" clause. Inconclusive is a valid verdict.

---

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. Skill is `budget: deep`; `--fast` collapses the critic gate to a single pass within the chosen route — it does NOT auto-trigger Route A. Route A is a user-confirmation gate (operator must explicitly confirm skipping the external-factor scan per original semantics, preserving Critical Gate 2). **Cold Start STILL fires under `--fast`** (diagnose ALWAYS cold-starts — the 4 questions ARE the work; safety gates supersede mode-resolver downgrade).
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory (`.agents/skill-artifacts/meta/records/diagnose-*.md`).
2. Read `.agents/manifest.json` — find any prior `diagnose-*.md` for the same metric (re-run signal). Original SKILL.md "Re-run triggers" (metric shifts significantly, new data surfaces, prioritize initiative killed) are operator-judgment — do not auto-emit staleness warnings.
3. Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — always-cold-start contract, 4-question Cold Start prompt, read order, staleness check, Write-back map (Q1-Q4 → goals.md, verbatim from original — Q1-Q3 persist, Q4 does NOT) all there.

---

## Artifact Contract

- **Path:** `.agents/skill-artifacts/meta/records/diagnose-[YYYY-MM-DD].md` (one per metric; re-run renames prior to `diagnose.v[N].md` and increments)
- **Lifecycle:** `snapshot` (per `agent-skills/CLAUDE.md` taxonomy)
- **Frontmatter fields:** `skill`, `version` (integer, increment on re-run), `date` (ISO-8601), `status` (per Completion Status below)
- **Required body sections (in order — cross-stack contract):** Phase 1 (Problem Statement, Logic Tree, MECE Check, External Factor Scan 6-row table) · Phase 2 (Hypotheses with If/Then/Because + 6 sub-fields each) · Phase 3 (Verdict Table + Root Cause Statement) · Next Step block (full schemas in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE])
- **Optional sections (append only when applicable):** Known Issues · Change Log
- **Side effects (mandatory on PASS or done_with_concerns per `procedures/dispatch-mechanics.md`):**
  - Goals write-back per `procedures/pre-dispatch.md` Write-back map: Q1 (Metric), Q2 (Current), Q3 (Target) append to `experience/goals.md`. **Q4 (Tried) is NOT persisted** — diagnostic-specific, lives in diagnose.md snapshot only. Preserved verbatim from original SKILL.md.
  - Rename any prior `diagnose-*.md` for the same metric to `diagnose.v[N].md`
- **Consumed by:** `prioritize` (Root Cause Statement feeds Initiative hypothesis "because" clauses — hard-gated upstream); `funnel-planner` (Root Cause Statement baselines feed Target Table); `campaign-plan` (Root Cause + Verdicts filter which initiatives need channel-level execution); future `diagnose` re-runs (prior tree as context, not replacement)
- **Cross-stack OUTPUT contract:** Phase 1/2/3 schemas + Verdict Table column schema + Next Step block + Logic Tree code-fence are all load-bearing — schema changes require atomic update of consumers (per `anti-patterns.md` row "Cross-stack contract drift")

---

## Agent Manifest

| # | Agent | Layer | Focus |
|---|-------|-------|-------|
| 1 | [tree-builder-agent](agents/tree-builder-agent.md) | L1 (parallel) | MECE logic tree construction (Math/Issue/Yes-No) — 2-3 levels, ≥3 leaves |
| 2 | [external-check-agent](agents/external-check-agent.md) | L1 (parallel) | 6-factor external scan via WebSearch (competitor, market/seasonal, platform, regulatory, technology, macro-economic) |
| 3 | [hypothesis-agent](agents/hypothesis-agent.md) | L2 (sequential) | If/Then/Because hypothesis formation; ranked by testability (speed × gap explained) |
| 4 | [data-mapper-agent](agents/data-mapper-agent.md) | L2 (sequential) | Data requirement table (deciding data, source, owner, confirming, rejecting) |
| 5 | [verdict-agent](agents/verdict-agent.md) | L2 (sequential) | Evidence evaluation + root cause statement with gap percentages summing to ~100%; 3-strikes escalation if all Rejected |
| 6 | [critic-agent](agents/critic-agent.md) | L2 (final) | 10-point quality gate (full rubric + failure routing table in `agents/critic-agent.md`). Max 2 rewrite cycles |

---

## Routing + Dispatch

Two routes; chosen after Cold Start (the 4 questions always fire) and echoed in confirmation:

| Route | When | Graph |
|---|---|---|
| **B — Full Analysis** (default) | Non-trivial metric decline or strategic problem | L1 parallel (tree-builder + external-check) → merge → L2 sequential (hypothesis → data-mapper → [Data Gathering Pause] → verdict → critic) |
| **A — Quick Diagnosis** | User already provides data inline AND problem is clearly internal AND user CONFIRMS skipping external scan (per original Route A semantics — preserves Critical Gate 2) | hypothesis → data-mapper → Data Gathering Pause → verdict → critic (skip tree-builder + external-check) |

**Data Gathering Pause is NON-SKIPPABLE in both routes.** Verdicts without evidence are speculation; critic Gate 9 will FAIL.

Mechanics (Route Selection, Layer 1/2 spawn details, merge step, Data Gathering Pause handling, critic FAIL routing, Inconclusive Handling rules, 3-strikes escalation, post-write side effects, chain position, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

---

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships — 13-pattern catalog (covered by critic gates 1-10 in `agents/critic-agent.md` plus 3 Additional Checks for correlation/3-strikes/external-factors) plus 2 cross-cutting failures (cross-stack contract drift + goals write-back skipped) caught by operator review and post-write side effects respectively. Verified agent ownership against critic-agent.md Failure Routing table.

---

## Completion Status

Every run ends with explicit status:

- **DONE** — root causes traced via MECE tree, hypotheses validated against data, verdict written, critic PASS
- **DONE_WITH_CONCERNS** — root causes identified but data validation thin (small sample, estimated baselines, or inconclusive evidence); verdict notes confidence and what would strengthen it
- **BLOCKED** — metric/baseline cannot be obtained from any source (data unavailable, access denied, or measurement undefined); analysis would be speculation
- **NEEDS_CONTEXT** — problem statement missing the metric+current+target triad required for dispatch; ask the user before invoking agents

---

## References

| Reference | Load class | Use For |
|---|---|---|
| [playbook.md](references/playbook.md) | PLAYBOOK | Why this skill exists, Watanabe MECE, 3-tree-type calibration, always-cold-start rationale, 10-gate summary, Inconclusive-is-valid philosophy, external-factor 6-factor list, when NOT to use |
| [_shared/before-starting-check.md](references/_shared/before-starting-check.md) | PLAYBOOK | Pre-Pre-Dispatch read pattern (canonical at `references/`, synced) |
| [_shared/mode-resolver.md](references/_shared/mode-resolver.md) | PROCEDURE | `--fast` / `--deep` behavior contract |
| [_shared/pre-dispatch-protocol.md](references/_shared/pre-dispatch-protocol.md) | PROCEDURE | Canonical Pre-Dispatch spec |
| [_shared/hypothesis-framework.md](references/_shared/hypothesis-framework.md) | PROCEDURE | If/Then/Because structure (use Framing A — Diagnostic) |
| [procedures/pre-dispatch.md](references/procedures/pre-dispatch.md) | PROCEDURE | Always-cold-start contract, 4-question Cold Start prompt, read order, staleness check, Write-back map (Q1-Q4 → goals.md verbatim) |
| [procedures/dispatch-mechanics.md](references/procedures/dispatch-mechanics.md) | PROCEDURE | Route A/B details, Layer 1/2 spawn mechanics, merge step, Data Gathering Pause, critic FAIL routing, Inconclusive Handling, 3-strikes escalation, post-write side effects, chain position, skill deference |
| [format-conventions.md](references/format-conventions.md) | PROCEDURE | Artifact template, Logic Tree code-fence, Phase 1/2/3 schemas, Next Step block, date/number/citation format |
| [examples/diagnose-walkthrough.md](references/examples/diagnose-walkthrough.md) | EXAMPLE | Full Route B walkthrough on signup decline case (10 critic gates traced through) |
| [anti-patterns.md](references/anti-patterns.md) | ANTI-PATTERN | 13 named anti-patterns (verified agent ownership against critic-agent.md) + 2 cross-cutting failures, with detection + bad/good examples + fixes |
| [watanabe-framework.md](references/watanabe-framework.md) | data catalog | MECE principles, tree-building methodology |
| [logic-tree-examples.md](references/logic-tree-examples.md) | data catalog | 4 worked logic trees (SaaS churn, e-commerce, content ROI, B2B pipeline) |
| `research-skills/CLAUDE.md` | reference | Stack-level conventions (Pre-Dispatch Protocol, Complexity Routing, Multi-Agent Skills) |
