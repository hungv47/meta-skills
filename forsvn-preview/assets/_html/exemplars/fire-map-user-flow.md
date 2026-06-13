---
skill: map-user-flow
version: 2
date: 2026-06-12
status: done
stack: product
id: exemplar-fire-flow
type: flow
title: Review Round-Trip — Operator Flow
summary: "Five screens from agent push to recorded decision; every edge state named."
decision_state: pending
review_surface: html
---

# Review Round-Trip — Operator Flow

## The loop

1. An agent pushes an artifact and fires `notify` — the queue accrues.
2. The operator serves the top pending item; the twin renders in the browser.
3. The operator reads, marks, comments — then decides in the ledger.
4. The decision writes back to frontmatter; the twin archives.
5. The confirmation names the next pending artifact — never auto-opened.

## Edge states

| Moment | Treatment |
|---|---|
| Artifact changed on disk | 409 in-ledger alert; nothing written |
| Session idle 10 minutes | server exits having written nothing |
| Render failure | full-screen refusal with recovery steps |

> One artifact per serve is the invariant — the queue is a docket, not a feed.

## Review Gate

- [ ] Every screen traces to the review-round-trip flow
- [ ] Each edge state names its recovery
- [ ] No invented screens
