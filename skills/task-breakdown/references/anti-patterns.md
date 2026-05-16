---
title: Task-Breakdown — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: task-breakdown
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** the decomposer is about to write a task that smells off, OR the critic is reviewing and something looks wrong, OR re-running on stale tasks. Re-read at any moment of doubt.

---

## Decomposition anti-patterns

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| "Build the auth system" | 5+ tasks disguised as one | decomposer-agent splits into registration, login, middleware, reset, verification |
| "Create the Button component" | Not independently testable | Combine with click handling and visual states |
| Hidden dependency | Task 8 needs API key not mentioned until Task 8 | dependency-mapper-agent surfaces it; goes in Prerequisites |
| "User flow works correctly" | Vague acceptance — means different things to everyone | acceptance-agent writes specific action + input + expected result |
| Implementation-as-outcome | "Use Redux for state management" dictates HOW | decomposer-agent writes WHAT: "User data fetches efficiently with caching" |
| Saving integrations for the end | Integration issues discovered late cause the most rework | ordering-agent front-loads risky integration work |
| Horizontal-only tasks ("build the whole schema first") | Accumulates untestable inventory; defers learning "this is wrong" to layer N | Vertical slices through all layers; horizontal exceptions need explicit justification |

## Orchestration anti-patterns

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Running >2 revision rounds | If round 2 still FAILs critic, the decomposition itself is wrong — more rounds won't fix it | Stop at max 2 rounds. Deliver with critic's remaining issues noted, status DONE_WITH_CONCERNS or escalate to operator. |
| Renumbering after insert/remove | Breaks every `Depends on` reference in the file + every external cite | Stable IDs forever. Insert = next free number. Remove = `Status: removed`, block stays. |
| Editing the Status Index out-of-sync with task blocks | Next agent picks up wrong task; resume protocol breaks | Whenever Status flips, update BOTH the index row AND the task block's Status field in the SAME edit. |
| Full re-decomposition without snapshot | Operator loses live status + in-flight claims + audit trail | Snapshot to `tasks.v[N].md` first; CONFIRM with operator before writing fresh tasks.md. |
| Defaulting to HITL "to be safe" | Wastes operator attention on tasks the agent could ship | Default AFK. Mark HITL only when judgment IS required AND name the specific judgment. |
| Defaulting to AFK on security-sensitive tasks | Risks wrong decision on changes that need human review | HITL for: auth changes, RLS policies, billing logic, data migrations affecting prod, anything touching PII/secrets. |
| Acceptance criteria with multiple unrelated conditions | Task is actually multiple tasks; failure cause becomes "X or Y broke" | Split into one task per acceptance condition. The single-test rule forces right-sizing. |
| Re-running task-breakdown to implement | task-breakdown is a planner, not a runner | After tasks.md ships, a fresh session (Claude Code, coding agent, human) reads execution-protocol.md and works tasks. Don't re-invoke task-breakdown. |
| Skipping discover when requirements are fuzzy | Decomposition looks right, builds the wrong thing | Defer to /discover. task-breakdown doesn't conduct interviews. |
| Skipping system-architecture when stack is undefined | Tasks reference moving targets; round-2 critic FAIL is inevitable | Defer to /system-architecture. Decomposition needs architectural decisions to anchor on. |
| Padding decomposition with nice-to-haves under MINIMAL scope | Defeats the point of MINIMAL — operator asked for cuts | Actively cut. For each feature: "Can we ship without this?" If yes, cut. Add a "Cut from MVP" section in tasks.md naming what was deferred. |
| Treating `removed` tasks as deletable | Removes the breadcrumb that lets dependents fail loudly | `removed` block stays in `## Tasks`; index row stays too. Dependent tasks should fail at "deps not done" rather than silently mis-point. |
