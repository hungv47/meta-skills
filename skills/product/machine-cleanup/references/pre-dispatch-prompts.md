---
title: Machine-Cleanup — Pre-Dispatch Prompts
lifecycle: canonical
status: stable
produced_by: machine-cleanup
load_class: PROCEDURE
---

# Pre-Dispatch Prompts

**Load when:** Pre-Dispatch step fires. Choose Warm Start (scope clear from invocation) or Cold Start (general "clean my machine"). Emit verbatim — calibrated for one round-trip resolution.

---

## Warm Start

Fires when scope is clear from invocation (e.g., "clean my caches", "audit globals", "remove unused languages", or user points at a specific folder).

```
Found:
- scope → "[caches / dotfolders / etc.]"
- detected disk pressure → "[GB used in target scope]"

Aggressiveness defaults to moderate (suggests but asks before destructive deletes).
Override or proceed?
```

If operator confirms or types nothing → dispatch with detected values + moderate aggressiveness. Override resets to Cold Start.

## Cold Start

Fires when invocation is general ("clean my machine", "free up disk space", `/machine-cleanup` with no args).

```
machine-cleanup audits dotfolders, caches, package globals, and toolchains
to remove abandoned state without breaking active workflows. Before I scan:

1. **Scope** — pick one or more:
   - dotfolders (~/.foo, ~/.bar — most common abandonment)
   - caches (~/.cache, ~/Library/Caches — usually safe to clear)
   - packages (npm/brew/bun/cargo/go/pipx globals)
   - runtimes (orphaned node/python versions)
   - all
2. **Aggressiveness** — conservative (skip anything ambiguous), moderate
   (default — propose with rationale, ask before destructive), aggressive
   (suggest more removals, more proactive flagging).
3. **Excluded paths** — anything off-limits even if it looks abandoned?
   (Project archives, encrypted vaults, in-progress experiments, etc.)

Answer 1-3 in one response. I'll inventory and propose.
```

## Write-back rules

After Cold Start resolves, persist only durable context:

| Q | File | Key | Rule |
|---|---|---|---|
| 3. Excluded paths | `skills-resources/experience/technical.md` | `Technical — machine-cleanup excluded paths` | Durable across runs (these paths stay protected) |

Q1 (scope) + Q2 (aggressiveness) are run-specific. Don't persist.

## Re-run after pause

If Pre-Dispatch resolved last session and operator returns within the same session/context, skip the prompt. If across-session and operator invokes with same scope → emit Warm Start with stored excluded-paths as "Found." Same response can confirm or override.

## Safety gate (under `--fast`)

`--fast` skips multi-agent dispatch but does NOT skip Pre-Dispatch. The 6 golden rules require knowing scope + aggressiveness + excluded paths before any deletion. If `--fast` invocation arrives with no resolvable signal AND no prior `technical.md` entry, Pre-Dispatch still fires (single bundled question) before dispatch. Mode-resolver's `safety-gates-supersede-fast` clause is the contract.

User-data dirs (Desktop, Documents, Downloads, Pictures, Movies, Music, Public, cloud-mount symlinks) are off-limits regardless of aggressiveness setting — even "aggressive" surfaces them only, never auto-recommends nuke.
