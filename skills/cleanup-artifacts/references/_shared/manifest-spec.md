<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

# Manifest Spec

> Canonical spec for `.agents/manifest.json` — the derived state index that lets every skill in the stack discover, evaluate, and collaborate around artifacts without re-scanning the filesystem. Every skill that produces or consumes artifacts points here.

## Purpose

Three failure modes this spec prevents:

1. **Skills re-derive state every invocation** — every consumer re-globs `.agents/skill-artifacts/`, `research/`, `brand/`, `architecture/`, re-reads frontmatter, re-computes staleness. Wasteful and inconsistent across skills.
2. **Skills consume artifacts blindly** — a downstream skill reads `research/icp-research.md` without knowing it was 6 months old or finished `done_with_concerns`. Quality fails silently.
3. **Orchestrators have no machine-readable map** — `start-*` skills hand-maintain a state-detection table per stack, drifting from reality whenever a skill ships or renames an output.

Solution: a single `.agents/manifest.json`, **derived from artifact frontmatter**, **rebuilt by a sync script**, **read by every consumer first**. The same sync pass also writes `.agents/artifact-index.md`, a human-readable selection index that explains why artifacts exist and when to use them. The manifest indexes one-shot artifacts under `.agents/skill-artifacts/{meta,mkt,product,research}/`, measurable loop workspaces under `skills-resources/loops/[slug]/`, and canonical top-level `brand/`, `research/`, and `architecture/`.

The manifest is **derived state** — markdown artifacts remain source of truth. The manifest is rebuildable from scratch at any time. If it disappears, run sync; nothing is lost.

---

## The Substrate: `.agents/manifest.json`

Single JSON file at project root. Cheap to read (<50KB at scale), trivially parseable, machine-friendly. Schema:

```json
{
  "version": 1,
  "updated_at": "2026-05-07T14:32:11.000Z",
  "artifacts": {
    "research/icp-research.md": {
      "produced_by": "icp-research",
      "produced_at": "2026-04-12",
      "status": "done",
      "schema_version": 1,
      "stale_after_days": 90,
      "stale": false,
      "title": "ICP Research",
      "summary": "Engineering managers, mid-size SaaS, 50-200 engineers",
      "purpose": "Canonical audience record for downstream product, marketing, and research skills",
      "lifecycle": "canonical",
      "use_when": "Grounding audience, buyer, pain, VoC, or market-facing output",
      "do_not_use_when": "The product, audience, or market has materially changed since this was produced",
      "supersedes": "",
      "superseded_by": "",
      "upstream": "operator interview, product source material",
      "downstream": "brand-system, campaign-plan, copywriting, system-architecture",
      "decision_status": "",
      "size_bytes": 18432,
      "frontmatter_present": true
    },
    "skills-resources/loops/pricing-page/program.md": {
      "produced_by": "eval-loop",
      "produced_at": "2026-05-13",
      "status": "done",
      "schema_version": 1,
      "stale_after_days": 90,
      "stale": false,
      "title": "Pricing Page Program",
      "summary": "Pricing page conversion loop",
      "purpose": "Operating program for repeated strategy, execution, evaluation, and keep/discard cycles",
      "lifecycle": "loop",
      "use_when": "Coordinating future pricing page improvement cycles",
      "do_not_use_when": "The pricing page has no measurable conversion event or attribution path",
      "supersedes": "",
      "superseded_by": "",
      "upstream": "operator intent, analytics baseline",
      "downstream": "lp-brief, copywriting, lp-eval",
      "decision_status": "",
      "size_bytes": 7342,
      "frontmatter_present": true
    },
    ".agents/skill-artifacts/meta/records/diagnose-*.md": {
      "produced_by": "diagnose",
      "produced_at": "2026-05-01",
      "status": "done_with_concerns",
      "schema_version": 1,
      "stale_after_days": 30,
      "stale": false,
      "summary": "Trial-to-paid conversion dropped 40% in March; root cause: onboarding email regression",
      "size_bytes": 12104,
      "frontmatter_present": true
    }
  },
  "experience": {
    "audience.md": {
      "path": ".agents/experience/audience.md",
      "last_written_by": "icp-research",
      "last_written_at": "2026-05-06T09:11:00.000Z",
      "entries": 7,
      "size_bytes": 4321
    }
  }
}
```

### Field reference

**Top level:**
- `version` — manifest schema version. Currently `1`. Bump only on breaking shape changes.
- `updated_at` — ISO timestamp of last sync run. Consumers can use this to detect drift.
- `artifacts` — map of path → artifact entry. Paths may come from `.agents/skill-artifacts/`, `research/`, `brand/`, or `architecture/`.
- `experience` — map of `<domain>.md` filename → experience entry. Separate because experience files are append-only multi-skill, not single-producer.

**Artifact entry:**
- `produced_by` — skill name that wrote this. From frontmatter `skill:` field, or inferred from path if missing.
- `produced_at` — date string (`YYYY-MM-DD`) or ISO timestamp. From frontmatter `date:`, or file mtime fallback.
- `status` — `done | done_with_concerns | blocked | needs_context`. From frontmatter; default `done` if absent.
- `schema_version` — version of the artifact's own schema (NOT the manifest version). From frontmatter `version:`; default `1`.
- `stale_after_days` — staleness threshold for THIS artifact type. From frontmatter; default `90`.
- `stale` — derived: `true` if `now > produced_at + stale_after_days`.
- `title` — display title from frontmatter `title:`, first H1, or filename fallback.
- `summary` — one-line summary from frontmatter `summary:`. Empty string if absent.
- `purpose` — why this artifact exists. This is selection context, not a body summary.
- `lifecycle` — common values: `canonical | loop | loop-context | learning | anchor | registry | decision | spec | strategy | execution | evaluation | pipeline | snapshot | archive | ephemeral`. From frontmatter when present, inferred from path otherwise.
- `use_when` — short routing rule for when a skill or human should read the artifact.
- `do_not_use_when` — short guardrail for when the artifact is misleading or out of scope.
- `supersedes` — path or slug this artifact replaces. Lineage metadata; may point into archive.
- `superseded_by` — path or slug that replaces this artifact. Consumers should prefer the replacement.
- `upstream` — comma-separated sources or prerequisite artifacts that fed this one.
- `downstream` — comma-separated skills or artifacts expected to consume this one.
- `decision_status` — optional decision state (`proposed`, `accepted`, `rejected`, `superseded`, etc.) for decision/spec artifacts.
- `size_bytes` — file size, useful for sanity checks.
- `frontmatter_present` — `true` if any frontmatter was found, `false` if file has none. Lets consumers distinguish well-formed artifacts from legacy ones.

**Experience entry:**
- `path` — relative path to the experience file.
- `last_written_by` — skill that wrote the most recent `**Asked by:**` block.
- `last_written_at` — file mtime ISO timestamp.
- `entries` — count of `## ` headings (one per Q+A block).
- `size_bytes` — file size.

---

## The Artifact Frontmatter Contract

Every skill that produces an artifact writes a YAML frontmatter block at the top:

```yaml
---
skill: icp-research
version: 1
date: 2026-05-07
status: done
stale_after_days: 90
summary: "Engineering managers, mid-size SaaS, 50-200 engineers"
purpose: "Canonical audience record for downstream skills"
lifecycle: canonical
use_when: "Grounding audience, buyer, pain, VoC, or market-facing output"
do_not_use_when: "The product, audience, or market has materially changed"
upstream: "operator interview, product source material"
downstream: "brand-system, campaign-plan, copywriting, system-architecture"
---
```

### Required fields

- `skill` — producing skill name (matches the skill's directory name)
- `version` — schema version of this artifact type. Start at `1`. Bump when you change the artifact's structure in a breaking way.
- `date` — `YYYY-MM-DD` (or ISO timestamp). When this version was produced.
- `status` — one of `done | done_with_concerns | blocked | needs_context` (Completion Status Protocol from CLAUDE.md).

### Optional fields

- `stale_after_days` — how long before this artifact should be considered stale (default `90`). Use shorter values for fast-moving artifacts (e.g., `diagnose.md` → `30`); use longer for slow-moving (e.g., `brand/BRAND.md` → `365`).
- `summary` — one-line summary of the artifact's key takeaway. Quoted string. Lets consumers preview without reading the full file.
- `title` — display title. Optional because sync derives it from the first H1.
- `purpose` — why the artifact exists. Required in practice for new non-terminal artifacts; optional only for legacy compatibility.
- `lifecycle` — lifecycle taxonomy value. Required in practice for new artifacts; sync infers from path for legacy compatibility.
- `use_when` — when this artifact should be selected.
- `do_not_use_when` — when this artifact should be skipped or refreshed.
- `supersedes` / `superseded_by` — lineage pointers for replacements and archived history.
- `upstream` / `downstream` — comma-separated dependency/context hints.
- `decision_status` — decision state for specs and decisions.

Keep optional frontmatter fields flat scalar strings. Do not use nested YAML or multiline values; the sync parser intentionally stays small and deterministic.

### Skill author obligations

When you ship a new skill OR edit an existing skill that produces artifacts:

1. **Write frontmatter on every produced artifact** with at minimum the four required fields.
2. **Call `manifest-sync` at end of skill** as the final side-effect (one bash line — see Write Protocol below).
3. **Don't write to `.agents/manifest.json` directly.** It's derived state. Update artifact frontmatter; let sync derive the rest.

Legacy artifacts without frontmatter are tolerated — sync infers `produced_by` from path patterns and defaults the rest. But missing frontmatter shows up in the manifest as `frontmatter_present: false`, which orchestrators can surface as a quality signal.

---

## Sync Mechanism

### The script

`scripts/manifest-sync.ts` — Bun TypeScript, ~100 lines, no dependencies.

What it does:
1. Walk `.agents/skill-artifacts/`, `research/`, `brand/`, `architecture/` recursively, collecting `*.md` files.
2. For each file, parse frontmatter (minimal inline YAML parser — flat `key: value`).
3. For artifacts: build entry from frontmatter + file stat + path-based fallback for missing fields.
4. For experience files (`.agents/experience/*.md`): count entries, find last writer.
5. Compute `stale` per artifact.
6. Write `.agents/manifest.json` (pretty-printed JSON, trailing newline).
7. Write `.agents/artifact-index.md` (human-readable selection index derived from the manifest).

The script is **idempotent** for unchanged artifact state — running it twice preserves `updated_at` and generated output. It is **self-healing** — if a skill forgets to call it, the next run reconciles. It has **no dependencies** beyond Bun runtime.

### Human-readable index

`manifest-sync` also writes `.agents/artifact-index.md`. This file is infrastructure, like `.agents/manifest.json`; it is not a skill output and should not be hand-edited. It exists for the exact failure mode the JSON manifest does not solve well: a human or agent browsing artifacts needs to know **why** an artifact exists, **when** to use it, and **what replaced it**.

The index groups active artifacts separately from archived/historical artifacts. Active canonical records, anchors, registries, decisions, and specs come first. Snapshots and archived rows are audit trail by default unless their `use_when` field says otherwise.

### Eval loop workspaces

Measurable initiatives use `skills-resources/loops/[slug]/`:

```text
.agents/skill-artifacts/
└── loops/
    └── pricing-page/
        ├── program.md      # lifecycle: loop
        ├── context.md      # lifecycle: loop-context
        ├── strategy/       # lifecycle: strategy
        ├── execution/      # lifecycle: execution
        ├── evals/          # lifecycle: evaluation
        ├── results.tsv     # compact ledger, not indexed because it is not markdown
        └── learnings.md    # lifecycle: learning
```

See `references/_shared/eval-loop-spec.md` for the full loop contract. The manifest does not parse `results.tsv`; evaluation skills append rows there and write markdown eval artifacts with frontmatter under `evals/` for indexing.

### Invocation

```bash
bun /path/to/scripts/manifest-sync.ts
```

Skills should call this with an absolute path resolved at install time, or use the `MANIFEST_SYNC` env var if the user has installed the skills in a non-standard location.

For projects that ship the skills as a submodule, the canonical path is:
```bash
bun .claude/skills/scripts/manifest-sync.ts
# or
bun scripts/manifest-sync.ts
```

---

## Read Protocol (Consumers)

When a skill needs to know what artifacts exist, what their status is, or whether they're stale, the read order is:

1. **Read `.agents/manifest.json` first.** Single file, single read. Tells you everything you need to discover and evaluate artifacts.
2. **If the artifact you need is listed → read the artifact itself for content.** Manifest gives you the metadata; the markdown gives you the substance.
3. **If the artifact is NOT in the manifest → it does not exist OR sync is stale.** Fall back to filesystem check only if you suspect drift.

For exploratory browsing or human-facing status summaries, read `.agents/artifact-index.md` after the JSON manifest. The JSON is the machine contract; the index is the readable map.

### Status-aware consumption

A consumer should react to the manifest entry's `status` and `stale` fields:

| Manifest signal | Recommended consumer behavior |
|---|---|
| `status: done`, `stale: false` | Consume freely. Standard path. |
| `status: done_with_concerns` | Consume but surface the caveat to the user. ("icp-research finished with concerns — proceeding may amplify them.") |
| `status: blocked` or `needs_context` | Treat as missing. Don't consume. Recommend re-running the producer skill. |
| `stale: true` | Consume but warn. ("icp-research is 6 months old. Refresh before proceeding?") |
| `frontmatter_present: false` | Consume cautiously. The artifact is from a legacy run; quality assumptions don't hold. Suggest a refresh. |
| `superseded_by` present | Prefer the replacement artifact unless the user explicitly asks for history. |
| `do_not_use_when` matches current situation | Treat as stale/misleading even if `stale: false`; ask whether to refresh or proceed. |

### What manifest-aware orchestrators do

`start-*` orchestrators replace per-skill state-detection tables with a single manifest read:

```typescript
// Before (per-skill scan)
const icpExists = await fileExists('research/icp-research.md')
const marketExists = await fileExists('research/market-research.md')
// ...

// After (manifest read)
const manifest = JSON.parse(await readFile('.agents/manifest.json', 'utf8'))
const icpEntry = manifest.artifacts['research/icp-research.md']
const icpDone = icpEntry?.status === 'done' && !icpEntry.stale
```

Cleaner code, status-aware, and adding new artifacts to track requires no orchestrator change — sync picks them up automatically.

---

## Write Protocol (Producers)

When a skill finishes producing an artifact:

1. **Write the artifact** with required frontmatter (`skill`, `version`, `date`, `status`).
2. **Run sync as the last step** before returning control:
   ```bash
   bun scripts/manifest-sync.ts
   ```
3. **Do NOT write to `.agents/manifest.json` directly.** Sync owns it.

This is intentionally a single-script approach instead of per-skill manifest writes:
- **No skill can corrupt the manifest** — sync rebuilds from scratch.
- **No skill needs to know the manifest schema** — it just writes its artifact correctly.
- **Self-healing** — if any skill forgets, the next sync reconciles everything.

The trade-off is one extra ~100ms script call per skill run. Acceptable.

---

## Staleness Rules

`stale_after_days` lives on each artifact (set by the producer). Defaults that producers should follow:

| Artifact category | Default `stale_after_days` |
|---|---|
| Audience / market research (`icp-research`, `market-research`) | 90 |
| Brand identity (`brand/BRAND.md`, `brand/DESIGN.md`) | 365 |
| Architecture (`architecture/system-architecture.md`) | 180 |
| Diagnosis (`.agents/skill-artifacts/meta/records/diagnose-*.md`) | 30 — diagnoses age fast |
| Prioritization (`.agents/skill-artifacts/meta/sketches/prioritize-*.md`) | 60 |
| Funnel targets (`.agents/skill-artifacts/meta/records/targets-*.md`) | 60 |
| Tasks (`.agents/skill-artifacts/meta/tasks.md`) | 14 — tasks should be acted on quickly |
| Cleanup reports (`.agents/skill-artifacts/meta/records/cleanup-*.md`) | 30 |
| Spec from `discover` (`.agents/skill-artifacts/meta/specs/*.md`) | 60 |
| Marketing artifacts (`.agents/skill-artifacts/mkt/**`) | 30 |
| Loop programs (`skills-resources/loops/*/program.md`) | 90 |
| Loop context (`skills-resources/loops/*/context.md`) | 60 |
| Loop evals (`skills-resources/loops/*/evals/*.md`) | 90 |
| Loop learnings (`skills-resources/loops/*/learnings.md`) | 180 |
| Meta reports (`.agents/skill-artifacts/meta/decisions/[date]-*.md`, `.agents/skill-artifacts/meta/records/fresh-eyes-*.md`) | 14 — these are point-in-time |

These are defaults. A producer can override per-artifact if context warrants (e.g., a campaign-plan locked to a 90-day campaign sets `stale_after_days: 90`).

Consumers should respect `stale: true` as a warning signal, not a hard block. The user gets the call to refresh or proceed.

---

## Experience Domain Handling

`.agents/experience/{domain}.md` files are different from regular artifacts:
- **Multi-producer** — many skills append to the same file.
- **Append-only** — never overwritten, only added to.
- **No single status** — each Q+A block is independently valid.

The manifest tracks them in a separate `experience` map (see schema above). Sync infers `last_written_by` by scanning the file for the most recent `**Asked by:**` line (the Pre-Dispatch Protocol writes this for every Q+A block).

Consumers (typically `start-*` orchestrators) use the `entries` count as a heuristic for "how much context has been gathered in this domain." A domain with 7 entries is well-covered; one with 1 entry barely is.

---

## Anti-Patterns

1. **Writing to `.agents/manifest.json` directly from a skill.** It's derived. Update the artifact, run sync.
2. **Reading the filesystem when the manifest would do.** Per-skill `glob('.agents/skill-artifacts/**')` defeats the point. Read manifest first; fall back only on drift suspicion.
3. **Skipping sync after producing an artifact.** Manifest goes stale; downstream consumers see ghost state. Always sync.
4. **Treating `stale: true` as a hard block.** It's a warning. Surface it to the user; let them decide.
5. **Using the manifest as a database** — querying complex relationships, joining across artifacts, etc. The manifest is an index, not a database. Loop-local history belongs in `skills-resources/loops/[slug]/results.tsv` and markdown artifacts; if you need richer queries, add SQLite later — but only when first real need surfaces.
6. **Hand-editing `.agents/artifact-index.md`.** It is generated. Fix artifact frontmatter or the sync script instead.
7. **Adding fields to manifest entries without spec'ing them here first.** The schema is the contract. Drift breaks consumers.
8. **Over-trusting `summary`.** It's a one-line preview, not a substitute for reading the artifact when content matters. Use it for routing decisions, not for grounded analysis.
9. **Leaving `purpose` / `use_when` blank on new non-terminal artifacts.** This recreates the original selection problem: the artifact exists, but nobody knows why to select it.

---

## Future Extensions (Explicitly Out of Current Scope)

These are recorded so future-us doesn't accidentally rebuild them ad-hoc:

- **Schema validation.** When the first breaking change to an artifact type happens, add a per-type schema validator. Until then, `schema_version` is metadata-only.
- **Event bus / pub-sub.** No skill currently needs to be notified when another skill finishes. If autonomous mode (deferred) is built, it may need this — but not now.
- **Locking.** Pipeline artifacts have single producers; experience files are append-only. No collisions to resolve. Add only if multi-producer artifacts emerge.
- **SQLite backing.** Only if manifest exceeds ~1MB or loop queries become complex. Currently <50KB even at scale.
- **Autonomous orchestrator mode.** A separate consumer of this manifest, built later. The manifest is *designed* to support it (status, stale, summary, schema_version all enable safe auto-decisions) but the orchestrator is a separate scope. Eval loops intentionally require human approval before publishing or mutating live marketing/content surfaces.

---

## Migration & Compatibility

**Existing artifacts without frontmatter** — sync handles gracefully:
- `produced_by` inferred from path (e.g., `research/icp-research.md` → `icp-research`).
- `produced_at` falls back to file mtime.
- `status` defaults to `done`.
- `schema_version` defaults to `1`.
- `stale_after_days` defaults to `90`.
- `frontmatter_present: false` flags it for the consumer.

**Skill migration order** (informational, not enforced):
1. `start-*` orchestrators retrofit to read manifest. Immediate value: cleaner code, status-aware routing.
2. Skills that produce widely-consumed artifacts (icp-research, market-research, brand-system) retrofit to write rich frontmatter. Compounding value as more consumers benefit.
3. Skills that produce mostly-local artifacts (humanize, vn-tone) retrofit when they're touched for other reasons. Lowest priority.

No big-bang migration. Sync's graceful fallback means partial adoption is safe.

---

## Per-Skill Obligations (Quick Reference)

| Skill role | Obligation |
|---|---|
| **Producer** (writes artifacts) | Write required frontmatter; call `manifest-sync` at end. |
| **Consumer** (reads artifacts) | Read manifest first; respect `status` and `stale`; fall back to filesystem only on drift suspicion. |
| **Orchestrator** (`start-*`) | Read manifest as the source of state. Replace per-path scans. Surface `stale`, `done_with_concerns`, and `frontmatter_present: false` as routing signals. |
| **Pre-Dispatch user** (any skill) | Sync also tracks experience files. Reading manifest's `experience` block tells you which domains have context. |
