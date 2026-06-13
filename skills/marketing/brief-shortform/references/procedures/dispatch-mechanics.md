---
title: Short-Form Brief — Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: short-form-brief
load_class: PROCEDURE
---

# Dispatch Mechanics

**Load when:** Layer 1 or Layer 1.5 or Layer 2 dispatch begins. Mechanics for spawning sub-agents per the orchestrator's Agent Manifest.

---

## How to spawn a sub-agent

For each agent dispatched, use the **Agent tool** with a prompt built as follows:

1. **Read** the agent instruction file — include FULL content in the Agent prompt
2. **Append** brief, context, and Layer 1 / 1.5 outputs (for Layer 1.5 and Layer 2 agents)
3. **Resolve paths to absolute**: replace relative reference paths with absolute paths rooted at this skill's directory
4. **Pass research artifact context by excerpt**: orchestrator extracts the relevant per-platform section from `short-form-research.md` and passes excerpts; sub-agents do NOT re-read the artifact (avoid token bloat + per-agent inconsistency)
5. If **feedback** exists (critic FAIL cycle), append at end with header "## Critic Feedback — Address Every Point"

## Single-agent fallback

If multi-agent dispatch unavailable, execute each agent's instructions sequentially in-context. Output quality is equivalent — multi-agent pattern optimizes parallelism, not capability.

## Layer 1: Foundation (Parallel)

Spawn **IN PARALLEL** (multiple Agent tool calls in one message).

| Agent | Instruction File | Pass These Inputs | Reference Files to Resolve |
|-------|-----------------|-------------------|---------------------------|
| Format Agent | `agents/format-agent.md` | `{ platforms, research_artifact_excerpt }` | `references/_shared/platform-intelligence/[platform].md` per platform |
| VoC Extraction Agent | `agents/voc-extraction-agent.md` | `{ icp_excerpt, product_context_excerpt, audience_hint }` | — |
| Production Mode Agent | `agents/production-mode-agent.md` | `{ brand_mode, production_mode, angle }` | `references/production-modes.md` |

## Layer 1.5: Craft (Parallel, after Layer 1)

Spawn **IN PARALLEL** after Layer 1 completes. Each Layer 1.5 agent receives all Layer 1 outputs.

| Agent | Instruction File | Pass These Inputs | Reference Files |
|-------|-----------------|-------------------|-----------------|
| Hook Agent | `agents/hook-agent.md` | All Layer 1 + research's hook archetypes for hero platform | `references/_shared/hook-archetypes.md`, `references/anti-patterns.md` |
| Storyboard Agent | `agents/storyboard-agent.md` | Format spec + production mode + recommended hook | `references/storyboard-grammar.md`, `references/anti-patterns.md` |
| Audio Agent | `agents/audio-agent.md` | Storyboard + research's audio-trend output if applicable | — |
| Copy Pack Agent | `agents/copy-pack-agent.md` | Format spec + VoC + research's caption/CTA findings | `references/caption-cta-rules.md` |

## Layer 2: Finalize (Sequential)

| Agent | Instruction File | Pass These Inputs | Reference Files |
|-------|-----------------|-------------------|-----------------|
| Platform Tailor Agent | `agents/platform-tailor-agent.md` | Hero brief + research catalog per variant platform | `references/_shared/hook-archetypes.md`, `references/caption-cta-rules.md`, `references/_shared/platform-intelligence/[variant-platform].md` |
| Critic Agent | `agents/critic-agent.md` | Hero + variants | `references/anti-patterns.md`, `references/success-criteria-templates.md` |

**Conditional dispatch:** `platform-tailor-agent` runs only when `len(platforms) >= 2`. Otherwise Layer 2 starts at critic.

## Critic Routing

Critic returns one of:

- **PASS** → apply polish chain (per market + brand_mode), deliver as `done`
- **FAIL with named sub-critic** → re-dispatch source agent with feedback per the 13-row routing table in `agents/critic-agent.md`. Common routes:
  - Hook FAIL → `hook-agent` (rewrite to clear hook window, fix triad, pass 3Q test)
  - Production: vague action → `storyboard-agent`
  - Production: vague audio → `audio-agent`
  - Production: missing prod notes → `production-mode-agent`
  - Algorithm-fit: length → `format-agent` + `storyboard-agent`
  - Algorithm-fit: audio rule → `audio-agent`
  - Algorithm-fit: captions → `format-agent` + `copy-pack-agent`
  - Brand-fit: VoC missing → `voc-extraction-agent` + `hook-agent` + `copy-pack-agent`
  - Brand-fit: generic trope → `hook-agent` + `copy-pack-agent`
  - Brand-fit: archetype mismatch → `hook-agent` + `copy-pack-agent`
  - Brand-fit: format-fit pasted-on → `hook-agent` + `storyboard-agent`
  - Brand-fit: format-fit heavy-integration → `format-agent` + `storyboard-agent`
  - Variant FAIL: caption-only resize → `platform-tailor-agent`

**Loop cap:** 2 cycles. After cycle 2 with any FAIL remaining, ship `done_with_concerns` with concerns pinned at top of brief.

## Polish Chain (Layer 2 post-critic)

After PASS, apply language polish to the spoken-line section (Hook verbal + VO direction + on-screen text where it's spoken text):

| (Market, Brand mode) | Polish chain |
|---|---|
| VN, founder | `polish-vn` Layer 2 on spoken-line section + full body |
| VN, company | `polish-vn` Layer 2 on full body |
| EN, founder | `humanmaxxing` Layer 2 on spoken-line section |
| EN, company | none |
| Other | flag `polish-chain-extension-needed` |

The polish chain runs as a final pass over the relevant sections — not a re-dispatch of craft agents. See `references/polish-chain.md` for the per-register treatment. Auto-routing is enforced in Pre-Dispatch (see `procedures/pre-dispatch.md` § "VN auto-routing").

## Chain Position

Previous: `research-shortform` (warm-start, soft-required) | Next: human producer / video editor / motion designer (no further skill chain at v1; `evaluate-shortform` MAY expand to score published posts against the hero brief in a future revision).

**Re-run triggers:**
- Trend signals >30d old in source research (warn — refresh recommended; critic flags `done_with_concerns`)
- Platform mechanics >180d old (warn — refresh recommended)
- Angle pivot, platform mix change, market pivot, campaign re-positioning

**Skill deference:**
- No research artifact → `research-shortform` first (soft — proceeds without it but flags `trend_signals_stale`)
- No BRAND.md + brand_mode unresolvable → `create-brand` first
- No ICP + no audience hint → `research-icp` first
- Static visual brief (carousel, infographic) → `brief-graphic`
- Paid ad creative → `write-ad`
- Per-platform research catalog (what's working right now) → `research-shortform` (this skill consumes; not produces)
- Campaign distribution strategy across many assets → `plan-campaign`
