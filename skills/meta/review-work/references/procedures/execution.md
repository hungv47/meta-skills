# Execution — Step-by-Step

Orchestration loop for review-work. SKILL.md links here for the procedural detail.

## 1. Identify what to verify

Detect the target from git state first per [`review-setup.md`](review-setup.md) § Target detection. Don't assume `main...HEAD`.

What needs review: code just written (most common) · architecture/design decision (per `reviewer.md § Architecture variant`) · user-provided code · prior output ("double-check that").

Gather: artifact + original requirements + relevant context.

## 2. Spawn the reviewer (or specialists if deep)

Before dispatch: per `review-setup.md` § Closeout discipline, if the target is uncommitted work and a formatter is detected, offer to run it (operator-confirmed) so findings cite stable line numbers. Per § Concurrent test execution, start the test suite in the background as the reviewer is spawned; fold failures into the finding set.

- **Generalist** (fast / standard) — one reviewer per [`reviewer.md`](reviewer.md).
- **Specialist** (deep / `--thorough` / auto-escalated) — 3 in parallel per [`specialist-mode.md`](specialist-mode.md) (security + performance + correctness). Merge findings; aggregate verdict (any CRITICAL → CRITICAL; any ISSUES_FOUND → ISSUES_FOUND; all PASS → PASS).
- **Critic consensus** (deep, non-code high-stakes — compliance copy / paid media / launches / canonical research) per [`critic-consensus.md`](critic-consensus.md).

## 3. Evaluate the review

- **PASS** — write dated report; "Verified by independent reviewer — no issues found"; include summary.
- **ISSUES_FOUND** — classify each finding: AUTO_FIX (confidence 9+ AND severity minor/nit) vs ASK (everything else, resolver fixes but flags for operator).
- **CRITICAL** — security vuln / data loss / wrong logic. Flag to user BEFORE resolving; they may want to change approach.

## 4. Spawn the resolver (if issues found)

Per [`resolver.md`](resolver.md). Resolver sees BOTH original code AND reviewer's full output. Returns FIXED/DECLINED per finding + COMPLETE corrected output.

## 5. Apply with self-regulation gate

Before applying resolver output, STOP if any:

- Resolver modified >30% of the original artifact — "may need a redesign rather than incremental fixes."
- Resolver addressed >10 findings in a single pass — regression risk too high.
- Resolver output introduces new issues that the reviewer didn't find in the original — "the resolver is making things worse."

Any trigger → surface to operator with the gate name; do NOT apply.

If gate passes + sanity-check (all critical/major addressed, nothing original got right is broken, DECLINED decisions reasonable) → apply to disk.

## 6. Loop (for critical or complex code)

Max 2 loops. Round 2 review runs only when an Accepted fix changed code in a way that could introduce a new defect — not for mechanical fixes (unused import, typo) and never to re-polish wording. Fix-then-rerun checks (tests / type-check / build per Accepted finding) are separate and always run. Stop when final review + tests are both clean. Full discipline in `review-setup.md § Closeout discipline`.

## 7. Write the report

Per [`../report-template.md`](../report-template.md). Path: `docs/forsvn/artifacts/meta/records/[YYYY-MM-DD]-fresh-eyes-<slug>.md` — dated, immutable, never overwritten.

## 8. Deliver

**Verdict** (PASS / FIXED / CRITICAL) · **issue count** (X found, Y fixed, Z declined) · **key fix** (most important catch) · **path to report**.

## Configuration

| Parameter | Default | Description |
|---|---|---|
| model | sonnet | Reviewer + resolver model |
| max_loops | 1 | Auto-set to 2 for critical/complex code |
| severity_threshold | minor | Minimum severity to fix (minor / major / critical) |
| auto_apply | true | Apply fixes automatically or show diff first |
| thorough | false | Force specialist dispatch (auto-escalates regardless) |

Override examples: "review this with opus" / "do 2 rounds of verification" / "review this thoroughly".
