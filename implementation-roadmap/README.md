---
title: Implementation Roadmap
date: 2026-05-19
status: active
---

# Implementation Roadmap

Active program lives under [`execution-evaluation/`](./execution-evaluation/).

- [`execution-evaluation/brief-pack/`](./execution-evaluation/brief-pack/) — full brief pack (00 executive → 07 source coverage)
- [`execution-evaluation/decisions.md`](./execution-evaluation/decisions.md) — locked decisions (D1–D23), the authoritative program record
- [`execution-evaluation/sources/`](./execution-evaluation/sources/) — original IDEA-*.md source briefs

Workstreams — **all six complete** (2026-05-20):

| WS | Scope | Status |
|---|---|---|
| A | `/forsvn` front door + `.forsvn/` state root | ✅ Shipped (commit 8c46b3d) |
| B | Verb-first rename (hard cut, no aliases) + collapse 4 `orchestrate-*` into `/forsvn` | ✅ Shipped (2.0.0) |
| C | Production layer — produce-asset (D11), produce-video (D14), publish-social export/draft/publish (D16/D17/D18) | ✅ Complete |
| D | Evaluation + learning loop — D8 infra, evaluate-ad (D15), evaluate-content (D19), evaluate-campaign (D20) | ✅ Complete |
| E | Capability upgrades — Seven Sweeps (D9.A), research-icp rigor (D10), platform-intelligence canonicalization (D13.A) + plan-campaign wiring (D13.B) | ✅ Complete |
| F | Operator quality + integrations — review-work noise-filter (D12), extract-service (D21), release-tooling repair (D22) | ✅ Complete |

Prior program (v6 refactor, completed 2026-05-19) lives in [`.archived/v6-refactor-2026-05-19/`](./.archived/v6-refactor-2026-05-19/) along with its [`v6-README.md`](./.archived/v6-README.md) and [`v6-canonical-paths.md`](./.archived/v6-canonical-paths.md).

## Program Rule (PR1)

Any agent picking up work in `execution-evaluation/` MUST: read every relevant brief-pack file end-to-end, read `decisions.md`, read any source IDEAs that fed the brief, run `AskUserQuestion` rounds until every load-bearing decision is locked or explicitly punted, and only then start writing or moving code. Multi-round interviews are expected. See [`execution-evaluation/decisions.md` § PR1](./execution-evaluation/decisions.md).
