---
title: Agents-Panel — Report Template
lifecycle: canonical
status: stable
produced_by: agents-panel
load_class: PROCEDURE
---

# Report Template

**Load when:** standalone invocation (the operator typed `/debate-agents` directly, not invoked as a sub-routine). The orchestrator writes the rendered report to `docs/forsvn/artifacts/meta/decisions/[YYYY-MM-DD]-agents-panel-<slug>.md` — dated, skill-prefixed, slug-suffixed, immutable per-run (lifecycle: decision). Decisions accumulate as audit trail; do NOT overwrite.

When invoked as a sub-routine by another skill: return the synthesis inline (Consensus / Disagreements / Recommendation). Skip the disk write. The value is the insight, not the artifact.

---

## Frontmatter

```yaml
---
skill: debate-agents
produced_by: agents-panel
version: {skill-version}     # matches the running skill's metadata.version
date: {YYYY-MM-DD}
status: done | done_with_concerns | blocked | needs_context
stack: meta
review_surface: html       # html | md | none — html for standalone, none for sub-routine
decision_state: pending    # pending | approved | denied | suggested | not_required
review_tool: inline        # proof | inline | roughdraft | none
reviewed_at:               # YYYY-MM-DD — empty until reviewed
reviewer:                  # who recorded the review — empty until reviewed
mode: debate | poll
agents: N
rounds: R                     # debate only
provenance:
  skill: debate-agents
  run_date: {YYYY-MM-DD}
  input_artifacts: []         # agents-panel doesn't consume upstream artifacts in v1
  config_sources: []
  output_eval: null           # no downstream eval skill
---
```

## Debate report body

```markdown
# Agent Room Report

**Problem**: {problem}
**Mode**: debate
**Agents**: {N}    **Rounds**: {R}

## Participants
- Agent 1: {role / constraint}
- ...

## Consensus
- {high-confidence conclusions all agents converged on}

## Key Disagreements
- {where agents remained split, with each side's argument}

## Recommended Action
{the synthesis call — could be "go with X," "no consensus emerged, here are the two paths," or "more discovery needed before this can be decided"}

## Unresolved Risks
- {concerns raised but unresolved — risks to monitor regardless of decision}

## Debate Highlights
- {notable mind-changes, strong arguments, surprising agreements}

## Review Gate

- [ ] Approve
- [ ] Reject
- [ ] Suggest changes

Comments and suggested edits use Proof or inline CriticMarkup, depending on `review_tool`.
```

## Poll report body

```markdown
# Agent Poll Report

**Problem**: {problem}
**Mode**: poll
**Agents**: {N}
**Schema**: {ranking | recommendation | binary | scoring}

## Consensus (X+/N agreed)
- {what most agents agreed on}

## Divergences (split X/Y)
- {options where agents split, with both camps' reasoning}

## Outliers (Z/N)
- {minority opinions worth surfacing even though not consensus}

## Raw Data
{the actual ranking / scoring / vote counts — operator may want to dig in}

## High-Variance Flags
- {options where std-dev > 2 — genuine judgment calls, not consensus}

## Review Gate

- [ ] Approve
- [ ] Reject
- [ ] Suggest changes

Comments and suggested edits use Proof or inline CriticMarkup, depending on `review_tool`.
```

## Slug convention

Kebab-case `<slug>` capturing the decision topic:

- `2026-05-08-agents-panel-content-stack-direction.md`
- `2026-05-16-agents-panel-ingestion-pipeline-rebuild.md`
- `2026-05-16-agents-panel-q3-marketing-budget-poll.md`
