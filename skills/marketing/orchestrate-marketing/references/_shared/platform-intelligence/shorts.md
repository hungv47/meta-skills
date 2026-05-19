<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

---
type: platform-intelligence
platform: shorts
schema_version: 1
last_verified: 2026-05-08
verifier: internal
source_basis: "Internal research synthesis; raw source ledger intentionally omitted from public skill package."
status: draft
---

# Platform Intelligence — YouTube Shorts

Practitioner-grade reference consumed by `short-form-brief` (and downstream surface-specific copy skills) to ground hooks, format compliance, algorithm fit, and anti-pattern checks for **YouTube Shorts**. Shorts behaves differently from TikTok/Reels because it sits inside YouTube's long-form ecosystem: every Short is also a YouTube video, every channel has a long-form rail and a Shorts shelf, and the algorithm distributes Shorts across at least three discovery surfaces (Shorts feed, Shorts shelf on Home/Search/channel page, Suggested) — not one.

When this doc's `last_verified` exceeds 90 days, the consuming critic flags `DONE_WITH_CONCERNS` with "platform signal may be stale — verify before publishing."

---

## 1. Hook Taxonomy

Shorts inherits the base-6 hook archetypes (Credential flash, Pattern interrupt, Question hook, Pre-reveal tease, Contrarian claim, Data point) but its position inside YouTube's long-form ecosystem creates platform-native variants the brief must spec for. The four below are internal — they describe what the *opening* must accomplish given that (a) the viewer is in a swipe-decision feed with a 1–2s budget, (b) the Short may also be surfaced via the Shorts shelf where a thumbnail and title are visible *before* playback, and (c) Shorts function as a top-of-funnel feeder to the channel's long-form rail.

### Archetype 1 — Channel-flywheel hook

- **Definition:** A Short whose opening explicitly previews or fragments a long-form video on the same channel, with the long-form linked via Related Links/description so engaged Shorts viewers route into the long-form rail.
- **Identifying signal:** First 2s names a deliverable that cannot fit in 60s ("Here's the 3-minute version — full breakdown linked"), or visually fragments a long-form scene ("This is from my 22-minute deep-dive"); a "Related Links" pill appears at the bottom of the Shorts player linking to the long-form.
- **Pattern examples A:** "I spent 24 hours in the world's most expensive hotel room — full video on my channel" — [pattern-derived] — the channel-flywheel pattern that a large-channel operator's main channel uses to push Shorts traffic into long-form (large-channel shorts have >1B views per top short and now exceed long-form views on the main channel); multiple hotel-related Shorts exist on the channel but no post with this exact opening line was locatable. large-channel shorts performance documented in.

- **Engagement-signal rationale:** Shorts subscribers count toward the same channel total used for YPP eligibility (Tier 1 = 500 subs + 3M Shorts views/90d; Tier 2 = 1k subs + 3M Shorts views/90d or 4k watch hours), and long-form watch time monetizes at materially higher RPM than Shorts feed (Shorts ~$0.06/1k views per a third-party benchmark 3.3B-view study). The flywheel hook converts low-RPM Shorts impressions into high-RPM long-form watch hours and into subscribers — both of which compound.
- **Best for:** Established channels with a long-form library; education/expertise niches; founder-mode where the goal is audience compound, not standalone Short virality.

### Archetype 2 — Loop-bait Short

- **Definition:** A Short engineered so the final frame visually or narratively connects to the first frame, producing accidental re-watches that count as additional views (since March 31, 2025, each loop = another counted view).
- **Identifying signal:** Final ~0.5–1s frame visually mirrors first frame; ending sentence completes only when looped to the start; total duration 7–15s (loop math compounds when watch length is short); no end-card or CTA card that breaks the loop.
- **Pattern examples A:** Satisfying-process Shorts where the last visual frame (e.g., "the door closes") re-cues the opening ("a door opens"); the format is endemic to the practitioner source, practitioner source, and oddly-satisfying niches — pattern documented across 100k+ Shorts in a third-party benchmark's loop-structure analysis.
- **Pattern examples B:** Short ending: "...and that's how you do it. Wait, did you catch the part where—" (cuts to silence; loop restarts and viewer rewatches to "catch" the missed beat) — pattern from looping-structure case studies.
- **Engagement-signal rationale:** As of March 31, 2025 — confirmed by YouTube's official Community announcement — each loop counts as another view, and "even a 10% replay rate can meaningfully boost distribution"; looped Shorts can register >100% retention in YouTube analytics because segments get rewatched within a single session. This is the only short-form platform where the "incomplete ending" pattern compounds *measurably* in distribution — not just engagement signal.
- **Best for:** Visual / process / ASMR / satisfying / micro-narrative niches; product demos with a clear "before → after → before" arc; brand-mode where view-count is the KPI more than CTR-out.

### Archetype 3 — Shelf-style preview hook

- **Definition:** A Short whose first frame is composed and titled to function as a thumbnail-plus-headline pair on the Shorts shelf (Home, Search, channel-page carousel) — because the shelf renders a static thumbnail + the first ~30 chars of title before any swipe-in.
- **Identifying signal:** First-frame visual has thumbnail-grade composition (high-contrast face, bold text overlay, single focal subject) rather than feed-style "drop into action"; title is written headline-first ("The $1 productivity trick that 10x'd my output") not stream-of-consciousness; viewer arrives via shelf with a *click decision already made* before playback.
- **Pattern examples A:** Productivity creator opens with a 3-word burned-in caption and a face-on-frame shot — "Stop. Doing. This." — title "The 5-second rule that ended my procrastination" — composed for the shelf-card render where face + bold caption survive thumbnail compression. Pattern documented across practitioner source Shorts.
- **Pattern examples B:** "Most people get this 100% wrong" (text overlay on opening frame) — pattern recurs in finance/career niche shelf Shorts where title and frame-1 are designed as a unit to function on the home shelf carousel.
- **Engagement-signal rationale:** The Shorts feed handles the majority of Shorts views, but the shelf (Home / Search / channel page) introduces Shorts to viewers who would never enter the dedicated Shorts feed — these viewers make a *thumbnail-and-title click decision* before the video plays, so the first frame and title must function the way a long-form thumbnail does. Shelf-acquired subscribers are reportedly higher-retention than feed subscribers (practitioner observation, not platform-confirmed). The exact feed-vs-shelf traffic split is practitioner-estimated at 70–90% — see §7.
- **Best for:** Channels that already get Home/Suggested impressions; education/explainer niches; any short where the click decision is happening *before* playback (not during the 1–2s swipe window).

### Archetype 4 — Title-and-thumbnail-hybrid hook

- **Definition:** A Short where the opening 1–2s burns in oversized text that *is* the thumbnail when the Short surfaces on the home shelf and *is* the hook when it plays in feed — the first frame does double duty.
- **Identifying signal:** First-frame text is ≥48px in 1080×1920, contains the thesis verbatim (not a label or ornament), uses a single high-contrast color block for text background, and the speaker either delivers the same line aloud or stays visually subordinate to the text for the full first second.
- **Pattern examples A:** "I tried this for 30 days" (text occupies ~40% of frame, slammed against face) — the burned-in-headline hook recurs across practitioner source, practitioner source, and most challenge/experiment Shorts.
- **Pattern examples B:** "Did you know that using this simple technique can double your productivity?" (an education-creator operator's opening pattern with text-over-face composition) — practitioner source Shorts.
- **Engagement-signal rationale:** Shorts with an immediate hook in the first 2s retain 19% more viewers than slow-start variants (a third-party benchmark cohort), and 50–60% of total drop-offs happen in the first 3s. A first-frame that *is* the headline hits both the swipe-decision moment in feed AND the thumbnail-rendering moment on shelf without splitting effort.
- **Best for:** Hooks built around a single thesis or claim; educational/expertise creators; any time the same Short needs to perform across feed, shelf, and embed/share contexts.

---

## 2. Format Constraints

| Constraint | Value | reference |
|---|---|---|
| Duration hard cap (current) | **3 minutes (180s)** for videos uploaded on/after Oct 15, 2024 (Dec 8, 2025 for Official Artist Channels). Vertical/square + ≤180s = classified as Short. | yt-help-3min, 9to5g-3min |
| Duration hard cap (legacy) | 60s for uploads before Oct 15, 2024 | 9to5g-3min, sej-3min |
| Duration sweet spot | **15–30s for retention-led**; **40–60s for absolute-view-count** (Shorts in 50–60s range earned ~22× more views than <10s clips per a third-party benchmark cohort; a third-party benchmark 3.3B-view study found algorithm "favors longer videos (40s+) that hold viewer duration well") | internal |
| Aspect ratio | 9:16 vertical or 1:1 square (anything wider = classified as long-form, not Short) | internal |
| Resolution recommended | 1080×1920 (vertical) | internal |
| Title character limit | **100 characters** (hard cap); first ~70 visible on shelf cards | internal |
| Description character limit | **5,000 characters** total; only first **~100–125** visible above the fold in Shorts player | internal |
| Hashtag count limit | Max **15 hashtags** per video (post — YouTube ignores all hashtags if >15) | internal |
| Hashtag norm | **3–5 hashtags in description, not title**; first 3 description hashtags auto-render as clickable links above title (saves the 100-char title budget); `#shorts` is widely-recommended-but-not-required (YouTube auto-detects vertical+short videos as Shorts; the tag is a redundancy hedge) | internal |
| Cover/thumbnail | Effectively functions on the **Shorts shelf** (Home/Search/channel page) — first frame doubles as thumbnail by default; custom thumbnails supported but the shelf renders frame-1 if uploaded thumbnail is rejected as misleading | internal |
| Audio handling | YouTube's in-app audio library + remix-from-existing-Short; for Shorts >60s, Content ID-claimed music is a hard block — claimed music in any Short over 1 minute = video blocked globally and ineligible for monetization | internal |
| Music duration cap (in 3-min Shorts) | Most licensed songs usable for **up to 90s** within a 3-min Short; some tracks limited to 60s or 30s | internal |
| Burned-in caption | **Strongly recommended** — sound-off viewing common; first-frame text doubles as shelf thumbnail | internal |
| Safe zones | Avoid bottom ~25% of frame (UI overlay: like/dislike/comment/share + Related Links pill) and top ~10% (handle + title) | internal |
| Subscriber math | Public + private subscribers from Shorts count toward channel total used for YPP eligibility (Tier 1: 500 subs + 3M Shorts views/90d OR 3k watch hours/yr; Tier 2: 1k subs + 3M Shorts views/90d OR 4k watch hours/yr). Shorts watch time does NOT count toward the 4k-hour long-form requirement. | internal |
| Made-for-kids implications | Shorts marked "Made for Kids" disable comments, personalized ads, end-screens/cards, Stories, Super Chat, save-to-playlist, and notifications — kills most monetization and CTA paths. Set audience honestly per channel. | internal |
| Linked long-form ("Related Links") | Available to verified channels — persistent link near bottom of Shorts player to a creator-specified long-form video | internal |

---

## 3. Algorithm Signals (Ranked by Impact)

YouTube's Creator Liaison framework (platform education leadership, plus Senior Director of Growth & Discovery Todd Beaupré) consistently positions Shorts ranking around two pillars: **the swipe-decision** (does the viewer stop?) and **post-swipe satisfaction** (do they finish, react, and return?). Below ranks the operationally-actionable signals.

1. **Viewed-vs-Swiped (VVSA) — the swipe-decision metric.** Concrete metric: of all impressions delivered to the feed, what % stopped vs. swiped past in the first 1–2s. *Why:* this is the ranking signal YouTube's Creator Liaison most consistently surfaces; a third-party benchmark 3.3B-view study found Shorts with <60% VVSA rarely performed; top Shorts hit 70–90%. *Lever:* burned-in first-frame headline + visual motion in frame-1; treat frame-1 like a thumbnail. *Tier:* secondary (creator-cohort study; the *signal name* is platform-stated, the *thresholds* are practitioner-derived).

2. **Average view duration / completion rate.** Concrete metric: % of total length the average viewer watches; top Shorts hit 80–90% completion on <60s videos. *Why:* highest-weight post-swipe signal — a viewer who stopped scrolling but bounced at 3s is a worse signal than a viewer who finished. *Lever:* duration discipline (15–30s for retention-led; 40–60s only when content sustains it); cut every dead second. *Tier:* secondary cohort + primary (YouTube documentation on watch time as core ranking signal).

3. **Replay rate / loop count.** Concrete metric: how often viewers re-watch the Short within a session; **as of March 31, 2025 each loop counts as an additional view**. *Why:* replays signal exceptional engagement and now compound view-count math directly. Even ~10% replay rate "can meaningfully boost distribution." YouTube's official announcement states: "a Shorts view is counted every time a Short starts to play or replay, with no minimum watch time required." *Lever:* loop-bait ending (visual or narrative loop), 7–15s duration target where loop math compounds, no hard end-card that breaks the loop. *Tier:* primary (platform changed counting methodology — official YouTube Community announcement) + secondary (threshold).

4. **Likes, comments, shares (engagement velocity).** Concrete metric: per-impression rate of each action; shares carry highest weight as virality signal. *Why:* secondary post-swipe satisfaction signal; comments + shares specifically signal "this was worth a reaction" which the algorithm extrapolates to "this will satisfy other viewers." *Lever:* explicit prompt at end ("comment your answer", "share with someone who needs this"); pinned-comment kickoff to seed thread. *Tier:* secondary.

5. **Personalization match (viewer-history fit).** Concrete metric: how closely the Short's topic/visual/audio fingerprint matches the individual viewer's prior watch history. *Why:* per platform education operators, "the algorithm pulls videos for viewers" — Shorts distribution is per-viewer matching, not push-broadcast. A Short with an 80% completion rate from a tightly-matched audience can outperform a Short with 60% from a broad audience. *Lever:* topical clarity in frame-1 (the algorithm needs to classify the Short fast), niche-specific phrasing over generic, consistent channel topical signal. *Tier:* primary (Creator Liaison statements).

6. **Click-through to channel / Related Links / long-form follow-through.** Concrete metric: % of viewers who click handle, Related Link pill, or end-card; counts as positive distribution signal because it implies value beyond the single watch. *Why:* the Shorts shelf vs. feed split means a Short that *only* performs in-feed and never converts to channel/long-form interest is throttled relative to Shorts that bridge into the channel ecosystem. *Lever:* spec a Related Link to a tightly-relevant long-form; verbal CTA at second-to-last beat ("full breakdown on my channel"). *Tier:* secondary.

7. **Subscriber conversion.** Concrete metric: subscribers gained per 1,000 views (a third-party benchmark 3.3B-view study found ~16.9 subs per 10,000 views as average). *Why:* a Short that converts viewers into subscribers signals durable value — the algorithm rewards Shorts that grow channels, not just generate one-shot views. *Lever:* channel-flywheel hook framing; identity-anchored opening ("if you build software, this changes things"); end-card subscribe prompt as a backstop, not the lead. *Tier:* secondary.

---

## 4. Anti-Patterns

- **TikTok watermark (or visible artifacts of removal).** *Penalty:* YouTube's frame-scanning detects TikTok logos and the blur/jitter/crop artifacts left after removal; flagged Shorts get restricted to existing subscribers and removed from the Shorts feed (the main discovery surface). YouTube also fingerprints TikTok's compression profile — re-uploading a downloaded TikTok file matches a hash database even with the logo cropped out. *Detection rule:* search the brief for "repurposed from TikTok" / "downloaded from TikTok" / "Reels watermark" — if production_mode = repurpose-cross-platform, hard-fail unless source is the original master file. *Pattern basis: internal research synthesis.

- **Reused content without transformation (YouTube Reused Content policy).** *Penalty:* Channels that primarily reupload other creators' content or self-content with minimal transformation can lose YPP monetization entirely. *Detection rule:* if the Short is a long-form clip with no platform-native treatment (no vertical reframe, no captions added, no audio re-cut, no overlay), flag for transformation pass. *Pattern basis: internal research synthesis.

- **Egregious clickbait (title/thumbnail vs. content mismatch).** *Penalty:* As of late 2024, YouTube began **removing** (not just deprioritizing) videos where titles or thumbnails make promises the video doesn't deliver — initially rolled out in India with global expansion. Examples flagged: "The President Resigned!" on a video with no resignation; "Top Political News" thumbnail on a video with no news content. Initial enforcement is removal without strikes; behavior is expected to escalate. *Detection rule:* the title must answer a question or claim that the *first 60% of the Short* actually delivers — not "subscribe to find out". *Pattern basis: internal research synthesis.

- **Slow-start / no first-frame hook.** *Penalty:* 50–60% of total drop-offs happen in the first 3s; below-50% VVSA → algorithm classifies the Short as skippable and stops distributing. *Detection rule:* check that storyboard frame 0:00–0:02 contains either burned-in headline text OR a high-motion/high-contrast visual OR a verbal claim — not a logo intro, not a "hey guys", not silent setup. *Pattern basis: internal research synthesis.

- **Too-long-for-the-content Short.** *Penalty:* Shorts that pad past their natural length tank completion rate. A 30s Short at 85% completion outperforms a 60s Short at 50% completion even though the 60s version delivered more total watch time. The algorithm penalizes the lower retention more than it rewards the longer absolute watch time. *Detection rule:* if the storyboard has filler beats added to "fill out" duration, cut. Aim for the duration the content actually justifies (15–30s for tight thesis; 40–60s only when content sustains it). *Pattern basis: internal research synthesis.

- **Content ID-claimed music in Shorts >60s.** *Penalty:* Hard-blocked globally — the Short will not play and will not be eligible for monetization. *Detection rule:* if duration target >60s, audio must be original or from YouTube's Shorts audio library (not a Content ID-claimed commercial track). *Pattern basis: internal research synthesis.

- **Made-for-Kids designation when audience is mixed/adult.** *Penalty:* Disables comments, personalized ads, end-screens/cards, Super Chat, notifications — kills most monetization and most CTA paths. *Detection rule:* if the Short uses Related Links, end-cards, or pinned-comment CTAs, audience cannot be Made-for-Kids. *Pattern basis: internal research synthesis.

- **Loop-breaking end-card on a loop-bait Short.** *Penalty:* The "subscribe-bell" end-card animation breaks the visual loop and prevents the auto-replay that Loop-bait depends on, kneecapping the very signal the format was designed to produce. *Detection rule:* if hook archetype = Loop-bait, the final 0.5s must be a frame-1 mirror — no end-card, no card animation, no subscribe overlay. *Pattern basis: internal research synthesis.

---

## 5. Hook Window + Retention Curve

- **First-second goal (0:00–0:01):** Stop the swipe. Frame-1 must contain at least one of: burned-in headline text (≥48px on 1080×1920), high-contrast face-on subject, dynamic motion, or a verbal claim — NOT a logo, channel intro, or "hey guys". The decision the viewer makes here is binary: stop or swipe.
- **Swipe-decision window (0:00–0:02):** a third-party benchmark framing: "treat your intro like a thumbnail." Sub-50% VVSA in this window = algorithm classifies as skippable; 70%+ = distribution scales.
- **Critical drop-off cliff (0:00–0:03):** **50–60% of total drop-offs happen in the first 3 seconds**. A retention curve with a 30%+ cliff at the 3s mark is diagnostic of a failed hook.
- **Retention checkpoints:**
 - **>70% past 3s** = strong intro retention (target).
 - **80–90% completion** on Shorts <60s = top-performer band.
 - **<50% completion** = algorithmic throttle.
 - **>100% retention** is achievable (and now visibly desirable) on loop-bait Shorts because each loop counts as an additional view.
- **Loop / replay behavior:** Since March 31, 2025, **each replay/loop counts as another view** — confirmed by YouTube's official Community announcement. Even a 10% replay rate meaningfully boosts distribution. Loop-bait Shorts in the 7–15s range compound view counts most aggressively; >100% retention is the explicit signal Loop-bait targets.
- **Drop-off structure on healthy Shorts:** Flat-with-gentle-decline is the target curve. A clean staircase or single sharp cliff means a specific moment failed (pacing slowed, topic shifted without transition, visual interest dropped). Bumps upward late in the Short = replay segments — that's the loop-bait signature.

---

## 6. CTA Placement Norms

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| **Related Link pill (long-form linked)** | Channel-flywheel hook with a real, tightly-relevant long-form on the same channel; verified channel only; CTA verbalized at second-to-last beat ("full version on my channel") so the pill registers | Linked long-form is unrelated; pill exists but never verbally cued; channel not verified | internal |
| **Pinned comment** | Loop-bait or feed-mode Shorts where the CTA would interrupt the visual flow; works for "drop your answer", resource links, follow-up; survives sound-off | Audience is too cold to leave the platform (low CTR); pinned comment too long (truncates in feed view) | internal |
| **End-card overlay (final 1–3s)** | Channel-flywheel and Title-and-thumbnail-hybrid Shorts where the loop is not the goal; "subscribe for the full version" pattern | Loop-bait Shorts (breaks the loop and kills replay-rate signal); Made-for-Kids Shorts (cards disabled) | internal |
| **Verbal in-line CTA (mid-Short)** | Channel-flywheel hook where the verbal "the full breakdown is linked" rides at 60–80% mark, before drop-off accelerates | Hard-sell CTAs at 0:01 (kills VVSA and completion); generic "smash like and subscribe" without a reason-to-act | internal |
| **Description first line / "More" expansion** | Reinforcement only — the description is invisible until expanded; useful for hashtags, long-form link, Related Link backstop, sponsor disclosure | Treating description as a primary CTA surface — viewers don't expand by default | internal |
| **Burned-in CTA text overlay** | The Shelf-style preview hook where the Short doubles as a shelf card; CTA is the headline ("Tap for the 5-second rule") | Cluttered first-frame (competes with hook headline); UI safe-zone violation (bottom 25% covered by YouTube UI) | internal |

**Default order to pick from in a brief:** Related Link pill (for channel-flywheel) → pinned comment (for loop-bait or feed-only Shorts) → end-card (when loop is not the goal) → verbal mid-Short CTA (always, layered).

---

## 7. Open Questions / Known Unknowns

- **Shelf-vs-feed traffic split is not publicly disclosed at granularity.** Practitioner consensus is that the Shorts feed accounts for **70–90%** of views on most Shorts, with the shelf (Home/Search/channel page) taking the remainder, but YouTube does not publish a platform-level distribution and per-creator splits vary widely with channel maturity. Briefs should not assume a fixed shelf weight. [pattern-derived]
- **Subscriber quality from Shorts vs. long-form.** Practitioner observation (a third-party benchmark creator data, a third-party benchmark commentary) holds that subscribers gained via the shelf — who saw the Short *in context* with the channel's long-form rail — retain materially better than feed-only subscribers, but no public cohort study quantifies the gap. Treat "Shorts subscribers ≈ long-form subscribers" as unproven for retention purposes. [pattern-derived]
- **Exact VVSA threshold the algorithm uses to throttle vs. promote.** a third-party benchmark cohort places the floor at "<60% rarely performs" and top performers at "70–90%", and a third-party benchmark/cohort studies uses a "70% swipe-away = stop showing" rule, but YouTube has not stated a numeric threshold. Treat 70% as a working target, not a documented gate.
- **Algorithm treatment of 60–180s Shorts (post-Oct 2024).** It is unclear whether the algorithm now distributes 60–180s Shorts the same as <60s Shorts, or whether longer Shorts get pushed to a different rail (Shorts feed vs. long-form Suggested) when retention is low. a third-party benchmark pre-2024 study found 40s+ favored *if retention holds*; the 3-min era is too recent for a stable cohort. Spec briefs at 15–60s when in doubt.
- **Whether Shorts watch time will *ever* count toward the 4k-hour YPP long-form requirement.** Currently it does not — and the Tier 1/Tier 2 split exists specifically because Shorts has its own monetization track. Treat as stable for now; verify each refresh.
- **How the Oct 2024 Egregious-Clickbait enforcement scales globally.** Initially rolled out in India; YouTube has stated global expansion but timing/per-market enforcement intensity is opaque. Briefs should assume the rule applies *now* in production markets, not "eventually."

---

## 8. Changelog

| Date | Change | By |
|---|---|---|
| 2026-05-07 | Initial draft. Covers post-Oct 2024 3-minute Shorts era, March 2025 loop-counts-as-view methodology change, late-2024 egregious-clickbait enforcement, Related Links UI, Tier-1/Tier-2 YPP Shorts monetization split. Hook taxonomy: channel-flywheel, loop-bait, shelf-style preview, title-and-thumbnail-hybrid. | internal |
