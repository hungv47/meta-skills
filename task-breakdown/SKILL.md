---
name: task-breakdown
description: "Decomposes a spec or architecture into buildable tasks with acceptance criteria, dependencies, and implementation order for AI agents or engineers. Produces `.agents/tasks.md`. Not for clarifying unclear requirements (use plan-interviewer) or designing architecture (use system-architecture)."
argument-hint: "[spec or architecture to decompose]"
license: MIT
metadata:
  author: hungv47
  version: "2.0.0"
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
    - design/user-flow.md
  requires:
    - system-architecture.md
  defers-to:
    - skill: plan-interviewer
      when: "spec is unclear, need to clarify requirements first"
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
Previous: `system-architecture` or `plan-interviewer` | Next: task execution (Phase 2)

**Re-run triggers:** When architecture changes after initial breakdown, when scope mode changes (e.g., full → minimal), or when tasks consistently fail acceptance criteria (indicates decomposition issues).

### Optional Artifacts
| Artifact | Source | Benefit |
|----------|--------|---------|
| `system-architecture.md` | system-architecture | Architecture defines structure for task decomposition |
| `spec.md` | plan-interviewer | Feature specification with decided requirements |
| `.agents/design/user-flow.md` | user-flow (from `hungv47/design-skills`) | User flow diagrams for feature decomposition and acceptance criteria |

If upstream artifacts' `date` fields are older than 30 days, recommend re-running the source skill before proceeding.

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

1. **Confirm scope mode** — ask the user: "Are we decomposing everything (FULL), building exactly what's spec'd (LOCKED), or cutting to minimum (MINIMAL)?" Default to LOCKED if finished spec provided, MINIMAL if MVP mentioned.
2. **Layer 1 dispatch** — send brief + scope mode to `decomposer-agent` and `dependency-mapper-agent` in parallel.
3. **Layer 2 sequential chain** — pass both outputs to `ordering-agent`, then ordered list to `acceptance-agent`, then complete breakdown to `critic-agent`.
4. **Revision loop** — if critic returns FAIL, re-dispatch affected agents with feedback. Maximum 2 rounds.
5. **Assembly** — merge into the task artifact format. Save to `.agents/tasks.md`.

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

**If any gate fails:** the critic identifies which agent must fix it and the orchestrator re-dispatches with specific feedback.

---

## Single-Agent Fallback

When context window is constrained or the decomposition is simple (fewer than 10 tasks expected):

1. Skip multi-agent dispatch
2. Confirm scope mode with the user
3. Decompose using the Task Format and Sizing Rules below
4. Map dependencies inline
5. Order risk-first
6. Write acceptance criteria for each task
7. Run the Critical Gates checklist as self-review
8. Save to `.agents/tasks.md`

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

```markdown
---
skill: task-breakdown
version: 1
date: {{today}}
status: draft
---

## Task [N]: [Title]

**Depends on:** [Task numbers this requires, or "None"]

**Outcome:** [What exists when done - one sentence]

**Why:** [What this unblocks]

**Acceptance:** [How to verify - specific test, expected result]

**Human action:** [External setup needed, if any]
```

### Sizing Rules

Right size:
- Changes ONE testable thing
- 5-30 min agent implementation time
- Failure cause is obvious and isolated

Split if:
- Multiple independent things to test
- Multiple files for different reasons
- Acceptance has multiple unrelated conditions

### Content Rules

**Outcomes, not implementation.**

Bad: "Create users table with id, email, created_at using Prisma"
Good: "Database stores user records with unique emails and timestamps"

**Risk-first ordering.**
Put uncertain/complex tasks early. Fail fast on hard problems.

**Dependencies explicit.**
Every task lists what it needs. Enables parallel work and failure impact analysis.

---

## Phase 2: Task Execution

### Before Starting

1. Read architecture doc fully
2. Read task list fully
3. Understand the end state before writing code
4. If anything is ambiguous, ask — assumptions cause rework.

### Per-Task Protocol

1. State which task you're starting
2. Write minimum code to pass acceptance
3. State exactly what to test and expected result
4. Stop and wait for confirmation — proceeding without it risks wasted work.
5. Pass → commit, announce next task
6. Fail → fix the specific issue only, don't expand scope

### Coding Rules

**Do:**
- Write absolute minimum code required
- Focus only on current task
- Keep code modular and testable
- Preserve existing functionality

**Avoid — these cause scope creep and breakage:**
- Sweeping changes across unrelated files
- Touching unrelated code
- Refactoring unless the task requires it
- Adding features not in the current task
- Premature optimization

**When human action is needed:**
- State exactly what to do and which file/value to update
- Wait for confirmation before continuing

### When Stuck

1. State what's blocking
2. Propose smallest modification to unblock
3. Wait for approval

### Scope Change Protocol

If you discover a missing requirement:

1. Stop current task
2. State what's missing and why it's needed
3. Propose where it fits in task order
4. Wait for PM to update task list
5. Resume only after task list is updated

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
- `decomposer-agent` → produces 7 tasks: scaffold, signup, login + protected routes, tasks table + RLS, create task, email notification, end-to-end test
- `dependency-mapper-agent` → identifies fan-out from scaffold (signup, login, tasks table are parallel), fan-in at create task (needs auth + schema), hidden dep: Resend API key missing from prerequisites

**Layer 2 chain:**
- `ordering-agent` → merges: moves Resend API key to Prerequisites, orders risk-first (auth before CRUD), identifies parallelism (signup and tasks table can run simultaneously)
- `acceptance-agent` → writes: "Submit signup form → user appears in Supabase Auth → confirmation email sent" for Task 2
- `critic-agent` → PASS, all 6 gates pass

**Artifact saved to `.agents/tasks.md`.**

---

## PM Feedback Format

When reporting test results:

```
Task [N]: PASS | FAIL | BLOCKED

[If FAIL]: What broke, error message, steps to reproduce
[If BLOCKED]: What's preventing test
```

---

## Artifact Template

On re-run: rename existing artifact to `tasks.v[N].md` and create new with incremented version.

Save to `.agents/tasks.md` using the Task Format above.

---

## References

- [references/sizing-examples.md](references/sizing-examples.md) — Right-sized vs wrong-sized tasks with split/combine guidance
- [references/dependency-patterns.md](references/dependency-patterns.md) — Common dependency patterns, visualization, and hidden dependency detection
- [references/acceptance-criteria.md](references/acceptance-criteria.md) — Acceptance criteria templates by task type
