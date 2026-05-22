---
title: Fresh-Eyes — Critic Consensus Mode
lifecycle: canonical
status: stable
produced_by: fresh-eyes
load_class: PROCEDURE
---

# Critic Consensus Mode

**Load when:** the artifact under review is high-stakes but does NOT fit the code-focused specialist set in [`specialist-mode.md`](specialist-mode.md). Typical triggers: compliance-sensitive marketing copy, paid media with meaningful spend, public launch announcements, canonical research updates, OR a repeated operator override of a critic dimension (history of disagreement signals the dimension deserves a second opinion).

---

## Pattern

1. **Run the normal reviewer** against the full requirements (per [`reviewer.md`](reviewer.md)). This is the baseline pass — same prompt, same structured-output schema.

2. **Run a second critic** focused only on the highest-risk dimensions for this artifact type. Pick from:
   - **Substantiation** — does every claim have a citation or source?
   - **Compliance** — does the artifact violate any stated policy (legal, brand-voice, platform-specific ad policy, regulatory)?
   - **Audience fit** — is the artifact calibrated to the named audience, or is it speaking past them?
   - **Mechanism distinctness** — for marketing copy: does it explain WHY the product works, not just WHAT it does?
   - **Protected-token preservation** — for humanmaxxing/translation passes: were trademarks, version numbers, technical terms preserved verbatim?
   - **Research validity** — for ICP/market-research updates: are the claims supported by the cited sources, with sample sizes + dates?

   Use [`../_shared/shared-critic-rubrics.md`](../_shared/shared-critic-rubrics.md) for the canonical scoring rubric per dimension.

3. **Merge disagreements in the report.** The two critics may agree on most findings + disagree on a subset. The report shows:
   - **AGREED:** findings both critics raised
   - **CRITIC A ONLY:** findings the baseline reviewer raised that the second critic missed
   - **CRITIC B ONLY:** findings the second critic raised that the baseline reviewer missed
   - **DISAGREEMENTS:** findings where one critic said FIX and the other said FINE

4. **Resolve disagreements on hard gates directly.** If the two critics disagree on a hard gate (e.g., one says the claim is substantiated, the other says it isn't), do NOT average the scores or take majority vote. Either:
   - Resolve the dimension by inspection — fetch the cited source, run the policy check, validate the audience-fit claim. Whichever critic was right wins.
   - If the disagreement can't be resolved from the artifact + sources alone, return `DONE_WITH_CONCERNS` (flagging the unresolved disagreement) or `BLOCKED` (if the disagreement is on a hard gate that must be resolved before ship).

## When critic-consensus is the wrong call

- **Pure code** → use [`specialist-mode.md`](specialist-mode.md) instead (3 parallel specialists is richer signal than 2 critics for code).
- **One-off content** with no compliance/launch stakes — generalist reviewer is sufficient; consensus mode would be ceremony.
- **Operator hasn't flagged a repeated dimension override** — fishing for a second opinion when the first review was clean wastes tokens.

## Cost

2× single-reviewer cost (~$0.20-0.40 per round at sonnet). Cheaper than specialist mode (3×) but more expensive than generalist. Use when the artifact's downstream blast radius (compliance violation, ad-platform ban, public-launch retraction) justifies the extra reviewer.

## Anti-pattern: averaging the scores

If Critic A scores substantiation 7/10 and Critic B scores it 3/10, the mean is 5/10 — but the truth is "violently disagreed." Surface BOTH scores in the report; don't pretend the mean represents anything. The disagreement IS the signal.
