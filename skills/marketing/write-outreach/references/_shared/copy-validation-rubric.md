<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Copy Validation Rubric — The Competitor Swap Test

> Shared, generic copy-validation contract. Consumers: any skill that ships persuasive customer-facing lines (`write-copy`, `write-outreach`, and — where cited — `write-social` / `write-ad`).
>
> This is the **U (Uniquely-Ours)** half of the per-line **V/F/U** rubric, factored out so every copy-producing skill applies the same test the same way. It does not redefine V (Visual) or F (Falsifiable) — those stay with each skill's line-scoring rubric. It owns one question: *would this line still be true if a competitor signed it?*

---

## The one-line test

**If a competitor could put their name on the line without lying, the Unique dimension fails.**

A claim that any vendor in the category could honestly make is not a *position* — it is table stakes phrased as a benefit. It scores V and F (it can be pictured and disproven) yet still fails, because it does no differentiating work. The Swap Test is therefore an **independent auto-fail**: it overrides a passing V/F average. A line that any competitor could sign is rejected even if it reads beautifully.

---

## How to run it (per key line)

1. **Swap the subject.** Replace the brand name (and any brand-owned proper nouns — product name, named mechanism, named metric) with the strongest direct competitor's.
2. **Read it as them.** Could that competitor publish this line truthfully today?
   - **Yes** → the line is *swappable*. U fails. Send back: tie the claim to the proprietary mechanism, a falsifiable number only you own, or a category-of-one frame.
   - **No** → the line is *defensible*. The competitor would be lying, exaggerating, or admitting they can't match it. U passes.
3. **Name the competitor in the annotation.** "Swap with {competitor}: passes/fails" — an unnamed swap is not a test, it is a vibe.

> Edge case — **proof-by-number lines.** A line whose entire claim is a brand-owned figure ("50,000 teams ship daily with X") is defensible *only if the number is genuinely yours and verifiable*. Swapping the brand in also swaps the number out; if the competitor can't truthfully state the same figure, U passes. A rounded or borrowed industry stat is swappable — it fails.

> Edge case — **mechanism lines.** A line that names *how* ("the only X that updates itself from your commits") is defensible when the mechanism is proprietary. If the mechanism is industry-standard plumbing dressed as a differentiator, the swap exposes it.

---

## Worked examples — swappable (FAIL) vs. defensible (PASS)

Generic across categories; substitute your own domain.

| Swappable (U fails — any competitor could sign it) | Defensible (U passes — tied to a proprietary mechanism, number, or frame) |
|---|---|
| "The all-in-one platform for modern teams." | "The only project tool that closes a ticket the moment the matching commit merges." |
| "Powerful analytics, beautifully simple." | "See which named companies visited your pricing page yesterday — not just anonymized counts." |
| "Trusted by thousands of businesses worldwide." | "4,200 Shopify stores route returns through us; the average refund clears in 26 hours." |
| "We help you grow faster." | "Cut time-to-first-lead from 14 days to 3 with the prebuilt outbound graph." |
| "Enterprise-grade security you can rely on." | "Your data never leaves your own cloud account — we run inside your VPC, not ours." |
| "Save time and money with automation." | "Reconcile a month of invoices in one click because we read the bank feed, not your spreadsheet." |

**Pattern of the fixes:** every PASS line earns U by anchoring to one of three sources of defensibility —

1. **Proprietary mechanism** — the *how* only you can claim ("updates from your commits", "runs inside your VPC").
2. **Brand-owned, falsifiable number** — a figure that swaps out with the name ("4,200 Shopify stores", "26 hours").
3. **Category-of-one frame** — a position you defined that competitors would have to concede ("the only X that…").

---

## What the Swap Test is NOT

- **Not a substitute for V or F.** A defensible-but-vague line ("uniquely built different") passes the swap superficially yet fails Visual and Falsifiable. Run all three dimensions; the swap is the U gate only.
- **Not a uniqueness-of-words test.** Reword "all-in-one platform" into "unified workspace" and it is still swappable. The test is about the *claim*, not the phrasing.
- **Not satisfied by adding the brand name.** "{Brand} is the all-in-one platform" still swaps cleanly. Defensibility comes from the claim being false-for-others, not from a proper noun.
- **Not a license to invent.** A defensible-sounding claim you can't prove fails Falsifiable and burns trust on read-through. The mechanism/number must be real.

---

## Annotation contract

Each key line's annotation records the swap result so a reviewer can audit it without re-deriving:

```
swap_test: { competitor: "{named competitor}", result: pass | fail, basis: mechanism | number | frame | none }
```

`basis: none` with `result: pass` is a contradiction — flag it. A line cannot be defensible without a stated source of defensibility.
