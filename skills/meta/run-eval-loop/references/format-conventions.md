---
title: Run Eval Loop — Format Conventions
lifecycle: canonical
status: stable
produced_by: run-eval-loop
load_class: PROCEDURE
---

# Format Conventions

**Load when:** orchestrator writes `program.md` / `context.md` / `learnings.md` OR a per-cycle evaluate-* sibling appends a row to `results.tsv`.

---

## `program.md` frontmatter (required)

```yaml
---
skill: run-eval-loop
version: 1
date: YYYY-MM-DD
status: done
summary: "[loop] measurable improvement loop"
purpose: "Operating program for a measurable strategy -> execution -> evaluation loop"
lifecycle: loop
use_when: "Coordinating repeated strategy, execution, evaluation, and keep/discard decisions for this initiative"
do_not_use_when: "The work has no observable metric or attribution path"
upstream: "operator intent, prior artifacts, metric baseline"
downstream: "strategy skills, marketing/content execution skills, evaluation skills"
---
```

## `context.md` frontmatter

Same field shape as `program.md`; `lifecycle: loop-context`. `purpose` describes the surface + ICP + product + competitor context the loop operates against.

## `learnings.md` frontmatter

`lifecycle: learning`. Append-only ledger; each promoted entry cites the `results.tsv` row that earned it (cycle N, status keep).

## `results.tsv` schema

8-column header written by `scaffold-eval-loop.ts`; per-cycle rows appended by `append-loop-result.ts` (validated; never hand-edit). Per-cycle scoring rows are written by evaluate-* sibling skills, not by this orchestrator.

Full column spec + validation rules in `_shared/eval-loop-spec.md` § "results.tsv schema".

## Re-run / resume convention

- Loop folder is keyed by slug — re-running with the same slug resumes; new initiative = new slug.
- `program.md` is amended in place (bump `version` field, preserve `date` of first creation in a `created:` field if introducing).
- `results.tsv` is append-only; no row deletion, only `status: discard` on a follow-up row if a prior decision is overturned.
