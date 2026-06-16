# Dispatch Mechanics — Spawn, Pipeline, Fallback, Critic Loop

Cited by `SKILL.md` "Dispatch Protocol" and "Single-Agent Fallback" sections.
Agent roster SoT: [`../agent-manifest.md`](../agent-manifest.md).
Critic rubric SoT: [`gates-and-rubric.md`](gates-and-rubric.md).
Artifact section schema SoT: [`../format-conventions.md`](../format-conventions.md).

---

## Spawn Mechanics

The orchestrator spawns each agent via the **Task tool** (sub-agent call). Every spawn passes the
full Input Contract:

| Field | Value at spawn |
|---|---|
| `brief` | Original user brief (feature, surface, constraints) |
| `pre-writing` | Resolved pre-dispatch block: flow path, brand source, target engine, operator flags |
| `upstream` | `null` for Layer-1 agents; merged working spec for layout-state, handoff, critic |
| `references` | Absolute paths: agent file + skill-level references + any upstream artifact paths |
| `feedback` | `null` on first dispatch; critic feedback object on rewrite cycles |

Layer-1 agents (`screen-inventory`, `component-system`, `token-application`) run in parallel —
`upstream: null`, independent concern sets, no write collision risk. The orchestrator waits for all
three before assembling the merged working spec. Downstream agents (`layout-state`, `handoff`,
`critic`) receive the merged spec as `upstream` and run sequentially.

---

## Dispatch Table

Section numbers (§1–§9) below are the canonical schema in `../format-conventions.md` (the SoT).

| Agent | Layer | Reads | Produces (artifact section) |
|---|---|---|---|
| `intake-validator-agent` | 0 gate | `map-user-flow` artifact; DESIGN/BRAND tokens | Gate verdict — GO or NEEDS_CONTEXT (no artifact section) |
| `screen-inventory-agent` | 1 ∥ | brief, flow artifact | §2 Screen Inventory |
| `component-system-agent` | 1 ∥ | brief, flow artifact | §3 Component System |
| `token-application-agent` | 1 ∥ | brief, flow artifact, DESIGN/BRAND tokens | §4 Token Application Map |
| `layout-state-agent` | 2 seq | merged L1 spec | §5 Per-Screen Layout Spec + §6 Interaction & State Spec + §7 Accessibility Notes |
| `handoff-agent` | 3 seq | merged spec + layout-state output | §1 TL;DR + §8 Handoff + §9 What NOT To Render |
| `critic-agent` | 4 gate | full working spec | gate verdict (PASS/FAIL + feedback) — no artifact section; `## Review Gate` is plugin-rendered |

Full per-agent focus descriptions: `../agent-manifest.md`. Artifact section list (all 9): `../format-conventions.md`.

---

## Pipeline Pseudocode

```
# Step 0 — Hard Gate
result = spawn(intake-validator-agent, upstream=null)
if result == BLOCK: halt with BLOCKED status, state missing prerequisite

# Layer 1 — Parallel
[screens, components, tokens] = spawn_parallel(
  screen-inventory-agent(upstream=null),
  component-system-agent(upstream=null),
  token-application-agent(upstream=null)
)

# Merge
working_spec = orchestrator.assemble(screens, components, tokens)

# Layer 2 — Sequential
layout_out  = spawn(layout-state-agent,  upstream=working_spec)
handoff_out = spawn(handoff-agent,        upstream=working_spec + layout_out)

# Layer 3 — Critic gate (max 2 cycles)
for cycle in 1..2:
  verdict = spawn(critic-agent, upstream=full_spec)
  if verdict == PASS: break
  named_agents = verdict.failed_agents          # e.g. ["token-application-agent"]
  rewrite_outputs = spawn_each(named_agents, feedback=verdict.feedback)
  full_spec = orchestrator.patch(full_spec, rewrite_outputs)

# Write artifact
if verdict == PASS:
  write artifact, status: done
else:
  write artifact, status: done_with_concerns, annotations: critic.feedback
```

Rewrite routing rules (which agent owns which CP failure) live in `gates-and-rubric.md`.

---

## Single-Agent Fallback (`--fast`)

When multi-agent dispatch is unavailable or the mode-resolver downgrades to `fast`:

1. Execute Layer-1 agent instructions sequentially in-context:
   screen-inventory → component-system → token-application (collapsed to one pass).
2. Continue sequentially: layout-state → handoff.
3. Run the critic gate as normal.

**The intake-validator gate and the critic gate never collapse.** Safety gates
(brand fidelity, flow-traceability, policy compliance) fire in fallback mode regardless of
`--fast`. Mode-resolver rules: `references/_shared/mode-resolver.md`.

---

## Critic FAIL Loop

On a FAIL verdict the critic names the specific agent(s) responsible per checkpoint. The
orchestrator re-dispatches only those agents with `feedback` populated. Max **2 rewrite cycles**;
after a second consecutive FAIL the artifact ships as `status: done_with_concerns` with the
critic's annotations attached inline. Full rewrite-routing table (which CP maps to which agent):
[`gates-and-rubric.md`](gates-and-rubric.md).

---

## Chain Position and Re-run Triggers

**Previous skill:** `map-user-flow` — its artifact is the required upstream for the intake gate.

**Next skill (fork):**
- Structural/engineering path → `architect-system` (takes the component + token spec as context)
- Implementation path → `breakdown-tasks` (takes the handoff block as the execution seed)
- Either fork may also consume the handoff-agent's per-engine prompt directly.

**Re-run triggers:**
- Flow artifact updated (new screens, renamed states, edge-state changes)
- Design/brand token set updated (token-application + downstream invalidated)
- Target surface or engine changed (handoff block + layout-state invalidated)
- Operator requests a focused rewrite of a single section (dispatch only the owning agent with feedback; critic re-runs after)
