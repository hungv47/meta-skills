<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: youtube
schema_version: 2
pack_type: shortform-video
last_verified: 2026-06-18
verifier: agent
status: reviewed
source_basis: "Per-claim categorical + named-source. Recommendation framing cited to YouTube Help (support.google.com/youtube/answer/16533387) + the 2021 blog.youtube post; numeric signal weights are unpublished and noted [unpublished]. Format specs cited to YouTube Help. Benchmark numbers cited to Backlinko 2017 (historical). Retention-window + cadence claims tagged [practitioner consensus]."
summary: "On long-form YouTube the package (title + thumbnail) earns the click and the first 15–30s must immediately pay off the promise — the recommendation system reads Appeal (did they choose it), Engagement (did they stay = average view duration), and Satisfaction (did surveys rate it 4–5) and routes accordingly."
---

# Platform Intelligence — YouTube (Long-Form / Standard Video)

Practitioner-grade reference consumed by long-form-video briefs and the video chain (`brief-shortform` Phase 2, `produce-video`, `evaluate-content`, `measure-results`) to ground hooks, format compliance, recommendation fit, and anti-pattern checks for **standard horizontal YouTube video (~3 min to 60+ min)**. **Not a Shorts doc** — a sibling `shorts.md` pack covers Shorts. The two surfaces share one recommendation shell but diverge sharply on intent (the long-form viewer has *already clicked*; the Shorts viewer is mid-swipe), retention dynamics (first 15–30s vs first 1–3s), and format physics (16:9 horizontal vs 9:16 vertical).

(`pack_type: shortform-video` is the existing classification for this pack-family even though YouTube long-form is, well, long — it keeps the validator's section set applied. The *content* is about long-form video.)

Two things every consuming skill must respect:

1. **The package is the product before the click.** YouTube's recommendation system decides whether to *offer* the video largely on whether viewers *choose to watch it* — the title + thumbnail are the Appeal signal. Nothing else fires until that click happens.
2. **The first 15–30 seconds is the retention cliff.** The viewer is paying off the click; if the opening doesn't immediately deliver on the title/thumbnail promise, average view duration (AVD) collapses and the system stops surfacing the video. CTR brings the click; AVD keeps the impressions coming.

When this doc's `last_verified` exceeds 90 days, `validate-packs.ts` warns and the consuming critic flags `DONE_WITH_CONCERNS` — YouTube retunes the recommendation system and monetization policy regularly. A Pro client is served the current pack from the freshness pipeline.

---

## 1. Hook Taxonomy

Long-form hooks operate under a different physics than Shorts: the viewer **already clicked the thumbnail**, so the hook's job is not to *win attention from a feed* but to *prove the click was worth it* before retention crashes. There is no official YouTube-stated "intro window" threshold; the **15–30s retention cliff is `[practitioner consensus]`** drawn from the audience-retention curve in YouTube Analytics, which YouTube does expose. The four archetypes below are long-form-specific; they overlap in name with the base set in `../hook-archetypes.md` (pattern interrupt, pre-reveal tease) but the platform-native framing is the duty to *honor the thumbnail contract* set before the click — a constraint that does not exist on Shorts/TikTok/Reels.

### Archetype 1 — Thumbnail-Payoff Hook

- **Definition:** The first ~5–15 seconds visually delivers the exact promise the thumbnail/title made — same subject, same setting, same wow-factor — so the viewer's expectation is confirmed before they bounce.
- **Identifying signal:** The frame early in the open contains the literal object/person/scene shown on the thumbnail. No "today we're going to talk about…" preamble, no logo splash. Voice-over (if any) names the thumbnail subject in the first sentence.
- **Pattern examples A:** A documentary/science explainer opens on the literal thumbnail subject (e.g. the reservoir / object the thumbnail showed dumping or appearing) within the first seconds, paired with a negation hook — *"contrary to what you may have heard, the real reason is not X."* [pattern-derived from the explainer/documentary cohort]
- **Pattern examples B:** A challenge/build video brings the thumbnail's premise on-screen early (the structure, the object, the stunt the thumbnail promised) before any rules-explanation. [pattern-derived from the challenge/stunt-creator cohort]
- **Engagement-signal rationale:** The Appeal signal (the click) is bought by the package; if the opening breaks the thumbnail contract, viewers leave and AVD/watch-time (the Engagement signal) collapses — which the recommendation system reads as the video performing poorly when offered (§3).
- **Best for:** Documentary, science explainers, challenge formats, product reviews — any niche where the thumbnail subject is concrete and visual.

### Archetype 2 — Cold Open + Pattern Interrupt

- **Definition:** Open mid-action with a high-stakes or absurd visual moment, *then* cut to title or context. The viewer is dropped into the climax (or a teaser of it) before any setup.
- **Identifying signal:** First frame is in-action footage (an explosion, a jump-cut, an on-camera shock). Any title card / channel intro arrives a few seconds in, never at 0:00. Often paired with a teasing voice-over: *"This is what happens when…"*
- **Pattern examples A:** A challenge video that opens on the built set / the stakes already in motion, before explaining the premise. [pattern-derived from the challenge cohort]
- **Pattern examples B:** A science/curiosity explainer that opens with the result or a striking visual + a negation ("the answer isn't what you think"), then rewinds to explain. [pattern-derived from the explainer cohort]
- **Engagement-signal rationale:** The early seconds are where most cliff-drops occur on long-form; a pattern interrupt makes the viewer's "should I bounce?" reflex misfire, protecting first-minute retention (Engagement) without breaking the thumbnail contract (Appeal).
- **Best for:** Entertainment, challenge, science/curiosity, vlog tentpoles. Worse for tutorials where viewers want orientation up front.

### Archetype 3 — Promise Stack (Intro Contract)

- **Definition:** The author lists, in 2–4 short beats, exactly what the viewer will gain by staying — often layered with a credibility frame and a curiosity loop.
- **Identifying signal:** Sentence shape is *"In this video I'll show you X, Y, and Z — and the last one changed how I [outcome]."* Often paired with on-screen bullet animation or chapter chyrons.
- **Pattern examples A:** A productivity/finance/business creator's intro template: **hook → "I'll show you X, Y, Z" → value**, with an explicit retention beat ("stick around for the last one"). [pattern-derived from the educational/creator-economy cohort]
- **Pattern examples B:** A counter-intuitive-claim or stat lead — *"Most people don't know this, but…"* / *"70% of people get this wrong…"* — each adding a promise plus an implied credibility frame. [pattern-derived from the educational cohort]
- **Engagement-signal rationale:** Educational and creator-economy niches score higher on AVD when the viewer is told what they're trading time for; the promise stack front-loads that contract so the viewer commits past the cliff. The hook is the one element worth scripting line by line — if a sentence can be cut and the hook still stands, cut it.
- **Best for:** Educational, tutorial, listicle, productivity, "how I did X" formats where the viewer's contract is informational.

### Archetype 4 — In Medias Res / Story Cold Open

- **Definition:** Drop into a personal-narrative scene mid-story, then flash back to "how we got here." Borrowed from cinema; the dominant pattern for vlog and documentary creators.
- **Identifying signal:** First line is dialogue, not exposition (*"It's 5 a.m., our flight's in three hours…"*). Visual setting is in-progress (in a car, on a sidewalk, mid-meal). Often followed by a title-card flashback or chapter break that reorients the viewer.
- **Pattern examples A:** A daily-vlog open that drops into a moment ("today is the day I…") with a teased announcement, then a three-act structure (setup → conflict → resolution) across the episode. [pattern-derived from the vlog/daily-creator cohort]
- **Pattern examples B:** A documentary/personal-essay open that begins at the emotional peak and rewinds — the three-act narrative applied to a single upload. [pattern-derived from the documentary/personal-essay cohort]
- **Engagement-signal rationale:** Vlog and personal-narrative niches index on emotional retention rather than information density; an in-medias-res open triggers the "what happens next" loop earlier than a chronological open, holding the curve through the cliff.
- **Best for:** Vlog, documentary, personal-essay, behind-the-scenes formats. Worse for evergreen tutorials and SEO-driven explainers where viewers arrived from search with a specific question.

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Prefer numeric. Sources: YouTube Help unless tagged `[practitioner-observed]`.

| Constraint | Value | reference |
|---|---|---|
| Title hard cap | **100 characters** (input field blocks more) | YouTube Help (answer/57404) |
| Title visible-without-truncation | ~**60–70 chars** before truncation across most surfaces; front-load the primary keyword | `[practitioner-observed]` (not an official cap) |
| Description hard cap | **5,000 characters** | YouTube Help (answer/57404) |
| Description visible above-fold | First ~**157 chars** / first 2–3 lines before "…more"; primary link + keyword go here | `[practitioner-observed]` |
| Thumbnail — recommended resolution | **3840×2160 px**, 16:9 aspect ratio | YouTube Help (answer/72431) |
| Thumbnail — file-size cap | **2 MB** (mobile uploads) / **50 MB** (desktop uploads) | YouTube Help (answer/72431) |
| Thumbnail — prior spec (note, not current) | The older "1280×720 / 2 MB" guidance is a *prior* spec — don't treat it as current; use 3840×2160 + the dual size caps above | YouTube Help (answer/72431) |
| Thumbnail file formats | JPG, PNG, GIF (first frame), BMP | YouTube Help (answer/72431) |
| Tags | Available but minimal — YouTube states title/thumbnail/description matter more; tags help mainly when a term is commonly misspelled | YouTube Help (answer/146402) |
| Aspect ratio (player) | 16:9 horizontal recommended; the player letterboxes/pillarboxes other ratios | YouTube Help |
| Chapters | Available; first chapter must start at `0:00`, min 3 chapters, each ≥ 10 s, listed in description in ascending order | YouTube Help (answer/9884579) |
| Captions / CC | Auto-captions ship by default; manual caption / SRT upload recommended for accuracy + accessibility + auto-translation reach | YouTube Help (answer/2734796) |
| End screens | Video must be **≥ 25 seconds** to enable end-screen elements; final 5–20 s; up to 4 elements | YouTube Help (answer/12948449) |
| Cards | Up to 5 per video; inline info-card teasers; lower CTR than end screens but useful mid-video | YouTube Help |
| Mid-roll ad eligibility | ≥ 8 minutes of content unlocks mid-roll ad placement (monetization eligibility, not a ranking lever — see §8) | YouTube Help / `[practitioner-observed]` |

**Note on the prior thumbnail spec:** the widely-repeated "1280×720, 2 MB" figure is the *old* recommendation. Current Help guidance recommends **3840×2160** at 16:9 and splits the file-size cap by upload surface (2 MB mobile / 50 MB desktop). Use the current figures.

---

## 3. Algorithm Signals (Ranked by Impact)

YouTube's recommendation system is **officially documented** but its **numeric weights are not published** `[unpublished]`. Per the YouTube Help page on the recommendation system (support.google.com/youtube/answer/16533387) and the 2021 blog post *On YouTube's recommendation system* (blog.youtube/inside-youtube/on-youtubes-recommendation-system/), the system processes **80+ billion signals per day** and is built to maximize long-term viewer satisfaction. Practitioners summarize the content-performance side as three categories — **Appeal · Engagement · Satisfaction** — which map onto YouTube's officially-named signals (choosing to watch; watchtime; survey ratings). The three-word labels themselves are `[practitioner synthesis]`; the *signals they name* are YouTube-stated. **"CTR" is not the term YouTube uses in the recommendation context** — it describes the Appeal signal as whether viewers *choose to watch, ignore, or mark "not interested."**

1. **Appeal — did viewers choose to watch?** Whether an impression converts to a watch (vs being ignored or marked "not interested"). *This is the practitioner "CTR," but the recsys framing is "chose to watch."* *Why:* without the choice-to-watch, no other signal fires — the system won't keep offering a video viewers decline. *Lever:* engineer the title + thumbnail as a unit; test thumbnail/title variants; front-load the visual hook in the thumbnail and the keyword early in the title. *Source:* YouTube Help (answer/16533387) names "whether they choose to click, watch" as content performance. *Tier:* primary, weight `[unpublished]`.
2. **Engagement — watchtime / average view duration.** Seconds watched and how much of the video viewers stay for. *Why:* the 2021 blog states *"watchtime"* is a core signal and that clicks alone are not enough — *"a click is only the beginning."* The recommendation system optimizes for valued watchtime, not raw clicks. *Lever:* spec the 0:00–0:30 hook to honor the thumbnail contract; cut dull stretches; check the YouTube Analytics audience-retention curve for cliffs. *Source:* blog.youtube (Sept 2021); YouTube Analytics exposes the retention curve. *Tier:* primary, weight `[unpublished]`.
3. **Satisfaction — survey ratings (1–5) + likes/dislikes/shares.** Post-view "valued watchtime": YouTube surveys viewers 1–5 stars and counts **only 4–5-star** ratings as valued; likes, shares, and dislikes also feed satisfaction. *Why:* the blog states the system builds on *"clicks, watchtime, survey responses, sharing, likes, and dislikes"* to learn what viewers find satisfying — this is the layer that distinguishes "watched" from "satisfied" and addresses the clickbait failure mode. *Lever:* honor the thumbnail contract; deliver real payoff; encourage organic likes/comments at natural payoff moments (not in the first 30s). *Source:* blog.youtube (Sept 2021). *Tier:* primary, weight `[unpublished]`.
4. **Viewer personalization (history + interest affinity).** The other half of the recommendation framing per answer/16533387: a viewer's watch history and interest affinity, not just how a video performs in the abstract. *Why:* the same video is offered to viewers it's *likely to satisfy*, so topical/audience fit matters as much as raw quality. *Lever:* a clear channel identity + consistent topic focus so the system can model "who this is for." *Source:* YouTube Help (answer/16533387). *Tier:* primary (officially named), weight `[unpublished]`.
5. **Traffic-source mix (Search / Browse / Suggested).** YouTube Analytics documents the split of views across Search, Browse (home + subscriptions), Suggested videos, and external. *Why:* each surface has a different baseline and a different optimization lever; Search rewards intent + metadata, Suggested rewards adjacency to videos the viewer just watched, Browse rewards subscriber loyalty + thumbnail strength. *Lever:* for a new channel, pursue Search (most controllable via metadata); established channels study which videos theirs get suggested alongside. *Source:* YouTube Analytics (documented Studio feature); the per-surface weighting is `[unpublished]`. *Tier:* secondary (real Analytics feature; weighting unpublished).
6. **Metadata + content understanding.** Title, description, captions/transcript, on-screen text, and audio all help the system match a video to viewer intent. *Why:* lets the system surface a video to the right audience even when tags are weak. *Lever:* speak the topic in the first 30s of audio; keyword the first line of the description; chapter the video. *Caveat:* whether captions/transcripts are *indexed for search* is widely claimed but **not confirmed on an official Help page** — treat the search-indexing of CC as `[practitioner consensus]` / Open Question (§8), not a cited fact. *Tier:* primary direction (YouTube-stated that metadata matters), specifics `[unpublished]`.

Cap interpretation at these ~6. **Appeal × Engagement** (the click and the stay) is the practitioner shorthand for "what gets a video surfaced," but the multiplicative `CTR × AVD` *formula* is a `[practitioner synthesis]`, not a YouTube-published equation — don't assert it as official.

---

## 4. Anti-Patterns

| Pattern | Penalty observed | Detection rule | Source |
|---|---|---|---|
| **Inauthentic / mass-produced content** (templated, easily-replicable-at-scale, generic-template AI, minimal-narrative slideshows) | **Channel-wide demonetization** — "monetization may be removed from your *entire channel*"; YPP suspension; earnings withheld | Channel publishes near-identical templated videos with little variation, or generic-template AI giving "the impression of mass production" | YouTube Help, "Inauthentic content" policy (renamed from "repetitious," effective **2025-07-15**) — answer/1311392 (primary) |
| **Misleading metadata / clickbait thumbnail** (thumbnail or title promises a payoff the video doesn't deliver) | Prohibited under YouTube policy; the satisfaction layer (§3.3) suppresses recommendations when surveys + drop-off signal disappointment | Brief can't name *what the thumbnail promises* AND *which on-screen moment in the first 15–30s confirms it* → flag | YouTube Help (answer/7002331, answer/9229980) (primary) |
| **Clickbait without payoff** (Appeal up, Engagement down) | The satisfaction signal was built to detect "watched ≠ satisfied"; recommendations get suppressed | Does the literal thumbnail subject appear on-screen within the first ~15s? If no → flag | YouTube Help (answer/16533387) + blog.youtube 2021 |
| **Late hook** (core proposition fires after ~0:30) | Crashes first-minute retention (Engagement); the recommendation system reads the early drop-off as poor performance | Brief must spec a hook beat in the first 5–15s; any logo splash, sponsor read, or "what's up guys" preamble before the hook → rewrite | `[practitioner consensus]` (Analytics retention curve) |
| **Reused/cropped Shorts as long-form spine** | 9:16-cropped frames look wrong in the 16:9 player; pacing is off for an attentive long-form viewer → AVD drops | Source footage flagged 9:16 or < 60s should be B-roll, not the spine of a long-form brief | `[practitioner consensus]` |
| **Engagement bait** ("smash subscribe," "comment YES") placed before value | Depresses the satisfaction signal; reads as a vanity-metric prompt | Any subscribe/like/comment prompt before ~25% of runtime, or asking for action before delivering value → flag | `[practitioner consensus]` (satisfaction layer, §3.3) |

"Don't be spammy" is not an anti-pattern. "The brief can't name the on-screen moment in the first 15–30s that confirms the thumbnail promise" is.

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic:** engineer the **package (title + thumbnail) for the click**, then make the **first 15–30 seconds pay it off** — Appeal earns the impression-to-watch, and the immediate payoff protects average view duration (Engagement). CTR × AVD is what keeps YouTube offering the video; everything else is downstream.

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | Package-first (title + thumbnail as the Appeal signal) | T−5d → T−2d | Design 2–3 thumbnail concepts + matching titles *before* finalizing the cut; thumbnail at 3840×2160 16:9, legible at list size; primary keyword front-loaded in the title (≤ ~60–70 visible chars). | A stranger can say what the video promises from thumbnail + title alone, in <2s |
| 2 | Script the first 15–30s to deliver on the promise | T−4d | Write the open as a hook that visually confirms the thumbnail subject (Archetype 1/2) or front-loads the promise stack (Archetype 3); no logo splash, no preamble before the hook. | The literal thumbnail subject (or the promised payoff) is on-screen by ~0:15 |
| 3 | Structure for AVD | T−3d → T−1d | Cut dull stretches; place a re-engagement beat where attrition typically resumes; chapter the video (first chapter at 0:00, ≥ 3 chapters); keep pacing tight for the attentive long-form viewer. | Edit has no dead air; retention curve target is a flat-to-slow-decline shape (no early cliff) |
| 4 | Metadata (front-loaded, keyword-first) | T−1d | Description with primary keyword + link in the first ~157 chars; full chapters list; upload a manual caption / SRT; tags minimal (title/thumbnail/description carry the weight). | Above-fold description + chapters + CC all present; primary keyword in line 1 |
| 5 | Publish | T−0 | Upload at the channel's best-tested window (`[practitioner consensus]` — verify in Analytics, §6); set end screen (video ≥ 25s) routing to a relevant next video; pin a first comment if it adds context. | Live, indexed, end-screen routing set |
| 6 | Drive watch session / suggested adjacency | T+0 → T+72h | End-screen + a binge-friendly playlist route viewers to the next video to extend the session; cross-post where genuine reach exists. | Suggested/Browse impressions begin appearing in Analytics within the first days |
| 7 | Measure CTR × AVD, then feed the loop | T+72h → T+7d | Read Appeal (impressions-to-watch) against Engagement (AVD / % watched) and the retention-curve shape; identify the first cliff. Write the dated what-worked / what-failed entry into `measure-results` → feeds this pack (U10). | Dated entry recorded; first retention cliff timestamp + a thumbnail/hook hypothesis for the next upload |

This sequence is what the long-form video **chain** executes step-by-step, and what `produce-video` / `evaluate-content` narrate ("running the package-first + first-30s-payoff playbook; reading CTR × AVD").

---

## 6. Timing, Cadence & Hook Window

- **Hook window (the cliff):** the first **15–30 seconds** is where most long-form bounce occurs `[practitioner consensus]`. There is **no official YouTube-stated intro-window threshold** — the cliff is read off the YouTube Analytics audience-retention curve, which YouTube *does* expose. Target a flat-to-slow-decline curve; a vertical cliff at a timestamp says "viewers bounced exactly here — re-cut what ran there."
- **Best post window:** `[practitioner consensus]` — there's no universal optimal time; the right window is the one your own Analytics "when your viewers are on YouTube" report shows. Don't assert a global best hour.
- **Cadence / consistency:** consistent uploading aids audience habit + notification delivery `[practitioner consensus]`; YouTube has **not** stated an algorithmic penalty for inconsistency. Consistency compounds *returning-viewer* behavior, not a hidden ranking multiplier — frame it as habit-building, not gaming.
- **Traffic-source split (Search / Browse / Suggested) is a documented Analytics feature** (§3.5) — use it to diagnose *where* a video is (or isn't) being surfaced and pick the matching lever (metadata for Search, adjacency for Suggested, thumbnail + cadence for Browse). The per-surface *weighting* is `[unpublished]`.

---

## 7. CTA Placement Norms

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| **Subscribe ask in cold open (0:00–0:30)** | Almost never on long-form — crashes retention right at the cliff. | Established creators place the ask near the end or as a one-line aside *after* the hook lands | `[practitioner consensus]` |
| **Subscribe ask after value delivery (mid-to-late)** | Best retention-preserving slot; often timed to the end-screen window. | Avoid stacking subscribe + like + comment + share together — splits attention, reads as begging, depresses satisfaction (§3.3) | `[practitioner consensus]` |
| **Mid-roll value-handoff CTA (link in description)** | Works when tied to a moment of demonstrated value ("I built this in tool X — link below"). | Fails as a hard sales pitch mid-narrative; interruptive pitches read as low-quality breakpoints | `[practitioner consensus]` |
| **End-screen card CTA (last 5–20s)** | Native, expected, YouTube's intended slot (video must be ≥ 25s); subscribe + next-video card extends the session. | Generic "thanks for watching" with no routed next-video ends the session instead of extending it | YouTube Help (answer/12948449) |
| **Pinned-comment CTA** | Link aggregation, errata/corrections, a community prompt; sits below the fold, doesn't compete with retention. | Don't expect it to drive significant clicks — it's a complement, not a primary surface | `[practitioner consensus]` |
| **Above-fold description link (first ~157 chars)** | Highest-discoverability link slot; used for the primary CTA (signup, course, download); shows in snippets. | Links buried below the fold get sub-1% CTR — if it matters, it goes in the first ~157 chars | YouTube Help (answer/57404) + `[practitioner-observed]` |

---

## 8. Open Questions / Known Unknowns

- **Exact recommendation weights are non-public `[unpublished]`.** Any "20% / 25% / 35% …" weighting table for Appeal / Engagement / Satisfaction circulating in blog summaries is practitioner-derived from analytics-pattern observation, **not** a YouTube-stated split. Treat as directional only.
- **The Appeal / Engagement / Satisfaction *labels* are practitioner framing.** YouTube's own pages name the *signals* (chose-to-watch, watchtime, survey ratings, likes/shares) and frame the system as "viewer personalization" + "content performance" (answer/16533387) plus the 2021 blog's signal list. The clean three-word taxonomy is a `[practitioner synthesis]` over those official signals — accurate to the substance, not a verbatim YouTube label set.
- **"Session time" is not a current officially-named signal.** Practitioners reason that videos which keep viewers on YouTube are worth more, and the system does optimize platform-wide satisfaction, but **"session watch time" is not named on the current official recommendation pages** — don't assert it as an official signal.
- **CC / transcript indexed for search is unconfirmed.** Widely repeated, but **not confirmed on an official YouTube Help page** — treat as `[practitioner consensus]`, not a cited fact.
- **No verified large-N post-2022 ranking study found.** The most-cited large-sample benchmark — Backlinko's *"We Analyzed 1.3 Million YouTube Videos"* (Brian Dean, https://backlinko.com/youtube-ranking-factors) — is **VERIFIED but from 2017**: avg first-page video ~14m50s; engagement metrics correlated with rankings. It **predates** the satisfaction-survey layer and the 2022–2025 shifts, so the *direction* (engagement matters) is still plausible but the *specific numbers are stale*. No verified large-N study from after 2022 was found in this verification pass — so the "ideal length / engagement-correlation" figures should be cited as 2017/historical, not as current truth.
- **The "8–12 min sweet spot" is a monetization artifact, not a ranking lever.** ≥ 8 min unlocks mid-roll ads; that's a revenue fact, not evidence the recommendation system rewards duration. Retention-first beats length-first — a tight short video at high AVD generally outperforms a padded long one at low AVD.
- **Tags "deprioritized" has a long-standing *direction* but no verifiable dated event.** YouTube has long stated tags are minor vs title/thumbnail/description; a *specific dated 2022 statement* could not be verified — state the direction, not a dated event.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-06-18 | v1→v2: pack_type, summary, §5 Playbook; recommendation re-cited to YouTube Help (Appeal/Engagement/Satisfaction) + 2021 blog; inauthentic-content policy (Jul 2025); Backlinko study marked historical (2017); de-anonymized via agent web-verification (operator review pending). | agent |
| 2026-05-07 | Initial draft — long-form-specific (NOT Shorts). 4 hook archetypes (Thumbnail-Payoff, Cold Open + Pattern Interrupt, Promise Stack, In Medias Res). 7 algorithm signals ranked. 6 anti-patterns. Sources span platform docs, third-party studies, and [pattern-derived] practitioner observation. | internal |
