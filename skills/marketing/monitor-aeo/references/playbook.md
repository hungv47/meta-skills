---
last_verified: 2026-06-13
verifier: audit-wave2
churn: high
---

# Playbook — Why AEO Monitor Exists

> Load this when teaching the skill to a new operator, deciding whether to run it at all, or when strategy work (in `optimize-seo`) is being done against an un-sourced AI-visibility picture.

---

## Core Question

> **"Do AI systems cite us — for which queries, on which providers, against which competitors, with what trend?"**

`monitor-aeo` is the horizontal AI-visibility **measurement** skill. Its single job: turn a fuzzy "are we showing up in AI search?" ask into a dated, source-tagged, reproducible snapshot that `optimize-seo` (or the operator) can act on.

This is the only skill in the stack that runs as a recurring monthly snapshot rather than as a one-off intervention.

---

## Why this skill exists at all

Five failure modes it prevents:

1. **AEO measured by vibes.** "Feels like ChatGPT cites us more lately" is not evidence. Every metric carries source, date, provider/model, query, and freshness — strategy work downstream can act on real deltas, not narrative.
2. **Fabricated zeros.** Reporting "0 citations on Perplexity" when no actual Perplexity check ran. Gate 1 forbids this — missing input becomes `unavailable`, never silent zero.
3. **AEO ≠ GEO ≠ SEO ≠ referral conflation.** These are four different evidence streams. Merging chat-provider citations with Google AI Overview cites with referral counts produces meaningless aggregates. Gate 3 enforces separation.
4. **Subject-only reporting.** "You weren't cited" without "but Obsidian was in 5/5 OpenAI runs" hides the actionable half. Gate 4 makes competitor cited-domain inventory mandatory.
5. **Monitor-side strategy creep.** Tempting to write "rewrite this page" into the report. That's `optimize-seo`'s job. Gate 6 keeps the report measurement-only; the handoff is a question, not a prescription.

The structural answer is the **8-item quality gate** (in `agents/critic-agent.md`) — every gate maps to a specific re-dispatch agent, and PASS is binary.

---

## Philosophy

AEO/GEO outcomes are **stochastic and provider-specific**. The same query on the same provider returns different cites across turns; different providers cite differently; cited domains shift weekly. The only honest deliverable is dated, source-tagged, reproducible evidence — never claims of "AEO score" or "AI ranking".

**Evidence > Inference > Hypothesis.** Every metric is tagged by class. `observed-test` for actual export ingest; `single-run` for n=1; `unavailable` for missing input; `practitioner-inference` and `hypothesis` should never appear in a monitor run (they belong in `optimize-seo` strategy work).

**Stochastic results state their confidence inline.** A single-run cell carries `(single-run observation)`; a multi-run cell carries `(n=5 runs, 80% agreement)` — the agreement rate, not just the count. Full register contract: `references/_shared/evidence-classes.md` § "Stochastic-outcome confidence framing" (shared with `optimize-seo`).

**Pure orchestration.** This skill never calls a provider API or scrapes a SERP. It builds query sets, ingests operator-supplied exports, dispatches the critic gate, and writes the snapshot. The operator (or their CI) runs the actual queries / pulls.

---

## When NOT to use this skill

- **Deciding SEO strategy or rewriting pages.** That's `optimize-seo`. `monitor-aeo` produces evidence; `optimize-seo` decides what to do about it.
- **Technical SEO audit (Core Web Vitals, hreflang, schema, indexation).** Route A in `optimize-seo`. This skill covers only AEO-specific technical readiness (Bing/IndexNow, llms.txt, AI crawler access).
- **One-line "are we ranking" question.** Use WebSearch or a rank tracker. The 8-agent orchestration is for monthly snapshots, not casual checks.
- **Pre-launch (no live site).** Nothing to measure. Wait until the site is live and has some content footprint.
- **Asking AI a question to see what it says.** That's not monitoring. Monitoring requires a locked query set, recorded over time, with provenance.

---

## The 8-item quality gate

Lives in `agents/critic-agent.md` (canonical). Summary:

| # | Gate | Owned by re-dispatch |
|---|---|---|
| 1 | No fabricated evidence | citation-monitor / geo-monitor / traffic-monitor / readiness |
| 2 | Stochastic outputs declare confidence | citation-monitor |
| 3 | AEO / GEO / SEO / referral separated | report-agent |
| 4 | Competitor cited-domains captured | citation-monitor + geo-monitor |
| 5 | Every metric has source, date, provider/model, query, freshness | report-agent |
| 6 | Recommendations are handoffs, not strategy | report-agent |
| 7 | Evidence-class index complete and accurate | report-agent |
| 8 | Handoff entries clustered, not per-row | report-agent |

PASS is binary. Max 2 rewrite cycles. After 2 FAIL cycles → deliver with unresolved-items note (orchestrator decision, not critic).

---

## Six modes

Mode drives route, route drives Layer-1 agent depth. Layer 0 (query-set + provider-readiness) runs on every route.

| Route | Mode | Trigger | Layer-1 dispatched |
|---|---|---|---|
| **A** | ai-citations | "do AI providers cite us?" | citation-monitor |
| **B** | geo-overview | "AI Overview presence?" | geo-monitor |
| **C** | ai-referrals | "what referral traffic from AI products?" | traffic-monitor |
| **D** | bing-readiness | "are we set up for Bing / IndexNow?" | readiness (Bing subset) |
| **E** | llms-readiness | "llms.txt + AI crawler access posture?" | readiness (llms subset) |
| **Z** | full-report (default) | monthly snapshot, dated report | citation + geo + traffic + readiness |

Modes can run sequentially in a single session, but each run produces one dated snapshot. Default to `full-report` unless the operator names a single mode.

---

## Cadence

- **Initial baseline:** run `full-report` once to establish snapshot v1.
- **Recurring:** run `full-report` monthly; trend computation kicks in from snapshot v2.
- **After major content launches:** run `ai-citations` 2-4 weeks after publication to catch AI-index updates.
- **After AI provider model swaps:** the operator decides whether to re-baseline (because model swaps shift citation behavior independently of subject changes).

---

## Chain position

| Upstream (informs this skill) | Downstream (this skill informs) |
|---|---|
| `research-icp` — audience search behavior drives the query set | `optimize-seo` — strategy work consumes `handoff-optimize-seo.md` |
| `optimize-seo` (AI mode) — declares which queries the strategy expects to win | — |
| Prior `monitor-aeo` snapshots — enable trend mode | — |

This is a measurement skill. It always sits **downstream of audience research** and **upstream of strategy work**. Running monitor without an ICP source produces audience-blind queries (BLOCKED). Running strategy without monitor evidence produces uncalibrated rewrites.
