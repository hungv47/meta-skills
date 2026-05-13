---
name: eval-loop
description: "Single scaffold and ledger entrypoint for measurable strategy -> marketing/content execution -> evaluation cycles. Use when the user wants an eval-loop, autoresearch-style improvement loop, experiment ledger, campaign/content iteration system, or asks where to store strategy/execution/eval artifacts for a measurable initiative. Produces `skills-resources/marketing/loops/[slug]/program.md`, `context.md`, `results.tsv`, `learnings.md`, and strategy/execution/evals subfolders. Not a universal evaluator: route actual surface scoring to the relevant eval skill (e.g. short-form-eval, lp-eval; future ad-eval/email-eval/campaign-eval). Not for one-shot planning (use discover/task-breakdown) or multi-perspective debate (agents-panel)."
argument-hint: "[measurable initiative name, e.g. 'pricing page conversion' or 'founder outbound sequence']"
allowed-tools: Read Write Edit Grep Glob Bash
license: MIT
metadata:
  author: hungv47
  version: "0.1.0"
  budget: standard
  estimated-cost: "$0.20-0.80"
promptSignals:
  phrases:
    - "eval loop"
    - "evaluation scaffold"
    - "eval scaffold"
    - "autoresearch style"
    - "improvement loop"
    - "experiment ledger"
    - "strategy execution evaluation"
    - "loop workspace"
    - "where should evals live"
    - "create a loop"
    - "measurable initiative"
  allOf:
    - [strategy, evaluation]
    - [execution, evaluation]
    - [measure, iterate]
  anyOf:
    - "keep discard"
    - "results.tsv"
    - "closed loop"
    - "feedback loop"
    - "performance loop"
    - "campaign iteration"
  noneOf:
    - "code benchmark"
    - "unit test"
    - "model training"
  minScore: 5
routing:
  intent-tags:
    - measurable-loop
    - artifact-system
    - experiment-ledger
    - feedback-loop
  position: meta
  lifecycle: loop
  produces:
    - skills-resources/marketing/loops/[slug]/program.md
    - skills-resources/marketing/loops/[slug]/context.md
    - skills-resources/marketing/loops/[slug]/results.tsv
    - skills-resources/marketing/loops/[slug]/learnings.md
  consumes:
    - skills-resources/manifest.json
    - skills-resources/artifact-index.md
    - research/
    - brand/
    - architecture/
    - skills-resources/experience/
  requires: []
  defers-to:
    - skill: discover
      when: "the initiative is still vague and no measurable surface can be named"
    - skill: task-breakdown
      when: "the user needs implementation tasks rather than an eval loop"
    - skill: agents-panel
      when: "the main need is a strategic debate, not loop setup"
  parallel-with: []
  interactive: true
  estimated-complexity: medium
---

# Eval Loop — Orchestrator

*Meta process skill. Turns a measurable initiative into a loop-centered workspace where strategy artifacts, marketing/content execution artifacts, eval snapshots, result rows, and promoted learnings live together.*

**Core Question:** "Can future agents improve this measurable surface by reading one loop folder instead of reconstructing history from scattered skill outputs?"

## Critical Gates

1. **Measurable surface required.** If the user cannot name a page, campaign, post series, ad set, email sequence, outreach motion, or other observable surface, return `NEEDS_CONTEXT` and recommend `discover`.
2. **Metric path required.** The loop must name at least one primary metric and where it will come from, even if the baseline is not known yet. No metric path -> no loop.
3. **No skill-centered folders.** Do not create `skills-resources/{skill-name}/...`. Eval loops are organized by measurable initiative.
4. **Execution boundary.** This stack may execute marketing/content assets. It does not deploy code, publish to platforms, build app UI, or mutate external systems.
5. **No unattended infinite marketing loops.** Borrow `autoresearch`'s ledger and keep/discard discipline, not its "run forever" posture. Human approval gates publishing and live-surface changes.

## Reference

Read `../../references/eval-loop-spec.md` before writing or modifying any loop artifact.

## Responsibility Split

`eval-loop` is the one scaffold/ledger skill:

- Creates or resumes the loop folder
- Defines measurable surface, primary metric, baseline path, mutable surface, and guardrails
- Owns `program.md`, `context.md`, `results.tsv`, and `learnings.md`
- Routes to the right surface-specific evaluator

It does not replace surface evaluators. `short-form-eval` handles short-form scoring and `lp-eval` handles landing-page scoring today. Future `ad-eval`, `email-eval` / `outreach-eval`, and `campaign-eval` should write their measurement artifacts under the loop's `evals/` folder.

## Inputs

- Initiative name or slug (argument or inferred from prompt)
- Measurable surface (required)
- Primary metric and source (required)
- Mutable surface (what strategy/execution skills may change)
- Optional baseline, measurement window, guardrail metrics, canonical artifacts, current assets, prior evals

## Output

Create or resume:

```text
skills-resources/marketing/loops/[slug]/
├── program.md
├── context.md
├── strategy/
├── execution/
├── evals/
├── results.tsv
└── learnings.md
```

Use the scaffold helper for first creation:

```bash
bun ${SKILLS_ROOT:-.claude/skills}/meta-skills/scripts/scaffold-eval-loop.ts "<loop name>"
```

If running from this repo or a submodule checkout, this path is also valid:

```bash
bun meta-skills/scripts/scaffold-eval-loop.ts "<loop name>"
```

Evaluation skills should append result rows with the validated helper instead of hand-editing the TSV:

```bash
bun ${SKILLS_ROOT:-.claude/skills}/meta-skills/scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric conversion_rate \
  --value 3.4% \
  --baseline 2.9% \
  --status keep \
  --description "One sentence without tabs"
```

## Pre-Dispatch

Read `skills-resources/manifest.json` first if present. If missing or stale, run:

```bash
bun ${SKILLS_ROOT:-.claude/skills}/meta-skills/scripts/manifest-sync.ts
```

Then inspect existing loop folders:

```bash
find skills-resources/marketing/loops skills-resources/product/loops skills-resources/research/loops -maxdepth 2 -type f 2>/dev/null | sort
```

### Warm Start

If a matching loop exists, summarize:

```text
Found:
- loop: skills-resources/marketing/loops/[slug]/
- program status: [status]
- latest strategy artifact: [path or none]
- latest execution artifact: [path or none]
- latest eval artifact: [path or none]
- latest result row: [status + metric or none]

Proceeding to resume this loop. Anything to override?
```

Then dispatch the needed agent(s) based on the user's ask: setup, context refresh, next-cycle planning, loop audit, or evaluator routing.

### Cold Start

Ask one bundled question set:

1. What measurable surface does this loop own? (page / campaign / ad set / email sequence / social series / other)
2. What is the primary metric and source? (e.g. conversion rate from GA, CTR from Meta, replies from CRM)
3. What can change between cycles? (copy / offer / CTA / targeting / creative angle / sequence / format)
4. What must stay fixed? (brand constraints, audience, budget, channel, product facts, compliance)
5. What baseline or first measurement window should the loop use? ("unknown yet" is allowed if source is known)

After the user answers, write the answers to `context.md`, update `program.md`, and dispatch agents.

## Agent Manifest

| Agent | Layer | File | Focus |
|---|---|---|---|
| Loop Architect | 1 | `agents/loop-architect-agent.md` | Defines the loop contract: goal, surface, mutable/frozen boundaries, cycle protocol |
| Metric Designer | 1 | `agents/metric-designer-agent.md` | Defines primary metric, guardrails, baseline shape, attribution risks, results.tsv decision row |
| Scope Guard | 2 | `agents/scope-guard-agent.md` | Checks execution boundary, measurable-surface fit, and whether a loop is justified |
| Critic | 2 | `agents/critic-agent.md` | PASS/FAIL gate on loop usefulness, measurability, artifact contract, and safety |

## Dispatch

1. If creating a new loop, run `scaffold-eval-loop.ts`.
2. Read `program.md`, `context.md`, and any existing `results.tsv` row.
3. Layer 1 parallel: Loop Architect + Metric Designer.
4. Layer 2 sequential: Scope Guard -> Critic.
5. If Critic FAIL, revise only the named failing sections once.
6. Write final `program.md` and `context.md` with required frontmatter.
7. Run `manifest-sync`.
8. Return the loop path, the next recommended strategy/execution/eval skill, and status.

## Artifact Requirements

`program.md` frontmatter:

```yaml
---
skill: eval-loop
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
