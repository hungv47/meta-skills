# Critical Gates — extract-service

Critic-agent verifies all 8 before any change is committed. Gates 1-5 are clean-code's **5 Golden Rules**, inherited verbatim (extract-service edits code → same safety contract). Gates 6-8 are extract-service-specific.

1. **Preserve behavior** — every caller, after migration, produces the same observable behavior. If you can't verify it, don't make the change.
2. **Small incremental steps** — extract one block, migrate **one caller**, verify, then the next. Never batch-migrate callers. Never combine the extraction with a feature change.
3. **Check existing conventions first** — read the codebase's module layout, naming, error-handling, and return-shape patterns. The service layer matches them.
4. **Verify after each caller** — run tests / type-check / build after **every single caller migration**. Red → revert that caller, stop, reassess.
5. **Rollback awareness** — commit before starting; note the hash. Each caller migration is its own revertible step.
6. **Extraction threshold** — do NOT extract for fewer than 2 real callers of the repeated mechanics. One caller → `NEEDS_CONTEXT`, recommend not extracting (premature-abstraction guard).
7. **Two-layer purity** — the service layer holds only the shared *how* (operational mechanics). Orchestration and domain rules — the *why/when* — stay in the callers. No business logic leaks into the service. See [`../service-layer-pattern.md`](../service-layer-pattern.md).
8. **Baseline-green** — if the test suite or build is already failing before any change, return `BLOCKED`. Per-caller verification is meaningless against a red baseline.

## Operator-approval gate (between plan and apply)

The planner-agent's migration plan is shown to the operator IN FULL — the service interface, the caller list, the migration order — and the orchestrator asks `Apply this migration? [y/N]`. **No code is edited until the operator confirms.** `N` / no response → deliver the plan as a `DONE` artifact (plan-only outcome) and stop. This gate is non-negotiable and is not skipped under `--fast`.

## If any Critical Gate fails

The critic identifies the specific caller/change that violated it and recommends reverting that step. Never silently bypass — the gates are the safety contract. Full failure-handling flow: [`../anti-patterns.md`](../anti-patterns.md) "When the critic FAILs."
