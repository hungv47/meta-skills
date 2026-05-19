---
title: Task-Breakdown Playbook
lifecycle: canonical
status: stable
produced_by: task-breakdown
load_class: PLAYBOOK
---

# Task-Breakdown Playbook

## Why this skill exists

A spec or architecture is not a build plan. Without decomposition, an engineer (human or AI) opens the spec and stares — the work feels both infinite and shapeless. Even when the spec is clear, the gap between "here's what we're building" and "here's what I do next" is where projects stall.

task-breakdown closes that gap. It takes a spec / architecture / feature description and produces `.forsvn/artifacts/meta/tasks.md` — a flat list of independently-shippable tasks, each with stable ID, explicit dependencies, acceptance criteria, autonomy classification (AFK vs HITL), and risk-first ordering. The artifact is read by a fresh engineering session (human or coding agent) and answers: **"What do I do next, and how will I know when it's done?"**

The cost of skipping it is silent: ambiguous tasks → hidden dependencies → integration discovered late → rework. The cost of running it is small ($0.15-0.50 sonnet, ~3-5 min for a feature-sized spec). The asymmetry makes it the default before any non-trivial build.

## Methodology

**Risk-first ordering, not feature-first.** The decomposer captures everything; the ordering-agent then re-sequences so uncertain/complex/integration-heavy work comes first. Integrations discovered in the last week cause the most rework — front-loading them surfaces the failures while there's time to course-correct. Feature-grouping order looks tidy but ships rework risk.

**Vertical slices over horizontal layers.** Each task should deliver a testable increment through all layers (UI + API + DB + test). Horizontal-only tasks ("build the entire schema first") accumulate untestable inventory and defer the moment you learn "this design is wrong" until layer N. Horizontal exceptions need explicit justification.

**Stable IDs forever, rows reorder freely.** T1, T2, T3 are anchors — never renumber. Inserts get the next free number (T8 even if it sits between T3 and T4). Removed tasks keep their ID with `Status: removed` so dependents fail loudly instead of mis-pointing silently. The Status Index table at the top of `tasks.md` orders ROWS by execution sequence, not by ID.

**Multi-agent dispatch for compositional accuracy.** Decomposer (right-size + capture) + dependency-mapper (find hidden deps) run in parallel; their outputs merge into ordering (risk-first sequence) → acceptance (write criteria) → critic (final quality gate). Each agent owns a different failure mode — having one agent do all of it produces tasks that look right but miss deps, OR have great deps but ambiguous acceptance. The chain is bounded at max 2 revision rounds; if the critic still FAILs after round 2, the decomposition itself is wrong — escalate to operator.

**AFK by default, HITL only when justified.** Most tasks (CRUD, scaffolding, tests, migrations with clear schema) are AFK — agent ships end-to-end. HITL is reserved for taste decisions, external approvals, ambiguous acceptance criteria, security-sensitive changes. Mislabeling AFK→HITL wastes operator time; HITL→AFK risks wrong decisions. Every HITL task names the specific judgment needed — "needs review" is insufficient.

## Principles

- **Outcomes, not implementation.** Tasks describe WHAT exists when done, not HOW to build it. "Database stores user records with unique emails" not "Create users table with id/email/created_at using Prisma." The decomposer enforces this — if a task dictates implementation, it's wrong shape.
- **Exactly one acceptance test per task.** Multiple acceptance conditions = multiple tasks. The single-test rule forces right-sizing.
- **Dependencies explicit + complete.** Every task lists every prerequisite. Hidden deps (API keys not mentioned until task 8) are the dependency-mapper's job to surface BEFORE ordering. The Prerequisites section catches them.
- **Right-size: 5-30 min agent implementation, ONE testable thing, failure cause obvious + isolated.** Anything bigger splits; anything where the failure mode is "X or Y or Z broke" needs to be three tasks.
- **A junior dev could verify each acceptance criterion.** No acceptance criteria like "user flow works correctly" — that's vibes. The acceptance-agent enforces: specific action + input + expected result.
- **The Status Index is source of truth.** Task blocks carry detail; whenever Status flips, update its index row in the same edit. Out-of-sync index = next agent picks up the wrong task.
- **Append-only history, never amend.** Every status change appends a History entry (`YYYY-MM-DD · actor · action`). The audit trail is the recovery mechanism when a multi-agent loop gets confused about who did what.

## History / origin

- **v2.0.0:** introduced multi-agent dispatch (decomposer / dependency-mapper / ordering / acceptance / critic), stable IDs with insert + remove semantics, Status Index, AFK/HITL autonomy classification, execution-protocol.md ref for consumers of tasks.md.
- **Phase 1E+ refactor (May 16, 2026, still v2.0.0):** body trimmed 398 → 174 lines per the v6 program (-56.3%). Task Format schema (~130 lines) extracted to `references/task-format.md`. Worked Example extracted to `references/examples/decompose-walkthrough.md`. Anti-patterns extracted to `references/anti-patterns.md`. Scope Modes section removed (duplicated content already in Dispatch Protocol step 1 + Routing Rules). Playbook captures the why (especially methodology + principles). No behavior change — pure body-diet + chain hardening. No version bump — refactor lands on the meta-skills 2.0 base as a commit, not a release.

## When NOT to use this skill

- **Requirements are unclear** → `discover` first. task-breakdown won't conduct an interview; it decomposes what's already defined. Recommending discover defensively when intent is clear is wrong, but skipping discover when the spec is half-baked produces tasks that look right and are wrong.
- **Architecture is undefined** → `architect-system` first. Without architectural decisions (stack, schema shape, auth approach), tasks reference moving targets and break on round-2 critic review.
- **Implementation work itself** → task-breakdown is a planner, NOT a runner. After `tasks.md` ships, the next session (fresh Claude Code, coding agent, or human) owns execution. Do NOT re-run task-breakdown to implement tasks.
- **Code quality verification** → `review-work`. Different shape entirely.
- **Trivial single-step changes** (typo fix, one config tweak) — overhead exceeds value. Just do it.

## Further reading

- [`task-format.md`](task-format.md) [PROCEDURE] — full schema for tasks.md: Status Index, Shared Context, Task block format, status field semantics + transition rules, Sizing Rules, Autonomy classification, Content Rules
- [`sizing-examples.md`](sizing-examples.md) — right-sized vs wrong-sized tasks with split/combine guidance
- [`dependency-patterns.md`](dependency-patterns.md) — common dependency patterns, visualization, hidden dependency detection
- [`acceptance-criteria.md`](acceptance-criteria.md) — acceptance criteria templates by task type
- [`execution-protocol.md`](execution-protocol.md) — operating manual for consumers of tasks.md (Resume + Per-Task + Update/Remove/Reopen + Concurrency + Coding Rules)
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes (oversized tasks, vague acceptance, hidden deps, implementation-as-outcome)
- [`examples/decompose-walkthrough.md`](examples/decompose-walkthrough.md) [EXAMPLE] — worked walkthrough: Todo app decomposed end-to-end through both layers
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) [PROCEDURE] — fast/standard/deep semantics (this skill's `--fast` = Single-Agent Fallback path for <10-task decompositions)
