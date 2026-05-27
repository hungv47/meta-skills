---
title: Slow-Update Fence — protected region inside SKILL.md that step-level edits must not modify
lifecycle: canonical
status: stable
produced_by: meta-skills (authored once; consumed by every SKILL.md and any skill-edit workflow)
provenance:
  extracted_from: SkillOpt paper (arXiv:2605.23904v2) §3.6 Epoch-Wise Slow/Meta Update + §C.3 Patch Representation and Safeguards
  extracted_at: 2026-05-27
consumers: every SKILL.md author, future `/optimize-skill` meta-skill, skill-edit code-review
load_class: PLAYBOOK
---

# Slow-Update Fence

**A fenced region inside a SKILL.md whose contents may only be modified by an explicit epoch-boundary "slow update" workflow — never by step-level edits, routine refactors, or optimizer patches. The fence protects durable procedural lessons from being silently overwritten by local edits.**

Borrowed from SkillOpt (arXiv:2605.23904v2). Removing the equivalent mechanism cost SkillOpt **22pp on SpreadsheetBench** in ablation — the single largest regression in their entire ablation suite. The cost to adopt it is one section in a SKILL.md template plus a code-review convention.

---

## Markers

```markdown
<!-- SLOW_UPDATE_START -->
... durable, hard-won procedural rules ...
<!-- SLOW_UPDATE_END -->
```

HTML-comment markers chosen because:
- They render invisibly in any Markdown viewer (the agent still reads them — comments are tokens, not display).
- Grep / sed / lint scripts can locate them deterministically.
- They survive copy-paste through every Markdown tool we use (Roughdraft, GitHub, plugin loaders).

The fence is **single-instance per SKILL.md** — one open, one close. Do not nest. Do not interleave with other fences.

---

## What belongs inside the fence

Rules that meet **all three** of these tests:

1. **Procedural, not instance-specific.** "Inspect workbook structure before writing code" qualifies. "When task X mentions phrase Y, do Z" does not.
2. **Earned, not authored once.** A lesson that came out of a regression, a critic-flagged failure pattern, or a deliberate cross-session review. Not something invented during the initial draft.
3. **Costly to relearn.** Erasing this rule would either reintroduce a known bug or regress an outcome the team has measured.

Seed candidates (Phase 1.2 migration script will hydrate these when run):

- **Brand fidelity invariants.** Signal Lime <10% of pixels. No purple/blue AI gradients. No glass/frosted panels. Dark default, never pure black.
- **Completion status contract.** Every skill ends with one of DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT — no implicit "here's the output."
- **Pinned anti-regressions.** Rules a prior `/review-work` or `/clean-code` review identified as load-bearing. Each pinned rule should cite the artifact path that justified pinning it.

---

## What does NOT belong inside the fence

- Per-task brief inputs, examples, or worked walkthroughs (they belong in `references/examples/`).
- Routing pseudocode, agent manifests, dispatch mechanics (they belong in `routing.yaml` / `references/agent-manifest.md`).
- Token-budget commentary, refactor notes, TODOs (they belong in commit messages or `.forsvn/` snapshots).
- Anything that might rotate — model names, dependency versions, dated heuristics. The fence is for durable lessons, not load-bearing facts that change.

Bloating the fence neutralizes it. If everything is protected, nothing is.

---

## The protection contract

**Step-level edits (anyone, any PR, any optimizer):** must not modify content between the markers. The markers themselves are also out of bounds — do not remove, rename, or relocate them. A skill-edit PR that touches the fenced region fails review.

**Epoch-boundary slow-update workflow (the only path that may rewrite the fence):** runs at most once per epoch (definition: weekly cadence, or N accepted `/optimize-skill` runs across the corpus once Phase 3 ships). It compares the same rollouts under previous vs current skill, identifies systemic regressions and persistent failures, and writes a single replacement guidance block. The rewritten skill **still passes through the standard validation gate** before being accepted — the fence is not a license to ship unvalidated guidance.

Until Phase 3 lands, the slow-update workflow is **a human-owned ceremony**: a deliberate PR titled `slow-update(<skill>): <reason>` that touches only the fenced region, reviewed by someone other than the author, and merged only when the reason is one of the three tests above.

---

## Lint and enforcement

`scripts/audit-skill-budget.ts` extends to detect:

1. Skills missing the fence entirely (warning during Phase 1 migration; error after).
2. Skills with malformed fences (open without close, multiple opens, content before SLOW_UPDATE_START on the same line).
3. PR diffs that modify fenced content without the commit subject prefix `slow-update(<skill>):` (error in CI).

Until enforcement ships, the fence is a code-review convention. Reviewers reject diffs that touch fenced content unless the PR title declares it a slow-update.

---

## Example — minimum viable fence

```markdown
## Critical Gates — load first

These five gates are the safety floor; `--fast` does not skip them.

1. Argument Engineering before word-choice ...
2. V/F/U is per-line, not per-piece ...
...

<!-- SLOW_UPDATE_START -->
## Durable Rules (protected)

- **Brand fidelity:** Signal Lime is a state cue only — <10% of pixels, never a large background. Deep Forest `#004700` is the brand anchor for selected/active fills. No purple/blue AI gradients, no glass/frosted panels.
- **Completion status:** Every run terminates with DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT. Implicit completion is a contract violation.
- **Competitor Swap Test (pinned 2026-05-12, `.forsvn/.../meta-review-work-2026-05-12-competitor-swap-regression.md`):** if a competitor could sign the headline without lying, U fails regardless of V/F. Auto-fail at critic.
<!-- SLOW_UPDATE_END -->

## Quality Gate — critic checklist
...
```

The fence sits between major sections — typically after the "Critical Gates" or "Before Starting" block, before the per-route procedure. Position it where a reader who skims the SKILL.md will see it; do not bury it at the bottom.

---

## Anti-patterns

1. **Treating the fence as a junk drawer.** Every rule earns its place by surviving the three tests. Drift toward "let's also pin this" turns the fence into ambient noise.
2. **Inlining instance-specific examples.** Examples belong in `references/examples/`. The fence holds the *rule*, not the illustration.
3. **Removing the fence "to clean up."** A refactor that says "I removed the SLOW_UPDATE markers because they looked like clutter" is the exact failure mode SkillOpt's ablation documented. Reject the PR.
4. **Slow-updating without comparing rollouts.** The slow-update workflow earns its name by comparing same-task behavior under previous vs current skill. Editing the fence without that comparison is just a step-level edit wearing a hat.
5. **Citing as "trust me" rules.** Pinned rules should cite the artifact, decision record, or review that justified pinning. A rule with no provenance gets re-litigated every refactor.

---

## Related refs

- [[mode-resolver]] — what `--fast` does and does not skip (the fence is one of the things `--fast` cannot route around)
- [[artifact-contract-template]] — the artifact frontmatter schema; this fence is about SKILL.md *bodies*, which is a separate surface
- [[review-work]] (skill) — produces the regression evidence that justifies pinning a rule into the fence
- SkillOpt paper §3.6 + §C.3 — origin of this mechanism, ablation evidence
