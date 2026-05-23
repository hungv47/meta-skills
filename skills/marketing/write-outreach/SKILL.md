---
name: write-outreach
description: "Writes and evaluates cold outreach — email, LinkedIn, Twitter/X, iMessage/SMS, platform proposals — with signal-based personalization, channel-specific craft, and rubric scoring. Handles first-touch compose and reply-to-inbound modes. Use to draft or critique an individual outbound message. Not for campaign orchestration or sequence design (use plan-campaign), landing-page or headline copy (use write-copy), paid-ad copy (use write-ad), or sourcing/list-building. Brand voice: see create-brand."
argument-hint: "[target/signal + channel + mode, or reply text to respond to]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$1-3"
---

# Write Outreach — Orchestrator

*Communication — Horizontal. Ready-to-send outbound across email, LinkedIn, Twitter/X, platform proposals. Multi-agent strategy → draft → voice → critic → humanmaxxing pipeline.*

**Core Question:** "If I removed the personalization, would this email still make sense? If yes, the personalization isn't working."

> Why this skill exists, philosophy, methodology, principles, scope boundary, when NOT to use, what it pulls from elsewhere, history: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].

## Critical Gates — Read First

1. **Mode + channel + target + proof are non-negotiable.** Missing-Input Hard Blocks fire (BLOCK) when any of these are absent and not resolvable from artifacts. Signal can be missing with weak-signal flag; prior_touches required for touch 2+.
2. **One ask per message, low-friction in touch 1.** "Quick 30-minute call?" in touch 1 is too expensive for zero trust. Default to interest-question CTAs.
3. **You > me ratio enforced structurally.** First sentence (after salutation) does NOT start with "I" or "My." you/your-count must exceed I/we/our-count. Critic auto-fail when violated.
4. **Humanmaxxing runs ONCE as terminal pass with protected_tokens.** Running humanmaxxing twice strips specificity. Post-humanmaxxing Specificity regression check is **automatic, not judgment** — drops ≥2 or named entity/number absent → revert to critic-approved draft.
5. **Never argue with a "no" in reply route.** Breakup mode is default for firm not-interesteds. Critic auto-fails any reply that re-pitches after clear rejection, regardless of dim scores.

## Quality Gate

Before delivering, the **critic agent** verifies (5 dimensions, 0-10 each):

- [ ] **Peer voice** ≥ 6 — sharp human, no vendor-speak ("leverage", "synergy", "best-in-class", "I hope this finds you well")
- [ ] **Signal connection** ≥ 6 — personalization connects to the ask; remove-the-opener test passes (email shouldn't still make sense without it)
- [ ] **CTA friction** ≥ 6 — one ask, low-friction; no "30-min call" in first touch
- [ ] **You > me ratio** ≥ 6 — "you/your" dominates "I/we/our"; reader's world, not yours
- [ ] **Specificity** ≥ 6 — concrete proof (number, named outcome, named company); no "leading provider" / "trusted by many"

**Gate:** Total ≥ 35/50 **AND every dim ≥ 6**. Total 35-39 with all dims ≥ 6 = PASS as `DONE_WITH_CONCERNS`. Any dim < 6 = FAIL regardless of total.

Below threshold → full Layer 2 chain (composer → voice-auditor → critic) re-runs with feedback (max 2 cycles).

After critic PASS, `humanmaxxing` is the terminal pass. Orchestrator then re-runs critic's **Specificity dimension only** on humanmaxxed text — if Specificity drops ≥2 OR any named entity/number present pre-humanmaxxing is absent post-humanmaxxing, revert to critic-approved draft. Protects the specificity anchor the critic just scored.

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PLAYBOOK] — load product-context.md + icp-research.md + campaign-plan.md (if Route C), identify any prior touches for the same target slug, check freshness windows on ICP / product-context (>30d → recommend `research-icp` re-run with soft gate).

| Artifact | Source | Required? |
|---|---|---|
| `research/product-context.md` | research-icp | Recommended — voice adjectives + accuracy constraints + proof points |
| `research/icp-research.md` | research-icp | Recommended — primary persona + VoC pain language |
| `.forsvn/artifacts/mkt/campaign-plan.md` | plan-campaign | Optional — if outbound is part of a broader campaign (Route C) |
| `.forsvn/experience/product.md` | (any skill) | Optional — `Product — proof points` key if user previously persisted |

## Pre-Dispatch

Run the canonical Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]).

**Needed dimensions:** mode (services-sell / saas-sell / partnership-sell / community-sell), channel (email / LinkedIn / Twitter DM / other), target (name + role + company), trigger (specific signal + strength 1-5), desired outcome (reply / call / resource open / connection accept), bridge (problem we solve that connects to trigger), proof (case studies + logos + metrics + testimonials).

Full read-order + Warm/Cold Start prompts (7-question Cold Start) + Missing-Input Hard Blocks + Pre-Writing Assembly + write-back map + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — this skill is `budget: deep`; `--fast` flag collapses Layer 1b parallel (strategist + proof-selector) to sequential and skips the post-humanmaxxing Specificity regression check. **`--fast` does NOT skip Cold Start, Critical Gates 1-5, or Missing-Input Hard Blocks** (per marketing-skills CLAUDE.md "Safety gates supersede `--fast`").

---

## Agent Manifest

| Agent | Layer | File | Focus |
|-------|-------|------|-------|
| Signal Analyst | 1a (solo, first) | `agents/signal-analyst.md` | Rates trigger-signal strength (1-5), drafts the observation line, flags weak/generic signals. Runs FIRST because strategist + proof-selector consume its `signal_strength` score. |
| Strategist | 1b (parallel) | `agents/strategist.md` | Picks framework (O→P→P→A, Q→V→A, Trigger→Insight→Ask, Story→Bridge→Ask, Declared-Need→Relevant-Proof→Specific-Next-Step, No-pitch connection note), angle, CTA shape. Receives `signal_strength` from 1a. |
| Proof Selector | 1b (parallel) | `agents/proof-selector.md` | Picks strongest proof asset from the `available_proof[]` pool: named case study > named logo + metric > specific claim > generic. Receives `signal_strength` from 1a for tie-breaking. |
| Composer | 2 (sequential, post-merge) | `agents/composer.md` | Drafts the message applying channel-specific craft rules (length, structure, subject line, formatting) |
| Voice Auditor | 2 (sequential) | `agents/voice-auditor.md` | Peer-voice audit — strips vendor-speak, enforces contractions, cuts filler, verifies "you > me" |
| Critic | 2 (sequential, gate) | `agents/critic.md` | Rubric scoring across 5 dimensions, PASS/FAIL with rewrite feedback. Reads `references/anti-patterns.md` for banned-phrase auto-fails. |
| Reply Classifier | 1 (reply mode) | `agents/reply-classifier.md` | Types inbound reply: not-interested / no-budget / send-info / wrong-person / curious / qualified / later / hostile / ambiguous |
| Reply Composer | 2 (reply mode) | `agents/reply-composer.md` | Drafts response per classification + next-touch logic |

### Shared References (read by multiple agents)

- **Channel craft** (`references/channels/`): `email.md`, `linkedin.md`, `twitter.md`, `imessage.md`, `platform-proposals.md`
- **Mode defaults** (`references/modes/`): `services.md`, `saas.md`, `partnership.md`, `community.md`
- **Frameworks** (`references/frameworks/`): `structures.md`, `personalization-signals.md`, `ctas.md`, `objections.md`, `saraev-four-step.md`
- **Shared guardrails:** `references/anti-patterns.md` (AI tells, template smell, banned phrases), `references/proof-types.md` (proof hierarchy)

---

## Routing + Dispatch

Three routes — Route A (compose: first-touch or follow-up), Route B (reply handling), Route C (called by another skill).

```
ROUTE A (compose):
  1. Pre-Dispatch (per procedures/pre-dispatch.md)
  2. LAYER 1a — signal-analyst SOLO (must complete before 1b)
  3. LAYER 1b — IN PARALLEL: strategist + proof-selector (both receive signal_strength)
  4. MERGE → strategy brief
  5. LAYER 2 — SEQUENTIAL: composer → voice-auditor → critic
  6. Critic FAIL → re-dispatch FULL Layer 2 chain with feedback (max 2 cycles)
  6a. Voice-auditor BLOCKED on proof gap → re-dispatch composer + parallel proof-selector
  7. TERMINAL: humanmaxxing with content-type "short-outbound" + channel + protected_tokens
  8. POST-HUMANMAXXING REGRESSION: re-run critic's Specificity dim only
  9. Write 3 artifacts ([slug].md + .rationale.md + .critic-score.md)
 10. Deliver message + rationale inline

ROUTE B (reply):
  1. Pre-Dispatch: read reply text; confirm channel + mode
  2. LAYER 1: reply-classifier (types reply)
  3. LAYER 2 SEQUENTIAL: reply-composer → voice-auditor → critic (reply-specific rubric)
  4. Critic FAIL → re-dispatch FULL Layer 2 with feedback (max 2 cycles)
  5. TERMINAL: humanmaxxing + Specificity regression (same as Route A)
  6. Write artifacts; deliver inline

ROUTE C (called by plan-campaign):
  1. Pre-Dispatch: read campaign context from calling skill's artifact
  2. Execute Route A per touch requested
  3. Return annotated message + rationale to calling skill
```

Mechanics (how to spawn agents, single-agent fallback, Layer 1a + 1b two-stage strategy dispatch, Merge Step, Layer 2 sequential pipeline, critic gate + rewrite loop, Terminal humanmaxxing + Specificity regression, Reply Route Agent Flow with rubric substitutions, chain position, skill deference) live in [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1a dispatch entry.

---

## Artifact Contract

- **Paths:** `.forsvn/artifacts/mkt/write-outreach/[slug].md` (final draft), `[slug].rationale.md` (angle + framework + CTA logic), `[slug].critic-score.md` (5-dim scorecard)
- **Lifecycle:** `pipeline` — overwrite on re-run for same (target, channel, touch); increment touch suffix in slug for new touches in a multi-touch sequence
- **Frontmatter fields:** `skill`, `version`, `date`, `status`, `channel`, `mode`, `touch`, `route`, `critic_total`
- **Consumed by:** human reader (Route A/B), `plan-campaign` (Route C — reads `critic_total`, `touch`, `route`, `mode`, `channel`, `status` for sequencing next touches)
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" — never silently drift

Full template + per-field format rules (slug derivation, channel/mode/touch/route field values, critic_total format, re-run convention) live in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

### Artifact Template

Every `[slug].md` carries:

```yaml
---
skill: write-outreach
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
channel: email | linkedin-dm | linkedin-connection | twitter-reply | twitter-dm | imessage | sms | upwork-proposal | other-platform
mode: services-sell | saas-sell | partnership-sell | community-sell
touch: integer | "breakup"   # 1, 2, 3, 4+, or "breakup"
route: compose | reply
critic_total: N/50
---
```

Slug is derived from target + channel (e.g., `jane-acme-email-t1`, `jane-acme-linkedin-dm`, `jane-acme-email-t2-followup`).

---

## Anti-Patterns

Polish-pipeline + orchestrator + cross-cutting references: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any output ships. Banned phrases (~50 zero-tolerance) + reply killers + structural anti-patterns + 9 orchestrator-level rows (template-with-{{FirstName}} swap, "hope this finds you well", "quick 30-min call?" in touch 1, feature dumps, fake Re:/Fwd:, double-humanmaxxing, arguing with "no", skipping ICP artifact, multi-touch without prior-touches) + 4 cross-cutting marketing-stack rows (protected_tokens contract drop, post-humanmaxxing regression disabled, campaign-plan Route C context drop, artifact schema drift).

Most common in practice: banned-phrase residual ("I hope this email finds you well", "leverage"), Specificity Floor violation (1 verifiable specific instead of ≥2), calendar CTA in touch 1, multi-touch without prior_touches.

---

## Completion Status

Every run ends with explicit status:
- **DONE** — passed critic + humanmaxxing, ready-to-send
- **DONE_WITH_CONCERNS** — delivered, flags noted (stale ICP, weak signal, rubric 35-39)
- **BLOCKED** — missing target + ICP, or missing proof + product-context; state what's needed
- **NEEDS_CONTEXT** — recommend `research-icp` or provide prior touches

## Next Step

After receiving the message: send, wait for reply or cadence (7-14 days typical), re-invoke with prior touches for next touch. For reply, use Route B.

---

## Worked Example

End-to-end Route A walkthrough (services-sell email touch 1 to a named CFO target, signal-strength 4, framework's four-step framework, critic PASS cycle 1 at 44/50, terminal humanmaxxing with `protected_tokens=["Ramp","9 days","4 days","Acme"]`, post-humanmaxxing Specificity regression passes) + FAIL-handling cycle-2 variant + voice-auditor BLOCKED path + Route B (reply) snippet: [`references/examples/write-outreach-walkthrough.md`](references/examples/write-outreach-walkthrough.md) [EXAMPLE].

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` [PROCEDURE]
- **Example:** `references/examples/write-outreach-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by agents at dispatch): `references/channels/{email, linkedin, twitter, imessage, platform-proposals}.md`, `references/modes/{services, saas, partnership, community}.md`, `references/frameworks/{structures, personalization-signals, ctas, objections, saraev-four-step}.md`, `references/proof-types.md`
- **Shared:** `references/_shared/{before-starting-check, mode-resolver, pre-dispatch-protocol}.md`
- **Marketing foundations:** `references/_shared/marketing-foundations.md` — canonical 9-channel framework, funnel-stage vocabulary, 3Q content test, CTA formula, VoC principles
- **Agents:** 8 sub-agents in `agents/` — see Agent Manifest above. `critic.md` holds the canonical 5-dimension rubric.
- `marketing-skills/CLAUDE.md` §"Pre-Dispatch Protocol" + §"Complexity Routing" + §"Multi-Agent Skills" — stack-level conventions this skill inherits
