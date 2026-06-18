# Dispatch Mechanics — measure-results

## Graph (sequential)
```
Metric Ingest → Diagnosis → Pack Feedback → Critic ──PASS──▶ commit write-backs
                   ▲                            │
                   └──────── FAIL (1 cycle) ────┘
```

## Modes
- **Default (multi, `budget: standard`):** all 4 agents in sequence.
- **`--fast` (single):** Metric Ingest + Diagnosis collapse into one inline pass (skip the trend layer); Pack Feedback + Critic still run. **`--fast` never skips** the write-back or the critic (Critical Gate 4).

## Critic revision cycle
- Critic FAIL → identify the weak dimension:
  - dims 1–2 (attribution/falsifiability) weak → back to **Diagnosis**.
  - dim 5 (write-back fidelity) weak → back to **Pack Feedback**.
- One revision cycle only. Second FAIL → `BLOCKED`; nothing is written to the pack/performance store.

## Commit order (on PASS)
1. Write the read artifact.
2. Append the dated row to the channel pack `## Changelog` (+ any evidence note).
3. `node _dev/sync-skill-support.mjs` (mirror the appended pack).
4. Append the performance row to `.forsvn/performance/[channel].tsv`.
5. `bun bin/manifest-sync.ts` (register the new artifact).
6. Best-effort hosted POST (skip silently on no key / unreachable).

## Override
Operator may ship a FAIL read (`references/_shared/critic-override-protocol.md`); steps 2–4 (canonical write-back) are still withheld on override.
