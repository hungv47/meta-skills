# Procedure — Pre-Dispatch (AEO Monitor)

> Load when entering `/monitor-aeo` Cold or Warm Start. Captures the full read order, dimensions, Cold/Warm prompts, write-back map, chain position, and IMC-coordination logic specific to AEO measurement.

Wraps the canonical Pre-Dispatch protocol at `references/_shared/pre-dispatch-protocol.md` with monitor-aeo-specific dimensions.

---

## Needed dimensions

monitor-aeo needs five dimensions resolved before agent dispatch:

1. **Mode** — `ai-citations` | `geo-overview` | `ai-referrals` | `bing-readiness` | `llms-readiness` | `full-report` (default)
2. **Subject domain** — single domain the snapshot is about (kebab-cased to `[slug]`)
3. **Query set source** — `research/icp-research.md` § / operator-supplied list / prior `query-set.md` (one is required)
4. **Competitor set** — 3-7 domains (resolves from ICP if present)
5. **Available inputs** — credentials in env + supplied export paths per provider (the provider-readiness ledger consumes this)

If any dimension is missing AND not resolvable from artifacts/experience → Cold Start. If all five resolvable → Warm Start summary + optional probe.

---

## Read order

Before asking, read in this sequence and announce what's resolved:

1. **Pipeline artifacts:**
   - `research/icp-research.md` → audience search behavior + competitor candidates (resolves Q3 + Q4)
   - `.forsvn/artifacts/marketing/seo-ai.md` → which queries optimize-seo's strategy expects to win (informs Q3 query set)
   - `.forsvn/artifacts/marketing/aeo-monitor/[slug]/query-set.md` → prior locked query set (enables delta-based Q3)
   - `.forsvn/artifacts/marketing/aeo-monitor/[slug]/snapshots/` → prior snapshots (enables trend mode in any route)

2. **Experience substrate:**
   - `.forsvn/experience/audience.md` → search behavior + geo (informs Q3)
   - `.forsvn/experience/product.md` → product context (informs Q2 if domain not supplied)
   - `.forsvn/experience/business.md` → market scope + competitor set (informs Q4)

3. **Manifest check:**
   - `.forsvn/index/manifest.json` → check for stale `icp-research.md` (>30 days → recommend re-running upstream)

---

## Warm Start prompt

When mode + subject supplied AND query set resolves from ICP/prior snapshot:

```
Found:
- mode → "[mode]"
- subject → "[domain]"
- query set → [N queries from prior-snapshot delta | derived from research/icp-research.md § 3 + § 5]
- competitors → "[N domains: comp1, comp2, comp3]"

Need before dispatching: which provider exports are available this run?
(For full-report default, list what you have: OpenAI / Perplexity / Anthropic / Google AI Overview / analytics / Bing Webmaster / live site for llms.txt. I'll label missing ones `unavailable` in the report.)
```

If available-inputs ALSO resolves from a prior `.forsvn/experience/aeo-inputs.md` → skip probe and dispatch with one-line confirm.

---

## Cold Start prompt

When mode unclear OR subject not supplied OR no query-set source resolvable:

```
monitor-aeo runs 6 modes (ai-citations / geo-overview / ai-referrals / bing-readiness / llms-readiness / full-report) — each dispatches different Layer-1 agents. Default is `full-report` (one dated snapshot).

1. **Mode** — pick one, or leave blank for `full-report`:
   - **ai-citations** — chat-provider citation matrix (OpenAI / Perplexity / Claude / etc.)
   - **geo-overview** — Google AI Overview presence + cited domains
   - **ai-referrals** — analytics referral traffic from AI products
   - **bing-readiness** — Bing Webmaster / IndexNow / sitemap posture
   - **llms-readiness** — llms.txt / llms-full.txt + AI crawler access
   - **full-report** — every mode that has resolvable inputs (default)

2. **Subject domain** — single domain (e.g., `example.com`).

3. **Query set source** — one of:
   a) point me at `research/icp-research.md`,
   b) supply 10-30 literal queries the audience would type,
   c) reuse prior `.forsvn/artifacts/marketing/aeo-monitor/[slug]/query-set.md`.

4. **Competitor set** — 3-7 domains; or "extract from ICP" if (3a).

5. **Available inputs** — which of these can you supply? (Missing ones get labeled `unavailable`.)
   - provider exports: OpenAI / Perplexity / Anthropic / Gemini / Copilot / Grok logs
   - Google AI Overview export: DataForSEO / Sistrix / Semrush dump
   - analytics referral export: GA4 / Plausible / server logs
   - Bing Webmaster export
   - live site (for `/llms.txt`, `/robots.txt` fetches)

Answer 1-5 in one response. I'll dispatch agents for the resolved mode.
```

---

## Write-back map

After dispatch + critic PASS, the orchestrator writes back:

| Artifact | Path | What's written |
|---|---|---|
| Report | `.forsvn/artifacts/marketing/aeo-monitor/[slug]/report.md` | Full dated report |
| Query set | `.forsvn/artifacts/marketing/aeo-monitor/[slug]/query-set.md` | Locked query × provider matrix |
| Handoff | `.forsvn/artifacts/marketing/aeo-monitor/[slug]/handoff-optimize-seo.md` | Evidence-tagged gap list |
| Snapshots | `.forsvn/artifacts/marketing/aeo-monitor/[slug]/snapshots/[date]-*.json` | Append-only |
| Experience update (optional) | `.forsvn/experience/aeo-inputs.md` | Which provider inputs the operator typically supplies (warm-start enable) |

---

## Chain position

| Skill | Relation | Coordination |
|---|---|---|
| `research-icp` | Upstream (required) | Query set derives from ICP § 3 (buyer questions) + § 5 (objections + triggers). Missing ICP + missing operator queries → BLOCKED. |
| `optimize-seo` (AI mode) | Upstream (optional) + Downstream (always) | Upstream: `seo-ai.md` declares the strategy's expected-citation queries — adopt those as a query-set anchor. Downstream: every monitor run produces `handoff-optimize-seo.md` for the strategy critic to consume. |
| `plan-campaign` | Lateral | Campaign pillars may identify priority queries — include if accessible, don't force-fetch. |

---

## IMC coordination

monitor-aeo doesn't produce or distribute content. It only measures. IMC coordination is one-directional: monitor evidence flows into `optimize-seo` strategy, which produces content + technical changes via `write-copy` / `produce-asset` / direct engineering work.

A new monitor snapshot does NOT trigger IMC re-coordination on its own. A new `optimize-seo` strategy run (consuming the monitor handoff) does.

---

## Skill deference

When the operator's request looks like AEO but is actually one of:

| Request | Defer to | Why |
|---|---|---|
| "What should we do about ChatGPT not citing us?" | `optimize-seo` (AI mode) | That's strategy. Monitor produces evidence; `optimize-seo` decides action. |
| "Rewrite this page to be more AI-friendly" | `optimize-seo` → `write-copy` | Strategy + execution. Monitor is not in this loop. |
| "Audit our Core Web Vitals" | `optimize-seo` Route A | Wrong technical surface — Core Web Vitals are classic-search, not AEO-specific. |
| "Brainstorm AI search content angles" | `plan-campaign` + `research-icp` | Audience + content planning, not measurement. |
| "Show me what Perplexity says about us right now" | (manual — run the query yourself) | One-off chat is not monitoring. Monitoring requires locked query set + snapshot history. |
