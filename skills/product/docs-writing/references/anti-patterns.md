---
title: Docs-Writing — Anti-Patterns
lifecycle: canonical
status: stable
produced_by: docs-writing
load_class: ANTI-PATTERN
---

# Anti-Patterns

**Load when:** critic-agent fires (Step 4 in Dispatch Protocol), or any moment writer-agent is about to produce text that smells off — restating code, missing prerequisites, wall of text, documenting internals. Re-read at every doubt.

---

## Failure mode catalog

| Anti-Pattern | Problem | INSTEAD |
|--------------|---------|---------|
| Restating code as prose | "handleSubmit handles form submission" adds nothing | writer-agent describes user experience, not internal code |
| Missing prerequisites | User stuck at step 3 because step 0 was assumed | concept-extractor lists every dependency and version |
| Wall of text | Users scan, not read — long paragraphs get skipped | writer-agent uses tables, numbered lists, headers |
| Outdated screenshots | Screenshots rot faster than text | writer-agent prefers text descriptions of UI elements |
| Documenting internals | Users don't care about ORM layer | writer-agent documents behavior and interfaces |
| "See code for details" | Defeats purpose of documentation | concept-extractor extracts the relevant detail |
| Stale docs shipped as current | Actively mislead users | staleness-checker verifies every claim against codebase |

## When the critic FAILs

The critic-agent identifies which agent failed which gate, and the orchestrator re-dispatches that agent with feedback. Common failure modes:

- **Staleness check fails** (e.g., "Node 16" in docs vs `>=18` in package.json) → re-dispatch writer-agent with the staleness list; auto-fix factual updates; flag narrative updates for user approval.
- **Audience calibration fails** (e.g., end-user docs using "middleware" without definition) → re-dispatch writer-agent with the audience-profiler's vocabulary baseline pinned.
- **Getting Started fails** (user couldn't follow without source code) → re-dispatch writer-agent to add prerequisites + numbered steps with expected outcomes after each.
- **Code examples don't compile** → re-dispatch writer-agent to extract verified examples from test files or runnable snippets in the codebase.

Maximum 2 revision rounds. After 2 failures, deliver with critic annotations and flag to user (status: DONE_WITH_CONCERNS).

Never silently bypass a critic FAIL — the 6 standard gates (or route-specific gates for Routes D + E) are the safety contract.

## Route-specific anti-patterns

### Ship Log (Route D)
- **Overwriting icp-research output silently** — the merge-mode pre-write check exists for a reason. `merge-mode: preserve-marketing` is non-negotiable when the existing file has `skill: icp-research` frontmatter.
- **Jargon leak in user-facing sections** — Ship Log's user-facing sections (What This App Does, Features, Shipping History, Current State) must be jargon-free. Technical terms permitted in "For Coding Agents" section only.

### Release Notes (Route E)
- **File inventories** (`### Files changed` section) — git diff is authoritative. Hard FAIL.
- **Fresh-eyes recap** — the report lives in records/; link to it, don't embed.
- **Anti-goals list** — lives in roadmap.md. Hard FAIL.
- **"What did NOT change" inventory** — assume nothing changed unless stated. Hard FAIL.
- **Implementor-seat framing** ("we caught a regression") — user-seat framing only ("behavior corrected so X works"). Hard FAIL.

### Post-Change Sync (Route C)
- **Write amplification** — rewriting sections unaffected by the diff. The whole point of sync mode is targeted updates.
- **Silently rewriting narrative sections** — flag for user approval; never auto-rewrite descriptions/architecture explanations.

### Audit Mode
- **Applying fixes** — audit is read-only. If operator wants fixes, route to sync mode.
- **Skipping security-relevant priority** — stale auth/env docs are security risks; they go first regardless of where in the codebase they live.

## When to defer instead of documenting

- **Requirements are fuzzy** (operator can't articulate what the app does) → defer to `/discover`. Documenting hallucinated requirements is worse than no docs.
- **Codebase is structurally broken** (confusing module boundaries, dead code piled up) → defer to `/code-cleanup`. Documentation can't fix structural mess.
- **Single-page conversion surface** (landing page) → defer to `/lp-brief`.
