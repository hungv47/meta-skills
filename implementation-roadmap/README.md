---
title: Implementation Roadmap
date: 2026-05-19
status: active
---

# Implementation Roadmap

Active program lives under [`execution-evaluation/`](./execution-evaluation/).

- [`execution-evaluation/brief-pack/`](./execution-evaluation/brief-pack/) — full brief pack (00 executive → 07 source coverage)
- [`execution-evaluation/decisions.md`](./execution-evaluation/decisions.md) — locked decisions (D1–D7), authoritative for Workstream A + B
- [`execution-evaluation/sources/`](./execution-evaluation/sources/) — original IDEA-*.md source briefs

Workstreams:

| WS | Scope | Status |
|---|---|---|
| A | `/forsvn` front door + `.forsvn/` state root | ✅ Shipped (commit 8c46b3d) |
| B | Verb-first rename (hard cut, no aliases) + collapse 4 `orchestrate-*` into `/forsvn` | ✅ Shipped (this roadmap, 2.0.0) |
| C–F | Production, eval, capability upgrades, integrations | Backlog — re-prioritize after A+B |

Prior program (v6 refactor, completed 2026-05-19) lives in [`.archived/v6-refactor-2026-05-19/`](./.archived/v6-refactor-2026-05-19/) along with its [`v6-README.md`](./.archived/v6-README.md) and [`v6-canonical-paths.md`](./.archived/v6-canonical-paths.md).

## Program Rule (PR1)

Any agent picking up work in `execution-evaluation/` MUST: read every relevant brief-pack file end-to-end, read `decisions.md`, read any source IDEAs that fed the brief, run `AskUserQuestion` rounds until every load-bearing decision is locked or explicitly punted, and only then start writing or moving code. Multi-round interviews are expected. See [`execution-evaluation/decisions.md` § PR1](./execution-evaluation/decisions.md).
