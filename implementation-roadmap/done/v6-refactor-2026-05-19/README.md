# Skill-Stack Refactor — Program Root

**Mission:** reduce token-cost-per-invocation across the 35-skill stack without sacrificing output quality, by enforcing body-diet + lazy-reference loading and auditing critic-gate ROI. Triggered by a 2026-05-15 Matt Pocock post on long skills; refined into our own program with quality-first guardrails.

**Status (2026-05-16):** Plan written. Harness not yet built. No skill refactored. See [`progress.md`](./progress.md) for live state.

---

## How to resume — read in this order

Any agent (Claude in a fresh context, or any teammate) picking this up MUST:

1. **[`progress.md`](./progress.md)** — current phase, current skill in flight, last decision, any blockers. Read first to know where work is.
2. **[`01-why.md`](./01-why.md)** — why this program exists, what we're solving, what we explicitly rejected.
3. **[`02-constraints.md`](./02-constraints.md)** — `npx skills add` behavior, self-containment rule, artifacts↔evals contract that we must preserve.
4. **[`03-harness.md`](./03-harness.md)** — the measurement tool. Required reading before any audit or refactor decision.
5. **[`04-protocol.md`](./04-protocol.md)** — per-skill audit → refactor → validate steps; creative-vs-structural distinction; proactive mode-selection design.
6. **[`05-acceptance.md`](./05-acceptance.md)** — the bars a refactor must clear before it ships.
7. **Relevant stack file in [`stacks/`](./stacks/)** — only the one being worked on. Per-skill notes and order.
8. **[`handoff.md`](./handoff.md)** — at end of session, append a handoff note so the next session resumes cleanly.

If you read these in order, you have full context. There is no other document.

---

## File map

```
implementation-roadmap/refactor/
├── README.md                # this file — entry point + resume protocol
├── progress.md              # living tracker — current phase, blockers, decision log
├── handoff.md               # end-of-session handoff template + procedure
├── 01-why.md                # context: Matt's post, our diagnosis, locked decisions
├── 02-constraints.md        # npx skills add behavior, self-containment, artifacts↔evals
├── 03-harness.md            # the measurement tool — spec + JSON schema + impl plan
├── 04-protocol.md           # audit → refactor → validate, per skill
├── 05-acceptance.md         # quality bars — blind-diff, contract-hash, critic-ROI gates
└── stacks/
    ├── meta.md              # 7 skills — proving ground; start here after harness
    ├── product.md           # 6 skills — small surface, structural skills
    ├── research.md          # 8 skills — ref-heavy by nature; creative-vs-structural mix
    └── marketing.md         # 14 skills — largest, most creative-leaning, hardest
```

---

## Locked decisions (2026-05-16, from operator)

These are not up for re-litigation in a fresh session. If you disagree after reading the rationale in `01-why.md`, raise it explicitly with the operator before deviating.

1. **Quality bar: extremely high** — refactored output must match or exceed pre-refactor on blind operator diff. Critic-score parity is necessary but not sufficient.
2. **Audit then refactor, skill by skill** — global audit phase first (all skills in a stack instrumented); then refactor one skill end-to-end before starting the next.
3. **Build a tiny harness** — instrumentation is non-negotiable. No vibes-based refactoring.
4. **Proactive mode-selection with user confirm** — each skill auto-resolves fast/standard/deep from input shape, proposes mode + reason, asks user (silent-accept supported via flag override).
5. **Creative skills get looser scaffolding** — refs frame opinions and examples; critics check craft floor, not house-style ceiling. Structural skills keep strict rubrics.
6. **Artifacts ↔ evals contract is sacred** — any frontmatter or section change in an output requires atomic update of the downstream eval skill in the same commit.
7. **Self-containment** — every skill must work end-to-end after `npx skills add --skill <name>`. Shared refs duplicate into each skill's `references/_shared/` via sync mechanism.

---

## Execution order (locked)

1. Build harness ([`03-harness.md`](./03-harness.md))
2. Audit meta-skills with harness; populate findings into [`stacks/meta.md`](./stacks/meta.md)
3. Refactor meta-skills in graduated risk order: `eval-loop` → `cleanup-artifacts` → `orchestrate-meta` → `agents-panel` → `fresh-eyes` → `task-breakdown` → `discover`
4. Audit + refactor product-skills ([`stacks/product.md`](./stacks/product.md))
5. Audit + refactor research-skills ([`stacks/research.md`](./stacks/research.md))
6. Audit + refactor marketing-skills ([`stacks/marketing.md`](./stacks/marketing.md))
7. Final regression sweep — re-run harness across full stack; compare to baseline; write release notes

Rationale for this order is in [`01-why.md`](./01-why.md). Don't reorder without operator approval.

---

## Out-of-scope guardrails

The following are explicitly **NOT** part of this program. If a thought drifts here, write it to [`progress.md`](./progress.md) under "Deferred ideas" and keep moving.

- Renaming/merging/deleting skills — this is body-diet, not stack consolidation.
- Rewriting reference content — only the *loading pattern* changes; reference content stays unless body-diet creates duplication that must be resolved.
- Changing skill artifact paths — paths are part of the artifacts contract.
- Adding new skills.
- Migrating to a different plugin format.
- Touching `syncthis/` or the `npx skills` CLI behavior.
- Touching external (non-in-repo) skills.

If the operator changes scope, update this README's "Locked decisions" section with a dated amendment.

---

## Quality non-negotiables

- Every refactor passes [`05-acceptance.md`](./05-acceptance.md) before shipping.
- Every shipped refactor updates [`progress.md`](./progress.md) with before/after numbers from the harness.
- Every session ends with a [`handoff.md`](./handoff.md) entry.
- If the harness says output regressed and the operator can't explain why → revert. No "it's probably fine."

### Fresh-eyes + commit-not-push cadence (2026-05-16)

Operator rule, applies for the duration of this program:

1. **Run `/fresh-eyes` after every implementation step.** Implementation includes: audit write-ups (the watch-outs and reports must be evidence-grounded, not vibes); refactor passes (body trims, ref extractions, dead-code deletions); behavior fixes (skill-behavior changes beyond body-diet). The audit-program's own implementation work is NOT exempt — every measurable output gets a fresh-eyes pass before the operator considers it done.
2. **Apply fresh-eyes findings inline** before moving on. Major/critical findings (CONFIDENCE 8+) are non-negotiable fixes. Minor findings get fixed unless the cost is disproportionate. Nits suppressed unless trivial.
3. **Commit (don't push) after each implementation step + its fresh-eyes resolution.** The local commit bundle accumulates across many steps; the umbrella tree stays ahead of `origin/main` for the duration. Push only when "everything is finalized" — operator's call, typically a logical batch like "all 7 meta-skills refactored" or "v6.3.0 ready to ship". Mid-program pushes are NOT prohibited, but they're explicitly operator-initiated, not automatic.
4. **What "commit" means when the work is gitignored.** Much of this program's output lives in gitignored paths (`implementation-roadmap/`, `.agents/`, `skills-resources/`). For sessions where the only changes are in gitignored paths, "commit" is a no-op at the umbrella level — surface this explicitly in the handoff and don't fabricate a commit. The commit-not-push rule applies when there ARE tracked changes; otherwise, the work is recorded only in the gitignored audit trail until a tracked refactor lands.
