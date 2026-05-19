<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

---
type: platform-intelligence
platform: linkedin
schema_version: 1
last_verified: 2026-05-08
verifier: internal
source_basis: "Internal research synthesis; raw source ledger intentionally omitted from public skill package."
status: draft
---

# Platform Intelligence — LinkedIn (Native Video)

Practitioner-grade reference consumed by `short-form-brief` (and downstream surface-specific copy skills) to ground hooks, format compliance, algorithm fit, and anti-pattern checks for LinkedIn native video posts. **Not generic marketing advice.** Every claim is distilled into internal operating guidance.

When this doc's `last_verified` exceeds 90 days, the consuming critic flags `DONE_WITH_CONCERNS` with "platform signal may be stale — verify before publishing."

Scope: native video uploaded directly to LinkedIn (personal profile or Company Page). Excludes: live broadcasts, LinkedIn Learning, Sales Navigator video messaging, paid Video Ads (covered separately under "Video Ads" rows in §2 where they diverge from organic).

---

## 1. Hook Taxonomy

LinkedIn video hooks operate under a constraint no other short-form platform shares: the **caption first line carries equal hook weight to the visual hook**, because the post body sits *above* the autoplay video in the feed and is the first thing the eye lands on. This produces archetypes that don't map cleanly onto TikTok/Reels.

Six base archetypes are defined in `../hook-archetypes.md` (Credential flash, Pattern interrupt, Question, Pre-reveal tease, Contrarian claim, Data point). The three below are LinkedIn-native variants that meaningfully reframe those bases for the feed-with-truncated-caption surface.

### Archetype 1 — Caption-first credential drop (text-leads-video)

- **Definition:** The caption first line states a credential or outcome so strong it earns the click on "...more"; the video then *delivers* the story behind it. Visual hook is secondary.
- **Identifying signal:** First-line of post body is ≤210 characters, contains a specific number or named outcome, and the video opens with the speaker mid-context (no "Hi everyone" preamble — the caption did the framing).

- **Pattern examples B:** "LinkedIn writing tip I use to create 'viral' content: (And it's not writing better hooks)" — practitioner source, 2024-01-23, [post]([internal research source]) — engagement: 1,595 likes / 694 comments.
- **Engagement-signal rationale:** Caption first lines that earn the "...more" click drive dwell time before the video starts playing — and dwell time is LinkedIn's stated primary engagement-quality signal. a third-party benchmark's 3M-post sample finds posts with ≥20-sentence captions hit 1.13× median reach vs. 0.73× for captions under 5 sentences.
- **Best for:** founder personal brand, B2B thought leadership, recruiter content, niches where credibility is the buying lever.

### Archetype 2 — Vulnerability lede (status-inversion hook)

- **Definition:** First spoken line / first caption line admits a failure, a confusion, or a status drop — which is rare on LinkedIn's default "polished professional" surface and creates an immediate pattern interrupt for a feed otherwise saturated with brag posts.
- **Identifying signal:** First-person ("I", "my") + a negative or counter-status word (lost, fired, failed, wrong, embarrassed, confused) within the first 8 words of caption OR within the first 2 seconds of spoken audio.
- **Pattern examples A:** "Losing my job was the best thing that ever happened to me." — practitioner-archive example cited as LinkedIn viral hook by a third-party benchmark.
- **Pattern examples B:** "On Monday, I sat down to write my week of posts… but my inspiration, energy, and motivation was ZERO." — practitioner-archive viral example.
- **Engagement-signal rationale:** LinkedIn's default professional register makes vulnerability a measurable pattern interrupt — viewers stop to verify the claim, which lifts the 3-second autoplay completion rate and feeds dwell time. Just Connecting / a third-party benchmark 2025 report attributes ~50% of organic-reach decline to a shift away from "vanity reactions" toward meaningful comments, and vulnerability hooks reliably surface comment threads.
- **Best for:** founder mode, career-pivot content, lessons-learned posts, post-failure case studies. Avoid in company-mode brand voice — reads as performative.

### Archetype 3 — Process-tease frame ("Here's how I…" / "Watch this in 60s")

- **Definition:** Caption + opening visual together promise a defined deliverable inside a defined runtime ("How I cut churn 22% in 90 days — 60-second walkthrough"), which converts the post from "talking head" to "watchable explainer." Length is *promised*, not just performed.
- **Identifying signal:** Caption first line contains (a) a numeric outcome, (b) a time frame ("in 90 days", "in 60s"), and (c) a process verb ("how I", "the way we", "step by step"). Video opens with on-screen text restating the deliverable.
- **Pattern examples A:** "How I" framing — Lara Acosta's documented advice: "Use 'How I' instead of 'How to'" because it adds personal proof and stops the scroll on a self-improvement-saturated feed.
- **Pattern examples B:** Hook template family: "I made one change to my outbound strategy and doubled my reply rate" — practitioner template cited by a third-party benchmark as a top-performing video caption hook.
- **Engagement-signal rationale:** Promised-runtime hooks reduce *perceived* time cost, which is the friction LinkedIn's autoplay specifically tests — viewers commit to a 60-second watch when the caption sets that expectation, lifting both retention and the 50% checkpoint that a third-party benchmark flags as the algorithm's mid-video health signal. Promised-outcome hooks also generate higher save rates; saves drive ~5× the reach of likes.
- **Best for:** SaaS demos, agency case studies, recruiting "day in the life" videos, BD/sales tactical breakdowns.

### Archetype 4 — Contrarian-to-LinkedIn-orthodoxy hook

- **Definition:** First line directly attacks a piece of common LinkedIn advice ("Stop posting daily", "Hooks don't matter", "Networking is overrated"), forcing viewers to either defend or update.
- **Identifying signal:** Imperative + anti-platform-orthodoxy claim in first 10 words; OR "Everyone says X. They're wrong." structure. Video proceeds to argue the contrarian case with one counter-example.

- **Pattern examples B:** "(And it's not writing better hooks)" — Lara Acosta's parenthetical rehook on the same post family, denying the conventional answer to set up the real one.
- **Engagement-signal rationale:** Contrarian hooks generate "indirect comments" — comments that dispute or refine the claim — which a third-party benchmark 2025 cohort and a third-party benchmark both rank as the most algorithmically-rewarded comment type. a third-party benchmark reports posts with indirect comments see up to **2.4× more reach** than baseline. Contrarian-to-orthodoxy hooks specifically engineer for that comment shape.
- **Best for:** creator economy, marketing/ops/RevOps niches, B2B founder voice. Avoid for risk-averse enterprise brands and regulated industries — invites brand-damaging dispute.

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Numeric over prose.

| Constraint | Value | reference |
|---|---|---|
| Duration sweet spot — talking heads | 30–90 seconds | internal |
| Duration sweet spot — long-form | Videos >3 min get 21% more reach + 17% more engagement than format-average | internal |
| Duration hard cap (Pages, organic) | 10 minutes | internal |
| Duration hard cap (mobile upload) | 10 minutes | internal |
| Duration hard cap (desktop upload) | 15 minutes (some practitioner sources); LinkedIn Help formal cap is 10 minutes | internal |
| Duration min | 3 seconds | internal |
| Duration sweet spot (Video Ads) | 15–30 seconds qualifies for all placements; <15s for top performers | internal |
| Aspect ratio (recommended for feed) | 1:1 (1080×1080) or 4:5 (1080×1350) — vertical/square outperforms 16:9 in mobile feed | internal |
| Aspect ratio range supported | 1:2.4 to 2.4:1 | internal |
| Resolution range | 256×144 to 4096×2304 | internal |
| Resolution recommended | 1080p (1080×1080 / 1080×1350 / 1920×1080 / 1080×1920) | internal |
| File size (organic Pages) | 75 KB – 5 GB | internal |
| File size (Video Ads) | 75 KB – 500 MB | internal |
| File format | MP4, WebM, MKV, WMV2/3, ASF, FLV, MPEG-1/4, VP8/9 (Pages); MP4 only (Video Ads) | internal, internal |
| Frame rate | 10–60 FPS (organic); <30 FPS (Video Ads) | internal, internal |
| Caption (post body) hard limit | 3,000 characters | internal |
| Caption truncation point ("...more") | **210 characters** on desktop feed; varies 140–210 across sources, 210 is the most-cited 2025–2026 figure. Critic should treat **first 210 chars as the visible hook surface.** | internal, internal |
| Headline char limit (Video Ads) | 70 characters recommended (200 hard) — truncates on most devices past 70 | internal |
| Burned-in caption requirement | Effectively required: ~80% of LinkedIn video is watched on mute (LinkedIn autoplays muted by default; industry-standard mute-viewing stat) | internal |
| Hashtag norm | 3–5 in post body; >3 hashtags shows slight reach drag in a third-party benchmark cohort, but impact is "negligible" overall | internal |
| Cover/thumbnail | Custom thumbnail recommended; LinkedIn auto-pulls a frame if not set. No formal "cover ratio" — uses the video's first frame at chosen aspect | internal |
| Audio handling | Auto-mute on autoplay; sound only on user-initiated play. Burned subtitles required to convey message in mute preview | internal |
| Autoplay preview length | ~3 seconds before "Continue watching" prompt or scroll-past | internal |
|.SRT caption upload | Supported; LinkedIn renders as native captions toggleable by viewer | internal |
| External link in post body | Reduces median reach **18.8%** (a third-party benchmark 1.3M-post 2025 sample); a third-party benchmark/cohort range 25–40%; some 2026 cohort data found multi-link posts outperformed (attributed to confound: link-heavy posts often higher quality). Treat single external link as a 18–35% reach tax. | internal, internal |
| Post-comment link | Standard workaround; no measured penalty when link is in first comment instead of post body | internal |
| First-3-line preview | Mobile feed shows ~3 lines (~140–210 chars) before "...more" — same surface as truncation cap | internal |

---

## 3. Algorithm Signals (Ranked by Impact)

Capped at top 7. Ranked by impact based on cross-referenced primary + internal sources.

1. **Dwell time** — total seconds the viewer spent on the post before scrolling. *Why:* LinkedIn Engineering's 2024 post explicitly names dwell time as a top quality signal and details how they replaced the static `Tskip` threshold with adaptive percentile-based normalization specifically to avoid biasing toward long-video formats. *Lever:* spec a caption first line ≤210 chars that earns the "...more" click (caption read time = pre-video dwell), plus a 0–3s visual hook so the autoplay preview clears the dwell threshold. *Tier:* primary.

2. **Indirect comments / comment quality** — comments that engage with the post idea (vs. tagged-friend or "great post!" replies). *Why:* a third-party benchmark reports posts with indirect comments see up to 2.4× reach vs. baseline; comments are weighted ~2× likes in LinkedIn's initial test phase. a third-party benchmark 2025 cohort attributes ~50% of recent organic-reach decline to LinkedIn deprioritizing "vanity reactions" in favor of meaningful comments. *Lever:* end the video with a specific debate-able prompt; spec a contrarian or vulnerability hook (Archetype 2 or 4) that produces dispute or expansion comments rather than agreement. *Tier:* secondary (cohort-derived; LinkedIn has not published the weighting publicly).

3. **First-60-minute engagement velocity (Initial Classification)** — likes, comments, dwell within the first hour. *Why:* a third-party benchmark documents a 0–60min "Initial Classification" phase that gates whether the post enters Extended Distribution; 1–2 hours is the "Engagement Testing" window that determines reach ceiling. *Lever:* publish at the time the creator's audience is online; avoid scheduling tools that historically signaled lower trust (no longer a hard penalty per a third-party benchmark 2025); seed with a comment from the author within minutes of publishing. *Tier:* secondary.

4. **Saves** — viewer hits the save bookmark. *Why:* a third-party benchmark reports saves drive ~5× more reach than likes and a 130% higher follow probability for saved content. *Lever:* spec the video deliverable as save-worthy reference material — frameworks, checklists, before/after comparisons. Process-tease hooks (Archetype 3) over-index on saves vs. vulnerability hooks. *Tier:* secondary.

5. **Native vs. external-link signal** — does the post keep users on platform. *Why:* a third-party benchmark 1.3M-post 2025 sample finds one external link in the post body reduces median reach 18.8% ; cohort range across studies is 18–40%. LinkedIn's 360Brew LLM-based ranking system, rolled out 2025–2026, doubles down on platform-retention signals. *Lever:* publish video natively (never as a YouTube link); put any external CTA link in the first comment, not the post body. *Tier:* primary (LinkedIn has publicly stated native preference) + secondary (penalty magnitude is cohort-derived).

6. **Topic / authority signal (creator graph relevance)** — LinkedIn matches video to viewers based on creator's topic history and viewer's professional graph. *Why:* a third-party benchmark 2025 report and LinkedIn's stated 2026 algorithm direction both emphasize "topic relevance" and "authority signals" over raw engagement counts; the 360Brew LLM ranks based on professional-fit semantic match. *Lever:* keep videos clustered around 2–3 topic pillars; spec keyword-rich on-screen text and caption phrasing that matches the creator's established niche vocabulary. *Tier:* primary (LinkedIn product comms) + secondary (a third-party benchmark cohort).

7. **Caption depth (sentence count)** — long, structured captions correlate with reach uplift. *Why:* a third-party benchmark's 3M-post sample: 20+ sentence captions hit 1.13× median reach vs. 0.73× for <5-sentence captions. Hypothesized mechanism: longer captions extend pre-video dwell time, feeding signal #1. *Lever:* ship the video with a 15–25 sentence caption that tells the same story in text — many viewers consume the caption *instead of* the video and still count as engaged dwell. *Tier:* secondary.

---

## 4. Anti-Patterns

Specific patterns the algorithm penalizes or audiences punish on LinkedIn video. Each entry includes a detection rule a critic agent can apply.

- **Pattern:** External link in post body (YouTube/blog/landing page).
 **Penalty observed:** 18–40% median reach reduction (a third-party benchmark 2025: 18.8%; cohort range 25–40%).
 **Detection rule:** Caption contains `http(s)://` or recognizable domain pattern outside `linkedin.com`.
 **Pattern basis:** internal research synthesis.

- **Pattern:** YouTube-link share posing as native video.
 **Penalty observed:** Treated as external link; loses autoplay preview entirely; reach degraded vs. native upload.
 **Detection rule:** Brief specifies "share YouTube link" or "embed video URL" without native upload step.
 **Pattern basis:** internal research synthesis.

- **Pattern:** No burned-in subtitles / no.SRT.
 **Penalty observed:** ~80% of LinkedIn video is watched on mute due to autoplay-muted default; without subtitles, the message doesn't land in the 3s preview, killing dwell-time signal.
 **Detection rule:** Brief omits "burned subtitles" OR "uploaded.SRT" in production spec.
 **Pattern basis:** internal research synthesis.

- **Pattern:** "Hi everyone, today I want to talk about…" preamble in first 3 seconds.
 **Penalty observed:** Audience drop-off at 0:03 — viewers scroll past before the preview ends. a third-party benchmark: "If most viewers drop off in the first 10 seconds, your hook isn't working".
 **Detection rule:** First spoken line is a greeting or self-introduction; first 2 seconds contain no claim, number, or specific outcome.
 **Pattern basis:** internal research synthesis.

- **Pattern:** Caption first line is generic ("Excited to share this video about…").
 **Penalty observed:** Fails to earn the "...more" click → reduced pre-video dwell → algorithm reads as low-quality.
 **Detection rule:** First 210 chars of caption contain none of: a specific number, a named outcome, a question, a credential statement, a contrarian claim. (Critic should fail any caption that opens with "I'm excited to" / "Today I'm sharing" / "Check out my new video" patterns.)
 **Pattern basis:** internal research synthesis.

- **Pattern:** Hashtag stuffing (>5 hashtags).
 **Penalty observed:** Negligible-to-mild reach drag per a third-party benchmark; not a hard penalty but consumes valuable first-210-char surface.
 **Detection rule:** >5 hashtags in caption, or hashtags placed in the first 210 characters.
 **Pattern basis:** internal research synthesis.

- **Pattern:** Tagging unrelated high-follower accounts.
 **Penalty observed:** Reach reduction when tagged accounts don't engage; LinkedIn 2025 tightened anti-spam handling around irrelevant tagging.
 **Detection rule:** Brief specifies "practitioner source X creators" without relationship/relevance justification.
 **Pattern basis:** internal research synthesis.

- **Pattern:** Naked sales-pitch CTA inside the video ("DM me to book a call" with no proof or specificity).
 **Penalty observed:** Audience punishment via low save/comment rate, not algorithmic — but second-order signal degrades reach over the 0–60min Initial Classification window.
 **Detection rule:** CTA is a generic ask without a deliverable, named offer, or specific next action.
 **Pattern basis:** internal research synthesis.

- **Pattern:** Re-uploaded TikTok with visible TikTok watermark.
 **Penalty observed:** No formal LinkedIn statement, but practitioner consensus is significant reach drag — the watermark signals off-platform-origin which 360Brew's platform-retention objective deprioritizes.
 **Detection rule:** Brief specifies cross-posting from TikTok without watermark removal step.
 **Pattern basis:** internal research synthesis.

- **Pattern:** Video >10 minutes uploaded via mobile (silent failure).
 **Penalty observed:** Upload rejected outright.
 **Detection rule:** Duration spec >10:00 paired with mobile-upload production path.
 **Pattern basis:** internal research synthesis.

---

## 5. Hook Window + Retention Curve

- **First-second goal (0–1s):** Visual must convey *what kind of video this is* — face-cam vs. screen-share vs. b-roll story — and the burned subtitle must show the first 3–5 words of a specific claim. a third-party benchmark: "short clips under 90 seconds with a face visible in the first four seconds do better than everything else".

- **Autoplay preview window (0–3s):** LinkedIn autoplays the video silent for ~3 seconds before showing a "Continue watching" prompt or letting the user scroll past. The 3s preview is the hard gate — if dwell time falls below the percentile threshold LinkedIn uses to classify "skipped" , the post is downranked.

- **Critical drop-off point:** 0:10. a third-party benchmark: "If most viewers drop off in the first 10 seconds, your hook isn't working". Practitioner consensus: post-3s gate, 0:10 is the next inflection — viewers either commit to the watch or peel off here.

- **Mid-video health checkpoint:** 50% retention. LinkedIn surfaces dropoff data at 25/50/75/100% in creator analytics. a third-party benchmark: "if they drop at 50%, your video is too long or loses focus mid-way". Treat 50% retention as the lever for whether the next video should be cut shorter.

- **Loop / replay behavior:** LinkedIn does *not* loop video by default (unlike TikTok/Reels); a single play-through is the default unit. Replay does count toward dwell time but is rare. Brief should not optimize for loop-friendly final frames.

- **Dwell time threshold debate:** LinkedIn explicitly abandoned its static `Tskip` threshold in favor of an adaptive, percentile-based dwell-time normalization that compares each post against "a specific percentage (x%) of its counterparts". Practitioner sources uses 6s as a folk threshold for "qualified view"; LinkedIn has not confirmed this number publicly. **Treat dwell as relative-rank, not absolute-seconds.** A 6s dwell on a long-form post is a skip; a 4s dwell on a short clip might be a strong signal.

---

## 6. CTA Placement Norms

The link-in-post vs. link-in-comment debate is the longest-running operator-level dispute on LinkedIn. The cohort data is mixed but converges on: **don't put the only link in the post body if reach is the primary goal.**

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| Link in first comment (creator-pinned) | Default for organic reach optimization. Caption references "link in comments" overtly. Works because the post body stays link-free, avoiding the 18–40% link reach tax. | When the comment isn't pinned, mobile users miss it (comments collapse below the fold). | internal, internal |
| Link in post body (in caption) | Works for paid Video Ads (no organic algorithm penalty applies). Works for posts where conversion >> reach (e.g., job-board posts where reach beyond audience is wasted). | Default-fail for organic content optimizing reach: 18.8% median reach drop per a third-party benchmark 1.3M-post sample. | internal |
| Verbal CTA at end of video (no link) | Works when the CTA is "comment with X" or "follow for the next part" — drives the indirect-comment + follow signals the algorithm rewards. | Fails for direct conversion goals (no measurable click path); only suitable for top-funnel awareness. | internal |
| On-screen text CTA at 0:50–1:00 | Works as a complement to verbal CTA; reinforces the action when audio is muted (~80% of viewers). | Fails when burned in too early (≤0:15) — competes with the hook for attention and lowers retention. | internal |
| Bio / Featured section link | Works as evergreen anchor for high-intent traffic. LinkedIn's "Featured" section links survive every algorithm update and don't compete with post-level reach. | Fails as a post-specific CTA — viewers won't navigate to profile from feed; only the mid-funnel re-visiters click bio links. | internal |
| "DM me" CTA | Works for high-trust/high-ticket B2B with established personal brand (post engages, viewer self-selects, conversation starts). | Fails when used as default-CTA on every post — reads as transactional, lowers comment quality, and is the prototypical "naked sales pitch" anti-pattern. | internal |

---

## 7. Open Questions / Known Unknowns

- **Dwell-time threshold for "qualified view" on LinkedIn:** unstated by platform; LinkedIn explicitly uses adaptive percentiles, not a fixed seconds value. Practitioner folk-figure of 6s is unsourced. Cohort study with measured dwell-to-reach correlation by video length is missing.
- **Caption truncation char count:** sources uses 140 characters (older), 210 characters (most 2025–2026), and "first 3 lines" (mobile-relative). LinkedIn has not published an official figure. The 210 number is dominant in current cohort sources but was not directly confirmed by LinkedIn in any document found.
- **External-link reach penalty magnitude:** range 18–40% across cohorts (a third-party benchmark 2025: 18.8%; a third-party benchmark/GrowLeads: 25–40%). Q1 2026 analysis found multi-link posts outperformed link-free posts (likely confound: link-heavy posts skew higher quality), suggesting the penalty is moderating or topic-conditional. Net direction is clear (negative); magnitude is not.
- **360Brew LLM ranking weights:** LinkedIn announced LLM-based ranking via 360Brew through 2025–2026 , but no detailed signal weights or features are public. All §3 weights are pre-360Brew cohort observations and may decay faster than typical platform-doc claims.
- **Video reach decline mechanism:** a third-party benchmark 2026 cohort: video reach −36% YoY, engagement −26%. LinkedIn-stated: video uploads +45%, video viewership +36% YoY — the same data viewed from supply vs. demand sides. Open question: is per-video reach down because supply outpaced demand, or because LinkedIn rebalanced format weighting toward documents (1.45×) and polls (1.64×) ? This determines whether videos should slow production or compete harder.
- **Mobile vs. desktop watch-time split:** Just Connecting cited 72% mobile share but no per-format breakdown. Whether desktop viewers (sound-on, larger screen) clear the dwell threshold differently than mobile viewers (sound-off, autoplay) is not separately measured in any public cohort.
- **Subtitle compliance auto-detection:** No public data on whether LinkedIn algorithmically detects burned-in subtitles vs. uploaded.SRT files and weights them differently. Practitioner consensus is to do both; the marginal value of one over the other is unmeasured.
- **Verbatim hook examples for video specifically:** Most cited "viral LinkedIn hook" archives are text-post hooks. Public archives of *video-post* opening lines with engagement metrics are thin — most §1 examples are caption-first lines from posts that included video, not transcribed first lines from the video itself. A future verifier should pull 10+ verbatim spoken-first-line examples with timestamps from public posts.

---

## 8. Changelog

| Date | Change | By |
|---|---|---|
| 2026-05-07 | Initial draft. 4 hook archetypes, 7-signal algorithm rank, format spec table, 10 anti-patterns, 6-row CTA placement matrix, 7 open questions. Pattern basis: internal research synthesis.
