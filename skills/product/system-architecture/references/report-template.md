---
title: System-Architecture — Report Template
lifecycle: canonical
status: stable
produced_by: system-architecture
load_class: PROCEDURE
---

# Report Template

**Load when:** Step 6 (Assembly). Save the architecture artifact to `architecture/system-architecture.md`. On re-run: rename existing artifact to `system-architecture.v[N].md` and create new with incremented version.

---

## Frontmatter

Baseline required fields: `skill`, `version`, `date`, `status`.
Step 7.5 additions (manifest-sync conformance; backfilled going forward): `lifecycle`, `produced_by`, `provenance`.

```yaml
---
skill: system-architecture
version: {N}
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
# Step 7.5 fields (artifact-graph hardening; backfilled going forward):
lifecycle: canonical
produced_by: system-architecture
provenance:
  skill: system-architecture
  run_date: YYYY-MM-DD
  input_artifacts:
    - <path to spec.md>
    - <paths to flow files, if any>
    - <path to product-context.md, if present>
  output_eval: []
---
```

## Body sections

```markdown
# System Architecture: [Product Name]

## 1. System Overview
[1-paragraph description: what this system does, primary user types, scale profile.]

## 2. Tech Stack
[Per-choice rationale. Format: choice + why + alternatives considered + when this choice would be wrong.]

## 3. File & Folder Structure
[Tree showing directory layout. Match chosen framework conventions.]

## 4. Database Schema
[Tables, relationships, indexes. Queries against access patterns.]

## 5. API Architecture
[Endpoints with auth, request/response contracts. One endpoint per user-facing feature minimum.]

## 6. State Management & Data Flow
[Client state, server state, sync model. Caching strategy.]

## 7. Service Connections
[Every external dependency with classification from `dependency-classification.md`:
  - In-process / Local-substitutable / Remote-owned / True-external]

## 8. Authentication & Authorization
[Roles, permission levels, session model, token strategy. Cover every user type from §1.]

## 9. Key Features Implementation
[Per-feature: which files, which endpoints, which services, which states.]

## 10. Deployment & Infrastructure
[Hosting, CI/CD pipeline, env vars (COMPLETE list), monitoring + logging + error tracking.]

## 11. Monitoring & Debugging
[Observability stack, error reporting, log aggregation, alerting thresholds.]

## 12. Security Review

### 12a. Threat Model (STRIDE)
For each critical data flow, evaluate: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege.
See `references/security-patterns.md` for the STRIDE template.

### 12b. OWASP Top 10 Scan
Architecture-level check against OWASP Top 10 categories. Focus on design decisions, not code patterns.
See `references/security-patterns.md` for the checklist.

### 12c. LLM/AI Security (conditional — include only if system uses AI/LLM)
Prompt injection vectors, output sanitization, tool validation, cost amplification.
See `references/security-patterns.md` for the LLM security checklist.

### 12d. Not Flagged (false-positive exclusions applied)
List any patterns that were checked but excluded per the false-positive exclusion rules.

## Not Included
[Explicitly excluded items with rationale — what this architecture intentionally does NOT cover.]

## Open Questions
[Anything the critic flagged after 2 revision rounds; constraint conflicts that need operator input.]

## Next Step
Run `task-breakdown` to decompose this architecture into implementable tasks.
```

## Required vs. optional sections

- **Required:** §1-12 + §12a + §12b + §12d (false-positive log). Skipping a section silently violates Critical Gate 1 ("every tech choice has a rationale") or Gate 4 ("Deployment section includes complete env var list").
- **Conditional:** §12c (LLM/AI Security) — include only when the system uses AI/LLM.
- **Required when applicable:** Not Included (omit if every spec'd item is in scope); Open Questions (omit if all critic findings resolved within 2 revision rounds).

## Version increment rule

On re-run with the same project:
- First re-run: rename existing `system-architecture.md` → `system-architecture.v1.md`; write new as `system-architecture.md` (the active one stays at the canonical path).
- Subsequent re-runs: rename to `.v2.md`, `.v3.md`, etc.
- Always increment the `version: N` frontmatter field on the new active file.

The active artifact is always at `architecture/system-architecture.md` (no version suffix); versioned files are the historical trail. Downstream skills (`task-breakdown`, `fresh-eyes`, `code-cleanup`) read only the active file.
