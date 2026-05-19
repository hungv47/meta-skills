---
title: Docs-Writing — Route D (Ship Log)
lifecycle: canonical
status: stable
produced_by: docs-writing
load_class: PROCEDURE
---

# Route D: Ship Log

**Load when:** triggered by `/docs-writing --ship-log`, "write a ship log", "product context", "what does this app do", or "document the current state of the app." This route produces a **plain-language product snapshot** saved to `research/product-context.md` — the canonical cross-stack artifact consumed by 12+ downstream skills.

---

## Why `research/product-context.md`

This is the canonical cross-stack artifact consumed by 12+ downstream skills (brand-system, copywriting, seo, system-architecture, etc.). Writing the ship log here means every skill automatically gets current product context. The artifact answers: What does this app do? What's been built? How do you use it? What's the tech stack? What shipped recently? Written so a non-technical person could understand, while still being precise enough for coding agents to use as context.

## Execution flow

```
scanner-agent ──────────────┐
concept-extractor-agent ────┤── Layer 1 (parallel) — scan codebase + git history
audience-profiler-agent ─────┘── (locked to "mixed: non-technical user + coding agent")

writer-agent ────────────────── writes ship log following references/ship-log-template.md
  → staleness-checker-agent ── verifies every claim against codebase
    → critic-agent ──────────── ship-log-specific quality gates
```

## What's different from the full route

- `audience-profiler-agent` receives a pre-set audience in dispatch: `{ type: "mixed", technical_level: "dual", key_goal: "understand product state" }`. The profiler returns this value directly without inference.
- `scanner-agent` also extracts **git shipping history** (`git log --oneline --since="6 months ago"` or full history for young repos).
- `concept-extractor-agent` focuses on **user-facing features and workflows**, not internals.
- `writer-agent` receives `references/ship-log-template.md` in its `references` field (NOT `doc-template.md`).
- `critic-agent` applies **ship-log-specific quality gates** (see below) — replaces the standard checklist entirely.

## Pre-write step (orchestrator responsibility)

Before dispatching writer-agent, the orchestrator checks for `research/product-context.md`:

- If it exists with `skill: icp-research` in frontmatter: pass `merge-mode: preserve-marketing` to writer-agent (keep ICP/audience/positioning sections; update tech + features + shipping history).
- If it exists with `skill: docs-writing` in frontmatter: rename to `product-context.v[N].md`, pass `merge-mode: overwrite` to writer-agent.
- If it exists with unknown origin: rename to `product-context.v[N].md`, pass `merge-mode: overwrite` to writer-agent.
- If it doesn't exist: pass `merge-mode: create` to writer-agent.

The merge-mode check is **non-negotiable** — overwriting an icp-research-authored product-context loses marketing context that took a separate skill cycle to produce.

## Referencing the artifact

After writing, the orchestrator checks if the project's `CLAUDE.md` references `research/product-context.md`. If not, suggest the user add: `Read research/product-context.md for current product state (features, tech stack, shipping history).`

## Ship-log critic gates (replaces standard checklist)

When in ship log mode, the critic-agent verifies these INSTEAD of the standard 6 critical gates:

- [ ] A non-technical person could read this and explain what the app does to someone else.
- [ ] Every user-facing feature is listed with a plain-language description of what it does and how to use it.
- [ ] Tech stack is listed with purpose for each choice (not just names).
- [ ] Shipping history includes at least the last 5 significant changes with dates.
- [ ] No jargon leak in user-facing sections (What This App Does, Features, Shipping History, Current State) — technical terms are permitted in the "For Coding Agents" section only.
- [ ] Current state section accurately reflects what's working, what's in progress, and known limitations.
- [ ] The document works as agent context — a coding agent reading only this file would understand what to build next.

## Why these gates differ from the standard

- Standard gates check "could a developer follow Getting Started." Ship log isn't a how-to — it's a snapshot.
- Standard gates check "code examples compile." Ship log has no code examples; it has feature descriptions.
- Standard gates check "configuration lists defaults." Ship log doesn't document config; it documents state.
- Standard gates would FAIL on ship log because it's a different artifact with different success criteria.

## Pre-write step gotchas

- **Don't silently overwrite icp-research output.** The `merge-mode: preserve-marketing` flow keeps the ICP/audience/positioning sections that brand-system + copywriting depend on. Overwriting them silently breaks 5+ marketing-skill chains.
- **Always version when overwriting.** `product-context.v[N].md` is the rename target; the active file is always `product-context.md` (no suffix). Versioned files sit beside the active one for audit trail.

## When NOT to use Route D

- **Operator wants a README** — Route D writes to `research/product-context.md`, not `README.md`. Use the default route.
- **Operator wants release notes** — use Route E.
- **Project has no shipping history yet** (greenfield, day 0) — defer; ship log without history is just a feature list.
