# Meta Skills — Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning is [SemVer](https://semver.org/spec/v2.0.0.html) — major.minor.patch.

This file tracks stack-level releases. SKILL.md files describe current behavior; this file documents what changed and when.

---

## [2.0.0] - 2026-05-16

**Agent Skills 2.0 — fresh start.** The meta-skills stack reset to 2.0.0 as part of the umbrella Agent Skills 2.0 release. Released as a pre-release tag on the `refactor/v2.0` branch. The `main` branch holds the legacy v1.x line for users who do not opt into the 2.0 trunk.

### Skills (7)

- `orchestrate-meta` — cross-stack router that scans state and proposes the right next skill
- `discover` — conversational discovery (adaptive depth: quick scoping to multi-round interview)
- `agents-panel` — multi-perspective debate or consensus polling
- `eval-loop` — measurable strategy → execution → evaluation workspaces
- `task-breakdown` — buildable task decomposition with acceptance criteria
- `fresh-eyes` — independent post-implementation review with critic + resolver
- `cleanup-artifacts` — artifact tree audit + grooming (move-not-delete, per-category confirmation)

### Shared canonical references

The `references/` folder defines the contracts every skill follows:

- `pre-dispatch-protocol.md` — bounded warm-start vs cold-start question handling
- `mode-resolver.md` — `--fast` contract, budget tiers, auto-downgrade, load-class behavior
- `anti-sycophancy.md` — stack-internal stance contract for critics, debates, interrogators
- `artifact-contract-template.md` — frontmatter schema for every artifact-producing skill
- `manifest-spec.md` — canonical lifecycle enum + manifest field semantics
- `thin-critic-rubric.md` — 3-dim rubric + checklist + auto-fail for standard-tier critic gates
- `shared-critic-rubrics.md` — full multi-dim rubric library for deep-tier critics
- `playbook-ref-template.md` — structural template + load-class tag convention for per-skill playbooks
- `before-starting-check.md` — pre-pre-Dispatch read pattern every skill applies
- `product-marketing-context-schema.md` — 12-section schema for research/product-context.md
- `eval-loop-spec.md` — measurable initiative loop contract
- `quality-dashboard-spec.md` + `quality-feedback-protocol.md` — quality telemetry

### Experience substrate

Cross-session knowledge accumulates at `skills-resources/experience/{domain}.md`. Run `bun scripts/bootstrap-experience.ts` to materialize the 8 starter domain files (audience, brand, business, content, goals, patterns, product, technical).

### Manifest + artifact index

`bun scripts/manifest-sync.ts` rebuilds `.agents/manifest.json` + `.agents/artifact-index.md` from artifact frontmatter. Run after artifact-producing skill invocations.
