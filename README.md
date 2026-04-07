# Meta Skills

5 process-layer skills that wrap around domain skills to improve quality at every stage.

## Install

```bash
npx skills add hungv47/meta-skills
```

## Design Philosophy

**"Just talk with your agent."** No plan mode. No giant documents nobody reads. Conversation IS the plan.

- **Conversation-first**: Decisions live in conversation context. Artifacts are save-points, not pipeline stages.
- **Adaptive depth**: Skills auto-calibrate. A clear task gets 3 questions. A vague idea gets a multi-round interview.
- **One skill per job**: Each skill does a fundamentally different job.
- **Agent-room for perspectives**: When multiple perspectives or debate are needed, invoke agent-room.

## Skills

### `discover` — talk until you're clear, then build

Conversational discovery that adapts from quick scoping (3-5 questions) to deep interviews (multi-round). Surfaces assumptions, detects should-want framing, and probes real needs through natural conversation.

**Use when:**
- You have a vague idea and need to figure out what to build
- You're about to start a task and want to catch blind spots
- Requirements are unclear and need structured discovery

**Not for:** multi-perspective debate (use `agent-room`) or decomposing work (use `task-breakdown`)

**Produces:** Conversation context (default) or `.agents/spec.md` (when explicitly saved)

---

### `agent-room` — multi-agent discussion rooms

Stochastic multi-agent debate (agents argue in rounds, converge) or consensus polling (agents analyze independently with varied framings). Works standalone or as a sub-routine invoked by other skills.

**Use when:**
- You're facing a complex trade-off — architecture, strategic direction, design decision
- You want to stress-test an idea by having agents argue against it
- Another skill (like discover) hits a decision point that needs multiple perspectives

**Not for:** implementation (use `system-architecture`) or verification (use `review-chain`)

**Produces:** `.agents/meta/agent-room-report.md`

---

### `task-breakdown` — decompose into buildable tasks

Breaks work into granular, testable tasks with acceptance criteria, dependencies, and implementation order. Works from conversation context or artifacts.

**Use when:**
- Work is too big to just start — needs decomposition first
- You want tasks sized for AI agents or individual work sessions
- You need clear acceptance criteria and dependency ordering

**Not for:** clarifying requirements (use `discover`) or designing architecture (use `system-architecture`)

**Produces:** `.agents/tasks.md`

---

### `review-chain` — independent quality check

Fresh-eyes review chain: implement → review (by an agent with no sunk-cost bias) → resolve if issues found. Max 2 rounds. Auto-triggers for security-sensitive code.

**Use when:**
- You've built something and want independent verification
- The work is security-sensitive or involves data mutations
- You want a reviewer who hasn't seen the implementation reasoning

**Not for:** code refactoring (use `code-cleanup`) or decision analysis (use `agent-room`)

**Produces:** `.agents/meta/review-chain-report.md`

---

### `navigate` — artifact status + orchestration

Scans artifacts, checks freshness, and composes multi-phase workflows for tracking complex goals across sessions. Two modes: status ("what exists and what's stale?") and orchestrate ("track this multi-phase workflow").

**Use when:**
- You're picking up a project and need to know what artifacts exist and their freshness
- You have a complex goal that spans multiple sessions and need persistent workflow tracking
- You want a phased execution plan with parallel tracks

**Not for:** skill routing (the agent does that proactively on every response) or executing skills (it coordinates, not executes)

**Produces:** `.agents/workflow-plan.md` (orchestrate mode) or inline report (status mode)

---

## How They Compose

```
discover (conversation) --> build directly
    |                          |
    +-- agent-room             +-- review-chain
        (complex decisions)        (after build)
    |
    +-- task-breakdown
        (complex work)
    |
    navigate (orient anytime)
```

## Quick Build Recipe

```
1. /discover              → conversational clarity (interactive)
2. /system-architecture    → system-architecture.md
3. /task-breakdown         → tasks.md
4. (build tasks, /review-chain after critical ones)
5. /code-cleanup + /technical-writer (parallel)
6. /ship                   → ship-report.md
7. /deploy-verify          → deploy-verify-report.md
```

## License

MIT
