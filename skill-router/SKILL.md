---
name: skill-router
description: "Analyze a goal, suggest the right skill team, and orchestrate multi-phase workflows. Run with a goal to get a plan, or 'status' to scan artifacts. Not for executing skills (it coordinates, not executes)."
argument-hint: "[goal — e.g. 'build a SaaS app', 'launch content campaign'] or 'status' or 'orchestrate [goal]'"
user-invocable: true
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
routing:
  intent-tags:
    - skill-discovery
    - workflow-planning
    - team-formation
    - artifact-scan
    - staleness-check
    - next-action
  position: utility
  produces:
    - workflow-plan.md
  consumes: []
  requires: []
  defers-to: []
  parallel-with: []
  interactive: false
  estimated-complexity: medium
---

# Skill Router — Orchestrator

*Productivity — Utility. Analyzes user goals, recommends optimal skill teams, and coordinates multi-phase workflows across the skill ecosystem.*

**Core Question:** "Given this goal and the current artifact state, what's the fastest path to the outcome?"

## Critical Gates — Read First

1. **The router coordinates, it does NOT execute.** It recommends which skills to run and in what order. The user invokes each skill. The router validates results between phases.
2. **Always check artifact state first.** Fresh artifacts mean you can skip skills. Stale artifacts (>30d) mean you should re-run.
3. **Respect the dependency graph.** Never recommend a downstream skill when its upstream artifact is missing. Trace backward to find the root blocker.
4. **Interactive skills need user presence.** `plan-interviewer` uses AskUserQuestion — flag it in the plan so the user knows to be available.
5. **Templates are starting points, not mandates.** Modify pre-built workflows based on actual artifact state. Skip phases where fresh artifacts exist.

## Inputs Required
- **Goal** (string): What the user wants to accomplish — natural language description
- **Mode** (string, optional): `status` | `suggest` (default) | `orchestrate`

## Output
- **Status mode:** Artifact state table + next action recommendation
- **Suggest mode:** Goal analysis + recommended skill team with phases and parallel tracks
- **Orchestrate mode:** `workflow-plan.md` artifact with phases, checkpoints, and progress tracking

## Quality Gate
- [ ] Every recommended skill traces to a goal intent (no filler skills)
- [ ] Dependency graph is respected — no downstream skills without upstream artifacts
- [ ] Parallel tracks are identified where possible (skills with no shared dependencies)
- [ ] Interactive skills are flagged
- [ ] Stale artifacts trigger re-run recommendations, not silent usage
- [ ] Disambiguation is offered when the goal maps to multiple confusable skills

## Chain Position
Utility — can run at any time. Typically run first in a session to decide what to do.
**Re-run triggers:** New goal, after completing a workflow phase, when confused about next steps.

### Skill Deference
- **Need to scan artifacts only?** → Use `/skill-router status` — Mode A is the canonical artifact scanner for the ecosystem
- **Already know which skill to run?** → Run it directly — the router adds value when the path is unclear

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Intent Classifier | 1 (parallel) | `agents/intent-classifier-agent.md` | Classify goal into intent tags, estimate scope, match to skills |
| Artifact Scanner | 1 (parallel) | `agents/artifact-scanner-agent.md` | Scan `.agents/`, report state, check freshness |
| Team Composer | 2 (sequential) | `agents/team-composer-agent.md` | Compose skill team, identify parallel tracks, add checkpoints |

No critic agent — the router is advisory (recommends), not generative (produces content).

---

## Routing Logic

### Mode A: Status
**When:** Argument is `status` or user asks "what exists", "what's stale", "what do I have"

```
1. Dispatch: artifact-scanner-agent
2. Return the artifact state table + next action recommendation
```

This is the canonical artifact scanning entry point for the ecosystem.

### Mode B: Suggest (default)
**When:** Argument is a goal description (anything that isn't `status` or `orchestrate ...`)

```
1. LAYER 1 — Dispatch IN PARALLEL:
   - intent-classifier-agent (with user's goal)
   - artifact-scanner-agent (scan .agents/)
2. LAYER 2 — Dispatch SEQUENTIALLY:
   - team-composer-agent (receives intent classification + artifact state)
3. Return: Goal analysis + recommended skill team with phases
```

### Mode C: Orchestrate
**When:** Argument starts with `orchestrate` followed by a goal

```
1. Run Mode B (suggest) to get the skill team
2. Team-composer-agent additionally produces a workflow-plan.md artifact
3. Return: The workflow plan + instructions for Phase 1
```

After each phase completes, the user can run `/skill-router orchestrate` again (without a goal) to:
- Validate the current phase's checkpoint
- Update the workflow-plan.md progress
- Recommend the next phase

---

## Step 0: Pre-Dispatch Context Gathering

### Read the Skill Registry
Before dispatching any agent, the orchestrator reads `references/skill-registry.md` for:
- Intent-to-skill mapping
- Disambiguation rules
- Pre-built workflow templates
- Full dependency graph

Pass the registry content to both the intent-classifier-agent and team-composer-agent.

### Check for Existing Workflow
If `.agents/workflow-plan.md` exists and the user runs orchestrate mode without a new goal, this is a **continuation**:
1. Read the existing workflow-plan.md
2. Determine the current phase
3. Run artifact-scanner-agent to validate the current phase's checkpoint
4. Update progress and recommend the next phase

---

## Dispatch Protocol

### How to spawn a sub-agent

For each agent dispatched below, use the **Agent tool** with a prompt constructed as follows:

1. **Read** the agent instruction file (e.g., `agents/intent-classifier-agent.md`) — include its FULL content in the Agent prompt
2. **Append** the user's goal and any additional context
3. **Resolve file paths to absolute**: replace relative paths with absolute paths rooted at this skill's directory
4. **Pass the skill registry** by content — read `references/skill-registry.md` and include relevant sections in the prompt
5. **Pass artifact state** (for team-composer-agent) — include the artifact-scanner-agent's output

### Single-agent fallback

If multi-agent dispatch is unavailable, execute sequentially in-context:
1. Classify the goal's intent tags manually using the skill registry
2. Scan `.agents/` for existing artifacts
3. Compose the team by matching intents to skills and checking dependencies

---

## Layer 1: Parallel Analysis

Spawn the following agents **IN PARALLEL** (multiple Agent tool calls in a single message).

| Agent | Instruction File | Pass These Inputs |
|-------|-----------------|-------------------|
| Intent Classifier | `agents/intent-classifier-agent.md` | User's goal + skill registry (intent mapping + disambiguation sections) |
| Artifact Scanner | `agents/artifact-scanner-agent.md` | Path to `.agents/` directory |

---

## Merge Step

After Layer 1 agents return, assemble their outputs:

| Field | Source |
|-------|--------|
| Intent tags | Intent Classifier |
| Matched skills | Intent Classifier |
| Scope estimate | Intent Classifier |
| Disambiguation needed | Intent Classifier |
| Artifact state table | Artifact Scanner |
| Stale artifacts | Artifact Scanner |
| Missing artifacts | Artifact Scanner |

If disambiguation is needed (intent maps to multiple confusable skills):

1. Present the confusable options to the user with the disambiguation rule from the skill registry
2. Ask: "This goal could mean [skill A] or [skill B]. Which is closer to what you need?"
3. Once the user clarifies, update the matched skills list
4. Then proceed to Layer 2

If no disambiguation is needed, proceed directly to Layer 2.

---

## Layer 2: Team Composition

Dispatch the **team-composer-agent** with the merged output from Layer 1.

| Agent | Instruction File | Receives |
|-------|-----------------|----------|
| Team Composer | `agents/team-composer-agent.md` | Merged intent + artifact state + skill registry (templates + dependency graph sections) |

---

## Output Templates

### Suggest Mode Output

```markdown
## Goal Analysis
**Goal:** [user's goal]
**Intent tags:** [matched tags]
**Scope:** [Light (1-2 skills) | Medium (3-5 skills) | Heavy (6+ skills)]
**Template match:** [matched template name, if any]

## Artifact State
| Artifact | Status | Age | Action |
|----------|--------|-----|--------|
| product-context.md | exists | 5d | fresh — skip /icp-research |
| solution-design.md | missing | — | run /solution-design |
| system-architecture.md | stale | 45d | re-run /system-architecture |

## Recommended Team

### Phase 1: [Phase Name]
| Skill | Why | Parallel? | Interactive? |
|-------|-----|-----------|-------------|
| `/skill-name` | [reason] | Yes/No | Yes/No |

**Checkpoint:** [what must exist before Phase 2]

### Phase 2: [Phase Name]
| Skill | Why | Parallel? | Interactive? |
|-------|-----|-----------|-------------|
| `/skill-name` | [reason] | Yes/No | Yes/No |

**Checkpoint:** [what must exist before Phase 3]

[...additional phases...]

## Quick Start
Run: `/[first-skill] [context]`
```

### Orchestrate Mode Output (workflow-plan.md)

```markdown
---
skill: skill-router
version: 1
date: [today]
status: in-progress
goal: "[user's goal]"
---

# Workflow: [Goal Title]

## Phases

### Phase 1: [Name] ⬜
- [ ] /[skill] → [artifact]
- [ ] /[skill] → [artifact]
**Checkpoint:** [validation criteria]

### Phase 2: [Name] ⬜
- [ ] /[skill] → [artifact]
**Checkpoint:** [validation criteria]

[...additional phases...]

## Status
Current phase: 1
Last updated: [today]
Next action: Run `/[first-skill] [context]`
```

### Status Mode Output

Status mode output format:

```markdown
| Artifact | Skill | Date | Age | Status |
|----------|-------|------|-----|--------|
| product-context.md | icp-research | 2026-03-15 | 13d | ok |
| solution-design.md | solution-design | 2026-02-10 | 46d | STALE |

**Recommendation:** [trace dependency graph, recommend next skill]
```

---

## Checkpoint Validation Protocol

When running in orchestrate mode, between phases the router validates:

1. **Existence:** Required artifact files exist in `.agents/`
2. **Freshness:** `date` field is < 30 days old
3. **Completeness:** Artifact has valid frontmatter (`skill`, `version`, `date`, `status`)
4. **Status:** `status: final` preferred; `status: draft` triggers warning but doesn't block
5. **Structural:** Artifact body is non-empty

### Checkpoint Output

```markdown
## Phase [N] Checkpoint: ✅ PASS
- [artifact]: exists, [N]d old, [status], complete

## Phase [N] Checkpoint: ⚠️ WARNING
- [artifact]: exists, [N]d old (STALE), [status]
  → Recommend re-running /[skill] before Phase [N+1]

## Phase [N] Checkpoint: ❌ BLOCKED
- [artifact]: missing
  → Must run /[skill] before proceeding
```

The user decides whether to proceed on WARNING. BLOCKED requires running the missing skill.

---

## Worked Example — Suggest Mode

**Input:** `/skill-router "build a SaaS landing page for our CRM tool"`

### Step 0: Pre-Dispatch
Read `references/skill-registry.md`. No existing workflow-plan.md.

### Layer 1: Parallel Dispatch
→ **Intent Classifier** returns:
  - Intent tags: `landing-page-copy`, `brand-identity`, `conversion-audit`, `audience-research`
  - Matched skills: copywriting, brand-system, lp-optimization, icp-research
  - Scope: Medium (4-5 skills)
  - Template match: "Landing Page" template
  - No disambiguation needed

→ **Artifact Scanner** returns:
  - `.agents/` is empty — no artifacts exist

### Layer 2: Team Composer
Receives intent (4 skills) + artifact state (empty) + Landing Page template.

Adjusts template: icp-research needed because product-context.md missing.

Returns:

```markdown
## Goal Analysis
**Goal:** build a SaaS landing page for our CRM tool
**Intent tags:** landing-page-copy, brand-identity, conversion-audit, audience-research
**Scope:** Medium (5 skills)
**Template match:** Landing Page

## Artifact State
| Artifact | Status | Action |
|----------|--------|--------|
| product-context.md | missing | Run /icp-research |
| design/brand-system.md | missing | Run /brand-system |
| mkt/content/*.copy.md | missing | Run /copywriting |

## Recommended Team

### Phase 1: Foundation
| Skill | Why | Parallel? | Interactive? |
|-------|-----|-----------|-------------|
| `/icp-research` | Creates product-context.md — needed by all downstream skills | No | No |

**Checkpoint:** product-context.md exists

### Phase 2: Design
| Skill | Why | Parallel? | Interactive? |
|-------|-----|-----------|-------------|
| `/brand-system` | Visual identity, color system, typography for the landing page | No | No |

**Checkpoint:** design/brand-system.md exists

### Phase 3: Copy
| Skill | Why | Parallel? | Interactive? |
|-------|-----|-----------|-------------|
| `/copywriting` | Headlines, CTAs, body copy with rubric scoring | No | No |

**Checkpoint:** mkt/content/*.copy.md exists with critic PASS

### Phase 4: Optimize
| Skill | Why | Parallel? | Interactive? |
|-------|-----|-----------|-------------|
| `/lp-optimization` | Conversion audit on the copy — hero, CTA, trust, UX | No | No |

**Checkpoint:** mkt/lp-optimization.md exists

### Phase 5: Polish
| Skill | Why | Parallel? | Interactive? |
|-------|-----|-----------|-------------|
| `/humanize` | Strip AI patterns from final copy | No | No |

**Checkpoint:** mkt/content/*.humanized.md exists

## Quick Start
Run: `/icp-research CRM tool for mid-market sales teams`
```

---

## Worked Example — Orchestrate Mode (Continuation)

**Input:** `/skill-router orchestrate` (no new goal — continuing existing workflow)

### Step 0: Check for Existing Workflow
Read `.agents/workflow-plan.md` — exists, current phase: 2.

### Layer 1: Artifact Scanner
Scans `.agents/`:
- product-context.md: exists, 3d old, final ✅
- mkt/icp-research.md: exists, 3d old, final ✅
- design/brand-system.md: missing ❌

### Checkpoint Validation
```
## Phase 1 Checkpoint: ✅ PASS
- product-context.md: exists, 3d old, final, complete
- mkt/icp-research.md: exists, 3d old, final, complete

## Phase 2 Checkpoint: ❌ BLOCKED
- design/brand-system.md: missing
  → Run /brand-system to create brand identity before proceeding
```

### Update workflow-plan.md
Mark Phase 1 as ✅, keep Phase 2 as current.

**Output:** "Phase 1 complete. Phase 2 blocked — run `/brand-system` to create design/brand-system.md."

---

## Anti-Patterns

**Recommending every possible skill** — Don't build a 14-skill pipeline when the user just wants a headline. Match scope to goal. A focused task needs 1-2 skills, not a full product launch. INSTEAD: Start with the minimum viable skill set. The user can always ask for more.

**Ignoring artifact state** — Don't recommend `/icp-research` when `product-context.md` is 3 days old and fresh. INSTEAD: Check freshness and skip skills whose artifacts are current.

**Skipping dependency tracing** — Don't recommend `/task-breakdown` when `system-architecture.md` doesn't exist. INSTEAD: Trace the dependency graph backward and recommend the root blocker first.

**Vague phase descriptions** — Don't say "Phase 2: Do marketing stuff." INSTEAD: Name specific skills, explain why each is needed, and define concrete checkpoints.

**Treating templates as rigid** — Don't force the Landing Page template when the user has fresh artifacts covering 3 of 5 phases. INSTEAD: Skip phases where fresh artifacts exist and adjust the workflow.

---

## Agent Files

### Sub-Agent Instructions (agents/)
- [agents/intent-classifier-agent.md](agents/intent-classifier-agent.md) — Goal analysis, intent tagging, skill matching
- [agents/artifact-scanner-agent.md](agents/artifact-scanner-agent.md) — .agents/ directory scanning, freshness checks
- [agents/team-composer-agent.md](agents/team-composer-agent.md) — Workflow planning, parallel track identification, checkpoint design
- [agents/_template.md](agents/_template.md) — Reusable template for creating new agent files

### Shared References (references/)
- [references/skill-registry.md](references/skill-registry.md) — Intent-to-skill mapping, disambiguation, workflow templates, dependency graph
