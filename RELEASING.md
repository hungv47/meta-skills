# Releasing — Conventions and Cadence

This file is the canonical reference for how releases work in the `meta-skills` repo. It is tracked, durable.

For the **mechanics** of bumping versions in lockstep (`plugin.json` + `marketplace.json` + `CHANGELOG.md` + GitHub Release), see `CLAUDE.md` § "Git Operations → Releasing". The rules below cover **what** to release and **how** to write the release notes.

---

## Release cadence — batch landings, don't ship per patch

Default to fewer, larger releases. Fresh-eyes patches, typo fixes, single-skill word-tweaks, and post-ship rationale clarifications land in the working tree and wait for the next substantive bundle. Don't release per commit.

Reference incident: the 2026-05-10 → 2026-05-12 window shipped 5 marketplace releases in 3 days (2.3.4 → 2.5.0 with three intermediate fresh-eyes patches). Each release was technically valid but the bundle was wrong — users got 5 update notifications when the actual user-visible change was 2 bundles.

| Change shape | Action |
|---|---|
| Substantive (new skill, new mode, behavior change, methodology expansion) | Release |
| Fresh-eyes patch on an *unreleased* version | Fold into that version before releasing |
| Fresh-eyes patch on an *already-released* version | Accumulate in working tree until next substantive bundle, release together |
| Cosmetic / typo / doc-only | Never a release trigger on its own |

Solo-operator stack, small user base, no SLA. Target: 1–2 releases/week, not 5-per-3-days.

---

## CHANGELOG entries — release notes, not journal

`CHANGELOG.md` entries are release notes the user sees on `/plugin update`. They are NOT the canonical record of everything that happened in a release window. Canonical lives in commit history + `.agents/skill-artifacts/meta/records/` (fresh-eyes reports) + `roadmap.md` (strategic decisions).

Each entry follows this shape:

```markdown
## [X.Y.Z] - YYYY-MM-DD

One-paragraph summary of user-visible change. What's different for someone running `/plugin update`? Frame from the user's seat, not the implementor's.

### {Added|Changed|Fixed|Removed}
- ≤4 bullets. Each bullet ≤2 lines. One user-visible change per bullet.

Full review: `.agents/skill-artifacts/meta/records/YYYY-MM-DD-fresh-eyes-{slug}.md`
```

### Anti-patterns

Observed in pre-convention entries; do not reproduce:

- **File-change inventory** (`### Files changed: ...`) — git diff is authoritative
- **Fresh-eyes pattern recap** — lives in the records dir, link to it instead
- **Anti-goals respected** — lives in `roadmap.md`
- **"What did NOT change" exhaustive lists** — assume nothing changed unless stated
- **Implementation rationale paragraphs** — belongs in commit messages

### Length target

≤20 lines per release entry. Pre-2.0 stack CHANGELOGs grew past 500 lines because entries averaged 30–40 lines each; new entries cap at ≤20. Use the `[meta]` / `[research]` / `[marketing]` / `[product]` prefix on each bullet when changes are stack-scoped.

---

## GitHub Release bodies

The GitHub Release body should mirror the CHANGELOG entry verbatim, plus a one-line install hint at the bottom:

```
/plugin marketplace update meta-skills
/plugin update meta-skills
# or for a fresh install:
/plugin marketplace add hungv47/meta-skills
/plugin add meta-skills
```

---

## Pre-release checks

Run before any version bump:

```bash
node scripts/sync-skill-support.mjs --check
```

Each skill carries generated copies of shared references and script capsules under `references/_shared/` and `scripts/`, produced by `sync-skill-support.mjs`. An edit to a canonical `references/*.md` does not reach those copies until the script is re-run. `--check` regenerates in memory and exits non-zero — listing every out-of-sync file — if any mirror has drifted.

On failure: run `node scripts/sync-skill-support.mjs` (no flag) to regenerate, then commit the result in the release commit. A green `--check` is a release gate.

---

## Tooling

The `docs-writing` skill (at `skills/product/docs-writing/`) has a `--release-notes` mode that consumes a git range + this convention and emits a compliant CHANGELOG entry. Invoke as `/docs-writing --release-notes <version>`. The mode's critic-agent enforces every anti-pattern listed above; outputs that violate the convention FAIL the critic and re-dispatch the writer.

The marketplace version bump helper is at `scripts/bump-marketplace.ts`:

```bash
bun scripts/bump-marketplace.ts <patch|minor|major> "<one-line summary>"
```

Run in the **same commit** that ships the release.
