<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

---
type: platform-intelligence
platform: tiktok
schema_version: 1
last_verified: 2026-05-08
verifier: internal
source_basis: "Internal research synthesis; raw source ledger intentionally omitted from public skill package."
status: draft
---

# Platform Intelligence — TikTok

Practitioner-grade reference consumed by `short-form-brief` (and downstream surface-specific copy skills) to ground hooks, format compliance, algorithm fit, and anti-pattern checks. Every claim is distilled into internal operating guidance. TikTok's ranking system is famously opaque — every practitioner-derived claim is tagged secondary; every signal TikTok itself stated is tagged primary.

When this doc's `last_verified` exceeds 90 days, the consuming critic flags `DONE_WITH_CONCERNS` with "platform signal may be stale — verify before publishing."

---

## 1. Hook Taxonomy

Four TikTok-native archetypes. These are not renames of the base six in `../hook-archetypes.md` — each is shaped by a specific TikTok mechanic (Stitch eligibility, sound trends, the 1-second swipe-decision, or POV grammar) that does not transfer cleanly to LinkedIn / X / Shorts.

### Archetype 1 — Callout Cliffhanger (POV / "Wait for it")

- **Definition:** Opening frame promises a payoff but withholds it; the visual of the unseen reveal carries the first 1–2 seconds while text overlay names the wait.
- **Identifying signal:** Text overlay reading "wait for it", "POV:", "you won't believe what happens", or "0:18" timestamp tease in the corner. Visual is the *setup* of the payoff (covered object, mid-action freeze, anticipatory stare). VO is minimal or silent — the sound is usually a build-up trending audio.
- **Pattern examples A:** "Wait for it…" overlay over a slow zoom on a covered baking pan — captioned "the loaf you've been afraid to try" — high-volume cooking-creator pattern documented in the editing template library's "Wait for it" template (template identifier omitted).
- **Pattern examples B:** "POV: you just hit $1M ARR and your wife asks how the day went" — [pattern-derived] — opening frame is speaker mid-sip of coffee, no audio for first beat. Founder-mode pattern surfacing consistently across creators tagged `#founderpov`; no specific post URL locatable via web search.
- **Engagement-signal rationale:** Withheld payoff drives **rewatches and completion** — the two heaviest user-interaction signals named by TikTok's own help-center doc, where it states "user interactions, which may include the time spent watching a video, are generally weighted more heavily than others." Rewatches are explicitly described by third-party cohort as carrying more weight than likes or follows.
- **Best for:** Founder-mode storytime, transformation, cooking, before/after, comedic setup. Fails on dense tutorials (the wait dilutes payoff specificity).

### Archetype 2 — Stitch Reaction (responsive hook)

- **Definition:** First 1–5 seconds of the video are another creator's clip (via the Stitch tool, which inserts up to 5 seconds of an existing public TikTok); the second beat is your reaction or counter.
- **Identifying signal:** Visual cut from another creator's vertical frame to yours at 0:02–0:05; "#stitch with @handle" attribution text or auto-generated stitch banner. The *original* clip is the hook — your face/voice arrives second.
- **Pattern examples A:** Billie Eilish stitched a video by practitioner source (a clip of her dog jumping with a long stick), opening with the dog clip and reacting with a teary close-up `[pattern-derived]` — documented as a 2024 viral Stitch case across creator-recap content; specific Billie Eilish post URL not pinned.
- **Pattern examples B:** practitioner source × Amazon Prime Video brand collaboration: stitched Prime's TikTok clip with a comedic counter-frame `[pattern-derived]` — pattern attributed to a 2024 brand-collab Stitch recap; specific post URL not pinned.
- **Engagement-signal rationale:** Stitches inherit the *original* video's audience graph (TikTok recommends back to viewers who engaged with the source), which front-loads completion among an already-warm cohort. The format is TikTok-native because Stitch eligibility is a per-video privacy setting (default ON for adults, OFF for under-16 creators) — neither LinkedIn nor Shorts has a structural equivalent.
- **Best for:** Reactive commentary, hot takes, founder responses to industry news, debunking. Fails when the source clip is uneligible (creator disabled stitch) or when the reaction adds nothing the original didn't.

### Archetype 3 — Sound-Trend Jack (audio-first hook)

- **Definition:** Hook is a trending sound at peak velocity; visual is your spin on the sound's established meme grammar. The audio is the hook signal — a viewer who recognizes the sound completes by reflex.
- **Identifying signal:** First 0–2 seconds are silent visually but the trending audio is recognizable in <1 second; text overlay often names the trope ("when [scenario]…"). The TikTok app explicitly surfaces this as a discovery vector via the Creative Center trending sounds list.
- **Pattern examples A:** A finance creator using the "Of course, of course / But of course" sound (multi-million-use sound, 2024–2025 cycle) over text "When clients ask if I can do their tax return for free." Pattern recurs across sub-niches; identifiable by the sound's waveform.
- **Pattern examples B:** Cooking creator using "Oh no — Oh no — Oh no no no no no" sound over ECU of a smoking pan at 0:01, jump-cut to MCU speaker at 0:02. Sound has 5M+ uses; recognizable by pitch alone.
- **Engagement-signal rationale:** TikTok's primary recsys doc names "sounds" inside the **content information** signal class. Trend-jacking compounds two signals at once — the sound's ranking momentum (TikTok will surface to users who engaged with other videos using the same audio) and the user's behavioral pattern of completing videos that match a sound-meme they already know. third-party cohort notes that native creation (filmed in-app, using in-app sounds) is favored over re-uploads.
- **Best for:** Personality content, niche-meme commentary, founder-mode comic timing, B-roll content with tight visual jokes. Fails when the sound is past its peak (use within 3–7 days of velocity inflection) or when the spin doesn't honor the sound's established grammar.

### Archetype 4 — Transformation Reveal (B-roll cold open)

- **Definition:** Cold open is fully B-roll — process, object, or environment — for 1–3 seconds before the speaker or "after" state appears. The hook is *visual specificity*, not a face.
- **Identifying signal:** No human face in 0:00–0:01; cut-on-action between two states (broken/whole, mess/clean, before/after) at 0:02–0:04; text overlay arrives with the cut, not before. The "reveal" is calibrated to land before the 3-second drop-off zone.
- **Pattern examples A:** Codie Sanchez's "I bought a laundromat for $X" pattern — opens on B-roll of the laundromat exterior or signage at 0:00, jump-cuts to MCU speaker at 0:02–0:03 stating the deal terms `[pattern-derived]`. Repeats across her Main Street acquisitions content (practitioner source); specific exemplar post URL not pinned.
- **Pattern examples B:** a large-channel operator challenge-format cold opens — drone shot of the set/prize at 0:00–0:02, cut to speaker stating the stake. Pattern recurs across challenge content; identifiable by the wide-shot-then-MCU rhythm.
- **Engagement-signal rationale:** Front-loaded visual specificity raises the 3-second retention curve. TTS Vibes' 2025 dataset (cohort N undisclosed but published Jan 2025) reports videos with **70–85% retention at 3 seconds** receive 2.2× more total views than videos below 60%, and 85%+ retention receives 2.8×. B-roll cold opens win on this curve because the viewer is decoding *what they're looking at* — decoding takes attention, attention buys past the swipe-decision threshold.
- **Best for:** Founder/creator with a tangible artifact (product, deal, location, transformation). Fails for pure talking-head where there's no B-roll worth opening on — those should use Credential flash from the base archetype set.

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Numeric over prose.

| Constraint | Value | reference |
|---|---|---|
| Duration sweet spot (entertainment / comedy / trends) | 21–34s | internal |
| Duration sweet spot (educational / how-to) | 60–180s | internal; buffer-length |
| Duration — full reach-maximizing tier | 60s+ (43.2% more reach, 63.8% more watch time vs 30–60s baseline) | buffer-length (1.1M-video cohort, published Mar 2025) |
| Duration hard cap (in-app recording) | 10 minutes | TikTok app recording limits (rolled out Feb 2022) |
| Duration hard cap (uploaded video) | 60 minutes (gradual rollout, not all accounts have access) | TikTok newsroom 60-min upload announcement, 2024 |
| Aspect ratio (required for FYP full-screen) | 9:16 vertical | internal |
| Resolution recommended | 1080×1920 px | internal |
| File format | MP4 or MOV | TikTok Help Center upload specs |
| Frame rate | 30 fps (60 fps for fast motion) | TikTok upload specs |
| Max file size (organic) | 287.6 MB | TikTok Help Center |
| Max file size (Ads / Business accounts) | 2 GB | TikTok Help Center |
| Caption character limit | 4,000 characters (raised from 2,200 in 2023; 2,200 was raised from 300 mid-2022) | Practitioner-derived (no platform-doc reference in current sources block — see §7) |
| Caption truncation point in feed | First ~1 line visible (~70–80 chars) before "...more" expand | internal; a third-party benchmark caption guidance |
| Safe zone — bottom (UI overlay) | ~324 px from bottom edge on 1080×1920 (caption + sound attribution + progress bar) | internal |
| Safe zone — right (engagement icon column) | ~164 px from right edge | internal |
| Safe zone — top | ~150 px (username/follow button area) | internal |
| Burned-in caption recommendation | Yes — 75% of TikTok video views happen sound-off; auto-captions exist but accuracy is "notoriously low" per practitioner consensus | internal; internal |
| Hashtag norm | 3–5 hyper-specific hashtags (the editing template library's/ByteDance editor explicit guidance) | Practitioner consensus across multiple secondary sources (specific source IDs not yet pinned to frontmatter — see §7) |
| Cover/thumbnail | Custom upload OR frame selection at post time. Profile grid crops to **center 1080×1080** (top 420 px and bottom 420 px cut off in grid). Caption auto-overlays bottom ~270 px of cover in feed. | internal |
| Audio handling | Original audio favored for narrative; trending sounds favored for trend-jack archetype. TikTok's recsys explicitly names sounds as a content-information signal. | internal |
| Stitch eligibility | Per-video toggle. Default ON for adult creators; **OFF and unchangeable for creators under 16**. Disabling Duet also disables Stitch and Story-add. | internal; internal |
| Duet eligibility | Per-video toggle. Default ON for adults; teen accounts (13–15) restricted to friends-only. | internal |

---

## 3. Algorithm Signals (Ranked by Impact)

Six signals, ordered by practitioner consensus + primary-doc weight. TikTok itself only states a coarse hierarchy ("user interactions … weighted more heavily"), so the within-tier ranking is practitioner-derived.

1. **Completion rate / play duration** — total seconds watched ÷ video length, plus rewatches. *Why:* TikTok's Creator Rewards Program Newsroom post defines play duration as one of four core ranking metrics: "accounts with content that is clear, and engaging, rather than favoring accounts with an excessive amount of videos." The recsys help-center doc names "watch in full" as the headline user-interaction signal. *Lever:* spec 21–34s for entertainment briefs to keep completion ≥80% (entertainment sweet spot per Creator Center); 60–180s for educational briefs only when retention curve is engineered (cold open + payoff structure). *Tier:* primary.

2. **Rewatches + Shares** — replay loops and external/internal shares. *Why:* third-party cohort 2026 algorithm guide states "shares and rewatches may signal stronger interest than a like or follow," and frames them as more heavily weighted than likes/comments inside the engagement bucket. *Lever:* loop-friendly final frame (last frame visually compatible with first frame so replay is invisible); add a "share this with your [persona]" overlay at 0:20+ on retention-tested briefs. *Tier:* secondary (internal interpretation of TikTok's primary signals).

3. **Search value** — alignment of video content (spoken, on-screen, captioned) to in-demand search queries surfaced in **Creator Search Insights**, the in-app keyword tool TikTok rolled out in 2024. *Why:* Newsroom Creator Rewards announcement names search value as one of the four core ranking metrics, defined as "metric assigned to content based on popular search terms." Practitioners report spoken keywords in the first few seconds are heavily indexed. *Lever:* spec the briefed keyword in (a) the first spoken line, (b) on-screen text overlay, and (c) caption — triple-tagged. *Tier:* primary (Newsroom) + secondary (practitioner ranking-signal interpretation).

4. **Likes + Comments** — engagement actions of moderate weight. *Why:* Listed in internal as user-interaction signals but third-party cohort notes likes/comments carry less weight than shares/rewatches. *Lever:* spec a comment-driving open question pinned by creator at 0:00 of comment thread. Avoid engagement-bait phrasing ("comment YES if you agree") — flagged below as anti-pattern. *Tier:* primary (signal exists) + secondary (relative weight).

5. **Originality** — Creator Rewards Program metric defined as "quality content unique to the creator, showcasing their point of view or creative thought process." Note: this is TikTok's own definition for *Creator Rewards Program payouts*, distinct from Instagram's January 2025 "Originality Score" (platform leadership's) which applies to Reels, not TikTok. *Lever:* avoid re-uploads of competitor TikToks; avoid cross-platform watermark drag (see anti-patterns); use native TikTok creation tools (in-app camera, in-app sounds, native text). *Tier:* primary.

6. **Content information (sounds, hashtags, captions, on-screen text)** — TikTok's recsys doc lists "sounds, hashtags, number of video views, and the country in which the content was published" as content-information signals. These are *contextual* signals — they help the recsys decide *who* to show the video to, not whether to show it. *Lever:* trending sound at peak velocity + 3–5 niche hashtags + spoken keyword in first 3s. *Tier:* primary.

**Explicitly NOT a top-tier signal:** Follower count is **absent** from TikTok's stated For You feed signals. Follower count is named only for LIVE feed and account recommendations. This is why low-follower accounts can hit FYP — operators should not gate hypotheses on existing audience size.

---

## 4. Anti-Patterns

Each entry is a content trait the algorithm or audience penalizes, with a falsifiable detection rule a critic agent can enforce on a brief.

| Pattern | Penalty observed | Detection rule | Source |
|---|---|---|---|
| **Visible Reels / the editing template library's / TikTok-of-other-app watermark** | TikTok algorithmically deprioritizes "unoriginal content (watermarked)" per a third-party benchmark's reading of TikTok's FYF Standards. Note: Meta does this most aggressively (TikTok logo on Reels = restricted to followers, no Explore/Shorts shelf). TikTok's enforcement is softer but originality metric in Creator Rewards explicitly rewards native content. | Brief mentions "repurposed from Reels" / "the editing template library's export" / "downloaded from another app" without a watermark-removal step. Visual brief shows watermark in any frame. | internal; internal; internal |
| **Engagement-bait CTAs ("Comment YES if you agree", "Like if you want part 2")** | a third-party benchmark's reading of FYF Standards lists "fake engagement" as one of 14 unrecommendable categories. Risk is downrank or FYF-ineligible flag. | Brief CTA contains explicit instruction to comment a single word, like for visibility, share to win, or "follow if you want X". | internal; internal |
| **Off-platform link as primary CTA in first 5 seconds** | TikTok is structurally hostile to off-platform — no clickable links in caption or comments; only bio link is clickable. CTAs front-loaded reduce completion (the #1 signal). Practitioner data: CTAs after 0:18 preserve retention; before 0:05 trigger drop-off. | Brief CTA specifies "click link in bio" before 0:18 mark, OR brief specifies external URL in caption (which won't be clickable anyway, signaling unfamiliarity with the platform). | TikTok Help Center linking rules; internal CTA placement |
| **Low resolution (<1080×1920)** | TikTok's recsys does not explicitly penalize resolution but black bars (sub-9:16) break full-screen playback and tank completion. | Brief asset spec is <1080×1920 OR aspect ratio ≠ 9:16 OR contains pillarbox/letterbox bars. | internal |
| **Sound-off-friendly failure (no burned captions for spoken content)** | 75% of TikTok views are sound-off; videos relying on VO without on-screen text lose comprehension → lose completion. Auto-captions exist but accuracy is poor for jargon, accents, brand names. | Brief spec for spoken-line scene has no `text_overlay` or `burned_caption: true` field, OR relies on TikTok auto-captions only. | internal; internal |
| **Hook arrives after 0:02** | TTS Vibes 2025: 84.3% of viral TikToks deploy hook trigger within first 3 seconds; videos with <60% retention at 3s receive minimal algorithmic promotion. | Brief storyboard spec puts the credential, claim, or visual reveal at frame 0:03+ with no earlier hook. | internal |
| **Hashtag stuffing (>7 tags)** | Sends "mixed signals" to recsys per practitioner consensus + the editing template library's/ByteDance editor guidance; dilutes niche targeting. | Brief specifies more than 5 hashtags OR mixes broad (#fyp, #foryou, #viral) with niche tags hoping for both. | Practitioner consensus + the editing template library's creator guidance (specific source IDs not yet pinned — see §7) |
| **POV opener that doesn't pay off** | The "POV / wait for it" archetype works only if the payoff lands within the duration sweet spot. Videos that promise reveal and bury it past 0:25 lose retention catastrophically (drop-off accelerates after 3s). | Brief storyboard timeline shows "wait for it" overlay at 0:00 but reveal beat at 0:25+ on a sub-30s entertainment video. | internal; archetype 1 above |
| **Re-upload of own cross-platform content with TikTok-foreign pacing** (e.g., 2-second establishing shots, slow LinkedIn-style talking-head openings) | Originality metric penalizes; completion rate tanks. | Brief asset is "repurposed from LinkedIn / YouTube / podcast clip" without re-edit for TikTok hook window. | internal; buffer-algo (native creation favored) |

---

## 5. Hook Window + Retention Curve

- **First-second goal (0:00–0:01):** Visual + audio + text overlay must each carry a recognizable signal — face / B-roll specificity / trend-sound recognition / on-screen claim. The swipe-decision happens in this window. Practitioner consensus: **70%+ of viewers decide in the first 3 seconds**.
- **Critical drop-off point (0:03):** Strong-performing videos hold **80–90% retention through 0:03**. A drop of >30% in the first 3 seconds is the failure threshold — algorithmic promotion collapses below 60% retention at 3s.
- **Retention checkpoints (industry data, sourced):**
 - 70–85% retention at 0:03 → 2.2× baseline views [pattern-derived]
 - 85%+ retention at 0:03 → 2.8× baseline views [pattern-derived]
 - 60–70% retention at 0:03 → 1.6× baseline views (still positive but compressed)
 - <60% retention at 0:03 → minimal algorithmic promotion (effectively shadow-suppressed for FYP, not the same as a shadow ban — see Section 7)
- **Loop / replay behavior:** TikTok rewards rewatches. third-party cohort explicitly uses rewatches as carrying "stronger" signal than likes or follows. Loop-friendly final frame (last frame visually compatible with first frame) buys invisible re-entries. The "Of course, of course" sound trend works partly because the audio loop matches the visual loop.
- **Long-form retention curve (60s+ videos):** third-party cohort 1.1M cohort: median watch time on 60s+ videos is **11.3 seconds**, on 30–60s videos is **6.9 seconds**. Long-form earns more *total* watch time but absolute completion is lower — operators must engineer mid-video retention curves (subhook at 0:08, payoff escalation at 0:15, secondary reveal at 0:25) for educational content.

---

## 6. CTA Placement Norms

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| **Verbal CTA at 0:18–0:25 ("if you want X, comment Y")** | Educational + founder-mode content where the value is delivered before the ask. Preserves completion above the 60% threshold. | When the CTA is the entire value proposition (i.e., the whole video is the ask). Triggers engagement-bait classifier. | internal; internal |
| **End-card overlay at 0:00 of last second** | Educational / how-to content where the loop CTA is "save this to try later." Save is a high-value engagement signal. | Entertainment / POV content — end-card kills the loop and breaks rewatch potential. | buffer-algo (saves as engagement signal) |
| **Caption first line CTA** | When CTA is brief, niche-specific, and search-keyword-rich. Caption truncation at ~70–80 chars before "...more" means the CTA must be tight. | When the CTA is generic ("link in bio for more") — wastes the most-indexed text real estate. Caption is also a search-value lever per Creator Rewards; using it for a generic CTA forfeits search ranking. | internal; internal |
| **Comment-pinned CTA** | Long-form (60s+) and educational content where viewers actively scroll comments. Creator pins their own comment with the CTA and link mentioned in plain text (not clickable, but copy-pasteable). | First-3-day organic posts where the comment thread is sparse — the pinned comment is buried by replies. | TikTok Help Center linking rules; practitioner consensus |
| **Bio link as terminal CTA** | The only clickable destination on TikTok. Works when the video drives high view-through and the bio link is the singular focused destination (not a Linktree menu). | When users are asked to "click link in bio" without enough motivation — friction is high (open profile → tap link → leave app). | TikTok Help Center linking rules |

---

## 7. Open Questions / Known Unknowns

- **The "shadow ban" topic — folklore vs. documented.** TikTok's Help Center documents a specific mechanic: content can be marked **"ineligible for the For You feed"** by Trust & Safety review, with creators given a reason and an appeal path. However, TikTok does **not** use the term "shadow ban" in its community guidelines, and there is **no public documentation** of the threshold for account-level FYF ineligibility. Practitioner folklore claims of "stealth shadow bans" for hashtag stuffing or low retention are **not confirmed by primary docs** — what *is* confirmed is that low retention reduces algorithmic promotion (Section 5), which is a distribution outcome, not a punitive ban. Operators should distinguish: (a) FYF-ineligible flag (documented, appealable) vs. (b) low-retention auto-suppression (a math outcome, not a flag).
- **Exact within-tier weight of completion vs. shares vs. rewatches** is undisclosed. TikTok's primary doc only states user-interactions are weighted more heavily than content/device signals. third-party cohort ranks rewatches/shares above likes/follows but provides no numeric weights. Any brief that claims "shares are weighted 3× likes" is fortune-cookie — flag for reference.
- **Creator Search Insights' ranking-signal weight.** Newsroom names "search value" as one of four Creator Rewards Program metrics, but it's unclear whether search value applies equally to **organic FYP distribution** or only to **Creator Rewards payout calculations**. Practitioner consensus (a third-party benchmark, ALM Corp) treats search value as a top-tier organic signal in 2026; primary docs are softer on this.
- **Spoken-keyword indexing depth.** Practitioner claim: TikTok transcribes and indexes spoken audio for search. Primary doc evidence: auto-captions feature (internal) confirms TikTok runs ASR on uploads. Whether the ASR transcript is fed into the search index at full fidelity, or only into accessibility surface, is **not publicly stated**. Briefs that depend on audio-only keyword exposure (no on-screen text, no caption) are betting on an unconfirmed pipeline.
- **The 60-minute upload cap rollout cohort.** Primary docs confirm 60-min uploads exist as of 2024 but rollout is gradual ("professional and high-authority accounts" first). No public cutoff for which accounts have access. Briefs spec'ing 10+ minute videos should verify the target account has the capability.
- **Originality Score equivalent.** Instagram introduced a platform leadership's-described Originality Score in January 2025 affecting Reels. TikTok's "Originality" metric (Creator Rewards Program, March 2024) is **not the same mechanism** — TikTok's is a payout metric per Newsroom; Instagram's is a distribution metric. Conflating them in a brief is a critic-failure trigger.
- **Caption character limit (4,000 chars) primary-source reference gap.** The 2023 expansion from 2,200 → 4,000 is widely repeated by practitioners (a third-party benchmark, a third-party benchmark, jera.bean's announcement) but no TikTok Help Center URL has been pinned to the frontmatter sources block. The numeric value is correct in practitioner consensus; the reference chain is not yet primary. To resolve: locate and add the relevant TikTok Help Center / Newsroom announcement.
- **Hashtag-norm reference chain.** The 3–5 hyper-specific hashtag norm and the >7 stuffing penalty are both practitioner consensus across multiple sources, but the inline reference (`internal`, `admetrics`, `sproutsocial`) were not registered in the frontmatter sources block at first ship. Re-research pass needs to convert these to proper source entries with URLs + accessed dates, or replace with TikTok primary docs if they exist.

---

## 8. Changelog

| Date | Change | By |
|---|---|---|
| 2026-05-07 | Initial draft — 4 TikTok-native archetypes; format constraints from primary + practitioner sources; 6 ranked algorithm signals with primary/secondary tier markings; 9 anti-patterns with detection rules; retention curve from TTS Vibes Jan-2025 dataset and third-party cohort Mar-2025 1.1M-video cohort; 5 open questions including shadow-ban folklore vs. documented FYF-ineligibility flag. | internal |
| 2026-05-08 | Phase 0.5b URL repair (Bucket A). Findings 1-4 closed: Archetype 1 example B ("POV: you just hit $1M ARR"), Archetype 2 examples A+B (Billie Eilish stitch / practitioner source × Prime Video brand stitch), and Archetype 4 example A (Codie Sanchez laundromat) — all relabeled `[pattern-derived]` with practitioner-observed framing preserved. No fabricated URLs. `last_verified` bumped to 2026-05-08. | internal |
