---
title: Code-Cleanup — Pre-Dispatch Prompts
lifecycle: canonical
status: stable
produced_by: code-cleanup
load_class: PROCEDURE
---

# Pre-Dispatch Prompts

**Load when:** Pre-Dispatch step fires (Warm Start when intent is obvious, Cold Start when vague). Emit verbatim; the prompts are calibrated for one round-trip resolution.

---

## Warm Start

Fires when cleanup intent is obvious from invocation (e.g., user said "remove dead code", "clean up assets", or invoked with a specific path + verb).

```
Found:
- repo → "[detected framework + test runner]"
- intent → "[parsed from invocation: dead code / deps / asset / refactor]"

Test suite detected: [yes/no]. Override or proceed?
```

If operator types nothing or "proceed" → dispatch with detected values. Override resets to Cold Start.

## Cold Start

Fires when invocation is vague (e.g., "clean this up", `/code-cleanup` with no args).

```
code-cleanup applies the 5 golden rules (preserve behavior, small steps,
check conventions, test after each change, rollback awareness). Before I scan:

1. **Codebase path** — root directory or specific files/glob.
2. **Cleanup intent** — pick one or more:
   - dead code (unused exports, unreachable branches, abandoned features)
   - unused dependencies
   - asset cleanup (orphaned images, unused config files)
   - refactor (consolidation, splitting, naming)
3. **Test suite** — does the project have one? (Identifies your validation
   floor; if no, I'll skip auto-validation and flag DONE_WITH_CONCERNS.)
4. **Conventions to preserve** — anything I should NOT touch (file structure,
   naming patterns, in-flight refactors)?

Answer 1-4 in one response. I'll dispatch scanners.
```

## Write-back rules

After Cold Start resolves, persist only durable context:

| Q | File | Key | Rule |
|---|---|---|---|
| 4. Conventions | `skills-resources/experience/technical.md` | `Technical — codebase conventions` | Only if user gave durable rules (e.g., "we never use default exports"), NOT one-run instructions ("leave file X alone for this run") |

Q1 (path), Q2 (intent), Q3 (test suite presence) are run-specific. Don't persist.

## Re-run after pause

If Pre-Dispatch resolved last session and the operator returns within the same session/context, skip the prompt. If across-session and operator invokes with the same path → emit Warm Start with stored conventions as "Found." Same response can confirm or override.

## Safety gate (under `--fast`)

`--fast` skips multi-agent dispatch but does NOT skip Pre-Dispatch. The 5 golden rules require knowing test-suite presence + conventions before any deletion. If `--fast` invocation arrives with no resolvable test-suite signal AND no prior `technical.md` entry, Pre-Dispatch still fires (single bundled question) before dispatch. Mode-resolver's `safety-gates-supersede-fast` clause is the contract.
