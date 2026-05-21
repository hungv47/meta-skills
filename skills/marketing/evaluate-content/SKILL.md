---
name: evaluate-content
description: "Scores published organic content (text / image / carousel posts) from real performance metrics inside an existing eval loop — one primary platform per cycle. Use for post-publish review of an organic post against its write-social brief's hypothesis (engagement, save rate, dwell, click-through, conversion). Not for short-form video (use evaluate-shortform), paid-ad performance (use evaluate-ad), writing next-cycle copy (use write-social), or scaffolding the loop itself (use run-eval-loop)."
argument-hint: "[loop slug or path] [primary-platform] [metric window]"
allowed-tools: Read Write Edit Grep Glob Bash WebSearch WebFetch
metadata:
  version: "0.1.0"
  budget: standard
  estimated-cost: "$0.75-1.50"
---

# Content Eval — Orchestrator

*Evaluation skill. Converts published organic-content evidence into a cycle snapshot, a ledger row, and a narrowly-scoped next action inside an existing eval loop. One primary platform per cycle; secondary platforms are context.*

**Core Question:** "Did this content cycle, on its primary platform, create measurable signal strong enough to keep, discard, watch, or block — and what should the next strategy/execution skill know?"

> Why this skill exists, philosophy, methodology, principles, when NOT to use, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates

1. **Existing eval loop required.** If `.forsvn/loops/[slug]/program.md` and `context.md` do not exist, return `NEEDS_CONTEXT` and recommend `/run-eval-loop`. This skill does not create loops.
2. **Organic non-video content only.** evaluate-content scores text / image / carousel organic posts. **Short-form video defers to `evaluate-shortform`** — that skill owns the video lane (it scores against the short-form-research platform-intelligence catalog). Paid-ad placements defer to `evaluate-ad`. If the content under evaluation is video or paid, return `NEEDS_CONTEXT` and route to the right sibling.
3. **Measurement evidence required.** Do not run as a generic content-quality audit. Require at least one metric source, measurement window, and current value for the loop's primary metric (engagement rate / save rate / CTR / conversion rate / etc. — operator-pick-per-cycle via `program.md`).
4. **One primary metric decides the ledger row.** Secondary metrics (likes, impressions, comment sentiment) explain diagnosis; they do not override the loop's primary metric unless `program.md` defines an explicit guardrail failure.
5. **One primary platform per cycle.** Each cycle is scoped to one operator-designated primary platform. Secondary platforms appear in a `Cross-Platform Context` subsection — they inform diagnosis but DO NOT drive the keep/discard verdict. A 9-platform campaign is evaluated as separate cycles, one primary platform each.
6. **No fabricated analytics.** Unknown values stay unknown. Manual notes are allowed only when labeled as operator-supplied and tied to a date/window/source.
7. **Attribution confidence must be explicit.** Every verdict includes sample size (impressions/reach + window), baseline comparability (same platform, same content type, comparable window), confounders (algorithm change, posting-time shift, follower-count change, cross-post cannibalization), and confidence: `high | medium | low | blocked`.
8. **Evaluation does not generate content.** Recommend next changes, but route actual copy authorship to `write-social` (with a revised brief), distribution work to `publish-social`, and visual-asset work to `produce-asset`.

## Responsibility Split

- `/run-eval-loop` owns loop setup, `program.md`, `context.md`, `results.tsv` schema, and the durable learning ledger.
- `/evaluate-content` owns post-publish organic-content evidence snapshots for a loop cycle, scoped to a single primary platform.
- `/write-social` owns next-cycle copy after an eval identifies what should change.
- `/evaluate-shortform` owns short-form video; `/evaluate-ad` owns paid-ad performance.

## Inputs

| Input | Required? | What it provides |
|---|---:|---|
| Loop slug or path | **required** | Locates `.forsvn/loops/[slug]/` |
| Primary-platform tag | **required** | Scopes the cycle; gates Critical Gate 5 (e.g., `linkedin`, `instagram`, `x`, `facebook`, `threads`) |
| Source write-social artifact | **required** | The brief's hypothesis being scored against — typically `.forsvn/artifacts/mkt/copy/[platform]-[date]-[slug].md` |
| Measurement window | **required** | Date range for the current cycle (start + end + days) |
| Primary metric value + source | **required** | Ledger decision metric (e.g., save rate = 3.1% from native platform analytics) |
| Reach / impressions | **required** | Sample-size confidence floor |
| Baseline or prior cycle row | required if available | Comparison point (same platform, same content type) |
| Engagement breakdown | recommended | Likes / saves / shares / comments split — for Engagement-Quality scoring |
| Click-through + conversion | recommended | For funnel-depth diagnosis |
| Qualitative evidence | recommended | Comment sentiment, replies, DMs — handled honestly, not fabricated |
| Secondary-platform metrics | optional | Headline metrics for the other platforms the content ran on (Cross-Platform Context) |
| Guardrail metrics from `program.md` | optional | Auto-fail thresholds |

## Outputs

Primary artifact:

```text
.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md
```

Side effects:

- Append one row to `.forsvn/loops/[slug]/results.tsv` with `bun scripts/append-loop-result.ts` (8-column validated helper).
- Update `.forsvn/loops/[slug]/learnings.md` only for high-confidence `keep` or `discard` lessons that generalize beyond this exact content piece.
- Run `bun scripts/manifest-sync.ts` after writing.

## Agent Manifest

| Agent | Layer | File | Focus |
|---|---|---|---|
| Metric Ingest | 1 (parallel) | `agents/metric-ingest-agent.md` | Normalizes primary metric, baseline, reach, window, engagement breakdown, primary-platform tag, source caveats |
| Diagnosis | 1 (parallel) | `agents/diagnosis-agent.md` | Connects metrics to the write-social artifact's hypothesis (hook, format, CTA, platform framing), engagement-quality signals, cross-platform context |
| Recommendation | 2 | `agents/recommendation-agent.md` | Chooses keep/discard/watch/blocked and next-cycle action (revise hook / reformat for platform / shift platform mix / route back to write-social with a revised brief) |
| Critic | 3 | `agents/critic-agent.md` | Enforces 7-dim rubric, evidence discipline, loop boundary, ledger correctness, no fabricated analytics |

## Pre-Dispatch

Read `references/_shared/eval-loop-spec.md` before writing artifacts when available.

**Hard-block conditions (fire BEFORE Cold Start):** (1) `program.md` or `context.md` absent → NEEDS_CONTEXT, recommend `/run-eval-loop`. (2) Content under evaluation is short-form video → NEEDS_CONTEXT, route to `evaluate-shortform`. (3) No measurement evidence for current cycle → BLOCKED with missing-evidence list. (4) Primary-platform tag missing → BLOCKED, ask the operator to declare it. (5) Custom 10+ column `results.tsv` schema → warn + flag to eval-loop owner; require hand-edit (not standard helper).

**Read Order:** `program.md` → `context.md` → `results.tsv` → latest `strategy/` + `execution/` + `evals/` files → source write-social artifact (`.forsvn/artifacts/mkt/copy/[platform]-[date]-[slug].md`) → publish-social bundle manifest if present → canonical artifacts (`brand/BRAND.md`, `research/product-context.md`, `research/icp-research.md`). If `.agents/manifest.json` is stale, run `bun scripts/manifest-sync.ts`.

**Warm Start** (loop exists + metric evidence present + primary-platform tagged): summarize loop + primary platform + primary metric + baseline/prior result + latest content artifact + current evidence window; proceed to evaluate cycle N.

**Cold Start** (loop exists but cycle context missing): ask 6 bundled questions — loop slug/path + primary platform + source write-social artifact path + measurement window + primary metric value/baseline + reach. If the loop itself does not exist, return `NEEDS_CONTEXT` and recommend `/run-eval-loop` instead of asking the rest.

Full Read Order + Warm/Cold Start templates + hard-block conditions + Needed dimensions + write-back (none — eval-loop owns persistent state) + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Dispatch

1. Resolve loop path + next cycle number + primary-platform scope. Cycle number is `last results.tsv cycle + 1`, unless the user explicitly names a cycle that has no existing eval artifact.
2. Layer 1 parallel: Metric Ingest + Diagnosis. Metric Ingest reads operator metrics + program.md guardrails; Diagnosis reads the source write-social artifact's hypothesis + Layer-1's normalized metrics (Diagnosis waits for Metric Ingest's output, then runs).
3. Layer 2: Recommendation consumes Layer 1 outputs, proposes verdict + next-cycle action + ledger row + learning promotion.
4. Layer 3: Critic validates artifact, ledger row, learning update against the 7-dim rubric.
5. If Critic FAIL, revise once. If still failing, write no ledger row and return `BLOCKED` with missing evidence.
6. Write eval artifact and append exactly one `results.tsv` row using `append-loop-result.ts`.
7. Promote learning only when Critic allows it.
8. Run manifest sync.

Full per-layer dispatch tables + critic revision-cycle semantics + side-effects ALL-OR-NOTHING on critic FAIL + critic-override protocol: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE].

## Artifact Contract

- **Primary artifact:** `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`
- **Side effects:** append one row to `results.tsv` via validated helper; update `learnings.md` ONLY for high-confidence keep/discard reusable lessons (critic gates); run `manifest-sync.ts`
- **Lifecycle:** `evaluation` (per `_shared/eval-loop-spec.md`)
- **Frontmatter:** 10 fields (skill / version / date / status / summary / purpose / lifecycle / use_when / do_not_use_when / upstream / downstream) — see [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE]
- **Body:** 8 sections (Title / Verdict / Evidence 6-col table / What Changed This Cycle / Diagnosis / Next Cycle Recommendation / Results Row 8-col TSV / Learning Promotion). The Diagnosis section carries a `Cross-Platform Context` subsection.
- **Primary-platform field:** Verdict block must name the primary platform explicitly (Critical Gate 5); Evidence table scopes metrics to that platform.
- **Generation provenance** (per D8 contract): frontmatter carries `provenance.input_artifacts` listing the source write-social path, BRAND.md, icp-research.md; `provenance.output_eval` is `null`.
- **Results Row schema:** 8 columns (cycle / date / artifact / primary_metric / value / baseline / status / description) — `status` must be `keep | discard | watch | blocked` (Critic Hard Fail otherwise); description includes the primary-platform tag.
- **Cross-stack contract:** consumed by future content-eval cycles (trend analysis), by `write-social --rev=N+1` (hypothesis seeding), by humans reviewing loop progress. Schema changes require atomic update across `_shared/eval-loop-spec.md` + downstream callers — never silently drift.

Full evaluation artifact template byte-identical + Evidence table format + Results Row format + Learning Promotion rules + `append-loop-result.ts` invocation: [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

### Evaluation Artifact Template (summary)

Save to `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md`. 10-field frontmatter + provenance block. 8 body sections in order:

1. Title `# [Content / Primary-Platform] Cycle N Evaluation`
2. **Verdict** — Status / Confidence / Primary-Platform / Primary metric / Decision (one sentence)
3. **Evidence** — table (Signal / Current / Baseline / Window / Source / Caveat) — scoped to the primary platform
4. **What Changed This Cycle** — content artifact link or operator note
5. **Diagnosis** — Likely Drivers + Engagement-Quality Signals + Cross-Platform Context + Confounders subsections
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

- `artifact` is relative to the loop folder, e.g. `evals/2026-05-19-cycle-1.md`.
- `status` must be `keep`, `discard`, `watch`, or `blocked`.
- `description` is one sentence without tabs (include the primary-platform tag).
- Use the validated helper:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include primary-platform>"
```

- Do not append a row if the Critic verdict is FAIL. Return `BLOCKED`.

## Critic Override Protocol

When the operator explicitly chooses to ship despite a critic FAIL (or accept a `pass-with-concerns` verdict the rubric flagged), **log the override before doing anything else.** The override log is the only mechanism that turns repeated operator pushback into a rubric-revision signal (`references/_shared/quality-feedback-protocol.md § Critic Override Log`).

```bash
bun scripts/eval/log-critic-override.ts \
  --skill evaluate-content \
  --dimension "<failed rubric dimension>" \
  --artifact "<project-relative path to the eval artifact under review>" \
  --critic-verdict <fail|pass-with-concerns> \
  --operator-decision <ship|revise|ignore> \
  --reason "<one sentence — why the override is justified>" \
  --follow-up "<none|watch metric|revise rubric|extract shared rubric>"
```

The script appends a dated block to `.forsvn/artifacts/meta/records/critic-overrides.md`. After three valid overrides on the same `evaluate-content:dimension` pair, the rubric should be revised (D8 contract). Operator override does NOT promote a contested cycle to `keep` — pick `watch` or `discard` if the evidence does not support `keep`.

If the operator does NOT override and the critic FAILs, return `BLOCKED`, do not append the row.

---

## Anti-Patterns

Pipeline reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any cycle artifact ships. Content-eval-specific patterns (vanity-metric inflation, cross-platform contamination of the verdict, fabricated qualitative sentiment, scope drift to rewriting the content, lane drift into evaluate-shortform / evaluate-ad territory, learning promotion from an algorithm-spike window, killing a cycle without same-platform baseline comparability) + 4 cross-cutting marketing-stack rows.

Most common in practice: vanity-metric inflation (Critical Gate 4 + Critic dim "Engagement-Quality Discrimination"), cross-platform contamination (Critical Gate 5 + Critic dim "Platform-Fit"), scope drift to write-social territory (Critical Gate 8 + Critic dim "Decision Discipline"), missing source write-social artifact (Critic Hard Fail).

## Completion

End with one status:

- `DONE` — eval artifact written, ledger row appended, critic passed
- `DONE_WITH_CONCERNS` — artifact and row written, but confidence is low/medium or confounders are material
- `NEEDS_CONTEXT` — missing loop, source write-social artifact, primary-platform tag, or required metric evidence; OR the content is short-form video / a paid ad (route to the right sibling)
- `BLOCKED` — contradictory data, no measurement evidence, filesystem failure, or critic failed after revision

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Rubric:** `references/rubric.md` [RUBRIC] — the domain 7-dim 0-10 Pass/Fail instrument (5 shared dims + 2 content-specific; provisional v0.1, revision-triggered per brief 05). Shared frame — pass gate, scoring scale, universal Hard Fails, falsifiability discipline — in `references/_shared/evaluation-loop-rubric.md`
- **Format:** `references/format-conventions.md` [PROCEDURE] — full evaluation artifact template byte-identical
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Shared:** `references/_shared/{eval-loop-spec, evaluation-loop-rubric, before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol, anti-sycophancy, artifact-contract-template, thin-critic-rubric, quality-feedback-protocol, quality-dashboard-spec}.md`
- **Agents:** 4 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` enforces the 7-dim rubric in `references/rubric.md` + 3-tier Verdict + Hard Fails.
- **Sibling coordination:** `write-social` (construction-time copy; this skill routes recommendations TO write-social but does not produce briefs); `run-eval-loop` (owns loop scaffolding + `program.md` + `context.md` + `results.tsv` schema + durable learning ledger); `evaluate-shortform` (sister skill — short-form video lane); `evaluate-ad` (sister skill — paid-ad lane); `publish-social` (distribution retrospective rather than content scoring).
