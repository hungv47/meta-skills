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

1. **Frontmatter** — four flat fields carry review *state and routing*.
2. **Body** — a `## Review Gate` block carries the human's *decision*; Roughdraft
   CriticMarkup carries their *comments and edits*.

Nothing else. No review log, no sidecar JSON, no separate ledger. The Markdown
file is the durable record; `manifest-sync` indexes the frontmatter so agents can
see review state without opening every file.

---

## Frontmatter fields

```yaml
review_state: pending      # pending | approved | rejected | changes_requested | not_required
review_tool: roughdraft    # roughdraft | inline | none
reviewed_at:               # YYYY-MM-DD — empty until reviewed
reviewer:                  # who recorded the review — empty until reviewed
```

Flat by design — `manifest-sync.ts` parses flat YAML only. A nested `review:` map
would force a parser rewrite for no gain.

### `review_state` values

| Value | Meaning |
|---|---|
| `pending` | Awaiting human review. The artifact is not yet final. |
| `approved` | Human reviewed and accepted it. |
| `rejected` | Human reviewed and rejected it; the artifact should not be used. |
| `changes_requested` | Human reviewed and wants changes before approval; see body CriticMarkup. |
| `not_required` | No human gate applies. The default for artifacts the lifecycle table does not gate. |

Absent or unrecognized `review_state` normalizes to `not_required` — legacy
artifacts with no review layer index unchanged.

### `review_tool` values

`roughdraft` — review happens in the Roughdraft UI (the default for gated
artifacts). `inline` — review happens inline in the conversation. `none` — no
review surface; pairs with `review_state: not_required`.

---

## The `## Review Gate` body block

Every reviewable artifact carries this block in its body:

````markdown
## Review Gate
- [ ] Approve
- [ ] Reject
- [ ] Suggest changes

Comments and suggested edits use Roughdraft CriticMarkup, inline in this file.
````

The human checks exactly one box. The agent reads the checked box to set
`review_state`: Approve → `approved`, Reject → `rejected`, Suggest changes →
`changes_requested`. If more than one box is checked, the most restrictive wins
(`rejected` > `changes_requested` > `approved`) and the agent flags the conflict.

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

A skill sets `review_state: pending` when the artifact's lifecycle requires a
human gate. Defaults:

| Lifecycle | Default `review_state` | Why |
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

## `status` vs `review_state` — independent

`status` is the **skill's** quality gate (DONE / DONE_WITH_CONCERNS / BLOCKED /
NEEDS_CONTEXT — the [Completion Status Protocol](../CLAUDE.md#completion-status-protocol)).
`review_state` is the **human's** acceptance.

They are orthogonal. `status: done` + `review_state: pending` is valid and
expected — it means "the skill is confident, the human has not yet signed off."
An artifact is only fully final when `status: done` **and**
`review_state` ∈ {`approved`, `not_required`}.

---

## How `manifest-sync` indexes it

`manifest-sync.ts` parses the four fields onto every artifact entry in
`manifest.json` and renders a **Review** column in `artifact-index.md`. An
invalid `review_state` produces a warning and normalizes to `not_required` — it
never crashes the sync. Artifacts without review fields index normally.

---

## How skills cite this

In a SKILL.md Artifact Contract section:

```
This artifact is review-gated. Write review frontmatter and the `## Review Gate`
block per `references/_shared/reviewable-artifact-contract.md`; run the review
per `references/_shared/roughdraft-review-protocol.md`.
```

Do not restate the field semantics in the SKILL.md — cite this file.

---

## Anti-patterns

1. **Nesting review fields.** A `review:` map breaks the flat-YAML parser. Keep
   the four fields flat.
2. **Putting comments in frontmatter.** CriticMarkup belongs in the body.
3. **Conflating `status` and `review_state`.** A skill cannot self-approve by
   writing `review_state: approved` — only a human review sets that.
4. **Gating everything.** `pipeline` / `snapshot` / `evaluation` default to
   `not_required`; gating them adds friction with no payoff.
5. **A Roughdraft sidecar store.** The Markdown file is the record. Do not
   create a parallel review database.

---

## Related refs

- [[roughdraft-review-protocol]] — the procedure for opening and processing a review
- [[artifact-contract-template]] — the full frontmatter schema these fields extend
- [[manifest-spec]] — how `review_state` is indexed into `manifest.json`
