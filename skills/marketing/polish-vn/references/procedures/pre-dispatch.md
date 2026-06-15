---
title: VN-Tone — Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: vn-tone
load_class: PROCEDURE
---

# Pre-Dispatch Procedure

**Load when:** orchestrator enters Pre-Dispatch (before Layer 1 dispatch). Implements the canonical Pre-Dispatch protocol (`_shared/pre-dispatch-protocol.md`) for this skill's needed dimensions.

---

## Needed dimensions

- **Target register** — `bao-chi` | `semi-casual` | `bro` | `pop-marketing` (Critical Gate 2; required)
- **Dialect** — `north` | `south` | `neutral` (default: `neutral`)
- **Subvariant** — `bro-otofun` | `bro-voz` (required only if target register = `bro`)
- **Brand glossary** — optional list of terms to preserve unchanged (from product-context.md if present)
- **User directives** — optional explicit overrides ("keep `quý khách` — luxury brand directive", "audience is ≥50yo")

Note: `original_text` (the Vietnamese input) is a per-run input, not a Pre-Dispatch dimension.

## Read order (warm-start scan)

1. **Pipeline artifacts:**
   - `research/product-context.md` → brand voice (adjective → register map; see Register Resolution below) + dialect/glossary preferences
   - `docs/forsvn/artifacts/marketing/content/[slug].md` if polishing a prior artifact (extract register from frontmatter if present)
2. **Experience:** `docs/forsvn/experience/brand.md` → register-mapping notes (only if user previously persisted `Brand — VN target register`)
3. **Conversation:** explicit `--register` argument from user always wins (highest priority)

## Register Resolution (used in both warm and cold flows)

Priority order — highest wins:

1. **Explicit `--register` argument** on the slash command
2. **Brand voice from `research/product-context.md`** via adjective → register map:
   - "authoritative" / "institutional" / "formal" → `bao-chi`
   - "warm" / "community" / "approachable" → `semi-casual`
   - "in-group" / "community-specific" → `bro` (also requires subvariant)
   - "young" / "lifestyle" / "consumer" → `pop-marketing`
3. **Content type inferred from upstream artifact:**
   - News article / press release → `bao-chi`
   - Blog post / SaaS doc → `semi-casual`
   - Landing page / ad copy → `pop-marketing`
   - Forum post (Otofun / Voz) → `bro` + matching subvariant
4. **Ask the user** — do not guess silently when priorities 1-3 don't resolve.

## Warm Start (register inferable from priorities 1-3)

```
Inferred register: [báo chí | semi-casual | bro | pop-marketing] from [source: --register arg / product-context.md brand voice / upstream artifact type].
Dialect default: neutral. Override either, or proceed?
```

If register = `bro` and subvariant not yet resolved, the warm-start ALSO asks Q3 from Cold Start (subvariant picker).

## Cold Start (priority 4 — register cannot be inferred)

Emit the bundled 3-question prompt (one round-trip):

```
vn-tone polishes Vietnamese text to a specific register. Register choice
changes pronouns, particles, vocabulary, and rhythm — getting it wrong
makes the text feel off-key.

1. **Target register** — báo chí (institutional, news, formal),
   semi-casual (warm, community, blog), bro (in-group, niche tech/auto/forum),
   or pop-marketing (young, lifestyle, consumer)?

2. **Dialect** — north, south, or neutral (default)?

3. **Subvariant** (only if Q1 = bro) — bro-otofun (auto enthusiast)
   or bro-voz (tech enthusiast)?

Answer 1-3 (or 1-2 if not bro) in one response. I'll dispatch.
```

Wait for answers. Do not dispatch without them.

## Write-back

| Q | File | Key | When to write |
|---|---|---|---|
| 1. Register | `docs/forsvn/experience/brand.md` | `Brand — VN target register` | ONLY if user explicitly wants this stable cross-run (e.g., "save this as my default"); routing-only otherwise (the register might be content-specific for that one polish, not the brand default) |
| 2. Dialect | (routing only — content-specific) | — | Do NOT write-back. Dialect varies by content audience. |
| 3. Subvariant | (routing only — content-specific) | — | Do NOT write-back. Subvariant is content-specific. |

**Note on upstream callers:** when vn-tone is invoked by another skill (Route B — e.g., `brief-shortform` auto-routing for VN polish), the calling skill passes target_register + dialect + subvariant in `pre-writing`. vn-tone trusts those values; the Pre-Dispatch question bundle does not fire under Route B unless the calling skill explicitly delegates Register Resolution.

## Pre-Writing Assembly

After Pre-Dispatch resolves, compile and pass to every agent:

- **target_register** — `bao-chi` | `semi-casual` | `bro` | `pop-marketing` (with optional subvariant)
- **source_language** — usually `en` or `unknown` (for diagnosis context; vn-tone does NOT translate, so this is informational only)
- **brand_glossary** — list of terms to preserve unchanged (from product-context.md if present, or user-provided)
- **dialect_preference** — `north` | `south` | `neutral` (default: neutral)
- **user_directives** — explicit overrides from Pre-Dispatch conversation or Diagnostic-stage user checkpoint
- **original_text** — the Vietnamese input, exactly as provided

## Hard-block conditions

- **Input is not Vietnamese.** Stop and tell user to translate first (using `humanmaxxing` for source-language tone work, then their preferred MT). Critical Gate 1. NEEDS_CONTEXT verdict.
- **Target register requested = `bro` but subvariant missing.** Re-ask Q3 (bro-otofun / bro-voz). Cannot polish bro without subvariant — they're non-interchangeable speech communities.
- **Target register = "hybrid" or any non-canonical value.** Reject and re-ask Q1 (one of the 4 canonical registers).
- **Polishing factually broken passages.** If diagnostic agent flags the text as containing untranslatable claims or structural problems beyond register polish (e.g., garbled translation that lost the meaning), BLOCKED verdict — user fixes upstream first.

## `--fast` behavior in Pre-Dispatch

`--fast` does NOT skip Register Resolution — when target register is not resolvable from warm-start (priorities 1-3), the Cold Start question still fires. `--fast` only skips the diagnostic-agent + critic-agent dispatch after register is resolved (single-pass polisher-only, no diagnostic violation log, no critic rubric), but Critical Gates 1-4 + Absolute Prohibitions 1-8 still enforced per `_shared/mode-resolver.md`.

Hard-block conditions above STILL fire under `--fast` — safety gates supersede `--fast`.
