---
title: Artifact Discovery — how a skill finds a prerequisite artifact produced by an earlier skill
lifecycle: canonical
status: stable
load_class: PLAYBOOK
---

# Artifact Discovery

**The problem this solves:** a skill that requires an artifact made by an earlier skill must be able to *find it reliably* — without guessing paths or re-scanning the filesystem. This is the machine-resolvable contract that makes the chain composable.

Three pieces make discovery deterministic:

1. **Every artifact is written to one predictable place** — the by-stack layered grammar `.forsvn/<layer>/<stack>/<name>.md`, where `<layer>` ∈ `canonical | artifacts | experience` and `<stack>` ∈ `meta | research | marketing | product`. Working output is `.forsvn/artifacts/<stack>/<skill>-<YYYY-MM-DD>-<slug>.md`; curated truth is `.forsvn/canonical/<stack>/<UPPER-NAME>.md`; memory is `.forsvn/experience/<stack>/<name>.md`. Path grammar: [[artifact-contract-template]] § "v3 — the by-stack layered home"; frontmatter schema: same file. (The old flat `.forsvn/artifacts/<stack>-<skill>-<date>-<slug>.md` grammar is legacy — still indexed for back-compat, never emitted. FORSVN's own canon lives in `.forsvn/canonical/`.)
2. **Every artifact-producing skill declares what it requires and produces** in its `routing.yaml` (capability metadata, not loaded into context):
   - `capability.route.prerequisites.{recommended,hard}` — the input artifacts this skill **requires**.
   - `capability.outputs.artifacts[]` — `{path, lifecycle, produced_when}` for each artifact this skill **produces**.
3. **The manifest is the index** — `.forsvn/index/manifest.json`, rebuilt by `manifest-sync.ts` from artifact frontmatter, maps every artifact path to its `produced_by`, `status`, `decision_state`, `lifecycle`, `stale`, `superseded_by`, and selection fields.

## Resolution algorithm

To locate a prerequisite from inside a consuming skill:

1. **Read `.forsvn/index/manifest.json` first** — one read, never glob the filesystem (anti-pattern in [[manifest-spec]]).
2. **Identify the producer.** The consumer's `prerequisites` lists either a concrete path (e.g. `research/icp-research.md`) or you resolve it from the producing skill's `outputs.artifacts[].path`.
3. **Look up the entry** in `manifest.artifacts[<path>]`.
4. **Select / gate on the entry's fields:**
   - `status` ∈ `done | done_with_concerns` → usable (surface the caveat for `done_with_concerns`). `blocked | needs_context` → treat as missing; re-run the producer.
   - `decision_state` — for reviewable inputs require `approved` (or `not_required`); `pending` / `suggested` / `denied` means the input is not yet committed.
   - `stale: true` → usable but warn; offer to refresh.
   - `superseded_by` present → prefer the replacement.
   - When several candidates match (e.g. dated snapshots), prefer the **newest `produced_at`** that is not superseded.
5. **If the path is absent from the manifest** → it does not exist *or* the index is stale. Run `bun ${SKILLS_ROOT:-.claude/skills}/meta-skills/scripts/manifest-sync.ts` and re-check. Still absent → the prerequisite has not been produced; route to the producer skill named in `prerequisites`.

## Phase 1 helpers — id resolution, graph traversal, one-query context

The manifest's `by_id` + `graph` (see [[manifest-spec]] § "v2 — the Knowledge Graph") back three ergonomic queries:

- `bun skills/bin/find-artifacts.ts --resolve <id>` → the artifact's current path (move-safe; references are by `id`).
- `bun skills/bin/find-artifacts.ts --graph <id>` → the artifact's edges in both directions (`upstream/downstream/supersedes/superseded_by/references` + the `referenced_by` reverse index).
- `bun skills/bin/find-artifacts.ts --context [--stack <s>]` → an agent's full starting context (TRUTH + OUTPUT + MEMORY) in one call — read this before starting work on a stack instead of globbing. Append a learning to the MEMORY layer with `bun skills/bin/append-experience.ts <stack> --name <topic> --heading <h> --by <skill> --body <text>`.

## Filtering by produced_by + lifecycle + decision_state

When you don't have an exact path (e.g. "find the latest approved decision record for this initiative"):

```
candidates = manifest.artifacts
  .filter(a => a.produced_by === <skill>)
  .filter(a => a.lifecycle === <lifecycle>)        // e.g. "decision", "canonical"
  .filter(a => a.decision_state in <accepted set>)  // e.g. {approved, not_required}
  .filter(a => !a.superseded_by)
  .sort(by produced_at desc)
pick = candidates[0]
```

The path encodes `<layer>/<stack>/` and the filename encodes `<skill>-<date>-<slug>`, so even without the manifest you can `rg`-match producer + date + the greppable `id`/`type`/`keywords` frontmatter; but always prefer the manifest because it carries status/decision/staleness and resolves `id → current path` (a moved artifact is still found by its stable `id`).

## Producer obligations (so consumers can find you)

1. Write frontmatter per [[artifact-contract-template]] — at minimum `skill`, `version`, `date`, `status`, `stack`, `review_surface`, plus the v3 instruction core `id`, `type`, `keywords`.
2. Write to the layered path `.forsvn/<layer>/<stack>/...`; declare it in `routing.yaml` `outputs.artifacts[]`.
3. Call `manifest-sync` as the last step so the index reflects the new artifact immediately.
4. Never hand-edit `manifest.json` / `artifact-index.md` — they are derived.

## Don't conflate the three version fields

When reading frontmatter, `version` is the **artifact-schema** integer (owned by [[artifact-contract-template]]) — not the producing skill's `metadata.version` (SemVer) and not the plugin release version. See the Versioning Policy in `CLAUDE.md`.

## Related

- [[manifest-spec]] — the manifest schema + sync mechanism + read/write protocol.
- [[artifact-contract-template]] — the frontmatter schema (single SoT).
- [[reviewable-artifact-contract]] — `decision_state` semantics + the review surface lifecycle.
