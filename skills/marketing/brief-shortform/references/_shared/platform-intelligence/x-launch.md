<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: x-launch
schema_version: 2
pack_type: launch-channel
last_verified: 2026-06-19
verifier: claude
status: draft
source_basis: "Per-claim categorical citations inline (the open-sourced twitter/the-algorithm-ml ranking repo, Apr-2023 + X help + practitioner-cohort consensus). The open-sourced weights are a 2023 snapshot X has since changed; reply/early-engagement and external-link signals tagged secondary unless still-stated."
summary: "X launch playbook: a hook post that earns the first line, the external link kept out of post 1 (in a reply or later in the thread) to dodge the link down-rank, native media, and you replying to everyone in the first ~30 minutes — early reply/repost velocity from real accounts is what carries a launch."
---

# Platform Intelligence — X launch (announcement post / thread)

Practitioner-grade reference for **launching a product on X** — consumed by `plan-campaign`,
`write-launch`, `publish-social`, and the launch chains to ground the hook post, the thread, the
link-placement decision, the reach signals, and the anti-patterns that throttle a launch. **This is
the launch-day *event* pack** — for ongoing X feed growth (the steady posting engine) see the `x`
shortform/feed pack; this pack is the one-shot announcement.

X launch is a **launch-channel pack**: the unit of work is a *single announcement post (usually a
thread)*, not an ongoing cadence. The outcome turns on the **hook post** and the **first ~30 minutes**
of real engagement, and on not eating the **external-link down-rank** in post 1 — so this pack is
dominated by its **Playbook (§5)**, **Timing (§6)**, and the link/bait hard guards (§4).

Two things every consuming skill must respect:

1. **Post 1 is the whole launch.** The first post (the hook) is what 95% of viewers see; the thread
   and the link come after. If the hook doesn't earn the stop, nothing downstream matters.
2. **Keep the external link out of post 1.** A tweet whose primary content is an off-platform link is
   down-ranked vs the same launch with the link in a reply or a later thread post — for a launch you
   put the link in a reply (or post 2), with post 1 pointing to it (§4 hard guard).

When `last_verified` exceeds 90 days, the critic flags `DONE_WITH_CONCERNS` — X changes ranking and
link handling frequently and the open-sourced weights are a 2023 snapshot; re-verify before a real launch.

---

## 0. When NOT to Launch Here

> **Channel-fit veto.** `plan-campaign` reads this section as a real *"don't launch here."* When the
> campaign's product, ICP, goal, or growth motion matches a condition below, the channel is **vetoed**
> (skipped, with the cited reason) unless the operator records an explicit override. This is the
> marketer who says *no*.

- **No existing X audience and no time to build one** — a cold launch into zero followers gets near-zero first-30-min reply velocity, which is the whole game.
- **Formal enterprise / regulated** product whose buyers don't engage on X and where public banter is off-brand.
- **A long-form or visual story** better served by a LinkedIn carousel or a Show HN demo than a thread.
- **You can't be present to reply** through the launch window.
- **Non-English / region-locked audience** not active on X.

---

## 1. Launch Angles (Hook Taxonomy, reframed for an X launch)

The **hook** is post 1's first line — it must stop the scroll before the "show more" cutoff. Minimum
3 launch-native angles. These overlap the six base archetypes (`../hook-archetypes.md`) only in surface.

### Angle 1 — The "I built X" demo-led hook (the GIF is the hook)

- **Definition:** Post 1 is a tight one-liner ("I built [thing] that does [outcome]") attached to a
  native autoplaying demo GIF/video showing the core action in <6s. The thread + link follow.
- **Identifying signal:** Post 1 ≤2 lines + native media slot 1 = a real demo loop (not a logo card);
  no link in post 1; the result is visible before any click.
- **Pattern examples A:** "I got tired of [X], so I built [thing]. Here's 6 seconds of it working:" +
  a screen-recorded loop. [pattern-derived from high-reach build-in-public launches]
- **Pattern examples B:** A before/after loop for a tool that transforms something, captioned with the
  outcome. [pattern-derived]
- **Engagement-signal rationale:** Native media earns dwell + the algorithm favors on-platform media;
  a working demo earns the repost that a static announcement doesn't. **Highest-leverage angle for visual products.**
- **Best for:** demoable tools, anything with a satisfying core action; founder/indie brand_mode.

### Angle 2 — The build-in-public payoff (the journey lands)

- **Definition:** The launch is framed as the payoff of a public build — "I've been posting about
  this for months; it's live" — leaning on an audience that watched it form.
- **Identifying signal:** References the journey; thanks the people who followed; thread recaps the
  arc; link in a reply.
- **Pattern examples A:** "6 months ago this was a screenshot in a tweet. Today you can use it: 🧵"
  [pattern-derived]
- **Engagement-signal rationale:** The journey audience reposts + replies in the first minutes —
  exactly the early-velocity the launch needs — and quote-reposts from followers widen reach.
- **Best for:** founders who built in public; products with a visible arc.

### Angle 3 — The contrarian / problem-statement hook (the take that earns replies)

- **Definition:** Post 1 leads with a sharp, true problem statement or a contrarian take the product
  resolves; the launch is the thread's turn, not the headline.
- **Identifying signal:** A debatable-but-defensible first line that invites replies; the product
  arrives as the answer mid-thread; link in a reply.
- **Pattern examples A:** "Every [tool category] gets one thing wrong. I built the version that
  doesn't: 🧵" [pattern-derived]
- **Engagement-signal rationale:** Replies are a top engagement signal; a take that earns genuine
  replies (not ragebait) lifts the whole thread's velocity.
- **Best for:** opinionated founders, categories with a real incumbent flaw. Risk: keep it true, not bait (§4).

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Prefer numeric.

| Constraint | Value | reference |
|---|---|---|
| Post 1 (hook) | the first ~1–2 lines must land before "show more"; standard accounts 280 chars | X |
| Long posts | Premium accounts post longer, but the **hook still lives in the first lines** | X |
| External link | **not in post 1** — in a reply or a later thread post (link-in-post-1 down-rank) | the-algorithm-ml + cohort |
| Native media | image/GIF/video native (not a link preview); demo loop as slot 1 | cohort |
| Video | ≤2:20 standard / longer for Premium; captions for sound-off | X |
| Thread | post 1 = hook; 2–6 posts for the story/demo/how-it-works; link near the end or in a reply | cohort |
| Hashtags | 0–2; a wall of hashtags reads as spam and adds little | cohort |
| @-mentions | tag genuine co-builders/relevant accounts; over-tagging is spam | cohort |
| Alt text | add alt text to media (accessibility + minor signal) | X |

The constraints that bite: **the link out of post 1** (or eat the down-rank) and **the hook in the
first lines** (everything past "show more" is unseen by most).

---

## 3. Ranking Signals (Ranked by Impact)

The open-sourced `the-algorithm-ml` (Apr-2023) is the only published snapshot; X has changed weights
since. Below: that snapshot + cohort consensus, tagged secondary unless still X-stated.

1. **Early engagement velocity (replies ≫ reposts ≫ likes)** — engagement in the first minutes, with
   **replies weighted highest** in the 2023 weights, signals a live post and expands reach. *Lever:*
   a hook that earns replies; you reply to everyone fast. *Tier:* secondary (2023 snapshot).
2. **Author replies / conversation** — the author replying (and getting replies back) compounds the
   thread; a 2-way conversation outweighs one-way broadcast. *Lever:* be present, answer every reply.
   *Tier:* secondary.
3. **Native media dwell** — on-platform image/GIF/video earns dwell and is favored over a bare link.
   *Lever:* lead with a demo loop. *Tier:* secondary.
4. **External-link down-rank (negative)** — a post whose payload is an off-platform link reaches less
   than the same launch with the link deferred. *Lever:* link in a reply/post 2. *Tier:* secondary (cohort + snapshot).
5. **"Negative feedback" (mutes/blocks/"not interested"/reports)** — heavily weighted *against* in the
   2023 weights; bait and rage tank reach. *Lever:* no engagement bait, no rage. *Tier:* secondary (2023 snapshot).
6. **Author reputation / follower graph** — established, followed accounts reach further; a launch
   borrows the audience the ongoing feed built. *Lever:* the `x` feed pack builds it. *Tier:* secondary.

Cap interpretation at these ~6. Like *count* alone is not the signal — **early reply velocity × media dwell**, minus the link/negative-feedback penalties, is.

---

## 4. Anti-Patterns

The first two rows are **hard guards**: publish-blocking. A consuming emitter (`write-launch`) must
fail the bundle if post 1 carries the external link or any copy uses engagement bait.

| Pattern | Penalty observed | Detection rule | Source |
|---|---|---|---|
| **External link in post 1** | Reach down-ranked vs link-in-reply | Post 1's primary payload is a `http(s)://` link instead of a reply/later-post | the-algorithm-ml + cohort |
| **Engagement bait** ("RT to win", "like + follow", "comment X", "tag a friend") | Negative-feedback weighting + platform-manipulation risk | Copy contains a bait imperative soliciting a mechanical repost/like/follow | X rules (manipulation) |
| **Hook buried** (link/CTA before the value in post 1) | No scroll-stop → thread unseen | Post 1 leads with the ask/link rather than the hook | cohort |
| **Logo-card media slot 1** (no demo) | Lower dwell → lower reach | Media slot 1 is a static brand card, not a product/demo frame | cohort |
| **Hashtag wall** (5+ hashtags) | Reads as spam; negligible reach gain | Post carries a wall of hashtags | cohort |
| **Rage / false-contrarian bait** | Negative-feedback (mute/block/report) tanks reach | A first line engineered to anger rather than inform | the-algorithm-ml (neg. weight) |
| **Reply-spamming the launch into unrelated threads** | Spam flags; mutes | Dropping the launch link into unrelated popular threads | X rules |

"Don't be spammy" is not an anti-pattern. "If post 1 contains a URL, or any copy contains 'RT to' /
'like + follow' / 'tag a friend', the bundle fails the check" is.

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic:** a hook post 1 that earns the first line with a native demo loop, the
external link kept out of post 1 (reply or post 2), posted in your audience's active window — then you
reply to everyone in the first ~30 minutes. Early reply/repost velocity from real accounts carries an
X launch; a link-led post 1 and engagement bait throttle it.

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | Cut the demo media | T−3d | Screen-record a <6s loop of the core action; add captions/alt text. This is post 1's media. | A loop that shows the outcome in one glance |
| 2 | Write the hook (post 1) | T−2d | One–two lines that earn the stop (Angle 1/2/3); no link, no bait; media attached. | A skeptic stops scrolling on the first line |
| 3 | Write the thread | T−2d | 2–6 posts: the problem → the demo → how it works → the link (near the end or in a prepared reply). | Each post stands; the link is deferred out of post 1 |
| 4 | Line up real early engagers | T−1d | Tell a few genuine peers/co-builders the drop time so real replies land in the first minutes (not pods/bots). | A handful ready to genuinely reply at go-live |
| 5 | Post the hook | T−0 (active window) | Publish post 1 + media in the active window (§6); immediately continue the thread. | Live; thread continuous; no link in post 1 |
| 6 | Drop the link in a reply/post 2 | T+0:01 | Add the link as a reply or the next thread post, with post 1 pointing to it ("link below"). | Link present, out of post 1 |
| 7 | Work the first 30 minutes | T+0 → T+30m | Reply to every reply fast; ask follow-ups; quote-repost good replies; thank, don't beg. | High reply rate; conversation, not broadcast |
| 8 | Cross-post as news | T+0 → all-day | Share to LinkedIn/HN/communities as "I shipped [thing]"; pin the launch thread to your profile. | Reach beyond X without bait; thread pinned |
| 9 | Measure + feed the pack | T+24h | Record impressions, replies, reposts, link clicks, signups → `/measure-results`. | Dated what-worked/what-failed entry; click→signup delta recorded |

---

## 6. Timing & Cadence

- **Best window:** weekday, your audience's active hours — for a US tech audience **~9am–noon ET** or
  the early-evening window. Verify against your own analytics; a launch into a dead window wastes the hook.
- **Decision window:** the first **~30 minutes** of reply/repost velocity decide whether the post
  keeps expanding; front-load your presence there.
- **Day-of-week:** weekday tech-Twitter is most active; weekends are quieter (less reach, sometimes
  less noise). Avoid launching into a major-news window that will bury you.
- **Cadence:** a launch is a one-shot thread; reach compounds off the *ongoing* posting the `x` feed
  pack drives. Pin the launch thread; follow with build-in-public updates, not reposts of the launch.

---

## 7. CTA / Conversion Norms

The launch CTA defers the link out of post 1 and earns the share through the hook — never engagement bait.

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| Link in a reply / post 2 | Post 1 says "link below"; reach preserved | Link is post 1's payload → down-rank | the-algorithm-ml + cohort |
| End-of-thread "try it: [link]" | After the demo earned the interest | Before any value is shown | cohort |
| Pinned launch thread | Passive discovery for profile visitors all day | Relied on as the only reach | cohort |
| Quote-repost of good replies | Amplifies real conversation + reach | Used to argue with critics | cohort |
| "Would love your feedback" ask | Genuine, invites replies (top signal) | "RT to win / like + follow" bait → negative weighting | X rules |

---

## 8. Open Questions / Known Unknowns

- The open-sourced weights are an **Apr-2023 snapshot**; X has changed ranking since and not
  re-published — the reply≫repost≫like ordering and the negative-feedback weighting may have shifted.
- The exact magnitude of the external-link down-rank is unpublished and has varied over time; "keep
  the link out of post 1" is the safe heuristic, not a fixed number.
- Whether Premium/verification materially boosts reach for a launch is debated and changes; treat as a
  minor factor, not the strategy.
- Bot/pod engagement is detected and discounted to an unknown degree; "real accounts only" is the safe rule.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-06-19 | Initial X-launch pack to the v2 launch-channel contract (S3.2), distinct from the `x` feed pack. Draft — awaiting operator review + a live re-verify of X link/ranking behavior before `status: reviewed`. | claude |
