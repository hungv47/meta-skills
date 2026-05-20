---
title: Extract-Service — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: extract-service
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** the critic-agent fires (Step 6 in the Dispatch Protocol), or any moment the orchestrator is about to apply a change that smells off — extracting at one caller, a service that needs a branching flag, two callers in one step, domain logic sliding into the service. Re-read at every doubt.

---

## Failure mode catalog

| Anti-Pattern | Problem | INSTEAD |
|--------------|---------|---------|
| Extracting at one caller | Premature abstraction — a "service" with a single caller is just an indirection. The interface is guessed, not derived from real variation. | G6: wait for the second real caller. One caller → `NEEDS_CONTEXT`, recommend not extracting. |
| The flag-bag service | The service takes `mode`/`callerType`/`legacy` params and `if`s on them — both callers' branches now live inside one function. The duplication moved; it did not leave. | G7: a param carries *data* (url, id, timeout), never a *branch*. If callers differ in behavior, that difference stays in the callers. |
| Domain logic in the service | The service decides *which* resource or *whether* to act — it encodes a business rule. Now the rule has one home but the wrong one, and every caller is coupled to it. | G7: extract only the *how*. The *why/when* stays in the caller. See [`service-layer-pattern.md`](service-layer-pattern.md). |
| Batch migration | "These five callers are identical, migrate them together." One red verification and you cannot tell which caller broke. | G2: one caller per step, verify between. Identical callers still migrate as separate verified steps. |
| Pushing past a red step | A verification failed; the agent debugs forward instead of reverting. The rollback signal is now polluted. | Stop on red. Revert that one caller, halt the loop, report. Remaining callers stay PENDING. |
| Silent drift normalization | The scan found caller 3 swallows an error; the migration "fixes" it to match caller 1. That is a behavior change shipped as a refactor. | Preserve each caller's current behavior exactly. A drift fix is a *separate, flagged, operator-approved* change — never folded into the migration. |
| Scope creep in a touched caller | Renaming, reformatting, or fixing an unrelated bug while migrating a caller. | Extraction only. Everything else is a separate commit. (G2) |
| Editing the *why/when* | "Improving" the caller's decision logic while swapping the mechanics block. | Only the mechanics block is swapped. The caller's decision/orchestration code stays byte-for-byte. |
| Extracting without test coverage | No test exercises the caller — behavior preservation cannot be verified. | Migrate with typecheck + build, flag the caller for manual verification, `DONE_WITH_CONCERNS`. Or write tests first. |
| Prophylactic generality | Designing the service interface for callers that do not exist yet. | Design for the N callers in the scan. A future caller can widen the interface when it actually arrives. |
| Bypassing the approval gate | Migration-agent runs before the operator confirmed the plan. | No code is edited until the operator answers `y`. `N` → ship the plan-only artifact, `DONE`, stop. |

## When NOT to extract (exit conditions)

The skill stops in these situations:

- **One caller** — nothing to deduplicate. Wait for the second real caller (G6).
- **The repeat is domain logic** — two blocks that look alike but encode different *why/when* are two policies, not one service. Extracting forces a flag-bag.
- **No test coverage AND behavior matters** — you cannot verify preservation. Write tests first.
- **The mechanics are still changing fast** — extracting a moving target means re-designing the interface constantly. Let it settle.
- **Code that won't change again** — the duplication costs nothing if nobody will touch it; the extraction does not pay off.

## When the critic FAILs

The critic-agent identifies the specific caller or design flaw that violated a Critical Gate. Action:

1. **Behavior change in a caller (G1) / red step (G4)** → revert that specific caller (not the whole session). Re-run its verification.
2. **Flag-bag / domain logic in the service (G7)** → re-dispatch planner-agent with the critic's feedback to redesign the interface; the affected callers re-migrate against the corrected service.
3. **Batched callers (G2)** → revert the batch, re-migrate one caller at a time with verification between.
4. If a clean revert is not possible (the migration left the tree in a state no single revert fixes) → `BLOCKED`. Surface for the operator with the backup commit sha for a full reset.

Never silently bypass a critic FAIL — the 8 gates are the safety contract.
