---
name: research-market
description: "Map market landscape, competitive dynamics, TAM/SAM/SOM sizing, whitespace opportunities — every claim sourced, adjacent competitors checked, sizing shown with methodology. Use to position a product, survey a competitive field, scope a new market, or build the market section of a fundraising deck. Not for personas (use research-icp), campaigns (use plan-campaign), problem diagnosis (use diagnose), or prioritization (use prioritize)."
argument-hint: "[market or product category]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$1-3"
---

# Market Research — Orchestrator

Strategy track entry point. Maps market landscape, competitors, identifies gaps and opportunities. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Agent table + 3 routes + Research Checkpoint: [`references/agent-manifest.md`](references/agent-manifest.md). Methodology + four failure modes + when NOT to use: [`references/playbook.md`](references/playbook.md).

**Core question:** What does the market look like, and where are the gaps worth filling?

## Critical Gates — load first

1. **Sources >18 months old → flag as historical, not current.** Don't present stale data as current intelligence.
2. **TAM/SAM/SOM without methodology is a guess.** Every estimate needs method (top-down/bottom-up), source, and confidence.
3. **Adjacent competitors are the highest threat — never skip the adjacent check.** Biggest threats come from adjacent categories expanding in.
4. **Never rely on training data for positions or pricing — use WebSearch.** Competitor data changes constantly; verify live.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Then:

- **Mode resolution** ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)). `budget: deep`. `--fast` forces Route A (Quick Validation) — skip sizing + opportunity agents; consumer-landscape optional; critic gate collapses to single pass. `--deep` forces Route C. **Cold Start STILL fires under `--fast`** when context is missing — `--fast` does NOT authorize scoping a market with no specified category (Critical Gates 1-4 floor).
- `references/_shared/execution-policy.md` — session execution profile (single-vs-multi)
- Read `.forsvn/index/manifest.json` — find any prior `id:market-research` at `docs/forsvn/canonical/research/MARKET.md` (re-run signal); check `id:product-context` resolves (recommend `research-icp` first if missing).
- Run Pre-Dispatch per [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) — Warm Start with product+B2B/B2C pre-fill OR Cold Start 5-question prompt, Write-back map (Q1 → product.md; Q2+Q4 → business.md; Q3 → goals.md; Q5 → audience.md — all 5 Q's persist), route selection (A/B/C).

## Quality Gate — 10 operator bullets (11 in critic-agent)

Critic agent verifies before delivery. 11th item (Feature matrix Stakes/Diff classification) is critic-agent-only. Full canonical rubric in `agents/critic-agent.md`.

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

## Artifact Contract

- **Path:** `docs/forsvn/canonical/research/MARKET.md` (canonical singleton; `id: market-research`).
- **Lifecycle:** `canonical` — edited in place by humans; on re-run **overwrite `docs/forsvn/canonical/research/MARKET.md` in place and increment the integer `version:`** (prior versions live in git history; never create a `.v[N].md` sibling under `canonical/`).
- **Frontmatter:** `skill`, `version` (integer artifact version), `date` (ISO-8601), `status`, `stack` (=research), `review_surface` (=html — the forsvn-preview review module renders the themed preview while `decision_state: pending`), `id` (=`market-research`), `type` (=`canonical`), `keywords`, `decision_state`. See [`references/_shared/artifact-contract-template.md`](references/_shared/artifact-contract-template.md) for the v3 schema.
- **Required body sections (in order — cross-stack contract):** Scope · Market Trends · Market Sizing (if applicable per route) · User & Consumer Landscape · Competitive Landscape (6 sub-sections: Overview / Adjacent / Feature Comparison / Pricing / Positioning Map / Community & Mindshare) · Gaps & Opportunities (Gap Analysis 4-dimension + Top 3 Opportunities) · Limitations & Confidence · Next Step. Full template (~90 lines) + Scope Calibration tables: [`references/format-conventions.md`](references/format-conventions.md).
- **Optional sections:** Known Issues (when critic FAILed twice and artifact ships with `[REVIEWER NOTE]` annotations).
- **Side effects (mandatory on PASS / done_with_concerns):**
  - Write `docs/forsvn/canonical/research/MARKET.md`.
  - Experience write-back per Write-back map: Q1 → `experience/product.md`; Q2+Q4 → `experience/business.md`; Q3 → `experience/goals.md`; Q5 → `experience/audience.md`. **All 5 Q's persist** (unlike research-icp's Q5 routing-only).
  - On re-run, overwrite `docs/forsvn/canonical/research/MARKET.md` in place and increment the integer `version:` (no `.v[N].md` sibling).
- **Consumed by:** prioritize (Top 3 Opportunities feed Initiative evidence + Difficulty informs Effort scoring) · research-icp (Underserved Segments inform persona scoping) · architect-system (Competitive Landscape informs build-vs-buy) · plan-campaign (Positioning Map + Top 3 anchor messaging; Community & Mindshare informs channel mix) · fundraising deck preparation (Market Sizing + Competitive Landscape Overview + Top 3 — the "market" slide source).
- **Cross-stack OUTPUT contract:** Artifact Template structure + 8 required sections + 6 Competitive Landscape sub-sections + Top 3 Opportunities 6-column schema + Adjacent Competitors 5-column schema + Gap Analysis 4-dimension format + Next Step block are load-bearing — schema changes require atomic update of 5+ consumers.

## Chain Position

**Previous:** none (Strategy track entry point) | **Next:** `prioritize`, `research-icp` (both downstream).

**Foundational role:** research-market and `diagnose` are the two entry points of the Strategy track (`parallel-with` each other). research-market creates the canonical market record that prioritize, architect-system, plan-campaign, and fundraising deck preparation consume.

**Re-run triggers:** new market entry, major competitor launch/pivot, fundraising, quarterly for fast-moving categories.

**Skill deference:** MARKET landscape and gaps → this skill. WHO the customer is, what they feel → `research-icp`. A METRIC underperforming → `diagnose`. Know the problem, need SOLUTIONS → `prioritize`.

## Routing

Three routes (A / B / C) — chosen at Pre-Dispatch (Q3 why-now classification or auto-inferred). Full route graphs + Research Checkpoint mechanics + Critic FAIL routing: [`references/agent-manifest.md`](references/agent-manifest.md). Spawn mechanics + Single-Agent Fallback + post-write side effects + chain position: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md).

## Anti-Patterns

Read [`references/anti-patterns.md`](references/anti-patterns.md) before output ships — 11 patterns (8 from original + 3 cross-cutting: cross-stack contract drift, experience write-back skipped/partial, scope-blind critic evaluation). Per-pattern detection + bad/good examples + agent ownership.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — all 4 Layer 1 streams complete (trends, sizing, competitor, consumer-landscape), opportunities ranked, critic PASS.
- **DONE_WITH_CONCERNS** — partial coverage (sizing data thin or estimated); opportunities listed with confidence flags.
- **BLOCKED** — category undefined or too broad to size; needs user-supplied scope narrowing before any agent can dispatch.
- **NEEDS_CONTEXT** — `research/product-context.md` absent and product not described; recommend `research-icp` first or interview the user.
