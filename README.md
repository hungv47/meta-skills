# Meta Skills

7 process-layer skills that wrap around domain skills to improve quality at every stage.

## Install

```bash
npx skills add hungv47/meta-skills
```

## How They Compose

<picture>
  <img src="./assets/pipeline.svg" alt="Meta composition: preflight → plan-interviewer → task-breakdown → execute → review-chain, plus multi-lens for decisions and navigation skills" width="100%">
</picture>

## Skills

### `preflight` — scope before building

Surfaces assumptions and defines a 4-part success contract (GOAL / CONSTRAINTS / FORMAT / FAILURE) before any build starts.

**Use when:**
- You're about to start building and want to catch blind spots first
- You want explicit success criteria before investing time
- The task is non-trivial and failure would be costly

**Not for:** vague ideas needing multi-round discovery (use `plan-interviewer`) or trivial tasks

**Produces:** Inline output (no persistent artifact)

---

### `plan-interviewer` — turn a vague idea into a spec

Multi-round interactive interview that asks probing questions, identifies gaps, and produces a structured PRD.

**Use when:**
- You have a fuzzy idea and need an AI to grill you into a concrete spec
- Requirements are unclear and you need structured discovery before architecture
- You want to surface hidden assumptions and edge cases through questioning

**Not for:** breaking an existing spec into tasks (use `task-breakdown`) or designing technical architecture (use `system-architecture`)

**Produces:** `.agents/spec.md`

---

### `task-breakdown` — decompose into buildable tasks

Breaks a spec or architecture into granular, testable tasks with acceptance criteria, dependencies, and implementation order.

**Use when:**
- You have an architecture or spec and need a buildable task list
- You want tasks sized for AI agents or individual developer work sessions
- You need clear acceptance criteria and dependency ordering

**Not for:** clarifying unclear requirements (use `plan-interviewer`) or designing architecture (use `system-architecture`)

**Produces:** `.agents/tasks.md`

---

### `multi-lens` — get multiple perspectives on a decision

Multi-agent debate (agents argue in rounds, converge on recommendations) or consensus polling (agents analyze independently with varied framings).

**Use when:**
- You're facing a high-stakes decision — tech stack, strategic direction, architecture trade-off
- You want to stress-test an idea by having agents argue against it
- You want independent perspectives aggregated by consensus and divergence

**Not for:** implementation (use `system-architecture`) or verification (use `review-chain`)

**Produces:** `.agents/meta/multi-lens-report.md`

---

### `review-chain` — independent quality check

Fresh-eyes review chain: implement → review (by an agent with no access to implementation reasoning) → resolve if issues found. Max 2 rounds.

**Use when:**
- You've built something and want an independent verification pass
- The work is security-sensitive or involves data mutations
- You want a reviewer who hasn't seen the implementation reasoning

**Not for:** code refactoring (use `code-cleanup`) or decision analysis (use `multi-lens`)

**Produces:** `.agents/meta/review-chain-report.md`

---

### `artifact-status` — see where you are

Scans `.agents/`, reports what exists, what's stale, and the critical path to your next goal.

**Use when:**
- You're picking up a project and need to know what's already been done
- You want to check which artifacts are stale before re-running skills
- You need to decide what to run next

**Not for:** deciding which skills to run for a new goal (use `skill-router`)

**Produces:** Inline report (no persistent artifact)

---

### `skill-router` — figure out what to run

Analyzes a goal, suggests the right skill team, and orchestrates multi-phase workflows with parallel tracks and checkpoints.

**Use when:**
- You have a goal ("build a SaaS app", "launch a content campaign") but don't know where to start
- You want a phased execution plan with the right skills in the right order
- You need to understand which skills apply to your situation

**Not for:** executing skills (it coordinates, not executes)

**Produces:** `.agents/workflow-plan.md`

---

## Composition Modes

| Mode | Skills | How it works |
|------|--------|-------------|
| **Before** (improve input) | `preflight`, `plan-interviewer`, `task-breakdown` | Run before domain skills to sharpen scope, spec, or task list |
| **After** (verify output) | `review-chain` | Run after any domain skill to verify quality |
| **Instead** (replace decision) | `multi-lens` | Replace a single-agent decision with multi-perspective analysis |
| **Navigate** (orient anytime) | `artifact-status`, `skill-router` | Run at any point to check state or plan next steps |

## Rigorous Build Recipe

```
1. /preflight            → surface assumptions, define contract
2. /plan-interviewer     → spec.md (interactive)
3. /system-architecture  → system-architecture.md
4. /review-chain         → verify architecture
5. /task-breakdown       → tasks.md
6. (build tasks, /review-chain after each critical task)
7. /code-cleanup + /technical-writer (parallel)
```

## License

MIT
