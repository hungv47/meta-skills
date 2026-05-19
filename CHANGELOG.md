# Agent Skills — Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning is [SemVer](https://semver.org/spec/v2.0.0.html) — major.minor.patch.

This file tracks releases of the consolidated `meta-skills` plugin (32 skills across meta / research / marketing / product). SKILL.md files describe current behavior; this file documents what changed and when.

---

## [2.0.0] - 2026-05-19

**Agent Skills 2.0 — single-plugin consolidation + front door + verb-first rename.** Three changes ship together:

1. **Consolidation.** Four previously-separate plugins (`research-skills`, `marketing-skills`, `product-skills`, `meta-skills`) collapse into a single `meta-skills` plugin at `github.com/hungv47/meta-skills`. Umbrella `agent-skills` repo + three sibling repos archived.
2. **Front door + state root** (Workstream A). New `/forsvn` skill is the single discovery surface; new `.forsvn/` is the canonical user-facing state root (replaces planned `.agents/skill-artifacts/` + `skills-resources/`).
3. **Verb-first rename + orchestrate-* collapse** (Workstream B). 27 skills renamed action-first (hard cut, no aliases). 4 `orchestrate-*` routers deleted; their dispatch knowledge absorbed into `skills/meta/forsvn/references/chains/`.

```bash
npx skills add hungv47/meta-skills
# or
/plugin marketplace add hungv47/meta-skills
/plugin add meta-skills
```

Users on any 1.x plugin (or any of the four legacy plugins) must remove them and reinstall the consolidated one. **No alias layer** — old skill names hard-fail.

### Breaking changes (read before upgrading)

- **27 skill renames + 4 skill deletions.** Full map below. Old slash-commands will not resolve; replace them by hand.
- **`.forsvn/` is canonical.** `.agents/skill-artifacts/` and `skills-resources/` were never materialized in this repo; new installs write only to `.forsvn/`. If you carried over either layout from a 1.x install, copy what matters into `.forsvn/artifacts/`, `.forsvn/loops/`, `.forsvn/experience/` and delete the rest.
- **The 4 `orchestrate-*` routers are gone.** Use `/forsvn` as the front door; it reads `.forsvn/` state and routes directly to a leaf skill via the appropriate `chains/<domain>.md` reference.

### Skill rename map (Workstream B)

| Stack | Old | New |
|---|---|---|
| meta | `agents-panel` | `debate-panel` |
| meta | `cleanup-artifacts` | `clean-artifacts` |
| meta | `eval-loop` | `run-eval-loop` |
| meta | `fresh-eyes` | `review-work` |
| meta | `orchestrate-meta` | **deleted** — use `/forsvn` |
| meta | `task-breakdown` | `breakdown-tasks` |
| research | `funnel-planner` | `plan-funnel` |
| research | `icp-research` | `research-icp` |
| research | `market-research` | `research-market` |
| research | `orchestrate-research` | **deleted** — use `/forsvn` |
| research | `short-form-eval` | `evaluate-shortform` |
| research | `short-form-research` | `research-shortform` |
| marketing | `ad-copy` | `write-ad` |
| marketing | `brand-system` | `create-brand` |
| marketing | `campaign-plan` | `plan-campaign` |
| marketing | `cold-outreach` | `write-outreach` |
| marketing | `copywriting` | `write-copy` |
| marketing | `design-brief` | `brief-graphic` |
| marketing | `lp-brief` | `brief-landing-page` |
| marketing | `lp-eval` | `evaluate-landing-page` |
| marketing | `orchestrate-marketing` | **deleted** — use `/forsvn` |
| marketing | `seo` | `optimize-seo` |
| marketing | `short-form-brief` | `brief-shortform` |
| marketing | `social-copy` | `write-social` |
| marketing | `vn-tone` | `polish-vn` |
| product | `code-cleanup` | `clean-code` |
| product | `docs-writing` | `write-docs` |
| product | `machine-cleanup` | `clean-machine` |
| product | `orchestrate-product` | **deleted** — use `/forsvn` |
| product | `system-architecture` | `architect-system` |
| product | `user-flow` | `map-user-flow` |

Unchanged: `forsvn` (branded exception per D1), `discover`, `diagnose`, `prioritize`, `humanize`.

### Added

- **`/forsvn`** — front-door skill. Classifies intent, loads `.forsvn/` state, asks ≤2 clarifying questions only when truly ambiguous, dispatches to a leaf skill (via `references/chains/<domain>.md`) or resumes a prior initiative. Bootstraps `.forsvn/` on first run.
- **`.forsvn/` canonical state root.** `context/`, `experience/`, `artifacts/`, `loops/`, `evals/`, `routing/`, `dashboard/`. See `.forsvn/README.md` for the layout contract.
- **`skills/meta/forsvn/references/chains/{meta,research,marketing,product}.md`** — domain dispatch chains absorbed from the deleted orchestrate-* SKILL bodies.
- **PR1 program rule** (decisions.md): "interview before implementing" — any agent working under `implementation-roadmap/execution-evaluation/` must read every relevant brief + run `AskUserQuestion` rounds until decisions lock, before writing or moving code.

### Removed

- `orchestrate-meta`, `orchestrate-research`, `orchestrate-marketing`, `orchestrate-product` — collapsed into `/forsvn` + per-domain chain files (D6).
- Legacy per-plugin marketplaces (`research-skills`, `marketing-skills`, `product-skills`).

### Consolidation details

- Single repo, single CHANGELOG, single version. No per-stack release dance.
- Internal taxonomy preserved as `skills/{meta,research,marketing,product}/` folders.
- Cross-stack references (`pre-dispatch-protocol`, `mode-resolver`, `manifest-spec`, `eval-loop-spec`, etc.) resolve to a single `references/` folder at repo root.
- The `hooks/skill-router` and umbrella `scripts/` (audit, marketplace bump, portability) ship with the plugin.

### Skill catalog (32 skills)

**[meta] (7):** `forsvn` (front door) · `discover` · `debate-panel` (was `agents-panel`) · `run-eval-loop` (was `eval-loop`) · `breakdown-tasks` (was `task-breakdown`) · `review-work` (was `fresh-eyes`) · `clean-artifacts` (was `cleanup-artifacts`).

**[research] (7):** `research-icp` (was `icp-research`) · `research-market` (was `market-research`) · `diagnose` · `prioritize` · `plan-funnel` (was `funnel-planner`) · `research-shortform` (was `short-form-research`) · `evaluate-shortform` (was `short-form-eval`).

**[marketing] (13):** `create-brand` (was `brand-system`) · `write-copy` (was `copywriting`) · `write-ad` (was `ad-copy`) · `write-outreach` (was `cold-outreach`) · `write-social` (was `social-copy`) · `brief-shortform` (was `short-form-brief`) · `brief-landing-page` (was `lp-brief`) · `evaluate-landing-page` (was `lp-eval`) · `plan-campaign` (was `campaign-plan`) · `brief-graphic` (was `design-brief`) · `optimize-seo` (was `seo`) · `humanize` · `polish-vn` (was `vn-tone`).

**[product] (5):** `map-user-flow` (was `user-flow`) · `architect-system` (was `system-architecture`) · `clean-code` (was `code-cleanup`) · `clean-machine` (was `machine-cleanup`) · `write-docs` (was `docs-writing`).

### Recommended starting point

Run `/forsvn` on any new project — it bootstraps `.forsvn/`, classifies your ask, and routes. The proving workflow (D5): a fresh repo with no `brand/BRAND.md` will get routed through `/create-brand` first.

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
