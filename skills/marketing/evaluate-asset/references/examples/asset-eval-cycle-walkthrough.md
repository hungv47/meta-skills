# Worked Example — scoring a re-ingested render against its brief-graphic spec

*Synthetic but plausible end-to-end run. All values illustrative.* This is the **return-leg**: the `launch-og` brief went out (see produce-asset's own walkthrough), an engine rendered it, the operator picked a variant and re-ingested it, and now `evaluate-asset` scores the **rendered asset** — never the prompt — against the brief it was produced from. The signature discrimination is on display: a clean, attractive render that **drifts from a hard brief constraint still fails**.

## Operator invocation + inputs consumed

```
/evaluate-asset launch-hero asset_picked=v3 "hard-criteria pass rate"
```

Inputs resolved:
- **Loop:** `.forsvn/loops/launch-hero/` — `program.md` + `context.md` + `results.tsv` (cycle 0 = brief baseline) all present.
- **Re-ingested asset (return-leg):** `docs/forsvn/artifacts/marketing/produced-assets/launch-og/manifest.md`, `asset_picked: v3` (engine returned 6 variants; operator picked v3, the rest archive).
- **Source brief:** `docs/forsvn/artifacts/marketing/design-briefs/launch-og.md` (slot `og-main`, 1.91:1).
- **Render engine + execution_mode:** `fal-flux` · `direct`. Render settings: 1200×630 target, seed 4412.
- **Primary metric:** hard-criteria pass rate (N/M).
- **Brand tokens:** `brand/BRAND.md` + `brand/DESIGN.md` supplied.

## Pre-dispatch validation

**Hard-blocks (checked BEFORE cold-start), all clear:**
- `program.md` + `context.md` present → not `NEEDS_CONTEXT`.
- Asset re-ingested via the return-leg (`asset_picked: v3` on the manifest, not just a prompt) → Gate 2 satisfied; the orchestrator opens the PNG with Read before scoring.
- Lane = static graphic (`og-main`), not video / landing page / live post → Gate 4 satisfied, stays in-lane.
- Source brief readable; asset id present → not `BLOCKED`.
- `results.tsv` is the standard 8-col schema → no hand-edit warning.

**Cold-start:** all 6 bundled questions answered from the invocation + resolved files → skipped.

Cycle number = `last results.tsv cycle (0) + 1` = **1**.

## Multi-agent flow (per agent-manifest.md)

**Layer 1 — parallel.**

*Metric Ingest* confirms re-ingest + viewability, normalizes the packet:
- dimensions `1200×630`, aspect `1.91:1`, format PNG; engine `fal-flux` / `direct`, seed 4412.
- extracts the brief's acceptance criteria, hard/soft-tagged:
  - **H1** aspect 1.91:1 · **H2** headline copy slot `"Ship the loop, not the slides"` present + legible · **H3** title block ≤60% width, 48px safe inset · **H4** on-token palette (Forest Shadow `#0A120D` bg, Leaf `#74B36B` <10%) · **H5** ≥1200px long edge.
  - soft: warm dawn mood, slight low-angle crop.

*Diagnosis* opens v3 and scores it against the brief (representative evidence packet):

```markdown
### Brief-Fidelity Check
- intended_spec: 1.91:1 OG hero, headline "Ship the loop, not the slides", title block ≤60% width / 48px inset, Forest palette, ≥1200px
- asset_id: v3 (fal-flux)
- criteria_met:
  - H1 aspect 1.91:1 — MET (1200×630 measured)
  - H2 headline slot — MISSED: render shows "Ship the loop, not the slldes" (in-image text mangled — "slldes")
  - H3 title block ≤60% / 48px inset — MET (block ≈54% width, inset clean)
  - H4 on-token palette — MET (bg reads Forest Shadow; Leaf used as accent only)
  - H5 ≥1200px — MET (1200px long edge)
- soft_criteria_read: warm dawn mood aligned; low-angle crop aligned
- hard_constraint_failures: H2 — required headline copy slot present but glyph-mangled, not legible/correct

### Render-Quality Signals
- technical_integrity: minor-artifacts — composition clean, but in-image headline corrupted ("slldes")
- text_in_image: mangled
- resolution_fit: sufficient (1200px)

### Brand-Fit Signals
- palette_adherence: on-token (Forest Shadow bg, no Signal Lime present)
- leaf_share: <10% (Leaf confined to the CTA underline — state-cue only)
- type_and_logo: type reads Bricolage-like; logo safe-zone respected
- brand_read: strong

### Confounders
- fal-flux is a known in-image-text mangler at >3 words; 6-word headline is past its reliable band (engine failure, not brief ambiguity)
- single render, no prior comparable (cycle 1) → baseline is the brief target, not a prior render

### Signal Quality
- visible_support: strong (image opened + measured)
- judgment_confidence: high
```

**Layer 2 — Recommendation** consumes both Layer-1 outputs: 4/5 hard criteria met, but **H2 (headline legibility) is a hard miss** → cannot earn `keep` regardless of how attractive v3 is. Brand-fit `strong`, technical `minor-artifacts`, gap is fixable next render → `discard`, route to `produce-asset` (re-render, same brief, tighten prompt to render the headline as a typeset overlay rather than engine-drawn glyphs).

**Layer 3 — Critic** scores the 7-dim rubric (verdict below).

## Produced eval artifact (in full)

Written to `.forsvn/loops/launch-hero/evals/2026-06-13-cycle-1.md`:

```markdown
---
skill: evaluate-asset
version: 1
date: 2026-06-13
status: done
summary: "v3 (fal-flux) cycle 1 asset evaluation"
purpose: "Post-render brief-fidelity + brand-fit snapshot for an asset eval loop, scoped to one re-ingested asset/variant"
lifecycle: evaluation
use_when: "Deciding whether to keep, discard, watch, or block the current rendered asset"
do_not_use_when: "Re-rendering or changing the brief without reading the latest loop context and results"
upstream: ".forsvn/loops/launch-hero/program.md, context.md, docs/forsvn/artifacts/marketing/design-briefs/launch-og.md, docs/forsvn/artifacts/marketing/produced-assets/launch-og/manifest.md"
downstream: "results.tsv, learnings.md, produce-asset / brief-graphic next-render cycle"
provenance:
  skill: evaluate-asset
  run_date: 2026-06-13
  input_artifacts:
    - docs/forsvn/artifacts/marketing/design-briefs/launch-og.md
    - docs/forsvn/artifacts/marketing/produced-assets/launch-og/manifest.md
    - brand/BRAND.md
  output_eval: null
---

# v3 (fal-flux) Cycle 1 Evaluation

## Verdict

- Status: discard
- Confidence: high
- Asset / Engine: v3 (picked variant) · fal-flux (execution_mode: direct)
- Primary metric: hard-criteria pass rate = 4/5 vs 5/5 brief target
- Decision: Discard v3 (fal-flux) — composition + palette land, but the required headline copy slot rendered mangled ("slldes"), a hard-constraint miss; re-render via produce-asset.

## Evidence

| Signal | Current | Baseline | Window | Source | Caveat |
|---|---:|---:|---|---|---|
| hard-criteria pass rate | 4/5 | 5/5 | fal-flux · direct · 2026-06-13 | re-ingested render manifest | brief target, not a prior render |
| hard criteria met (N/M) | 4/5 | 5/5 | fal-flux · direct · 2026-06-13 | brief acceptance criteria | H2 (headline) failed |
| brief-fidelity | partial | full | fal-flux · direct · 2026-06-13 | render vs brief | one hard miss |
| palette adherence | on-token | on-token | DESIGN.md | brand tokens | Forest Shadow bg confirmed |
| leaf share | ~6% | <10% | DESIGN.md | brand tokens | accent-only (CTA underline) |
| resolution / dimensions | 1200×630 (1.91:1) | 1200×630 | render settings | render manifest | aspect MET |
| render integrity | minor-artifacts | clean | fal-flux · direct | image read | in-image headline corrupted |

## What Changed This Cycle

- Source brief: `docs/forsvn/artifacts/marketing/design-briefs/launch-og.md`
- Re-ingested asset: `docs/forsvn/artifacts/marketing/produced-assets/launch-og/manifest.md` (asset_picked: v3)
- Render/prompt/variant delta from prior cycle: first scored render in this loop (cycle 0 = brief baseline); engine drew the 6-word headline as glyphs rather than overlaying typeset copy.

## Diagnosis

### Brief-Fidelity Check

- H1 aspect 1.91:1 — met (1200×630)
- H2 headline copy slot — missed (rendered "slldes"; required exact string not legible)
- H3 title block ≤60% width / 48px inset — met (~54% width, inset clean)
- H4 on-token palette — met (Forest Shadow bg, Leaf accent-only)
- H5 ≥1200px long edge — met (1200px)
- soft criteria read: aligned (warm dawn mood + low-angle crop)
- hard_constraint_failures: H2 — required headline slot glyph-mangled, not legible/correct

### Render-Quality Signals

- technical_integrity: minor-artifacts — composition clean; in-image headline corrupted ("slldes"); resolution sufficient

### Brand-Fit Signals

- palette_adherence: on-token (Forest Shadow `#0A120D` bg; no Signal Lime present)
- leaf_share: <10% (~6%, CTA underline only — state-cue, not a fill)
- type_and_logo: type reads Bricolage-like; logo safe-zone respected
- brand_read: strong

### Confounders

- fal-flux is a known in-image-text mangler past ~3 words; the 6-word headline is outside its reliable band (engine failure, not brief ambiguity)
- single render, no prior comparable render → baseline is the brief target

## Next Cycle Recommendation

- Keep: composition, 1.91:1 framing, Forest palette, low-angle dawn crop — all on-spec, seed worth re-using.
- Discard: the engine-drawn headline glyphs (mangled).
- Watch: n/a (decisive hard miss; not a soft-drift hold).
- Route next work to: produce-asset (re-render, same brief; render the scene without baked-in text and overlay the headline as typeset copy, or constrain to ≤3 in-image words).

## Results Row

```tsv
cycle	date	artifact	primary_metric	value	baseline	status	description
1	2026-06-13	evals/2026-06-13-cycle-1.md	hard-criteria pass rate	4/5	5/5	discard	v3 / fal-flux — 4/5 hard criteria met, headline copy slot mangled ("slldes") — discard, re-render with typeset overlay
```

## Learning Promotion

- Promote to `learnings.md`: yes
- Lesson: fal-flux reliably mangles in-image headlines past ~3 words — spec headline copy as a typeset overlay (or constrain in-render text to ≤3 words), do not let the engine draw multi-word headlines.
- Expiry / caveat: engine-scoped to fal-flux; brief-type-scoped to text-bearing OG/social graphics; retest if fal-flux ships a text-rendering upgrade.
```

## Results.tsv row (exact column order)

Appended via the validated 8-col helper — `cycle  date  artifact  primary_metric  value  baseline  status  description`:

```bash
bun scripts/append-loop-result.ts "launch-hero" \
  --artifact evals/2026-06-13-cycle-1.md \
  --metric "hard-criteria pass rate" --value "4/5" --baseline "5/5" \
  --status "discard" \
  --description "v3 / fal-flux — 4/5 hard criteria met, headline copy slot mangled (slldes) — discard, re-render with typeset overlay"
```

## Critic verdict (PASS) — domain gate explicit

```markdown
## Critic Verdict

- verdict: PASS
- score: 64/70
- per_dim:
  - loop_fit: 9 — program.md + context.md + results.tsv read; cycle scoped to the picked variant v3; cycle # = 0 + 1
  - metric_integrity: 9 — asset re-ingested + opened; 1200×630 / 1.91:1 / PNG stated; 5 hard + 2 soft criteria listed and tagged
  - attribution_honesty: 9 — fal-flux + direct + seed 4412 stated; in-image-text-mangling failure mode named as confounder; no-baseline noted
  - decision_discipline: 9 — discard follows the hard-constraint check, not render beauty; routing narrowed to a produce-asset re-render, not "redo everything"
  - brief_fidelity_discrimination: 10 — every hard criterion checked against the render with visible evidence; the H2 miss blocked keep though v3 is attractive
  - render_quality_and_brand_fit: 9 — palette read against DESIGN.md tokens, Leaf ~6%, in-image headline named as mangled
  - ledger_correctness: 9 — one 8-col row; status `discard`; description carries "v3 / fal-flux"; path relative to loop
- required_fixes:
  - none
- concerns:
  - none
- hard_fails_triggered:
  - none
```

**The domain gate that did the work:** *Brief-Fidelity Discrimination*. v3 is a clean, on-brand, well-composed render — render-quality alone would have read `keep`. The verdict is `discard` solely because a **hard** acceptance criterion (legible required headline) missed. Brief-fidelity gates the verdict; render beauty does not. Critic Hard Fail #11 (a `keep` on a render missing a hard criterion) was the trap avoided.

Side effects then ran in order (critic PASS): write artifact → append ledger row → promote learning (high-confidence + engine-scoped + has a brief-target baseline) → `bun scripts/manifest-sync.ts`.

## FAIL → fix variant (brief)

Had the cycle scored v3 `keep` because "the render is gorgeous" while H2 was mangled, the Critic returns **FAIL**: `brief_fidelity_discrimination: 2` (a `keep` resting on beauty while a hard criterion missed) + Hard Fail #11 → aggregate is irrelevant, any per-dim < 6 fails. Orchestrator re-dispatches Recommendation once with the required fix ("a hard miss cannot earn keep"); the corrected verdict (`discard`) re-scores to PASS. Had it still failed after one revision → no ledger row, return `BLOCKED`.

## Completion status

**DONE** — eval artifact written, one 8-col ledger row appended, learning promoted, critic PASS.
