---
title: Asset-Eval Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: evaluate-asset
load_class: PROCEDURE
---

# Asset-Eval Dispatch Mechanics

> Full dispatch + critic + side-effects procedure. Cited from SKILL.md "Dispatch" section. Body retains the 8-step Dispatch summary; this file holds the full per-agent dispatch tables + critic revision-cycle semantics + critic-override invocation + `append-loop-result.ts` helper invocation + manifest-sync invocation.

## How to spawn a sub-agent

1. **Read** agent instruction file — include FULL content in the Agent prompt
2. **Append** context (resolved cycle number + loop slug + asset id/picked variant + read-order outputs from Pre-Dispatch + the source brief's acceptance criteria + render-engine/execution_mode + the re-ingested asset path + prior cycle context from `results.tsv`)
3. **Resolve** all file paths to absolute (rooted at the skill directory)
4. **Pass upstream artifacts by content** — orchestrator reads `program.md`, `context.md`, `results.tsv`, the source brief, and confirms the re-ingested asset FIRST (and opens the image), then includes excerpts; sub-agents do not re-read these directly except the image, which Diagnosis opens to judge what is visible
5. If **critic feedback** exists (Layer 3 revision cycle), append with `## Critic Feedback — Address Every Point`

### Single-agent fallback

If multi-agent dispatch is unavailable, execute layers sequentially per the same Layer 1 → Layer 2 → Layer 3 order. There are no user-facing approval gates — the verdict is critic-gated, not user-gated. The critic revision cycle stays.

## Layer 1: Parallel ingest + diagnosis

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Metric Ingest Agent | program.md (primary metric + guardrails + asset scope) + context.md (baseline render) + the re-ingested asset path (confirm viewable) + source brief (acceptance criteria) + render engine + execution_mode + results.tsv (prior cycles) | — |
| Diagnosis Agent | Metric Ingest output (waited-on packet: acceptance criteria hard/soft, dimensions, engine, picked variant) + the re-ingested asset (Read the image) + source brief (composition, copy slots, aspect ratio, art direction) + brand tokens (BRAND.md, DESIGN.md) | `references/rubric.md` (for Brief-Fidelity + Render-Quality & Brand-Fit signal expectations) |

**Note on Layer 1 dependency:** Diagnosis consumes Metric Ingest's packet (re-ingest confirmation, acceptance-criteria hard/soft split, picked variant). Metric Ingest can run independently; Diagnosis waits for the packet before scoring. In single-agent mode, this collapses to sequential.

## Layer 2: Recommendation

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Recommendation Agent | Layer 1 outputs (Metric Ingest + Diagnosis) + program.md guardrails + prior cycles' verdicts + asset id | `references/rubric.md` (for routing-rule alignment) |

Output: proposed verdict (`keep | discard | watch | blocked`) + Confidence (`high | medium | low | blocked`) + asset id (echoed from Metric Ingest) + Decision sentence (includes the asset id + engine) + Next Cycle Recommendation (component-granular Keep/Discard/Watch/Route-next-work-to lines) + Brief-Fidelity Decision block (hard_constraints_met + brand_fit_read + quality_caution) + Results Row (8-column TSV with asset id + engine in description) + Learning Promotion proposal (yes/no with engine/brief-type/brand-scoped lesson + expiry).

## Layer 3: Critic

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Critic Agent | Full assembled eval artifact + Results Row proposal + Learning Promotion proposal + Layer 1 outputs + Layer 2 outputs + asset id + source brief path | `references/rubric.md` (canonical 7-dim 0-10 rubric — MUST load before scoring) |

Critic enforces the 7-dimension rubric (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Brief-Fidelity Discrimination / Render-Quality & Brand-Fit / Ledger Correctness, each 0-10) + 3-tier verdict (PASS ≥49 AND no dim <6 / PASS_WITH_CONCERNS ≥42 AND no dim <6 + confidence/confounders surfaced / FAIL <42 OR any dim <6 OR any Hard Fail) + 12 Hard Fails (see critic-agent.md § Hard Fails — covers no loop / no re-ingested asset / unreadable source brief / wrong-lane content / missing-or-fabricated criteria / fabricated visual detail / invalid ledger status / missing asset-id in ledger description / no-baseline learning promotion / unidentified picked variant / hard-constraint-miss keep / ignored brand-fit failure).

### Revision cycle (1 cycle max)

| Critic outcome | Action |
|---|---|
| PASS or PASS_WITH_CONCERNS | Proceed to side effects (Critic Override Logging fires BEFORE side effect #2 if operator overrides on PASS_WITH_CONCERNS) |
| FAIL on first pass | Revise once — re-dispatch the agent(s) named in critic's `required_fixes`: Recommendation Agent for verdict/learning/routing errors; Metric Ingest Agent for re-ingest-confirmation/criteria-extraction/variant errors; Diagnosis Agent for brief-fidelity/render-quality/brand-fit errors |
| FAIL after revision | Return BLOCKED with the missing-evidence list. **Write NO ledger row, NO learning promotion, NO eval artifact** (or write with `status: blocked` for audit trail per format-conventions). Operator may override via Critic Override Protocol — see below. |

### Critic Override Protocol (when operator ships despite FAIL or accepts PASS_WITH_CONCERNS)

When the operator explicitly decides to ship despite a critic FAIL OR accept a `pass-with-concerns` verdict, **log the override before any side effect fires**. The override log is the only mechanism that turns repeated operator pushback into a rubric-revision signal.

```bash
bun scripts/log-critic-override.ts \
  --skill evaluate-asset \
  --dimension "<failed rubric dimension>" \
  --artifact "<project-relative path to the eval artifact under review>" \
  --critic-verdict <fail|pass-with-concerns> \
  --operator-decision <ship|revise|ignore> \
  --reason "<one sentence — why the override is justified>" \
  --follow-up "<none|watch metric|revise rubric|extract shared rubric>"
```

The script appends a dated block to `docs/forsvn/artifacts/meta/records/critic-overrides.md`. After three valid overrides on the same `evaluate-asset:<dimension>` pair, the rubric should be revised (escalation handled by the dashboard's `rubrics[skill:dimension].action` field — see `_shared/quality-dashboard-spec.md`).

Only after the override is logged may side effect #2 (ledger append) proceed. The ledger row status MUST reflect actual cycle evidence — operator override does NOT promote a contested cycle to `keep`; pick `watch` or `discard` if the render misses a hard constraint.

## Side effects (executed in order, ONLY after critic PASS or PASS_WITH_CONCERNS + override logged if applicable)

1. **Write eval artifact** at `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` per `format-conventions.md` template
2. **Append ledger row** via validated helper:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include asset id + engine tag>"
```

The helper validates the 8-column standard schema. Custom 10+ column loops require hand-edit (see `format-conventions.md` § "Known limitation — custom schemas") — flag affected loops to the eval-loop owner BEFORE manual append.

3. **Update `learnings.md`** ONLY if critic approved promotion (high-confidence `keep`/`discard` AND lesson reusable beyond this exact render AND engine/brief-type/brand-scoped). Critic Hard Fail #9 enforces — promotion from low-confidence-or-blocked-or-no-baseline evidence triggers FAIL and skips this step.
4. **Run manifest sync:**

```bash
bun scripts/manifest-sync.ts
```

## 8-step Dispatch procedure (summary — full per-layer + side-effects above)

1. Resolve loop path + next cycle number + asset/variant scope. Cycle number is `last results.tsv cycle + 1`.
2. Layer 1 parallel: Metric Ingest + Diagnosis (Diagnosis waits on Metric Ingest's packet; opens the image).
3. Layer 2: Recommendation consumes Layer 1 outputs and proposes verdict, brief-fidelity decision, next-cycle routing, ledger row, learning promotion.
4. Layer 3: Critic validates artifact against the 7-dim rubric in `references/rubric.md`.
5. If Critic FAIL, revise once. If still failing, write no ledger row and return `BLOCKED` (or trigger Critic Override Protocol if operator chooses to ship).
6. Write eval artifact and append exactly one `results.tsv` row using `append-loop-result.ts`.
7. Promote learning only when Critic allows it.
8. Run manifest sync.

## Conventions

- **Cycle number resolution:** `last results.tsv cycle + 1`. Override only when the user explicitly names a cycle that has no existing eval artifact.
- **Source citation:** Every value cites its source (re-ingested render manifest / brand tokens / operator-supplied). Critic Hard Fail #6 catches fabricated values.
- **Confidence honesty:** Confidence is one of `high | medium | low | blocked`. Low-confidence and no-baseline findings ship as `watch` or `blocked`, not `keep`. Critic dimension "Attribution Honesty" enforces.
- **Return-leg discipline:** Score the re-ingested render, never the prompt. Critical Gate 2 + Critic Hard Fail #2 enforce.
- **Brief-fidelity discipline:** Every HARD acceptance criterion is checked against the render; a hard miss blocks `keep`. Critic Hard Fail #11 enforces.
- **Brand-fit discipline:** Palette / Leaf <10% / type / logo checked against brand tokens; an off-brand keep is Critic Hard Fail #12.
- **Boundary respect:** Recommendations route next work (e.g., "Route next work to: produce-asset --rev=N+1 — re-render, constrain in-image headline to ≤4 words"). Do NOT write the next prompt or composition — that's produce-asset's / brief-graphic's job. Critical Gate 8 + Critic dimension "Decision Discipline" enforce.
- **Component-granular recommendations:** Name the specific component to change (the copy slot | the palette | the aspect ratio | the variant pick), not "redo the asset."
- **Learning promotion conservatism:** Default to NOT promote. Criteria: high-confidence + status keep/discard + lesson reusable beyond this exact render + engine/brief-type/brand-scoped + a baseline exists.
- **Side effects ALL-OR-NOTHING on critic FAIL:** If critic FAILs after revision (and no override), skip ALL 4 side effects. Return BLOCKED with the missing-evidence list. If operator overrides, the override-log invocation fires BEFORE side effect #2; side effects #1, #2, #4 then proceed; side effect #3 (learning promotion) still requires critic PASS approval.
