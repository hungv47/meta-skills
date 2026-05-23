# Worked Example — `/monitor-aeo` full-report (Route Z)

> End-to-end walkthrough for the default mode (`full-report`) on a generic fictional subject. Shows Cold Start → Pre-Dispatch resolve → Layer 0 → parallel Layer 1 → merge → critic PASS → deliver → handling missing providers → `--fast` variant.

**Fictional subject for this example:** `flowscope.io` — a fictional SaaS workflow-graph tool ("see your team's actual workflow as a diagram"). 4 months post-launch, indie team of 3, asking AEO measurement for the first time.

---

## Step 1 — Operator invocation (Cold Start)

```
/monitor-aeo
```

No arguments. None of mode / subject / query source / competitors / inputs resolvable from `.forsvn/`. The orchestrator runs Cold Start prompt from `procedures/pre-dispatch.md` and asks five questions.

**Operator reply:**

```
1. Mode — full-report (default)
2. Subject — flowscope.io
3. Query set source — use .forsvn/research/icp-research.md sections 3 & 5
4. Competitors — extract from ICP; primary competitors are mermaid.live, miro.com, lucid.app
5. Available inputs:
   - OpenAI ChatGPT export: have it at inputs/openai-2026-05-23.jsonl (15 queries, n=3 each)
   - Perplexity: no export, no API key
   - Anthropic Claude: no export
   - Google AI Overview: DataForSEO export at inputs/dataforseo-aio-2026-05-23.json (10 keywords, US-en)
   - Plausible referral export: inputs/plausible-30d.csv (last 30 days)
   - Bing Webmaster: session active, can pull
   - Live site for llms.txt: yes (flowscope.io)
```

---

## Step 2 — Pre-Dispatch resolution

Orchestrator builds pre-writing object:

```json
{
  "subject_domain": "flowscope.io",
  "slug": "flowscope-io",
  "mode": "full-report",
  "date": "2026-05-23",
  "geographic_scope": "US-en",
  "language": "en",
  "icp_source_path": ".forsvn/research/icp-research.md",
  "prior_query_set_path": null,
  "prior_snapshot_paths": [],
  "competitor_domains": ["mermaid.live", "miro.com", "lucid.app"],
  "target_keywords": null,
  "provided_inputs": {
    "credentials_present": [],
    "export_paths": {
      "openai": "inputs/openai-2026-05-23.jsonl",
      "google_ai_overview": "inputs/dataforseo-aio-2026-05-23.json",
      "plausible": "inputs/plausible-30d.csv"
    }
  },
  "date_range": { "start": "2026-04-23", "end": "2026-05-23" }
}
```

Announces: "Pre-Dispatch resolved. Dispatching Route Z (full-report) — first snapshot for flowscope.io. Trend computation will activate at v2."

---

## Step 3 — Layer 0 (sequential)

### query-set-agent runs first

Reads `.forsvn/research/icp-research.md`. Extracts:
- §3 (Buyer questions): "how do I show my team's workflow", "best workflow diagramming tool", "diagram-as-code workflow alternatives"
- §5 (Objections + triggers): "is mermaid.live good enough", "miro vs flowscope", trigger: "onboarding a new engineer to a complex repo"

Builds the matrix. Excerpt:

| # | Query | Intent class | Target providers | Geo |
|---|---|---|---|---|
| Q1 | "best workflow diagramming tool for engineering teams" | informational | OpenAI, Perplexity, Google AI Overview | US |
| Q2 | "how do I diagram my team's workflow" | informational | OpenAI, Perplexity, Google AI Overview | US |
| Q3 | "diagram-as-code alternatives to mermaid" | comparison | OpenAI, Perplexity | US |
| Q4 | "flowscope vs mermaid.live" | comparison | OpenAI, Perplexity | US |
| Q5 | "miro vs flowscope" | comparison | OpenAI, Perplexity | US |
| Q6 | "lucid vs flowscope for engineering" | comparison | OpenAI, Perplexity | US |
| Q7-Q10 | (4 troubleshooting queries) | troubleshooting | OpenAI, Perplexity | US |
| Q11-Q15 | (5 informational + transactional) | mixed | per intent | US |

15 queries total, 7 with comparison framing. Competitor set noted from ICP.

### provider-readiness-agent runs second

Consumes the matrix. Produces ledger:

| Provider / source | Required for mode(s) | Supplied input | Status | Gap | Resolves with |
|---|---|---|---|---|---|
| OpenAI (gpt-4o) | ai-citations, full-report | `inputs/openai-2026-05-23.jsonl` | available | — | — |
| Perplexity | ai-citations, full-report | — | unavailable | no export, no API key | Perplexity Pro → History → CSV, OR `PPLX_API_KEY` in env |
| Anthropic Claude | ai-citations, full-report | — | unavailable | no export | claude.ai chat-export feature, OR Anthropic API key + run script |
| Google AI Overview | geo-overview, full-report | `inputs/dataforseo-aio-2026-05-23.json` | available | — | — |
| Plausible | ai-referrals, full-report | `inputs/plausible-30d.csv` | available | — | — |
| Bing Webmaster | bing-readiness, full-report | session active | partial | URL submission CSV not exported | Bing Webmaster Tools → "URL submission" CSV export |
| llms.txt / robots.txt | llms-readiness, full-report | live site | available | — | (resolved via direct fetch) |

Run-Decision Summary:
- 5 of 7 providers/sources have full or partial input — 4 Layer-1 agents will run (citation, geo, traffic, readiness)
- Perplexity + Anthropic flagged `unavailable` — citation-monitor will emit unavailable rows for those columns
- Hand to Layer 1.

---

## Step 4 — Layer 1 (parallel, 4 agents)

### citation-monitor

Ingests `inputs/openai-2026-05-23.jsonl`. Matrix (excerpt):

| Q# | Query | Provider | Run type | n | Subject cited? | Mention type | Cited domains | Median rank | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| Q1 | "best workflow diagramming tool for engineering teams" | OpenAI (gpt-4o) | multi-run | 3 | yes (1/3) | unlinked mention | mermaid.live (3/3), lucid.app (2/3), miro.com (2/3) | n/a | observed-test |
| Q1 | "..." | Perplexity | — | — | unavailable | — | — | — | unavailable |
| Q3 | "diagram-as-code alternatives to mermaid" | OpenAI (gpt-4o) | multi-run | 3 | no | — | mermaid.live (3/3), structurizr.com (3/3), plantuml.com (3/3) | n/a | observed-test |
| Q4 | "flowscope vs mermaid.live" | OpenAI (gpt-4o) | multi-run | 3 | yes (3/3) | linked citation | flowscope.io (3/3), mermaid.live (3/3) | 1 (median) | observed-test |
| Q5 | "miro vs flowscope" | OpenAI (gpt-4o) | multi-run | 3 | yes (3/3) | linked citation | flowscope.io (3/3), miro.com (3/3) | 2 (median) | observed-test |
[Q6-Q15 omitted for brevity; 15 OpenAI rows, 15 Perplexity unavailable rows, 15 Anthropic unavailable rows = 45 total]

Cited-Domain Inventory (descending):

| Domain | Cites across matrix | Queries cited on | Owner |
|---|---|---|---|
| mermaid.live | 12 | Q1, Q2, Q3, Q4, Q7, Q9 | competitor |
| miro.com | 6 | Q1, Q5, Q8 | competitor |
| lucid.app | 5 | Q1, Q6, Q8 | competitor |
| flowscope.io | 5 | Q4, Q5, Q6, Q14 | subject |
| plantuml.com | 4 | Q3, Q7 | competitor |
| structurizr.com | 3 | Q3 | competitor |

Per-Provider Summary:
- OpenAI (gpt-4o) | 15/15 queries scored | subject cite rate: 27% (4/15) | median rank when cited: 2 | multi-run n=3 throughout
- Perplexity | 0/15 | unavailable | unavailable | export not supplied
- Anthropic | 0/15 | unavailable | unavailable | export not supplied

Writes `snapshots/2026-05-23-ai-citations.json`.

### geo-monitor

Ingests `inputs/dataforseo-aio-2026-05-23.json`. Matrix:

| Keyword | Geo | AIO present? | Subject cited? | Mention type | Cited domains (ordered) | SERP mix | Evidence |
|---|---|---|---|---|---|---|---|
| "best workflow diagramming tool" | US-en | yes | no | — | miro.com, lucid.app, mermaid.live, theverge.com | AIO + PAA + organic | observed-test |
| "diagram-as-code tools" | US-en | yes | no | — | mermaid.live, plantuml.com, structurizr.com | AIO + organic | observed-test |
| "team workflow diagrams" | US-en | no | n/a | — | — | organic + PAA only | observed-test |
| "flowscope review" | US-en | yes | yes | linked citation | flowscope.io, producthunt.com, indiehackers.com | AIO + organic | observed-test |
[10 keywords total]

Cited-Domain Inventory (GEO, descending):

| Domain | AIO cites | Keywords cited on | Owner |
|---|---|---|---|
| mermaid.live | 5 | K1, K2, K5, K7, K8 | competitor |
| miro.com | 4 | K1, K6, K8, K9 | competitor |
| lucid.app | 3 | K1, K6, K9 | competitor |
| flowscope.io | 1 | K4 | subject |

Writes `snapshots/2026-05-23-geo-overview.json`.

### traffic-monitor

Ingests `inputs/plausible-30d.csv`. Filters AI-referrer hosts:

| Referrer host | Provider | Sessions | Pageviews | Date range | Evidence |
|---|---|---|---|---|---|
| chat.openai.com | OpenAI ChatGPT | 142 | 318 | 2026-04-23 → 2026-05-23 | observed-test |
| chatgpt.com | OpenAI ChatGPT | 23 | 47 | 2026-04-23 → 2026-05-23 | observed-test |
| perplexity.ai | Perplexity | 89 | 184 | 2026-04-23 → 2026-05-23 | observed-test |
| claude.ai | Anthropic Claude | 4 | 7 | 2026-04-23 → 2026-05-23 | observed-test |
| gemini.google.com | Google Gemini | 2 | 3 | 2026-04-23 → 2026-05-23 | observed-test |

Provider roll-up: OpenAI 165 sessions (62%), Perplexity 89 (34%), others negligible. Note: Perplexity referrals exist even though Perplexity citation export wasn't supplied — informative gap for the handoff.

Coverage caveats: Plausible doesn't see cookieless ad-blocked sessions; ChatGPT iOS app may appear as direct. Date range is 30 days only.

Writes `snapshots/2026-05-23-ai-referrals.json`.

### readiness-agent

Live-fetches `/llms.txt`, `/robots.txt`. Bing Webmaster partial input.

Bing/IndexNow:

| Check | Status | Observation | Resolves with |
|---|---|---|---|
| Bing Webmaster site verified | ready | session active, verified Q1 2025 | — |
| Sitemap submitted to Bing | partial | submitted; last crawl 2026-04-12 (41 days) | re-submit |
| IndexNow key file present | missing | `/[key].txt` 404 at root | place key file + declare in robots.txt |
| IndexNow submission log | unavailable | not supplied | export from IndexNow CLI / API log |
| robots.txt Bingbot allow | ready | Bingbot: Allow: / | — |
| robots.txt sitemap directive | ready | Sitemap: https://flowscope.io/sitemap.xml | — |

llms.txt / crawlers:

| Check | Status | Observation | Resolves with |
|---|---|---|---|
| `/llms.txt` present | missing | 404 | author per spec in `references/llms-readiness.md` |
| `/llms-full.txt` present | missing | 404 | generate from `/llms.txt` Docs + canonical-page markdown |
| GPTBot access | ready | not blocked | — |
| OAI-SearchBot access | ready | not blocked | — |
| PerplexityBot access | ready | not blocked | — |
| ClaudeBot access | ready | not blocked | — |
| Google-Extended access | ready | not blocked | — |
| CCBot access | ready | not blocked | — |

Writes `snapshots/2026-05-23-readiness.json`.

---

## Step 5 — Layer 2 (sequential)

### report-agent

Merges Layer-1 outputs. Computes trend → `n/a — first snapshot`. Builds competitor cited-domain merge:

| Domain | Chat-provider cites | AIO cites | Total | Owner |
|---|---|---|---|---|
| mermaid.live | 12 | 5 | 17 | competitor |
| miro.com | 6 | 4 | 10 | competitor |
| lucid.app | 5 | 3 | 8 | competitor |
| flowscope.io | 5 | 1 | 6 | subject |
| plantuml.com | 4 | 0 | 4 | competitor |
| structurizr.com | 3 | 0 | 3 | competitor |

Writes `report.md` with all 10 required sections.

Writes `handoff-optimize-seo.md` with 6 clustered gaps:

```markdown
### Gap — Subject absent from informational queries
- Evidence: AI Citations rows Q1, Q2 (OpenAI multi-run n=3); GEO rows K1, K2
- Evidence class: observed-test (n=3 chat; n=1 per AIO keyword)
- Subject status: 0/3 OpenAI cites on Q1; absent from AIO on K1
- Competitor status: mermaid.live cited 3/3 OpenAI runs on Q1; 5/10 AIO keywords
- Strategy question for optimize-seo: is there a primary-source content surface that answers the "best workflow diagramming tool" question with chunked, citable evidence?

### Gap — Subject strong on comparison queries vs Mermaid / Miro
- Evidence: Q4, Q5 (OpenAI multi-run n=3); both 3/3 linked citation
- Evidence class: observed-test (n=3)
- Subject status: cited in 100% of OpenAI runs on Q4 + Q5 with linked attribution
- Competitor status: each competitor cited alongside flowscope (not displaced)
- Strategy question for optimize-seo: does a vs-Lucid page (Q6 weaker) or a vs-mermaid-live cluster (Q4 strong) warrant additional comparison-page surface investment?

### Gap — Perplexity citation evidence absent
- Evidence: provider-readiness ledger (Perplexity unavailable); traffic-monitor shows 89 Perplexity referrals (real downstream signal)
- Evidence class: unavailable (citation) + observed-test (referral)
- Subject status: unknown on Perplexity citation surface; 34% of AI referrals come from Perplexity
- Competitor status: unknown
- Strategy question for optimize-seo: should Perplexity export be the highest-priority input add for next snapshot? Referral volume suggests significant citation activity invisible to current monitor.

### Gap — llms.txt + llms-full.txt absent
- Evidence: Technical Readiness, llms section
- Evidence class: observed-test (live fetch)
- Subject status: both 404; all AI crawlers allowed
- Competitor status: not measured (would require per-competitor fetch)
- Strategy question for optimize-seo: does authoring /llms.txt + /llms-full.txt change retrieval behavior for the next monitor snapshot? (Testable hypothesis — first publish creates a controlled before/after.)

### Gap — IndexNow missing despite Bing Webmaster active
- Evidence: Technical Readiness, Bing/IndexNow section
- Evidence class: observed-test
- Subject status: Bing verified; sitemap submitted; IndexNow key file missing
- Competitor status: not measured
- Strategy question for optimize-seo: would IndexNow implementation accelerate Bing Generative Search refresh enough to matter at current 0 Copilot referrals?

### Gap — Mermaid.live dominance across both surfaces
- Evidence: Cited-Domain Share §8 (mermaid.live 17 total cites, 2.8× subject)
- Evidence class: observed-test
- Subject status: outranked by mermaid.live across informational + comparison
- Competitor status: mermaid.live is open-source, has dev-tool integrations, GitHub README mentions
- Strategy question for optimize-seo: what content / linking / integration surface drives mermaid's citation dominance, and which of those is reproducible for flowscope?
```

Returns Report Assembly Summary:
- Wrote `report.md` (status: `done_with_concerns` — 2 of 5 chat providers unavailable, Bing partial)
- Wrote `handoff-optimize-seo.md` (6 gaps)
- Wrote 4 JSON snapshots (ai-citations, geo-overview, ai-referrals, readiness)
- Trend computed against: `none — first snapshot`
- Evidence class counts: observed-test: 38 | single-run: 0 | unavailable: 30 | hypothesis: 0

### critic-agent

Scores 8-item gate:

| # | Gate | Verdict | Note |
|---|---|---|---|
| 1 | No fabricated evidence | PASS | Perplexity / Anthropic rows marked unavailable per ledger; no fake zeros |
| 2 | Stochastic outputs declare confidence | PASS | every multi-run row carries n=3; no single-run rows in this snapshot |
| 3 | AEO / GEO / SEO / referral separated | PASS | 4 distinct sections; §8 merge is surface-tagged |
| 4 | Competitor cited-domains captured | PASS | competitor inventory in both citation-monitor and geo-monitor; merged §8 |
| 5 | Metric metadata complete | PASS | every row tagged; OpenAI model named (gpt-4o); referrals have date range |
| 6 | Recommendations are handoffs | PASS | report body has zero prescriptive verbs; all prescriptions live in handoff as questions |
| 7 | Evidence-class index accurate | PASS | counts 38+0+30+0+0 = 68 tagged cells; matches |
| 8 | Handoff clustered | PASS | 6 clustered gaps; no per-row enumeration |

Verdict: **PASS** (cycle 1). Delivers.

---

## Step 6 — Delivery

Final status: `DONE_WITH_CONCERNS`. Operator-facing summary:

> **AEO Monitor — flowscope.io — 2026-05-23 (first snapshot)**
>
> `done_with_concerns`. 4 Layer-1 agents ran; 2 chat providers (Perplexity, Anthropic) unavailable — supply exports for next snapshot to fill the gap. Wrote:
> - `report.md`
> - `handoff-optimize-seo.md` (6 gaps for optimize-seo strategy)
> - 4 dated snapshot JSONs
>
> Headline evidence: OpenAI cite rate 27% (n=3 multi-run); subject strong on direct vs-competitor comparisons (Q4, Q5: 3/3); absent on informational (Q1, Q2: 0/3 + 0/AIO). Mermaid.live cited 17× total across both surfaces (2.8× subject). Perplexity citation evidence missing — but 89 Perplexity referral sessions in last 30 days suggests significant invisible citation activity.
>
> Next step: pass `handoff-optimize-seo.md` to `/optimize-seo --mode=ai` to convert evidence into strategy.

---

## Variant: missing-everything case

If the operator had only supplied `subject: flowscope.io` and `mode: ai-citations` (no exports, no ICP path):

- Layer 0 query-set-agent: `[BLOCKED: no ICP source AND no operator-supplied queries]`
- Orchestrator returns: status `BLOCKED` — "Need a query source. Supply 10-30 literal queries the audience would type, OR point me at `.forsvn/research/icp-research.md`."

No snapshot written. No report produced.

---

## Variant: `--fast` on a single-mode route

```
/monitor-aeo ai-citations --fast
```

Skips provider-readiness, skips critic, skips trend, skips handoff. Runs query-set-agent + citation-monitor inline. Returns the citation matrix as raw output with the prefix:

> Ran in --fast mode; rerun without the flag for full critic gate.

`--fast` on `full-report` is rejected: returns `NEEDS_CONTEXT` asking the operator to name a single mode (the snapshot value is its synthesis).
