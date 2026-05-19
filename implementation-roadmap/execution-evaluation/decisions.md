---
date: 2026-05-19
status: locked
owner: hungv47
supersedes: none
authority: implementation contract — overrides brief-pack/ where they conflict
---

# Execution-Evaluation — Locked Decisions

One-page decision memo from the brief-pack interview (00-executive-brief.md § "First Move"). Authoritative for the workstreams below. Brief-pack files remain as expanded rationale.

## Program Rules (apply to every workstream)

**PR1 — Interview before implementing.** For any work tied to this folder, the implementing agent MUST: (1) read every relevant brief-pack file end-to-end, (2) read this `decisions.md`, (3) read any source IDEAs that fed the brief, (4) run `AskUserQuestion` rounds until every load-bearing decision is locked or explicitly punted, and (5) only then start writing or moving code. "The task seems clear" has been wrong before on this program. Multi-round interviews are expected and welcomed. Set 2026-05-19 by hungv47 after Workstream A kickoff went well *because* the interview was run first.

## Locked Scope (in order)

1. **Workstream A — `/forsvn` router + `.forsvn/` state root.** Ship first. Proves orchestration backbone before any rename or capability work.
2. **Workstream B — Verb-first rename (hard cut, no aliases).** Ship as `2.0.0` release after Workstream A is stable. (User correction 2026-05-19: stay in 2.x major, do not bump to 3.x. Version handling owned by user.)
3. **Workstreams C–F (production, eval, capability upgrades, integrations) — backlog.** Re-prioritize after A+B land.

## Non-Goals

- No skill aliases. Old names are removed at the rename cut. Migration is a 3.0.0 breaking release, not a soft transition.
- No legacy state migration. `skills-resources/` and `.agents/` are not currently materialized in the repo; `.forsvn/` is canonical from day one.
- No external API integrations in the core path (Pangram, publish-social, etc.) — backlog under Workstream F.
- `/forsvn` is not a brainstorming chat. It must always route, dispatch, resume, or write a concrete artifact (per brief 00:81).
- No half-renames. If a skill is renamed, every reference (README, CHANGELOG, MEMORY.md, marketplace.json, plugin.json, hooks router, cross-skill `[[links]]`) is updated in the same commit.

## Decisions

### D1 — Naming policy

**Verb-first as the only name.** No aliases.

- Per-skill rename map lives in brief-pack/02-skill-surface-naming.md.
- `/forsvn` is the **only** branded exception. All other skills must be verb-first.
- Frontmatter `name:` and directory name must match.

### D2 — State root

**`.forsvn/` is the canonical user-facing root.** No migration needed (legacy paths never materialized).

```
.forsvn/
├── context/         # shared product-marketing context (12 sections, brief 01 § Shared Product Context)
├── experience/      # README.md, content.md, product.md, audience.md, patterns.md, business.md
├── artifacts/       # by initiative, then by skill
├── loops/           # eval loops (replaces planned skills-resources/loops/)
├── evals/           # evaluation snapshots + critic override log
├── routing/         # /forsvn resume metadata, intent history
└── dashboard/       # quality dashboard (read-only views over above)
```

- `.agents/` is reserved for infrastructure only (manifest.json, artifact-index.md if needed) — not user-facing.
- Top-level canonical folders (`brand/`, `architecture/`, `research/`) per CLAUDE.md § Artifact Placement are unchanged. They are not under `.forsvn/`.

### D3 — `/forsvn` contract

- Default entrypoint **and** direct skill calls remain supported (in 3.0.0 direct calls use verb-first names).
- Must perform on every invocation: classify intent → load context + state + experience → ask ≤2 clarifying questions if ambiguous → route or dispatch → write resume metadata to `.forsvn/routing/`.
- Branded exception to verb-first naming is approved.

### D4 — Migration plan (D1 + D2 enforcement)

Cut shipped as a single `2.0.0` release (user owns versioning). CHANGELOG entry must list every renamed skill with old → new mapping. No grace period; users on prior versions who run old names get a hard failure with a one-line "renamed to X, see CHANGELOG 2.0.0" message.

Pre-release checklist (gates the version bump — user owns the bump itself):
- [ ] Every skill directory renamed; frontmatter `name:` matches directory.
- [ ] Every cross-skill `[[wikilink]]` updated.
- [ ] `marketplace.json` + `plugin.json` skill paths updated (user owns version field).
- [ ] D6 — 4 orchestrate-* skills deleted; pipeline chains extracted to `skills/meta/forsvn/references/chains/`.
- [ ] D6 — `grep -r "orchestrate-meta\|orchestrate-research\|orchestrate-marketing\|orchestrate-product"` returns zero hits outside CHANGELOG.md.
- [ ] D6 — Every leaf skill that previously had `defers-to: orchestrate-*` now points at `/forsvn` or directly at the relevant leaf.
- [ ] `README.md` skill catalog rewritten.
- [ ] `MEMORY.md`, `references/`, `hooks/user-prompt-submit-skill-router.mjs` all reference new names.
- [ ] `CHANGELOG.md` 2.0.0 entry includes full rename map.

### D7 — Locked rename map (Workstream B)

35 skills audited. Of those: 4 deleted (orchestrate-*), 1 kept as branded exception (`forsvn`), 30 renamed to verb-first. Hard cut, no aliases.

| Stack | Old | New | Source / Note |
|---|---|---|---|
| meta | `agents-panel` | `debate-panel` | verb-first; primary action is the debate |
| meta | `cleanup-artifacts` | `clean-artifacts` | matches `code-cleanup → clean-code` form |
| meta | `discover` | `discover` | already verb; unchanged |
| meta | `eval-loop` | `run-eval-loop` | verb-first; the skill *runs* the loop |
| meta | `forsvn` | `forsvn` | **branded exception (D1)** — only one |
| meta | `fresh-eyes` | `review-work` | brief 02:29 |
| meta | `orchestrate-meta` | **DELETE** | D6 |
| meta | `task-breakdown` | `breakdown-tasks` | verb-first compound; user-locked over `decompose-tasks` |
| research | `diagnose` | `diagnose` | already verb; unchanged |
| research | `funnel-planner` | `plan-funnel` | matches `campaign-plan → plan-campaign` |
| research | `icp-research` | `research-icp` | brief 02:18 |
| research | `market-research` | `research-market` | brief 02:17 |
| research | `orchestrate-research` | **DELETE** | D6 |
| research | `prioritize` | `prioritize` | already verb; unchanged |
| research | `short-form-eval` | `evaluate-shortform` | matches `ad-eval → evaluate-ad` form |
| research | `short-form-research` | `research-shortform` | matches `market-research → research-market` |
| marketing | `ad-copy` | `write-ad` | brief 02:19 |
| marketing | `brand-system` | `create-brand` | brief 02:13 |
| marketing | `campaign-plan` | `plan-campaign` | brief 02:16 |
| marketing | `cold-outreach` | `write-outreach` | brief 02:22 |
| marketing | `copywriting` | `write-copy` | brief 02:20 |
| marketing | `design-brief` | `brief-graphic` | brief 02:14 |
| marketing | `humanize` | `humanize` | already verb; Humanmaxxing upgrade per brief 03 lands as content change, not rename |
| marketing | `lp-brief` | `brief-landing-page` | brief 02:15 |
| marketing | `lp-eval` | `evaluate-landing-page` | matches `ad-eval → evaluate-ad` |
| marketing | `orchestrate-marketing` | **DELETE** | D6 |
| marketing | `seo` | `optimize-seo` | verb-first; covers audit + plan + optimization scope |
| marketing | `short-form-brief` | `brief-shortform` | brief 02:15 |
| marketing | `social-copy` | `write-social` | brief 02:21 |
| marketing | `vn-tone` | `polish-vn` | verb-first; "polish Vietnamese text" |
| product | `code-cleanup` | `clean-code` | brief 02:30 |
| product | `docs-writing` | `write-docs` | matches `copywriting → write-copy` |
| product | `machine-cleanup` | `clean-machine` | matches `code-cleanup → clean-code` |
| product | `orchestrate-product` | **DELETE** | D6 |
| product | `system-architecture` | `architect-system` | verb-first; primary action is "Designs technical blueprints" |
| product | `user-flow` | `map-user-flow` | verb-first; primary action is "Maps multi-step in-product flows" |

**Dissents resolved 2026-05-19 (user veto round):** `debate-panel`, `run-eval-loop`, `optimize-seo`, `polish-vn`, `architect-system`, `breakdown-tasks`. D1 holds — `/forsvn` is the sole branded exception.

**Sweep policy (locked):** Full grep sweep of every old name across the repo. Any hit outside `CHANGELOG.md` or migration commit messages blocks the 2.0.0 release.

**Future skills mentioned in brief 02 but not yet created** (backlog, no rename needed): `produce-asset`, `produce-video`, `publish-social`, `evaluate-content`, `evaluate-campaign`, `extract-service`.

### D6 — Collapse orchestrate-* skills into `/forsvn`

`/forsvn` is the single front door. The four orchestrate-* skills (`orchestrate-meta`, `orchestrate-research`, `orchestrate-marketing`, `orchestrate-product`) are redundant routing layers and get **deleted in Workstream B**.

**What dies:**
- `skills/meta/orchestrate-meta/` — pure duplication of `/forsvn`'s cross-stack taxonomy. Both classify intent and route. Two front doors = "which one?" ambiguity the brief was trying to fix.
- `skills/research/orchestrate-research/`, `skills/marketing/orchestrate-marketing/`, `skills/product/orchestrate-product/` — these encoded per-domain dispatch chains (brand → copy → LP → eval, etc.), but the chains are *data*, not behavior worth a skill layer.

**What survives:** the pipeline knowledge from each orchestrate-* SKILL.md moves to `skills/meta/forsvn/references/chains/{research,marketing,product,meta}.md`. `/forsvn` reads the relevant chain file when dispatching domain work and proposes the next step (e.g., "you just finished brand — copy is the typical next step. /copywriting?").

**Migration shape (lives in Workstream B):**
1. Extract each orchestrate-*'s pipeline chain + decision rules into `skills/meta/forsvn/references/chains/<domain>.md`.
2. Delete the 4 skill directories.
3. Remove their entries from `.claude-plugin/plugin.json` `skills:`.
4. Sweep every `defers-to:` and `routing.*` reference across the stack — every leaf skill that referenced an orchestrate-* must point at `/forsvn` or directly at the relevant leaf.
5. CHANGELOG 2.0.0 entry must call out the 4 deletions explicitly with "use /forsvn instead" guidance.

**Why this fits Workstream B and not its own workstream:** the verb-first rename already touches every `defers-to:` and cross-skill `[[link]]`. Doing the orchestrate-* collapse in the same pass means one cross-stack sweep instead of two. Workstream B's pre-release checklist (D4) absorbs the deletions.

**Acceptance:** `grep -r "orchestrate-meta\|orchestrate-research\|orchestrate-marketing\|orchestrate-product"` returns zero hits outside CHANGELOG.md and migration commit messages.

### D5 — First proving workflow

Brand → first-content path (brief 01:32 asked which workflow proves the system; answer: **brand**). `/forsvn` on a fresh repo must walk: detect missing brand → run `create-brand` → produce `brand/BRAND.md` + `brand/DESIGN.md` → suggest next workflow. This is the acceptance demo for Workstream A.

## Acceptance Checks (per workstream)

**Workstream A (`/forsvn` + `.forsvn/`):**
- `/forsvn` on a vague request asks ≤2 clarifying questions, then routes to a concrete skill.
- Second `/forsvn` invocation finds previous `.forsvn/routing/` state and offers resume.
- New artifacts land under `.forsvn/` only (verified by grep).
- Direct skill calls still work.
- Brand proving workflow (D5) runs end-to-end.

**Workstream B (verb-first rename, 2.0.0):**
- `grep -r "brand-system\|short-form-brief\|<every old name>"` returns zero hits outside CHANGELOG.md.
- Marketplace install on a clean machine resolves all skill paths.
- Pre-release checklist (D4) fully checked.

## Risks Surfaced and Accepted

| Risk | Accepted because |
|---|---|
| Hard rename breaks installed `2.x` users | User explicitly chose "delete old, no aliases." 3.0.0 + CHANGELOG mapping is the mitigation. |
| `.forsvn/` diverges from CLAUDE.md's documented `.agents/` + `skills-resources/` plan | CLAUDE.md will be updated in Workstream A's commit. Single source of truth, no drift. |
| No production/eval skills in initial scope | Brief order (00:63) puts those after foundation. Backlog re-prioritized after A+B. |

## What Is NOT Decided

Carry to the next interview when Workstream B is ready to start:
- Per-skill rename map sign-off (D1 lists the source; user must confirm exact new names).
- `/forsvn` UX details: question-asking format, dispatch confirmation prompts, resume-vs-fresh defaults.
- Whether `create-brand` runs autonomously inside the proving workflow or pauses for user confirmation.
- D6 chain-extraction: how much per-domain knowledge from each orchestrate-* SKILL.md actually moves to `references/chains/` vs. gets dropped as cruft. Needs read-pass of each orchestrate-* body first.
- Workstream C–F sequencing.

## Status

DONE — Workstream A + B shipped 2026-05-19. `/forsvn` + `.forsvn/` live; 27 renames + 4 deletions executed; full grep sweep clean; router tests 25/25; registry regenerated to 32 skills; CHANGELOG 2.0.0 entry written. User owns the version bump (`bun scripts/bump-marketplace.ts ...`), git commit, push, and GitHub release.
