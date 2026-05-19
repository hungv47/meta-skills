---
title: Orchestrate-Marketing — Output Formats
lifecycle: canonical
status: stable
produced_by: orchestrate-marketing
load_class: PROCEDURE
---

# Output Formats

**Load when:** Step 4 (Present + Confirm). Choose the format that matches the routing decision: single route, combined-path (multi-step pipeline), process-skill (cross-stack defer to meta), or scoping fallback. Use these as templates verbatim — the structure matters for operator parseability.

---

## Format 1 — Single route

```
## Where you are

- ICP foundation: ✅ done (research/icp-research.md, 1 month old)
- Brand narrative: ✅ done (brand/BRAND.md)
- Brand design: ✅ done (brand/DESIGN.md)
- Campaign plan: ❌ missing
- Content produced: hero-copy.md, about-page.md
- LP briefs: not run
- SEO: not run
- Short-form: not run

## What you asked

"I want to plan how we go to market" → campaign-planning intent.

## Recommended next: campaign-plan

Why: brand foundation + ICP are in place. campaign-plan consumes both
and produces the channel strategy + content calendar that downstream
skills (copywriting, seo, short-form-brief, cold-outreach, ad-copy) hang off.

Cost: ~$1–3 · Duration: ~10 min · Produces: .agents/skill-artifacts/mkt/campaign-plan.md

→  /campaign-plan
```

## Format 2 — Combined path (multi-step pipeline)

```
## Where you are

- ICP foundation: ✅ done (research/icp-research.md)
- Brand narrative: ❌ missing
- Brand design: ❌ missing
- Campaign plan: ❌ missing
- Content produced: none

## What you asked

"I want to launch a new product — need brand, plan, and content" →
brand-foundation + campaign-planning + copy-production intent.

## Recommended path

1. /brand-system               → establish voice + design tokens (consumed by every content skill)
2. /campaign-plan              → consume brand + ICP + produce channel strategy
3. /copywriting OR /lp-brief   → produce specific copy (pick based on surface)
   (optional /humanize after copy for AI-pattern strip + voice injection)

Each is its own skill; re-run /orchestrate-marketing between hops if state shifts.

→  Run /brand-system first.
```

## Format 3 — Cross-stack process route (meta-skill or stack handoff)

```
## What you asked

"All marketing artifacts exist and look fresh — what's next?"
→ marketing pipeline exhausted.

## Recommended: /orchestrate-product (or /orchestrate-research)

Why: marketing stack has done its job (brand + campaign + content + eval all
in place). The natural next move is to translate execution into product or
revisit research — product (user-flow, system-architecture, code, docs) if
the product itself needs build/refinement work, or research (icp-research
refresh, market-research re-mapping) if the audience has shifted.

→  /orchestrate-product         (if next step is feature / system / code)
→  /orchestrate-research        (if next step is audience or market re-mapping)
→  /orchestrate-meta            (if next step spans multiple stacks)
```

Use the same shape for `/discover` recommendations when scope is genuinely unclear before the marketing pipeline can begin.

## Format 4 — Empty ask (scoping fallback)

When the user's argument is empty:

```
What are you trying to do? Pick the closest match:

1. Set up brand foundation (voice, design system, ASSETS.md)
2. Plan a campaign (channels, calendar, GTM)
3. Produce specific content (copy, LP, social post, video brief, ad, email, design brief)
4. Evaluate launched landing-page performance (analytics → loop cycle)
5. Polish existing text (humanize AI-sounding copy / Vietnamese register polish)
6. I'm not sure — show me what's been done so far
```

Option 6 prints the marketing-stack state map (per [`state-map-template.md`](state-map-template.md) [PROCEDURE]) and asks again.

## Format conventions

- **Always include** "Where you are" for single-route + combined-path formats. Skip for cross-stack process routes (the snapshot isn't load-bearing for "scope something vague" or "marketing stack exhausted").
- **Always include** "What you asked" — the operator's verbatim ask + the classification. Makes the routing decision auditable.
- **Always end with** `→  /skill-name` on its own line. Never auto-invoke; the arrow + slash command signals "type this next."
- **Cost + Duration + Produces** lines: include for any concrete skill recommendation (helps the operator decide). Skip only for the scoping fallback.
- **Multi-option presentation:** when ambiguity rule fires (intent matches 2+ buckets), show 2-3 options with one-line rationale each. Don't pick for the operator.
- **Stale-brand warning:** if BRAND.md exists but is stale (>180 days), include the warning line in "Where you are" and offer refresh as an option in the recommendation ("Refresh brand first or proceed with current?").
- **Skip-rule respect:** if the operator explicitly says "I just want X" without upstream artifacts, route to X BUT include the quality-drop caveat in the Why line ("Without brand-system, copywriting will rely on whatever voice signal you put in the prompt").
- **lp-brief vs lp-eval routing is intent-driven:** "build / redesign / new LP / hero section" → lp-brief; "analytics / experiment results / heatmap / GA4 / post-launch CRO" → lp-eval (requires eval-loop workspace; propose /eval-loop first if missing).
- **ad-copy audience-temp prompt:** ad-copy is single-audience-temp-per-invocation. When routing to ad-copy, ALWAYS ask which audience-temperature (retargeting / cold) — single-temp per invocation; run twice for campaigns spanning both. Meta-only at v1.
- **social-copy single-platform prompt:** social-copy is single-platform-per-invocation. When routing to social-copy, ALWAYS ask which platform (tiktok / reels / shorts / x / linkedin). Multi-platform = re-invoke per platform.
- **short-form-brief cross-stack dependency:** routing to short-form-brief requires a matching `.agents/skill-artifacts/research/short-form-research/[slug].md` catalog (from research-skills). If missing, recommend `/short-form-research` first in research-skills (cross-stack flag).
- **Polish chain mention:** if user is producing copy AND a `skills-resources/experience/content.md` says brand_mode=founder OR market includes Vietnamese, mention humanize/vn-tone as the terminal step after the generation skill.
- **Wrap-around suggestion:** if the recommendation touches a high-stakes decision (e.g., lp-brief feeding a launch, ad-copy feeding a paid campaign), append: `(optional /fresh-eyes after, since this output gates downstream work)`.
