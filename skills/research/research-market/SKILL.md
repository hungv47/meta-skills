---
name: research-market
description: "Analyzes market landscapes, competitive dynamics, TAM/SAM/SOM sizing, and whitespace opportunities for a product or category — every claim sourced, adjacent competitors checked, sizing shown with methodology. Use to position a product, survey a competitive field, scope a new market, or build the market section of a fundraising deck. Not for building customer personas (use research-icp) or planning marketing campaigns (use plan-campaign). For diagnosing a specific business problem, see diagnose; for prioritizing what to build from market data, see prioritize."
argument-hint: "[market or product category]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "2.0.0"
  budget: deep
  estimated-cost: "$1-3"
---

# Market Research — Orchestrator

*Strategy — Entry point. Maps market landscape, competitors, and identifies gaps and opportunities.*

**Core Question:** "What does the market look like, and where are the gaps worth filling?"

[Read [`references/playbook.md`](references/playbook.md) [PLAYBOOK] for why this skill exists, four failure modes it prevents, the 11-item quality-gate summary, three-routes-by-stakes overview, Strategy-track foundational role, and when NOT to use.]

---

## Critical Gates — Read First

1. **Sources >18 months old → flag as historical, not current.** Don't present stale data as current intelligence.
2. **TAM/SAM/SOM without methodology is a guess.** Every estimate needs method (top-down/bottom-up), source, and confidence.
3. **Adjacent competitors are the highest threat — never skip the adjacent check.** Biggest threats come from adjacent categories expanding in.
4. **Never rely on training data for positions or pricing — use WebSearch.** Competitor data changes constantly; verify live.

---

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK].

0. **Mode resolution** per [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. Skill is `budget: deep`; `--fast` forces Route A (Quick Validation) — skip sizing-agent + opportunity-agent; consumer-landscape optional; critic gate collapses to single pass. `--deep` forces Route C (Fundraising / Market Entry). **Cold Start STILL fires under `--fast`** when context is missing — `--fast` does NOT authorize scoping a market with no specified category (Critical Gates 1-4 floor).
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory (`research/market-research.md`, `canonical` lifecycle).
2. Read `.forsvn/index/manifest.json` — find any prior `research/market-research.md` (re-run signal) and check `research/product-context.md` presence (consumes input — recommend `research-icp` first if missing).
3. Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE] — Warm Start with product+B2B/B2C pre-fill OR Cold Start 5-question prompt, read order, Write-back map (Q1 → product.md; Q2+Q4 → business.md; Q3 → goals.md; Q5 → audience.md — verbatim from original SKILL.md), route selection (A/B/C) all there.

---

## Quality Gate

Critic agent verifies before delivery — body checklist below is the 10-bullet operator reminder; the canonical 11-item rubric + per-section validation checks live in `agents/critic-agent.md` (the 11th item, Feature matrix Stakes/Diff classification, is critic-agent-only):

- [ ] Every claim cites source (URL or publication name)
- [ ] Competitor table: ≥3 competitors with quantified size/growth signals
- [ ] Feature comparison: ≥5 capabilities relevant to category
- [ ] Gaps & Opportunities: ≥3 distinct opportunities with evidence
- [ ] Each Top 3 opportunity: evidence source, window, risk, and "why now"
- [ ] Market trends: ≥2 quantified data points (%, $, growth rates)
- [ ] No source >18 months presented as current without historical flag
- [ ] Confidence level stated with justification
- [ ] Adjacent competitors section populated — never skipped
- [ ] TAM/SAM/SOM (if present) shows methodology, not just numbers

---

## Artifact Contract

- **Path:** `research/market-research.md` (canonical, top-level)
- **Lifecycle:** `canonical` (per `agent-skills/CLAUDE.md` taxonomy — edited in place by humans, kept forever; on re-run rename prior to `research/market-research.v[N].md` and increment)
- **Frontmatter fields:** `skill`, `version` (integer artifact version, increment on re-run), `date` (ISO-8601), `status` (per Completion Status below)
- **Required body sections (in order — cross-stack contract):** Scope · Market Trends · Market Sizing (if applicable per route) · User & Consumer Landscape · Competitive Landscape (6 sub-sections: Overview / Adjacent / Feature Comparison / Pricing / Positioning Map / Community & Mindshare) · Gaps & Opportunities (Gap Analysis 4-dimension + Top 3 Opportunities) · Limitations & Confidence · Next Step (full schema + ~90-line Artifact Template + Scope Calibration tables in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE])
- **Optional sections (append only when applicable):** Known Issues (when critic FAILed twice and artifact ships with `[REVIEWER NOTE]` annotations)
- **Side effects (mandatory on PASS or done_with_concerns per `procedures/dispatch-mechanics.md`):**
  - Write `research/market-research.md` (canonical market record)
  - Experience write-back per `procedures/pre-dispatch.md` Write-back map: Q1 (Category) → `experience/product.md`; Q2 (Geo + horizon) + Q4 (Competitors) → `experience/business.md`; Q3 (Why-now) → `experience/goals.md`; Q5 (B2B/B2C) → `experience/audience.md`. **All 5 Q's persist** (no canonical-mirror semantics; no Q-omitted-from-persistence — unlike icp-research's Q5 routing-only).
  - Rename any prior `research/market-research.md` to `research/market-research.v[N].md` on re-run
- **Required Artifacts:**

  | Artifact | Source | If Missing |
  |----------|--------|------------|
  | none | — | This is an entry point for the Strategy track |

- **Optional Artifacts:**

  | Artifact | Source | Benefit |
  |----------|--------|---------|
  | `product-context.md` | research-icp | Better competitor selection and gap identification |
  | `diagnose.md` | diagnose | Known root causes focus analysis on relevant dimensions |

- **Consumed by:** prioritize (Top 3 Opportunities feed Initiative evidence + Difficulty informs Effort scoring); research-icp (Underserved Segments inform persona scoping); architect-system (Competitive Landscape informs build-vs-buy); plan-campaign (Positioning Map + Top 3 anchor messaging; Community & Mindshare informs channel mix); fundraising deck preparation (Market Sizing + Competitive Landscape Overview + Top 3 — the "market" slide source)
- **Cross-stack OUTPUT contract:** Artifact Template structure + 8 required sections + 6 Competitive Landscape sub-sections + Top 3 Opportunities 6-column schema + Adjacent Competitors 5-column schema + Gap Analysis 4-dimension format + Next Step block are all load-bearing — schema changes require atomic update of 5+ consumers (per `anti-patterns.md` row "Cross-stack contract drift")

---

## Chain Position

**Previous:** none (Strategy track entry point) | **Next:** `prioritize`, `research-icp` (both downstream).

**Foundational role:** research-market and `diagnose` are the two entry points of the Strategy track (`parallel-with` each other). research-market creates `research/market-research.md` — the canonical market record that prioritize, architect-system, plan-campaign, and fundraising deck preparation consume.

**Re-run triggers (operator judgment):** New market entry, major competitor launch/pivot, fundraising, or quarterly for fast-moving categories.

### Skill Deference

- **MARKET landscape and gaps?** → This skill.
- **WHO the customer is, what they feel?** → `research-icp` (personas/VoC, not market maps).
- **A METRIC underperforming?** → `diagnose` (root causes, not landscapes).
- **Know the problem, need SOLUTIONS?** → `prioritize`.

---

## Agent Manifest

7 agents across 2 layers:

| Agent | Layer | Role | Input | Output |
|-------|-------|------|-------|--------|
| [trends-agent](agents/trends-agent.md) | L1 (parallel) | Market trends with direction, evidence, quantification, implication | brief + scope | Market Trends table + narrative |
| [sizing-agent](agents/sizing-agent.md) | L1 (parallel) | TAM/SAM/SOM with methods and confidence levels | brief + scope | Market Sizing table + math |
| [competitor-agent](agents/competitor-agent.md) | L1 (parallel) | Feature matrix, pricing, positioning map, community, adjacent check | brief + scope + known competitors | Competitive Landscape (6 sub-sections) |
| [consumer-landscape-agent](agents/consumer-landscape-agent.md) | L1 (parallel) | Hot topics, cultural moments, sentiment, unmet needs | brief + scope | User & Consumer Landscape |
| [cross-analysis-agent](agents/cross-analysis-agent.md) | L2 (sequential) | Synthesizes L1 outputs into gap identification across 4 dimensions | merged L1 outputs | Gaps & Opportunities (4 gap types) |
| [opportunity-agent](agents/opportunity-agent.md) | L2 (sequential) | Ranks top 3 opportunities with evidence, window, risk, "why now" | cross-analysis output + L1 context | Top 3 Opportunities (ranked) |
| [critic-agent](agents/critic-agent.md) | L2 (sequential) | Validates citations, confidence, methodology, adjacent coverage | full merged artifact | PASS or FAIL with rewrite instructions |

---

## Routing + Dispatch

Three routes; chosen at Pre-Dispatch (Q3 why-now classification or auto-inferred per `procedures/pre-dispatch.md` § "Route Selection"):

| Route | When | Graph |
|---|---|---|
| **B — Product Positioning** (default) | "Position our product", "Where do we fit?", "Competitive analysis for [product]" | L1 parallel (trends + sizing[optional] + competitor + consumer-landscape) → Research Checkpoint → L2 sequential (cross-analysis → opportunity → critic) |
| **A — Quick Validation** | "Quick check on this market", "Who are the competitors?", "Is this space crowded?"; OR `--fast` | L1 parallel (trends + competitor; consumer-landscape optional; skip sizing) → Research Checkpoint → L2 (cross-analysis → critic; skip opportunity-agent) |
| **C — Fundraising / Market Entry** | "Series A research", "Entering [market]", "Market analysis for investors", "Full market research"; OR `--deep` | All 4 L1 agents at enhanced depth (sizing REQUIRED) → Research Checkpoint → L2 sequential (cross-analysis → opportunity (quantitative 1-5 scoring) → critic) |

Mechanics (Pre-Writing Context Object construction, Layer 1/2 spawn details, Research Tool Priority hierarchy, Research Checkpoint 3-question pause, Single-Agent Fallback, Critic Gate Max-2-cycles pseudocode with Rewrite Routing Table, post-write side effects, chain position, mode-resolver interaction) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1 dispatch entry.

Scope Calibration (depth-per-section by route) lives in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE] — agents read this to set their own thoroughness.

---

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships — 11-pattern catalog (8 from original body's Anti-Patterns section expanded with detection + bad/good examples + verified agent ownership against `agents/critic-agent.md` Rewrite Routing Table) plus 3 cross-cutting failures (cross-stack contract drift, experience write-back skipped/partial, scope-blind critic evaluation) caught at orchestrator or operator level.

---

## Completion Status

Every run ends with explicit status:

- **DONE** — all 4 Layer 1 streams complete (trends, sizing, competitor, consumer-landscape), opportunities ranked, critic PASS
- **DONE_WITH_CONCERNS** — partial coverage (e.g., sizing data thin or estimated); opportunities listed with confidence flags in artifact
- **BLOCKED** — category undefined or too broad to size; needs user-supplied scope narrowing before any agent can dispatch
- **NEEDS_CONTEXT** — `research/product-context.md` absent and product not described; recommend `research-icp` first or interview the user

---

## References

| Reference | Load class | Use For |
|---|---|---|
| [playbook.md](references/playbook.md) | PLAYBOOK | Why this skill exists, four failure modes, 11-item quality-gate summary, three-routes-by-stakes overview, Strategy-track foundational role, when NOT to use |
| [_shared/before-starting-check.md](references/_shared/before-starting-check.md) | PLAYBOOK | Pre-Pre-Dispatch read pattern (canonical at `references/`, synced) |
| [_shared/mode-resolver.md](references/_shared/mode-resolver.md) | PROCEDURE | `--fast` / `--deep` behavior contract |
| [_shared/pre-dispatch-protocol.md](references/_shared/pre-dispatch-protocol.md) | PROCEDURE | Canonical Pre-Dispatch spec |
| [_shared/confidence-labeling.md](references/_shared/confidence-labeling.md) | PROCEDURE | Canonical H/M/L finding-confidence label + L-resolution rule (the Limitations & Confidence section uses it; market *sizing* confidence is calibrated separately — see `market-sizing-guide.md`) |
| [procedures/pre-dispatch.md](references/procedures/pre-dispatch.md) | PROCEDURE | 5-question Cold Start prompt, Warm Start summary, Step 0 product-context check, Step 1 Scope Interview, Write-back map (verbatim), Cold-Start-under-`--fast`, Route Selection |
| [procedures/dispatch-mechanics.md](references/procedures/dispatch-mechanics.md) | PROCEDURE | Pre-Writing Context Object, Layer 1/2 spawn details, Research Tool Priority hierarchy (Exa MCP → Firecrawl → WebSearch), Research Checkpoint 3-question pause, Single-Agent Fallback, Critic Gate Max-2-cycles + Rewrite Routing Table, post-write side effects, chain position, mode-resolver interaction |
| [format-conventions.md](references/format-conventions.md) | PROCEDURE | Artifact Template (~90 lines), Scope Calibration tables (Decision Context × Research/Competitor/Time + Section × Quick/Positioning/Fundraising), Route differences in artifact, date/number/citation format, 5 cross-stack consumers reference |
| [examples/market-walkthrough.md](references/examples/market-walkthrough.md) | EXAMPLE | Full Route B walkthrough on AI code review market case (all 11 critic gates traced through to PASS, internal sales notes integration at Research Checkpoint) |
| [anti-patterns.md](references/anti-patterns.md) | ANTI-PATTERN | 11 named anti-patterns (8 from original body + 3 cross-cutting) with detection + bad/good examples + verified agent ownership against critic-agent.md Rewrite Routing Table |
| [competitor-analysis-framework.md](references/competitor-analysis-framework.md) | data catalog | Structured competitor evaluation methodology (competitor-agent) |
| [market-sizing-guide.md](references/market-sizing-guide.md) | data catalog | TAM/SAM/SOM methods and search patterns (sizing-agent) |
| [gap-analysis-template.md](references/gap-analysis-template.md) | data catalog | Framework for opportunity identification and scoring (cross-analysis-agent + opportunity-agent) |
| `research-skills/CLAUDE.md` | reference | Stack-level conventions (Pre-Dispatch Protocol, Complexity Routing, Multi-Agent Skills) |
