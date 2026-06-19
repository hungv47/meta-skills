<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: linkedin-launch
schema_version: 2
pack_type: launch-channel
last_verified: 2026-06-19
verifier: claude
status: draft
source_basis: "Per-claim categorical citations inline (LinkedIn engineering/help posts + the Ordinal 900K-post link-tax study + practitioner-cohort consensus). LinkedIn's feed ranking (dwell + early engagement) is directionally LinkedIn-stated; exact weights unpublished — tagged secondary unless LinkedIn-stated."
summary: "LinkedIn launch playbook: post the announcement from your personal profile (not the Company Page), hook in the first two lines before the 'see more' fold, put the external link in the first comment to dodge the reach tax, and earn comments in the first 60–90 minutes — dwell + early comments decide reach."
---

# Platform Intelligence — LinkedIn launch (founder announcement post)

Practitioner-grade reference for **launching a product with a LinkedIn post** — consumed by
`plan-campaign`, `write-launch`, `publish-social`, and the launch chains to ground the announcement
post, the link-placement decision, the reach signals, and the anti-patterns that suppress a launch.
**This is the launch-day *event* pack** — for ongoing LinkedIn feed growth (the steady-cadence content
engine) see the `linkedin` shortform/feed pack; this pack is the one-shot announcement.

LinkedIn launch is a **launch-channel pack**: the unit of work is a *single high-stakes announcement
post* (often a founder's "I'm launching X today"), not an ongoing feed cadence. The whole outcome
turns on the **first 60–90 minutes** of engagement and on not paying the **external-link reach tax** —
so this pack is dominated by its **Playbook (§5)**, **Timing (§6)**, and a hard link-placement guard (§4).

Two things every consuming skill must respect:

1. **The link does not go in the post body.** An external link in the primary text suppresses reach
   (the algorithm favors keeping users on-platform); the launch link goes in the **first comment**,
   with the post body pointing to it (§4 hard guard).
2. **Post from the personal profile, not the Company Page.** Personal-profile posts consistently
   out-reach Page posts organically; a founder launch rides the person, then routes to the Page.

When `last_verified` exceeds 90 days, the critic flags `DONE_WITH_CONCERNS` — LinkedIn retunes feed
ranking and link handling periodically; re-verify before a real launch.

---

## 0. When NOT to Launch Here

> **Channel-fit veto.** `plan-campaign` reads this section as a real *"don't launch here."* When the
> campaign's product, ICP, goal, or growth motion matches a condition below, the channel is **vetoed**
> (skipped, with the cited reason) unless the operator records an explicit override. This is the
> marketer who says *no*.

- **Consumer / B2C product** whose buyers aren't in a professional context — LinkedIn is B2B / professional.
- **No personal-profile audience and no time** to work the 60–90-min golden window — a cold Company-Page-only launch underdelivers.
- **Meme / viral-culture play** that fits X or TikTok, not LinkedIn's professional register.
- **Stealth / privacy-sensitive launch** — LinkedIn ties the launch to your real professional identity + network.
- **Younger, non-professional audience** with little LinkedIn presence.

---

## 1. Launch Angles (Hook Taxonomy, reframed for a LinkedIn launch)

On the feed the **hook** is the first two lines that survive the "…see more" truncation (~140 chars
on mobile) and earn the expand. Minimum 3 launch-native angles. These overlap the six base archetypes
(`../hook-archetypes.md`) only in surface.

### Angle 1 — The personal-stakes opener (the "why this mattered to me")

- **Definition:** The first two lines lead with a personal, specific stake — what you left, risked, or
  kept hitting — not "Excited to announce". The product reveal comes after the expand.
- **Identifying signal:** Line 1 is a concrete first-person statement that creates a curiosity gap and
  survives the fold; no corporate "We are thrilled to…" opener; the ask/link is deferred.
- **Pattern examples A:** "Two years ago I quit a job I loved to fix one problem. Today it's real." —
  the expand delivers the launch. [pattern-derived from high-reach founder launches]
- **Pattern examples B:** "I've rewritten this product three times. Here's the version I'm finally
  proud to ship." [pattern-derived]
- **Engagement-signal rationale:** Reach is gated by dwell + the expand; a personal-stakes hook earns
  the "see more" click and the early comments that the first-90-minutes window rewards.
- **Best for:** founder brand_mode, a genuine origin story. **Highest-leverage angle.**

### Angle 2 — The build-in-public reveal (the journey receipts)

- **Definition:** The post frames the launch as the payoff of a visible journey — "I've posted about
  building this for months; it's live" — leaning on an audience that watched it form.
- **Identifying signal:** References the build journey; often a carousel/document or native video
  showing before/after; thanks the people who followed along.
- **Pattern examples A:** A 6-slide document (carousel) walking from the problem to the shipped thing,
  ending on the link-in-comment pointer. [pattern-derived; documents earn high dwell]
- **Engagement-signal rationale:** A document/carousel maximizes dwell (swipe time) — a top reach
  input — and the journey framing converts an existing audience into early commenters.
- **Best for:** founders who've built in public; visual/demoable products.

### Angle 3 — The lesson-led launch (value first, product second)

- **Definition:** The post leads with a genuinely useful lesson from building the thing; the launch is
  the closing line, not the headline.
- **Identifying signal:** The body teaches something standalone (a hard-won insight, a mistake);
  product mention is the last beat; link in the first comment.
- **Pattern examples A:** "5 things I got wrong building [category]. (We launched the fix today — link
  below.)" [pattern-derived]
- **Engagement-signal rationale:** Value-first posts earn saves + comments from people who'd ignore a
  pure announcement, widening the early-engagement base that drives reach.
- **Best for:** B2B/professional audiences; founders with domain authority.

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Prefer numeric.

| Constraint | Value | reference |
|---|---|---|
| Hook (pre-fold) | first **~140 chars** (mobile "…see more"); ~210 on desktop | LinkedIn UI |
| Post text | ≤**3,000 chars** hard cap; most launches use 600–1,300 | LinkedIn |
| External link | **in the first comment, not the body** (body-link reach tax) | Ordinal 900K-post study + cohort |
| Best media | native **document (carousel)** or native **video**; both out-reach a plain link | cohort / LinkedIn |
| Document (carousel) | PDF up to ~300 pages practical; 5–10 slides typical; 1080×1080 or 1920×1080 | LinkedIn |
| Native video | ≤10 min practical; captions on (sound-off viewing); square/vertical | LinkedIn |
| Hashtags | 3–5 relevant; not a wall | cohort |
| @-mentions | tag people who will genuinely engage; over-tagging reads as spam | cohort |
| Posting identity | **personal profile** for reach; cross-share to the Company Page after | cohort |
| Edit window | editing soon after posting is fine; don't delete/repost for reach | cohort |

The constraints that bite: the **link-in-body reach tax** (move it to the first comment) and the
**~140-char pre-fold hook** (the launch reveal must survive the truncation).

---

## 3. Ranking Signals (Ranked by Impact)

LinkedIn states ranking favors dwell + meaningful engagement; exact weights are unpublished. Weights
below are practitioner-cohort consensus (secondary) unless marked LinkedIn-stated.

1. **First 60–90-min engagement velocity** — comments + reactions soon after posting tell the feed to
   expand distribution. *Why:* the "golden window" seeds reach to second-degree connections. *Lever:*
   post when your network is active (§6); open with a hook that earns comments. *Tier:* secondary (cohort).
2. **Dwell time** — time spent on the post (reading the body, swiping a document, watching video) is a
   first-class input. *Lever:* a document/carousel or native video; a hook that earns the expand.
   *Tier:* secondary / LinkedIn-stated that dwell matters.
3. **Comments > reactions** — a comment (especially a thread you reply to) weighs more than a like.
   *Lever:* end on a genuine question; reply to every comment in the first hours. *Tier:* secondary.
4. **Link-out penalty (negative)** — an external link in the body suppresses reach vs the same post
   with the link in the first comment. *Lever:* link in comment 1. *Tier:* secondary (study-backed).
5. **Dwell-killing engagement bait (negative)** — overt "comment X / tag 3 / like if" is detected and
   down-ranked. *Lever:* earn engagement, don't beg it. *Tier:* secondary (LinkedIn-stated bait demotion).
6. **Creator consistency / audience fit** — accounts that post consistently to an engaged niche reach
   further. *Lever:* the ongoing-feed pack handles this; a launch borrows the audience it built. *Tier:* secondary.

Cap interpretation at these ~6. Reaction *count* alone is not the signal — **early comment velocity × dwell**, minus the link/bait penalties, is.

---

## 4. Anti-Patterns

The first two rows are **hard guards**: publish-blocking. A consuming emitter (`write-launch`) must
fail the bundle if the post body carries the external link or any copy uses engagement bait.

| Pattern | Penalty observed | Detection rule | Source |
|---|---|---|---|
| **External link in the post body** | Reach suppressed vs link-in-comment | The primary text contains a `http(s)://` link instead of deferring it to the first comment | Ordinal study (primary-ish) |
| **Engagement bait** ("comment X below", "tag 3 friends", "like if you agree") | Algorithmic down-rank | Copy contains a bait imperative soliciting a mechanical action | LinkedIn (stated bait demotion) |
| **Corporate "thrilled to announce" opener** | Weak hook → no expand → low reach | First line is a press-release cliché with no personal stake | cohort |
| **Company-Page-only launch** | Lower organic reach than a personal post | The launch posts only from the Page, not a personal profile | cohort |
| **Hook buried below the fold** | The reveal is truncated; no expand | The launch point/hook appears after ~140 chars | LinkedIn UI |
| **Tag spam** (mass @-mentions for reach) | Reads as spam; low quality signal | Many @-mentions of people unlikely to engage | cohort |
| **Delete-and-repost for reach** | Resets engagement; can read as manipulation | Same post deleted and reposted shortly after to "retry" | cohort |

"Don't be salesy" is not an anti-pattern. "If the post body contains a URL, or contains 'tag 3' /
'comment ... below' / 'like if', the bundle fails the check" is.

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic:** a personal-stakes hook in the first two lines, the external link in the
first comment (not the body), posted from your personal profile in your network's active window — then
you reply to every comment in the first 60–90 minutes. Dwell + early comments decide reach; the
body-link tax and engagement bait quietly kill it.

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | Pick the asset | T−3d | Decide: document/carousel, native video, or text. Default to a document or video (higher dwell) for a launch. | An asset that earns swipe/watch time |
| 2 | Write the pre-fold hook | T−2d | First two lines = a personal, specific stake that survives ~140 chars and creates a curiosity gap. No "thrilled to announce". | A skeptic clicks "see more" |
| 3 | Write the body + comment link | T−2d | Body delivers the launch + ends on a genuine question; the external link goes in a **prepared first comment**, with the body saying "link in the comments". | Body carries no URL; comment-1 link ready |
| 4 | Line up early engagers | T−1d | Tell a handful of peers the post is coming so real comments land in the first 30 min (genuine engagement, not pods). | A few people ready to genuinely comment at go-live |
| 5 | Post from the personal profile | T−0 (active window) | Publish from your profile in the network's active window (§6); immediately add the first comment with the link. | Live; link in comment 1 within ~1 min |
| 6 | Work the golden window | T+0 → T+90m | Reply to every comment substantively; ask follow-ups to deepen threads; react to early commenters. | High reply rate; threads, not one-liners, in the first 90 min |
| 7 | Cross-share to the Page + audience | T+0 → T+all-day | Re-share to the Company Page; notify your email/other channels as news linking the thing. | Reach beyond the profile without bait |
| 8 | Measure + feed the pack | T+24–48h | Record impressions, dwell, comments, profile/site clicks, signups → `/measure-results`. | Dated what-worked/what-failed entry; click→signup delta recorded |

---

## 6. Timing & Cadence

- **Best window:** weekday mornings in your audience's dominant timezone — **Tue–Thu ~8–10am** local
  is the contested professional-feed slot. Verify against your own audience's active hours.
- **Decision window:** the first **60–90 minutes** seed reach; a post that earns early comments keeps
  expanding, a quiet start stalls. Front-load your presence there.
- **Day-of-week:** Tue–Thu highest professional traffic; Mon is noisy, Fri/weekend quieter (less
  reach, sometimes less competition).
- **Cadence:** a launch is a one-shot announcement; reach compounds off the *ongoing* cadence the
  `linkedin` feed pack drives. Don't repost the launch — follow it with build-in-public updates.

---

## 7. CTA / Conversion Norms

The launch CTA routes attention to the link-in-comment and to a genuine reply thread — never to engagement bait.

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| Link in the first comment | Body says "link in the comments"; reach preserved | Link in the body → reach tax | Ordinal study |
| Closing question in the body | A genuine question → comment threads → reach | A bait imperative ("comment X") → demotion | LinkedIn |
| Document/carousel last slide | A clear "try it / link below" after high dwell | A hard sell before any value | cohort |
| Cross-share to the Company Page | Routes the personal post's momentum to the brand | Launching *only* from the Page | cohort |
| Profile "Featured" / headline | Passive discovery after the launch day | Relied on as the launch mechanism | cohort |

---

## 8. Open Questions / Known Unknowns

- LinkedIn's exact feed-ranking weights (dwell vs comment vs reaction) are **not published**; the
  golden-window and dwell claims are practitioner heuristics directionally confirmed by LinkedIn.
- The precise magnitude of the body-link reach tax varies by study and over time (the 900K-post study
  is one large sample, not a current LinkedIn-published number) — treat as "meaningful, move the link".
- Whether and how much the Company-Page penalty has narrowed is debated; "personal profile for the
  launch" remains the safe heuristic.
- Engagement-bait detection thresholds are opaque; "earn it, don't beg it" is the safe rule.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-06-19 | Initial LinkedIn-launch pack to the v2 launch-channel contract (S3.2), distinct from the `linkedin` feed pack. Draft — awaiting operator review + a live re-verify of LinkedIn link/bait handling before `status: reviewed`. | claude |
