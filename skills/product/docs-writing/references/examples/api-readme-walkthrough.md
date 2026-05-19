---
title: Docs-Writing — Worked Example
lifecycle: canonical
status: stable
produced_by: docs-writing
load_class: EXAMPLE
---

# Worked Example: Node.js REST API README

**Load when:** triangulating to a target — operator wants to know what a default-route run looks like end-to-end with all 6 agents + staleness loop, or the orchestrator needs an anchor for output shape + critic decisions.

---

## Invocation

```
/docs-writing
> Document this project
```

Project context: Node.js REST API for task management. No prior README beyond a stale 2-line description.

## Pre-Dispatch (Cold Start)

The orchestrator can't infer audience or doc-type from "document this," so Cold Start fires the 4-question prompt. Operator answers:

- **Q1 — Audience:** developer (API consumers will read this)
- **Q2 — Doc type:** README + API Reference (recommended for an API project)
- **Q3 — Codebase path:** root
- **Q4 — Fresh or update:** update existing README (preserve any human-edited prose if found)

Audience and doc-type both resolved; dispatch.

## Layer 1 (parallel)

**scanner-agent** maps the project:
- `src/index.ts` — Express app entrypoint (rank 1)
- `src/routes/` — 8 route modules: auth, users, tasks, teams, notifications, webhooks, admin, health (rank 2)
- `src/models/` — Prisma models: User, Task, Team, Notification (rank 4)
- `prisma/schema.prisma` — schema file (rank 4)
- `package.json` — Node `>=18`, scripts (rank 3 for env), dependencies
- `.env.example` — 12 env vars including JWT_SECRET, DATABASE_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, REDIS_URL, SENTRY_DSN, NODE_ENV, PORT, FRONTEND_URL, ADMIN_EMAIL (rank 3)
- Existing README: 2 lines, references Node 16 (stale — package.json requires 18)

**concept-extractor-agent** reads ranked files and extracts:
- Auth: JWT-based, expiry 24h, refresh endpoint
- Task CRUD with status workflow: `todo → in-progress → done`
- Team assignment (one user belongs to one team; tasks belong to teams)
- Email notifications via SMTP
- Webhook subscriptions for status changes
- Admin endpoints gated by `ADMIN_EMAIL` env var
- Errors visible in error handling: 401 (expired token), 403 (cross-team access), 422 (invalid status transition), 429 (rate limit)
- Setup steps: install Node 18, install Postgres 14, run `npm install`, copy `.env.example` → `.env`, run `npx prisma migrate dev`, run `npm run dev`

**audience-profiler-agent** receives Q1 (developer) so returns directly: `{ type: "developer", technical_level: "high", vocabulary: "API + Express + Prisma terminology OK" }`.

## Layer 2 (sequential)

**writer-agent** receives all Layer 1 outputs + `references/doc-template.md` and writes:

- **README:** project title, 1-paragraph intro, Getting Started (5 numbered steps with expected outcome after each), Features list (7 features), Configuration table (12 env vars with defaults + descriptions), Troubleshooting (4 common errors with recovery actions), Contributing pointer.
- **API Reference:** authentication section, endpoint catalog (24 endpoints organized by resource), request/response examples, error catalog.

writer-agent updates the stale Node 16 reference to Node 18.

**staleness-checker-agent** verifies:
- Node version in setup: docs say Node 18 (matches package.json — ✓)
- Env vars: README lists all 12 (matches .env.example — ✓)
- Missing: **SMTP_PORT was in code (Nodemailer config) but not in .env.example or README.** Flag.
- API endpoints: 24 documented, 24 in routes — ✓
- Error codes: 4 documented, 4 visible in error handling — ✓

**critic-agent** runs the 6 standard gates:
- Every user-facing feature documented: ✓ (7 features for 7 main endpoint groups)
- Setup numbered with expected outcomes: ✓ (5 steps, "you should see" after each)
- New user could follow Getting Started without source code: ✓ (no "see code" references; all dependencies + commands explicit)
- Code examples compile: ✓ (curl examples + JS snippets validated against actual routes)
- Configuration lists defaults + valid values: ⚠️ SMTP_PORT missing (staleness flag)
- Troubleshooting covers code-visible errors: ✓ (all 4 documented)
- **Verdict: FAIL** — SMTP_PORT staleness must be fixed.

## Revision (round 1)

**writer-agent** re-dispatched with the staleness list:
- Adds SMTP_PORT to README Configuration table (default 587, valid range 1-65535)
- Adds SMTP_PORT to `.env.example` (separately; flagged for operator to commit)

**staleness-checker-agent** re-verifies: all claims now match codebase. ✓
**critic-agent:** all 6 gates pass. **PASS.**

## Deliver

- `README.md` written (existing renamed to `README.v1.md` for history).
- `docs/api-reference.md` written.
- Frontmatter on both: `lifecycle: canonical`, `status: done`, `audience: developer`, `doc-type: readme` / `api-reference`, `version: 1` (or N+1 for re-run), provenance fields populated.

## Lessons embedded

- **Why audience-profiler-agent ran in Layer 1 (parallel), not Layer 2:** vocabulary calibration depends on audience, and the writer needs that input. Running audience-profiler after the writer would require a rewrite when the calibration changed.
- **Why staleness-checker-agent caught SMTP_PORT but humans wouldn't:** it cross-references every documented env var against `.env.example` AND code-level config reads (`process.env.X`). The Nodemailer config read `process.env.SMTP_PORT` was the source; staleness check on the env var inventory caught the gap.
- **Why "see code for details" was avoided:** the operator chose docs-writing because they don't want to read source code. Saying "see code" is a refusal to do the job. concept-extractor extracted the relevant detail (24 endpoints with auth + parameter shapes) so the docs are self-contained.
- **Why the stale README was renamed not overwritten:** `README.v1.md` is the audit trail. If the new docs introduce a regression (operator catches "you removed the troubleshooting section I wrote by hand"), the v1 file is the recovery point.
- **Why Configuration is a table, not prose:** users scan, not read. A table with default + valid values is parseable in 5 seconds; a paragraph with the same info is parseable in 30 seconds. Same data, 6× faster comprehension.
