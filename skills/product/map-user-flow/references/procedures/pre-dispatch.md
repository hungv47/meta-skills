# Pre-Dispatch — Read Order + Dimensions

Cited by `SKILL.md` "Pre-Dispatch" section. Apply the canonical Pre-Dispatch protocol (`../_shared/pre-dispatch-protocol.md`). map-user-flow has a **mandatory platforms+surfaces gate** before any Layer 1 dispatch — that gate sits inside Pre-Dispatch's question set (see `../pre-dispatch-prompts.md` for the gate prompt).

## Needed dimensions

- **feature** — what's being designed
- **role/persona** — primary user
- **goal** — success state for this flow
- **platforms** — explicit list (never "cross-platform"; per Gate 2)
- **surfaces per platform** — widgets, menu bar, Live Activity, notifications, etc.
- **primary surface per platform** — where the flow chiefly lives
- **constraints** — auth + min OS versions

## Read order

1. **Pipeline:** `research/product-context.md` for product/audience grounding. `brand/DESIGN.md` (optional — components, tokens). `brand/BRAND.md` (optional — voice, terminology).
2. **Experience:** `.forsvn/experience/{audience,technical,goals}.md` for product, audience, and platform history.
3. **Catalog:** `../platform-touchpoints.md` for the canonical platform/surface list.

If `research/product-context.md` `date` is >30 days old, recommend re-running `research-icp` to refresh.

## Before-Starting checklist (applied first)

Per `../_shared/before-starting-check.md`:

0. **Mode resolution** — `budget: standard`. Mode-resolver (`../_shared/mode-resolver.md`) applies canonical heuristics (≤3 sentences / single-topic clear-scope / multi-artifact). `--fast` flag forces Single-Agent Fallback. Safety gates supersede `--fast`.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches canonical inventory.
2. Read `.forsvn/index/manifest.json` for prior flow files at this slug + cross-flow staleness.
3. Read `.forsvn/experience/{audience,technical,goals}.md`.

## Prompts

`../pre-dispatch-prompts.md` holds Warm Start, Cold Start (with the mandatory platforms+surfaces gate inside), write-back rules, and the brief-context contract passed to all agents.
