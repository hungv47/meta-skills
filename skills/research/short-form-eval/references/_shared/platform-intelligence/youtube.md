<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

---
type: platform-intelligence
platform: youtube
schema_version: 1
last_verified: 2026-05-08
verifier: internal
source_basis: "Internal research synthesis; raw source ledger intentionally omitted from public skill package."
status: draft
---

# Platform Intelligence — YouTube (Long-Form)

Practitioner-grade reference consumed by long-form-video briefs (Phase 2 of the short-form-brief stack) to ground hooks, format compliance, algorithm fit, and anti-pattern checks for **YouTube long-form video (3 min – 60+ min)**. **Not a Shorts doc** — Shorts has its own intelligence file. The two surfaces share an algorithm shell but diverge sharply on intent (long-form viewer has clicked; Shorts viewer is mid-swipe), retention dynamics (first 60s vs first 3s), and format physics (16:9 horizontal vs 9:16 vertical).

When this doc's `last_verified` exceeds 90 days, the consuming critic flags `DONE_WITH_CONCERNS` with "platform signal may be stale — verify before publishing."

---

## 1. Hook Taxonomy

Long-form hooks operate under a different physics than Shorts: the viewer **already clicked the thumbnail**, so the hook's job is not to *win attention from a feed* but to *prove the click was worth it* before retention crashes. a large-channel operator's leaked production doc treats the first 60 seconds as the single most-important minute of any video, calibrating that "losing 21M of 60M viewers in the first minute is a *good* outcome". Veritasium, an education-creator operator's, and the narrative operator's Neistat each use a distinct opening pattern — catalogued below.

These four archetypes are long-form-specific; they overlap in name with the base set in `../hook-archetypes.md` (Pattern interrupt, Pre-reveal tease) but the platform-native framing is the duty to *honor the thumbnail contract* set before the click — a constraint that does not exist on Shorts/TikTok/Reels.

### Archetype 1 — Thumbnail-Payoff Hook

- **Definition:** First 5–10 seconds visually deliver the exact promise the thumbnail made — same subject, same setting, same wow-factor — so the viewer's expectation is confirmed before they bounce.
- **Identifying signal:** The frame at 0:03 contains the literal object/person/scene shown on the thumbnail. No "today we're going to talk about…" preamble. No logo splash. Voice-over (if any) names the thumbnail subject in the first sentence.
- **Pattern examples A:** "(shade balls rolling) — These are shade balls. They're being dumped into this water reservoir in Los Angeles. And contrary to what you may have heard, their main purpose is **not** to reduce evaporation." — practitioner source, *Why Are 96,000,000 Black Balls on This Reservoir?*, 2019-05-10, https://www.youtube.com/watch?v=uxPdPpi5W4o — 92M+ views, 15.8M-sub channel benchmark. Thumbnail shows reservoir of black balls; first 8 seconds shows literal black balls dumping into water.
- **Pattern examples B:** "The fact that we lifted a house on a crane didn't add anything to the title and thumbnail. It obviously hooked the viewers and helped retention…" — a large-channel operator, internal doc describing *100 Days In The Circle* opening (house brought in by crane at 0:30 because the thumbnail showed the circle-house premise)
- **Engagement-signal rationale:** The internal large-channel operating note is explicit: *"The creative process for every video starts with the title and thumbnail. These set the expectations for the viewer, and everything that follows needs to be defined with those in mind. If a viewer feels their expectations are not being matched, they'll click away — driving down the crucial Average View Duration."* CTR brings the click; AVD-collapse from a broken thumbnail contract is what the ranking system reads as dissatisfaction.
- **Best for:** Documentary, science explainers, challenge formats, product reviews. Any niche where the thumbnail subject is concrete and visual.

### Archetype 2 — Cold Open + Pattern Interrupt

- **Definition:** Open mid-action with a high-stakes or absurd visual moment, *then* cut to title or context. Viewer is dropped into the climax (or a teaser of it) before any setup happens.
- **Identifying signal:** First frame is in-action footage (explosion, jumpcut, scream, on-camera shock). Title card / channel intro arrives at 0:05–0:15, never at 0:00. Often paired with a teasing voice-over: "*This is what happens when…*"
- **Pattern examples A:** *"100 days in the circle"* — opening sequence brings a fully built house in on a crane at the 30-second mark before any rules-explanation dialogue. a large-channel operator channel, 309M subs at time of leak.
- **Pattern examples B:** Veritasium *Why Are 96,000,000 Black Balls on This Reservoir?* opens with cascading-balls foley + the negation hook *"contrary to what you may have heard, their main purpose is not to reduce evaporation"* — pattern interrupt = stating what the answer is **not**, denying the obvious frame.
- **Engagement-signal rationale:** Pattern interrupts beat retention drop-off in the 0:00–0:15 window where most cliff-drops occur on long-form. a third-party benchmark a third-party benchmark analysis frames it as winning *"the first hour CTR plus the first-minute retention"* — cold opens disproportionately move both.
- **Best for:** Entertainment, challenge, science/curiosity, vlog tentpoles. Worse for tutorials where viewers want orientation up front.

### Archetype 3 — Promise Stack (HIVES Hook + Intro)

- **Definition:** Author lists, in 2–4 short beats, exactly what the viewer will gain by staying — sometimes layered with credibility, retention bait, and a curiosity loop.
- **Identifying signal:** Sentence shape is *"In this video I'll show you X, Y, and Z — and the last one changed how I [outcome]."* Often paired with on-screen bullet animation or chapter chyrons.
- **Pattern examples A:** an education-creator operator's documented HIVES opening template: **Hook (0–3s)** → **Intro (3–30s, "I'll show you X, Y, Z")** → Value. His own scripted line per the operator's strategist (Ali's strategist): *"Value proposition — what they'll get. Credibility — why listen to me. Retention pieces — 'lock in for 15 minutes, this will change your life.' Curiosity loops — 'to understand this, we first need to figure out X.'"*
- **Pattern examples B:** an education-creator operator's recommended hook patterns (pattern-derived): *"Most people don't know this — but getting sunlight in the morning is the most effective way to get a good night's sleep later on."* / *"70% of Americans suffer from bad sleep…"* / *"How often do you really get a good night's sleep?"* — each is a stack-builder that adds a promise plus an implied credibility frame.
- **Engagement-signal rationale:** Educational and creator-economy niches (productivity, finance, business) score higher on AVD when the viewer is told what they're trading time for. the operator's strategist (Ali's editor) calls the hook *"the only element you actually script line by line — if you can remove a sentence and the hook still stands, cut it."* This forces density.
- **Best for:** Educational, tutorial, listicle, productivity, "how I did X" formats where the viewer's contract is informational.

### Archetype 4 — In Medias Res / Story Cold Open

- **Definition:** Drop into a personal-narrative scene mid-story, then flash back to "how we got here." Borrowed from cinema; the dominant pattern for vlog and documentary creators.
- **Identifying signal:** First line is dialogue, not exposition (*"It's 5:00 a.m., our flight's in three hours…"*). Visual setting is in-progress (in a car, on a sidewalk, mid-meal). Often followed by a title-card flashback or chapter break that reorients the viewer.
- **Pattern examples A:** the narrative operator's Neistat *MY FIRST VLOG*, 2015-03-26, https://www.youtube.com/watch?v=gnHCw87Enq4 — opens *"I'm in St. Barts which is like a small island somewhere in the Caribbean. Today is March 25th 2015, it's also my 34th birthday, and I have a big announcement to make. Let me explain…"* 5.6M views; the act-1/act-2/act-3 cold-open template the narrative operator's applied across the next 800 daily vlogs.
- **Pattern examples B:** the narrative operator's Neistat *HOW TO VLOG LIKE the narrative operator's NEISTAT*, 2017-06-08 — explicit framing: *"Every good story follows the rule of a three-act narrative. Beginning, middle, end. Setup, conflict, resolution… I strive for that in every episode because that is what's at the core of a well-told story."* https://www.youtube.com/watch?v=Q980C74SdYQ
- **Engagement-signal rationale:** Vlog and personal-narrative niches index on emotional retention rather than information density; in-medias-res opens trigger the "what happens next" loop earlier than chronological openings. the narrative operator's documented two rules: *"trim anything boring; highlight the key moment."*
- **Best for:** Vlog, documentary, personal-essay, behind-the-scenes formats. Worse for evergreen tutorials and SEO-driven explainers where viewers came from search with a specific question.

---

## 2. Format Constraints

| Constraint | Value | reference |
|---|---|---|
| Duration eligible for mid-roll ads | ≥ 8 minutes | internal |
| Revenue sweet spot (post-2025 ad system) | 8–12 min for general niches; 12–20 min for high-RPM niches IF retention holds | internal |
| Long-form floor (vs Shorts) | > 60 seconds is "long-form" by YouTube's view-counting; > 3 min is the typical threshold for what creators treat as long-form | internal |
| Hard upper cap | 12 hours OR 256 GB (whichever first) for verified accounts | internal |
| Aspect ratio (player) | 16:9 horizontal (recommended); player letterboxes or pillarboxes other ratios | internal |
| Resolution recommended | 1080p minimum; 4K (2160p) preferred for TV-screen distribution (TV is now the largest US watch surface) | internal |
| Thumbnail dimensions | 1280 × 720 px, 16:9 aspect ratio, min width 640 px | internal |
| Thumbnail file size | ≤ 2 MB hard cap (uploads above this fail silently) | internal |
| Thumbnail file formats | JPG, PNG, GIF (first frame only), BMP — JPG default for photos, PNG for text/graphics | internal |
| Title hard cap | 100 characters (input field blocks more) | internal |
| Title visible-without-truncation by surface | Desktop home feed: ≤ 55 chars · Mobile home feed: ≤ 50 chars · Desktop search: 50–55 chars · Mobile search: ≤ 45 chars · Suggested desktop: ≤ 55 chars · Suggested mobile: ≤ 65 chars · Channel page mobile: ≤ 40 chars | internal |
| Practical title target | 50–60 characters with primary keyword in first 35 chars | internal |
| Description hard cap | 5,000 characters | internal |
| Description visible-above-fold | First ~125 chars in search snippets · ~157 chars on desktop watch page · ~100 chars on mobile before "Show more" | internal |
| Chapter eligibility | Min 3 chapters, first must start at `0:00`, each chapter ≥ 10 seconds, ascending order, in description | internal |
| Chapter title char limit | 100 chars (recommended 20–50 for full display in progress-bar tooltip) | internal |
| End-screen eligibility | Video must be ≥ 25 seconds to enable end-screen elements | internal |
| End-screen window | Final 5–20 seconds of video; up to 4 elements (subscribe, video/playlist, channel, link) | internal |
| Cards | Up to 5 per video; appear inline as info-card teasers; lower CTR than end-screens but useful mid-video | internal |
| Mid-roll ad spacing rule of thumb | First mid-roll at 40–50% mark; subsequent ≥ 3–4 min apart; 1 mid-roll per 4–5 min of content after the 8-min floor | internal |
| Custom thumbnail eligibility | Available to all channels (verification removed as a gate post-2024); requires account in good standing | internal |
| Captions | Auto-captions ship by default; manual captions / SRT upload strongly recommended for accuracy + accessibility (no shadow-throttle penalty observed for missing captions, but auto-translation discoverability gains for manual captions) | internal |

**TV-first design note (2025–2026 shift):** platform education leadership + Beaupré confirmed in mid-2025 that *US watch time on TV screens has surpassed mobile* and average TV session length is **~4× mobile session length**. This is reframing format choice for established creators: longer (20+ min), 4K, and "framed for the living room" vs the chip-and-go mobile defaults that ruled 2018–2023.

---

## 3. Algorithm Signals (Ranked by Impact)

YouTube's recommendation system has shifted weighting in 2024–2025. Per platform education leadership + Todd Beaupré (Apr 2025, Aug 2025), the system now layers a *satisfaction* signal on top of the raw CTR + watch-time pair that dominated 2018–2023, with **return sessions** and **survey-derived satisfaction** carrying meaningfully more weight than they did a year ago. The rank order below reflects practitioner consensus (a third-party benchmark, a third-party benchmark, a large-channel operator doc) plus YouTube-stated direction.

1. **Click-Through Rate (CTR)** — impressions converted to clicks on a given thumbnail+title combo. *Why:* Without the click, no other signal fires. a third-party benchmark strongest predictor of long-term performance is **first-hour and first-24-hour CTR**. *Lever:* Ship 3+ thumbnail variants and use YouTube's built-in A/B Thumbnail Test (rolled out 2024). Front-load the visual hook in the thumbnail and the keyword in the first 35 title characters. *Caveat:* CTR drops as impressions widen — reading CTR in isolation is "fickle and infuriating" (a third-party benchmark). Read it against AVD. *Tier:* primary.
2. **Average View Duration (AVD) and Average View Percentage (AVP)** — seconds watched and percentage-of-video watched. *Why:* a large-channel operator's internal operating note names CTR + AVD + AVP as the only three metrics that drive his team. Suggested-videos surface (~70% of platform watch time per InstantViews) is dominated by retention-passing videos. *Lever:* Spec a 0:00–0:60 retention checkpoint of ≥ 70% (a large-channel operator's *21M lost of 60M = ~65% retained at 1 min* is the upper-bound benchmark, not the floor). Cut every dull moment. *Tier:* primary (CTR + watch-time pair are the historical pillars; AVD + AVP made explicit in YouTube Studio).
3. **Viewer Satisfaction (survey + inferred)** — post-view "Did you enjoy this?" surveys, like/dislike ratio, share rate, "Not interested"/"Don't recommend channel" suppression. *Why:* platform education leadership + Beaupré explicitly named satisfaction as the layer added in 2024–2025 to address the CTR-up/AVD-down clickbait failure mode. *"YouTube introduced viewer satisfaction precisely to not just count watch time and retention, but to understand viewer behavior during the viewing and how they feel about the time spent."* *Lever:* Honor the thumbnail contract; cut "engagement bait" prompts that depress satisfaction; encourage organic likes/comments at moments of natural payoff (not in the first 30s). *Tier:* primary.
4. **Session Watch Time & Continuity** — how long the viewer keeps watching YouTube *after* your video ends. *Why:* The recommender optimizes platform-session value, not per-video value. A video that satisfies and routes the viewer to another video is worth more than one that wins their click and ends the session. *Lever:* Strong end-screen routing to a relevant next video; binge-friendly playlists; episodic series structure. YouTube is rolling out *"playlists as shows"* with binge logic baked in. *Tier:* primary.
5. **Returning Viewer Behavior** — % of impressions and clicks coming from viewers who have watched the channel before; new "Casual / Regular" audience-segment split in YouTube Studio. *Why:* platform education leadership: *"Some creators have regular viewers that are like 2% of their audience and others are like 20%… This will give insights into how strong that core really is."* Returning viewers who finish your videos compound trust signals across uploads. *Lever:* Consistent upload cadence; clear channel identity; subscribe-CTA placement late in the video (not in the cold open). *Tier:* primary.
6. **Traffic-Source Mix (Browse vs. Search vs. Suggested)** — distribution of impressions/views across YouTube Search, Suggested videos, Browse Features (home + subscriptions feed), and external. *Why:* Each surface has a different CTR baseline (~12.5% search, ~9.5% suggested per ytshark) and a different optimization lever. Suggested = ~70% of platform watch time for established channels; Search = highest per-impression intent and best for evergreen growth; Browse = thumbnail-led and explosive when subscriber loyalty triggers it. *Lever:* For new channels, pursue Search (most controllable). For 10K–100K subs, study which videos yours get suggested *alongside* and target those adjacencies. For 100K+, optimize Browse via consistent cadence + thumbnail strength. *Tier:* secondary (creator-cohort observation; YouTube exposes the splits in Studio but does not publish weighting).
7. **Metadata + LLM Content Understanding** — title, description, transcript, on-screen text, audio language, all parsed by YouTube's LLM-augmented metadata layer rolled out 2024–2025 to better match videos to viewer intent. *Why:* Lets the algorithm surface a video to *the right audience* even if the creator's tags or title are weak. *Lever:* Speak the topic in the first 30s of audio; keyword the first sentence of the description; chapter the video clearly. *Tier:* primary (platform-stated direction) but weighting unpublished.

---

## 4. Anti-Patterns

- **Pattern: Clickbait without payoff** (CTR up, AVD crash). *Penalty:* The 2024–2025 satisfaction-signal layer was built specifically to detect this — the algorithm now distinguishes "watched" from "satisfied" and suppresses recommendations when surveys + sentiment + drop-off all signal disappointment. *Detection rule:* In a brief, flag any thumbnail/title that promises a payoff the script does not deliver in the first 60–90s. Concrete check: does the literal subject of the thumbnail appear on-screen by 0:08? If no → flag.
- **Pattern: Reused Shorts content repackaged as long-form.** *Penalty:* platform education leadership was direct in 2025: *"YouTube Shorts now support up to 3 minutes, but don't stretch just because you can. The algorithm favors retention and relevance, not runtime. Whether it's 15 seconds or 180, give each frame a job."* Stitching Shorts into a "value compilation" reads as low-effort and depresses AVD because the 9:16-cropped frames look bad in the 16:9 player and the pacing is wrong for an attentive long-form viewer. *Detection rule:* Source footage flagged 9:16 vertical or duration < 60s should not be the spine of a long-form brief. Use as B-roll only.
- **Pattern: Engagement bait** ("smash that subscribe button," "comment YES if you agree," "if you're new here, like this video"). *Penalty:* Suppressed via the satisfaction layer; user surveys + the dislike/Not Interested signals punish channels that lean on it. a third-party benchmark frames engagement bait as a "vanity-metric trap" that doesn't move long-term retention. *Detection rule:* In a brief, flag any CTA prompt placed before 25% of video runtime, or any prompt that asks for action without delivering value first.
- **Pattern: Title–thumbnail mismatch.** *Penalty:* The a large-channel operator doc treats this as the primary failure mode of the first 60s — *"if a viewer feels their expectations are not being matched, they'll click away, driving down AVD."* CTR may stay high while AVD collapses; the Quality-Click ratio (high clicks, low satisfaction) is now an explicit recommendation suppressor. *Detection rule:* Brief must declare *what the thumbnail promises* and *which on-screen moment in the first 0:00–0:15 confirms that promise.* If the brief cannot answer both, flag.
- **Pattern: Late hook (0:30+ before the video's core proposition fires).** *Penalty:* The a large-channel operator benchmark for *first-minute retention* is 65% (i.e., losing 35% of viewers from 0:00 to 1:00 is **already better than average**). A late hook crashes that number further. *Detection rule:* In storyboard, the brief must spec a hook beat at 0:00–0:08; any logo-splash, sponsor-read-first, or "what's up guys" preamble before the hook is grounds for rewrite.
- **Pattern: Mid-roll ads placed mid-sentence or mid-action.** *Penalty:* YouTube's ad system now shows "likely-to-serve" feedback in Studio; manually-placed ads at disruptive points get *down-served* (the system declines to actually run an ad there even though the slot exists). Net: less revenue, plus retention dip from the awkward break. *Detection rule:* Mid-roll markers in the brief must land at scene transitions, audio fades, or natural beat-changes — never inside dialogue or action.

---

## 5. Hook Window + Retention Curve

- **First-second goal:** Visually confirm the thumbnail subject *or* deliver a pattern interrupt that makes the viewer's "should I bounce?" reflex misfire. The frame at 0:01 is the contract.
- **Critical drop-off point:** **0:00–0:60 is the cliff.** Per the internal large-channel operating note, *"the first minute of each video is the most important minute of each video"* — losing ~35% of viewers in the first 60s is already a *good* outcome. an education-creator operator's HIVES framework treats the first 30 seconds as the hook+intro window with a hard handoff to the value section.
- **Retention checkpoints:**
 - **0:00–0:10** — viewer decides whether the click was right. Target: ≥ 80% retained on the audience-retention graph.
 - **0:00–1:00** — bounce window. Target: ≥ 65% retained (a large-channel operator benchmark). Below 50% = the hook failed; rework before re-uploading.
 - **3:00 mark** — "re-engagement" window. a large-channel operator's internal operating note places a deliberate *wow moment* at minute 3 because that's where mid-funnel attrition resumes.
 - **40–50% mark** — first mid-roll ad lands here for a reason: viewers past this point have committed and tend to absorb the ad break without bouncing.
 - **End-of-video** — abrupt endings out-perform long sign-offs because they preserve session continuity (viewer scrolls into next video in the suggested rail rather than tabbing away). a large-channel operator: *"have a satisfying payoff at the end of the video with an abrupt ending."*
- **The "graph dip" pattern.** YouTube Studio's audience-retention graph reads cliffs and dips as *content-quality signal*. A vertical cliff at, e.g., 0:08 says "viewers bounced exactly here" → the brief should re-cut whatever ran at 0:08. A flat line is the goal; a slow declining line is normal; cliffs and dips are flags. Use Studio's *Compare to Typical* toggle to benchmark vs your channel average.
- **No native loop / replay reward.** Unlike Shorts and Reels, long-form does not reward loop-rewatch. Session continuity (the viewer stays on YouTube, watches the next thing) replaces it as the trailing engagement signal.

---

## 6. CTA Placement Norms

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| **Subscribe ask in cold open (0:00–0:30)** | Almost never on long-form. Crashes retention right at the cliff. | Most established creators (an education-creator operator's, the narrative operator's Neistat, Veritasium) place the ask near the end or as a one-line aside *after* the hook lands at ~0:30–0:45. | internal |
| **Subscribe ask after value delivery (mid- to late-video)** | Best retention-preserving slot. an education-creator operator's HIVES end-screen template explicitly times the ask for "final 5 seconds." a large-channel operator doc: end abruptly after payoff. | Avoid stacking subscribe + like + comment + share asks together — splits attention and reads as begging. | internal |
| **Mid-roll value-handoff CTA (e.g., link in description)** | Works when tied to a moment of demonstrated value ("I built this in tool X — link below"). Leverages high engagement just-after-payoff. | Fails as a hard sales pitch mid-narrative. Ad-system also treats interruptive sales pitches as low-quality breakpoints. | internal |
| **End-screen card CTA (last 5–20s)** | Native, expected, and YouTube's intended slot. Required to be in last 20s. Up to 4 elements. Subscribe + next-video card is the highest-converting combo. | Generic "thanks for watching" without a routed next-video kills session continuity (signal #4 in §3). | internal |
| **Pinned-comment CTA** | Works for: link aggregation, errata/corrections, community prompt ("which X did you pick?"). Surfaces below first fold; doesn't compete with retention. | Don't expect it to drive significant clicks — it's a complement, not a primary surface. | internal |
| **Description-link CTA (above-fold, first 100–125 chars)** | Highest-discoverability link slot. Used for primary CTA (signup, course, free download). Shows in search snippets. | Buried links below fold get sub-1% CTR. If it matters, it goes in the first 125 characters. | internal |
| **Spoken description-link callout ("link in the description below")** | Reliable when paired with a visual on-screen overlay pointing to it. | Audio-only description references on TV screens are wasted — TV viewers can't tap a description link easily. Reserve for mobile/desktop-skewed niches. | internal |

---

## 7. Open Questions / Known Unknowns

- **Exact algorithm weights are non-public.** The "20% / 25% / 35% / 15% / 5%" weighting table for CTR / AVD / Satisfaction / Returning / Negatives circulating in 2025 blog summaries is **practitioner-derived from analytics-pattern observation, not a YouTube-stated split**. Treat it as directional only.
- **The 8–12 minute "sweet spot" is partly a monetization artifact, not a ranking artifact.** It's true that ≥ 8 min unlocks mid-roll ads and that 8–12 min is the median revenue-optimal range across general niches per practitioner data — but the algorithm itself does not reward duration. Revalense's 2025 analysis is explicit: *"a 12-min video with 30% retention almost always earns less than a tight 7-min video at 70% retention."* When the brief targets retention-first rather than ad-revenue-first, longer is not better.
- **"Session continuity" scope is under-documented.** YouTube has named *session watch time* as a signal but has not publicly defined the window (24-hour session? Per-device? Cross-device?), nor whether videos that route viewers off-platform are penalized vs videos whose viewers exit YouTube entirely after a satisfying ending. Practitioner consensus says abrupt endings out-perform long sign-offs, but the mechanism is inferred.
- **Browse / Search / Suggested traffic-mix benchmarks vary wildly by niche.** Cited "healthy" splits (e.g., Suggested 25–40%, Browse 20–40%, Search 15–35%) are educated heuristics from creator-tooling vendors. There is no platform-published benchmark, and gaming, finance, education, and entertainment channels skew dramatically differently.
- **TV-screen weighting is changing the algorithm in ways still settling.** platform education leadership confirmed in mid-2025 that *"on TV, watch time will be more important; on mobile devices, audience reactions like likes/dislikes/comments will play a bigger role"* — meaning the same upload may be ranked differently per surface. Long-form briefs that explicitly target TV-living-room viewers (longer, 4K, fewer cuts-per-minute) are still a frontier; the data is < 12 months old.
- **A/B thumbnail testing's effect on cohort fairness** is unstudied. The built-in test rolled out in 2024 picks a winner based on watched-time-after-click — but a thumbnail that wins for one viewer cohort may be losing on another. a third-party benchmark/a third-party benchmark sample sizes don't publicly resolve this.

---

## 8. Changelog

| Date | Change | By |
|---|---|---|
| 2026-05-07 | Initial draft — long-form-specific (NOT Shorts). 4 hook archetypes (Thumbnail-Payoff, Cold Open + Pattern Interrupt, Promise Stack/HIVES, In Medias Res). 7 algorithm signals ranked. 6 anti-patterns. Sources span a large-channel operating note (Sep 2024), platform education leadership + Todd Beaupré 2025 algorithm interviews, a third-party benchmark a third-party benchmark practitioner analysis, an education-creator operator's HIVES framework, YouTube Help / Blog primary specs. | internal |
