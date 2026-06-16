# Dispatch Mechanics — extract-service

Loaded at the multi-agent dispatch entry. Covers the agent roster, execution layers, dispatch protocol, routing rules, and the Single-Agent Fallback path.

## Agent Roster

| Agent | File | Focus |
|-------|------|-------|
| scanner-agent | `agents/scanner-agent.md` | Finds the repeated operational mechanics; classifies shared *how* vs caller-resident *why/when*; enumerates every caller |
| planner-agent | `agents/planner-agent.md` | Designs the service interface (explicit params, structured returns); produces the stepwise caller-by-caller migration plan |
| migration-agent | `agents/migration-agent.md` | Executes the approved plan: extract block → replace one caller → verify → next; stops on first red |
| critic-agent | `agents/critic-agent.md` | 8-gate compliance, per-caller behavior preservation, service-design quality |

## Execution Layers

```
Layer 1:
  scanner-agent ──────────── locate repeated mechanics, classify layers, list callers

Layer 2 (sequential):
  planner-agent ──────────── design service interface + migration plan
    → ── OPERATOR-APPROVAL GATE ── [y/N] before any code edit ──
      → migration-agent ───── extract block; migrate caller 1 → verify → caller 2 → verify → …

Layer 3:
  critic-agent ───────────── 8-gate review of the completed migration
```

## Dispatch Protocol

1. **Scan** — dispatch `scanner-agent` on the Pre-Dispatch target. It returns the repeated-mechanics block, the *how*/*why-when* split, and the full caller list. If <2 callers → `NEEDS_CONTEXT` (G6), stop.
2. **Baseline check** — run the test suite + build once. Red → `BLOCKED` (G8), stop.
3. **Plan** — dispatch `planner-agent` with the scan. It returns the service interface design + the ordered, per-caller migration plan with a verification step per caller.
4. **Operator-approval gate** — present the full plan; ask `Apply this migration? [y/N]`. `N`/no response → write the plan-only artifact, `DONE`, stop.
5. **Migrate** — dispatch `migration-agent`. It creates the backup commit, extracts the service block, then migrates callers **one at a time**, running the verification step after each. First red → revert that caller, stop, report.
6. **Critic review** — dispatch `critic-agent` on the completed migration. FAIL → revert the specific offending caller per [`../anti-patterns.md`](../anti-patterns.md), re-run verification.
7. **Assembly** — compile the migration report per [`../report-template.md`](../report-template.md). Save to the flat v2 path declared in SKILL.md § Artifact Contract.

## Routing Rules

| Condition | Route |
|-----------|-------|
| Scanner finds <2 callers | `NEEDS_CONTEXT` — recommend not extracting (G6); stop |
| Baseline test/build red | `BLOCKED` (G8); stop |
| Operator answers `N` at the approval gate | Write plan-only artifact; `DONE`; stop |
| Per-caller verification fails | Revert that caller; stop; remaining callers stay un-migrated |
| Critic PASS | Assemble report; deliver |
| Critic FAIL | Revert the specific offending caller; re-run verification |
| Callers remain after a session | Artifact records migrated vs pending; a follow-up run resumes |

## Single-Agent Fallback

Used when mode-resolver downgrades to `fast` (≤3-caller scope or `--fast` flag):

1. Skip multi-agent dispatch.
2. Scan the target — confirm ≥2 callers (G6) and a green baseline (G8).
3. Design the service interface and write the migration plan.
4. **Operator-approval gate still fires** — show the plan, get `[y/N]`.
5. Create the backup commit; extract the block; migrate callers one at a time, verifying after each.
6. Self-review against all 8 Critical Gates.
7. Save the artifact.

The 8 Critical Gates + the operator-approval gate fire in fallback mode regardless — the safety contract is mode-independent.
