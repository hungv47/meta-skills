---
title: Cleanup Artifacts — Escalation Walkthrough
lifecycle: canonical
status: stable
produced_by: cleanup-artifacts
load_class: EXAMPLE
---

# Worked Example — Critic-Gate Escalation → Operator Fix → Re-Run → DONE

**Load when:** the orchestrator needs a concrete anchor for the BLOCKED branch — what an escalation looks like, what the operator sees, what they do next, what re-running looks like after they fix the references.

---

**Operator:** "groom .forsvn/artifacts — it's a junk drawer. Apply."

**Pre-Dispatch (warm):**

```
Found:
- scope → "docs/forsvn/artifacts/" (full)
- manifest snapshot → "47 artifacts, 6 stale (>90d), 3 with no manifest entry"
- excluded paths → none recorded

Mode set to --apply per your request. Threshold 90 days. Proceed?
```

**Operator:** y

**Runner Layer 1 (walk + classify):**

- 47 artifacts found under `docs/forsvn/artifacts/`
- Classifications:
  - KEEP (38) — manifest fresh, or under HARD-NEVER (manifest, experience, tasks, roadmap)
  - STALE (4) — old fresh-eyes records from prior sessions
  - ORPHAN (3) — `docs/forsvn/artifacts/meta/sketches/foo.md` referenced by no manifest entry; producing skill (`prioritize`) hasn't been run in this project
  - LEGACY (1) — `docs/forsvn/artifacts/meta/specs/old-scope.md` with `status: superseded` in frontmatter
  - EPHEMERAL (1) — `docs/forsvn/artifacts/.archive/2026-04-01/foo-candidates.md` (already archived; matches `-candidates.md` pattern but already in archive — KEEP, it's the archive)

**Runner Critic Gate:**

- Spot-check 5 random STALE/ORPHAN: grep path + basename + slug across `docs/forsvn/artifacts/`, `brand/`, `research/`, `architecture/`
- 1 of 4 STALE files (`2026-02-15-fresh-eyes-prior-pass.md`) cited by `docs/forsvn/artifacts/meta/roadmap.md` line 412 — LIVE REFERENCE
- ESCALATE: skip confirmation, surface to operator

**Runner Output:**

```
Critic gate FAILED — 1 of 9 STALE/ORPHAN candidates has a live reference:
  STALE: 2026-02-15-fresh-eyes-prior-pass.md
    referenced by: docs/forsvn/artifacts/meta/roadmap.md:412

Recommendations:
  - Re-run with that file excluded, OR
  - Edit roadmap.md to drop the stale citation, then re-run

No files were moved. Report: docs/forsvn/artifacts/meta/records/2026-05-08-cleanup-artifacts-apply-blocked.md

Status: BLOCKED — live reference found; operator decision needed.
```

**Operator decides:** edits `roadmap.md` to drop the stale reference, re-runs `cleanup-artifacts --apply`. Critic passes; per-category prompts fire; operator confirms STALE+ORPHAN+LEGACY; runner moves 8 files to `docs/forsvn/artifacts/.archive/2026-05-08/`; manifest-sync runs; report saved with status DONE.

---

## Why this is the canonical walkthrough

The BLOCKED → fix → re-run cycle is the most important flow this skill enables. Operators rarely see it because most runs pass cleanly — but when it fires, the operator needs to know:

1. The critic gate is non-skippable. It surfaces the reference; it does not auto-resolve.
2. The fix is in the referencing file, not the candidate file. Move the stale citation, not the cited artifact.
3. Re-running after the fix is the normal path — there is no `--force` flag, by design.
