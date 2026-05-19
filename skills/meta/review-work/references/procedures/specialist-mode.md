---
title: Fresh-Eyes — Specialist Dispatch Mode (--thorough)
lifecycle: canonical
status: stable
produced_by: fresh-eyes
load_class: PROCEDURE
---

# Specialist Dispatch Mode

**Load when:** operator passed `--thorough`, OR auto-escalation triggered per the rules below. Replaces the single generalist reviewer (per [`reviewer.md`](reviewer.md)) with 3 specialist reviewers running in parallel.

---

## Specialist roles

| Specialist | Focus | What it catches that generalists miss |
|---|---|---|
| **Security reviewer** | Auth bypasses, injection (SQL/XSS/command), secrets exposure, access control gaps, input validation | Deep knowledge of attack patterns — doesn't just check "is there auth?" but "can the auth be bypassed?" |
| **Performance reviewer** | N+1 queries, unbounded loops, missing pagination, memory leaks, caching strategy | Traces data flow through the call stack looking for scale problems |
| **Correctness reviewer** | Logic errors, edge cases, race conditions, error handling, type safety | Reads the code as a state machine — "what happens if X is null AND Y fails?" |

## Dispatch procedure

1. **Spawn all 3 in parallel** with the same code + requirements. Each specialist uses the same prompt structure as the generalist reviewer (per [`reviewer.md`](reviewer.md)), but the "Review for:" block is replaced with the specialist's narrow focus. For example, the security reviewer gets:
   ```
   Review ONLY for: auth bypasses, injection (SQL/XSS/command), secrets exposure,
   access control gaps, input validation. Ignore style, naming, and performance.
   ```
   The structured output schema + confidence rules + signal-vs-noise verification stay identical so findings can be mechanically merged.

2. **Each returns findings** in the standard format: SEVERITY + CONFIDENCE + LOCATION + PROBLEM + FIX. Verdict per specialist: PASS / ISSUES_FOUND / CRITICAL.

3. **Merge and deduplicate.** Same location + same problem = one finding; keep the higher CONFIDENCE. If specialists disagree on severity, take the higher (a security MAJOR overrides a correctness MINOR for the same line). If two specialists flag the same line with different problems, keep both — they're orthogonal concerns.

4. **Aggregate verdict.** If ANY specialist returned CRITICAL → overall verdict CRITICAL. If ANY returned ISSUES_FOUND and none CRITICAL → overall ISSUES_FOUND. All three PASS → overall PASS.

5. **Proceed to resolver** with the merged findings. The resolver (per [`resolver.md`](resolver.md)) doesn't need to know which specialist found which issue — the structured output is sufficient.

## Auto-escalation triggers (without operator request)

The orchestrator escalates to specialist dispatch automatically — operator does NOT have to type `--thorough` — when ANY of:

- Code modifies auth, sessions, or access control
- Code handles payments or financial data
- Code performs database migrations or bulk data mutations
- Code processes PII or sensitive user data
- Total diff exceeds 500 lines (sum of all files changed, not per-file)

These triggers fire BEFORE the reviewer prompt is constructed. If any trigger matches, the orchestrator skips the generalist path entirely and dispatches all 3 specialists.

## Cost

3× single-reviewer cost (~$0.30-0.50 per round at sonnet). Still cheap relative to catching a production bug — the cost asymmetry that justifies fresh-eyes generally is even sharper for the surfaces specialist mode targets.

## When NOT to use specialist mode

- **Trivial changes** that nonetheless touch one of the auto-trigger keywords by accident (e.g., a comment mentioning "auth" in a doc edit). Use judgment — the auto-triggers are heuristics, not laws.
- **Pure architecture/design review** (no code yet) — the specialist focus areas don't map cleanly to design artifacts. Use the generalist reviewer's architecture variant per [`reviewer.md`](reviewer.md) §"Architecture/design-review variant".
- **Operator explicitly says "quick review"** — they've signaled they want speed over rigor. Respect it; don't escalate.

## Anti-pattern: specialist consensus filtering

Don't filter findings by "did 2 of 3 specialists agree." A security specialist may catch an auth bypass that the performance + correctness specialists missed entirely — agreement is NOT the signal here. Each specialist is authoritative in their lane; merge their unique findings, don't intersect them.
