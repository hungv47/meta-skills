---
name: task-breakdown
description: "Decomposes a spec or architecture into buildable tasks with acceptance criteria, dependencies, and implementation order for AI agents or engineers. Produces `.agents/tasks.md`. Not for clarifying unclear requirements (use discover) or designing architecture (use system-architecture). For code quality checks after building, see fresh-eyes."
argument-hint: "[spec or architecture to decompose]"
allowed-tools: Read Grep Glob Bash
license: MIT
metadata:
  author: hungv47
  version: "2.0.0"
  budget: standard
  estimated-cost: "$0.15-0.50"
promptSignals:
  phrases:
    - "break this down"
    - "task list"
    - "acceptance criteria"
    - "sprint planning"
    - "work breakdown"
    - "decompose this"
  allOf:
    - [break, down, tasks]
    - [task, list]
  anyOf:
    - "acceptance criteria"
    - "sprint planning"
    - "implementation order"
    - "task dependencies"
    - "decompose"
  noneOf:
    - "code review"
    - "documentation"
    - "system architecture"
    - "user flow"
    - "scope this"
    - "what should we build"
    - "fresh eyes"
  minScore: 6
routing:
  intent-tags:
    - task-decomposition
    - dependency-mapping
    - acceptance-criteria
    - sprint-planning
    - work-breakdown
  position: pipeline
  produces:
    - tasks.md
  consumes:
    - system-architecture.md
    - spec.md
    - product/flow/*.md  # reads every flow file in the directory
  requires: []
  defers-to:
    - skill: discover
      when: "requirements are unclear, need to clarify first"
    - skill: system-architecture
      when: "architecture undefined, need technical design first"
  parallel-with: []
  interactive: false
  estimated-complexity: medium
---

# Task Breakdown — Orchestrator

*Productivity — Multi-agent orchestration. Break architecture into executable tasks and build them one at a time with AI agents.*

**Core Question:** "Can an engineer pick up any single task and ship it independently?"

## Inputs Required
- Architecture document, feature spec, or problem description to decompose
- Target scope (MVP, full feature, spike)

## Output
- `.agents/tasks.md`

## Chain Position
Previous: `system-architecture`, `discover`, or conversation context | Next: implementation (see [`references/execution-protocol.md`](references/execution-protocol.md))

**Re-run triggers:** architecture changes after initial breakdown; scope mode changes (e.g., full → minimal); tasks consistently fail acceptance (signals decomposition issues).

## Context Resolution

Works from whatever context is available — does NOT require disk artifacts. Conversation context is equally valid.

**Resolution order:**
1. **Conversation context** — decisions from discover or system-architecture in this session
2. **Artifacts on disk** — `architecture/system-architecture.md`, `.agents/spec.md`, every `.agents/product/flow/*.md`
3. **Defer to discover** — if neither exists, recommend `/discover`. Do not conduct your own interview — clarification is discover's job.

If artifact `date` fields are older than 30 days, recommend re-running the source skill.

---

## Multi-Agent Architecture

### Agent Roster

| Agent | File | Focus |
|-------|------|-------|
| decomposer-agent | `agents/decomposer-agent.md` | Splits features into atomic, right-sized tasks |
| dependency-mapper-agent | `agents/dependency-mapper-agent.md` | Maps dependency graph, finds hidden dependencies |
| ordering-agent | `agents/ordering-agent.md` | Merges tasks + deps into risk-first ordered list |
| acceptance-agent | `agents/acceptance-agent.md` | Writes precise, verifiable acceptance criteria |
| critic-agent | `agents/critic-agent.md` | Quality gate review, sizing check, coverage trace |

### Execution Layers

```
Layer 1 (parallel):
  decomposer-agent ────────┐
  dependency-mapper-agent ──┘── run simultaneously

Layer 2 (sequential):
  ordering-agent ──────────── merges task list + dependency graph
    → acceptance-agent ────── writes criteria for ordered tasks
      → critic-agent ─────── final quality review
```

### Dispatch Protocol

1. **Confirm scope mode** — ask: "FULL (decompose everything), LOCKED (build exactly what's spec'd), or MINIMAL (cut to MVP)?" Default LOCKED if finished spec provided, MINIMAL if MVP mentioned.
2. **Extract durable decisions** — list architectural decisions every task references: routes, schema shape, key data models, auth approach, third-party service boundaries, deployment target. Write as a "Shared Context" header so tasks reference without repeating or diverging. Source from system-architecture.md or conversation context.
3. **Layer 1 dispatch** — brief + scope mode + shared context → `decomposer-agent` and `dependency-mapper-agent` in parallel.
4. **Layer 2 sequential chain** — both outputs → `ordering-agent` → `acceptance-agent` → `critic-agent`.
5. **Revision loop** — if critic FAILs, re-dispatch affected agents with feedback. Max 2 rounds.
6. **Assembly** — merge into artifact format. Seed each task block with `**History:**` entry (`{{today}} · task-breakdown · created`). Save to `.agents/tasks.md`.

### Routing Rules

| Condition | Route |
|-----------|-------|
| Scope mode MINIMAL | decomposer-agent actively cuts features before decomposing |
| Scope mode FULL | decomposer-agent captures everything; defer cuts to after |
| Scope mode LOCKED | decomposer-agent follows spec exactly; flags gaps but doesn't add |
| Critic PASS | Assemble and deliver |
| Critic FAIL | Re-dispatch cited agents with feedback |
| Revision round > 2 | Deliver with critic's remaining issues noted |

---

## Critical Gates

Before delivering, the critic-agent verifies ALL of these pass:

- [ ] Every task has exactly ONE acceptance test
- [ ] No task depends on something not yet defined
- [ ] Risky/uncertain work is front-loaded
- [ ] All external config is in Prerequisites, not buried in tasks
- [ ] A junior dev could verify each acceptance criterion
- [ ] No task requires unstated knowledge to complete
- [ ] Tasks are vertical slices (each delivers a testable increment through all layers). Horizontal-only tasks require explicit justification.

**On gate fail:** critic identifies the agent to fix; orchestrator re-dispatches with specific feedback.

---

## Single-Agent Fallback

When context is constrained or decomposition is simple (<10 tasks):

1. Skip multi-agent dispatch
2. Confirm scope mode
3. Decompose using Task Format + Sizing Rules below
4. Map dependencies inline; order risk-first
5. Write acceptance criteria per task
6. Run Critical Gates checklist as self-review
7. Save to `.agents/tasks.md`

---

## Scope Modes

| Mode | When | Behavior |
|------|------|----------|
| **FULL SCOPE** | Discovery, greenfield, "what would it take?" | Capture everything — defer cuts to after decomposition |
| **LOCKED SCOPE** | Spec is final, ready to build | Decompose exactly what's written — flag gaps but don't add |
| **MINIMAL SCOPE** | Too much on the plate, need an MVP | Actively cut before decomposing — ask "can we ship without this?" for each feature |

Default to LOCKED SCOPE if the user provides a finished spec. Default to MINIMAL SCOPE if the user mentions MVP, prototype, or time pressure.

---

## Task Format

Every task gets a **stable ID** (`T1`, `T2`...) at creation, **never renumbered**. Inserts use the next free number (e.g., `T8` even if it belongs between `T3` and `T4`). Removed tasks keep their ID with `Status: removed` — don't delete the block, so dependents fail loudly instead of mis-pointing silently.

**Index ordering:** rows ordered by **execution order**, not ID. Insert `T8` between `T3` and `T4` rows when logically positioned there. IDs never move; rows do.

### File Layout

The artifact opens with a **status index table** — single skim surface so a resuming agent finds the next task in one read. The index is source of truth for status; task blocks carry detail. Both must stay in sync — whenever `Status` flips, update its index row in the same edit.

```markdown
---
skill: task-breakdown
version: 1
date: {{today}}
status: done | done_with_concerns | blocked | needs_context
---

# Tasks

## Status Index

| ID | Title | Status | Depends on | Updated |
|----|-------|--------|------------|---------|
| T1 | Scaffold Next.js + Supabase | done | — | 2026-04-21 · agent-implementer |
| T2 | Auth: signup + login | in_progress | T1 | 2026-04-21 · agent-implementer |
| T3 | Tasks table + RLS | pending | T1 | 2026-04-21 · task-breakdown |
| T4 | Create-task form | pending | T2, T3 | 2026-04-21 · task-breakdown |
| T5 | Email notification | blocked | T4 | 2026-04-21 · agent-implementer |

## Shared Context

[Architectural decisions every task references — extracted in Dispatch Protocol step 2]

## Tasks

### Task T[N]: [Title]

**Status:** pending
**Updated:** {{today}} · task-breakdown
**Evidence:** —

**Depends on:** [Task IDs this requires, e.g. "T1, T3", or "None"]

**Outcome:** [What exists when done - one sentence]

**Why:** [What this unblocks]

**Acceptance:** [How to verify - specific test, expected result]

**Autonomy:** AFK | HITL
**Why HITL:** [only if HITL — what specific judgment is needed]

**Human action:** [External setup needed, if any]

**History:**
- {{today}} · task-breakdown · created
```

Each task is a `###` block under `## Tasks` — siblings, not nested. Agents anchor on `### Task T[N]:` to jump from index row to block.

Every task block seeds a `**History:**` entry at creation (`{{today}} · task-breakdown · created`) so the audit trail has an origin — Update/Remove/Reopen entries append below.

### Status field

| Value | Meaning |
|-------|---------|
| `pending` | Not started. Default at creation. |
| `in_progress` | An agent has picked it up. Set agent name in `Updated`. |
| `done` | Acceptance passed. `Evidence` must cite commit SHA or test result. |
| `blocked` | Can't proceed. `Evidence` states the blocker. |
| `removed` | No longer needed. Block stays so dependent tasks surface breakage. |

**Transition rules:**
- `pending → in_progress` only if every `Depends on` task is `done`.
- `done` or `blocked` requires non-empty `Evidence` (commit SHA, test pass, artifact path, or blocker). No evidence → neither done nor blocked.
- `blocked` and `removed` are terminal until reopened — see Reopen Protocol.

**Who may make each transition:**

| Transition | Who | Notes |
|------------|-----|-------|
| `pending → in_progress` | Agent | Only if deps are all `done` |
| `in_progress → done` | Agent | Requires non-empty `Evidence` |
| `in_progress → blocked` | Agent | `Evidence` states the blocker |
| stale `in_progress → pending` | Agent | Per Resume Protocol step 3 only — with staleness check |
| `done → pending` | Human (via Reopen) | Never agent-initiated |
| `blocked → pending` | Human (via Reopen) | Never agent-initiated |
| `removed → pending` | Human (via Reopen) | Never agent-initiated |
| `* → removed` | Human | Via Remove Protocol |
| `done → in_progress` directly | **Never** | Always Reopen to `pending` first |

Always bump `Updated:` with current date + `· {actor}` matching index format (`YYYY-MM-DD · {actor}`).

### Sizing Rules

Right size:
- Changes ONE testable thing
- 5-30 min agent implementation time
- Failure cause is obvious and isolated

Split if:
- Multiple independent things to test
- Multiple files for different reasons
- Acceptance has multiple unrelated conditions

### Autonomy Classification

Every task gets an **Autonomy** label:

| Label | Meaning | When to use |
|-------|---------|-------------|
| **AFK** | Agent can execute end-to-end without human judgment | Deterministic tasks: scaffolding, CRUD, tests, migrations with clear schema |
| **HITL** | Needs human judgment during execution | Taste decisions, external approvals, ambiguous acceptance criteria, security-sensitive changes |

**Default to AFK.** Mark HITL only when the task genuinely requires judgment the agent can't make from the spec alone. Every HITL task must state *what specific judgment* is needed — "needs review" is insufficient.

**Why this matters:** Orchestrators batch-run AFK autonomously and queue HITL for user attention. Mislabeling AFK→HITL wastes time; HITL→AFK risks wrong decisions.

### Content Rules

**Outcomes, not implementation.**

Bad: "Create users table with id, email, created_at using Prisma"
Good: "Database stores user records with unique emails and timestamps"

**Risk-first ordering.**
Put uncertain/complex tasks early. Fail fast on hard problems.

**Dependencies explicit.**
Every task lists what it needs. Enables parallel work and failure impact analysis.

---

## Execution Hand-off

`task-breakdown` is a **planner**, not a runner. After `tasks.md` ships, whatever picks it up next — fresh Claude Code session, coding agent, human dev — owns execution. Do **not** re-run this skill to implement tasks.

The operating manual for consumers of `tasks.md` lives at [`references/execution-protocol.md`](references/execution-protocol.md). It covers:

- **Resume Protocol** — how a fresh session finds the next task
- **Per-Task Protocol** — claim, build, test, mark done
- **Update / Remove / Reopen** — append-only history, Revision bumps
- **Concurrency model** — multi-agent claim contention via shared git remote
- **Staleness check** — when to reclaim a stuck `in_progress` row (2h AFK / 24h HITL + no commits)
- **Coding Rules / When Stuck / Scope Change** — guardrails for the implementing agent

Agents implementing tasks should read that file top-to-bottom before claiming the first row.

---

## Anti-Patterns

| Anti-Pattern | Problem | INSTEAD |
|--------------|---------|---------|
| "Build the auth system" | 5+ tasks disguised as one | decomposer-agent splits into registration, login, middleware, reset, verification |
| "Create the Button component" | Not independently testable | Combine with click handling and visual states |
| Hidden dependency | Task 8 needs API key not mentioned until Task 8 | dependency-mapper-agent surfaces it; goes in Prerequisites |
| "User flow works correctly" | Vague acceptance — means different things to everyone | acceptance-agent writes specific action + input + expected result |
| Implementation-as-outcome | "Use Redux for state management" dictates HOW | decomposer-agent writes WHAT: "User data fetches efficiently with caching" |
| Saving integrations for the end | Integration issues discovered late cause the most rework | ordering-agent front-loads risky integration work |

---

## Worked Example

**User:** "Break down a Todo app with Supabase auth and email notifications."

**Orchestrator confirms:** LOCKED SCOPE (spec is clear).

**Layer 1 dispatch (parallel):**
- `decomposer-agent` → produces 7 tasks assigned stable IDs T1–T7: scaffold (T1), signup (T2), login + protected routes (T3), tasks table + RLS (T4), create task (T5), email notification (T6), end-to-end test (T7)
- `dependency-mapper-agent` → fan-out from T1 (T2, T3, T4 parallel), fan-in at T5 (needs T2, T3, T4), hidden dep: Resend API key missing from prerequisites

**Layer 2 chain:**
- `ordering-agent` → merges: moves Resend API key to Prerequisites, orders risk-first (auth before CRUD), identifies parallelism (T2 and T4 can run simultaneously once T1 is done)
- `acceptance-agent` → writes T2 acceptance: "Submit signup form → user appears in Supabase Auth → confirmation email sent"
- `critic-agent` → PASS, all gates pass

**First-run artifact (all pending, saved to `.agents/tasks.md`):**

```markdown
## Status Index

| ID | Title | Status | Depends on | Updated |
|----|-------|--------|------------|---------|
| T1 | Scaffold Next.js + Supabase | pending | — | 2026-04-21 · task-breakdown |
| T2 | Auth: signup | pending | T1 | 2026-04-21 · task-breakdown |
| T3 | Auth: login + protected routes | pending | T1 | 2026-04-21 · task-breakdown |
| T4 | Tasks table + RLS | pending | T1 | 2026-04-21 · task-breakdown |
| T5 | Create task | pending | T2, T3, T4 | 2026-04-21 · task-breakdown |
| T6 | Email notification | pending | T5 | 2026-04-21 · task-breakdown |
| T7 | End-to-end test | pending | T5, T6 | 2026-04-21 · task-breakdown |
```

A fresh agent opening this file runs Resume Protocol: Status Index → first pending with all deps done → **T1**. Claims it, executes, flips to `done` with evidence, moves to T2 or T4 (both unblocked once T1 lands).

---

## PM Feedback Format

When reporting test results, always use the stable task ID:

```
Task T[N]: PASS | FAIL | BLOCKED

[If FAIL]: What broke, error message, steps to reproduce
[If BLOCKED]: What's preventing test
```

---

## Artifact Template

Save to `.agents/tasks.md` using the Task Format above.

**Re-run behavior** depends on what changed:

- **Additive refinement** (new tasks, tightened acceptance, dep adjustments): **edit in place** using Update/Remove/Reopen protocols. Stable IDs persist, `History:` accumulates, index updates row-by-row. Default — multi-agent resume depends on it.
- **Full re-decomposition** (architecture pivoted, old breakdown no longer maps): **snapshot** to `tasks.v[N].md`, then write fresh `tasks.md`. Confirm with user first — they lose live status and in-flight claims.

Default to additive refinement. Snapshot only on user confirmation.

---

## Next Step

Tasks are ready. Implement the first unblocked task. Run `fresh-eyes` after each major completion. Hand off to commit/PR creation (e.g., `gh pr create`) when all tasks done.

---

## Completion Status

Every run ends with explicit status:
- **DONE** — all tasks decomposed, sized, ordered with deps, acceptance criteria written; critic PASS
- **DONE_WITH_CONCERNS** — decomposition complete but with sizing ambiguity, fuzzy dependencies, or acceptance criteria the user should sanity-check
- **BLOCKED** — work too large or under-specified to decompose; needs scope reduction or further discovery
- **NEEDS_CONTEXT** — missing spec, architecture, or product-context; recommend `discover` or `system-architecture` first

---

## References

- [references/sizing-examples.md](references/sizing-examples.md) — Right-sized vs wrong-sized tasks with split/combine guidance
- [references/dependency-patterns.md](references/dependency-patterns.md) — Common dependency patterns, visualization, and hidden dependency detection
- [references/acceptance-criteria.md](references/acceptance-criteria.md) — Acceptance criteria templates by task type
- [references/execution-protocol.md](references/execution-protocol.md) — Reader's manual for `tasks.md`: Resume + Per-Task + Update/Remove/Reopen + Concurrency + Coding Rules (read by agents implementing tasks, not by task-breakdown itself)
