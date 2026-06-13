---
title: LP-Eval Playbook
lifecycle: canonical
status: stable
produced_by: lp-eval
load_class: PLAYBOOK
---

# LP-Eval Playbook

## Why this skill exists

lp-eval converts a launched landing-page's measurement evidence into a cycle snapshot, a ledger row, and a narrowly-scoped next action — all inside an **existing eval-loop workspace**. It is the post-launch counterpart to `brief-landing-page`: where lp-brief builds with construction-time best-practice rules (CP-01 → CP-13 + sacred + voice), lp-eval scores the launched page from real evidence (analytics + experiment results + recordings + form-funnel data + qualified manual metric notes) and decides whether the cycle's change should be kept, discarded, watched, or blocked.

The orchestrator coordinates 4 specialized sub-agents across 3 layers: **Layer 1 parallel** (metric-ingest-agent normalizes primary metric + baseline + sample + window + guardrails + source caveats; diagnosis-agent connects observed outcomes to page hypothesis + execution delta + traffic context + user behavior). **Layer 2** (recommendation-agent chooses keep/discard/watch/blocked + next-cycle actions + ledger row + learning promotion proposal). **Layer 3** (critic-agent enforces evidence discipline + loop boundary + ledger correctness + no fake analytics).

This skill is the canonical producer of `.forsvn/loops/[slug]/evals/[date]-cycle-N.md`. Side effects: appends one row to `results.tsv` via `scripts/append-loop-result.ts`; updates `learnings.md` only for high-confidence keep/discard lessons reusable beyond this exact page state; runs `manifest-sync` after writing.

## Why this skill exists at all

Six failure modes it prevents:

1. **Generic heuristic audit dressed up as post-launch CRO.** Critical Gate 2 requires measurement evidence — at minimum one metric source, measurement window, and current value for the loop's primary metric. Without that, lp-eval is BLOCKED, not transformed into a brief teardown. Critic Hard Fail #4 catches "generic heuristic audit presented as evidence."
2. **Fabricated analytics.** Critical Gate 4 forbids fabricated numbers. Critic Hard Fail #5 catches "any fabricated number, logo, testimonial, user quote, or source." Unknown values stay unknown; manual notes are allowed only when labeled as operator-supplied + tied to a date/window/source.
3. **Scoring without a loop.** Critical Gate 1 requires an existing `.forsvn/loops/[slug]/program.md` + `context.md`. If absent → NEEDS_CONTEXT, recommend `/run-pipeline`. lp-eval does NOT scaffold loops. Critic Hard Fail #1 enforces.
4. **Confidence inflation.** Critical Gate 5 requires attribution confidence to be explicit (`high | medium | low | blocked`) with sample size or traffic volume, baseline comparability, and confounders. Critic dimension "Attribution Honesty" scores 0-10 on overclaiming.
5. **Scope drift — evaluation becomes redesign.** Critical Gate 6 prevents lp-eval from redesigning. Recommendations route next work; actual page brief/revision goes to `brief-landing-page`, execution artifacts to appropriate content/design/build workflow. Critic dimension "Boundary Control" enforces.
6. **Promoting low-confidence learnings to durable ledger.** Critic Hard Fail #7 catches "learning promoted from low-confidence or blocked evidence." `learnings.md` updates only for high-confidence keep/discard lessons reusable beyond this exact page state.

The structural answer is the **6-dimension critic rubric** (in `agents/critic-agent.md`): Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Boundary Control / Ledger Correctness — each scored 0-10. Verdict: PASS ≥48/60 with no dimension <7; PASS_WITH_CONCERNS ≥42 with no dimension <6 + confidence/confounders surfaced; FAIL <42 or any dimension <6 or any of 7 Hard Fails.

## Philosophy

Measurement decides the ledger row. Heuristics inform diagnosis, but heuristics are NOT evidence. A heuristic teardown of a landing page can confidently recommend the wrong direction — the data might show the "conversion best practice" is actively hurting THIS audience. Heuristics are priors, not posteriors.

One primary metric per loop decides the ledger. Secondary metrics + qualitative evidence explain diagnosis; they do not override the loop's primary metric unless `program.md` defines an explicit guardrail failure (e.g., "conversion lift triggered guardrail: bounce rate increased >X%, treat as discard").

Attribution honesty over storytelling. Every verdict includes sample size or traffic volume when available, baseline comparability, confounders, and explicit confidence level. Low-confidence findings ship as `watch` or `blocked`, not `keep`. Confidence inflation is the failure mode of post-launch evaluation.

Evaluation does NOT redesign. lp-eval recommends next changes and routes work; actual page revision goes to `brief-landing-page` (inside the same loop), and execution artifacts go to appropriate content/design/build skills. The boundary is load-bearing — confusing eval with redesign produces unmeasured changes that break the loop's measurement chain.

## Methodology

**Three-layer orchestration, deliberate.**

- **Layer 1 (parallel):** metric-ingest + diagnosis. Metric-ingest normalizes the primary metric (name + value + units), baseline, sample size, measurement window, guardrails, and source caveats from `program.md` + `context.md` + `results.tsv` + the cycle's measurement evidence. Diagnosis connects observed outcomes to the page hypothesis (from upstream `strategy/`), the execution delta (from `execution/`), traffic/source context, and user behavior (heatmaps + recordings + form-funnel + sales notes).
- **Layer 2 (sequential):** recommendation-agent receives both Layer 1 outputs and proposes verdict + next actions + ledger row + learning promotion. Verdict is one of: `keep | discard | watch | blocked`. Next-cycle actions are scoped to `Keep:` / `Discard:` / `Watch:` / `Route next work to:` lines.
- **Layer 3:** critic-agent validates the assembled artifact + ledger row + learning update against the 6-dimension rubric + 7 Hard Fails. PASS → write artifact + append ledger row + run manifest-sync. FAIL → revise once. Still failing → write NO ledger row + return BLOCKED with missing evidence.

**Cycle resolution.** Cycle number is `last results.tsv cycle + 1`, unless the user explicitly names a cycle that has no existing eval artifact (out-of-order evaluation of a missed cycle).

**Side effects (in order):**
1. Write eval artifact at `.forsvn/loops/[slug]/evals/[date]-cycle-N.md`
2. Append exactly one row to `results.tsv` via `bun scripts/append-loop-result.ts` (validated helper, 8-column standard schema)
3. Update `learnings.md` only for high-confidence keep/discard lessons reusable beyond this exact page state (critic gates the promotion)
4. Run `bun scripts/manifest-sync.ts` to refresh the manifest

## Principles

- **6 Critical Gates are binary.** (1) Existing eval loop required — NEEDS_CONTEXT otherwise. (2) Measurement evidence required — not a heuristic audit. (3) One primary metric decides the ledger. (4) No fabricated analytics. (5) Attribution confidence must be explicit. (6) Evaluation does not redesign.
- **7 Critic Hard Fails are non-negotiable.** No `program.md` / no metric value-source-window / claimed improvement without baseline / generic heuristic as evidence / any fabricated number-logo-testimonial-quote-source / ledger status outside `keep | discard | watch | blocked` / learning promoted from low-confidence-or-blocked evidence.
- **Ledger correctness is enforced by helper script.** `append-loop-result.ts` validates the 8-column standard schema (cycle / date / artifact / primary_metric / value / baseline / status / description). Do NOT hand-append rows — use the helper. Stretch fixture shows that custom 10+ column loops require schema migration (currently parked as known limitation in eval-loop owner's queue).
- **No ledger row on FAIL.** If critic FAILs after revision, return BLOCKED with missing evidence. The loop's ledger stays clean — no garbage rows.
- **Learning promotion is conservative.** `learnings.md` updates ONLY for high-confidence keep/discard lessons reusable beyond this exact page state. Low-confidence findings stay in the cycle artifact only.
- **Cycle decision metric is the primary metric from `program.md`.** Secondary metrics + qualitative evidence are diagnostic context, not verdict drivers. Guardrail failures (defined in `program.md`) can flip a keep to a discard regardless of primary metric.
- **The artifact IS the contract.** Frontmatter (10 fields: skill / version / date / status / summary / purpose / lifecycle / use_when / do_not_use_when / upstream / downstream) + 8 body sections (Title / Verdict / Evidence / What Changed This Cycle / Diagnosis / Next Cycle Recommendation / Results Row / Learning Promotion). Schema changes require atomic update across eval-loop spec + downstream learnings consumers.

## When NOT to use this skill

- **No existing eval-loop workspace.** Use `/run-pipeline` first to scaffold `program.md` + `context.md` + `results.tsv` + strategy/execution/evals subdirs.
- **Need the next page brief or redesign.** Use `brief-landing-page` — that's construction-time architecture, not post-launch scoring. lp-eval routes recommendations TO lp-brief but does not produce briefs.
- **The issue is channel strategy, not landing-page evidence.** Use `plan-campaign` — channel mix lives there.
- **No measurement evidence at all.** lp-eval returns BLOCKED. Either gather evidence first or use a different skill if a heuristic-only audit is genuinely what's needed (none of our skills do pure heuristic LP audits — that's intentional).
- **Want to redesign the page based on the eval.** lp-eval recommends; `brief-landing-page` redesigns. Run lp-brief separately after evaluate-landing-page lands its verdict.
- **Custom 10+ column loop schema.** Stretch limitation — `append-loop-result.ts` validates the 8-column standard schema. Loops with custom schemas need hand-edit or a schema migration (deferred to eval-loop owner's queue).

## History / origin

- **v0.1.0 — initial release (still-provisional rubric).** 4-agent orchestration (metric-ingest + diagnosis parallel → recommendation sequential → critic). 6-dimension rubric (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Boundary Control / Ledger Correctness). 7 Hard Fails (no existing loop / no metric source-window / claimed improvement without baseline / generic heuristic as evidence / fabricated numbers-logos-testimonials / invalid ledger status / low-confidence learning promotion). 4-tier verdict (PASS ≥48 with no dim <7 / PASS_WITH_CONCERNS ≥42 with no dim <6 / FAIL <42 or any dim <6 or any Hard Fail). 8-column standard `results.tsv` schema (cycle / date / artifact / primary_metric / value / baseline / status / description). Side effects: write eval artifact → append ledger row via `append-loop-result.ts` → update `learnings.md` (high-confidence only) → run `manifest-sync.ts`.
- **v6 Phase 2 Wave 1 refactor (May 18, 2026, still v0.1.0 — provisional-rubric signal):** body trimmed 217 → 172 lines (-21%, 45 lines saved; 172 vs ≤200 structural target — 28 lines under target). 5 new refs: playbook + format-conventions (frontmatter schema + 8 body sections + Evidence table + Results Row format + `append-loop-result.ts` invocation + learning promotion rules) + anti-patterns (NEW — extracted body-implicit patterns + 4 cross-cutting marketing-stack rows + sibling-coordination with lp-brief) + procedures/{pre-dispatch, dispatch-mechanics}. Existing 4 agents UNCHANGED — these ARE the skill's domain behavior. Critical Gates renumbered semantically (still 6 in body). Before-Starting + Artifact Contract blocks added per Step 7.5 pattern. **Cross-stack contract preserved BYTE-IDENTICAL** (verified anti-smuggle audit on critical axes): 6 Critical Gates, Responsibility Split, Inputs table (10 rows), Outputs section, 4-agent Manifest, Read Order, Cold Start question bundle, Dispatch 8-step procedure, Evaluation Artifact Template (10-field frontmatter + 8 body sections + Evidence 6-column table + Results Row 8-column TSV format), Results Row Discipline + `append-loop-result.ts` invocation, 4-tier Completion verdicts. Version stays at v0.1.0 — deliberate provisional-rubric signal (rubric expected to change after a few cycles of real use). No version bump — refactor lands on the marketing-skills 2.0 base as a commit, not a release.

## Further reading

- [`procedures/pre-dispatch.md`](procedures/pre-dispatch.md) [PROCEDURE] — read order, Warm Start prompt, Cold Start 5-question bundle, hard-block conditions (no loop / no metric source-window / no current value), `--fast` behavior, write-back (none — eval-loop owns persistent state, not lp-eval)
- [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md) [PROCEDURE] — how to spawn a sub-agent, Layer 1 parallel dispatch (metric-ingest + diagnosis), Layer 2 sequential (recommendation), Layer 3 critic + revision-cycle, 8-step Dispatch procedure (resolve cycle → L1 → L2 → L3 → revise once → write artifact → append ledger → promote learning → manifest sync), `append-loop-result.ts` invocation with full flag set, manifest-sync invocation
- [`format-conventions.md`](format-conventions.md) [PROCEDURE] — full evaluation artifact template byte-identical (10-field frontmatter + 8 body sections), Evidence table format (6 columns: Signal / Current / Baseline / Window / Source / Caveat), Results Row format (8 columns), Learning Promotion field values, file paths, lifecycle declaration
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — extracted body-implicit patterns (generic heuristic audit, fabricated analytics, no-loop scoring, confidence inflation, scope drift, low-confidence learning promotion, ledger row on FAIL, custom-schema row append, missing primary metric, weak baseline comparability) + 4 cross-cutting marketing-stack patterns (upstream context skipped, cross-stack contract drift, polish-chain misroute, sibling-skill confusion with lp-brief)
- `references/_shared/eval-loop-spec.md` — canonical eval-loop specification (program.md + context.md + results.tsv schema + strategy/execution/evals subdirs)
- Shared: `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol, anti-sycophancy, artifact-contract-template, thin-critic-rubric}.md`
- Agents: 4 sub-agents in `agents/` — see Agent Manifest in SKILL.md. `critic-agent.md` holds the canonical 6-dimension Pass/Fail Rubric + 4-tier Verdict thresholds + 7 Hard Fails + Self-Check.
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
- Sibling coordination: `brief-landing-page` (construction-time architecture; this skill routes recommendations TO lp-brief but does not produce briefs); `run-pipeline` (owns loop scaffolding + `program.md` + `context.md` + `results.tsv` schema + durable learning ledger)
