---
title: Docs-Writing — Report Template
lifecycle: canonical
status: stable
produced_by: docs-writing
load_class: PROCEDURE
---

# Report Template

**Load when:** Step 6 (Save) of the default route. Routes D + E use their own templates (`ship-log-template.md`, CHANGELOG entry inline in `modes/release-notes.md`).

---

## Frontmatter (default route)

Baseline required fields: `skill`, `version`, `date`, `status`, `audience`, `doc-type`.
Step 7.5 additions (manifest-sync conformance; backfilled going forward): `lifecycle`, `produced_by`, `provenance`.

```yaml
---
skill: docs-writing
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
audience: [end-user | developer | operator | mixed]
doc-type: [readme | user-guide | api-reference | config-guide | tutorial | ship-log]
# Step 7.5 fields (artifact-graph hardening; backfilled going forward):
lifecycle: canonical  # README → canonical; user-guide → pipeline; per-type varies — see below
produced_by: docs-writing
provenance:
  skill: docs-writing
  run_date: YYYY-MM-DD
  input_artifacts: []  # e.g., research/product-context.md if read
---
```

## Lifecycle by doc-type

Different doc types have different lifecycles:

| doc-type | Lifecycle | Reason |
|----------|-----------|--------|
| README | canonical | Top-level project doc; edited in place by humans |
| User Guide | canonical | Maintained alongside features |
| API Reference | pipeline | Regenerated on API surface change (Route C sync target) |
| Configuration Guide | canonical | Maintained alongside infrastructure |
| Getting Started Tutorial | canonical | Maintained alongside major version changes |
| Ship Log | canonical | Lives at `research/product-context.md` — see modes/ship-log.md |
| Release Notes | snapshot | Each entry is a dated immutable record (CHANGELOG.md) |

## Body sections (default route — README + User Guide + API Reference + Config Guide + Tutorial)

The actual section list depends on doc-type; writer-agent follows `references/doc-template.md` (the writer-template, pre-existing). Common sections:

```markdown
# [Project Name / Doc Title]

[1-paragraph intro: what this is, who it's for]

## Getting Started
[Numbered steps with expected outcome after each step]

## [Type-specific sections — see doc-template.md]
[README: Features, Installation, Usage, Contributing]
[User Guide: Workflows, Features, Troubleshooting]
[API Reference: Endpoints, Authentication, Errors, Pagination]
[Config Guide: Environment Variables, Settings, Infrastructure]
[Tutorial: Single workflow start-to-finish]

## Troubleshooting
[Errors visible in the codebase's error handling — match what the user will actually see]

## Configuration
[For docs with config: list defaults + valid values]
```

## Filename + version-increment rule

- **First run a given type:** `README.md` / `docs/<topic>.md` / etc. — per project convention.
- **Re-run same doc:** rename existing `<name>.md` → `<name>.v[N].md`, create new `<name>.md` with `version: N+1` frontmatter.
- **Sub-files** (e.g., `docs/api-v2.md` for API v2): same convention, separate slug.
- **Versioned files are historical trail.** The active file is always at the canonical path (no `.v[N]` suffix). Downstream consumers (other skills, CI, agents) read the active file.

## Required vs. optional sections

- **Required (default route):** Getting Started (numbered steps), Troubleshooting (errors visible in error-handling code), Configuration (if config exists).
- **Required per doc-type:** see `doc-template.md` for the canonical per-type section lists.
- **Optional:** Architecture (only if requested), Contributing (typically separate `CONTRIBUTING.md`), Acknowledgments.

## Cross-skill propagation

Downstream consumers:
- `code-cleanup` (when refactoring) — reads docs to verify nothing in the codebase contradicts documented behavior.
- `fresh-eyes` (post-implementation) — reads docs to verify implementation matches documented contract.
- `system-architecture` — reads README + architecture docs to detect drift from `architecture/system-architecture.md`.
- `cleanup-artifacts` (meta-skill) — scans `.agents/skill-artifacts/meta/records/` for staleness; docs-writing's snapshot artifacts (Release Notes) are part of that scan.
