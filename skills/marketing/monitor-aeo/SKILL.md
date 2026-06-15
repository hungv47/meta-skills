---
name: monitor-aeo
description: "Monitors AI-search visibility across answer engines and generative-search surfaces — provider/query citation checks, Google AI Overview/GEO citation presence, Bing/IndexNow readiness, AI referral traffic, llms.txt status, competitor cited-domain share, and dated snapshot reports. Use when you need evidence of whether AI systems mention or cite a brand/site. Not for deciding SEO strategy or rewriting pages (use optimize-seo) and not for technical-audit remediation."
argument-hint: "[domain or mode]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.1.1"
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
2. **Stochastic outputs declare their confidence.** Single-run citation observations carry a `single-run` caveat; multi-run aggregates carry `n=<runs>` + `<agreement-rate>%`.
3. **AEO ≠ GEO ≠ classic SEO ≠ referral.** These four evidence streams are reported in separate sections. Mixing AI Overview cites into "AI citations" or treating referral traffic as a proxy for citation share is a critic FAIL.
4. **Competitor cited-domains captured even when subject is absent.** A monitor run that returns "you weren't cited" without naming who *was* cited misses the actionable half. Cited-domain inventory is mandatory per query.
5. **Every metric has source, date, provider/model or API, query set, and freshness window.** A number without these fields is a critic FAIL.
6. **Recommendations are handoffs, not strategy.** Findings stop at "evidence shows X gap"; the prescription goes in `handoff-optimize-seo.md` and runs through `optimize-seo`.

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PROCEDURE] — load product context, check artifact staleness (>30 days → recommend re-run upstream).

| Artifact | Source | Required? |
|---|---|---|
| `icp-research.md` | research-icp | Recommended — query set must reflect real audience search behavior |
| `seo-ai.md` / `seo-audit.md` | optimize-seo | Optional — informs which queries the strategy expects to win |
| Prior `docs/forsvn/artifacts/marketing/aeo-monitor/[slug]/snapshots/` | this skill | Optional — enables trend mode in `full-report` |

---

## Pre-Dispatch

Canonical Pre-Dispatch: `references/_shared/pre-dispatch-protocol.md` [PROCEDURE].

**Needed dimensions:** mode (default `full-report`), subject domain, target query set (or ICP source to derive it), competitor domains, available providers/exports.

**Query-set design (Layer 0, locked).** Pre-Dispatch produces a **balanced, locked** `query-set.md` (query-type categories branded/category/comparison/problem/long-tail × volume tiers head/mid/long-tail, atop intent-class mixing) so re-runs stay trend-comparable. Design contract: `references/procedures/pre-dispatch.md` § "Query-set design".

Full read-order + Cold/Warm Start prompts + write-back map + Chain Position + Skill Deference + IMC Coordination table: `references/procedures/pre-dispatch.md` [PROCEDURE].

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — auto-downgrade ≤3 sentences, no prior artifacts; `--fast` skips Layer 2 (no critic, single-agent). **`--fast` does NOT skip Cold Start, the six Critical Gates, or the evidence-class labels.**
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

**Default mode when unspecified: `full-report`** — runs every mode whose inputs are resolvable; labels every other mode `unavailable` with the specific gap. One dated snapshot per run; single-mode runs are opt-in.

---

## Agent Manifest

8 sub-agents across three layers (Layer 0 sequential pre-checks + Layer 1 parallel ingestors + Layer 2 sequential report→critic). Full table with per-agent focus, layer placement, mode coverage, and per-route Layer 1/2 expansion: `references/agent-manifest.md` [PROCEDURE].

## Routing — Mode-Based Dispatch

Default is `full-report` (snapshot is the primary job). Single-mode runs are opt-in.

| Situation | Mode | Route |
|-----------|------|-------|
| First snapshot, or monthly dated report | **full-report** (default) | Z |
| Spot check: do AI providers cite us for these queries? | **ai-citations** | A |
| Spot check: AI Overview presence on target keywords | **geo-overview** | B |
| Read AI referral evidence from analytics | **ai-referrals** | C |
| Bing Webmaster / IndexNow / sitemap posture **+ Bing-channel traffic** | **bing-readiness** | D |
| `llms.txt` / `llms-full.txt` posture | **llms-readiness** | E |

Per-route Layer 1 / Layer 2 agent fan-out lives in `references/agent-manifest.md` § "Per-route expansion". Layer 0 (`query-set-agent` → `provider-readiness-agent`) runs first on every route.

Full pre-writing object schema, 8-step Multi-Agent Dispatch flow, Single-Agent Fallback, `--fast` execution path: `references/procedures/dispatch-mechanics.md` [PROCEDURE].

---

## Artifact Contract

Output path: `docs/forsvn/artifacts/marketing/aeo-monitor/[slug]/` (a directory):

```
docs/forsvn/artifacts/marketing/aeo-monitor/[slug]/
  report.md                                # dated report (this run)
  query-set.md                             # the locked query × provider matrix used this run
  handoff-optimize-seo.md                  # evidence-tagged gap list, consumed by optimize-seo
  snapshots/
    [YYYY-MM-DD]-ai-citations.json
    [YYYY-MM-DD]-geo-overview.json
    [YYYY-MM-DD]-ai-referrals.json
    [YYYY-MM-DD]-readiness.json
```

`[slug]` = kebab-cased subject domain (e.g., `example-com` for `example.com`). Snapshot files are written only when their mode (or `full-report`) ran.

**Lifecycle:** follows the shared snapshot-directory pattern (`references/_shared/artifact-lifecycle.md` [PROCEDURE]): snapshots append-only (one set per date), `report.md` / `query-set.md` / `handoff-optimize-seo.md` rewritten in place (prior copies in git). Trend computation reads `snapshots/*.json`.

**Frontmatter (REQUIRED on `report.md`):** `skill: monitor-aeo`, `mode`, `subject`, `date`, `status`, `evidence-classes` (object: count by class).

Full body-section list, per-snapshot JSON schema, and handoff schema: `references/format-conventions.md` [PROCEDURE].

---

## Anti-Patterns

`references/anti-patterns.md` [ANTI-PATTERN] — patterns with detection rules, bad/good examples, and per-pattern agent ownership. Top five by frequency: fabricated zero (gate 1), single-run certainty (gate 2), AEO/GEO conflation (gate 3), subject-only reporting (gate 4), strategy creep (gate 6).

---

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

Every run ends with explicit status:

- **DONE** — selected mode executed end-to-end, every evidence cell labeled with class + provenance, critic PASS within 2 cycles, handoff written
- **DONE_WITH_CONCERNS** — analysis delivered with labeled provider gaps (credentials missing, export incomplete, single-run only); every gap named with the specific input that would resolve it
- **BLOCKED** — query set un-derivable (no ICP source AND no operator-supplied queries) OR subject domain not supplied; state exactly what's blocked + what unblocks
- **NEEDS_CONTEXT** — operator invoked a single-mode route whose inputs are entirely missing (e.g., `ai-citations` with zero provider exports); recommend `full-report` to capture whatever evidence is available, or state which exports to supply

## Next Step

Hand `handoff-optimize-seo.md` to `optimize-seo` for strategy + page-rewrite work. Re-run on cadence (monthly default) to extend the trend series.

---

## Worked Example

End-to-end Route Z walkthrough (Pre-Dispatch → Layer 0 → parallel Layer 1 → merge → critic PASS → deliver → handling missing providers → `--fast` variant): `references/examples/aeo-walkthrough.md` [EXAMPLE].

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Agent manifest:** `references/agent-manifest.md` [PROCEDURE]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Example:** `references/examples/aeo-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by agents at dispatch): `references/{provider-matrix, llms-readiness}.md`
- **Shared:** `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol, evidence-classes, artifact-lifecycle}.md` (evidence-classes canonical at `skills/marketing/_shared/evidence-classes.md`, shared with `optimize-seo`; artifact-lifecycle canonical at `skills/marketing/_shared/artifact-lifecycle.md`)
- **Agents:** 8 sub-agents in `agents/` — see `references/agent-manifest.md`. `critic-agent.md` holds the canonical 8-item quality gate + Rewrite Routing Table.
