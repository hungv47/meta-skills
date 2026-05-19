---
title: Docs-Writing — Route E (Release Notes)
lifecycle: canonical
status: stable
produced_by: docs-writing
load_class: PROCEDURE
---

# Route E: Release Notes

**Load when:** triggered by `/docs-writing --release-notes <version>`, "release notes", "changelog entry", "what changed in this version", "write the release." This route produces a **CHANGELOG.md entry** that follows the agent-skills CHANGELOG convention (defined in `agent-skills/RELEASING.md` § "CHANGELOG entries — release notes, not journal"). Optionally also emits a **GitHub Release body draft** for `gh release create`. The route is convention-enforcing: the critic-agent fails any output that reproduces the pre-convention anti-patterns (file inventories, fresh-eyes recaps, anti-goals lists).

---

## Why CHANGELOG, not a free-form doc

Release notes are what users see on `/plugin update`. They are NOT the canonical record of everything that happened — canonical lives in commit history + `.agents/skill-artifacts/meta/records/` + roadmap.md. This route writes the user-facing summary; depth links to records.

## Inputs

- `version` (required) — the version being released, e.g., `5.0.0`
- `--range <ref>..HEAD` (optional, default: `$(git describe --tags --abbrev=0)..HEAD`, or staged commits when no prior tag)
- `--gh-release` (optional flag) — also emit a GitHub Release body draft to stdout
- `--stack <name>` (optional, default: detect from cwd) — which CHANGELOG.md to target when run from the umbrella

## Execution flow

```
scanner-agent ──────────────┐
concept-extractor-agent ────┤── Layer 1 (parallel) — read git log, CHANGELOG, fresh-eyes records, roadmap
audience-profiler-agent ────┘── (locked to "user on /plugin update — wants user-visible delta")

writer-agent ────────────────── writes entry following agent-skills/CLAUDE.md CHANGELOG convention
  → staleness-checker-agent ── verifies every claim traces to a commit in <ref>..HEAD
    → critic-agent ──────────── enforces convention gates (≤20 lines, ≤4 bullets, no anti-patterns)
```

## What's different from the full route

- `audience-profiler-agent` is locked to `{ type: "stack user", goal: "decide whether/why to update" }`. No inference.
- `scanner-agent` reads `git log <range>` + existing `CHANGELOG.md` (to learn voice + avoid duplicating prior entries) + `plugin.json` (to confirm version) — NOT the full codebase.
- `concept-extractor-agent` reads `.agents/skill-artifacts/meta/records/{date}-fresh-eyes-*.md` for any fresh-eyes report in the release window + `.agents/skill-artifacts/meta/roadmap.md` for strategic-context tags. Does NOT scan source files.
- `writer-agent` receives the CHANGELOG convention inline (from `agent-skills/RELEASING.md` § "CHANGELOG entries") as its primary template. Output is a single ≤20-line entry, NOT a multi-section document.
- `critic-agent` applies **release-notes-specific gates** (see below), replacing the standard checklist.

## Release-notes critic gates (replaces standard checklist)

- [ ] ≤20 lines total (hard cap — FAIL above)
- [ ] ≤4 bullets in any single `### {Added|Changed|Fixed|Removed}` section
- [ ] One-paragraph user-visible summary present (one paragraph, not multi-paragraph rationale)
- [ ] No `### Files changed` heading present (FAIL on detect — git diff is authoritative)
- [ ] No `### Anti-goals respected` heading (FAIL — lives in roadmap.md)
- [ ] No `### Fresh-eyes pattern` recap (FAIL — lives in records dir)
- [ ] No "What did NOT change" inventory (FAIL — assume nothing changed unless stated)
- [ ] If a fresh-eyes report exists in `.agents/skill-artifacts/meta/records/` for the release window, the entry links to it (one-line link, not embedded recap)
- [ ] Frame is user-seat, not implementor-seat (no "we caught a regression," yes "behavior corrected so X works")

## Staleness gates

Every bullet must trace to at least one commit in the release range. Bullets describing changes outside the range FAIL. Bullets describing changes within range that don't match the commit's diff FAIL (the writer hallucinated a feature).

## Pre-write step (orchestrator responsibility)

1. Confirm `version` parameter is set and matches `plugin.json` (or the user's intent for the imminent bump).
2. Resolve the git range: if `--range` not provided, use `$(git describe --tags --abbrev=0)..HEAD`; if no prior tag exists, use all commits since branch divergence.
3. Read existing `CHANGELOG.md` to confirm the new version doesn't already have an entry (prevent duplicate).
4. Scan `.agents/skill-artifacts/meta/records/` for fresh-eyes reports within the release window (filter by date in filename + window dates).

## Post-write step

- Prepend the new entry to `CHANGELOG.md` (below `# Title`, above prior entries — Keep a Changelog convention).
- If `--gh-release` flag set: emit GitHub Release body draft to stdout (same content as CHANGELOG entry plus a one-line installation reminder: `npx skills update` or `npx skills add hungv47/<stack>`).

## Worked example output shape

```markdown
## [5.0.0] - 2026-05-12

Stack-wide coordinated cut. Tier discipline now load-bearing: 5 skills changed budget (funnel-planner deep→standard with new default route; 4 orchestrate-* skills standard→fast). No skill rewrites. Versions aligned across the 4 stacks at v5.0.0 to mark the post-tier-discipline stable era.

### Changed
- `funnel-planner` defaults to Route B (Standard Path); Route A reserved for `--deep` or 3+ initiatives across 2+ funnel models. New Route C handles bump-update asks under 3 sentences.
- All 4 `orchestrate-*` skills now declare `budget: fast` and explicitly state they are pure routers (no agent dispatch, no critic gate).

Full review: `.agents/skill-artifacts/meta/records/2026-05-12-fresh-eyes-tier-discipline-phase-ab.md`
```

## When NOT to use Route E

- **Mid-development summary** — release notes are for shipped versions, not WIP. Use a draft commit message or PR description.
- **Patch notes for a single bug fix in a deployed app** (not a stack release) — use the project's own changelog conventions; this route enforces the agent-skills CHANGELOG convention specifically.
- **Roadmap or anti-goals documentation** — those live in `roadmap.md`; this route hard-fails on those sections.
