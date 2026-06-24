---
title: Audit-Marketing — re-verify exit gate
lifecycle: canonical
status: stable
produced_by: audit-marketing
load_class: PROCEDURE
---

# Re-verify gate — accept a fix only if it strictly improved AND weakened nothing

The single hardest invariant in the whole skill. Authority is asymmetric (slop-detector §2.1): **one confident wrong "fix" that quietly weakens a claim destroys trust permanently**, while a missed slop tell is cheap. So the gate is conservative-by-construction: **revert on ANY doubt, never "probably fine."** This FP-suppression conservatism is the moat.

Applied after each fixer run in [`polish-flow.md`](polish-flow.md) step 5, to the section the fixer touched.

## The three checks — ALL must pass

**(a) Strict score improvement + no regression.** Re-run the scanner on the fixed artifact:
```bash
bun skills/forsvn-slop/scan.ts <artifact> --json
```
Compute the severity-weighted score `S = 3·block + 2·warn + 1·nit` across the artifact.
- `S_after` is **strictly less than** `S_before`, AND
- the specific firing `antipattern` the fixer targeted is **gone**, AND
- **no NEW finding** appeared (any id not present before). A fixer that removes one tell but introduces another (e.g. humanmaxxing adds a staccato tagline) is **net-negative or net-zero → revert.** The gate measures the delta over the whole artifact, not just the targeted rule.

**(b) Post-Humanize Regression Check** ([`_shared/quality-feedback-protocol.md`](_shared/quality-feedback-protocol.md) — the 5 required checks, read directly, do not re-author):
1. Named entities / product names / URLs / legal disclaimers / numbers / prices / dates / claims / citations **unchanged**.
2. Specificity did not drop — concrete mechanisms, proof points, audience details remain.
3. CTA and deliverable format **unchanged**.
4. Compression did not remove mandatory caveats or substantiation.
5. If the original had a critic score / rubric pass, the fixed output still satisfies the same pass/fail gate.

Operationally: assert `protected_tokens ⊆ post-fix tokens` (re-extract numbers/URLs/entities/CTA verb-phrases from the fixed section and confirm the pre-fix set survives). **The load-bearing line: never accept a smoother rewrite that weakens the underlying argument or factual contract.**

**(c) Original critic gate.** If the audited artifact had a critic score or rubric pass of its own, it **still passes** after the fix.

## Verdict

- **PASS all three → `accepted_fixed`** (Fixed + Verified). Keep the fix.
- **FAIL any → roll back the SECTION** the fixer touched (section-scoped, so one bad fix doesn't discard good fixes made in the same round) and re-state the finding **`accepted_deferred` — "Attempted, Rolled Back."** Record it in the report's Changes Made + Deferred.

## Bounds

- **Max 2 rounds** (a hard cap). A draft that won't clean after 2 rounds is flagged for the operator as a possible structural problem (no spine / no proof the fixers can't synthesize), not looped indefinitely → Completion DONE_WITH_CONCERNS.
- A **denylist** finding (`mkt-claim-fabricated-precision` / locked-brand-token analog) still unresolved after 2 rounds → Completion **BLOCKED**.
- The gate never writes `decision_state: approved` and never appends to `verdicts.tsv` — the fixed artifact lands `decision_state: pending` for `/forsvn:review`.
