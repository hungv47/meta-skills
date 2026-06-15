---
title: Fresh-Eyes Playbook
lifecycle: canonical
status: stable
produced_by: fresh-eyes
load_class: PLAYBOOK
---

# Fresh-Eyes Playbook

**Worked example:** [`examples/review-cycle-walkthrough.md`](examples/review-cycle-walkthrough.md) — a `standard`-mode review of a real diff: reviewer findings → noise-filter triage → the severity rubric + quantitative verdict gate (`noise-filter.md`) → resolver fix-then-rerun → the report.

## Why this skill exists

The agent that just wrote the code is the worst possible reviewer of it. Sunk-cost bias, mental model contamination, and "I just convinced myself this works" combine to produce a self-review that finds nothing — even when there are real bugs. Fresh-eyes solves this by spawning a reviewer that has NO access to the implementation reasoning. The reviewer sees only the output + the requirements + the surrounding context, then plays "find the bug" against fresh assumptions. Whatever the original author rationalized into existence, the reviewer interrogates from scratch.

The cost of NOT running fresh-eyes is silent: bugs ship, get noticed weeks later in production, and the fix is 10× more expensive. The cost of running it is real but small ($0.10-0.20 per round, sonnet). For security/auth/data-mutation code the asymmetry is even sharper — a single auth bypass shipped costs orders of magnitude more than a thousand specialist-dispatch reviews.

## Methodology

**Reviewer with NO implementation context, resolver with BOTH.** The reviewer is structurally constrained from rationalizing — it can't see the chain of reasoning the implementer used to justify a choice. The resolver, in contrast, sees BOTH the original code AND the review so it can synthesize, not just patch. This asymmetric information design is what makes the loop produce signal instead of theater.

**Reviewer must produce structured output.** SEVERITY + CONFIDENCE + LOCATION + PROBLEM + FIX per finding. Free-form prose can't be triaged — the orchestrator needs to classify findings into AUTO_FIX (confidence 9+, severity minor/nit → resolver applies without asking) vs ASK (everything else → present to operator). Without structure, classification collapses to vibes.

**Confidence rules are load-bearing.** Suppress <5; caveat 5-7 as "UNCERTAIN"; full-weight 8+. The reviewer is explicitly told these rules in its prompt — they exist because a reviewer that doesn't gate by confidence produces a flood of nits + speculation that overwhelms the resolver and trains the operator to ignore the report. The signal-vs-noise verification step ("is this already handled? is this theoretical? would the fix change runtime behavior?") is the second filter on the same problem.

**No critic on a critic.** Fresh-eyes IS a critic by design — it exists to find what the implementer missed. Adding a critic gate on top of the reviewer would be theater (you'd be reviewing the reviewer's review of the implementation). The reviewer-resolver loop IS the critique mechanism; the loop itself is bounded to max 2 rounds because if 2 rounds don't yield clean code, the problem is deeper than review can fix — escalate to operator.

**Mode-resolver maps to scope of review, not depth-of-each-step:** fast = generalist reviewer + skip resolver if PASS (use for minor changes); standard = full reviewer + resolver loop (default); deep = specialist dispatch (3 parallel security/performance/correctness reviewers) or critic-consensus for high-stakes non-code artifacts. The mode reflects how MANY reviewers run, not how thoroughly each one runs — each runs at full depth always.

## Principles

- **Auto-trigger on security/auth/data-mutation/money/PII.** Don't wait to be asked. The cost asymmetry justifies the default-on; the operator can `--skip-fresh-eyes` if they're sure (rare).
- **Specialist dispatch ($0.30-0.50, 3 parallel reviewers) for code with attack surface.** Code modifying auth, sessions, access control, payments, financial data, migrations, bulk mutations, PII, or any diff >500 lines auto-escalates without operator request.
- **Max 2 loops, period.** If reviewer + resolver Round 2 doesn't produce clean code, there's a deeper design problem. Stop and surface to operator instead of grinding a 3rd round.
- **Self-regulation gate before applying.** If the resolver modified >30% of the artifact OR addressed >10 findings in one pass OR introduced new issues that the reviewer didn't find in the original → STOP. Either of these signals means incremental fixes aren't the right shape; the artifact may need a redesign or the resolver is making things worse.
- **The resolver can DECLINE.** When the reviewer's "fix" doesn't make sense or would make things worse, the resolver explicitly DECLINES it with a reason. The orchestrator's sanity-check step adjudicates remaining disagreements; the operator breaks ties only if needed.
- **Scope-drift detection is informational, not blocking.** When `tasks.md` or `spec.md` exists, the reviewer also flags MISSING (requirement not implemented) and UNPLANNED (code change not mapped to a requirement). The operator decides if drift is intentional — fresh-eyes doesn't block on scope.
- **The report is the artifact.** Even on PASS, write the dated report — it's the audit trail. `meta/records/[YYYY-MM-DD]-fresh-eyes-<slug>.md`, lifecycle: snapshot, immutable, never overwritten.

## History / origin

- **v1.0.0 (current):** original reviewer-resolver loop with auto-trigger, max-2-loops, self-regulation gate, specialist dispatch (--thorough), critic-consensus mode, scope-drift detection.
- **Phase 1E+ refactor (May 16, 2026, still v1.0.0):** body trimmed 436 → 202 lines per the v6 program (-53.7%). Long reviewer prompt + long resolver prompt extracted to `procedures/reviewer.md` + `procedures/resolver.md` (verbatim). Specialist dispatch + critic-consensus + scope-drift extracted to dedicated procedure refs. Report template extracted. Edge cases folded into anti-patterns ref. Playbook captures the why (especially the "no critic on a critic" rationale that's load-bearing for future refactor decisions). One additive change in the report-template frontmatter: `version` field now references `{skill-version}` (which currently resolves to 1.0.0) instead of the literal integer 1 baseline used — preserves backwards-compat (old reports parse as version 1; new reports parse as version 1.0.0 string) and improves provenance (operator can tell which skill version produced any historical report). No other behavior change — pure body-diet + chain hardening. No version bump — refactor lands on the meta-skills 2.0 base as a commit, not a release.

## When NOT to use this skill

- **Code refactoring** → `clean-code`. fresh-eyes verifies quality; code-cleanup changes structure. Different shapes.
- **Decision analysis with multiple perspectives** → `debate-agents`. fresh-eyes runs ONE reviewer (or 3 specialists in --thorough mode); agents-panel runs N agents debating.
- **Trivial changes** (typo fixes, log lines, config tweaks) — fresh-eyes overhead exceeds the benefit. Auto-trigger explicitly skips these.
- **Read-only operations** — nothing to break, nothing to review.
- **"Just do it quick"** — operator explicit signal to skip; honor it.
- **Reviewing a review** — recursion. If the user wants to verify a fresh-eyes report, just re-read it; don't run fresh-eyes on fresh-eyes output.

## Further reading

- [`procedures/reviewer.md`](procedures/reviewer.md) [PROCEDURE] — full reviewer agent prompt with structured output schema + confidence rules + signal-vs-noise verification
- [`procedures/resolver.md`](procedures/resolver.md) [PROCEDURE] — full resolver agent prompt with FIXED/DECLINED structure + COMPLETE-output requirement
- [`procedures/specialist-mode.md`](procedures/specialist-mode.md) [PROCEDURE] — Mode --thorough: 3 specialist roles (security/performance/correctness), parallel dispatch, merge-and-dedupe, auto-escalation triggers
- [`procedures/critic-consensus.md`](procedures/critic-consensus.md) [PROCEDURE] — high-stakes non-code artifacts (compliance copy, paid media, launches)
- [`procedures/scope-drift.md`](procedures/scope-drift.md) [PROCEDURE] — MISSING + UNPLANNED detection when tasks.md or spec.md exists
- [`report-template.md`](report-template.md) [PROCEDURE] — output template with frontmatter contract
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes including the critic-on-critic ban
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) [PROCEDURE] — fast/standard/deep semantics for this skill specifically
- [`_shared/quality-feedback-protocol.md`](_shared/quality-feedback-protocol.md) — when to log critic overrides, repeated disagreements, post-humanmaxxing regressions
