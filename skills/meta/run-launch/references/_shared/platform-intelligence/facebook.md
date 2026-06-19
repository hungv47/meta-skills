<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: facebook
schema_version: 2
pack_type: launch-channel
last_verified: 2026-06-16
verifier: hungv47
status: reviewed
source_basis: "Per-claim categorical citations inline (Meta Business/transparency docs + practitioner-cohort consensus). Feed ranking ('meaningful social interactions') is Meta-stated directionally; exact weights unpublished — tagged secondary unless Meta-stated."
summary: "Facebook launch playbook: organic reach lives in the right Groups, not the Page feed — native video + comment-earning posts win 'meaningful social interactions'; an external link in the primary text pays a reach tax (put it in the first comment)."
---

# Platform Intelligence — Facebook (launch / distribution channel)

Practitioner-grade reference for **launching or distributing on Facebook** — consumed by
`plan-campaign`, `write-social`, `publish-social`, and the launch chains. Organic **Page** reach is
structurally low; the live distribution surface is **Groups** + native video + posts engineered for
*comments*, not likes. Treat Facebook as a community channel, not a broadcast one.

Two things every consuming skill must respect:

1. **Reach lives in Groups, not the Page feed.** A cold Page post reaches a few % of followers.
   Relevant, active Groups (where your ICP already gathers) are where organic launch reach is real —
   but every Group has rules + a no-spam culture (the Reddit lesson applies).
2. **External links pay a reach tax.** Like LinkedIn, a link in the primary post text suppresses
   distribution; native content (video, image, text) ranks, and the link goes in the **first comment**.

When `last_verified` exceeds 90 days, the critic flags `DONE_WITH_CONCERNS` — Meta retunes feed
ranking often; re-verify before a real launch.

---

## 0. When NOT to Launch Here

> **Channel-fit veto.** `plan-campaign` reads this section as a real *"don't launch here."* When the
> campaign's product, ICP, goal, or growth motion matches a condition below, the channel is **vetoed**
> (skipped, with the cited reason) unless the operator records an explicit override. This is the
> marketer who says *no*.

- **B2B / developer / early-adopter audience** that lives on LinkedIn / X / HN, not Facebook.
- **No relevant Group** to post in and no standing to earn one — Page-feed organic reach is structurally near-dead.
- **Pure brand-awareness goal with no community angle** / no shareable, comment-earning payoff.
- **Gen-Z / younger audience** who have largely left Facebook.
- **You expect Page-post organic reach with no paid budget** — FB organic underdelivers without spend; route brand-awareness to paid or another channel.

---

## 1. Launch Angles (Hook Taxonomy)

### Angle 1 — Native video story (the demo/founder clip)

- **Definition:** A short native-uploaded video (not a YouTube link) telling the product story or
  showing the core action; captioned for sound-off; opens in <3s.
- **Identifying signal:** Uploaded directly to FB; burned-in captions; vertical/square; hook in frame 1.
- **Pattern examples A:** A 30–60s founder "here's what we built and why" with captions. [pattern-derived]
- **Engagement-signal rationale:** Native video gets watch-time distribution Page links never do.
- **Best for:** founder mode, visual products, Group posts that allow video.

### Angle 2 — The comment-earning question (community post)

- **Definition:** A post in a relevant Group that asks a genuine question your product answers, sparking
  discussion; product surfaces in the thread, not the post.
- **Identifying signal:** Question-shaped; posted in an allowed Group; founder disclosed; replies actively.
- **Pattern examples A:** "What's the one tool you wish existed for [niche]? (building in this space, curious)" [pattern-derived]
- **Engagement-signal rationale:** Comments are the top "meaningful social interaction" signal; a
  question maximizes them and respects Group culture.
- **Best for:** Group distribution, early audience-building.

### Angle 3 — The shareable resource (value post)

- **Definition:** A genuinely useful free resource (guide, template, data) posted natively; the share
  is the distribution mechanism.
- **Identifying signal:** Standalone value; designed to be shared; link in first comment.
- **Engagement-signal rationale:** Shares weight heavily; a resource people forward extends reach past your network.
- **Best for:** lead-gen, top-of-funnel awareness.

---

## 2. Format Constraints

| Constraint | Value | reference |
|---|---|---|
| Primary text | ~63k char cap; first ~125 chars show before "See more" | Meta |
| External link placement | **first comment**, not primary text (reach tax) | practitioner cohort |
| Native video | upload directly; 1:1 or 4:5 for feed, 9:16 for Reels/Stories | Meta |
| Caption/sound | burned-in captions (sound-off default) | practitioner cohort |
| Image | 1200×630 (link), 1080×1080 (square feed) | Meta |
| Groups | each Group sets post rules, link rules, promo rules | Group rules |
| Hashtags | low value on FB (unlike IG); don't over-tag | practitioner cohort |

The constraint that bites: **per-Group rules** (many ban links or self-promo outright) + the
primary-text link tax.

---

## 3. Ranking Signals (Ranked by Impact)

1. **Meaningful social interactions (comments + shares > reactions)** — Meta-stated the feed favors
   posts that spark conversation. *Lever:* ask a real question; design for shares. *Tier:* primary (Meta-stated, directional).
2. **Native video watch time** — native video gets distribution external links don't. *Lever:* upload
   native, hook in 3s, caption for mute. *Tier:* secondary.
3. **Group engagement** — active Groups surface posts to engaged members far above Page reach. *Lever:*
   post where the ICP already is. *Tier:* secondary.
4. **Dwell + early engagement velocity** — early comments/shares compound. *Lever:* post at the
   Group's active window; reply fast. *Tier:* secondary.
5. **Negative signals (hide/report/"see less")** — engagement-bait + spam get suppressed. *Lever:* no
   bait, no link-dump. *Tier:* primary (Meta-stated penalty).

---

## 4. Anti-Patterns

| Pattern | Penalty | Detection | Source |
|---|---|---|---|
| External link in primary text | reach tax (suppressed distribution) | a link in the post body, not first comment | practitioner cohort |
| Engagement-bait ("comment YES!", "tag a friend") | downranked (Meta-stated) | bait phrasing | Meta (primary) |
| Cold promo in a Group | removal + ban; no-spam culture | link-drop, no value, no disclosure | Group rules |
| YouTube/Vimeo link instead of native upload | far lower video reach | external video link | practitioner cohort |
| Over-posting on a Page | per-post reach decays; audience fatigue | high daily Page frequency | practitioner cohort |
| Hashtag stuffing | reads as spam; no FB benefit | many hashtags | practitioner cohort |

---

## 5. Playbook / Tactical Sequence

**Highest-leverage tactic:** post native (video or a comment-earning question) into the *right active
Groups* — earning comments + shares (the top "meaningful social interaction" signal) — with any link
in the first comment, never the primary text.

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | Find the Groups | T−14d | Identify 2–3 active Groups where your ICP gathers; read rules + promo policy. | Groups whose rules permit your post |
| 2 | Build presence | T−7d → T−1d | Participate genuinely; learn the tone; clear any membership/post gates. | Trusted enough to post without removal |
| 3 | Make native assets | T−3d | A captioned native video (Angle 1) or a question/resource post (Angle 2/3). | Asset is native, sound-off legible |
| 4 | Place the link right | T−1d | Link in the first comment, value in the post; founder disclosed. | No link in primary text |
| 5 | Post at the active window | T−0 | Post when the Group/page audience is live (§6). | Live; not removed |
| 6 | Drive the conversation | T+0 → T+3h | Reply to every comment; ask follow-ups; never bait. | Comment thread grows; shares appear |
| 7 | Cross-surface (Page + Reels) | T+0 → T+all | Re-cut for Reels/Stories where it fits; don't blanket-spam Groups. | Multi-surface without spam flags |
| 8 | Measure + feed the pack | T+24h | Record reach/comments/shares/referral signups → `/measure-results`. | Dated entry → next FB launch compounds |

---

## 6. Timing & Cadence

- **Best window:** the target Group's active hours (varies by audience; many US consumer audiences
  peak weekday mid-morning + early evening). Verify per Group/Page.
- **Decision window:** early comments/shares (first ~2–3h) decide feed pickup.
- **Cadence:** community presence over broadcast. A few high-value Group posts beat daily Page posts;
  Page is a credibility surface, Groups are the reach surface.

---

## 7. CTA / Conversion Norms

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| First comment link | the post earned the click | link in primary text (reach tax) | practitioner cohort |
| In-thread reply with link (reactive) | someone asked / directly relevant | dropped cold | Group rules |
| Native video end-frame CTA | watch-through earned it | front-loaded pitch | practitioner cohort |
| Group-allowed promo thread | the Group permits it | a no-promo Group | Group rules |

---

## 8. Open Questions / Known Unknowns

- Meta's exact feed-ranking weights are unpublished; "meaningful social interactions" is directional, not a formula.
- The size of the external-link reach tax is practitioner-estimated, not Meta-published.
- Group reach vs Page reach ratios vary enormously by niche and Group health — must be measured per case.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| 2026-06-16 | Initial pack to the v2 contract (launch-channel). | hungv47 |
