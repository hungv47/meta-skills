---
title: LP-Eval Anti-Patterns
lifecycle: canonical
status: stable
produced_by: lp-eval
load_class: ANTI-PATTERN
---

# LP-Eval Anti-Patterns

> Re-read before any cycle artifact ships. The first 10 patterns are lp-eval-specific failure modes (extracted from Critical Gates + Hard Fails + body-implicit constraints). The last 4 are cross-cutting marketing-stack patterns. Ownership column cites by **dimension name** (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Boundary Control / Ledger Correctness — the 6 critic dimensions from `agents/critic-agent.md`) or **Hard Fail #N** (7 explicit Hard Fails from critic-agent.md).

## Section 1 — LP-eval pipeline patterns (10)

### 1. Generic heuristic audit dressed up as post-launch CRO

**Pattern:** lp-eval is invoked without measurement evidence. Output is a best-practice teardown of the launched page ("hero needs message-match, CTA is buried, no objection handling") presented as a cycle verdict.

**Why it fails:** Heuristic teardowns are construction-time priors, not post-launch posteriors. They can confidently recommend the wrong direction — the data might show the "conversion best practice" is actively hurting THIS audience. Generic heuristic audits as evidence is Hard Fail #4.

**Instead:** Hard-block when measurement evidence is missing. Return BLOCKED (or NEEDS_CONTEXT if loop is missing entirely). Recommend gathering measurement evidence first. If a pure heuristic LP audit is genuinely needed, that's `lp-brief --rev=N+1` with current-page-state evidence — NOT lp-eval.

**Owned by:** Critical Gate 2 (measurement evidence required) + Critic dimension "Metric Integrity" + Critic Hard Fail #4 (generic heuristic audit presented as evidence).

---

### 2. Fabricated analytics

**Pattern:** Eval artifact contains a primary metric value that isn't sourced from the named tool. Operator filled in "conversion: 4.2%" without checking GA4. Or the artifact cites "Hotjar recording shows X" but no recording exists.

**Why it fails:** Fabricated analytics poison the loop. Downstream cycles trust the prior eval's numbers; a fabricated baseline corrupts every subsequent comparison. The loop's measurement chain breaks silently and the team loses trust in the entire eval-loop infrastructure.

**Instead:** Unknown values stay unknown. Manual notes are allowed only when labeled as operator-supplied AND tied to a date/window/source ("operator note: 2026-05-15 sales-call retrospective — 3 of 8 prospects mentioned pricing tier confusion"). Hard Fail #5 catches "any fabricated number, logo, testimonial, user quote, or source."

**Owned by:** Critical Gate 4 (no fabricated analytics) + Critic dimension "Metric Integrity" + Critic Hard Fail #5.

---

### 3. Scoring without an existing eval-loop

**Pattern:** User invokes lp-eval on a slug that has no `.forsvn/loops/[slug]/program.md`. lp-eval tries to score anyway.

**Why it fails:** Without `program.md`, the primary metric is undefined. Without `context.md`, the baseline + measurement window assumptions are missing. Without `results.tsv`, the cycle number can't be resolved. lp-eval that proceeds without the loop scaffolding produces a verdict that's structurally meaningless.

**Instead:** Critical Gate 1 fires BEFORE any other work — if `program.md` and `context.md` do not exist, return NEEDS_CONTEXT immediately and recommend `/run-pipeline`. lp-eval does NOT scaffold loops.

**Owned by:** Critical Gate 1 (existing eval loop required) + Critic Hard Fail #1 (no existing `.forsvn/loops/[slug]/program.md`).

---

### 4. Confidence inflation

**Pattern:** Verdict claims `confidence: high` on a sample of N=14 conversions. Or claims a cycle "kept" because primary metric ticked up 2% with no baseline comparability check. Or omits guardrail metrics entirely.

**Why it fails:** Inflated confidence is the failure mode of post-launch evaluation. Low-sample wins shipped as `keep` get promoted to `learnings.md`, then influence the next cycle's hypothesis — and a noise-driven decision compounds into a deliberate-looking strategy. The eval-loop's signal-to-noise ratio collapses.

**Instead:** Every verdict includes sample size or traffic volume when available, baseline comparability, confounders, and explicit confidence level (`high | medium | low | blocked`). Low-confidence findings ship as `watch` or `blocked`, not `keep`. Critic dimension "Attribution Honesty" scores 0-10 on overclaiming.

**Owned by:** Critical Gate 5 (attribution confidence must be explicit) + Critic dimension "Attribution Honesty".

---

### 5. Scope drift — evaluation becomes redesign

**Pattern:** lp-eval recommends specific copy changes ("change hero headline to 'Pricing without the runaround'"), specific layout changes ("move social proof above the fold"), or specific asset replacements ("replace founder photo with team shot"). The eval artifact reads like a brief.

**Why it fails:** lp-eval recommends; lp-brief redesigns. Confusing the two produces unmeasured changes that break the loop's measurement chain — the next cycle can't isolate which recommendation drove the delta because they were bundled into the eval rather than scoped through lp-brief's hypothesis gate. Boundary Control matters for compounding learning.

**Instead:** lp-eval's "Next Cycle Recommendation" uses scoped lines (Keep: / Discard: / Watch: / Route next work to:). "Route next work to: lp-brief --rev=N+1 with hypothesis: ['headline message-match to direct-traffic source']" routes the work without doing the work. Critical Gate 6 (Evaluation does not redesign) + Critic dimension "Boundary Control" enforce.

**Owned by:** Critical Gate 6 (evaluation does not redesign) + Critic dimension "Boundary Control" + Responsibility Split (lp-eval owns post-launch evidence; lp-brief owns new + redesign briefs).

---

### 6. Promoting low-confidence learnings to durable ledger

**Pattern:** Cycle verdict is `keep` with `confidence: low`. Recommendation-agent proposes promoting the lesson to `learnings.md`. Critic approves it (or misses the low-confidence flag).

**Why it fails:** `learnings.md` is the loop's durable record of validated lessons. Polluting it with low-confidence lessons creates a false-positive trail that downstream cycles + future lp-brief --rev=N+1 invocations treat as ground truth. The next strategy cycle bakes in a noise-driven assumption.

**Instead:** Promotion criteria: high-confidence (`confidence: high` in verdict) AND status = `keep` or `discard` AND lesson is reusable beyond this exact page state. Critic Hard Fail #7 catches "learning promoted from low-confidence or blocked evidence." When in doubt, do NOT promote — the cycle artifact itself preserves the finding for future trend analysis without polluting the durable ledger.

**Owned by:** Recommendation-agent (initial proposal self-check) + Critic dimension "Decision Discipline" + Critic Hard Fail #7.

---

### 7. Ledger row appended on FAIL

**Pattern:** Critic FAIL after revision. Recommendation-agent's ledger row is appended anyway (maybe because the operator forgot to check the verdict before running `append-loop-result.ts` manually).

**Why it fails:** Garbage ledger rows corrupt the loop's history. Downstream cycles trust `results.tsv` as the canonical sequence of cycle outcomes — a FAILed verdict that nonetheless appended a row makes the loop's history a lie.

**Instead:** **Do NOT append a row if the Critic verdict is FAIL. Return BLOCKED.** Side effects (write artifact + append ledger + promote learning + manifest sync) are gated on critic PASS. Use the validated `append-loop-result.ts` helper, which enforces the schema but does NOT enforce the FAIL-no-row rule — that's orchestrator-side.

**Owned by:** Orchestrator (Layer 3 critic gate — FAIL after revision skips side effects) + Critic dimension "Ledger Correctness".

---

### 8. Custom-schema row appended via standard helper

**Pattern:** Loop has a custom 10+ column `results.tsv` (e.g., includes guardrail values + sample size + variant split per row). Orchestrator runs `bun scripts/append-loop-result.ts` which validates the 8-column standard schema → helper errors or hand-edited row produces malformed TSV.

**Why it fails:** Schema mismatch breaks the loop's ledger. `append-loop-result.ts` is intentionally strict about the 8-column standard to prevent silent corruption.

**Instead:** Standard 8-column loops use the helper. Custom-schema loops require hand-edit (or schema migration — currently parked in the eval-loop owner's queue per stretch fixture finding). Before manual append, flag affected loops to the eval-loop owner so the migration queue stays current.

**Owned by:** Orchestrator (detect custom schema before append; flag to eval-loop owner) + `format-conventions.md` § "Known limitation — custom schemas".

---

### 9. Missing primary metric source-window

**Pattern:** Eval artifact's Evidence table has a Current value but no Source or no Window. "Conversion: 4.2%" appears with no GA4/Mixpanel/Posthog tool name and no measurement window.

**Why it fails:** A metric without source + window is not measurement — it's an assertion. Critic Hard Fail #2 catches "no current primary metric value, source, or measurement window."

**Instead:** Every Evidence row must include Signal + Current + Baseline + Window + Source + Caveat. Source is the tool/system the metric came from. Window is the date range, traffic count, or sample N. Caveat flags sample-size warnings, tracking issues, attribution caveats, or source freshness.

**Owned by:** Metric-ingest-agent (self-check on Evidence table population) + Critic dimension "Metric Integrity" + Critic Hard Fail #2.

---

### 10. Weak baseline comparability

**Pattern:** Cycle 3 evaluation compares cycle 3 conversion vs cycle 1 baseline, ignoring cycle 2's mid-period traffic-source change. Or compares Monday cycle vs Friday baseline without seasonality adjustment. Or compares post-launch cycle vs pre-launch traffic with different audience mix.

**Why it fails:** Baseline comparability is the foundation of every metric verdict. A "lift" against an incomparable baseline is statistical fiction. Critic Hard Fail #3 catches "claimed improvement without baseline or prior-cycle comparison."

**Instead:** Diagnosis-agent surfaces confounders explicitly — traffic mix, seasonality, campaign change, tracking issue, sample size. Critic dimension "Attribution Honesty" scores 0-10 on whether confounders are stated without overclaiming. When baseline is genuinely incomparable, ship as `watch` or `blocked` with the confounder noted — do NOT claim a lift.

**Owned by:** Diagnosis-agent (Confounders subsection in Diagnosis section) + Critic dimension "Attribution Honesty" + Critic Hard Fail #3.

---

## Section 2 — Cross-cutting marketing-stack patterns (4)

### 11. Upstream context skipped — no loop scaffolded

**Pattern:** User invokes lp-eval directly without running `/run-pipeline` first. Loop directory doesn't exist or is empty.

**Why it fails:** Without `program.md` defining the primary metric + `context.md` defining baseline assumptions + `results.tsv` for cycle resolution, lp-eval has no structural foundation. Critical Gate 1 catches this hard.

**Instead:** lp-eval returns NEEDS_CONTEXT immediately, recommends `/run-pipeline`. The eval-loop skill owns loop scaffolding; lp-eval owns post-launch evidence inside an existing loop.

**Owned by:** Orchestrator (Pre-Dispatch hard gate — fires BEFORE Cold Start questioning) + Critical Gate 1 + Critic Hard Fail #1 + Responsibility Split (`/run-pipeline` owns loop setup).

---

### 12. Cross-stack contract drift

**Pattern:** eval-loop skill updates the `results.tsv` schema (e.g., adds a `confidence` column) without updating lp-eval's `append-loop-result.ts` invocation or `format-conventions.md` § "Results Row format". Two versions of "what a row contains" exist.

**Why it fails:** Schema drift produces silent breakage — lp-eval's helper invocation errors on the new column, OR appends rows without the new column (corrupting downstream consumers expecting it). Symptoms appear when a downstream dashboard skill or trend-analysis tool reads `results.tsv` and finds inconsistent row shapes.

**Instead:** Schema changes require atomic update of `_shared/eval-loop-spec.md` + lp-eval `format-conventions.md` + `append-loop-result.ts` helper + every other consumer of `results.tsv`. Bump lp-eval `version` when the schema changes (currently v0.1.0 — provisional-rubric signal, expected to bump after cycles of real use).

**Owned by:** Operator (during refactor + new-feature work) + eval-loop owner (canonical schema in `_shared/eval-loop-spec.md`) + lp-eval playbook § "Cross-stack contract".

---

### 13. Polish-chain misroute

**Pattern:** User invokes `humanmaxxing` or `polish-vn` on the eval artifact ("make the diagnosis sound less robotic"). Polish chain runs on what is supposed to be a structured operational document.

**Why it fails:** lp-eval OUTPUT is an evidence snapshot + ledger row + learning promotion proposal — structured operational data consumed by downstream cycles. Running humanmaxxing on it recursively redefines what "evaluation" means — verdicts become prose paragraphs, Evidence tables get prose-ified, etc. Downstream skills (future lp-eval cycles, lp-brief --rev=N+1, dashboard tools) can no longer parse it.

**Instead:** humanmaxxing and vn-tone run on USER-FACING copy (blog posts, ad copy, cold-outreach emails). They do NOT run on operational artifacts like cycle evaluations. If the eval artifact reads "robotic," that's correct register — operational documents prioritize parseability over style.

**Owned by:** Orchestrator (chain position note in playbook — lp-eval is operational; humanmaxxing/vn-tone are for user-facing copy) + chain-position discipline.

---

### 14. Sibling-skill confusion with lp-brief

**Pattern:** User wants to redesign a launched page → invokes lp-eval expecting it to produce a brief. Or wants a post-launch evidence snapshot → invokes lp-brief expecting it to score analytics. Or assumes "they're both LP skills, one will figure out what I want."

**Why it fails:** lp-eval (post-launch scoring inside an eval-loop) and lp-brief (construction-time architecture for new or redesigned pages) are sibling skills with non-overlapping scope. Conflating them produces wrong output for both intents — lp-eval treating a brief request as a scoring failure (NEEDS_CONTEXT for missing metric); lp-brief treating an analytics request as a hypothesis generation prompt (asking 4 cold-start questions when the user wanted a verdict).

**Instead:** Skill Deference in both skills routes correctly. lp-eval defers to lp-brief when the user wants a new brief/redesign. lp-brief defers to lp-eval when the user wants post-launch CRO from real evidence inside an eval-loop. Both skills' descriptions explicitly carve out the other's scope ("Not for post-launch CRO" / "Not for the next page brief/redesign").

**Owned by:** lp-eval Skill Deference block (defers to lp-brief / eval-loop / campaign-plan) + lp-brief Skill Deference block (defers to lp-eval / design-brief / brand-system / copywriting) + orchestrate-marketing routing rules.

---

## Cross-references

- For agent-side rubric ownership: see `agents/critic-agent.md` (6-dimension 0-10 Pass/Fail Rubric: Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Boundary Control / Ledger Correctness; 4-tier Verdict: PASS ≥48 with no dim <7 / PASS_WITH_CONCERNS ≥42 with no dim <6 + confidence/confounders surfaced / FAIL <42 or any dim <6 or any Hard Fail; 7 Hard Fails: no existing loop / no metric source-window / claimed improvement without baseline / generic heuristic as evidence / fabricated numbers-logos-testimonials / invalid ledger status / low-confidence learning promotion).
- For procedural correctness: see `procedures/pre-dispatch.md` (hard gates fire BEFORE any cold-start questioning — catches pattern 11) and `procedures/dispatch-mechanics.md` (8-step Dispatch procedure + Layer 3 critic gate FAIL-no-side-effects rule + `append-loop-result.ts` invocation).
- For format-side correctness: see `format-conventions.md` (frontmatter schema + 8 body sections + Evidence table 6-column format + Results Row 8-column format + Learning Promotion rules — catches patterns 6, 7, 8, 9).
- For shared canonical: `_shared/eval-loop-spec.md` (program.md + context.md + results.tsv schema + strategy/execution/evals subdirs).
- Sibling coordination: lp-brief (`marketing-skills/skills/lp-brief/`) for construction-time architecture; eval-loop (`skills/meta/run-pipeline/`) for loop scaffolding + durable learning ledger.
