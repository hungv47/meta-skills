---
name: orchestrate-product
description: "Stack orchestrator for product-skills. Reads what's already done in `.agents/skill-artifacts/product/`, `architecture/`, and `research/`, parses your intent, and proposes the next 1–3 skills (user-flow → system-architecture → docs-writing, plus standalone code-cleanup and machine-cleanup). Use when you don't know which product skill to invoke, or want a guided run from user flows through architecture to docs. Not for executing the work itself — it routes to the skill that does. Not for cross-stack workflows (use orchestrate-meta or invoke skills directly). Renamed from `start-product` in v3.0.0."
argument-hint: "[free-form ask, or empty to be guided]"
allowed-tools: Read Grep Glob Bash
user-invocable: true
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
  budget: fast
  estimated-cost: "$0.03-0.10"
  refactor_history:
    - refactored_at: 2026-05-17
      refactored_for: implementation-roadmap v6 Phase 2 Wave 1 (router body-diet + playbook ref + chain hardening, mirrors orchestrate-meta post-refactor structure)
      body_before: 242
      body_after: 128
      body_delta_pct: -47.1
      note: body-only line counts (frontmatter excluded). Total file 321 → 214.
promptSignals:
  phrases:
    - "where do i start with product"
    - "what skill should i use for product"
    - "start product"
    - "begin product"
    - "product workflow"
    - "i need to design a feature"
    - "build something"
  allOf:
    - [where, start, product]
    - [what, skill, product]
  anyOf:
    - "product workflow"
    - "design a feature"
    - "system design"
    - "user journey"
    - "code cleanup"
    - "machine cleanup"
    - "documentation"
  noneOf:
    - "marketing campaign"
    - "landing page"
    - "icp"
  minScore: 5
routing:
  intent-tags:
    - product-orchestration
    - workflow-routing
    - stack-entry-point
    - product-guide
  position: orchestrator
  lifecycle: pipeline
  produces:
    - skills-resources/experience/product-workflow.md
  side-effects:
    - manifest-sync
  consumes:
    - research/product-context.md
    - .agents/skill-artifacts/product/flow/*.md
    - .agents/skill-artifacts/product/flow/index.md
    - architecture/system-architecture.md
    - .agents/skill-artifacts/meta/records/cleanup-*.md
    - .agents/skill-artifacts/meta/records/machine-cleanup-*.md
    - .agents/skill-artifacts/meta/specs/*.md
    - .agents/skill-artifacts/meta/tasks.md
    - skills-resources/experience/*.md
  requires: []
  defers-to:
    - skill: user-flow
      when: "designing a feature with multiple screens / decisions / states"
    - skill: system-architecture
      when: "tech stack, schema, API design, file structure"
    - skill: docs-writing
      when: "README, API reference, runbook, ship log, setup guide"
    - skill: code-cleanup
      when: "auditing existing code for dead code, duplication, refactor candidates"
    - skill: machine-cleanup
      when: "auditing developer machine — caches, dotfolders, package globals"
    - skill: discover
      when: "spec is unclear before any product skill can run"
    - skill: task-breakdown
      when: "spec + architecture exist, need a buildable task list"
  parallel-with: []
  interactive: true
  estimated-complexity: low
---

# Orchestrate Product — Router

*Meta — Stack orchestrator. Reads product-stack state, parses your ask, points at the right next skill. Does NOT execute work; that's the skill it routes you to.*

**Core Question:** "Given the spec, the user-flow state, and the architecture state, what's the next product skill to run?"

[Read `references/playbook.md` [PLAYBOOK] to understand why this skill does what it does — methodology, principles, when NOT to use.]

## When To Use

- Just installed product-skills and don't know what to type.
- Mid-build and forget which skill is next.
- Vague need ("design this feature", "clean up the codebase", "document this", "tidy my machine") and want guided routing.
- Resuming across sessions.

## When NOT To Use

- You already know which skill to run.
- Task is cross-stack (needs research + product) — use `/orchestrate-meta`.
- You want execution rather than routing.

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode declaration** — this skill is `budget: fast` with no escalation path (no sub-agents, no critic gate, no `--apply`-style modes). The mode-resolver ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]) resolves to `fast` and runs. No emit-and-wait prompt — there's no meaningful mode to escalate to. The resolver's load-bearing job here is enforcing "safety gates don't skip under `--fast`": state snapshot still runs; routing still produces a hand-off; no auto-invoke regardless.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify this skill's output path matches the canonical inventory.
2. Read `.agents/manifest.json` + `.agents/artifact-index.md` (product-skill foundation files).
3. `skills-resources/experience/*.md` files are read as **state input** (per `routing.consumes`) — not as cold-start dimension resolution. This skill IS the entry point that produces `skills-resources/experience/product-workflow.md`, so Pre-Dispatch's experience-dimension read doesn't apply.
4. If `.agents/manifest.json` is missing AND no filesystem fallback paths exist (fresh project) → use the empty-ask fallback in [`references/output-formats.md`](references/output-formats.md) [PROCEDURE] Format 4 to scope.

## Artifact Contract

- **Path:** `skills-resources/experience/product-workflow.md` (append-only breadcrumb log)
- **Lifecycle:** `pipeline` (⚠️ canonical-paths.md flags this as a lifecycle violation — orchestrate-* workflow state should move to `meta/orchestrator-state/` per Phase 2 cleanup; current behavior preserved verbatim for backwards-compat)
- **Frontmatter fields:** none required on the file itself; each append is timestamped + decision-tagged
- **Required sections per append:** `## Session YYYY-MM-DD` heading + bullet list (Read state / User intent / Recommended / User confirmed)
- **Consumed by:** future `/orchestrate-product` invocations (precedent + re-entry detection), operator (breadcrumb history). No machine consumer parses this today.
- **Side effect:** appends one block; no overwrite, no delete.

## Decision Tree (the routing core)

### Step 1 — Product-stack state snapshot

Render the disk snapshot inline. Shell-bang interpolation fires at slash-command invocation per `product-skills/CLAUDE.md` (the convention is canonized in `CLAUDE.md` §"Inline shell interpolation"):

```
Artifacts by domain:
! `[ -d .agents/skill-artifacts ] && find .agents/skill-artifacts -mindepth 2 -name "*.md" -type f 2>/dev/null | awk -F/ '{print $3}' | sort | uniq -c | sort -rn | grep . || echo "  (no .agents/skill-artifacts/ yet)"`

Top-level canonical folders present:
! `found=0; for d in research brand architecture; do [ -d "$d" ] && { echo "  $d/ ✓"; found=1; }; done; [ $found -eq 0 ] && echo "  (none yet)" || true`

Last 5 commits in this repo:
! `git log --oneline -5 2>/dev/null | grep . || echo "no git history"`
```

Then read `.agents/manifest.json` (canonical). If missing or stale (>24h per `updated_at`), run `bun scripts/manifest-sync.ts` first. Build the structured state map per [`references/state-map-template.md`](references/state-map-template.md) [PROCEDURE] (manifest signal interpretation, filesystem fallback paths, state-map structure, stale-detection rules, project-fit check, re-entry behavior all live there).

### Step 2 — Classify the ask

Parse the user's argument into one of these:

| User says | Classification | Route to |
|---|---|---|
| "design this feature", "user journey", "screen flow", "edge states", "platform touchpoints" | flow-mapping | `/user-flow` |
| "tech stack", "database schema", "API design", "file structure", "deployment plan", "system design" | architecture | `/system-architecture` (soft-gate on flows) |
| "decompose tasks", "task list", "what to build first", "implementation order" | task-decomposition | `/task-breakdown` (meta — hard-gated on spec OR architecture) |
| "README", "API docs", "runbook", "setup guide", "ship log", "document this" | documentation | `/docs-writing` (ask mode) |
| "clean up code", "dead code", "refactor", "code audit", "remove unused" | code-cleanup | `/code-cleanup` (standalone) |
| "machine cleanup", "clean my mac", "free disk space", "remove caches", "dotfolder audit" | machine-cleanup | `/machine-cleanup` (standalone) |
| "scope this", "clarify requirements", "what should we build" | discovery | `/discover` (meta) |
| Combined "design and build" | design+architecture | propose 2-step: `/user-flow` → `/system-architecture` |
| Empty or ambiguous | unknown | emit Format 4 scoping prompt |

### Step 3 — Apply routing rules

Apply in order; first match wins:

1. **Foundation gates:** intent is flow-mapping or architecture AND no spec AND no resolvable product-context → soft-defer to `/discover` (operator can override if conversation already has clarity).
2. **Pipeline routes:** apply Step 2 table.
3. **Soft-gate:** architecture intent with zero flows mapped → recommend `/system-architecture` BUT note "sharper with flows; consider `/user-flow` first if your feature spans multiple flows."
4. **Hard-gate:** task-decomposition intent without spec or architecture → recommend the upstream skill instead.
5. **Standalone branches:** `code-cleanup` and `machine-cleanup` are never bundled with pipeline skills — route as their own single-route response.
6. **Cross-stack pull-in:** architecture intent + `.agents/skill-artifacts/meta/sketches/prioritize-*.md` exists → mention it'll be consumed.
7. **Wrap-around:** recommendations touching security / auth / data-mutation / critical artifacts → append `(optional /fresh-eyes after)`.
8. **Don't cross-route** outside `discover` and `task-breakdown` — research/marketing skills and other meta-skills go through `/orchestrate-meta`.

### Step 4 — Present + confirm

Emit one of the four formats in [`references/output-formats.md`](references/output-formats.md) [PROCEDURE]: single-route (Format 1), combined-path (Format 2), cross-stack process route (Format 3), or empty-ask scoping fallback (Format 4). Never auto-invoke; always print `→  /skill-name` for the operator to type. For `docs-writing` recommendations, ask which mode in the same response.

### Step 5 — Persist + hand off

Append to `skills-resources/experience/product-workflow.md`:

```markdown
## Session YYYY-MM-DD
- Read state: <one-line summary>
- User intent: <classification>
- Recommended: /<skill>
- User confirmed: <yes / pending / redirected>
```

Then print the hand-off line and exit. Operator types the next slash command.

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before emitting any recommendation that smells off — bundling standalone skills into a pipeline, recommending architecture against no flows or spec, picking a `docs-writing` mode the operator didn't ask for, cross-routing outside `discover` and `task-breakdown`.

## Completion Status

- **DONE** — recommendation given, hand-off printed, breadcrumb appended.
- **BLOCKED** — couldn't read project state (manifest missing AND no fallback paths AND fresh-project bootstrap unclear).
- **NEEDS_CONTEXT** — empty ask + state too sparse to infer. Emit Format 4 scoping prompt and exit (operator re-runs with answer).

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why this skill exists, methodology, principles, when NOT to use
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern (canonical at `references/`, synced)
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — `--fast` behavior contract
- [`references/state-map-template.md`](references/state-map-template.md) [PROCEDURE] — manifest signals + filesystem fallback paths + state map structure + stale detection + re-entry
- [`references/output-formats.md`](references/output-formats.md) [PROCEDURE] — the 4 output shapes (single-route, combined-path, cross-stack-process, scoping fallback)
- [`references/workflow-graph.md`](references/workflow-graph.md) — full product-stack pipeline + per-skill catalog + decision rules
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — failure modes
- [`references/_shared/manifest-spec.md`](references/_shared/manifest-spec.md) — manifest contract Step 1 reads
- `product-skills/CLAUDE.md` §"Manifest Spec" + §"Complexity Routing" — stack-level conventions this skill inherits
