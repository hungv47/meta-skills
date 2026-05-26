# Research-Market Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

7 agents across 2 layers:

| Agent | Layer | Role | Input | Output |
|---|---|---|---|---|
| [trends-agent](../agents/trends-agent.md) | L1 (parallel) | Market trends with direction, evidence, quantification, implication | brief + scope | Market Trends table + narrative |
| [sizing-agent](../agents/sizing-agent.md) | L1 (parallel) | TAM/SAM/SOM with methods and confidence levels | brief + scope | Market Sizing table + math |
| [competitor-agent](../agents/competitor-agent.md) | L1 (parallel) | Feature matrix, pricing, positioning map, community, **adjacent check** | brief + scope + known competitors | Competitive Landscape (6 sub-sections) |
| [consumer-landscape-agent](../agents/consumer-landscape-agent.md) | L1 (parallel) | Hot topics, cultural moments, sentiment, unmet needs | brief + scope | User & Consumer Landscape |
| [cross-analysis-agent](../agents/cross-analysis-agent.md) | L2 (sequential) | Synthesizes L1 outputs into gap identification across 4 dimensions | merged L1 outputs | Gaps & Opportunities (4 gap types) |
| [opportunity-agent](../agents/opportunity-agent.md) | L2 (sequential) | Ranks top 3 opportunities with evidence, window, risk, "why now" | cross-analysis + L1 context | Top 3 Opportunities (ranked) |
| [critic-agent](../agents/critic-agent.md) | L2 (sequential) | Validates citations, confidence, methodology, adjacent coverage | full merged artifact | PASS or FAIL with rewrite instructions |

## Routes

Three routes; chosen at Pre-Dispatch (Q3 why-now classification or auto-inferred per `procedures/pre-dispatch.md § Route Selection`):

| Route | When | Graph |
|---|---|---|
| **B — Product Positioning** (default) | "Position our product", "Where do we fit?", "Competitive analysis for [product]" | L1 parallel (trends + sizing[optional] + competitor + consumer-landscape) → Research Checkpoint → L2 sequential (cross-analysis → opportunity → critic) |
| **A — Quick Validation** | "Quick check on this market", "Who are the competitors?", "Is this space crowded?"; OR `--fast` | L1 parallel (trends + competitor; consumer-landscape optional; skip sizing) → Research Checkpoint → L2 (cross-analysis → critic; skip opportunity-agent) |
| **C — Fundraising / Market Entry** | "Series A research", "Entering [market]", "Market analysis for investors", "Full market research"; OR `--deep` | All 4 L1 agents at enhanced depth (sizing REQUIRED) → Research Checkpoint → L2 sequential (cross-analysis → opportunity (quantitative 1-5 scoring) → critic) |

## Research Checkpoint

3-question pause after Layer 1 returns and before Layer 2 dispatches. Surfaces:

1. **Coverage gaps** — anything Layer 1 couldn't source or had to estimate.
2. **Internal-knowledge add** — sales notes, support tickets, call recordings the operator should layer in.
3. **Adjacency calibration** — which adjacent categories deserve deeper inspection in L2.

Operator answers; cross-analysis-agent dispatches with the combined context.

## Pattern Catalogs

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/competitor-analysis-framework.md` | competitor-agent | Structured competitor evaluation methodology. |
| `references/market-sizing-guide.md` | sizing-agent | TAM/SAM/SOM methods and search patterns. |
| `references/gap-analysis-template.md` | cross-analysis, opportunity | Framework for opportunity identification and scoring. |
| `references/_shared/confidence-labeling.md` | all | Canonical H/M/L finding-confidence label + L-resolution rule. |
| `references/format-conventions.md` | all + critic | Artifact Template + Scope Calibration tables (per-section depth by route). |
| `references/anti-patterns.md` | critic | 11 patterns (8 from original + 3 cross-cutting) with detection + bad/good examples. |

**Research Tool Priority hierarchy** (load-bearing for evidence quality): Exa MCP → Firecrawl → WebSearch. Sources >18 months old → flag as historical, not current.

Full mechanics + Critic Gate Max-2-cycles pseudocode + Rewrite Routing Table + Single-Agent Fallback: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
