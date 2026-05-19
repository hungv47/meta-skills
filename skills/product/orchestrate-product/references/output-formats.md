---
title: Orchestrate-Product — Output Formats
lifecycle: canonical
status: stable
produced_by: orchestrate-product
load_class: PROCEDURE
---

# Output Formats

**Load when:** Step 4 (Present + Confirm). Choose the format that matches the routing decision: single route, combined-path (design+build), process-skill (cross-stack defer to meta), or scoping fallback. Use these as templates verbatim — the structure matters for operator parseability.

---

## Format 1 — Single route

```
## Where you are

- Spec: ✅ done (.agents/skill-artifacts/meta/specs/*.md, last week)
- Flows mapped: 1 (checkout)
- Architecture: ❌ missing
- Tasks broken down: ❌ missing
- Code cleanup: not run
- Machine cleanup: not run

## What you asked

"I need to design how this feature is built" → architecture intent.

## Recommended next: system-architecture

Why: spec is done; checkout flow is mapped. system-architecture consumes
both and produces the technical blueprint (stack, schema, API, file
structure, deployment plan).

Cost: ~$1–3 · Duration: ~10 min · Produces: architecture/system-architecture.md

Note: only 1 flow is mapped. If your feature spans multiple flows
(onboarding, settings, etc.), consider running /user-flow on those
first — system-architecture is sharper with all flows in place.

→  /system-architecture
```

## Format 2 — Combined path (design + build)

```
## Where you are

- Spec: ✅ done
- Flows mapped: 0
- Architecture: ❌ missing

## What you asked

"I want to design and build this feature" → flow + architecture intent.

## Recommended path

1. /user-flow                → map the flows (one file per flow)
2. /system-architecture       → consume flows + produce blueprint
   (optional /task-breakdown after, when ready to decompose)

Each is its own skill; re-run /orchestrate-product between hops if state shifts.

→  Run /user-flow first.
```

## Format 3 — Cross-stack process route (meta-skill)

```
## What you asked

"I have a vague feature idea — help me figure out what we're building"
→ discovery intent.

## Recommended: /discover (meta-skills)

Why: scope is genuinely unclear. /discover runs an adaptive interview
(3-5 Qs for clear asks, multi-round for vague ones) and produces a
scoped spec at .agents/skill-artifacts/meta/specs/<slug>.md.

After: re-run /orchestrate-product to advance into the product pipeline
with the spec in hand.

→  /discover
```

Use the same shape for `/task-breakdown` recommendations (the other intra-pipeline meta-skill).

## Format 4 — Empty ask (scoping fallback)

When the user's argument is empty:

```
What are you trying to do? Pick the closest match:

1. Design a feature (user flows, screens, edge states)
2. Design the system (stack, schema, API)
3. Document something (README, API ref, runbook, ship log, setup guide)
4. Clean up code (refactor, dead code, duplication)
5. Clean up developer machine (caches, dotfolders)
6. Decompose into tasks (already have spec/architecture)
7. Scope something vague (`discover`)
8. I'm not sure — show me what's been done so far
```

Option 8 prints the product-stack state map (per [`state-map-template.md`](state-map-template.md) [PROCEDURE]) and asks again.

## Format conventions

- **Always include** "Where you are" for single-route + combined-path formats. Skip for cross-stack meta routes (the snapshot isn't load-bearing for "scope something vague").
- **Always include** "What you asked" — the operator's verbatim ask + the classification. Makes the routing decision auditable.
- **Always end with** `→  /skill-name` on its own line. Never auto-invoke; the arrow + slash command signals "type this next."
- **Cost + Duration + Produces** lines: include for any concrete skill recommendation (helps the operator decide). Skip only for the scoping fallback.
- **Mode-asking for `docs-writing`:** when recommending `/docs-writing`, ask which mode (README / API ref / runbook / ship-log / setup guide). Don't pick a default. (Router's mode coverage gap is documented in [`anti-patterns.md`](anti-patterns.md).)
- **Cross-stack pull-in:** if intent is architecture AND `.agents/skill-artifacts/meta/sketches/prioritize-*.md` exists, mention: "system-architecture can read `prioritize-*.md` to align technical work with business priorities."
- **Wrap-around suggestion:** if the recommendation touches security-sensitive code, data-mutation code, or critical artifacts, append: `(optional /fresh-eyes after, since this touches <reason>)`.
