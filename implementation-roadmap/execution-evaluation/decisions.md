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

---

## D8 — Workstream D demo slice (LOCKED 2026-05-19)

Locked via interview rounds 1–2 (2026-05-19, post-A+B):

- **Next workstream:** D — Evaluation/learning loop (brief 05). C/E/F stay backlog.
- **Demo pair:** `brief-landing-page` → `evaluate-landing-page`. Existing skills, no new eval skill in this slice.
- **Scope:** all 5 brief-05 infrastructure pieces in one slice — provenance frontmatter + manual-metric eval path + critic-override log + quality dashboard + experience-promotion rule.
- **Execution mode:** plan first (this entry) → user approves → build.

### Demo target

One LP eval loop scaffolded at `.forsvn/loops/<demo-slug>/` (slug TBD — user names it; placeholder `lp-demo`). Loop holds: `program.md`, `context.md`, `strategy/<brief>.md`, `execution/<page>.md` reference, `evals/2026-05-19-cycle-1.md`, `results.tsv`, `learnings.md`. End-to-end demo path:

1. `brief-landing-page` produces a brief artifact with `provenance:` frontmatter.
2. Operator runs a manual cycle (real page or synthetic page — does not matter for the loop infra).
3. `evaluate-landing-page` ingests manual metrics, writes a cycle artifact, appends `results.tsv`, scores against rubric.
4. If critic FAIL is overridden by operator, helper appends to `.forsvn/evals/critic-overrides.tsv`.
5. Dashboard regenerator updates `.forsvn/dashboard/quality.tsv`.
6. Promotion script reads `results.tsv` and, when criteria met, appends to `.forsvn/experience/audience.md` (or relevant domain).

### Files to create / change

**New references (cross-cutting, owned by `references/`):**
- `references/provenance-frontmatter.md` — canonical 4-field block (`skill`, `run_date`, `input_artifacts`, `output_eval`) and minimum-set rules. Brief 05 §Provenance.
- `references/critic-override-log.md` — TSV columns: `timestamp`, `skill`, `run_id`, `failed_dimension`, `operator_reason`. Rubric-revision warning when same dim hits >3 overrides. Brief 05 §Critic Introspection.
- `references/quality-dashboard.md` — TSV columns: `date`, `skill`, `invocations`, `critic_pass`, `critic_fail`, `avg_rewrite_cycles`, `avg_rubric_score`. Regeneration model: manual script invocation (no hooks). Brief 05 §Quality Dashboard.
- `references/experience-promotion.md` — promotion rule ("3 consecutive `keep` in same loop's `results.tsv` on same dimension, OR explicit user OK"). Anti-promotion rules (discard, unresolved watch, no source). Brief 05 §Promotion to Experience.

**New scripts (under `scripts/`):**
- `scripts/eval/log-critic-override.ts` — appends to `.forsvn/evals/critic-overrides.tsv`. CLI flags or stdin JSON; called by eval skills when override happens.
- `scripts/eval/update-quality-dashboard.ts` — scans `.forsvn/loops/*/evals/*.md` + `results.tsv` files, regenerates `.forsvn/dashboard/quality.tsv`. Idempotent. (Reuses existing `scripts/update-quality-dashboard.ts` if compatible — verify first.)
- `scripts/eval/promote-to-experience.ts` — scans `results.tsv`, applies promotion rule, appends to relevant `.forsvn/experience/{domain}.md` with source-loop link.

**Existing-skill updates (minimal — both already write to `.forsvn/`):**
- `skills/marketing/brief-landing-page/SKILL.md` + dispatch procedures — add provenance block to artifact frontmatter template per new reference.
- `skills/marketing/evaluate-landing-page/SKILL.md` — wire critic-override log call when operator overrides critic FAIL; confirm `results.tsv` `keep|discard|watch|block` ledger already matches promotion rule input (status: likely yes per skill description).

**`.forsvn/` substrate (one demo loop + seed files):**
- `.forsvn/loops/<demo-slug>/{program,context,strategy,execution,evals,results.tsv,learnings.md}` — scaffolded by `run-eval-loop` (existing skill), not by hand.
- `.forsvn/evals/critic-overrides.tsv` — header row only at seed.
- `.forsvn/dashboard/quality.tsv` — header row only at seed.
- `.forsvn/experience/audience.md` (or `content.md`, depending on demo finding) — existing file; promotion script appends.

### Acceptance checks (gates the merge)

- `brief-landing-page` artifact emits valid `provenance:` block (schema-validated).
- `evaluate-landing-page` cycle artifact links back to source brief via `provenance.input_artifacts`.
- One critic-override row lands in `.forsvn/evals/critic-overrides.tsv` from a hand-run.
- `scripts/eval/update-quality-dashboard.ts` produces non-empty `.forsvn/dashboard/quality.tsv` from at least one cycle.
- Promotion script appends at least one entry to `.forsvn/experience/{domain}.md` from a 3-keep streak (synthetic if needed).
- `grep -r "provenance:" skills/marketing/brief-landing-page/` returns ≥1 hit; same for evaluate-landing-page consuming it.

### Non-goals (this slice)

- No retrofit of provenance to existing artifacts. Forward-only. (Open Q1 below if user disagrees.)
- No new eval skills (no `evaluate-ad`, `evaluate-content`, `evaluate-campaign`) — backlog for D8.next.
- No automatic dashboard refresh on hook. Manual script call only.
- No external metric integrations (GA4, Plausible). Manual metric entry only, per brief 05's "manual is default."
- No rubric extraction to `references/` for evaluate-landing-page (rubric stays in its existing references — already on-disk).

### Locked sub-decisions (round 3, 2026-05-19)

1. **Demo loop slug:** `lp-demo` (synthetic). Loop proves the infra; no real LP attached.
2. **Promotion target domain:** deferred to runtime — depends on what the synthetic finding ends up being. Default candidate: `.forsvn/experience/content.md`.
3. **Script path:** new `scripts/eval/` namespace for `log-critic-override.ts` and `promote-to-experience.ts`. Existing top-level `scripts/update-quality-dashboard.ts` is NOT moved — only extended in place if needed (or replaced by `scripts/eval/update-quality-dashboard.ts` if the old one is incompatible — verified at build).
4. **Override-log integration:** `evaluate-landing-page` shells out to `scripts/eval/log-critic-override.ts` on operator override of critic FAIL. No manual step. No `--skip-log` flag in v1.

### Risks accepted

| Risk | Accepted because |
|---|---|
| Forward-only provenance means historical artifacts have no eval trail | All existing artifacts predate the loop infra anyway; retrofit cost > value. |
| Manual dashboard regen is easy to forget | Acceptable for v1; brief 05 explicitly allows manual metric entry. Hook-based refresh is D8.next. |
| Demo loop on synthetic LP doesn't validate against real conversion data | Loop infra is the proof target, not the LP advice. Real-LP cycle is a follow-up exercise. |

### Status

LOCKED — building now. On finish: write CHANGELOG entry (no version bump — user owns), and surface the build for review before commit.

### D8 build-time correction (2026-05-19, read-pass on existing references)

Inspecting `references/quality-dashboard-spec.md`, `references/quality-feedback-protocol.md`, `references/eval-loop-spec.md`, `references/artifact-contract-template.md`, and `scripts/update-quality-dashboard.ts` revealed the original D8 spec was redundant. Most brief-05 infrastructure already exists:

| Original D8 deliverable | Actual state | Revised deliverable |
|---|---|---|
| New `references/provenance-frontmatter.md` | `artifact-contract-template.md` defines `provenance:` for **extraction lineage**. Brief 05 needs **generation lineage** (skill, run_date, input_artifacts, output_eval) — a different concept. | **Patch** artifact-contract-template to distinguish the two; no new file. |
| New `references/critic-override-log.md` | `quality-feedback-protocol.md § Critic Override Log` already specifies path (`.forsvn/artifacts/meta/records/critic-overrides.md`, **Markdown, not TSV** per brief 05's TSV suggestion) and entry format. | None. Use existing spec. Brief 05's TSV suggestion is overruled by existing MD spec — keeps eval narratives readable. |
| New `references/quality-dashboard.md` | `quality-dashboard-spec.md` already exists with full schema and helper-command examples. | None. |
| New `references/experience-promotion.md` | `quality-feedback-protocol.md § Learning Promotion To Experience` covers the rule (3 keeps OR explicit), domain routing, and append format. | None. |
| New `scripts/eval/update-quality-dashboard.ts` | `scripts/update-quality-dashboard.ts` exists. **Bug:** writes to `.agents/skill-artifacts/meta/records/...` while its log message + spec claim `.forsvn/artifacts/meta/records/...`. A+B migration leftover. | **Fix path** in existing script (don't move file). |
| New `scripts/eval/log-critic-override.ts` | Does not exist. | **Build** under `scripts/eval/`. Appends MD block to `.forsvn/artifacts/meta/records/critic-overrides.md` per spec. |
| New `scripts/eval/promote-to-experience.ts` | Does not exist. | **Build** under `scripts/eval/`. Reads `results.tsv`, applies promotion rule, appends to `.forsvn/experience/<domain>.md`. |

**Net D8 deliverables (revised):**
1. Patch `references/artifact-contract-template.md` to split `provenance:` into extraction vs generation variants.
2. Fix path bug in `scripts/update-quality-dashboard.ts` (`.agents/...` → `.forsvn/artifacts/...`).
3. Build `scripts/eval/log-critic-override.ts`.
4. Build `scripts/eval/promote-to-experience.ts`.
5. Update `skills/marketing/brief-landing-page/SKILL.md` to emit generation-provenance frontmatter.
6. Update `skills/marketing/evaluate-landing-page/SKILL.md` to shell out to `log-critic-override.ts` on operator override.
7. Scaffold `.forsvn/loops/lp-demo/` using existing `scripts/scaffold-eval-loop.ts`.
8. Add D8 unreleased CHANGELOG entry.

**Why this matters:** the original D8 would have duplicated four references, masking the existing spec. The Quality Standard in CLAUDE.md says "Check if we already have it under a different name before recommending anything." Read pass caught this; the slice is now ~⅓ the original size while delivering the same end-to-end demo capability.

---

## D9 — Workstream E demo slice (LOCKED 2026-05-19: D9.A — Seven Sweeps)

Locked via interview rounds 1–2 (2026-05-19, post-D8):

- **Next workstream:** E — Capability upgrades (brief 03). C/F stay backlog.
- **Slice discipline:** one concrete demo first, same as D8.
- **Plan gate:** D9 plan in decisions.md → user picks A / B / C → build.
- **D8 commit:** stays uncommitted; user owns. D9 changes land on top of the same dirty tree.

### Verification pass (2026-05-19)

Brief 03 lists 5 capability surfaces (copy/ads, ICP rigor, SEO/AI visibility, humanmaxxing, platform-specific strategy). Spot-checks against `skills/marketing/{write-copy,write-ad,humanize,optimize-seo}/` and `skills/research/research-icp/` reveal **most of brief 03 is already implemented in the repo**:

| Surface | Brief 03 calls for | Repo state |
|---|---|---|
| Copywriting | Unique Mechanism, 6 Beliefs, Argument Engineering, Discovery Story | ✅ Refs present: `references/{belief-disruption,discovery-story,research-workflow}.md` + 11 mentions in SKILL.md |
| Copywriting | Seven Sweeps | ⚠️ **Gap.** Only 2 incidental mentions in `agents/voice-agent.md`; no dedicated reference |
| Ad-copy | Meta filtering, Message Transmutation, AI UGC VSSL, Contrast, Variable Subtraction, Chad Funnel | ✅ Refs present: `references/{message-transmutation,ad-intelligence,rubric}.md` |
| Humanize | Pangram detector resistance, regression suite | ✅ Refs present: `references/{detector-resistance,regression-suite}.md` + 12 SKILL.md mentions |
| SEO / AI SEO / programmatic SEO | New methodology + `/pricing.md` + bot-by-bot robots.txt + 12-playbook taxonomy | ✅ Refs present: `references/{ai-seo,programmatic-seo,schema-reference,aso}.md` |
| ICP rigor | Confidence labels, Digital Watering Hole, sample-bias, ≥5 data points | ⚠️ **Partial gap.** `references/habitat-mapping.md` covers Density H/M/L (channel concentration, not finding confidence). Zero hits on confidence-labels / sample-bias / minimum-sample terms |
| Platform-specific briefs | X / TikTok / YT / Reels / LinkedIn | ⚠️ **Partial gap.** Refs exist under `research-shortform/references/platforms/` + `brief-shortform/references/platform-intelligence/` (scoped to short-form). Not promoted as cross-skill shared resource for `write-social`, `optimize-seo`, `plan-campaign`, future `evaluate-content` |

**Implication:** Three genuine gaps — Seven Sweeps, ICP rigor, Platform briefs. The other capability surfaces in brief 03 are landed (verified by grep; per brief 00 § Implementation Assumption, claims in IDEA-2 status table that "Section 2 fully implemented" align with what's actually on disk).

### D9 candidate slices

#### D9.A — Seven Sweeps in write-copy (smallest)

**Scope:** Add `references/seven-sweeps.md` defining the 7 sequential passes (Clarity → Voice/Tone → So-What → Prove-It → Specificity → Heightened Emotion → Zero-Risk), back-checking protocol, word-level-cut list (very, really, utilize, leverage, etc.), Expert Panel Scoring as an optional high-stakes mode. Wire into write-copy SKILL.md as an optional post-generation pass that runs BEFORE humanize.

**Files:**
- New: `skills/marketing/write-copy/references/seven-sweeps.md` (~150 lines)
- Edit: `skills/marketing/write-copy/SKILL.md` — add "Seven Sweeps Pass" section + invocation rule + critic-dim mention; reference the new file
- Edit: `skills/marketing/write-copy/agents/voice-agent.md` — replace the 2 incidental mentions with a real handoff into the 7-pass procedure
- Optional: `skills/marketing/write-copy/agents/critic-agent.md` — add "Seven Sweeps completion" as an optional rubric dim when post-generation mode is requested

**Acceptance:**
- `grep "seven-sweeps\|Seven Sweeps" skills/marketing/write-copy/SKILL.md` returns ≥3 hits
- New ref file exists with 7 dimension definitions + back-check rules + word-level cuts
- Voice-agent integration is no longer incidental — explicit pass-by-pass handoff
- Pairs cleanly with D8: write-copy artifacts now carry generation-provenance, so a downstream eval can grade pre/post Seven Sweeps if a loop is scaffolded around copy

**Blast radius:** Lowest. 1 skill, 1 new ref, 2 agent edits.

#### D9.B — research-icp rigor (medium)

**Scope:** Add confidence-labels requirement (every finding tagged High/Medium/Low + source-count rationale), sample-bias section (online-reviewer / support-ticket / Reddit skew), and minimum-5-data-points hard gate to `research-icp`. icp-research feeds 13+ downstream skills, so the rigor change is high-leverage but contained.

**Files:**
- New: `skills/research/research-icp/references/confidence-and-bias.md` (~120 lines) — confidence-label schema, Digital Watering Hole expansion (extending habitat-mapping.md or supplementing it), sample-bias playbook, ≥5 rule with edge cases
- Edit: `skills/research/research-icp/SKILL.md` — add 3 critical gates / hard rules referencing the new ref; update artifact frontmatter or body template to require confidence labels per finding
- Edit: `skills/research/research-icp/references/format-conventions.md` — add `confidence_distribution` field to artifact frontmatter (or per-finding confidence inline)
- Edit: `skills/research/research-icp/agents/critic-agent.md` — add 3 critic dimensions (Confidence Labels Complete, Sample Bias Acknowledged, ≥5 Rule Respected) with falsifiable check definitions

**Acceptance:**
- `grep "confidence label\|sample bias\|≥5\|minimum.*5.*data" skills/research/research-icp/SKILL.md` returns ≥3 hits
- New `confidence-and-bias.md` ref exists
- critic-agent.md adds 3 new dims; existing dims unchanged
- Format-conventions shows where confidence labels land in the artifact
- A test run on a synthetic ICP outputs at least one finding with explicit High/Medium/Low + source count

**Blast radius:** Medium. 1 skill body, 1 new ref, agent edits, format-convention edit. No downstream skills break (additive change to artifact). research-icp's high consumer count means improvements compound across the stack.

#### D9.C — Platform briefs promoted cross-skill (largest)

**Scope:** Existing platform-intelligence refs (5 platforms × short-form scope) get promoted to a canonical cross-skill location. Wire into write-social, optimize-seo, plan-campaign so platform-specific content/SEO/timing advice is no longer locked to the short-form pair.

**Files:**
- Move/canonicalize: pick `references/platform-intelligence/{tiktok,linkedin,youtube,reels,x}.md` as the canonical location. Existing per-skill copies (under `brief-shortform/`, `research-shortform/`, `write-social/_shared/`, `evaluate-shortform/_shared/`) become generated copies via sync-skill-support.mjs.
- Edit (or defer): `scripts/sync-skill-support.mjs` — already broken for 2.0 layout (D8 finding); D9.C either fixes it OR ships canonical files at the top level and leaves the broken sync as D9.next
- Edit consumers: wire into `skills/marketing/{write-social,optimize-seo,plan-campaign}/SKILL.md` — read the canonical platform brief in the dispatch/pre-dispatch step where platform-specific behavior matters
- (Optional) Edit consumers: `evaluate-shortform`, `research-shortform`, `brief-shortform` — switch from per-skill copy to canonical reference

**Acceptance:**
- `references/platform-intelligence/` exists with 5 platform briefs OR a canonical pointer
- ≥3 new consumers wired (e.g., write-social + optimize-seo + plan-campaign)
- `grep "platform-intelligence" skills/marketing/{write-social,optimize-seo,plan-campaign}/SKILL.md` returns ≥1 hit each
- sync-skill-support.mjs decision documented (fix vs defer)

**Blast radius:** Largest. Touches 4–5 skills + the propagation script. Highest leverage (platform intel becomes infrastructure, not skill-local) but biggest cross-skill ripple. Risk: any in-flight `--rev=N` of the short-form skills could conflict with the move.

### Comparison

| | D9.A — Seven Sweeps | D9.B — ICP rigor | D9.C — Platform briefs |
|---|---|---|---|
| Skills touched | 1 (write-copy) | 1 (research-icp) | 4–5 (write-social, optimize-seo, plan-campaign + short-form pair) |
| New refs | 1 (~150 lines) | 1 (~120 lines) | 0 new content; relocations |
| Cross-stack ripple | None | Low (research-icp is upstream; additive) | High (canonical-path change) |
| D8 integration story | Strong — pairs with write-copy's new provenance for eval-pre/post-pass | Medium — better ICPs feed every downstream skill that reads icp-research.md | Low — orthogonal to eval loop |
| Effort estimate | 1 build session | 1 build session | 2 build sessions |
| Recommend? | ✅ Strongest "concrete demo" — same shape as D8 | ✅ High-leverage if you've felt ICP rigor pain | ⚠️ Worthwhile but defer until D9.A or D9.B locks the E pattern |

### Locked sub-decisions (round 3, 2026-05-19)

1. **Slice:** D9.A — Seven Sweeps in `write-copy`. D9.B and D9.C remain backlog.
2. **Sync script:** not in scope for D9.A. Stays deferred (D8 finding).
3. **Mode:** Seven Sweeps is an **optional post-generation pass** that runs BEFORE humanize. Not required on every write-copy invocation; gated by operator request or by `--seven-sweeps` mode flag in the dispatch step.
4. **Critic integration:** `agents/critic-agent.md` gains an OPTIONAL dim "Seven Sweeps completion" that fires only when the pass was requested. No hard gate when the pass was not run.
5. **Expert Panel Scoring:** in scope as part of `seven-sweeps.md` reference but flagged as a separate optional high-stakes mode within the pass. No standalone skill.
6. **Word-level cuts:** include the standard list (`very`, `really`, `utilize`, `leverage`, `delve`, `testament`, `actually`, `quite`, `basically`, `simply`, plus em-dash avoidance per brief 03 humanmaxxing). De-duplicate against `humanize/references/ai-patterns.md` to avoid drift — Seven Sweeps cuts are upstream of humanize and target different patterns (filler/intensifiers vs AI-tells); some overlap is fine, but the seven-sweeps file should cross-link to ai-patterns rather than restate it.

### Status

LOCKED — building now. On finish: update CHANGELOG `[Unreleased]` with the D9.A entry (no version bump — user owns).

### D9.A build-time finding (2026-05-19, read-pass on voice-agent.md)

`agents/voice-agent.md` already implements Sweep 1 (Clarity) + Sweep 2 (Voice & Tone) explicitly. The other five sweeps from brief 03 / IDEA-5 are present but distributed across other agents under different names:

| Brief 03 sweep | Where it lives today |
|---|---|
| 1. Clarity | `agents/voice-agent.md § Sweep 1: Clarity` (explicit) |
| 2. Voice & Tone | `agents/voice-agent.md § Sweep 2: Voice & Tone` (explicit) |
| 3. So What | distributed: `agents/psychology-agent.md` + critic V/F/U "Useful" dim |
| 4. Prove It | `agents/critic-agent.md` V/F/U "Verifiable" + substantiation dim |
| 5. Specificity | `agents/critic-agent.md` specificity dim + AI-slop "kill on sight" list |
| 6. Heightened Emotion | `agents/psychology-agent.md` + `references/emotional-triggers.md` |
| 7. Zero Risk | `agents/zero-risk-agent.md` |

The Seven Sweeps **execution model is already in the skill** — just under different labels and split across the dispatch pipeline. So D9.A's actual value is **unification, not new behavior**:

1. `references/seven-sweeps.md` — single canonical doc that names the 7 passes, maps each to the current owning agent, documents the **back-checking protocol** between sweeps (genuinely new — not in any existing agent), provides the canonical word-level-cut list (extending voice-agent's partial list), and frames **Expert Panel Scoring** as an optional high-stakes mode (genuinely new).
2. Cross-links in `voice-agent.md` + `psychology-agent.md` + `zero-risk-agent.md` + `critic-agent.md` so every agent points back to seven-sweeps.md as the unified vocabulary.
3. SKILL.md gets a short "Seven Sweeps unified framework" pointer in the dispatch narrative (no behavior change — current dispatch already does this; just makes it legible).
4. Optional critic dim (per sub-decision #4) for explicit "Seven Sweeps completion" when the operator asks for the full 7-pass discipline.

**Revised D9.A net deliverables (still small):**
1. New `references/seven-sweeps.md` (~150 lines).
2. Cross-link edits in 4 agent files (1-2 lines each).
3. SKILL.md "Seven Sweeps" pointer in the dispatch section.
4. Optional critic dim in critic-agent.md.

No new behavior shipped; the framework already runs. What ships is **legibility**: an evaluator (e.g., a future `evaluate-content` skill) can score against "Seven Sweeps completion" without re-deriving which agents own which passes.

---

## D10 — D9.B slice (LOCKED 2026-05-19: research-icp rigor)

Locked via interview round 4 (2026-05-19, post-D9.A). User picked D9.B over C/F/D-expand. Plan and acceptance carry forward unchanged from D9 § D9.B (decisions.md lines ~330–351). Execution mode: same as D8/D9.A — plan-first approved, build on top of dirty tree.

### Build-time read pass findings

Inspecting `skills/research/research-icp/SKILL.md` (Quality Gate has 6 checklist items but zero confidence/sample-bias bullets), `agents/critic-agent.md` (7 gates: VoC Evidence Integrity / Habitat Specificity / Emotional Driver Traceability / Decision Psychology Specificity / Quote Volume / Persona Constraint / Brief Alignment), `references/format-conventions.md` (Artifact Template has Habitat Map with Density H/M/L per channel, Pain Profile with Quote×2 per pain):

1. **Habitat density ≠ finding confidence.** The existing `Density: H/M/L` field in Habitat Map measures **how concentrated the audience is in a given channel** (channel-quality signal). Brief 03's confidence labels measure **how sure we are of a specific finding** (epistemic signal). These are orthogonal. D9.B adds the latter without disturbing the former. No naming collision risk — channel density stays in Habitat Map column 3, finding confidence becomes a new inline tag on pains / biases / objections / emotional drivers.
2. **Quote×2 is per-pain, not per-segment.** Current template requires 2 quotes per pain. Brief 03's "≥5 independent data points per segment" is broader — 5 sources contributing to a persona overall, not 5 per finding. D9.B adds the segment-level floor as a Critical Gate, leaves the per-pain Quote×2 rule alone.
3. **Critic has 7 gates already.** D9.B adds 3 more (Gates 8, 9, 10): Confidence Labels Complete / Sample Bias Acknowledged / ≥5 Rule Respected. Existing 7 gates unchanged.
4. **`habitat-mapping.md` (89 lines) covers Digital Watering Hole methodology.** D9.B does NOT re-derive it. New `confidence-and-bias.md` cross-links to it; the existing ref stays canonical for habitat work.

### Locked sub-decisions

1. **Confidence-label position:** inline tag at end of each finding bullet, format `[Confidence: H | sources: N]` where N is the source count. Applied to: pains (each pain in Pain Profile), key biases, objections, trust/distrust signals, emotional drivers.
2. **Sample-bias section:** new H2 section after Red Flags, before Next Step. Three subsections: Source skews acknowledged / Mitigations applied / Known gaps.
3. **≥5 rule:** Critical Gate 5 (new), enforced before persona is finalized. If <5 independent data points (sources, not quotes) across pains+biases+psychology combined for a single persona, return NEEDS_CONTEXT and request more VoC collection.
4. **Critic gates 8/9/10 are additive.** Existing gates 1-7 unchanged. New gates fire on every invocation (not optional like D9.A's Seven Sweeps dim), since brief 03 frames rigor as a baseline expectation for icp-research, not a high-stakes mode.
5. **Format-conventions edit:** Artifact Template gains confidence-tag annotation in the Pain Profile / Decision Psychology / Emotional Drivers blocks; new Sample Bias H2 inserted; Critical Gate row added to the body-sections cross-stack contract.

### Status

LOCKED — building now.

---

## D11 — Workstream C demo slice (LOCKED 2026-05-19: produce-asset MVP, export-mode only)

Locked via interview round 5 (2026-05-19, post-D10). User picked C over F/D9.C/expand-D, plan-first implied per prior pattern.

### Why this slice

Brief 04 mandates **export/manual fallback** as the v1 default for every production skill ("No first version should require external APIs to be useful"). produce-asset MVP honors this: takes a `brief-graphic` artifact + brand tokens, emits a per-slot render-ready prompt + asset manifest. The downstream user runs the prompt through Midjourney / DALL·E / Imagen / Figma / a human designer — produce-asset never holds credentials.

Pairs cleanly with D8: produce-asset emits generation-provenance (`input_artifacts` includes the brief-graphic file + brand/DESIGN.md) so downstream eval skills can score the produced asset against the brief's spec.

### Scope (v1 — export-mode only)

**New skill:** `skills/marketing/produce-asset/`
- `SKILL.md` — verb-first naming per D1; budget: `standard`; consumes brief-graphic artifact; produces `.forsvn/artifacts/mkt/produced-assets/[slug]/manifest.md` + per-slot prompt files
- `agents/prompt-author-agent.md` — generates the render-ready prompt per slot, with platform-aware specs injected (aspect ratio, safe zones, type scale, contrast, file format) from the brief-graphic input
- `agents/critic-agent.md` — spec-compliance check before delivery. Per brief 04: aspect ratio respected, safe zones honored, no hallucinated logos/brand marks, copy-to-render preserved, EXIF/aspect not silently overridden
- `references/format-conventions.md` — manifest schema + per-slot prompt template
- `references/anti-patterns.md` — brief 04 § Anti-patterns: don't produce every variant unbidden, don't hallucinate logos, don't strip EXIF, don't override aspect ratios silently

**Plugin registration:** `.claude-plugin/plugin.json` — append `./skills/marketing/produce-asset/` to skills list + `produce-asset` to keywords

**Not in v1 (explicit deferrals):**
- No image-gen API integration (DALL·E / Imagen / Midjourney / Claude Design). v2 surface.
- No Figma MCP. v2 surface.
- No SVG/vector programmatic rendering. v2 surface.
- No publish-asset / draft / send-to-cloud-storage steps. Out of brief 04 scope.
- No `playbook.md`, no `procedures/` subdir. Standard v1 skill weight; refactor-ripple work can add these later.
- No multi-agent parallel-then-merge orchestration. Sequential prompt-author → critic; complexity matches "preview-quality, export-only" v1.

### Acceptance

- `skills/marketing/produce-asset/SKILL.md` exists with verb-first frontmatter, generation-provenance pattern wired in, brief 04's 4 Critical Gates (export-mode-only floor, spec compliance, brand-mark fidelity, EXIF safety).
- `agents/prompt-author-agent.md` + `agents/critic-agent.md` exist with role/input/output contracts.
- `references/format-conventions.md` defines the manifest + per-slot prompt schema.
- `references/anti-patterns.md` covers brief 04's anti-patterns + cross-cutting marketing-stack rows.
- `.claude-plugin/plugin.json` updated; `grep "produce-asset" .claude-plugin/plugin.json` returns ≥2 hits (keyword + skill path).
- CHANGELOG `[Unreleased]` entry written.

### Locked sub-decisions

1. **Skill slug:** `produce-asset` (verb-first per D1; brief 02 maps `asset-produce` → `produce-asset`).
2. **Artifact path:** `.forsvn/artifacts/mkt/produced-assets/[slug]/manifest.md` + `.forsvn/artifacts/mkt/produced-assets/[slug]/prompts/[slot-id].md`. New `produced-assets/` subdir under `mkt/` (analogous to existing `design-briefs/` and `lp-brief/`).
3. **Budget tier:** `standard` per brief 04. `--fast` collapses critic to single pass; `--deep` available for high-stakes campaigns but not the default.
4. **Generation provenance (per D8 contract):** required. `input_artifacts` includes the brief-graphic path + `brand/BRAND.md` + `brand/DESIGN.md`. `output_eval: null` until a downstream eval-skill cycle scores the produced asset.
5. **No new top-level folder.** Produced assets land under `.forsvn/artifacts/` per the canonical Artifact Placement contract — they're pipeline-lifecycle, not canonical sources of truth.

### Status

LOCKED — building now.

---

## D12 — Workstream F demo slice (LOCKED 2026-05-19: review-work noise-filter upgrade)

Locked via interview round 6 (2026-05-19, post-D11). User picked review-work over extract-service / Pangram modes.

### Why this slice

Brief 06 calls the noise-filter "the highest-leverage part" of the review workflow. The bones already exist — `references/procedures/reviewer.md` lines 89-100 carry "signal-vs-noise verification" rules and `references/anti-patterns.md` warns against "padding the report with nits." But two pieces are missing:

1. **Actionable-only criteria** distinct from "real-or-fake." A finding can be a real issue but not actionable in this pass (e.g., a documentation improvement surfaced during a security review). The existing verification rules sort real-vs-not, not actionable-vs-not.
2. **Fix-then-rerun + accepted/rejected report convention.** Brief 06 specifies "fix accepted findings → rerun relevant checks" as a first-class protocol. Current `report-template.md` has "Issues Found" + "Changes Made" but not a clean accept/reject split that surfaces operator-visible decisions.

### Scope

**New ref:** `skills/meta/review-work/references/noise-filter.md` (~120 lines)
- Distinguishes 3 finding categories: **Accepted** (real + actionable in this pass) / **Rejected** (noise — false positive, already handled, equivalent to existing code) / **Deferred** (real but out-of-scope for this pass — flagged for follow-up but not fixed now)
- Defines actionable-only criteria per category
- Surfaces the fix-then-rerun loop: accept finding → resolver fix → rerun relevant checks (tests, type-check, build) → verify → mark in report
- Cross-links to existing `procedures/reviewer.md § Verification rules` (which stays canonical for real-vs-fake) so the noise-filter is positioned as actionable-vs-not, layered on top

**Edit:** `skills/meta/review-work/SKILL.md`
- Add Critical Gate "Noise-filter pass before report-write" pointing at the new reference
- Add Execution-section step naming the noise-filter pass

**Edit:** `skills/meta/review-work/references/procedures/reviewer.md`
- Strengthen the existing signal-vs-noise verification section to explicitly hand off "actionable-vs-not" judgment to noise-filter.md
- Add cross-link

**Edit:** `skills/meta/review-work/references/report-template.md`
- Split the existing "Issues Found" section into 3 subsections: Accepted (fixed) / Rejected (filtered as noise — keep brief, note suppression reason) / Deferred (real but out-of-scope — flagged for follow-up)
- Update body-template section list to reflect the new structure

**Not in v1 (explicit deferrals):**
- No new agent file — the existing reviewer agent is enriched by the new ref; no separate "noise-filter agent"
- No script work — noise-filter is judgment, not automation
- No plugin.json change (skill already registered)
- No git-state auto-detection upgrade (brief 06 lists this; deferred)
- No parallel test+review (brief 06 lists this; deferred)
- No `defers-to: extract-service` (brief 06's extract-service work is a separate F slice not in scope here)

### Acceptance

- New `references/noise-filter.md` exists with 3 finding categories defined
- `SKILL.md` Critical Gates includes a noise-filter pass reference (≥1 hit on `noise-filter`)
- `procedures/reviewer.md` cross-links to noise-filter.md
- `report-template.md` body-template section list splits into Accepted / Rejected / Deferred (≥1 hit on each label)
- CHANGELOG `[Unreleased]` entry written

### Locked sub-decisions

1. **3-category model.** Accepted / Rejected / Deferred. Not 2 (Accept/Reject) because "real but out-of-scope" needs a third slot — operator should see it without confusing it with noise.
2. **noise-filter.md is judgment, not automation.** The reference encodes criteria; the reviewer agent applies them; the operator reviews the categorization. No new script.
3. **Existing signal-vs-noise rules in reviewer.md stay canonical for real-vs-fake.** The new ref ADDS actionable-vs-not on top. Two-layer filter (real → actionable) rather than collapsing both into one rubric.
4. **Deferred findings DO get reported.** They're not silently dropped. They appear in the Deferred subsection with a one-line rationale ("real issue, but out of scope for this security-review pass — file follow-up").

### Status

LOCKED — building now.

---

## D13 — D9.C slice (PROPOSED 2026-05-19: platform-intelligence cross-skill canonicalization)

Locked via interview round 7 (2026-05-19, post-D12): user picked D9.C — Platform briefs cross-skill, plan-first.

### Why this slice

Brief 03 § Platform-Specific Strategy lists 5 consumers of platform briefs: `write-social`, `brief-shortform`, "SEO/AI SEO where platform search matters", research-shortform-style intelligence gathering, and `evaluate-content` (future). Today only the short-form production trio (`brief-shortform`, `write-social`, `evaluate-shortform`) consume the catalog, and they do so via a stale generated-copy pattern that survived the 2.0 consolidation. Two real problems:

1. **Source-of-truth lives inside `brief-shortform`** (`skills/marketing/brief-shortform/references/platform-intelligence/{7 files}`). Conceptually wrong — TikTok / Reels / Shorts / X / LinkedIn / YouTube taxonomies are cross-skill resources, not a brief-shortform-internal concern.
2. **`scripts/sync-skill-support.mjs` is fundamentally broken for 2.0 layout** (hardcoded `STACKS = ["research-skills", "marketing-skills", ...]` from the 4-plugin world). Generated `_shared/` copies are stale-but-in-sync today only because nobody has changed the source since the rename pass. The pattern is **obsolete by design** post-consolidation: single-repo skills can reference top-level `references/` directly with no portability cost.
3. **`optimize-seo` has zero platform-intelligence wiring** despite brief 03 explicitly calling it out ("SEO/AI SEO where platform search matters"). Substantive gap, not cosmetic.

### Verification pass findings (2026-05-19)

| Catalog | Location today | Files | Consumer skills | Notes |
|---|---|---|---|---|
| `platform-intelligence/` (**production lens** — Hook Taxonomy / Format Constraints / Algorithm Signals / Anti-Patterns) | `skills/marketing/brief-shortform/references/platform-intelligence/` (source) + 2 generated copies | tiktok, linkedin, reels, shorts, x, youtube, _template (7) | `brief-shortform` (source), `write-social` (`_shared/` copy), `evaluate-shortform` (`_shared/` copy) | All copies in sync with source (verified diff = only the `<!-- GENERATED -->` header line) |
| `platforms/` (**research/scout lens** — discovery protocol, distinct filenames like `twitter-video.md`, `instagram-reels.md`) | `skills/research/research-shortform/references/platforms/` | tiktok, instagram-reels, linkedin-video, youtube-shorts, twitter-video, _template (6) | `research-shortform` only | Different schema, different lens. **NOT in scope for D13** — leave untouched |
| sync-script footprint | `scripts/sync-skill-support.mjs` | hardcoded for 4-stack repos that no longer exist | 5 active `.generated-support` markers across the repo | Broken since `df44a92` consolidation; D8 finding flagged it as deferred |
| `optimize-seo` 16-agent surface (`ai-presence-agent`, `programmatic-template-agent`, `aso-*`, `comparison-page-agent`) | No platform-intelligence references | — | — | Substantive gap per brief 03 § Platform-Specific Strategy |

**Implication:** the original D9 § D9.C plan (decisions.md ~330–378) called for promoting + wiring write-social, optimize-seo, plan-campaign. D13 narrows scope based on read-pass evidence:
- `write-social` already consumes the catalog → path-update only, no new wiring.
- `optimize-seo` is the substantive new consumer (brief 03 mandate).
- `plan-campaign` is **deferred to D13.next** — brief 03 doesn't list it; channel-strategy.md already covers high-level platform-by-platform; substantive case is weaker than the optimize-seo gap.
- sync-script deletion is **also deferred** — touches 5+ `_shared/` dirs beyond platform-intelligence (`ad-intelligence`, `design-brief`, `brand-system`, etc.); it's its own hygiene slice (D14 candidate).

### Scope (D13.A — platform-intelligence canonicalization, one new consumer)

**Move source-of-truth to top-level `references/`:**
- Move `skills/marketing/brief-shortform/references/platform-intelligence/{tiktok,linkedin,reels,shorts,x,youtube,_template}.md` → `references/platform-intelligence/`.
- Update `brief-shortform/SKILL.md`, `playbook.md`, `procedures/dispatch-mechanics.md` to reference the top-level path.

**Delete generated copies + repoint consumers:**
- Delete `skills/marketing/write-social/references/_shared/platform-intelligence/` (8 files including `.generated-support`).
- Delete `skills/research/evaluate-shortform/references/_shared/platform-intelligence/` (8 files including `.generated-support`).
- Update each consumer's SKILL.md + every agent file + every reference file that mentions `_shared/platform-intelligence/[platform].md` → repoint at `references/platform-intelligence/[platform].md` (relative to repo root). Affected files (grep): `write-social/SKILL.md`, `write-social/references/{playbook,rubric,format-conventions,anti-patterns}.md`, `write-social/references/procedures/{pre-dispatch,dispatch-mechanics}.md`, `write-social/agents/{copywriter-agent,format-checker-agent,critic-agent}.md`, `evaluate-shortform/SKILL.md`, `evaluate-shortform/references/playbook.md`.

**Wire optimize-seo as new consumer (substantive new capability):**
- New ref: `skills/marketing/optimize-seo/references/platform-search.md` (~80 lines) — names which agents consume which platform-intelligence sections and why. Map: `ai-presence-agent` reads §3 Algorithm Signals (LinkedIn, X for AI-SERP citations) + §4 Anti-Patterns. `aso-*` agents read TikTok/Reels §1 Hook Taxonomy + §2 Format Constraints (App Store screenshot/preview-video naming and copy conventions translate cleanly). `programmatic-template-agent` reads YouTube §2 Format Constraints for description+tags templating. `comparison-page-agent` reads §3 Algorithm Signals for platform-native distribution surfaces. Cross-links to top-level `references/platform-intelligence/`.
- Edit `optimize-seo/SKILL.md` § Manifest or "References" section to enumerate `references/platform-search.md` as a body-loaded ref. Add 1 line to the Quality Gate referencing platform-search compliance when the mode is `ai` or `aso`.
- No new agent file — wiring is reference-only; existing agents read the new ref via orchestrator.

**CHANGELOG:**
- Append `[Unreleased]` entry under `### Added` (one bullet per: canonicalization, optimize-seo wiring) + one `### Removed` bullet for the 2 generated `_shared/` copies.

### Acceptance

- `references/platform-intelligence/` exists at repo root with 7 files (tiktok, linkedin, reels, shorts, x, youtube, _template) — no `<!-- GENERATED -->` headers.
- `grep -rn "_shared/platform-intelligence" skills/` returns zero hits.
- `grep -rn "references/platform-intelligence" skills/marketing/{brief-shortform,write-social,optimize-seo}/ skills/research/evaluate-shortform/` returns ≥1 hit per skill.
- `skills/marketing/optimize-seo/references/platform-search.md` exists with ≥4 named agent-to-section mappings.
- CHANGELOG `[Unreleased]` entry committed (no version bump — user owns).

### Locked sub-decisions

1. **Path convention for cross-skill refs:** top-level `references/platform-intelligence/[platform].md` referenced verbatim (no `_shared/` mirror). Skills cite the top-level path directly. Matches how `references/pre-dispatch-protocol.md`, `references/mode-resolver.md`, `references/eval-loop-spec.md` etc. are cited today (those still have `_shared/` mirrors via the broken sync script, but the canonical path is what gets cited in narrative — D13 closes the gap for platform-intelligence by ditching the mirror entirely).
2. **research-shortform `platforms/` directory untouched.** Different catalog (research/scout lens), different filenames, different consumer. Merging the two catalogs is a separate decision (D13.C candidate, deferred). Risk of conflating them rejected.
3. **`plan-campaign` deferred** to D13.B. Channel-strategy.md already covers high-level platform-by-platform; substantive gap is smaller than optimize-seo. Skip in v1.
4. **sync-skill-support.mjs deletion deferred** to D14 (hygiene slice). D13 only deletes the 2 `_shared/platform-intelligence/` mirror dirs. The other 3 `_shared/` dirs (`ad-intelligence`, `design-brief`, `brand-system`) keep their now-orphaned `.generated-support` markers until D14 resolves the broader pattern. Acceptable temporary drift — sync was already broken; nothing gets worse.
5. **optimize-seo new ref is ≤100 lines.** If it grows beyond that, split per-mode (`platform-search.md` + `platform-aso.md`) — not in v1.
6. **Backward-compatibility shim NOT shipped.** No symlinks from `_shared/platform-intelligence/` to top-level; no transition period. Hard cut matches D1's no-aliases policy applied at the reference layer.

### Risks accepted

| Risk | Accepted because |
|---|---|
| Repointing breaks any in-flight uncommitted work that references `_shared/platform-intelligence/` | Working tree is clean (verified `git status`); no in-flight risk |
| sync-skill-support.mjs stays half-broken (3 of 5 `_shared/` mirrors orphaned after D13) | Already broken; D14 hygiene slice closes it cleanly. Not worse than today |
| optimize-seo's new platform-search.md may overlap with existing `ai-seo.md` and `aso.md` | Cross-links rather than restates; treats existing refs as canonical for non-platform aspects |
| Future portable-skill install (`npx skills add ... --skill <one>`) would break for write-social / evaluate-shortform / optimize-seo | Portable single-skill install isn't a real install vector today (post-consolidation users get the whole bundle via `/plugin marketplace add hungv47/meta-skills`). D14 can rebuild the sync pattern if/when the use case returns |

### Status

LOCKED — building now.

### D13 build-time finding (2026-05-19, citation-convention pass)

Inspecting `references/dispatch-mechanics.md` and current citation patterns across the stack revealed sub-decision #1 ("skills cite the top-level path directly, no `_shared/` mirror") doesn't have a clean implementation. The orchestrator resolves relative paths against the **skill's** directory (per dispatch-mechanics line 13: `references/X.md → /path/to/<skill>/references/X.md`). There's no native convention for "this string resolves from repo root, not skill root."

Three options considered:

| Option | Cost | Cleanliness |
|---|---|---|
| **A. Skills cite `../../../references/platform-intelligence/...`** | Fragile — `..` count depends on each file's depth (SKILL.md vs references/X.md vs agents/X.md vs procedures/X.md). 4 different prefixes for the same logical pointer. | Worst — invites copy-paste bugs. |
| **B. Skills cite `references/platform-intelligence/...` with implicit "top-level fallback"** | Requires orchestrator-side convention change. Implicit behavior risks regressions. | Cleanest end-state but requires architectural decision out of scope for D13. |
| **C. Keep `_shared/` mirror convention; move source-of-truth to top-level; populate mirror in every consumer** | 4 consumers × 7 files = 28 mirror files. Matches existing pattern (`_shared/pre-dispatch-protocol.md`, `_shared/mode-resolver.md`, etc.). Sync-script broken — manual maintenance until D14. | Preserves existing convention exactly; no surprise behavior. |

**Sub-decision #1 revised to Option C.** Reasons:
1. Matches existing convention used by 13 other cross-cutting refs (`pre-dispatch-protocol`, `mode-resolver`, `eval-loop-spec`, etc.) — they're top-level canonical with `_shared/` mirrors in every consumer. D13 doesn't invent a new pattern.
2. write-social and evaluate-shortform citations don't change at all (they already cite `references/_shared/platform-intelligence/`).
3. Only brief-shortform's citations change (from `references/platform-intelligence/` skill-local → `references/_shared/platform-intelligence/` mirror, since brief-shortform downgrades from owner to consumer).
4. Sync-script architectural decision properly punts to D14 hygiene slice.

**Net D13 deliverables (revised from Option B → Option C):**
1. Move 7 files: `skills/marketing/brief-shortform/references/platform-intelligence/*` → `references/platform-intelligence/*` (top-level canonical).
2. Recreate `_shared/platform-intelligence/` mirror in `brief-shortform/references/_shared/` (7 files + `.generated-support` marker).
3. Update brief-shortform citations from `references/platform-intelligence/` → `references/_shared/platform-intelligence/` (SKILL.md + playbook.md + dispatch-mechanics.md + examples walkthrough = ~5 hits).
4. Update `.generated-support` markers in write-social + evaluate-shortform to point source at top-level (was `marketing-skills/skills/short-form-brief/...`).
5. Create `_shared/platform-intelligence/` mirror in `optimize-seo/references/_shared/` (7 files + `.generated-support` marker).
6. New `skills/marketing/optimize-seo/references/platform-search.md` (~80 lines) — agent-to-section map.
7. Edit `optimize-seo/SKILL.md` to add platform-search.md to ref list + Quality Gate line.
8. CHANGELOG `[Unreleased]` entry.

**File-count delta:** 21 today (7 source + 14 mirror) → 35 after D13 (7 canonical + 28 mirror). The increase is honest accounting: brief-shortform pretended to own a cross-skill resource; D13 admits it's cross-skill by making it top-level AND giving brief-shortform a mirror like every consumer.

**Manual-sync drift risk** until D14 hygiene slice ships. Accepted: same drift risk that exists for the 13 other shared refs already mirrored this way. D14 unblocks all of them together.

---

## D14 — Workstream C slice 2 (LOCKED 2026-05-19: produce-video MVP, export-mode, multi-runtime)

Locked via interview round 8 (2026-05-19, post-D13). User picked produce-video over publish-social / evaluate-ad / sync-hygiene. Note: the D13 build-time finding tentatively reserved "D14" for sync-skill-support.mjs cleanup. This decision re-uses the D14 label for produce-video; the sync-hygiene slice is now D15 candidate. No file references to a sync-flavored D14 exist yet, so the rename is cost-free.

### Why this slice

Brief 04 mandates three production skills (`produce-asset`, `produce-video`, `publish-social`). D11 landed `produce-asset` as MVP. produce-video is the natural next slice — it pairs with the existing `brief-shortform` skill (already emits shot lists + on-screen text + audio plan + caption + CTA + aspect + length), inherits the D11 export-mode discipline ("No first version should require external APIs to be useful" — brief 04:16), and proves the multi-runtime export pattern the user wants for the production layer.

Pairs cleanly with D8: produce-video emits generation-provenance (`input_artifacts` includes the brief-shortform path + `brand/BRAND.md` + `brand/DESIGN.md`) so a downstream `evaluate-video` skill (backlog) can score the produced video against the brief's spec.

### Scope (v1 — export-mode only, multi-runtime)

**New skill:** `skills/marketing/produce-video/`
- `SKILL.md` — verb-first naming per D1; budget: `standard`; consumes brief-shortform artifact OR generic video-brief schema; produces a multi-runtime export bundle.
- `agents/prompt-author-agent.md` — emits per-shot prompts (visual + on-screen text + voice/TTS spec) and the runtime scaffolds (HyperFrames .html + Remotion .tsx), with platform-aware specs from the brief.
- `agents/critic-agent.md` — sequential critic pass (mirrors D11's single-critic model) with 4 dimensions: Schema-Compliance-and-CTA-Visibility / Brand-Mark-Fidelity / Caption-Pace / Narrative-Arc.
- `references/format-conventions.md` — manifest schema + scenes/ per-shot template + scaffold-file conventions + directory layout.
- `references/anti-patterns.md` — brief 04 § Anti-patterns: don't hallucinate logos, don't override aspect ratio silently, don't strip EXIF on referenced assets, don't generate every variant unbidden. Plus video-specific: don't pad shot durations to hit length targets, don't invent CTAs the brief didn't specify, don't recommend stock-video terms when brand assets exist.
- `references/video-brief-schema.md` — canonical schema doc (per locked sub-decision #3). Defined as a **superset of brief-shortform's existing output**, so brief-shortform requires no patch. Documents required vs optional fields, validation rules, and the brief-shortform-to-schema field map.

**Plugin registration:** `.claude-plugin/plugin.json` — append `./skills/marketing/produce-video/` to skills list + `produce-video` to keywords.

**Output bundle (per locked sub-decision #2 — per-runtime subdirs):**

```
.forsvn/artifacts/mkt/produced-videos/[slug]/
├── manifest.md                  # canonical runtime-agnostic contract (always emitted)
├── scenes/
│   └── [shot-id].md             # per-shot prompt files (visual + OST + voice spec)
├── hyperframes/
│   └── scaffold.html            # HyperFrames composition scaffold + scenes JSON inlined
├── remotion/
│   └── scaffold.tsx             # Remotion composition scaffold
└── vercel-ai-cli.md             # README showing how to pipe scenes/ through `npx ai` / `vercel ai`
```

Always emit all four (HyperFrames scaffold + Remotion scaffold + generic manifest + Vercel AI CLI README) per locked sub-decision #1. Operator picks the downstream runtime — skill never invokes one.

**Not in v1 (explicit deferrals):**
- No actual rendering. No `hyperframes render`, no `npx remotion render`, no Vercel AI CLI execution. Export only.
- No audio file generation. TTS spec only — operator pipes through their own TTS tool. No SRT/VTT in v1.
- No browser-recording route (brief 04 lists it; deferred).
- No publish step / no draft-to-platform. That's `publish-social` (separate D-slice).
- No `playbook.md`, no `procedures/` subdir, no critic-override-log wiring (D8 wires that; produce-video benefits when evaluate-video lands, not in v1).
- No multi-agent parallel-shot prompt-author (sub-decision #4 locked sequential).

### Locked sub-decisions

1. **Scaffolds (always emit all 4):** HyperFrames .html, Remotion .tsx, generic `manifest.md`, Vercel AI CLI README. Per-shot prompt files always emitted under `scenes/`.
2. **Output layout:** per-runtime subdirs (`hyperframes/`, `remotion/`) + top-level `manifest.md`, `scenes/`, `vercel-ai-cli.md`. Cleaner isolation if either runtime grows supporting files later.
3. **Schema home:** `produce-video/references/video-brief-schema.md` — skill-local, not top-level. Re-promotion to `references/` (top-level) is deferred to D15+ if/when a second consumer (evaluate-video) lands.
4. **Critic shape:** sequential prompt-author → single critic-agent pass with 4 dimensions: Schema-Compliance-and-CTA-Visibility (manifest validates + CTA copy present in final shot's on-screen text AND manifest cta field) / Brand-Mark-Fidelity (per-shot prompts cite brand/DESIGN.md only — no invented logos) / Caption-Pace (on-screen-text words ÷ shot duration in target 2-3 words/sec) / Narrative-Arc (hook → body → CTA arc across shots; soft check).
5. **Input contract:** primary input is brief-shortform artifact path. Operator may also pass a hand-written video-brief artifact matching the schema. Skill validates against `video-brief-schema.md` before dispatch — fails fast with NEEDS_CONTEXT if required fields missing.
6. **TTS handling:** export-mode emits per-shot voice spec (`voice: {gender, tone, pace_wpm, accent, sample_line}`) and narration text. No audio file. No SRT in v1.
7. **Generation provenance (per D8 contract):** required. `input_artifacts` includes the brief-shortform path + `brand/BRAND.md` + `brand/DESIGN.md`. `output_eval: null` until a downstream evaluate-video cycle scores the produced video.
8. **Budget tier:** `standard` per D11 produce-asset pattern. `--fast` collapses to single prompt-author pass + light critic; `--deep` available but not default.
9. **No new top-level folder.** Produced videos land under `.forsvn/artifacts/mkt/produced-videos/` per the canonical Artifact Placement contract — pipeline-lifecycle, not canonical sources of truth.
10. **D14 label re-use:** the D13 build-time finding mentioned "D14 hygiene slice" for sync-skill-support.mjs cleanup. That sync-hygiene work is renumbered to D15 candidate. No code references to the prior D14 reservation exist, so the rename is cost-free.

### Acceptance

- `skills/marketing/produce-video/SKILL.md` exists with verb-first frontmatter, generation-provenance pattern wired in, brief 04's 4 Critical Gates (export-mode-only floor, schema-and-CTA, brand-mark fidelity, caption-pace), and budget `standard`.
- `agents/prompt-author-agent.md` + `agents/critic-agent.md` exist with role/input/output contracts; critic-agent enumerates the 4 dimensions from sub-decision #4.
- `references/format-conventions.md` defines the manifest schema + scenes/ per-shot template + scaffolds/ file conventions.
- `references/anti-patterns.md` covers brief 04's anti-patterns + video-specific anti-patterns from the scope section above.
- `references/video-brief-schema.md` exists with required-vs-optional fields + brief-shortform-to-schema field map.
- `.claude-plugin/plugin.json` updated; `grep "produce-video" .claude-plugin/plugin.json` returns ≥2 hits (skill path + keyword).
- CHANGELOG `[Unreleased]` entry written.

### Risks accepted

| Risk | Accepted because |
|---|---|
| Multi-runtime scaffolds (HyperFrames + Remotion + Vercel AI CLI) may rot independently | All three are recommendations + operator choice, not invocations. If a runtime's API changes, the scaffold becomes stale but the canonical manifest survives — operator can regenerate scaffolds from manifest. |
| Sequential single-critic may miss narrative arc on long videos (8+ shots) | brief-shortform's target is short-form (≤60s, typically 3-6 shots). Long-form is parked per brief 04 scope. Multi-critic adds cost without v1 benefit. |
| Schema-local-to-skill means evaluate-video (future) has to import or duplicate it | D15+ can promote the schema to top-level `references/` when a second consumer lands. Premature promotion now adds drift risk. |
| TTS spec without audio means operator has more downstream work | Matches brief 04 export-mode principle ("complete render script and asset manifest when runtime unavailable"). Audio-generation API is v2 surface. |

### Status

DONE — built 2026-05-19. 5 files under `skills/marketing/produce-video/` (SKILL.md, 2 agents, 3 references); `plugin.json` registered (skills list + keywords, 2 hits); CHANGELOG `[Unreleased]` entry written. Acceptance checks pass: verb-first frontmatter ✓, 4 Critical Gates ✓, generation-provenance wired ✓, critic enumerates 4 dimensions ✓, brief-shortform field map ✓. User owns version bump + git commit + push.

---

## D15 — Workstream D slice 2 (LOCKED 2026-05-19: evaluate-ad MVP, synthetic ad-demo loop)

Locked via interview round 9 (2026-05-19, post-D14). User picked evaluate-ad over publish-social / sync-hygiene / extract-service.

### Why this slice

Brief 05 § Eval Skills explicitly lists `evaluate-ad` as one of four eval surfaces (alongside `evaluate-content`, `evaluate-campaign`, and the already-shipped landing-page + short-form pair). write-ad has been live since the 2.0 rename with a 7-dim brief-time critic rubric but **zero post-launch eval feedback path**. Operators run Meta ads from write-ad's output and have no canonical place to score CTR / CPA / ROAS / frequency / fatigue against the original brief's hypothesis. evaluate-ad closes the loop.

Pairs cleanly with D8: write-ad already emits generation-provenance per the D8 contract; evaluate-ad consumes that provenance to ground scoring against `input_artifacts` (the brief), and emits its own provenance pointing at the eval cycle.

### Scope (v1)

**New skill:** `skills/marketing/evaluate-ad/`
- `SKILL.md` — verb-first; budget `standard`; mirrors `evaluate-landing-page`'s 4-agent shape, 8-section body, 10-field frontmatter, 8-col results.tsv.
- `agents/metric-ingest-agent.md` — normalizes operator-supplied metrics (CTR, CPA, ROAS, spend, conversions, frequency, sample size, window, source caveats). Audience-temperature aware.
- `agents/diagnosis-agent.md` — connects observed metrics to write-ad artifact's hypothesis (hook, anchor, audience-temp framing, CTA), creative-fatigue signals, audience-match signals.
- `agents/recommendation-agent.md` — keep/discard/watch/blocked verdict + next-cycle action (rotate creative / refresh hook / shift budget / kill / route back to write-ad with revised brief).
- `agents/critic-agent.md` — 7-dim rubric enforcement; routes critic-override to `scripts/eval/log-critic-override.ts`.
- `references/playbook.md` — why this skill exists, methodology, when NOT to use, history.
- `references/rubric.md` — 7 dims at 0-10 (per locked sub-decision #1): Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Audience-Temp Fidelity / Creative-Fatigue Awareness / Ledger Correctness. Falsifiability rules + revision protocol per brief 05.
- `references/format-conventions.md` — evaluation artifact template (10-field frontmatter + 8-section body + Evidence 6-col + Results Row 8-col) byte-aligned with evaluate-landing-page where possible; ad-specific Evidence columns (Signal / Current / Baseline / Window / Source / Caveat — same shape).
- `references/anti-patterns.md` — ad-eval-specific (fabricated attribution, conflating cold-audience CTR with retargeting CTR, confidence inflation on low-spend windows, scope drift to redesigning the LP under the ad, etc.) + cross-cutting marketing-stack rows.
- `references/procedures/pre-dispatch.md` — read order, Cold Start 5-question bundle, hard-block conditions, audience-temp validation.
- `references/procedures/dispatch-mechanics.md` — Layer 1 parallel (Metric Ingest + Diagnosis) → Layer 2 Recommendation → Layer 3 Critic + override protocol.

**Synthetic demo loop:** `.forsvn/loops/ad-demo/`
- `program.md` — loop operating contract; primary metric: ROAS (operator-pick-per-cycle proven via this synthetic example).
- `context.md` — synthetic product + audience + baseline.
- `results.tsv` — header row + one synthetic cycle row.
- `evals/2026-05-19-cycle-1.md` — one synthetic cycle artifact proving the skill end-to-end.
- `learnings.md` — empty seed.

**Plugin registration:** `.claude-plugin/plugin.json` — append `./skills/marketing/evaluate-ad/` + keyword.

**CHANGELOG:** `[Unreleased]` entry.

### Locked sub-decisions

1. **Rubric:** 7 dims at 0-10 — Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Audience-Temp Fidelity (ad-specific, replaces evaluate-landing-page's Boundary Control) / Creative-Fatigue Awareness (ad-specific, brief 05 explicitly calls frequency/fatigue) / Ledger Correctness. Pass gate: aggregate ≥ 49/70 AND every per-dim ≥ 6. Lives in `references/rubric.md` per brief 05 § Rubrics nudge. Version `v0.1` — provisional, mandatory revision after cycles 2-3 per brief 05's revision trigger.
2. **Agent shape:** 4 agents byte-aligned with evaluate-landing-page (Metric Ingest + Diagnosis + Recommendation + Critic). Layer 1 parallel, Layer 2 sequential, Layer 3 critic.
3. **Primary metric:** operator-picks-per-cycle via loop's `program.md`. evaluate-ad does not hard-code CTR / CPA / ROAS as the singular primary metric — different cycles may prioritize different metrics (cold-traffic prospecting → CTR + CPA; retargeting → ROAS + frequency; awareness → reach + frequency).
4. **Audience-temperature handling:** one cycle per audience-temp. Mirrors write-ad's pattern (one artifact per audience-temp). Operator runs evaluate-ad twice for campaigns spanning both. critic-agent's "Audience-Temp Fidelity" dim catches contaminated metric ingest (e.g., warm-audience signals scored against a cold creative).
5. **Demo loop scope:** synthetic `.forsvn/loops/ad-demo/` with a single Cycle 1 artifact. Pairs with D8's `lp-demo` precedent — proves infra end-to-end, no real campaign required.
6. **Results.tsv schema:** 8 columns (cycle / date / artifact / primary_metric / value / baseline / status / description) — byte-identical to evaluate-landing-page. status ∈ `{keep, discard, watch, blocked}` enforced by critic Hard Fail.
7. **Critic override protocol:** mirrors evaluate-landing-page — `scripts/eval/log-critic-override.ts` invocation with `--skill evaluate-ad` + failed dim + operator reason. Three valid overrides on same dim triggers rubric revision (D8 contract).
8. **Generation provenance (per D8):** required. `input_artifacts` includes the write-ad artifact + `brand/BRAND.md` + relevant `research/icp-research.md` (for audience-temp validation).
9. **Append helper:** reuse existing `scripts/append-loop-result.ts` — no new script. evaluate-landing-page already proved this works.
10. **Routing:** `routing.position: evaluation` + `routing.lifecycle: evaluation`. `defers-to: run-eval-loop` (loop missing), `write-ad` (need next-cycle creative), `plan-campaign` (channel-strategy issue not creative).

### Acceptance

- `skills/marketing/evaluate-ad/SKILL.md` exists with verb-first frontmatter, 6 Critical Gates, 4-agent manifest, generation-provenance pattern, budget `standard`.
- 4 agent files exist with role/input/output contracts; critic-agent enumerates the 7 rubric dims.
- `references/rubric.md` exists with 7 dimensions × 0-10 bands + auto-fail conditions + revision protocol.
- `references/format-conventions.md` defines the 10-field frontmatter + 8-section body + 6-col Evidence table + 8-col Results Row.
- `references/anti-patterns.md` covers ad-eval-specific + cross-cutting rows.
- `references/procedures/{pre-dispatch,dispatch-mechanics}.md` exist.
- `references/playbook.md` exists.
- `.forsvn/loops/ad-demo/` exists with program.md + context.md + results.tsv (header + 1 row) + evals/2026-05-19-cycle-1.md + learnings.md.
- `.claude-plugin/plugin.json` updated; `grep "evaluate-ad" .claude-plugin/plugin.json` returns ≥2 hits (skill path + keyword).
- CHANGELOG `[Unreleased]` entry written.

### Risks accepted

| Risk | Accepted because |
|---|---|
| Rubric v0.1 will need calibration after first 2-3 real cycles | Brief 05 explicitly designs rubrics as provisional + revision-triggered. v0.1 signals this to operators. |
| Synthetic demo loop doesn't validate against real ad performance | Same precedent as D8's `lp-demo` — infra proof, not ad-strategy proof. Real-ad cycle is operator follow-up. |
| 7-dim rubric is heavier than 6-dim — more critic rewrite cycles | Brief 05 explicitly calls frequency/fatigue; burying it under Metric Integrity loses the signal. Tradeoff accepted. |
| Audience-Temp Fidelity dim has subjective scoring on contaminated metric ingest | Falsifiability rules in rubric.md include explicit checks (was the audience targeting in metrics source actually the cold-traffic stack? Was retargeting frequency capped correctly?). |

### Status

DONE — built 2026-05-19. 11 new files under `skills/marketing/evaluate-ad/` (SKILL.md + 4 agents + 6 references including `rubric.md` with 7-dim 0-10 bands + Hard Fails + revision triggers). 5 files under `.forsvn/loops/ad-demo/` (program.md, context.md, results.tsv with 1 cycle row, evals/2026-05-19-cycle-1.md, learnings.md) prove the infra end-to-end on a synthetic cold-traffic ROAS cycle. `plugin.json` registered (skills list + keywords, 2 hits). CHANGELOG `[Unreleased]` entry written (skill count 34 → 35). Acceptance checks pass: verb-first frontmatter ✓, 7 Critical Gates ✓, 4-agent shape byte-aligned with evaluate-landing-page ✓, critic enumerates 7 dimensions ✓, `references/rubric.md` 7 dims × 0-10 + revision triggers ✓, generation-provenance per D8 contract wired ✓, ad-demo loop scaffolded ✓. User owns version bump + git commit + push.

---

## D16 — Workstream C slice 3a (LOCKED 2026-05-19: publish-social MVP, integration-aware, export + Typefully draft)

Locked via interview round 10 (2026-05-19, post-D15). User picked publish-social over evaluate-content / sync-hygiene / plan-campaign platform-intel wiring. Push-back round (10b) sliced the original "export+draft+publish, 9 platforms, browser-automation" scope into 3 sub-slices to preserve the one-session-per-D-slice cadence; D16 ships slice 3a only.

### Why this slice

Closes the third gap in brief 04's production trio (produce-asset shipped in D11, produce-video in D14). Without publish-social, `write-social` output goes nowhere — operators copy-paste into schedulers manually. publish-social automates the per-platform formatting + scheduler-handoff, and adds **Typefully API draft** as the one clean API integration (X/Twitter's scheduler ecosystem is the most consolidated; LinkedIn / IG / FB drafts require browser-automation, which is D17). User's "if it's just export there's nothing different from write-copy" complaint (round 10b) is answered by: D16 emits **scheduler-import-ready files** (Typefully JSON / Buffer CSV / Hootsuite CSV / generic CSV) plus Typefully API drafts — the operator pastes one file into their scheduler or finds drafts already in Typefully. That's execution, not text emission.

**Integration-aware design** (user-locked, round 10c): skill probes for credentials at invocation, picks the highest mode available without operator-mode-selection friction. No credentials → scheduler-import export for all 9 platforms. Typefully API key present → X-platform goes draft route via Typefully Draft API; other 8 platforms still export. Auto-detect never picks `publish` even with all credentials; `--mode=publish` is opt-in only and BLOCKED in D16 (D18).

Pairs cleanly with D8: publish-social emits generation-provenance (`input_artifacts` includes the write-social path + optional produce-asset + produce-video manifests + brand/BRAND.md) so a downstream `evaluate-content` skill (backlog) can score the published output against the brief's hypothesis.

### Scope (v1 — slice 3a only)

**New skill:** `skills/marketing/publish-social/`
- `SKILL.md` — verb-first per D1; budget `standard`; consumes write-social artifact + optional produce-asset manifest + optional produce-video manifest; produces `.forsvn/artifacts/mkt/published-social/[slug]/...`
- `agents/formatter-agent.md` — per-platform formatting + scheduler-import file emission + Typefully API draft when credentials present
- `agents/critic-agent.md` — 6-dim sequential rubric
- `references/format-conventions.md` — output bundle schema (manifest + per-platform + scheduler-imports + README)
- `references/anti-patterns.md` — publish-social-specific (credential leakage, shadowban triggers, mass-tagging, link-in-bio bait, broken Unicode, silent character truncation, scheduler-CSV column drift) + cross-cutting marketing-stack rows
- `references/scheduler-formats.md` — Typefully JSON / Buffer CSV / Hootsuite CSV / generic CSV schemas (covers Hushuy / Later / Publer / Sprout long tail)
- `references/platform-credentials.md` — env-var contract + `.forsvn/credentials/platforms.json` fallback + auto-detect rules + setup instructions + safety constraints
- `references/rubric.md` — 6 dims × 0-10 + pass gate + auto-fail conditions
- `references/playbook.md` — methodology, when not to use, integration-aware mode resolution narrative
- `references/platforms/{x,linkedin,instagram,youtube,tiktok,facebook,bluesky,threads,reddit}.md` — 9 platform refs with char caps, hashtag rules, media specs, CTA conventions, algorithm-truncation points

**Plugin registration:** `.claude-plugin/plugin.json` — append `./skills/marketing/publish-social/` to skills list + `publish-social` to keywords.

**Output bundle layout:**

```
.forsvn/artifacts/mkt/published-social/[slug]/
├── manifest.md                       # canonical bundle contract (always emitted)
├── platforms/
│   ├── x.md
│   ├── linkedin.md
│   ├── instagram.md
│   ├── youtube.md
│   ├── tiktok.md
│   ├── facebook.md
│   ├── bluesky.md
│   ├── threads.md
│   └── reddit.md                     # per-platform native-formatted draft (Markdown)
├── scheduler-imports/
│   ├── typefully.json                # paste-ready Typefully import OR drafted IDs if API used
│   ├── buffer.csv
│   ├── hootsuite.csv
│   └── generic.csv                   # Hushuy / Later / Publer / Sprout long tail
└── README.md                         # how to paste into each scheduler + Typefully draft URLs (if API used)
```

**Not in v1 (explicit deferrals):**
- No browser-automation drafts (LinkedIn / IG / FB / TikTok / etc.). D17 (slice 3b).
- No `--publish` mode for any platform. D18 (slice 3c) — requires current-session confirmation gate + rollback + dry-run.
- No Typefully *publish* endpoint — D16 uses Typefully *Draft* API only.
- No agent-browser dependency.
- No multi-platform draft beyond Typefully.
- No scheduling-time selection (the scheduler-import file carries the post body; operator picks the schedule inside their scheduler tool).
- No D8 critic-override-log wiring (production skill, not eval skill — production critic FAILs trigger re-dispatch per D11 pattern).
- No `playbook.md` worked-example walkthrough; deferred to first real publish-social run in a project.

### Locked sub-decisions

1. **Integration-aware auto-detect.** Skill probes for credentials at invocation:
   - `TYPEFULLY_API_KEY` env var OR `.forsvn/credentials/platforms.json` with `typefully.api_key` set → X-platform output goes draft route via Typefully Draft API; bundle includes `typefully.json` carrying drafted IDs + URLs.
   - No credentials → all 9 platforms emit as scheduler-import files (4 schedulers) + per-platform native drafts for operator manual paste.
   - `--mode=export` forces export-only regardless of credentials.
   - `--mode=publish` returns BLOCKED with "deferred to D18 — explicit confirmation gate not yet implemented".
   - `--mode=draft` for non-X platforms returns BLOCKED with "deferred to D17 — browser-automation route not yet implemented".
2. **Platforms (9):** x, linkedin, instagram, youtube, tiktok, facebook, bluesky, threads, reddit. The 6 in platform-intelligence catalog (D13: x, linkedin, reels-as-instagram, shorts-as-youtube, tiktok, plus the _template) get richer treatment via `references/_shared/platform-intelligence/` mirror citations (Hook Taxonomy / Format Constraints / Algorithm Signals / Anti-Patterns). The 4 platforms not in the catalog (facebook, bluesky, threads, reddit) ship template-only — char caps + media specs + hashtag rules — with "algorithm signals deferred until platform-intelligence catalog expansion" notes.
3. **Scheduler formats (4):**
   - **Typefully JSON** — `{ "posts": [{ "platform": "twitter", "body": "...", "media": [...], "tags": [...] }] }`. Doubles as the API draft body when credentials present.
   - **Buffer CSV** — `platform,scheduled_at,body,media_url,tags,link`. Industry-standard 6-col format.
   - **Hootsuite CSV** — `Date,Time,Platform,Message,Link,Image,Approver`. 7-col Hootsuite-bulk-import schema.
   - **Generic CSV** — `platform,datetime,body,media_urls,hashtags,link`. Long-tail catch (Hushuy / Later / Publer / Sprout); operator hand-tunes if their scheduler has a stricter schema.
4. **Credentials:**
   - Primary: env vars (`TYPEFULLY_API_KEY` etc., per-platform names documented in `references/platform-credentials.md`).
   - Fallback: `.forsvn/credentials/platforms.json` (gitignored — D16 ensures `.gitignore` has `.forsvn/credentials/` entry).
   - Schema: `{ "typefully": { "api_key": "..." }, "buffer": { "access_token": "..." }, ... }` (future-extensible for D17).
   - Never log credential values; never echo them in skill output; never include them in CHANGELOG / manifest / README; redacted-by-default rule applies in error messages.
   - Setup helper: if `.forsvn/credentials/` doesn't exist when a draft-capable platform is requested, formatter-agent creates the directory + a stub `.gitignore` + an example `platforms.json.example` so operator can fill it in offline.
5. **Input contract (chained per round 10 answer):**
   - **Primary:** write-social artifact path (required). Skill reads platform + variants + media references from the artifact.
   - **Optional:** produce-asset manifest path (carousel / image media for IG / FB / X carousels).
   - **Optional:** produce-video manifest path (video media for IG Reels / TikTok / Shorts / Threads video).
   - Skill validates all inputs against their respective schemas before dispatch; fails fast with NEEDS_CONTEXT if write-social artifact missing.
6. **Agent shape:** 2 agents, sequential — formatter-agent (per-platform formatting + scheduler-import file emission + Typefully API draft when credentials present) → critic-agent (6 dims, single pass). Mirrors D11/D14.
7. **Critic rubric (6 dims at 0-10, lives in `references/rubric.md`):**
   - **Platform Char-Cap Compliance** — every platform variant within hard limit (X 280 / Threads 500 / Bluesky 300 / LinkedIn 3000 / IG 2200 / Facebook 63206 / YouTube description 5000 / TikTok 2200 / Reddit title 300 + body 40000). Hard fail if any platform variant exceeds limit by >0 chars.
   - **Media Spec Compliance** — aspect, file size, format per platform (e.g., IG square 1080×1080 / IG portrait 1080×1350 / X image 1200×675 / LinkedIn 1200×627 / etc.). Cross-checks media URLs against produce-asset / produce-video manifests when provided.
   - **CTA Visibility** — CTA copy present where algorithm-truncation lands (e.g., X CTA in first 280 chars / LinkedIn CTA above-the-fold before "see more" cutoff at ~210 chars / IG CTA above the "more" cutoff at ~125 chars / etc.).
   - **Hashtag-Rules Per Platform** — IG up to 30 / LinkedIn 3-5 / X 1-2 / TikTok 3-5 / Threads 1-3 / Bluesky 1-3 / FB 1-2 / YouTube description 3-5 / Reddit 0 (subreddit ≠ hashtag). Positioned per platform convention.
   - **Scheduler-Format Validation** — Typefully JSON parses cleanly + matches API draft contract / Buffer CSV columns correct + UTF-8 + escaped commas / Hootsuite CSV columns correct + datetime format correct / generic CSV columns correct.
   - **Anti-Pattern Compliance** — no shadowban triggers (mass-tagging, excessive hashtags above platform threshold, link-in-bio bait, banned-word per-platform list), no platform-policy-violating copy, no broken Unicode, no credential leakage in any output file (anti-pattern dim explicitly greps for `_KEY` / `_TOKEN` / `_SECRET` patterns in emitted files).
   - **Pass gate:** aggregate ≥ 42/60 AND every per-dim ≥ 6. Per-dim <6 = FAIL even on passing aggregate (catches single-platform contamination).
8. **Critical Gates (6 in SKILL.md):**
   - Gate 1: Export-mode floor — auto-detect never picks `publish`; `--mode=publish` always BLOCKED with explicit deferral message.
   - Gate 2: D17 deferral — non-X `--mode=draft` always BLOCKED with explicit deferral message; only Typefully (X) draft is in scope.
   - Gate 3: Credential safety — credential values never logged, echoed, or written to any artifact; `.forsvn/credentials/` enforces gitignore.
   - Gate 4: Char-cap enforcement — every platform variant within hard limit (critic dim 1 hard fail).
   - Gate 5: Scheduler-format validation — JSON parses, CSV columns correct (critic dim 5).
   - Gate 6: Generation provenance per D8 — `input_artifacts` lists write-social + optional produce-asset + produce-video manifests + brand/BRAND.md.
9. **Generation provenance per D8:** required. `input_artifacts: [write-social_artifact_path, ...optional produce-asset/video manifests, brand/BRAND.md]`. `output_eval: null` until a future `evaluate-content` cycle scores the published-social output.
10. **Budget tier:** `standard`. `--fast` collapses to single formatter pass + light critic (3-dim spot check); `--deep` available but not default.
11. **Routing:** `position: production`. `lifecycle: pipeline`. `defers-to`: `write-social` (no copy yet) / `produce-asset` (carousel media missing) / `produce-video` (video media missing) / `create-brand` (brand tokens missing).
12. **No new top-level folder.** Published-social bundles land under `.forsvn/artifacts/mkt/published-social/` per canonical Artifact Placement contract — pipeline-lifecycle, not canonical source of truth.
13. **No D8 critic-override-log wiring.** publish-social is a production skill, not an eval skill — critic-override is for eval-skill operator overrides. Production critic FAILs trigger re-dispatch (max 2 cycles) per D11/D14 pattern.

### Acceptance

- `skills/marketing/publish-social/SKILL.md` exists with verb-first frontmatter, 6 Critical Gates, 2-agent manifest, generation-provenance pattern, budget `standard`.
- 2 agent files exist with role/input/output contracts; critic-agent enumerates the 6 rubric dims.
- `references/rubric.md` exists with 6 dims × 0-10 bands + auto-fail conditions + pass gate.
- `references/format-conventions.md` defines the manifest + per-platform draft + scheduler-imports + README schemas.
- `references/anti-patterns.md` covers publish-social-specific + cross-cutting rows.
- `references/scheduler-formats.md` defines 4 scheduler import schemas (Typefully JSON, Buffer CSV, Hootsuite CSV, generic CSV).
- `references/platform-credentials.md` defines env-var + `.forsvn/credentials/` contract + setup helper rules.
- `references/playbook.md` exists.
- `references/platforms/` contains 9 platform refs (x, linkedin, instagram, youtube, tiktok, facebook, bluesky, threads, reddit).
- `.claude-plugin/plugin.json` updated; `grep "publish-social" .claude-plugin/plugin.json` returns ≥ 2 hits (skill path + keyword).
- CHANGELOG `[Unreleased]` entry written. 35 → 36 skills.

### Risks accepted

| Risk | Accepted because |
|---|---|
| Typefully API contract may change; D16 hard-codes the current draft endpoint | Short-term churn is acceptable; Typefully has been stable; future slice abstracts API client behind shared scheduler-client ref if other APIs follow |
| Scheduler-import schemas (Buffer, Hootsuite, generic) may drift from those tools' actual import expectations | Generic CSV is documented as hand-tunable; `references/scheduler-formats.md` notes "schema as of 2026-05-19; verify against each scheduler's current import spec on first use" |
| 4 of 9 platforms (FB, Bluesky, Threads, Reddit) ship without platform-intelligence catalog backing | Template-only is honest; future slice promotes these into the platform-intelligence catalog when real demand surfaces. Per-platform refs include placeholder "algorithm signals: TBD" sections to be filled later |
| Auto-detect of Typefully credentials only — other API drafts (LinkedIn API draft via developer app) not supported | LinkedIn API draft requires OAuth flow; out of scope for D16. D17 absorbs browser-automation route (simpler — uses operator's existing browser session) |
| Credential leakage risk via inadvertent logging | Critical Gate 3 + critic anti-pattern dim explicit greps for `_KEY`/`_TOKEN`/`_SECRET` patterns; `.forsvn/credentials/` gitignored; never echoed in output |
| Auto-detect picks API draft mode without operator awareness | Manifest README explicitly states which mode ran (export vs Typefully API draft) + which credentials were detected; operator can audit. `--mode=export` overrides for opt-out |

### Status

DONE — built 2026-05-19. 20 new files under `skills/marketing/publish-social/`: 1 SKILL.md + 2 agents (formatter + critic) + 6 cross-cutting references (format-conventions, anti-patterns, scheduler-formats, platform-credentials, rubric, playbook) + 9 platform refs (x, linkedin, instagram, youtube, tiktok, facebook, bluesky, threads, reddit) + 2 procedure docs (pre-dispatch, dispatch-mechanics). `plugin.json` registered (skills list + keywords, 2 hits; description updated to 36 skills). CHANGELOG `[Unreleased]` entry written (skill count 35 → 36). Acceptance checks pass: verb-first frontmatter ✓, 6 Critical Gates ✓, 2-agent sequential shape ✓, 6-dim rubric with auto-fail conditions ✓, 4 scheduler-format schemas ✓, 9 platform refs ✓, generation-provenance per D8 contract wired ✓, credential safety (binary detection, gitignored fallback, setup helper) documented ✓. **Sliced delivery confirmed:** D17 (browser-automation drafts) + D18 (--mode=publish with confirmation gate) explicitly scoped in playbook.md § History as follow-ups. User owns version bump (`bun scripts/bump-marketplace.ts ...`), git commit, push, GitHub release.

---

## D17 — Workstream C slice 3b (LOCKED 2026-05-19: publish-social browser-automation drafts, 8 platforms, session-cookie auth)

Locked via interview round 11 (2026-05-19, post-D16). User picked publish-social slice 3b over D18 / evaluate-content / sync-hygiene. Round 11b: 8 platforms ("ideally we want for all, but worst-case create a draft on the platform, users hit send manually" → fallback chain locked) / session cookies / show-all-drafts + single confirm.

### Why this slice

Brief 04 names `--mode=draft` as a first-class mode but D16 only shipped it for X via Typefully API. The other 8 platforms (LinkedIn / IG / FB / TikTok / YT / Threads / Bluesky / Reddit) have no API draft endpoints that are operationally clean (LinkedIn requires business verification + OAuth app; IG/FB require Meta Business Suite app review; TikTok / YT have draft APIs locked behind business-app approval). Browser-automation via session cookies is the only operator-controllable draft route across all 8 — operator already has a logged-in browser session; cookies replicate that session into automated draft submission.

User's exact framing (round 11b): *"the worst-case scenario would be to create a draft on the platform, and then the users will hit send manually."* That's the success path, not the failure path — D17's value IS landing the draft IN the platform (visible in operator's Drafts folder), where the operator hits Send manually. The fallback when automation fails is to D16's export-mode emission for that platform (Markdown draft + scheduler-import row); operator copies into platform UI manually.

### Scope (v1 — slice 3b)

**Extends publish-social skill (no new skill registration):**

**New files:**
- `agents/automation-agent.md` — runs browser-automation flows via `agent-browser` skill; called by formatter-agent in Layer 2 when draft route resolves
- `references/automation-flows/{linkedin,instagram,facebook,tiktok,youtube,threads,bluesky,reddit}.md` — 8 platform-specific navigation + fill + save-draft flow specs (selector lists, page-state checkpoints, failure-detection patterns)
- `references/session-cookie-export.md` — operator's guide for exporting session cookies per platform (browser-extension method per platform; cookies.txt format spec)
- `references/confirmation-gate.md` — show-all-drafts + single-confirm protocol; defines the operator prompt + skill behavior on yes/no/edit

**Modified files (in publish-social):**
- `SKILL.md` — adds Critical Gate 7 (confirmation gate before any submit); updates Mode Resolution narrative for per-platform draft routes; expands routing block for Route C (per-platform automation)
- `agents/formatter-agent.md` — extends mode resolution: per-platform check for session_cookies presence; dispatches automation-agent when cookies present + draft mode resolves; handles per-platform automation result (success / failed / fallback-to-export)
- `agents/critic-agent.md` — adds dim 7 (Browser-Automation Safety): no auto-submit / confirmation gate ran / no cookie leak in logs / no captcha-bypass attempts. Rubric becomes 7 dims × 0-10 (aggregate ≥ 49/70, every dim ≥ 6).
- `references/platform-credentials.md` — extends schema with `session_cookies` field per platform; documents cookie-export workflow with link to session-cookie-export.md
- `references/format-conventions.md` — manifest schema gains `automation_result_per_platform` field (`success | failed:<reason-class> | fallback-export`); per-platform draft frontmatter gains `draft_url` field (populated when automation succeeded)
- `references/anti-patterns.md` — adds 3 browser-automation patterns: silent auto-submit (publishing without confirmation) / cookie leakage in logs/screenshots / captcha-bypass-attempt (any retry on captcha = fallback to export)
- `references/rubric.md` — adds dim 7 (Browser-Automation Safety) with 0-10 bands + auto-fail conditions
- `references/playbook.md` § History — append D17 entry; bumps v1.x narrative to "shipped 2026-05-19"

**Plugin registration:** no change (skill already registered in D16).

**Confirmation-gate flow:**

```
1. Formatter creates per-platform drafts in memory (per D16 flow).
2. Bundle preview emitted: one line per platform.
   "Drafts ready:
    - LinkedIn: [first 80 chars]...
    - Instagram: [first 80 chars]...
    - ..."
3. Single operator prompt: "Submit drafts to N platforms via browser-automation? [y/N]"
4. On YES → automation-agent runs each platform's flow sequentially.
5. On NO → roll back to D16 export-mode for all platforms; bundle still emits Markdown drafts + scheduler-imports.
6. After automation runs: manifest reports per-platform result + draft URLs (when available).
```

**Per-platform failure handling:**

```
For each platform:
  1. automation-agent invokes agent-browser with platform's flow spec.
  2. agent-browser navigates → loads cookies → fills draft fields → saves draft.
  3. On any failure (selector drift, captcha, login challenge, rate-limit, network):
     - manifest.automation_result_per_platform[plat] = "failed: <reason-class>"
     - That platform falls back to D16 export-mode (Markdown draft + scheduler row already emitted).
     - Other platforms continue.
  4. Single attempt only. No retry-with-backoff (storm risk).
  5. No captcha solving. Any captcha → fallback to export.
  6. No screenshot-on-failure (cookies could leak). Logs are text-only with reason-class only.
```

**Not in v1 (explicit deferrals):**
- No `--mode=publish` (D18 — confirmation gate for live posts requires per-platform confirmation, not the single-prompt this slice uses)
- No retry-with-backoff (single attempt; rollback to export)
- No captcha solving / 2FA / MFA handling
- No screenshot logging (cookies could leak)
- No parallel automation flows (sequential keeps log readable + rate-limit-safe)
- No API-route enhancement for Bluesky / Reddit (consistency wins v1; Bluesky AT Protocol + Reddit OAuth candidate for D17.next)
- No automated cookie-refresh (operator re-exports when manifest flags "session expired")
- No worked-example walkthroughs in flow refs (v1 ships scaffolds; examples land on first real run)

### Locked sub-decisions

1. **8 platforms attempted via browser-automation.** LinkedIn / IG / FB / TikTok / YT / Threads / Bluesky / Reddit. X stays on D16's Typefully API route — no change.
2. **Authentication: session cookies.** New schema in `.forsvn/credentials/platforms.json`:
   ```json
   {
     "typefully": { "api_key": "..." },
     "linkedin": { "session_cookies": "<cookie-string>", "expires_hint": "YYYY-MM-DD" },
     "instagram": { "session_cookies": "...", "expires_hint": "..." },
     ...
   }
   ```
   Cookie string is gitignored (same `.forsvn/credentials/` directory; same .gitignore from D16 setup helper). Never logged. `expires_hint` is operator-supplied (typical: 30 days from export); manifest flags re-export needed when 7 days within hint.
3. **Confirmation gate: show-all-drafts + single confirm.** Skill formats all drafts → emits one-line preview per platform → single prompt → on YES runs automation sequentially. On NO rolls back to export-mode for all. No silent submit.
4. **Failure handling: per-platform fallback.** Automation failure on platform X = manifest flags X as `failed:<reason>` + falls back to D16 export emission for X. Other platforms continue. Single attempt only.
5. **Tool: `agent-browser` skill (referenced via defers-to).** publish-social emits the navigation flow spec; `agent-browser` runs the browser. Coupling is loose — automation-agent calls agent-browser as an MCP/CLI invocation; flow specs in `references/automation-flows/` are tool-agnostic enough that a future Playwright / Puppeteer route could implement the same specs.
6. **Critic dim 7: Browser-Automation Safety.** New rubric dim, 0-10 bands:
   - Verifies confirmation gate ran (skill output shows operator's response)
   - Greps every emitted file + log for cookie patterns (must be zero)
   - Verifies no auto-publish attempted (manifest never has `submitted: true` without confirmation evidence)
   - Verifies no captcha-bypass attempt logged (any captcha → fallback, not retry)
   - Aggregate becomes 7 dims × 0-10, pass gate ≥ 49/70 + every dim ≥ 6
7. **No screenshots in logs.** Even debug screenshots could include cookies / session tokens / draft content. Logs are text-only; failure logs reference URL pattern + error class (e.g., `"failed: login_challenge"`, `"failed: selector_drift"`, `"failed: rate_limit"`, `"failed: captcha"`, `"failed: network"`), never page state.
8. **No automatic cookie refresh.** Operator manually re-exports cookies when manifest flags session expired (within 7 days of `expires_hint`). Automated refresh would require storing operator's login credentials — out of v1 scope.
9. **Sequential automation only.** Per-platform flows run one at a time. Parallel adds: (a) rate-limit risk across platforms running same browser-automation pattern simultaneously; (b) log interleaving / debug complexity; (c) failure-cascade risk. Sequential is the safer v1 default.
10. **D17 modifies existing files; no new skill.** publish-social's plugin.json registration unchanged. CHANGELOG entry goes under `### Changed` (capability extension), not `### Added` (no new skill).

### Acceptance

- `agents/automation-agent.md` exists with role/input/output contract; references agent-browser; documents per-flow dispatch + failure handling.
- 8 automation-flow refs exist under `references/automation-flows/`: linkedin / instagram / facebook / tiktok / youtube / threads / bluesky / reddit. Each carries: login state assumed, navigation sequence, selector list, draft-save action, failure-detection patterns, version + last-verified date.
- `references/session-cookie-export.md` documents per-platform cookie-export workflow (browser extension + manual export options).
- `references/confirmation-gate.md` defines the single-confirm protocol + operator prompt format.
- `SKILL.md` Critical Gates list contains Gate 7 (Confirmation gate before any submit).
- `agents/formatter-agent.md` § Mode Resolution updated to handle per-platform draft routes.
- `agents/critic-agent.md` enumerates 7 rubric dims (was 6); dim 7 = Browser-Automation Safety.
- `references/rubric.md` has 7 dims × 0-10; pass gate ≥ 49/70 + every dim ≥ 6.
- `references/platform-credentials.md` schema extended with `session_cookies` field.
- `references/format-conventions.md` manifest schema gains `automation_result_per_platform` field.
- `references/anti-patterns.md` adds 3 browser-automation patterns (silent auto-submit / cookie leakage / captcha-bypass-attempt).
- `references/playbook.md` § History bumps v1.x to "shipped 2026-05-19" with D17 entry.
- CHANGELOG `[Unreleased]` entry written under `### Changed`.

### Risks accepted

| Risk | Accepted because |
|---|---|
| Session cookies expire (typically 30d on most platforms) | Manifest flags "session expired" clearly when within 7d of expires_hint; operator re-exports; export-mode fallback works in interim. Auto-refresh requires storing login creds — out of scope |
| Selector drift on platform UI updates | Flow refs versioned + dated; failures fall back to export-mode automatically; D17.next absorbs selector-sync work when drift surfaces |
| Aggressive bot-detection on Meta / TikTok / YT | Single-attempt + sequential + no retry-storms avoids account-suspension patterns; any captcha = immediate fallback; operator's normal session pattern (their cookies) less detectable than synthetic-account automation |
| Cookie leakage via debug logs / screenshots | No screenshots; logs text-only with reason-class only; critic dim 7 greps for cookie patterns; .forsvn/credentials/ already gitignored from D16 |
| User cookies stale, automation succeeds without confirmation | Confirmation gate (Critical Gate 7) prevents — operator confirms before any submit; stale cookies fail at auth step → fallback to export |
| 8 platform flows have varying robustness (LinkedIn cleaner than TikTok) | Per-platform fallback isolates risk; LinkedIn working doesn't depend on TikTok working; operator can disable per-platform via `--exclude=tiktok` flag (future) |
| Selectors in flow refs become stale fast | Each flow ref carries `last_verified_date`; manifest warns when running a flow >90d old; operator decides whether to retry |

### Status

DONE — built 2026-05-19. 11 new files added to `skills/marketing/publish-social/`: 1 agent (automation-agent), 8 platform automation-flow refs (linkedin, instagram, facebook, tiktok, youtube, threads, bluesky, reddit), 2 cross-cutting refs (session-cookie-export, confirmation-gate). 8 existing files modified: SKILL.md (Critical Gate 7 added; Gate 2 updated for D17; routing Routes A/B/C/D; agent manifest now 3 agents; refs section enumerated), formatter-agent (mode resolution per-platform; D17 dispatch path with confirmation gate), critic-agent (Dim 7 added; pass gate now 49/70), platform-credentials (session_cookies field per platform; expires_hint; detection rules; file path alternative; safety rules extended), format-conventions (manifest frontmatter 14 fields incl. confirmation_result + automation_result_per_platform; per-platform draft frontmatter 9 fields incl. draft_url + automation_result), anti-patterns (#12 silent auto-submit, #13 cookie leakage, #14 captcha-bypass; quick-ref card updated), rubric (7 dims × 0-10 with auto-fail extended; pass gate 49/70), playbook (§ History v1.1 entry). publish-social directory: 31 total files (was 20 after D16). plugin.json unchanged. CHANGELOG `[Unreleased]` entry written under `### Changed` (capability extension, not new skill). Acceptance checks pass: 7 Critical Gates ✓, 3 agents ✓, 7-dim rubric ✓, 8 automation-flow refs ✓, session-cookie-export.md ✓, confirmation-gate.md ✓, manifest schema gains automation_result_per_platform ✓, 3 new anti-patterns ✓. User owns version bump + git commit + push.

---

## D18 — Workstream C slice 3c (LOCKED 2026-05-19: publish-social `--mode=publish`, live posting, 9 platforms, two-stage confirmation gate)

Locked via interview round 12 (2026-05-19, post-D17). User picked publish-social slice 3c over evaluate-content / extract-service / sync-hygiene. Three load-bearing forks locked: 9-platform scope / two-stage confirmation gate / abort-gate-is-rollback + delete instructions.

### Why this slice

Closes Workstream C. Brief 04 names three modes for publish-social — `export` / `draft` / `publish` — and a hard rule: *"never publish live without explicit current-session confirmation."* D16 shipped `export` + Typefully-X `draft`; D17 shipped browser-automation `draft` for 8 platforms. `publish` is the last mode and the last brief-04 production gap. D16 and D17 both explicitly scoped it as D18, naming three requirements: **current-session confirmation gate, rollback, dry-run**.

`--mode=publish` makes posts live. It is the only mutating, outward-facing path in the whole stack — every safety affordance in this slice exists to honor brief 04's hard rule.

### Scope (v1 — slice 3c)

**Extends publish-social skill (no new skill registration).**

publish goes live on **all 9 platforms**: X via Typefully's schedule-immediate API; the other 8 (LinkedIn / IG / FB / TikTok / YT / Threads / Bluesky / Reddit) via browser-automation Send — extending D17's 8 automation-flow specs from save-draft to publish.

**New file:**
- `references/publish-confirmation-gate.md` — the two-stage live-publish gate protocol. Distinct from D17's `confirmation-gate.md` (which gates drafts with a single y/N). Stage 1: review every full post body → `[y/N]`. Stage 2: final gate — `type PUBLISH to confirm`. Defines prompt format, operator responses, timeout = abort, dry-run interaction.

**Modified files (in publish-social):**
- `SKILL.md` — Critical Gate 1 + 2 rewritten (publish is now a supported mode via `--mode=publish`, not "always BLOCKED"); new Critical Gate 8 (two-stage live-publish gate + critic-before-publish ordering); Route E (publish) added to Routing; mode resolution + Inputs table updated; Quality Gate → 8 dims; manifest field count updated; version `1.1.0 → 1.2.0`. Also fixes accumulated D16→D17 drift (stale "6 Critical Gates" / "7 publish-social-specific patterns" lines).
- `agents/formatter-agent.md` — mode resolution: `publish` no longer returns BLOCKED; documents publish-mode behavior + the critic-before-publish ordering.
- `agents/automation-agent.md` — publish-mode behavior: final step is Send/Post (reads each flow's Publish Variant section), not Save-draft; `publish_result_per_platform` output; X via Typefully schedule-immediate.
- `agents/critic-agent.md` — Dim 8 (Live-Publish Safety); critic runs BEFORE publish (re-ordering note); fixes stale 6-dim / `≥ 42/60` references → 8-dim / `≥ 56/80`.
- `references/rubric.md` — Dim 8 added; pass gate → aggregate ≥ 56/80, every dim ≥ 6; version `v1.1 → v1.2`.
- `references/format-conventions.md` — manifest frontmatter gains `publish_result_per_platform` + `dry_run`; `confirmation_result` enum extended; per-platform `mode` enum gains `published`; per-platform gains `post_url`; version refs → 1.2.0.
- `references/anti-patterns.md` — 3 live-publish anti-patterns: publish without two-stage confirm / publish on critic FAIL / dry-run that actually posts.
- `references/platform-credentials.md` — publish uses the same `session_cookies` + Typefully key; no new credential type; publish-specific safety note added.
- `references/playbook.md` § History — D18 entry; v1.2 narrative.
- 8 `references/automation-flows/{linkedin,instagram,facebook,tiktok,youtube,threads,bluesky,reddit}.md` — each gains a `## Publish Variant (D18)` section: the Send/Post selector + success indicator. Steps 1-5 (navigate / compose / fill) are shared with the draft flow; only the final action differs.

**Plugin registration:** unchanged (skill already registered in D16).

**Layer order (changed for publish — critic gates the irreversible action):**

```
Pre-Dispatch → Formatter (format all posts) → Critic (8-dim, full) → Two-stage gate → Publish → Manifest
```

For export / draft modes the D16/D17 order is unchanged (critic after automation). Only `--mode=publish` moves critic before the action — a live post cannot be fixed after the fact.

**Dry-run:** `--mode=publish --dry-run` prints the exact publish plan (every post body, target account, route per platform: Typefully API vs browser-automation) and exits. No confirmation gate, no posting, no bundle mutation. D16 named dry-run a D18 requirement.

**Rollback:** the two-stage gate IS the rollback — it aborts cleanly before anything posts. Once posts are live, the manifest records every live `post_url` + per-platform manual delete instructions. No automated `--unpublish` (deletion is itself destructive — operator-owned).

**Not in v1 (explicit deferrals):**
- No automated `--unpublish` / delete flow.
- No scheduled publish — `publish` posts immediately; scheduling stays in the scheduler-import path.
- No retry on publish failure (single attempt; per-platform fallback to draft/export).
- No per-platform selective publish inside the gate (two-stage is all-or-nothing for the confirmed set; Stage 1 review can still abort).
- No X browser-automation Send (X stays on Typefully — no X flow file exists).
- No new platforms beyond the 9.

### Locked sub-decisions

1. **Platform scope: all 9** (interview Q1). X via Typefully schedule-immediate API; 8 via browser-automation Send.
2. **Confirmation gate: two-stage** (interview Q2). Stage 1 — show every full post body + target account → `[y/N]`. Stage 2 — `type PUBLISH to confirm`. Anything other than the literal `PUBLISH` at Stage 2 → abort. Timeout (5 min) at either stage → abort. Brief 04's "explicit current-session confirmation."
3. **Rollback: abort-gate + delete instructions** (interview Q3). The gate is the rollback. Live posts get `post_url` + per-platform delete instructions in the manifest. No automated un-publish.
4. **Critic runs BEFORE publish.** Forced by irreversibility. Critic FAIL → re-dispatch formatter (max 2 cycles); still failing → `BLOCKED`, gate never reached. Export / draft modes keep D16/D17 critic-after ordering.
5. **Dim 8 — Live-Publish Safety.** Rubric → 8 dims × 0-10, pass gate ≥ 56/80, every dim ≥ 6. Dim 8 verifies: two-stage gate ran + literal `PUBLISH` recorded + critic passed before publish + no `publish_result.status=published` without `confirmation_result=confirmed` + dry-run never posted. Auto-fails: published-without-confirm / published-on-critic-FAIL / dry-run-that-posted.
6. **Critical Gate 8.** SKILL.md gains Gate 8 (two-stage gate + critic-before-publish). Gate 1 (auto-detect never picks publish) stays — `publish` is `--mode=publish` opt-in ONLY.
7. **X publish route: Typefully schedule-immediate.** Reuses D16's Typefully API client; create-draft with `schedule-date` = immediate / next-free-slot. Typefully API error → X falls back to D16 export-mode (not browser-automation — no X flow).
8. **Publish-failure handling.** A platform that fails to publish (selector drift / captcha / login challenge / rate-limit / network) falls back to its D17 draft route when cookies are present, else D16 export. Single attempt, no retry. Other platforms continue. Manifest records `publish_result_per_platform`.
9. **Automation-flow extension, not new files.** Each of the 8 existing flow specs gains a `## Publish Variant` section — steps 1-5 shared, only the final action (Send vs Save-draft) differs. No 8 new flow files.
10. **publish = immediate.** No schedule-time selection in publish mode.
11. **CHANGELOG** `[Unreleased]` under `### Changed` (capability extension, no new skill — like D17). Skill count unchanged at 36.
12. **D16→D17 drift cleanup** folded in: SKILL.md's stale "6 Critical Gates" / "7 publish-social-specific patterns" lines and critic-agent.md's stale `≥ 42/60` references are corrected while those files are open for D18.

### Acceptance

- `references/publish-confirmation-gate.md` exists with the two-stage protocol (Stage 1 review + Stage 2 typed `PUBLISH`) + timeout=abort + dry-run interaction.
- `SKILL.md` Critical Gates list contains Gate 8; Gate 1 + 2 updated; Route E (publish) in Routing; version `1.2.0`.
- `agents/automation-agent.md` documents publish-mode (Send) behavior + `publish_result_per_platform`.
- `agents/critic-agent.md` enumerates 8 rubric dims; dim 8 = Live-Publish Safety; stale 42/60 numbers corrected to 56/80.
- `references/rubric.md` has 8 dims × 0-10; pass gate ≥ 56/80; version `v1.2`.
- `references/format-conventions.md` manifest schema gains `publish_result_per_platform` + `dry_run`; per-platform schema gains `post_url` + `published` mode value.
- `references/anti-patterns.md` adds 3 live-publish patterns.
- 8 automation-flow refs each have a `## Publish Variant (D18)` section with the Send selector + success indicator.
- `references/playbook.md` § History has a D18 entry.
- `grep -n "mode=publish" skills/marketing/publish-social/SKILL.md` shows publish as a supported mode (no longer "always BLOCKED").
- CHANGELOG `[Unreleased]` entry written under `### Changed`.

### Risks accepted

| Risk | Accepted because |
|---|---|
| Live publishing is irreversible — a bad post is public immediately | Two-stage gate + critic-before-publish + dry-run are the mitigations brief 04 mandates. The skill never auto-publishes; `--mode=publish` is explicit opt-in and auto-detect cannot reach it. |
| Typefully schedule-immediate is not a true "publish now" endpoint | Documented honestly; `schedule-date` = now / next-free-slot is the closest API affordance; Typefully error → X falls back to export. |
| Browser-automation Send is higher-stakes than D17's Save-draft (a misfire is a live post, not a cleanable draft) | Same per-platform single-attempt + sequential pacing + no-captcha-retry discipline as D17; critic runs before any Send; the gate shows full bodies. |
| No automated rollback means a bad post must be deleted by hand | A live post cannot be cleanly un-posted regardless (it may already have impressions); automated delete is a second destructive path not worth v1 surface. Manifest gives per-platform delete instructions. |
| Selector drift on a publish flow Sends via the wrong UI element | Publish Variant selectors are versioned + dated like D17's; failure → fallback to draft/export, never a blind retry. |

### D18 build-time finding (2026-05-19, read-pass on publish-social)

The read-pass before building surfaced three things that refined the plan:

1. **Dim 8 cannot be scored in the critic's pre-gate pass.** Sub-decisions 4–5 said "Critic (8-dim, full)" runs before the gate. But Dim 8 (Live-Publish Safety) checks post-publish facts — confirmation logged, posted rows confirmation-backed, dry-run posted nothing — which do not exist when the critic runs pre-gate. **Resolution:** the critic-agent scores **dims 1–7** as the pre-gate content gate (its verdict gates on those, ≥ 49/70); the **orchestrator's Self-Check Before Delivery applies dim 8** mechanically post-publish and computes the full 8-dim gate (≥ 56/80). One critic invocation, no second pass. `rubric.md`, `critic-agent.md`, `dispatch-mechanics.md`, and `publish-confirmation-gate.md` all state this split. The "critic gates publish" intent of sub-decision 4 holds — the *content* gate (dims 1–7) runs before the operator is ever asked to confirm.

2. **Accumulated D16→D17 drift, corrected in passing.** The D17 pass did not fully sweep its own changes: SKILL.md frontmatter `metadata.version` was still `1.0.0` (never bumped at D17 despite `rubric.md`/`format-conventions.md` going to 1.1); SKILL.md carried stale "6 Critical Gates" / "7 publish-social-specific patterns" counts; `critic-agent.md` still had D16's `≥ 42/60` pass-gate in its Evaluation Process + Self-Check; and `dispatch-mechanics.md`, `pre-dispatch.md`, `playbook.md`'s mode-narrative were left D16-era ("6 dims", "draft deferred to D17"). D18 touches all these files anyway — leaving "6 dims" beside new "8-dim" content would be incoherent — so the drift was corrected in the same pass. `metadata.version` set to `1.2.0`.

3. **Route label.** The decision text mentioned adding "Route E (publish)". SKILL.md already had a **Route D** placeholder (`--mode=publish` → BLOCKED). D18 rewrote that existing Route D into the live publish flow rather than adding a separate Route E — no stale BLOCKED route left behind, no renumbering of A/B/C.

Sub-decision 9 (extend the 8 existing automation-flow files with a `## Publish Variant` section rather than ship 8 new files) was confirmed correct at build — steps 1–5 are genuinely shared with the draft flow; only the final action differs.

### Status

DONE — built 2026-05-19. 1 new file (`references/publish-confirmation-gate.md` — two-stage gate protocol) + 20 modified files under `skills/marketing/publish-social/`: SKILL.md (Critical Gates 1+2 rewritten, Gate 8 added, Route D rewritten as the publish flow, Quality Gate → 8 dims, manifest 16-field / per-platform 10-field counts, agent manifest publish ordering, version `1.0.0`→`1.2.0`); 3 agents (formatter — publish mode resolution + Live-Publish Dispatch; automation — publish-mode Send behavior + `publish_result_per_platform`; critic — dim 8 framing as orchestrator-applied, stale `42/60`→`56/80` fixed); 6 references (rubric — dim 8 + v1.2 + gate ≥ 56/80; format-conventions — `dry_run` + `publish_result_per_platform` + `post_url` + enum extensions; anti-patterns — #15/#16/#17; platform-credentials — D18 publish-mode note; playbook — mode narrative + § History v1.2; confirmation-gate — dim-count line); 2 procedures (dispatch-mechanics — Publish Layer + orchestrator dim-8 Self-Check + drift fixes; pre-dispatch — publish mode resolution); 8 automation-flow refs (each gains a `## Publish Variant (D18)` section). `plugin.json` unchanged (no new skill; skill count stays 36). CHANGELOG `[Unreleased]` entry written under `### Changed`. Acceptance checks pass: `publish-confirmation-gate.md` two-stage protocol ✓, SKILL.md Gate 8 + Route D publish flow + version 1.2.0 ✓, automation-agent publish-mode + `publish_result_per_platform` ✓, critic-agent 8 dims (dim 8 orchestrator-applied) ✓, rubric 8 dims × 0-10 + ≥ 56/80 ✓, format-conventions `publish_result_per_platform` + `dry_run` + `post_url` ✓, 3 new anti-patterns ✓, 8 automation-flow Publish Variant sections ✓, playbook § History D18 ✓, `grep "mode=publish" SKILL.md` shows publish as supported ✓. **Workstream C complete** (produce-asset D11 + produce-video D14 + publish-social D16/D17/D18). User owns version bump (`bun scripts/bump-marketplace.ts ...`), git commit, push, GitHub release.

---

## D19 — Workstream D slice 3 (LOCKED 2026-05-19: evaluate-content MVP, organic-content eval, synthetic content-demo loop)

Locked via interview round 13 (2026-05-19, post-D18). User picked evaluate-content over evaluate-campaign / extract-service / sync-hygiene. Three load-bearing forks locked: lane vs evaluate-shortform / cycle granularity / content-specific rubric dims.

### Why this slice

Brief 05 § Eval Skills lists `evaluate-content` alongside `evaluate-ad` (shipped D15), `evaluate-campaign`, and the already-shipped landing-page + short-form pair. Workstream C just shipped the full production trio (`produce-asset` / `produce-video` / `publish-social`) — content now goes live, but there is no canonical place to score organic-content performance (engagement, scroll/dwell, click-through, conversion, qualitative feedback) against the original brief's hypothesis. evaluate-content closes that loop for the `write-social` → `publish-social` → performance → next-content cycle.

Pairs with D8: write-social already emits generation-provenance; evaluate-content consumes it to ground scoring against `input_artifacts`, and emits its own provenance.

### Scope (v1)

**New skill:** `skills/marketing/evaluate-content/` — mirrors `evaluate-ad`'s structure byte-aligned (4-agent shape, 8-section body, 10-field frontmatter, 8-col results.tsv, 7-dim rubric) for cross-eval consistency. 11 files:
- `SKILL.md` — verb-first; budget `standard`; 7 Critical Gates.
- `agents/metric-ingest-agent.md` — normalizes operator-supplied content metrics (engagement breakdown, scroll/dwell, CTR, conversions, sample size, window, source caveats). Primary-platform-scoped.
- `agents/diagnosis-agent.md` — connects metrics to the write-social artifact's hypothesis (hook, format, CTA, platform framing); cross-platform context signals; engagement-quality signals.
- `agents/recommendation-agent.md` — keep/discard/watch/blocked verdict + next-cycle action (revise hook / reformat for platform / shift platform mix / route back to write-social with a revised brief).
- `agents/critic-agent.md` — 7-dim rubric enforcement; routes critic-override to `scripts/eval/log-critic-override.ts`.
- `references/playbook.md` / `rubric.md` / `format-conventions.md` / `anti-patterns.md` / `procedures/pre-dispatch.md` / `procedures/dispatch-mechanics.md`.

**Synthetic demo loop:** `.forsvn/loops/content-demo/` — `program.md` + `context.md` + `results.tsv` (header + 1 cycle row) + `evals/2026-05-19-cycle-1.md` + `learnings.md`. Mirrors D8 `lp-demo` / D15 `ad-demo` — proves the infra on one synthetic cycle.

**Plugin registration:** `.claude-plugin/plugin.json` — append `./skills/marketing/evaluate-content/` + keyword. 36 → 37 skills.

**CHANGELOG:** `[Unreleased]` under `### Added`.

### Locked sub-decisions

1. **Lane (interview Q1): organic text / image / carousel only.** evaluate-content scores non-video organic content (write-social / publish-social / produce-asset output). Short-form video is **out of scope — defers to `evaluate-shortform`** (a Critical Gate + a `defers-to` entry). Clean lane split, zero overlap; each eval skill owns one content type.
2. **Cycle granularity (interview Q2): one primary platform per cycle, others as context.** One cycle is scoped to an operator-designated **primary platform**; the Evidence table covers that platform's signals; secondary platforms appear in a `Cross-Platform Context` subsection that informs diagnosis but does NOT drive the keep/discard verdict. Replaces evaluate-ad's "one audience-temp per cycle." The ledger description carries the primary-platform tag.
3. **Rubric (interview Q3): 7 dims — 5 generic + 2 content-specific.** Generic (carried from evaluate-ad): Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Ledger Correctness. Content-specific: **Engagement-Quality Discrimination** (meaningful engagement — saves / shares / comments / CTR / conversion — vs vanity — likes / impressions / views; a vanity spike must not read as success) + **Platform-Fit** (was the content native to the primary platform's format + algorithm, and were the metrics read against platform-appropriate benchmarks). Pass gate aggregate ≥ 49/70, every dim ≥ 6. Version `v0.1` provisional — mandatory revision after cycles 2-3 per brief 05.
4. **Agent shape:** 4 agents byte-aligned with evaluate-ad (Metric Ingest + Diagnosis + Recommendation + Critic). Layer 1 parallel, Layer 2 sequential, Layer 3 critic.
5. **Input contract:** primary source artifact = the `write-social` artifact (the content hypothesis being scored). Optional: the `publish-social` bundle manifest (post URLs + provenance). Operator-supplied metrics required. Manual metric entry is the default (brief 05).
6. **Results.tsv schema:** 8 columns (cycle / date / artifact / primary_metric / value / baseline / status / description) — byte-identical to evaluate-ad / evaluate-landing-page. `status ∈ {keep, discard, watch, blocked}`. Reuse `scripts/append-loop-result.ts`.
7. **Existing loop required.** Critical Gate 1 — no `.forsvn/loops/[slug]/program.md` → `NEEDS_CONTEXT`, recommend `/run-eval-loop`. evaluate-content does not scaffold loops.
8. **Generation provenance per D8:** `input_artifacts` lists the write-social artifact + `brand/BRAND.md` + relevant `research/icp-research.md`. `output_eval: null`.
9. **Stack placement:** `skills/marketing/evaluate-content/` (organic marketing content; sibling of evaluate-ad, evaluate-landing-page).
10. **Routing:** `position: evaluation`, `lifecycle: evaluation`. `defers-to`: `run-eval-loop` (loop missing), `write-social` (need next-cycle copy), `evaluate-shortform` (the content is short-form video), `publish-social` (re-distribution issue, not content).

### Acceptance

- `skills/marketing/evaluate-content/SKILL.md` exists with verb-first frontmatter, 7 Critical Gates, 4-agent manifest, generation-provenance pattern, budget `standard`.
- 4 agent files with role / input / output contracts; critic-agent enumerates the 7 rubric dims.
- `references/rubric.md` — 7 dims × 0-10 + auto-fail conditions + revision protocol; v0.1.
- `references/format-conventions.md` — 10-field frontmatter + 8-section body + 6-col Evidence + 8-col Results Row, byte-aligned with evaluate-ad; the `Cross-Platform Context` subsection added.
- `references/anti-patterns.md` / `playbook.md` / `procedures/{pre-dispatch,dispatch-mechanics}.md` exist.
- `.forsvn/loops/content-demo/` exists with program.md + context.md + results.tsv (header + 1 row) + evals/2026-05-19-cycle-1.md + learnings.md.
- `.claude-plugin/plugin.json` updated; `grep "evaluate-content" .claude-plugin/plugin.json` returns ≥ 2 hits.
- CHANGELOG `[Unreleased]` entry written; 36 → 37 skills.

### Risks accepted

| Risk | Accepted because |
|---|---|
| Rubric v0.1 needs calibration after first 2-3 real cycles | Brief 05 designs rubrics as provisional + revision-triggered; v0.1 signals this. |
| Synthetic demo loop doesn't validate against real engagement data | Same precedent as D8 `lp-demo` / D15 `ad-demo` — infra proof, not content-strategy proof. |
| "Primary platform, others as context" can let a weak secondary platform hide | Accepted over per-platform cycles (9× cycles) and pure aggregate (signal loss); the operator can run a fresh cycle with a different primary platform. Diagnosis still surfaces weak secondaries. |
| Lane split with evaluate-shortform leaves a publish-social bundle's video posts to a second skill | Honest — video genuinely needs the short-form-research catalog lens; one bundle → two eval skills is acceptable. Critical Gate routes cleanly. |

### D19 build-time notes (2026-05-19, read-pass on evaluate-ad)

The build mirrored `evaluate-ad` byte-aligned (read-pass confirmed evaluate-ad is the right template — same 4-agent shape, 8-section body, 10-field frontmatter, 8-col results.tsv). Three small refinements surfaced during the build:

1. **8 Critical Gates, not 7.** evaluate-ad has 7. evaluate-content adds the lane gate (Gate 2 — organic non-video only; video → evaluate-shortform, paid → evaluate-ad) as a distinct gate rather than folding it, because the interview made lane discipline load-bearing. Net 8.
2. **Cross-Platform Context is a 4th Diagnosis subsection.** evaluate-ad's Diagnosis has 4 subsections (Likely Drivers / Confounders / Creative-Fatigue / Audience-Match). evaluate-content's are Likely Drivers / Engagement-Quality Signals / Cross-Platform Context / Confounders — the `Cross-Platform Context` subsection is where secondary-platform metrics live, structurally walled off from the verdict per interview Q2.
3. **`_shared/` refs cited, not materialized.** evaluate-content cites `references/_shared/{eval-loop-spec,...}.md` in its References section exactly as evaluate-ad (D15) does — neither skill physically carries the `_shared/` dir (the sync script is broken; D8/D13 finding). evaluate-content matches its sibling; the sync-hygiene slice (backlog) fixes all eval skills' `_shared/` together.

### Status

DONE — built 2026-05-19. 11 new files under `skills/marketing/evaluate-content/` (SKILL.md + 4 agents + 6 references: rubric, format-conventions, playbook, anti-patterns, procedures/pre-dispatch, procedures/dispatch-mechanics) — mirrors evaluate-ad byte-aligned. 5 files under `.forsvn/loops/content-demo/` (program.md, context.md, results.tsv with 1 cycle row, evals/2026-05-19-cycle-1.md, learnings.md) prove the infra end-to-end on a synthetic LinkedIn-carousel cycle (job-title slide-1 hook → +158% save-rate lift, meaningful engagement carrying it, Instagram cross-post held as Cross-Platform Context). `plugin.json` registered (skills list + keyword; description 36 → 37 skills). CHANGELOG `[Unreleased]` `### Added` entry written (skill count 36 → 37). Acceptance checks pass: verb-first frontmatter ✓, 8 Critical Gates ✓, 4-agent shape byte-aligned with evaluate-ad ✓, critic enumerates 7 dimensions ✓, `references/rubric.md` 7 dims × 0-10 (Engagement-Quality Discrimination + Platform-Fit as the content-specific pair) + revision triggers ✓, generation-provenance per D8 contract wired ✓, lane split from evaluate-shortform enforced via Critical Gate 2 + Critic Hard Fail #3 ✓, primary-platform-per-cycle with Cross-Platform Context subsection ✓, content-demo loop scaffolded ✓, `grep "evaluate-content" plugin.json` = 2 hits ✓. User owns version bump (`bun scripts/bump-marketplace.ts ...`), git commit, push, GitHub release.

---

## D20 — Workstream D slice 4 (LOCKED 2026-05-20: evaluate-campaign MVP, aggregate-only campaign eval, synthetic campaign-demo loop)

Locked via interview round 14 (2026-05-20, post-D19). User picked evaluate-campaign over extract-service / sync-hygiene / review-work upgrades. Three load-bearing forks locked: scope (aggregate-only) / cycle granularity (whole-campaign, all-channels) / campaign-specific rubric dims (Channel-Mix Discrimination + Unit-Economics Discipline).

### Why this slice

Brief 05 § Eval Skills names four eval surfaces: `evaluate-ad` (D15), `evaluate-content` (D19), the already-shipped landing-page + short-form pair, and **`evaluate-campaign`** — the last one unbuilt. `plan-campaign` has been live since the 2.0 rename and produces multi-channel campaign plans, but there is no canonical place to score a launched campaign's outcomes (reach, leads, revenue, CAC, channel breakdown) against the plan's hypothesis. evaluate-campaign closes Workstream D's eval-skill quartet.

Pairs with D8: plan-campaign's artifact is the hypothesis source; evaluate-campaign consumes it via `provenance.input_artifacts` and emits its own provenance.

### Scope (v1)

**New skill:** `skills/marketing/evaluate-campaign/` — mirrors `evaluate-content` / `evaluate-ad` byte-aligned (4-agent shape, 8-section body, 10-field frontmatter, 8-col results.tsv, 7-dim rubric). 11 files: SKILL.md + 4 agents (metric-ingest / diagnosis / recommendation / critic) + 6 references (playbook / rubric / format-conventions / anti-patterns / procedures/pre-dispatch / procedures/dispatch-mechanics).

**Synthetic demo loop:** `.forsvn/loops/campaign-demo/` — program.md + context.md + results.tsv (header + 1 cycle row) + evals/2026-05-20-cycle-1.md + learnings.md. Mirrors D8 lp-demo / D15 ad-demo / D19 content-demo.

**Plugin registration:** `.claude-plugin/plugin.json` — append `./skills/marketing/evaluate-campaign/` + keyword. 37 → 38 skills.

**CHANGELOG:** `[Unreleased]` under `### Added`.

### Locked sub-decisions

1. **Scope — aggregate-only (interview Q1).** evaluate-campaign scores campaign-level outcomes from operator-supplied channel-rollup metrics. It does NOT re-score individual ads / posts / landing pages — those are evaluate-ad / evaluate-content / evaluate-landing-page / evaluate-shortform. Per-asset eval artifacts, if present in the loop, are cited as optional context but never re-scored and never drive the verdict. A single-asset scoring request routes to the asset-level sibling. Enforced by Critical Gate 2 + Critic Hard Fail #3.
2. **Cycle granularity — whole campaign, all channels (interview Q2).** One cycle = the entire campaign across every channel, with a per-channel breakdown table inside Diagnosis § Channel-Mix Signals. NOT one cycle per channel — splitting per channel destroys the cross-channel mix analysis that is a campaign's whole point. Replaces evaluate-content's "one primary platform per cycle" / evaluate-ad's "one audience-temp per cycle." The ledger description carries the campaign tag.
3. **Rubric — 7 dims, 5 generic + 2 campaign-specific (interview Q3).** Generic (carried from evaluate-ad / evaluate-content): Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Ledger Correctness. Campaign-specific: **Channel-Mix Discrimination** (separates channels that drove results from channels that rode along — correlation vs causation across the mix; channel-breakdown completeness — every channel that received spend or effort appears in the breakdown) + **Unit-Economics Discipline** (CAC computed honestly — fully-loaded cost ÷ net-new customers; blended vs paid CAC not conflated; payback period / LTV:CAC sane; revenue attribution honest). Maps directly to brief 05's named focus, "CAC, channel breakdown." Pass gate aggregate ≥ 49/70, every dim ≥ 6. Version v0.1 — mandatory revision after cycles 2-3 per brief 05.
4. **Agent shape:** 4 agents byte-aligned with evaluate-content / evaluate-ad (Metric Ingest + Diagnosis + Recommendation + Critic). Layer 1 parallel, Layer 2 sequential, Layer 3 critic.
5. **Input contract:** primary source artifact = the `plan-campaign` artifact (`.forsvn/artifacts/mkt/campaign-plan.md` — the campaign hypothesis being scored). Operator-supplied channel-rollup metrics required. Manual metric entry is the default (brief 05).
6. **Diagnosis subsections:** Likely Drivers / Channel-Mix Signals / Unit-Economics Signals / Confounders. The per-channel breakdown table lives in Channel-Mix Signals (structurally where evaluate-content put Cross-Platform Context); 8 body sections held — no 9th section, byte-alignment with evaluate-ad preserved.
7. **Results.tsv schema:** 8 columns (cycle / date / artifact / primary_metric / value / baseline / status / description) — byte-identical to evaluate-ad / evaluate-content. `status ∈ {keep, discard, watch, blocked}`. Reuse `scripts/append-loop-result.ts` — no new script.
8. **Existing loop required.** Critical Gate 1 — no `.forsvn/loops/[slug]/program.md` → NEEDS_CONTEXT, recommend `/run-eval-loop`. evaluate-campaign does not scaffold loops.
9. **Generation provenance per D8:** `input_artifacts` lists the plan-campaign artifact + `brand/BRAND.md` + `research/icp-research.md`. `output_eval: null`.
10. **Stack placement:** `skills/marketing/evaluate-campaign/` (sibling of evaluate-ad, evaluate-content, evaluate-landing-page).
11. **Routing:** `position: evaluation`, `lifecycle: evaluation`. `defers-to`: run-eval-loop (loop missing), plan-campaign (need next-cycle channel-mix / campaign plan), evaluate-ad / evaluate-content / evaluate-landing-page / evaluate-shortform (operator wants a single asset scored — wrong lane).
12. **8 Critical Gates** (evaluate-content has 8; evaluate-campaign keeps 8): existing loop / aggregate-only campaign scope / measurement evidence / one primary metric / whole-campaign all-channels scope / no fabricated analytics / explicit attribution confidence / does-not-generate-strategy.

### Acceptance

- `skills/marketing/evaluate-campaign/SKILL.md` exists with verb-first frontmatter, 8 Critical Gates, 4-agent manifest, generation-provenance pattern, budget `standard`.
- 4 agent files with role / input / output contracts; critic-agent enumerates the 7 rubric dims.
- `references/rubric.md` — 7 dims × 0-10 + auto-fail conditions + revision protocol; v0.1.
- `references/format-conventions.md` — 10-field frontmatter + 8-section body + 6-col Evidence + 8-col Results Row, byte-aligned with evaluate-content; per-channel breakdown table in Diagnosis § Channel-Mix Signals.
- `references/anti-patterns.md` / `playbook.md` / `procedures/{pre-dispatch,dispatch-mechanics}.md` exist.
- `.forsvn/loops/campaign-demo/` exists with program.md + context.md + results.tsv (header + 1 row) + evals/2026-05-20-cycle-1.md + learnings.md.
- `.claude-plugin/plugin.json` updated; `grep "evaluate-campaign" .claude-plugin/plugin.json` returns ≥ 2 hits.
- CHANGELOG `[Unreleased]` entry written; 37 → 38 skills.

### Risks accepted

| Risk | Accepted because |
|---|---|
| Rubric v0.1 needs calibration after first 2-3 real cycles | Brief 05 designs rubrics as provisional + revision-triggered; v0.1 signals this. |
| Synthetic demo loop doesn't validate against real campaign data | Same precedent as D8 lp-demo / D15 ad-demo / D19 content-demo — infra proof, not campaign-strategy proof. |
| Aggregate-only means a campaign with broken per-asset creative still passes when channel rollups look fine | Honest lane split — per-asset scoring is the asset-level eval skills' job; evaluate-campaign cites their artifacts as context and routes single-asset requests to them. |
| A whole-campaign cycle can let a weak channel hide inside a strong blended number | The Channel-Mix Discrimination dim exists precisely to force the per-channel breakdown and name rider channels; the blended number cannot stand alone. |

### D20 build-time notes (2026-05-20)

The build mirrored `evaluate-content` byte-aligned (read-pass confirmed evaluate-content is the right template — same 4-agent shape, 8-section body, 10-field frontmatter, 8-col results.tsv, 7-dim rubric). Three notes surfaced during the build:

1. **The per-channel breakdown is a table inside Diagnosis § Channel-Mix Signals, not a 9th body section.** Sub-decision 6 anticipated this; confirmed correct at build — it is structurally where evaluate-content put its `Cross-Platform Context` subsection. 8 body sections held; cross-eval byte-alignment with evaluate-ad / evaluate-content preserved. The Evidence table carries campaign-level aggregates (incl. blended CAC and paid CAC as distinct rows); the breakdown table carries per-channel rows.
2. **Learning promotion in the demo follows the D19 precedent, not the strict rule.** `format-conventions.md`'s promotion rule keys a `yes` on `confidence: high` in the cycle verdict. The synthetic `campaign-demo` cycle 1 verdict is `confidence: medium` (a single 4-week synthetic cycle). To exercise the promotion mechanism end-to-end in the infra proof — exactly as D19's `content-demo` did with its own medium-confidence cycle — the cycle promotes a lesson flagged "Provisional learning — D20 infrastructure proof." Real campaign loops follow the strict high-confidence gate.
3. **`learnings.md` uses `status: stable` frontmatter.** `manifest-sync` normalizes that to `done_with_concerns` with a warning. This is byte-identical to `content-demo` and `ad-demo` learnings.md — a pre-existing pattern across all three demo loops, not a D20 regression. Left as-is for consistency.

### Status

DONE — built 2026-05-20. 11 new files under `skills/marketing/evaluate-campaign/` (SKILL.md + 4 agents + 6 references: rubric, format-conventions, playbook, anti-patterns, procedures/pre-dispatch, procedures/dispatch-mechanics) — mirrors evaluate-content byte-aligned. 5 files under `.forsvn/loops/campaign-demo/` (program.md, context.md, results.tsv with 1 cycle row, evals/2026-05-20-cycle-1.md, learnings.md) prove the infra end-to-end on a synthetic 4-channel spring-launch cycle (164 campaign-driven net-new subscribers vs 120 baseline; organic-linkedin + content-seo the genuine drivers at ~1–1.6mo payback; warm-list email classified a rider with its 70 conversions excluded; paid-social a driver-but-underwater channel at $92 CAC → verdict `keep` / `done_with_concerns`, routed to plan-campaign --rev=2). `plugin.json` registered (skills list + keyword; description 37 → 38 skills). CHANGELOG `[Unreleased]` `### Added` entry written (skill count 37 → 38). Acceptance checks pass: verb-first frontmatter ✓, budget `standard` ✓, 8 Critical Gates ✓, 4-agent shape byte-aligned with evaluate-content ✓, critic enumerates 7 dimensions ✓, `references/rubric.md` 7 dims × 0-10 (Channel-Mix Discrimination + Unit-Economics Discipline as the campaign-specific pair) + revision triggers ✓, generation-provenance per D8 contract wired ✓, aggregate-only scope enforced via Critical Gate 2 + Critic Hard Fail #3 ✓, whole-campaign-all-channels per cycle with the per-channel breakdown table ✓, campaign-demo loop scaffolded (results.tsv 8 columns, manifest-sync clean) ✓, `grep "evaluate-campaign" plugin.json` = 2 hits ✓. **Workstream D complete** (evaluate-landing-page + evaluate-shortform pre-roadmap, evaluate-ad D15, evaluate-content D19, evaluate-campaign D20). User owns version bump (`bun scripts/bump-marketplace.ts ...`), git commit, push, GitHub release.

---

## D21 — Workstream F slice 2 (extract-service skill — BACKFILLED 2026-05-20)

**Backfill note.** D21 was built and committed (`15800a2`) without a `decisions.md` entry — a PR1 step-5 gap. This entry is reconstructed retroactively from the shipped skill + commit history so `decisions.md` stays the authoritative program record. No decisions are re-litigated; the skill is already on disk and released. Confirmed with the user 2026-05-20.

### What shipped

`skills/product/extract-service/` — new product skill. Brief 06 § "Code Cleanup and Service Extraction" / IDEA-3 §1 (the michaelshimeles `code-structure` pattern). Extracts repeated operational mechanics (SDK / API / file-system / network logic copy-pasted across handlers or actions) into a shared service layer: produces a stepwise migration plan, then applies it caller-by-caller with verification at each step. Two-layer separation — Actions keep the why/when, the service layer holds the how.

- 11 files: `SKILL.md` + 4 agents (scanner / planner / migration / critic) + 6 references (playbook, service-layer-pattern, migration-checklist, anti-patterns, report-template, examples/).
- `budget: standard`; verb-first name per D1; artifact at `.forsvn/artifacts/product/extract-service/[date]-[slug].md`.
- Registered in `.claude-plugin/plugin.json`; skill count 38 → 39.
- CHANGELOG `[Unreleased]` `### Added` entry.

Brief 06 offered two shapes — a standalone `extract-service` skill OR a structural-extraction mode inside `clean-code`. D21 shipped the standalone skill (D7's rename map had reserved `extract-service-layer → extract-service` as a "future skill ... not yet created"). The commit message's loose phrase "structured data extraction from web/app sources" mis-describes it; the skill itself is code-mechanics service extraction per brief 06.

### Status

DONE — shipped in commit `15800a2`. Workstream F now has 2 slices: D12 (review-work noise-filter) + D21 (extract-service).

---

## D22 — Workstream F slice 3 (LOCKED 2026-05-20: release-tooling repair — fix the STACKS-orphaned script family)

Locked via interview rounds 1–3 (2026-05-20, post-D20/D21). Round 1: next slice = sync-script hygiene (over plan-campaign platform wiring / research-artifact eval / Pangram API). Round 2: approach = **fix the script** (over kill-mirrors-to-symlinks / kill-mirrors-to-relative-paths / retire-and-freeze) **+ add an audit guard**. Round 3: scope = **fix the whole family** — the dead-`STACKS` bug orphaned 5 scripts, not 1.

### Why this slice

Workstreams A+B (2.0 consolidation) collapsed four plugin repos (`research-skills/`, `marketing-skills/`, `product-skills/`, `meta-skills/`) into one `skills/{meta,research,marketing,product}/` tree. Five `scripts/` tools still hardcode `const STACKS = ["research-skills", "marketing-skills", "product-skills", "meta-skills"]` and walk `join(ROOT, stack, "skills")` — directories that no longer exist. Every one crashes on startup. The whole release-tooling family has been dead since the consolidation; nothing caught it because nothing ran it (no CI, no `package.json`).

Concrete damage:
- `sync-skill-support.mjs` can't regenerate the `references/_shared/` mirrors. 35 mirror dirs / 525 files / 1032 citations across 405 files are frozen; any edit to a canonical `references/` file silently desyncs every mirror.
- `evaluate-ad`, `evaluate-content`, `evaluate-campaign` (D15/D19/D20) cite `references/_shared/*` files that were never generated — 15 broken citations live in the repo right now.
- `audit-skill-portability.mjs` (the existing guard for stale/broken `_shared/` citations) and `audit-reference-hygiene.mjs` (the source-residue release gate) silently never run.

### Build-time finding folded into the plan (read-pass, rounds 2–3)

Round-2's framing assumed one broken script + a new guard. The read-pass found: (a) `audit-skill-portability.mjs` already IS the guard — it checks "missing local support path" (stale `_shared/` citations) and skill self-containment; per the Quality Standard ("check if we already have it under a different name"), D22 fixes it rather than building a redundant new `audit-shared-refs` script; (b) the identical dead-`STACKS` bug breaks 5 scripts. Round 3 locked the scope to the whole family.

### Scope (fix 4, retire 1)

**Fix — `sync-skill-support.mjs`:**
- `STACKS` / `skillDirs()` → walk `skills/{meta,research,marketing,product}/*/`.
- Rebuild `SUPPORT_REFS`: 13 `meta-skills/references/*` → top-level `references/*`; `hypothesis-framework.md` → `skills/research/_shared/hypothesis-framework.md`; `copywriting-research-workflow.md` → `skills/marketing/write-copy/references/research-workflow.md`; `clipping-and-live.md` → `skills/marketing/plan-campaign/references/distribution-models/clipping-and-live.md`.
- Rebuild tree-copy sources for renamed skills: `design-brief`→`brief-graphic`, `brand-system`→`create-brand`, `ad-copy`→`write-ad`; `short-form-brief`'s platform-intelligence → top-level `references/platform-intelligence/` (already moved by D13).
- Mirror dir NAMES unchanged (`_shared/design-brief/`, `_shared/brand-system/`, `_shared/ad-intelligence/`, `_shared/platform-intelligence/`) so the 1032 existing citations stay valid — the source path changes, the dest label is stable. Documented in a script comment.
- Add `--check` mode: regenerate every mirror in memory, diff against the committed file, exit non-zero listing drift (the `prettier --check` pattern). This is the drift half of the guard.

**Fix — `audit-skill-portability.mjs`** (the guard, locked round 2): `STACKS` → 2.0 layout. Keeps its cross-stack-residue `BLOCKED_PATTERNS` (a `research-skills/` path inside a skill file post-2.0 is itself a stale-reference bug worth catching).

**Fix — `audit-reference-hygiene.mjs`:** `STACKS` → 2.0 layout. Source-residue release gate, still meaningful.

**Fix — `sanitize-public-references.mjs`:** `STACKS` → 2.0 layout. The remediation companion to `audit-reference-hygiene`; keeping the detector without its fixer is half a tool.

**Retire — `rewrite-skill-portability.mjs`:** DELETE. It was a one-time migration tool ("run after sync-skill-support.mjs") that flipped authored canonical-path citations (`meta-skills/references/X`, `marketing-skills/skills/design-brief/...`) to `_shared/` paths. Post-2.0 those source paths no longer occur in any skill file — the 2.0 rename + D13 already eliminated them, and skills are now authored citing `_shared/` directly. Running it today rewrites nothing. Its job is done; `audit-skill-portability.mjs` catches any future regression for hand-fix.

**Regenerate mirrors:** run the fixed `sync-skill-support.mjs` → all 35 `_shared/` dirs back in sync; the 15 missing eval-skill citations repaired.

**Wire the guard into RELEASING.md:** add a pre-release checklist step — `sync-skill-support.mjs --check` + `audit-skill-portability.mjs` + `audit-reference-hygiene.mjs` must pass before a version bump. The original bug existed because nothing ever checked the tooling still worked.

### Locked sub-decisions

1. **Fix the script, keep the `_shared/` mirror pattern** (round 2). Citations unchanged — zero risk to 405 files. The mirror duplication is an accepted tradeoff; `--check` + the portability audit close the silent-drift weakness. Kill-to-symlinks rejected (Windows plugin-install fragility); kill-to-relative-paths rejected (405-file rewrite, 1032 `..`-paths as a permanent smell).
2. **Fix the whole 5-script family** (round 3), not just the sync script — one root cause, one coherent slice. No half-fixed release tooling left behind.
3. **`audit-skill-portability.mjs` is the guard** — fixed, not duplicated by a new script.
4. **Mirror dir names stay** (`design-brief` etc.) despite source-skill renames, to keep 1032 citations valid. Cosmetic mismatch accepted; documented in-script.
5. **`rewrite-skill-portability.mjs` retired**, not fixed — obsolete post-2.0.
6. **No shared-module refactor.** Each script stays self-contained per the existing convention; D22 fixes the bug, it does not restructure the tooling.
7. **No CI added.** Solo-operator stack, no CI today; the guard is a manual pre-release checklist step in RELEASING.md, consistent with how `bump-marketplace.ts` is already invoked.

### Acceptance

- `bun scripts/sync-skill-support.mjs` runs clean and regenerates all `_shared/` mirrors; `--check` exits 0 immediately after.
- `node scripts/audit-skill-portability.mjs` runs and exits 0 (all `_shared/` citations resolve, incl. the 3 eval skills repaired).
- `node scripts/audit-reference-hygiene.mjs` and `node scripts/sanitize-public-references.mjs` run without crashing.
- `scripts/rewrite-skill-portability.mjs` deleted.
- `grep -rl '"research-skills"' scripts/` returns zero hits (dead `STACKS` constant gone).
- RELEASING.md has a pre-release tooling-check step.
- CHANGELOG `[Unreleased]` entry written.

### Risks accepted

| Risk | Accepted because |
|---|---|
| Regenerating mirrors produces a large diff (≈525 files) | Mechanical + content-identical-to-canonical; `--check` verifies it. Reviewable as "regenerated", not 525 hand-edits. |
| `_shared/` duplication persists | Round-2 decision. The pattern's self-containment value + zero citation-rewrite risk outweighed killing it; `--check` guards drift. |
| Mirror dirs named after pre-2.0 skill names | Renaming = rewriting citations = the thing round 2 explicitly avoided. In-script comment documents the mapping. |
| Manual pre-release check can be skipped | No CI on this stack; consistent with every other release step. RELEASING.md makes it explicit. |

### D22 build-time finding (2026-05-20, deep read-pass on the 5 scripts)

Round 3 locked "fix the whole family — fix or honestly retire each." The build read-pass found the fix/retire split far more lopsided than the round-2 framing assumed, and a 6th script with the same root cause. **Net: 2 scripts fixed, 4 retired.**

**`sync-skill-support.mjs` — FIXED.** Rebuilt for the 2.0 layout + `--check` mode. Two build-time corrections surfaced:
1. The trigger corpus must exclude generated `references/_shared/` + `scripts/` capsules. If a generated mirror's internal cross-references counted, generation cascades and never reaches a fixpoint (a mirror that mentions another shared file pulls that file in too). Fixed → trigger on authored content only.
2. Tree mirrors must exclude the source skill's own `_shared/` subtree. Copying it makes the mirror order-dependent (a mirror-of-a-mirror, correct only if the source skill synced first) — and nothing cites the nested files. Fixed → `treeSourceFiles()` filters `/_shared/`.

With both, sync is a true single-pass fixpoint; verified idempotent; `--check` passes immediately after a regen. The regeneration repaired **9 skills** whose `_shared/` citations had no file on disk — created after the sync broke: `forsvn`, `evaluate-ad`, `evaluate-content`, `evaluate-campaign`, `evaluate-landing-page`, `produce-asset`, `produce-video`, `publish-social`, `extract-service`.

**`rewrite-skill-portability.mjs` — RETIRED** (per the locked plan: obsolete one-time migration tool).

**`audit-skill-portability.mjs` + `audit-reference-hygiene.mjs` + `sanitize-public-references.mjs` — RETIRED (interview round 4, 2026-05-20).** Round 2's read-pass claimed `audit-skill-portability` "is the guard." The deep read disproved that: it audits **single-skill install portability** — the requirement D13 explicitly declared dead ("portable single-skill install isn't a real install vector today"). Against the 2.0 repo it emits 243 findings, ~95 % false positives — every `_shared/` citation, every top-level `references/` reference, every intentional cross-skill `[[link]]` flagged as a violation of the abandoned constraint. `audit-reference-hygiene` is the same shape: 1,477 findings, ~1,240 are its anti-residue rule colliding with the repo's own `[[wikilink]]` convention; the private→public scrub it gated already happened (the stack is public). `sanitize-public-references` is that audit's companion fixer. All three audit requirements the 2.0 consolidation made obsolete — un-breaking them resurrects ~1,700 noise findings, not a working gate. Round 3's "fix or retire each" branch resolved to retire, alongside `rewrite-skill-portability`.

**`bump-marketplace.ts` — FIXED (6th script, build-time finding).** The release-version helper was not in round 3's enumerated 5 — interview prep mis-assessed its `"research-skills"` hit as "probably a CHANGELOG-prefix list." It carried the identical bug: it `readFileSync`'d four per-stack `plugin.json` files (`research-skills/.claude-plugin/plugin.json`, …) the consolidation deleted, throwing before it could bump anything — the tool needed to *ship* D22 was itself broken. The per-stack version report was vestigial four-plugin-umbrella code; replaced with a read of the single consolidated `.claude-plugin/plugin.json`. Core logic (the marketplace.json version bump) was always sound — verified end-to-end (2.0.0 → 2.0.1, reverted). Folded into D22 under round 3's "fix the whole family / one root cause" mandate. Its optional README "Per-stack release notes" dated-line update now no-ops with a clear warning — that line was dropped from the consolidated README; minor, out of D22 scope, flagged as a follow-up.

The drift guard the slice set out to add is therefore **`sync-skill-support --check`** — a genuine generated-vs-canonical check, wired into `RELEASING.md` as a pre-release gate. The original Acceptance bullets that named the three audit scripts are void (superseded by this finding); the sync-script and RELEASING.md bullets stand.

Out of scope, flagged: `scripts/harness/lib/parse.ts` (the skill-test harness) carries the same dead `join(ROOT, stack, "skills")` pattern — a separate subsystem, not release tooling; left for a follow-up.

Note: stale `meta-skills/...` strings remain in the canonical `scripts/*.ts` comment headers — deliberately left. `sync-skill-support`'s `normalizeSupportContent` rewrites them to `references/_shared/...` in the generated capsules (correct there); "fixing" the canonical comment would break that rewrite. Nothing flags them now that the audits are retired; they are harmless doc comments.

### Status

DONE — built 2026-05-20. `scripts/sync-skill-support.mjs` rebuilt for the 2.0 single-repo layout with a `--check` drift-guard mode; verified idempotent (single-pass fixpoint) and `--check`-clean after regeneration. Mirror regeneration: ~169 tracked files updated, 26 mirror-of-a-mirror files dropped, 27 created — repairing 9 skills whose `_shared/` citations had no on-disk target. `rewrite-skill-portability.mjs`, `audit-skill-portability.mjs`, `audit-reference-hygiene.mjs`, `sanitize-public-references.mjs` retired (obsolete post-2.0). `bump-marketplace.ts` (6th script, same root cause) fixed and verified. `RELEASING.md` gains a pre-release `sync-skill-support --check` gate. CHANGELOG `[Unreleased]` `### Fixed` + `### Removed` entries written (no version bump — user owns). `scripts/` release-tooling family: 6 broken → 2 working (`sync-skill-support`, `bump-marketplace`); 4 retired. **Workstream F now has 3 slices: D12 (review-work noise-filter) + D21 (extract-service) + D22 (release-tooling repair).** User owns version bump + git commit + push.
