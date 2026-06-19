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
   - `docs/forsvn/artifacts/marketing/seo-ai.md` → which queries optimize-seo's strategy expects to win (informs Q3 query set)
   - `docs/forsvn/artifacts/marketing/aeo-monitor/[slug]/query-set.md` → prior locked query set (enables delta-based Q3)
   - `docs/forsvn/artifacts/marketing/aeo-monitor/[slug]/snapshots/` → prior snapshots (enables trend mode in any route)

2. **Experience substrate:**
   - `docs/forsvn/experience/audience.md` → search behavior + geo (informs Q3)
   - `docs/forsvn/experience/product.md` → product context (informs Q2 if domain not supplied)
   - `docs/forsvn/experience/business.md` → market scope + competitor set (informs Q4)

3. **Manifest check:**
   - `.forsvn/index/manifest.json` → check for stale `icp-research.md` (>30 days → recommend re-running upstream)

---

## Query-set design

The locked query set is the run's spine: every snapshot measures against it, and trend computation requires it stable across runs. Design it once in Layer 0 (`query-set-agent`), lock it, and write it to `query-set.md`. A balanced set spans three axes — design for all three, don't optimize one:

**1. Query-type category** — what kind of search this is, from the buyer's framing:

| Category | What it captures | Example shape |
|---|---|---|
| **branded** | The subject (or a competitor) by name | `"is [brand] any good"`, `"[brand] pricing"` |
| **category** | The product category without a brand | `"best [category] tool"`, `"[category] for [audience]"` |
| **comparison** | Subject vs a named alternative | `"[brand] vs [competitor]"`, `"alternatives to [competitor]"` |
| **problem** | The pain the product solves, brand-free | `"how do I [job-to-be-done]"`, `"why is [problem] happening"` |
| **long-tail** | Specific, low-volume, high-intent | `"best [category] for [narrow-segment] under [constraint]"` |

**2. Volume tier** — search demand, which governs how stochastic the result is and how it trends:

| Tier | Demand | Why it matters |
|---|---|---|
| **head** | High | More provider data, but contested; small share moves are noise. Re-run sensitivity is high. |
| **mid** | Moderate | The trend sweet spot — enough signal to be stable, specific enough to move with strategy. |
| **long-tail** | Low | Often where a small brand wins citations first; n=1 results are expected — lean on the `single-run` register. |

**3. Intent class** — the existing `informational / comparison / navigational / transactional / troubleshooting` axis the `query-set-agent` already assigns, which also drives provider mapping.

**Balance rules:**
- Cover **every query-type category** the subject plausibly competes in; a branded-only set can't see category-level invisibility, and a category-only set misses defensive branded gaps.
- Span at least **two volume tiers**; a head-only set is all noise, a long-tail-only set can't show contested movement.
- Keep the locked set ≤30 queries (the `query-set-agent` cap). Balance beats breadth — a balanced 18 beats an unbalanced 30.
- **Lock and record.** Once designed, the set is the contract. Any add/remove vs the prior `query-set.md` is flagged in its `## Change vs prior query-set` section so trend computation stays honest.

The category × tier balance is recorded in `query-set.md`'s Coverage Map (see `references/format-conventions.md`). The `query-set-agent` owns derivation; this section is the design contract it satisfies.

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

If available-inputs ALSO resolves from a prior `docs/forsvn/experience/aeo-inputs.md` → skip probe and dispatch with one-line confirm.

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
   c) reuse prior `docs/forsvn/artifacts/marketing/aeo-monitor/[slug]/query-set.md`.

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
| Report | `docs/forsvn/artifacts/marketing/aeo-monitor/[slug]/report.md` | Full dated report |
| Query set | `docs/forsvn/artifacts/marketing/aeo-monitor/[slug]/query-set.md` | Locked query × provider matrix |
| Handoff | `docs/forsvn/artifacts/marketing/aeo-monitor/[slug]/handoff-optimize-seo.md` | Evidence-tagged gap list |
| Snapshots | `docs/forsvn/artifacts/marketing/aeo-monitor/[slug]/snapshots/[date]-*.json` | Append-only |
| Experience update (optional) | `docs/forsvn/experience/aeo-inputs.md` | Which provider inputs the operator typically supplies (warm-start enable) |

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

## Usage metering (best-effort, inert)

Once per run, at the **start of the expensive work** (after Cold Start resolves the inputs, before the parallel agents dispatch), the orchestrator fires a best-effort usage meter so demand for this hosted-grade op is measurable before any billing exists (D-11):

```bash
bun scripts/forsvn-hosted.ts meter monitor_aeo
```

**Inert without a hosted key** (no key → no-op, no network, no nag), wrapped to never throw and **never block or gate the run** (open-core invariant, D-2). It writes nothing locally and changes no output — pure instrumentation. Fire it **exactly once** per invocation (the orchestrator, not each sub-agent). Optional `--units N` carries op intensity. Full contract + the per-skill action table: [`../_shared/meter-instrumentation.md`](../_shared/meter-instrumentation.md).
