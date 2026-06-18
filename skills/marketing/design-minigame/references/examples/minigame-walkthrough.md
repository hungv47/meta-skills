# Worked Example — launch spin-the-wheel for an email list

**Brief:** Spin-the-wheel on the launch landing page. Goal: grow the launch email list. Metric: emails captured + → trial. Reward: discounts + content. Capture: email. Brand: FORSVN.

## Concept
A one-tap spin on the launch page; everyone wins *something* (true), the email is the value-exchange to claim. Goal: list growth → trial.

## Mechanic
- **One action:** tap "Spin". The wheel resolves server-side (outcome decided on the server — prizes have cost).
- **Win condition:** instant, unambiguous — the wheel lands on a real segment.
- **Outcome set + honest odds:** 50% "Pro free for a month", 30% "the launch guide (PDF)", 18% "10% off Pro", 2% "first year of Pro free". All real. Odds stated in the T&Cs.
- **Replay/virality:** one spin per email; "share to unlock a second spin" (serves list growth).
- **Fairness:** server-decided outcome; client can't pick the prize.

## Reward Economics
| Tier | Odds | Unit cost | Note |
|---|---|---|---|
| Pro free 1mo | 50% | ~$9 deferred | a trial anyway — low true cost |
| Launch guide | 30% | ~$0 | content |
| 10% off | 18% | margin | discount |
| 1yr Pro free | 2% | ~$108 | the rare hero prize |
Expected cost/play ≈ low (most prizes are trial/content); **redemption cap:** 50 "1yr free" total, then it rolls to "1mo free" — a viral spike can't blow the budget.

## Funnel
Land → tap Spin → win → **"Where do we send your prize?" (email)** → claim → onboard to trial → Pro offer. `capture_mode: email`. Capture is AFTER the fun, framed as the prize delivery.

## Compliance Flags
Prize draw with odds + value → surface: T&Cs with stated odds, "no purchase necessary", age gate (18+), jurisdiction check (some regions restrict sweepstakes). Flagged for the operator — not legal advice.

## Build Notes
States: idle / spinning / win / claimed. Accessibility: keyboard "Spin", non-color win states, reduced-motion (instant resolve, no spin animation). Outcomes server-decided.

## Measurement Hooks
Plays · spin-completion · email-capture rate · prize-redemption · trial-start from claim (what `measure-results` reads).

## Critic → 42/50 PASS
Goal fit 9, One-action fun 9 (fun before the email), Honest mechanics 9 (real odds + prizes, stated), Reward economics 8 (capped hero prize), Funnel 7 (`done_with_concerns` until compliance T&Cs are operator-confirmed). PASS — ships with the compliance flag.
