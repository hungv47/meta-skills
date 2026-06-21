<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
title: Reviewable Artifact Contract — the human-review layer for Markdown artifacts
lifecycle: canonical
status: stable
produced_by: meta-skills (v3 WS-REVIEW, 2026-05-22)
consumers: every review-gated skill; manifest-sync.ts; roughdraft-review-protocol; collaborative-docs runbook
load_class: PLAYBOOK
---

# Reviewable Artifact Contract

**The review layer adds explicit human sign-off to Markdown artifacts that need
it — without turning Proof, Roughdraft, the manifest, or any sidecar into an
approval database. Review state is four flat frontmatter fields plus one body
block. That is the whole contract.**

This file is the canonical spec. Skills cite it instead of re-explaining review
mechanics. For collaborative documents, run review through Proof per
`docs/runbooks/collaborative-docs.md`. Roughdraft remains an optional Markdown
fallback, documented in [[roughdraft-review-protocol]].

---

## The two halves of the contract

1. **Frontmatter** — four flat fields carry decision *state and routing*; one
   `review_surface` field declares which surface the review uses.
2. **Body** — a `## Review Gate` block carries the human's *decision*; comments
   and edits live in Proof working state or inline CriticMarkup, depending on
   `review_tool`.

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
review_tool: inline        # proof | inline | roughdraft | none
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
`docs/forsvn/artifacts/.archive/`. Decision capture lands back in the canonical
MD frontmatter and Review Gate block.

### `review_tool` values

`proof` — review happens in Proof working state, with accept/approve controlled
by the human editor and the final decision exported back to MD. `inline` —
review happens through the Markdown checkbox gate or conversation-local
decision capture; this is the default for simple gates. `roughdraft` — optional
Markdown UI fallback for inline CriticMarkup. `none` — no review surface; pairs
with `decision_state: not_required`.

---

## The `## Review Gate` body block

Every reviewable artifact carries this block in its body:

````markdown
## Review Gate
- [ ] Approve
- [ ] Deny
- [ ] Suggest changes

Comments and suggested edits use Proof or inline CriticMarkup, depending on `review_tool`.
````

The human checks exactly one box. The agent reads the checked box to set
`decision_state`: Approve → `approved`, Deny → `denied`, Suggest changes →
`suggested`. If more than one box is checked, the most restrictive wins
(`denied` > `suggested` > `approved`) and the agent flags the conflict.

---

## Review surface — HTML preview lifecycle

When `review_surface: html`, the **durable artifact is the Markdown file**. The
skill writes only the `.md`; the HTML preview is rendered on demand by the
**forsvn-preview** review module of the single `forsvn` plugin (surfaced as
`/forsvn:review`):

```
docs/forsvn/artifacts/<stack>/<skill>-<YYYY-MM-DD>-<slug>.md     ← durable (the skill writes this)
docs/forsvn/artifacts/<stack>/<skill>-<YYYY-MM-DD>-<slug>.html   ← preview, rendered by the review module (while pending)
```

The HTML is a **rendering** of the MD frontmatter + body, themed by stack
(meta=AIR, mkt=WATER, product=FIRE, research=EARTH). Rendering — layout, tokens,
the themed HTML — is owned by the **forsvn-preview** review module, not the
skill. A skill is fully functional emitting Markdown alone; the operator reviews
the Markdown directly without invoking the renderer.

**Lifecycle:**

1. Skill writes MD with `decision_state: pending`, `review_surface: html`. That is the skill's entire job — plain Markdown, no HTML.
2. Operator runs the review module (`/forsvn:review`, or directly `bun forsvn-preview/bin/forsvn-preview.ts docs/forsvn/artifacts/<stack>/<skill>-<YYYY-MM-DD>-<slug>.md`). It renders the HTML twin from the MD (themed by stack), then starts a CSRF-protected `Bun.serve()` on `127.0.0.1` (OS-assigned port), injects the token into the page's `#preview-config` block, opens the browser, and blocks. (Markdown fallback is still available — see below.)
3. Operator clicks one of approve / deny / suggest changes in the in-page `<form id="decision-capture">`, optionally writes comments, clicks Done. The page POSTs `{token, decision_state, comments?, variant?}` to `/done`.
4. The review module validates the CSRF token, rewrites the MD frontmatter
   (`decision_state`, `reviewed_at`, `reviewer`), appends a `## Reviewer notes`
   block if comments were submitted, moves the `.html` to
   `docs/forsvn/artifacts/.archive/<original-filename>.html`, runs `manifest-sync`,
   and exits 0.
5. The MD stays at the canonical path; the manifest is re-indexed.

**Markdown review remains the escape hatch.** If the reviewer skips the HTML
capture surface, they can record the decision directly in the MD Review Gate
block. When `review_tool: roughdraft`, the optional Roughdraft protocol can be
used for CriticMarkup comments; otherwise the checkbox gate is enough. The HTML
archives on the next `manifest-sync`.

**The HTML's decision-capture form is the ONLY postback target allowed.** No
other `<form>`, no `fetch()` to remote hosts, no analytics — see
[[html-output-critic]] check #6. The form is **always rendered** but inert by
default; chrome.js activates it only when the CLI has injected a token and the
artifact's `decision_state` is still `pending`. Opening the HTML directly in a
browser (no CLI running) shows a read-only preview — the form stays hidden.

---

## CriticMarkup is body content, never frontmatter

Reviewer comments and suggested edits use Proof working state when
`review_tool: proof`; the canonical `.md` is updated only through the Proof
export path. For Markdown fallback, use Roughdraft-flavored CriticMarkup inline
in the artifact body — `{>>comment<<}`, `{++insertion++}`, `{--deletion--}`,
`{~~old~>new~~}`, `{==highlight==}`, each with an attribute block
(`{id="c1" by="..." at="..."}`).

Frontmatter carries only state and routing. It never carries comments. This
keeps `manifest-sync`'s flat-YAML parser unaffected by review content and keeps
comments in the review surface that owns them.

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
This artifact is review-gated. Write a plain Markdown artifact with review
frontmatter and the `## Review Gate` block per
`references/_shared/reviewable-artifact-contract.md`. For collaborative
documents, use Proof per `docs/runbooks/collaborative-docs.md`; for optional
Markdown UI fallback, use `references/_shared/roughdraft-review-protocol.md`.
When `review_surface: html`, the operator previews + records the decision via
the forsvn-preview review module (`/forsvn:review`, or directly
`bun forsvn-preview/bin/forsvn-preview.ts <artifact.md>`); the skill itself emits
no HTML.
```

Do not restate the field semantics in the SKILL.md — cite this file.

---

## Anti-patterns

1. **Nesting review fields.** A `review:` map breaks the flat-YAML parser. Keep
   the fields flat.
2. **Putting comments in frontmatter.** Comments belong in Proof working state
   or in body CriticMarkup, never in frontmatter.
3. **Conflating `status` and `decision_state`.** A skill cannot self-approve by
   writing `decision_state: approved` — only a human review sets that.
4. **Gating everything.** `pipeline` / `snapshot` / `evaluation` default to
   `not_required`; gating them adds friction with no payoff.
5. **A review sidecar store.** The Markdown file is the record. Proof state is
   transient working state and Roughdraft is only a UI. Do not create a parallel
   approval database.
6. **Decision capture outside the documented `forsvn preview` contract.** The
   HTML may capture a decision only via the chrome's `<form id="decision-capture">`
   posting to the `forsvn preview` CLI on `127.0.0.1` / `localhost`. Any other
   form, remote `fetch()`, or analytics ping = hard lint fail. Decisions still
   land in MD frontmatter; the CLI is just the transport. (The Review Gate body
   block is the equivalent flow for MD-first reviewers.)
7. **Leaving the HTML twin in place after the gate resolves.** Move it to
   `docs/forsvn/artifacts/.archive/` once `decision_state` ≠ `pending`. The MD is
   the durable record. The `forsvn preview` CLI does this automatically; if
   you've captured a decision through the MD gate, run `manifest-sync` so the
   archival pass picks up the resolved state.

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
- **forsvn-preview review module** — the review module within the single `forsvn` plugin (commands `/forsvn:review`, `/forsvn:collab`, `/forsvn:doctor`); owns HTML rendering (the themed preview surface, tokens, the `base.html` template). Skills emit Markdown only; the module renders it. Lives at `forsvn-preview/` (`forsvn-preview/references/review-surface-design.md`, `forsvn-preview/references/review-surface-template.md`).
