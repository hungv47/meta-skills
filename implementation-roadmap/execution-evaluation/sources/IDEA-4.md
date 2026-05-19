# Architecture Roadmap: Production, Evaluation & Feedback

> **STATUS: SUPERSEDED** (2026-05-16). Consolidated into `ROADMAP.md`. Sub-files (IDEA-4a, 4b, 4c) retained as source material but execution plan lives in ROADMAP.md.

## Overview

Three interconnected initiatives to close the strategy→execution→evaluation loop. Each has its own file with full implementation plan:

| # | Initiative | File | Priority | Status |
|---|---|---|---|---|
| 1 | **Production/Execution Layer** — skills that produce actual assets (Figma, video, social posts) | [`IDEA-4a-execution-production.md`](IDEA-4a-execution-production.md) | High | Not started |
| 2 | **Evaluation Layer** — Karpathy-style autoresearch eval loops for measurable output improvement | [`IDEA-4b-evaluation-layer.md`](IDEA-4b-evaluation-layer.md) | High | Partially started |
| 3 | **Feedback Loop Architecture** — artifact→eval→improvement propagation across skills and sessions | [`IDEA-4c-feedback-loop.md`](IDEA-4c-feedback-loop.md) | Medium | Not started |

## Current State

The stack has strong strategy/briefing skills (brand-system, lp-brief, short-form-brief, ad-copy, copywriting) and a working eval-loop scaffold. What's missing:

- **No execution skills**: every asset-producing skill stops at a brief/spec. No skill renders images, publishes video, or posts content.
- **Eval layer has gaps**: short-form-eval is missing its rubric reference; no ad-eval, content-eval, or campaign-eval exist.
- **No feedback propagation**: eval findings stay in loop folders. Skills don't read past outputs + results on the next invocation. The `experience/` Q&A substrate doesn't exist on disk.

## Sequencing

| Phase | Tracks | Depends on |
|---|---|---|
| **1** | Production layer: visual asset skill | None |
| **1** | Evaluation layer: fill rubric gaps, create ad-eval + content-eval | None |
| **2** | Production layer: social posting skill | Phase 1 tools validated |
| **2** | Feedback loop: create experience/ directory, connect eval→skill improvement | Phase 1 eval layer |
| **3** | Production layer: video production skill | External tool availability |
| **3** | Feedback loop: quality dashboard, critic introspection | Phase 2 feedback foundation |

These are independent enough that Phase 1 tracks can run in parallel.
