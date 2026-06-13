# Brief-Shortform Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Format Agent | 1 (parallel) | `agents/format-agent.md` | Locks aspect / length / safe zones / file specs per platform from research catalog. |
| VoC Extraction Agent | 1 (parallel) | `agents/voc-extraction-agent.md` | Pulls 3-5 buyer phrases + register + sensitivity flags from ICP. |
| Production Mode Agent | 1 (parallel) | `agents/production-mode-agent.md` | Resolves live-action vs motion-graphic; outputs production-notes template. |
| Hook Agent | 1.5 (parallel) | `agents/hook-agent.md` | Visual + verbal + text triad in 0-3s; 3 variations; 3Q test; archetype menu from research catalog. |
| Storyboard Agent | 1.5 (parallel) | `agents/storyboard-agent.md` | Shot list (live-action) or scene list (motion-graphic) with timing, framing, action — includes on-screen text choreography. |
| Audio Agent | 1.5 (parallel) | `agents/audio-agent.md` | Track choice (named, from research's audio-trend) OR VO direction with sync points. |
| Copy Pack Agent | 1.5 (parallel) | `agents/copy-pack-agent.md` | Caption + hashtags + CTA per platform native conventions. |
| Platform Tailor Agent | 2 (sequential, conditional) | `agents/platform-tailor-agent.md` | **TRUE RECUT** for variants — rebuilds hook + audio + caption + CTA per platform. Caption-only resizing is rejected. |
| Critic Agent | 2 (final) | `agents/critic-agent.md` | Four sub-critics (hook / production / algorithm-fit / brand-fit); routes failures back; max 2 cycles. |

## Dispatch

Single route — Layer 1 + Layer 1.5 + Layer 2. Multi-platform invocations add `platform-tailor-agent` in Layer 2.

```
1. Pre-Dispatch (warm-start scan + cold-start if needed) — per procedures/pre-dispatch.md
2. LAYER 1 IN PARALLEL: format-agent + voc-extraction-agent + production-mode-agent
3. LAYER 1.5 IN PARALLEL (after Layer 1): hook-agent + storyboard-agent + audio-agent + copy-pack-agent
4. LAYER 2 SEQUENTIAL:
   - platform-tailor-agent (only if multi-platform — produces variants)
   - critic-agent (4-sub-critic gate; FAIL → re-dispatch named source agent)
5. Critic FAIL → re-dispatch (max 2 cycles); after cycle 2, ship `done_with_concerns`
6. Apply polish chain (vn-tone | humanmaxxing | none) per market + brand_mode on spoken-line section
7. Deliver hero + variants
```

## 4-Sub-Critic Gate

All four PASS required:

1. **Hook** — clears platform's hook window from research; visual + verbal + text triad simultaneous; 3Q test passes; archetype tagged.
2. **Production** — every shot/scene has timing (seconds), framing, action, on-screen text, audio sync; audio names a track or VO direction; production notes filled.
3. **Algorithm-fit** — brief aligns with target platform's algorithmic preferences from research catalog (completion thresholds, hold rates, audio rules, captions, watermarks).
4. **Brand-fit** — caption + verbal lines use VoC phrases from ICP; voice matches `BRAND.md` archetype; no generic founder/company tropes.

Full 4-sub-critic rubric + binary verdicts + format-fit test + 13-row Rewrite Routing Table: [`agents/critic-agent.md`](../agents/critic-agent.md).

## Pattern Catalogs

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/_shared/hook-archetypes.md` | hook | Tier-1/2 archetype menu per platform. |
| `references/storyboard-grammar.md` | storyboard | Shot/scene timing + framing tags + on-screen text choreography. |
| `references/caption-cta-rules.md` | copy-pack | Per-platform caption + hashtag + CTA conventions. |
| `references/production-modes.md` | production-mode | Live-action vs motion-graphic; mixed-mode transition principle. |
| `references/_shared/platform-intelligence/` | format, hook, platform-tailor, critic | Per-platform format + algorithm + mechanics (TikTok / Reels / Shorts / X / LinkedIn / YouTube). |
| `references/polish-chain.md` | orchestrator (Step 6) | Polish-chain table — vn-tone / humanmaxxing / none by market + brand_mode. |
| `references/success-criteria-templates.md` | hook, copy-pack | Targets the producer should hit on render. |
| `references/anti-patterns.md` | critic | Hook / Production / Algorithm-fit / Brand-fit / Variant clusters + 5 soft + 6 cross-cutting marketing-stack. |

Full mechanics: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
