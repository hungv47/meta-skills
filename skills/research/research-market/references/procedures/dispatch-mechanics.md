# Procedure — Dispatch Mechanics (market-research)

> Load at Layer 1 dispatch entry. Encodes the Pre-Writing Context Object construction, the Layer 1 + Layer 2 spawn details, the Research Tool Priority hierarchy, the Research Checkpoint pause between layers, the Critic Gate Max-2-cycles pseudocode, post-write side effects, chain position, and skill deference.

---

## Layer 1 Dispatch — Parallel Research Agents

Build the pre-writing context object from Pre-Dispatch + Step 0 + Step 1, then dispatch all applicable L1 agents in parallel (multiple Agent tool calls in one message).

### Pre-Writing Context Object

```
pre-writing = {
  category: [product category],
  differentiator: [from product-context or interview],
  pricing_model: [from product-context or interview],
  target_segment: [from product-context or interview],
  scope: "Quick" | "Positioning" | "Fundraising",
  geography: [from interview],
  timeframe: [from interview],
  known_competitors: [from interview]
}
```

### L1 Agent Dispatch Table

| Agent | Always | References to Include |
|-------|--------|----------------------|
| trends-agent | Yes (all routes) | — |
| sizing-agent | Route C required, Route B optional, Route A skip | `references/market-sizing-guide.md` |
| competitor-agent | Yes (all routes) | `references/competitor-analysis-framework.md` |
| consumer-landscape-agent | Route B + C required, Route A optional | — |

Each agent receives `pre-writing` as `brief + scope`, the named references as absolute paths, and produces its layered output independently. Agents do NOT read each other's outputs during L1 — they're parallel-independent.

### Research Tool Priority (all L1 agents)

1. **Exa MCP** or **Perplexity MCP** (if installed) — best for market reports, competitor analysis, trends
2. **Firecrawl** or **Defuddle** (if installed) — scraping specific pages (pricing, features, G2, Crunchbase)
3. **WebSearch** — always available as fallback

Critical Gate 4 forbids relying on training data for positions or pricing — competitor data changes constantly; verify live with WebSearch even when an MCP isn't available.

---

## Research Checkpoint (between L1 and L2)

After L1 returns, present findings and gather feedback before dispatching L2:

**"Here's the competitive landscape. Before I identify gaps and opportunities:"**

1. **Right competitors?** Missing any? Deprioritize any?
2. **Internal competitive intel?** Battle cards, win/loss data, customer feedback?
3. **Surprising findings to dig deeper on?**

Incorporate any internal data (battle cards, sales notes, support tickets) into merged L1 output before dispatching L2. The checkpoint is non-skippable — it's the operator's chance to inject internal signal that no agent can fetch, and L2's gap-identification quality depends on the merged L1 + internal context being complete.

---

## Layer 2 Dispatch — Sequential Analysis

After L1 returns and checkpoint feedback is incorporated, dispatch L2 in strict sequence:

### Step 1: Cross-Analysis Agent

```
dispatch cross-analysis-agent:
  upstream: [merged output from all L1 agents]
  references: [references/gap-analysis-template.md]
```

Identifies gaps across 4 dimensions: underserved segments, feature gaps, emerging trend gaps, positioning whitespace.

### Step 2: Opportunity Agent

```
dispatch opportunity-agent:
  upstream: [cross-analysis output + merged L1 context]
  references: [references/gap-analysis-template.md]
```

Receives cross-analysis plus L1 context for evidence. Force-ranks top 3 opportunities. For Route C (Fundraising), uses quantitative 1-5 scoring.

### Step 3: Critic Agent

```
dispatch critic-agent:
  upstream: [full merged artifact — all L1 + L2 outputs in artifact template]
  references: [all reference files]
```

Evaluates against 11-item quality gate checklist. Returns PASS or FAIL.

---

## Single-Agent Fallback

For narrow tasks ("just list competitors", "what's the market size?"), dispatch only the relevant L1 agent. Skip cross-analysis, opportunity, and critic. Return output directly. This is the trim-trim variant below Route A — appropriate for one-line operator queries that don't need synthesis.

---

## Critic Gate — Max 2 Cycles

```
cycle = 0
while cycle < 2:
  verdict = critic-agent.evaluate(artifact)
  if verdict == PASS:
    break
  else:
    for each failure:
      re-dispatch named agent with feedback
    merge fixes into artifact
    cycle += 1

if cycle == 2 and verdict == FAIL:
  deliver artifact with critic's remaining notes as "[REVIEWER NOTE]" annotations
  warn user: "Artifact delivered with quality notes — some items could not be resolved in 2 cycles."
```

**On rewrite:** Re-dispatch only the agents the critic names. Don't re-run the full pipeline. Pass critic's per-agent feedback in the `feedback` field.

### Rewrite Routing Table

The critic's Failure block names the agent to re-dispatch per the canonical table in `agents/critic-agent.md`:

| Failure Type | Re-dispatch to |
|-------------|---------------|
| Trends lack quantification or source | **trends-agent** |
| Sizing has no methodology or ranges | **sizing-agent** |
| Competitor data unsourced or stale | **competitor-agent** |
| Adjacent competitors skipped | **competitor-agent** (most common skip — critic explicitly checks) |
| Consumer findings lack user evidence | **consumer-landscape-agent** |
| Gaps don't trace to evidence | **cross-analysis-agent** |
| Opportunities lack "why now" or risk | **opportunity-agent** |
| Sections contradict each other | **orchestrator** — flag for re-merge |

---

## Post-write side effects (mandatory on PASS or done_with_concerns)

After critic PASSes (or artifact ships with done_with_concerns annotations):

1. **Write `docs/forsvn/canonical/research/MARKET.md`** with frontmatter (skill, version, date, status, stack, review_surface, id, type, keywords) + body per `format-conventions.md` Artifact Template.
2. **Experience write-back** per `pre-dispatch.md` Write-back map:
   - Q1 (Category) → `experience/product.md` as `Product — category`
   - Q2 (Geo + horizon) → `experience/business.md` as `Business — geo + planning horizon`
   - Q3 (Why-now) → `experience/goals.md` as `Goals — market-research trigger`
   - Q4 (Competitors) → `experience/business.md` as `Business — known competitors`
   - Q5 (B2B/B2C) → `experience/audience.md` as `Audience — B2B or B2C`
3. **Versioning:** On re-run, overwrite `docs/forsvn/canonical/research/MARKET.md` in place and increment the integer `version:` (prior versions live in git history; never create a `.v[N].md` sibling under `canonical/`).

**No experience-mirror of the canonical record.** market-research's Pre-Dispatch write-back goes to per-domain experience files only — `docs/forsvn/canonical/research/MARKET.md` is the canonical record itself, produced by the dispatch arc (unlike icp-research, which mirrors Q1 to `research/product-context.md` as a separate cross-stack record).

**BLOCK does NOT trigger write-back.** Partial runs that fail at the cross-analysis or opportunity layer (e.g., critic FAIL after 2 cycles + operator deems `[REVIEWER NOTE]` annotations too severe to ship) do not persist scope state. The previous `docs/forsvn/canonical/research/MARKET.md` (if any) remains the source of truth.

---

## Chain Position

**Previous:** none (Strategy track entry point) — `research-market` and `diagnose` are the two entry points and they're `parallel-with` each other.

**Next:** `prioritize` (consumes Top 3 Opportunities as ICE-score evidence), `research-icp` (Underserved Segments inform persona scoping). Both downstream.

Also consumed by: `architect-system` (competitive context for product decisions), `plan-campaign` (positioning anchors for IMC plans), fundraising decks (sizing + competitive landscape).

**Re-run triggers (operator judgment):** new market entry, major competitor launch/pivot, fundraising, or quarterly for fast-moving categories.

---

## Skill Deference

| Situation | Defer to |
|---|---|
| Audience personas + pain + VoC | `research-icp` (research-skills) |
| Root cause of a specific metric gap | `diagnose` (research-skills) |
| Know the problem, need solutions | `prioritize` (research-skills) |
| Channel mix and calendar from market signals | `plan-campaign` (marketing-skills) |

---

## Mode-resolver interaction

`metadata.budget: deep` → modal path is Route B (Product Positioning).

- `--fast` → Route A (Quick Validation): skip sizing + opportunity-agent; consumer-landscape optional; critic gate collapses to single pass. Cold Start STILL fires when context is missing.
- `--deep` → Route C (Fundraising / Market Entry): all 4 L1 agents at enhanced depth; sizing required; quantitative 1-5 opportunity scoring.
- Otherwise: Route B is default.

---

## Anti-patterns in dispatch

- **Dispatching L2 before the Research Checkpoint runs.** Internal competitive intel (battle cards, sales notes) is unobtainable by agents — only the operator can supply it. Skipping the checkpoint means L2 runs on agent-only data and misses the highest-signal source.
- **Dispatching all 4 L1 agents on Route A.** Route A explicitly skips sizing and makes consumer-landscape optional. Running all 4 wastes budget and produces noise; the Quick Validation scope expects a trimmed dispatch.
- **Re-running the full pipeline on critic FAIL.** Re-dispatch only the named agent(s) — the critic's Failure block specifies which. Re-running upstream (trends-agent when the failure was in opportunity-agent's "why now" sourcing) wastes a rewrite cycle and may regenerate working sections.
- **Skipping the critic gate on `--fast`.** `--fast` collapses critic to a single pass; it does NOT skip the critic entirely. Without the critic, the 11 quality gates are unenforced and Critical Gate 3 (adjacent skip) violations ship silently.
- **Forcing a 3rd rewrite cycle.** Max 2 per the original SKILL.md. After 2 FAILs, ship with `[REVIEWER NOTE]` annotations — don't loop indefinitely.
- **Skipping post-write experience writes.** Q1-Q5 should persist to per-domain experience files after PASS so downstream skills (prioritize, icp-research, campaign-plan) don't re-ask the same context. Skipping defeats the cross-skill memory pattern.
