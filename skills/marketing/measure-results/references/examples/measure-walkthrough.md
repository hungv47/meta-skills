# Worked Example — Product Hunt launch read (loop closed)

**Input (operator paste):** "PH launch yesterday: finished #3 for the day, 412 upvotes, 88 comments, ~6k product-page views, 140 signups from the PH referral. We posted at 12:01 PT, pinned the founder first-comment, replied to every comment. Didn't line up a hunter; gallery led with the demo loop."

**Channel:** producthunt · **pack_verified:** 2026-06-16 (current).

## 1. Metric Ingest → normalized table
| Metric | Value | Unit | vs Expected | Confidence |
|---|---|---|---|---|
| Daily rank | 3 | leaderboard | target top-5 ✓ | reported |
| Upvotes | 412 | count | — | reported |
| Comments | 88 | count | — | reported |
| Page views | ~6,000 | count | — | estimated |
| Referral signups | 140 | count | target 100 ✓ | reported |
| Signup CVR | 2.3% | rate | — | derived (140/6000) |

Gaps: no hour-by-hour upvote curve (can't confirm first-4-hour velocity directly).

## 2. Diagnosis (against the producthunt pack)
**Attribution**
| Result | Pack tactic/signal | Support | Confidence |
|---|---|---|---|
| Rank 3 | first-comment + all-day maker presence (§5.6/§5.8) → comment velocity (§3.2) | 88 comments, every one replied | correlational |
| 140 signups | demo-loop gallery slot 1 (§1 Angle 3) → page dwell → CVR | 2.3% CVR on 6k views | correlational |
| Top-5 hit | 12:01 PT go-live (§6) full runway | live before cohort | causal-plausible |

**What worked:** first-comment + maker presence (88 comments replied; §5); demo-loop gallery (2.3% CVR; §1.3); 12:01 PT timing (§6).
**What failed / untested:** no hunter lined up (§3.4) — can't tell if it cost reach (no counterfactual); no upvote-curve data → first-4-hour velocity (§3.1) is *assumed*, not shown. Page views are estimated.
**Keep / Drop / Test:** Keep first-comment + 12:01 PT + demo-loop. Test: hunter vs no-hunter next launch (the open question). Drop: nothing. Instrument the upvote curve next time.
**Hypothesis verdicts:** "first-comment drives comment velocity" → confirmed (correlational). "demo-loop converts" → confirmed. "we don't need a hunter" → inconclusive (no counterfactual).

## 3. Pack Feedback → write-backs
**Changelog row appended to `producthunt.md`:**
```
| 2026-06-16 | Launch read: rank 3 / 412 up / 140 signups. first-comment + 12:01 PT + demo-loop confirmed (2.3% CVR). No hunter → effect unknown (no counterfactual). first-4-hour velocity assumed (no curve). Keep §5.6/§6/§1.3; TEST hunter vs none. | measure-results |
```
**Performance row** → `.forsvn/performance/producthunt.tsv`.
**Hosted feed** → entitled, so POST `{platform:"producthunt", what_worked:"first-comment+12:01 PT+demo-loop", numbers:{rank:3,upvotes:412,signups:140,cvr:0.023}}`.

## 4. Critic → 42/50 PASS
Attribution 9, Falsifiability 8 (CVR derived, curve gap named), Honesty 9 (hunter + curve gaps stated), Actionability 8 (hunter test), Write-back 8 (append-only, dated). PASS → write-backs commit. The **next** PH launch reads this entry and starts with "test hunter" as its hypothesis — the loop closed.
