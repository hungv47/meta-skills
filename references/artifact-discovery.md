---
title: Artifact Discovery — how a skill finds a prerequisite artifact produced by an earlier skill
lifecycle: canonical
status: stable
load_class: PLAYBOOK
---

# Artifact Discovery

**The problem this solves:** a skill that requires an artifact made by an earlier skill must be able to *find it reliably* — without guessing paths or re-scanning the filesystem. This is the machine-resolvable contract that makes the chain composable.

Three pieces make discovery deterministic:

1. **Every artifact is written to one predictable place** — the flat grammar `.forsvn/artifacts/<stack>-<skill>-<YYYY-MM-DD>-<slug>.<ext>`. The manifest also indexes the skills' canonical top-level folders `brand/`, `architecture/`, `research/` (the `architect-system` / `create-brand` / `research-*` outputs in a consuming project). Path grammar: [[manifest-spec]]; frontmatter schema: [[artifact-contract-template]]. (In this repo the FORSVN *app* blueprint was relocated to a dormant `docs/architecture/` and is intentionally **not** a live manifest artifact — see `docs/README.md`.)
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

The flat filename encodes `<stack>-<skill>-<date>-<slug>`, so even without the manifest you can pattern-match producer + date; but always prefer the manifest because it carries status/decision/staleness the filename can't.

## Producer obligations (so consumers can find you)

1. Write frontmatter per [[artifact-contract-template]] — at minimum `skill`, `version`, `date`, `status`, `stack`, `review_surface`.
2. Write to the flat path; declare it in `routing.yaml` `outputs.artifacts[]`.
3. Call `manifest-sync` as the last step so the index reflects the new artifact immediately.
4. Never hand-edit `manifest.json` / `artifact-index.md` — they are derived.

## Don't conflate the three version fields

When reading frontmatter, `version` is the **artifact-schema** integer (owned by [[artifact-contract-template]]) — not the producing skill's `metadata.version` (SemVer) and not the plugin release version. See the Versioning Policy in `CLAUDE.md`.

## Related

- [[manifest-spec]] — the manifest schema + sync mechanism + read/write protocol.
- [[artifact-contract-template]] — the frontmatter schema (single SoT).
- [[reviewable-artifact-contract]] — `decision_state` semantics + the review surface lifecycle.
