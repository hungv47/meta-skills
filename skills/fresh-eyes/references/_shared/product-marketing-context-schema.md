<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

---
title: Product-Marketing Context Schema — 12-section spec for research/product-context.md
lifecycle: canonical
status: stable
produced_by: meta-skills (Phase 1C spec; icp-research adopts in Phase 2)
provenance:
  source: implementation-roadmap/execution-evaluation/briefs.md § 1.1 (IDEA-5 §1, Corey Haines product-marketing skill)
  extracted_at: 2026-05-16
consumers: every marketing and product skill (reads via before-starting-check); icp-research (writes per this schema)
load_class: PLAYBOOK
---

# Product-Marketing Context Schema

**A single 12-section context file at `research/product-context.md` that every marketing and product skill reads before asking any questions. Eliminates redundant cold starts across skills.**

This is the schema spec. The producer is `icp-research` (per [canonical-paths.md](../../implementation-roadmap/canonical-paths.md)). The Phase 2 icp-research refactor will adopt this schema; until then, the existing partial context file is the source.

**Per-project caveat:** `research/product-context.md` materializes per-project where the stack is installed, not in the agent-skills repo itself. When skills run from the agent-skills repo (maintainer context, no host project), absent product-context.md is expected — treat as fresh-project bootstrap, do not short-circuit. See [before-starting-check.md](before-starting-check.md) § "Short-circuit conditions" for the full caveat.

---

## The 12 sections (in order)

| # | Section | Purpose | Auto-draft from |
|---|---|---|---|
| 1 | **Product Overview** | One-liner, category, platform, pricing | `README.md`, `package.json` |
| 2 | **Target Audience** | Who buys, who uses, who decides | Landing page, sales pages |
| 3 | **Personas** | JTBD roles: User, Champion, Decision Maker, Financial Buyer, Technical Influencer | Customer interviews, sales notes |
| 4 | **Problems & Pain Points** | Functional, emotional, social — the three layers | Customer interviews, support tickets, reviews |
| 5 | **Competitive Landscape** | 3-5 competitors with positioning | `research/market-research.md` |
| 6 | **Differentiation** | Unique claims, unfair advantages | Operator input, sales decks |
| 7 | **Objections & Anti-Personas** | Common reasons not to buy; who would never buy | Sales call notes, churn interviews |
| 8 | **Switching Dynamics** | JTBD Four Forces: Push, Pull, Habit, Anxiety | Customer interviews, win/loss analysis |
| 9 | **Customer Language** | Verbatim quotes, NOT polished descriptions | Reviews, support, interview transcripts |
| 10 | **Brand Voice** | Formality, personality, banned words, examples | `brand/BRAND.md` |
| 11 | **Proof Points** | Stats, case studies, awards, integrations | Operator input, sales decks |
| 12 | **Goals** | Current targets, north-star metric | `README.md`, operator input |

---

## YAML frontmatter (required)

```yaml
---
skill: icp-research
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | needs_context
summary: "[product-context] <product-name> 12-section context for marketing+product skills"
purpose: "Single source of product/audience/positioning truth read by every marketing+product skill before cold-start"
lifecycle: canonical
use_when: "Before any marketing or product skill execution; before any cold-start question"
upstream: "operator interviews, research/market-research.md, brand/BRAND.md, README.md, landing pages"
downstream: "every marketing skill, every product skill (before-starting-check)"
sections_completed: [1, 2, 4, 5, 9, 10, 12]  # explicit so skills know what's stub vs filled
confidence: high | medium | low | mixed
last_validated: YYYY-MM-DD
---
```

`sections_completed` is the key field — consuming skills check this to know which sections are reliable vs stubs. A section is "completed" when it has substantive content (not "[TBD]" or "[placeholder]").

`confidence` flags overall reliability:
- **high** — sourced from interviews/data; multiple validation points
- **medium** — single source or strong operator priors
- **low** — placeholder or first-draft hypotheses
- **mixed** — varies by section (e.g., Section 1-2 high, Section 7-8 low)

---

## Section-by-section spec

### Section 1 — Product Overview

```markdown
## 1. Product Overview

**Name:** <product-name>
**Category:** <market category — e.g., "spatial note-taking app", "B2B sales enablement">
**Platform:** <macOS | iOS | Web | API | etc.>
**Pricing:** <model + price points — e.g., "$59 one-time, $29 student">
**One-liner:** <≤15 words, no jargon, what + who + why-now>
```

### Section 2 — Target Audience

```markdown
## 2. Target Audience

**Primary buyer:** <who pays — title, segment, size>
**Primary user:** <who uses daily — may = buyer or different>
**Decision maker:** <who signs off — may = buyer or different>
**Anti-audience:** <who explicitly is NOT the fit — protects against scope creep>
```

### Section 3 — Personas (JTBD roles)

Each persona is a job-to-be-done, not a demographic. Five roles to cover:

```markdown
## 3. Personas (JTBD)

### User — <persona name>
- **Job:** <what they hire the product to do>
- **Current solution:** <what they use today>
- **Frustration:** <why current solution fails>

### Champion — <persona name>
### Decision Maker — <persona name>
### Financial Buyer — <persona name>
### Technical Influencer — <persona name>
```

In single-buyer products (consumer, prosumer), User = Champion = Decision Maker = Financial Buyer. Collapse to one persona; note the collapse explicitly.

### Section 4 — Problems & Pain Points

Three layers:

```markdown
## 4. Problems & Pain Points

**Functional** (what doesn't work):
- <pain 1>
- <pain 2>

**Emotional** (how it feels):
- <feeling 1 — e.g., "anxious about losing thoughts">
- <feeling 2>

**Social** (how it affects status / relationships):
- <social pain 1 — e.g., "looks unprofessional in meetings">
```

Functional pain is the most-cited but emotional + social are why people actually switch.

### Section 5 — Competitive Landscape

3-5 competitors. For each:

```markdown
## 5. Competitive Landscape

### <Competitor 1>
- **Positioning:** <how they describe themselves in 1 line>
- **Strength:** <what they do better than us>
- **Weakness:** <where they leave a gap>
- **Pricing:** <model + price>
```

### Section 6 — Differentiation

```markdown
## 6. Differentiation

**Unique Mechanism:** <the proprietary "how" — see shared-critic-rubrics § "Mechanism Distinctness">
**Unfair advantages:** <data, network, IP, founder access>
**Claims competitors CAN'T make:** <specific, falsifiable>
```

### Section 7 — Objections & Anti-Personas

```markdown
## 7. Objections & Anti-Personas

**Top objections** (with rebuttals if any):
1. <"Too expensive" → rebuttal>
2. <"Switching cost too high" → rebuttal>

**Anti-personas** (explicitly not the fit):
- <segment 1 — why not>
- <segment 2 — why not>
```

### Section 8 — Switching Dynamics (JTBD Four Forces)

```markdown
## 8. Switching Dynamics (JTBD)

**Push** (pain with current solution):
- <push factor 1>

**Pull** (attraction of new solution):
- <pull factor 1>

**Habit** (inertia keeping them with current):
- <habit factor 1>

**Anxiety** (fear of switching):
- <anxiety factor 1>
```

To win the switch, Push + Pull > Habit + Anxiety. The four-force balance tells you where to invest copy.

### Section 9 — Customer Language

**Verbatim quotes, not polished descriptions.** This is the section copywriters and ad-copy mine.

```markdown
## 9. Customer Language

### Pain expressions
> "I keep losing track of where I put things."
> "It's like my notes are in a black hole."

### Switching expressions
> "I tried [competitor] for a month but it felt heavy."

### Outcome expressions
> "Now I can actually find a thought 2 weeks later."
```

Each quote with optional source attribution (interview ID, review URL, support ticket #).

### Section 10 — Brand Voice

```markdown
## 10. Brand Voice

**Source:** brand/BRAND.md § "Voice"
**Formality:** <scale 1-5; 1=casual, 5=formal>
**Personality traits:** <3-5 adjectives>
**Banned words:** <list — words that violate voice>
**Sample sentence (right):** <example>
**Sample sentence (wrong):** <example>
```

When `brand/BRAND.md` exists, this section cites it rather than duplicating. When it doesn't, fill the section and feed into brand-system when it runs.

### Section 11 — Proof Points

```markdown
## 11. Proof Points

**Stats** (with source + date):
- <stat 1 — source — date>

**Case studies:**
- <one-liner + URL or doc reference>

**Awards / press:**
- <award + date>

**Integrations / compatibility:**
- <list>
```

### Section 12 — Goals

```markdown
## 12. Goals

**North-star metric:** <one metric>
**Current value:** <number + date>
**Target:** <number + date>
**Constraints:** <budget, runway, team-size, time>
```

---

## Auto-draft sources (Phase 2 implementation)

The Phase 2 icp-research refactor will include an acquisition script that auto-drafts as much of the schema as possible from common sources:

| Source | Sections it fills (or stubs) |
|---|---|
| `README.md` | 1 (Product Overview), 12 (Goals) |
| `package.json` | 1 (name, description, version) |
| Landing page URL (via web scrape) | 2, 6, 11 (Target Audience, Differentiation, Proof Points) |
| `research/market-research.md` | 4, 5 (Problems, Competitive Landscape) |
| `brand/BRAND.md` | 10 (Brand Voice) |
| `skills-resources/experience/audience.md` | 3, 9 (Personas, Customer Language) |
| `skills-resources/experience/business.md` | 1 (Pricing), 12 (Goals) |

Sections 3, 7, 8, 9 require operator/customer interviews — auto-draft can only stub them.

---

## How skills read this file (before-starting-check pattern)

Every marketing and product skill applies the [before-starting-check pattern](before-starting-check.md):

```
1. Read research/product-context.md.
2. Check frontmatter `sections_completed` for the sections this skill needs.
3. If required sections are missing OR confidence is low → NEEDS_CONTEXT.
   Don't proceed with assumed values. Surface the gap; route to icp-research.
4. If sections are present → use them; do not re-ask the operator.
```

The check is the contract. Skills that re-ask questions answered in product-context.md are violating Pre-Dispatch Protocol — see [pre-dispatch-protocol.md](pre-dispatch-protocol.md).

---

## Anti-patterns

1. **Polished customer quotes.** Section 9 is verbatim. If a quote reads like marketing copy, it's been polished — get the raw version.
2. **Single persona for multi-buyer products.** Compressing User + Decision Maker + Financial Buyer into one persona hides objection sources. Use all 5 roles even if two collapse.
3. **Aspirational positioning.** Sections 2, 6 should reflect what's TRUE today, not what the team hopes will be true after the next launch. Aspirations belong in `goals` (Section 12).
4. **Stale `confidence: high`.** Confidence decays — re-validate every 90 days. A stale "high" is more dangerous than a fresh "medium."
5. **Skipping anti-personas.** Section 7's anti-persona list is what protects every downstream skill from scope creep. Without it, ad-copy targets too broad an audience, lp-brief writes for the wrong reader, etc.
6. **`sections_completed` lying.** Listing a section as complete when it's a thin paragraph. Downstream skills will trust the field and ship bad work. Mark honestly.

---

## Related refs

- [[before-starting-check]] — the pre-execution pattern every consumer skill applies
- [[pre-dispatch-protocol]] — the canonical Pre-Dispatch contract this fits into
- [[artifact-contract-template]] — frontmatter schema (this file extends it with `sections_completed`, `confidence`, `last_validated`)
- [[shared-critic-rubrics]] § "Audience Specificity" + § "Mechanism Distinctness" — critic dimensions that read this file
- `implementation-roadmap/canonical-paths.md` — confirms icp-research as the sole producer
