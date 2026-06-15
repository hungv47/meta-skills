---
name: evaluate-outreach
description: "Score a sent outreach cycle (cold email / LinkedIn DM / sequence) from real reply data inside an existing eval loop — one channel + segment per cycle, verdict + reply-quality diagnosis with a deliverability + compliance gate. Not for writing the outreach (use write-outreach), organic-post performance (use evaluate-content), paid-ad performance (use evaluate-ad), or scaffolding the loop (use run-pipeline)."
argument-hint: "[loop slug or path] [channel+segment] [primary metric]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.1"
  budget: standard
  estimated-cost: "$0.75-1.50"
---

# Outreach Eval — Orchestrator

<!-- BUDGET_EXCEPTION: Eval skills carry artifact-schema-as-contract (8 body sections + 8-col results row + cross-stack consumer contract) that is load-bearing and cannot move to references/. Outreach-eval also surfaces reply-quality discrimination + a deliverability/compliance gate (the safety lens that keeps a reply-chasing sequence from burning the sending domain), which are the point of an outreach eval. Cycle ledger discipline requires the schema be visible in the SKILL.md body. ~800 tokens over the standard cap is the legitimate cost (matches the evaluate-content / evaluate-ad siblings). -->

*Evaluation skill. Converts sent outreach evidence into a cycle snapshot + ledger row + narrowly-scoped next action inside an existing eval loop. One channel + segment per cycle; reply quality drives the verdict, and a deliverability/compliance red flag blocks a keep no matter how good the replies look.*

**Core Question:** "Did this outreach cycle, on its channel + segment, earn meaningful replies (positive / meeting-booked / qualified-lead) without burning deliverability or breaking compliance — enough to keep / discard / watch / block — and what should the next write-outreach cycle know?"

> Why, methodology, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK]. Capability metadata (route triggers, prerequisites, load map): [`routing.yaml`](routing.yaml).

## Critical Gates

1. **Existing eval loop required.** `program.md` + `context.md` absent → `NEEDS_CONTEXT`, recommend `/run-pipeline`. This skill does not create loops.
2. **Sent + measured outreach only.** The sequence actually went out and reply/bounce data exists. A draft → `NEEDS_CONTEXT`, route to `write-outreach`. This skill scores what shipped, not a draft.
3. **Source write-outreach artifact required.** The sequence being scored (`docs/forsvn/artifacts/marketing/write-outreach/[channel]-[date]-[slug].md`). Absent or unreadable → `BLOCKED`.
4. **One channel + segment per cycle.** `email` / `linkedin-dm` / `twitter-dm` + one ICP segment. Cross-channel or cross-segment blending is contamination → secondary channels/segments are context only, never verdict input.
5. **No fabricated reply data.** Unknown values stay unknown. Reply categories, bounce, and meetings must trace to a named tool (Instantly / Smartlead / Apollo / lemlist / CRM / manual export).
6. **Deliverability + compliance evidence required.** Bounce rate, spam-complaint rate, sender reputation, and opt-out/CAN-SPAM/GDPR/platform-ToS compliance. A deliverability or compliance red flag blocks a `keep` (Critic Hard Fail #12).
7. **Attribution confidence must be explicit.** Sample size (sends), list quality/freshness, sequence step attributed, confounders (sender warmup, seasonality, list source, domain age), and confidence: `high | medium | low | blocked`.
8. **Evaluation does not write outreach.** Recommend changes; route copy/sequence authorship to `write-outreach`, list/targeting questions to `research-icp`.

## Responsibility Split

`/run-pipeline` owns loop setup + `program.md` / `context.md` / `results.tsv` schema + durable learnings. **This skill** owns post-send reply-quality + deliverability snapshots scored against one channel + segment. `/write-outreach` owns next-cycle copy. `/research-icp` owns list/targeting. `/evaluate-content` + `/evaluate-ad` own their lanes.

## Inputs

**Required:** loop slug/path · channel + segment tag (`email` · `linkedin-dm` · `twitter-dm` + ICP segment) · source write-outreach artifact (`docs/forsvn/artifacts/marketing/write-outreach/[channel]-[date]-[slug].md`) · measurement window · sends (sample-size floor) · primary metric value + source (positive-reply rate · meeting-booked rate · qualified-lead rate).

**Recommended:** baseline/prior-cycle row · reply breakdown (positive / meeting-booked / qualified vs neutral / negative / auto-reply / unsubscribe) · deliverability data (bounce rate, spam-complaint rate, sender reputation) · compliance status (opt-out honored, CAN-SPAM/GDPR/ToS) · sequence-step attribution (which step earned the reply) · guardrails from `program.md`.

## Outputs

`.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` + append one row to `results.tsv` via `bun scripts/append-loop-result.ts` (8-col helper) + update `learnings.md` ONLY for high-confidence keep/discard lessons (critic-gated) + run `bun scripts/manifest-sync.ts`.

## Agent Manifest + Dispatch

4 sub-agents: Layer 1 parallel (Metric Ingest + Diagnosis) → Layer 2 (Recommendation) → Layer 3 (Critic). Critic FAIL → revise once; still FAIL → no ledger row + `BLOCKED`. Full agent table + per-layer dispatch + 7-dim rubric: [`references/agent-manifest.md`](references/agent-manifest.md). Domain rubric: [`references/rubric.md`](references/rubric.md). Shared frame: `references/_shared/evaluation-loop-rubric.md`.

## Pre-Dispatch

Canonical: `references/_shared/pre-dispatch-protocol.md` + `references/_shared/eval-loop-spec.md`. **Hard-blocks (BEFORE Cold Start):** missing `program.md`/`context.md` → `NEEDS_CONTEXT` + `/run-pipeline`; outreach is a draft (not sent) → `NEEDS_CONTEXT` + `/write-outreach`; no reply evidence OR missing channel+segment tag → `BLOCKED`; no deliverability/compliance evidence → `BLOCKED`; custom 10+ col `results.tsv` → warn + hand-edit. **Cold Start:** 6 bundled questions (loop · channel+segment · source write-outreach artifact path · window · primary metric value/baseline · sends + reply breakdown + deliverability/compliance). Full read-order + templates + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

## Artifact Contract

- **Path:** `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`. **Lifecycle:** `evaluation`.
- **Frontmatter (10 fields):** `skill` / `version` / `date` / `status` / `summary` / `purpose` / `lifecycle` / `use_when` / `do_not_use_when` / `upstream` / `downstream` + provenance (`input_artifacts` = source write-outreach artifact + `research/icp-research.md` + `brand/BRAND.md`; `output_eval: null`).
- **Body sections (8):** Title · Verdict · Evidence (6-col table) · What Changed This Cycle · Diagnosis (Reply-Quality Signals + Deliverability & Compliance + Cross-Channel Context + Confounders) · Next Cycle Recommendation · Results Row (8-col TSV) · Learning Promotion. Verdict block must name the channel + segment explicitly (Gate 4); Evidence table scopes to that channel.
- **Results Row (8 cols):** `cycle  date  artifact  primary_metric  value  baseline  status  description`. `status` ∈ `keep|discard|watch|blocked` (Critic Hard Fail otherwise); description includes the channel + segment tag.
- **Cross-stack contract:** consumed by future outreach-eval cycles (trend) + `write-outreach --rev=N+1` (hypothesis seeding) + `research-icp` (list signal) + human reviewers. Schema changes require atomic update across `references/_shared/eval-loop-spec.md` + downstream callers.

Full template + Evidence/Reply-Quality/Deliverability/Results/Learning formats + helper invocation: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

## Results Row Helper

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" --value "<current>" --baseline "<baseline>" \
  --status "<keep|discard|watch|blocked>" --description "<one sentence — include channel + segment>"
```

Do not append on Critic FAIL — return `BLOCKED` instead.

## Critic Override Protocol

Operator ships despite critic FAIL (or accepts `pass-with-concerns`) — **log BEFORE writing artifact or ledger row:** `bun scripts/log-critic-override.ts --skill evaluate-outreach …`. Three overrides → rubric-revision escalation. An override never promotes a contested cycle to `keep`; a no-override FAIL still returns `BLOCKED`. Full protocol: [`references/_shared/critic-override-protocol.md`](references/_shared/critic-override-protocol.md) [PROCEDURE].

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — outreach-eval rows + 4 cross-cutting marketing-stack rows. Most common: open-rate vanity read as success (Gate 6 + Critic "Reply-Quality Discrimination"), a reply-winning sequence that is burning the domain or breaking opt-out (Critic "Deliverability & Compliance"), cross-channel contamination of the verdict (Gate 4), scope drift to write-outreach authorship (Gate 8 + Critic "Decision Discipline").

## Worked Example

Outreach cycle (reply quality acceptable, deliverability/compliance gate forces watch): [`references/examples/outreach-eval-cycle-walkthrough.md`](references/examples/outreach-eval-cycle-walkthrough.md).

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — eval artifact written, ledger row appended, critic PASS.
- **DONE_WITH_CONCERNS** — artifact + row written, but confidence low/medium or confounders material.
- **NEEDS_CONTEXT** — missing loop, source write-outreach artifact, channel+segment tag, reply evidence, or deliverability/compliance data; OR the outreach is a draft (route to write-outreach).
- **BLOCKED** — contradictory data, no reply evidence, filesystem failure, or critic failed after revision.

## References

- `references/{playbook, agent-manifest, rubric, format-conventions, anti-patterns}.md` + `procedures/{pre-dispatch, dispatch-mechanics}.md`
- `references/_shared/{eval-loop-spec, evaluation-loop-rubric, pre-dispatch-protocol, critic-override-protocol, quality-dashboard-spec}.md`
- **Siblings:** `write-outreach` (downstream), `research-icp` (list/targeting), `run-pipeline` (loop scaffolding), `evaluate-{content, ad, asset, campaign}` (sibling lanes)
