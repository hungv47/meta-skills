---
title: Cold Outreach — Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: cold-outreach
load_class: PROCEDURE
---

# Pre-Dispatch Procedure

**Load when:** orchestrator enters Pre-Dispatch (before Layer 1 dispatch). Implements the canonical Pre-Dispatch protocol (`_shared/pre-dispatch-protocol.md`) for this skill's needed dimensions. cold-outreach has the most elaborate Pre-Dispatch in the stack (5+ questions + missing-input protocol with hard blocks for un-faithfulness).

---

## Needed dimensions

- **Mode** — services-sell | saas-sell | partnership-sell | community-sell (decides modes/{mode}.md defaults — CTA vocabulary, proof shape, offer framing)
- **Channel** — email | linkedin-dm | linkedin-connection | twitter-reply | twitter-dm | imessage | sms | upwork-proposal | other-platform (decides channels/{channel}.md craft rules — length, structure, formatting)
- **Target** — name + role + company (min); LinkedIn URL / context ideal
- **Trigger** — specific signal + strength (1-5 scale where 5 = individual post/quote/news, 1 = generic "companies like yours")
- **Desired outcome** — reply with interest | short call | open a resource | accept a connection
- **Bridge** — the problem we solve that connects to trigger + situation
- **Proof** — list ALL candidates: case studies, named logos + metrics, specific claims, testimonials, credentials (composer's proof-selector picks one primary + one backup)
- **Prior touches** (touch 2+ only) — verbatim prior messages so composer maintains coherence + avoids angle repetition

## Read order (warm-start scan)

1. **Pipeline artifacts:**
   - `research/product-context.md` → voice adjectives, accuracy constraints, proof points
   - `research/icp-research.md` → primary persona + VoC pain language
   - `docs/forsvn/artifacts/marketing/campaign-plan.md` → channel mix + sequencing if outbound is part of a broader campaign
2. **Experience:** `docs/forsvn/experience/{audience,product,business}.md` → Voice notes, proof points, target-fit observations from prior runs
3. **Conversation context:** brief from upstream skill (e.g., campaign-plan handed strategy directly)

If `research/icp-research.md` / `research/product-context.md` `date:` is >30 days, warn and recommend re-running `research-icp` (soft gate — proceed with "stale ICP" header note).

## Warm Start (target supplied + ICP exists + product proof in context)

```
Found:
- ICP context → "[primary persona from research-icp.md]"
- product proof → "[from product-context.md or experience/product.md]"

Need before dispatching: target (name + role + company), trigger
(specific signal + strength), and channel?
```

## Cold Start (no upstream context, fresh outreach)

```
cold-outreach writes touch-based outbound that earns a reply, not a delete.
The composer needs precise inputs — generic prompts produce generic outreach.

1. **Mode** — services-sell / saas-sell / partnership-sell / community-sell?
2. **Channel** — email / LinkedIn (DM or InMail) / Twitter DM / other?
3. **Target** — name, role, company, seniority. What do they care about most?
4. **Trigger** — specific signal + strength (1-5 scale where 5 = individual
   post/quote/news, 1 = generic "companies like yours"). Why them, why now?
5. **Desired outcome** — single, specific: reply with interest / short call /
   open a resource / accept a connection?
6. **Bridge** — the problem we solve that connects to their trigger + situation.
7. **Proof** — list ALL candidates: case studies, named logos + metrics,
   specific claims, testimonials, credentials. Composer's proof-selector picks
   one primary + one backup. (No proof = uncheckable claims = critic fail.)

Answer 1-7 in one response. I'll dispatch.
```

Wait for answers. Do not dispatch without them.

## Missing-Input Hard Blocks

These dimensions cannot be substituted via fallback — composer fails without them:

- **Mode missing** → ask explicitly
- **Channel missing** → ask explicitly
- **Target missing + no ICP artifact** → ask for name/role/company; **BLOCK** if both blank
- **Signal missing** → proceed with weak-signal flag (strategist defaults to pain-first instead of trigger-first; critic weights Signal Connection more strictly)
- **Proof missing + no product-context** → ask for one concrete result; **BLOCK** if user insists "no proof" (uncheckable claims fail Specificity rubric)
- **Follow-up touch (touch 2+ or slug ends `-t2`/`-t3`) with no prior_touches** → ask for verbatim prior text; **BLOCK** if missing (composer needs them to avoid repetition)

## Write-back

After cold-start answers, append to experience/:

| Q | File | Key | When to write |
|---|---|---|---|
| 7. Proof points | `docs/forsvn/experience/product.md` | `Product — proof points` | Durable across cold-outreach + copywriting + lp-brief runs |
| 1, 2, 3, 4, 5, 6 | (run-specific) | — | Lives in the rationale.md artifact only — per-target dimensions don't generalize across runs |

If `research/icp-research.md` exists, pull VoC pain language into pre-writing. If `research/product-context.md` exists, pull voice adjectives + accuracy constraints. If prior touches exist, include verbatim so strategist avoids repetition and composer maintains tone.

## Pre-Writing Assembly

After Pre-Dispatch resolves, compile and pass to every agent in the `pre-writing` input:

- **Mode** — services-sell | saas-sell | partnership-sell | community-sell
- **Channel** — email | linkedin-dm | linkedin-connection | twitter-reply | twitter-dm | imessage | sms | upwork-proposal | other-platform
- **Target** — name + role + company + seniority + what they care about
- **Trigger** — specific signal + strength (1-5) — used by signal-analyst as ground truth for the observation line (critic's signal-fabrication check verifies observation-line entities trace back to this field)
- **Desired outcome** — single, specific call-to-action
- **Bridge** — problem we solve that connects to trigger
- **available_proof[]** — full list of proof candidates (proof-selector picks primary + backup)
- **Voice adjectives** — from product-context.md or experience/brand.md
- **VoC pain language** — from research-icp.md if present
- **Prior touches** — verbatim text from prior touches (touch 2+ only)

## `--fast` behavior in Pre-Dispatch

`--fast` does NOT skip Cold Start — when mode / channel / target / proof are missing AND not resolvable from warm-start, the bundled question still fires. `--fast` collapses Layer 1b parallel to sequential (still runs signal-analyst → strategist → proof-selector → composer → voice-auditor → critic → humanmaxxing, just no parallelism), and skips the post-humanmaxxing regression check on the Specificity dimension. Critical Gates + Missing-Input Hard Blocks STILL enforced per `_shared/mode-resolver.md`.

Hard-block conditions above STILL fire under `--fast` — safety gates supersede `--fast`.
