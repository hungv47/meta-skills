---
name: navigate
description: "Orient and route — scan artifacts, check freshness, recommend next skill, compose multi-phase workflows. One skill for 'what exists?', 'what should I do next?', and 'orchestrate this goal'. Not for executing skills (it coordinates, not executes)."
argument-hint: "[goal — e.g. 'build a SaaS app'] or 'status'"
user-invocable: true
license: MIT
metadata:
  author: hungv47
  version: "2.0.0"
routing:
  intent-tags:
    - artifact-scan
    - staleness-check
    - next-action
    - project-status
    - skill-discovery
    - workflow-planning
    - team-formation
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

# Navigate

*Meta — Utility. Orient, route, and orchestrate across the skill ecosystem.*

**Core Question:** "Given this goal and the current artifact state, what's the fastest path to the outcome?"

---

## Three Modes

### Mode A: Status
**When:** Argument is `status` or user asks "what exists", "what's stale", "what do I have"

Scan `.agents/` and report. Single-pass, no sub-agents.

1. **Scan** `.agents/` for every `.md` file, including `.agents/meta/`. For each, read frontmatter to extract `skill:`, `date:`, `status:`, `version:`. Missing fields = `—`. Most meta-skill artifacts (`.agents/meta/`) are ephemeral analysis outputs — report them but weigh them lightly in recommendations. Exception: `meta/review-chain-report.md` is consumed by `/ship` as a review gate, so treat it as a real dependency when ship is in the workflow.

2. **Report** as a table sorted by date (newest first). Mark **STALE** if `date:` > 30 days old.

```
| Artifact | Skill | Date | Age | Status |
|----------|-------|------|-----|--------|
| product-context.md | icp-research | 2026-03-15 | 13d | ok |
| solution-design.md | solution-design | 2026-02-10 | 46d | STALE |
```

If `.agents/` doesn't exist or is empty, say so.

3. **Recommend** the one or two skills that unblock the most, using the dependency graph below. Don't dump a flat list of everything missing — trace the graph, find the root blocker.

### Mode B: Suggest (default)
**When:** Argument is a goal description

1. Classify the goal's intent tags using the skill registry
2. Scan `.agents/` for existing artifacts
3. Match intents to skills, check dependencies, identify parallel tracks
4. Present: goal analysis + recommended skill team with phases

### Mode C: Orchestrate
**When:** Argument starts with `orchestrate` or user asks for a full workflow plan

1. Run Mode B to get the skill team
2. Produce a `workflow-plan.md` artifact with phases, checkpoints, and progress tracking
3. Return the plan + instructions for Phase 1

**Continuation:** Run `/navigate orchestrate` again (no new goal) to validate current phase, update progress, and recommend next phase.

---

## Suggest Output Format

```markdown
## Goal Analysis
**Goal:** [user's goal]
**Scope:** [Light (1-2 skills) | Medium (3-5) | Heavy (6+)]

## Artifact State
| Artifact | Status | Age | Action |
|----------|--------|-----|--------|
| product-context.md | exists | 5d | fresh — skip |
| solution-design.md | missing | — | run /solution-design |

## Recommended Team

### Phase 1: [Name]
| Skill | Why | Parallel? | Interactive? |
|-------|-----|-----------|-------------|
| `/skill-name` | [reason] | Yes/No | Yes/No |

**Checkpoint:** [what must exist before Phase 2]

### Phase 2: [Name]
[...]

## Quick Start
Run: `/[first-skill] [context]`
```

---

## Orchestrate Output Format

```markdown
---
skill: navigate
version: 1
date: [today]
status: in-progress
goal: "[user's goal]"
---

# Workflow: [Goal Title]

## Phases

### Phase 1: [Name]
- [ ] /[skill] -> [artifact]
**Checkpoint:** [validation criteria]

### Phase 2: [Name]
- [ ] /[skill] -> [artifact]
**Checkpoint:** [validation criteria]

## Status
Current phase: 1
Next action: Run `/[first-skill] [context]`
```

---

## Checkpoint Validation

Between phases in orchestrate mode:

1. **Existence** — required artifacts exist
2. **Freshness** — `date` field < 30 days
3. **Completeness** — valid frontmatter present
4. **Status** — `final` preferred; `draft` triggers warning

```
Phase [N] Checkpoint: PASS / WARNING / BLOCKED
```

---

## Cross-Project Mode (--cross-project)

When invoked with `--cross-project`:

1. Scan `.agents/` in current directory AND sibling skill repo directories
2. Report unified table with **Project** column
3. Trace cross-project dependencies
4. Recommend highest-impact action across ALL projects

---

## Dependency Graph (Canonical)

Artifacts are **optional save-points**, not mandatory pipeline gates. The graph shows what CAN flow between skills, not what MUST exist on disk. Conversation context from the current session is equally valid.

```
product-context.md <- /icp-research
|-> market-research.md <- /market-research --+
|-> problem-analysis.md <- /problem-analysis -+
|                                             +-> solution-design.md <- /solution-design
|                                             |   |-> targets.md <- /funnel-planner -> experiment-*.md
|                                             |   |-> mkt/imc-plan.md <- /imc-plan -> mkt/content/ -> mkt/*.humanized.md
|                                             |   +-> system-architecture.md <- /system-architecture
|                                             |       +-> tasks.md <- /task-breakdown
|                                             |           +-> (execute) -> meta/review-chain-report.md <- /review-chain
|                                             |               +-> ship-report.md <- /ship
|                                             |                   +-> deploy-verify-report.md <- /deploy-verify
|-> /discover (conversation context or spec.md) --+
|-> design/brand-system.md <- /brand-system
+-> design/user-flow.md <- /user-flow --> system-architecture.md, tasks.md
```

---

## Priority Table

When recommending next action. Note: if discover ran in the current session, its decisions are in conversation context — no spec.md file is required.

| If missing/stale | Run | Because |
|------------------|-----|---------|
| `product-context.md` | `/icp-research` | 12+ downstream skills depend on it |
| `market-research.md` or `problem-analysis.md` | `/market-research` or `/problem-analysis` | Feed into `/solution-design` |
| `solution-design.md` | `/solution-design` | Architecture, funnel, comms need it |
| No clarity on what to build (no conversation or spec) | `/discover` | Need alignment before architecture |
| `system-architecture.md` | `/system-architecture` | Can't decompose without design |
| `tasks.md` | `/task-breakdown` | Needs architecture first |

---

## Pre-Built Workflow Templates

### Technical Build
**Triggers:** "build the app", "implement", "code it"
```
Phase 1: /discover (interactive conversation — optionally saves spec.md)
Phase 2: /system-architecture -> system-architecture.md
Phase 3: /task-breakdown -> tasks.md
Phase 4: (execution, /review-chain after critical tasks)
Phase 5: /ship -> ship-report.md
Phase 6: /deploy-verify -> deploy-verify-report.md
```

### Full Product Launch
**Triggers:** "launch", "new product", "go to market"
```
Phase 1: /icp-research -> product-context.md
Phase 2: /market-research + /problem-analysis (parallel)
Phase 3: /solution-design -> solution-design.md
Phase 4: /brand-system + /imc-plan + /funnel-planner (parallel)
Phase 5: /user-flow -> design/user-flow.md
Phase 6: /discover (interactive conversation)
Phase 7: /system-architecture -> system-architecture.md
Phase 8: /task-breakdown -> tasks.md + execution (/review-chain after critical tasks)
Phase 9: /ship -> ship-report.md
Phase 10: /deploy-verify -> deploy-verify-report.md
Phase 11: /content-create + /copywriting -> mkt/content/
Phase 12: /lp-optimization + /seo (parallel)
```

### Strategy Sprint
**Triggers:** "strategy", "what should we build", "prioritize"
```
Phase 1: /icp-research -> product-context.md
Phase 2: /market-research + /problem-analysis (parallel)
Phase 3: /solution-design -> solution-design.md
Phase 4: /funnel-planner -> targets.md
Phase 5: /experiment -> experiment-*.md
```

### Content Campaign
**Triggers:** "content campaign", "marketing campaign"
```
Phase 1: /icp-research -> product-context.md
Phase 2: /imc-plan -> mkt/imc-plan.md
Phase 3: /content-create -> mkt/content/
Phase 4: /copywriting -> mkt/content/*.copy.md
Phase 5: /humanize -> mkt/content/*.humanized.md
```

### Landing Page
**Triggers:** "landing page", "conversion page"
```
Phase 1: /icp-research -> product-context.md
Phase 2: /brand-system -> design/brand-system.md
Phase 3: /copywriting -> mkt/content/*.copy.md
Phase 4: /lp-optimization -> mkt/lp-optimization.md
Phase 5: /humanize -> mkt/content/*.humanized.md
```

### Architecture Decision
**Triggers:** "debate the tech stack", "which approach", "compare options"
```
Phase 1: /discover -> scope the decision (interactive)
Phase 2: /agent-room debate -> meta/agent-room-report.md
Phase 3: /system-architecture -> system-architecture.md
```

---

## Skill Inventory by Stack

### Research (6 skills)
| Skill | Complexity | Interactive | Produces |
|-------|------------|-------------|----------|
| icp-research | heavy | no | product-context.md |
| market-research | heavy | no | market-research.md |
| problem-analysis | heavy | no | problem-analysis.md |
| solution-design | heavy | no | solution-design.md |
| funnel-planner | medium | no | targets.md |
| experiment | medium | no | experiment-[name].md |

### Marketing (8 skills)
| Skill | Complexity | Interactive | Produces |
|-------|------------|-------------|----------|
| brand-system | heavy | no | design/brand-system.md |
| imc-plan | heavy | no | mkt/imc-plan.md |
| content-create | heavy | no | mkt/content/[slug].md |
| copywriting | heavy | no | mkt/content/[slug].copy.md |
| lp-optimization | medium | no | mkt/lp-optimization.md |
| seo | heavy | no | mkt/seo-[mode].md |
| attribution | medium | no | mkt/attribution.md |
| humanize | medium | no | mkt/content/*.humanized.md |

### Product (6 skills)
| Skill | Complexity | Interactive | Produces |
|-------|------------|-------------|----------|
| user-flow | medium | no | design/user-flow.md |
| system-architecture | heavy | no | system-architecture.md |
| code-cleanup | heavy | no | cleanup-report.md |
| technical-writer | medium | no | (writes to project) |
| ship | medium | no | ship-report.md |
| deploy-verify | light | no | deploy-verify-report.md |

### Meta (5 skills)
| Skill | Complexity | Interactive | Produces |
|-------|------------|-------------|----------|
| discover | medium | **yes** | spec.md (optional) |
| agent-room | heavy | no | meta/agent-room-report.md |
| task-breakdown | medium | no | tasks.md |
| review-chain | medium | no | meta/review-chain-report.md |
| navigate | medium | no | workflow-plan.md |

---

## Disambiguation: Commonly Confused Skills

| "I want to..." | Run this | Not this |
|----------------|----------|----------|
| Clarify a vague idea | `/discover` | `/system-architecture` (designs, not clarifies) |
| Scope a task before building | `/discover` | `/system-architecture` (designs, not scopes) |
| Have agents debate a decision | `/agent-room` debate | `/agent-room` poll (polls, not debates) |
| Get consensus from multiple perspectives | `/agent-room` poll | `/agent-room` debate (debates, not polls) |
| Verify code/output quality | `/review-chain` | `/code-cleanup` (refactors, not reviews) |
| Break work into tasks | `/task-breakdown` | `/system-architecture` (designs, not decomposes) |
| See what artifacts exist | `/navigate status` | — |
| Figure out what to do next | `/navigate [goal]` | — |
| Design tech stack + DB schema | `/system-architecture` | `/task-breakdown` (decomposes, not designs) |
| Figure out why metric X is declining | `/problem-analysis` | `/market-research` (landscape, not diagnosis) |
| Decide what to build next | `/solution-design` | `/discover` (clarifies HOW, not WHAT) |
| Write a headline / CTA | `/copywriting` | `/content-create` (full assets, not craft) |
| Create a social post / email | `/content-create` | `/copywriting` (craft, not format) |

---

## Anti-Patterns

- **Dumping a flat list** — Trace the graph, find the root blocker. Don't list every missing artifact equally.
- **Ignoring artifact state** — Don't recommend `/icp-research` when `product-context.md` is 3 days old.
- **Skipping dependency tracing** — Don't recommend `/task-breakdown` when `system-architecture.md` doesn't exist.
- **Recommending every possible skill** — Match scope to goal. A headline needs 1-2 skills, not 14.
- **Treating templates as rigid** — Skip phases where fresh artifacts exist.
