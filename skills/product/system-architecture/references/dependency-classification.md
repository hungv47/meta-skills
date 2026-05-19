---
title: System-Architecture — Dependency Classification
lifecycle: canonical
status: stable
produced_by: system-architecture
load_class: PROCEDURE
---

# Dependency Classification

**Load when:** designing integrations and service boundaries (integration-agent dispatch in Layer 2). Every external dependency the architecture introduces must be classified into one of four categories. The classification drives downstream testing strategy in `task-breakdown` and `fresh-eyes`.

---

## The four categories

| Category | What it is | Testing strategy | Example |
|----------|-----------|-----------------|---------|
| **In-process** | Pure computation, no I/O | Test directly, no mocks needed | Validation logic, formatters, calculators |
| **Local-substitutable** | Has a lightweight local stand-in | Use the stand-in in tests | PGLite for Postgres, LocalStack for AWS, MailHog for email |
| **Remote but owned** | Your own services | Ports & Adapters — define interface, test with in-memory adapter | Your auth service, your billing API |
| **True external** | Third-party, no stand-in | Mock at the boundary only | Stripe API, Twilio, OpenAI |

Document the category for each dependency in the §7 Service Connections section of the artifact.

## Why classification matters

- **In-process** dependencies are free to test exhaustively — no fixtures, no setup cost. Encourage extracting pure computation into this category.
- **Local-substitutable** dependencies are tested with real-shape stand-ins — closer to prod behavior than mocks, cheaper than full-stack tests. PGLite catches SQL-shape issues a Postgres mock would silently pass.
- **Remote but owned** dependencies should expose a Ports & Adapters interface — in-memory adapter for tests, real adapter for prod. Coupling tests to the real service is a maintenance liability.
- **True external** dependencies get mocked at the boundary only — don't mock further inward. Mock Stripe's API surface, not your own wrapper around it.

## Classification heuristics

When the category is ambiguous:

- **Has I/O at all?** No → In-process.
- **Has a Docker image / local binary / npm package that mimics the API?** Yes → Local-substitutable.
- **Do you own the source code and the deployment?** Yes → Remote but owned.
- **None of the above** → True external.

## Common misclassifications

- **Treating your own microservice as True External** — leads to over-mocking. If you own it, classify as Remote but owned and use an in-memory adapter.
- **Treating Postgres as True External** — PGLite exists. Local-substitutable.
- **Treating a pure validation function as Remote but owned because it lives in a separate npm package** — package boundary ≠ deployment boundary. In-process.
- **Skipping classification for "obvious" dependencies** — every dependency. An unclassified dependency is an untested dependency at the boundary.

## Cross-skill propagation

The classification table in §7 of the artifact is consumed by:

- `task-breakdown` — generates per-dependency test tasks based on category.
- `fresh-eyes` — checks that implementation matches the classification (e.g., flags when a `true-external` dependency is being tested without a boundary mock).
- `code-cleanup` (when refactoring) — preserves the boundary; does NOT collapse Remote but owned into In-process for "simplification."

Update the table whenever a new dependency is added in a downstream feature build. Stale classifications cause silent testing-strategy drift.
