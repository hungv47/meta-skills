## Scope — In-Repo Skills Only

When the user asks about "my skills," "our skills," or where to add a capability, the candidate set is **only the skills in this repo** under `skills/{meta,research,marketing,product}/`. 39 skills total.

Do **not** recommend or route to external skills (Impeccable, Vercel plugins, and other marketplace/plugin skills that appear in the available-skills list). They may be installed locally, but they are not part of this stack and are not the user's to edit. If a gap exists, propose either (a) enriching an existing in-repo skill or (b) a new in-repo skill that clears the Quality Standard bar — never "use the Impeccable `optimize` skill" or similar.

Exception: the user explicitly names an external skill and asks about it.

## Repository Structure

Single repo. No submodules. All 39 skills live here, organized by domain:

```
meta-skills/
├── .claude-plugin/
│   ├── marketplace.json    # single-plugin catalog (this repo IS the marketplace)
│   └── plugin.json         # lists all 39 skill paths
├── skills/
│   ├── meta/         # 7 process-layer skills (forsvn, discover, debate-panel, …)
│   ├── research/     # 7 research skills (research-icp, research-market, diagnose, …)
│   ├── marketing/    # 19 marketing skills (create-brand, write-copy, brief-landing-page, …)
│   └── product/      # 6 product skills (map-user-flow, architect-system, clean-code, …)
├── references/       # cross-stack canonical contracts (pre-dispatch, mode-resolver, manifest-spec, …)
├── scripts/          # manifest-sync, audit, marketplace-bump, portability, harness
├── hooks/            # user-prompt-submit skill-router (suggestion-only)
├── skills-resources/ # loops + experience substrate (user-facing persistent state)
├── implementation-roadmap/  # planning history (v6 refactor done/, canonical-paths.md, etc.)
└── assets/banners/
```

Repo: `github.com/hungv47/meta-skills`. This repo is self-hosting — its `.claude-plugin/marketplace.json` IS the marketplace users add (no separate umbrella).

**Pre-2.0 history**: this stack was previously distributed as four separate plugins (`research-skills`, `marketing-skills`, `product-skills`, `meta-skills`) under an `agent-skills` umbrella. v2.0 consolidates them into this single repo; the other three repos and the umbrella are archived. See `CHANGELOG.md` § 2.0.0.

## Git Operations

Plain single-repo workflow — no submodules, no double-commit dance.

```bash
git clone https://github.com/hungv47/meta-skills.git
cd meta-skills
# edit, commit, push
git add . && git commit -m "..." && git push
```

### Releasing

Two files must move together for `/plugin marketplace update meta-skills` to nudge installed users:

- **`.claude-plugin/plugin.json` `version`** — what users see when they run `/plugin update meta-skills`.
- **`.claude-plugin/marketplace.json` `metadata.version`** — what users see when they run `/plugin marketplace update meta-skills`. Without a bump here, the catalog looks unchanged even if `plugin.json` moved.
- **`CHANGELOG.md`** — add a Keep a Changelog entry for the version, with `[meta]` / `[research]` / `[marketing]` / `[product]` stack prefixes where changes are stack-scoped.
- **GitHub Release** — publish at `github.com/hungv47/meta-skills/releases`. Body should mirror the CHANGELOG entry and include `/plugin marketplace update meta-skills` instructions.

Use the helper to bump the marketplace catalog version:

```bash
bun scripts/bump-marketplace.ts <patch|minor|major> "<one-line summary>"
```

Choose the bump kind: skill added/removed → minor; bugfixes only → patch; breaking change (skill removed/renamed, schema break) → major.

See `RELEASING.md` for: batch-landings cadence rule, CHANGELOG entry template, anti-patterns list, 20-line target. Authoritative for what to release and how to write the notes — not duplicated here.

## Skill Discovery

Skill routing happens inline — the agent proposes skills proactively based on the system reminder skill list. Skills are organized by stack under `skills/{meta,research,marketing,product}/`.

A `hooks/user-prompt-submit-skill-router.mjs` heuristic ships in the repo as **suggestion-only**: it scans incoming prompts and emits a `<system-reminder>` hint listing matched skills. The hint is advisory — the agent applies its own relevance gate, and the router never auto-invokes a skill. Treat router output as one signal among the agent's own pattern matching.

## Quality Standard

This skill stack is premium. Every skill uses multi-agent orchestration, critic agents with quantitative rubrics, anti-sycophancy mechanisms, and signal-vs-noise verification. The bar for additions is high.

**When evaluating external skills, techniques, or patterns for adoption:**
- Default to SKIP. Only adopt what demonstrably improves output quality or fills a genuine domain gap.
- Check if we already have it under a different name before recommending anything.
- "Sounds interesting" is not a reason to adopt. "This would change the outcome of skill X in scenario Y" is.
- Techniques must survive adversarial review: Is this a real problem we have? Will the LLM actually follow this instruction? Is the implementation cost justified by the quality delta?
- Reference data and frameworks are worth stealing when they're practitioner-grade with cited research. Generic advice is noise.
- New skills must clear the same quality bar as existing skills — multi-agent architecture, critic gates, worked examples, anti-patterns. A lightweight conversational prompt is not a skill at our standard.

Signal, not noise. Protect the stack.

## Complexity Routing

Every skill declares a `budget` tier in its frontmatter: `fast`, `standard`, or `deep`. The resolved mode at invocation = `budget` tier + auto-downgrade heuristics + operator override (`--fast` / upward phrases).

**`--fast` skips orchestration weight, not correctness floor.** Cold Start questions still run when context is unresolved; hard safety gates (brand-system check, policy compliance, golden rules) still fire.

**Single source of truth: [`references/mode-resolver.md`](references/mode-resolver.md)** — full tier definitions, auto-downgrade heuristics, bidirectional override mechanics, what `--fast` does NOT skip, conflict resolution, citation patterns, anti-patterns. Read once; every skill cites it.

## Completion Status Protocol

Every skill output ends with an explicit status. No implicit "here's the output" — the agent must declare the state.

| Status | Meaning | When |
|--------|---------|------|
| **DONE** | Output meets all requirements and passes critic gate | Clean completion |
| **DONE_WITH_CONCERNS** | Output delivered but with flagged risks or limitations | Critic passed but reviewer noted issues worth monitoring |
| **BLOCKED** | Cannot complete — missing input, external dependency, or unresolvable conflict | State what's needed to unblock |
| **NEEDS_CONTEXT** | Insufficient information to produce quality output | State what's missing and which upstream skill would provide it |

Skills that produce artifacts must include the status in the artifact frontmatter (`status: done | done_with_concerns | blocked | needs_context`). Skills that return inline results state the status at the end of their response.

## Design Philosophy

### Completeness Bias

When the complete implementation costs minutes more than the shortcut, do the complete thing. Every time.

**Lake vs. ocean:** A "lake" is boilable — achievable in one session with AI assistance. Full test coverage for a module, complete error handling, all edge cases. An "ocean" is not — multi-quarter platform migrations, full rewrites of mature systems. Boil lakes. Flag oceans as out of scope.

Skills should default to thoroughness. "Defer tests to a follow-up" is legacy thinking from when human engineering time was the bottleneck.

### Effort Compression

AI compresses implementation time. Use this table when evaluating build-vs-skip decisions in prioritize and system-architecture:

| Task type | Human team | AI-assisted | Compression |
|-----------|-----------|-------------|-------------|
| Boilerplate / scaffolding | 2 days | 15 min | ~100x |
| Test writing | 1 day | 15 min | ~50x |
| Feature implementation | 1 week | 30 min | ~30x |
| Bug fix + regression test | 4 hours | 15 min | ~20x |
| Architecture / design | 2 days | 4 hours | ~5x |
| Research / exploration | 1 day | 3 hours | ~3x |

An initiative that looks "High Effort" for a human team may be "Low Effort" with AI assistance. ICE scores should reflect AI-assisted effort, not raw human effort.

## Knowledge Management

Three mechanisms persist knowledge across sessions — each serves a different purpose:

| System | Location | Purpose |
|--------|----------|---------|
| Auto-memory | `MEMORY.md` | Cross-session user/project memory (preferences, context, references) |
| Learned rules | `.agents/skill-artifacts/meta/records/learned-rules.md` | Agent behavior corrections from user feedback |
| Experience docs | `.forsvn/experience/{domain}.md` | **Append-only Q&A substrate written by every skill on cold-start, read before asking. Domains are flexible (product, audience, business, brand, goals — and any new domain skills route to). Most recent entry per dimension key wins; history kept as audit trail. See [`references/pre-dispatch-protocol.md`](references/pre-dispatch-protocol.md) for the read/write loop and per-skill question registry. (Path moved from `skills-resources/experience/` to `.forsvn/experience/` per Workstream A — `skills-resources/` was never materialized; see `implementation-roadmap/execution-evaluation/decisions.md` D2.)** |

## Artifact Placement

> **v2.0 — Workstream A update (2026-05-19):** `.forsvn/` is now the canonical user-facing state root. It absorbs everything previously planned under `skills-resources/` (loops, experience) and the user-facing portions of `.agents/skill-artifacts/`. `.agents/` is reserved for **machine-derived infrastructure only** (manifest, index). The historical layout below is preserved for reference until Workstream B rewires per-skill paths; new work writes to `.forsvn/`. See `.forsvn/README.md` for the canonical layout and `implementation-roadmap/execution-evaluation/decisions.md` § D2 for the decision.

```
.forsvn/                # user-facing state root (canonical, per Workstream A)
├── context/            # 12-section shared product-marketing context
├── experience/         # cross-skill Q&A substrate (append-only)
├── artifacts/          # per-initiative, per-skill work product
├── loops/              # measurable strategy → execution → evaluation cycles
├── evals/              # standalone evals + critic-override log
├── routing/            # /forsvn resume metadata + intent history
└── dashboard/          # derived quality views (regenerated)
```

The stack accumulates artifacts fast. Without a clean structure, `.agents/` and loop workspaces become junk drawers that are hard for humans AND agents to navigate. The rule below codifies the legacy three-surface system: **infrastructure at `.agents/` root, one-shot skill outputs under `.agents/skill-artifacts/`, and measurable initiative loops under `skills-resources/loops/`** — superseded by `.forsvn/` for user-facing artifacts. `.agents/` remains valid for infrastructure (manifest.json, artifact-index.md).

### Layout

```
.agents/
├── manifest.json           # state index (read by all skills, regenerated by manifest-sync)
├── artifact-index.md       # human-readable artifact selection map, regenerated by manifest-sync
├── experience/             # Q&A substrate (read+append by all skills)
│   ├── README.md
│   └── {domain}.md         # product, audience, business, brand, goals, ...
└── skill-artifacts/        # one-shot skill outputs live here
    ├── meta/               # cross-cutting
    │   ├── roadmap.md      # session anchor, always loaded
    │   ├── tasks.md        # session anchor, always loaded
    │   ├── decisions/      # operator-committed strategic choices (panel reports, scope contracts, freeze announcements) — dated, immutable
    │   ├── records/        # audits, snapshots, inventories, fresh-eyes reports, registries — dated unless living
    │   ├── sketches/       # SKILL.md drafts awaiting build decision — undated, working drafts
    │   ├── specs/          # discover outputs, scope contracts — undated, working drafts
    │   └── out-of-scope/   # rejected approaches (per discover skill convention)
    ├── mkt/                # marketing pipeline (copy, briefs, campaigns)
    ├── product/            # product pipeline (user-flow, etc.)
    ├── research/           # research pipeline (NOT the canonical research/ — see below)
    │   └── {skill}/        # e.g., short-form-eval/, short-form-research/
    └── .archive/           # cleanup-artifacts target
        └── YYYY-MM-DD/

skills-resources/
└── loops/
    └── {loop-slug}/
        ├── program.md      # loop operating contract
        ├── context.md      # loop-local assumptions, baselines, constraints
        ├── strategy/       # strategy artifacts for this measurable initiative
        ├── execution/      # publish-ready marketing/content assets
        ├── evals/          # evaluation snapshots and metric reviews
        ├── results.tsv     # compact keep/discard/watch/blocked ledger
        └── learnings.md    # promoted reusable lessons
```

### Lifecycle taxonomy

Every artifact declares a lifecycle via frontmatter `lifecycle:` field.

| Lifecycle | Where | Behavior |
|---|---|---|
| **canonical** | top-level (`brand/`, `architecture/`, `research/`) | edited in place, kept forever, hand-curated by humans |
| **loop** | `skills-resources/loops/{slug}/program.md` | operating contract for a measurable strategy → execution → evaluation loop |
| **loop-context** | `skills-resources/loops/{slug}/context.md` | local assumptions, baselines, source links, constraints |
| **strategy** | `skills-resources/loops/{slug}/strategy/` | loop-specific plans, hypotheses, briefs, test designs |
| **execution** | `skills-resources/loops/{slug}/execution/` | marketing/content assets this stack can actually produce |
| **evaluation** | `skills-resources/loops/{slug}/evals/` | post-execution metric snapshots, scoring, confidence notes |
| **learning** | `skills-resources/loops/{slug}/learnings.md` | promoted evidence-backed lessons for future cycles |
| **pipeline** | `.agents/skill-artifacts/{domain}/` | one-time skill output, may be stale within weeks, regenerated by re-running |
| **decision** | `.agents/skill-artifacts/meta/decisions/` | dated immutable record of a strategic choice (panel reports, freeze announcements) |
| **snapshot** | `.agents/skill-artifacts/meta/records/` | dated point-in-time record (audits, fresh-eyes reports, inventories) — also holds living registries (skill-contracts.md) |
| **ephemeral** | `.agents/skill-artifacts/.archive/` after cleanup | working files; default cleanup target |

`sketches/` and `specs/` are working drafts — neither immutable (they may be edited until promoted/discarded) nor pipeline outputs.

### Naming convention

- **decisions, records (dated):** `YYYY-MM-DD-slug.md` mandatory. Date in filename so `ls -la` is meaningful and collisions impossible.
- **records (living registry):** undated slug — e.g., `skill-contracts.md`. Frontmatter `kind: registry` flags as living.
- **sketches, specs:** undated slug — they're working drafts, edited until promoted (decision/audit) or discarded.
- **pipeline:** per-skill convention (e.g., `mkt/copy/[platform]-[date].md`, `research/short-form-eval/YYYY-MM-DD-cycle-N.md`). Existing per-skill paths preserved.
- **loops:** `skills-resources/loops/{loop-slug}/...`; organize by measurable initiative, never by producing skill.

### Top-level canonical folders (the dedicated-folder exception)

A skill may write to a **top-level folder** instead of `.agents/skill-artifacts/` only when the artifact is a **canonical source of truth**, not a pipeline step. Three-criteria binding test (all must pass):

1. **Canonical** — the team's authoritative record for a domain (identity, system, audience)
2. **Updated in place by humans** — amended over time as truth evolves, not regenerated wholesale by re-running the skill
3. **Compound value** — future work keeps referencing it; consumed across sessions, not once-and-done

Current top-level folders:
- `brand/` — brand identity of record (from brand-system). Co-locates `brand/logo/`, `brand/font/`, `brand/inspiration/`.
- `architecture/` — system blueprint of record (from system-architecture). Co-locates schemas, ADRs, diagrams.
- `research/` — audience and market of record (from icp-research, market-research). Holds `product-context.md`, `icp-research.md`, `market-research.md`; intended to co-locate interview transcripts, survey data, competitor research.

`research/` (top-level canonical) and `.agents/skill-artifacts/research/` (pipeline) are intentionally distinct — one holds the authoritative ICP/market record, the other holds per-cycle eval outputs and similar pipeline data. Don't conflate them.

`.forsvn/` is the dedicated user-facing state root (per Workstream A, supersedes prior `skills-resources/` plan). Do not add other new top-level folders without clearing the canonical three-criteria test or the loop contract in `references/eval-loop-spec.md`. Folder sprawl is worse than consistent placement.

### Infrastructure placement: `.agents/` root vs `.forsvn/`

Two distinct surfaces:

- **`.agents/manifest.json` + `.agents/artifact-index.md`** — machine-derived indexes of artifact metadata. Manifest is regenerated by `bun scripts/manifest-sync.ts`; artifact-index is the human-readable selection map. Both index `.forsvn/` + canonical folders (`brand/`, `architecture/`, `research/`). Stay at `.agents/` root because they serve all skills equally and aren't produced by any single skill.

- **`.forsvn/`** — user-facing persistent knowledge (context, experience, artifacts, loops, evals, routing, dashboard). The user's own append-only memory of what they've told skills, plus every skill's work product. See `.forsvn/README.md` for the layout contract.

**Historical notes** (kept for migration context — not active conventions):
- An early `bootstrap-experience.ts` briefly placed experience at `.agents/experience/`; planned to move to `skills-resources/experience/`. Both paths were superseded 2026-05-19 by `.forsvn/experience/` per Workstream A (`implementation-roadmap/execution-evaluation/decisions.md` D2). `skills-resources/` never materialized in the repo.
