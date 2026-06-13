---
title: Asset-Eval Playbook
lifecycle: canonical
status: stable
load_class: PLAYBOOK
---

# Asset-Eval Playbook

> Why this skill exists, philosophy, methodology, when NOT to use, history. Cited from SKILL.md's introduction. Stable reference — update only when philosophy or methodology genuinely shifts.

## Why this skill exists

The graphic/image loop was the one merge-ready loop that could not close. `brief-graphic` writes the spec, `produce-asset` emits the render prompt, an engine renders — but the rendered PNG never re-entered the artifact graph, so nothing scored whether the render actually matched the brief, and downstream `write-social` / `write-ad` referenced a brief, not the real asset (CLOSED-LOOP.md §5, §6).

The return-leg (CLOSED-LOOP.md §6 — asset re-ingest + option-picker, shipped as the `assets` / `asset_picked` contract fields) closed the mechanical gap: the rendered asset now re-enters the graph. `evaluate-asset` closes the *evaluation* gap on top of it — it scores the re-ingested render against the brief's acceptance criteria so the loop can decide keep/discard/watch and route the next render cycle.

`evaluate-asset` exists to:

1. **Score the render, never the prompt.** The single discipline this skill enforces: you cannot evaluate an asset that is not in the graph. If only a prompt exists, route to `produce-asset` + re-ingest first.
2. **Refuse "pretty but off-spec" as success.** A striking render that misses a hard acceptance criterion (wrong aspect ratio, missing required copy slot, off-brand palette) did not do the job. Brief-fidelity gates the verdict; render beauty does not.
3. **Hold brand discipline.** Palette adherence, the Leaf <10% state-cue rule, type stack, and logo safe-zone are checked against the brand tokens — an off-brand render is not a keep.
4. **Promote durable lessons to learnings.md.** Conservatively — engine/brief-type/brand-scoped, high-confidence only.

## Philosophy

### The render is the evidence

A "best-practice critique" of a prompt ("this should produce a clean hero image") is fiction without the render. evaluate-asset refuses to score a cycle when the asset is not re-ingested — return NEEDS_CONTEXT and route to produce-asset + re-ingest, not a heuristic verdict.

### Fidelity over beauty

The most common asset-eval failure is letting a beautiful render mask a brief miss. Generative engines produce striking images that ignore the spec — wrong aspect ratio, mangled in-image copy, an extra finger, a palette that drifts off-brand. evaluate-asset checks every HARD acceptance criterion against the actual render and refuses `keep` on any hard miss, however good the render looks.

### Hard vs soft criteria

Acceptance criteria split into hard (aspect ratio, required copy slots, dimensions, on-brand palette — falsifiable, gate the verdict) and soft (mood, exact crop, stylistic preference — noted, never a hard failure). Conflating them either kills good renders for taste reasons or keeps off-spec renders because they look nice. The split is mandatory.

### Causal humility on engines

Diagnosis names plausible drivers tied to what is visible. It distinguishes "the brief was ambiguous" from "the engine failed" (text mangling, aspect drift, seed variance) from "the operator picked the wrong variant." Confounders are surfaced, not smoothed.

### One asset (or picked variant) per cycle

When the option-picker returned a variant set, the cycle scores the picked variant (`asset_picked`); the rest archive. A 6-variant render is one cycle on the chosen variant, never a blend.

### Lane discipline

Short-form video is `evaluate-shortform`'s lane. A landing page is `evaluate-landing-page`'s. The asset's live-post engagement once it ships is `evaluate-content` / `evaluate-ad`. evaluate-asset owns the static render vs its brief. When the surface is one of those, route — do not score it here.

### The rubric is provisional

v0.1. Mandatory revision after cycles 2-3. The 7 dimensions (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Brief-Fidelity Discrimination / Render-Quality & Brand-Fit / Ledger Correctness) are a starting calibration. Operator overrides on the same dim > 3 times triggers revision.

## Methodology

### 4-agent dispatch (mirrors evaluate-content / evaluate-ad)

- **Layer 1 (parallel):** Metric Ingest + Diagnosis. Metric Ingest confirms the asset is re-ingested + viewable and normalizes dimensions/engine/acceptance-criteria; Diagnosis checks the render against the brief + render-quality + brand-fit.
- **Layer 2 (sequential):** Recommendation consumes both Layer 1 outputs and proposes verdict (keep/discard/watch/blocked), next-cycle route, ledger row, learning promotion.
- **Layer 3 (sequential):** Critic enforces the 7-dim rubric. PASS → write artifact + append ledger row + manifest sync. FAIL → revise once (max). After 2 failed revisions, return BLOCKED.

### Outputs land in three places

- `evals/YYYY-MM-DD-cycle-N.md` (primary artifact, 10-field frontmatter + provenance + 8-section body)
- `results.tsv` (one row, 8 columns, asset id + engine in description) via `append-loop-result.ts`
- `learnings.md` (only when critic approves promotion — high-confidence, engine/brief-type/brand-scoped, durable)

## When NOT to use

- **No existing eval loop.** Return NEEDS_CONTEXT, recommend `/run-pipeline`. evaluate-asset does not scaffold loops.
- **Only a prompt/brief exists; nothing rendered or re-ingested.** Return NEEDS_CONTEXT, route to `produce-asset` + re-ingest (`forsvn-preview attach`). evaluate-asset never scores a prompt.
- **The asset is a short-form video.** Route to `evaluate-shortform`.
- **The surface is a landing page.** Route to `evaluate-landing-page`.
- **The question is the asset's live-post engagement.** Route to `evaluate-content` / `evaluate-ad`.
- **The next action is re-rendering or a brief change.** Route to `produce-asset` / `brief-graphic`.

## Sibling coordination

- **`produce-asset`** owns rendering + the return-leg attachment. evaluate-asset reads the re-ingested asset; routes the next render to produce-asset with a tightened prompt.
- **`brief-graphic`** owns the brief + acceptance criteria. evaluate-asset scores against them; routes spec fixes back to brief-graphic.
- **`create-brand`** owns the brand tokens. evaluate-asset checks against them; routes token gaps to create-brand.
- **`run-pipeline`** owns loop scaffolding. evaluate-asset assumes a loop exists.
- **`evaluate-content` / `evaluate-ad` / `evaluate-shortform` / `evaluate-landing-page`** are sibling eval lanes — same 4-agent / 7-dim / 8-col structure; evaluate-asset mirrors them for cross-eval consistency.

## History / origin

- **2026-06-01 — shipped as one of the three missing evals** named in CLOSED-LOOP.md §5 (`evaluate-asset`, `evaluate-outreach`, `evaluate-seo`). The graphic/image loop's gap was "no render-quality eval; produce-asset never sees the final render" — closed by the return-leg (§6) + this eval. 7-dim rubric chosen mirroring evaluate-content's 5 generic dims + 2 asset-specific (Brief-Fidelity Discrimination + Render-Quality & Brand-Fit, replacing content's Engagement-Quality Discrimination + Platform-Fit). 4-agent shape byte-aligned with the eval siblings for cross-eval consistency.
- **Provisional v0.1.** Rubric will be revised after cycles 2-3.

## Acceptance Reminders (cite SKILL.md, not duplicate)

- 8 Critical Gates (existing loop / re-ingested asset / source brief / static-visual lane / one asset-variant / no fabricated quality / explicit attribution / does-not-produce-assets)
- 4-agent dispatch (Metric Ingest + Diagnosis + Recommendation + Critic)
- 7-dim rubric pass gate: aggregate ≥ 49 AND every per-dim ≥ 6
- Critic-override protocol via `scripts/log-critic-override.ts`
- Generation provenance — `input_artifacts` lists the source brief + the re-ingested asset + BRAND.md
- Results Row schema byte-identical with the eval siblings (8 cols)
- Learning promotion engine/brief-type/brand-scoped
