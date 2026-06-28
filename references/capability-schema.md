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
      - path: "docs/forsvn/artifacts/..."
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
  gate_class: review
  domain: marketing
  public: true
  command: /write-copy
  summary: "Draft and critique persuasive copy."
  aliases: [copy, headline]
```

Required: `id`, `domain`, `public`, `summary`. Authored-but-defaulted: `gate_class`.

- `id` must match the skill directory name.
- `domain` must be one of `meta`, `research`, `marketing`, `product`.
- `public: true` means the skill is installed and user-invocable.
- `summary` is a concise product-facing label (≤180 chars).
- `command` is required when `public: true`.
- `aliases` is product/router shorthand, not user-visible doctrine.

### Gate Class (A4)

`gate_class` is the **autonomy gate** for this capability when it appears as a step in a
`plan.md` (the A4 `run-plan` executor reads it to decide whether to auto-advance or stop).

```yaml
capability:
  id: publish-social
  gate_class: publish     # hard-coded; NEVER read from / downgradable by .forsvn/config.json
```

| Value | Meaning | `run-plan` behavior |
|---|---|---|
| `auto` | Read-only producer (research / diagnosis) — a pure input to later steps. | Auto-advances within the A6 governor envelope. |
| `review` | Produces a reviewable artifact. | Auto-advances within the envelope; artifact stays `decision_state: pending`. |
| `publish` | Publish / spend / external / irreversible. | **STOPS hard — human required; nothing published.** |

Rules:

- **Default is `review`.** A missing or malformed `gate_class` normalizes to `review` — **never** to
  `auto` (fail-safe toward human review). Authored in every `routing.yaml` for legibility.
- **`publish` is hard-coded per capability**, not config: `publish-social`, `produce-asset`,
  `produce-video`, `produce-ooh`, and anything else that ships externally or spends. The A6 governor
  loader **drops** any key that would downgrade a `publish` gate — the publish-stop is absolute.
- `auto` is reserved for genuinely read-only producers (`research-*`, `diagnose`). Anything that emits
  a deliverable a human would approve/reject is `review`, not `auto`.
- `bin/build-capability-index.ts --check` fails on any cap whose `gate_class` is outside the enum.

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
    - path: "docs/forsvn/artifacts/marketing/content/[slug].copy.md"
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
bun _dev/validate-coverage.ts
node hooks/test-router.mjs
bun bin/lint-artifact-paths.ts
bun bin/validate-artifacts.ts --strict
bun bin/validate-packs.ts --strict
bun _dev/validate-legibility.ts
bun _dev/validate-launch-kit.ts
bun _dev/validate-recall.ts
bun bin/manifest-sync.ts --check
bun _dev/verify-version-alignment.ts
bun _dev/audit-skill-budget.ts --out=../.forsvn/audit-skill-budget-latest.md && bun _dev/audit-skill-budget.ts --enforce-caps
bun _dev/lint-description-body-coherence.ts --strict
bun _dev/check-skill-links.ts
bun _dev/check-deferred-disciplines.ts
bun _dev/verify-reference-integrity.ts
bun _dev/audit-skill-listing.ts --check
bun _dev/lint-catalog-coherence.ts --strict
bun _dev/eval/golden-regression.ts
bun _dev/run-unit-tests.ts
```

`lint-artifact-paths` enforces the v2 flat-filename grammar (run
`bun _dev/migrate-artifacts-flat.ts --apply` on a clean tree if it
flags legacy paths); `validate-artifacts --strict` enforces v2 frontmatter
on every `docs/forsvn/artifacts/` artifact; `manifest-sync --check` fails if the
index drifted from disk (both added by skills-refactor Phase 2.5).
`validate-packs --strict` (pack-contract v2, 2026-06-16) enforces
`references/platform-intelligence/CONTRACT.md` on every source playbook pack —
required frontmatter (`pack_type`, `last_verified`, `status`, `summary`), the
required section set per `pack_type`, and a non-empty Playbook (§5). Staleness
(>90d) is WARN-only — packs are expected to age (that aging is the freshness
wedge); the six legacy `schema_version: 1` video packs validate under the v1
section set. Scopes to the source dir only (skips `_template.md`/`CONTRACT.md`
and the generated `_shared/` mirrors).
`validate-recall` (FOR-48 / U6, 2026-06-23) is the self-improvement analog of
`validate-legibility`. U6 sharpens output from the operator's own data (N=1) via
shrinkage recall (n/(n+k)); the load-bearing guarantee is **honesty on a thin
store** — an `empty`/`sparse` store is narrated plainly, never a fabricated "your
data shows…" (performance-grounding.md, mirrors legibility rule 2). This pins both
halves: the contract doc still defines the Recall line + 3 weight states + the
honesty rule + the `own_data_*` frontmatter mirror, AND the real `shrinkage.ts`
helper still collapses an empty store to weight 0 (so an own-data claim is not even
representable at n=0) with a monotonic blend hitting the 0.5 own-data floor at n=k.
A drift in the doc OR the math fails. (The fuller `_dev/test-shrinkage.ts` /
`test-distill-priors.ts` math suites pass but are not yet gate-wired — see the note
on `run-unit-tests` and the `_dev/test-*.ts` set below.)
`validate-launch-kit` (FOR-46 / U4, 2026-06-23) applies the U2 coverage guarantee
to the Channel Kit bundle: `run-launch` assembles one channel's launch, and this
pins the **signature-artifact ledger** in `launch-chain-spec.md` so every signature
output the pack declares (PH: tagline, first maker-comment, gallery, run-of-show,
hunter outreach) is either `wired` to a chain step or carries a NAMED `unwired-*`
emitter-gap line — never silently dropped. Both former PH gaps are now closed
(FOR-46/U4): the typed signature subtypes (S3.5 — `write-launch` emits `ph-tagline`
/ `ph-first-comment` sidecars) and the hunter-outreach chain step (S3.4 —
`write-outreach` is step 4b) are wired, not faked. Fails if a signature artifact
leaves the ledger or a row lacks a wired/unwired status; the `unwired-*` mechanism
stays so a future gap is named, never silent.
`run-unit-tests` (FOR-45 / U3, 2026-06-23; extended FOR-47 / U5) auto-discovers and
runs every TS test suite across the repo's test roots (`tests/`,
`forsvn-preview/test{,s}/`). The plan-preview trust contract — a multi-step plan a
human approves *before* step 1, publish/spend nodes hard-gated, a resolvable
dependency DAG (`bin/plan.ts`, `plan.test.ts` + `resolve-deps.test.ts`) — AND the
co-work surface guarantees (U5: render fidelity, suggest-only / proof-local-only,
ws-auth, route-surface, decision + inline-edit capture under `forsvn-preview/`) were
self-running but wired into nothing — not the gate, not CI — so "legible
orchestration, never autopilot" and "co-work safe" could rot on the next edit. This
runs all 23 suites; a new one is gated with no hand-edit. (The harder co-work
invariant — no accept/approve/publish tool over MCP — is the Rust `collab_guard.rs`,
already gated by the `rust-tests.yml` CI workflow.) **Not yet covered:** the
`_dev/test-*.ts` unit/fixture suites (`test-shrinkage`, `test-distill-priors`,
`test-yaml-parser`, the `*-fixtures` pins, …) — 14 pass but `test-critic-gate-fixtures.ts`
is **pre-existing-broken** (a `card.skill.id` TypeError from a critic-gate scorecard
shape drift, commit 593e095), so `_dev/` can't be folded into `run-unit-tests` until
that suite is fixed. Fixing it then adding `_dev` as a fourth test root closes the
last ungated-suite gap.
`validate-coverage` (FOR-44 / U2, 2026-06-23) guards the negative space of the
"never silently miss" guarantee. Where `eval-triggers` proves each paraphrased
intent routes to the right skill (positive space), this proves a capability-shaped
ask that *no* skill covers produces **zero** confident routes — forcing the front
door (`skills/meta/forsvn`, anti-patterns.md "the silent miss") into its honest
"name the gap / clarify" branch instead of fabricating a capability. It runs the
production scorer (`hooks/skill-router-core.mjs`) over the live registry against the
out-of-stack corpus `tests/triggers/_no-match.jsonl`; a match there is a real
over-route finding, not a corpus to relax.
`validate-legibility` (FOR-43 / U1, 2026-06-23) is the other half of the
applied-expertise contract — where `validate-packs` proves the *pack* exists and
conforms, this proves the *narration* of it survives. For every author skill in
`references/legibility-convention.md`'s "Consumed by" set (`write-social`,
`write-launch`, `publish-social`, `brief-shortform`, `plan-campaign`,
`measure-results`) it asserts the contract is loaded, structurally enforced in an
agent/reference file (the FOR-40 presence rule), and *shown* in ≥1 worked example
rendered in the Packed state with `pack_verified` + `applied_tactics`. It is a
presence/shape check (never a quality judgment), catching the regression FOR-40
left open: a future edit, a new pack-consuming skill, or a regenerated example
silently dropping the block.
HTML rendering + its linting (`lint-html-output`, `test-forsvn-preview`) live in
the **forsvn-preview** review module (within the single `forsvn` plugin) — skills
emit Markdown only.
`check-skill-links` (dead relative links) and `audit-skill-listing --check`
(per-skill listing caps) were already in the gate but missing from this list —
synced 2026-06-05. `verify-reference-integrity` (audit wave 2 U1, 2026-06-12) is
its sibling for the citation forms markdown-link checking misses: backtick
code-span paths (with `[platform]`/`<domain>`/glob expansion against real
directories) must resolve, and every per-skill `references/**/*.md` must be
reachable from its own skill's files (orphans are adjudicated — cite, merge, or
delete — never auto-deleted). Generated `references/_shared/` mirrors are
excluded (owned by `sync-skill-support --check`); escape hatches
`<!-- lint:reference-ok <reason> -->` (line) and
`<!-- lint:reference-ok-file <reason> -->` (meta-documents with exemplary paths)
are used sparingly, with reasons. Regression-pinned by
`_dev/test-reference-integrity-fixtures.ts`. `check-deferred-disciplines`
(WS-K K5 / FOR-29) enforces the "captured, NOT built" guarantee for the deferred
retention+referral disciplines registered in `_dev/deferred-disciplines.json`: a
skill dir for any discipline whose `G-discipline` gate has not cleared
(`build_allowed: false`) is a hard failure — the premature-breadth path the
premium bar guards against. To build one, clear its gate in
`_ops/forsvn/strategy/STATUS.md`, then flip its register entry to
`gate_cleared: true` + `build_allowed: true` in the same change as the skill dir
(full premium scaffolding required). Repo-local, cwd-independent; both the guard
and the register live in `_dev/` (publicignored — process state, not shipped
content). `lint-catalog-coherence --strict` (W3-1, 2026-06-05) catches
per-skill catalog drift — a numbered rubric (critic gates, `CP-IDs`, principle
sets) disagreeing on count, item names, or id-references across a single skill's
files; SoT = the richest enumeration, History/Changelog + `_shared/` excluded.
`verify-version-alignment` (version-policy chore, 2026-06-09) fails when the three
plugin manifests (`.claude-plugin/plugin.json` + `marketplace.json`,
`.codex-plugin/plugin.json`) disagree on `version`, or run ahead of the latest
`v*` release tag without a matching tag being cut — the silent drift that let
`1.2.0`→`1.3.0` run past `v1.1.0`. Tag mode (`--expect vX.Y.Z`) runs in
`publish-skills.yml` before a release is cut.
`golden-regression` (U8 golden net, 2026-06-11, M2) re-scores every skill pinned
in `tests/goldens/baselines.json` through `_dev/eval/critic-gate.ts` and checks
the frozen exemplar fixtures against their `*.golden.json` sidecars — baselines
are scorecard JSON (dimension scores), not byte-equality; the gate fails naming
the skill + dimension on any score drop, reports rises, and `--rebaseline`
re-pins deliberately.

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
