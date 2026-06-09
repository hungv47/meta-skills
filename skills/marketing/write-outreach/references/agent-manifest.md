# Write-Outreach Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Strategist | 1 (solo) | `agents/strategist.md` | Picks angle, channel implications, anchor-proof slot, you/me-balance plan, CTA-friction calibration. Surfaces channel-fit warnings. |
| Composer | 2 (sequential) | `agents/composer.md` | Drafts message body per channel. Applies channel-specific char-cap discipline (X DM, LinkedIn, email subject + body, iMessage, Upwork proposal). |
| Voice Auditor | 2 (sequential) | `agents/voice-auditor.md` | Peer-voice audit — strips vendor-speak ("leverage", "synergy", "best-in-class", "I hope this finds you well"), AI tells, em-dashes, generic "leading provider" language. |
| Critic | 2 (sequential, gate) | `agents/critic.md` | 5-dim rubric (Peer voice / Signal connection / CTA friction / You>me ratio / Specificity). Reply-mode breakup gate. |

After critic PASS, `humanmaxxing` runs as terminal pass with `protected_tokens` (named entities + numbers + URLs). Orchestrator re-runs critic Specificity dim only — drop ≥2 or named entity/number/URL absent post-humanmaxxing → revert to critic-approved draft.

## Routes

### First-touch compose

```
1. Pre-Dispatch (per procedures/pre-dispatch.md) — channel + target + signal + proof
2. LAYER 1 — strategist SOLO (angle + channel-fit warnings + anchor-proof slot)
3. LAYER 2 — SEQUENTIAL: composer → voice-auditor → critic
4. Critic FAIL → re-dispatch FULL Layer 2 chain with feedback (max 2 cycles)
5. TERMINAL: humanmaxxing with protected_tokens (named entities + numbers + URLs)
6. POST-HUMANMAXXING REGRESSION: re-run critic's Specificity dim only
7. Write artifacts ([slug].md + .critic-score.md)
8. Deliver
```

### Touch 2+ (follow-up)

Requires `prior_touches` artifact. Strategist reads prior touch + reply or silence; picks next-step angle (escalate value / shift channel / break-up / interest-question). Same Layer 2 chain.

### Reply-to-inbound

Strategist classifies the inbound (interested / objection / clarifying-question / clear no). **Breakup gate fires on "clear no"** — never argue with a no. Critic auto-fails any reply that re-pitches after clear rejection, regardless of dim scores.

### Route C — called by plan-campaign

Pre-Dispatch reads campaign context from caller's artifact. Execute first-touch or touch 2+ per requested touch number. Return annotated message + critic score to calling skill.

## 5-Dim Critic Rubric

Total ≥35/50 AND every dim ≥6 = PASS. Total 35-39 with all dims ≥6 = `DONE_WITH_CONCERNS`. Any dim <6 = FAIL.

1. **Peer voice** ≥6 — sharp human, no vendor-speak.
2. **Signal connection** ≥6 — personalization connects to the ask; remove-the-opener test passes (message shouldn't still make sense without it).
3. **CTA friction** ≥6 — one ask, low-friction; no "30-min call" in first touch.
4. **You > me ratio** ≥6 — "you/your" dominates "I/we/our"; reader's world, not yours.
5. **Specificity** ≥6 — concrete proof (number, named outcome, named company); no "leading provider" / "trusted by many".

## Pattern Catalogs

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/channels/{email,linkedin,twitter,imessage,upwork,fiverr}.md` | composer, critic | Per-channel format + char caps + native conventions. |
| `references/proof-types.md` | strategist, composer | Anchor-proof slot catalog (number / outcome / named company / research). |
| `references/frameworks/` | strategist | Cold-outreach frameworks — message shape by signal strength (`structures`) + named body arcs (PAS, AIDA, BAB, PASTOR, …) with the seniority/profile/warmth selector (`cold-email-frameworks`). |
| `references/modes/` | orchestrator | Reply / breakup / follow-up mode mechanics. |
| `references/playbook.md` | all | Why, methodology, peer-voice principle, you>me rule. |
| `references/format-conventions.md` | orchestrator (assembly) | Artifact frontmatter + body schema. |
| `references/anti-patterns.md` | critic | Vendor-speak, AI tells, multi-ask, 30-min-call-touch-1, re-pitch-after-no, em-dashes, fabricated stats. |

Full mechanics: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
