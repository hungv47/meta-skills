---
title: Docs-Writing — Route C (Post-Change Sync)
lifecycle: canonical
status: stable
produced_by: docs-writing
load_class: PROCEDURE
---

# Route C: Post-Change Sync

**Load when:** triggered by `/docs-writing --sync`, "update the docs after this change", "sync docs", or "docs are stale after that PR." This route cross-references the git diff against ALL existing documentation and makes targeted updates — not a full rewrite. It's the documentation equivalent of a patch, not a rebuild.

---

## Execution flow

```
scanner-agent ──────────────── inventory existing docs + read git diff
  → staleness-checker-agent ── compare diff against docs, find stale content
    → writer-agent ──────────── make targeted updates only (not full rewrite)
      → critic-agent ────────── verify factual accuracy of updates
```

## What's different from the full route

- `concept-extractor-agent` and `audience-profiler-agent` are SKIPPED — the docs already exist with established audience and structure.
- `scanner-agent` reads the git diff (not the full codebase) to scope changes.
- `writer-agent` receives a list of stale sections and makes MINIMAL targeted edits — it does NOT rewrite sections that aren't affected by the diff.
- `staleness-checker-agent` focuses on the diff's blast radius: changed API routes, modified env vars, renamed files, updated config.

## What the staleness-checker looks for in sync mode

1. **File paths** — did any documented paths change? (renamed, moved, deleted files)
2. **API routes** — did any endpoints change signature, parameters, or response shape?
3. **Environment variables** — were any added, removed, or renamed?
4. **Configuration** — did defaults, valid values, or required settings change?
5. **Version numbers** — did package.json version, Node/runtime version, or dependency versions change?
6. **Feature descriptions** — did any documented behavior change?
7. **Setup steps** — did installation or getting-started steps change?

## What the writer-agent does in sync mode

- For factual updates (paths, versions, env vars): auto-fix directly.
- For narrative updates (feature descriptions, architecture explanations): flag for user approval before changing.
- Never rewrite sections unaffected by the diff.
- Add a `<!-- synced: YYYY-MM-DD -->` comment to updated sections for traceability.

## Pre-write step (orchestrator responsibility)

1. Resolve the git diff scope: if `--range` not provided, default to `staged + last 5 commits`.
2. Read the diff via `git diff <range>` and `git diff --stat <range>`.
3. Inventory existing docs (README, docs/, CHANGELOG.md, etc.) via scanner-agent.
4. Pass diff + doc inventory to staleness-checker-agent.

## Critic focus when reviewing sync output

Route C inherits the 6 default critical gates from SKILL.md unchanged. The critic-agent's attention shifts to sync-specific concerns when reviewing the writer's output (these are review heuristics, not new FAIL gates):

- Every updated section should trace to a specific commit in the resolved diff range.
- No section unaffected by the diff should have been modified (write-amplification check).
- Narrative updates (feature descriptions, architecture explanations) should have been flagged for user approval, NOT silently rewritten.
- `<!-- synced: YYYY-MM-DD -->` comment should appear on every updated section.

Standard critic gates (Getting Started, code examples compile, etc.) still apply — sync mode doesn't relax them. If the writer-agent's output violates the standard gates OR the sync-specific focus areas, the critic surfaces it; the orchestrator re-dispatches with tighter scope.

## When NOT to use Route C

- **Major refactor with >50 changed files** — at that point, full route gives better consistency. Sync mode is for targeted patches.
- **Brand-new doc** — there's nothing to sync. Use the default route.
- **Doc is structurally broken** (audience misaligned, sections out of order) — fix that with the default route first, then sync going forward.
