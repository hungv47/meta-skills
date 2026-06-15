# Format Conventions — market-research

> Load when synthesis (cross-analysis + opportunity + critic) assembles the final artifact. Encodes the Scope Calibration tables (depth-per-section by route), the Artifact Template (the ~90-line cross-stack-contract format consumed by prioritize, system-architecture, campaign-plan, fundraising-deck readers), and date/number/citation conventions.

The schemas in this file are **cross-stack contracts**. Renaming a section, reordering fields, or changing a frontmatter key requires atomic update of downstream consumers per the `anti-patterns.md` row "Cross-stack contract drift."

---

## Scope Calibration — by Decision Context

| Decision Context | Research Depth | Competitor Depth | Time Investment |
|-----------------|---------------|-----------------|----------------|
| Quick validation | 3-5 competitors, top-level features | Surface (pricing, positioning) | Light |
| Product positioning | 5-8 competitors, detailed features | Deep (features, community, growth) | Medium |
| Fundraising / market entry | 8-12+ competitors, full landscape | Comprehensive (all dimensions) | Heavy |

---

## Scope Calibration — by Section × Route

| Section | Quick (Route A) | Positioning (Route B) | Fundraising (Route C) |
|---------|-------|-------------|-------------|
| Market Trends | 2-3 trends, skip narrative | 3-5 trends + narrative | 5+ trends + narrative |
| Market Sizing | Skip | Optional (SAM estimate) | Required (TAM/SAM/SOM) |
| Feature Comparison | Top 5 features + type labels | 5-8 features + type labels | 8+ features + type labels |
| Pricing | Entry price + model only | Full pricing table | Full table + hidden costs |
| Positioning Map | Skip | Include | Include + adjacent entrants |
| Community & Mindshare | Skip | Top 3 competitors | All competitors |
| Gaps & Opportunities | Top 3 opportunities | Full 4-dimension analysis | Full analysis + scoring from reference |

Scope-blind evaluation is an anti-pattern (per `agents/critic-agent.md` Anti-Patterns): don't fail a Quick validation for missing TAM/SAM/SOM; don't fail a Fundraising artifact for "only" 5 competitors.

---

## Artifact Template — `docs/forsvn/canonical/research/MARKET.md`

This is the cross-stack contract consumed by prioritize (Top 3 Opportunities feed Initiative hypothesis evidence), system-architecture (competitive context informs product decisions), campaign-plan (positioning anchors), and fundraising decks (sizing + competitive landscape). Renaming a section or changing structure requires atomic update of consumers.

On re-run: overwrite `docs/forsvn/canonical/research/MARKET.md` in place and increment the integer `version:` (prior versions live in git history; never create a `.v[N].md` sibling under `canonical/`).

```markdown
---
skill: research-market
version: 1
date: {{today}}
status: done | done_with_concerns | blocked | needs_context
stack: research
review_surface: html
id: market-research
type: canonical
keywords: [market-research, competitive-landscape, market-sizing, tam-sam-som, whitespace, opportunities]
---

# Market Research

## Scope

**Market:** [product category / industry]
**Geography:** [scope]
**Decision context:** [what this research informs]
**Date:** [today]

## Market Trends

| Trend | Direction | Evidence | Quantification | Implication |
|-------|-----------|----------|---------------|-------------|

**Narrative:** [2-3 paragraph market story connecting trends]

## Market Sizing (if applicable)

| Metric | Method | Estimate | Source | Confidence |
|--------|--------|----------|--------|-----------|

## User & Consumer Landscape

| Dimension | Findings | Source |
|-----------|----------|--------|

## Competitive Landscape

### Overview
| Competitor | Founded | Funding/Revenue | Team Size | Target Segment | Positioning | Threat |
|-----------|---------|----------------|-----------|---------------|-------------|--------|

### Adjacent Competitors
| Adjacent Category | Player | Why They Could Enter | Likelihood | Signal to Watch |
|------------------|--------|---------------------|-----------|----------------|

### Feature Comparison
| Capability | [Your Product] | Competitor A | Competitor B | Competitor C |
|-----------|---------------|-------------|-------------|-------------|

### Pricing
| Competitor | Free Tier | Entry Price | Mid Tier | Enterprise | Model |
|-----------|-----------|------------|----------|-----------|-------|

### Positioning Map
[2-axis positioning map: axes selected from buyer decision criteria]

### Community & Mindshare
| Competitor | Community Size | Activity Level | Sentiment | Share of Voice |
|-----------|---------------|---------------|-----------|---------------|

## Gaps & Opportunities

### Gap Analysis (4 dimensions)

| Dimension | Gap | Evidence | Demand Signal | Difficulty |
|-----------|-----|----------|---------------|-----------|
| Underserved Segment | [Segment] | [Evidence] | [Signal] | — |
| Feature Gap | [Gap] | [User need] | [Evidence] | S/M/L |
| Emerging Trend | [Trend] | [Incumbent response] | [Opportunity window] | — |
| Positioning White Space | [Position] | [Why empty] | [Risk] | — |

### Top 3 Opportunities

| # | Opportunity | Evidence Source | Window | Risk | Why Now |
|---|------------|---------------|--------|------|---------|

## Limitations & Confidence

| Aspect | Confidence | Justification |
|--------|-----------|---------------|

> The Confidence column uses the H/M/L finding-confidence label per [`_shared/confidence-labeling.md`](_shared/confidence-labeling.md) § 1–§ 3 — every cell states its basis (no bare "Medium"; see that file's anti-pattern § 6.3), and any `L` finding is resolved or flagged per § 4. Market *sizing* estimates are scored on a separate top-down/bottom-up triangulation calibration — see [`market-sizing-guide.md`](market-sizing-guide.md) — not this source-count rubric.

**Data gaps:** [What couldn't be found]

## Next Step

Run `prioritize` to turn top opportunities into prioritized initiatives, or `research-icp` to build personas for identified underserved segments.
```

---

## Required body sections (cross-stack contract)

In order. Renaming or reordering breaks 4+ downstream consumers.

1. **Scope** — Market / Geography / Decision context / Date
2. **Market Trends** — 5-column table (Trend | Direction | Evidence | Quantification | Implication) + Narrative (Routes B + C only; Route A skips narrative)
3. **Market Sizing** — 5-column table (Metric | Method | Estimate | Source | Confidence) — Route C required; Route B optional; Route A skip
4. **User & Consumer Landscape** — 3-column table (Dimension | Findings | Source) — Routes B + C required; Route A optional
5. **Competitive Landscape** with 6 sub-sections:
   - Overview (7-column threat table)
   - Adjacent Competitors (5-column table — NEVER blank per Critical Gate 3)
   - Feature Comparison (capability × competitor matrix with Stakes/Diff labels)
   - Pricing (6-column table)
   - Positioning Map (2-axis from buyer decision criteria)
   - Community & Mindshare (5-column table)
6. **Gaps & Opportunities** with two sub-sections:
   - Gap Analysis (4 dimensions × 5-column table)
   - Top 3 Opportunities (6-column ranked table — Route C uses quantitative 1-5 scoring)
7. **Limitations & Confidence** — 3-column table + Data gaps prose
8. **Next Step** — verbatim block: `Run \`prioritize\` to turn top opportunities into prioritized initiatives, or \`icp-research\` to build personas for identified underserved segments.`

**Optional sections (append only when applicable):** Known Issues (when critic FAILed twice and artifact ships with `[REVIEWER NOTE]` annotations).

---

## Route differences in artifact

**Route A (Quick Validation):**
- Skip Market Sizing section entirely
- Skip Positioning Map sub-section
- Skip Community & Mindshare sub-section
- Skip Top 3 Opportunities (cross-analysis identifies gaps directly; no opportunity-agent dispatch)
- Header annotation: add `**Route:** A (Quick Validation) — sizing / opportunities omitted` immediately after the `**Decision context:**` line

**Route C (Fundraising / Market Entry):**
- Market Sizing REQUIRED (not optional)
- Top 3 Opportunities use quantitative 1-5 scoring (visible in the table)
- Header annotation: add `**Route:** C (Fundraising / Market Entry) — full depth` immediately after the `**Decision context:**` line

**Route B (Product Positioning, default):**
- All sections produced at standard depth per the Scope Calibration table

---

## Date / Number / Citation Format

- **Dates:** ISO-8601 (`YYYY-MM-DD`). Today's date in the `**Date:**` field. Source dates flagged prominently per Critical Gate 1 (>18 months = historical).
- **Estimates:** Always as ranges, not point estimates (per critic-agent.md Validation Checks > Market Sizing). `$2B–$3B` not `$2.4B`.
- **Confidence levels:** Stated with reasoning (per critic gate 8). Not just "Medium" — "Medium (top-down triangulation from 2 sources, no bottom-up validation)."
- **Source citations:** URL or publication name. Inline like `(Source: GitHub Octoverse 2025)` or as a footnote. Every factual claim.
- **Threat levels:** `Critical / High / Medium / Low / Watch` with justification (per anti-pattern "Treating all competitors as equal threats").
- **Feature classification:** Each feature in the Feature Comparison matrix labeled as `Stakes` (table stakes — every competitor has it) or `Diff` (differentiator — only some have it).

---

## Version field semantics

The `version: 1` field in the frontmatter is the **artifact version**, not the skill version. Increment on re-run; overwrite `docs/forsvn/canonical/research/MARKET.md` in place (prior versions live in git history; never create a `.v[N].md` sibling under `canonical/`). The Note at the top of the Artifact Template documents this.

The `skill: research-market` frontmatter field is fixed (matches the skill slug per `references/_shared/manifest-spec.md`).

---

## Cross-stack consumers (reference, not contract change)

For context — downstream skills that depend on this format:

| Consumer | What it reads |
|---|---|
| prioritize | Top 3 Opportunities (Evidence Source + Window + Risk + Why Now) feed Initiative hypothesis "because" clauses; Gap Analysis "Difficulty" column informs Effort scoring |
| icp-research | Underserved Segments inform persona scoping (when to expand from 1 to 2 personas; which segment to lead with) |
| system-architecture | Competitive Landscape (Overview + Feature Comparison + Adjacent Competitors) informs build-vs-buy + architectural differentiation decisions |
| campaign-plan | Positioning Map + Top 3 Opportunities anchor campaign messaging; Community & Mindshare informs channel mix |
| fundraising-deck (external) | Market Sizing (TAM/SAM/SOM with methodology) + Competitive Landscape Overview + Top 3 Opportunities — the standard "market" slide source |

Schema drift in this file ripples to all 5 consumers. Operator review required before any structural change.
