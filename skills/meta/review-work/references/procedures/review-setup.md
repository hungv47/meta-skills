---
title: Review-Work — Setup & Closeout (target detection · format · concurrent tests · rerun discipline)
lifecycle: canonical
status: stable
produced_by: review-work
load_class: PROCEDURE
---

# Review Setup & Closeout

**Load before Step 1.** The setup and closeout moves the orchestrator runs around the review: (1) detect the review target from git state, (2) format the target before dispatch when formatting can move lines, (3) launch the test suite concurrently so it runs while the reviewer thinks, and (4) apply closeout discipline — rerun only what an accepted fix changed, and stop when the result is clean. Brief 06 § Review Workflow names these as first-class capabilities of a practical closeout.

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

---

## § Closeout discipline

Target detection and concurrent tests get the review *started* cleanly. Closeout discipline keeps it from *grinding* — it decides when to format, when to rerun, and when to stop. Brief 06 § Review Workflow frames the closeout sequence as: format, review, fix accepted findings, rerun what those fixes touched, stop when clean.

**Procedure:**

1. **Format before the reviewer is spawned — when formatting can move lines.** If the detected target is uncommitted working-tree changes and the project has an autoformatter (`prettier`, `ruff format`, `gofmt`, `cargo fmt`, a `Makefile` `fmt:` target), format *before* dispatch. Rationale: a formatter run *after* review invalidates every line number the reviewer cited and forces the resolver to fight whitespace diffs. Format first → the reviewer cites stable lines → the resolver patches logic, not layout.
   - Because this rewrites the operator's uncommitted files, surface it for confirmation alongside the target-detection line — never run it silently:
     ```
     Detected formatter: `prettier` — format the 8 changed files before review so findings cite stable lines? [Y / skip]
     ```
   - **Skip** when: the target is an already-committed diff (formatting it means a new commit — out of scope for a review), no formatter is detected, or the operator said "quick review." On skip, note "not formatted" in the report.
   - On `Y`, record the formatter command in the report's Commands Run section.

2. **Rerun discipline — rerun the *review*, not just the tests, only when accepted findings changed code.** Two reruns are distinct and must not be conflated:
   - **Fix-then-rerun (mandatory)** — `noise-filter.md § Fix-then-rerun protocol` reruns *tests / type-check / build* for every Accepted fix. This always runs; it is the verification gate.
   - **Second review round (gated)** — a full Step 6 review pass over the resolver's output runs **only if** an Accepted fix changed code in a way that could introduce a *new* defect: logic edits, control-flow changes, new branches. Do **not** open a second review round when every finding was `rejected_not_worth_it` / `rejected_not_real` (nothing changed) or the only Accepted fixes were mechanical (removed an unused import, fixed a typo, renamed a local) with no behavior change.
   - Never rerun a clean review to improve the *wording* of the report. A rerun verifies code, not prose (`anti-patterns.md`).

3. **Stop condition.** The review is done when the final review round reports no new findings **and** the concurrent suite (or the fix-then-rerun checks) is green. Write the report and deliver — do not open another round "to be sure." If two rounds have not converged, that is the `Max 2 loops` gate (`anti-patterns.md`), not a license for a third round.

**Do not adopt sandbox / approval bypasses.** The external review skill this closeout protocol draws from ships a "skip the approval prompt" / "bypass the sandbox" helper default. **That default is explicitly rejected here.** It is not portable across operators and conflicts with this repo's safety bar — every command this skill runs (formatter, tests, reruns) goes through the normal permission path. Adopt the *closeout sequence*; never the bypass.

**Anti-pattern:** formatting *after* the reviewer returns — it renumbers every cited line and makes the resolver's diff unreadable. Format before dispatch, or not at all this pass.
