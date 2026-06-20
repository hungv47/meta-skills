# `plan.md` — the multi-step plan-artifact (A3)

The source of truth for the durable, resumable plan `/forsvn` emits for a **multi-step** ask. It is
the **plan-preview trust contract**: an ordered, gated plan a human approves **before** step 1, and
that a fresh agent (Claude Code / Codex / Cursor) can resume from with no chat history. A4 (the
`run-plan` executor) walks an *approved* plan; until A4, the human runs steps manually from it.

- **Location:** `.forsvn/runs/<slug>/plan.md` — **machine-state** (config/run state under `.forsvn/`,
  like `.forsvn/performance/` and `.forsvn/learning/`). Exempt from the artifact contract; never walked
  by the artifact validators or the manifest indexer. Gitignored (`.forsvn/runs/`).
- **Writer:** `bin/plan.ts` only (atomic temp-file + rename, so a crashed mid-transition leaves a valid
  file). The dispatcher scaffolds via `bin/plan.ts init`; never hand-edit the steps table's machine
  fields (`status`, `current_step`).
- **Reuses** `run-launch`'s run-of-show convention (`skills/meta/run-launch/references/launch-chain-spec.md`):
  a steps table + a **Current step** pointer + an Approval block. `plan.md` is the **generic** chain
  plan; `run-launch`'s launch bundle stays where it is.

## Schema

```markdown
---
slug: <kebab>
created: YYYY-MM-DD HH:MM:SS
intent: <the multi-step ask, one line>
status: proposed | approved | running | done | abandoned   # human approves proposed→approved
current_step: <step id or "—">
approved_by: <human handle | empty until approved>
approved_at: <ts | empty>
---

## Run of show
| id | step | skill | args | depends_on | gate | artifact_out | status |
|----|------|-------|------|------------|------|--------------|--------|
| s1 | Research ICP | /research-icp | "indie SaaS" | —     | review  | docs/forsvn/.../icp-...md | done |
| s2 | Write hero   | /write-copy   | "/pricing"   | s1    | review  | docs/forsvn/.../copy-..md | pending |
| s3 | Publish      | /publish-social | "x"        | s2    | publish | —                         | blocked |

## Current step
s2 — /write-copy. Next: draft hero, stop at review gate.

## Approval
- [ ] Human approved this plan before step 1.   # A4 refuses to run an unapproved plan
```

### Field semantics

| Field | Rule |
|---|---|
| `status` | `proposed` on init. Only a human moves `proposed → approved` (the approval gate). `running`/`done`/`abandoned` track execution. **A3 STOPS at `proposed`** — never auto-runs (that's A4, non-publish steps only). |
| `current_step` | the live step id, or `—`. `bin/plan.ts advance` moves it to the next step whose `depends_on` are all `done`. |
| step `id` | unique kebab/`s<N>`; referenced by `depends_on` and `current_step`. |
| step `depends_on` | comma-separated step ids, or `—`. **Must be acyclic** (`--check` fails on a cycle). |
| step `gate` | `auto` \| `review` \| `publish`. A3 establishes the field; A4/A5 populate it from each capability's `gate_class` (A4). Pre-A4 `/forsvn` fills it conservatively: a publish-ish step → `publish`, an output-producing step → `review`, a read-only step → `auto`. **Every `publish`-class step is `gate: publish`** — the executor stops there unconditionally (the publish-gate contract). |
| step `status` | `pending` \| `running` \| `done` \| `blocked` \| `abandoned`. A step with unmet `depends_on` is `blocked` until they finish. |
| `artifact_out` | the produced artifact path, or `—`. |

## `bin/plan.ts` — the helper (atomic transitions)

```
plan init   <slug> --intent "<…>" [--steps <json|->]   # scaffold status:proposed (steps optional; "-" reads JSON from stdin)
plan show    <slug>                                     # print Current step + the steps table
plan advance <slug>                                     # current_step → next ready step (all deps done), atomic
plan set-status <slug> <stepId> <pending|running|done|blocked|abandoned>
plan --check <slug>                                     # validate schema + DAG (depends_on acyclic) + gate enum; CI exit code (0 ok / 1 invalid)
# step gate enum: "auto" | "review" | "publish"   ·   --root <dir> overrides the project root (default cwd)
```

- Writes are **atomic** (temp-file + same-dir rename).
- `--check` fails (exit 1) on: a malformed frontmatter/table, an unknown `status`/`gate` value, a
  `depends_on` referencing a missing step id, or a **cycle** in the `depends_on` graph.
- `advance` is a no-op (current_step unchanged) when no step is ready (all remaining steps blocked or
  done) — it never advances past a `publish` step on its own (A4 enforces the stop; the helper only
  moves the pointer to the next dependency-ready step).

## Resumability

`plan.md` alone tells a fresh agent the live step + next action via the **Current step** pointer — a
cross-agent resume reads `plan.md`, not chat history. The steps table's `status` column + `artifact_out`
paths reconstruct exactly what ran and what it produced. State lives in the file, not a database.
