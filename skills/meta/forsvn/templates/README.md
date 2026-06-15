---
kind: state-root
canonical: true
owner: /forsvn
---

# `.forsvn/` — User-Facing State Root

The canonical, per-project state directory for the FORSVN agent stack. Written and read by `/forsvn` and every domain skill it dispatches.

This directory is the single source of truth for everything a skill needs to resume work, avoid re-asking questions, and ground generations in product reality. It is **user-facing knowledge** — distinct from `.forsvn/index/` which is reserved for machine-derived indexes.

## Layout

| Subfolder | Lifecycle | What it holds |
|---|---|---|
| [`context/`](context/) | canonical | Shared product-marketing context — read by every skill before dispatch. |
| [`experience/`](experience/) | append-only | Cross-skill Q&A substrate. Skills read before asking, append after answering. |
| [`artifacts/`](artifacts/) | pipeline | Per-initiative, per-skill outputs. The work product. |
| [`loops/`](loops/) | loop | Measurable strategy → execution → evaluation cycles (per `references/eval-loop-spec.md`). |
| [`evals/`](evals/) | snapshot | Evaluation snapshots and critic override log. |
| [`routing/`](routing/) | snapshot | `/forsvn` resume metadata and intent history. |
| [`dashboard/`](dashboard/) | derived | Read-only quality dashboard. Generated from above. |

## Naming Convention

- Dated artifacts: `YYYY-MM-DD-<slug>.md`
- Living artifacts (registries, indexes): undated slug
- Per-initiative subfolders under `artifacts/` and `loops/`: kebab-case slug

## Top-Level Canonical Folders (Unchanged)

`.forsvn/` does **not** absorb `brand/`, `architecture/`, or `research/` at the project root. Those remain hand-curated canonical sources of truth. `.forsvn/context/` summarizes them for skill dispatch; it does not replace them.

## Relationship to Prior Conventions

This root replaces the previously planned `.forsvn/` and `docs/forsvn/artifacts/` for user-facing artifacts. Those paths were never materialized in the repo. See `implementation-roadmap/execution-evaluation/decisions.md` D2.
