---
title: Code-Cleanup — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: code-cleanup
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** the critic-agent fires (Step 6 in Dispatch Protocol), or any moment the orchestrator is about to apply a change that smells off — large batch, behavioral side-effect, untested deletion, convention override. Re-read at every doubt.

---

## Failure mode catalog

| Anti-Pattern | Problem | INSTEAD |
|--------------|---------|---------|
| Behavioral changes disguised as cleanup | Observable output changes — bug introduced, not removed | refactoring-agent verifies same behavior, different structure; any change altering outputs must be a separate commit labeled as a feature/bugfix |
| "Tests pass so it's fine" | Incomplete coverage means passing tests don't guarantee equivalence | validation-agent flags uncovered code for manual verification; report flags DONE_WITH_CONCERNS when coverage gaps exist |
| Combining cleanup with features | One change at a time | safe-removal and refactoring agents never add features; mixed commits get rejected at critic gate |
| Removing "probably unused" code | May be dynamically imported, reflected, or referenced via string keys | dependency-scanner verifies zero imports (static + dynamic via grep on string literals) before flagging; if uncertainty remains, flag in report don't remove |
| Flagging conventions as smells | Existing patterns are intentional unless evidence proves otherwise | code-scanner reads surrounding code before flagging; `.editorconfig` + lint config + observed patterns are authoritative |
| Large batch removals | Can't identify which removal broke something | safe-removal-agent works in small batches, tests between each; max 30 changes/session per the safety gate |
| Refactoring without test coverage | Can't verify behavior preservation | Skip per "When NOT to refactor"; surface gap in report so operator decides whether to write tests first |
| Refactoring during a feature change | Cleanup commits muddy feature commits, makes both harder to review/revert | Wait for feature merge; cleanup gets its own branch |

## When NOT to refactor (exit conditions)

The refactoring-agent skips these situations entirely:

- **No test coverage** — you can't verify behavior is preserved. Write tests first.
- **Tight deadline** — ship first, refactor later.
- **Code that won't change again** — if nobody will read or modify it, the investment doesn't pay off.
- **During a feature change** — separate commits. Always.

## When the critic FAILs

The critic-agent identifies the specific change that violated the golden rules. Action:

1. Revert that specific change (not the whole session).
2. Re-run validation-agent on the smaller batch.
3. If validation passes after revert → log the failed change in the report's "Manual Verification Needed" + DONE_WITH_CONCERNS.
4. If validation still fails → BLOCKED. Pre-existing breakage discovered; surface for operator.

Never silently bypass a critic FAIL — the rules are the safety contract.
