---
title: Ad Copy — Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: ad-copy
load_class: PROCEDURE
---

# Dispatch Mechanics

**Load when:** Layer 1 (strategist solo) or Layer 2 (composer → format-checker → voice-auditor → critic sequential) dispatch begins, OR terminal Humanmaxxing per-variant invocation begins. Mechanics for spawning sub-agents per the orchestrator's Agent Manifest + Routes A/B.

---

## How to spawn a sub-agent

Use the **Agent tool** (general-purpose or Explore) with a prompt built as:

1. **Read** the agent instruction file (e.g., `agents/strategist.md`) — include FULL content in the Agent prompt
2. **Append** pre-writing context + any prior layer's output
3. **Resolve paths to absolute** — rooted at this skill's directory. Example: `references/ad-intelligence/meta-retargeting.md` → `<skill-root>/references/ad-intelligence/meta-retargeting.md` (`<skill-root>` = install path, typically `<skill-root>/`).
4. **Pass upstream artifacts by content, not path** — orchestrator reads `research/*.md`, `brand/*.md`, and `docs/forsvn/artifacts/marketing/*.md` FIRST, includes excerpts (VoC quotes, voice adjectives, brand banned-words) in pre-writing. Sub-agents do NOT read artifact files directly.
5. If **feedback** exists (critic FAIL or format-checker REVISION_REQUIRED), append at end with header "## Resolver Feedback — Address Every Point"

## Single-agent fallback

If multi-agent dispatch unavailable, run each agent's instructions sequentially in-context:
- Layer 1: strategist
- Layer 2: composer → format-checker → voice-auditor → critic in order
- Terminal humanmaxxing: apply humanmaxxing instructions in-context if skill unreachable

Quality is equivalent — multi-agent optimizes parallelism and focus, not capability. (For this skill, Layer 1 is solo and Layer 2 is sequential, so the parallelism advantage is small.)

---

## Route A — Compose (Single Audience-Temperature)

**When:** User wants hero + 2 variants for one audience-temperature.

```
1. Pre-dispatch: Gather context (per procedures/pre-dispatch.md)
   - Audience-temp missing → ask explicitly (no fallback — drives the whole tree)
   - Offer missing → BLOCK (composer fails without a destination)
   - Creative-format missing → ask; default `dedicated`; warn on `repurposed-ugc` ceiling
   - Cold-traffic + subscription-app + conversion_event=purchase → soft warn per cold-traffic §3 (Apple 24h signal); recommend trial-start; proceed if user insists with `done_with_concerns`
   - Retargeting + no warm-audience-source specified → ask which of the three retargeting audiences (IG engagers / IG followers / FB page engagers)
2. LAYER 1 — strategist SOLO:
   - picks angle archetype + audience-temperature framing + CTA verb per variant
   - assigns anchor-proof slot to hero / variant A / variant B (each must be DISTINCT — no repeated anchor)
   - surfaces spend-ceiling warning if creative_format=repurposed-ugc
3. LAYER 2 — SEQUENTIAL:
   - composer (strategy brief → hero + 2 variants)
   - format-checker (Meta char caps + policy banned-phrase + substantiation gate)
   - voice-auditor (strip vendor-speak + AI tells + em-dashes)
   - critic (7-dim rubric, per-variant scores)
4. Critic FAIL → re-dispatch FULL Layer 2 chain with feedback (max 2 cycles). Never feed critic a raw composer draft without format-checker + voice-auditor between.
4a. Format-checker FORMAT_FAIL (second pass, hard caps still violated) → escalate to user; do not consume a critic cycle.
4b. Format-checker REVISION_REQUIRED on policy/substantiation → re-dispatch composer with the named violation; do not consume a critic cycle.
5. TERMINAL: invoke `humanmaxxing` per variant with `content-type: "short-outbound"` (Light strip on AI telltales only, Full sender voice, 0-10% compression — ad copy is already tight; further compression kills specificity)
6. POST-HUMANMAXXING REGRESSION: re-run critic's Specificity dim only per variant. Drops ≥2 OR any named entity/number absent post-humanmaxxing → flag the delta + the removed specific for operator review (critic-approved variant preserved alongside; operator picks).
7. Write artifacts to `docs/forsvn/artifacts/marketing/write-ad/[audience-temp]-[date]-[slug].md` (+ .rationale.md + .critic-score.md)
8. Deliver hero + 2 variants + rationale inline; show scorecard only if user asks or any dim scored 6-7 OR if creative_format=repurposed-ugc (variant-level ceiling warning prominent in artifact)
```

## Route B — Called by Another Skill

**When:** Invoked by `plan-campaign` for paid touches in a broader campaign.

```
1. Pre-dispatch: read campaign context from calling skill's artifact
2. Execute Route A per audience-temperature requested (one invocation per temp — not stacked)
3. Return annotated hero + 2 variants + rationale to calling skill
```

---

## Layer 1: Strategy (Compose Route)

Strategist runs SOLO. There's no parallel signal-analyst-equivalent because the audience-temperature decision is user-supplied, not derived from a signal score.

| Agent | Instruction File | Pass These Inputs | Reference Files to Resolve |
|-------|-----------------|-------------------|---------------------------|
| Strategist | `agents/strategist.md` | pre-writing (all) + audience-temp + offer + creative-format + conversion-event + available-proof + transmutation goal + competitor-pattern + LP-description | `references/ad-intelligence/meta-retargeting.md` (if audience-temp=retargeting) OR `references/ad-intelligence/meta-cold-traffic.md` (if audience-temp=cold), `references/ad-intelligence/creative-cadence.md`, `references/anti-patterns.md`, `references/message-transmutation.md`, `references/_shared/copywriting-research-workflow.md` |

Wait for output. The strategist returns markdown (no machine-parseable keys). Verify by reading the Variant Assignments section:
- The 3 Variant Assignment blocks (Hero / A / B) name 3 DISTINCT `Angle archetype` values (no surface-level repeats)
- The 3 `Anchor proof` lines name 3 DISTINCT entities or numbers (no repeats across variants)
- Each variant carries a `CTA verb` matching the conversion-event default
- Each variant carries `Filtering stage optimized for` with one of Retrieval / Light Ranking / Heavy Ranking / Auction and a concrete signal explanation
- Each variant carries `Transmutation format` and `Variable isolated`
- The `Ceiling Warning` section is present if and only if `creative_format=repurposed-ugc`
- The `Policy Flags` section pre-warns on health/finance/political offers (composer + format-checker pick this up when reading the strategy brief)

If any check fails, re-dispatch strategist with the specific gap named. Do not paper over — variant distinctness is load-bearing for the A/B test signal.

---

## Layer 2: Sequential Refinement

Agents run in order. Each receives the prior agent's output.

| Order | Agent | Instruction File | Input | Reference Files |
|-------|-------|-----------------|-------|-----------------|
| 1 | Composer | `agents/composer.md` | Strategy brief + competitor-pattern excerpts from pre-writing if available | `references/format-spec.md`, `references/message-transmutation.md`, `references/ad-intelligence/meta-retargeting.md` (if audience-temp=retargeting) OR `references/ad-intelligence/meta-cold-traffic.md` (if audience-temp=cold) |
| 2 | Format Checker | `agents/format-checker.md` | Composer draft + composer's claim list | `references/format-spec.md`, `references/policy-floor.md` |
| 3 | Voice Auditor | `agents/voice-auditor.md` | Format-checker-passed draft | `references/anti-patterns.md` |
| 4 | Critic | `agents/critic.md` | Voice-audited draft + `pre_writing` verbatim + strategy brief | `references/rubric.md`, `references/anti-patterns.md`, `references/policy-floor.md` |

### Format-Checker Hard Gate (between composer and voice-auditor)

Format-checker is a HARD gate, not a critic dim — it bounces on:
- Any Meta char-cap violation (40 char headline / 30 char description / 3,000 char primary text)
- Any banned policy phrase (see `references/policy-floor.md`)
- Any measured claim without a substantiating source from `pre_writing.Q6.available_proof[]`

`PASSED` → proceed to voice-auditor. `REVISION_REQUIRED` → re-dispatch composer with violation list (does not consume a critic cycle). `FORMAT_FAIL` (second pass still violating) → escalate to user with violations enumerated.

### Critic Gate

Critic returns:
- **PASS** — scorecard → proceed to terminal humanmaxxing
- **FAIL** — scorecard + rewrite feedback → re-dispatch FULL Layer 2 (composer → format-checker → voice-auditor → critic) with feedback (cycle 1 or 2)

After 2 failed critic cycles, surface: "Critic couldn't reach threshold across 2 rewrite cycles — here's the best draft + per-variant scorecard + what's blocking. Your call."

---

## Terminal Pass: Humanmaxxing

After critic PASS, invoke `humanmaxxing` on each variant (hero / A / B) independently:

1. Spawn agent with humanmaxxing's `SKILL.md` content
2. Pass:
   - Final variant text (primary text + headline + description as one unit)
   - `content-type: "short-outbound"` (humanmaxxing's Content Type Calibration: ad copy already runs ≤125 chars visible — Light strip on AI telltales only, Full sender voice, **0-10% compression cap** because further compression strips specificity that critic just scored. Same calibration cold-outreach uses; humanmaxxing's table explicitly registers ad copy under this content-type.)
   - Audience-temp (humanmaxxing voice-extraction reads brand voice differently for warm vs cold register)
   - `protected_tokens`: every named entity + number + URL in the critic-approved variant (humanmaxxing must not remove or paraphrase)
3. Receive humanmaxxed variant
4. **Regression check (automatic detection, operator decision):** re-run critic's **Specificity dimension only** on the humanmaxxed variant. Flag the delta + the removed specific for operator review (critic-approved variant preserved alongside; operator picks) if any of:
   - Specificity drops ≥ 2 points
   - Any named entity pre-humanmaxxing absent post-humanmaxxing
   - Any concrete number pre-humanmaxxing absent post-humanmaxxing
   - Any URL pre-humanmaxxing absent post-humanmaxxing
5. Otherwise ship humanmaxxed variant.

Terminal pass is **automatic**, not opt-in. AI-sounding ad copy is the second-biggest reason ads get scrolled past (creative fatigue is first per `ad-intelligence/creative-cadence.md`).

---

## Chain Position

Horizontal — runs standalone or called by `plan-campaign` when paid is part of a broader mix.

**Re-run triggers:** offer changes; LP changes materially; creative fatigue detected (CTR < 1.5% after 48h per `ad-intelligence/creative-cadence.md`); audience structure changes (new warm-audience source added); platform policy change reported (e.g., Meta tightens health-claim review).

### Skill Deference

- **Landing page headline or section copy?** → `write-copy` (different surface mechanics — LP has scroll, ad doesn't)
- **Outbound DM or cold email?** → `write-outreach` (different trust model, different framework set)
- **Redesigning the LP this ad clicks to?** → `brief-landing-page` first; this skill consumes its output
- **Multi-channel campaign across paid/owned/earned?** → `plan-campaign` first
- **No ICP, or ICP stale (>30 days)?** → `research-icp` first (research-skills)
- **Google RSA / LinkedIn / TikTok Ads?** → NOT this skill v1. Refs not pre-staged; would force fabrication.
