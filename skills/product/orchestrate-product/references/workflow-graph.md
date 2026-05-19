# Product Stack Workflow Graph

Canonical pipeline definition for the product-skills stack. `orchestrate-product` reads this for routing decisions.

---

## The Pipeline

```
 ┌──→ user-flow ──→ system-architecture ──→ docs-writing
 │ ↑
discover (meta) ─→ spec ─┤ │
 │ └── task-breakdown (meta)
 └──→ (skip flows for backend-only or library work)

(parallel, standalone branches)
 code-cleanup — audit existing source code
 machine-cleanup — audit developer machine state
```

**Strategy / Spec layer (meta-skills):** `discover` clarifies WHAT to build → produces `spec.md`. This is upstream of the product pipeline.

**Design layer:** `user-flow` defines screens, decisions, transitions, edge cases per flow. One file per flow.

**Architecture layer:** `system-architecture` consumes spec + flows + (optional) prioritize.md, produces the technical blueprint.

**Decomposition layer (meta-skills):** `task-breakdown` consumes spec + architecture + flows, produces a buildable task list.

**Docs layer:** `docs-writing` produces READMEs, API references, runbooks, ship logs, setup guides.

**Standalone branches (no pipeline position):**
- `code-cleanup`: audits any codebase. Independent of the spec/flow/architecture chain.
- `machine-cleanup`: audits developer machine. Independent of any project.

---

## Per-Skill Catalog

### user-flow

- **Job:** map multi-step in-product flow — screens, decisions, transitions, platform touchpoints (dock, menu bar, widgets, notifications, Live Activity, Dynamic Island), edge cases, error states.
- **Produces:** `.agents/skill-artifacts/product/flow/<flow-name>.md` (one per flow), `.agents/skill-artifacts/product/flow/index.md` (auto when ≥2 flows)
- **Consumes:** `research/product-context.md` (optional), `brand/DESIGN.md` (optional)
- **When to recommend:** flow-mapping intent (designing a feature with multiple screens/states).
- **Cost:** $0.20–0.50 · 6 agents · standard budget · ~5 min
- **Hard prerequisite for:** strongest results in system-architecture and task-breakdown.
- **Mandatory gate inside the skill:** asks user for platforms + surfaces before dispatching.

### system-architecture

- **Job:** technical blueprint — tech stack, database schema, API design, file structure, deployment plan.
- **Produces:** `architecture/system-architecture.md`
- **Consumes:** `research/product-context.md`, `.agents/skill-artifacts/meta/specs/*.md`, `.agents/skill-artifacts/meta/sketches/prioritize-*.md` (optional), `.agents/skill-artifacts/product/flow/*.md` (optional but strong signal)
- **When to recommend:** architecture intent. Soft-gate on flows.
- **Cost:** $1–3 · 7 agents · deep budget · ~10 min

### code-cleanup

- **Job:** audit and refactor existing code for readability, maintainability, dead code removal — without changing behavior. Enforces 5 golden rules (preserve behavior, small steps, check conventions, test after each change, rollback awareness).
- **Produces:** `.agents/skill-artifacts/meta/records/cleanup-*.md` + in-place edits.
- **Consumes:** nothing (operates on source code directly).
- **When to recommend:** code-cleanup intent. Standalone branch.
- **Cost:** $1–3 · 8 agents · deep budget · ~15 min (varies with codebase size)

### machine-cleanup

- **Job:** audit and clean developer machine — dotfolders, caches, language toolchains, package globals. Per-target classification with risk surfacing (auth, running processes, side effects). Explicit user confirmation before each deletion.
- **Produces:** `.agents/skill-artifacts/meta/records/machine-cleanup-*.md`
- **Consumes:** nothing (operates on machine state).
- **When to recommend:** machine-cleanup intent. Standalone — never tied to project pipeline.
- **Cost:** $1–3 · 7 agents · deep budget · ~12 min

### docs-writing

- **Job:** generate documentation — READMEs, API references, setup guides, runbooks, architecture docs, ship logs. Modes: standard or `--ship-log` (writes plain-language product snapshot to `research/product-context.md`).
- **Produces:** project files (README.md, docs/), or `research/product-context.md` (ship log mode).
- **Consumes:** `research/product-context.md` (when refreshing).
- **When to recommend:** documentation intent. Ask user which mode.
- **Cost:** $0.15–0.40 · 6 agents · standard budget · ~5 min

---

## Cross-Stack Skills (proposed by orchestrate-product, owned by meta-skills)

### discover (meta)

- **Job:** conversational discovery — adaptive from quick scoping (3-5 Qs) to deep interviews.
- **When to propose:** intent is unclear OR no spec exists AND user wants to "build something" without clarity.
- **Hand-off:** `/discover` → may produce `.agents/skill-artifacts/meta/specs/*.md` → re-run `/orchestrate-product` after.

### task-breakdown (meta)

- **Job:** decompose spec + architecture into buildable tasks with acceptance criteria, dependencies, implementation order.
- **When to propose:** task-decomposition intent AND (spec.md OR system-architecture.md exists).
- **Hand-off:** `/task-breakdown`.

---

## Routing Rules (decision tree)

```
1. Read state. Critical gates:
 - intent is flow/architecture AND no spec.md AND no clear context
 → soft-defer to /discover ("clarify scope first?")
 - intent is task-decomposition AND no spec.md AND no architecture.md
 → defer to /discover or /system-architecture first

2. Parse user intent → bucket

3. Apply pipeline routing (first match):
 a. flow-mapping → user-flow
 b. architecture → system-architecture (soft-gate on flows)
 c. task-decomposition → task-breakdown (cross-stack, meta)
 d. documentation → docs-writing (ask mode)
 e. code-cleanup → code-cleanup (standalone)
 f. machine-cleanup → machine-cleanup (standalone)
 g. discovery → discover (cross-stack, meta)

4. Combined intents:
 "design AND build" → propose 2-step: user-flow → system-architecture

5. Cross-stack pull-in:
 architecture intent + prioritize.md exists → mention it'll be consumed.

6. Present (1–3 max). Wait. Append breadcrumb.
```

---

## Stale Detection

- `.agents/skill-artifacts/meta/specs/*.md` mtime > 60 days → flag stale.
- `architecture/system-architecture.md` is OLDER than newest flow file → architecture may be behind. Warn.
- `.agents/skill-artifacts/meta/records/cleanup-*.md` mtime > 30 days → likely stale (codebase moves fast). Warn before re-using.

---

## Re-Entry Behavior

`/orchestrate-product` is idempotent. If breadcrumb shows last session ran user-flow and `.agents/skill-artifacts/product/flow/index.md` now lists 3 flows, advance to system-architecture.

If user-flow ran but no flow file exists, surface that.

---

## Anti-Patterns

- Don't conflate `code-cleanup` (source files) with `machine-cleanup` (dotfolders, caches).
- Don't recommend `system-architecture` for "I have a small bug to fix." That's not what it's for.
- Don't auto-invoke. Always print `/skill-name`.
- Don't recommend research or marketing skills directly — defer to `/orchestrate-research` or `/orchestrate-marketing`.
