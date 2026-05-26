# Humanmaxxing Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Pattern Scanner | 1 (parallel) | `agents/pattern-scanner-agent.md` | Runs all 47 AI patterns, logs violations by category, estimates compression potential. |
| Voice Extractor | 1 (parallel) | `agents/voice-extractor-agent.md` | Reads voice adjectives, assesses register, identifies injection opportunities. |
| Strip Agent | 2 (sequential) | `agents/strip-agent.md` | Surgical removal of flagged AI patterns — **subtract only, no style changes**. |
| Soul Injection | 2 (sequential) | `agents/soul-injection-agent.md` | Applies brand voice — rhythm, specificity, experience markers. |
| Compression | 2 (sequential) | `agents/compression-agent.md` | Systematic 15-30% compression at sentence, paragraph, section levels. |
| Critic | 2 (final) | `agents/critic-agent.md` | Three-pass audit, 5-dimension scoring, PASS/FAIL with re-dispatch routing. |

## Routes

```
ROUTE A (text < 200 words):
  1. Pre-Dispatch
  2. LAYER 1: pattern-scanner-agent only (voice-extractor skipped)
  3. LAYER 2: strip-agent → critic-agent (soul-injection + compression skipped)
  4. Critic FAIL → re-dispatch strip-agent (max 2 cycles)
  5. Deliver artifact

ROUTE B (text ≥ 200 words):
  1. Pre-Dispatch
  2. LAYER 1 IN PARALLEL: pattern-scanner + voice-extractor
  3. User checkpoint: present diagnosis, confirm proceed
  4. LAYER 2 SEQUENTIAL: strip → soul-injection → compression → critic
  5. Critic FAIL → re-dispatch named agent(s) (max 2 cycles)
  6. Detector-Resistance Verification (if detector_mode != none)
  7. Deliver artifact

ROUTE C (called by another skill):
  1. Pre-Dispatch: trust caller's pre-resolved voice + content_type + protected_tokens + detector_mode
  2. If content already passed write-copy's Seven-Sweeps: skip pattern-scanner, dispatch compression + critic only
  3. Otherwise: Layer 1 (no user checkpoint) → Layer 2
  4. Return polished text + metadata to calling skill (no standalone artifact)
  5. Run protected-token regression if `protected_tokens` was passed
```

**Strip always comes BEFORE soul-injection.** Voice injection without stripping first = polishing AI-generated prose (Critical Gate 3).

## Absolute Prohibitions (zero tolerance — see SKILL.md Critical Gates)

Strip-agent + critic-agent both enforce. Single instance ruins credibility:

1. No em dashes (`—`). Every em dash → comma, period, or parentheses.
2. No "it's not just X, it's Y" or variants.
3. No rhetorical questions as hooks.
4. No colons in marketing/blog prose.
5. No "actually" as emphasis.
6. No filler context phrases ("in today's …", "in the competitive business environment").
7. No emojis (any content type).
8. No unsourced `47` or `73` (known LLM number biases).
9. No staccato taglines ("Your X, Y'd" / "X. Y.").

## Content Type Calibration

Strip intensity + compression target + register vary by content type. Full table:

| Content Type | Strip | Voice | Compression | Register |
|---|---|---|---|---|
| Landing-page section | Full (47) | Full brand | 25-40% | brand voice, scannable |
| Ad | Light (telltales) | Full brand | 10-20% | punchy brand |
| Blog / thought leadership | Full | Moderate author | 15-25% | author voice, professional |
| Founder post | Moderate | Full founder | 15-25% | first-person, imperfection-light |
| Forum comment | Light (Hard Tells) | Full first-person | 0-10% | casual, imperfection ON |
| Cold DM (`content-type: short-outbound`) | Light | Full sender | 0-10% | professional-conversational |
| Internal memo | Moderate | Light conversational | 30-50% | plain, imperfection-light |
| Documentation / technical | Light (clarity only) | Minimal | 10-15% | neutral, accuracy-first |

**Key principle:** the further from marketing, the lighter the touch. Documentation that sounds like a blog post is worse than documentation with a few AI tells. Short outbound carries `protected_tokens` from the caller — named entities + numbers must appear verbatim.

Full per-type profile (rhythm, person, what to encourage/avoid, imperfection posture) + thresholds + types not listed: [`human-writing-stylebook.md`](human-writing-stylebook.md) § Content-type register profiles.

## Detector resistance

Set `detector_mode: pangram` if `PANGRAM_API_KEY` or operator-configured detector command exists; apply threshold table in [`detector-resistance.md`](detector-resistance.md); record actual result + threshold. If only proxy available, set `detector_mode: proxy`; run proxy checklist; record `proxy_pass` / `proxy_fail`. `not_run` only for explicitly disabled or low-stakes internal material.

Default thresholds:

- Public marketing / thought-leadership: `human_probability >= 0.95` or `ai_probability <= 0.05`.
- Admissions / applications / compliance-sensitive / reputation-sensitive (real classifier available): `human_probability >= 0.99` or `ai_probability <= 0.01`.
- Policy-capped environments: operator's stricter threshold, record the claimed false-positive cap; do not claim compliance from proxy-only.

Full mechanics + protected-token regression + chain-position notes + skill-deference rules: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
