# Preview OG — Format Conventions [PROCEDURE]

## Output path

`docs/forsvn/artifacts/marketing/preview-og-<YYYY-MM-DD>-<slug>.md` (KNOWLEDGE layer, by-stack grammar). `<slug>` = the host or page checked, kebab-cased (e.g. `forsvn-com-launch`). One file per pass; on re-run the same day, append `-v2`, `-v3`.

The metaprev `.html` preview (written with `-o`) is a **transient review surface**, not the artifact. Write it under `docs/forsvn/artifacts/marketing/` only if the operator wants to eyeball the cards; never treat it as the deliverable. Skills emit Markdown only.

## Frontmatter

Conforms to the v2/v3 reviewable-artifact contract — full field list and the required v3 instruction core (`id` / `type` / `keywords`): `references/_shared/artifact-contract-template.md`. Skill-specific values:

```yaml
---
id: preview-og-<date>-<slug>
type: review            # a validation/fix record, not a generative artifact
skill: preview-og
stack: marketing
date: <YYYY-MM-DD>
status: done | done_with_concerns | blocked | needs_context
keywords: [og, open-graph, share-card, <host>]
target: "<url checked>"
input_artifacts: []     # none required
output_eval: null
---
```

## Body sections (required, in order)

1. **Target** — the URL checked (local or deployed), HTTP status, and final/resolved URL.
2. **Issues found** — the metaprev output, grouped error / warn / info. For each: field, message, and whether it's a real break or an advisory (per the pushback rule).
3. **Fixes applied** — one row per fix: issue → file changed → what changed (cite `file:line`). Note any handed to `produce-asset`.
4. **Verification** — the re-run result. State the before/after issue counts and confirm each error cleared. A pass without this section is incomplete.
5. **Remaining advisory** — warns deliberately kept (with the one-line reason), and any platform-cache step the operator must take.

## Status mapping

Mirror the metaprev exit code into `status`: clean re-run (exit 0, no errors) → `done`; errors remain only because an external asset is pending → `done_with_concerns`; no reachable target → `blocked`; no URL resolvable → `needs_context`.
