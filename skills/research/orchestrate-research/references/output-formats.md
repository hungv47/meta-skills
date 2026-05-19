---
title: Orchestrate-Research — Output Formats
lifecycle: canonical
status: stable
produced_by: orchestrate-research
load_class: PROCEDURE
---

# Output Formats

**Load when:** Step 4 (Present + Confirm). Choose the format that matches the routing decision: single route, combined-path (multi-step pipeline), process-skill (cross-stack defer to meta), or scoping fallback. Use these as templates verbatim — the structure matters for operator parseability.

---

## Format 1 — Single route

```
## Where you are

- ICP foundation: ✅ done (research/icp-research.md, 2 weeks old)
- Market landscape: ❌ missing
- Problem diagnosis: ⊘ n/a (no specific problem in your ask)
- Prioritization: ❌ missing
- Funnel targets: ❌ missing

## What you asked

"I want to understand my market" → market-mapping intent.

## Recommended next: market-research

Why: ICP foundation is in place; market-research consumes it and produces
the landscape your prioritize step will need.

Cost: ~$1–3 · Duration: ~10 min · Produces: research/market-research.md

→  /market-research
```

## Format 2 — Combined path (multi-step pipeline)

```
## Where you are

- ICP foundation: ❌ missing
- Market landscape: ❌ missing
- Prioritization: ❌ missing

## What you asked

"I want to understand my customer and figure out what to build" →
audience-research + option-ranking intent.

## Recommended path

1. /icp-research              → establish audience foundation (cross-stack canonical)
2. /market-research            → consume ICP + produce landscape
3. /prioritize                 → consume both + rank initiatives
   (optional /funnel-planner after, if you need numeric targets)

Each is its own skill; re-run /orchestrate-research between hops if state shifts.

→  Run /icp-research first.
```

## Format 3 — Cross-stack process route (meta-skill or stack handoff)

```
## What you asked

"All 5 core artifacts exist and look fresh — what's next?"
→ research pipeline exhausted.

## Recommended: /orchestrate-marketing (or /orchestrate-product)

Why: research stack has done its job (ICP + market + diagnose + prioritize +
funnel targets all in place). The natural next move is to translate strategy
into execution — marketing (brand, campaign, copy, LP, SEO) or product
(user-flow, system-architecture, code, docs).

→  /orchestrate-marketing      (if next step is brand / campaign / content)
→  /orchestrate-product         (if next step is feature / system / code)
```

Use the same shape for `/discover` recommendations when scope is genuinely unclear before the research pipeline can begin.

## Format 4 — Empty ask (scoping fallback)

When the user's argument is empty:

```
What are you trying to learn? Pick the closest match:

1. Who's actually buying this / who should be (audience)
2. What the market and competitors look like (landscape)
3. Why a specific metric is moving the wrong way (diagnose)
4. Which initiative to bet on next (prioritize)
5. Whether the revenue math actually works (targets)
6. What's working right now on short-form for a topic (per-platform research)
7. I'm not sure — show me what's been done so far
```

Option 7 prints the research-stack state map (per [`state-map-template.md`](state-map-template.md) [PROCEDURE]) and asks again.

## Format conventions

- **Always include** "Where you are" for single-route + combined-path formats. Skip for cross-stack process routes (the snapshot isn't load-bearing for "scope something vague" or "research stack exhausted").
- **Always include** "What you asked" — the operator's verbatim ask + the classification. Makes the routing decision auditable.
- **Always end with** `→  /skill-name` on its own line. Never auto-invoke; the arrow + slash command signals "type this next."
- **Cost + Duration + Produces** lines: include for any concrete skill recommendation (helps the operator decide). Skip only for the scoping fallback.
- **Multi-option presentation:** when routing rule 6 fires (icp done + ambiguous intent), show 2-3 options with one-line rationale each. Don't pick for the operator.
- **Stale-ICP warning:** if ICP exists but is stale, include the warning line in "Where you are" and offer refresh as an option in the recommendation ("Refresh ICP first or proceed with current?").
- **Skip-rule respect:** if the operator explicitly says "I just want X" without upstream artifacts, route to X BUT include the quality-drop caveat in the Why line ("Without market-research, prioritize will rely on whatever context you put in the prompt").
- **Short-form-research is standalone:** never bundle it into the audience/market/strategy pipeline. When operator's ask is platform-specific ("research TikTok trends for X"), route as Format 1 with the platform argument; the marketing-side `short-form-brief` is the natural next step but lives in a different stack — flag it as a cross-stack handoff.
- **Wrap-around suggestion:** if the recommendation touches a high-stakes decision (e.g., prioritize feeding a launch), append: `(optional /fresh-eyes after, since this output gates downstream work)`.
