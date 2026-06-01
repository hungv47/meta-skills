# Capability Schema (routing.yaml v2)

`routing.yaml` is the single source of truth for machine-readable routing,
orchestration, lazy-load, and output-contract policy for each skill package.

It is not loaded into model context by default. It is consumed by:

- `hooks/build-registry.mjs` → `hooks/skill-registry.json` (prompt-submit
  trigger heuristic).
- `bin/build-capability-index.ts` → `references/capability-index.json`
  (routing, orchestration, load map, outputs — used by `/forsvn`, validators,
  docs generators).
- `_dev/validate-routing.ts` (structure, path resolution, contract checks).

Two generated artifacts, one source file per skill. Edit `routing.yaml`, then
rebuild both.

## File Location

```text
skills/<domain>/<skill>/routing.yaml
```

The package shape stays the same:

```text
skills/<domain>/<skill>/
  SKILL.md
  routing.yaml          # this file
  agents/
  references/
  scripts/
  examples/
```

`capability.yaml` is deprecated. Pilot files have been folded into the matching
`routing.yaml`.

## Top-Level Shape

```yaml
# section 1 — prompt-trigger heuristic (consumed by build-registry.mjs)
promptSignals:
  phrases: [...]
  allOf: [[...]]
  anyOf: [...]
  noneOf: [...]
  minScore: 6

# section 2 — capability metadata (consumed by build-capability-index.ts)
capability:
  id: write-copy
  domain: marketing
  public: true
  command: /write-copy
  summary: "..."
  aliases: [copy, headline]

  route:
    use_when: [...]
    not_when: [...]
    prerequisites:
      recommended: [...]
      hard: [...]

  orchestration:
    default: auto
    single_when: [...]
    multi_when: [...]
    critic_required_when: [...]

  load:
    always: [...]
    when:
      - if: "..."
        read: [...]

  outputs:
    artifacts:
      - path: ".forsvn/artifacts/..."
        lifecycle: pipeline
        produced_when: "..."
```

`promptSignals` and `capability` are sibling top-level keys. Skills can have
`promptSignals` without `capability` during migration; the validator warns on
missing `capability` unless `--require-all` is passed.

## promptSignals Section

Unchanged from v1. See existing `routing.yaml` files for examples.

| Field | Type | Purpose |
|---|---|---|
| `phrases` | `string[]` | Literal trigger phrases. |
| `allOf` | `string[][]` | Each inner array is an AND group of substrings. |
| `anyOf` | `string[]` | Any substring matches. |
| `noneOf` | `string[]` | Disqualifies routing if any matches. |
| `minScore` | `number` | Threshold for the heuristic to suggest the skill. |

## capability Section

### Identity

```yaml
capability:
  id: write-copy
  domain: marketing
  public: true
  command: /write-copy
  summary: "Draft and critique persuasive copy."
  aliases: [copy, headline]
```

Required: `id`, `domain`, `public`, `summary`.

- `id` must match the skill directory name.
- `domain` must be one of `meta`, `research`, `marketing`, `product`.
- `public: true` means the skill is installed and user-invocable.
- `summary` is a concise product-facing label (≤180 chars).
- `command` is required when `public: true`.
- `aliases` is product/router shorthand, not user-visible doctrine.

### Route Policy

```yaml
route:
  use_when:
    - "User asks for headline, hook, CTA, tagline, or section copy."
  not_when:
    - "Social platform posts -> write-social."
  prerequisites:
    recommended:
      - "research/product-context.md"
    hard:
      - "research/icp-research.md"
```

Rules:

- `use_when` describes positive triggers in plain English.
- `not_when` must name adjacent capabilities this skill should not steal.
- `prerequisites.recommended` warn but do not block.
- `prerequisites.hard` block unless the user explicitly overrides.

### Orchestration Policy

```yaml
orchestration:
  default: auto
  single_when:
    - "Single key line."
  multi_when:
    - "Full page or campaign surface."
  critic_required_when:
    - "External-facing output."
```

`default` is one of `single`, `multi`, `auto`.

Shared scoring rubric (lives in skill docs, not here):

| Score | Route |
|---|---|
| 0-3 | single-agent |
| 4-7 | single-agent + critic |
| 8+  | multi-agent + critic |

Hard rule: `--fast` can reduce orchestration weight, but cannot skip hard
context gates or required critic floors.

### Load Map

```yaml
load:
  always:
    - "references/procedures/pre-dispatch.md"
  when:
    - if: "surface includes headline or hook"
      read:
        - "references/headline-formulas.md"
```

Rules:

- **Bare paths** (`references/...`, `agents/...`, `procedures/...`, etc.) resolve
  to the skill package first; the validator falls back to repo-root only to
  support synced `_shared/` files that re-point at top-level `references/`.
  Authors should keep `always` / `when.read` paths skill-local; treat repo-root
  fallback as a transition affordance, not a target.
- **Repo-root paths** must be prefixed with `skills/` (e.g. another skill's
  reference). The validator resolves these against the repo root only.
- **Project-state paths** under `.forsvn/`, `research/`, `brand/`, or
  `architecture/` are skipped by load-path validation — they're written at
  runtime by other skills, not shipped with the package.
- `always` should stay short — every entry is paid on every invocation.
- `when.if` is a plain-English condition the agent evaluates at dispatch time.

### Outputs

```yaml
outputs:
  artifacts:
    - path: ".forsvn/artifacts/marketing/content/[slug].copy.md"
      lifecycle: pipeline
      produced_when: "Route A or Route B."
```

Rules:

- Artifact paths use repo/project-relative paths.
- Every artifact written by a skill must use manifest-compatible frontmatter
  (see `references/manifest-spec.md`).
- `lifecycle` should match the manifest spec's vocabulary.

## Generated Index

Build:

```bash
bun bin/build-capability-index.ts
```

Check (CI):

```bash
bun bin/build-capability-index.ts --check
```

Output: `references/capability-index.json` — deterministic, committed.

## Validation

Strict (run before merge — migration is complete, missing `capability`
sections are hard errors). There is no in-repo GitHub Actions workflow today;
the maintainer runs these locally as a pre-merge gate, and any external CI
(if added later) should run the full pre-merge command set:

```bash
bun _dev/validate-routing.ts --require-all
bun bin/build-capability-index.ts --check
node hooks/build-registry.mjs --check
bun _dev/verify-counts.ts
node _dev/sync-skill-support.mjs --check
bun _dev/eval-triggers.ts --require-all
node hooks/test-router.mjs
bun bin/lint-artifact-paths.ts
bun bin/validate-artifacts.ts --strict
bun bin/manifest-sync.ts --check
bun _dev/audit-skill-budget.ts --out=../.forsvn/audit-skill-budget-latest.md && bun _dev/audit-skill-budget.ts --enforce-caps
bun _dev/lint-description-body-coherence.ts --strict
```

`lint-artifact-paths` enforces the v2 flat-filename grammar (run
`bun _dev/migrate-artifacts-flat.ts --apply` on a clean tree if it
flags legacy paths); `validate-artifacts --strict` enforces v2 frontmatter
on every `.forsvn/artifacts/` artifact; `manifest-sync --check` fails if the
index drifted from disk (both added by skills-refactor Phase 2.5).
HTML rendering + its linting (`lint-html-output`, `test-forsvn-preview`) moved
out to the **forsvn-preview** plugin — skills emit Markdown only.

Trigger evals (run before merge — routing changes must keep
`tests/triggers/` fixtures green, and `--require-all` ensures every skill
has a fixture file):

```bash
bun _dev/eval-triggers.ts --require-all
```

Bare invocation (no flag) is retained for local exploration on in-progress
branches where a new skill hasn't yet had its capability section added — it
soft-warns instead of hard-failing. New skills must clear `--require-all`
before merge.

```bash
bun _dev/validate-routing.ts
```

Hard-fail conditions (always):

- malformed `capability` section,
- `id` mismatch with directory name,
- `domain` mismatch with parent directory,
- missing `summary` on a present capability section,
- public capability without `command`,
- empty `route.use_when` or `route.not_when`,
- invalid `orchestration.default`,
- empty `orchestration.single_when` / `multi_when` / `critic_required_when`,
- load path that does not resolve,
- artifact path / lifecycle / produced_when empty.

Soft-fail (warn until `--require-all`):

- skill has no `capability` section.
- `summary` over 180 chars.

## Migration State

**Fold complete (2026-05-26).** All 43 skills carry `routing.yaml` v2 with both
`promptSignals` and `capability:` sections. Standalone `capability.yaml` files
deleted as part of the fold. The pre-merge gate runs
`bun _dev/validate-routing.ts --require-all` so a missing capability
section is now a hard error, not a warning.

What this section was for: tracking which skills had been folded during the
phased migration. The phased migration is done; this section is retained as a
historical anchor so future readers can locate the merge point.
