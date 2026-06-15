# Worked Example — Fresh-Eyes Review Cycle (standard mode, auth diff → CRITICAL → FIXED)

> Illustrative end-to-end run. Synthetic diff and findings. Shows the full review-work loop: auto-trigger → reviewer (no implementation context) → Layer 1 real-vs-fake → Layer 2 noise-filter → the **severity rubric + quantitative verdict gate** (`references/noise-filter.md`) → resolver fix-then-rerun → report. The point is that the verdict is *computed from severity counts*, not from prose impression.

---

## Operator invocation

```
review-work "session-cookie refactor on feat/session-hardening (3 files, ~140 lines)"
```

Auto-trigger note: the diff touches `auth/session.ts` (session + cookie handling) → review-work **auto-escalates to `deep`-eligible** per Critical Gate 4, but the diff is < 500 lines and single-domain, so it resolves to **`standard`** (generalist reviewer + resolver loop). Security risk is material → the reviewer is told the scope is "security + correctness," not "general closeout."

## Inputs the reviewer receives (NO implementation reasoning)

- The diff (output only) + the requirement: *"Sessions must expire server-side after 24h; cookies must be `HttpOnly`, `Secure`, `SameSite=Lax`; logout must revoke server-side."*
- `docs/forsvn/artifacts/meta/records/learned-rules.md` (appended to reviewer CONTEXT).
- No access to the author's commit messages or rationale (Critical Gate 1).

## Round 1 — reviewer surfaces 4 candidate findings

| # | Candidate | Layer 1 (real-vs-fake) | Layer 2 (noise-filter) |
|---|---|---|---|
| 1 | `expiresAt` computed but never checked on read — expired sessions still authenticate | real | Accepted (in security scope) |
| 2 | Cookie set without `Secure` flag on the login path | real | Accepted (in scope) |
| 3 | Logout clears the client cookie but never deletes the server-side session row | real | Accepted (in scope) |
| 4 | "Consider renaming `s` to `session` in the helper" | real-but-trivial | Rejected (`rejected_not_worth_it` — pure preference, no falsifiable cost) |

A 5th candidate ("the JWT lib might be outdated") was dropped at **Layer 1** (`rejected_not_real` — no JWT in this diff; hallucinated) and never reaches the report.

## Severity assignment (per `noise-filter.md` § Severity rubric)

| Finding | Severity | Why |
|---|---|---|
| #1 expired sessions still authenticate | **Blocker** | Failing acceptance criterion + auth bypass (exploitable). |
| #3 logout doesn't revoke server-side | **Blocker** | Failing acceptance criterion + session-fixation surface. |
| #2 missing `Secure` flag | **Major** | Wrong behavior on a supported (production-TLS) path; no test catches it. |
| #4 rename `s` | Nit | Style, no falsifiable cost → suppressed to Rejected. |

## Quantitative verdict gate (round 1, pre-fix)

```
unresolved Blockers = 2   → ≥ 1  → CRITICAL (auto-fail the PASS gate)
unresolved Majors   = 1
reviewer confidence on each Accepted = 9/10  (≥ 5/10 floor cleared)
noise gate: 3 substantive findings, ≥1 Blocker → not nit-padded → no collapse
```

**Round-1 verdict: CRITICAL.** Per the gate, CRITICAL cannot downgrade to PASS without a logged critic override — and an override never converts a Blocker to resolved. So the resolver must actually fix the Blockers.

## Resolver — fix-then-rerun (round 2)

The resolver sees BOTH the original diff AND the review (Critical Gate 2), and synthesizes fixes:

1. **#1** — add the `expiresAt < now()` check on the read path; reject + clear on expiry. Rerun: `bun test auth/session.test.ts` (added an expired-session case) → **pass**.
2. **#3** — `logout()` now deletes the server-side row before clearing the cookie. Rerun: logout integration test (revocation asserted) → **pass**.
3. **#2** — `Secure` + `SameSite=Lax` added to the cookie options. Rerun: type-check + the cookie-options unit test → **pass**.

All three Accepted findings reach `accepted_fixed` (`Fixed + Verified`). No rollback. Max-2-loops respected (1 review + 1 resolve).

## Quantitative verdict gate (round 2, post-fix)

```
unresolved Blockers = 0
unresolved Majors   = 0
started with ≥ 1 Accepted Blocker/Major, all cleared their rerun
→ verdict = FIXED
```

## Self-Regulation Gate

Not fired — the resolver's changes stayed within the stated security+correctness scope; no change touched > 10 unrelated files; no scope creep into a redesign.

---

## Produced artifact

`docs/forsvn/artifacts/meta/records/2026-06-13-fresh-eyes-session-hardening.md`

```markdown
---
skill: review-work
produced_by: review-work
version: 1
date: 2026-06-13
status: done
mode: standard
rounds: 2
verdict: FIXED
provenance:
  reviewed: feat/session-hardening (auth/session.ts, auth/cookie.ts, auth/logout.ts)
  requirement: "24h server-side expiry; HttpOnly+Secure+SameSite=Lax; server-side logout revocation"
  input_artifacts:
    - docs/forsvn/artifacts/meta/records/learned-rules.md
---

# Fresh-Eyes Review — session-hardening

## Verdict
**FIXED** — 2 Blockers + 1 Major found and resolved; reruns verified. (Round-1 verdict was CRITICAL.)

## Issues Found

### Accepted (fixed)
- [Blocker] **Expired sessions still authenticate** — `expiresAt` was set but never checked on read. **Fix:** reject + clear on `expiresAt < now()`. **Verified:** `bun test auth/session.test.ts` (expired-session case) ✓
- [Blocker] **Logout does not revoke server-side** — only the client cookie was cleared. **Fix:** delete the session row before clearing the cookie. **Verified:** logout integration test ✓
- [Major] **Cookie missing `Secure`** — set without `Secure`/`SameSite`. **Fix:** `HttpOnly+Secure+SameSite=Lax`. **Verified:** type-check + cookie-options unit test ✓

### Rejected (filtered as noise)
- **Rename `s` → `session`** — _suppressed: pure preference, existing name unambiguous in context._

### Deferred (real but out-of-scope for this pass)
- _None._

## Input Quality
Requirement was explicit (3 acceptance criteria) — enabled criterion-level verdicts. No clarification needed.

## Scope Drift
None — every change traces to one of the 3 acceptance criteria.

## Simplifications
None proposed; the diff was already minimal.

## Changes Made
3 fixes across `auth/session.ts`, `auth/cookie.ts`, `auth/logout.ts`; 3 reruns passed.

## Self-Regulation Gate
Not fired.

## Reviewer Summary
Reviewer (no implementation context) caught 2 auth-bypass Blockers the author's self-review would likely have rationalized away. The quantitative gate forced CRITICAL until the Blockers actually cleared their reruns.

## Resolver Notes
Synthesized from original + review; no patch-over-symptom; each fix is verified by its own rerun, not by intuition.
```

---

## Completion status

**DONE** — all findings resolved + verified; PASS gate met after the fix-then-rerun loop (verdict FIXED). Had a Blocker remained unresolved, the gate would have held the verdict at **CRITICAL** and returned `BLOCKED` for operator judgment (Critical Gate / auto-fail), never a silent PASS.
