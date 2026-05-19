# Agent Skills — Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning is [SemVer](https://semver.org/spec/v2.0.0.html) — major.minor.patch.

This file tracks releases of the consolidated `meta-skills` plugin (35 skills across meta / research / marketing / product). SKILL.md files describe current behavior; this file documents what changed and when.

---

## [2.0.0] - 2026-05-19

**Agent Skills 2.0 — single-plugin consolidation.** The four previously-separate plugins (`research-skills`, `marketing-skills`, `product-skills`, `meta-skills`) collapse into a single `meta-skills` plugin distributed from `github.com/hungv47/meta-skills`. The umbrella repo `agent-skills` and the three sibling plugin repos are archived; install via:

```bash
npx skills add hungv47/meta-skills
# or
/plugin marketplace add hungv47/meta-skills
/plugin add meta-skills
```

Users on any of the four legacy plugins should remove them and install the consolidated one. All 35 skills are present.

### Consolidation

- Single repo, single CHANGELOG, single version. No more per-stack release dance.
- Internal taxonomy preserved as `skills/{meta,research,marketing,product}/` folders.
- Cross-stack references (`pre-dispatch-protocol`, `mode-resolver`, `manifest-spec`, `eval-loop-spec`, etc.) now resolve to a single `references/` folder at repo root.
- `skills-resources/` (loops + experience substrate) travels with the skills.
- The `hooks/skill-router` and umbrella `scripts/` (audit, marketplace bump, portability) now ship with the plugin.

### [meta] Skills (7)

- `orchestrate-meta` — cross-stack router that scans state and proposes the right next skill
- `discover` — conversational discovery (adaptive depth: quick scoping to multi-round interview)
- `agents-panel` — multi-perspective debate or consensus polling
- `eval-loop` — measurable strategy → execution → evaluation workspaces
- `task-breakdown` — buildable task decomposition with acceptance criteria
- `fresh-eyes` — independent post-implementation review with critic + resolver
- `cleanup-artifacts` — artifact tree audit + grooming (move-not-delete, per-category confirmation)

### [research] Skills (8)

- `orchestrate-research` — router that reads project state and proposes the next skill with rationale
- `icp-research` — audience research (personas, VoC, habitat, pain analysis) → `research/icp-research.md` + `research/product-context.md`
- `market-research` — market landscape, competitive dynamics, TAM/SAM/SOM → `research/market-research.md`
- `diagnose` — problem-tree diagnosis (5-why + external check + hypothesis + verdict)
- `prioritize` — initiative generation + ICE scoring + cut-line + unconventional alternatives
- `funnel-planner` — funnel modeling + target setting + sanity check + stress test
- `short-form-research` — per-platform short-form video best-practice catalog (TikTok / Reels / Shorts default; +X / +LinkedIn opt-in)
- `short-form-eval` — post-publish short-form video evaluation (loop-native)

### [marketing] Skills (14)

- `orchestrate-marketing` — router that reads brand/research state and proposes the next skill with rationale + cost + duration
- `brand-system` — brand identity (BRAND.md + DESIGN.md + ASSETS.md)
- `copywriting` — persuasive copy with V/F/U rubric scoring + Competitor Swap Test
- `ad-copy` — Meta paid-ad copy (retargeting + cold-traffic)
- `cold-outreach` — email / LinkedIn / Twitter / iMessage / proposals
- `social-copy` — platform-native social copy (tiktok / reels / shorts / x / linkedin)
- `short-form-brief` — production-ready short-form video briefs (live-action + motion-graphic)
- `lp-brief` — campaign-grade landing-page or redesign brief
- `lp-eval` — post-launch landing-page evaluation (loop-native)
- `campaign-plan` — cross-channel campaign briefs + calendars
- `design-brief` — per-asset graphic-design briefs (social, thumbnails, banners, OG, hero)
- `seo` — search visibility (technical / AI / programmatic / competitor / aso modes)
- `humanize` — strip AI patterns, inject brand voice, compress
- `vn-tone` — Vietnamese register polish (báo chí / semi-casual / bro / pop-marketing)

### [product] Skills (6)

- `orchestrate-product` — router that reads project state (spec, flows, architecture) and proposes the next skill
- `user-flow` — multi-step in-product flow mapping (screens, decisions, transitions, edge cases)
- `system-architecture` — technical blueprint (stack, schema, API, deployment) → `architecture/system-architecture.md`
- `code-cleanup` — refactor existing code for readability + dead-code removal (5 golden rules: preserve behavior, small steps, conventions, test after each change, rollback awareness)
- `machine-cleanup` — developer-machine audit + cleanup (dotfolders, caches, toolchains, package-manager globals)
- `docs-writing` — generate docs from a codebase (README, API ref, runbook, ship log, release notes)

### Recommended starting point

Run `icp-research` first to create `research/product-context.md` — the canonical cross-stack record consumed by 13+ downstream skills.

### Retired

- `github.com/hungv47/research-skills` — archived, install from `meta-skills` instead
- `github.com/hungv47/marketing-skills` — archived, install from `meta-skills` instead
- `github.com/hungv47/product-skills` — archived, install from `meta-skills` instead
- `github.com/hungv47/agent-skills` (umbrella marketplace) — archived; `meta-skills` is now self-hosting via its own `.claude-plugin/marketplace.json`

---

## Legacy per-stack history

Pre-2.0 history for each stack lives in the archived repos' CHANGELOGs:

- [research-skills CHANGELOG](https://github.com/hungv47/research-skills/blob/main/CHANGELOG.md)
- [marketing-skills CHANGELOG](https://github.com/hungv47/marketing-skills/blob/main/CHANGELOG.md)
- [product-skills CHANGELOG](https://github.com/hungv47/product-skills/blob/main/CHANGELOG.md)
- [meta-skills v1.x](https://github.com/hungv47/meta-skills/commits/main) — pre-consolidation `main` branch
