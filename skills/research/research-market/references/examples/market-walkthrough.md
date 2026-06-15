# Example — AI Code Review Market Walkthrough (Route B)

> Load when an operator is learning the skill OR when synthesis (cross-analysis + opportunity) needs to see a worked example of the dispatch → checkpoint → critic → PASS arc end-to-end. Preserved from the original SKILL.md worked example with the 11 critic gates traced through. Illustrative not prescriptive — the specific competitors, trends, and opportunities are 2025-era examples; rerun against current market data for current use.

---

## Brief

> "Research the AI code review market."

---

## Step 0: Product Context Check

Checked `research/product-context.md` — not found. Interview initiated (Step 1).

---

## Step 1: Scope Interview

- "What market?" → "AI-powered code review tools — automated PR review, code quality analysis"
- "Geography?" → "Global, English-speaking focus"
- "Timeframe?" → "Current snapshot with 2-year trajectory"
- "Known competitors?" → "CodeRabbit, Sourcery, maybe Codacy"
- "What decisions?" → "We're building a new product and need to know where the gaps are"
- **Scope calibration:** "Building a new product" → **Route B: Product Positioning** (5-8 competitors, detailed features)

Echoed route confirmation. User proceeded.

---

## Pre-Writing Context Object

```
pre-writing = {
  category: "AI-powered code review tools",
  differentiator: undefined (no product-context.md),
  pricing_model: undefined,
  target_segment: "engineering teams (global, English-speaking)",
  scope: "Positioning",
  geography: "Global, English-speaking",
  timeframe: "Current + 2-year trajectory",
  known_competitors: ["CodeRabbit", "Sourcery", "Codacy"]
}
```

---

## Layer 1 Dispatch (4 agents in parallel)

### trends-agent output (summarized)

```
| Trend | Direction | Evidence | Quantification | Implication |
|-------|-----------|----------|---------------|-------------|
| AI dev tools adoption | Growing rapidly | GitHub Octoverse 2025 | 78% of developers use AI coding tools (+32% YoY) | Market tailwind for AI code review |
| Shift-left quality | Accelerating | GitLab DevSecOps Survey 2025 | 65% of orgs testing in CI, up from 48% | Code review moving earlier in pipeline |
| LLM cost decline | Declining costs | OpenAI, Anthropic pricing pages | GPT-4 class: ~$3/M tokens (was $30 in 2023) | AI review becoming economically viable at scale |
```

3 trends, all quantified with cited sources, current data (within 12 months). Critic gates 1 + 6 + 7 satisfied for this section.

### sizing-agent output (Route B, optional — operator opted in)

```
| Metric | Method | Estimate | Source | Confidence |
|--------|--------|----------|--------|-----------|
| TAM | Top-down (Gartner DevOps × 8% AI allocation) | $2.4B–$3.1B | Gartner DevOps Spending Forecast 2025 | Medium (single-source; bottom-up validation pending) |
| SAM | Bottom-up (15M developers × $200/seat/yr × 20% TAM-addressable) | $600M | Stack Overflow Dev Survey 2025 + competitor pricing pages | Medium-high |
| SOM | Top 3 competitors revenue × 3x for new entrants | $30M–$50M (3-yr) | Crunchbase, public funding announcements | Low (estimation; no direct revenue data) |
```

Methodology stated per metric; estimates as ranges; confidence with reasoning. Critic gates 8 + 10 satisfied.

### competitor-agent output (summarized)

```
5 direct competitors mapped (CodeRabbit, Sourcery, Codacy, Qodo, Ellipsis) — full 7-column Overview table with Threat levels.
3 adjacent competitors identified (GitHub Copilot, SonarQube, Sourcegraph) — 5-column Adjacent table with Likelihood and Signal to Watch.
Feature matrix: 7 capabilities × 5 competitors, each labeled Stakes (table stakes) or Diff (differentiator).
Pricing: all 5 competitors with full pricing table (Free / Entry / Mid / Enterprise / Model).
Positioning Map: 2 axes (Accuracy vs Speed) sourced from G2 review themes.
Community: top 3 competitors with Community Size, Activity, Sentiment, Share of Voice.
```

All 6 Competitive Landscape sub-sections produced. Adjacent populated (3 entries — exceeds critic gate 9 minimum of 2). Stakes/Diff labels applied (gate 11). Critic gates 2 + 3 + 9 + 11 satisfied.

### consumer-landscape-agent output (summarized)

```
Hot topics: AI hallucination in code suggestions, false positive fatigue
Cultural moments: 2025 GitHub Copilot enterprise rollouts, OpenAI Codex deprecation
Sentiment: Cautiously optimistic — devs want AI review but distrust accuracy
Unmet needs: Cross-repo understanding, org-specific style enforcement, test generation
```

All 4 dimensions covered with user evidence (Reddit r/ExperiencedDevs, Hacker News threads cited inline).

---

## Research Checkpoint (between L1 and L2)

Presented findings + 3 questions:

- "Right competitors?" → User: "Yeah, those are the main ones. I'd add Qodo and Ellipsis too." (Already in L1 output — confirmed.)
- "Internal competitive intel?" → User: "We lose deals to CodeRabbit on speed, to Codacy on compliance."
- "Surprising findings?" → User: "The LLM cost decline is bigger than I realized."

**Incorporated internal sales notes into merged L1 output** before L2 dispatch. The win/loss intel (speed-loss to CodeRabbit, compliance-loss to Codacy) informs both gap identification and Top 3 risk assessment.

---

## Layer 2 Dispatch (sequential)

### cross-analysis-agent

Identified gaps across all 4 dimensions:

- **Underserved Segments:** 3 (regulated industries with on-prem requirements; mid-market teams (50-200 eng) priced out by Enterprise SKUs; non-English-speaking dev orgs)
- **Feature Gaps:** 5 (cross-repo context; org-specific style enforcement; test generation; review-to-fix automation; multi-language polyglot support)
- **Emerging Trends:** 3 (LLM cost decline opens self-hosted; shift-left moves review pre-PR; agent-based review replacing rule-based)
- **Positioning Whitespace:** 2 (self-hosted compliance-first; speed-optimized for high-velocity teams)

Each gap traces to evidence from upstream L1 + internal sales notes. Critic gate 4 satisfied.

### opportunity-agent

Force-ranked top 3 opportunities:

```
| # | Opportunity | Evidence Source | Window | Risk | Why Now |
|---|------------|---------------|--------|------|---------|
| 1 | Multi-repo context awareness | Cross-repo gap (5 G2 reviews) + Sourcegraph adjacent threat | 12-18 months | Medium (technically hard; need graph DB) | LLM context windows now 1M+ tokens make this feasible |
| 2 | Self-hosted AI review for regulated industries | Compliance-loss internal intel + 3 regulated-segment underserved gap | 6-12 months | Low (smaller market but defensible) | Regulated industries blocked by cloud-only competitors; LLM cost decline enables on-prem |
| 3 | Review-to-test pipeline | Test-generation feature gap + shift-left trend | 12-24 months | High (long sales cycle; needs CI integration) | Agent-based review trend creates the multi-step workflow opening |
```

3 opportunities with Evidence Source + Window + Risk + Why Now. Critic gate 5 satisfied. Ranking rationale: #1 highest TAM, #2 highest defensibility, #3 longest window but highest disruption.

### critic-agent → PASS (first cycle)

All 11 quality gate items pass:

- ✓ Gate 1 (source citation): every claim cited
- ✓ Gate 2 (competitor coverage): 5 direct, 3 adjacent — exceeds ≥3 minimum
- ✓ Gate 3 (feature depth): 7 capabilities, Stakes/Diff labeled
- ✓ Gate 4 (gap identification): 13 gaps across 4 dimensions, evidence-traced
- ✓ Gate 5 (opportunity completeness): all 3 with Evidence Source + Window + Risk + Why Now
- ✓ Gate 6 (trend quantification): 3 trends, all quantified
- ✓ Gate 7 (source recency): all sources within 12 months
- ✓ Gate 8 (confidence justification): sizing confidence reasoned per metric
- ✓ Gate 9 (adjacent check): 3 adjacent competitors with Why They Could Enter + Likelihood + Signal to Watch
- ✓ Gate 10 (sizing methodology): TAM/SAM/SOM methods stated; ranges, not point estimates
- ✓ Gate 11 (feature classification): Stakes/Diff labels applied

Critic notes: "Adjacent competitor section is strong. Sizing was correctly skipped for Positioning scope... actually user opted in to optional sizing, which is acceptable. Internal sales notes integration shows good orchestrator practice."

---

## Post-write side effects

Per `procedures/dispatch-mechanics.md`:

1. Wrote `docs/forsvn/canonical/research/MARKET.md` with frontmatter + 8 required sections.
2. Experience write-back:
   - `experience/product.md` ← `Product — category: "AI-powered code review tools"`
   - `experience/business.md` ← `Business — geo + planning horizon: "Global English-speaking, current + 2-year"`, `Business — known competitors: "CodeRabbit, Sourcery, Codacy, Qodo, Ellipsis"`
   - `experience/goals.md` ← `Goals — market-research trigger: "Building new product; need to know where gaps are"`
   - `experience/audience.md` ← `Audience — B2B or B2C: "B2B (engineering teams)"`
3. No prior `docs/forsvn/canonical/research/MARKET.md` to overwrite (first run; `version: 1`).

---

## What this example traces

- All 4 Critical Gates fired (Gate 1 source recency, Gate 2 sizing methodology, Gate 3 adjacent never-skipped, Gate 4 WebSearch live data not training).
- All 11 critic gates traced through to PASS.
- Layer 1 parallel (4 agents) → Research Checkpoint with operator-supplied internal intel → Layer 2 sequential (cross-analysis → opportunity → critic) dispatch arc.
- Cold Start path (no product-context.md, full 5-question interview).
- Route B (Product Positioning) with optional sizing opted in.
- Cross-stack contract preserved (8 required body sections, 6 Competitive Landscape sub-sections, Top 3 with 6 columns, Next Step block to prioritize + icp-research).
- Experience write-back to 4 per-domain files (product / business / goals / audience).

---

## What this example does NOT show

- **Critic FAIL → rewrite cycle.** All 11 gates passed on first dispatch. For a FAIL walkthrough, see `agents/critic-agent.md` § "Return B: FAIL" structure + Failure Routing.
- **Route A (Quick Validation).** This walkthrough used Route B. Route A would skip sizing-agent + opportunity-agent (cross-analysis identifies gaps directly), and consumer-landscape would be optional.
- **Route C (Fundraising / Market Entry).** Would require sizing (no opt-in), enhance L1 depth, and Top 3 Opportunities use quantitative 1-5 scoring.
- **Single-Agent Fallback.** A one-line "who are the players in X?" query would dispatch only competitor-agent and return its output directly without cross-analysis / opportunity / critic.
- **`--fast` mode.** Would force Route A regardless of intent; would still emit Cold Start when category is missing (Critical Gates 1-4 floor).
- **Stale prior `docs/forsvn/canonical/research/MARKET.md`.** A re-run scenario would read prior artifact for context but re-fetch via WebSearch (Critical Gate 4) and overwrite it in place with an incremented `version:` on output (prior version in git history).

---

## Reading the critic verdict format

The critic-agent output structure (per `agents/critic-agent.md`) has two possible returns:

**PASS:**
```markdown
## Verdict: PASS

### Quality Gate Checklist
[11 items, all [x]]

### Evaluation Notes
[Observations, near-misses, or suggestions for next iteration — not blockers]

### Strength Summary
[What this artifact does particularly well]
```

**FAIL:**
```markdown
## Verdict: FAIL

### Failures

#### Failure 1
**Section:** [section name]
**Issue:** [specific description]
**Standard violated:** [which quality gate item]
**Specific fix:** [exact instruction]
**Agent to re-dispatch:** [agent name per Rewrite Routing Table]

#### Failure 2
[Same structure]

### Quality Gate Checklist
[11 items with [x] / [ ] — failures noted]

### What Passed
[Acknowledge working sections to prevent over-correction on rewrite]
```

Verdict is binary — no "conditional PASS" or "soft FAIL." Either all 11 gates pass or the verdict is FAIL.
