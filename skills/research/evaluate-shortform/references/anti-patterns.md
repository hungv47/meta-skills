---
title: Short-Form Eval — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: short-form-eval
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** critic agent fires (4-rubric gate) OR re-dispatch heuristic kicks in. Re-read before any cycle artifact ships as `done` or `done_with_concerns`.

---

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Locking the rubric prematurely | v0.1 ships provisional. Editing `references/rubric.md` to fix what looks wrong on cycle 1 destroys the variance signal cycle 2-3 needs to harden it. | Record per-cycle friction in the cycle artifact's §7 Recommendations. Revise the rubric deliberately at the cycle 2-3 boundary, with the prior cycle reports as evidence. Don't smuggle rubric changes between cycles. |
| Treating cycle 1 like a graded test | A single calibration pair overfits any locked rubric. Producing tight scores on cycle 1 looks rigorous and is actually noise. | Honor the 70 observation / 30 scoring weighting. Long Observation section; short Rubric Scores section; explicit "score is provisional context, not a verdict" tone. Cycle 2+ flips the weighting as variance accumulates. |
| Fabricated metrics | "Approximately 12% completion" without a panel/screenshot citation. Critic rubric #1 fails. | Inline-cite every number to URL + panel/screenshot path: `"saves/likes ratio 0.34 ([post panel screenshot 2026-05-09 09:14, archived at <path>](path))"`. |
| Free-form pattern claims | Prose like "credential-flash hooks seem to work better" is unusable downstream by gap-gate or by future `research-shortform` re-runs. | Pattern-log entries MUST use the canonical 4-line shape: **Claim** / **Evidence** / **Refutability** / **Expiry**. Critic rubric #3 enforces. |
| Skipping refutability | A pattern that can't be falsified in any future cycle is a tautology, not a finding. | Force the **Refutability** line: what would prove this wrong? If you can't name it, the claim is too soft or too strong. Re-author. |
| Multi-post rollup in one cycle | v0.1 scope is one post per cycle. Bundling multiple posts dilutes signal and breaks `results.tsv` row semantics. | One cycle = one post. Multi-post rollups parked for a later version. If operator wants 3 posts scored, run 3 cycles. |
| Auto-running cycles back-to-back | Each cycle is operator-gated. Auto-looping defeats the deliberate-revision discipline. | Skill scaffolds + reports + exits. Operator re-invokes for the next cycle. |
| Critic loop past 2 cycles | Trying for PASS forever when the underlying data is genuinely thin. Burns tokens. | Hard cap at 2 cycles. After cycle 2, ship `done_with_concerns` with failed rubrics pinned at top of artifact. |
| Treating catalog freshness as a hard block | The catalog being warn/stale is signal, not a stop condition. Eval against stale-but-existing catalog is partial signal; refusing to run wastes the post. | Declare `catalog_freshness: warn|stale` in frontmatter, note in §6 Open Risks, recommend refresh in §7 — but RUN the eval. Only BLOCK if no catalog exists at all. |
| Treating catalog missing as a soft warn | If no catalog matches the post's topic+market, scoring is fabrication. There's no reference to score against. | BLOCKED with recommendation to run `research-shortform` first. Don't best-effort against missing reference. |
| Author-discretion dominating the score | The discretion dimension exists for the eval-runner's judgment but should never outweigh the hard-evidence dimensions (citation, falsifiability, shape). | Critic rubric verifies discretion is at lower weight in the score totalization. If discretion is dragging the artifact to PASS, the hard dimensions must be re-scored honestly first. |
| Skipping `results.tsv` append or manifest-sync | The eval artifact exists on disk but the loop ledger doesn't know about it; future cycles + state-detection can't see it. The cycle effectively didn't happen. | Both `append-loop-result.ts` AND `manifest-sync.ts` are mandatory post-write side effects. Verify both ran before declaring DONE. |
| Cross-stack contract drift | Adding new frontmatter fields or body sections without updating downstream consumers (future `research-shortform` re-runs, gap-gate). | Output Artifact Structure is the cross-stack contract. Schema changes require atomic update of downstream consumers — flag to operator before changing. |
| Scoring a brief that wasn't followed | If the post deviates significantly from the brief (different hook, different format), the eval is scoring something else. Fidelity scores become noise. | The "Brief vs Observed" body section §3 surfaces this explicitly. If deviation is large, note it in the score justification and consider whether brief-fidelity should reflect "not followed" rather than scoring a phantom claim. |
| Cycle 2-3 rubric revision skipped | Mandatory revision boundary at cycle 2-3 protects against premature lock. Skipping it locks v0.1 by default. | Cycle 2-3 artifact: explicitly note rubric-revision status in §7. If not revised, ship `done_with_concerns` with the mandatory-revision flag pinned. |
