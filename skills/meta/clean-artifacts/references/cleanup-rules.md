# Cleanup Rules — Classification Taxonomy

> Classification taxonomy and reference-detection rules for the `clean-artifacts` skill. Every artifact under the audit scope gets exactly one classification; the runner uses the rules below to decide which.

The runner reads this file as one of its `references[]` inputs.

---

## Classification — Definitions and Concrete Examples

### KEEP

The artifact is load-bearing for the project and must stay in place.

**Triggers (any one is sufficient):**

1. Path matches a HARD-NEVER pattern (canonical, infrastructure, session anchor — see below). HARD-NEVER paths are always KEEP regardless of mtime.
2. Manifest entry exists with `status: done` and `updated_at` within the staleness threshold (default 90d).
3. Manifest entry exists with `status: done_with_concerns` AND a downstream consumer (per `consumed_by` in manifest, if populated) was active within the threshold.
4. Frontmatter declares `kind: registry` (living registry — undated, edited in place; e.g., `skill-contracts.md`, `learned-rules.md`).
5. Frontmatter declares `lifecycle: canonical`.

**HARD-NEVER patterns (always KEEP):**

- `brand/**` (canonical brand identity)
- `research/**` (canonical audience/market record)
- `architecture/**` (canonical system blueprint)
- `.git/**`, `.gitmodules`
- Any path inside a directory listed in `.gitmodules` (submodule)
- `.forsvn/index/manifest.json` (infrastructure)
- `docs/forsvn/experience/**` (Q&A substrate, append-only)
- `docs/forsvn/artifacts/meta/roadmap.md` (session anchor)
- `docs/forsvn/artifacts/meta/tasks.md` (session anchor)
- `node_modules/**` (never recurse here in the first place)

**Concrete examples:**

| Path | Why KEEP |
|---|---|
| `brand/BRAND.md` | canonical |
| `research/icp-research.md` | canonical |
| `architecture/system-architecture.md` | canonical |
| `.forsvn/index/manifest.json` | infrastructure |
| `docs/forsvn/experience/audience.md` | append-only substrate |
| `docs/forsvn/artifacts/meta/tasks.md` | session anchor |
| `docs/forsvn/artifacts/meta/records/skill-contracts.md` | living registry (`kind: registry`) |
| `docs/forsvn/artifacts/meta/records/learned-rules.md` | living registry |
| `docs/forsvn/artifacts/marketing/copy/twitter-2026-05-01.md` (within 90d, manifest done) | fresh pipeline output |

---

### STALE

The artifact has a manifest entry but it has aged past the threshold and no downstream consumer is using it recently. **Default action: propose ARCHIVE; require operator confirmation.**

**Triggers (BOTH must be true):**

1. Manifest entry exists.
2. Manifest `updated_at` is older than `threshold-days` (default 90) AND no `consumed_by` reference is fresher than the threshold.

**STALE-only carve-outs (still STALE, but treat with extra care):**

- Records under `docs/forsvn/artifacts/meta/records/` are dated immutable snapshots (audit trail). They are STALE-eligible by age but should NEVER be classified as EPHEMERAL even if their filename matches an ephemeral pattern. Records lifecycle = snapshot.
- Decisions under `docs/forsvn/artifacts/meta/decisions/` are dated immutable strategic records. STALE-eligible but the operator typically declines archival; surface them with a "decision record — usually keep" note.

**Concrete examples:**

| Path | Why STALE |
|---|---|
| `docs/forsvn/artifacts/meta/records/2025-11-30-fresh-eyes-foo.md` | dated record, > 90d old, no live ref |
| `.forsvn/loops/video-series/evals/2025-12-01-cycle-1.md` | loop evaluation output, > 90d, superseded by later cycles |
| `docs/forsvn/artifacts/marketing/copy/linkedin-2025-08-15.md` | pipeline output, > 90d, no recent consumer |

---

### ORPHAN

The file exists on disk but has no manifest entry, OR its producing skill was renamed/removed.

**Triggers (any one):**

1. File exists; no manifest entry covers it; not on the HARD-NEVER list.
2. Manifest entry's `producing_skill` no longer exists in the installed skill list (renamed/removed).
3. File is under a per-skill subdir (e.g., `docs/forsvn/artifacts/research/<skill-name>/`) where `<skill-name>` is no longer present.

**Concrete examples:**

| Path | Why ORPHAN |
|---|---|
| `docs/forsvn/artifacts/meta/sketches/foo-sketch.md` | hand-created sketch, no manifest entry, no producing skill |
| `docs/forsvn/artifacts/research/old-skill-name/some-output.md` | producing skill was renamed/removed |
| `docs/forsvn/artifacts/marketing/random-scratch.md` | no manifest entry, no clear producer |

ORPHAN ≠ STALE. STALE has a manifest entry that aged out. ORPHAN has none, or its producer no longer exists.

---

### LEGACY

The artifact's frontmatter explicitly says it's superseded or archived.

**Triggers (any one):**

1. Frontmatter `status: superseded`.
2. Frontmatter `status: archived`.
3. Frontmatter `lifecycle: ephemeral` (rare, but if a skill explicitly marked it).
4. A `superseded_by:` field in frontmatter pointing to another artifact.

LEGACY is a strong-recommend ARCHIVE; the artifact's own author flagged it as no longer current.

**Concrete examples:**

| Path | Why LEGACY |
|---|---|
| `docs/forsvn/artifacts/meta/specs/old-scope.md` (frontmatter `status: superseded`) | author flagged |
| `docs/forsvn/artifacts/meta/decisions/2026-04-01-foo.md` (`superseded_by: 2026-05-01-foo-v2.md`) | newer decision exists |

---

### EPHEMERAL

The filename matches a known ephemeral pattern AND the file is NOT in `docs/forsvn/artifacts/meta/records/` or `meta/decisions/` (those are immutable audit trail, not ephemeral).

**Ephemeral patterns:**

- `*-candidates.md` (working scratch from prioritize, brainstorm passes)
- `*-rejected.md` (rejected options scratch)
- `*-draft.md` (drafts that should have been promoted or discarded)
- `scratch-*.md`, `tmp-*.md`, `wip-*.md`
- Files inside `docs/forsvn/artifacts/meta/sketches/` older than threshold AND not referenced
- `fresh-eyes-report.md` (UNDATED; old pre-T33 pattern that ignored the lifecycle: snapshot dated convention — these should never appear in a post-T33 tree, but if they do, they're ephemeral cruft)
- `agents-panel-report.md` (UNDATED; same reason as above)

**Concrete examples:**

| Path | Why EPHEMERAL |
|---|---|
| `docs/forsvn/artifacts/meta/sketches/foo-candidates.md` (>30d, no refs) | matches `*-candidates.md` pattern, in sketches/ |
| `docs/forsvn/artifacts/meta/fresh-eyes-report.md` | undated (pre-T33 leftover); should be at meta/records/[date]-fresh-eyes-*.md |
| `docs/forsvn/artifacts/meta/sketches/scratch-experiment.md` | matches `scratch-*.md` |

**NOT ephemeral despite filename:**

| Path | Why NOT |
|---|---|
| `docs/forsvn/artifacts/meta/records/2025-11-30-fresh-eyes-foo.md` | DATED record under records/ — lifecycle: snapshot, treat as STALE if old, never EPHEMERAL |
| `docs/forsvn/artifacts/meta/decisions/2026-04-01-agents-panel-foo.md` | DATED decision — lifecycle: decision, treat as STALE-with-keep-recommendation |

---

## Reference-Detection Grep Patterns

For every non-KEEP candidate, the runner greps for live references across `docs/forsvn/artifacts/`, `brand/`, `research/`, `architecture/`. The candidate is "referenced" if any pattern below matches in any other file.

**Patterns (run all three, ignore self-matches):**

1. **Full path string** — exact match against the candidate's path:
 ```bash
 grep -rl --include='*.md' --include='*.json' --include='*.ts' \
 --include='*.mjs' --include='*.yml' --include='*.yaml' \
 -- "<full-path>" docs/forsvn/artifacts brand research architecture 2>/dev/null
 ```
2. **Basename without extension** — catches references that name the file without its full path:
 ```bash
 grep -rl --include='*.md' --include='*.json' --include='*.ts' \
 --include='*.mjs' --include='*.yml' --include='*.yaml' \
 -- "<basename-no-ext>" docs/forsvn/artifacts brand research architecture 2>/dev/null
 ```
3. **Slug-only** — the kebab-case slug after the date prefix (for `YYYY-MM-DD-slug.md` files, this is the slug). Catches references that drop the date:
 ```bash
 grep -rl --include='*.md' --include='*.json' --include='*.ts' \
 --include='*.mjs' --include='*.yml' --include='*.yaml' \
 -- "<slug-only>" docs/forsvn/artifacts brand research architecture 2>/dev/null
 ```

**Self-matches to exclude:**
- The candidate itself.
- Any other file in `docs/forsvn/artifacts/.archive/` (the archive references its own contents; that's not "live").
- The current cleanup-artifacts report being written.

**False-positive risk:** common words as slugs (e.g., `report`, `notes`) will hit. The runner mitigates by:
- Preferring full-path matches (highest signal).
- Treating slug-only matches as "potential reference, surface to operator" rather than auto-block.
- Running spot-check on 5 random candidates per pass — if those clear, statistical confidence is acceptable for the rest.

---

## Risk-Tier Rules

Every candidate also gets a risk tier based on git tracking. The tier informs the operator's confidence in archiving, not the classification itself.

| Tier | Trigger | Implication |
|---|---|---|
| **TIER-1 (gitignored)** | File path matches a `.gitignore` rule | Local-only state; archive is the ONLY safety net. The dated archive directory IS the recovery path. |
| **TIER-2 (tracked, clean)** | File is tracked AND committed AND working tree clean for it | Git history is the safety net. Archiving + committing the move is fully reversible via `git checkout`. |
| **TIER-3 (tracked, dirty)** | File is tracked AND has uncommitted changes | DANGEROUS — uncommitted edits could be the operator's in-progress work. Runner must escalate; do NOT archive without explicit override. |
| **HARD-NEVER** | Path under HARD-NEVER list | Refused regardless of any tier; not eligible for archival. |

The runner emits the tier in the per-candidate report so the operator can audit its decision.

---

## Manifest-Driven Freshness Rules

The runner reads `.forsvn/index/manifest.json` (per `references/_shared/manifest-spec.md`) and uses these fields:

- **`updated_at`** — date of last write to the artifact's frontmatter or the file's mtime (manifest-sync derives this).
- **`status`** — `done`, `done_with_concerns`, `blocked`, `needs_context`. Only `done` and `done_with_concerns` count as "load-bearing"; `blocked` and `needs_context` artifacts may be STALE candidates if old.
- **`stale_after_days`** — per-artifact override of the global threshold. If frontmatter declares this, use it instead of the default 90.
- **`producing_skill`** — used to detect ORPHANs whose producer was renamed/removed.
- **`consumed_by`** — list of skills that consumed this artifact downstream. If any entry is fresher than the threshold, the artifact is KEEP regardless of its own `updated_at`.

**Freshness decision tree (per artifact with a manifest entry):**

```
1. Is path under HARD-NEVER? → KEEP
2. Frontmatter status == "superseded" or "archived"? → LEGACY
3. updated_at within max(stale_after_days, threshold-days)? → KEEP
4. Any consumed_by within threshold? → KEEP
5. status in [blocked, needs_context]? → STALE
6. Otherwise (status done/done_with_concerns AND aged out AND no live consumer) → STALE
```

For artifacts WITHOUT a manifest entry: classify ORPHAN unless HARD-NEVER.

---

## When the Manifest is Missing or Stale

If `.forsvn/index/manifest.json` doesn't exist or its mtime is > 1 day old, the runner emits status `NEEDS_CONTEXT` and recommends:

```
.forsvn/index/manifest.json is missing or stale.
Re-run before continuing:
 bun scripts/manifest-sync.ts
```

The runner does NOT proceed with classification on a stale manifest — STALE/ORPHAN signals would be unreliable.

---

## Cross-Reference

- `agent-skills/CLAUDE.md` §"Artifact Placement" — full lifecycle taxonomy this skill enforces.
- `references/_shared/manifest-spec.md` — manifest contract the freshness rules read from.
- `references/_shared/pre-dispatch-protocol.md` — the read/ask/dispatch loop the SKILL.md follows.
