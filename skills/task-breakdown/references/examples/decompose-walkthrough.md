---
title: Task-Breakdown — Decomposition Walkthrough
lifecycle: canonical
status: stable
produced_by: task-breakdown
load_class: EXAMPLE
---

# Worked Example — Todo App Decomposed End-to-End

**Load when:** the orchestrator needs a concrete anchor for what a clean multi-agent decomposition looks like — particularly the Layer 1 parallel dispatch outputs, Layer 2 sequential merge, critic PASS, and final `tasks.md` artifact.

---

**User:** "Break down a Todo app with Supabase auth and email notifications."

**Orchestrator confirms:** LOCKED SCOPE (spec is clear).

## Layer 1 dispatch (parallel)

- **decomposer-agent** → produces 7 tasks assigned stable IDs T1–T7:
  - T1: scaffold Next.js + Supabase
  - T2: signup
  - T3: login + protected routes
  - T4: tasks table + RLS
  - T5: create task
  - T6: email notification
  - T7: end-to-end test

- **dependency-mapper-agent** → maps:
  - Fan-out from T1: T2, T3, T4 can run parallel once T1 lands
  - Fan-in at T5: needs T2, T3, T4
  - **Hidden dep surfaced:** Resend API key missing from prerequisites

## Layer 2 chain (sequential)

- **ordering-agent** → merges:
  - Moves Resend API key to **Prerequisites** section (not Task 6)
  - Orders risk-first: auth (T2, T3) before CRUD (T4, T5)
  - Identifies parallelism: T2 + T4 can run simultaneously after T1
- **acceptance-agent** → writes specific criteria per task. Example T2 acceptance:
  > "Submit signup form → user appears in Supabase Auth → confirmation email sent"
- **critic-agent** → reviews against Critical Gates checklist → **PASS** (all 7 gates met first round)

## First-run artifact (all pending, saved to `.agents/skill-artifacts/meta/tasks.md`)

```markdown
## Status Index

| ID | Title | Status | Depends on | Updated |
|----|-------|--------|------------|---------|
| T1 | Scaffold Next.js + Supabase | pending | — | 2026-04-21 · task-breakdown |
| T2 | Auth: signup | pending | T1 | 2026-04-21 · task-breakdown |
| T3 | Auth: login + protected routes | pending | T1 | 2026-04-21 · task-breakdown |
| T4 | Tasks table + RLS | pending | T1 | 2026-04-21 · task-breakdown |
| T5 | Create task | pending | T2, T3, T4 | 2026-04-21 · task-breakdown |
| T6 | Email notification | pending | T5 | 2026-04-21 · task-breakdown |
| T7 | End-to-end test | pending | T5, T6 | 2026-04-21 · task-breakdown |
```

A fresh agent opening this file runs the Resume Protocol from [`../execution-protocol.md`](../execution-protocol.md): Status Index → first pending with all deps done → **T1**. Claims it, executes, flips to `done` with evidence, moves to T2 or T4 (both unblocked once T1 lands).

---

## What this walkthrough illustrates

- **Hidden deps get caught at decomposition time, not implementation time.** The Resend API key would have surfaced as "task blocked, missing config" when an agent picked up T6 — but dependency-mapper finds it FIRST and moves it to Prerequisites.
- **Risk-first ordering is non-obvious.** Pure dependency order would put T4 (tasks table) before T2 (signup), since T4 only depends on T1. Ordering-agent reorders T2 + T3 first because auth is the bigger unknown — failing fast on auth shape lets T4's schema reflect actual user identity decisions.
- **Parallelism is mechanical once deps are explicit.** T2 + T4 both depend only on T1 → can run simultaneously after T1 lands. The Status Index makes this visible at a glance to any operator coordinating multiple implementers.
- **Critic PASS on first round** signals the decomposition is well-shaped. If critic FAILs, the revision loop re-dispatches only the cited agents (e.g., critic flags T5 acceptance as vague → only acceptance-agent re-runs, not the whole chain). Max 2 rounds before escalating.
- **Every task ships with one acceptance test.** T2 isn't "auth works" — it's "submit signup form → user in Supabase Auth → confirmation email sent." A junior dev could verify this; failure mode is obvious.
