<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

---
title: Reviewable Artifact Contract — the human-review layer for Markdown artifacts
lifecycle: canonical
status: stable
produced_by: meta-skills (v3 WS-REVIEW, 2026-05-22)
consumers: every review-gated skill; manifest-sync.ts; roughdraft-review-protocol
load_class: PLAYBOOK
---

# Reviewable Artifact Contract

**The review layer adds explicit human sign-off to Markdown artifacts that need
it — without turning Roughdraft, the manifest, or any sidecar into an approval
database. Review state is four flat frontmatter fields plus one body block. That
is the whole contract.**

This file is the canonical spec. Skills cite it instead of re-explaining review
mechanics. The companion procedure for *running* a review is
[[roughdraft-review-protocol]].

---

## The two halves of the contract

1. **Frontmatter** — four flat fields carry decision *state and routing*; one
   `review_surface` field declares which surface the review uses.
2. **Body** — a `## Review Gate` block carries the human's *decision*; Roughdraft
   CriticMarkup carries their *comments and edits*.

Nothing else. No review log, no sidecar JSON, no separate ledger. The Markdown
file is the durable record; `manifest-sync` indexes the frontmatter so agents
can see decision state without opening every file. When `review_surface: html`,
a co-located HTML preview is emitted alongside the MD while
`decision_state: pending` — it is read-only visual scaffolding, not a separate
record; see § "Review surface" below.

---

## Frontmatter fields

```yaml
decision_state: pending    # pending | approved | denied | suggested | not_required
review_surface: html       # html | md | none
review_tool: roughdraft    # roughdraft | inline | none
reviewed_at:               # YYYY-MM-DD — empty until reviewed
reviewer:                  # who recorded the review — empty until reviewed
```

Flat by design — `manifest-sync.ts` parses flat YAML only. A nested `review:` map
would force a parser rewrite for no gain.

### `decision_state` values

| Value | Meaning |
|---|---|
| `pending` | Awaiting human review. The artifact is not yet final. |
| `approved` | Human reviewed and accepted it. |
| `denied` | Human reviewed and rejected it; the artifact should not be used. |
| `suggested` | Human reviewed and wants changes before approval; see body CriticMarkup. |
| `not_required` | No human gate applies. The default for artifacts the lifecycle table does not gate. |

Absent or unrecognized `decision_state` normalizes to `not_required` — legacy
artifacts with no review layer index unchanged.

### `review_surface` values

`html` — a polished HTML preview is co-located with the MD while
`decision_state: pending`. `md` — Markdown-only review (no HTML preview).
`none` — pairs with `decision_state: not_required`.

The HTML preview is **rendering scaffolding** for the MD. It carries no
content the MD doesn't have. After the gate resolves it moves to
`.forsvn/artifacts/.archive/`. Decision capture stays in MD + Roughdraft.

### `review_tool` values

`roughdraft` — review happens in the Roughdraft UI (the default for gated
artifacts). `inline` — review happens inline in the conversation. `none` — no
review surface; pairs with `decision_state: not_required`.

---

## The `## Review Gate` body block

Every reviewable artifact carries this block in its body:

````markdown
## Review Gate
- [ ] Approve
- [ ] Deny
- [ ] Suggest changes

Comments and suggested edits use Roughdraft CriticMarkup, inline in this file.
````

The human checks exactly one box. The agent reads the checked box to set
`decision_state`: Approve → `approved`, Deny → `denied`, Suggest changes →
`suggested`. If more than one box is checked, the most restrictive wins
(`denied` > `suggested` > `approved`) and the agent flags the conflict.

---

## Review surface — HTML preview lifecycle

When `review_surface: html`, the producing skill emits two files at the same
flat path under `.forsvn/artifacts/`:

```
.forsvn/artifacts/<stack>-<skill>-<YYYY-MM-DD>-<slug>.md     ← durable
.forsvn/artifacts/<stack>-<skill>-<YYYY-MM-DD>-<slug>.html   ← preview (while pending)
```

The HTML is a **rendering** of the MD frontmatter + body, themed by stack
(meta=AIR, mkt=WATER, product=FIRE, research=EARTH). Layout and tokens come from
[[review-surface-design]] and the shared template at [[review-surface-template]].

**Lifecycle:**

1. Skill writes MD with `decision_state: pending`, `review_surface: html`.
2. Skill renders the HTML twin via `renderReviewSurface(stack, stagePartial, data)`.
3. Operator opens `.html` in a browser for visual comparison and opens `.md` in
   Roughdraft to tick the Review Gate + leave CriticMarkup.
4. When `decision_state` resolves (`approved` / `denied` / `suggested`), the
   `.html` is moved to `.forsvn/artifacts/.archive/<original-filename>.html`.
5. The MD stays at the canonical path; `manifest-sync` re-indexes.

**The HTML never captures decisions.** No form, no postback, no mutating button.
It contains only: a read-only decision-state pill, comparison/preview affordances
for the artifact's content, and a Roughdraft deeplink in the footer
(`roughdraft://open?path=<url-encoded path>`). Decision capture stays in MD via
the Review Gate block. If the HTML is deleted, regenerate it from MD on the
next emit — nothing is lost.

---

## CriticMarkup is body content, never frontmatter

Reviewer comments and suggested edits use Roughdraft-flavored CriticMarkup,
inline in the artifact body — `{>>comment<<}`, `{++insertion++}`,
`{--deletion--}`, `{~~old~>new~~}`, `{==highlight==}`, each with an attribute
block (`{id="c1" by="..." at="..."}`).

Frontmatter carries only state and routing. It never carries comments. This
keeps `manifest-sync`'s flat-YAML parser unaffected by review content and keeps
CriticMarkup where Roughdraft can render it.

---

## Review policy by lifecycle

A skill sets `decision_state: pending` when the artifact's lifecycle requires a
human gate. Defaults:

| Lifecycle | Default `decision_state` | Why |
|---|---|---|
| `canonical` | `pending` — required before `status: done` is trusted | Durable source of truth |
| `decision` | `pending` — required for standalone decisions | Operator commitment |
| `spec` | `pending` — required when saved for downstream build | Stops vague specs compounding |
| `strategy` / `execution` | `pending` inside a loop, before publish/execute | External-facing impact |
| `pipeline` | `not_required` (a skill may opt in) | Most are regenerable drafts |
| `evaluation` / `learning` | `not_required`; CriticMarkup comments still allowed | Evidence record, not casually rewritten |
| `snapshot` | `not_required` | Audit trail, not a candidate for change |
| inline sub-routine output | n/a | No persisted artifact |

A skill may opt a `pipeline` artifact into review when it is used in a loop or
the operator asks. A skill must not drop review on a `canonical` / `decision` /
`spec` artifact.

---

## `status` vs `decision_state` — independent

`status` is the **skill's** quality gate (DONE / DONE_WITH_CONCERNS / BLOCKED /
NEEDS_CONTEXT — the [Completion Status Protocol](../CLAUDE.md#completion-status-protocol)).
`decision_state` is the **human's** acceptance.

They are orthogonal. `status: done` + `decision_state: pending` is valid and
expected — it means "the skill is confident, the human has not yet signed off."
An artifact is only fully final when `status: done` **and**
`decision_state` ∈ {`approved`, `not_required`}.

---

## How `manifest-sync` indexes it

`manifest-sync.ts` parses the five fields (`decision_state`, `review_surface`,
`review_tool`, `reviewed_at`, `reviewer`) onto every artifact entry in
`manifest.json` and renders a **Decision** column plus a **Surface** column in
`artifact-index.md`. An invalid `decision_state` produces a warning and
normalizes to `not_required` — it never crashes the sync. Artifacts without
review fields index normally. Legacy artifacts that still carry the old
`review_state` field are tolerated (one-line warning, normalized into
`decision_state`) until the migration script runs.

---

## How skills cite this

In a SKILL.md Artifact Contract section:

```
This artifact is review-gated. Write review frontmatter and the `## Review Gate`
block per `references/_shared/reviewable-artifact-contract.md`; run the review
per `references/_shared/roughdraft-review-protocol.md`. When the artifact is
review_surface: html, render the preview via `renderReviewSurface(...)` per
`references/_shared/review-surface-template.md`.
```

Do not restate the field semantics in the SKILL.md — cite this file.

---

## Anti-patterns

1. **Nesting review fields.** A `review:` map breaks the flat-YAML parser. Keep
   the fields flat.
2. **Putting comments in frontmatter.** CriticMarkup belongs in the body.
3. **Conflating `status` and `decision_state`.** A skill cannot self-approve by
   writing `decision_state: approved` — only a human review sets that.
4. **Gating everything.** `pipeline` / `snapshot` / `evaluation` default to
   `not_required`; gating them adds friction with no payoff.
5. **A Roughdraft sidecar store.** The Markdown file is the record. Do not
   create a parallel review database.
6. **Decision capture in the HTML preview.** The HTML is read-only visualization
   — no `<form>`, no postback, no mutating button beyond the Roughdraft
   deeplink. Decisions are captured in MD via the Review Gate block.
7. **Leaving the HTML twin in place after the gate resolves.** Move it to
   `.forsvn/artifacts/.archive/` once `decision_state` ≠ `pending`. The MD is
   the durable record.

---

## Historical note — the v2 rename (2026-05-26)

The field was renamed `review_state` → `decision_state` and the enum updated
(`rejected` → `denied`, `changes_requested` → `suggested`) when the
review-surface overhaul landed. Legacy artifacts that still use `review_state`
are tolerated by `manifest-sync` (one-line warning per artifact, normalized to
the new field name) until they are migrated.

---

## Related refs

- [[roughdraft-review-protocol]] — the procedure for opening and processing a review
- [[artifact-contract-template]] — the full frontmatter schema these fields extend
- [[manifest-spec]] — how `decision_state` is indexed into `manifest.json`
- [[review-surface-design]] — element tokens, motifs, motion for the HTML preview surface
- [[review-surface-template]] — the structural HTML template skill authors fill in
