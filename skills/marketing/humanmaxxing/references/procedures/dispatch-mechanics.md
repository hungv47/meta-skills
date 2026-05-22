---
title: Humanmaxxing — Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: humanmaxxing
load_class: PROCEDURE
---

# Dispatch Mechanics

**Load when:** Layer 1 (pattern-scanner + voice-extractor parallel) or Layer 2 (strip → soul-injection → compression → critic sequential) dispatch begins. Mechanics for spawning sub-agents per the orchestrator's Agent Manifest + Routes A/B/C.

---

## How to spawn a sub-agent

For each agent dispatched, use the **Agent tool** with a prompt built as follows:

1. **Read** the agent instruction file (e.g., `agents/pattern-scanner-agent.md`) — include FULL content in the Agent prompt
2. **Append** the brief and Pre-Writing context after the instructions
3. **Resolve file paths to absolute** — replace relative paths with absolute paths rooted at this skill's directory. Example: `references/ai-patterns.md` becomes `/Users/you/skills/humanmaxxing/references/ai-patterns.md`. Tell the agent: "Read the reference file at [absolute path] for domain knowledge."
4. **Pass upstream artifacts by content, not path** — orchestrator reads `research/product-context.md` FIRST, then includes relevant excerpts (voice adjectives, audience register) in the pre-writing object. Sub-agents do NOT read artifact files directly — orchestrator curates what they need.
5. If **feedback** exists (from a critic FAIL cycle), append it at end with header "## Critic Feedback — Address Every Point"

## Single-agent fallback

If multi-agent dispatch is unavailable (no Agent tool, single-agent runtime, or context constraints), execute the pipeline in-context:

1. **Layer 1:** Run pattern-scanner-agent's detection logic on the text. Then run voice-extractor-agent's profile logic.
2. **Layer 2:** Apply strip-agent's fixes, then soul-injection-agent's voice techniques, then compression-agent's rules.
3. **Critic:** Self-evaluate using critic-agent's three-pass rubric and quality gate.

Output quality should be equivalent — multi-agent pattern optimizes for parallelism and focus, not capability.

---

## Route A — Quick Humanmax (short text)

**When:** Text is under 200 words. Voice injection and compression have limited impact on short content.

```
1. Pre-Dispatch (per procedures/pre-dispatch.md)
2. LAYER 1 — Dispatch ONE agent:
   - pattern-scanner-agent (voice-extractor skipped — short text)
3. LAYER 2 — Dispatch SEQUENTIALLY:
   - strip-agent (receives pattern-scanner output + original text)
   - critic-agent (receives strip-agent output — skip soul-injection + compression)
4. If critic returns FAIL → re-dispatch strip-agent with feedback (max 2 cycles)
5. Deliver artifact
```

**Note:** Route A skips voice-extractor, soul-injection, and compression agents. For texts under 200 words, pattern removal is the primary value. If the user requests voice injection on short text, upgrade to Route B.

## Route B — Full Humanmax

**When:** Text is 200+ words and needs the full treatment (pattern removal + voice + compression).

```
1. Pre-Dispatch (per procedures/pre-dispatch.md)
2. LAYER 1 — Dispatch IN PARALLEL:
   - pattern-scanner-agent
   - voice-extractor-agent
3. Present diagnosis to user: Show pattern counts, top 3 patterns, compression estimate.
   Ask: "Proceed with all fixes, or review the flagged patterns first?"
4. LAYER 2 — Dispatch SEQUENTIALLY:
   - strip-agent (receives pattern-scanner output + original text)
   - soul-injection-agent (receives strip-agent output + voice-extractor profile)
   - compression-agent (receives soul-injection output)
   - critic-agent (receives compression output)
5. If critic returns FAIL → re-dispatch named agent(s) with feedback (max 2 cycles)
6. Deliver final artifact
7. For high-stakes public content or prior AI-detection failures: run Detector-Resistance Verification (below)
```

## Route C — Called by Another Skill

**When:** Invoked by `write-copy`, `brief-landing-page`, `write-ad`, `write-outreach`, `create-brand`, `brief-graphic`, `plan-campaign`, `brief-shortform`, or another marketing-skill for inline humanization.

```
1. Pre-Dispatch: Read context from calling skill's artifacts (voice, content type, protected_tokens, detector_mode)
2. If content already passed copywriting's Seven-Sweeps:
   - Skip pattern-scanner (patterns already cleaned)
   - Dispatch compression-agent (receives the text directly)
   - Dispatch critic-agent
3. Otherwise: Follow Route B (full pipeline) — but no user checkpoint (calling skill is the user proxy)
4. Return humanmaxxed output to the calling skill (no standalone artifact file written by humanmaxxing in Route C — calling skill embeds polished text in its own artifact)
5. Run protected-token regression if the caller passed `protected_tokens` (see Detector-Resistance Verification)
```

---

## Layer 1: Parallel Diagnosis (Route B + Route C full)

Spawn the following agents **IN PARALLEL** (multiple Agent tool calls in one message). For each agent, follow the Dispatch Protocol above.

| Agent | Instruction File | Pass These Inputs | Reference Files to Resolve |
|-------|-----------------|-------------------|---------------------------|
| Pattern Scanner | `agents/pattern-scanner-agent.md` | brief (the text to humanmax) + pre-writing (content type) | `references/ai-patterns.md` |
| Voice Extractor | `agents/voice-extractor-agent.md` | brief (the text to assess) + pre-writing (voice adjectives, audience) | `references/voice-injection.md`, `references/detector-resistance.md` |

After both agents return, **present the diagnosis to the user** before proceeding to Layer 2 (Route B only; Route C skips user checkpoint):

- Show Hard Tell count vs. Soft Tell count
- Show top 3 most impactful patterns with examples from their text
- Show estimated compression potential
- Show voice register assessment and gap

Ask: **"Proceed with all fixes, or review the flagged patterns first?"**

If the user wants to review, walk through each flagged pattern and confirm which to fix vs keep. Pass the user's decisions to strip-agent as part of the pre-writing context.

---

## Layer 2: Sequential Pipeline (Route B + Route C full)

Dispatch these agents **ONE AT A TIME, IN ORDER**. Each receives the previous agent's full output as the `upstream` field.

```
strip-agent → soul-injection-agent → compression-agent → critic-agent
```

| Step | Agent | Instruction File | Receives |
|------|-------|-----------------|----------|
| 1 | Strip Agent | `agents/strip-agent.md` | Pattern-scanner output (upstream) + original text (brief) + user-approved keeps (pre-writing) |
| 2 | Soul Injection | `agents/soul-injection-agent.md` | Strip-agent output (upstream) + voice-extractor profile (pre-writing) |
| 3 | Compression | `agents/compression-agent.md` | Soul-injection output (upstream) + content type targets (pre-writing) |
| 4 | Critic | `agents/critic-agent.md` | Compression output (upstream) + original text for comparison (brief) |

Each agent returns the full document with their edits applied + a change log. The orchestrator passes the complete output (text + log) to the next agent.

---

## Critic Gate

The critic agent returns one of two verdicts:

### PASS

Text meets all quality standards. Score 35/50 or above. Zero Absolute Prohibition violations. If detector mode is enabled, proceed to Detector-Resistance Verification before delivery.

### FAIL

Critic returns specific failures with:
- Which text failed and on which dimension (Directness / Rhythm / Trust / Authenticity / Density)
- Specific fix instructions
- Which agent to re-dispatch

**Rewrite loop:**

1. Read critic's failure report
2. Re-dispatch ONLY the named agent(s) with critic's feedback attached as the `feedback` input
3. Run the modified output back through the critic
4. **Maximum 2 rewrite cycles.** After 2 failures, deliver the text with critic's annotations and flag to the user: "Text scored [X]/50 — manual review recommended on [specific issues]." Status: `DONE_WITH_CONCERNS`.

## Detector-Resistance Verification

Read `references/detector-resistance.md` before running this step.

Run when `detector_mode != none`:

1. **Protected-token regression:** compare final text against `protected_tokens`. Any missing named entity, number, URL, or proof point is a FAIL; re-dispatch the responsible agent with the missing token list.
2. **External detector if available:** if the operator configured Pangram or an equivalent detector, run it and record the score/status. If not available, do not invent a score.
3. **Proxy checklist:** evaluate argument shape, specificity source, register variance, semantic compression, and human imperfection.
4. **Failure handling:** if external detector or proxy fails, re-dispatch `soul-injection-agent` for structural variance and specificity repair, then `compression-agent`, then `critic-agent`. Max 2 cycles total.
5. **After 2 failures:** deliver as `DONE_WITH_CONCERNS` with detector/proxy notes and the preserved-token result.

## Chain Position

Horizontal — works on output from any skill. If content passed the `write-copy` skill, humanmaxxing focuses on compression + residual patterns. For external or AI-generated content, full pipeline applies.

humanmaxxing is the polish-chain endpoint for English; it does NOT route back to any other skill (no `defers-to` chain after polish), sibling to `polish-vn` for Vietnamese.

**Typical upstream callers (Route C):** `write-copy`, `write-ad`, `write-outreach`, `brief-landing-page`, `create-brand`, `brief-graphic`, `plan-campaign`, `brief-shortform` — any marketing-skill that produces EN prose and auto-routes to humanmaxxing for AI-pattern cleanup.

**Typical upstream callers (Route A/B):** external content (AI-generated drafts, MT output, non-native EN writers), manually piped through humanmaxxing via slash command.

**Re-run triggers:**

- Brand voice adjectives change in `product-context.md` or `BRAND.md`
- Upstream copy consistently triggers AI detection
- Voice injection guidance updated in `voice-injection.md`
- Detector classifier threshold changes (operator policy update)

**Skill deference:**

- Need new copy from scratch → `write-copy` (humanmaxxing cleans existing content, not creates new)
- Conversion-focused landing page → `brief-landing-page` (page architecture, not text polish)
- Vietnamese source text → `polish-vn` (sibling polish-chain for VN; humanmaxxing is EN-only)
- Content already passed copywriting's Seven-Sweeps → Route C path (skip pattern-scanner)
