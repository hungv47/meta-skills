---
name: run-eval-loop
description: "Scaffolds and maintains the workspace for a measurable strategy → execution → evaluation cycle — creates `.forsvn/loops/[slug]/` with program, context, a results ledger, and learnings. Use for an improvement loop, experiment ledger, or campaign/content iteration system tied to a metric. Routes surface scoring to the matching evaluate-* skill; not a universal evaluator. Not for one-shot planning (use discover or breakdown-tasks) or multi-perspective debate (use debate-agents)."
argument-hint: "[measurable initiative name, e.g. 'pricing page conversion' or 'founder outbound sequence']"
allowed-tools: Read Write Edit Grep Glob Bash
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.20-0.80"
---

# Eval Loop — Orchestrator

*Meta process skill. Turns a measurable initiative into a domain-scoped loop workspace — strategy, execution, per-cycle eval snapshots, scored result rows, promoted learnings in one folder. Owns loop setup, ledger, and schema; routes per-cycle evaluation + scoring to the matching evaluate-* sibling skills (one scaffold, many evaluators).*

**Core Question:** "Can future agents improve this measurable surface by reading one loop folder instead of reconstructing history from scattered skill outputs?"

> Responsibility split, `results.tsv` schema, validation rules: [`references/_shared/eval-loop-spec.md`](references/_shared/eval-loop-spec.md) [SPEC].

## Critical Gates

1. **Measurable surface required.** No nameable page / campaign / post series / ad set / email sequence / outreach motion → `NEEDS_CONTEXT`, recommend `discover` (or `diagnose` if the ask is about an existing metric decline).
2. **Metric path required.** ≥1 primary metric + source (baseline may be unknown). No metric path → no loop.
3. **No skill-centered folders.** Never create `.forsvn/artifacts/{skill-name}/...`. Loops are organized by measurable initiative.
4. **Execution boundary.** May execute marketing/content assets. Does NOT deploy code, publish to platforms, build app UI, or mutate external systems.
5. **Human approval gates** publishing and live-surface changes. Borrow `autoresearch`'s keep/discard discipline, not its "run forever" posture.

## Quality Gate

Critic (Layer 2) PASS/FAIL on:

- [ ] **Usefulness** — scaffold makes a future agent measurably faster than scattered artifacts
- [ ] **Measurability** — primary metric + source + baseline shape declared (value may be pending)
- [ ] **Schema integrity** — `results.tsv` 8-column header matches what evaluate-* siblings write; per-cycle scoring rows append cleanly
- [ ] **Artifact contract** — frontmatter `lifecycle` conforms (`loop`, `loop-context`, `learning`)
- [ ] **Safety** — execution-boundary respected, mutable/frozen surface explicit, kill criteria present

FAIL → revise named sections once, re-score.

## Before Starting

| Check | Source | Why |
|---|---|---|
| Prior loop folder | `.forsvn/loops/` | Resume, don't re-scaffold |
| Prior Q&A on this surface | `.forsvn/experience/` | Don't re-ask |
| Manifest fresh | `.forsvn/index/manifest.json` | Stale → `bun scripts/manifest-sync.ts` |

Full: [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK].

## Pre-Dispatch

Warm Start template + Cold Start 6-question bundle (surface, metric source, domain, mutable, frozen, baseline window) + skill-specific entry: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE]. Canonical: [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md).

Mode: [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md). `budget: standard`; `--fast` collapses Layer 1 to single-agent + skips Critic revision on clean PASS. **`--fast` does NOT skip** the 5 Critical Gates or Cold Start.

## Agent Manifest

| Agent (`agents/*.md`) | Layer | Focus |
|---|---|---|
| Loop Architect | 1 | Loop contract: goal, surface, mutable/frozen, cycle protocol |
| Metric Designer | 1 | Primary metric, guardrails, baseline shape, attribution risks |
| Scope Guard | 2 | Execution boundary, surface fit, loop justification |
| Critic | 2 | PASS/FAIL rubric above |

## Dispatch

9-step sequence (scaffold → read state → L1 parallel → L2 sequential → revise once on FAIL → write → quality feedback → manifest-sync → return) + helpers (`scaffold-eval-loop.ts`, `append-loop-result.ts`, `update-quality-dashboard.ts` → `quality-dashboard-spec.md`) + `--fast` semantics: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Quality Feedback Protocol (promote `keep` learnings, log critic overrides, dashboard at threshold): [`references/_shared/quality-feedback-protocol.md`](references/_shared/quality-feedback-protocol.md).

## Artifact Contract

Loop folder layout:

```text
.forsvn/loops/[slug]/
├── program.md        # lifecycle: loop
├── context.md        # lifecycle: loop-context
├── strategy/         # per-cycle strategy artifacts
├── execution/        # per-cycle execution artifacts
├── evals/            # per-cycle eval snapshots (evaluate-* siblings)
├── results.tsv       # 8-column ledger; append via append-loop-result.ts
└── learnings.md      # lifecycle: learning; append-only
```

Frontmatter templates, schema, slug/re-run conventions: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE]. **Cross-stack contract:** `results.tsv` schema changes require atomic update of `_shared/eval-loop-spec.md` § "results.tsv schema" — evaluate-* siblings consume it.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

End every response with one of:

- **DONE** — loop created/resumed, contract is measurable, next step is clear
- **DONE_WITH_CONCERNS** — loop exists but metric/baseline/attribution is weak
- **NEEDS_CONTEXT** — missing measurable surface or metric source
- **BLOCKED** — filesystem/script failure or conflicting loop state

Plus: `Quality feedback: [promoted learning | kept in loop | dashboard updated | critic override logged | research eval recommended | none]`

## Next Step

After scaffold/resume: dispatch the matching strategy or brief-* skill for the cycle, then the matching evaluate-* sibling for per-cycle scoring. Each evaluate-* run appends one `results.tsv` row; `keep`-status rows promote into `learnings.md`.
