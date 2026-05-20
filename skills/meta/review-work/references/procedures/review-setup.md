---
title: Review-Work — Setup (target detection + concurrent tests)
lifecycle: canonical
status: stable
produced_by: review-work
load_class: PROCEDURE
---

# Review Setup

**Load before Step 1.** Two pre-review setup moves the orchestrator runs before spawning the reviewer: (1) detect the review target from git state, (2) launch the test suite concurrently so it runs while the reviewer thinks. Brief 06 § Review Workflow names both as first-class capabilities.

---

## § Target detection

Don't assume "diff against main." Detect what to review from git state, then confirm with the operator.

**Procedure:**

1. **Is this a git repo?** `git rev-parse --is-inside-work-tree 2>/dev/null`. If not → there is no git target; use the operator-supplied paths/paste from Step 1 and skip the rest of this section.

2. **Read three signals:**
   - `git status --porcelain` — uncommitted (staged + unstaged + untracked) changes?
   - `git branch --show-current` — current branch name.
   - Base branch — first of `main`, `master`, or the remote default (`git symbolic-ref refs/remotes/origin/HEAD`) that exists.

3. **Classify — pick the first match:**

   | Git state | Detected target | Diff command |
   |---|---|---|
   | Uncommitted changes present | **Working-tree changes** — "what you just wrote" | `git diff HEAD` + list untracked files (`git status --porcelain` `??` rows) |
   | Clean tree, on a non-base branch with commits ahead of base | **Branch vs base** — PR-style review | `git diff <base>...HEAD` |
   | Clean tree, on the base branch | **Last commit** — a single committed change | `git show HEAD` |
   | Detached HEAD, no base found, or shallow/ambiguous | **Ambiguous** | none — ask the operator what to review |

4. **Surface the detection for confirmation.** Never review silently against a guessed target. State the detected target in one line and let the operator correct it — same `[adjust?]` pattern as the Pre-Dispatch Warm Start:
   ```
   Detected review target: working-tree changes (8 files, uncommitted) — review these? [Y / branch / commit / specify]
   ```

5. **Risk-class auto-detection is unchanged** — it runs on the *detected diff* (auth/payments/PII/migrations keywords, >500-line size) per `specialist-mode.md § Auto-escalation triggers`. Target detection picks *what* to review; risk detection picks *how hard*.

**Anti-pattern:** hardcoding `git diff main...HEAD`. A dirty working tree with uncommitted work is the most common review case — `main...HEAD` misses it entirely.

---

## § Concurrent test execution

Brief 06: "run tests and review in parallel where practical." Don't make the reviewer wait on a slow suite; don't make the suite wait on the review. Launch them together.

**Procedure:**

1. **Detect the test command** (first match, do not guess beyond this list):
   - `package.json` `scripts.test` → `<pkg-manager> test` (Bun default per repo convention; respect a lockfile that says otherwise)
   - `Makefile` with a `test:` target → `make test`
   - `pyproject.toml` / `pytest.ini` / `tox.ini` present → `pytest`
   - `Cargo.toml` → `cargo test`; `go.mod` → `go test ./...`
   - None of the above, or the command is unknown → **skip** this section. "Where practical" — review proceeds test-less; note "tests not auto-detected" in the report.

2. **Launch in the background** at the same time the reviewer (or specialists) is spawned — use a background Bash run so the suite executes concurrently with the review, not before or after it. Scope the run to the detected target's files where the runner supports it; otherwise run the whole suite.

3. **Collect when the reviewer returns.** By the time the reviewer's findings are back, the suite has usually finished. Read its result:
   - **Tests fail** → each failure enters the finding set as a CRITICAL-or-MAJOR finding (a failing test is a real, actionable defect — it bypasses the noise filter's Layer 1). The resolver sees them alongside the reviewer's findings.
   - **Tests pass** → record "test suite: PASS (`<command>`)" in the report's Verdict section.
   - **Suite still running / timed out** → don't block delivery; note "tests inconclusive — still running at report time" in the report and let the operator rerun.

4. **The fix-then-rerun loop is separate.** This section runs the suite *once, concurrently, for situational awareness*. After the resolver applies fixes, `noise-filter.md § Fix-then-rerun protocol` reruns the *relevant* checks to verify each Accepted finding — that is the gating rerun. Concurrent launch is the cheap up-front signal; fix-then-rerun is the verification gate.

**Anti-pattern:** blocking the reviewer dispatch on test completion. The whole point is overlap — if the suite takes 4 minutes, the reviewer should be 4 minutes into its work by the time results land, not idle.

**When NOT to run tests concurrently:** reviewing a non-code artifact (copy, a design doc, a plan); a destructive or side-effecting test suite (hits a real database, sends mail, costs money) — flag it to the operator instead of launching it; the operator said "quick review."
