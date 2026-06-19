<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: producthunt
schema_version: 2
pack_type: launch-channel
last_verified: 2026-06-16
verifier: hungv47
status: reviewed
source_basis: "Per-claim categorical citations inline (Product Hunt help docs + maker-cohort consensus + [pattern-derived]). PH does not publish its ranking formula; ranking claims are tagged secondary (maker-cohort) unless PH-stated."
summary: "Product Hunt launch-day playbook: a pinned first maker-comment + a 12:01 AM PT post + a pre-lined (never vote-ringed) support list drive first-4-hour upvote+comment velocity, which decides the daily Top-5 before noon PT."
---

# Platform Intelligence — Product Hunt (launch channel)

Practitioner-grade reference for **launching a product on Product Hunt** — consumed by
`plan-campaign`, `write-launch`, `publish-social`, and the launch chains to ground the launch-day
sequence, the leaderboard ranking signals, format compliance (tagline / gallery / first comment),
and the anti-patterns that get a launch throttled or removed. **Not generic "how to do a launch"
advice.** Every claim is distilled into an operating lever.

Product Hunt is a **launch-channel pack**, not a content-feed pack: the unit of work is a *launch
day*, not a *post*. The whole outcome is decided in a single 24-hour window (00:00–23:59
**Pacific Time**), and in practice the daily Top-5 is effectively locked by **first-4-hour velocity**
— so this pack is dominated by its **Playbook (§5)** and **Timing (§6)**, with hooks reframed as
**launch angles** (§1).

Two things every consuming skill must respect:

1. **You cannot ask for upvotes.** PH's guidelines prohibit soliciting votes ("please upvote").
   The entire playbook is engineered to *earn* velocity (notify, show, ask for feedback) without a
   single vote-ask — a vote-ask is both a rule violation and a downrank trigger (§4).
2. **The first maker comment is half the launch.** The pinned maker comment carries the story, the
   "why we built this," and the feedback ask. A launch without a strong first comment is half a
   launch — the analogue of "the tweet text is part of the hook" on X.

When this doc's `last_verified` exceeds 90 days, `validate-packs.ts` warns and the consuming critic
flags `DONE_WITH_CONCERNS` — PH periodically retunes ranking + anti-gaming, so re-verify before a
real launch. A Pro client is served the current pack from the freshness pipeline.

---

## 0. When NOT to Launch Here

> **Channel-fit veto.** `plan-campaign` reads this section as a real *"don't launch here."* When the
> campaign's product, ICP, goal, or growth motion matches a condition below, the channel is **vetoed**
> (skipped, with the cited reason) unless the operator records an explicit override. This is the
> marketer who says *no* — better an honest "wrong channel" than a doomed launch.

- **No working product people can use today** — PH expects a launchable thing, not a waitlist or teaser. Ship first, launch second.
- **Your ICP isn't on Product Hunt** — local/offline businesses, non-technical SMB buyers, or enterprise-procurement audiences don't browse PH; the upvotes won't convert.
- **Zero seed network** — no list, no peers, no co-makers to notify → no first-4-hour velocity, and PH is one-shot. Build the support list (§5 step 1) first, or skip.
- **Highly regulated / enterprise-only** product whose buyers aren't on PH and where a public launch adds compliance noise without pipeline.
- **The product isn't ready for scrutiny** — a weak launch burns the ~6-month relaunch window; wait until it holds up.

---

## 1. Launch Angles (Hook Taxonomy, reframed for a launch channel)

On a feed platform a hook stops the scroll; on PH the **angle** is the framing of the tagline +
thumbnail + first comment that earns the click into the product page and the upvote. Minimum 3
PH-native angles. These overlap the six base archetypes (`../hook-archetypes.md`) only in surface.

### Angle 1 — The "category killer" tagline (clarity > cleverness)

- **Definition:** The tagline states, in ≤60 chars, exactly what the product is and for whom, in
  the shape "[Category] for [audience/job]" — no metaphor, no wordplay. PH skimmers decide in <2s.
- **Identifying signal:** Tagline parses as a noun phrase a stranger could repeat; contains the
  category word; no "Notion but for X" unless the analogy is load-bearing.
- **Pattern examples A:** "Linear — The issue tracker built for modern software teams" — clear
  category + audience; the launch read as obvious-on-sight. [pattern-derived from PH Top-5 taglines]
- **Pattern examples B:** "Raycast — A blazingly fast, extensible launcher" — category ("launcher")
  + the one differentiator ("fast, extensible"). [pattern-derived]
- **Engagement-signal rationale:** PH's leaderboard is a dense list of competing taglines; comprehension
  speed drives the click-through that precedes the upvote. A clever-but-opaque tagline loses the skim.
- **Best for:** dev tools, B2B SaaS, anything in a known category. Default angle.

### Angle 2 — The founder-story first comment (the "why we built this")

- **Definition:** The *first comment* (not the tagline) carries a short, specific origin story — the
  problem the maker personally hit — ending in a concrete feedback ask, not a vote ask.
- **Identifying signal:** First comment is 80–150 words, first-person, names a real pain, pinned by
  the maker within 60s of going live, and ends "What would you want it to do next?" — never "upvote us."
- **Pattern examples A:** "I spent 3 years losing an hour a day to [X]. We built [product] so that
  hour comes back. It's rough in places — tell me where it breaks." [pattern-derived; the dominant
  Top-5 maker-comment shape]
- **Pattern examples B:** A solo-founder "I quit my job to fix [problem]; here's the v1" comment —
  the indie-maker variant that consistently out-engages a feature list. [pattern-derived]
- **Engagement-signal rationale:** Comments are a first-class ranking input (§3); a story invites
  *replies*, and a maker who answers every reply compounds comment velocity in the decisive first hours.
- **Best for:** founder/indie brand_mode, products with a genuine origin story. **Highest-leverage angle.**

### Angle 3 — The "show, don't tell" gallery (the demo GIF as the hook)

- **Definition:** The first gallery asset is an autoplaying demo GIF/loop that shows the core action
  in <6s, not a marketing splash. The product *is* the hook.
- **Identifying signal:** Gallery slot 1 = a screen-recorded loop of the actual product doing the
  one thing; no stock imagery, no logo-on-gradient hero as slot 1.
- **Pattern examples A:** A 4–6s loop: empty state → one action → result. [pattern-derived; PH
  galleries that lead with a working demo out-convert splash-led ones in maker-cohort reports]
- **Pattern examples B:** Side-by-side "before/after" loop for a tool that transforms something. [pattern-derived]
- **Engagement-signal rationale:** Dwell time on the product page (and the click into the gallery)
  correlates with conversion to upvote; a demo loop earns dwell that a static hero does not.
- **Best for:** visual products, tools with a satisfying core action, anything demoable in one screen.

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Prefer numeric.

| Constraint | Value | reference |
|---|---|---|
| Product name | ≤40 chars practical (no hard cap, but list truncates) | PH submit form |
| Tagline | **≤60 chars** (hard) | PH submit form |
| Description | ~260 chars recommended; first ~40 show in previews | PH help |
| Topics | up to **3** | PH submit form |
| Thumbnail | 240×240, simple logo/icon, legible at list size | PH help |
| Gallery images | **1270×760** (min 1, recommend 3–5); first is the cover | PH help |
| Gallery media | images + a YouTube/Vimeo video embed; demo GIF as slot 1 works | PH help |
| First comment | maker comment, pinned; 80–150 words | maker cohort |
| Makers | tag all co-makers (their networks notify) | PH help |
| Launch day | one product = one launch day; relaunch allowed after ~6 months/major change | PH help |
| Day boundary | **00:00–23:59 America/Los_Angeles (PT)**, year-round | PH (PT is the platform clock) |
| Promo offer | optional PH-exclusive deal/code (drives conversion + goodwill) | PH help |

PH-specific rows: there is **no link-out penalty** like Reddit (the product page IS the link); the
constraint that bites is the **PT day boundary** — launching at the wrong local time wastes runway (§6).

---

## 3. Ranking Signals (Ranked by Impact)

PH does **not** publish its formula; all weights below are maker-cohort consensus (secondary) unless
marked PH-stated. The leaderboard is velocity- and quality-weighted, with active anti-gaming.

1. **First-4-hour upvote velocity** — upvotes/hour relative to the day's cohort, weighted toward
   votes from **established accounts**. *Why:* the Top-5 cutoff is usually decided before noon PT;
   early momentum signals "real launch." *Lever:* concentrate your genuine support window into
   12:01–04:00 PT — notify your list to *check it out* (never "upvote"). *Tier:* secondary (cohort).
2. **Comment count + velocity (with maker replies)** — comments are a first-class input, and a maker
   who replies to every comment multiplies the thread. *Lever:* seed the founder-story first comment,
   then be present all day answering. *Tier:* secondary (cohort) / PH-stated that engagement matters.
3. **Vote quality / account age** — votes from new, zero-history, or clustered accounts are discounted
   or filtered (anti-gaming). *Lever:* reach real users with real accounts; never a vote ring. *Tier:* secondary.
4. **Maker + hunter network reach** — co-makers and a well-followed hunter notify followers, seeding
   step 1. The strict "hunter advantage" was reduced, but reach still seeds velocity. *Lever:* line up
   co-makers; a respected hunter helps but is optional. *Tier:* secondary.
5. **On-page engagement (dwell, gallery clicks, follows)** — time on the product page + gallery
   interaction correlate with conversion. *Lever:* the "show, don't tell" demo loop (Angle 3). *Tier:* secondary.
6. **Saves / follows / "I use this"** — secondary signals that PH surfaces; modest weight, real signal. *Tier:* secondary.

Cap interpretation at these ~6. Vote *count* alone is not the signal — **velocity × vote-quality** is.

---

## 4. Anti-Patterns

| Pattern | Penalty observed | Detection rule | Source |
|---|---|---|---|
| **Asking for upvotes** ("please upvote", "vote for us") | Guideline violation → comment/launch moderation; community backlash | Any copy (email, tweet, first comment) containing an upvote/vote ask | PH guidelines (primary) |
| **Vote rings / incentivized votes** (paying, vote-for-vote groups, "upvote and I'll upvote yours") | Votes filtered + launch downranked/removed; account risk | Clustered new-account votes; offering anything for a vote | PH guidelines (primary) |
| **Wrong-time launch** (posting mid-PT-day) | Wastes hours of the 24h runway; cohort already ahead | Submit timestamp not in the 00:00–02:00 PT window | maker cohort |
| **No maker presence** (post and ghost) | Comment velocity dies; reads as a drive-by | Maker has not replied to comments within the first hour | maker cohort |
| **Splash-hero gallery slot 1** (logo on gradient, no demo) | Lower page dwell → lower conversion | Gallery image 1 is not a product/demo frame | maker cohort |
| **Opaque/clever tagline** (>60 chars or pure wordplay) | Skim loses comprehension → fewer click-ins | Tagline lacks a category word or exceeds 60 chars | maker cohort |
| **Buying a "Top hunter" to hunt it** as the strategy | Diminished since the hunter-weight reduction; reads as gaming | Strategy leans on a paid hunter rather than real reach | maker cohort |

"Don't be spammy" is not an anti-pattern. "Any first-comment or notification copy containing the
string 'upvote' fails the check" is.

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic:** a pinned founder-story first comment + a 12:01 AM PT live time +
a pre-lined support list you notify (to *check it out*, never to upvote) — this concentrates
first-4-hour upvote **and** comment velocity, which is what decides the daily Top-5 before noon PT.

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | Build the support list | T−14d → T−1d | Collect emails/DMs of real users + peers who'd genuinely try it; build a PH "Coming soon"/ship page to gather subscribers. NO vote-ask language anywhere. | ≥50 people who'll get a launch-day "we're live, take a look" |
| 2 | Prep the assets | T−3d | Tagline ≤60 chars (Angle 1), 3 topics, thumbnail 240×240, gallery 1270×760 with a demo loop as slot 1 (Angle 3), description, optional PH-exclusive offer. | All assets pass §2; demo loop shows the core action in <6s |
| 3 | Draft the first comment | T−2d | 80–150-word founder story (Angle 2): the real problem, the "why we built it," ends in a feedback ask. Zero vote-ask. | Reads as a person, not a press release; ends in a question |
| 4 | Line up co-makers + (optional) hunter | T−2d | Tag all co-makers; if a respected hunter offers, accept — but the plan must not depend on one. | Co-makers ready to share to their networks at go-live |
| 5 | Go live at 12:01 AM PT | T−0 (00:01 PT) | Submit so the product is live at the start of the PT day for a full 24h runway. | Live and indexed before the cohort wakes |
| 6 | Pin the first comment | T+0:01 | Post + pin the founder-story comment within 60s. | Pinned, visible at top of the discussion |
| 7 | Notify the list | T+0:05 → T+04:00 | Email/DM/post: "We're live on Product Hunt — would love your honest take." Link the product page. **Never** "upvote." | A genuine-support burst inside the decisive 4-hour window |
| 8 | Be present all day | T+0 → T+12h | Reply to **every** comment within minutes; answer feedback substantively; thank, don't beg. | 100% comment reply rate in the first 6h |
| 9 | Cross-post (no vote-ask) | T+0 → T+all-day | Share to X/LinkedIn/relevant communities as "we launched," linking the page — framed as news, not a vote drive. | Reach beyond the list without a single vote-ask |
| 10 | Close + measure | T+24h | Capture rank, upvotes, comments, referral traffic, signups; write the result into `measure-results` → feeds the pack (U10). | Dated what-worked/what-failed entry; signup delta recorded |

This sequence is what the PH launch **chain** (U4) executes step-by-step, and what `write-launch` /
`publish-social` narrate ("running the Product Hunt 12:01 PT + first-comment playbook").

---

## 6. Timing & Cadence

- **Best post window:** product live at **00:01 AM Pacific Time** for the full 24-hour runway. PH's
  day is a hard PT boundary year-round; convert from your local zone before scheduling.
- **Decision window:** the daily Top-5 is, in practice, effectively decided by **~noon PT** —
  first-4-hour velocity (§3.1) dominates. The afternoon is for sustaining + comments, not catching up.
- **Day-of-week:** weekdays are higher-traffic and higher-competition; Tue–Thu are the contested
  slots. A quieter day (Sat/Sun) trades total traffic for an easier Top-5 — a deliberate trade, not a default.
- **Cadence:** a launch is a **one-shot** event per product (relaunch only after a major change,
  ~6-month norm). The compounding play is across *launches of different products / major versions*,
  fed by the metrics loop (U10) — not re-posting the same product.

---

## 7. CTA / Conversion Norms

The PH CTA is **never** a vote-ask. Conversion = click-in → page dwell → upvote/comment → signup.

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| First maker comment (feedback ask) | Pinned, story-led, ends in a question → drives replies | Reads as a vote-beg or a feature list | maker cohort |
| Notification copy ("we're live, take a look") | Frames as news + invites a genuine look | Contains "upvote/vote" → rule violation | PH guidelines |
| PH-exclusive offer (code/deal on the page) | Converts page visitors to signups + goodwill | Bait-and-switch or fake scarcity | maker cohort |
| Cross-post to X/LinkedIn (launch announcement) | "We launched [link]" as news; links the page | Disguised vote drive ("go upvote") | PH guidelines |
| In-product "We're on Product Hunt today" banner | Routes existing users to genuinely support | Auto-voting or incentivized | maker cohort |

---

## 8. Open Questions / Known Unknowns

- Product Hunt's exact ranking weights and anti-gaming thresholds are **not published** — all
  velocity/quality weights here are maker-cohort consensus, not a cited formula.
- The precise residual weight of a "Top hunter" after the hunter-advantage reduction is unclear;
  cohort reports range from "still meaningful reach" to "marginal."
- The first-4-hour-velocity → Top-5 claim is a strong practitioner heuristic, not a PH-published
  cutoff; the real cutoff varies by the day's cohort strength.
- Whether AI-product saturation (2025–26) has shifted PH's category mix / what wins is anecdotal; re-verify the cohort.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-06-16 | Initial pack to the v2 contract (first `launch-channel` pack; reference exemplar). | hungv47 |
