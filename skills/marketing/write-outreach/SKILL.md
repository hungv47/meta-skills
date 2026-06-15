---
name: write-outreach
description: "Writes and evaluates cold outreach — email, LinkedIn, Twitter/X, iMessage/SMS, platform proposals — with signal-based personalization, channel-specific craft, and rubric scoring. Handles first-touch compose and reply-to-inbound modes. Use to draft or critique an individual outbound message. Not for campaign orchestration or sequence design (use plan-campaign), landing-page or headline copy (use write-copy), paid-ad copy (use write-ad), or sourcing/list-building. Brand voice: see create-brand."
argument-hint: "[target/signal + channel + mode, or reply text to respond to]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.2.0"
  budget: deep
  estimated-cost: "$1-3"
---

# Write Outreach — Orchestrator

*Communication — Horizontal. Ready-to-send outbound across email, LinkedIn, Twitter/X, platform proposals. Multi-agent strategy → draft → voice → critic → humanmaxxing pipeline.*

**Core Question:** "If I removed the personalization, would this email still make sense? If yes, the personalization isn't working."

> Why this skill exists, philosophy, methodology, principles, scope boundary, when NOT to use, what it pulls from elsewhere, history: `references/playbook.md` [PLAYBOOK].

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
- [ ] **Specificity** ≥ 6 — concrete proof (number, named outcome, named company); no "leading provider" / "trusted by many". Every proof line also passes the **competitor swap test** — if a rival vendor could send it truthfully, it's generic; independent auto-fail. Procedure: [`references/_shared/copy-validation-rubric.md`](references/_shared/copy-validation-rubric.md) (shared across the write-\* skills).

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
| `docs/forsvn/artifacts/marketing/campaign-plan.md` | plan-campaign | Optional — if outbound is part of a broader campaign (Route C) |
| `docs/forsvn/experience/product.md` | (any skill) | Optional — `Product — proof points` key if user previously persisted |

## Pre-Dispatch

Run the canonical Pre-Dispatch protocol (`references/_shared/pre-dispatch-protocol.md` [PROCEDURE]).

**Needed dimensions:** mode (services-sell / saas-sell / partnership-sell / community-sell), channel (email / LinkedIn / Twitter DM / other), target (name + role + company), trigger (specific signal + strength 1-5), desired outcome (reply / call / resource open / connection accept), bridge (problem we solve that connects to trigger), proof (case studies + logos + metrics + testimonials).

**Framework selector (strategist hook).** From recipient *seniority* + decision *profile* (data-driven / emotional / brevity-obsessed) + relationship *warmth*, the strategist shortlists the top 2-3 body frameworks (PAS, AIDA, QVC, BAB, PASTOR, …) + a one-line reason, then commits to one. Library (structure + best-for + worked example per framework) + the selector decision table: [`references/frameworks/cold-email-frameworks.md`](references/frameworks/cold-email-frameworks.md). Distinct from `structures.md` (which picks message *shape* from signal strength); the two compose.

Full read-order + Warm/Cold Start prompts (7-question Cold Start) + Missing-Input Hard Blocks + Pre-Writing Assembly + write-back map + `--fast` behavior: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md) [PROCEDURE].

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — this skill is `budget: deep`; `--fast` flag collapses Layer 1b parallel (strategist + proof-selector) to sequential and skips the post-humanmaxxing Specificity regression check. **`--fast` does NOT skip Cold Start, Critical Gates 1-5, or Missing-Input Hard Blocks** (per marketing-skills CLAUDE.md "Safety gates supersede `--fast`").
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

---

## Agent Manifest

8 sub-agents across two layers (1a solo + 1b parallel + Layer 2 sequential + reply-route variants). Full table with per-agent focus, inputs, layer placement, and shared-reference loads: [`references/agent-manifest.md`](references/agent-manifest.md) [PROCEDURE]. Shared craft catalogs: `references/channels/`, `references/modes/`, `references/frameworks/`, `references/anti-patterns.md`, `references/proof-types.md`.

## Routing + Dispatch

Three routes — Route A (compose: first-touch or follow-up), Route B (reply handling), Route C (called by another skill). Full pseudocode (Layer 1a SOLO → 1b parallel → MERGE → Layer 2 sequential → critic gate + rewrite loop → terminal humanmaxxing + Specificity regression), spawn mechanics, single-agent fallback, chain position, skill deference: [`references/procedures/dispatch-mechanics.md`](references/procedures/dispatch-mechanics.md) [PROCEDURE]. Load at Layer 1a dispatch entry.

---

## Artifact Contract

- **Paths:** `docs/forsvn/artifacts/marketing/write-outreach/[slug].md` (final draft), `[slug].rationale.md` (angle + framework + CTA logic), `[slug].critic-score.md` (5-dim scorecard)
- **Lifecycle:** `pipeline` — overwrite on re-run for same (target, channel, touch); increment touch suffix in slug for new touches in a multi-touch sequence
- **Frontmatter fields:** `skill`, `version`, `date`, `status`, `channel`, `mode`, `touch`, `route`, `critic_total`
- **Consumed by:** human reader (Route A/B), `plan-campaign` (Route C — reads `critic_total`, `touch`, `route`, `mode`, `channel`, `status` for sequencing next touches)
- **Cross-stack contract:** schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" — never silently drift

Full template + per-field format rules (slug derivation, channel/mode/touch/route field values, critic_total format, re-run convention) live in [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

Slug grammar: `<target>-<company>-<channel>-t<N>[-suffix]` (e.g., `jane-acme-email-t1`). Full artifact template (channel/mode/touch enums, critic_total format, slug derivation rules): [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].

---

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — ~50 banned phrases (zero-tolerance) + reply killers + 9 orchestrator anti-patterns + 4 cross-cutting marketing-stack rows. Re-read before any output ships.

---

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


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

End-to-end Route A + FAIL-handling cycle-2 + voice-auditor BLOCKED + Route B (reply) snippet: [`references/examples/write-outreach-walkthrough.md`](references/examples/write-outreach-walkthrough.md) [EXAMPLE].

## References

- `references/playbook.md`, `format-conventions.md`, `anti-patterns.md`, `proof-types.md`
- `references/procedures/{pre-dispatch, dispatch-mechanics}.md`
- `references/_shared/{before-starting-check, mode-resolver, pre-dispatch-protocol, marketing-foundations}.md`
- Domain catalogs (loaded by agents at dispatch): `references/channels/`, `references/modes/`, `references/frameworks/`
- 8 sub-agents in `agents/`; `critic.md` holds the canonical 5-dimension rubric
