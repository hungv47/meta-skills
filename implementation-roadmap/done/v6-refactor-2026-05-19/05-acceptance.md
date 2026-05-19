# Acceptance Criteria — When a Refactor Ships

Locked decision (from 2026-05-16 operator conversation): **quality bar is extremely high.** Critic-score parity is necessary but NOT sufficient. Blind operator diff is the final gate.

A refactor ships only when ALL the following pass.

---

## Gate 1 — Machine-verifiable (harness)

Run `bun meta-skills/scripts/harness/diff.ts --skill <name>`. All must be true:

- [ ] **Default token load decreased ≥30%** for at least the standard fixture
- [ ] **Body line count dropped to target range:**
  - Structural skill: ≤200 lines
  - Creative skill: ≤300 lines
  - Router skill (`orchestrate-*`): ≤150 lines
- [ ] **Contract hashes UNCHANGED** for every output artifact (frontmatter shape + section header order)
  - Exception: intentional contract change atomic with downstream eval skill update — must be flagged explicitly in commit message
- [ ] **No critic agent with <30% ROI retained without justification**
- [ ] All 3 input fixtures (minimal, standard, stretch) produce non-error output

If any fail → don't ship. Diagnose, fix, re-run.

---

## Gate 2 — Output-structural (eyeball)

Compare pre/post output side-by-side. All must be true:

- [ ] Every required section from baseline is present in post-refactor
- [ ] Section ordering matches baseline
- [ ] Frontmatter contains all required fields
- [ ] No "stub" sections (sections that exist but are empty or near-empty)
- [ ] Artifact paths are identical between baseline and refactor

This catches drift the machine misses when contract-hash logic isn't sensitive enough.

---

## Gate 3 — Blind operator diff (the hard gate)

The most important and most expensive gate. Procedure:

### Setup

1. Take the 3 fixture outputs from baseline and 3 from post-refactor (6 total).
2. Strip identifying metadata (any timestamps, harness fields, anything that reveals which is which).
3. Randomly assign A/B labels per fixture (so for fixture 1, baseline might be A and refactor might be B; for fixture 2, baseline might be B and refactor might be A — coin-flip each).
4. Save the mapping to a sealed file (e.g., gpg-encrypted or just don't open until after scoring).

### Scoring

Operator reviews each A/B pair WITHOUT knowing which is which. Scores each on:

**For all skills:**
- Clarity (1–5): does it answer the request directly?
- Depth (1–5): does it have the substance the request deserves?
- Restraint (1–5): does it avoid unnecessary padding/hedging/throat-clearing?

**Plus skill-specific dimensions** (defined per skill in the per-stack file):

| Skill type | Extra dimensions |
|---|---|
| Brief skills (lp-brief, short-form-brief, ad-copy) | Production-readiness, hook strength, CTA force |
| Research skills (icp-research, market-research, diagnose) | Evidence quality, novel insight, falsifiability |
| Structural skills (system-architecture, task-breakdown) | Correctness, edge-case coverage, decomposition quality |
| Copy skills (copywriting, humanize, vn-tone, cold-outreach, social-copy) | Voice fit, conversion potential, "would I publish this" |

### Pass criteria

- Refactored version (the unknown letter) scores **≥ baseline on every dimension** AND **≥ baseline overall (sum)** across at least 2 of 3 fixtures
- If refactored is worse on exactly 1 fixture, operator's call: ship if the loss is small and the win on others is large; revert if not
- If refactored is worse on 2+ fixtures → revert. Period.

### Reveal

After scoring, reveal the A/B mapping. Save the scored results to `.agents/skill-artifacts/meta/records/harness/blind-diff/<skill>-<date>.md` for the audit trail.

---

## Gate 4 — Contract integrity (cross-skill)

If the refactored skill produces an artifact consumed by another skill (brief skills → eval skills, primarily — see [`02-constraints.md`](./02-constraints.md) section 3):

- [ ] The downstream eval skill runs without errors against the refactored output
- [ ] At least one historical eval (replay an old cycle from `skills-resources/loops/*/evals/`) produces comparable scoring on the new output
- [ ] No frontmatter field is missing, renamed, or has changed semantic meaning

If the refactor INTENTIONALLY changed the contract (rare, requires operator approval):
- [ ] Downstream eval skill update is in the same commit batch
- [ ] CHANGELOG entry documents the breaking change
- [ ] Version bump is MINOR or MAJOR (not patch)

---

## Gate 5 — Self-containment integrity

- [ ] Skill folder works after `npx skills add hungv47/<stack> --skill <name>` (no broken `../` references)
- [ ] All `references/_shared/` files have correct `.generated-support` markers if synced
- [ ] No dangling references in body to files that don't exist
- [ ] Mode-resolver ref present at `references/_shared/mode-resolver.md`

Verify by:
```bash
# In a scratch directory
cd /tmp && rm -rf test-install && mkdir test-install && cd test-install
npx skills add hungv47/<stack>-skills --skill <name>
# Spot-check that all files referenced by body are present
```

---

## Gate 6 — Documentation

- [ ] [`progress.md`](./progress.md) skill row updated to `validated` then `shipped`
- [ ] Before/after numbers recorded in skill row (body lines, default load, critic changes)
- [ ] Decision log entry if any non-obvious choice was made
- [ ] Per-stack file in [`stacks/`](./stacks/) updated with completion checkmark
- [ ] CHANGELOG entry in the stack repo (per `RELEASING.md`)
- [ ] GitHub Release published on stack repo
- [ ] Handoff log entry in [`handoff.md`](./handoff.md)

---

## Gate 7 — Artifact graph hardening (added 2026-05-16 with merge)

Per [`04-protocol.md`](./04-protocol.md) Step 7.5. The merged v6 program treats chain legibility as a first-class refactor concern.

- [ ] Output path matches `implementation-roadmap/canonical-paths.md` (produced in Phase 1B)
- [ ] Artifact frontmatter includes `lifecycle:`, `status:`, `produced_by:`, `provenance:` (with `skill`, `run_date`, `input_artifacts`, optional `output_eval`)
- [ ] Body's `## Artifact contract` block names every downstream consumer explicitly
- [ ] For HIGH-risk brief→eval pairs: one historical eval cycle replayed against refactored output produces comparable scores (no silent rubric drift)
- [ ] Cross-skill learning propagation tags applied if `experience/` is wired (per Phase 1C)

If Gate 7 fails: chain has rotted silently. Diagnose before shipping. Refactor without chain hardening is incomplete under the merged v6 protocol.

---

## Decision matrix — what to do when gates partially fail

| Situation | Action |
|---|---|
| Gates 1–7 all pass | Ship |
| Gate 1 fails on token reduction (<30%) but blind diff passes | Operator call: ship if the structure is genuinely cleaner even with small token win, otherwise iterate |
| Gate 1 fails on contract hash but downstream eval still parses | Don't ship — fix the hash mismatch (it indicates drift you didn't see) |
| Gate 3 fails on 1 fixture, passes on 2 | Operator call (case by case) |
| Gate 3 fails on 2+ fixtures | Revert. Document failure mode in [`progress.md`](./progress.md) |
| Gate 4 breaks downstream eval | Revert immediately. Don't try to "fix forward" — eval breakage compounds across multiple loops |
| Gate 5 breaks self-containment | Don't ship — fix the dangling refs. Self-containment is non-negotiable |
| Gate 6 incomplete | Don't ship — finish the documentation. Future-you needs it |
| Gate 7 fails on provenance frontmatter | Don't ship — add the frontmatter fields. They're cheap to add and load-bearing for the chain |
| Gate 7 fails on eval replay (HIGH-risk pair) | Don't ship — likely a silent contract drift. Diagnose with downstream eval skill owner |

---

## "Done" definition for the entire program (Phase 7)

The refactor program is complete when:

- [ ] All 35 skills have status `shipped` in [`progress.md`](./progress.md) — or `out-of-scope` with operator-approved rationale
- [ ] Total body lines across stack reduced ≥40% (16k → ~10k or less)
- [ ] Default-loaded tokens per standard invocation reduced ≥30% (measured by harness on a representative sample of 5 skills per stack)
- [ ] No skill has critic agents with <30% ROI without documented justification
- [ ] No skill has broken self-containment
- [ ] Every skill has 3 input fixtures committed
- [ ] Final umbrella marketplace version bumped (likely a MINOR — this is significant change, not breaking)
- [ ] CHANGELOG and GitHub Releases reflect the program
- [ ] [`progress.md`](./progress.md) decision log captures every non-trivial choice made
- [ ] [`handoff.md`](./handoff.md) has a "Program complete" entry

After completion, this `implementation-roadmap/refactor/` folder becomes durable documentation of the methodology. Move to `implementation-roadmap/done/refactor-<date>/` and link from the umbrella's `snapshot-biz.md`.
