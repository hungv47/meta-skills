---
name: evaluate-landing-page
description: "Scores a launched landing page from real performance evidence inside an existing eval loop. Writes a cycle eval snapshot and appends the loop results ledger. Use for post-launch CRO cycles backed by analytics, experiment results, recordings, form-funnel data, or qualified manual metric notes. Not for designing the next page brief or a redesign (use brief-landing-page), channel-strategy questions (use plan-campaign), generic best-practice audits without measurement evidence, or scaffolding the loop itself (use run-eval-loop)."
argument-hint: "[loop slug or path] [page URL/route] [metric window]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "0.1.0"
  budget: standard
  estimated-cost: "$0.75-1.50"
---

# Landing Page Eval — Orchestrator

*Evaluation skill. Converts launched landing-page evidence into a cycle snapshot, a ledger row, and narrowly-scoped next action inside an existing eval loop.*

**Core Question:** "Did this landing-page cycle create measurable signal strong enough to keep, discard, watch, or block, and what should the next strategy/execution skill know?"

> Why this skill exists, philosophy, methodology, principles, when NOT to use, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates

1. **Existing eval loop required.** If `.forsvn/loops/[slug]/program.md` and `context.md` do not exist, return `NEEDS_CONTEXT` and recommend `/run-eval-loop`. This skill does not create loops.
2. **Measurement evidence required.** Do not run as a generic heuristic audit. Require at least one metric source, measurement window, and current value for the loop's primary metric.
3. **One primary metric decides the ledger row.** Secondary metrics and qualitative evidence explain diagnosis; they do not override the loop's primary metric unless `program.md` defines an explicit guardrail failure.
4. **No fabricated analytics.** Unknown values stay unknown. Manual notes are allowed only when labeled as operator-supplied and tied to a date/window/source.
5. **Attribution confidence must be explicit.** Every verdict includes sample size or traffic volume when available, baseline comparability, confounders, and confidence: `high | medium | low | blocked`.
6. **Evaluation does not redesign.** Recommend next changes, but route actual page brief/revision work to `brief-landing-page` and execution artifacts to the appropriate content/design/build workflow.

## Responsibility Split

- `/run-eval-loop` owns loop setup, `program.md`, `context.md`, `results.tsv` schema, and the durable learning ledger.
- `/evaluate-landing-page` owns post-launch landing-page evidence snapshots for a loop cycle.
- `/brief-landing-page` owns new page and redesign briefs after an eval identifies what should change.

## Inputs

| Input | Required? | What it provides |
|---|---:|---|
| Loop slug or path | **required** | Locates `.forsvn/loops/[slug]/` |
| Page URL or route | **required** | Evaluated surface |
| Measurement window | **required** | Date range for the current cycle |
| Primary metric value + source | **required** | Ledger decision metric |
| Baseline or prior cycle row | required if available | Comparison point |
| Traffic/sample size | recommended | Confidence and power |
| Guardrail metrics | optional | Bounce, form completion, qualified lead rate, revenue, page speed, spend efficiency |
| Experiment notes | optional | Variant split, assignment, test integrity |
| Qualitative evidence | optional | Heatmaps, recordings, user comments, sales notes |
| Strategy/execution artifacts | optional | What was changed this cycle |

## Outputs

Primary artifact:

```text
.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md
```

Side effects:

- Append one row to `.forsvn/loops/[slug]/results.tsv` with `scripts/append-loop-result.ts`.
- Update `.forsvn/loops/[slug]/learnings.md` only for high-confidence `keep` or `discard` lessons that are reusable beyond this exact page state.
- Run `manifest-sync` after writing.

## Agent Manifest

| Agent | Layer | File | Focus |
|---|---|---|---|
| Metric Ingest | 1 (parallel) | `agents/metric-ingest-agent.md` | Normalizes primary metric, baseline, sample, window, guardrails, source caveats |
| Diagnosis | 1 (parallel) | `agents/diagnosis-agent.md` | Connects observed outcomes to page hypothesis, execution delta, traffic/source context, and user behavior |
| Recommendation | 2 | `agents/recommendation-agent.md` | Chooses keep/discard/watch/blocked and next-cycle actions |
| Critic | 3 | `agents/critic-agent.md` | Enforces evidence discipline, loop boundary, ledger correctness, and no fake analytics |

## Pre-Dispatch

Read `references/_shared/eval-loop-spec.md` before writing artifacts when available.

**Hard-block conditions (fire BEFORE Cold Start):** (1) `program.md` or `context.md` absent → NEEDS_CONTEXT, recommend `/run-eval-loop`. (2) No measurement evidence for current cycle → BLOCKED with missing-evidence list. (3) Custom 10+ column `results.tsv` schema → warn + flag to eval-loop owner; require hand-edit (not standard helper).

**Read Order:** `program.md` → `context.md` → `results.tsv` → latest `strategy/` + `execution/` + `evals/` files → canonical artifacts (`brand/BRAND.md`, `research/product-context.md`, `research/icp-research.md`, campaign plan if present). If `.agents/manifest.json` is stale, run `bun scripts/manifest-sync.ts`.

**Warm Start** (loop exists + metric evidence present): summarize loop + primary metric + baseline/prior result + latest strategy/execution artifact + current evidence window; proceed to evaluate cycle N.

**Cold Start** (loop exists but cycle context missing): ask 5 bundled questions — loop slug/path + page URL/route + measurement window + primary metric value/baseline + what changed this cycle. If the loop itself does not exist, return `NEEDS_CONTEXT` and recommend `/run-eval-loop` instead of asking the rest.

Full Read Order + Warm/Cold Start templates verbatim + hard-block conditions + Needed dimensions + write-back (none — eval-loop owns persistent state, not lp-eval) + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Dispatch

1. Resolve loop path and next cycle number. Cycle number is `last results.tsv cycle + 1`, unless the user explicitly names a cycle that has no existing eval artifact.
2. Layer 1 parallel: Metric Ingest + Diagnosis.
3. Layer 2: Recommendation consumes both Layer 1 outputs and proposes verdict, next actions, ledger row, and learning promotion.
4. Layer 3: Critic validates artifact, ledger row, and learning update.
5. If Critic FAIL, revise once. If still failing, write no ledger row and return `BLOCKED` with missing evidence.
6. Write eval artifact and append exactly one `results.tsv` row using `append-loop-result.ts`.
7. Promote learning only when Critic allows it.
8. Run manifest sync.

Full per-layer dispatch tables + critic revision-cycle semantics + side-effects ALL-OR-NOTHING on critic FAIL: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE].

## Artifact Contract

- **Primary artifact:** `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`
- **Side effects:** append one row to `results.tsv` via validated helper; update `learnings.md` ONLY for high-confidence keep/discard reusable lessons (critic gates); run `manifest-sync.ts`
- **Lifecycle:** `evaluation` (per `_shared/eval-loop-spec.md`)
- **Frontmatter:** 10 fields (skill / version / date / status / summary / purpose / lifecycle / use_when / do_not_use_when / upstream / downstream) — see [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE]
- **Body:** 8 sections (Title / Verdict / Evidence 6-col table / What Changed This Cycle / Diagnosis / Next Cycle Recommendation / Results Row 8-col TSV / Learning Promotion)
- **Results Row schema:** 8 columns (cycle / date / artifact / primary_metric / value / baseline / status / description) — `status` must be `keep | discard | watch | blocked` (Critic Hard Fail #6 otherwise)
- **Cross-stack contract:** consumed by future lp-eval cycles (trend analysis), by `lp-brief --rev=N+1` (hypothesis seeding), by humans reviewing loop progress. lp-eval does NOT directly consume lp-brief output — sibling coordination is at the eval-loop boundary, not artifact-schema boundary. Schema changes require atomic update across `_shared/eval-loop-spec.md` + downstream callers — never silently drift.

Full evaluation artifact template byte-identical + Evidence table format + Results Row format + Learning Promotion rules + `append-loop-result.ts` invocation + known-limitation on custom 10+ column schemas: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

### Evaluation Artifact Template (summary)

Save to `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`. 10-field frontmatter (skill / version / date / status / summary / purpose / lifecycle: evaluation / use_when / do_not_use_when / upstream / downstream). 8 body sections in order:

1. Title `# [Page] Cycle N Evaluation`
2. **Verdict** — Status / Confidence / Primary metric / Decision (one sentence)
3. **Evidence** — table (Signal / Current / Baseline / Window / Source / Caveat)
4. **What Changed This Cycle** — strategy/execution artifact or operator note
5. **Diagnosis** — Likely Drivers + Confounders subsections
6. **Next Cycle Recommendation** — Keep / Discard / Watch / Route-next-work-to lines
7. **Results Row** — fenced TSV block (8 columns)
8. **Learning Promotion** — Promote to learnings.md (yes/no) + Lesson + Expiry/caveat

Full byte-identical template in [`references/format-conventions.md`](references/format-conventions.md).

## Results Row Discipline

Append exactly one row in this shape:

```text
cycle	date	artifact	primary_metric	value	baseline	status	description
```

Rules:

- `artifact` is relative to the loop folder, e.g. `evals/2026-05-13-cycle-2.md`.
- `status` must be `keep`, `discard`, `watch`, or `blocked`.
- `description` is one sentence without tabs.
- Use the validated helper:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence without tabs>"
```

- Do not append a row if the Critic verdict is FAIL. Return `BLOCKED`.

## Critic Override Protocol

When the operator explicitly chooses to ship despite a critic FAIL (or accept a `pass-with-concerns` verdict that the rubric flagged), **log the override before doing anything else.** The override log is the only mechanism that turns repeated operator pushback into a rubric-revision signal (`references/_shared/quality-feedback-protocol.md § Critic Override Log` + `references/_shared/quality-dashboard-spec.md § Rubric Metrics`).

```bash
bun scripts/eval/log-critic-override.ts \
  --skill evaluate-landing-page \
  --dimension "<failed rubric dimension>" \
  --artifact "<project-relative path to the eval artifact under review>" \
  --critic-verdict <fail|pass-with-concerns> \
  --operator-decision <ship|revise|ignore> \
  --reason "<one sentence — why the override is justified>" \
  --follow-up "<none|watch metric|revise rubric|extract shared rubric>"
```

The script appends a dated block to `.forsvn/artifacts/meta/records/critic-overrides.md`. After three valid overrides on the same `skill:dimension` pair, the rubric should be revised (escalation handled by the dashboard's `rubrics[skill:dimension].action` field — see quality-dashboard-spec.md).

Only after the override is logged may the cycle proceed. The ledger row status (`results.tsv`) reflects the actual cycle outcome — operator override does NOT promote a contested cycle to `keep`; pick `watch` or `discard` if the underlying evidence does not support `keep`.

If the operator does NOT override and the critic FAILs, the default rule above stands: return `BLOCKED`, do not append the row.

---

## Anti-Patterns

Pipeline reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any cycle artifact ships. 10 lp-eval-specific patterns (generic heuristic audit dressed up as CRO, fabricated analytics, scoring without an existing eval-loop, confidence inflation, scope drift becoming redesign, low-confidence learning promotion, ledger row appended on FAIL, custom-schema row via standard helper, missing primary metric source-window, weak baseline comparability) + 4 cross-cutting marketing-stack rows (upstream context skipped — no loop scaffolded, cross-stack contract drift, polish-chain misroute, sibling-skill confusion with lp-brief).

Most common in practice: scope drift to redesign (Critical Gate 6 + Critic dimension "Boundary Control"), confidence inflation (Critical Gate 5 + Critic dimension "Attribution Honesty"), low-confidence learning promotion (Critic Hard Fail #7), missing primary metric source-window (Critic Hard Fail #2).

## Completion

End with one status:

- `DONE` — eval artifact written, ledger row appended, critic passed
- `DONE_WITH_CONCERNS` — artifact and row written, but confidence is low/medium or confounders are material
- `NEEDS_CONTEXT` — missing loop or required metric evidence
- `BLOCKED` — contradictory data, filesystem failure, or critic failed after revision

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE] — full evaluation artifact template byte-identical
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Shared:** `references/_shared/{eval-loop-spec, before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol, anti-sycophancy, artifact-contract-template, thin-critic-rubric}.md`
- **Agents:** 4 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` holds the canonical 6-dimension 0-10 Pass/Fail Rubric (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Boundary Control / Ledger Correctness) + 4-tier Verdict + 7 Hard Fails.
- **Sibling coordination:** `brief-landing-page` (construction-time architecture; this skill routes recommendations TO lp-brief but does not produce briefs); `run-eval-loop` (owns loop scaffolding + `program.md` + `context.md` + `results.tsv` schema + durable learning ledger).
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
