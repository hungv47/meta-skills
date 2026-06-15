---
name: evaluate-asset
description: "Score a produced visual asset (image / graphic / carousel frame) against its brief — render fidelity + brand-fit — inside an existing eval loop, using the re-ingested asset (the return-leg). One asset (or picked variant) per cycle, verdict + brief-fidelity diagnosis. Not for video (use evaluate-shortform), a landing page (use evaluate-landing-page), live-post engagement (use evaluate-content / evaluate-ad), generating the asset (use produce-asset), or scaffolding the loop (use run-pipeline)."
argument-hint: "[loop slug or path] [asset path/id] [primary metric]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.1"
  budget: standard
  estimated-cost: "$0.75-1.50"
---

# Asset Eval — Orchestrator

<!-- BUDGET_EXCEPTION: Eval skills carry artifact-schema-as-contract (8 body sections + 8-col results row + cross-stack consumer contract) that is load-bearing and cannot move to references/. Asset-eval also surfaces the return-leg gate (score the re-ingested render, never the prompt) + brief-fidelity-vs-render-quality discrimination, which are the point of a render eval. Cycle ledger discipline requires the schema be visible in the SKILL.md body. ~800 tokens over the standard cap is the legitimate cost (matches the evaluate-content / evaluate-ad siblings). -->

*Evaluation skill. Converts a re-ingested rendered asset into a cycle snapshot + ledger row + narrowly-scoped next action inside an existing eval loop. One asset (or one picked variant) per cycle; the loop closes only when the real render — not the prompt — is scored (CLOSED-LOOP.md §6 return-leg).*

**Core Question:** "Did the rendered asset, scored against its brief's acceptance criteria and brand tokens, realize the brief well enough to keep / discard / watch / block — and what should the next brief-graphic / produce-asset cycle know?"

> Why, methodology, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK]. Capability metadata (route triggers, prerequisites, load map): [`routing.yaml`](routing.yaml).

## Critical Gates

1. **Existing eval loop required.** `program.md` + `context.md` absent → `NEEDS_CONTEXT`, recommend `/run-pipeline`. This skill does not create loops.
2. **Re-ingested asset required (the return-leg).** Score the real render, never the prompt. The asset must be attached to its manifest via the return-leg (`asset_picked` / `assets`, per `references/_shared/execution-fork.md` + CLOSED-LOOP.md §6). Only a prompt/brief present → `NEEDS_CONTEXT`, route to `produce-asset` + re-ingest (`forsvn-preview attach`).
3. **Source brief required.** The brief-graphic / produce-asset artifact carrying the acceptance criteria to score against. Absent or unreadable → `BLOCKED`.
4. **Static-visual lane only.** Image / graphic / carousel frame. Video → `evaluate-shortform`; landing page → `evaluate-landing-page`; the asset's live-post engagement → `evaluate-content` / `evaluate-ad`. Otherwise → `NEEDS_CONTEXT`, route to sibling.
5. **One asset (or picked variant) per cycle.** When the option-picker returned a variant set, score the picked variant (`asset_picked`); the rest archive. A 6-variant render = one cycle on the chosen variant, not six blended.
6. **No fabricated quality claims.** Judge only what is present in the attached render. Hallucinated visual detail, invented dimensions, or scoring an un-ingested asset are fabrication.
7. **Attribution confidence must be explicit.** Every verdict states the render engine + `execution_mode`, render settings, known-engine failure modes (text mangling, hand artifacts, aspect-ratio drift) as confounders, and confidence: `high | medium | low | blocked`.
8. **Evaluation does not produce assets.** Recommend changes; route re-rendering to `produce-asset`, brief/spec changes to `brief-graphic`, brand-token questions to `create-brand`.

## Responsibility Split

`/run-pipeline` owns loop setup + `program.md` / `context.md` / `results.tsv` schema + durable learnings. **This skill** owns post-render brief-fidelity + brand-fit snapshots scored against one re-ingested asset. `/produce-asset` owns rendering. `/brief-graphic` owns the brief. `/evaluate-content` + `/evaluate-ad` own the asset's live-post performance lanes.

**This skill is the formal return-leg gate** (`execution-fork.md` → "Closing the loop"): a brand-critical render is not "done" until scored here against its brief **and** its realized surface. Inside an eval loop this is the required closing step; without a loop, the lighter fallback is an explicit squint-test against the cited realized surface (`realized-surface-grounding.md`). Either way, **off-brief output is not accepted or committed** — score the real re-ingested render, never the prompt.

## Inputs

**Required:** loop slug/path · re-ingested asset path/id (the `asset_picked` / `assets` attachment on `docs/forsvn/artifacts/marketing/produced-assets/[slug]/manifest.md` — image / graphic / carousel frame) · source brief artifact (`docs/forsvn/artifacts/marketing/design-briefs/[slug].md`) · render engine + `execution_mode` (brief-only / assisted / direct) · primary metric (brief-fidelity score · acceptance-criteria pass rate · or a downstream metric if the asset is live).

**Recommended:** brand tokens (`brand/BRAND.md` + `brand/DESIGN.md` — palette, type, logo safe-zone, Leaf <10%) · the brief's explicit acceptance criteria (composition, required copy slots, aspect ratio/dimensions, art direction) · variant set with the picked variant flagged · baseline/prior-cycle render · downstream usage context (where the asset will ship).

## Outputs

`.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` + append one row to `results.tsv` via `bun scripts/append-loop-result.ts` (8-col helper) + update `learnings.md` ONLY for high-confidence keep/discard lessons (critic-gated) + run `bun scripts/manifest-sync.ts`.

## Agent Manifest + Dispatch

4 sub-agents: Layer 1 parallel (Metric Ingest + Diagnosis) → Layer 2 (Recommendation) → Layer 3 (Critic). Critic FAIL → revise once; still FAIL → no ledger row + `BLOCKED`. Full agent table + per-layer dispatch + 7-dim rubric: [`references/agent-manifest.md`](references/agent-manifest.md). Domain rubric: [`references/rubric.md`](references/rubric.md). Shared frame: `references/_shared/evaluation-loop-rubric.md`.

## Pre-Dispatch

Canonical: `references/_shared/pre-dispatch-protocol.md` + `references/_shared/eval-loop-spec.md`. **Hard-blocks (BEFORE Cold Start):** missing `program.md`/`context.md` → `NEEDS_CONTEXT` + `/run-pipeline`; asset not re-ingested (only a prompt) → `NEEDS_CONTEXT` + `/produce-asset` + re-ingest; asset is video / landing page → route to `evaluate-shortform` / `evaluate-landing-page`; no source brief OR missing asset id → `BLOCKED`; custom 10+ col `results.tsv` → warn + hand-edit. **Cold Start:** 6 bundled questions (loop · asset path/id · source brief path · render engine + `execution_mode` · primary metric value/baseline · brief acceptance criteria + brand tokens). Full read-order + templates + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Artifact Contract

- **Path:** `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`. **Lifecycle:** `evaluation`.
- **Frontmatter (10 fields):** `skill` / `version` / `date` / `status` / `summary` / `purpose` / `lifecycle` / `use_when` / `do_not_use_when` / `upstream` / `downstream` + provenance (`input_artifacts` = source brief-graphic artifact + the re-ingested asset + `brand/BRAND.md`; `output_eval: null`).
- **Body sections (8):** Title · Verdict · Evidence (6-col table) · What Changed This Cycle · Diagnosis (Brief-Fidelity Check + Render-Quality Signals + Brand-Fit Signals + Confounders) · Next Cycle Recommendation · Results Row (8-col TSV) · Learning Promotion. Verdict block must name the asset id + render engine explicitly (Gate 7); Evidence table scopes to that one asset/variant.
- **Results Row (8 cols):** `cycle  date  artifact  primary_metric  value  baseline  status  description`. `status` ∈ `keep|discard|watch|blocked` (Critic Hard Fail otherwise); description includes the asset id + engine tag.
- **Cross-stack contract:** consumed by future asset-eval cycles (fidelity trend) + `brief-graphic --rev=N+1` / `produce-asset` (re-render seeding) + downstream `write-social` / `write-ad` (which reference the kept asset) + human reviewers. Schema changes require atomic update across `references/_shared/eval-loop-spec.md` + downstream callers.

Full template + Evidence/Brief-Fidelity/Results/Learning formats + helper invocation: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

## Results Row Helper

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" --value "<current>" --baseline "<baseline>" \
  --status "<keep|discard|watch|blocked>" --description "<one sentence — include asset id + engine>"
```

Do not append on Critic FAIL — return `BLOCKED` instead.

## Critic Override Protocol

Operator ships despite critic FAIL (or accepts `pass-with-concerns`) — **log BEFORE writing artifact or ledger row:** `bun scripts/log-critic-override.ts --skill evaluate-asset …`. Three overrides → rubric-revision escalation. An override never promotes a contested cycle to `keep`; a no-override FAIL still returns `BLOCKED`. Full protocol: [`references/_shared/critic-override-protocol.md`](references/_shared/critic-override-protocol.md) [PROCEDURE].

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — asset-eval rows + 4 cross-cutting marketing-stack rows. Most common: scoring the prompt instead of the re-ingested render (Gate 2 + Critic Hard Fail), a pretty render that misses a hard brief constraint read as keep (Gate 5 + Critic "Brief-Fidelity Discrimination"), off-brand palette / Leaf overrun ignored (Critic "Render-Quality & Brand-Fit"), scope drift to produce-asset re-rendering (Gate 8 + Critic "Decision Discipline").

## Worked Example

End-to-end cycle (return-leg scored, hard-miss → discard, Critic PASS): [`references/examples/asset-eval-cycle-walkthrough.md`](references/examples/asset-eval-cycle-walkthrough.md).

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — eval artifact written, ledger row appended, critic PASS.
- **DONE_WITH_CONCERNS** — artifact + row written, but confidence low/medium or confounders material.
- **NEEDS_CONTEXT** — missing loop, un-ingested asset, source brief, or asset id; OR the asset is video / a landing page / a live-post-engagement question (route to right sibling).
- **BLOCKED** — contradictory data, no re-ingested asset, filesystem failure, or critic failed after revision.

## References

- `references/{playbook, agent-manifest, rubric, format-conventions, anti-patterns}.md` + `procedures/{pre-dispatch, dispatch-mechanics}.md`
- `references/_shared/{eval-loop-spec, evaluation-loop-rubric, pre-dispatch-protocol, critic-override-protocol, quality-dashboard-spec, execution-fork}.md`
- **Siblings:** `produce-asset` + `brief-graphic` (upstream/downstream), `run-pipeline` (loop scaffolding), `evaluate-{content, ad, shortform, landing-page}` (sibling lanes)
