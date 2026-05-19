---
title: Task-Breakdown — Task Format Schema
lifecycle: canonical
status: stable
produced_by: task-breakdown
load_class: PROCEDURE
---

# Task Format

**Load when:** assembling the final `tasks.md` artifact (Dispatch Protocol step 6 OR Single-Agent Fallback step 7). This ref defines the full schema: Status Index, Shared Context, Task block format, status semantics + transition rules, Sizing Rules, Autonomy Classification, Content Rules. The body's Multi-Agent Architecture section produces task DRAFTS; this ref turns them into the canonical on-disk format.

Companion refs:
- [`sizing-examples.md`](sizing-examples.md) — right-sized vs wrong-sized examples
- [`dependency-patterns.md`](dependency-patterns.md) — dependency shapes + hidden dep detection
- [`acceptance-criteria.md`](acceptance-criteria.md) — acceptance criteria templates per task type
- [`execution-protocol.md`](execution-protocol.md) — what agents implementing tasks read

---

## Stable IDs + index ordering

Every task gets a **stable ID** (`T1`, `T2`...) at creation, **never renumbered**. Inserts use the next free number (e.g., `T8` even if it belongs between `T3` and `T4`). Removed tasks keep their ID with `Status: removed` — don't delete the block, so dependents fail loudly instead of mis-pointing silently.

**Index ordering:** rows ordered by **execution order**, not ID. Insert `T8` between `T3` and `T4` rows when logically positioned there. IDs never move; rows do.

## File Layout

The artifact opens with a **status index table** — single skim surface so a resuming agent finds the next task in one read. The index is source of truth for status; task blocks carry detail. Both must stay in sync — whenever `Status` flips, update its index row in the same edit.

```markdown
---
skill: breakdown-tasks
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

## Status field

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
- `blocked` and `removed` are terminal until reopened — see Reopen Protocol in [`execution-protocol.md`](execution-protocol.md).

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

## Sizing Rules

Right size:
- Changes ONE testable thing
- 5-30 min agent implementation time
- Failure cause is obvious and isolated

Split if:
- Multiple independent things to test
- Multiple files for different reasons
- Acceptance has multiple unrelated conditions

See [`sizing-examples.md`](sizing-examples.md) for right-sized vs wrong-sized worked examples.

## Autonomy Classification

Every task gets an **Autonomy** label:

| Label | Meaning | When to use |
|-------|---------|-------------|
| **AFK** | Agent can execute end-to-end without human judgment | Deterministic tasks: scaffolding, CRUD, tests, migrations with clear schema |
| **HITL** | Needs human judgment during execution | Taste decisions, external approvals, ambiguous acceptance criteria, security-sensitive changes |

**Default to AFK.** Mark HITL only when the task genuinely requires judgment the agent can't make from the spec alone. Every HITL task must state *what specific judgment* is needed — "needs review" is insufficient.

**Why this matters:** Orchestrators batch-run AFK autonomously and queue HITL for user attention. Mislabeling AFK→HITL wastes time; HITL→AFK risks wrong decisions.

## Content Rules

**Outcomes, not implementation.**

- Bad: "Create users table with id, email, created_at using Prisma"
- Good: "Database stores user records with unique emails and timestamps"

**Risk-first ordering.**
Put uncertain/complex tasks early. Fail fast on hard problems.

**Dependencies explicit.**
Every task lists what it needs. Enables parallel work and failure impact analysis.

## PM Feedback Format

When reporting test results (from external testers, QA, or the implementer), always use the stable task ID:

```
Task T[N]: PASS | FAIL | BLOCKED

[If FAIL]: What broke, error message, steps to reproduce
[If BLOCKED]: What's preventing test
```

## Re-run behavior

Depends on what changed:

- **Additive refinement** (new tasks, tightened acceptance, dep adjustments): **edit in place** using Update/Remove/Reopen protocols in [`execution-protocol.md`](execution-protocol.md). Stable IDs persist, History accumulates, index updates row-by-row. **Default** — multi-agent resume depends on it.
- **Full re-decomposition** (architecture pivoted, old breakdown no longer maps): **snapshot** to `tasks.v[N].md`, then write fresh `tasks.md`. Confirm with user first — they lose live status and in-flight claims.

Default to additive refinement. Snapshot only on user confirmation.
