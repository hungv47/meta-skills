# Pipeline Spec — the staged closed-loop runtime

The contract for `run-pipeline`: the stage model, the gate rules, and the loop-tree
layout shared with its **eval-only mode**. Canonical design: CLOSED-LOOP.md §7 (+ §1, §4, §6).

`run-pipeline` owns both entries on one loop tree (the 2026-06 audit merged the former
eval-only sibling skill into this one): **eval-only mode** scaffolds just the loop
workspace (`program.md` + `context.md` + `results.tsv` + `learnings.md` — see
`references/eval-only-mode.md`); the **full pipeline** also drives brief → execute →
ingest. Both live in `.forsvn/loops/<slug>/` — `results.tsv` (same 8-col ledger) +
`learnings.md` + the stage dirs. The full pipeline adds one artifact: `pipeline.md`.

---

## The stage model

```
research ─▶ brief ─▶ FORK ─▶ execute ─▶ ingest ─▶ evaluate ─▶ learn
   ▲                                                             │
   └──────────────── next cycle (learnings feed the next brief) ◀┘
```

| # | stage | leaf skill | gate | output lands in |
|---|---|---|---|---|
| 1 | research | `research-*` | — | `strategy/` |
| 2 | brief | `brief-*` / `write-*` | **review gate** | `strategy/` (`decision_state: pending`) |
| 3 | execute | the **fork** (Brief-only \| Assisted \| Direct) | **fork + review gate** | `execution/` (`decision_state: pending`) |
| 4 | ingest | `forsvn-preview attach` (return-leg) | — | `assets` / `asset_picked` on the execution artifact |
| 5 | evaluate | `evaluate-*` sibling | — | `evals/` + one `results.tsv` row |
| 6 | learn | promote → `learnings.md` | — | `learnings.md` |

A stage is implemented by a leaf skill — the orchestrator never inlines the work
(CLOSED-LOOP §2.1, "orchestrate, don't fuse"). Single-responsibility skills stay
independently testable; the merge happens here.

---

## Gate rules (load-bearing)

1. **Stop at every gate; never auto-approve.** Transitions out of `brief` and `execute`
   pause for the human review gate. Brief/execute outputs are written as
   `decision_state: pending` and surface in the review stream like any other decision
   (architecture §9.2 — humans own approval in v0). The orchestrator enforces this, not
   the leaf skill (CLOSED-LOOP §11 R2).
2. **The fork is registry-gated** (`execution-fork.md` + `tool-registry-spec.md`). At the
   execute stage, call `list_tools(category)`:
   - `fork == "brief-only"` → emit the handoff prompt; name the connectable engines.
   - `fork == "assisted-direct-available"` → offer Assisted/Direct on a `verified` engine;
     the human still approves each output at the gate. Direct does **not** auto-approve.
   - Record `execution_mode: brief-only | assisted | direct` on the execution artifact.
3. **Close the loop.** The `ingest` stage re-ingests the real rendered asset (return-leg
   §6) so `evaluate` scores what shipped, not the brief, and downstream cycles reference
   the real asset. A pipeline that skips ingest is **open** — flag it
   (`DONE_WITH_CONCERNS`).

---

## `pipeline.md` — the staged program (run-pipeline owns)

Created by `scripts/scaffold-pipeline.ts`. `lifecycle: loop`, `type: loop`,
`loop: <slug>`. Carries:

- **Goal** + **Asset category** (the category gates the fork).
- A **Stages** table (the 6 rows above) with a `status` + `gate` per stage.
- A **Current stage** pointer — the single source of "where are we" for resume.
- A **Transition log** — one line per stage transition (`<date> stage N→M · <gate
  outcome> · <artifact>`), the durable resume trail.

**Resumability:** to resume, read **Current stage** + the latest artifacts under
`strategy/`, `execution/`, `evals/`. State lives only in the loop tree — no database
(CLOSED-LOOP §7). A pipeline can stop at any gate and resume cleanly.

---

## Shared loop tree

```text
.forsvn/loops/<slug>/
├── pipeline.md      # run-pipeline owns — stage program + current pointer
├── strategy/        # research + brief artifacts
├── execution/       # execute-stage outputs (decision_state: pending until approved)
├── evals/           # evaluate-* snapshots
├── results.tsv      # cycle  date  artifact  primary_metric  value  baseline  status  description
└── learnings.md     # promoted, evidence-backed lessons (append-only)
```

`results.tsv`'s 8-column header is the **cross-stack contract** with the `evaluate-*`
siblings — identical across both modes (see `_shared/eval-loop-spec.md` § results.tsv
schema). Changing it ripples there. If an eval-only run already scaffolded the loop,
`scaffold-pipeline.ts` only adds `pipeline.md` (idempotent — it never clobbers).

---

## Scaffold

```bash
bun scripts/scaffold-pipeline.ts "<initiative name>" [--category image|video|design|publish|research|analytics] [project-root]
```

Creates `.forsvn/loops/<slug>/` with `pipeline.md` + `results.tsv` + `learnings.md` +
the stage dirs. Idempotent and local-only (no network).
