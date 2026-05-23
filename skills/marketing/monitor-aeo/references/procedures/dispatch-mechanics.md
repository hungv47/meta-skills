# Procedure — Dispatch Mechanics (AEO Monitor)

> Load when implementing or debugging the orchestrator's Layer-0 → Layer-1 → Layer-2 dispatch flow. Defines the pre-writing object schema, the 8-step dispatch sequence, single-agent fallback, and the `--fast` execution path.

---

## Pre-writing object schema

Before any agent dispatch, the orchestrator builds this object from Pre-Dispatch resolution and passes it (subset per agent) into each agent's `pre-writing` input.

```ts
{
  subject_domain: string,           // e.g., "example.com"
  slug: string,                     // kebab-cased subject_domain
  mode: "ai-citations" | "geo-overview" | "ai-referrals" | "bing-readiness" | "llms-readiness" | "full-report",
  date: string,                     // YYYY-MM-DD (today)
  geographic_scope: string,         // e.g., "US-en"
  language: string,                 // e.g., "en"
  icp_source_path: string | null,   // path to research/icp-research.md or null
  prior_query_set_path: string | null,
  prior_snapshot_paths: string[],   // ordered oldest-to-newest
  competitor_domains: string[],     // 3-7 domains
  target_keywords: string[] | null, // explicit GEO keywords, or null (derive from query set)
  provided_inputs: {
    credentials_present: string[],  // provider names with API keys in env (no key values)
    export_paths: {                 // { provider: path }
      [provider: string]: string
    }
  },
  date_range: { start: string, end: string } | null  // for traffic-monitor
}
```

Each Layer-1 agent receives a tailored subset (citation-monitor doesn't need `date_range`, traffic-monitor doesn't need `target_keywords`, etc.).

---

## 8-step dispatch flow

```
1. Pre-Dispatch resolution (Cold or Warm Start per procedures/pre-dispatch.md)
   ↓
2. Build pre-writing object from resolved dimensions
   ↓
3. Layer 0 dispatch (sequential):
      query-set-agent      →  produces locked query × provider matrix
      provider-readiness-agent  →  produces availability ledger (consumes matrix)
   ↓
4. Read provider-readiness ledger; determine which Layer-1 agents to dispatch:
      - all `unavailable` for a Layer-1 agent's required inputs → skip that agent (single-mode → NEEDS_CONTEXT; full-report → label section unavailable)
      - any `available` or `partial` → dispatch the agent
   ↓
5. Layer 1 dispatch (parallel, per route table in SKILL.md):
      Route A → citation-monitor
      Route B → geo-monitor
      Route C → traffic-monitor
      Route D → readiness (Bing subset)
      Route E → readiness (llms subset)
      Route Z → citation-monitor + geo-monitor + traffic-monitor + readiness (all)
   ↓
6. Layer 2 sequential:
      report-agent      →  merges Layer-1 outputs, computes trend, writes report.md + handoff-optimize-seo.md + snapshot JSONs
      critic-agent      →  scores 8-item quality gate; PASS or FAIL with re-dispatch instructions
   ↓
7. If critic FAIL (cycle 1):
      orchestrator re-dispatches the named agent with critic feedback as `feedback` input
      re-run downstream agents in the chain (e.g., if citation-monitor re-runs, report-agent re-runs after)
      critic scores again (cycle 2)
   ↓
8. Deliver:
      - PASS within 2 cycles → DONE / DONE_WITH_CONCERNS per status logic
      - FAIL after cycle 2 → DONE_WITH_CONCERNS + unresolved-items note in report.md
      - BLOCKED at any earlier point (e.g., Layer 0 BLOCKED) → return early without dispatching downstream
```

---

## Single-agent fallback

When the orchestrator is invoked in a degraded environment (no sub-agent spawning available) OR when `--fast` is set:

| Mode | Single-agent agent | What's skipped |
|---|---|---|
| ai-citations | citation-monitor (combined with Layer-0 query-set inline) | provider-readiness ledger, critic gate, report-agent assembly (operator manually inspects citation-monitor output) |
| geo-overview | geo-monitor (combined with Layer-0 inline) | same |
| ai-referrals | traffic-monitor (combined with Layer-0 inline) | same |
| bing-readiness | readiness (Bing subset only) | same |
| llms-readiness | readiness (llms subset only) | same |
| full-report | NOT SUPPORTED — `--fast` on `full-report` returns NEEDS_CONTEXT asking the operator to pick a single mode |

`--fast` on a snapshot route (Z) is rejected because the snapshot's value is its multi-mode synthesis; running it single-agent strips that value. Other routes (A-E) can run single-agent and emit a sparse, un-critic'd snapshot — the response prepends:

> Ran in --fast mode; rerun without the flag for full critic gate.

---

## What `--fast` does NOT skip

Per `references/_shared/mode-resolver.md`:

- Cold Start questions — if the query set is un-resolvable, the skill still asks
- Critical Gates 1-3 — fabricated evidence, single-run certainty, AEO/GEO/SEO/referral conflation are still rejected
- Evidence-class labels — every emitted cell carries its tag even in single-agent mode
- Hard BLOCKED conditions — missing subject domain, missing query source still BLOCK

`--fast` skips:

- provider-readiness-agent (citation-monitor / geo-monitor / traffic-monitor / readiness must inline-check their own inputs)
- report-agent assembly (operator inspects raw Layer-1 output)
- critic-agent gate
- trend computation
- handoff-optimize-seo.md generation

---

## Rewrite Routing Table (canonical — also in critic-agent.md)

When critic FAILs, the orchestrator dispatches per this table:

| Gate failed | Agent to re-dispatch | Downstream re-runs needed |
|---|---|---|
| 1 (fabricated evidence) | originating monitor (citation-monitor / geo-monitor / traffic-monitor / readiness) | report-agent (re-assemble) |
| 2 (single-run certainty) | citation-monitor (usually) | report-agent |
| 3 (AEO/GEO/SEO/referral separation) | report-agent | — (only re-assembly) |
| 4 (competitor inventory) | citation-monitor + geo-monitor | report-agent |
| 5 (cell-level metadata) | report-agent | — |
| 6 (strategy creep) | report-agent | — |
| 7 (evidence-class index) | report-agent | — |
| 8 (handoff clustering) | report-agent | — |

When a Layer-1 monitor re-runs, its `feedback` input contains the critic's specific items. The agent re-emits its full section with the fixes applied. report-agent then re-runs to merge the new Layer-1 output into the report.

---

## Snapshot append-only enforcement

Snapshot JSON files MUST NOT be overwritten in place. Each run produces:

- `[YYYY-MM-DD]-ai-citations.json` (if ai-citations or full-report ran)
- `[YYYY-MM-DD]-geo-overview.json` (if geo-overview or full-report ran)
- `[YYYY-MM-DD]-ai-referrals.json` (if ai-referrals or full-report ran)
- `[YYYY-MM-DD]-readiness.json` (if bing-readiness or llms-readiness or full-report ran)

If the same date is run twice (rare), the second run writes `[YYYY-MM-DD]-T<HHMMSS>-*.json` to avoid clobber. The orchestrator surfaces a warning to the operator.

`report.md`, `query-set.md`, and `handoff-optimize-seo.md` ARE overwritten in place — git history is the diff record for those.

---

## Trend computation contract

`report-agent` computes trends in §7 only when prior snapshots exist for the matching snapshot type. The rule is **per-snapshot-type** — `ai-citations` snapshots trend against prior `ai-citations` snapshots only, never against `geo-overview` or `ai-referrals`.

Meaningful-delta thresholds (below which deltas are not surfaced as trend notes):

| Snapshot type | Threshold | Surface when |
|---|---|---|
| ai-citations | ≥ 5pp cite-rate change per provider | OR new domain enters top-5 cited |
| geo-overview | binary presence flip per keyword | OR new domain enters top-3 cited |
| ai-referrals | ≥ 25% session-volume change per provider | OR new AI-referrer host appears with ≥ 10 sessions |
| readiness | any status change | always surface |

Below threshold = noise; not surfaced (but still in the snapshot JSON for later analysis).
