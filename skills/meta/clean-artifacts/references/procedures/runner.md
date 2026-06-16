---
title: Cleanup Runner Procedure
lifecycle: canonical
status: stable
produced_by: cleanup-artifacts
load_class: PROCEDURE
---

# Cleanup Runner Procedure

The orchestrator follows this procedure directly — `clean-artifacts` is a single-agent skill (no `Agent` in `allowed-tools`; nothing dispatched). This file is the canonical execution spec, not a sub-agent target.

## Single-Agent Constraint

You do NOT:
- Delete files (any deletion is out of scope; v1 only moves).
- Touch HARD-NEVER paths (`brand/`, `research/`, `architecture/`, `.git/`, submodules, `.forsvn/index/manifest.json`, `docs/forsvn/experience/`, `tasks.md`, `roadmap.md`).
- Skip the critic gate, even if the scope is small or the operator says "just do it."
- Operate on a stale or missing manifest — escalate to `NEEDS_CONTEXT` instead.
- Recurse into `.git/`, submodule dirs, or `node_modules/`.
- Follow symlinks during the walk.
- Decide on operator overrides autonomously — every category move requires explicit `y`.

## Input Contract

Resolved by the orchestrator before this procedure runs:

| Field | Type | Description |
|-------|------|-------------|
| **scope** | path | `docs/forsvn/artifacts/` or a subpath under it |
| **mode** | `dry-run` \| `apply` | Default `dry-run` |
| **threshold_days** | integer | Default 90 |
| **excluded_paths** | path[] | From operator + `docs/forsvn/experience/technical.md` |

## Output Contract

Single markdown report at `docs/forsvn/artifacts/meta/records/[YYYY-MM-DD]-cleanup-artifacts-<slug>.md`, following the template in [`../report-template.md`](../report-template.md).

**Rules:**
- Always emit a report, even on `NEEDS_CONTEXT`, `BLOCKED`, or zero candidates.
- Never silently archive. Every move appears in the per-candidate table with `Action: archived` and `Confirmed?: y`.
- On any HARD-NEVER attempt, emit a `BLOCKED` status with the offending path; do NOT proceed.

---

## Execution Steps

Run these in order. Do NOT skip steps — each is a load-bearing safeguard.

### Step 1 — Sanity-check the manifest

```bash
test -f .forsvn/index/manifest.json || exit_with_status NEEDS_CONTEXT \
  "Missing .forsvn/index/manifest.json. Run: bun scripts/manifest-sync.ts"
```

If manifest exists, check its mtime:

```bash
# If manifest mtime > 1 day, recommend re-sync; do NOT proceed
find .forsvn/index/manifest.json -mtime +1 && exit_with_status NEEDS_CONTEXT \
  "Manifest is stale (>1 day). Re-run: bun scripts/manifest-sync.ts"
```

Also confirm the audit scope exists:

```bash
test -d "<scope>" || exit_with_status BLOCKED "Scope <scope> does not exist."
```

Canonicalize and validate the audit scope before walking it. Refuse `..` path segments, a symlinked `docs/forsvn/artifacts/` root, symlinked scopes, and any scope whose lexical path or real path is outside `docs/forsvn/artifacts/`:

```bash
case "<scope>" in *..*) exit_with_status BLOCKED "Scope <scope> contains '..' and cannot be cleaned." ;; esac
test ! -L docs/forsvn/artifacts || exit_with_status BLOCKED "docs/forsvn/artifacts/ is a symlink; refusing to clean through symlinked artifact roots."
case "<scope>" in
  docs/forsvn/artifacts|docs/forsvn/artifacts/*) ;;
  *) exit_with_status BLOCKED "Scope <scope> must be docs/forsvn/artifacts/ or a subpath under it." ;;
esac
ARTIFACTS_REAL="$(realpath docs/forsvn/artifacts)"
SCOPE_REAL="$(realpath "<scope>")" || exit_with_status BLOCKED "Scope <scope> cannot be resolved."
case "$SCOPE_REAL" in
  "$ARTIFACTS_REAL"|"$ARTIFACTS_REAL"/*) ;;
  *) exit_with_status BLOCKED "Scope <scope> resolves outside docs/forsvn/artifacts/ and cannot be cleaned by this skill." ;;
esac
test ! -L "<scope>" || exit_with_status BLOCKED "Scope <scope> is a symlink; refusing to clean through symlinks."
```

Refuse HARD-NEVER scopes (operator passed `--scope docs/forsvn/experience/`, etc.) at this step:

```bash
case "<scope>" in
  .forsvn/index/manifest.json|.forsvn/index/artifact-index.md|docs/forsvn/experience|docs/forsvn/experience/*|docs/forsvn/artifacts/meta/tasks.md|docs/forsvn/artifacts/meta/roadmap.md) \
    exit_with_status BLOCKED "Scope <scope> is HARD-NEVER and cannot be cleaned by this skill." ;;
esac
```

### Step 2 — Walk the disk under scope

Walk every file under the scope, depth-first. Skip:
- `.git/` and any `.gitmodules`-listed submodule directory
- `node_modules/`
- `docs/forsvn/artifacts/.archive/` (already archived; do not re-process)
- Any path on the operator-supplied `excluded_paths` list

Use `find` (not `find -L`; never follow symlinks):

```bash
find <scope> -type f \
  -not -path "*/.git/*" \
  -not -path "*/node_modules/*" \
  -not -path "*/.archive/*" \
  -print
```

For each file collect:
- Full path (relative to project root)
- Basename, basename-without-extension, slug (kebab portion after `YYYY-MM-DD-` if dated)
- Bytes (`stat`)
- Last-mod date (`stat`)
- Tracked-by-git? (`git ls-files --error-unmatch <path>` returns 0)
- Has-uncommitted-changes? (`git diff --quiet <path>` returns nonzero)
- Frontmatter fields if a markdown file: `status`, `lifecycle`, `kind`, `superseded_by`, `stale_after_days`
- Manifest entry if any (look up by path in `.forsvn/index/manifest.json`; field semantics per [`../_shared/manifest-spec.md`](../_shared/manifest-spec.md) [PROCEDURE])

### Step 3 — Classify per artifact

Apply the rules in [`../cleanup-rules.md`](../cleanup-rules.md) §"Classification — Definitions" in order:

1. HARD-NEVER → `KEEP (hard-never)` with note
2. Frontmatter `status: superseded` or `archived` or `superseded_by:` → `LEGACY`
3. EPHEMERAL pattern match (`*-candidates.md`, `*-rejected.md`, etc.) AND not under `meta/records/` or `meta/decisions/` → `EPHEMERAL`
4. Manifest entry exists, fresh (within threshold OR fresh consumed_by) → `KEEP`
5. Manifest entry exists, aged out → `STALE`
6. No manifest entry, not HARD-NEVER → `ORPHAN`

Record one classification per file, with the rule that fired. The transparency matters — operator should be able to audit every decision.

### Step 4 — CRITIC GATE Sub-Routine (mandatory)

Before any operator prompt or move, run the critic gate. **This is the single non-skippable safeguard.**

#### Procedure

1. Collect all non-KEEP candidates: `STALE + ORPHAN + LEGACY + EPHEMERAL`. Call this set `C`.
2. If `|C| == 0`: critic = `SKIPPED-because-zero-candidates`. Continue.
3. Otherwise, sample `min(5, |C|)` random elements of `C`. Use deterministic sampling (e.g., sort by path, take every `floor(|C|/5)`-th) so reruns are auditable.
4. For each sampled candidate, run all three reference-detection greps from [`../cleanup-rules.md`](../cleanup-rules.md) §"Reference-Detection Grep Patterns":
   - full path string
   - basename without extension
   - slug-only (post-date for dated files)
5. Exclude self-matches and matches inside `docs/forsvn/artifacts/.archive/`.
6. If ANY sampled candidate has ≥1 live reference: critic = `FAIL`. Record the candidate path and the referencing file:line. Skip Steps 5-7. Emit BLOCKED.
7. If all sampled candidates have 0 references: critic = `PASS`. Continue.

#### Why a sample, not exhaustive

Exhaustive grep across all candidates is fine for small `|C|` but quadratic at scale. The 5-random spot-check is statistically sufficient: if the sample is clean, the operator's per-category confirmation step is the second safeguard. Operator can re-run with `--paranoid` (out of scope for v1) for exhaustive checking.

#### Critic FAIL output (BLOCKED branch)

When critic fails, emit (do NOT prompt for confirmation):

```
Critic gate FAILED — N of M sampled candidates have live references.

Live references found:
  <candidate-path>
    referenced by: <file>:<line> ("<excerpt>")
  ...

No files were moved.

Recommendations:
  - Re-run with these candidates excluded (--excluded-paths <list>)
  - Edit the referencing files to drop stale citations
  - If you're certain the references are themselves stale, fix or remove those
    references first, then re-run cleanup. The critic gate is not skippable.

Status: BLOCKED
```

Status: `BLOCKED`. Stop here.

### Step 5 — Build the candidate table and per-category summary

For every candidate, attach:
- Class
- Bytes
- Last-mod
- Reference count (full-path + basename + slug, deduped, self-matches excluded)
- Risk tier (TIER-1 gitignored / TIER-2 tracked-clean / TIER-3 tracked-dirty / HARD-NEVER)
- Recommended action (`archived` for STALE/ORPHAN/LEGACY/EPHEMERAL; `kept` for KEEP)

If any candidate is TIER-3 (tracked + dirty), emit `DONE_WITH_CONCERNS` even on dry-run — do NOT include TIER-3 candidates in the `--apply` move list. Surface them separately:

```
TIER-3 (tracked + uncommitted changes) — N files. NOT moved even on --apply.
These have local edits that may be your in-progress work. Commit or stash first.
  <path>
  ...
```

### Step 6 — DRY-RUN: emit the report and stop

If `mode == dry-run`:

- Write the full report (template in [`../report-template.md`](../report-template.md)) with `mode: dry-run`, `total_archived: 0`, every candidate's `Confirmed?: dry-run`.
- Status: `DONE` if critic passed and no TIER-3 surprises; `DONE_WITH_CONCERNS` if TIER-3 candidates surfaced.
- Stop. No prompt, no move, no manifest-sync.

### Step 7 — APPLY: prompt per category and move

If `mode == apply` AND critic passed:

#### Per-category prompt

```
Found N candidate categories:
  STALE:     X files (oldest: <date>, total <KB>)
  ORPHAN:    Y files (no manifest entry, total <KB>)
  LEGACY:    Z files (frontmatter superseded, total <KB>)
  EPHEMERAL: W files (matched ephemeral patterns, total <KB>)

TIER-3 surprises: N (NOT moved; surfaced separately)
HARD-NEVER overrides: N (kept; see report)

Critic gate: PASS

Confirm per category — answer y/n for each:
  Archive STALE (X)?
  Archive ORPHAN (Y)?
  Archive LEGACY (Z)?
  Archive EPHEMERAL (W)?

(Files MOVE to docs/forsvn/artifacts/.archive/<YYYY-MM-DD>/, never deleted.
A separate --purge-archive flag, out of scope for v1, is the only path to actual deletion.)
```

Wait for explicit `y` per category. Any other answer → decline that category; record in the report.

#### Move execution (per confirmed category)

For each confirmed candidate, MOVE to the dated archive. Mirror source path inside the archive:

```bash
ARCHIVE_ROOT="docs/forsvn/artifacts/.archive/$(date +%Y-%m-%d)"
SRC="<candidate-path>"
DST="$ARCHIVE_ROOT/${SRC#./}"   # mirror full source path under archive root
test ! -L docs/forsvn/artifacts || { echo "refusing symlinked docs/forsvn/artifacts root"; exit 1; }
mkdir -p "$ARCHIVE_ROOT"
test ! -L docs/forsvn/artifacts/.archive || { echo "refusing symlinked archive root"; exit 1; }
SRC_REAL="$(realpath "$SRC")"
ARTIFACTS_REAL="$(realpath docs/forsvn/artifacts)"
case "$SRC_REAL" in "$ARTIFACTS_REAL"/*) ;; *) echo "refusing outside-scope source $SRC"; exit 1 ;; esac
test ! -L "$SRC" || { echo "refusing symlink source $SRC"; exit 1; }
mkdir -p "$(dirname "$DST")"
mv -- "$SRC" "$DST" && echo "moved $SRC -> $DST"
```

If the source is git-tracked, the move shows as a rename in `git status`; the operator can stage/commit as part of their own pre-PR flow.

Track:
- `total_archived` count
- total bytes archived
- per-candidate `Action: archived` + `Confirmed?: y` in the report

#### Manifest re-sync

After all confirmed moves complete:

```bash
bun scripts/manifest-sync.ts <project-root>
```

Capture the manifest delta (entries removed, entries unchanged) for the report.

### Step 8 — Write the final report

Use the template in [`../report-template.md`](../report-template.md). Status:

- `DONE` — critic passed, all confirmed categories moved, manifest-sync clean, zero TIER-3 surprises and zero declined categories
- `DONE_WITH_CONCERNS` — applied successfully but: (a) TIER-3 candidates surfaced (skipped), or (b) operator declined a category (manual follow-up needed), or (c) tracked files moved (git history is safety net, but operator should commit/review)
- `BLOCKED` — critic FAIL, OR HARD-NEVER attempt, OR scope doesn't exist; no moves executed
- `NEEDS_CONTEXT` — manifest missing or stale; cannot classify reliably

---

## Self-Check

Before returning your output, verify every item:

- [ ] Manifest existence + freshness checked at Step 1
- [ ] HARD-NEVER scope refused at Step 1
- [ ] Walk excluded `.git/`, submodule dirs, `node_modules/`, `.archive/`
- [ ] No symlinks were followed
- [ ] Every file got exactly one classification with the rule that fired
- [ ] Critic gate ran (PASS / FAIL / SKIPPED-zero-candidates) — never silently skipped
- [ ] On critic FAIL, no confirmation prompt was emitted
- [ ] On `--dry-run`, zero files were moved
- [ ] On `--apply`, every move was preceded by an explicit `y` per category
- [ ] TIER-3 (tracked-dirty) files were surfaced separately and NOT moved
- [ ] manifest-sync ran after any actual move
- [ ] Report written under `docs/forsvn/artifacts/meta/records/[YYYY-MM-DD]-cleanup-artifacts-<slug>.md` (dated, not overwritten)
- [ ] Status declared explicitly (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT)

If any check fails, revise the output before returning.
