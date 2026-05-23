---
name: monitor-aeo
description: "Monitors AI-search visibility across answer engines and generative-search surfaces — provider/query citation checks, Google AI Overview/GEO citation presence, Bing/IndexNow readiness, AI referral traffic, llms.txt status, competitor cited-domain share, and dated snapshot reports. Use when you need evidence of whether AI systems mention or cite a brand/site. Not for deciding SEO strategy or rewriting pages (use optimize-seo) and not for technical-audit remediation."
argument-hint: "[domain or mode]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$1-3"
---

# AEO Monitor — Orchestrator

*Communication — Horizontal. Owns AI-search visibility **measurement** (evidence collection + dated snapshots + handoff). Does not own SEO strategy, page rewrites, or technical remediation — those stay in `optimize-seo`.*

**Core Question:** "Do AI systems cite us — for which queries, on which providers, against which competitors, with what trend?"

> Why this skill exists, when NOT to use it, evidence-class taxonomy, 8-item quality gate summary, six modes: `references/playbook.md` [PLAYBOOK].

## Philosophy

AEO/GEO is an evidence job, not a strategy job. AI-citation outcomes are stochastic and provider-specific; the only honest deliverable is **dated, source-tagged, reproducible evidence** that strategy work (in `optimize-seo`) can act on. **Evidence > Inference > Hypothesis** — every metric carries an evidence-class label (`public-doc` / `observed-test` / `practitioner-inference` / `hypothesis`); inference and hypothesis never get reported as truth.

Pure orchestration. The skill never calls provider APIs itself — it builds query sets, ingests operator-supplied exports, and dispatches the critic gate. Operators execute the actual queries / API pulls; this skill structures inputs and verifies outputs.

---

## Critical Gates

Before delivering, all must hold:

1. **No fabricated evidence.** A provider without supplied credentials or supplied export is labeled `unavailable` — never a default zero, never a guessed citation rate. Missing input becomes a labeled gap, not a silent absence.
2. **Stochastic outputs declare their confidence.** AI provider responses vary turn to turn. Single-run citation observations carry a `single-run` caveat; multi-run aggregates carry `n=<runs>` + `<agreement-rate>%`.
3. **AEO ≠ GEO ≠ classic SEO ≠ referral.** These four evidence streams are reported in separate sections. Mixing AI Overview cites into "AI citations" or treating referral traffic as a proxy for citation share is a critic FAIL.
4. **Competitor cited-domains captured even when subject is absent.** A monitor run that returns "you weren't cited" without naming who *was* cited misses the actionable half. Cited-domain inventory is mandatory per query.
5. **Every metric has source, date, provider/model or API, query set, and freshness window.** A number without these fields is a critic FAIL.
6. **Recommendations are handoffs, not strategy.** Findings stop at "evidence shows X gap"; the prescription ("rewrite page Y", "add chunk Z") goes in `handoff-optimize-seo.md` and runs through `optimize-seo`.

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PROCEDURE] — load product context, check artifact staleness (>30 days → recommend re-run upstream).

| Artifact | Source | Required? |
|---|---|---|
| `icp-research.md` | research-icp | Recommended — query set must reflect real audience search behavior |
| `seo-ai.md` / `seo-audit.md` | optimize-seo | Optional — informs which queries the strategy expects to win |
| Prior `.forsvn/artifacts/mkt/aeo-monitor/[slug]/snapshots/` | this skill | Optional — enables trend mode in `full-report` |

---

## Pre-Dispatch

Run the canonical Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]).

**Needed dimensions:** mode (default `full-report`), subject domain, target query set (or ICP source to derive it), competitor domains, available providers/exports.

Full read-order + Cold Start prompt + Warm Start prompt + write-back map + Chain Position + Skill Deference + IMC Coordination table: `references/procedures/pre-dispatch.md` [PROCEDURE].

---

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — auto-downgrade for ≤3 sentences + no prior artifacts; `--fast` flag skips Layer 2 (no critic, single-agent execution). **`--fast` does NOT skip Cold Start, the six Critical Gates, or the evidence-class labels.**

**Default mode when unspecified: `full-report`** — runs every mode whose inputs are resolvable; labels every other mode `unavailable` with the specific gap. Operators get one dated snapshot per run; cherry-picking a single mode requires asking for it.

---

## Agent Manifest

| Agent | File | Layer | Mode(s) | Focus |
|-------|------|-------|---------|-------|
| query-set-agent | `agents/query-set-agent.md` | 0 (sequential, pre-layer-1) | All | Builds/validates the target AI query set from ICP + product context; assigns provider × query matrix |
| provider-readiness-agent | `agents/provider-readiness-agent.md` | 0 (sequential, pre-layer-1) | All | Inventories supplied credentials/exports per provider/source; labels every provider available / partial / unavailable with the specific gap |
| citation-monitor-agent | `agents/citation-monitor-agent.md` | 1 (parallel) | ai-citations, full-report | Ingests provider-query export data into a citation matrix; flags single-run vs multi-run; computes mention/citation/cited-domain rates per query × provider |
| geo-monitor-agent | `agents/geo-monitor-agent.md` | 1 (parallel) | geo-overview, full-report | Ingests Google AI Overview / SGE export data; records AI-Overview presence + cited domains per target keyword + competitor cited-domain share |
| traffic-monitor-agent | `agents/traffic-monitor-agent.md` | 1 (parallel) | ai-referrals, full-report | Ingests Plausible/GA4/server-log referral exports; isolates AI-product referrers (chat.openai.com, perplexity.ai, etc.); produces a labeled referral table |
| readiness-agent | `agents/readiness-agent.md` | 1 (parallel) | bing-readiness, llms-readiness, full-report | Checks Bing Webmaster posture, IndexNow submission, sitemap/robots, `llms.txt` / `llms-full.txt` presence + validity; results bucketed `ready` / `partial` / `missing` |
| report-agent | `agents/report-agent.md` | 2 (sequential) | All | Merges Layer-1 outputs into the dated snapshot + report, computes trend deltas against prior snapshots, produces `handoff-optimize-seo.md` with evidence-tagged gap list |
| critic-agent | `agents/critic-agent.md` | 2 (sequential) | All | Validates 8-item quality gate — evidence provenance, evidence-class labels, no fabricated data, AEO/GEO/SEO/referral separation, correct handoff to `optimize-seo` |

---

## Routing Logic — Mode-Based Dispatch

### Step 1: Determine Mode

Default is `full-report` (operator decision: snapshot is the primary job). Single-mode runs are opt-in.

| Situation | Mode | Route |
|-----------|------|-------|
| First snapshot, or monthly dated report | **full-report** (default) | Route Z |
| Spot check: do AI providers cite us for these queries? | **ai-citations** | Route A |
| Spot check: AI Overview presence on target keywords | **geo-overview** | Route B |
| Read AI referral evidence from analytics | **ai-referrals** | Route C |
| Bing Webmaster / IndexNow / sitemap posture | **bing-readiness** | Route D |
| `llms.txt` / `llms-full.txt` posture | **llms-readiness** | Route E |

### Step 2: Per-route Dispatch

Layer 0 (sequential) runs first on every route: `query-set-agent` → `provider-readiness-agent`. The query × provider matrix and the readiness ledger are the input contract for Layer 1.

| Route | Layer 1 (parallel) | Layer 2 (sequential) |
|---|---|---|
| **A** ai-citations | citation-monitor | report → critic |
| **B** geo-overview | geo-monitor | report → critic |
| **C** ai-referrals | traffic-monitor | report → critic |
| **D** bing-readiness | readiness (Bing/IndexNow subset) | report → critic |
| **E** llms-readiness | readiness (llms.txt subset) | report → critic |
| **Z** full-report (default) | citation-monitor + geo-monitor + traffic-monitor + readiness | report → critic |

**Route Z produces ONE merged artifact** (`report.md` + dated JSON snapshots) — distinct from optimize-seo Route E which splits into two. AEO monitor is a single dated snapshot per run by design.

Full pre-writing object schema, 8-step Multi-Agent Dispatch flow, Single-Agent Fallback, `--fast` execution path: `references/procedures/dispatch-mechanics.md` [PROCEDURE].

---

## Layer 2 — Report + Critic

`report-agent` merges Layer-1 sections, computes trend deltas against prior snapshots (`.forsvn/artifacts/mkt/aeo-monitor/[slug]/snapshots/`), and emits `handoff-optimize-seo.md` — an evidence-tagged gap list ready for `optimize-seo` to consume as strategy input. **Report never prescribes a fix.**

`critic-agent` evaluates against the **8-item quality gate** (canonical list in `agents/critic-agent.md`; summary in `references/playbook.md`). Verdict binary (PASS / FAIL). **Max 2 rewrite cycles** — on FAIL the critic names the agent to re-dispatch per the Rewrite Routing Table.

---

## Artifact Contract

Output path: `.forsvn/artifacts/mkt/aeo-monitor/[slug]/` — directory, not a single file.

```
.forsvn/artifacts/mkt/aeo-monitor/[slug]/
  report.md                                # dated report (this run)
  query-set.md                             # the locked query × provider matrix used this run
  handoff-optimize-seo.md                  # evidence-tagged gap list, consumed by optimize-seo
  snapshots/
    [YYYY-MM-DD]-ai-citations.json        # written when ai-citations or full-report ran
    [YYYY-MM-DD]-geo-overview.json        # written when geo-overview or full-report ran
    [YYYY-MM-DD]-ai-referrals.json        # written when ai-referrals or full-report ran
    [YYYY-MM-DD]-readiness.json           # written when bing- or llms- or full-report ran
```

`[slug]` = kebab-cased subject domain (e.g., `example-com` for `example.com`).

**Re-run convention:** snapshots are append-only (one set per date). `report.md`, `query-set.md`, and `handoff-optimize-seo.md` are rewritten in place each run; prior copies remain in git history. Trend computation reads `snapshots/*.json`.

Frontmatter (REQUIRED on `report.md`): `skill: monitor-aeo`, `mode`, `subject` (domain), `date`, `status`, `evidence-classes` (object: count by class).

Body sections (REQUIRED on `report.md`): Subject + Scope / Provider Readiness / AI Citations / GEO (AI Overview) / AI Referrals / Technical Readiness / Trend (vs. prior snapshot, or `n/a` first run) / Competitor Cited-Domain Share / Gaps for Strategy (→ handoff) / Methodology + Evidence Class Index.

Full template + per-snapshot JSON schema + handoff schema: `references/format-conventions.md` [PROCEDURE].

---

## Anti-Patterns

Patterns with detection rules, bad/good examples, and per-pattern agent ownership: `references/anti-patterns.md` [ANTI-PATTERN].

Most common in practice: **fabricated zero** (provider reported "0 citations" when no run actually executed → critic FAIL gate 1), **single-run certainty** (one chat turn reported as a stable rate → gate 2), **AEO/GEO conflation** (Google AI Overview cites merged into "AI citations" → gate 3), **subject-only reporting** (no competitor cited-domain inventory → gate 4), **strategy creep** (report prescribes a rewrite instead of handing off → gate 6).

---

## Completion Status

Every run ends with explicit status:

- **DONE** — selected mode executed end-to-end, every evidence cell labeled with class + provenance, critic PASS within 2 cycles, handoff written
- **DONE_WITH_CONCERNS** — analysis delivered with labeled provider gaps (credentials missing, export incomplete, single-run only); every gap named with the specific input that would resolve it
- **BLOCKED** — query set un-derivable (no ICP source AND no operator-supplied queries) OR subject domain not supplied; state exactly what's blocked + what unblocks
- **NEEDS_CONTEXT** — operator invoked a single-mode route whose inputs are entirely missing (e.g., `ai-citations` with zero provider exports); recommend `full-report` to capture whatever evidence is available, or state which exports to supply

---

## Worked Example

End-to-end Route Z walkthrough (Pre-Dispatch → Layer 0 → parallel Layer 1 → merge → critic PASS → deliver → handling missing providers → `--fast` variant): `references/examples/aeo-walkthrough.md` [EXAMPLE].

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Example:** `references/examples/aeo-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by agents at dispatch, not orchestrator): `references/{evidence-classes, provider-matrix, llms-readiness}.md`
- **Shared:** `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol}.md`
- **Agents:** 8 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` holds the canonical 8-item quality gate + Rewrite Routing Table.
