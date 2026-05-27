# write-docs — Pre-Dispatch + Before-Starting procedure

Canonical Pre-Dispatch protocol: [`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md).

## Before Starting (full)

Apply [`../_shared/before-starting-check.md`](../_shared/before-starting-check.md). Then:

- **Mode resolution** ([`../_shared/mode-resolver.md`](../_shared/mode-resolver.md)). `budget: standard`. `--fast` forces Single-Agent Fallback. **Safety gates supersede `--fast`.**
- Read `.forsvn/index/manifest.json` for prior docs-writing runs against the same target; surface staleness signals.
- Read `.forsvn/experience/technical.md` for prior doc conventions (voice, formatting preferences).
- Read project context: existing README, CLAUDE.md, `research/product-context.md`, `package.json#description` — all available context before scanning code.

## Pre-Dispatch needed dimensions

- **audience:** end-user / developer / operator / mixed
- **doc-type:** readme / user-guide / api-reference / config-guide / tutorial / ship-log / release-notes
- **codebase path**
- **mode:** fresh write or update existing

## Read order

1. Codebase scan (existing README, docs/, package manifest, framework hints)
2. `.forsvn/experience/technical.md` (prior doc conventions)

## Warm Start / Cold Start / Route-locked Pre-Dispatch (D + E override Q1+Q2) / Write-back rules

See [`../pre-dispatch-prompts.md`](../pre-dispatch-prompts.md).
