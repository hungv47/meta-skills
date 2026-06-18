<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: linkedin
schema_version: 2
pack_type: shortform-video
last_verified: 2026-06-18
verifier: agent
status: reviewed
source_basis: "Per-claim categorical + named-source. External-link reach tax cited to the Ordinal link-penalty study (Jeffrey Zhao, 900K posts) alongside LinkedIn's official Jobanputra framing; comment-weighting to Richard van der Blom (Algorithm Insights Report 2025); format/timing benchmarks to Socialinsider, AuthoredUp, and Buffer with sample N noted; unsourceable practitioner figures tagged [practitioner consensus] and listed in Open Questions."
summary: "On LinkedIn, the body is link-free or it gets taxed: an Ordinal 900K-post study found posts with external links reached ~26.5% fewer people — so put the link in the first comment, hook the first ~210 chars above the fold, burn in captions for mute-watching, and engineer the post for conversation comments (weighted ~2× likes)."
---

# Platform Intelligence — LinkedIn (Native Video)

Practitioner-grade reference consumed by `brief-shortform`, `write-social`, `publish-social`, and the launch chains to ground hooks, format compliance, algorithm fit, the tactical playbook, and anti-pattern checks for LinkedIn native video posts. **Not generic marketing advice.** Every claim is distilled into an operating lever.

When this doc's `last_verified` exceeds 90 days, `validate-packs.ts` warns and the consuming critic flags `DONE_WITH_CONCERNS` with "platform signal may be stale — verify before publishing." LinkedIn shipped LLM-based ranking (360Brew) through 2025–2026, so signal weights may decay faster than typical platform-doc claims. A Pro client fetches the *current* pack from the freshness pipeline; a free client keeps this build-time snapshot, which ages.

Scope: native video uploaded directly to LinkedIn (personal profile or Company Page). Excludes: live broadcasts, LinkedIn Learning, Sales Navigator video messaging, paid Video Ads (covered separately under "Video Ads" rows in §2 where they diverge from organic).

Two things every consuming skill must respect:

1. **The body is link-free or it gets taxed.** An Ordinal study of 900K posts (Feb 2023–Feb 2026, Jeffrey Zhao) found posts with external links reached **~26.5% fewer people** in aggregate — and the penalty *grew* over time (~5% in 2023 → ~42% in 2025). The link goes in the first comment, never the body (§4, §7).
2. **The caption first line carries equal hook weight to the visual hook** — the post body sits *above* the autoplay video, so the first ~210 chars (before the "see more" fold) are the hook surface (§1, §2).

---

## 1. Hook Taxonomy

LinkedIn video hooks operate under a constraint no other short-form platform shares: the **caption first line carries equal hook weight to the visual hook**, because the post body sits *above* the autoplay video in the feed and is the first thing the eye lands on. This produces archetypes that don't map cleanly onto TikTok/Reels.

Six base archetypes are defined in `../hook-archetypes.md` (Credential flash, Pattern interrupt, Question, Pre-reveal tease, Contrarian claim, Data point). The four below are LinkedIn-native variants that meaningfully reframe those bases for the feed-with-truncated-caption surface.

### Archetype 1 — Caption-first credential drop (text-leads-video)

- **Definition:** The caption first line states a credential or outcome so strong it earns the click on "see more"; the video then *delivers* the story behind it. Visual hook is secondary.
- **Identifying signal:** First line of post body is ≤210 characters (above the desktop fold), contains a specific number or named outcome, and the video opens with the speaker mid-context (no "Hi everyone" preamble — the caption did the framing).
- **Pattern examples A:** "[The one] LinkedIn writing tactic I use to create posts that travel — (and it's not 'better hooks')" — a self-denying credential lede that earns the fold-click. [pattern-derived from high-reach creator-coach posts]
- **Pattern examples B:** A first line that leads with a concrete outcome number ("This one change took a post from 400 to 40,000 views") before the video explains it. [pattern-derived from top-engagement caption-led video posts]
- **Engagement-signal rationale:** Caption first lines that earn the "see more" click drive dwell time before the video starts playing — and longer, structured captions correlate with reach uplift. AuthoredUp's 372,126-post sample found posts in the **1,301–2,500 character** band saw **+27% engagement** vs. the corpus median (https://authoredup.com/blog/linkedin-character-limit).
- **Best for:** founder personal brand, B2B thought leadership, recruiter content, niches where credibility is the buying lever.

### Archetype 2 — Vulnerability lede (status-inversion hook)

- **Definition:** First spoken line / first caption line admits a failure, a confusion, or a status drop — which is rare on LinkedIn's default "polished professional" surface and creates an immediate pattern interrupt for a feed otherwise saturated with brag posts.
- **Identifying signal:** First-person ("I", "my") + a negative or counter-status word (lost, fired, failed, wrong, embarrassed, confused) within the first 8 words of caption OR within the first 2 seconds of spoken audio.
- **Pattern examples A:** "Losing my job was the best thing that ever happened to me." — a status-inversion opener that stops the scroll by inverting the expected brag. [pattern-derived from high-engagement career-pivot video posts]
- **Pattern examples B:** "I sat down to write a week of posts and my inspiration, energy, and motivation was ZERO." — the candid-low-point opener that invites "same here" replies. [pattern-derived from creator-coach vulnerability posts]
- **Engagement-signal rationale:** LinkedIn's default professional register makes vulnerability a measurable pattern interrupt — viewers stop to verify the claim, which lifts the autoplay completion rate and feeds dwell time. Vulnerability ledes reliably surface *conversation* comment threads, the comment type weighted most heavily (§3) — consistent with LinkedIn's stated shift toward meaningful engagement over reactions.
- **Best for:** founder mode, career-pivot content, lessons-learned posts, post-failure case studies. Avoid in company-mode brand voice — reads as performative.

### Archetype 3 — Process-tease frame ("Here's how I…" / "Watch this in 60s")

- **Definition:** Caption + opening visual together promise a defined deliverable inside a defined runtime ("How I cut churn 22% in 90 days — 60-second walkthrough"), which converts the post from "talking head" to "watchable explainer." Length is *promised*, not just performed.
- **Identifying signal:** Caption first line contains (a) a numeric outcome, (b) a time frame ("in 90 days", "in 60s"), and (c) a process verb ("how I", "the way we", "step by step"). Video opens with on-screen text restating the deliverable.
- **Pattern examples A:** "How I [outcome]" framing — the "How I" (not "How to") construction adds personal proof and stops the scroll on a self-improvement-saturated feed. [pattern-derived from creator-coach process-tease posts]
- **Pattern examples B:** "I made one change to my outbound strategy and doubled my reply rate" — a numeric-outcome process tease that promises a single concrete lever. [pattern-derived from top-performing video caption hooks]
- **Engagement-signal rationale:** Promised-runtime hooks reduce *perceived* time cost — the friction LinkedIn's autoplay specifically tests — so viewers commit to a watch when the caption sets the expectation, lifting retention. Promised-outcome, reference-grade deliverables (frameworks, checklists, before/after) also drive saves, a strong reach signal.
- **Best for:** SaaS demos, agency case studies, recruiting "day in the life" videos, BD/sales tactical breakdowns.

### Archetype 4 — Contrarian-to-LinkedIn-orthodoxy hook

- **Definition:** First line directly attacks a piece of common LinkedIn advice ("Stop posting daily", "Hooks don't matter", "Networking is overrated"), forcing viewers to either defend or update.
- **Identifying signal:** Imperative + anti-platform-orthodoxy claim in first 10 words; OR "Everyone says X. They're wrong." structure. Video proceeds to argue the contrarian case with one counter-example.
- **Pattern examples A:** "Stop posting every day. It's quietly killing your reach." — an anti-orthodoxy imperative that invites practitioners to dispute or qualify it. [pattern-derived from high-comment contrarian video posts]
- **Pattern examples B:** "(And it's not 'better hooks.')" — a parenthetical rehook that denies the conventional answer to set up the real one. [pattern-derived from creator-coach contrarian post families]
- **Engagement-signal rationale:** Contrarian hooks generate **indirect / conversation comments** — comments that dispute or refine the claim — which AuthoredUp's analysis of 994K posts associates with up to **2.4× more reach** vs. baseline (https://authoredup.com/blog/linkedin-algorithm; single-source). Contrarian-to-orthodoxy hooks specifically engineer for that comment shape.
- **Best for:** creator economy, marketing/ops/RevOps niches, B2B founder voice. Avoid for risk-averse enterprise brands and regulated industries — invites brand-damaging dispute.

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Numeric over prose.

| Constraint | Value | reference |
|---|---|---|
| Duration sweet spot — talking heads | 30–90 seconds | [practitioner consensus] |
| Duration min | 3 seconds | LinkedIn Help |
| Duration cap (mobile upload) | 10 minutes | LinkedIn Help |
| Duration cap (desktop upload) | 15 minutes | LinkedIn Help |
| File size (organic) | 75 KB – 5 GB | LinkedIn Help |
| File size (Video Ads) | 75 KB – 500 MB | LinkedIn Help |
| File format | MP4 recommended (also WebM, MKV, WMV2/3, ASF, FLV, MPEG-1/4, VP8/9 organic); MP4 only (Video Ads) | LinkedIn Help |
| Frame rate | 10–60 FPS (organic); <30 FPS (Video Ads) | LinkedIn Help |
| Aspect ratio (recommended for feed) | 16:9 or **4:5 (1080×1350)** — vertical/square outperforms 16:9 in the mobile feed | LinkedIn Help |
| Resolution recommended | 1080p (1080×1080 / 1080×1350 / 1920×1080 / 1080×1920) | LinkedIn Help |
| .SRT caption upload | Supported; LinkedIn renders as native captions, viewer-toggleable | LinkedIn Help |
| Burned-in caption requirement | Effectively required — autoplay is muted by default; treat captions as mandatory for mute-watching | [practitioner consensus] (see §8) |
| Caption (post body) hard limit | 3,000 characters | LinkedIn Help |
| Caption optimal length | **1,301–2,500 chars → +27% engagement** (AuthoredUp, 372,126 posts) | AuthoredUp (https://authoredup.com/blog/linkedin-character-limit) |
| Caption truncation point ("see more") | **~210 chars desktop / ~140 chars mobile.** Critic should treat the **first 210 chars as the visible hook surface** (140 on mobile-first audiences). | [practitioner consensus] (see §8) |
| Hashtag norm | **30 max**; **3–5 practitioner-optimal**; placement out of the first 210 chars | LinkedIn Help (cap) + [practitioner consensus] (optimal) |
| Carousel / Document | PDF best; up to **100 MB / 300 pages**; **1080×1080** or **1080×1350** | LinkedIn Help |
| External link in post body | **Reach tax** — Ordinal 900K-post study (Feb 2023–Feb 2026): posts with external links reached **~26.5% fewer people** aggregate; penalty grew ~5% (2023) → ~42% (2025). LinkedIn's official position (Jobanputra, May 2025): only posts whose *sole purpose* is the link see reduced reach — not a blanket penalty. **Default: link in first comment, not body.** | Ordinal (https://www.tryordinal.com/blog/linkedin-link-penalty-study) + LinkedIn (Jobanputra) |
| Post-comment link | Standard workaround; no measured reach tax when the link sits in the first comment instead of the body | [practitioner consensus] |

**Format engagement-rate ranking** (Socialinsider, 1.3M posts — https://www.socialinsider.io/social-media-benchmarks/linkedin): **Documents 7.00% > Multi-Image 6.45% > Video 6.00% > Image 5.30% > Text 4.50% > Link 3.25%.** Video sits mid-pack on engagement *rate* — the wedge for video is dwell + watch-completion feeding the comment loop, not a format-rate advantage. Document/carousel out-engages video, which is why a save-worthy video is often paired with a carousel of the same content.

---

## 3. Algorithm Signals (Ranked by Impact)

Capped at top 7. Ranked by cross-referenced primary + named-source basis. LinkedIn does not publish its formula; weights are tagged by source tier.

1. **Dwell time** — total seconds the viewer spent on the post before scrolling. *Why:* LinkedIn Engineering's 2024 post names dwell time as a top quality signal and describes replacing a static skip threshold with adaptive percentile-based normalization, specifically to avoid biasing toward long-video formats. *Lever:* spec a caption first line ≤210 chars that earns the "see more" click (caption read time = pre-video dwell), plus a 0–3s visual hook so the autoplay preview clears the dwell threshold. *Tier:* primary (LinkedIn Engineering).

2. **Indirect / conversation comments** — comments that engage with the post idea (vs. tagged-friend or "great post!" replies). *Why:* comments are weighted **~2× likes** (Richard van der Blom, *Algorithm Insights Report 2025*, 1.8M+ posts — https://richardvanderblom.com/), and AuthoredUp's 994K-post analysis associates indirect comments with up to **2.4× reach** vs. baseline (single-source). LinkedIn has stated a directional shift toward meaningful engagement over reactions. *Lever:* end the video with a specific debate-able prompt; spec a contrarian or vulnerability hook (Archetype 2 or 4) that produces dispute or expansion comments rather than agreement. *Tier:* secondary (van der Blom / AuthoredUp; LinkedIn confirms direction, not the exact multiplier).

3. **Author replies to comments** — the author answering each comment in the early window. *Why:* a reply re-fires the thread and signals an active conversation, compounding the comment signal above; LinkedIn's longer post lifespan (days, not hours — see §6) means replies keep paying out well past day one. *Lever:* the author blocks the first 60–90 minutes to reply to every comment, then returns over the following days. *Tier:* secondary ([practitioner consensus], consistent with the comment-weighting evidence).

4. **Saves** — viewer bookmarks the post. *Why:* saves signal reference-grade value and a strong intent-to-return; practitioner cohorts rank saves above likes for reach contribution. *Lever:* spec the video deliverable as save-worthy reference material — frameworks, checklists, before/after comparisons; process-tease hooks (Archetype 3) over-index on saves. *Tier:* secondary ([practitioner consensus]).

5. **Native vs. external-link signal** — does the post keep users on platform. *Why:* the Ordinal 900K-post study found external-link posts reached **~26.5% fewer people** aggregate (penalty growing ~5%→~42%, 2023→2025), while LinkedIn's official framing (Jobanputra, May 2025) limits the penalty to posts whose *sole purpose* is the link ("no value for the user"). 360Brew's platform-retention objective is consistent with both readings. *Lever:* publish video natively (never as a YouTube link); put any external CTA link in the first comment, not the post body. *Tier:* primary (LinkedIn states native preference + Jobanputra framing) + secondary (Ordinal measured the aggregate magnitude).

6. **Interest-graph relevance** — LinkedIn matches the video to viewers by topic/interest fit, increasingly over pure social-graph proximity. *Why:* LinkedIn has stated a direction shift from the social graph toward an **interest graph**, surfacing content to non-followers on topical relevance; the 360Brew LLM ranks on professional-fit semantic match. *Lever:* keep videos clustered around 2–3 topic pillars; spec keyword-rich on-screen text and caption phrasing that matches the creator's established niche vocabulary. *Tier:* primary (LinkedIn-stated direction) + secondary (weighting unpublished).

7. **First-hour engagement velocity** — likes, comments, and dwell within the early window that gates whether the post enters extended distribution. *Why:* practitioner cohorts describe an initial-classification phase in roughly the first hour that determines the reach ceiling. *Lever:* publish when the creator's audience is online (§6); seed an author comment within minutes of publishing; concentrate the reply-to-every-comment effort in this window. *Tier:* secondary ([practitioner consensus]).

Cap interpretation at these ~7. Reaction *count* alone is not the signal — **dwell × conversation-comments** is.

---

## 4. Anti-Patterns

Specific patterns the algorithm penalizes or audiences punish on LinkedIn video. Each entry includes a detection rule a critic agent can apply.

| Pattern | Penalty observed | Detection rule | Source |
|---|---|---|---|
| **External link in post body** | Ordinal 900K-post study: external-link posts reached **~26.5% fewer people** aggregate (penalty grew ~5%→~42%, 2023→2025). LinkedIn (Jobanputra) scopes it to link-only posts. | Caption contains `http(s)://` or a recognizable non-`linkedin.com` domain | Ordinal (https://www.tryordinal.com/blog/linkedin-link-penalty-study) + LinkedIn (Jobanputra) |
| **YouTube-link share posing as native video** | Treated as an external link; loses the autoplay preview entirely; reach degraded vs. native upload | Brief specifies "share YouTube link" / "embed video URL" without a native-upload step | Ordinal (link tax) + LinkedIn (native preference) |
| **No burned-in subtitles / no .SRT** | Autoplay is muted by default; without captions the message doesn't land in the silent preview, killing the dwell signal | Brief omits "burned subtitles" OR "uploaded .SRT" in the production spec | [practitioner consensus] (mute-watching, see §8) |
| **"Hi everyone, today I want to talk about…" preamble in first 3s** | Drop-off at 0:03 — viewers scroll before the preview ends | First spoken line is a greeting/self-intro; first 2 seconds contain no claim, number, or specific outcome | [practitioner consensus] |
| **Generic caption first line** ("Excited to share this video about…") | Fails to earn the "see more" click → reduced pre-video dwell → reads as low-quality | First 210 chars contain none of: a specific number, named outcome, question, credential, or contrarian claim (fail "I'm excited to" / "Today I'm sharing" / "Check out my new video") | [practitioner consensus] |
| **Hashtag stuffing (>5 hashtags)** | Mild-to-negligible reach drag; consumes the scarce first-210-char hook surface | >5 hashtags in caption, or any hashtag in the first 210 chars | LinkedIn Help (30 cap) + [practitioner consensus] (3–5 optimal) |
| **Tagging unrelated high-follower accounts** | Reach reduction when tagged accounts don't engage; anti-spam handling on irrelevant tagging | Brief specifies tagging named high-follower accounts without a relationship/relevance justification | [practitioner consensus] |
| **Naked sales-pitch CTA in the video** ("DM me to book a call", no proof) | Audience punishment via low save/comment rate; second-order reach decay over the first-hour window | CTA is a generic ask with no deliverable, named offer, or specific next action | [practitioner consensus] |
| **Re-uploaded TikTok with visible watermark** | No formal LinkedIn statement; practitioner consensus is significant reach drag — the watermark signals off-platform origin, which 360Brew's retention objective deprioritizes | Brief specifies cross-posting from TikTok without a watermark-removal step | [practitioner consensus] |
| **Video >10 minutes uploaded via mobile** | Upload rejected outright (mobile cap is 10 min; desktop is 15) | Duration spec >10:00 paired with a mobile-upload production path | LinkedIn Help |

"Don't be spammy" is not an anti-pattern. "Any caption containing `http(s)://` outside `linkedin.com` fails the body-link check" is.

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic:** a contrarian or vulnerability angle engineered to provoke *conversation* comments, with the hook in the first ~210 chars (above the "see more" fold), captions burned in for mute-watching, and **the link in the first comment — never the body** (the Ordinal ~26.5% reach tax). Then the author replies to every comment to re-fire the thread across LinkedIn's days-long post lifespan. Conversation comments are weighted ~2× likes and the indirect-comment shape associates with up to 2.4× reach.

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | Pick the angle | T−2d | Choose a contrarian-to-orthodoxy (Archetype 4) or vulnerability (Archetype 2) angle engineered to make readers *dispute or add* — not nod. Define the one debate-able question the post ends on. | Angle reduces to one falsifiable claim a peer would argue with |
| 2 | Write the hook above the fold | T−1d | Front-load the first ~210 chars (≤140 if mobile-first audience) with a specific number, named outcome, or the contrarian claim — the visible surface before "see more." No hashtags, no link here. | First 210 chars pass §4 generic-caption check; carry the hook alone |
| 3 | Body to optimal length | T−1d | Expand the caption into the **1,301–2,500-char** band (AuthoredUp +27%); tell the same story in text so caption-only readers still count as dwell. End on the step-1 question. | Caption lands in 1,301–2,500 chars; ends in a debate prompt |
| 4 | Burn in captions | T−1d | Add burned-in subtitles AND upload an .SRT — autoplay is muted; the message must land silent. Open the video with on-screen text restating the deliverable. | Message readable with sound off in the first 3 seconds |
| 5 | Publish native at the audience window | T−0 | Upload the video natively (never a YouTube link), 16:9 or 4:5, ≤90s for talking heads, at a weekday afternoon peak (§6). **No external link in the body.** | Live, native, captioned; body link-free |
| 6 | Drop the link in the first comment | T+0:01 | Post the external CTA link as the first comment (pin if possible); reference "link in comments" in the body. Avoids the Ordinal body-link tax. | Link in first comment within 60s; body stays clean |
| 7 | Reply to every comment | T+0 → T+90min, then daily | Author answers every comment in the first 60–90 min to re-fire the thread; then returns over the following **days** (LinkedIn's long lifespan, §6) to keep replies paying out. | 100% reply rate in the first 90 min; replies sustained for 48–72h |
| 8 | Measure dwell + comments | T+72h → T+2wk | Pull dwell, comment count + indirect/conversation share, saves, and reach from creator analytics across the multi-day window — not just day one. | Dwell + conversation-comment count captured over ≥72h |
| 9 | Feed the loop | post-window | Write the dated what-worked / what-failed result into `measure-results` → feeds this pack on the next verification pass. | Dated outcome entry recorded; angle and length deltas noted |

This sequence is what the LinkedIn launch chain executes step-by-step, and what `write-social` / `publish-social` narrate ("running the LinkedIn link-in-comment + conversation-comment playbook"). Note that LinkedIn's post lifespan is measured in **days, not hours** — step 7's follow-up replies are timed across 48–72h, not abandoned after the first hour.

---

## 6. Timing, Cadence & Hook Window

### Hook window + retention curve

- **First-second goal (0–1s):** the visual must convey *what kind of video this is* — face-cam vs. screen-share vs. b-roll — and the burned subtitle must show the first 3–5 words of a specific claim.
- **Autoplay preview window (0–3s):** LinkedIn autoplays silent for ~3 seconds before a scroll-past. The 3s preview is the hard gate — fall below the percentile dwell threshold and the post is read as "skipped" and downranked.
- **Critical drop-off point:** ~0:10. Post the 3s gate, ~0:10 is the next inflection — viewers either commit to the watch or peel off. [practitioner consensus]
- **Mid-video health checkpoint:** 50% retention. LinkedIn surfaces dropoff at 25/50/75/100% in creator analytics; a heavy drop at 50% means the video is too long or loses focus mid-way — the lever for whether the next video should be cut shorter.
- **Loop / replay behavior:** LinkedIn does *not* loop video by default (unlike TikTok/Reels); a single play-through is the default unit. Don't optimize for loop-friendly final frames.
- **Dwell as relative-rank, not absolute-seconds:** LinkedIn uses adaptive percentile-based dwell normalization, not a fixed-seconds threshold. A 6s dwell on a long-form post can be a skip; a 4s dwell on a short clip can be a strong signal.

### Timing & cadence

- **Best post window:** weekday **3–8pm peak** — strongest at **Wed 4pm** and **Fri 3–4pm** (Buffer, *Best Time to Post on LinkedIn*, 4.8M posts — https://buffer.com/resources/best-time-to-post-on-linkedin/). Note audience/industry variation: Sprout Social cites a Wed 10am–noon peak. Treat these as starting points; the creator's own analytics override.
- **Post lifespan:** **directionally longer than feed platforms — days, not hours.** van der Blom claims a 2–3 week tail (paywalled, treat as a practitioner figure / Open Question), but the *directionally-longer* lifespan is consistent across sources and is why author replies (§5 step 7) are timed across 48–72h rather than abandoned after hour one.
- **Cadence:** consistent posting clustered around 2–3 topic pillars (interest-graph relevance, §3.6); the compounding play is topical authority over time, not volume. The metrics loop (`measure-results`) decides whether to slow or accelerate.

---

## 7. CTA Placement Norms

The link-in-post vs. link-in-comment debate is the longest-running operator-level dispute on LinkedIn. The evidence converges on one rule: **don't put the only link in the post body if reach is the goal.** The Ordinal 900K-post study measured a ~26.5% aggregate reach tax on external-link posts; LinkedIn's official framing (Jobanputra) scopes the penalty to link-only posts — either way, the first comment is the safe default.

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| Link in first comment (author-pinned) | Default for organic reach. Body says "link in comments"; body stays link-free, avoiding the reach tax. | When the comment isn't pinned, mobile users miss it (comments collapse below the fold). | Ordinal + LinkedIn (Jobanputra) |
| Link in post body (in caption) | Works for paid Video Ads (no organic penalty applies). Works where conversion >> reach (e.g., job posts where reach beyond the audience is wasted). | Default-fail for organic reach: ~26.5% aggregate reach tax (Ordinal); link-only posts hit hardest (Jobanputra). | Ordinal + LinkedIn (Jobanputra) |
| Verbal CTA at end of video (no link) | Works as "comment with X" or "follow for the next part" — drives the conversation-comment + follow signals the algorithm rewards. | Fails for direct conversion (no measurable click path); top-funnel awareness only. | [practitioner consensus] |
| On-screen text CTA at 0:50–1:00 | Complements the verbal CTA; reinforces the action when audio is muted (mute-watching default). | Fails when burned in too early (≤0:15) — competes with the hook and lowers retention. | [practitioner consensus] |
| Bio / Featured section link | Evergreen anchor for high-intent traffic; survives algorithm updates; doesn't compete with post-level reach. | Fails as a post-specific CTA — feed viewers won't navigate to the profile; only re-visiters click bio links. | [practitioner consensus] |
| "DM me" CTA | Works for high-trust / high-ticket B2B with an established personal brand (post engages, viewer self-selects, conversation starts). | Fails as a default on every post — reads as transactional, lowers comment quality; the prototypical naked-sales-pitch anti-pattern (§4). | [practitioner consensus] |

---

## 8. Open Questions / Known Unknowns

- **Mute-watch share ("~80% watched on mute"):** widely cited but with **no verifiable LinkedIn-original source** — treated here as [practitioner consensus]. The *direction* (autoplay is muted by default, so captions are effectively required) is certain; the exact percentage is not.
- **Caption truncation char count:** the ~210 desktop / ~140 mobile figures are practitioner-cited, not LinkedIn-published. LinkedIn has not stated an official "see more" character count; treat the first 210 chars as the conservative hook surface (140 for mobile-first audiences).
- **Comment-weighting multiplier ("comments ~2× likes"):** from van der Blom's *Algorithm Insights Report 2025* (paid, 1.8M+ posts); the 2.4× indirect-comment reach figure is single-source (AuthoredUp, 994K posts). LinkedIn confirms the *direction* (meaningful engagement over reactions) but not the exact multipliers.
- **External-link reach tax magnitude:** the Ordinal study (900K posts, ~26.5% aggregate, growing ~5%→~42% 2023→2025) and LinkedIn's official "link-only posts" framing (Jobanputra) are both load-bearing here and not fully reconciled — the aggregate measured tax is larger than LinkedIn's stated scope implies. Net direction (negative for body links) is clear; the per-post magnitude depends on whether the post is link-only.
- **Post lifespan ("2–3 weeks"):** a van der Blom claim, paywalled — tagged [practitioner consensus] / Open Question. The directionally-longer-than-feed-platforms lifespan (days, not hours) is consistent across sources.
- **360Brew LLM ranking weights:** LinkedIn announced LLM-based ranking via 360Brew through 2025–2026, but no detailed signal weights or features are public. All §3 weights are pre-/peri-360Brew observations and may decay faster than typical platform-doc claims.
- **"Depth Score" as a named 2026 LinkedIn feature:** **unverified practitioner synthesis** — do not state as an official LinkedIn feature. Flagged here rather than asserted anywhere in the pack.
- **Format-rate vs. reach for video:** Socialinsider (1.3M posts) ranks video's *engagement rate* (6.00%) below Documents (7.00%) and Multi-Image (6.45%). Whether video's lower format-rate is offset by its dwell/watch-completion contribution to the comment loop is not separately isolated in any public cohort.
- **Verbatim video-first-line examples:** most public "viral LinkedIn hook" archives are text-post hooks, not transcribed video opening lines with metrics. The §1 examples are [pattern-derived]; a future verifier should pull 10+ verbatim spoken-first-line examples with timestamps from public posts.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-06-18 | v1→v2: pack_type, summary, §5 Playbook; link-tax re-cited to Ordinal (900K posts) + Jobanputra; comment-weighting to van der Blom; benchmarks to Socialinsider/Buffer; de-anonymized via agent web-verification (operator review pending). | agent |
| 2026-05-07 | Initial draft. 4 hook archetypes, 7-signal algorithm rank, format spec table, 10 anti-patterns, 6-row CTA placement matrix, 7 open questions. Pattern basis: internal research synthesis. | internal |
