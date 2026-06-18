<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Why-This-Works Convention

**Status:** canonical cross-stack contract. **Consumed by:** every *producing* skill — the ones
whose deliverable is a finished marketing artifact (copy, brief, plan, asset, brand). **Pairs with
(does not duplicate):** the [`legibility-convention.md`](legibility-convention.md).

## Why this exists

AI commoditized *production*; the scarce, trust-bearing layer is **applied judgment fitted to one
product**. The stack's quality is real but stays invisible: deliverables ship the finished thing and
the critic's receipts, but never say **why these choices win for *this* product and *this* audience**.
The wow is buried. The product principle: **the user sees expert judgment they didn't know they
needed, applied specifically to their product.** This convention makes that judgment legible.

The deliverable already leads with the artifact (the critic verdict / Review Gate is the *last*
section — that part is done). What's missing is the **rationale layer** between the artifact and the
scorecard: a short block that names the bet and ties each load-bearing choice to the product's own
ICP / brand / positioning — not generic best-practice.

## Boundary vs the legibility convention (read this)

The two blocks are **adjacent, never overlapping**:

| Block | Lens | Grounds in | Scope |
|---|---|---|---|
| **Legibility — applied expertise** ([`legibility-convention.md`](legibility-convention.md)) | **channel-fit** | the platform pack (algorithm signals, format, §5 Playbook) | pack-consuming skills only |
| **Why this works** (this file) | **product-fit** | the ICP / VoC / brand / positioning artifacts | every producing skill |

A pack-consumer (e.g. `write-social`) emits **both**, in order: artifact → Legibility (why it fits the
*channel*) → Why this works (why it wins for *this product*) → critic verdict. A non-pack producer
(e.g. `write-ad`, `brief-graphic`, `produce-video`) emits **Why this works** only. Never restate a
legibility tactic here; this block answers a different question.

## Placement (required)

The block leads the **rationale layer**: placed **after the finished artifact content and before any
scorecard / critic verdict / Review Gate**. The artifact is still first (the meal); this is the chef's
one-paragraph "here's why this plate works for you," not the kitchen's inspection sheet (which stays
last/appendix).

Exception for brief-style deliverables that already open with a short **"the bet" / "TL;DR"** framing
(e.g. `brief-shortform`'s `## What This Brief Bets On`): carry the product-fit reasoning **in that
opening section** instead of repeating it lower down — provided the opening stays short (it must not
bury the artifact) and the scorecard still comes last. One block per deliverable, never two.

## The block (required output)

```
**Why this works**
- The bet: <the one core wager this deliverable makes, in one sentence>
- For this product: <choice → the ICP pain / VoC phrase / positioning it serves — name the source>
- For this product: <a second load-bearing choice → its product-specific reason>
- The differentiator: <why this wouldn't work verbatim for a competitor — the Competitor-Swap angle>
```

Rules:
1. **Product-specific, never generic.** "Leads on the 3-week-onboarding pain your ICP ranked #1
   (`ICP.md` §pains), in their words ('it just never sticks')" — NOT "speaks to the audience" or
   "follows best practice." If the line would survive a find-and-replace of the product name, it's a
   vibe, not a reason (the **Competitor Swap Test**, same bar the copy critics enforce).
2. **Trace to a source.** Each "for this product" line cites the artifact it draws on
   (`ICP.md`, `PRODUCT-CONTEXT.md`, `BRAND.md` / `CREATIVE-DIRECTION.md`, the campaign plan). A claim
   with no source is a guess.
3. **The bet is falsifiable.** "The bet" names what would make this deliverable *fail* — so
   `measure-results` / the eval skills can test it next cycle. It is the hypothesis, stated plainly.
4. **Choices, not a summary.** Narrate the 2-4 *load-bearing* decisions, not a recap of the artifact.

## The three states (graceful degrade)

### 1. Grounded (ICP + brand context present)
The full block above — every line traces to a real foundation artifact.

### 2. Partial (some foundation present, some cold-start)
Same block; flag each line drawn from a cold-start hint rather than a run foundation:
```
**Why this works** (⚠ partial — `ICP.md` absent; product-fit lines marked [hint] are unverified)
- For this product: [hint] <reason from the cold-start brief — confirm against a real ICP>
```

### 3. Absent (no foundation run)
Transparent degrade — **no product-fit claim** you can't back:
```
**Why this works**
- Built on general copy/marketing principles only — no ICP/brand foundation was available.
- Not product-tailored: run `/research-icp` (+ `/create-brand`) so the next version reasons from your
  product's actual pains, voice, and positioning.
```
Never fabricate a pain, a VoC quote, or a positioning claim. A "for this product" line without a
foundation source is the failure mode this convention exists to prevent (mirrors legibility Hard Rule 2).

## Hard rules

1. **Markdown only** — the block rides the existing deliverable surface; no new app UI, no new
   frontmatter field. (Producing skills that already carry a rationale surface — e.g. `write-ad`'s
   `.rationale.md`, `brief-landing-page`'s closing "Why This Works" — conform to this shape and
   **promote it to the placement above**, rather than adding a second block.)
2. **Never fabricate product-fit.** No foundation → state 3. A "tailored to your product" claim with
   no `ICP.md` / `BRAND.md` source is a lie and a gate failure of this convention.
3. **Product-fit, not channel-fit.** Channel/algorithm reasoning belongs in the Legibility block. If
   a line is about the platform, it's in the wrong block.
4. **The scorecard stays last.** This block never displaces the artifact (first) and never merges with
   the critic verdict (last/appendix).
