# Dispatch Protocol [PROCEDURE]

How `map-user-flow` spawns its sub-agents and runs the layer graph. The Critic
Gate stays in `SKILL.md`; everything up to it lives here. Layer sequence:
Step 0 → Layer 1 (structure ∥ edge-case) → Merge → Layer 2a (diagram ∥
wireframe) → Layer 2b (validation → critic).

## How to spawn a sub-agent

1. **Read** the agent instruction file — include FULL content in the Agent prompt.
2. **Append** context (product, user, goal, platform, constraints) per [`references/pre-dispatch-prompts.md`](pre-dispatch-prompts.md) [PROCEDURE] "Context to pass to all agents."
3. **Resolve paths to absolute** (rooted at this skill's directory).
4. **Pass upstream artifacts by content**: orchestrator reads `docs/forsvn/artifacts/` files and includes excerpts; sub-agents don't read artifact files directly.
5. On critic FAIL, append feedback under `## Critic Feedback — Address Every Point`.

## Conventions

- **Source citation:** Cite UX heuristics/research/patterns; include URLs; flag unattributable claims `[UNVERIFIED]`.
- **Context loaded:** Artifact body lists which upstream artifacts were read + versions/dates (audit trail).

## Layer 1: Parallel Foundation

Spawn **IN PARALLEL** (wait for both — outputs feed merge and Layer 2):

| Agent | Instruction File | Pass These Inputs | Reference Files |
|-------|-----------------|-------------------|-----------------|
| Structure Agent | `agents/structure-agent.md` | brief (product + user + goal + platforms + surface matrix + constraints) | `references/research-checklist.md`, `references/platform-touchpoints.md` |
| Edge Case Agent | `agents/edge-case-agent.md` | brief (product + user + goal + platforms + surface matrix + constraints) | `references/research-checklist.md`, `references/platform-touchpoints.md` |

## Merge step

Combine structure + edge-case outputs into a unified flow model:

- **Structure:** flow classification, entry points, platform-surface entry matrix, core screens (name/purpose/actions/responses), decisions, exits, transitions.
- **Edge-case:** error/empty/loading/permission/offline per screen, back/cancel paths, per-surface platform edge states (app not running, widget stale, refresh throttled, notification grouping, deep-link fallback, etc.).

**Cross-reference checks before Layer 2:** (1) every screen has edge coverage; (2) every platform × surface has an entry-matrix row; (3) every platform × surface has a per-surface edge-state row. Flag failures before dispatching Layer 2.

## Layer 2a: Parallel Rendering

Spawn **IN PARALLEL** (both consume merged Layer 1 output; wait for both before Layer 2b):

| Agent | Instruction File | Pass These Inputs | Reference Files |
|-------|-----------------|-------------------|-----------------|
| Diagram Agent | `agents/diagram-agent.md` | brief + merged structure + edge cases | none |
| Wireframe Agent | `agents/wireframe-agent.md` | brief + platforms + surface matrix + merged structure + edge cases | `references/platform-touchpoints.md` (per-surface native dimensions) |

## Layer 2b: Sequential Chain

Dispatch **ONE AT A TIME, IN ORDER:**

| Step | Agent | Instruction File | Receives |
|------|-------|-----------------|----------|
| 1 | Validation Agent | `agents/validation-agent.md` | Structure + edge cases + diagram + wireframes |
| 2 | Critic Agent | `agents/critic-agent.md` | Complete flow (all outputs merged + validation results) |
