---
title: Copywriting — Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: copywriting
load_class: PROCEDURE
---

# Pre-Dispatch Procedure

**Load when:** orchestrator enters Pre-Dispatch (before Layer 1 dispatch). Implements the canonical Pre-Dispatch protocol (`_shared/pre-dispatch-protocol.md`) for this skill's needed dimensions. copywriting has a 7-question Cold Start with a 6-row write-back map (most-elaborate creative skill after write-outreach in the marketing stack).

---

## Needed dimensions

- **Surface** — page / email / social / headline / CTA / tagline / subject line / other (decides Route A vs Route B selection)
- **Audience** — primary buyer (role + situation + 1-2 pains they articulate) or pointer to `research/icp-research.md`
- **The one shift** — what should the reader believe after reading this that they don't believe now (one sentence)
- **Unique proof** — what can you say that nobody else can (specific client + number, named feature with results, or domain credentials)
- **Unique Mechanism** — what proprietary "how" makes the offer different and better than the old way or commodity alternative (name it in one sentence; if unknown, copy must surface as a concern)
- **Belief sequence** — what 3-6 beliefs must the reader accept before the CTA feels like the logical next step (if unknown, body-agent derives from brief)
- **Traffic source** (only if surface is page or email) — ad / search / email / social / direct (determines what reader already knows and expects)

## Read order (warm-start scan)

1. **Method:** `references/research-workflow.md` — the Research Doc → Avatar & Offer Brief → Belief Engineering → Unique Mechanism SOP. Use it to identify missing upstream context before dispatch.
2. **Pipeline artifacts:**
   - `research/icp-research.md` → VoC + pain language
   - `research/product-context.md` → product details + voice adjectives + Unique Mechanism (if persisted)
   - `docs/forsvn/artifacts/marketing/campaign-plan.md` → angle + awareness stage
3. **Experience:** `docs/forsvn/experience/{audience,product,goals}.md` → prior copy shift + belief sequence + proof points
4. **Conversation context:** brief from upstream skill (e.g., lp-brief handed a per-section spec with audience + traffic + Unique Mechanism resolved)

If `research/icp-research.md` / `research/product-context.md` `date:` is >30 days, warn and recommend re-running `research-icp` (soft gate — proceed with "stale ICP" header note).

**Language:** default English. If another language specified, note in pre-writing — agent instructions are optimized for English copy; other languages may need adapted idioms and cultural references.

## Warm Start (icp-research + product-context + campaign-plan exist)

```
Found:
- audience → "[VoC summary from research-icp.md]"
- product/voice → "[adjectives from product-context.md]"
- campaign angle → "[from plan-campaign.md if present]"
- Unique Mechanism → "[proprietary mechanism from product-context.md or campaign-plan.md if present]"

Need before dispatching: surface (page/email/headline/CTA/etc.) + the
one shift this copy should produce + confirmation that the Unique Mechanism
above is the mechanism to anchor the argument on. If the surface is a
direct-response page or persuasion-heavy email, also confirm the belief
sequence or let Body Agent derive it from the research workflow.
```

## Cold Start (no upstream artifacts)

```
copywriting writes for a specific surface, a specific audience, with a
specific shift in mind. Generic prompts produce generic copy. Before I dispatch:

1. **Surface** — landing page (full) / homepage section / email / social post
   / headline only / CTA only / tagline / subject line / other?
2. **Audience** — primary buyer (role + situation + 1-2 pains they articulate).
   Or point me at `research/icp-research.md` if it exists.
3. **The one shift** — what should the reader believe after reading this
   that they don't believe now? One sentence.
4. **Unique proof** — what can you say that nobody else can? Specific
   client + number, named feature with results, or domain credentials.
5. **Unique Mechanism** — what proprietary "how" makes the offer different
   and better than the old way or commodity alternative? Name it in one
   sentence. If none exists yet, say "unknown" and the copy must surface that
   as a concern.
6. **Belief sequence** — what 3-6 beliefs must the reader accept before the
   CTA feels like the logical next step? If unknown, say "derive from brief."
7. **Traffic source** (only if Q1 is page or email) — ad / search / email /
   social / direct? Determines what the reader already knows and expects.

Answer 1-7 (or 1-6 if no traffic source) in one response. I'll dispatch.
```

Wait for answers. Do not dispatch without them.

## Write-back

After cold-start answers, append to experience/:

| Q | File | Key |
|---|---|---|
| 2. Audience | `docs/forsvn/experience/audience.md` | `Audience — primary persona` (only if novel; pre-existing icp-research takes precedence) |
| 3. The one shift | `docs/forsvn/experience/goals.md` | `Goals — copy shift: [surface]` |
| 4. Unique proof | `docs/forsvn/experience/product.md` | `Product — proof points` |
| 5. Unique Mechanism | `docs/forsvn/experience/product.md` | `Product — unique mechanism` |
| 6. Belief sequence | `docs/forsvn/experience/goals.md` | `Goals — copy belief sequence: [surface]` |
| 1, 7. Surface + traffic source | (routing only) | — |

## Pre-Writing Assembly

After Pre-Dispatch resolves, compile and pass to every agent in the `pre-writing` input:

- **Surface** — page / email / social / headline / CTA / tagline / subject line
- **Audience** — primary buyer + current belief + 1-2 articulated pains
- **The one shift** — desired belief after reading (one sentence)
- **Unique proof** — specific client + number, named feature with results, or credentials
- **Unique Mechanism** — proprietary "how" that anchors the argument
- **Belief sequence** — 3-6 ordered beliefs (or "derive from brief" flag)
- **Traffic source** — ad / search / email / social / direct (page or email only)
- **VoC pain language** — verbatim quotes from research-icp.md
- **Voice adjectives** — from product-context.md (default: "clear, specific, human" if absent)
- **Language** — English by default; flagged if other

## Hard-block conditions

- **Surface missing.** Re-ask Q1 of Cold Start (surface drives Route A vs B selection).
- **Audience missing AND no icp-research.md.** Re-ask Q2. (copywriting cannot write to no-one.)
- **The one shift missing.** Re-ask Q3. (copy without a shift is information, not persuasion.)
- **Unique proof + Unique Mechanism both missing AND no product-context.md.** NEEDS_CONTEXT. Recommend `create-brand` or `research-icp` to surface proof + mechanism before dispatching. Copy without proof = uncheckable claims = critic Competitive Uniqueness FAIL.

## `--fast` behavior in Pre-Dispatch

`--fast` does NOT skip Cold Start — when surface / audience / shift / proof / Unique Mechanism are missing AND not resolvable from warm-start, the bundled question still fires. `--fast` collapses Route B Layer 1 parallel (hook + body + cta + social-proof) to sequential dispatch (still runs all 4 agents, just no parallelism), skips variant-agent, and skips Layer 2's psychology-agent + zero-risk-agent (keeps voice-agent + critic only). Critical Gates STILL enforced per `_shared/mode-resolver.md`.

Hard-block conditions above STILL fire under `--fast` — safety gates supersede `--fast`.
