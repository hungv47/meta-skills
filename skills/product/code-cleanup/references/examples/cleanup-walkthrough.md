---
title: Code-Cleanup — Worked Example
lifecycle: canonical
status: stable
produced_by: code-cleanup
load_class: EXAMPLE
---

# Worked Example: Express API Cleanup

**Load when:** triangulating to a target — operator wants to know what a "clean up the codebase" run looks like end-to-end, or the orchestrator needs an anchor for batch sizing + scanner output shape.

---

## Invocation

```
/code-cleanup
> Clean up this Express API project, it's gotten messy after 6 months.
```

## Triage

Broad cleanup ("everything") — dispatch all four scanners.

## Layer 1 (parallel)

**`structural-scanner-agent`** reports:
- 4 unused files in `/utils` (no imports anywhere)
- 2 duplicate helpers (different paths, identical bodies)
- Naming inconsistency: `userController.js` vs `product-controller.js` (kebab-case prevails in 11/13 controllers)

**`code-scanner-agent`** reports (two-pass):
- Pass 1 (safety): 0 issues
- Pass 2 (smells): 12 TODO comments with no actionable context, 3 `console.log` calls in production code paths, 2 commented-out blocks (>50 lines each), 5 AI slop instances (defensive null checks around guaranteed inputs)

**`dependency-scanner-agent`** reports:
- 2 unused: `lodash`, `moment` (no static or dynamic imports)
- 1 duplicate: `underscore` alongside `lodash` (different APIs, same role)

**`asset-scanner-agent`** reports:
- 1 broken: `public/favicon.avif` (0 bytes — failed AVIF conversion)
- 3 test fixtures in prod: `public/user-fixture.json` + `seed-data.csv` + `mock-response.json` (45KB total)
- 2 unused images: `old-hero.png` (1.2MB), `draft-logo.png` (340KB) — never referenced
- 1 unoptimized: `hero-bg.png` (2.1MB; WebP equivalent would be ~400KB)

## Layer 2 (sequential)

**`safe-removal-agent`** creates backup commit `a1b2c3d`, then removes (in 3 batches with tests between):

- Batch 1: 4 unused `/utils` files + 2 commented blocks → tests PASS
- Batch 2: `lodash` + `underscore` (after grep confirms 0 string references) → tests PASS
- Batch 3: `favicon.avif` + 3 test fixtures + 2 unused images → tests PASS

**`refactoring-agent`**:
- Extracts shared validation logic into `middleware/validate.js` (3-site duplication → single source)
- Normalizes 11 controllers from camelCase + kebab-case mix → kebab-case (the prevailing pattern)
- Removes 12 TODO comments + 3 `console.log` calls
- Replaces `hero-bg.png` with `hero-bg.webp` + updates 4 references

**`validation-agent`**:
- `bun test`: 47/47 PASS
- `tsc --noEmit`: clean
- Lint: clean
- Build: clean

**`critic-agent`**:
- Rule 1 (preserve behavior): PASS — all validation green, no observable output changes
- Rule 2 (small steps): PASS — 3 removal batches, test between each
- Rule 3 (check conventions): PASS — read `.editorconfig` + lint config + observed kebab-case pattern before normalization
- Rule 4 (test after each change): PASS — validation ran between batches
- Rule 5 (rollback awareness): PASS — backup commit `a1b2c3d` recorded, no batch >10 changes
- **Verdict: PASS.**

## Artifact

Saved to `.agents/skill-artifacts/meta/records/2026-05-08-cleanup-express-api.md`. Frontmatter `status: done`, all 5 sections populated, no Manual Verification Needed (full coverage), no Rollback list (no critic FAILs).

## Lessons embedded in this run

- **Why 3 batches not 1:** atomic batches make rollback surgical. If a batch failed validation, only that batch reverts — the earlier batches stay.
- **Why dependency-scanner runs grep for string literals:** dynamic imports via `require(variable)` or `import()` with a string key wouldn't show in static analysis. Removing a "dead" dep that's used via `require(\`./${name}\`)` breaks prod silently.
- **Why critic-agent verifies convention compliance:** structural-scanner detected the naming inconsistency, but refactoring-agent chose kebab-case because 11/13 files already used it. The critic verified the chosen direction matches the prevailing pattern, not a personal preference.
- **Why asset-scanner removed `draft-logo.png` only after confirming zero references:** "draft" in filename suggests work-in-progress; could have been the operator's reference asset. Grep across all source files + image references + CSS confirmed zero usages before removal.
