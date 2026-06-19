---
title: Ad Copy — Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: ad-copy
load_class: PROCEDURE
---

# Pre-Dispatch Procedure

**Load when:** orchestrator enters Pre-Dispatch (before Layer 1 strategist dispatch). Implements the canonical Pre-Dispatch protocol (`_shared/pre-dispatch-protocol.md`) for this skill's needed dimensions. ad-copy has a 10-question Cold Start (close second to cold-outreach in the marketing stack) with audience-temp + creative-format + conversion-event hard-blocks plus retargeting follow-ups.

---

## Needed dimensions

- **Audience-temp** — `retargeting | cold` (drives entire strategist tree — warm objection map vs cold objection map; different creative posture; different CTA tier)
- **Offer** — what the ad sends people to (trial / demo / purchase / lead form / app install — specific on duration, price, hook)
- **Creative-format** — `dedicated | repurposed-ugc` (dedicated carries scaled spend ceiling per `ad-intelligence/creative-cadence.md`; repurposed-UGC capped ~$10-15K/day)
- **Conversion-event** — `trial_start | purchase | lead | install | view-content` (for subscription apps, trial-start is the only signal that lands inside Apple's 24h privacy window per `ad-intelligence/meta-cold-traffic.md` §3)
- **Production-model** — `in-house | affiliate-creator | external-freelance` (informational; drives variant-volume sustainability note in rationale)
- **Available-proof** — list of ALL named candidates (case study / number / named customer / measured outcome / research); composer picks one anchor per variant (hero + 2 variants = 3 distinct anchors)
- **Transmutation goal** — `AI UGC | native static | AI animation | advertorial pre-lander | Chad Funnel | strategist choose`
- **Competitor-pattern** (optional but useful) — what top 3 competitors usually lead with (hooks, tone, proof type, offer promise, visual convention); composer uses for Contrast Ratio
- **Belief sequence** (optional; required for advertorial / Chad Funnel) — 3-6 beliefs cold traffic must accept before price/product page
- **LP-description** (optional but recommended) — 1-2 sentences on what the landing page promises; critic CTA-LP-match dim scores against this

**If audience-temp = retargeting:** also collect warm-audience-source (IG engagers / IG followers / FB page engagers) + recent-organic-content (last 4-6 organic posts or themes the audience saw — offer-content consistency check per `ad-intelligence/meta-retargeting.md` §3).

## Read order (warm-start scan)

1. **Method:** `references/_shared/copywriting-research-workflow.md` for the Research Doc → Avatar & Offer Brief → Belief Engineering → Unique Mechanism SOP. Use it to identify missing proof, competitor-pattern, and mechanism context before dispatch.
2. **Pipeline artifacts:**
   - `research/product-context.md` → voice adjectives + accuracy constraints + proof points
   - `research/icp-research.md` → primary persona + VoC pain language
   - `docs/forsvn/artifacts/marketing/campaign-plan.md` → channel mix + paid budget split + sequencing (Route B context)
   - `brand/BRAND.md` → voice anchors + banned-language list
3. **Experience:** `docs/forsvn/experience/{audience,product,business,brand}.md`
4. **Conversation context:** brief from upstream skill (e.g., campaign-plan handed strategy with audience-temp + offer + production-model resolved)

If `research/icp-research.md` / `research/product-context.md` `date:` is >30 days, warn and recommend re-running `research-icp` (soft gate — proceed with "stale ICP" header note in rationale).

## Warm Start (audience-temp supplied + ICP exists + brand in context + offer specified)

```
Found:
- ICP context → "[primary persona from research-icp.md]"
- brand voice → "[from brand/BRAND.md voice section]"
- product proof → "[from product-context.md]"

Need before dispatching: creative-format (dedicated | repurposed-ugc),
conversion event, and at least 2 named proof points (case study / number /
named customer / measured outcome).
```

## Cold Start (no upstream context, fresh ad-copy run)

```
ad-copy writes Meta paid-ad copy that respects audience temperature, hard
char caps, and Meta's policy review. The composer needs precise inputs —
generic prompts produce generic ads that Meta will rank low or auto-reject.

1. **Audience temperature** — retargeting (warm — IG engagers / IG followers /
   FB page engagers) OR cold-traffic (broad targeting, post-Andromeda)?
2. **Offer** — what does the ad send people to? (free trial / demo / purchase
   / lead form / app install — be specific on duration, price, hook)
3. **Creative format** — dedicated ad creative (carries scaled spend, $40K+/day
   per cali-apps) OR repurposed-UGC (capped ~$10-15K/day spend ceiling)?
4. **Conversion event** — trial_start (subscription apps; lands inside Apple
   24h signal window) / purchase / lead / install / view-content?
5. **Production model** — in-house / affiliate-creator (Tribe + WhatsApp
   model from cali-apps) / external-freelance? (informational)
6. **Proof** — list ALL candidates: named customers, measured outcomes,
   named research, specific numbers. Composer picks one anchor per variant
   (hero + 2 variants = 3 distinct anchors). No proof = uncheckable claims
   = critic fail.
7. **Transmutation goal** — should the winning message become AI UGC/VSSL,
   native static, AI animation, advertorial pre-lander, Chad Funnel, or should
   strategist choose? If unknown, say "strategist choose."
8. **Competitor pattern (optional but useful)** — what do the top 3
   competitors usually lead with? Hooks, tone, proof type, offer promise, or
   visual convention. Composer uses this for Contrast Ratio.
9. **Belief sequence (optional; required for advertorial / Chad Funnel)** —
   what 3-6 beliefs must cold traffic accept before the price/product page?
   If unknown, say "derive from proof and offer."
10. **LP description (optional but recommended)** — 1-2 sentences on what
   the landing page promises. Critic CTA-LP-match dim scores against this.

If audience-temp=retargeting: which warm audience (IG engagers / IG followers /
FB page engagers)? What were the last 4-6 organic posts the audience saw?
(offer–content consistency check per meta-retargeting §3).

Answer 1-10 in one response (plus the retargeting follow-ups if applicable).
I'll dispatch.
```

Wait for answers. Do not dispatch without them.

## Missing-Input Hard Blocks

These dimensions cannot be substituted via fallback — composer fails without them:

- **Audience-temp missing** → ask explicitly; no fallback (drives the entire strategist tree)
- **Offer missing** → BLOCK (composer needs a destination)
- **Proof missing + no product-context** → ask for at least 2 named candidates; **BLOCK** if user insists "no proof" (uncheckable claims fail Specificity Floor)
- **Cold-traffic + subscription-app + conversion_event=purchase + (offer contains "free trial" OR trial duration ≤ 14 days)** → soft warn per `ad-intelligence/meta-cold-traffic.md` §3. The Apple 24h signal window is structural — affects all short free trials, not only 3-day. Recommend trial-start; proceed as `done_with_concerns` only if user insists.
- **Creative-format = repurposed-ugc + target daily-spend > $15K** → soft warn per `ad-intelligence/creative-cadence.md` §5; ceiling will be hit; proceed as `done_with_concerns` only if user accepts

## Write-back

After cold-start answers, append to experience/:

| Q | File | Key |
|---|---|---|
| 2. Offer | `docs/forsvn/experience/product.md` | `Product — current offer` (durable across ad-copy + lp-brief + cold-outreach runs) |
| 6. Proof points | `docs/forsvn/experience/product.md` | `Product — proof points` (durable across ad-copy + lp-brief + cold-outreach + copywriting) |
| 1, 3, 4, 5, 7, 8, 9, 10 | (run-specific) | — (audience-temp + creative-format + conversion-event + production-model + transmutation goal + competitor-pattern + belief sequence + LP-description live in rationale.md only) |

If `research/icp-research.md` exists, pull VoC pain language into pre-writing. If `research/product-context.md` exists, pull voice adjectives + accuracy constraints. If `brand/BRAND.md` exists, pull voice anchors and banned-language list.

## Pre-Writing Assembly

After Pre-Dispatch resolves, compile and pass to every agent in the `pre-writing` input:

- **Audience-temp** — `retargeting | cold`
- **Offer** — destination + duration + price + hook
- **Creative-format** — `dedicated | repurposed-ugc` + ceiling warning if `repurposed-ugc`
- **Conversion-event** — `trial_start | purchase | lead | install | view-content`
- **Production-model** — `in-house | affiliate-creator | external-freelance`
- **available_proof[]** — full list (composer picks 3 distinct anchors)
- **Transmutation goal** — explicit format or "strategist choose"
- **Competitor-pattern** — if provided
- **Belief sequence** — if provided (required if Transmutation goal includes advertorial or Chad Funnel)
- **LP-description** — if provided
- **Voice adjectives** — from BRAND.md / product-context / brand.md (default: "clear, specific, human")
- **VoC pain language** — from research-icp.md
- **Warm-audience-source + recent-organic-content** — if audience-temp=retargeting

## `--fast` behavior in Pre-Dispatch

`--fast` does NOT skip Cold Start — when audience-temp / offer / creative-format / proof are missing AND not resolvable from warm-start, the bundled question still fires. `--fast` skips post-humanmaxxing Specificity regression check per variant (saves 1 critic-Specificity-dim invocation per variant = 3 invocations saved for hero + A + B). Critical Gates + Missing-Input Hard Blocks + Format-Checker Hard Gate STILL enforced per `_shared/mode-resolver.md`.

Hard-block conditions above STILL fire under `--fast` — safety gates supersede `--fast`.

## Performance Grounding (pre-generation, paid lane)

Before Layer 1 strategist dispatch, ground on the operator's own **paid** history for the target platform:

```bash
bun scripts/query-performance.ts <platform> --placement paid --json
```

Obey the emitted `empty | sparse | sufficient` state + `guidance`. The paid filter never returns organic rows; a below-floor filtered subset is anecdote-weight even inside a sufficient channel. Full read contract (precedence, the U12 direction-not-element-list rule, brand + policy/claims-floor supremacy): [`../_shared/performance-grounding.md`](../_shared/performance-grounding.md).

**Then emit the Recall line** (required output): state the own **paid**-data result with its real `n` + the `empty/sparse/sufficient` state, and read the loaded platform pack's `## Open Questions` to name **one** unknown as the experiment this run probes — see [`../_shared/performance-grounding.md`](../_shared/performance-grounding.md) § *The recall line*. The recall is shown in the ad output, not just obeyed; never fabricate `n` on an empty/sparse store, and drop the open-question part if the pack has none.
