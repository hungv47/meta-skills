<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

---
type: platform-intelligence
platform: reels
schema_version: 1
last_verified: 2026-05-08
verifier: internal
source_basis: "Internal research synthesis; raw source ledger intentionally omitted from public skill package."
status: draft
---

# Platform Intelligence — Instagram Reels

Practitioner-grade reference consumed by `short-form-brief` (and downstream surface-specific copy skills) to ground hooks, format compliance, algorithm fit, and anti-pattern checks. **Not generic marketing advice.** Every claim is distilled into internal operating guidance.

When this doc's `last_verified` exceeds 90 days, the consuming critic flags `DONE_WITH_CONCERNS` with "platform signal may be stale — verify before publishing."

Reels in 2026 is closer to TikTok than to YouTube Shorts in feed mechanics, but platform-stated emphasis on **sends per reach** (DM shares to a specific person) and **non-follower discovery via Reels tab** makes it functionally distinct. The Apr-2024 Originality update and the Dec-2025 5-hashtag cap permanently changed the "post-five-times-a-day with 30 hashtags" playbook practitioners ran from 2021–2023.

---

## 1. Hook Taxonomy

Four Reels-native archetypes. They overlap with the base six (`../hook-archetypes.md`) but every variant below adds a Reels-specific format or distribution mechanic — do not collapse them back to the generic version.

### Archetype 1 — DM-Trigger Hook ("comment X, I'll DM the link")

- **Definition:** Opens with a value promise *gated behind a comment keyword*; the creator (or a DM-automation-style automation) DMs the resource to commenters. Designed to convert passive views into comments + DM sends — the two algorithm signals weighted heaviest for non-follower reach.
- **Identifying signal:** First 1–3s says "comment <KEYWORD>" or "I'll send you" alongside the value claim. Caption / pinned-comment repeats the keyword. On-screen text usually shows the keyword in caps.
- **Pattern examples A:** "Comment 'GROWTH' and I'll DM you my 47-page Reels playbook" `[pattern-derived]` — pattern endorsed by platform leadership's DM-priority statements; a DM automation tool's official Comments trigger doc documents the automation that operationalizes this hook. Pattern observed across practitioner source, practitioner source, practitioner source throughout 2024–2025; specific post URL not pinned.
- **Pattern examples B:** "Type 'TEMPLATE' below — I built the exact 3-slide carousel I use to convert viewers into email subs and I'll send it to you free." `[pattern-derived]` — pattern attributed to Stephanie Kase's lead-magnet workflow; specific post URL not pinned. (Note: is the a DM automation tool Comments-trigger doc — the automation tool that operationalizes this pattern, not Stephanie Kase's verbatim text. uses removed from this example to avoid mis-attribution.)
- **Engagement-signal rationale:** A DM send is the single strongest non-follower-reach signal platform leadership's has named. A comment is itself a heavy interaction. The DM-trigger hook compounds both in a single watch — the algorithm reads the reel as "high enough value that a stranger asked a stranger for the resource and got a private message in return," which is the exact behavior IG's recommendation system is trying to surface. *Also why it works:* the reel keeps living on the Reels tab for weeks because every new commenter triggers a fresh DM event, which the system reads as ongoing freshness.
- **Best for:** founder-led education niches, course/lead-magnet funnels, B2B service offers where the asset is a PDF/template/checklist. **Bad fit:** consumer brand awareness with no opt-in asset, or any niche where commenting feels transactional (luxury, art, journalism).

### Archetype 2 — Carousel-Reel Cliffhanger (multi-segment retention scaffold)

- **Definition:** Reel structured as 3–5 visually distinct "slides" inside one video, each slide ending on a cliffhanger that earns the next 2–3 seconds. Mirrors the carousel-post mechanic that Reels-tab algorithm rewards (swipe-through becomes watch-through inside one reel). Distinct from a TikTok storytime — the segmentation is *visually marked* (chapter cards, color shifts, "Step 1 / Step 2") so retention is earned in micro-promises rather than one long arc.
- **Identifying signal:** Visible step counter, chapter title, or "but wait" cut at predictable beats (every 5–8s). Often uses a horizontal "swipe" arrow even though it's a video, mimicking carousel UX.
- **Pattern examples A:** "Three things I'd never do as a brand strategist — the third one will save you $10K. Number one…" — pattern used by practitioner source and practitioner source; the listicle-with-payoff-on-last-item is the canonical carousel-reel structure on Reels in 2024–2025.
- **Pattern examples B:** "I went from broke to $1M — but the part nobody tells you happens at month 7. Step 1: stop charging hourly. Step 2: …" — Hormozi-style serialized storytelling cross-posted to Reels at practitioner source (high-volume cross-post account); the visible "Step N" overlay is the cliffhanger scaffold.
- **Engagement-signal rationale:** Reels' top signal is watch time. A single 60s monolithic talking-head averages ~30–40% retention; a 60s reel split into 4×15s payoff-loaded segments routinely clears the 56% retention benchmark Social Insider documents for the 60–90s sweet spot because each cliffhanger resets the viewer's attention budget. Also: the structure produces saves (people save to "watch the rest later" or to revisit the list), and saves are a heavy interaction.
- **Best for:** education, listicles, frameworks, "X mistakes" reveals, before/afters. **Bad fit:** emotional storytelling (interrupts the arc), product demos under 15s, ASMR/aesthetic content where pacing breaks the vibe.

### Archetype 3 — Save-Bait Educational Frame

- **Definition:** Opens with a frame so information-dense (or visually labeled as a reference asset — "save this for later") that the viewer reflexively saves before the reel even ends. Exploits the save signal, which third-party cohort cohort analysis classifies as a "heavy" interaction outweighing 4–10× as many likes.
- **Identifying signal:** First frame is a titled reference card (e.g., "12 hooks that actually work — save this"). Sometimes uses an explicit "save this 📌" overlay in the first 2 seconds. The reel content itself is reference material the viewer would want to revisit.
- **Pattern examples A:** "Save this — 7 ChatGPT prompts that write your week of content in 12 minutes. Prompt 1…" — Vanessa Lau's framework-reel format; the save-this overlay and the listicle-as-reference structure compounds saves with completion.
- **Pattern examples B:** "Don't scroll — this is the only 4-question framework you need to validate any business idea. Save it now, you'll need it." — pattern used by practitioner source, practitioner source cross-posts, and high-volume B2B education accounts (e.g., practitioner source).
- **Engagement-signal rationale:** Saves don't appear in platform leadership's Jan-2025 top-three , but third-party cohort data shows they are weighted alongside sends as heavy non-follower-reach signals. A save is also a *predictive* signal: the algorithm reads it as "this user wants to come back to this exact reel" — which downstream correlates with re-watches (more watch time) and DM shares to others studying the same topic. Save-bait is the only archetype where the *first frame* (not the spoken hook) is the conversion event.
- **Best for:** education, frameworks, reference lists, recipe/how-to, language learning. **Bad fit:** entertainment, comedy, news commentary — saving "the joke" is rare, so the bait reads as cynical.

### Archetype 4 — Remix-Driven Stitch / Collab-Tagged Reel

- **Definition:** Reel built on top of another creator's existing reel via Reels Remix (side-by-side or sequential) or co-published as a Collab post. Imports the original reel's audience into your distribution pool. (Practitioner reports uses a meaningful Collab-post reach lift vs. single-author posts, but no platform-confirmed figure is publicly available — see §7.)
- **Identifying signal:** Reels Remix UI badge ("Remixed with @x") at top-left; or two creator handles in the post header for Collab posts. Typically the original reel is on one side and the new reaction/extension is on the other.
- **Pattern examples A:** "I had to remix this — this is the WORST advice on Reels and here's why" — reaction-style remix targeting a high-view contrarian post; standard pattern across practitioner source, practitioner source, practitioner source and other creator-economy commentators.
- **Pattern examples B:** A Collab post between practitioner source and a guest creator where both audiences see the same reel in their feed simultaneously — Vanessa has used this to launch course cohorts; appears on both grids.
- **Engagement-signal rationale:** Remixes ride the original reel's existing engagement-velocity tail; the algorithm has already validated the parent reel as high-distribution, and the remix inherits topical relevance + audience overlap. Collab posts double the *follower-pool* the algorithm seeds initial distribution from. Both produce an outsized lift on the "small-creator" axis Instagram explicitly favors post-Apr-2024.
- **Best for:** creator-economy commentary, reactions, expansions on someone else's framework, tandem launches, podcast guesting cross-promo. **Bad fit:** brand accounts (Remix reads as derivative if there's no transformation); silent-feed product content; anything where the original creator hasn't opted into Remix.

---

## 2. Format Constraints

| Constraint | Value | reference |
|---|---|---|
| Duration sweet spot — reach | 7–15s (highest 3s-hold + completion rate) | internal |
| Duration sweet spot — engagement / retention | 60–90s (~56% avg watch time) | internal |
| Duration soft penalty | >90s reduces feed distribution per platform leadership's commentary | internal |
| Duration hard cap | 20 minutes (raised late 2025 from 3 min, which raised mid-2025 from 90s) | internal |
| Aspect ratio | 9:16 vertical (1080×1920) | internal |
| Resolution recommended | 1080×1920, H.264, 30fps, 10–15 Mbps, AAC 48 kHz | internal |
| Max file size | 4 GB (≤500 MB recommended for upload reliability) | internal |
| Caption character limit | 2,200 | Instagram Help Center (long-documented platform constraint; not in current sources block) |
| Caption truncation point | ~125 chars before "...more" | Practitioner consensus across internal/internal |
| Safe zones (top / bottom) | ~250 px top + ~250 px bottom obscured by UI; place text in center 1080×1420 | internal |
| Feed crop | Reels in main feed crop to **4:5** centered vertically — design the center 1080×1350 to read alone | internal |
| Burned-in caption requirement | Yes — autoplay-with-sound-off behavior and accessibility; on-screen captions correlate with retention lift | internal |
| Hashtag norm | **Universal cap of 5** as of Dec 2025 (was up to 30 pre-cap); place in caption, not first comment | internal |
| Hashtag effect on reach | platform leadership's: hashtags "do not increase reach" — only label content for search/discovery | internal |
| Cover/thumbnail | 1080×1920; main subject centered in 1080×1080 grid window so it reads on profile | internal |
| Audio handling | "Original Audio" (your captured/voiceover track) is fully clearable for business accounts; named music tracks gated by Meta's commercial-use rights — business accounts cannot use most copyrighted songs | internal |
| Trending-audio visibility | Up-arrow icon next to track name in the audio picker indicates rising velocity; pairing trending audio with original visual is the documented practitioner pattern | internal |
| TikTok watermark | Detected via OCR; results in distribution downrank on Reels tab + Explore (followers still see, non-followers don't) | internal |
| Originality / repost cap | 10 reposts of others' content in any rolling 30-day window → account excluded from recommendations entirely (Reels tab, Explore, suggested) | internal |

---

## 3. Algorithm Signals (Ranked by Impact)

platform leadership's publicly named the top three for Reels in his Jan-2025 explainer. The remaining 4–7 are practitioner-validated.

1. **Watch time / completion rate** — total seconds watched ÷ reel length, plus binary "did they watch to the end" signal. *Why:* platform leadership's #1 stated signal for Reels. Instagram replaced the public "View Rate" metric with "Skip Rate" (% of viewers who left in first 3s) to make this visible to creators. *Operator lever:* spec the hook to clear 3s (text + visual + spoken claim), structure the reel as 60–90s with cliffhanger beats every 5–8s, end on a loop-friendly final frame so re-watches add to watch time. *Tier:* primary.

2. **Sends per reach (DM shares)** — # of times the reel was sent in DM ÷ unique reach. *Why:* platform leadership's most-emphasized 2025 signal and the strongest predictor of non-follower reach. Strangers don't send to strangers; they send to people who'd specifically care. *Operator lever:* design the reel for *one specific person the viewer knows* ("send this to your perfectionist friend"). DM-trigger archetype (Section 1) operationalizes this directly. *Tier:* primary.

3. **Likes per reach** — likes ÷ unique reach (not total likes). *Why:* platform leadership's #3 stated signal; a normalized rate, not a raw count, so it doesn't penalize smaller creators. *Operator lever:* this is the lowest-friction interaction; if your reel is good enough at the other signals, likes follow. Don't optimize for likes specifically — chase watch time and sends, likes catch up. *Tier:* primary.

4. **Saves per reach** — saves ÷ unique reach. *Why:* third-party cohort cohort analysis classifies saves alongside shares as "heavy" interactions; a post with 50 saves and 20 shares can outrank one with 200 likes + 0 saves. Saves predict re-watches (more watch time) and signal reference value. *Operator lever:* save-bait archetype (Section 1); explicit "save this for later" overlay; reference-style first-frame card. *Tier:* secondary (platform leadership's has not ranked saves explicitly in his top three but has acknowledged them across multiple Threads posts).

5. **Comments per reach (with weight on length / threading)** — comments ÷ reach, with longer / threaded comments weighted higher than 1-emoji replies. *Why:* third-party cohort 2026 algorithm guide and third-party cohort cohort data both classify comments as a heavy interaction. The DM-trigger pattern compounds comment + DM in one event. *Operator lever:* end on a question that begs a non-trivial answer; DM-trigger keyword in caption. *Tier:* secondary.

6. **Originality score** — Instagram's internal classifier flagging reels that materially transform vs. wholesale repost. *Why:* Apr-2024 update confirmed by Instagram Creators blog ; accounts with ≥10 reposts in 30 days are excluded from recommendations entirely. The exact algorithm is opaque but the threshold is documented. *Operator lever:* always add an original visual layer (talking head, on-screen text, voiceover, distinct edit) to anything cross-posted; never upload another creator's reel without explicit Remix or material transformation. *Tier:* primary (rule documented), but the score-weighting is opaque.

7. **Interest signals (relationship, topical affinity, behavioral)** — historical engagement between viewer and creator/topic + cohort-similar viewer behavior. *Why:* platform leadership's general "interest" bucket; the personalization layer that decides *which* watchers your reel surfaces to. *Operator lever:* tight topical clustering — don't post a finance reel one day and a recipe the next from the same handle; the algorithm needs a coherent topic vector to seed initial distribution. *Tier:* primary (named) but mechanics are opaque.

---

## 4. Anti-Patterns

| Pattern | Penalty observed | Detection rule | Source |
|---|---|---|---|
| Visible TikTok watermark (or any third-party app watermark) | Distribution downrank on Reels tab + Explore — followers still see, non-followers don't | OCR scan of first/last frame for "TikTok practitioner source" or platform logos | internal |
| Reposting another creator's reel without material transformation | Replaced by original in recommendations; ≥10 in 30 days = full exclusion from Reels tab / Explore / suggested | Visual fingerprint match against IG corpus; check brief for "reaction" or "voiceover" — no material transformation = flag | internal |
| Trending audio + zero original visual treatment (silent stock footage with viral song) | Originality demotion — algorithm reads as low-effort repost-like | Brief specifies trending audio AND no on-screen text, no talking head, no original edit cuts | internal |
| Hashtag spam (>5 tags, or generic broad hashtags) | Post-Dec-2025 hashtag cap is hard — IG silently strips beyond 5; platform-stated reach is *reduced* by spammy tag patterns | Tag count >5; or any tag >2M posts (treated as spam-correlated by ranking system) | internal |
| Low-resolution upload (<1080p) | Manual practitioner observation: visibly downscaled reels skip-rate ~15% higher | Asset spec lower than 1080×1920 OR bitrate <8 Mbps | internal |
| Follower-only optimization (engagement-bait that only your existing followers will care about) | Caps reach at follower base; algorithm has no signal to expand to non-followers | Brief hook references in-jokes, account history, or "only my followers will get this" — flag for non-follower hook redesign | internal |
| No on-screen text / burned-in caption on a spoken-word reel | Skip rate spikes — autoplay-sound-off accounts (~30% of feed views) bounce in <2s | Brief specifies talking head/VO without on-screen text overlay | internal |
| No loop-friendly final frame | Re-watches drop, watch time multiplier lost | Brief ends on cut-to-black or "thanks for watching" sign-off (kills loop) | internal |
| Recycled own content posted >2× across surfaces without re-edit | Originality flag at high frequency; not penalized at low frequency | Same audio + same visual cuts uploaded across feed + reel + story without re-edit | internal |

"Don't be salesy" is **not** an anti-pattern. The patterns above are mechanically detectable from a brief.

---

## 5. Hook Window + Retention Curve

- **First-second goal:** Stop the scroll. The reel must show one of: a contrarian claim text overlay, a face mid-expression, a visual pattern interrupt, or an explicit value promise within frame 1. Silent-feed default means *visual + on-screen text* must do the hook alone — the spoken hook is bonus, not primary.
- **Critical drop-off point:** **0:03**. ~50% of viewers leave by 3s on average; Instagram explicitly tracks and surfaces "Skip Rate" as the % who bounced in this window. This is the most-cited primary retention threshold on Reels.
- **Practitioner target:** ≥60% 3-second hold rate (i.e., Skip Rate ≤40%) for a reel to clear the algorithm's "expand distribution" threshold.
- **Retention checkpoint:** ~56% average watch time on 60–90s reels in Social Insider's cohort = strong. ~30–40% on monolithic talking-head reels with no segmentation = baseline. Hitting 56%+ correlates strongly with Reels-tab pickup.
- **Loop / replay behavior:** Reels auto-replay; loops add to total watch time. Reels under 15s benefit most from loop optimization (loop = 1× video length re-watched and counted). Loop-friendly final frame = visual matches/segues into the opening frame, or ends on a cliffhanger that begs a re-watch ("…and the third one is the one you're not going to expect — let me show you.").
- **The "earn the watch" pattern:** the structural counterpart to the 3s hook — even after the hook clears, every 5–8s must contain a fresh micro-promise (chapter card, contradiction, payoff, visual beat) or retention craters. This is why carousel-reel cliffhanger archetype (Section 1.2) outperforms monolithic talking heads.

If retention data isn't public for a specific cohort, default to a third-party benchmark's 60% 3s-hold rate target and Social Insider's 56% mid-watch retention benchmark as the bar to clear.

---

## 6. CTA Placement Norms

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| **DM-trigger ("comment X")** in spoken hook + on-screen text overlay 0:00–0:03 | Lead-magnet, course funnel, asset opt-in. Compounds comment + DM signal — both heavy interactions. platform leadership's publicly endorses DM-driven engagement; a DM automation tool's Comments trigger doc operationalizes it. | Brand-awareness reels (no asset to send). Niches where commenting feels transactional (luxury, art, journalism). When the keyword is generic ("LINK") and the asset is weak. | internal |
| **Caption first 125 chars** (the pre-truncation visible window) | When the CTA is "tap link in bio" or "save this." Concise, action-verb-led. The first 125 chars are guaranteed visible; everything after gets buried under "...more." | When the CTA is buried at line 4 or after a line break. When you assume the viewer will tap "more" — they won't. | internal |
| **Verbal CTA on final frame (end-card, 0:55–1:00 of a 60s reel)** | Save-bait reels, education frameworks where the punchline is the CTA ("save this — you'll need it next time"). Loop-compatible. | When it kills the loop ("thanks for watching, follow for more" = engagement death). When the CTA contradicts the reel's energy. | internal |
| **Pinned-comment CTA** | When the creator pins a top comment with a link, additional context, or the keyword reminder for the DM-trigger pattern. Acts as a secondary asset surface. | When the pinned comment is generic ("Thanks for watching!"). When IG's link-detection downgrades the comment for outbound URLs (use the a DM automation tool trigger pattern instead — keyword, not URL). | internal |
| **Link in bio** | Default fallback for any reel that can't use DM-trigger. Reaches followers who tap to profile. | Cold non-follower viewers — the friction (tap-tap-tap) is too high; expect <1% conversion vs. ~5–15% for DM-trigger when the asset is good. | internal |
| **On-screen text overlay CTA mid-reel (0:15–0:25 on a 60s reel)** | When the reel is education + the CTA is "save this" — overlay reinforces save-bait without breaking the watch. | When the overlay obscures the speaker's face or the visual hook. When it reads as a hard sell mid-watch. | internal |

**Rule of thumb:** if the goal is conversion to a list/asset → DM-trigger. If the goal is profile follow → end-card + bio-link reinforcement. If the goal is reach → save-bait CTA early-overlay. Never stack three CTAs in one reel — you'll dilute all of them.

---

## 7. Open Questions / Known Unknowns

- **Exact weighting of the Originality classifier:** Instagram has stated the 10-reposts-in-30-days threshold publicly but the per-reel originality *score* is opaque. Practitioner posts use the term "Originality Score" interchangeably with "originality classifier"; the score's continuous gradient (vs. binary flag) is inferred, not confirmed. Material-enhancement carve-outs (memes, parody, voiceover, remix) are listed but the model's threshold for "material" is undocumented.
- **Save-vs-share ranking weight:** third-party cohort cohort analysis classifies saves and shares both as "heavy," but the relative weight (is a save = 2 shares? = 0.5 share?) is not public. platform leadership's Jan-2025 explainer only ranked watch time, likes per reach, and sends per reach — saves were notably absent from the explicit top-three but acknowledged elsewhere. Treat the relative ranking of saves as inferred.
- **Reach floor for 0% Skip Rate but small follower base:** Practitioner consensus is 60% 3s-hold rate clears the distribution-expansion gate, but the absolute floor of unique reach a sub-1K-follower account can hit on a single high-retention reel is unmeasured. Cohort studies haven't isolated this variable.
- **Trending-audio decay window:** "Trending" is signaled by an up-arrow in the audio picker, but the velocity decay (how long after the up-arrow appears does the reel still get the audio-trend lift?) is not documented. Practitioner heuristic: 7–14 days, but no cohort study cited.
- **Effect of the Dec-2025 5-hashtag cap on niche discoverability:** The cap is 6 months old as of this doc's verification date. It's too early to know whether niche/long-tail hashtags (e.g., #notiontemplate, #vintagecamera) still drive measurable search traffic at the new cap, or whether keyword-in-caption SEO has fully replaced them. Re-verify this open question when re-checking source internal in 90 days.
- **Cross-posting from TikTok with the watermark removed (but identical edit):** Originality classifier behavior on a watermark-stripped but otherwise-identical-to-TikTok upload is unclear — IG can fingerprint visuals, not just OCR watermarks. Anecdotal practitioner reports suggest re-edits with at least one new cut + on-screen text are required to avoid the originality demotion.
- **Collab-post reach-lift magnitude.** Practitioner reports uses a meaningful lift (commonly stated as "around 50%") for Collab posts vs. single-author posts, but the originally-cited "Meta's 2024 internal data" attribution was an unsourced inline claim and has been removed. The reach lift is real and consistent in cohort observations; the specific magnitude is not platform-confirmed. Re-research pass to find a properly-cited cohort number.
- **Caption character limit (2,200) primary-source reference gap.** The 2,200-char caption + ~125-char "...more" truncation is long-documented Instagram constraint but the specific Help Center URL is not yet pinned to the frontmatter sources block. The values are correct in practitioner consensus; the reference chain needs a primary doc URL.

---

## 8. Changelog

| Date | Change | By |
|---|---|---|
| 2026-05-07 | Initial draft. Hook taxonomy (4 archetypes: DM-trigger, carousel-reel cliffhanger, save-bait, remix). Format constraints reflect Dec-2025 5-hashtag cap, late-2025 20-min duration ceiling, and Apr-2024 Originality framework. Ranked top-7 algorithm signals from platform leadership's Jan-2025 explainer + third-party cohort/third-party cohort cohort data. Anti-patterns include TikTok watermark, hashtag spam, originality demotion. CTA matrix prioritizes DM-trigger as the highest-leverage placement. 6 open questions flagged for re-verify. | internal |
| 2026-05-08 | Phase 0.5b URL repair (Bucket A + B). Finding 7 closed: Archetype 1 examples A+B (DM-Trigger Hook patterns) relabeled `[pattern-derived]`; specific practitioner source / practitioner source post URLs not pinned. Finding 8 closed: removed `` mis-attribution from the Stephanie Kase example (internal is the a DM automation tool Comments-trigger doc — the automation tool, not Stephanie Kase's verbatim text). `last_verified` bumped to 2026-05-08. | internal |
