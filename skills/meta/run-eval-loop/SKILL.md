---
name: run-eval-loop
description: "Scaffolds and maintains the workspace for a measurable strategy → execution → evaluation cycle — creates `.forsvn/loops/[slug]/` with program, context, a results ledger, and learnings. Use for an improvement loop, experiment ledger, or campaign/content iteration system tied to a metric. Routes surface scoring to the matching evaluate-* skill; not a universal evaluator. Not for one-shot planning (use discover or breakdown-tasks) or multi-perspective debate (use debate-panel)."
argument-hint: "[measurable initiative name, e.g. 'pricing page conversion' or 'founder outbound sequence']"
allowed-tools: Read Write Edit Grep Glob Bash
metadata:
  version: "0.1.0"
  budget: standard
  estimated-cost: "$0.20-0.80"
---

# Eval Loop — Orchestrator

*Meta process skill. Turns a measurable initiative into a domain-scoped loop workspace where strategy artifacts, execution artifacts, eval snapshots, result rows, and promoted learnings live together.*

**Core Question:** "Can future agents improve this measurable surface by reading one loop folder instead of reconstructing history from scattered skill outputs?"

## Critical Gates

1. **Measurable surface required.** If the user cannot name a page, campaign, post series, ad set, email sequence, outreach motion, or other observable surface, return `NEEDS_CONTEXT` and recommend `discover`.
2. **Metric path required.** The loop must name at least one primary metric and where it will come from, even if the baseline is not known yet. No metric path -> no loop.
3. **No skill-centered folders.** Do not create `.forsvn/artifacts/{skill-name}/...`. Eval loops are organized by measurable initiative.
4. **Execution boundary.** This stack may execute marketing/content assets. It does not deploy code, publish to platforms, build app UI, or mutate external systems.
5. **No unattended infinite marketing loops.** Borrow `autoresearch`'s ledger and keep/discard discipline, not its "run forever" posture. Human approval gates publishing and live-surface changes.

## Reference

Read before writing or modifying any loop artifact:

- `references/_shared/eval-loop-spec.md`
- `references/_shared/quality-feedback-protocol.md`
- `references/_shared/quality-dashboard-spec.md`

## Responsibility Split

`run-eval-loop` is the sole scaffold/ledger skill: creates/resumes the loop folder, defines the measurable surface + metric contract + mutable surface + guardrails, owns `program.md`, `context.md`, `results.tsv`, `learnings.md`, and routes to the right surface evaluator. Full split (one-scaffold-many-evaluators table, evaluator boundaries) in `references/_shared/eval-loop-spec.md` § "One Scaffold, Many Evaluators".

## Output

Create or resume:

```text
.forsvn/loops/[slug]/
├── program.md
├── context.md
├── strategy/
├── execution/
├── evals/
├── results.tsv
└── learnings.md
```

Helpers (full flags + validation rules in `references/_shared/eval-loop-spec.md`):

- `bun scripts/scaffold-eval-loop.ts "<loop name>" --domain <marketing|product|research> [--no-sync]` — first creation (`--no-sync` skips inline manifest-sync; run sync separately at end of dispatch)
- `bun scripts/append-loop-result.ts "<slug>" --artifact <path> --metric <k> --value <v> --baseline <v> --status <keep|discard|watch|blocked> --description <one-sentence>` — append row (validated; never hand-edit the TSV)
- `bun scripts/update-quality-dashboard.ts --loop <slug> --latest-cycle <N> ...` — when Quality Feedback Protocol threshold is met

## Pre-Dispatch

Follow [`references/pre-dispatch-protocol.md`](../../../references/pre-dispatch-protocol.md) for framing. Skill-specific entry:

1. Read `.agents/manifest.json`. If missing/stale: `bun scripts/manifest-sync.ts`.
2. Inspect existing loops: `find .forsvn/loops -maxdepth 2 -type f 2>/dev/null | sort`.

### Warm Start (matching loop found)

```text
Found:
- loop: .forsvn/loops/[slug]/
- program status: [status]
- latest strategy / execution / eval: [paths or none]
- latest result row: [status + metric or none]

Proceeding to resume this loop. Anything to override?
```

Then dispatch based on the ask: setup, context refresh, next-cycle planning, loop audit, or evaluator routing.

### Cold Start (no loop / missing dimensions)

Ask one bundled set:

1. What measurable surface does this loop own? (page / campaign / ad set / email sequence / social series / other)
2. Primary metric and source? (e.g. conversion rate from GA, CTR from Meta, replies from CRM)
3. Which domain? (default-infer from the surface — ask only if ambiguous: `marketing` for pages/campaigns/ads/email/social, `product` for in-product UX/activation/retention, `research` for recurring research motions)
4. What can change between cycles? (copy / offer / CTA / targeting / creative angle / sequence / format / UX surface)
5. What must stay fixed? (brand, audience, budget, channel, product facts, compliance)
6. Baseline or first measurement window? ("unknown yet" allowed if source is known)

Write answers to `context.md`, update `program.md`, then dispatch.

## Agent Manifest

| Agent | Layer | File | Focus |
|---|---|---|---|
| Loop Architect | 1 | `agents/loop-architect-agent.md` | Defines the loop contract: goal, surface, mutable/frozen boundaries, cycle protocol |
| Metric Designer | 1 | `agents/metric-designer-agent.md` | Defines primary metric, guardrails, baseline shape, attribution risks, results.tsv decision row |
| Scope Guard | 2 | `agents/scope-guard-agent.md` | Checks execution boundary, measurable-surface fit, and whether a loop is justified |
| Critic | 2 | `agents/critic-agent.md` | PASS/FAIL gate on loop usefulness, measurability, artifact contract, and safety |

## Dispatch

1. If creating a new loop, infer/confirm the domain and run `scaffold-eval-loop.ts "<loop name>" --domain <domain> --no-sync`.
2. Read `program.md`, `context.md`, and any existing `results.tsv` row.
3. Layer 1 parallel: Loop Architect + Metric Designer.
4. Layer 2 sequential: Scope Guard -> Critic.
5. If Critic FAIL, revise only the named failing sections once.
6. Write final `program.md` and `context.md` with required frontmatter.
7. Apply the Quality Feedback Protocol per `references/_shared/quality-feedback-protocol.md` (promote `keep` learnings, log critic overrides, update dashboard at threshold, flag research artifacts needing downstream eval).
8. Run `manifest-sync` once after the final files are written.
9. Return the loop path, the next recommended strategy/execution/eval skill, quality-feedback action, and status.

## Artifact Requirements

`program.md` frontmatter:

```yaml
---
skill: run-eval-loop
version: 1
date: YYYY-MM-DD
status: done
summary: "[loop] measurable improvement loop"
purpose: "Operating program for a measurable strategy -> execution -> evaluation loop"
lifecycle: loop
use_when: "Coordinating repeated strategy, execution, evaluation, and keep/discard decisions for this initiative"
do_not_use_when: "The work has no observable metric or attribution path"
upstream: "operator intent, prior artifacts, metric baseline"
downstream: "strategy skills, marketing/content execution skills, evaluation skills"
---
```

`context.md` frontmatter uses `lifecycle: loop-context`. `learnings.md` uses `lifecycle: learning`.

## Completion

End every response with one of:

- `DONE` — loop created/resumed, contract is measurable, next step is clear
- `DONE_WITH_CONCERNS` — loop exists but metric/baseline/attribution is weak
- `NEEDS_CONTEXT` — missing measurable surface or metric source
- `BLOCKED` — filesystem/script failure or conflicting loop state

Also include:

```text
Quality feedback: [promoted learning | kept in loop | dashboard updated | critic override logged | research eval recommended | none]
```
