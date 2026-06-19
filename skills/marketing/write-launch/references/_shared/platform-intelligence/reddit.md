<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: reddit
schema_version: 2
pack_type: launch-channel
last_verified: 2026-06-16
verifier: hungv47
status: reviewed
source_basis: "Per-claim categorical citations inline (Reddit help/reddiquette + subreddit-rule patterns + maker-cohort consensus). Reddit's ranking ('hot') is time-decayed upvotes; exact weights unpublished — ranking claims tagged secondary."
summary: "Reddit launch playbook: value-first in the RIGHT subreddit, obey its rules + the 9:1 self-promo norm, disclose you're the founder, and earn first-hour upvotes + real comment threads — link-dropping gets you removed and banned."
---

# Platform Intelligence — Reddit (launch / distribution channel)

Practitioner-grade reference for **launching or distributing on Reddit** — consumed by
`plan-campaign`, `write-launch`, `publish-social`, and the launch chains. Reddit is a launch-channel
pack: the unit is *a post in a specific subreddit*, and the dominant variable is **fit between the
post and that subreddit's culture + rules** — get the sub wrong and even great content is removed.

Two non-negotiables every consuming skill must respect:

1. **Every subreddit is its own country.** Rules, tolerance for self-promotion, and tone vary wildly.
   The playbook is "read the specific sub's rules + top posts first," not a global recipe.
2. **Self-promotion is earned, not posted.** The reddiquette **9:1 rule** (≥90% non-promotional
   participation) and most subs' explicit rules mean a cold link-drop is removal + ban risk. You
   disclose you're the founder and lead with value.

When `last_verified` exceeds 90 days, the critic flags `DONE_WITH_CONCERNS` — subreddit rules + mod
climates shift; re-verify the target sub before posting.

---

## 0. When NOT to Launch Here

> **Channel-fit veto.** `plan-campaign` reads this section as a real *"don't launch here."* When the
> campaign's product, ICP, goal, or growth motion matches a condition below, the channel is **vetoed**
> (skipped, with the cited reason) unless the operator records an explicit override. This is the
> marketer who says *no* — better an honest "wrong channel" than a removal + ban.

- **No specific subreddit where your ICP gathers** — Reddit is sub-by-sub; no fitting sub = no channel.
- **You can't commit to genuine ongoing participation** — Reddit is a relationship; a drive-by promo is removed + ban risk (the 9:1 rule is real).
- **PR-only voice** — if you can't show up as a real, disclosed founder who absorbs criticism, skip it; Reddit rejects press-release tone.
- **The goal is a fast conversion blast** — Reddit punishes link-drops; it's a slow-trust channel, not a launch-spike one.
- **No account standing** and no time to build karma/age before the window — automod silently removes new/green accounts.

---

## 1. Launch Angles (Hook Taxonomy)

### Angle 1 — Value-first post (the build/teardown/lesson)

- **Definition:** A genuinely useful post (a teardown, a free tool, data, a hard-won lesson) where
  the product is mentioned as *context*, not the pitch. The value stands alone if the product link were removed.
- **Identifying signal:** Title is a value claim ("I analyzed 200 X and here's what I found"), body
  delivers before any mention; founder disclosure present; link (if any) is contextual, not the CTA.
- **Pattern examples A:** "I spent 6 months building [tool] to fix [problem] — here's the full
  teardown of what I learned (and the tool, free)." [pattern-derived; the dominant non-removed format]
- **Pattern examples B:** A data/research post in a niche sub where the product is the data source. [pattern-derived]
- **Engagement-signal rationale:** Reddit's hot algorithm rewards early upvotes + comments; a
  value-first post earns both because it doesn't trip the community's promo immune system.
- **Best for:** founder mode, technical/niche subs, products with a real story or dataset.

### Angle 2 — The transparent founder ask (feedback / "roast my X")

- **Definition:** Explicitly labelled self-post asking the community for feedback, in a sub that
  *permits* it (e.g., a "Feedback Friday" thread, r/SideProject, r/startups self-promo days).
- **Identifying signal:** Posted in an allowed thread/sub; title says "feedback"/"roast"; founder
  fully disclosed; genuine willingness to hear criticism (and reply to it).
- **Pattern examples A:** "Roast my landing page — [link]. I'll fix the worst thing you find." [pattern-derived]
- **Engagement-signal rationale:** Invites comments (the second ranking input) and respects the
  sub's promo rules, so it isn't removed.
- **Best for:** early products, indie/maker subs with explicit feedback channels.

### Angle 3 — The AMA / expertise drop

- **Definition:** Posting as a credible practitioner answering questions or sharing deep expertise;
  the product surfaces only when directly relevant to an answer.
- **Identifying signal:** Demonstrated expertise; high comment-reply rate; product mentioned reactively.
- **Pattern examples A:** "I've shipped 12 products on [platform]. AMA about [niche]." [pattern-derived]
- **Engagement-signal rationale:** Maximizes the comment-thread signal; builds the karma + trust that
  make later, more direct posts acceptable.
- **Best for:** founders with genuine domain authority; long-game distribution.

---

## 2. Format Constraints

| Constraint | Value | reference |
|---|---|---|
| Title length | ≤300 chars (aim ≤100 for readability) | Reddit |
| Self-post vs link-post | self-post (text) ranks better for discussion; many subs ban link-posts | reddiquette / sub rules |
| Post type per sub | check each sub's allowed types (text/link/image/video/poll) | sub rules |
| Self-promo ratio | **9:1** non-promo to promo participation | reddiquette |
| Account gates | many subs require min karma + account age | sub automod |
| Flair | required in many subs (post is auto-removed without it) | sub rules |
| Crossposting | allowed but per-sub; can read as spam if blanketed | sub rules |
| Links in body | fine in value-first context; never the whole post | reddiquette |

The constraint that bites: **per-subreddit automod rules** (karma/age/flair) silently remove posts —
read the sub's rules + check a throwaway-free account's standing before launch.

---

## 3. Ranking Signals (Ranked by Impact)

1. **First-hour upvote velocity** — Reddit's "hot" sort is time-decayed; early upvotes compound.
   *Lever:* post when the target sub is active (§6); make the title earn the upvote. *Tier:* secondary.
2. **Comment count + depth** — real discussion signals quality + keeps the post in "hot." *Lever:*
   ask a genuine question; reply to every comment fast. *Tier:* secondary.
3. **Upvote ratio** — a post downvoted as spam dies regardless of count. *Lever:* fit the sub's
   culture; disclose; don't pitch. *Tier:* secondary.
4. **Subreddit fit + mod approval** — automod/mod removal is binary. *Lever:* obey rules, flair,
   karma gates. *Tier:* primary (sub-stated rules).
5. **Account trust (karma + age)** — gates posting and weights votes against spam. *Lever:* build
   genuine karma before launching. *Tier:* secondary.

---

## 4. Anti-Patterns

| Pattern | Penalty | Detection | Source |
|---|---|---|---|
| Cold link-drop / pure promo | removed + ban; downvoted as spam | post is the link + a pitch, no value, no disclosure | reddiquette / sub rules |
| Ignoring the sub's rules (flair/karma/type) | silent automod removal | post type/flair/account fails the sub's rules | sub automod |
| Astroturfing / vote manipulation | sitewide ban (against Reddit ToU) | coordinated votes, sockpuppets, "upvote my post" asks | Reddit ToU (primary) |
| Blanket crossposting to many subs | spam flag; multiple removals | same post to >2–3 subs at once | reddiquette |
| Undisclosed founder | community backlash when discovered | promoting own product without saying so | reddiquette |
| Defensive replies to criticism | thread turns, post downvoted | arguing with feedback instead of absorbing it | maker cohort |

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic:** pick the ONE right subreddit, obey its rules to the letter, disclose
you're the founder, and lead with standalone value — first-hour upvotes + a real comment thread win
Reddit; a link-drop loses it (removal + ban).

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | Find the right sub(s) | T−14d | Identify 1–2 subs where your ICP actually is; read top-month posts + the full rules. | A sub whose top posts look like what you'll post |
| 2 | Build standing | T−14d → T−2d | Participate genuinely (comment, help) to clear karma/age gates and learn the tone. | Account meets the sub's automod gates |
| 3 | Pick the allowed lane | T−2d | Self-promo day? Feedback thread? Value-post? Match the sub's permitted format + flair. | The lane that won't be auto-removed |
| 4 | Write value-first | T−1d | Lead with the teardown/data/lesson; disclose founder; link contextual, not the CTA. | Value stands if the link were removed |
| 5 | Post at peak | T−0 | Post when the sub is active (§6); correct flair; self-post for discussion. | Live, not auto-removed, flaired |
| 6 | Engage hard, first hour | T+0 → T+2h | Reply to every comment within minutes; absorb criticism; never argue. | 100% comment reply rate; positive ratio |
| 7 | Don't blanket-post | T+0 → T+all | One sub at a time; if crossposting, space it + tailor. | No spam flags |
| 8 | Measure + feed the pack | T+24h | Record upvotes/ratio/comments/referral signups → `/measure-results`. | Dated entry → next Reddit post compounds |

---

## 6. Timing & Cadence

- **Best window:** weekday mornings in the sub's dominant timezone (US-centric subs ≈ 6–9am ET) to
  ride the day's upvote cycle. Verify per sub (some niches peak evenings/weekends).
- **Decision window:** the first ~1–2 hours decide whether "hot" carries the post; a slow start is hard to recover.
- **Cadence:** Reddit is a **relationship**, not a one-shot — sustained genuine participation in a
  few subs beats a single launch blast. Promo posts are rare events within ongoing presence.

---

## 7. CTA / Conversion Norms

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| Contextual link in a value post | the value earned the click | the link IS the post | reddiquette |
| "Feedback welcome — [link]" in an allowed thread | sub permits it; genuine ask | posted in a no-promo sub | sub rules |
| Comment reply with the link (reactive) | someone asked / it's directly relevant | dropped unprompted into unrelated threads | reddiquette |
| Profile / pinned post | passive discovery for trusted accounts | relied on as the main channel | maker cohort |

---

## 8. Open Questions / Known Unknowns

- Reddit's exact "hot"/"best" ranking weights are unpublished; first-hour-velocity is a heuristic, not a cited formula.
- Per-subreddit mod tolerance for founder self-promo varies and changes with mod turnover — must be re-checked per sub, per launch.
- The real karma/age automod thresholds are hidden per sub; "build standing first" is the safe heuristic.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-06-16 | Initial pack to the v2 contract (launch-channel). | hungv47 |
