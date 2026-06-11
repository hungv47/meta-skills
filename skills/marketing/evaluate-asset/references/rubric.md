---
type: rubric
schema_version: 1
last_verified: 2026-06-01
verifier: hungv47
revision_status: provisional v0.1
---

# Asset-Eval Rubric (v0.1)

7-dimension rubric for post-render visual-asset evaluation. Used by `agents/critic-agent.md` to gate the cycle artifact before it writes a ledger row. **Provisional v0.1 — mandatory revision after cycles 2-3.**

**Pass gate, scoring scale, the < 6 asymmetry, PASS_WITH_CONCERNS, and the universal Hard Fails** are canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) [PROCEDURE] § 1–§ 3. This file is the domain instrument — the 7 dimensions below (5 shared + 2 asset-specific) with their domain-specialized band tables and the asset-specific Hard Fails.

## Revision Triggers

The universal revision triggers and the mandatory-revision-after-cycles-2-3 rule are in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 5. Domain-specific triggers for the asset-eval rubric:

- A new render engine with different failure modes enters the registry (the known-engine-confounder list must update).
- The brief schema changes which acceptance criteria are expressible (the hard/soft taxonomy must re-baseline).

---

## 1. Loop Fit (0-10)

Does the artifact write inside an existing loop AND evaluate the loop's asset surface AND the cycle's declared one asset/variant?

| Band | Description |
|------|-------------|
| 9-10 | `.forsvn/loops/[slug]/program.md` + `context.md` present and read; cycle artifact scoped to the loop's primary metric and the one re-ingested asset/picked variant; cycle number resolves from `last results.tsv cycle + 1`; no scope drift |
| 7-8 | Loop present and scope clean; cycle number correct; minor read-order skip (didn't surface latest learnings.md) but no contamination |
| 5-6 | Loop present but read-order incomplete; cycle scoped correctly but asset/variant scope implicit |
| 3-4 | Loop missing context.md OR cycle artifact scope drifted to an adjacent asset; asset id absent from cycle |
| 0-2 | No existing loop OR cycle writes to wrong loop directory OR the cycle's asset contradicts program.md scope |

**Auto-fail conditions:**

- No `.forsvn/loops/[slug]/program.md` (Critic Hard Fail #1)
- A variant set exists but the picked variant was not identified (Critic Hard Fail #10)

---

## 2. Metric Integrity (0-10)

Is the asset confirmed re-ingested, with dimensions/format/engine, primary metric, baseline, and the brief's acceptance criteria explicit and falsifiable?

| Band | Description |
|------|-------------|
| 9-10 | Asset confirmed re-ingested + viewable (the orchestrator read the image); dimensions + aspect ratio + format stated; render engine + execution_mode recorded; primary metric named; baseline in same terms; the brief's acceptance criteria listed and hard/soft-tagged |
| 7-8 | Asset attached + criteria listed; one secondary field implicit (e.g., format stated, exact resolution omitted) |
| 5-6 | Asset attached but acceptance criteria only partially extracted; hard/soft split implicit |
| 3-4 | Acceptance criteria missing OR baseline missing — and the cycle still claimed `keep` |
| 0-2 | Scored a prompt with no re-ingested render OR fabricated dimensions OR no acceptance criteria at all |

**Auto-fail conditions:**

- No re-ingested asset — scored the prompt (Critic Hard Fail #2)
- Fabricated dimension or visual detail (Critic Hard Fail #6)
- Missing/fabricated acceptance criteria (Critic Hard Fail #5)

---

## 3. Attribution Honesty (0-10)

Are render engine, settings, known-engine failure modes, and the subjective-vs-measurable split stated without overclaiming?

| Band | Description |
|------|-------------|
| 9-10 | Render engine + execution_mode stated; known-engine failure modes named as confounders (text mangling, hand artifacts, aspect drift, seed variance); measurable criteria (dimensions, copy-slot presence, palette) separated from subjective reads (mood, taste); confidence matches evidence |
| 7-8 | Most attribution caveats present; one material confounder missing; confidence well-calibrated |
| 5-6 | Caveats present but confidence inflated (claimed `high` on a single render with no baseline) |
| 3-4 | Major attribution gap (engine-failure-mode unflagged AND a fidelity claim made) OR confidence drastically inflated |
| 0-2 | Quality claimed with no engine/source attribution OR subjective taste presented as measured fidelity |

**Auto-fail conditions:**

- Fabricated quality claim (Critic Hard Fail #6)

---

## 4. Decision Discipline (0-10)

Does the keep/discard/watch/blocked verdict follow Recommendation's Decision Rules — driven by the hard-constraint check + brand-fit read, not render beauty?

| Band | Description |
|------|-------------|
| 9-10 | Verdict matches the hard-constraint check + brand-fit read; routing is to the smallest correct next skill (produce-asset re-render vs brief-graphic spec-fix vs create-brand token-fix) at the right granularity; decision sentence is one sentence with the asset id + engine |
| 7-8 | Verdict matches; routing correct but slightly over-broad (recommended a brief rewrite when a re-render would do) |
| 5-6 | Verdict matches but decision sentence multi-sentence or omits the asset id; routing right domain, wrong specificity |
| 3-4 | Verdict drifts from the check (render was striking → `keep` despite a missed hard constraint) OR routing to a non-existent / inappropriate skill |
| 0-2 | Verdict invents fidelity (claimed `keep` with no criteria check) OR routing to "redo everything" |

**Auto-fail conditions:**

- Status outside `{keep, discard, watch, blocked}` (Critic Hard Fail #7)

---

## 5. Brief-Fidelity Discrimination (0-10)

Was each HARD acceptance criterion checked against the actual render? Was a hard-constraint miss refused as a success signal? Were soft preferences kept distinct from hard failures?

| Band | Description |
|------|-------------|
| 9-10 | Every hard acceptance criterion (aspect ratio, required copy slots, dimensions, on-brand palette) checked against the render with visible evidence; a hard miss blocked `keep`; soft preferences (mood, crop) noted but not treated as hard failures |
| 7-8 | Hard criteria checked + verdict rests on them; minor slip — a borderline soft/hard criterion mis-tagged but the verdict was still correct |
| 5-6 | Criteria checked but the hard-vs-soft read is implicit; the verdict happens to be right |
| 3-4 | Criteria treated as one blended "looks about right"; a hard-constraint miss was allowed to read as partial success |
| 0-2 | A `keep` rests on render beauty while a hard acceptance criterion was missed OR criteria were never checked against the render |

**Auto-fail conditions:**

- `keep` on a render missing a hard acceptance criterion (Critic Hard Fail #11)
- Fabricated / missing acceptance criteria (Critic Hard Fail #5)

---

## 6. Render-Quality & Brand-Fit (0-10)

Was technical render integrity assessed (text legibility, artifacts, resolution) AND brand-token adherence (palette, type, logo safe-zone, Leaf <10%)? Did a broken or off-brand render get refused?

| Band | Description |
|------|-------------|
| 9-10 | Technical integrity assessed (in-image text legible, no malformed subject, resolution sufficient for the surface); brand tokens checked (palette on-token, Leaf <10%, type stack, logo safe-zone); an off-brand or broken render was named as such and did not earn `keep` |
| 7-8 | Both assessed; verdict rests on them; one minor slip — a near-token palette not explicitly flagged but verdict correct |
| 5-6 | Technical OR brand assessed but not both; the cleaner of the two carried the read implicitly |
| 3-4 | Render quality OR brand-fit assessed only as "looks fine"; an artifact or off-token fill went unflagged |
| 0-2 | A `keep` rests on a broken render (mangled text, malformed subject) OR an off-brand palette / Leaf overrun was ignored |

**Auto-fail conditions:**

- Brand-fit failure ignored while status = `keep` (Critic Hard Fail #12)

---

## 7. Ledger Correctness (0-10)

Exactly one valid `results.tsv` row, schema-compliant, asset-id tagged?

| Band | Description |
|------|-------------|
| 9-10 | Exactly one row appended via `append-loop-result.ts`; 8 columns; status ∈ `{keep, discard, watch, blocked}`; description one sentence with no tabs; description includes the asset id + engine tag; artifact path relative to loop folder |
| 7-8 | One row appended; schema-compliant; description has the asset id but is slightly verbose |
| 5-6 | One row appended but description missing the asset id / engine explicitly (implicit only) |
| 3-4 | Row schema drift (extra column, tab in description, status off-spec) |
| 0-2 | Multiple rows appended OR row appended despite critic FAIL OR row contains a fabricated value |

**Auto-fail conditions:**

- Ledger row status outside `keep | discard | watch | blocked` (Critic Hard Fail #7)
- Ledger description missing the asset id + engine tag (Critic Hard Fail #8)
- Multiple rows appended for one cycle

---

## Falsifiability summary

A dim score is only valid if the evaluator can name **what evidence would have moved the score one band** — the discipline is canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 6. Per-dimension examples for this rubric:

- Loop Fit 8 → 9: surface latest learnings.md in the read-order log.
- Metric Integrity 7 → 9: list every brief acceptance criterion with a hard/soft tag.
- Attribution Honesty 6 → 8: name the render engine's known text-mangling failure mode as a confounder.
- Decision Discipline 6 → 8: tighten routing from "brief rewrite" to "produce-asset re-render with a tightened prompt".
- Brief-Fidelity 7 → 9: check each hard criterion against the render with visible evidence and rest the verdict on it.
- Render-Quality & Brand-Fit 6 → 8: state the palette delta against the brand tokens and the Leaf share.
- Ledger Correctness 8 → 10: include the asset id + engine verbatim in the description.

If you can't name the next-band evidence, you're scoring vibes, not the rubric.

## Score justification format

For each per-dim score in the Critic Verdict, include 1 sentence of rationale tied to the artifact's actual content (the requirement + the "scoreless verdict = Hard Fail" rule are canonical in [`_shared/evaluation-loop-rubric.md`](_shared/evaluation-loop-rubric.md) § 7). Example:

```
- loop_fit: 9 — program.md + context.md + results.tsv read; cycle scoped to the picked variant v3
- metric_integrity: 8 — asset re-ingested + read; dimensions 1080x1350; 8 acceptance criteria listed hard/soft
- attribution_honesty: 8 — engine + execution_mode stated; text-mangling failure mode named; one seed-variance confounder missed
- decision_discipline: 9 — verdict matches the hard-constraint check; routing to produce-asset re-render is correctly narrow
- brief_fidelity_discrimination: 9 — all 5 hard criteria checked against the render; aspect-ratio miss blocked keep
- render_quality_and_brand_fit: 8 — palette read against tokens; Leaf 7%; in-image headline legible
- ledger_correctness: 10 — one row; description includes "v3 / fal"; 8 columns clean
```

Scoreless verdicts (PASS without per-dim breakdown) are themselves a Hard Fail signal — the rubric exists to make the verdict falsifiable.
