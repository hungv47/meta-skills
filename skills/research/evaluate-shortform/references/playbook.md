---
title: Short-Form Eval Playbook
lifecycle: canonical
status: stable
produced_by: short-form-eval
load_class: PLAYBOOK
---

# Short-Form Eval Playbook

## Why this skill exists

The short-form pipeline produces hypotheses (briefs) and ships them as posts. Without a closing-the-loop skill, the system never learns whether the hypothesis survived contact with the platform. Operators end up with a growing library of briefs and no measured signal about which patterns actually land. The eval skill exists to **close** that loop: read the post, read the brief that produced it, read the platform-intel catalog that informed the brief, score the delta, and write a single canonical pattern-log entry that downstream tooling (gap-gate, future `research-shortform` re-runs) can consume.

The signal that matters is the **delta** between predicted and observed — not the absolute engagement number. A post that hit 100k views but had a generic hook against a catalog claiming credential-flash dominance is more informative than a post that hit 10k views with the predicted archetype.

## Methodology

**Refutability > Correctness > Completeness.** A pattern claim that can't be wrong in any future cycle isn't a pattern — it's a tautology. Every pattern-log entry includes an expiry condition (what would refute it). The pattern-extractor agent enforces this with a canonical 4-line block shape.

**Provisional rubric, deliberate revision.** `references/rubric.md` ships at `version: 0.1, status: provisional`. Mandatory revision after cycle 2-3 against real variance. Per-cycle rubric drift is expected — encode the change in the cycle artifact, don't smuggle it into the rubric file silently between cycles. The panel that scoped this skill (`debate-agents` 2026-05-08) explicitly flagged premature-rubric-lock as the highest residual risk.

**Cycle 1 weighting is 70 observation / 30 scoring.** A single calibration pair would overfit a locked rubric. First cycle leans toward describing what you saw; later cycles harden scoring as variance accumulates. Observation contradicts the rubric? Observation wins.

**Both brief and catalog must exist.** The eval scores a *fidelity claim* against *known patterns*. Missing either side reduces the run to vibes — BLOCKED, not best-effort.

**One post per cycle.** v0.1 scope. Multi-post rollups are parked. Each cycle is operator-gated; the skill scaffolds and reports, it does not loop.

## Principles

- **Citation is non-negotiable.** Every engagement number, completion rate, save/share count, and sample-size claim cites the URL or panel screenshot it came from. Critic rubric #1 fails the artifact otherwise.
- **Pattern-log entries are atomic and structured.** One cycle = one pattern-log entry block in the canonical claim/evidence/refutability/expiry shape. Free-form prose patterns are unusable downstream.
- **Author-discretion at lower weight.** Subjective rubric dimension exists for the eval-runner's judgment but never dominates. Hard-evidence dimensions (citation, falsifiability, shape) gate first.
- **Critic gate is 4 rubrics, 2-cycle cap.** PASS = ship `done`. FAIL → re-dispatch named agents with feedback. After cycle 2, ship `done_with_concerns` with failed rubrics pinned. Don't loop forever.
- **Catalog freshness is a flag, not a block.** If the catalog is past warn-window when the eval fires, declare `catalog_freshness: warn|stale` in frontmatter — don't refuse to run. The eval against stale-but-existing catalog is still signal; the warning propagates.
- **The artifact IS the contract.** Output frontmatter + body section order are consumed by future `research-shortform` re-runs (pattern-log mining) and gap-gate analysis (eventual). Schema drift requires atomic update of downstream consumers — never silent.

## When NOT to use this skill

- **Pre-publish brief authoring** — use `brief-shortform` (marketing-skills). Different job; this skill scores what brief produced, not what brief should be.
- **Catalog discovery** ("what's working on TikTok right now?") — use `research-shortform`. Different lifecycle: research builds the reference; eval scores against it.
- **No matching catalog exists for post's topic+market** — BLOCKED, defer to `research-shortform` first. Eval against missing reference is meaningless.
- **No loop workspace exists** — defer to `run-pipeline` to create the workspace, then run eval inside it.
- **Multi-post campaign rollup** — out of scope for v0.1. Parked. Run one cycle per post.
- **Long-form video, podcasts, blog posts** — different platforms, different mechanics, different rubric. Not in scope.

## History / origin

- **v0.1.0 — initial release (provisional rubric).** Panel-scoped 2026-05-08 (`debate-agents` decision artifact); 4-agent orchestration (hook-strength + eval-runner parallel → pattern-extractor → critic sequential); 4-dimension rubric + author-discretion lower-weight dimension; cycle-1 70/30 weighting + mandatory cycle 2-3 rubric revision. `version: 0.1.0` is deliberate signal — operators reading this skill see the version and know the rubric needs hardening before cycle 4+.
- **v6 Phase 2 Wave 2 refactor (May 17, 2026, still v0.1.0):** body trimmed 293 → 154 lines (-47.4%). 5 new refs (playbook + anti-patterns + format-conventions + procedures/pre-dispatch + procedures/dispatch-mechanics). Before-Starting check + Artifact Contract block added per Step 7.5. **Cross-stack contract preserved byte-identical:** 5 Critical Gates, 4 Quality Gate rubrics, Output Artifact Structure (frontmatter + 7 body sections), Completion Status verdicts. Agent Manifest (4 agents) + Layer 1/2 dispatch tables semantics unchanged. `references/rubric.md` + `references/_shared/platform-intelligence/` unchanged. Per-cycle artifact `results.tsv` append behavior + manifest-sync side effect preserved. No version bump — refactor lands on the research-skills 2.0 base as a commit, not a release. Fresh-eyes round 1 (generalist agent): PASS, no fixes required. Reviewer noted 2 additive items as concretizations (not contradictions) of baseline: (a) `--fast` collapse rule made explicit ("single-pass eval-runner, skip hook-strength parallel + skip pattern-extractor as separate Layer-2 agent") — baseline deferred to stack-level CLAUDE.md, refactor inlines the concrete rule consistent with the stack contract; (b) anti-patterns.md grew from 7 bullets to 15 rows, 8 of which are reframings of constraints existing implicitly in baseline (loop cap, freshness handling, side-effect enforcement, cross-stack drift, etc.) — none are new constraints.

## Further reading

- [`procedures/pre-dispatch.md`](procedures/pre-dispatch.md) [PROCEDURE] — Cold + Warm Start prompts + write-back map + hard-block conditions
- [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md) [PROCEDURE] — Layer 1/2 spawn mechanics, critic routing, chain position, skill deference
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes
- [`format-conventions.md`](format-conventions.md) — date format, URL handling, citation pattern, rubric score format, pattern-log entry shape
- [`rubric.md`](rubric.md) — the v0.1 provisional rubric (4 dimensions + author-discretion)
- [`_shared/platform-intelligence/`](_shared/platform-intelligence/) — per-platform eval references (hook archetypes, completion-rate baselines, signal-decay rules). Canonical at top-level `references/_shared/platform-intelligence/` (D13)
- [`_shared/pre-dispatch-protocol.md`](_shared/pre-dispatch-protocol.md) — canonical Pre-Dispatch spec
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (this skill is `budget: standard`; `--fast` collapses to single-pass eval-runner, but Critical Gates still enforced)
