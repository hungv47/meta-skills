---
title: Implementation Roadmap
date: 2026-05-20
status: active
---

# Implementation Roadmap

## v2.0-launch (active — drafted 2026-05-20)

Final pre-launch pass: skill audit, frontmatter optimization, repo consolidation.
Lives in [`v2.0-launch-2026-05-20/`](./v2.0-launch-2026-05-20/).

- [`plan.md`](./v2.0-launch-2026-05-20/plan.md) — 3 workstreams, sequencing, acceptance
- [`skill-audit.md`](./v2.0-launch-2026-05-20/skill-audit.md) — locked per-skill verdicts (39 skills)
- [`ws2-frontmatter-spec.md`](./v2.0-launch-2026-05-20/ws2-frontmatter-spec.md) — executable "Compact + sidecar" frontmatter sweep
- [`byo-engine.md`](./v2.0-launch-2026-05-20/byo-engine.md) — tool-agnostic production (Part A → WS2; Part B → v2.1)
- [`vercel-adoptions.md`](./v2.0-launch-2026-05-20/vercel-adoptions.md) — 4 ideas from the Vercel deep-dive (Part A → v2.0; Part B → v2.1)
- [`vercel-plugin-deep-dive-2026-05-21.md`](./vercel-plugin-deep-dive-2026-05-21.md) — source research on `vercel/vercel-plugin`

Status: **WS2 complete + validated** (2026-05-21). All 39 skills swept to "Compact + sidecar" — `SKILL.md` frontmatter ~55→~10 lines, `promptSignals` relocated to per-skill `routing.yaml` sidecars, `routing.*` dropped, descriptions rewritten to spec shape (`publish-social` un-truncated 1494→631). `hooks/skill-registry.json` byte-identical pre/post, `test-router` 25/25, `sync-skill-support --check` green. Vercel Part A scripts shipped (`scripts/explain-skill-route.ts`, `scripts/verify-counts.ts` + shared `hooks/skill-router-core.mjs`); BYO Part A applied (`produce-*` apology-language reframe); router hook stale-path bug fixed; WS3 count-drift reconciled across `plugin.json`/`marketplace.json`/`CLAUDE.md`/`README.md` (all → 39); `marketing-foundations.md` wired into its 9 consumer skills. CHANGELOG entries added under `[Unreleased]`. **Remaining:** the 3 shared-ref content extractions (`confidence-labeling`, `evaluation-loop-rubric`, `production-pattern`) — deliberately deferred, executable spec preserved in `v2.0-launch-2026-05-20/skill-audit.md § execution mechanics`; and the WS3 release cut (CHANGELOG `[Unreleased]`→`[2.0.0]`, version bump, GitHub release, retire the 4 old repos) — operator-owned.

## execution-evaluation (completed + archived 2026-05-20)

Lives in [`done/execution-evaluation-2026-05-20/`](./done/execution-evaluation-2026-05-20/).

- [`brief-pack/`](./done/execution-evaluation-2026-05-20/brief-pack/) — full brief pack (00 executive → 07 source coverage)
- [`decisions.md`](./done/execution-evaluation-2026-05-20/decisions.md) — locked decisions (D1–D25), the authoritative program record
- [`sources/`](./done/execution-evaluation-2026-05-20/sources/) — original IDEA-*.md source briefs

Workstreams — **all six complete + closeout + audit gap closure** (2026-05-20):

| WS | Scope | Status |
|---|---|---|
| A | `/forsvn` front door + `.forsvn/` state root | ✅ Shipped (commit 8c46b3d) |
| B | Verb-first rename (hard cut, no aliases) + collapse 4 `orchestrate-*` into `/forsvn` | ✅ Shipped (2.0.0) |
| C | Production layer — produce-asset (D11), produce-video (D14), publish-social export/draft/publish (D16/D17/D18) | ✅ Complete |
| D | Evaluation + learning loop — D8 infra, evaluate-ad (D15), evaluate-content (D19), evaluate-campaign (D20) | ✅ Complete |
| E | Capability upgrades — Seven Sweeps (D9.A), research-icp rigor (D10), platform-intelligence canonicalization (D13.A) + plan-campaign wiring (D13.B) | ✅ Complete |
| F | Operator quality + integrations — review-work noise-filter (D12), extract-service (D21), release-tooling repair (D22) | ✅ Complete |
| — | Closeout (D24) — skill-test harness repair, D22 follow-up cleanup | ✅ Complete |
| — | Coverage-audit gap closure (D25) — context acquisition script, review-work git-state detection + parallel tests | ✅ Complete |

A D25 coverage audit traced all 95 source ideas through the brief-pack and D1–D24, verified each against the repo, found and built the 3 remaining gaps. Every source idea is now built — except Pangram live-API wiring (correctly blocked on external credentials) and AI-SEO-as-references (a deliberate brief-03-permitted scoping choice).

**Release pending:** the program is built but unreleased — `plugin.json` + `marketplace.json` still read `2.0.0` and `CHANGELOG.md [Unreleased]` holds the D8–D25 entries. Version bump, CHANGELOG finalization, and GitHub release are owned by the user (see `decisions.md` § D24 hand-off).

**Archive note:** 15 of this program's files were git-tracked (committed before `implementation-roadmap/` was gitignored). The move into `done/` un-tracks them — they become deletions on the closeout commit, the intentional un-track recorded in `decisions.md` § D24 sub-decision 6 / § D25 Status.

## v6 refactor (completed 2026-05-19)

The prior program lives in [`.archived/v6-refactor-2026-05-19/`](./.archived/v6-refactor-2026-05-19/) along with [`v6-README.md`](./.archived/v6-README.md) and [`v6-canonical-paths.md`](./.archived/v6-canonical-paths.md).

## Program Rule (PR1)

Any agent picking up roadmap work MUST: read every relevant brief-pack file end-to-end, read `decisions.md`, read any source IDEAs that fed the brief, run `AskUserQuestion` rounds until every load-bearing decision is locked or explicitly punted, and only then start writing or moving code. Multi-round interviews are expected. See [`decisions.md` § PR1](./done/execution-evaluation-2026-05-20/decisions.md).
