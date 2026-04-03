# Meta Skills

Domain-agnostic process skills: discover, debate, decompose, verify, navigate. These skills wrap around other skills — they improve input quality, decision quality, or output quality for any domain skill in the ecosystem.

## Design Philosophy

**"Just talk with your agent."** No plan mode. No giant documents nobody reads. Conversation IS the plan.

- **Conversation-first**: Decisions live in conversation context by default. Artifacts are save-points, not pipeline stages.
- **Adaptive depth**: Skills auto-calibrate. A clear task gets 3 questions. A vague idea gets a multi-round interview. No mode switching.
- **One skill per job**: Each skill does a fundamentally different job. No two skills that "ask questions to clarify things."
- **Agent-room for perspectives**: When multiple perspectives or debate are needed, invoke agent-room. Structured decomposition (task-breakdown) retains specialized agents.

## Skills (5)

| Skill | What it does | When |
|-------|-------------|------|
| `discover` | Conversational discovery — adaptive from quick scoping to deep interviews | Before building anything non-trivial |
| `agent-room` | Multi-perspective debate or consensus polling | Complex decision points, anywhere |
| `task-breakdown` | Decompose complex work into buildable steps | When work is too big to just start |
| `review-chain` | Fresh-eyes quality check after implementation | After building |
| `navigate` | Orient: scan artifacts, recommend next skill, compose workflows | Anytime you're lost |

## Process Flow

```
discover (conversation) --> build directly
    |                          |
    +-- agent-room             +-- review-chain
        (when complex              (after build)
         decision hit)
    |
    +-- task-breakdown
        (when work is complex enough
         to decompose first)
    |
    navigate (orient anytime)
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
| `agent-room` | `.agents/meta/agent-room-report.md` | Ephemeral — overwritten each run |
| `task-breakdown` | `.agents/tasks.md` | Task list with acceptance criteria |
| `review-chain` | `.agents/meta/review-chain-report.md` | Ephemeral — overwritten each run |
| `navigate` | `.agents/workflow-plan.md` | Only in orchestrate mode |

## Multi-Agent Patterns

**For decisions, analysis, and multiple perspectives:** `agent-room` is the centralized capability. It works two ways:
- **Standalone**: User invokes directly (`/agent-room "debate X"`)
- **Sub-routine**: Other skills invoke it when they hit a complex decision (e.g., discover hits a fork)

**For structured decomposition:** `task-breakdown` retains its own specialized agents (decomposer, dependency-mapper, ordering, acceptance, critic) because they do structured work — each produces a different output that gets merged. This is different from the perspective-based debate/poll that agent-room provides.

**The principle:** Don't use multi-agent for conversations. Use it for structured work (task-breakdown) or for genuine multi-perspective analysis (agent-room).

## Learned Rules (Self-Correcting)

Meta-skills improve over time via `.agents/meta/learned-rules.md`:
- User corrections are captured as rules
- Before dispatching, skills read relevant learned rules
- Rules supplement SKILL.md instructions, never override them
- Cap at ~50 rules — archive old ones when exceeded

## Cross-Stack

All meta-skills are domain-agnostic. They compose with any skill in any stack:
- `discover` before any build/create skill
- `agent-room` for any decision that needs multiple perspectives
- `task-breakdown` after architecture for complex builds
- `review-chain` after any critical artifact or implementation
- `navigate` to orient at any point

## Migration from Previous Stack (7 -> 5)

| Old Skill | New Home | Notes |
|-----------|----------|-------|
| `plan-interviewer` | `discover` | Full interview mode = discover at deep depth |
| `preflight` | `discover` | Quick scope mode = discover at light depth |
| `multi-lens` | `agent-room` | Same debate/poll mechanics, new name + sub-routine capability |
| `artifact-status` | `navigate` | Status mode = `/navigate status` |
| `skill-router` | `navigate` | Suggest/orchestrate modes preserved |
| `task-breakdown` | `task-breakdown` | Updated: no hard artifact dependency |
| `review-chain` | `review-chain` | Unchanged |
