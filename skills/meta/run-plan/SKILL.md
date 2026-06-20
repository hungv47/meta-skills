---
name: run-plan
description: "Execute an APPROVED plan.md (the A3 plan-artifact at .forsvn/runs/<slug>/plan.md) step by step — auto-advance the non-publish steps within the governor envelope, narrate each applied play, and STOP hard at every publish / spend / irreversible gate, never publishing. Use to run a plan a human already approved. Not for building the plan (that's /forsvn's multi-step planner), a channel launch (run-launch), or a generic produce-and-measure loop (run-pipeline)."
argument-hint: "<slug> [--fast|--deep]"
allowed-tools: Read Write Edit Grep Glob Bash
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.15-0.80"
---

# Run Plan — Approved-Plan Executor

*Meta process skill. Walks an **approved** `plan.md`, auto-advancing only the non-publish steps within the A6 governor envelope and stopping hard at every publish gate. Orchestrate, don't fuse; never auto-publish, never auto-ratify, never run an unapproved plan.*

**Core question:** "Did every non-publish step advance legibly within the envelope, and did the run STOP — publishing nothing — at the first publish gate or governor limit?"

> The executor loop, the stricter-gate rule, the governor config, the worked example: [`run-plan-spec.md`](references/run-plan-spec.md) [SPEC]. Plan schema + writer: `bin/plan.ts`. Governor: `bin/lib/governor.ts`.

## Critical Gates

1. **Approval first — refuse otherwise.** Read `.forsvn/runs/<slug>/plan.md`. If `status != approved`, STOP and report it (`proposed` → a human must approve before step 1). Never run, never self-approve.
2. **Publish gate is absolute.** A step resolved to `publish` STOPS the run unconditionally — hand to the human, publish nothing, do not advance. Hard-coded in `gate_class`; never downgradable by `.forsvn/config.json`.
3. **Stricter gate wins.** Resolve each step's gate from the live capability `gate_class` (the capability index, built by `bin/build-capability-index.ts`) AND the plan row's `gate`. If either says `publish`, it's a publish stop. A missing/unknown gate is treated as `review` (never `auto`).
4. **Governor envelope (A6).** Before each step call `bun bin/lib/governor.ts check …`. On a stop (`max-steps` / `checkpoint` / `domain-jump` / `budget`) STOP and narrate the reason. The governor only tightens — it cannot relax a gate.
5. **Legible + never auto-ratify.** Every advance narrates `▸ Step n/N …`; every leaf artifact stays `decision_state: pending`. No black-box run; no auto-acceptance.

## Quality Gate — 5 dimensions

Pre-exit self-check — all 5 must hold (the executor's critic):

- [ ] **Approval honored** — the run only proceeded because `status: approved`; an unapproved plan was refused.
- [ ] **Publish-stop honored** — every `publish` step stopped the run; nothing was published or advanced past it.
- [ ] **Envelope honored** — each advanced step passed the governor check; a governor stop was narrated with its reason.
- [ ] **Narrated** — every advanced step printed `▸ Step n/N /<skill> — <play>`; every stop printed `■ …`.
- [ ] **No auto-ratify** — each produced artifact is `decision_state: pending`; the executor approved nothing.

## Before Starting

Read the plan: `bun bin/plan.ts show <slug>`. **Refuse** unless `status: approved`. Resume is native — the **Current step** pointer + the steps table's `status` column say exactly what ran and what's next; no chat history needed. Session profile: [`_shared/execution-policy.md`](references/_shared/execution-policy.md). Mode: [`_shared/mode-resolver.md`](references/_shared/mode-resolver.md) — `--fast` skips narration verbosity, **never** a gate or the publish stop.

## Dispatch

Per ready step (all `depends_on` `done`), in `depends_on` order:

1. **Resolve the gate** — stricter of the plan row `gate` and the capability's live `gate_class` (default `review`, never `auto`).
2. **Check the envelope** — `bun bin/lib/governor.ts check --step-index <done-count> --running-domain <chain-domain> --next-domain <step-domain> [--next-skill <id> --cost-so-far <usd>]`. Exit `2` → STOP, narrate the reason.
3. **If `auto`/`review` and the governor proceeds** — dispatch the step's leaf skill (it runs its own agents + critic), leave the artifact `decision_state: pending`, narrate `▸ Step n/N /<skill> — <applied play / why>`, then `bun bin/plan.ts set-status <slug> <stepId> done` and `bun bin/plan.ts advance <slug>`.
4. **If `publish`** — narrate `■ Step n/N /<skill> — publish gate: human required (nothing published).` and STOP. Do not dispatch, advance, or publish.

Continue until a publish gate, a governor stop, or no ready step remains. The executor owns sequencing + gate enforcement only — each step's work is the leaf's (orchestrate, don't fuse).

## Chain Position

**Deference:** build/propose the plan → `/forsvn` multi-step planner (A3); a single channel launch → `run-launch`; a generic produce-and-measure loop → `run-pipeline`; approve the plan → the human, in the review surface. `run-plan` runs what they approved; it never plans, launches, or approves.

## Anti-Patterns

[anti-patterns.md](references/anti-patterns.md) [ANTI-PATTERN] — run an unapproved plan · publish or advance past a publish gate · let `.forsvn/config.json` downgrade a gate · auto-ratify an artifact · black-box a step (no `▸` line) · fuse a step's work instead of dispatching its leaf · ignore a governor stop.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet (populate via the slow-update workflow — references/slow-update-fence.md). -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — the plan ran to a clean terminal: every ready non-publish step advanced + narrated within the envelope, and the run stopped at a publish gate, a governor limit, or plan completion.
- **DONE_WITH_CONCERNS** — a leaf returned `DONE_WITH_CONCERNS`, or a step degraded; the run stopped legibly but a step needs attention.
- **NEEDS_CONTEXT** — no plan at `.forsvn/runs/<slug>/`, or the slug is ambiguous.
- **BLOCKED** — `status != approved` (a human must approve first), or a leaf `GUARD_FAIL`.

## Worked Example

A 3-step plan that auto-advances research → copy, then stops at the publish gate — narration + gate resolution visible: [run-plan-spec.md § Worked example](references/run-plan-spec.md).
