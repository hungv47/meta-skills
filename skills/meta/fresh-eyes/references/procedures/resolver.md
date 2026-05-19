---
title: Fresh-Eyes — Resolver Agent Procedure
lifecycle: canonical
status: stable
produced_by: fresh-eyes
load_class: PROCEDURE
---

# Resolver Agent Procedure

**Load when:** Step 4 of Execution — spawning the resolver agent (only if Step 3 evaluation produced ISSUES_FOUND or CRITICAL). The resolver sees BOTH the original implementation AND the reviewer's full output — this asymmetric information is the load-bearing design choice. The reviewer is structurally constrained from rationalizing; the resolver synthesizes from both sides.

---

## Agent config

- `model: "sonnet"` (match the reviewer's model — don't mix)

## Resolver prompt template

```
You are a senior engineer resolving code review feedback. You have two inputs:

1. ORIGINAL CODE:
{the original implementation}

2. REVIEW FEEDBACK:
{the reviewer's full response}

Your job:
- Fix every issue marked "critical" or "major"
- Fix "minor" issues unless the fix would add complexity disproportionate to the benefit
- Apply simplifications where the reviewer's suggestion is genuinely simpler
- Ignore "nit" level feedback unless trivial to address
- Issues marked AUTO_FIX (confidence 9+, severity minor/nit) should be fixed without discussion
- Issues marked ASK should be fixed but flagged clearly so the orchestrator can present them to the user
- Do NOT introduce new features or refactor beyond what the review requested

For each issue, either:
- FIXED: {show the fix}
- DECLINED: {explain why the reviewer's suggestion doesn't apply or would make things worse}

Then output the COMPLETE corrected code/output — not a diff, the full thing.
The orchestrator will use this to replace the original.

Write your response directly — do not write to any files.
```

## Why COMPLETE output, not a diff

The orchestrator applies the resolver's output by overwriting the original file. A diff would require the orchestrator to apply it carefully (3-way merge, conflict detection); a complete output makes the apply step mechanical. The resolver IS being asked to commit to a final state — partial outputs invite "I'll patch it later" thinking that the resolver should NOT have.

## Self-regulation gate (orchestrator-side, not resolver-side)

After the resolver returns its output, the orchestrator (NOT the resolver) checks:

- **Did the resolver modify >30% of the original artifact?** If yes → STOP and flag: "This artifact may need a redesign rather than incremental fixes."
- **Did the resolver address >10 findings in a single pass?** If yes → STOP: too many changes at once increases regression risk.
- **Did the resolver's output introduce new issues that the reviewer didn't find in the original (regression)?** If yes → STOP: "The resolver is making things worse."

If any of these trigger, the orchestrator does NOT apply the resolver output. Instead it flags to the operator with the gate trigger named. This is the safety floor — it bounds the loop from grinding indefinitely on a fundamentally-broken artifact.

## When DECLINED is the right call

The resolver should DECLINE a finding when:

- The reviewer's suggested fix would introduce a worse problem (e.g., catching an "unused import" finding by deleting an import the test file actually needs)
- The reviewer's "issue" is actually a deliberate design choice the codebase documents elsewhere
- The fix exists already under a different name or location (reviewer missed it during the signal-vs-noise check)
- The reviewer's confidence was 5-7 ("UNCERTAIN — may be a false positive") and inspection confirms it IS a false positive

DECLINED is NOT a way to dodge work. If a critical/major finding is genuinely real, the resolver fixes it even if the fix is hard. DECLINED is reserved for findings that are wrong-on-the-merits, not findings that are inconvenient.

## Orchestrator's sanity check before applying

After self-regulation gate passes:

- Did the resolver address all critical/major issues?
- Did the resolver break anything the original got right?
- Are any "DECLINED" decisions reasonable?

If all three pass → apply to disk. Otherwise → flag to operator with the specific concern.
