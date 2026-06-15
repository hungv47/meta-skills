---
title: Humanmaxxing — Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: humanmaxxing
load_class: PROCEDURE
---

# Pre-Dispatch Procedure

**Load when:** orchestrator enters Pre-Dispatch (before Layer 1 dispatch). Implements the canonical Pre-Dispatch protocol (`_shared/pre-dispatch-protocol.md`) for this skill's needed dimensions.

---

## Needed dimensions

- **Original text + content type** — always required as input (NOT asked via Cold Start — these come from the slash command arg or upstream caller's brief)
- **Target voice** — adjectives or a brand reference (decides soul-injection-agent's lever)
- **Compression target** — light (10-15%) / moderate (20-30%, default) / heavy (30%+, aggressive) — decides compression-agent's lever
- **Register preservation** — keep formal vs neutralize toward conversational baseline (decides strip-agent's intensity)
- **Detector mode** — `none | proxy | pangram` (decides whether Detector-Resistance Verification runs after critic PASS)
- **Protected tokens** (Route C only) — list of named entities + numbers + URLs + proof points that MUST appear verbatim in final output (typically passed by `write-outreach` or `write-ad`)

## Read order (warm-start scan)

1. **Pipeline artifacts:**
   - `brand/BRAND.md` → voice rules + lexicon + voice adjectives
   - `research/product-context.md` → voice adjectives (Voice — adjectives field if present)
   - `docs/forsvn/artifacts/marketing/content/[slug].md` if polishing a prior artifact (extract source skill from frontmatter)
2. **Experience:** `docs/forsvn/experience/brand.md` → voice notes from prior runs (`Voice — adjectives` key)
3. **Conversation context:** brief from upstream skill (e.g., copywriting handed text directly with voice context)

If `research/product-context.md` `date:` is >30 days, warn and recommend re-running `research-icp` for fresh voice adjectives — brand voice evolves.

## Warm Start (most dimensions resolvable)

```
Found:
- brand voice → "[3 adjectives from BRAND.md]"
- content type → "[blog | landing page | docs | email | social]"

Defaults applied: compression=moderate, register=preserve.
Override anything, or proceed?
```

If user proceeds, dispatch. Optional inline probe only if the content type genuinely couldn't be inferred from the input.

## Cold Start (no voice context)

```
Humanmaxxing strips AI patterns and injects voice. To make the output sound like
*you* (not generic-clean), I need a quick read on:

1. **Target voice** — 3 adjectives (e.g., "blunt, specific, dry") OR a reference
   brand whose voice you'd want to match OR point me at `brand/BRAND.md` if it
   exists.
2. **Preserve register?** — If the source is technical/formal/legal, keep it
   that way (yes), or neutralize toward a more conversational baseline (no)?
3. **Compression target** — Light (10-15%, light-touch), Moderate (20-30%,
   default), or Heavy (30%+, aggressive).

Answer 1-3 in one response. I'll dispatch.
```

Wait for answers. Do not dispatch without them.

## Write-back

After cold-start answers, append to experience/:

| Question | File | Key | When to write |
|---|---|---|---|
| 1. Target voice | `docs/forsvn/experience/brand.md` | `Voice — adjectives` | ONLY if 3-adjective form (not when pointing at BRAND.md — that's already canonical, no point duplicating) |
| 2. Register preserve | (routing only — content-specific) | — | Do NOT write-back. Register varies by source. |
| 3. Compression target | (routing only — content-specific) | — | Do NOT write-back. Compression varies by content type per Content Type Calibration. |

**Note on upstream callers (Route C):** when humanmaxxing is invoked by another skill (e.g., `write-copy` or `write-outreach` auto-routing for EN polish), the calling skill passes voice + register + compression + protected_tokens in `pre-writing`. humanmaxxing trusts those values; the Cold Start question bundle does NOT fire under Route C unless the calling skill explicitly delegates voice resolution.

## Pre-Writing Assembly

After Pre-Dispatch resolves, compile and pass to every agent in the `pre-writing` input:

- **Content type** — blog | landing page | docs | email | social | short-outbound (for cold-outreach / ad-copy callers)
- **Voice adjectives** — from BRAND.md / experience / cold-start (or defaults: "clear, specific, human")
- **Audience register** — formal | professional | conversational | casual
- **Original word count** — for compression tracking
- **Source** — which skill or external source produced the content
- **User directives** — patterns to keep, intensity preferences (from Diagnostic-stage user checkpoint in Route B)
- **Protected tokens** — named entities, numbers, URLs, proof points that must survive (Route C only)
- **Detector mode** — `none | proxy | pangram`

## Hard-block conditions

- **No text provided.** BLOCKED, ask for content. (humanmaxxing cannot polish what doesn't exist.)
- **No voice reference AND no brand context.** NEEDS_CONTEXT for Route B (cold-start asks Q1 first). Route A can proceed with default voice ("clear, specific, human") since voice injection is skipped for short text.
- **Content type unresolvable.** Re-ask Q1 of Cold Start (content type inference failed).
- **`detector_mode: pangram` requested BUT no `PANGRAM_API_KEY` or operator-configured detector command.** Either downgrade to `detector_mode: proxy` (and warn) or BLOCK until classifier available.
- **`protected_tokens` passed with empty list.** Treat as Route B (no token preservation requirement). If caller meant to pass tokens, this is a caller bug — surface to caller.

## `--fast` behavior in Pre-Dispatch

`--fast` does NOT skip Cold Start — when target voice / content type / compression target are missing AND not resolvable from warm-start, the bundled question still fires. `--fast` collapses Route B to Route A (skip voice-extractor + soul-injection + compression; run pattern-scanner + strip + critic only), and skips Detector-Resistance Verification. Critical Gates 1-5 + Absolute Prohibitions 1-9 STILL enforced per `_shared/mode-resolver.md`.

Hard-block conditions above STILL fire under `--fast` — safety gates supersede `--fast`.
