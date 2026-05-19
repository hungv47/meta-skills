---
date: 2026-05-19
status: locked
owner: hungv47
supersedes: none
authority: implementation contract — overrides brief-pack/ where they conflict
---

# Execution-Evaluation — Locked Decisions

One-page decision memo from the brief-pack interview (00-executive-brief.md § "First Move"). Authoritative for the workstreams below. Brief-pack files remain as expanded rationale.

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
- [ ] `README.md` skill catalog rewritten.
- [ ] `MEMORY.md`, `references/`, `hooks/user-prompt-submit-skill-router.mjs` all reference new names.
- [ ] `CHANGELOG.md` 3.0.0 entry includes full rename map.

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

Carry to the next interview when Workstream A is ready to start:
- Per-skill rename map sign-off (D1 lists the source; user must confirm exact new names).
- `/forsvn` UX details: question-asking format, dispatch confirmation prompts, resume-vs-fresh defaults.
- Whether `create-brand` runs autonomously inside the proving workflow or pauses for user confirmation.
- Workstream C–F sequencing.

## Status

DONE — decisions locked, ready for Workstream A kickoff interview.
