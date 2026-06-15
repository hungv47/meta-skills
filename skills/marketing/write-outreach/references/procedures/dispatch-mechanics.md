---
title: Cold Outreach — Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: cold-outreach
load_class: PROCEDURE
---

# Dispatch Mechanics

**Load when:** Layer 1a (signal-analyst solo) or Layer 1b (strategist + proof-selector parallel) or Layer 2 (composer → voice-auditor → critic sequential) dispatch begins, OR Reply Route Layer 1 (reply-classifier) begins. Mechanics for spawning sub-agents per the orchestrator's Agent Manifest + Routes A/B/C.

---

## How to spawn a sub-agent

Use the **Agent tool** (general-purpose or Explore) with a prompt built as:

1. **Read** the agent instruction file (e.g., `agents/strategist.md`) — include FULL content in the Agent prompt
2. **Append** pre-writing context + any prior layer's output
3. **Resolve paths to absolute** — rooted at this skill's directory. Example: `references/channels/email.md` → `<skill-root>/references/channels/email.md` (`<skill-root>` = install path, typically `<skill-root>/`). Tell the agent which references to read.
4. **Pass upstream artifacts by content, not path** — orchestrator reads `research/*.md` and `docs/forsvn/artifacts/marketing/*.md` FIRST, includes excerpts (VoC quotes, voice adjectives, pain language) in pre-writing. Sub-agents do NOT read artifact files directly.
5. If **feedback** exists (critic FAIL), append at end with header "## Critic Feedback — Address Every Point"

## Single-agent fallback

If multi-agent dispatch unavailable, run each agent's instructions sequentially in-context:
- Layer 1: signal-analyst, strategist, proof-selector one at a time (independent)
- Layer 2: composer → voice-auditor → critic in order
- Terminal humanmaxxing: apply humanmaxxing instructions in-context if skill unreachable

Quality is equivalent — multi-agent optimizes parallelism and focus, not capability.

---

## Route A — Compose (First-Touch or Follow-Up)

**When:** Outbound message — first touch, follow-up touch 2/3/4+, or cold DM on any channel.

```
1. Pre-dispatch: Gather context (per procedures/pre-dispatch.md)
   - Mode or channel missing → ask (AskUserQuestion)
   - Target + signal both missing → ask; if only signal missing and strong persona exists → proceed with weak-signal flag
   - Slug ends `-t2`/`-t3`/etc. OR user says follow-up → require prior_touches verbatim; BLOCK if missing (composer needs them to avoid angle repetition)
2. LAYER 1a — signal-analyst SOLO (must complete before 1b):
   - rates signal strength (1-5), drafts observation line
3. LAYER 1b — PARALLEL (both receive `signal_strength` from 1a):
   - strategist (framework + angle + CTA shape)
   - proof-selector (strongest proof from available_proof[])
4. MERGE: assemble Layer 1 outputs into a strategy brief
5. LAYER 2 — SEQUENTIAL:
   - composer (strategy brief + channel ref + mode ref)
   - voice-auditor (composer output)
   - critic (voice-audited draft + pre_writing verbatim, applies rubric)
6. Critic FAIL → re-dispatch FULL Layer 2 chain (composer → voice-auditor → critic) with feedback to composer (max 2 cycles). Never feed critic a raw composer draft without voice-auditor between.
6a. **Voice-auditor BLOCKED (separate from critic FAIL cycles):**
   - Returns `[BLOCKED: composer needs concrete proof ...]` → do NOT consume a critic rewrite cycle.
   - Re-dispatch composer with the block reason as feedback.
   - If the block names a proof gap, re-dispatch proof-selector in parallel with "need stronger proof" so composer has a better pool.
   - Same BLOCKED reason repeats on second pass → escalate as `NEEDS_CONTEXT` (name what's missing — usually a concrete client + number).
7. TERMINAL: invoke `humanmaxxing` with `content-type: "short-outbound"` + channel
8. POST-HUMANMAXXING REGRESSION: re-run critic's Specificity dim only. Drops ≥2 OR any named entity/number absent post-humanmaxxing → revert to critic-approved draft.
9. Write artifacts to `docs/forsvn/artifacts/marketing/write-outreach/[slug].md` (+ .rationale.md + .critic-score.md)
10. Deliver message + rationale inline; show scorecard only if user asks or any dim scored 6-7
```

## Route B — Reply Handling

**When:** User pastes an inbound reply and asks for a response.

```
1. Pre-dispatch: read reply text; confirm channel + mode
2. LAYER 1 — reply-classifier (types reply, extracts subtext)
3. LAYER 2 — SEQUENTIAL:
   - reply-composer (drafts per classification + next-touch logic)
   - voice-auditor (peer-voice pass)
   - critic (reply-specific rubric — see Reply Route Agent Flow below)
4. Critic FAIL → re-dispatch FULL Layer 2 (reply-composer → voice-auditor → critic) with feedback (max 2 cycles)
5. TERMINAL: `humanmaxxing` with `content-type: "short-outbound"`
6. POST-HUMANMAXXING REGRESSION (same as Route A step 8)
7. Write artifacts; deliver inline
```

## Route C — Called by Another Skill

**When:** Invoked by `plan-campaign` for outbound touches in a broader campaign.

```
1. Pre-dispatch: read campaign context from calling skill's artifact
2. Execute Route A per touch requested
3. Return annotated message + rationale to calling skill
```

---

## Layer 1: Two-Stage Strategy Dispatch (Compose Route)

Signal-analyst runs SOLO first — strategist's framework selection and proof-selector's tie-breaking both consume its `signal_strength`. Parallel would force guessing.

### Layer 1a — Signal-analyst solo

| Agent | Instruction File | Pass These Inputs | Reference Files to Resolve |
|-------|-----------------|-------------------|---------------------------|
| Signal Analyst | `agents/signal-analyst.md` | pre-writing (esp. Q2 trigger) | `references/frameworks/personalization-signals.md` |

Wait for output. Extract `signal_strength` (1-5) before proceeding.

### Layer 1b — Strategist + Proof-Selector IN PARALLEL

Spawn both in a single message (multiple Agent tool calls).

| Agent | Instruction File | Pass These Inputs | Reference Files to Resolve |
|-------|-----------------|-------------------|---------------------------|
| Strategist | `agents/strategist.md` | pre-writing (all) + channel + mode + `signal_strength` from 1a | `references/frameworks/structures.md`, `references/frameworks/ctas.md`, `references/frameworks/saraev-four-step.md`, `references/modes/{mode}.md` |
| Proof Selector | `agents/proof-selector.md` | pre-writing (esp. Q5 `available_proof[]`) + `signal_strength` from 1a | `references/proof-types.md` |

**For Reply Route:** Spawn only `reply-classifier` in Layer 1 (no 1a/1b split needed).

---

## Merge Step (Compose Route)

After all Layer 1 agents return, assemble a **strategy brief** for the composer:

```markdown
# Strategy Brief

## Target
[From pre-writing Q1]

## Signal (from signal-analyst)
- Strength: [1-5]
- Observation line (draft): [text]
- Notes: [weak/strong/specific/generic flags]

## Framework (from strategist)
- Structure: [e.g., Observation → Problem → Proof → Ask]
- Angle: [one sentence]
- CTA shape: [e.g., low-friction interest question, resource offer, 15-min intro]
- Subject line angle (email only): [direction, not final text]

## Proof (from proof-selector)
- Primary: [named case study / logo + metric / specific claim]
- Backup: [fallback if primary doesn't fit length]

## Channel Rules
[Resolved from references/channels/{channel}.md — length targets, structure constraints]

## Mode Defaults
[Resolved from references/modes/{mode}.md — CTA vocabulary, proof shape, offer framing]

## Prior Touches (if any)
[Verbatim prior messages — composer must avoid repeating angles/phrasing]
```

Merge is deterministic — no creative synthesis. If any Layer 1 agent returned BLOCKED, halt and surface to user.

---

## Layer 2: Sequential Refinement (Compose Route)

Agents run in order. Each receives the prior agent's output.

| Order | Agent | Instruction File | Input | Reference Files |
|-------|-------|-----------------|-------|-----------------|
| 1 | Composer | `agents/composer.md` | Strategy brief | `references/channels/{channel}.md`, `references/modes/{mode}.md` |
| 2 | Voice Auditor | `agents/voice-auditor.md` | Composer draft | `references/anti-patterns.md` |
| 3 | Critic | `agents/critic.md` | Voice-audited draft + `pre_writing` verbatim (ground truth for signal-fabrication check) | `references/anti-patterns.md` (banned-phrase source for auto-fail conditions) |

### Critic Gate

Critic returns:
- **PASS** — scorecard → proceed to terminal humanmaxxing
- **FAIL** — scorecard + rewrite feedback → re-dispatch composer (cycle 1 or 2)

After 2 failed cycles, surface: "Critic couldn't reach threshold — here's the best draft + scorecard + what's blocking. Your call."

---

## Terminal Pass: Humanmaxxing

After critic PASS, invoke `humanmaxxing` on the final draft:

1. Spawn agent with humanmaxxing's `SKILL.md` content
2. Pass:
   - Final message text
   - `content-type: "short-outbound"` (humanmaxxing's Content Type Calibration row: Light strip, Full voice, 0-10% compression — short outbound differs from marketing copy because further compression kills specificity)
   - Channel
   - `protected_tokens`: every named entity + number in the critic-approved draft (humanmaxxing must not remove or paraphrase)
3. Receive humanmaxxed output
4. **Regression check (automatic, not judgment):** re-run critic's **Specificity dimension only**. Revert to critic-approved draft if any of:
   - Specificity drops ≥ 2 points
   - Any named entity pre-humanmaxxing absent post-humanmaxxing
   - Any concrete number pre-humanmaxxing absent post-humanmaxxing
5. Otherwise ship humanmaxxed version.

Terminal pass is **automatic**, not opt-in. AI-sounding cold email is the biggest failure mode. Regression check protects against humanmaxxing silently stripping the specificity anchor.

---

## Reply Route Agent Flow

```
1. reply-classifier classifies inbound: not-interested / no-budget / send-info / wrong-person / curious / qualified / later / hostile / ambiguous
2. reply-composer drafts per classification + next-touch logic (uses references/frameworks/objections.md)
3. voice-auditor (same as compose route)
4. critic (reply-specific rubric — 5 dimensions, same total-≥35 AND per-dim-≥6 gate)
5. Terminal humanmaxxing + specificity regression check (same as Route A)
```

Reply-specific rubric (5 dims, two substitutions):
- "Signal connection" → **Tone match** — does the reply match their register (defensive → calm, curious → substantive, qualified → concrete)?
- "CTA friction" → **Next step clarity** — is the next action obvious without being pushy?
- Peer voice, You > me ratio, Specificity unchanged.
- **Hard gate (not scored):** never argue with a "no". Breakup mode is default for firm not-interesteds. Critic auto-fails any reply that re-pitches after clear rejection, regardless of dim scores.

---

## Chain Position

Horizontal — runs standalone or called by `plan-campaign` when outbound is part of a broader mix.

**Re-run triggers:** ICP changes materially, new trigger signal appears for same prospect, prior sequence got no reply and angle needs refresh.

### Skill Deference

- **LP headline / tagline / ad CTA?** → `write-copy` (writing craft, not outbound)
- **Multi-channel campaign across paid/owned/earned?** → `plan-campaign` first, then this skill for the touches
- **No persona, or ICP stale (>30d)?** → `research-icp` first
- **Sequence underperforming, need diagnosis?** → Not this skill (future `outbound-diagnose`)
- **Lifecycle / nurture / drip?** → NOT this skill. Those are warm, consent-based, different craft.
