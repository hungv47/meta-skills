# Agent Manifest — AEO Monitor

> Loaded by the orchestrator at dispatch entry. Full per-agent inputs, layer placement, and per-route Layer 1/2 expansion live here so the SKILL.md body stays under cap.

---

## Layer 0 (sequential, runs first on every route)

| Agent | File | Focus |
|-------|------|-------|
| query-set-agent | `agents/query-set-agent.md` | Builds/validates the target AI query set from ICP + product context; assigns provider × query matrix |
| provider-readiness-agent | `agents/provider-readiness-agent.md` | Inventories supplied credentials/exports per provider/source; labels each `available` / `partial` / `unavailable` with the specific gap |

The query × provider matrix and the readiness ledger are the input contract for Layer 1.

---

## Layer 1 (parallel; dispatched per mode)

| Agent | File | Mode(s) | Focus |
|-------|------|---------|-------|
| citation-monitor-agent | `agents/citation-monitor-agent.md` | ai-citations, full-report | Ingests provider-query export data into a citation matrix; flags single-run vs multi-run; computes mention/citation/cited-domain rates per query × provider |
| geo-monitor-agent | `agents/geo-monitor-agent.md` | geo-overview, full-report | Ingests Google AI Overview / SGE export data; records AI-Overview presence + cited domains per target keyword + competitor cited-domain share |
| traffic-monitor-agent | `agents/traffic-monitor-agent.md` | ai-referrals, full-report | Ingests Plausible/GA4/server-log referral exports; isolates AI-product referrers (chat.openai.com, perplexity.ai, etc.); produces a labeled referral table |
| readiness-agent | `agents/readiness-agent.md` | bing-readiness, llms-readiness, full-report | Checks Bing Webmaster posture, IndexNow submission, sitemap/robots, `llms.txt` / `llms-full.txt` presence + validity; results bucketed `ready` / `partial` / `missing` |

---

## Layer 2 (sequential)

| Agent | File | Focus |
|-------|------|-------|
| report-agent | `agents/report-agent.md` | Merges Layer-1 outputs into the dated snapshot + report, computes trend deltas against prior snapshots, produces `handoff-optimize-seo.md` with evidence-tagged gap list. **Never prescribes a fix.** |
| critic-agent | `agents/critic-agent.md` | Validates 8-item quality gate — evidence provenance, evidence-class labels, no fabricated data, AEO/GEO/SEO/referral separation, correct handoff to `optimize-seo`. Canonical 8-item list + Rewrite Routing Table live in this file. Verdict binary (PASS / FAIL). Max 2 rewrite cycles. |

---

## Per-route Layer 1 / Layer 2 expansion

| Route | Mode | Layer 1 (parallel) | Layer 2 (sequential) |
|---|---|---|---|
| **A** | ai-citations | citation-monitor | report → critic |
| **B** | geo-overview | geo-monitor | report → critic |
| **C** | ai-referrals | traffic-monitor | report → critic |
| **D** | bing-readiness | readiness (Bing/IndexNow subset) | report → critic |
| **E** | llms-readiness | readiness (llms.txt subset) | report → critic |
| **Z** | full-report (default) | citation-monitor + geo-monitor + traffic-monitor + readiness | report → critic |

**Route Z produces ONE merged artifact** (`report.md` + dated JSON snapshots) — distinct from optimize-seo Route E which splits into two. AEO monitor is a single dated snapshot per run by design.
