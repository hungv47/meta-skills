---
name: evaluate-seo
description: "Score an SEO / AEO cycle from real ranking + visibility data inside an existing eval loop — one keyword cluster + surface (organic SERP or AI answers) per cycle, verdict + visibility-delta diagnosis with a lag-and-volatility gate that refuses short-window noise. Not for running the audit/fixes (use optimize-seo), tracking AI citations (use monitor-aeo), organic-post performance (use evaluate-content), or scaffolding the loop (use run-pipeline)."
argument-hint: "[loop slug or path] [keyword cluster + surface] [primary metric]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.1"
  budget: standard
  estimated-cost: "$0.75-1.50"
---

# SEO/AEO Eval — Orchestrator

<!-- BUDGET_EXCEPTION: Eval skills carry artifact-schema-as-contract (8 body sections + 8-col results row + cross-stack consumer contract) that is load-bearing and cannot move to references/. SEO-eval also surfaces visibility-signal discrimination (ranking/clicks/citations vs impression vanity) + a lag-and-volatility gate (SEO/AEO signals lag and churn, so a short-window bump is noise not a keep), which are the point of an SEO eval. Cycle ledger discipline requires the schema be visible in the SKILL.md body. ~800 tokens over the standard cap is the legitimate cost (matches the evaluate-content / evaluate-ad siblings). -->

*Evaluation skill. Converts SEO / AEO measurement evidence into a cycle snapshot + ledger row + narrowly-scoped next action inside an existing eval loop. One keyword cluster + surface per cycle; SEO signals lag and are volatile, so a sub-window bump never earns a keep.*

**Core Question:** "Did this SEO / AEO cycle, on its keyword cluster + surface, move meaningful visibility (target-keyword ranking · organic clicks · AI-answer citation) over a long-enough window to keep / discard / watch / block — and what should the next optimize-seo / monitor-aeo cycle target?"

> Why, methodology, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK]. Capability metadata (route triggers, prerequisites, load map): [`routing.yaml`](routing.yaml).

## Critical Gates

1. **Existing eval loop required.** `program.md` + `context.md` absent → `NEEDS_CONTEXT`, recommend `/run-pipeline`. This skill does not create loops.
2. **Measurement evidence required.** Ranking / clicks / citation data with a named source (Google Search Console · Ahrefs · Semrush · AEO monitor / `monitor-aeo` output). Absent → `BLOCKED`. This skill does not run as a heuristic audit (that is `optimize-seo`).
3. **Source SEO/AEO artifact required.** The `optimize-seo` or `monitor-aeo` artifact whose change is being scored (`docs/forsvn/artifacts/marketing/optimize-seo/[date]-<slug>.md` or `docs/forsvn/artifacts/marketing/monitor-aeo/[date]-[slug].md`). Absent or unreadable → `BLOCKED`.
4. **One keyword cluster + surface per cycle.** One target keyword/cluster + one surface (`organic-serp` or `ai-answers`). Cross-cluster or cross-surface blending is contamination → secondary clusters/surfaces are context only.
5. **No fabricated ranking / citation data.** Unknown values stay unknown. Positions, clicks, and citations trace to a named tool + a dated pull.
6. **Minimum measurement window respected (the lag gate).** SEO/AEO signals lag and churn. A window below the loop's declared minimum (default ≥28 days for a ranking trend) cannot earn `keep` — it ships as `watch` or `blocked` (Critic Hard Fail #12).
7. **Attribution confidence must be explicit.** Window length vs the lag floor, plus confounders (core/algorithm update, seasonality, keyword cannibalization, indexation change, SERP-feature volatility, AEO answer churn), and confidence: `high | medium | low | blocked`.
8. **Evaluation does not optimize.** Recommend changes; route on-page/technical fixes to `optimize-seo`, AI-answer tracking to `monitor-aeo`, content authorship to `write-copy`.

## Responsibility Split

`/run-pipeline` owns loop setup + `program.md` / `context.md` / `results.tsv` schema + durable learnings. **This skill** owns post-change visibility snapshots scored against one keyword cluster + surface over a lag-respecting window. `/optimize-seo` owns the audit + fixes. `/monitor-aeo` owns AI-answer tracking. `/evaluate-content` + `/evaluate-ad` own their lanes.

## Inputs

**Required:** loop slug/path · keyword cluster + surface tag (`organic-serp` · `ai-answers`) · source optimize-seo / monitor-aeo artifact · measurement window (≥ the loop's lag floor) · primary metric value + source (target-keyword avg position · organic clicks · AI-citation rate).

**Recommended:** baseline/prior-cycle row · visibility breakdown (target-keyword position · organic clicks · impressions · CTR · AI-citation inclusion · organic conversions) · confounder log (core-update dates, seasonality, cannibalization, indexation changes) · guardrails from `program.md`.

## Outputs

`.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` + append one row to `results.tsv` via `bun scripts/append-loop-result.ts` (8-col helper) + update `learnings.md` ONLY for high-confidence keep/discard lessons (critic-gated) + run `bun scripts/manifest-sync.ts`.

## Agent Manifest + Dispatch

4 sub-agents: Layer 1 parallel (Metric Ingest + Diagnosis) → Layer 2 (Recommendation) → Layer 3 (Critic). Critic FAIL → revise once; still FAIL → no ledger row + `BLOCKED`. Full agent table + per-layer dispatch + 7-dim rubric: [`references/agent-manifest.md`](references/agent-manifest.md). Domain rubric: [`references/rubric.md`](references/rubric.md). Shared frame: `references/_shared/evaluation-loop-rubric.md`.

## Pre-Dispatch

Canonical: `references/_shared/pre-dispatch-protocol.md` + `references/_shared/eval-loop-spec.md`. **Hard-blocks (BEFORE Cold Start):** missing `program.md`/`context.md` → `NEEDS_CONTEXT` + `/run-pipeline`; no measurement evidence OR missing keyword-cluster+surface tag → `BLOCKED`; window below the lag floor with intent to claim `keep` → warn (Critic Hard Fail #12 will FAIL it); custom 10+ col `results.tsv` → warn + hand-edit. **Cold Start:** 6 bundled questions (loop · keyword cluster + surface · source optimize-seo/monitor-aeo artifact path · window vs lag floor · primary metric value/baseline · confounder log incl. core-update dates). Full read-order + templates + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Artifact Contract

- **Path:** `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`. **Lifecycle:** `evaluation`.
- **Frontmatter (10 fields):** `skill` / `version` / `date` / `status` / `summary` / `purpose` / `lifecycle` / `use_when` / `do_not_use_when` / `upstream` / `downstream` + provenance (`input_artifacts` = source optimize-seo/monitor-aeo artifact + `research/icp-research.md`; `output_eval: null`).
- **Body sections (8):** Title · Verdict · Evidence (6-col table) · What Changed This Cycle · Diagnosis (Visibility-Signal Read + Lag & Volatility Check + Cross-Surface Context + Confounders) · Next Cycle Recommendation · Results Row (8-col TSV) · Learning Promotion. Verdict block must name the keyword cluster + surface explicitly (Gate 4); Evidence table scopes to that cluster.
- **Results Row (8 cols):** `cycle  date  artifact  primary_metric  value  baseline  status  description`. `status` ∈ `keep|discard|watch|blocked` (Critic Hard Fail otherwise); description includes the keyword cluster + surface tag + the window length.
- **Cross-stack contract:** consumed by future SEO-eval cycles (trend) + `optimize-seo` / `monitor-aeo` (next-target seeding) + human reviewers. Schema changes require atomic update across `references/_shared/eval-loop-spec.md` + downstream callers.

Full template + Evidence/Visibility/Lag/Results/Learning formats + helper invocation: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

## Results Row Helper

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" --value "<current>" --baseline "<baseline>" \
  --status "<keep|discard|watch|blocked>" --description "<one sentence — include cluster + surface + window>"
```

Do not append on Critic FAIL — return `BLOCKED` instead.

## Critic Override Protocol

Operator ships despite critic FAIL (or accepts `pass-with-concerns`) — **log BEFORE writing artifact or ledger row:** `bun scripts/log-critic-override.ts --skill evaluate-seo …`. Three overrides → rubric-revision escalation. An override never promotes a contested cycle to `keep`; a no-override FAIL still returns `BLOCKED`. Full protocol: [`references/_shared/critic-override-protocol.md`](references/_shared/critic-override-protocol.md) [PROCEDURE].

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — SEO-eval rows + 4 cross-cutting marketing-stack rows. Most common: impression/keyword-count vanity read as success (Gate 5 + Critic "Visibility-Signal Discrimination"), a short-window ranking bump scored as keep (Gate 6 + Critic "Lag & Volatility Discipline"), a core-update confounder unflagged while claiming the change worked (Critic "Attribution Honesty"), scope drift to optimize-seo fixes (Gate 8 + Critic "Decision Discipline").

## Worked Example

SEO cycle (apparent ranking bump → watch under the lag-and-volatility gate): [`references/examples/seo-eval-cycle-walkthrough.md`](references/examples/seo-eval-cycle-walkthrough.md).

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — eval artifact written, ledger row appended, critic PASS.
- **DONE_WITH_CONCERNS** — artifact + row written, but confidence low/medium, window near the lag floor, or confounders material.
- **NEEDS_CONTEXT** — missing loop, measurement evidence, source SEO/AEO artifact, or keyword-cluster+surface tag; OR the question is an audit (route to optimize-seo) / AI-citation tracking (route to monitor-aeo).
- **BLOCKED** — contradictory data, no measurement evidence, window below the lag floor for a keep claim, filesystem failure, or critic failed after revision.

## References

- `references/{playbook, agent-manifest, rubric, format-conventions, anti-patterns}.md` + `procedures/{pre-dispatch, dispatch-mechanics}.md`
- `references/_shared/{eval-loop-spec, evaluation-loop-rubric, pre-dispatch-protocol, critic-override-protocol, quality-dashboard-spec}.md`
- **Siblings:** `optimize-seo` + `monitor-aeo` (upstream/downstream), `run-pipeline` (loop scaffolding), `evaluate-{content, ad, asset, campaign}` (sibling lanes)
