---
title: Orchestrate-Meta — Output Formats
lifecycle: canonical
status: stable
produced_by: orchestrate-meta
load_class: PROCEDURE
---

# Output Formats

**Load when:** Step 4 (Present + Confirm). Choose the format that matches the routing decision: single-domain, cross-stack, or process-skill. Use these as templates verbatim — the structure matters for operator parseability.

---

## Format 1 — Single-domain route

```
## Where you are (cross-stack snapshot)

Research:   icp ✅ · market ❌ · prioritize ❌
Marketing:  brand ❌ · campaign ❌ · content (none)
Product:    spec ❌ · flows (none) · architecture ❌
Meta:       no reports yet

## What you asked

"I want to figure out who my customers are" → research domain.

## Recommended: route to /orchestrate-research

Why: this is a research-domain task. /orchestrate-research will read the
research-stack state and propose the next skill (likely icp-research).

→  /orchestrate-research
```

## Format 2 — Cross-stack path

```
## What you asked

"I want to launch a new product feature" → cross-stack (research + product + marketing).

## Recommended path

1. /orchestrate-research        → verify audience clarity for the feature
2. /orchestrate-product         → design flows + architecture
3. /orchestrate-marketing       → positioning, LP, content for launch
   (optional /fresh-eyes after each artifact)

Each /orchestrate-X is its own router; you'll get sub-recommendations from each.

→  Run /orchestrate-research first.
```

## Format 3 — Process skill

```
## What you asked

"I just finished implementing the auth migration — can you review it?"
→ process intent: post-implementation review.

## Recommended: /fresh-eyes

Why: post-implementation independent review. Runs an independent
agent against your changes, returns issues + severity.

Cost: ~$0.15-0.50 · Duration: ~3 min · Produces: .agents/skill-artifacts/meta/records/[date]-fresh-eyes-<slug>.md

→  /fresh-eyes
```

## Format 4 — Empty ask (scoping fallback)

When the user's argument is empty:

```
What are you trying to do? Pick the closest match:

1. Understand my customers / market / problem (research)
2. Build brand / campaigns / content (marketing)
3. Design a feature / system / flow (product)
4. Scope something vague (`discover`)
5. Debate a decision (`agents-panel`)
6. Decompose work into tasks (`task-breakdown`)
7. Review work I just did (`fresh-eyes`)
8. I'm not sure — show me what's been done so far
```

Option 8 prints the cross-stack state map (per [`state-map-template.md`](state-map-template.md) [PROCEDURE]) and asks again.

## Format conventions

- **Always include** the "Where you are" snapshot for single-domain + cross-stack routes. Skip for process-skill routes (the snapshot isn't load-bearing for "review my code").
- **Always include** "What you asked" — the operator's verbatim ask + the classification. Makes the routing decision auditable.
- **Always end with** `→  /skill-name` on its own line. Never auto-invoke; the arrow + slash command signals "type this next."
- **Wrap-around suggestion:** if the recommendation touches security-sensitive code, data-mutation code, or critical artifacts, append: `(optional /fresh-eyes after, since this touches <reason>)`.
- **Cost + Duration + Produces** lines: include for process-skill recommendations (they help the operator decide). Optional for stack-orchestrator recommendations (the stack orchestrator surfaces its own cost).
