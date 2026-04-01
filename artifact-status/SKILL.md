---
name: artifact-status
description: "Scan .agents/ — report what exists, what's stale, and the critical path to your next goal. Run at session start or when deciding what to do next."
argument-hint: "[optional: goal — e.g. 'launch content', 'build the app', 'run strategy']"
user-invocable: true
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
routing:
  intent-tags:
    - artifact-scan
    - staleness-check
    - next-action
    - project-status
  position: utility
  produces: []
  consumes: []
  requires: []
  defers-to: []
  parallel-with: []
  interactive: false
  estimated-complexity: light
---

# Artifact Status

Scan `.agents/`, report state, recommend next action.

Non-orchestrated utility skill — no sub-agents or critic gate. Runs as a single pass.

## Execute

1. **Scan** `.agents/` for every `.md` file, including `.agents/meta/`. For each, read frontmatter to extract `skill:`, `date:`, `status:`, `version:`. If a field is missing or malformed, report it as `—` in the table — never silently skip a file. Meta-skill artifacts (`.agents/meta/`) are ephemeral process outputs — report them but don't include them in the dependency graph.

2. **Report** as a single table sorted by date (newest first). Mark **STALE** if `date:` is >30 days old. Include file count for glob paths (`mkt/content/*.md`).

```
| Artifact | Skill | Date | Age | Status |
|----------|-------|------|-----|--------|
| product-context.md | icp-research | 2026-03-15 | 13d | ok |
| solution-design.md | solution-design | 2026-02-10 | 46d | STALE |
| mkt/content/ | content-create | — | — | 4 files |
| spec.md | — | — | — | no frontmatter |
```

If `.agents/` doesn't exist or is empty, say so and skip to step 3.

3. **Recommend** based on the user's goal. If they gave one, trace the dependency graph backward from that goal and identify the first missing or stale artifact. If no goal, use the priority table below. For artifacts not in the table, trace the dependency graph and recommend the skill that created the missing upstream artifact.

| If this is missing/stale | Run this | Because |
|--------------------------|----------|---------|
| `product-context.md` | `/icp-research` | 12+ downstream skills depend on it |
| `market-research.md` or `problem-analysis.md` | `/market-research` or `/problem-analysis` | Feed into `/solution-design` |
| `solution-design.md` | `/solution-design` | Architecture, funnel, and comms need it |
| `targets.md` | `/funnel-planner` | Attribution and experiments need targets |
| `spec.md` | `/plan-interviewer` | Can't architect without a spec |
| `system-architecture.md` | `/system-architecture` | Can't break down tasks without architecture |
| `tasks.md` | `/task-breakdown` | Needs architecture first |
| `mkt/imc-plan.md` | `/imc-plan` | Content needs channel strategy |
| `design/brand-system.md` | `/brand-system` | Visual decisions need brand identity |
| `design/user-flow.md` | `/user-flow` | Architecture and tasks need flow context |

Don't list every missing artifact — focus on the **one or two skills that unblock the most**.

## Critical Gates

- Report must cover ALL `.md` files found in `.agents/` — no silent omissions
- Recommendation must trace the dependency graph, not just match the priority table
- When recommending a skill from another stack (research, marketing, product), flag it so the user knows they may need to install that stack

## Anti-Patterns

- **Dumping a flat list** — Don't list every missing artifact equally. Trace the graph, find the root blocker. INSTEAD: "product-context.md is missing — run `/icp-research` first, then 12+ downstream skills unlock."
- **Ignoring malformed artifacts** — An artifact with no `date:` field is still useful data. INSTEAD: report it with `—` and note the missing field.
- **Recommending deep pipeline skills when upstream is missing** — Don't suggest `/task-breakdown` when `system-architecture.md` doesn't exist. INSTEAD: trace backward and recommend `/system-architecture` (or further back if needed).

## Dependency Graph

```
product-context.md ← /icp-research
├→ market-research.md ← /market-research ─┐
├→ problem-analysis.md ← /problem-analysis ┤
│                                           ├→ solution-design.md ← /solution-design
│                                           │   ├→ targets.md ← /funnel-planner → experiment-*.md
│                                           │   ├→ mkt/imc-plan.md ← /imc-plan → mkt/content/ → mkt/*.humanized.md
│                                           │   └→ system-architecture.md ← /system-architecture
│                                           │       └→ tasks.md ← /task-breakdown
├→ spec.md ← /plan-interviewer ────────────→┘
├→ design/brand-system.md ← /brand-system
└→ design/user-flow.md ← /user-flow ──→ system-architecture.md, tasks.md
```

Trace from the user's goal back through this graph to find the first gap.
