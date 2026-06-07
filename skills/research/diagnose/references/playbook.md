# Playbook — Why Diagnose Exists

> Load this when you want to teach the skill to a new operator, when you're deciding whether to run this skill at all, or when verdicts are landing on weak evidence and you need to recalibrate.

---

## Core Question

> **"What's actually causing this, and what does the evidence prove?"**

Diagnose is Strategy Step 1 of 4. It's the entry point of the strategy chain — the upstream that produces the validated root cause prioritize ranks initiatives against, that funnel-planner sets targets against, that campaign-plan plans channels around. Its single job: turn a metric gap into a defensible root cause statement, with evidence cited and gap percentages summing to ~100%.

---

## Why this skill exists at all

Three failure modes it prevents:

1. **Treating symptoms.** Without an MECE logic tree, teams chase the most visible signal ("conversion is down") and miss the actual mechanism (e.g., a tracking pixel broke, not user behavior). The tree-builder + external-check parallel scan in Layer 1 forces the operator to consider the full space — including the boring "measurement is broken" branch.
2. **Unfalsifiable hypotheses.** "Onboarding is bad" cannot be tested. The If/Then/Because format (Critical Gate 3) forces a measurable then-clause and a mechanism-naming because-clause. Hypotheses without "because" teach nothing when rejected.
3. **Premature verdicts on weak evidence.** "Confirmed: seems likely" is what passes for diagnosis in most teams. The verdict-agent + critic Gate 9 requires every Confirmed verdict to cite a specific data point that matches the "then" clause. Inconclusive is a valid verdict.

The structural answer is the **10-point quality gate** (in `agents/critic-agent.md`) — every gate maps to a specific re-dispatch agent, and PASS is binary.

---

## Philosophy

The Watanabe MECE framework underpins this skill (see `references/watanabe-framework.md`). Two-axis thinking:

- **Mutually Exclusive:** fixing one branch doesn't auto-fix another. If it does, restructure.
- **Collectively Exhaustive:** no cause is missing. Including the boring branches (measurement, external factors) catches the cases that bite.

Logic trees come in 3 shapes (see `references/logic-tree-examples.md`):

| Type | When | Example |
|---|---|---|
| **Math** | Metric decomposes by formula | MRR = Customers × ARPU; decompose each factor |
| **Issue** | Multi-factor problem with no clean formula | "Why is sales pipeline weak?" → demand, conversion, capacity, motion |
| **Yes-No** | Binary cause path | "Did the change break X?" → yes/no per surface |

Pick by problem shape. Math beats issue when a formula exists; issue beats math when factors don't compose cleanly.

---

## When NOT to use this skill

- **Code bugs.** That's `clean-code` (product-skills). Diagnose is for business and strategic problems, not stack traces.
- **Brainstorming solutions to a known problem.** That's `prioritize`. Diagnose stops at "here's the root cause"; prioritize continues with "here are the initiatives to address it."
- **Clarifying what to build / scoping an idea.** That's `discover`. Diagnose presumes a metric exists and is underperforming; if you don't yet know what the metric should be, discover first.
- **Market-level trends and competitive context.** That's `research-market`. The external-check-agent inside diagnose scans for external causes, but it doesn't size markets or profile competitors.
- **"Things aren't going well"** without numbers. Cold Start interview will refuse to dispatch without metric + current + target.

---

## The 10-point quality gate

Lives in `agents/critic-agent.md`. Summary (full criteria + failure routing in the agent file):

| # | Gate | Owned by re-dispatch |
|---|---|---|
| 1 | Problem statement has two numbers (current AND target) | orchestrator (user interview) |
| 2 | Logic tree has 2-3 levels, ≥3 leaf nodes | tree-builder-agent |
| 3 | Each leaf is a testable cause | tree-builder-agent |
| 4 | MECE: no overlaps, no gaps | tree-builder-agent |
| 5 | Every hypothesis follows If/Then/Because | hypothesis-agent |
| 6 | Every "then" names a specific metric | hypothesis-agent |
| 7 | Every hypothesis has a named data source | data-mapper-agent |
| 8 | Hypotheses ranked by testability | hypothesis-agent |
| 9 | Every hypothesis has a verdict with cited evidence | verdict-agent |
| 10 | Root cause gap percentages sum to ~100% | verdict-agent |

Plus 6 "Additional Checks" that flag in Observations but don't FAIL (see critic-agent.md). The most important one is **3-strikes escalation** — if 3+ hypotheses are Rejected with none Confirmed or Inconclusive, the verdict-agent must escalate (state "cannot be determined", recommend reframing or new data). If it forces a root cause from weak evidence instead of escalating, that triggers a FAIL.

---

## Always cold-start — why this is different

Most skills warm-start when context is resolvable. Diagnose **always** cold-starts because diagnose IS the diagnostic interview — the questions (metric / current / target / tried) ARE the work. Skipping the cold-start would mean the orchestrator hallucinated the problem statement.

The only "warm" path is a re-run after a metric shift, where the prior `DIAGNOSE.md` informs (but doesn't replace) the new run.

---

## Inconclusive is a valid verdict

The Inconclusive Handling rule (in `procedures/dispatch-mechanics.md`):

| Potential Gap Explained | Action |
|---|---|
| **>50%** (high-impact) | Must resolve before moving to prioritize |
| **10-50%** (medium-impact) | Should resolve if data available within 1 week |
| **<10%** (low-impact) | Skip — note as unexplained variance |

Designing solutions around an incomplete diagnosis is expensive. A high-impact Inconclusive verdict that explains 50%+ of the gap means the root cause statement is missing the biggest driver — downstream prioritize will rank initiatives against the wrong cause.

---

## External factors — the branch that gets skipped

Critical Gate 2 ("Do NOT skip external factors — 30%+ of problems have external causes") exists because of a recurring failure mode: teams build a logic tree of internal causes and never check whether the metric drop coincides with a competitor launch, algorithm change, seasonal shift, or regulatory event.

The external-check-agent runs in Layer 1 in parallel with the tree-builder. Six standard factors get scanned:

1. Competitor launch
2. Market/seasonal shift
3. Platform/algorithm change (Google, Meta, App Store)
4. Regulatory/policy change
5. Technology change (browser updates, deprecations)
6. Macro-economic conditions

When external factors confirm, downstream prioritize gets routed to "adapt" initiatives rather than "fix internals" initiatives — completely different shape of solution.

---

## Skill deference

| Situation | Defer to |
|---|---|
| Want to scope an idea, not diagnose a metric | `discover` (product-skills) |
| Already have a validated root cause; want initiatives | `prioritize` |
| Want market sizing / competitive landscape | `research-market` |
| Code-level bug | `clean-code` (product-skills) |

---

## When the critic returns FAIL

Max 2 rewrite cycles. The critic's report names the specific gate (1 of 10), the fix, and the agent to re-dispatch — per the Failure Routing table in `agents/critic-agent.md`.

After 2 FAIL cycles → deliver with a "Known Issues" section. Don't loop. The escape valve preserves momentum; the operator can re-run with sharper data if the critic was right.

---

## Refactor history

- **2026-05-18 (v6 Phase 2 Wave 2):** body refactored 471 → 108 lines (-77.1%, 363 lines saved — new #2 absolute reduction in v6 program after discover's 383, displacing prioritize from this slot's prior session). 5 new refs: this playbook, `procedures/pre-dispatch.md`, `procedures/dispatch-mechanics.md`, `format-conventions.md`, `examples/diagnose-walkthrough.md`, `anti-patterns.md` (newly extracted from body). Existing 2 data-catalog refs (watanabe-framework, logic-tree-examples) unchanged. 6 sub-agents (`agents/`) unchanged. Cross-stack contract preserved byte-identical: 4 Critical Gates, frontmatter, Phase 1 (Problem Statement + Logic Tree + MECE Check + External Factor Scan 6-row table), Phase 2 hypothesis format (If/Then/Because + Deciding data/Source/Owner/Confirming/Rejecting/Potential gap explained), Phase 3 Verdict Table + Root Cause Statement, Next Step block, Write-back map (Q1-Q4 to goals.md — preserved verbatim, NOT smuggled), Inconclusive Handling table.
