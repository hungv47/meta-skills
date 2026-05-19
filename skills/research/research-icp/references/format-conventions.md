# Format Conventions — icp-research

> Load when synthesis-agent assembles the ICP artifact OR when populating `research/product-context.md`. Encodes the Step 0 product-context schema, the Artifact Template (the 60+ line persona-and-narrative format consumed by 13+ downstream skills), the Canonical Terminology pattern, and date/number/citation conventions.

The schemas in this file are **cross-stack contracts**. Renaming a section, reordering fields, or changing a frontmatter key requires atomic update of downstream consumers per the `anti-patterns.md` row "Cross-stack contract drift."

---

## Step 0 — Product Context Artifact (`research/product-context.md`)

After Pre-Dispatch, generate or update `research/product-context.md` — the canonical product-context record other skills read:

```markdown
# Product Context

**Date:** [today]

## Product
[One sentence: what you sell]

## Buyer
[Primary buyer: role, company type, situation]

## Problem
[The pain it solves — in their words, not yours]

## Differentiator
[What's different — something a competitor CANNOT claim]

## Social Proof
[Best testimonial or most repeated praise]

## Model
[Price, pricing model, free trial availability]

## Voice
[3 adjectives: e.g., "direct, technical, warm"]

## Primary CTA
[What should people do next: e.g., "Start free trial"]

## Canonical Terminology
| Term | Definition | Don't use |
|------|-----------|-----------|
| [canonical term] | [precise definition] | [synonyms to avoid] |
```

**Canonical Terminology** defines shared vocabulary for product and domain. Downstream skills (campaign-plan, copywriting, humanize, lp-brief, design-brief) reference this for consistent language. Populate during scope interview — ask: "What do you call your users? Pricing tiers? Main workspace?" If no strong preferences, propose defaults from codebase (variable names, UI labels, docs).

**All marketing skills read this file for product context.**

**See also:** the canonical 12-section spec at [`_shared/product-marketing-context-schema.md`](_shared/product-marketing-context-schema.md) (synced from meta-skills via `scripts/sync-skill-support.mjs` for self-contained installs). It's an evolution target — adds business-stage, channel-history, prior-experiments, success-metrics, brand-context. The 8-section schema above is the working contract icp-research currently produces; the 12-section spec is a documentation-only target for future enrichment.

---

## Required + Optional artifacts

| Artifact | Source | If Missing |
|----------|--------|------------|
| `product-context.md` | icp-research | **INTERVIEW** for 8 product dimensions, save to `research/product-context.md`. |

| Artifact | Source | Benefit |
|----------|--------|---------|
| `diagnose.md` | diagnose (hungv47/research-skills) | Problem context sharpens audience research |

---

## Step 1 — Scope Interview (inline before dispatch)

Interview for:

1. **Who are we researching?** (Role, mindset, community, or use case)
2. **What decisions will this inform?** (Messaging? Channels? Positioning? All three?)
3. **B2C or B2B?** Geography? Segments to focus or exclude?

Answers determine route (A, B, or C) and populate the brief passed to agents. The scope interview happens AFTER Cold Start (Q1-5) but BEFORE Layer 1 dispatch — the 3 scope questions narrow the brief, while Q1-5 establish the product-context foundation.

---

## Artifact Template — `research/icp-research.md`

This is the cross-stack contract consumed by campaign-plan, brand-system, copywriting, lp-brief, design-brief, ad-copy, cold-outreach. Renaming a section or changing structure requires atomic update of all 7 consumers.

```markdown
---
skill: research-icp
version: 1
date: [today's date]
status: done | done_with_concerns | blocked | needs_context
---

# ICP Research

**Date:** [today]
**Skill:** icp-research
**Product:** [from product-context.md]

## Persona 1: [Name/Archetype]

**Demographics:** [Age, role, industry, company size]

### Pain Profile
1. **[Pain name]** — [description]
   - Trigger: [what causes acute pain]
   - Impact: [daily/financial/professional]
   - Quote: "[exact quote]" — [Platform, context]
   - Quote: "[exact quote]" — [Platform, context]

2. **[Pain name]** — [description]
   [Same format]

3. **[Pain name]** — [description]
   [Same format]

### Decision Psychology
- **Trigger:** [what event starts their search]
- **Research path:** [where they go 1st → 2nd → 3rd]
- **Key biases:** [which cognitive biases are strongest]
- **Objections:** (1) [objection] — root: [psychological reason]. (2) [objection] — root: [reason]. (3) [objection] — root: [reason].
- **Trust signals:** [what they trust]
- **Distrust triggers:** [what kills credibility]

### Habitat Map
| Platform | Community | Density | Engagement | Role |
|----------|-----------|---------|-----------|------|
| [Specific] | [Specific] | H/M/L | [Type] | [Role] |

## Persona 2: [Name/Archetype]
[Same format]

## Top 3 Emotional Drivers
1. **[Driver]** — [explanation]. Quotes: "[quote 1]" ([source]), "[quote 2]" ([source])
2. **[Driver]** — [explanation]. Quotes: ...
3. **[Driver]** — [explanation]. Quotes: ...

## Red Flags
- [Language/positioning that triggers skepticism and why]

## Next Step
Run `plan-campaign` to turn these insights into a communication plan.

> On re-run: rename existing artifact to `icp-research.v[N].md` and create new with incremented version.
```

---

## Required body sections (cross-stack contract)

In order. Renaming or reordering breaks 7+ downstream consumers.

1. **Persona 1** — Demographics + Pain Profile (1-3 pains, each with Trigger/Impact/Quote×2) + Decision Psychology (Trigger/Research path/Key biases/Objections/Trust signals/Distrust triggers) + Habitat Map (5-column table)
2. **Persona 2** (if applicable — max 2 personas per Critical Gate 3) — same format
3. **Top 3 Emotional Drivers** — exactly 3, each traced to 2+ quotes
4. **Red Flags** — bullet list of language/positioning that triggers skepticism
5. **Next Step** — verbatim block: `Run \`campaign-plan\` to turn these insights into a communication plan.`

**Optional sections (append only when applicable):** Segment Rationale (if 3+ segments surfaced and 2 were cut per Critical Gate 3 — document who was cut and why), Known Issues (when critic FAILed twice and artifact ships with annotations).

---

## Route A (Quick ICP) artifact differences

When Route A is used, the artifact has:

- Empty Decision Psychology sections (synthesis-agent inserts "Decision Psychology — skipped per Route A (Quick ICP)" placeholder)
- Empty or sparse Habitat Map (habitat-agent didn't run; synthesis-agent inserts "Habitat Map — skipped per Route A (Quick ICP); recommend re-run as Route B for IMC planning" placeholder)
- **Header annotation:** add `**Route:** A (Quick ICP) — habitat + decision psychology omitted` immediately after the `**Product:**` line.

This makes the limitation visible to downstream skills (campaign-plan in particular needs the habitat map for channel selection).

---

## Date / Number / Citation Format

- **Dates:** ISO-8601 (`YYYY-MM-DD`). Today's date in the `**Date:**` field. Stale-context warnings reference the prior artifact's date.
- **Densities:** `H` / `M` / `L` (capitalized single letters). No "High" / "Medium" / "Low" — the table format depends on the compact form.
- **Engagement types:** `Lurker` / `Engager` / `Creator` (per habitat-mapping.md taxonomy). Don't substitute synonyms.
- **Quote attribution:** `"[exact quote]" — [Platform, context]` with em-dash separator. Platform must be specific (`r/ExperiencedDevs`, not `Reddit`).
- **Cognitive biases:** Named using established terminology (`loss aversion`, `status-quo bias`, `confirmation bias`, `social proof`, ...). Don't invent terms.

---

## Version field semantics

The `version: 1` field in the frontmatter is the **artifact version**, not the skill version. Increment on re-run; rename prior artifact to `research/icp-research.v[N].md` and create new with incremented version. The Note at the bottom of the Artifact Template documents this.

The `skill: research-icp` frontmatter field is fixed (matches the skill slug per `references/manifest-spec.md`).

---

## Cross-stack consumers (reference, not contract change)

For context — downstream skills that depend on this format:

| Consumer | What it reads |
|---|---|
| campaign-plan | Personas + habitat map (channel selection) + emotional drivers (message angle) |
| brand-system | Voice (from product-context.md) + emotional drivers + red flags (positioning critique) |
| copywriting | All sections (target reader + pain + voice + objections) |
| lp-brief | Personas + decision psychology (trigger + objections + trust signals) |
| design-brief | Personas + red flags (positioning visual hierarchy) |
| ad-copy | Pain Profile + objections + trust signals |
| cold-outreach | Demographics + decision psychology trigger + research path |
| short-form-research | Habitat map (platform selection) + emotional drivers (hook angle) |
| short-form-brief | Same as short-form-research + voice |
| humanize | Voice (from product-context.md) + canonical terminology |
| seo | Canonical terminology + pain phrasing |
| social-copy | Personas + voice + emotional drivers |
| vn-tone | Voice (from product-context.md) + canonical terminology (translation glossary) |

Schema drift in this file ripples to all 13 consumers. Operator review required before any structural change.
