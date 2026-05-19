---
title: Docs-Writing — Pre-Dispatch Prompts
lifecycle: canonical
status: stable
produced_by: docs-writing
load_class: PROCEDURE
---

# Pre-Dispatch Prompts

**Load when:** Pre-Dispatch step fires. Choose Warm Start (audience + type inferable) or Cold Start (vague "document this"). Emit verbatim; one round-trip resolution.

---

## Warm Start

Fires when audience + type are both inferable from invocation (e.g., user said "write the README", "API reference for this server", "release notes for v5.1.0").

```
Found:
- repo → "[detected framework]"
- existing docs → "[README.md present / docs/ folder]"
- inferred audience → "[developer | end-user | mixed]"
- inferred type → "[readme | api-reference | etc.]"

Override audience or type, or proceed?
```

If operator confirms or types nothing → dispatch with inferred values. Override resets to Cold Start.

## Cold Start

Fires when invocation is vague ("document this", `/docs-writing` with no args).

```
docs-writing produces audience-appropriate documentation. The output shape
depends heavily on who reads it and what they need from it:

1. **Audience** — end-user (people using the product), developer (people
   building with the API or extending the code), operator (people deploying
   or maintaining), or mixed?
2. **Doc type** — readme (project intro + getting started), user-guide
   (task-oriented walkthroughs), api-reference (signatures + examples),
   config-guide (settings + flags), tutorial (step-by-step learning),
   or ship-log (changelog snapshot)?
3. **Codebase path** — root or specific subset.
4. **Fresh or update** — write new docs from scratch, or refresh existing
   ones (preserves human-edited prose, updates code-derived sections only)?

Answer 1-4 in one response. I'll dispatch.
```

## Write-back rules

After Cold Start resolves, persist only durable context:

| Q | File | Key | Rule |
|---|---|---|---|
| 4. Conventions emerging from doc style preferences | `skills-resources/experience/technical.md` | `Technical — doc conventions` | Only if user expresses durable preference (e.g., "always use this voice", "we use semantic line breaks") |

Q1 (audience), Q2 (doc type), Q3 (path), and the fresh-vs-update toggle are run-specific. Don't persist.

## Route-locked Pre-Dispatch (Routes D + E)

When the operator invokes a specific route, Pre-Dispatch's audience question is overridden — the route locks the audience-profiler-agent to a pre-set value, so the prompt skips Q1.

- **Route D (Ship Log):** audience locked to `{ type: "mixed", technical_level: "dual", key_goal: "understand product state" }`. Prompt asks only for codebase path (Q3) + fresh-vs-update (Q4); Q1 + Q2 skipped.
- **Route E (Release Notes):** audience locked to `{ type: "stack user", goal: "decide whether/why to update" }`. Prompt asks only for the `version` parameter (REQUIRED) + optional `--range` + optional `--gh-release` flag; Q1, Q2, Q3, Q4 all skipped.
- **Route C (Post-Change Sync):** audience preserved from existing docs. Prompt asks only for the git diff scope (default: staged + last 5 commits, or `--range <ref>..HEAD` if provided); Q1 + Q2 + Q4 skipped.

See `modes/ship-log.md` + `modes/release-notes.md` + `modes/sync.md` for the full route-specific Pre-Dispatch contracts.

## Safety gate (under `--fast`)

`--fast` skips multi-agent dispatch but does NOT skip Pre-Dispatch. The Critical Gates require knowing audience + doc-type before writing. If `--fast` invocation arrives with no resolvable signal, Pre-Dispatch still fires (single bundled question) before dispatch. Mode-resolver's `safety-gates-supersede-fast` clause is the contract.

Route-specific critic gates (Ship Log, Release Notes) fire regardless of `--fast` — these protect canonical artifact integrity (product-context.md) and user-facing convention compliance (CHANGELOG.md).
