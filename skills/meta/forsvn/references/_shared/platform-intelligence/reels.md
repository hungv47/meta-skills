<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: reels
schema_version: 2
pack_type: shortform-video
last_verified: 2026-06-18
verifier: agent
status: reviewed
source_basis: "Per-claim categorical + named-source. Ranking cited to Instagram/Mosseri official posts (Jan 2025 + about.instagram.com ranking-explained); deprioritization list cited to Instagram official; benchmarks named (Socialinsider / Dash Social / Rival IQ, denominators noted); numeric ranking weights are unpublished and noted as such; hook-second / cadence figures tagged [practitioner consensus]."
summary: "Reels is ranked top-3 on average watch time, likes per reach, and sends per reach — and for non-follower discovery, sends per reach is the lever; engineer the reel for one specific person to DM it to."
---

# Platform Intelligence — Instagram Reels

Practitioner-grade reference consumed by `brief-shortform` (and downstream surface-specific copy
skills) to ground hooks, format compliance, algorithm fit, and anti-pattern checks. **Not generic
marketing advice.** Every claim is distilled into an operating lever.

Reels is a **content-feed (shortform-video) pack**: the unit of work is a *post*, not a launch day.
The whole game is ranked by Instagram's own stated top-three signals — **average watch time, likes
per reach, sends per reach** (Mosseri, Jan 2025) — so this pack is dominated by its **Hook
Taxonomy (§1)**, **Algorithm Signals (§3)**, and the **Playbook (§5)** that turns those signals
into a repeatable post.

Two things every consuming skill must respect:

1. **Sends are the discovery lever.** Instagram (Mosseri, Jan 2025) states that for *unconnected*
   reach — strangers, the Reels-tab discovery pool — **sends per reach matters slightly more** than
   likes; for *connected* reach (your existing followers) likes matter slightly more. Strangers
   don't send to strangers; they send to people who'd specifically care. The whole hook taxonomy is
   engineered to earn a DM share to *one specific person*.
2. **The first frame is the hook.** Reels autoplay sound-off in much of the feed, so the visual +
   on-screen text must carry the hook alone in the first ~3 seconds; the spoken line is a bonus, not
   the primary. A reel that doesn't earn the first ~3s never reaches the watch-through signal that
   Instagram's ranking models predict.

When this doc's `last_verified` exceeds 90 days, `validate-packs.ts` warns and the consuming critic
flags `DONE_WITH_CONCERNS` — Instagram periodically retunes ranking and its deprioritization rules,
so re-verify before publishing. A Pro client is served the current pack from the freshness pipeline.

---

## 1. Hook Taxonomy

Four Reels-native archetypes. They overlap the base six (`../hook-archetypes.md`) only in surface —
every variant below adds a Reels-specific format or distribution mechanic, so do not collapse them
back to the generic version. Each is engineered toward Instagram's stated ranking models
(watch-through, reshare, like — about.instagram.com ranking-explained) rather than vanity counts.

### Archetype 1 — Send-Trigger Hook ("send this to the person who…")

- **Definition:** Opens with a value or identity claim explicitly *built to be DM'd to one specific
  person* the viewer knows. Designed to convert a passive view into a **send** — the signal
  Instagram states is slightly more important than likes for *unconnected* (discovery) reach.
- **Identifying signal:** First 1–3s names a recipient archetype ("send this to your perfectionist
  friend" / "tag the person who needs to hear this") and the on-screen text repeats it. The reel's
  payoff is something a viewer would want a specific person to *also* see.
- **Pattern examples A:** A "send this to the friend who reschedules everything" relatable-callout
  hook over a single clean talking-head frame. `[pattern-derived from creator-economy education
  cohort]`
- **Pattern examples B:** An identity-tag hook — "this is for the [job/role] who's tired of [pain]"
  — that prompts a viewer to forward it to a peer in the same role. `[pattern-derived from B2B
  service cohort]`
- **Engagement-signal rationale:** A send is the strongest *unconnected-reach* signal Instagram has
  named (Mosseri, Jan 2025; "sends per reach" in the stated top-three). A DM share is also one of
  the modeled predictions Instagram lists (reshare) in its ranking-explained explainer. Engineering
  the angle around *one specific recipient* is the most direct way to lift the discovery signal.
- **Best for:** founder-led education, relatable B2B, anything with a clear "you know someone like
  this" recipient. **Bad fit:** broad brand-awareness with no shareable payoff; niches where
  forwarding feels transactional.

### Archetype 2 — Multi-Segment Cliffhanger (watch-through retention scaffold)

- **Definition:** Reel structured as 3–5 visually distinct "slides" inside one video, each segment
  ending on a cliffhanger that earns the next 2–3 seconds. Segmentation is *visually marked*
  (chapter cards, "Step 1 / Step 2", color shifts) so retention is earned in micro-promises rather
  than one long arc.
- **Identifying signal:** Visible step counter, chapter title, or "but wait" cut at predictable
  beats (every 5–8s). Often mimics carousel UX with a swipe arrow even though it's one video.
- **Pattern examples A:** "Three things I'd never do as a [role] — the third one will save you
  $10K. Number one…" — the listicle-with-payoff-on-last-item structure. `[pattern-derived from
  education / framework cohort]`
- **Pattern examples B:** A serialized story-with-numbered-overlay ("the part nobody tells you
  happens at step 7. Step 1: …") where the visible "Step N" overlay is the cliffhanger scaffold.
  `[pattern-derived from high-volume cross-post cohort]`
- **Engagement-signal rationale:** Instagram's stated #1 signal is average watch time, and one of
  its modeled predictions is watch-through (about.instagram.com ranking-explained). A monolithic
  talking-head reel sheds attention; segmenting into payoff-loaded chunks resets the viewer's
  attention budget at each cliffhanger, lifting average watch time. `[practitioner consensus]` that
  this also produces saves (people return to finish the list).
- **Best for:** education, listicles, frameworks, "X mistakes" reveals, before/afters. **Bad fit:**
  emotional storytelling (interrupts the arc), product demos under 15s, aesthetic content where
  pacing breaks the vibe.

### Archetype 3 — Save-Bait Reference Frame

- **Definition:** Opens with a frame so information-dense (or visually labeled as a reference
  asset — "save this for later") that the viewer reflexively saves before the reel ends. Exploits
  the save signal as a heavy interaction that predicts re-watch (more watch time).
- **Identifying signal:** First frame is a titled reference card ("12 hooks that actually work —
  save this"); sometimes an explicit "save this" overlay in the first 2 seconds. The content is
  reference material a viewer would want to revisit.
- **Pattern examples A:** "Save this — 7 prompts that write your week of content in 12 minutes.
  Prompt 1…" — a framework-reel where the save-this overlay and the listicle-as-reference structure
  compound saves with completion. `[pattern-derived from creator education cohort]`
- **Pattern examples B:** "Don't scroll — the only 4-question framework you need to validate a
  business idea. Save it now, you'll need it." `[pattern-derived from B2B education cohort]`
- **Engagement-signal rationale:** Saves are **not** in Instagram's stated top-three (watch time,
  likes per reach, sends per reach — Mosseri, Jan 2025), so treat them as a secondary lever. The
  defensible mechanism: a save is a *predictive* signal that the viewer wants to return, which
  downstream lifts re-watch / watch time (the stated #1 signal). Save-bait is the only archetype
  where the *first frame*, not the spoken hook, is the conversion event.
- **Best for:** education, frameworks, reference lists, recipe/how-to, language learning. **Bad
  fit:** entertainment, comedy, news commentary — saving "the joke" is rare, so the bait reads as
  cynical.

### Archetype 4 — Remix / Collab-Tagged Reel

- **Definition:** Reel built on top of another creator's existing reel via Reels Remix (side-by-side
  or sequential) or co-published as a Collab post. Imports the original reel's audience into your
  distribution pool. (Practitioner reports describe a meaningful Collab-post reach lift vs.
  single-author posts, but no Instagram-confirmed figure is published — see §8.)
- **Identifying signal:** Remix UI badge ("Remixed with @x") top-left, or two creator handles in the
  post header for Collab posts. Typically the original reel is on one side and the new
  reaction/extension on the other.
- **Pattern examples A:** A reaction-style remix targeting a high-view contrarian post ("this is the
  worst advice on Reels and here's why"). `[pattern-derived from creator-economy commentary cohort]`
- **Pattern examples B:** A Collab post where both creators' audiences see the same reel in feed
  simultaneously — used to launch tandem campaigns; appears on both grids. `[pattern-derived from
  tandem-launch cohort]`
- **Engagement-signal rationale:** A remix rides the parent reel's existing engagement velocity —
  the system has already validated the parent as high-distribution and the remix inherits topical
  relevance + audience overlap. A Collab post seeds initial distribution from a doubled follower
  pool. `[practitioner consensus]`; the magnitude of the Collab lift is unconfirmed (§8).
- **Best for:** creator-economy commentary, reactions, expansions on someone else's framework,
  tandem launches, cross-promo. **Bad fit:** brand accounts where a remix reads as derivative;
  silent-feed product content; anything where the original creator hasn't opted into Remix.

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Prefer numeric.

| Constraint | Value | reference |
|---|---|---|
| Aspect ratio | **9:16 vertical** | Instagram Help / creator specs |
| Resolution recommended | **1080×1920**, H.264, 30fps, AAC 48 kHz | Instagram Help / creator specs |
| Container / codec | **MP4 or MOV** | Instagram Help / creator specs |
| Max file size | **4 GB** | Instagram Help / creator specs |
| Max length | **3 minutes** (in-app recording caps at ~90s; longer requires upload) | Instagram Help / creator specs |
| Caption character limit | 2,200 | Instagram Help Center (long-documented; specific URL not yet pinned — §8) |
| Caption truncation point | ~125 chars before "…more" | `[practitioner consensus]` |
| Safe zones (top / bottom) | ~250px top + ~250px bottom obscured by UI; place text in center band | `[practitioner consensus]` |
| Feed crop | Reels in main feed crop to **4:5** centered — design the center band to read alone | Instagram Help / creator specs |
| Grid / profile crop | **1:1** — keep the main subject centered so it reads on the profile grid | Instagram Help / creator specs |
| Burned-in caption | Recommended — autoplay-sound-off behavior + accessibility; on-screen captions correlate with retention | `[practitioner consensus]` (mechanism implied by the official watch-through signal) |
| Audio — original / clean | Use original or licensed/cleared audio; a **muted** reel is deprioritized (Instagram official). | Instagram ranking-explained (deprioritization list) |
| Trending-audio "boost" | Pairing trending audio with an original visual is a creator pattern — Instagram confirms a *penalty* for muted/watermarked audio, **not** a stated "use trending audio" *boost*. | `[practitioner consensus]` |
| Watermark | A reel **watermarked** (incl. TikTok/other-app logos) is deprioritized; recycled-from-other-apps reach is explicitly limited. | Instagram ranking-explained + Instagram spokesperson via Social Media Today (socialmediatoday.com/news/instagram-will-now-limit-the-reach-of-re-posts-from-tiktok-within-its-reels/594803/) |
| Borders / majority-text | Reels with **borders** or that are **majority covered by text** are deprioritized. | Instagram ranking-explained (deprioritization list) |
| Low resolution | **Low-resolution** reels are deprioritized. | Instagram ranking-explained (deprioritization list) |
| Recycled content | A reel **already posted on Instagram** (recycled) is deprioritized. | Instagram ranking-explained (deprioritization list) |

The "15-minute Reels" length claim circulating in 2025–26 is **unverified** — cite **3 minutes** as
the documented max; the 15-min figure is logged in §8 as an open question.

---

## 3. Algorithm Signals (Ranked by Impact)

Instagram (Mosseri, Head of Instagram) publicly named the top three for Reels in his **Jan 2025**
explainer (instagram.com/p/DFFyRp-pINJ/, covered by Social Media Today,
socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/). The older canonical
"Instagram ranking explained" page (about.instagram.com/blog/announcements/instagram-ranking-explained)
lists four signal *categories* (your activity / your history with the creator / info about the reel /
info about the creator) and the modeled *predictions* (reshare, watch-through, like, visit-audio-page).
**No numeric weights are published.** Comments are notably **absent** from Mosseri's stated top-three.

1. **Average watch time** — total seconds watched relative to length, plus a watch-through signal.
   *Why:* Mosseri's #1 stated signal for Reels (Jan 2025); watch-through is one of the listed
   modeled predictions (ranking-explained). *Operator lever:* engineer the first ~3s hook (text +
   visual + spoken claim), segment the reel with cliffhanger beats, and end on a loop-friendly final
   frame so re-watches add to watch time. *Tier:* **primary (Instagram-stated).**

2. **Sends per reach (DM shares)** — times the reel was sent in DM ÷ unique reach. *Why:* in
   Mosseri's Jan 2025 framing, **sends per reach matters slightly more than likes for *unconnected*
   (discovery) reach** — the strongest discovery lever; reshare is also a listed modeled prediction.
   *Operator lever:* design the reel for *one specific person the viewer knows* — the Send-Trigger
   archetype (§1.1) operationalizes this directly. *Tier:* **primary (Instagram-stated).**

3. **Likes per reach** — likes ÷ unique reach (a normalized rate, not a raw count, so it doesn't
   penalize smaller creators). *Why:* Mosseri's #3 stated signal; **likes matter slightly more than
   sends for *connected* (existing-follower) reach.** *Operator lever:* lowest-friction interaction —
   if the reel is strong on watch time and sends, likes follow; don't optimize for likes directly.
   *Tier:* **primary (Instagram-stated).**

4. **Saves per reach** — saves ÷ unique reach. *Why:* **not in Mosseri's stated top-three**, so
   treat as a secondary lever; the defensible mechanism is that a save predicts re-watch, which
   lifts watch time (the #1 stated signal). *Operator lever:* save-bait archetype (§1.3); an
   explicit "save this for later" overlay; a reference-style first-frame card. *Tier:* secondary
   `[practitioner consensus]`.

5. **Comments per reach** — comments ÷ reach. *Why:* **comments are notably absent from Mosseri's
   Jan 2025 top-three**; treat comment optimization as a weaker lever than watch time / sends /
   likes, even though comments are visible engagement. *Operator lever:* end on a question that begs
   a non-trivial answer — but do not trade watch time for it. *Tier:* secondary `[practitioner
   consensus]`.

6. **Originality / not-recycled** — Instagram deprioritizes a reel that is recycled (already posted
   on Instagram) or watermarked/repackaged from another app. *Why:* part of Instagram's official
   deprioritization list (ranking-explained) + the explicit limit on TikTok-watermark re-posts
   (Instagram spokesperson, Social Media Today). *Operator lever:* always add an original visual
   layer (talking head, on-screen text, voiceover, distinct edit); never re-upload an unmodified
   reel or one carrying another app's watermark. *Tier:* **primary (rule documented; the per-reel
   weighting is opaque — §8).**

7. **Interest / relationship signals** — historical engagement between viewer and creator/topic +
   cohort-similar behavior. *Why:* Instagram's "your activity" + "your history with the creator"
   signal categories (ranking-explained); the personalization layer that decides *which* watchers a
   reel surfaces to. *Operator lever:* tight topical clustering — a coherent topic vector per handle
   helps the system seed initial distribution. *Tier:* primary (category named) but mechanics opaque.

---

## 4. Anti-Patterns

Instagram publishes a **deprioritization list** (about.instagram.com ranking-explained): it reduces
visibility for Reels that are **low-resolution, watermarked, muted, contain borders, majority-text,
or already posted on Instagram (recycled)**. Recycled-from-other-apps content (e.g. a TikTok
watermark/logo) is explicitly limited (Instagram spokesperson via Social Media Today). The rows
below are mechanically detectable from a brief.

| Pattern | Penalty observed | Detection rule | Source |
|---|---|---|---|
| **Visible watermark** (TikTok or any third-party app logo) | Deprioritized; recycled-from-other-apps reach explicitly limited | OCR scan of first/last frame for app logos / watermark text | Instagram ranking-explained + Instagram spokesperson (Social Media Today) |
| **Recycled reel** (already posted on Instagram, no transformation) | Deprioritized (official list) | Visual fingerprint match against prior uploads; brief lacks any material transformation | Instagram ranking-explained |
| **Muted reel** (no audio track) | Deprioritized (official list) | Asset has no audio / original audio track | Instagram ranking-explained |
| **Borders** (letterbox bars, framed canvas) | Deprioritized (official list) | Asset has visible borders rather than full-bleed 9:16 | Instagram ranking-explained |
| **Majority-text frame** (screen mostly covered by text) | Deprioritized (official list) | On-screen text covers a majority of the frame area | Instagram ranking-explained |
| **Low-resolution upload** (<1080p) | Deprioritized (official list) | Asset spec lower than 1080×1920 | Instagram ranking-explained |
| **Trending audio + zero original visual** (silent stock footage under a viral song) | Reads as low-effort / recycled-like | Brief specifies trending audio AND no on-screen text, no talking head, no original edit | `[practitioner consensus]` (mechanism implied by the official originality/recycled rules) |
| **No on-screen text on a spoken-word reel** | Sound-off viewers bounce early → lower watch time | Brief specifies talking head/VO without an on-screen text overlay | `[practitioner consensus]` (mechanism implied by the official watch-through signal) |
| **No loop-friendly final frame** | Re-watches drop, watch-time multiplier lost | Brief ends on cut-to-black or "thanks for watching" sign-off | `[practitioner consensus]` |
| **Follower-only optimization** (in-jokes only existing followers get) | Caps reach at follower base; no discovery signal | Brief hook references account history / "only my followers will get this" | `[practitioner consensus]` |

"Don't be salesy" is **not** an anti-pattern. The patterns above are mechanically detectable from a
brief, and the first six are Instagram-stated, not inferred.

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic:** engineer the angle around a **send** — one specific person the viewer
would DM it to — wrap it in a first-3s hook over **original, clean audio** with **no watermark, no
borders, no majority-text**, end on a loop-friendly frame, then be present in replies to drive saves
+ sends. Sends per reach is Instagram's stated discovery lever (Mosseri, Jan 2025); everything else
protects the watch-through and originality signals that gate distribution.

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | Pick the send angle | T−1d | Decide *who* the viewer would DM this to ("send this to the [role/friend] who…"). The payoff must be something a viewer wants a specific person to also see (§1.1). | A one-line recipient statement a stranger could repeat |
| 2 | Build the first-3s hook | T−1d | Visual + on-screen text carry the hook alone (sound-off default); contrarian claim / face mid-expression / pattern interrupt / explicit value promise in frame 1. Spoken hook is a bonus. | Hook reads with sound off; reviewer "gets it" in <3s |
| 3 | Structure for watch-through | T−1d | Edit for average watch time: segment into payoff beats every ~5–8s (§1.2), end on a loop-friendly final frame so re-watches add watch time. | Cut list has a fresh micro-promise each beat + a loop seam |
| 4 | Pass the originality + format floor | T−1d | Original/clean audio (not muted); **no** watermark, **no** borders, **not** majority-text; 1080×1920 9:16; not recycled from another app or a prior IG post. | Asset clears every Instagram deprioritization rule (§4) |
| 5 | Post | T−0 | Publish the reel with a caption whose first ~125 chars carry the point; ≤ the documented format limits (§2). | Live; caption point visible before "…more" |
| 6 | Reply to drive saves + sends | T+0 → T+24h | Reply to comments; prompt the send ("send this to the one person who needs it") and the save where the reel is reference material. Be present in the first hours. | High reply rate; comments name a recipient ("sending this to @…") |
| 7 | Measure | T+24h → T+7d | Pull **average watch time** and **sends-per-reach** (plus likes-per-reach, saves) from Insights; note skip behavior. | Dated watch-time + sends-per-reach figures captured |
| 8 | Feed the loop | T+7d | Write the watch-time / sends-per-reach result into `measure-results` → feeds the pack and the next brief. | What-worked / what-failed entry recorded against this reel |

This sequence is what the shortform chain executes step-by-step, and what `brief-shortform` /
`publish-social` narrate ("running the send-angle + first-3s + clean-audio Reels playbook").

---

## 6. Timing, Cadence & Hook Window

- **First-second goal:** stop the scroll. Frame 1 shows one of — a contrarian claim text overlay, a
  face mid-expression, a visual pattern interrupt, or an explicit value promise. Silent-feed default
  means *visual + on-screen text* must do the hook alone. `[practitioner consensus]` (mechanism
  implied by Instagram's stated watch-through signal).
- **Critical drop-off point:** the first **~3–4 seconds**. Dash Social (Sep 2025) noted an average
  of roughly **4 seconds** of watch before a scroll — cite as Dash Social. The exact second-count
  threshold is **not** Instagram-stated; treat the 3s figure as `[practitioner consensus]` consistent
  with the official watch-through emphasis.
- **Retention target:** maximize average watch time (Instagram's #1 stated signal); a segmented,
  payoff-loaded edit (§1.2) holds attention better than a monolithic talking head. Specific
  percentage retention benchmarks are `[practitioner consensus]`, not Instagram-published.
- **Loop / replay behavior:** Reels auto-replay; loops add to total watch time. A loop-friendly
  final frame (visual segues into the opening frame, or ends on a cliffhanger that begs a re-watch)
  compounds watch time. `[practitioner consensus]`.
- **Cadence:** **3–5 reels per week** is the practitioner-consensus posting rhythm — frequent enough
  to feed the topic vector, not so frequent that quality (and watch time) drops. `[practitioner
  consensus]`; exact cadence is not Instagram-stated.
- **Benchmarks (named; note the different denominators so the numbers aren't misread):**
  - **Socialinsider (2026 IG benchmarks, 35M posts / 447K pages):** Reels average engagement
    ~**0.50–0.52%**, on a **follower-based** denominator. (socialinsider.io/social-media-benchmarks/instagram)
  - **Dash Social (2025):** Reels ~**2.7%**, on a **reach-based** denominator — **not** comparable
    to Socialinsider's follower-based figure; the larger number reflects the smaller denominator.
  - **Rival IQ (2025):** Reels was the **top-engagement format** in most industries.
  - These are different studies with different denominators; never average or directly compare the
    Socialinsider and Dash Social percentages.

---

## 7. CTA Placement Norms

The Reels CTA should serve the stated signals — chiefly **sends** (discovery) and watch time —
without breaking the loop. Conversion = hook → watch-through → send/save → profile/link.

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| **Send-trigger ("send this to…")** in the hook + on-screen text 0:00–0:03 | Drives the strongest discovery signal (sends per reach); names one specific recipient (§1.1). | Broad brand-awareness with no shareable payoff; generic "share this" with no named recipient. | Instagram-stated (sends per reach) + `[practitioner consensus]` on phrasing |
| **Caption first ~125 chars** (pre-truncation window) | "Save this" / "tap link in bio"; concise, action-verb-led; guaranteed visible before "…more". | CTA buried after a line break; assuming the viewer taps "more" — they won't. | `[practitioner consensus]` |
| **Verbal CTA on the final frame** (end-card) | Save-bait / framework reels where the punchline is the CTA ("save this, you'll need it"); loop-compatible. | When it kills the loop ("thanks for watching, follow for more"); when it contradicts the reel's energy. | `[practitioner consensus]` |
| **Pinned-comment CTA** | A pinned top comment carries the link / context / the keyword reminder; a secondary asset surface. | Generic ("thanks for watching!"); a raw outbound URL that the feed may downweight. | `[practitioner consensus]` |
| **Link in bio** | Default fallback for any reel that can't use a send-trigger; reaches followers who tap to profile. | Cold non-follower viewers — the tap-tap-tap friction is high; expect low conversion vs. a send angle. | `[practitioner consensus]` |
| **On-screen "save this" overlay mid-reel** | Education + reference reels — reinforces the save without breaking the watch. | When it obscures the speaker/visual hook; when it reads as a hard sell mid-watch. | `[practitioner consensus]` |

**Rule of thumb:** if the goal is discovery → a send-trigger angle. If the goal is reference value →
a save-this overlay early. If the goal is profile follow → end-card + bio-link reinforcement. Never
stack three CTAs in one reel — you dilute all of them.

---

## 8. Open Questions / Known Unknowns

- **Numeric ranking weights are unpublished.** Instagram states the *order* and the *connected vs.
  unconnected* tilt (likes lead for followers, sends lead for discovery — Mosseri, Jan 2025) but
  publishes **no numeric weights**. Any "X% weight" claim is not citable.
- **Per-reel originality weighting.** Instagram documents the recycled/watermarked deprioritization
  *rules* (ranking-explained + the TikTok-repost limit), but the continuous per-reel originality
  *score* (vs. a binary flag) and the threshold for "material" transformation are opaque.
- **Save vs. send relative weight.** Saves are absent from Mosseri's stated top-three; their weight
  relative to sends is inferred, not published. Treat saves as a secondary lever whose value is the
  re-watch (watch-time) it predicts.
- **Exact hook-second threshold.** Dash Social (Sep 2025) reports ~4s average watch before a scroll;
  the precise second-count that gates "expand distribution" is `[practitioner consensus]`, not
  Instagram-stated.
- **Cadence.** The 3–5 reels/week figure is `[practitioner consensus]`; Instagram has not stated an
  optimal posting cadence.
- **The "15-minute Reels" max-length claim.** Circulating in 2025–26 but **unverified**; the
  documented max is **3 minutes**. Re-verify whether a longer ceiling has shipped before citing it.
- **Trending-audio "boost."** Instagram confirms a *penalty* for muted/watermarked audio, **not** a
  stated *boost* for trending audio. Whether pairing trending audio with an original visual lifts
  distribution beyond the originality floor is `[practitioner consensus]`, not Instagram-confirmed.
- **Benchmark denominators.** Socialinsider (follower-based, ~0.50–0.52%) and Dash Social
  (reach-based, ~2.7%) are not comparable; the "true" Reels engagement rate depends entirely on the
  denominator a tool uses. Always state which.
- **Collab-post reach-lift magnitude.** Practitioner reports describe a meaningful lift for Collab
  posts vs. single-author posts, but no Instagram-confirmed figure exists. The lift is real and
  consistent in cohort observations; the magnitude is unconfirmed.
- **Caption character limit (2,200) primary-source reference gap.** The 2,200-char caption + ~125-char
  "…more" truncation is long-documented but the specific Instagram Help Center URL is not yet pinned
  to the frontmatter. The values are correct in practitioner consensus; the reference chain needs a
  primary doc URL.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-05-07 | Initial draft. Hook taxonomy (4 archetypes), format constraints, top-7 algorithm signals, anti-patterns, CTA matrix, open questions. | internal |
| 2026-05-08 | Phase 0.5b URL repair (Bucket A + B). Archetype examples relabeled `[pattern-derived]`; mis-attribution removed. `last_verified` bumped to 2026-05-08. | internal |
| 2026-06-18 | v1→v2: pack_type, summary, §5 Playbook; ranking re-cited to Mosseri (Jan 2025) + Instagram ranking-explained; benchmarks named (Socialinsider/Dash Social/Rival IQ); de-anonymized via agent web-verification (operator review pending). | agent |
