<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: shorts
schema_version: 2
pack_type: shortform-video
last_verified: 2026-06-18
verifier: agent
source_basis: "Per-claim categorical + named-source inline. Ranking pillars cited to YouTube's official blog.youtube 'Shorts truths' (May 2025) + Help docs; view-counting + format caps cited to support.google.com; engagement benchmarks cited to Socialinsider (Jan 2024–Aug 2025). Numeric VVSA/retention thresholds, cadence, and hook-uplift %s are [practitioner consensus] — the mechanism is YouTube-stated, the numbers are not."
status: reviewed
summary: "YouTube Shorts: the feed ranks on the viewed-vs-swiped-away ratio — frame-1 must stop the swipe like a thumbnail; Shorts and long-form run on separate recommendation systems, so a Short never hurts the long-form rail."
---

# Platform Intelligence — YouTube Shorts

Practitioner-grade reference consumed by `brief-shortform`, `write-social`, `publish-social`, and
the shortform chains to ground hooks, format compliance, algorithm fit, and anti-pattern checks for
**YouTube Shorts**. **Not generic short-form advice.** Every claim is distilled into an operating lever.

Shorts behaves differently from TikTok/Reels because it sits inside YouTube's long-form ecosystem.
Two facts YouTube has now stated **officially** reshape how a Short must be built (blog.youtube,
"Debunking common myths about YouTube Shorts," May 2025):

1. **Shorts and long-form use separate recommendation systems** that understand cross-format
   viewing — and **there is no evidence Shorts hurt long-form**. The old "Shorts will cannibalize
   my main channel" fear is myth; the two rails are matched independently per viewer, then bridged.
2. **The primary swipe-feed ranking signal is the viewed-vs-swiped-away ratio (VVSA)** — of the
   impressions delivered to the feed, did the viewer watch or swipe past in the first beat. Frame-1
   must function the way a long-form thumbnail does: it earns the *stop*, not just the watch.

When this doc's `last_verified` exceeds 90 days, `validate-packs.ts` warns and the consuming critic
flags `DONE_WITH_CONCERNS` — YouTube retunes Shorts ranking, monetization, and policy regularly, so
re-verify before publishing. A Pro client is served the current pack from the freshness pipeline.

---

## 1. Hook Taxonomy

Shorts inherits the base-6 hook archetypes (`../hook-archetypes.md`) but its position inside
YouTube's long-form ecosystem creates platform-native variants the brief must spec for. The four
below describe what the *opening* must accomplish given that (a) the viewer is in a swipe-decision
feed with a ~1–2s budget, (b) a Short may surface on the Shorts shelf where a thumbnail + title are
visible *before* playback, and (c) Shorts can feed the channel's long-form rail.

### Archetype 1 — Channel-flywheel hook

- **Definition:** A Short whose opening previews or fragments a long-form video on the same channel,
  with the long-form linked (Related Links / description) so engaged Shorts viewers route into the rail.
- **Identifying signal:** First 2s names a deliverable that cannot fit in a Short ("here's the
  3-minute version — full breakdown linked"), or fragments a long-form scene; a Related Links pill
  appears near the bottom of the player linking to the long-form.
- **Pattern examples A:** "I spent 24 hours in [extreme setting] — full video on my channel" — the
  fragment-the-long-form opening. [pattern-derived from large mega-channel Shorts cohort]
- **Pattern examples B:** A how-to Short that ends "...the full 12-step walkthrough is linked below"
  and routes to the long-form tutorial. [pattern-derived from education-channel cohort]
- **Engagement-signal rationale:** Because the two recommendation systems are *separate* but
  cross-format-aware (YouTube-stated, §3), a Short that earns a long-form click is a positive
  cross-format signal — and long-form watch time monetizes at a materially higher RPM than the
  Shorts feed (`[practitioner consensus]` on the RPM gap; YouTube does not publish per-format RPM).
- **Best for:** Established channels with a long-form library; education/expertise niches;
  founder-mode where audience compound beats standalone Short virality.

### Archetype 2 — Loop-bait Short

- **Definition:** A Short engineered so the final frame connects visually or narratively to the first
  frame, producing replays — and **a view is counted every time a Short starts to play or replay,
  with no minimum watch time** (YouTube, effective March 2025).
- **Identifying signal:** Final ~0.5–1s frame mirrors frame-1; the closing line completes only on
  loop; short total duration so the loop comes around fast; no hard end-card that breaks the loop.
- **Pattern examples A:** Satisfying-process Shorts where the last frame ("the door closes") re-cues
  the open ("a door opens"). [pattern-derived from oddly-satisfying / process niches]
- **Pattern examples B:** Closing on "...wait, did you catch the part where—" (cut to silence; loop
  restarts and the viewer rewatches to catch the missed beat). [pattern-derived from micro-narrative cohort]
- **Engagement-signal rationale:** Since the March 2025 counting change, each replay is a counted
  view, so replay-friendly structure compounds view-count directly — looped Shorts can register
  >100% retention in analytics because segments are rewatched in one session. The *mechanism*
  (loop/replay is a stated secondary swipe-feed signal, §3) is YouTube-confirmed; specific
  replay-rate uplift figures are `[practitioner consensus]`.
- **Best for:** Visual / process / ASMR / satisfying / micro-narrative niches; product demos with a
  "before → after → before" arc; brand-mode where view-count is the KPI.

### Archetype 3 — Shelf-style preview hook

- **Definition:** A Short whose first frame is composed and titled to function as a thumbnail +
  headline pair on the Shorts shelf (Home, Search, channel-page carousel), where a static thumbnail
  and the first chars of title render before any swipe-in.
- **Identifying signal:** Frame-1 has thumbnail-grade composition (high-contrast face, bold text
  overlay, single focal subject) rather than feed-style "drop into action"; the title is written
  headline-first ("The 5-second rule that ended my procrastination"), not stream-of-consciousness.
- **Pattern examples A:** A 3-word burned-in caption over a face-on shot — "Stop. Doing. This." —
  composed to survive thumbnail compression on the shelf card. [pattern-derived from productivity cohort]
- **Pattern examples B:** "Most people get this 100% wrong" as a frame-1 text overlay, title + frame
  designed as a unit for the home-shelf carousel. [pattern-derived from finance/career cohort]
- **Engagement-signal rationale:** The shelf introduces Shorts to viewers who never enter the
  dedicated Shorts feed; they make a thumbnail-and-title click decision *before* playback, so frame-1
  and title must work like a long-form thumbnail does. The exact feed-vs-shelf traffic split is not
  published — see §8.
- **Best for:** Channels already getting Home/Suggested impressions; education/explainer niches; any
  Short whose click decision happens before the swipe window.

### Archetype 4 — Title-and-thumbnail-hybrid hook

- **Definition:** A Short where the opening 1–2s burns in oversized text that *is* the thumbnail when
  the Short surfaces on the shelf and *is* the hook when it plays in feed — frame-1 does double duty.
- **Identifying signal:** Frame-1 text is large (≈≥48px on a 1080×1920 frame), states the thesis
  verbatim (not a label), uses a single high-contrast background block, and the speaker delivers the
  same line aloud or stays visually subordinate to the text for the first second.
- **Pattern examples A:** "I tried this for 30 days" with the text slammed against the face, occupying
  ~40% of the frame. [pattern-derived from challenge/experiment cohort]
- **Pattern examples B:** "Did you know this one technique can double your output?" as text-over-face
  on the opening frame. [pattern-derived from education-creator cohort]
- **Engagement-signal rationale:** A frame-1 that *is* the headline hits both the swipe-decision
  moment in feed (VVSA, §3) and the thumbnail-render moment on shelf without splitting effort.
  Specific "immediate-hook retention uplift" percentages are `[practitioner consensus]`, not stated.
- **Best for:** Hooks built around a single thesis or claim; educational/expertise creators; any
  Short that must perform across feed, shelf, and share contexts.

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Prefer numeric.

| Constraint | Value | reference |
|---|---|---|
| Duration hard cap (current) | **3 minutes (180s)** for videos uploaded on/after Oct 15, 2024; Dec 8, 2025 for Official Artist Channels. Not retroactive. | support.google.com/youtube/answer/15424877 |
| Duration hard cap (legacy) | 60s for uploads before Oct 15, 2024 | support.google.com/youtube/answer/15424877 |
| Qualifying aspect ratio | **Square or vertical, aspect ≥ 1:1** — landscape is excluded and classified as long-form | support.google.com/youtube/answer/15424877 |
| Shorts classification | Auto-classified by **upload date + dimensions**; **no `#Shorts` tag required** | support.google.com/youtube/answer/15424877 |
| In-app camera cap | **60s** in the in-app Shorts camera; the 3-min limit applies to **file uploads** | blog.youtube "Tall updates coming to Shorts" |
| Resolution recommended | 1080×1920 (vertical) | [practitioner consensus] |
| Duration sweet spot | 15–30s for retention-led; 40–60s when content sustains it | [practitioner consensus] |
| Title character limit | 100 characters (hard cap); first ~70 visible on shelf cards | [practitioner consensus] |
| Description character limit | 5,000 characters total; only the first ~100–125 show above the fold | [practitioner consensus] |
| Hashtag count limit | Max **15** hashtags per video — YouTube ignores all hashtags if a video exceeds 15 | support.google.com (hashtag policy) |
| Hashtag norm | 3–5 hashtags in the description (not the title); `#Shorts` is optional since classification is automatic | [practitioner consensus] |
| Audio — Content ID block | A Short **over 1 minute** with an active Content ID claim is **blocked globally and ineligible for monetization** | support.google.com (Content ID on Shorts) |
| Burned-in caption | Strongly recommended — sound-off viewing is common; frame-1 text doubles as the shelf thumbnail | [practitioner consensus] |
| Safe zones | Avoid the bottom ~25% (like/comment/share + Related Links pill) and top ~10% (handle + title) | [practitioner consensus] |
| Linked long-form ("Related Links") | Persistent link near the bottom of the player to a creator-specified long-form video | [practitioner consensus] |

Platform-specific row that bites: a Short >1 min with a Content ID-claimed commercial track is hard-blocked
worldwide — audio must be original or from YouTube's library at that length (§4).

---

## 3. Algorithm Signals (Ranked by Impact)

YouTube's **official** position (blog.youtube, "Debunking common myths about YouTube Shorts," May 2025):
Shorts and long-form run on **separate recommendation systems that understand cross-format viewing**,
there is **no evidence Shorts hurt long-form**, and the swipe feed's **primary** signal is the
**viewed-vs-swiped-away ratio**. The order below follows YouTube's stated primary→secondary structure;
all numeric thresholds are `[practitioner consensus]`, not platform-published.

1. **Viewed-vs-Swiped-Away (VVSA) — the swipe-decision metric.** Of impressions delivered to the
   feed, what fraction watched vs. swiped past in the first beat. *Why:* YouTube names this the
   **primary** swipe-feed signal. *Lever:* burned-in frame-1 headline + motion; treat frame-1 like a
   thumbnail. *Tier:* **primary** (blog.youtube "Shorts truths," May 2025) for the signal; the
   70–90%-good / <60%-collapse thresholds are `[practitioner consensus]`.
2. **Loop / replay.** How often viewers re-watch within a session. *Why:* YouTube lists loop/replay
   among the secondary swipe-feed signals, and **a view is counted on every start or replay with no
   minimum watch time** (effective March 2025) — so replays compound view-count directly. *Lever:*
   loop-bait ending (§1.2), no hard end-card that breaks the loop. *Tier:* **primary** for the
   counting-methodology change + the signal (blog.youtube + support.google.com); replay-rate uplift
   figures are `[practitioner consensus]`.
3. **Likes.** Per-impression like rate. *Why:* YouTube lists likes among the secondary swipe-feed
   satisfaction signals. *Lever:* earn the like with a payoff/punchline, don't beg for it. *Tier:*
   **primary** (signal named in blog.youtube "Shorts truths").
4. **"Not interested" / negative feedback.** Explicit dismissals. *Why:* YouTube names "not
   interested" as a swipe-feed signal — it suppresses distribution to mismatched audiences. *Lever:*
   topical clarity in frame-1 so the Short reaches a matched audience, not a mismatched one. *Tier:*
   **primary** (blog.youtube "Shorts truths").
5. **Comments.** Per-impression comment rate + thread activity. *Why:* listed among secondary
   swipe-feed signals; comments signal a reaction worth extrapolating. *Lever:* an end prompt
   ("comment your answer") + a pinned-comment kickoff to seed the thread. *Tier:* **primary** (signal
   named in blog.youtube "Shorts truths").
6. **Shares.** Per-impression share rate. *Why:* listed among secondary swipe-feed signals; shares
   read as the strongest "worth passing on" signal. *Lever:* a single shareable idea/payoff; "send
   this to someone who…". *Tier:* **primary** (signal named in blog.youtube "Shorts truths").
7. **Satisfaction surveys.** YouTube's post-view satisfaction prompts. *Why:* explicitly named as an
   input the swipe feed considers. *Lever:* deliver on the title's promise — survey satisfaction
   tracks expectation match. *Tier:* **primary** (blog.youtube "Shorts truths").

YouTube **does not publish numeric weights** for any of these. Cap interpretation at these signals;
VVSA is primary and the rest are stated as secondary satisfaction signals — don't invent a weighting.

---

## 4. Anti-Patterns

| Pattern | Penalty observed | Detection rule | Source |
|---|---|---|---|
| **Watermark from another app** (TikTok/Reels logo or removal artifacts) | **Monetization-ineligible** (confirmed); a *feed* deprioritization beyond monetization is unconfirmed | If `production_mode = repurpose-cross-platform`, fail unless the source is the original watermark-free master | Digiday on the Shorts Fund (monetization); feed-throttle = `[practitioner consensus]` / Open Question (§8) |
| **Inauthentic / mass-produced content** (templated, easily-replicable-at-scale, generic-template AI, minimal-narrative slideshows) | **Demonetization channel-wide** under the renamed policy (was "repetitious"), effective **July 15, 2025** | Flag a Short that is a generic template, an at-scale-replicable format, or a minimal-narrative slideshow with no original commentary/transformation | support.google.com/youtube/answer/1311392 (Inauthentic Content policy, primary) |
| **Content ID-claimed music in a Short >1 min** | **Blocked globally + monetization-ineligible** | If duration target >60s, audio must be original or from YouTube's library — not a Content ID-claimed commercial track | support.google.com (Content ID on Shorts, primary) |
| **Slow-start / no frame-1 hook** | Low VVSA → the primary swipe-feed signal collapses → distribution stops | Storyboard 0:00–0:02 must contain burned-in headline text OR high-motion/high-contrast visual OR a verbal claim — not a logo intro, "hey guys", or silent setup | VVSA mechanism: blog.youtube "Shorts truths" (primary); <50% collapse threshold: `[practitioner consensus]` |
| **Loop-breaking end-card on a loop-bait Short** | Breaks the auto-replay the format depends on, killing the loop/replay signal it was built for | If hook archetype = Loop-bait, the final 0.5s must mirror frame-1 — no end-card, card animation, or subscribe overlay | Loop/replay is a stated signal (blog.youtube + March-2025 counting); the kneecap interaction = `[practitioner consensus]` |
| **Padding past the content's natural length** | A 30s Short at high completion outperforms a 60s Short at low completion — VVSA/satisfaction track the ratio, not absolute watch time | If the storyboard adds filler beats to "fill out" duration, cut to the length the content justifies | [practitioner consensus] (mechanism: satisfaction signals, blog.youtube) |

"Don't be spammy" is not an anti-pattern. "If `production_mode = repurpose-cross-platform`, any
non-master source fails the watermark check" is.

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic:** win the **viewed-vs-swiped-away** moment — frame-1 must stop the swipe
like a thumbnail (burned-in headline or hard motion, no slow intro), then stay loop/replay-friendly
so each rewatch is a counted view. VVSA is YouTube's stated primary swipe-feed signal; everything else
is downstream of the stop.

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | Build the swipe-stopping hook | T−2d (script) | Write frame-1 as a thumbnail: burned-in headline (≈≥48px) OR a high-contrast face OR hard motion OR a verbal claim in the first second. No logo, no "hey guys", no silent setup. | A stranger reads/grasps the promise in <1s; no slow intro exists |
| 2 | Front-load the value | T−2d (script) | Deliver the payoff's first beat inside the opening — no warm-up. Cut every dead second; target the length the content justifies (15–30s retention-led, 40–60s only if it sustains). | First on-screen second contains a claim or visible value, not setup |
| 3 | Make the edit loop/replay-friendly | T−1d (edit) | End on a frame that mirrors frame-1 (or a line that completes only on loop). No hard end-card that breaks the loop. Keep it tight so the loop comes around fast. | Last 0.5s visually re-cues the open; no loop-breaking card |
| 4 | Ship clean vertical, no foreign watermark | T−1d (export) | Export square/vertical (aspect ≥1:1) from the original master. Strip any TikTok/Reels watermark; if repurposing, re-export from the watermark-free source. Audio original or from YouTube's library (mandatory if >1 min). | Passes §2; no other-app watermark; Content ID-safe at the chosen length |
| 5 | Post | T−0 | Upload the file (3-min cap applies to uploads; in-app camera caps at 60s). 3–5 description hashtags; `#Shorts` optional. Burned-in captions on for sound-off. | Auto-classified as a Short; live and indexed |
| 6 | (Optional) Shorts→long-form funnel CTA | T−0 | If the channel has a tightly-relevant long-form, add a Related Links pill + a verbal cue at the 60–80% mark ("full breakdown linked"). Separate recommendation systems mean this can't hurt the long-form rail. | Pill set + verbally cued; long-form is genuinely relevant |
| 7 | Measure VVSA + retention | T+24–72h | Read viewed-vs-swiped-away, average view duration / completion, and replays. Diagnose: a sharp early drop = a failed hook; a late upward bump = replay segments. | VVSA + completion + replay captured for this Short |
| 8 | Feed `measure-results` | T+72h | Write the dated what-worked / what-failed entry (hook type, VVSA, completion, replay, any long-form click-through) into `measure-results` → feeds the pack (U10). | Dated entry recorded; hook archetype tagged for the next brief |

This sequence is what the Shorts chain executes and what `write-social` / `publish-social` narrate
("running the Shorts VVSA-first + loop-friendly playbook").

---

## 6. Timing, Cadence & Hook Window

- **First-second goal (0:00–0:01):** stop the swipe. Frame-1 must contain at least one of: burned-in
  headline text (≈≥48px on 1080×1920), high-contrast face-on subject, hard motion, or a verbal
  claim — NOT a logo, channel intro, or "hey guys". The viewer's decision here is binary: stop or swipe.
- **Swipe-decision window (0:00–0:02):** this is where VVSA is decided — YouTube's stated **primary**
  swipe-feed signal. Treat the intro like a thumbnail. (Numeric VVSA targets below are
  `[practitioner consensus]`, not YouTube-published.)
- **VVSA / retention working targets `[practitioner consensus]`:** ~70–90% viewed (vs. swiped) reads
  as a strong band; <60% rarely performs. On <60s Shorts, ~80–90% completion is a top-performer band
  and <50% reads as a throttle. These are practitioner cohort heuristics — the *mechanism* (VVSA,
  completion-as-satisfaction) is YouTube-stated, the *numbers* are not (§8).
- **Loop / replay behavior:** since **March 2025**, a view is counted on every start or replay with
  **no minimum watch time** (YouTube). Loop-friendly short Shorts compound view-count; >100% retention
  is achievable and is the signature loop-bait targets (§1.2).
- **Healthy drop-off shape:** flat-with-gentle-decline. A single sharp cliff means a specific beat
  failed (pacing slowed, topic shifted, visual interest dropped). A late upward bump = replay
  segments — the loop-bait signature.
- **Cadence:** a steady posting rhythm is `[practitioner consensus]` (commonly cited as multiple
  Shorts per day for growth) — YouTube does **not** publish a posting-frequency requirement. Don't
  spec a hard "3–5/day" as platform fact; treat cadence as an effort knob, not a ranking lever.

---

## 7. CTA Placement Norms

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| **Related Link pill (long-form linked)** | Channel-flywheel hook (§1.1) with a real, tightly-relevant long-form on the same channel; verbalized at the 60–80% beat so the pill registers | Linked long-form is unrelated; pill exists but is never verbally cued | [practitioner consensus] (cross-format = separate systems, blog.youtube) |
| **Pinned comment** | Loop-bait or feed-mode Shorts where a CTA would break the visual flow; works for "drop your answer", resource links, follow-up; survives sound-off | Audience too cold to leave the feed; pinned comment too long (truncates) | [practitioner consensus] |
| **End-card overlay (final 1–3s)** | Channel-flywheel and Title-and-thumbnail-hybrid Shorts where the loop is not the goal; "subscribe for the full version" | Loop-bait Shorts (breaks the loop + kills the replay signal) | [practitioner consensus] |
| **Verbal in-line CTA (mid-Short)** | Channel-flywheel hook where "the full breakdown is linked" rides at the 60–80% mark, before drop-off accelerates | Hard-sell at 0:01 (tanks VVSA + completion); generic "smash like and subscribe" with no reason-to-act | [practitioner consensus] (VVSA mechanism: blog.youtube) |
| **Description first line / "More" expansion** | Reinforcement only — invisible until expanded; useful for hashtags, long-form link, sponsor disclosure | Treated as a primary CTA surface — viewers don't expand by default | [practitioner consensus] |
| **Burned-in CTA text overlay** | Shelf-style preview hook where the Short doubles as a shelf card; CTA is the headline | Cluttered frame-1 (competes with the hook); bottom-25% safe-zone violation (under YouTube UI) | [practitioner consensus] |

**Default order to pick from in a brief:** Related Link pill (channel-flywheel) → pinned comment
(loop-bait or feed-only) → end-card (when the loop is not the goal) → verbal mid-Short CTA (layered).

---

## 8. Open Questions / Known Unknowns

- **Numeric VVSA thresholds (70–90% good / <60% collapse) are not YouTube-published.** The *signal*
  (viewed-vs-swiped-away as the primary swipe-feed input) is YouTube-stated (blog.youtube "Shorts
  truths," May 2025); the specific percentage bands are `[practitioner consensus]` from vendor
  cohort studies without disclosed methodology. Treat as working targets, not documented gates.
- **No published numeric weights for any swipe-feed signal.** YouTube names VVSA (primary) plus loop,
  likes, "not interested", comments, shares, and satisfaction surveys (secondary) but publishes no
  weighting. Do not invent a ranked weighting beyond primary-vs-secondary.
- **Watermark = feed deprioritization (beyond monetization) is unconfirmed.** Monetization
  ineligibility for content posted with another app's watermark is reported (Digiday, on the Shorts
  Fund); a *distribution* throttle beyond monetization is `[practitioner consensus]`, not confirmed.
- **Shelf-vs-feed traffic split is not published.** Practitioner estimates put the dedicated Shorts
  feed at the large majority of views with the shelf (Home/Search/channel page) taking the rest, but
  YouTube publishes no platform-level split and per-channel splits vary. Don't assume a fixed weight.
  `[practitioner consensus]`
- **Algorithm treatment of 60–180s Shorts (post-Oct 2024) vs. <60s.** Unclear whether longer Shorts
  distribute identically or get routed differently when retention is low. The 3-min era is too recent
  for a stable public cohort. Spec 15–60s when in doubt. `[practitioner consensus]`
- **Posting cadence as a ranking lever.** Commonly cited "post N/day" advice is `[practitioner
  consensus]`; YouTube publishes no frequency requirement. Treat cadence as an effort knob.
- **"3.3B Shorts study" / hook-uplift percentages / per-1k-view sub rates.** All
  vendor-published-without-methodology or `[practitioner consensus]`. The mechanisms (VVSA,
  completion, replay, subscriber conversion) are YouTube-stated; the specific numbers are not — do
  not cite the numbers as platform fact.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-05-07 | Initial draft. Covers post-Oct 2024 3-minute Shorts era, March 2025 loop-counts-as-view methodology change, late-2024 egregious-clickbait enforcement, Related Links UI, Tier-1/Tier-2 YPP Shorts monetization split. Hook taxonomy: channel-flywheel, loop-bait, shelf-style preview, title-and-thumbnail-hybrid. | internal |
| 2026-06-18 | v1→v2: pack_type, summary, §5 Playbook; ranking re-cited to blog.youtube "Shorts truths" (May 2025); format to YouTube Help (3-min, Oct 2024); inauthentic-content policy (Jul 2025); benchmark Socialinsider; de-anonymized via agent web-verification (operator review pending). | agent |
