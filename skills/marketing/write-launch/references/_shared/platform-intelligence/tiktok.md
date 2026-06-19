<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: tiktok
schema_version: 2
pack_type: shortform-video
last_verified: 2026-06-18
verifier: agent
source_basis: "Per-claim categorical + named-source citations inline. Ranking signals cited to TikTok official docs (Newsroom #ForYou + Support how-it-recommends + FYF Eligibility Standards); benchmarks named (Socialinsider 2026, Rival IQ 2025). Numeric ranking weights are NOT TikTok-published — any % breakdown is [practitioner consensus]."
status: reviewed
summary: "TikTok ranking is interaction-weighted, not follower-weighted: finishing a video end-to-end is TikTok's strongest stated interest signal and follower count is NOT a direct For You ranking factor — so a cold-open hook that earns completion, not an existing audience, decides reach."
---

# Platform Intelligence — TikTok (shortform video)

Practitioner-grade reference consumed by `brief-shortform`, `produce-video`, `evaluate-shortform`,
and the downstream surface-specific copy skills to ground hooks, format compliance, algorithm fit,
and anti-pattern checks. Every claim is distilled into an operating lever — **not** generic "how to
go viral" advice.

TikTok's ranking system is famously opaque: TikTok publishes the *signal categories* it uses but
**no numeric weights**. So this pack separates **what TikTok itself states** (cited to the Newsroom
#ForYou explainer, the Support help-center doc, and the For You Feed Eligibility Standards) from
**what practitioners infer** (tagged `[practitioner consensus]` or `[pattern-derived]`). Any brief
that asserts a specific weight ("shares are 3× likes") is fortune-cookie — flag it.

The single load-bearing truth: TikTok states that finishing a longer video end-to-end is a **strong
interest signal**, weighted above weak signals like same-country, and that **follower count is not a
direct For You ranking factor**. That is why a low-follower account can hit the For You feed — and why
the whole playbook is engineered around a completion-optimized cold open, not an existing audience.

When this doc's `last_verified` exceeds 90 days, `validate-packs.ts` warns and the consuming critic
downgrades to `DONE_WITH_CONCERNS` — TikTok periodically retunes ranking + FYF enforcement, so
re-verify before a real campaign. A Pro client is served the current pack from the freshness pipeline.

---

## 1. Hook Taxonomy

Four TikTok-native archetypes. These are not renames of the base six in `../hook-archetypes.md` —
each is shaped by a specific TikTok mechanic (Stitch eligibility, sound trends, the ~1-second
swipe-decision, or POV grammar) that does not transfer cleanly to LinkedIn / X / Shorts.

### Archetype 1 — Callout Cliffhanger (POV / "Wait for it")

- **Definition:** Opening frame promises a payoff but withholds it; the visual of the unseen reveal
  carries the first 1–2 seconds while a text overlay names the wait.
- **Identifying signal:** Text overlay reading "wait for it", "POV:", "you won't believe what
  happens", or a "0:18" timestamp tease in the corner. Visual is the *setup* of the payoff (covered
  object, mid-action freeze, anticipatory stare). VO is minimal or silent — the sound is usually a
  build-up trending audio.
- **Pattern examples A:** "Wait for it…" overlay over a slow zoom on a covered baking pan, captioned
  "the loaf you've been afraid to try" — a high-volume cooking-creator shape. [pattern-derived from the
  cooking/food-creator cohort]
- **Pattern examples B:** "POV: you just hit $1M ARR and your wife asks how the day went" — opening
  frame is the speaker mid-sip of coffee, no audio for the first beat. [pattern-derived from the
  `#founderpov` founder-mode cohort]
- **Engagement-signal rationale:** A withheld payoff drives **rewatches and completion**. TikTok's
  Support doc states user interactions such as the time a user spends watching a video are weighted
  more heavily than weak signals, and the Newsroom #ForYou explainer names finishing a longer video
  end-to-end as a strong interest signal. [practitioner consensus] holds that rewatches read above a
  like or a follow, but TikTok does not publish that ordering.
- **Best for:** founder-mode storytime, transformation, cooking, before/after, comedic setup. Fails
  on dense tutorials (the wait dilutes payoff specificity).

### Archetype 2 — Stitch Reaction (responsive hook)

- **Definition:** The first 1–5 seconds are another creator's clip (via the Stitch tool, which
  inserts up to 5 seconds of an existing public TikTok); the second beat is your reaction or counter.
- **Identifying signal:** A visual cut from another creator's vertical frame to yours at 0:02–0:05;
  a "#stitch with @handle" attribution banner. The *original* clip is the hook — your face/voice
  arrives second.
- **Pattern examples A:** A celebrity-account Stitch of a fan clip, opening with the source clip and
  cutting to an emotional close-up reaction. [pattern-derived from the 2024 celebrity-Stitch recap
  cohort] — no specific post URL pinned.
- **Pattern examples B:** A creator-×-streaming-brand collaboration that stitches the brand's TikTok
  clip with a comedic counter-frame. [pattern-derived from the 2024 brand-collab Stitch cohort] — no
  specific post URL pinned.
- **Engagement-signal rationale:** Stitches inherit the *original* video's audience graph, which
  front-loads completion among an already-warm cohort. The format is TikTok-native because Stitch
  eligibility is a per-video privacy setting (default ON for adults, OFF for under-16 creators) —
  neither LinkedIn nor Shorts has a structural equivalent.
- **Best for:** reactive commentary, hot takes, founder responses to industry news, debunking. Fails
  when the source clip is ineligible (creator disabled Stitch) or when the reaction adds nothing the
  original didn't.

### Archetype 3 — Sound-Trend Jack (audio-first hook)

- **Definition:** The hook is a trending sound at peak velocity; the visual is your spin on the
  sound's established meme grammar. The audio is the hook signal — a viewer who recognizes the sound
  completes by reflex.
- **Identifying signal:** The first 0–2 seconds are visually quiet but the trending audio is
  recognizable in <1 second; a text overlay often names the trope ("when [scenario]…"). The TikTok
  Creative Center surfaces trending sounds explicitly as a discovery vector.
- **Pattern examples A:** A finance creator using a multi-million-use "of course / but of course"
  sound over text "When clients ask if I can do their tax return for free." [pattern-derived from the
  finance/professional-services cohort] — identifiable by the sound's waveform, not a fixed URL.
- **Pattern examples B:** A cooking creator using an "oh no — oh no no no" sound over an extreme
  close-up of a smoking pan at 0:01, jump-cut to a medium shot of the speaker at 0:02. [pattern-derived
  from the food-creator cohort] — recognizable by pitch alone.
- **Engagement-signal rationale:** TikTok's Support doc names **sounds** inside the *video
  information* signal category (alongside captions and hashtags). Trend-jacking compounds the sound's
  own ranking momentum with the viewer's reflex to complete a sound-meme they already know. TikTok's
  FYF Standards mark watermarked / unoriginal reposted content as ineligible for recommendation, so
  native in-app creation (in-app sounds, in-app camera) is favored over re-uploads.
- **Best for:** personality content, niche-meme commentary, founder-mode comic timing, B-roll with
  tight visual jokes. Fails when the sound is past its peak (use within ~3–7 days of velocity
  inflection — [practitioner consensus]) or when the spin doesn't honor the sound's grammar.

### Archetype 4 — Transformation Reveal (B-roll cold open)

- **Definition:** The cold open is fully B-roll — process, object, or environment — for 1–3 seconds
  before the speaker or "after" state appears. The hook is *visual specificity*, not a face.
- **Identifying signal:** No human face in 0:00–0:01; a cut-on-action between two states
  (broken/whole, mess/clean, before/after) at 0:02–0:04; the text overlay arrives with the cut, not
  before. The "reveal" is calibrated to land before the early drop-off zone.
- **Pattern examples A:** A small-business-acquisition creator's "I bought a [business] for $X"
  shape — opens on B-roll of the storefront/signage at 0:00, jump-cuts to a medium shot of the
  speaker at 0:02–0:03 stating the deal terms. [pattern-derived from the acquisitions/operator
  cohort] — no specific post URL pinned.
- **Pattern examples B:** A large-channel challenge format cold-opening on a drone shot of the
  set/prize at 0:00–0:02, cutting to the speaker stating the stake. [pattern-derived from the
  challenge-format cohort] — identifiable by the wide-shot-then-medium-shot rhythm.
- **Engagement-signal rationale:** Front-loaded visual specificity raises early retention — the
  viewer spends the first seconds *decoding what they're looking at*, and that decoding buys past the
  swipe-decision. The mechanism (completion as a strong signal) is TikTok-stated; the specific
  retention-multiplier figures circulated by third-party datasets are [practitioner consensus], not
  TikTok-published (§6).
- **Best for:** a founder/creator with a tangible artifact (product, deal, location, transformation).
  Fails for a pure talking-head with no B-roll worth opening on — those should use the Credential
  flash from the base archetype set.

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Numeric over prose.

| Constraint | Value | Source |
|---|---|---|
| Aspect ratio (required for full-screen For You playback) | **9:16 vertical**; 1:1 / 16:9 accepted but earn lower watch time | TikTok Help Center upload specs |
| Resolution recommended | **1080×1920 px** | TikTok Help Center upload specs |
| Duration sweet spot (short entertainment / comedy / trends) | ~21–34s | [practitioner consensus] (NOT TikTok-published) |
| Duration sweet spot (educational / how-to) | ~60–180s | [practitioner consensus]; real practitioner two-tier guidance |
| Highest-engagement length (named benchmark) | **2-minute videos** rank highest, <15s second | Socialinsider Sep-2025 video-length analysis |
| Duration cap (in-app recording) | **10 minutes** | TikTok Help Center / in-app recording |
| Duration cap (uploaded video) | up to **60 minutes** (gradual rollout; not all accounts) | TikTok Newsroom 60-min upload announcement (2024) |
| File format | MP4 (H.264 + AAC) preferred; MOV accepted | TikTok Help Center upload specs |
| Max file size (Android) | ~72 MB | TikTok Help Center |
| Max file size (iOS) | ~288 MB | TikTok Help Center |
| Max file size (web upload) | up to 4 GB | TikTok Help Center |
| Caption / on-screen text indexing | captions, sounds, hashtags are the *video information* signal class | TikTok Support (how-it-recommends) |
| Caption truncation point in feed | first ~1 line visible (~70–80 chars) before the "…more" expand | [practitioner consensus] |
| Safe zone — bottom (UI overlay) | ~324 px from bottom on 1080×1920 (caption + sound attribution + progress bar) | [practitioner consensus] |
| Safe zone — right (engagement icon column) | ~164 px from right edge | [practitioner consensus] |
| Safe zone — top | ~150 px (username / follow-button area) | [practitioner consensus] |
| Burned-in captions | recommended — most feed views play sound-off; in-app auto-captions exist but ASR accuracy is weak for jargon/accents/brand names | [practitioner consensus] |
| Hashtag norm | **3–5** hyper-specific tags; broad spam-tags (#fyp, #viral) dilute targeting | [practitioner consensus] |
| Cover / thumbnail | custom upload OR frame selection at post time; profile grid crops toward center; caption auto-overlays the lower band of the cover in feed | [practitioner consensus] |
| Watermark / repost | content with someone else's visible watermark or a superimposed logo is **ineligible for recommendation** | TikTok FYF Eligibility Standards |
| Stitch eligibility | per-video toggle; default ON for adults, **OFF and unchangeable for creators under 16**; disabling Duet also disables Stitch | TikTok Support (Stitch settings) |
| Duet eligibility | per-video toggle; default ON for adults; teen accounts (13–15) restricted to friends-only | TikTok Support (Duet settings) |

The two-tier duration framing (short entertainment vs longer educational) is real practitioner
guidance and worth keeping — but the exact "21–34s sweet spot" is **not** a TikTok-published number.
Where a *named* benchmark exists, prefer it: Socialinsider's Sep-2025 analysis found 2-minute videos
the highest-engagement length, with sub-15s second.

---

## 3. Algorithm Signals (TikTok-stated categories first, then inferred ranking)

TikTok officially states **three signal categories** in its Newsroom #ForYou explainer and Support
how-it-recommends doc. It does **not** publish weights or a within-category ranking. The official
hierarchy is coarse: user interactions are weighted above video information, which is weighted above
device/account settings; finishing a longer video end-to-end is a *strong* interest signal, weighted
above weak signals like same-country. **Surfaces weight differently** — the For You feed leans on
interactions; Search and Comments surfaces lean on video information.

**TikTok-stated categories (primary):**

1. **User interactions** — likes, shares, comments, follows, watch time, and **completes** (watching
   end-to-end). *Source:* TikTok Support; Newsroom #ForYou. *Lever:* engineer completion — a tight
   cold open and a payoff inside the duration sweet spot. This is the heaviest stated category.
2. **Video information** — captions, **sounds**, and hashtags. *Source:* TikTok Support. *Lever:* a
   trending sound at peak velocity + 3–5 niche hashtags + the briefed keyword spoken in the first
   few seconds. This category dominates the Search and Comments surfaces.
3. **Device / account settings** — language preference, country setting, device type. *Source:*
   TikTok Support. **Lower weight** — TikTok states these are weighted less because they reflect
   setup, not active interest. *Lever:* none worth optimizing; do not gate on geography.

**Practitioner-inferred within-category ranking (secondary — `[practitioner consensus]`, no TikTok weights):**

- **Completion rate / watch-in-full + rewatches** read as the strongest interaction in practice —
  consistent with TikTok's stated "finishing end-to-end = strong interest." Spec a short brief
  (entertainment) for high completion; engineer a mid-video retention curve for a longer educational
  brief (subhook ~0:08, payoff escalation ~0:15, secondary reveal ~0:25).
- **Shares + rewatches** are inferred to read above a like or a follow inside the interaction bucket.
  *Lever:* a loop-friendly final frame (last frame visually compatible with the first) buys invisible
  re-entries; a "share this with your [persona]" overlay late in the video. No published weight.
- **Search value** — alignment of spoken/on-screen/captioned content to in-demand queries surfaced
  by the in-app Creator Search Insights tool. Practitioners treat it as a rising top-tier organic
  signal; TikTok's docs name search as a *surface* that weights video information, but do not publish
  a "search value" organic weight (§8). *Lever:* triple-tag the keyword (spoken line / on-screen text
  / caption).
- **Likes + comments** — real but inferred to carry less weight than shares/rewatches. *Lever:* a
  comment-driving open question. Avoid engagement-bait phrasing — it is FYF-ineligible (§4).

**Explicitly NOT a direct ranking factor: follower count.** TikTok states follower count is **not**
a direct For You ranking factor (it surfaces for account recommendations and the LIVE feed, not For
You distribution). This is why low-follower accounts can hit the For You feed — operators should not
gate hypotheses on existing audience size.

---

## 4. Anti-Patterns

Each entry is a content trait the algorithm or audience penalizes, with a falsifiable detection rule
a critic agent can enforce on a brief.

| Pattern | Penalty observed | Detection rule | Source |
|---|---|---|---|
| **Visible third-party watermark / superimposed logo** (TikTok-of-another-app, downloaded clip) | Content with someone else's visible watermark or a superimposed logo is **ineligible for recommendation** | Brief mentions "repurposed from another app" / "downloaded clip" without a watermark-removal step, OR the visual brief shows a watermark in any frame | TikTok FYF Eligibility Standards (primary) |
| **Engagement bait** ("Comment YES if you agree", "Like for part 2", like-for-like) | FYF Standards mark engagement bait — tricking or manipulating to increase gifts/followers/likes/views — as **ineligible for recommendation** | Brief CTA contains an explicit instruction to comment a single word, like for visibility, follow-for-X, or any like/follow trade | TikTok FYF Eligibility Standards (primary) |
| **Fake / inflated metrics** (bought views, vote-style rings) | Prohibited under TikTok's Integrity & Authenticity guidelines | Brief or campaign plan relies on purchased engagement or coordinated inauthentic boosting | TikTok Community Guidelines — Integrity & Authenticity (primary) |
| **Off-platform link as the primary CTA in the first ~5 seconds** | Captions/comments have no clickable link (only the bio link is clickable); a front-loaded leave-the-app CTA cuts completion (the heaviest stated signal) | Brief specifies "click link in bio" before ~0:18, OR specifies an external URL in caption (won't be clickable — signals platform-unfamiliarity) | TikTok linking rules + [practitioner consensus] on CTA placement |
| **Sub-9:16 / letterboxed asset** | TikTok does not state a resolution penalty, but black bars break full-screen playback and tank completion | Asset spec is <1080×1920 OR aspect ratio ≠ 9:16 OR contains pillarbox/letterbox bars | [practitioner consensus] (mechanism via completion) |
| **No burned captions for spoken content** | Most feed views are sound-off; VO-only loses comprehension → loses completion. Auto-captions are weak for jargon/accents/brand names | Brief's spoken-line scene has no `text_overlay` / `burned_caption: true`, OR relies on TikTok auto-captions only | [practitioner consensus] |
| **Hook arrives after ~0:02** | The swipe-decision happens in the first couple of seconds; a late hook loses the cohort that decides reach | Brief storyboard puts the credential/claim/visual reveal at 0:03+ with no earlier hook | [practitioner consensus] (mechanism: completion is TikTok-stated) |
| **Hashtag stuffing (>5–7 tags)** | Sends mixed signals to the recsys and dilutes niche targeting | Brief specifies >5 hashtags OR mixes broad spam-tags (#fyp, #foryou, #viral) with niche tags | [practitioner consensus] |
| **POV opener that doesn't pay off** | The "wait for it" archetype works only if the payoff lands inside the duration sweet spot; a buried reveal loses retention | Brief storyboard shows a "wait for it" overlay at 0:00 but the reveal beat at 0:25+ on a sub-30s entertainment video | [pattern-derived] + Archetype 1 above |
| **Re-upload of cross-platform content with TikTok-foreign pacing** (2s establishing shots, slow talking-head openings) | Reads as unoriginal/reposted (FYF originality bar); completion tanks | Brief asset is "repurposed from LinkedIn / YouTube / podcast clip" without a re-edit for the TikTok hook window | TikTok FYF Standards (unoriginal repost) + [practitioner consensus] (native creation favored) |

"Don't be spammy" is not an anti-pattern. "Any first-comment or CTA copy that instructs a single-word
comment, a like-for-visibility, or a follow-for-X fails the engagement-bait check" is.

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic:** a scoped, search-shaped angle delivered as a **cold-open hook in the
first 1–2 seconds** + a triple-keyword (spoken line / on-screen text / caption) + a completion-tuned
edit + a **native, watermark-free** post — because TikTok states completion is its strongest interest
signal and follower count is *not* a ranking factor, so the hook-to-completion path is what earns
reach, regardless of follower count.

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | Pick a scoped, search-shaped angle | T−1d | Choose one of the four archetypes (§1) for the niche; phrase the topic as an in-demand query a viewer would search (use Creator Search Insights). NOT a broad "tips" topic. | A one-line angle that names a specific query + the chosen archetype |
| 2 | Set the triple keyword | T−1d | Lock the briefed keyword to land in three places: (a) the first spoken line, (b) an on-screen text overlay, (c) the caption's first ~70 chars. | Keyword present in spoken line + overlay + caption first line |
| 3 | Write the cold-open hook | T−0 (script) | Front-load the hook into 0:00–0:02: B-roll specificity, a trend-sound recognizable in <1s, a withheld payoff, or a stitched source clip — never a slow establishing shot. | Hook signal lands by 0:02 in the storyboard; no pre-roll throat-clearing |
| 4 | Edit for completion | T−0 (edit) | 9:16 / 1080×1920, burned captions for all spoken content, payoff inside the duration sweet spot (short entertainment ~21–34s, or a retention-curved longer educational cut), loop-friendly final frame. | Asset passes §2; payoff lands before drop-off; last frame loops to first |
| 5 | Post natively, watermark-free | T−0 (publish) | Publish in-app (in-app sounds, native text); strip any third-party watermark; 3–5 niche hashtags; trending sound at peak velocity. | No third-party watermark in any frame; FYF-eligible; 3–5 niche tags |
| 6 | Reply to early comments | T+0 → T+2h | Reply substantively to the first wave of comments (no engagement-bait phrasing); seed/answer a pinned open question to grow the thread. | Replies to the first comment wave within ~2h; thread growing, bait-free |
| 7 | Measure completion rate | T+24h → T+72h | Pull completion/watch-in-full rate, rewatches, shares, and search-traffic from analytics — completion is the headline metric, not raw views. | Completion-rate + rewatch/share figures captured for the post |
| 8 | Feed the loop | T+72h | Write the dated what-worked / what-failed entry into `measure-results` → it feeds the pack and the next brief. | Dated entry recorded; the winning hook/angle promoted to the next brief |

This sequence is what the shortform **chain** executes step-by-step, and what `brief-shortform` /
`produce-video` narrate ("running the cold-open + triple-keyword + completion-tuned TikTok playbook").

---

## 6. Timing, Cadence & Hook Window

- **Hook window (0:00–0:02):** the visual, audio, and text overlay must each carry a recognizable
  signal in the first beat — the swipe-decision happens here. The mechanism (completion as a strong
  signal) is TikTok-stated; the precise "decide in the first 1–2 seconds" timing is
  [practitioner consensus].
- **Early-retention threshold (~0:03):** strong videos hold a high fraction of viewers through the
  first ~3 seconds; a steep early drop reads as a weak hook and reach collapses. The **">50%
  completion" / specific second-count** thresholds are [practitioner consensus] — TikTok confirms the
  *mechanism* (finishing end-to-end = strong interest) but publishes no threshold.
- **Retention-multiplier figures** (e.g. "70–85% retention at 0:03 → ~2× views") circulated by
  third-party datasets are [practitioner consensus], not TikTok-published. Treat them as directional,
  not as cited weights.
- **Long-form retention curve (60s+):** longer videos earn more *total* watch time but lower absolute
  completion — engineer a mid-video curve (subhook ~0:08, payoff escalation ~0:15, secondary reveal
  ~0:25) for educational briefs. Socialinsider's Sep-2025 analysis found 2-minute videos the
  highest-engagement length (sub-15s second).
- **Benchmark engagement (named):** Socialinsider's *2026 TikTok Benchmarks* (2M videos / 214,507
  profiles) put average engagement-by-views at ~**4.20%** (Q1 2026). Rival IQ's *2025 Social Media
  Industry Benchmark Report* (4M+ posts) finds TikTok leads platforms on engagement but declined
  year-over-year. Use these to set expectations, not as ranking levers.
- **Cadence:** the compounding play is consistent posting that feeds the metrics loop (§5 step 8) —
  promote winning hooks/angles into the next brief, not re-posting the same clip.

---

## 7. CTA Placement Norms

TikTok is structurally hostile to off-platform CTAs: captions and comments carry no clickable link;
only the bio link is clickable. A front-loaded leave-the-app CTA cuts completion, the heaviest stated
signal. So the CTA is placed late, framed as value, and never as engagement bait.

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| **Verbal CTA at ~0:18–0:25** ("if you want X, here's how") | Educational / founder-mode where the value is delivered before the ask; preserves completion | When the CTA *is* the whole video — trips the engagement-bait bar (§4) | [practitioner consensus]; TikTok FYF Standards (bait) |
| **End-card "save this to try later"** | Educational / how-to where a save is a high-value interaction | Entertainment / POV — an end-card kills the loop and breaks rewatch | [practitioner consensus] |
| **Caption first-line CTA** | When brief, niche-specific, and keyword-rich — caption truncates at ~70–80 chars before "…more" | When generic ("link in bio for more") — wastes the most-indexed text real estate (video-information signal) | [practitioner consensus] + TikTok Support (captions are video-information) |
| **Comment-pinned CTA** | Long-form / educational where viewers scroll comments; pin your own comment with the destination in plain text (not clickable, but copy-pasteable) | First-days organic posts where the thread is sparse and the pin is buried | TikTok linking rules + [practitioner consensus] |
| **Bio link as terminal CTA** | The only clickable destination; works when the video earns high view-through and the bio link is a single focused destination (not a link-menu) | When users are pushed to "click link in bio" without enough motivation — friction is high | TikTok linking rules |

---

## 8. Open Questions / Known Unknowns

- **No published numeric weights.** TikTok states the three signal categories and a coarse hierarchy
  (interactions > video information > device settings; end-to-end completion = strong) but publishes
  **no numeric weights** and no within-category ranking. Any brief claiming a specific weight ("shares
  are 3× likes") is fortune-cookie — flag it.
- **"Shadow ban" — folklore vs. documented.** TikTok documents that content can be marked
  **ineligible for the For You feed** (FYF Standards) with an appeal path, but does not use the term
  "shadow ban." Practitioner claims of "stealth shadow bans" for low retention are **not** confirmed —
  what is confirmed is that low completion reduces distribution (a math outcome, not a punitive flag).
  Distinguish (a) FYF-ineligible (documented, appealable) from (b) low-completion auto-suppression.
- **The "21–34s sweet spot" lacks a TikTok source.** It is [practitioner consensus]. The named
  counter-signal is Socialinsider's Sep-2025 finding that 2-minute videos rank highest — so the "short
  is always better" framing is itself contestable; re-verify against the current benchmark.
- **Search-value organic weight.** Practitioners treat Creator Search Insights "search value" as a
  top-tier organic signal in 2026; TikTok's docs name search as a *surface* that leans on video
  information but publish no organic "search value" weight. Whether spoken-keyword ASR is fed into the
  search index at full fidelity, or only into accessibility surfaces, is **not** publicly stated —
  briefs that bet on audio-only keyword exposure (no on-screen text, no caption) are betting on an
  unconfirmed pipeline.
- **The 60-minute upload cap rollout cohort.** 60-minute uploads exist (TikTok Newsroom, 2024) but
  rollout is gradual — no public cutoff for which accounts have access. Briefs spec'ing 10+ minute
  videos should verify the target account's capability.
- **Late-2025 "follower-first testing."** Third-party trackers have *reported* TikTok testing
  follower-feed-style surfaces in late 2025. This is **not TikTok-confirmed** and does not change the
  stated fact that follower count is not a direct For You ranking factor. Re-verify before treating
  follower reach as a lever.
- **Caption character limit precision.** The current caption limit and its expansion history are
  widely repeated by practitioners but not pinned here to a TikTok Help Center URL. Treat the exact
  character cap as [practitioner consensus] pending a primary-source pin.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-05-07 | Initial draft — 4 TikTok-native archetypes; format constraints from primary + practitioner sources; 6 ranked algorithm signals with primary/secondary tier markings; 9 anti-patterns with detection rules; retention curve from third-party datasets; 5 open questions incl. shadow-ban folklore vs. documented FYF-ineligibility. | internal |
| 2026-05-08 | Phase 0.5b URL repair (Bucket A). Findings 1–4 closed: archetype examples relabeled `[pattern-derived]` with practitioner-observed framing preserved. No fabricated URLs. `last_verified` bumped to 2026-05-08. | internal |
| 2026-06-18 | v1→v2: pack_type, summary, §5 Playbook; ranking re-cited to TikTok Newsroom/Support + FYF Standards; benchmarks named (Socialinsider/Rival IQ); de-anonymized via agent web-verification (operator review pending). | agent |
