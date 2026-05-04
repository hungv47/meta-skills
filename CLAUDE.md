# Meta Skills

Domain-agnostic process skills: discover, debate, decompose, verify. These skills wrap around other skills — they improve input quality, decision quality, or output quality for any domain skill in the ecosystem.

## Design Philosophy

**"Just talk with your agent."** No plan mode. No giant documents nobody reads. Conversation IS the plan.

- **Conversation-first**: Decisions live in conversation context by default. Artifacts are save-points, not pipeline stages.
- **Adaptive depth**: Skills auto-calibrate. A clear task gets 3 questions. A vague idea gets a multi-round interview. No mode switching.
- **One skill per job**: Each skill does a fundamentally different job. No two skills that "ask questions to clarify things."
- **Agents-panel for perspectives**: When multiple perspectives or debate are needed, invoke agents-panel. Structured decomposition (task-breakdown) retains specialized agents.

## Skills (4)

| Skill | What it does | When |
|-------|-------------|------|
| `discover` | Conversational discovery — adaptive from quick scoping to deep interviews | Before building anything non-trivial |
| `agents-panel` | Multi-perspective debate or consensus polling | Complex decision points, anywhere |
| `task-breakdown` | Decompose complex work into buildable steps | When work is too big to just start |
| `fresh-eyes` | Fresh-eyes quality check after implementation | After building |

## Process Flow

```
discover (conversation) --> build directly
    |                          |
    +-- agents-panel             +-- fresh-eyes
        (when complex              (after build)
         decision hit)
    |
    +-- task-breakdown
        (when work is complex enough
         to decompose first)
```

No rigid pipeline. The conversation guides what happens next.

## Context Resolution

Skills resolve context in this order:
1. **Conversation context** — same session, decisions are in the chat
2. **Artifacts on disk** — previous session saved a spec, architecture doc, etc.
3. **Discovery** — ask the user or scan the codebase

This means downstream skills don't REQUIRE artifacts to exist as files. They need the decisions to be known, from whatever source.

## Artifacts

| Skill | Artifact | Notes |
|-------|----------|-------|
| `discover` | `.agents/spec.md` | Optional — only when user asks to save |
| `agents-panel` | `.agents/meta/agents-panel-report.md` | Ephemeral — overwritten each run |
| `task-breakdown` | `.agents/tasks.md` | Task list with acceptance criteria |
| `fresh-eyes` | `.agents/meta/fresh-eyes-report.md` | Ephemeral — overwritten each run |

## Multi-Agent Patterns

**For decisions, analysis, and multiple perspectives:** `agents-panel` is the centralized capability. It works two ways:
- **Standalone**: User invokes directly (`/agents-panel "debate X"`)
- **Sub-routine**: Other skills invoke it when they hit a complex decision (e.g., discover hits a fork)

**For structured decomposition:** `task-breakdown` retains its own specialized agents (decomposer, dependency-mapper, ordering, acceptance, critic) because they do structured work — each produces a different output that gets merged. This is different from the perspective-based debate/poll that agents-panel provides.

**The principle:** Don't use multi-agent for conversations. Use it for structured work (task-breakdown) or for genuine multi-perspective analysis (agents-panel).

## Learned Rules (Self-Correcting)

Meta-skills improve over time via `.agents/meta/learned-rules.md`:
- User corrections are captured as rules
- Before dispatching, skills read relevant learned rules
- Rules supplement SKILL.md instructions, never override them
- Cap at ~50 rules — archive old ones when exceeded

## Cross-Stack

All meta-skills are domain-agnostic. They compose with any skill in any stack:
- `discover` before any build/create skill
- `agents-panel` for any decision that needs multiple perspectives
- `task-breakdown` after architecture for complex builds
- `fresh-eyes` after any critical artifact or implementation

Skill routing is the agent's job — it proposes skills proactively based on the system reminder skill list. There is no routing skill.

## Migration History

### v1 → v2: 7 skills → 5 skills

| Old Skill | New Home | Notes |
|-----------|----------|-------|
| `plan-interviewer` | `discover` | Full interview mode = discover at deep depth |
| `preflight` | `discover` | Quick scope mode = discover at light depth |
| `multi-lens` | `agent-room` | Same debate/poll mechanics, new name + sub-routine capability (later renamed to `agents-panel` in v5) |
| `artifact-status` | `navigate` | Status mode = `/navigate status` |
| `skill-router` | `navigate` | Suggest/orchestrate modes preserved |
| `task-breakdown` | `task-breakdown` | Updated: no hard artifact dependency |
| `review-chain` | `review-chain` | Unchanged (later renamed to `fresh-eyes` in v5) |

### v2 → v3: navigate trimmed

| Change | Rationale |
|--------|-----------|
| Removed navigate Mode B (Suggest/routing) | The agent proposes skills proactively on every response — navigate's routing was redundant. Skill registry reference file retained for the agent to read on demand. |
| Navigate now: Status + Orchestrate only | Two clear jobs: "what exists/what's stale" and "track a complex multi-phase workflow across sessions" |

### v3 → v4: navigate removed

| Change | Rationale |
|--------|-----------|
| Removed navigate skill entirely | Status mode unused in practice — artifact freshness checks happen inline within consuming skills. Orchestrate mode unused — workflows compose conversationally. Routing was already handled by the agent. No remaining job justified the surface area. |

### v4 → v5: rename pass for clarity

| Old name | New name | Rationale |
|----------|----------|-----------|
| `agent-room` | `agents-panel` | "agent-room" leaked implementation; "agents-panel" describes the user-facing job (debate or poll a panel of perspectives). |
| `review-chain` | `fresh-eyes` | "chain" described mechanism; "fresh-eyes" describes value — independent post-implementation review. |
