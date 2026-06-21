# Worked Example — Pillar Piece (Route A)

> End-to-end write-longform walkthrough — Pre-Dispatch → Layer 1 (research) → Layer 2 (outline) → Layer 3 (draft) → critic gate (with a cycle-0 Originality FAIL the critic caught) → artifact. Includes the explicit side-by-side proving this is NOT write-copy.

[EXAMPLE] — the premium-bar artifact: a research-grounded, structurally-disciplined pillar with a load-bearing proprietary frame that clears the 7-dimension critic at Originality ≥5. The closing side-by-side is the anti-collapse proof the K5 spec requires.

---

## Setup

**Topic:** synchronous daily standups for engineering teams.
**Target reader:** engineering managers at 30–200-person companies, Solution Aware (they know meetings cost time; they're weighing alternatives).
**Ownable thesis:** "The synchronous daily standup is a *coordination tax* — it doesn't buy the coordination it charges for; async buys more, cheaper."
**Piece-type:** pillar. **Search intent:** "async vs sync standups", "are daily standups worth it".
**Proprietary angle (from product-context):** the author's "coordination tax" frame + a real per-team cost calculation.

---

## Pre-Dispatch
All three hard dimensions resolve (topic, thesis, reader). Piece-type pillar, SEO-anchored. No Cold Start.

---

## Layer 1 — research

### Thesis Stress-Test
- **Thesis:** sync standups are a coordination tax that async beats.
- **Strongest counter-argument:** sync standups create *serendipitous* unblocking and team cohesion that async chat loses — the "we caught a blocker live" case.
- **Verdict:** thesis holds, but the piece MUST address the serendipity counter head-on, or skeptical EMs dismiss it.

### Evidence Ledger (excerpt)
| # | Claim | Evidence | Source/tag | Strength |
|---|-------|----------|-----------|----------|
| 1 | Standups consume senior time at scale | a 6-person team × 15 min × 21 workdays = 31.5 senior-eng-hours/month | `[pattern-derived]` (arithmetic) | strong |
| 2 | Context-switch cost of a mid-morning meeting | interruption + recovery research on flow state | cited (Mark et al., attention-recovery literature) | moderate |
| 3 | Async unblocking can be faster for distributed teams | documented async-first eng-org practices | `[author-assertion]` from operating experience | moderate |
| 4 | The serendipity benefit is real but narrow | most "caught live" blockers were already visible in the tracker | `[author-assertion]` | moderate |

### Consensus (what the first page already says)
- "Standups are good if kept short."
- "Async saves time; use it for distributed teams."
- "It depends on your team."

→ The piece must clear THIS. Merely saying "async saves time" = consensus = FAIL.

### Proprietary Angle
The **"coordination tax" frame**: a standup charges a fixed daily cost (everyone's time + the context-switch) for coordination it mostly *doesn't* produce, because the information was already in the tracker. The frame reframes the whole sync/async debate from "meetings vs chat" to "what coordination am I actually buying, and what does it cost per unit?" Plus the real per-team monthly cost calc (#1) as the anchor.

---

## Layer 2 — outline

### Argument Spine (one line)
Standups charge a fixed daily coordination tax (§1 cost) → the coordination they claim to buy is mostly already visible (§2 mechanism) → the one real benefit, live serendipity, is narrow and replaceable (§3 counter) → so price your coordination: here's the test (§4 application + action).

### Outline
| § | Section | Job | Evidence | Hands off by |
|---|---------|-----|----------|--------------|
| H1 | "Your standup is a coordination tax" | thesis + stakes | #1 | states the cost up front |
| 1 | What the tax actually costs | quantify it | #1, #2 | makes the cost concrete |
| 2 | The coordination you think you're buying | the mechanism: it's already in the tracker | #1, #4 | sets up the counter |
| 3 | "But we catch blockers live" — the serendipity case | address the strongest counter honestly | #3, #4 | concedes the narrow win, bounds it |
| 4 | Price your coordination: the test | apply the frame; the reader's next action | — | resolves + acts |

**Counter-argument placement:** §3 (named, not buried). **Originality placement:** the coordination-tax frame runs H1→§4; §1's real cost calc anchors it.

---

## Layer 3 — draft (opening + the frame, excerpt)

> **Your standup is a coordination tax.** Six engineers, fifteen minutes, every weekday — that's 31.5 hours of senior engineering time a month [#1], not counting the context-switch that fractures the morning's deep work [#2]. You're paying that bill daily. The question nobody asks is: what coordination are you actually buying for it?
>
> Here's the uncomfortable part. Walk through last week's standups. How many "updates" were already sitting in the tracker — the ticket moved, the PR opened, the blocker flagged in the channel? [#4] The standup didn't *produce* that coordination; it re-read it aloud. You paid a meeting's price for a status page you already had.
>
> [§3] "But we catch blockers live." Sometimes — and that's the one thing a standup does that async doesn't replace for free. But look closely: most of those blockers were visible before the meeting; the standup just forced someone to finally look. [#4] You can buy that forcing function for far less than a daily all-hands...

(Full draft continues per the outline.)

---

## Critic — Cycle 0 (FAIL)

The first draft delivered §1's cost calc well but wrote §2–§3 as the **consensus** ("async saves time, use it for distributed teams") and never developed the coordination-tax frame past the headline.

```
## Verdict: FAIL
### Failures
#### Failure 1
Dimension/Gate: Originality (hard gate — ≥5 floor)
Issue: §2–§3 restate the Consensus baseline ("async saves time", "it depends") verbatim.
  The coordination-tax frame appears only in the H1 and is never developed — the prose
  could appear on any competitor's blog. Originality scored 3 (below the 5 floor).
Fix: Develop the coordination-tax frame as the spine: §2 must show the "you already had
  the coordination" mechanism using ledger #4; §3 must BOUND the serendipity win with the
  frame ("what does this unit of coordination cost?"), not concede generically.
Agent to re-dispatch: draft
### What Passed
Thesis clarity (the tax framing is sharp), Evidence quality (§1 cost calc is concrete and
sourced), structural spine (the outline is sound — this is a delivery failure, not a
structure failure, so re-dispatch draft not outline).
```

## Critic — Cycle 1 (PASS)

draft developed the frame through §2–§4 (the excerpt above). Re-scored, **Originality first**:

| Dimension | Score (/7) | Note |
|-----------|-----------|------|
| Originality | 6 | the coordination-tax frame is load-bearing H1→§4 and clearly beats the 3 consensus bullets — clears the ≥5 floor |
| Thesis clarity | 7 | tax thesis stated up front, defended throughout |
| Structural integrity | 6 | one-line spine; §3 bounds the counter; no filler |
| Evidence quality | 6 | #1 calc concrete + sourced; counter addressed head-on in §3 |
| Reader-fit | 6 | Solution-Aware EM altitude; their language ("blocker", "tracker", "context-switch") |
| Prose quality | 6 | point of view, concrete, no empty intro; minor hedges flagged for humanmaxxing |
| Search/AEO-readiness | 5 | maps to "async vs sync standups" intent; answer-up-front present; not stuffed |
| **Total** | **42/49** | ≥36, every dim ≥4, Originality ≥5 |

Hard gates: Originality ≥5 ✓ · every claim cited/tagged, zero invented stats ✓ · thesis defended + counter addressed ✓ · no filler ✓. **Verdict: PASS.** (Terminal humanmaxxing pass flagged for the hedge residue.)

---

## The anti-collapse proof — this is NOT write-copy

Asked "write a blog post about async vs sync standups", `write-copy` (or a base model) produces a clean, on-brand piece whose body is the three consensus bullets in nice prose: "standups are fine if short; async saves time for distributed teams; it depends on your team." Polished. On-voice. **Zero delta over the first page of search.** It would have scored well on prose and thesis and FAILED Originality at 3 — and `write-copy` has no Originality gate to catch it.

`write-longform` instead: ran a **research stage first** that named the consensus baseline and stress-tested the thesis against its strongest counter; committed an **argument spine** where each section earns the next and the counter has its own bounded section; and gated on an **Originality floor** that FAILed the cycle-0 draft precisely because it had collapsed into consensus prose. The "coordination tax" frame + the real per-team cost calc are what a base model wouldn't volunteer — and the critic's first-scored dimension is the one that guarantees the piece carries them. That sequence (research → outline → draft → originality-gated critic) is the structural difference write-copy cannot replicate, which is exactly why this is a separate discipline and not write-copy plus a pack.
