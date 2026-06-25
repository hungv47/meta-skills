# Nightly marketing-audit routine — operator guide

A "0.1% less slop, proven, every night" loop for FORSVN's own marketing artifacts. A cloud cron
agent runs [`MARKETING-AUDIT-ROUTINE.md`](MARKETING-AUDIT-ROUTINE.md) overnight and opens **one**
PR when it finds a verified copy win. No win → no-op. It **ships DISABLED** — the gate is the whole
point, and flipping it on is a deliberate operator act after the checklist below clears.

## The pieces (all in the forsvn repo)

| File | Role |
|---|---|
| `routines/MARKETING-AUDIT-ROUTINE.md` | the nightly instructions the cron agent reads (gated, one change, PR-only) |
| `scripts/audit-guard.ts` | refuse-before-mutate pre-flight: the 4-part gate + clean-tree + the scope-escape `--assert-diff` |
| `scripts/audit-ledger.ts` | validate-and-append + `recently-tried` query for the compounding ledger |
| `.forsvn/slop/config.json` | gate config (`gate_enabled`, `lookback_days`, `precision_floor`) |
| `.forsvn/slop/audit-ledger.tsv` | committed compounding state — every nightly attempt |

## Gate-flip checklist (all four must hold before flipping `gate_enabled`)

The routine is a **guaranteed no-op** until ALL of these hold (re-checked every run — a regression
auto-re-gates). Verify with `bun forsvn-slop/scripts/audit-guard.ts --json` (a gated run names the
first missing piece):

1. **Engine landed** — `forsvn-slop/scan.ts` + `registry/antipatterns.mjs` + `finding.mjs` present (FOR-50/51). ✅ today.
2. **Precision proven** — drop `.forsvn/slop/golden-report.json` with `{ "precision": ≥ floor, "falsePositives": 0, "asOf": "YYYY-MM-DD" }` from the golden corpus run (FOR-51). The default floor is `0.95`.
3. **Override ledger live** — `.forsvn/learning/verdicts.tsv` exists (the review loop has produced decisions).
4. **Operator switch** — set `gate_enabled: true` in `.forsvn/slop/config.json` AND `touch .forsvn/slop/GATE`. This is your final manual switch, made only after 1–3 hold.

Pairs with the S6 critic calibration (operator runs `calibrate-critic.ts`) — both are the remaining
quality-gate activations after the deterministic + advisory build.

## Schedule (cloud cron, staggered)

Create via the `/schedule` skill — one routine, **NOT** auto-created here. Stagger it after the perf
crons (01:00–03:00) so they don't contend:

| Routine | Time (local) |
|---|---|
| marketing-audit (forsvn) | 03:30 |

The cron `cd`s into the forsvn repo and reads `MARKETING-AUDIT-ROUTINE.md`. Exact time verified during rollout.

## Guardrails (non-negotiable)

- One change per night; the densest single deterministic rule on one artifact; smallest diff.
- **PR only — never push to or merge `main`.** A human triages in the morning via `/forsvn:review`.
- Ships only if `densityPer1k` strictly improves **and** the Post-Humanize Regression Check passes
  (facts preserved, NOT byte-identity; critic not regressed).
- No-op nights are successes. Don't manufacture churn.
- **Artifacts-only, deterministic-tier-only.** Marketing artifacts under
  `docs/forsvn/artifacts/marketing/` only — never `forsvn-landing` (a separate repo), `canonical/`,
  `skills/` code, or any `.forsvn/` path beyond the ledger. Never the `llm` advisory tier (voice is
  human-only). The `--assert-diff` allowlist enforces the scope before any PR.
