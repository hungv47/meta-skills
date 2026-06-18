<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: x
schema_version: 2
pack_type: shortform-video
last_verified: 2026-06-18
verifier: agent
source_basis: "Per-claim categorical + named-source citations inline. Algorithm weights cited to the open-sourced Mar/Apr-2023 ranking code (twitter/the-algorithm + twitter/the-algorithm-ml home/recap README); the Jan-2026 xai-org/x-algorithm repo exists but its numeric params are withheld 'for security reasons', so no 2026 weight is treated as verified. Format specs cited to X developer docs + X Help/Business; timing cited to Buffer's 8.7M-tweet study. Unverifiable large-N claims (Premium ~10x reach, post half-life, Grok sentiment effect) kept categorical and moved to Open Questions."
summary: "On X the tweet text is half the hook and replies are the dominant currency — an author-engaged-back reply was weighted +75 vs +0.5 for a like in the open-sourced 2023 ranking code, so engineer the video for reply provocation and a first-hour author reply-burst, not view count."
status: reviewed
---

# Platform Intelligence — X (formerly Twitter)

Practitioner-grade reference consumed by `brief-shortform` (and downstream surface-specific copy
skills) to ground hooks, format compliance, algorithm fit, and anti-pattern checks for **video posts
on X**. Every claim is distilled into an operating lever — not generic "how to post on X" advice.

X is the **only major platform that has open-sourced its ranking algorithm — twice**:
`twitter/the-algorithm` (March 2023, https://github.com/twitter/the-algorithm) and
`xai-org/x-algorithm` ("Phoenix"/Grok ranker, January 2026, https://github.com/xai-org/x-algorithm).
That sounds like it makes everything falsifiable — but the 2026 repo's **numeric weight parameters
are excluded from the open-source release "for security reasons."** So the only *verified, published*
weights are the **March/April 2023** values in `twitter/the-algorithm-ml` →
`projects/home/recap/README.md` (https://github.com/twitter/the-algorithm-ml). The 2023 README also
states weights "can be adjusted at any time." **Cite the 2023 numbers; treat the 2026 repo as
confirming the *shape* of the ranker, not any specific 2026 weight.** Where this pack states a
number, it is the 2023 value unless tagged otherwise.

X video is also unique in two ways downstream skills must respect:

1. **The tweet text is part of the hook.** Unlike TikTok / Reels / Shorts where the visual carries
   100% of the cold-open, on X the post copy renders above the video and earns the play. A video
   brief that doesn't spec the tweet text is half a brief.
2. **Replies are the dominant currency.** The open-sourced 2023 weights show a reply that the author
   engages back on at **+75.0** vs **+0.5** for a like (`twitter/the-algorithm-ml` home/recap README,
   Apr 2023). On every other major platform watch-time is king; on 2023-era X, reply velocity was.
   Engineer for reply provocation, not view-count maximization.

When this doc's `last_verified` exceeds 90 days, `validate-packs.ts` warns and the consuming critic
flags `DONE_WITH_CONCERNS` — post-acquisition X is the most-changed major-platform algorithm of the
last three years and signals decay fast. A Pro client is served the current pack from the freshness
pipeline.

---

## 1. Hook Taxonomy

Five archetypes are X-native enough to warrant their own framing. They overlap with the six base
archetypes in `../hook-archetypes.md` only in surface form — the platform mechanics differ.

### Archetype 1 — Tweet-Text-As-Hook (the post copy IS half the hook)

- **Definition:** The tweet text above the video does the rhetorical work — claim, contradiction, or
  stat — and the video is the proof. The video's first second can be quieter than on TikTok because
  the text already grabbed attention.
- **Identifying signal:** ≥80 chars of declarative copy in the tweet body that would be a complete
  standalone post if the video were missing. Video opens on context (B-roll, talking head
  mid-sentence) rather than a TikTok-style cold pattern interrupt.
- **Pattern examples A:** Tweet text — "I've watched 100+ founder pitch videos this month. The good
  ones all break the same rule." → 0:01 video cue: founder mid-frame talking, no overlay.
  [pattern-derived from founder/creator cohort — declarative claim in tweet → talking-head proof in
  video; per-tweet engagement varies]
- **Pattern examples B:** Tweet text — "The numbers nobody on X wants to hear about Premium reach:" →
  0:01 video cue: chart cut-in. [pattern-derived]
- **Engagement-signal rationale:** X renders tweet text above the video in-feed; users decide to play
  before they see frame 1. The 2023 ranking code treats dwell on the tweet as a positive signal, and
  tweet text directly drives the read-then-play sequence (`twitter/the-algorithm`, 2023).
- **Best for:** founder mode, B2B, data/insight content, thought leadership.

### Archetype 2 — Reply-Bait Video (engineered to provoke quote-tweets / replies)

- **Definition:** Video makes a contrarian claim, leaves a deliberate gap, or asks a divisive
  question — designed so the cheapest reaction is to reply or quote-tweet rather than scroll.
  Optimizes for the +75.0-weighted "reply engaged back by author" signal
  (`twitter/the-algorithm-ml`, Apr 2023).
- **Identifying signal:** Hook ends on an unresolved tension or directly invites disagreement ("change
  my mind", "agree or disagree?", "the right answer is X — fight me"). Author replies to the first
  5–10 reply tweets within the first 60 minutes (the "first-hour reply burst" pattern).
- **Pattern examples A:** "Hot take: 90% of indie devs on X who post 'I made $X this month' are
  lying about the math." Video cue 0:01: unedited talking head, no overlay. [pattern-derived from
  founder/creator cohort — contrarian-claim video out-engages neutral-framed video]
- **Pattern examples B:** "I quit my job to do X. Here's why I think most people who say this are
  wrong" — declarative contrarian claim in the tweet, video as backstory. [pattern-derived from
  founder/creator cohort]
- **Engagement-signal rationale:** A reply chain where the author engages back was weighted +75.0 in
  the 2023 code (`twitter/the-algorithm-ml`, Apr 2023); a single such chain outweighs 150 likes
  (+0.5 each) in distribution score. Reply-bait video maximizes the rate at which this top-weighted
  action fires.
- **Best for:** opinion pieces, contrarian POV, founder/personality-led brand_mode. Risky for company
  brand_mode — the mechanic that drives reach can damage brand if the claim reads as cynical.

### Archetype 3 — Thread-Anchor Video (video at the top of a thread, text continues below)

- **Definition:** Video posted as tweet #1 of a multi-tweet thread. The video is the "trailer"; the
  thread is the "movie". Premium accounts can extend tweet #1 itself to 25,000 chars (X Help/Business);
  free accounts use the multi-tweet structure.
- **Identifying signal:** Tweet #1 video <60s. Tweet #2 begins with "Here's the breakdown" / "1/" /
  "The full version:" — explicit thread continuation. Author replies to tweet #1 within 60s of
  posting to lock the thread head (X displays `Show this thread` on the first reply).
- **Pattern examples A:** "I've spent 10 years studying [topic]. Here's everything I learned in 60
  seconds:" → video summary → thread of 8–12 tweets unpacking each point. [pattern-derived from
  founder/creator cohort — the educational thread-anchor shape]
- **Pattern examples B:** A "How I built a one-person business" video → thread with the playbook,
  with an in-thread CTA pattern routing to a newsletter. [pattern-derived from founder/creator cohort]
- **Engagement-signal rationale:** Threads compound dwell time across multiple tweets; each click into
  the conversation fires the conversation-click-plus-engagement signal weighted +11.0 in the 2023 code
  (`twitter/the-algorithm-ml`, Apr 2023). The video earns the click into tweet #2; the rest of the
  thread compounds dwell and bookmarks.
- **Best for:** educational content, frameworks, "how I did X" narratives, anything needing more than
  60 seconds to land. **Best brand_mode:** founder, creator, educator.

### Archetype 4 — Raw / Low-Fi (X tolerates lower production quality than peer platforms)

- **Definition:** Phone-shot, single-take, no captions, no edit. The "this is happening right now"
  energy. Performs because X's culture rewards immediacy and unpolished POV more than TikTok or Reels.
- **Identifying signal:** Single take, no jump cuts, no overlay graphics, no music bed. Often vertical
  phone video uploaded as-is. Tweet text supplies all framing.
- **Pattern examples A:** Founder live commentary — unedited single-take "here's what I'm seeing right
  now" desk videos; engagement consistently outperforms more produced content.
  [pattern-derived from founder/creator cohort]
- **Pattern examples B:** Tech-event hot-take videos — reactions to keynote moments posted within 5
  minutes of the event. The "first to post live reaction" pattern repeatedly drives outsized views on
  X. [pattern-derived from founder/creator cohort]
- **Engagement-signal rationale:** X is a real-time platform and treats early engagement velocity as a
  candidate-pool boost (see §3). Low-fi video minimizes time-to-publish, capturing the freshness
  window; polish is valued cosmetically less than on TikTok/Reels. [practitioner consensus]
- **Best for:** real-time reactions, founder-mode personal brand, news commentary. **Worst for:**
  company brand_mode where production polish is part of the brand promise.

### Archetype 5 — Cross-Posted-Clip (TikTok-style vertical, repurposed)

- **Definition:** A vertical 9:16 video originally produced for TikTok / Reels / Shorts, uploaded
  **natively** to X. Distinct from *linking* the TikTok URL — an external video link inherits the
  link-suppression default (§4). Native upload is required.
- **Identifying signal:** 9:16 aspect ratio (X supports 1:3 to 3:1, X developer docs), TikTok/Reels
  editing language (jump cuts, B-roll inserts, burned-in captions). Often the same video the creator
  runs on three platforms simultaneously.
- **Pattern examples A:** Trimmed YouTube/TikTok clips re-uploaded natively to X rather than linked;
  native uploads avoid the link-suppression default that hits a bare URL post.
  [pattern-derived from founder/creator cohort]
- **Pattern examples B:** Polished brand short-form ads cross-posted from TikTok native to X.
  [pattern-derived from founder/creator cohort]
- **Engagement-signal rationale:** Native video is favored over external video links; the cross-posted
  clip captures cross-platform production value while staying in the on-platform native-distribution
  lane. [practitioner consensus]
- **Best for:** company brand_mode, polished product demos, ads, anything where production budget
  already exists for another platform.

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Prefer numeric.

| Constraint | Value | reference |
|---|---|---|
| Free-account video duration cap | **140 seconds** (2:20) | X developer docs (media-best-practices) |
| API hard cap (any tier) | **140 seconds** — even Premium long-form video posts only via app/web, not the API | X developer docs |
| X Premium video duration cap | up to ~2 hours [exact tier hrs uncertain] | X Help/Business |
| X Premium+ video duration cap | up to ~4 hours [exact tier hrs uncertain] | X Help/Business |
| File size cap | 512 MB free; up to 16 GB Premium+ | X developer docs |
| Aspect ratio (allowed range) | 1:3 to 3:1 | X developer docs |
| Aspect ratios (recommended) | 16:9 (landscape, desktop default), 1:1 (square), 9:16 (portrait/mobile) — all valid | X Help/Business |
| Codec | H.264 video; AAC audio | X developer docs |
| Tweet character limit (free) | 280 characters | X Help/Business |
| Tweet character limit (Premium / Premium+) | up to 25,000 characters per post | X Help/Business |
| Burned-in caption requirement | **Not auto-generated for organic uploads** — X recommends "captions or another sound-off strategy for videos with dialogue" | X Help/Business |
| Cover/thumbnail | Auto-generated; no required upload step for organic posts. First frame matters — there is no separate thumbnail editor | X Help/Business |
| Audio handling | Muted-by-default on the web feed; plan for **sound-off legibility** regardless of platform | X Help/Business |
| GIFs vs. native video | 1 animated GIF OR 1 video per post (cannot mix) | X developer docs |
| Hashtags | Max 1–2 relevant. X Business explicitly says "Avoid using hashtags in your Post copy" | X Help/Business |

**Note on the 140s cap and the API quirk:** Even Premium subscribers cannot post videos longer than
140 seconds via the X API — long-form upload requires the in-app or web composer (X developer docs).
Brief specs that assume programmatic posting must respect the 140s ceiling. The exact Premium /
Premium+ maximum *durations* (hrs) are tier-dependent and version-volatile — verify against X
Help/Business before relying on a specific number; they are marked [uncertain] above.

---

## 3. Algorithm Signals (Ranked by Impact)

Ordered list — strongest ranking signal first. **Every numeric weight below is the published
March/April 2023 value** from `twitter/the-algorithm-ml` → `projects/home/recap/README.md`. The 2026
`xai-org/x-algorithm` repo confirms the ranker still scores these action classes but **withholds its
numeric params**, so do not treat any 2023 number as a current 2026 weight — the 2023 README itself
says weights "can be adjusted at any time." Source-tier is `primary` for the *existence and 2023
magnitude* of each signal.

> 1. **Reply that the author engages back on (+75.0, 2023).** *Why:* The single highest-weighted
>    positive signal in the 2023 code. One author-engaged reply chain outweighs 150 likes (+0.5 each).
>    *Lever:* Brief the video hook to provoke a specific question/disagreement; spec the author
>    replying to the first 5–10 replies within 60 minutes. *Tier:* primary (2023 value).
>
> 2. **Reply (+13.5, 2023).** *Why:* Second-highest positive signal. Replies feed conversation depth,
>    the algorithm's proxy for quality. *Lever:* End the video on an unresolved tension; spec a
>    "respond in the replies" line in the tweet text. *Tier:* primary (2023 value).
>
> 3. **Good profile click + engagement (+12.0) / good click (+11.0/+10.0) (2023).** *Why:* The 2023
>    code weights clicks heavily when followed by an action. Profile clicks indicate the video earned
>    curiosity beyond the post. *Lever:* Brief a strong personal-brand identifier in the first 3
>    seconds (face, voice, name overlay). *Tier:* primary (2023 value).
>
> 4. **Retweet (+1.0) / Like (+0.5) / video-playback-50% (+0.005) (2023).** *Why:* The "vanity"
>    signals are an order of magnitude below replies in the 2023 code — and reaching 50% video
>    playback is a near-negligible +0.005, which is *why* watch-completion is not the X game.
>    *Lever:* Don't optimize a brief for likes/retweets/completion; optimize for the reply (#1–2).
>    *Tier:* primary (2023 value).
>
> 5. **Premium subscriber reach boost.** *Why:* A Premium reach advantage is broadly reported and
>    acknowledged by X. *Lever:* If a free account has real reach goals, escalate to client: Premium
>    is effectively table stakes for organic reach. *Tier:* secondary — **the existence** of the boost
>    is widely reported; the **magnitude** ("~10x reach") is unverified and lives in §8, not here.
>
> 6. **Engagement velocity in the first ~30 minutes.** *Why:* X is real-time; early-burst engagement
>    behaves as a candidate-pool boost — a post earning 10 replies in 15 minutes outperforms one
>    earning 10 over 6 hours at equal totals. *Lever:* Time the post to when the audience is most
>    online; brief the team to be available to reply for the first 30–60 minutes. *Tier:* secondary
>    [practitioner consensus]; the *velocity* concept matches the 2023 candidate-sourcing logic.
>
> 7. **Negative feedback (mute / block / report / "Not interested") — heavy negative weight.** *Why:*
>    The 2023 code applies negative-feedback-v2 at **−74.0** and a report at **−369.0**, so a single
>    negative action can wipe out dozens of positive engagements. *Lever:* Critic-check tweet text for
>    cynicism, name-calling, or "block me if X" framing — the line between reply-bait and block-bait
>    is real. *Tier:* primary (2023 value).

Cap is 5–7. Verified-account / follower-count signals exist but are dominated by the seven above.

---

## 4. Anti-Patterns

What the algorithm penalizes or what audiences punish.

| Pattern | Penalty observed | Detection rule | Source |
|---|---|---|---|
| **External link in the primary tweet body** | Reach suppression; native formats outperform a bare-link post | Any `https://` URL in the tweet body of a video post → flag `DONE_WITH_CONCERNS`; rewrite to link-in-reply | [practitioner consensus] (conservative default; the Oct-2025 link-penalty removal is an Open Question, §8) |
| **"Block me if X" / explicitly divisive framing** that crosses from reply-bait into block-bait | Fires the negative-feedback signal (−74.0 in the 2023 code), capable of wiping dozens of positive engagements per block | Tweet text containing "if you disagree, block me", "unfollow me if…", or any explicit-block invitation | `twitter/the-algorithm-ml` (2023 negative-feedback weight) |
| **Clickbait video that does not deliver in the first 5 seconds** | High swipe-away fires low-dwell / "Not interested"; effectively eliminates out-of-network distribution | The tweet's claim is not even gestured at by frame 5 of the video | [pattern-derived from founder/creator cohort] |
| **Templated / automated reply spam** from the author's engagement-pod accounts | Template-like reply patterns penalize the parent account's reputation; low-quality engagement reduces distribution | A brief that asks for "auto-reply to first 50 replies with a thank-you" or any templated-reply automation | [practitioner consensus] |
| **Multiple hashtags in the tweet body (3+)** | X Business explicitly says "Avoid using hashtags in your Post copy" | Tweet text with 3+ `#` symbols | X Help/Business |
| **All-caps tweet text** | X Business lists "avoid writing copy in all-caps" as a best-practice violation | Tweet text with >40% uppercase letters or any 5+ word all-caps run | X Help/Business |
| **Cross-posted video linked as a YouTube/TikTok URL instead of native upload** | Inherits the external-link suppression default; native uploads avoid it | A brief that says "share the YouTube link to X" — must rewrite to "re-upload native to X" | [practitioner consensus] |
| **Burned-in TikTok watermark in a cross-posted X video** | On-platform-native content is favored; an off-platform watermark reads as drive-by repost | A clip exported from TikTok without watermark removal (TikTok exports include the username watermark by default) | [pattern-derived from founder/creator cohort] |

"Don't be spammy" is not an anti-pattern. "Any tweet body containing an `https://` URL on a free
video post flags for link-in-reply rewrite" is.

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic:** write the tweet-text-as-hook first, post the proof video at a peak
window, then run the **first-hour author reply-burst** — replying to the first 5–10 replies inside 60
minutes manufactures the +75.0-weighted "reply engaged back by author" action, the single highest
positive signal in the 2023 ranking code. View count is downstream of replies, not the goal.

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | Pick the angle + write the tweet-text-as-hook | T−1d → T−2h | Choose an archetype (§1); write ≥80 chars of declarative tweet copy that would stand alone without the video. End on a reply-provoking tension (Archetype 2) where appropriate. | Tweet text reads as a complete standalone post; a stranger could repeat the claim |
| 2 | Shoot the proof video | T−1d → T−1h | Capture the proof the tweet promised. Frame 1 *confirms* the claim (face / chart / demo already on screen), not a new pattern interrupt. Keep to 6–60s for organic feed (≤140s API cap). | Video opens on proof of the tweet's claim within frame 1; duration ≤140s |
| 3 | Make it sound-off legible | T−1h | Web feed is muted by default; burn in captions or an on-screen text strategy for any dialogue. No reliance on audio for the core message. | Core message lands with sound muted |
| 4 | Post at a peak window | T−0 | Publish native (never an external video link). Default to a high-traffic weekday-morning slot — Tue 9am / Wed 9–10am per the Buffer study — adjusted to the audience's timezone. Put any off-platform link in a reply, not the body. | Live, native, no `https://` in the tweet body, at/near the audience's peak |
| 5 | Run the first-hour reply-burst | T+0 → T+60min | Reply to the first 5–10 replies within 60 minutes; answer substantively to provoke author-engaged reply chains (the +75.0 action). Be present, not templated. | ≥5 author-engaged reply chains inside the first 60 minutes; engagement velocity climbing in the first ~30 min |
| 6 | Place the two CTAs | T+0 (with post) | One **in-tweet engagement CTA** ("reply with your version / bookmark this") that fires the reply + bookmark signals; one **link-in-reply** for any off-platform conversion. | In-tweet CTA present in body; conversion link present only in a reply |
| 7 | Measure | T+24h → T+48h | Capture replies, author-engaged reply chains, profile clicks, bookmarks, reach, and any link-in-reply clickthrough. Note which archetype + window was used. | Dated metrics row with reply-chain count as the headline KPI (not view count) |
| 8 | Feed `measure-results` | T+48h | Write the what-worked / what-failed entry into `measure-results` → feeds this pack (U10). | Dated entry recorded; archetype + window tagged for the next post |

This sequence is what the X video chain executes step-by-step, and what `write-social` /
`publish-social` narrate ("running the X tweet-text-as-hook + first-hour reply-burst playbook").

---

## 6. Timing, Cadence & Hook Window

### Hook window + retention curve

- **First-second goal:** **The tweet text already did the cold-open work.** Frame 1 of the video
  should *confirm* the tweet's claim is real (face on camera, chart already on screen, demo already
  running) — not introduce a new pattern interrupt. This is the X-specific inversion of TikTok's
  "first frame must shock": on X the tweet copy shocks; the video proves.
- **Critical drop-off point:** **3–5 seconds.** X video tolerates a slightly longer ramp than TikTok
  (where 0–2s is the danger zone) because the tweet text pre-qualified the viewer's interest. After 5
  seconds, For You scroll-away climbs steeply. [practitioner consensus]
- **Retention checkpoint:** reaching **50% video playback** was weighted only **+0.005** in the 2023
  code (`twitter/the-algorithm-ml`, Apr 2023) — i.e., near-negligible. Total tweet **dwell** (which
  includes rewatch + reading replies) is the meaningful private signal, not raw video completion.
- **Sweet spot duration:** **6–15 seconds for organic feed videos**; longer (60s+) only when paired
  with thread-anchor structure (Archetype 3) so the dwell-on-tweet signal compounds across replies.
  [practitioner consensus]
- **Loop / replay behavior:** X autoplay-loops short videos in the For You feed. Loop-friendly final
  frames (matched to the first frame, or an open-ended cut) earn extra dwell per loop. **Less central
  than TikTok's loop mechanic** — on X loops are a bonus, not the primary play-count engine.
- **Swipe behavior:** For You vertical-feed swipe-away is real but **slower than TikTok** — the
  vertical-feed UX is newer on X and the user base still skews horizontal/text-first. Expect lower
  video session-length than TikTok. [practitioner consensus]

### Timing & cadence

- **Best post window:** high-traffic weekday mornings — **Tuesday 9am and Wednesday 9–10am** are the
  measured peaks in Buffer's "Best Time to Post on X" analysis of **8.7M tweets**
  (https://buffer.com/resources/best-time-to-post-on-twitter-x/). Convert to the audience's timezone
  before scheduling. (Cite as `Buffer (8.7M-tweet analysis)` — note: the dataset is 8.7M, not the
  "1M" some older versions of the title implied.)
- **Velocity window:** the first **~30 minutes** carry the engagement-velocity candidate-pool boost
  (§3.6) — be present to reply. [practitioner consensus]
- **Cadence:** X rewards frequency more than peer platforms; a real-time culture means multiple posts
  per day are normal for an active account. Pair each video with companion replies/quote-tweets to
  extend the conversation-velocity window.

---

## 7. CTA Placement Norms

X-native CTA placement is **fundamentally shaped by the link-suppression default** (§4). The "link in
the replies" workaround is so universal it has become a recognizable post pattern.

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| **In-tweet text CTA (no link)** — "Reply with X / Bookmark this / Quote-tweet your version" | Almost always — drives the reply (+13.5) and bookmark signals directly. Best for top-of-funnel content. | When the goal is off-platform conversion — no link means no click. | `twitter/the-algorithm-ml` (2023 reply weight) |
| **"Link in the replies" / pinned reply with the link** | When the goal is off-platform conversion AND a free account would tank reach with a main-tweet link. | When the audience is too cold to click into replies; in-reply link clickthrough is lower than a direct link — but distribution is high enough that net traffic usually wins. | [practitioner consensus] |
| **Video overlay CTA (burned-in text / end-card)** | On cross-posted production-grade videos (Archetype 5) with end-card quality; captures sound-off viewers. | On raw/low-fi videos (Archetype 4) — overlay polish breaks the unedited authenticity; also fails when it covers the bottom 20% where mobile UI renders. | X Help/Business (caption / sound-off guidance) |
| **Profile bio link** | Always-available fallback; Premium accounts get a bio link + links in long-form posts. | When the post doesn't motivate the profile click (an unrealized +12.0 profile-click signal). | [practitioner consensus] |
| **Pinned tweet with the offer** | When the account regularly drives profile visits and the pinned tweet is the primary funnel asset. | When the pinned tweet is stale (>30 days) — visitors see outdated framing and bounce. | [practitioner consensus] |

**Practitioner heuristic:** specify two CTAs — one in-tweet (engagement CTA: reply / bookmark /
quote) and one in-reply (conversion CTA: link to the off-platform asset). The in-tweet CTA is what
the algorithm rewards; the in-reply CTA is what the funnel uses. [practitioner consensus]

---

## 8. Open Questions / Known Unknowns

- **Did X's October 2025 link-penalty removal actually ship and stick?** X **announced removal of
  algorithmic link penalties in October 2025**, but practitioners report continued *indirect*
  suppression of bare-link posts, and no citable post-2025 dataset confirms either way. **Conservative
  default: assume links still cost reach (use link-in-reply); re-verify next bump.**
- **What is the magnitude of the Premium reach boost?** The *existence* of a Premium reach advantage
  is widely reported and acknowledged by X; the often-cited **"~10x reach" / "18.8M-post study"**
  magnitude is **unverified** — the "Does X Premium Really Boost Your Reach?" article
  (https://www.postel.app/blog/Does-X-premium-really-boost-your-reach) is a real URL but its content
  and large-N claim are unconfirmed. **Do not pin a multiplier; treat Premium as "table stakes for
  reach" qualitatively.**
- **What does Grok's 2025–26 sentiment layer actually do?** The 2026 `xai-org/x-algorithm` ranker is
  claimed to read/watch every post and apply a sentiment-distribution effect favoring
  constructive/positive content — but **no published weight or cohort study quantifies it**, and the
  repo withholds its numeric params. **Open: does it punish merely *contrarian* takes (Archetype 2
  reply-bait) or only *toxic* takes?** Critics currently err toward avoiding personal attacks but
  cannot quantify the threshold.
- **What is the half-life of an X video post?** A frequently-cited **"~18 minute" half-life** and a
  **"30-minute velocity window"** are legacy practitioner figures with no fresh primary source.
  [practitioner consensus] — do not treat as measured for video specifically.
- **Are the 2023 weights still anywhere near current?** The only verified weights are March/April
  2023, and the 2023 README says they "can be adjusted at any time"; the 2026 repo confirms the action
  classes but withholds numbers. The *relative ordering* (reply ≫ like) is the durable takeaway; the
  exact magnitudes should be treated as directional, not current.
- **Do quote-tweets behave like replies or retweets in 2026?** The 2023 code weighted replies (+13.5)
  far above retweets (+1.0); whether a quote-tweet ranks more like a reply or a retweet today is
  unverified. CTAs that say "quote-tweet your version" may underperform "reply with your version."

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-05-07 | Initial draft. Pattern basis: internal research synthesis. | internal |
| 2026-05-08 | Phase 0.5b URL repair (Bucket B). Findings 9–10 closed: Archetype 1 example B relabeled `[pattern-derived]`; an X API media-upload reference scope footnote added covering both API + organic upload paths. `last_verified` bumped to 2026-05-08. | internal |
| 2026-06-18 | v1→v2 upgrade: pack_type, summary, §5 Playbook; algorithm weights re-cited to twitter/the-algorithm-ml (Apr 2023); sourcing de-anonymized via agent web-verification (operator review pending). | agent |
