---
title: Short-Form Research — Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: short-form-research
load_class: PROCEDURE
---

# Dispatch Mechanics

**Load when:** Layer 1 or Layer 2 dispatch begins. Mechanics for spawning sub-agents per the orchestrator's Agent Manifest.

---

## How to spawn a sub-agent

For each agent dispatched, use the **Agent tool** with a prompt built as follows:

1. **Read** the agent instruction file — include FULL content in the Agent prompt
2. **Append** brief, context, and Layer 1 outputs (for Layer 2 agents)
3. **Resolve paths to absolute**: replace relative reference paths with absolute paths rooted at this skill's directory
4. **Pass research artifact context by excerpt**: orchestrator reads `research/icp-research.md` once, includes relevant excerpts in audience-fit-agent's context — sub-agents do not re-read
5. If **feedback** exists (critic FAIL cycle), append at end with header "## Critic Feedback — Address Every Point"

## Single-agent fallback

If multi-agent dispatch unavailable, execute each agent's instructions sequentially in-context. Output quality is equivalent — multi-agent pattern optimizes parallelism, not capability.

## Layer 1: Parallel Scout + Audience Fit

Spawn **IN PARALLEL** (multiple Agent tool calls in one message).

| Agent | Instruction File | Pass These Inputs | Reference Files to Resolve |
|-------|-----------------|-------------------|---------------------------|
| Platform Scout × N | `agents/platform-scout-agent.md` | `{ platform, topic, market, competitor_seeds }` | `references/platforms/[platform].md`, `references/scout-protocol.md` |
| Audience Fit Agent | `agents/audience-fit-agent.md` | `{ audience_hint, icp_excerpt, product_context_excerpt, market }` | — |

**Number of platform-scout instances** = count of requested platforms (1–5, hard cap 5).

## Layer 2: Sequential Analysis + Synthesis

Run sequentially. Each agent receives all upstream outputs.

| Agent | Instruction File | Inputs | Reference Files |
|-------|-----------------|--------|-----------------|
| Pattern Extractor | `agents/pattern-extractor-agent.md` | All scout outputs + audience-fit | `references/scoring-rubrics.md` |
| Audio Trend Agent | `agents/audio-trend-agent.md` | Scout outputs for TikTok and Reels (only) | — |
| Synthesis Agent | `agents/synthesis-agent.md` | All Layer 1 + Layer 2 upstream | `references/platforms/_comparison.md`, `references/format-conventions.md` |
| Critic Agent | `agents/critic-agent.md` | Synthesis output | `references/scoring-rubrics.md`, `references/anti-patterns.md` |

**Conditional dispatch:** `audio-trend-agent` runs only if `tiktok` or `reels` is in `platforms`. Otherwise skipped — synthesis agent omits the Trending Audio section.

## Critic Routing

Critic returns one of:

- **PASS** → deliver artifact as `done`
- **FAIL with named sections** → re-dispatch the source agent(s) with feedback. Common routes:
  - Citation FAIL → back to scout (capture missing URL) or synthesis (re-cite)
  - Sample-size FAIL → synthesis (apply correct flag)
  - Specificity FAIL → pattern-extractor + synthesis (rewrite recommendations per-platform)
  - Freshness FAIL → scout (re-verify source doc dates)
  - Audience FAIL → audience-fit-agent (re-pull from ICP or declare cold-start hint)

**Loop cap:** 2 cycles. After cycle 2, ship `done_with_concerns` with failed rubrics pinned at top of artifact.

## Chain Position

Previous: `research-icp` (recommended, soft-required) | Next: `brief-shortform` (marketing-skills) — consumes this artifact per-asset; `evaluate-shortform` (research-skills) — scores published posts cycle-N against this catalog.

**Re-run triggers:**
- Trend signals >30d old (warn — refresh recommended; brief skill soft-blocks downstream)
- Platform mechanics >180d old (warn — refresh recommended)
- Topic pivot, market change, or audience pivot

**Skill deference:**
- No audience context yet → `research-icp` first (soft — runs without it but flags `NEEDS_CONTEXT` in Audience Fit)
- Competitive landscape (not platform patterns) → `research-market`
- Per-asset brief (not catalog) → `brief-shortform`
