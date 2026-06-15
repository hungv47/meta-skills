# Playbook — Why Market Research Exists

> Load this when you want to teach the skill to a new operator, when you're deciding whether to run this skill at all, or when downstream prioritize is generating initiatives against an unsourced market picture.

---

## Core Question

> **"What does the market look like, and where are the gaps worth filling?"**

market-research is a Strategy entry point. Its single job: turn a fuzzy market description into a sourced landscape — trends + sizing (when applicable) + competitive set (direct AND adjacent) + consumer signals + ranked opportunities — that prioritize, icp-research, system-architecture, and fundraising decks can lean on without re-litigating "is this evidence real."

---

## Why this skill exists at all

Four failure modes it prevents:

1. **Wikipedia-article output.** Describing without concluding (listing competitors and features without identifying gaps) produces an encyclopedia entry, not strategic intelligence. The cross-analysis-agent → opportunity-agent chain forces synthesis — gaps named, opportunities force-ranked.
2. **Unsourced market sizing.** "$5B market" without source or methodology is fiction that contaminates downstream prioritize ICE scores. Critical Gate 2 forces every estimate to declare method (top-down/bottom-up), source, and confidence — and the critic enforces it.
3. **Recency blindness.** Using a 2022 report for a 2026 market produces decisions against a market that no longer exists. Critical Gate 1 flags sources >18 months old as historical (not current); the critic's source-recency check is a common-failure-mode catch.
4. **Adjacent blind spots.** Biggest threats come from adjacent categories expanding in (GitHub Copilot for code-review-tool players; Notion for project-management tools). Critical Gate 3 forces the adjacent-competitor section to be populated — never skipped, never empty. The critic's adjacent-check is the most common catch in practice.

The structural answer is the **11-item quality gate** (in `agents/critic-agent.md`) — every gate maps to a specific re-dispatch agent per the Rewrite Routing table, and PASS is binary.

---

## Philosophy

Rigor scales with stakes. Weekend project = quick scan; Series A pivot = deep intel. Evidence, not opinions — every claim cites a source, every opportunity has data.

**Correctness > Verifiability > Completeness > Style.**

The skill ships three routes (Quick / Positioning / Fundraising) that scale agent depth to decision stakes. Scope Calibration in `format-conventions.md` defines exact depth-per-section by route — agents read this to set their own thoroughness.

---

## When NOT to use this skill

- **Building customer personas.** That's `research-icp` — demographics, pain, VoC, habitats, decision psychology. market-research is market-side; icp-research is audience-side. They're parallel-with peers, not substitutes.
- **Diagnosing a metric decline.** That's `diagnose` — root cause via logic tree. market-research scans the landscape; diagnose narrows on a specific underperformance.
- **Prioritizing what to build.** That's `prioritize` — ICE scoring against initiatives. market-research feeds prioritize; doesn't replace it.
- **Planning marketing campaigns from market data.** That's `plan-campaign` — channel mix, calendar, IMC. market-research informs the targeting; doesn't write the plan.
- **Quick competitor name-check.** A 1-line "who are the players in X?" doesn't warrant the 7-agent orchestration. Use Route A (Quick Validation) for trimmed scope, or just WebSearch directly for trivial queries.

---

## The 11-item quality gate

Lives in `agents/critic-agent.md`. Summary (full criteria + Rewrite Routing in the agent file):

| # | Gate | Owned by re-dispatch |
|---|---|---|
| 1 | Every factual claim cites a source with URL or publication name | producing agent (trends/sizing/competitor/consumer-landscape) |
| 2 | Overview table includes ≥3 competitors with quantified size/growth signals | competitor-agent |
| 3 | Feature comparison covers ≥5 capabilities labeled as Stakes/Diff | competitor-agent |
| 4 | Gaps & Opportunities identifies ≥3 distinct opportunities with evidence | cross-analysis-agent |
| 5 | Each Top 3 opportunity includes evidence source, window, risk, "why now" | opportunity-agent |
| 6 | Market trends include ≥2 quantified data points (%, $, growth rates) | trends-agent |
| 7 | No source >18 months presented as current without historical flag | producing agent |
| 8 | Confidence levels stated with reasoning (not just "Medium") | sizing-agent + producing agent |
| 9 | Adjacent competitors section populated with ≥2 entries — never blank or skipped | competitor-agent |
| 10 | TAM/SAM/SOM (if present) shows method (top-down/bottom-up), not just numbers; ranges not point estimates | sizing-agent |
| 11 | Feature matrix labels each feature as table stakes or differentiator | competitor-agent |

Plus per-section validation checks (in critic-agent.md Domain Instructions). The most important is the **adjacent competitor check** (Critical Gate 3 + critic gate 9) — explicitly the most common skip in practice; the critic catches it.

Max 2 rewrite cycles per `procedures/dispatch-mechanics.md`. After 2 FAIL cycles → deliver with `[REVIEWER NOTE]` annotations.

---

## Three routes by decision stakes

Scope drives route, route drives agent depth.

| Route | Trigger | Agents dispatched |
|---|---|---|
| **A — Quick Validation** | "Quick check on this market", "Who are the competitors?", "Is this space crowded?" | trends + competitor → cross-analysis → critic. Skip sizing; consumer-landscape optional; opportunity-agent skipped (cross-analysis identifies gaps directly at Quick scope). |
| **B — Product Positioning** (default) | "Position our product", "Where do we fit?", "Competitive analysis for [product]" | All 4 L1 agents (trends + sizing[optional] + competitor + consumer-landscape) → full L2 sequence (cross-analysis → opportunity → critic). |
| **C — Fundraising / Market Entry** | "Market analysis for investors", "Series A research", "Entering [market]", "Full market research" | All 4 L1 agents at enhanced depth. Sizing required (not optional). Opportunity-agent uses quantitative 1-5 scoring. Full L2 sequence. |

Scope-blind evaluation is an anti-pattern (per `agents/critic-agent.md` Anti-Patterns): don't fail a Quick validation for missing TAM/SAM/SOM; don't fail a Fundraising artifact for "only" 5 competitors. Match expectations to scope.

---

## Foundational role for Strategy track

market-research and `diagnose` are the two entry points of the Strategy track. They're `parallel-with` each other — both can run from cold, and prioritize consumes outputs from either or both.

market-research creates `docs/forsvn/canonical/research/MARKET.md` — the **canonical market record** that prioritize reads for ICE-score evidence ("how big is the SAM for this segment?"), system-architecture reads for competitive context, and campaign-plan reads for positioning anchors. Re-run triggers (operator judgment): new market entry, major competitor launch/pivot, fundraising, or quarterly for fast-moving categories.

---

## Skill deference

| Situation | Defer to |
|---|---|
| Audience personas + pain + VoC | `research-icp` (research-skills) |
| Root cause of a specific metric gap | `diagnose` (research-skills) |
| Know the problem, need solutions | `prioritize` (research-skills) |
| Channel mix and calendar from market signals | `plan-campaign` (marketing-skills) |

---

## When the critic returns FAIL

Max 2 rewrite cycles. The critic's Failure block names the section, the issue, the standard violated, the specific fix, and the agent to re-dispatch per the Rewrite Routing Table in `agents/critic-agent.md`. Re-dispatch ONLY the named agent(s) with the critic's per-agent feedback as the `feedback` field — don't re-run the full pipeline.

After 2 FAIL cycles → deliver with `[REVIEWER NOTE]` annotations and warn the operator: "Artifact delivered with quality notes — some items could not be resolved in 2 cycles." The escape valve preserves momentum; the operator can re-run with sharper inputs if the critic was right about evidence thinness.

---

## Refactor history

- **2026-05-18 (v6 Phase 2 Wave 2 — FINAL research-stack slot 8/8):** body refactored 523 → 160 lines (-69.4%, 363 lines saved — TIES diagnose at #2 absolute reduction in v6 program; behind only discover -383). 6 new refs: this playbook, `procedures/pre-dispatch.md`, `procedures/dispatch-mechanics.md`, `format-conventions.md`, `examples/market-walkthrough.md`, `anti-patterns.md` (newly extracted from body's 8 anti-patterns + expanded with detection + bad/good examples + verified agent ownership against `agents/critic-agent.md` Rewrite Routing Table). Existing 3 data-catalog refs (competitor-analysis-framework, gap-analysis-template, market-sizing-guide) untouched. 7 sub-agents (`agents/`) untouched — including the canonical 11-item quality gate in critic-agent.md. **Research-stack refactor COMPLETE — all 8 skills shipped.** Cross-stack contract preserved BYTE-IDENTICAL (consumed by prioritize, system-architecture, campaign-plan, fundraising-deck readers):
  - 4 Critical Gates
  - Frontmatter (skill, version, date, status)
  - Quality Gate 11-bullet checklist
  - Agent Manifest 7-agent table
  - Routes A/B/C with graphs
  - Scope Calibration tables (Decision Context × Research/Competitor/Time + Section × Quick/Positioning/Fundraising)
  - Layer 1 + Layer 2 dispatch tables (incl. Research Tool Priority hierarchy: Exa MCP → Firecrawl → WebSearch)
  - Research Checkpoint 3-question pause between L1 and L2
  - Artifact Template (~90 lines: Scope + Market Trends + Market Sizing + Consumer Landscape + Competitive Landscape with 6 sub-sections + Gaps & Opportunities with 4 dimensions + Top 3 Opportunities + Limitations & Confidence + Next Step + version-rename note)
  - Critic Gate Max-2-cycles pseudocode semantics
  - Required + Optional Artifacts tables
  - Completion Status 4-tier
  - Chain Position + Skill Deference + Re-run triggers
  - Write-back 5-row map (Q1 → product.md category; Q2 → business.md geo+horizon; Q3 → goals.md trigger; Q4 → business.md competitors; Q5 → audience.md B2B/B2C — preserved verbatim from original SKILL.md lines 131-139 per anti-smuggle rule)
