# Agent Skills — Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning is [SemVer](https://semver.org/spec/v2.0.0.html) — major.minor.patch.

This file tracks releases of the consolidated `meta-skills` plugin (34 skills across meta / research / marketing / product). SKILL.md files describe current behavior; this file documents what changed and when.

---

## [Unreleased]

### Added

- **[marketing] new skill `produce-video` (Workstream C slice 2 — D14, export-mode v1, multi-runtime).** Closes the second gap in brief 04's production trio (produce-asset shipped in D11; publish-social remains backlog). Consumes a `brief-shortform` artifact OR a hand-written video-brief matching `references/video-brief-schema.md`, plus `brand/BRAND.md` + `brand/DESIGN.md`. Emits a 5-output **multi-runtime export bundle** at `.forsvn/artifacts/mkt/produced-videos/[slug]/`: canonical runtime-agnostic `manifest.md`, per-shot prompts under `scenes/`, HyperFrames composition scaffold under `hyperframes/scaffold.html`, Remotion composition scaffold under `remotion/scaffold.tsx`, and `vercel-ai-cli.md` README explaining how to pipe per-shot prompts through Vercel AI CLI / Hyx / Freepik / any image-gen CLI the operator has installed. Operator picks the downstream runtime — the skill never invokes one. 2 agents (prompt-author + critic) mirror D11 produce-asset's sequential pattern; critic-agent enforces 4 dimensions: Schema-and-CTA Compliance (manifest validates against schema, per-shot durations sum to total length, CTA verbatim in final shot's on-screen text AND manifest.cta) / Brand-Mark Fidelity (no fabricated hex / token names, placeholder rule active for missing assets, sacred elements from BRAND.md respected) / Caption-Pace (words(on_screen_text) ÷ duration_seconds ≤ 3.0 per shot — falsifiable without rendering) / Narrative Arc (hook → body → CTA — soft check; FAIL ships `done_with_concerns`). Per-shot DO NOT list in every scene prompt forbids hallucinated logos, on-screen text synonymizing, silent aspect overrides, silent duration padding, EXIF stripping, watermark gratuity, and variant gratuity. **TTS handling is export-only** — manifest carries voice spec (tone, pace_wpm, accent, sample line) per shot; operator pipes through their own TTS tool. No audio file generation in v1. No SRT/VTT. Generation-provenance frontmatter per D8 contract enables future `evaluate-shortform` / `evaluate-content` to score rendered videos against the brief's hypothesis. **No render/publish modes in v1** — `--publish` / `--render` / `--auto-run` return BLOCKED with explicit "deferred to v2" message. Registered in `.claude-plugin/plugin.json` (skills list + keywords). 33 → 34 skills. Closes D14 in `implementation-roadmap/execution-evaluation/decisions.md`.

- **platform-intelligence promoted to top-level canonical (Workstream E demo — D13).** Brief 03 § Platform-Specific Strategy positions per-platform Hook Taxonomy / Format Constraints / Algorithm Signals as cross-skill infrastructure, but the catalog lived inside `brief-shortform/references/platform-intelligence/` (one skill owned a 6-platform resource consumed by 3+ skills). D13 moves the 7 source files (tiktok, reels, shorts, linkedin, x, youtube, _template) to top-level `references/platform-intelligence/` — now sibling to `references/eval-loop-spec.md`, `references/mode-resolver.md`, and the other 11 cross-cutting refs. `brief-shortform` downgrades from owner to consumer; `write-social` and `evaluate-shortform` already cited the `_shared/platform-intelligence/` mirror so their citations are unchanged. New `_shared/platform-intelligence/` mirrors added in `brief-shortform` and `optimize-seo`. The 4 consumer mirrors stay in manual-sync mode (sync-skill-support.mjs broken since 2.0 consolidation; D14 hygiene slice deferred). Citation convention unchanged: skills cite `references/_shared/platform-intelligence/[platform].md`; canonical source-of-truth identified in skill-body narrative. Closes D13 in `implementation-roadmap/execution-evaluation/decisions.md`.
- **[marketing] `optimize-seo` wired to platform-intelligence (substantive new capability).** Brief 03 explicitly named "SEO / AI SEO where platform search matters" as a consumer, but optimize-seo had zero platform-intelligence references prior to D13. New `references/platform-search.md` (~90 lines) maps 5 of the 16 optimize-seo agents (`ai-presence-agent`, `programmatic-template-agent`, `comparison-page-agent`, `aso-keyword-agent`, `aso-listing-agent`) to the relevant §§ of the platform-intelligence catalog (Hook Taxonomy / Format Constraints / Algorithm Signals / Anti-Patterns) with per-agent output-framing rules. SKILL.md gains Critical Gate 5 enforcing platform-intelligence citation when mode is AI SEO / Programmatic / Competitor Pages / ASO; References section adds `platform-search.md` to Domain catalogs and `_shared/platform-intelligence/` to dispatch-loaded references. AI-SERP citation work, App Store preview hooks, and platform-native comparison content now ground recommendations in real platform signals instead of generic SEO theory.

- **[meta] `review-work` ships 2-layer noise filter + 3-category report (Workstream F demo).** Brief 06 § Review Workflow calls noise filtering "the highest-leverage part." Existing `procedures/reviewer.md § Verification rules` already handled Layer 1 (real-vs-fake); D12 adds Layer 2 (actionable-vs-not) and rewires the final report. New `references/noise-filter.md` (~180 lines) defines the **2-layer model** (real-vs-fake then actionable-vs-not), **3 finding categories** (Accepted = real + actionable + fixed; Rejected = filtered as noise with one-line reason; Deferred = real but out-of-scope with follow-up pointer), borderline-case handling (half-actionable splits, repeated patterns deduplicated, sub-confidence findings as Rejected by default), and the **fix-then-rerun protocol** (Accepted findings must verify via rerun before being marked Verified; failed reruns roll back or trigger critic-override log). SKILL.md gains Critical Gate 6 pointing at the new ref. `procedures/reviewer.md` § Verification rules cross-links to noise-filter.md for the Layer 2 handoff. `references/report-template.md` Issues Found section splits into 3 subsections matching the categories. No new agent file — judgment is enriched, not automated. Closes D12 in `implementation-roadmap/execution-evaluation/decisions.md`.
- **[marketing] new skill `produce-asset` (Workstream C demo, export-mode v1).** Closes the gap between brief and rendered output without taking on credential management. Consumes a `brief-graphic` artifact + `brand/BRAND.md` + `brand/DESIGN.md`, emits a manifest at `.forsvn/artifacts/mkt/produced-assets/[slug]/manifest.md` plus per-slot prompt files at `prompts/[slot-id].md` the operator runs through their chosen renderer (Midjourney / DALL·E / Imagen / Claude Design / Figma / human designer). 2 agents (prompt-author + critic), 7-gate critic rubric (slot coverage / brand-mark fidelity / aspect + safe-zone / copy verbatim / brand token fidelity / anti-pattern section / verification checklist), brief-04-mandated DO NOT list in every prompt (no hallucinated logos, no aspect overrides, no copy substitution, no EXIF stripping, no silent watermarks, no variant gratuity). Generation-provenance frontmatter per D8 contract enables future `evaluate-content` / `evaluate-ad` to score rendered assets against the brief's hypothesis. **No image-gen API integration in v1** — `--publish` / `--api-render` modes return BLOCKED with explicit "deferred to v2" message. Registered in `.claude-plugin/plugin.json` (skills list + keywords). 32 → 33 skills. Closes D11 in `implementation-roadmap/execution-evaluation/decisions.md`.
- **[research] `research-icp` ships rigor protocol: confidence labels + sample-bias section + ≥5 rule.** New `references/confidence-and-bias.md` (~200 lines) defines: inline `[Confidence: H | M | L | sources: N]` tags on every finding (pains, biases, objections, trust signals, emotional drivers); source-independence rules (quotes ≠ sources; same thread = N=1); mandatory Sample Bias section with named skews specific to the dataset (online-reviewer, support-ticket, Reddit, LinkedIn, interview, sales-call, survey) + mitigations + known gaps; ≥5-independent-sources floor per persona with `--hypothesis-mode` operator-override path. SKILL.md gains 3 new Critical Gates (5, 6, 7). Quality Gate checklist expands from 6 to 9 bullets. `agents/critic-agent.md` adds 3 new gates (Gate 8 Confidence Labels Complete / Gate 9 Sample Bias Acknowledged / Gate 10 ≥5 Sources per Persona) with auto-FAIL conditions and routing-table entries. `references/format-conventions.md` Artifact Template adds Confidence Summary line in header, per-finding confidence tags, mandatory Sample Bias H2 section. Channel `Density: H/M/L` in Habitat Map preserved unchanged — distinct concept (audience concentration in channel ≠ epistemic certainty of claim). Closes D10 in `implementation-roadmap/execution-evaluation/decisions.md`. Compounds across 13+ downstream consumer skills (campaign-plan, brand-system, copywriting, lp-brief, design-brief, ad-copy, cold-outreach, short-form-research/brief, humanize, seo, social-copy, vn-tone, plan-funnel) which can now weight findings by confidence rather than treating all claims equally.
- **[marketing] `write-copy` ships unified Seven Sweeps framework.** New `references/seven-sweeps.md` (~150 lines) names the 7 editing passes (Clarity → Voice → So-What → Prove-It → Specificity → Heightened Emotion → Zero-Risk), maps each pass to the agent that already owns it (voice / psychology / zero-risk / critic), documents the back-checking protocol between sweeps, ships the canonical word-level-cut list (filler + corporate-speak + AI-tells), and frames Expert Panel Scoring as an optional high-stakes mode. SKILL.md gains a `--seven-sweeps` / `--high-stakes` mode flag wiring + ordering note vs `humanize`. All 4 owning agents (voice, psychology, zero-risk, critic) cross-link back to the unified doc. **No behavior change for default invocations** — the 7 passes already ran, distributed across agents. What ships is legibility: downstream evaluators can now score "Seven Sweeps completion" against a single named framework, and the optional critic dim fires only when high-stakes mode is requested. Closes D9.A in `implementation-roadmap/execution-evaluation/decisions.md`.
- **[meta] `scripts/eval/log-critic-override.ts`** — appends a dated entry to `.forsvn/artifacts/meta/records/critic-overrides.md` when the operator overrides a critic verdict. Format per `references/quality-feedback-protocol.md § Critic Override Log`. Validates skill (kebab), critic-verdict / operator-decision / follow-up enums; safe-relative path check on `--artifact`; symlink-safe; idempotent.
- **[meta] `scripts/eval/promote-to-experience.ts`** — promotes a loop learning into `.forsvn/experience/<domain>.md` when the Quality Feedback Protocol gate is met. Gates on 3 consecutive `keep` rows in `results.tsv` OR `--operator-confirmed` flag. Format matches the protocol's append block. Domains: audience, business, product, brand, goals, content, patterns.
- **[meta] `references/artifact-contract-template.md` § `provenance:` — two variants** — distinguishes **extraction provenance** (Gate 7 chain-hardening; `extracted_from` + `extracted_at`) from **generation provenance** (eval-loop chain-hardening; `skill` + `run_date` + `input_artifacts` + `output_eval`). Required for artifacts that may be evaluated downstream.
- **[marketing] `brief-landing-page` emits generation provenance** — frontmatter field 13. `evaluate-landing-page` reads `input_artifacts` to ground scoring; `promote-to-experience.ts` walks `output_eval` to verify the artifact → eval → learning chain.
- **[marketing] `evaluate-landing-page` § Critic Override Protocol** — new SKILL.md section. When the operator overrides a critic FAIL, the skill calls `scripts/eval/log-critic-override.ts` BEFORE appending the ledger row. Override does not promote a contested cycle to `keep` — status reflects actual evidence.
- **D8 demo loop substrate** — `.forsvn/loops/lp-demo/` scaffolded with 3 synthetic cycle artifacts demonstrating the artifact → eval → override-log → dashboard → promotion chain end-to-end. `.forsvn/experience/{product,audience,content,business,brand,goals,patterns}.md` seeded as empty domain stubs.

### Fixed

- **[meta] `scripts/update-quality-dashboard.ts` writes to `.forsvn/artifacts/meta/records/` (was `.agents/skill-artifacts/meta/records/`)**. Path-drift bug introduced during the 2.0 `.forsvn/` migration: the script's log message + `references/quality-dashboard-spec.md` both already said `.forsvn/...`, but the runtime path remained on `.agents/...`. Fix propagated to all 30 per-skill copies under `skills/*/*/scripts/update-quality-dashboard.ts` (regenerable via `scripts/sync-skill-support.mjs` when it is updated for the consolidated layout).

### Changed

- **[meta] `references/quality-feedback-protocol.md`** is now the canonical home for the critic-override-log spec (no separate ref file). Brief 05's TSV suggestion is superseded by the existing Markdown-block spec — keeps eval narratives readable. CHANGELOG flag retained for traceability.

### Roadmap context

This release closes **Workstream D demo slice (D8)** from `implementation-roadmap/execution-evaluation/decisions.md`. Demonstrates brief 05's full artifact → eval → learning loop on the `brief-landing-page` → `evaluate-landing-page` pair, using existing references where possible (`quality-dashboard-spec.md`, `quality-feedback-protocol.md`, `eval-loop-spec.md`, `artifact-contract-template.md`) and adding only the missing pieces. New eval skills (`evaluate-ad`, `evaluate-content`, `evaluate-campaign`) remain backlog; provenance retrofit on pre-D8 artifacts is forward-only.

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
