# Skill Candidacy — Code Structure & Closeout Review Workflow

> **STATUS: SUPERSEDED** (2026-05-16). Verdicts and implementation plan moved to `ROADMAP.md` §2 (closeout workflow → E2) and §3 (extract service layer → E3). Decisions recorded in `DECISIONS.md`. Do not re-implement from this file.

## References

- **code-structure** — `https://github.com/michaelshimeles/skills/blob/main/code-structure/SKILL.md`
- **codex-review** — `https://github.com/steipete/agent-scripts/tree/main/skills/codex-review`

---

## 1. Code Structure (michaelshimeles)

### What It Is

Service Layer Architecture pattern: **two-layer separation** between Actions (orchestration / domain rules — "why/when") and a service layer (shared operational mechanics — "how"). Composability over monoliths, explicit params, structured returns, migration checklist with caller-by-caller verification.

### Existing Coverage in This Stack

| Existing Skill | Overlap | Gap |
|---|---|---|
| `improve-codebase-architecture` | Analyzes codebases for refactoring opportunities | Focuses on domain language + ADRs, not a specific extraction pattern with repeatable migration checklist |
| `code-cleanup` | Audits/refactors for readability | Behavioral cleanup (dead code, deps), not structural extraction of shared mechanics |
| `system-architecture` | Designs blueprints | Architecture from scratch, not refactoring existing code into layers |

### Verdict

**New skill candidate** — `extract-service-layer` or `service-pattern`. The gap is concrete: there's no skill that, given "I'm copy-pasting this sandbox-creation logic across GitHub Actions handlers," produces a step-by-step plan to extract. The migration checklist (extract one block → replace one caller → verify → migrate rest) is a clear procedural recipe that fits our skill format. Could live in `product-skills/` alongside `code-cleanup`.

**Improvement candidate** — `code-cleanup` could add a "structural extraction" mode that specifically looks for repeated operational chunks across action files and recommends service layer extraction using this skill's methodology.

---

## 2. Closeout Review Workflow (steipete)

### What It Is

**Generic post-edit review closeout workflow** — not Codex-specific. The pattern:

1. **Target selection** — auto-detect what to diff (dirty uncommitted, PR branch vs base, committed single change)
2. **Parallel closeout** — run tests and review concurrently
3. **Noise filtering** — use a subagent to strip speculative/non-actionable findings from review output before presenting to the operator
4. **Iterate** — fix findings → rerun affected tests + review → repeat until clean
5. **Final report** — review command used, findings accepted/rejected with brief reasons, exit code 0

The tool steipete uses is Codex CLI, but the structure is tool-agnostic. Could use any reviewer (Codex, Claude diff review, GPT review, an agent, human-provided findings).

### Existing Coverage in This Stack

| Existing Skill | Overlap | Gap |
|---|---|---|
| `fresh-eyes` | Post-implementation quality check via independent review agent | Agent-review paradigm, not a closeout workflow with tool-based review + noise-filtering + parallel tests + iteration loop |
| `review` (gstack) | Pre-landing PR review | Structural analysis (SQL, trust boundaries, conditional side effects) — different scope and methodology |
| `codex` (gstack) | Wraps Codex CLI (review, challenge, consult) | General-purpose wrapper; no closeout workflow, no noise-filtering, no final report convention |

### Verdict

**Enrich `fresh-eyes` with the closeout workflow pattern.** The steipete workflow adds procedure to what `fresh-eyes` already does conceptually (post-implementation verification). Specifically:
- **Target auto-detection** — determine what to review based on git state (dirty, committed, PR)
- **Parallel test/review** — don't block review on test completion
- **Noise-filtering subagent** — the steipete insight: review tools are noisy; a subagent pass to filter actionable from speculative saves operator time
- **Iteration protocol** — fix → rerun relevant tests + rerun review → repeat until clean
- **Final report convention** — structured closeout, not ambiguous

**Not a new skill.** The gap is procedural, not conceptual. `fresh-eyes` already owns the "after you edit, here's the verification" slot.

---

## Implementation Notes

### If pursuing code-structure as a new skill:

- Budget: `fast` (single-agent, procedural recipe)
- Placed in `product-skills/skills/extract-service-layer/`
- Bundles: migration checklist template, before/after examples per tech stack
- Pre-dispatch questions: "which files have the repeated logic?", "how many callers?", "what tech stack?"
- Critic gate: verify each extraction preserves caller behavior (typecheck + test per migration step)

### If improving code-cleanup:

- Add "structural extraction" pre-dispatch option
- Route to a new extraction subroutine when the user's codebase has schema: N callers doing the same SDK calls
- Integrate the migration checklist as a reference doc

### If enriching fresh-eyes with closeout workflow:

- Add target auto-detection subroutine (dirty uncommitted / PR branch vs base / committed single change)
- Add parallel test/review execution path
- Add noise-filtering subagent pass: filter review output to actionable-only before presenting to operator
- Add iteration protocol: fix → rerun relevant tests + rerun review → repeat until clean
- Add final report convention (review mechanism, findings accepted/rejected, clean exit)
- All optional — conserves tokens; the subagent pass is the highest-leverage addition since it solves the "review tool said 30 things, which matter?" problem

---

## Implementation Status (as of 2026-05-14)

### Extant (what's been done)

Nothing. Both verdicts remain unstarted:

| Verdict | Status | Evidence |
|---|---|---|
| New `extract-service-layer` skill | ❌ Not started | No directory at `product-skills/skills/extract-service-layer/` |
| `code-cleanup` structural extraction mode | ❌ Not started | No structural extraction references in code-cleanup SKILL.md |
| Enrich `fresh-eyes` with closeout workflow | ❌ Not started | None of 6 closeout terms exist in `meta-skills/skills/fresh-eyes/SKILL.md` |

### Implementation Priority

| # | Action | Effort | Impact | Dependencies |
|---|---|---|---|---|
| 1 | Add noise-filtering subagent to fresh-eyes | Medium | High (solves "30 findings, which matter?") | None — highest leverage single change |
| 2 | Add final report convention to fresh-eyes | Low | Medium (structured closeout) | None |
| 3 | Add target auto-detection to fresh-eyes | Low | Medium (saves "what do I review?") | None |
| 4 | Add iteration protocol to fresh-eyes | Medium | Medium (close the loop) | Step 1 |
| 5 | Create `extract-service-layer` skill | Medium | Medium (fills product gap) | None |
| 6 | Add structural extraction mode to code-cleanup | Medium | Low (overlaps with new skill) | Step 5 optional |

### Decision needed

The extract-service-layer new skill vs code-cleanup improvement question is still open. The audit shows that neither path has been started. The original recommendation (new skill candidate) still stands — it's a distinct enough pattern from code-cleanup's behavioral cleanup scope.

### References to this idea

- Tracked in `IDEA-4c-feedback-loop.md` (feedback architecture touches closeout review as downstream dependency)
- Tracked in `IDEA-4b-evaluation-layer.md` (evaluation cycle includes fresh-eyes as post-implementation step)
