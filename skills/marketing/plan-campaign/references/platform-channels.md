---
name: platform-channels
type: domain-catalog
load-class: DOMAIN
loaded-by: channel-agent
canonical-source: references/platform-intelligence/ (repo root)
---

# Platform-Specific Channel Intelligence

`channel-strategy.md` is canonical for the 9-channel framework, growth-motion priority, habitat translation, and the Angle-to-Channel Fit Matrix. It treats the **Social media** channel (channel #6 of 9) at the strategy level — *which* platform, *what* role. It does not carry the per-platform format/algorithm/CTA signals a Channel Execution Brief needs to be specific rather than generic.

This catalog closes that gap. It maps `plan-campaign`'s `channel-agent` to the strategy-relevant sections of the top-level `references/_shared/platform-intelligence/` catalog so a Social-media channel brief is grounded in real signals — not "post on LinkedIn."

**Scope — Social-media channel (+ the News/launch channel via launch-channel packs).** The 6 social platform files (linkedin, x, tiktok, reels, shorts, youtube) ground channel #6. As of the pack-contract v2 (2026-06-16), the **News/launch channel** is additionally grounded by `launch-channel` packs — the first is **Product Hunt** (`producthunt.md`), mapped below. The remaining channels in `channel-strategy.md` (Search/AEO, Store/Listing, Bounty/Info, Forums/Communities, IRL, Mailbox, SMS) are out of platform-intelligence scope — `platform-channels.md` does not touch them.

The canonical platform catalog is top-level `references/platform-intelligence/{linkedin,x,tiktok,reels,shorts,youtube}.md`. The mirror at `references/_shared/platform-intelligence/` is what the channel-agent reads at dispatch. Platform→file map: Instagram → `reels.md`, YouTube → `youtube.md` (long-form) + `shorts.md`.

## What channel-agent consumes — strategy subset only

Three sections, and only three. Per D23 sub-decision 2, `plan-campaign` is a strategy skill — it consumes the **planning-layer** sections and leaves the production-layer detail to `brief-shortform`:

- **Consumed:** §2 Format Constraints, §3 Algorithm Signals, §7 CTA Placement Norms.
- **NOT consumed:** §1 Hook Taxonomy, §5 Playbook, and §6 Hook Window + Retention Curve — production-layer craft that `brief-shortform` owns. A campaign plan that specifies hook archetypes has crossed into the production lane.

## Section-to-output map

### §2 Format Constraints → channel feasibility + Content Mix cadence

Before the channel-agent commits a Social-media platform to a cadence in the **Content Mix by Channel** table, it checks §2 against team capacity:

- **`_shared/platform-intelligence/tiktok.md` §2** — TikTok has two production tiers: a 21–34s entertainment sweet spot and a 60–180s educational tier. They are different cost structures. A Channel Execution Brief that commits a 2-person team to "daily TikTok" without naming the tier is a capacity risk (see `references/anti-patterns.md` — capacity-vs-cadence). The brief's Tactic field names the tier.
- **`_shared/platform-intelligence/linkedin.md` §2** — LinkedIn video is effectively burned-in-caption-required (~80% watched on mute, practitioner consensus) and external links in the post body carry a documented reach tax (~26% average, rising toward ~42% — Ordinal 900K-post study). Both are real production costs the cadence and Tactic fields must absorb before the channel is sold as "low-effort."

**channel-agent output framing:** the Content Mix `Cadence` column and the Channel Execution Brief `Tactic` column cite the §2 production tier — not a bare frequency number.

### §3 Algorithm Signals → channel Role + angle-to-channel Rationale

§3 tells the channel-agent what each platform *rewards*, which drives the **Channel Hierarchy** table's `Role` (Awareness / Trust / Conversion) and the `Rationale` for each assigned angle:

- **`_shared/platform-intelligence/linkedin.md` §3** — LinkedIn's top signals are dwell time and indirect (debate-shaped) comments; posts with indirect comments see up to 2.4× reach. A contrarian or vulnerability angle fits LinkedIn's **Trust** role because it engineers the comment shape the algorithm rewards. The Rationale column cites the signal, not just "LinkedIn is good for thought leadership."
- **`_shared/platform-intelligence/tiktok.md` §3** — TikTok's primary signals are completion rate and search value (keywords triple-tagged across spoken line, on-screen text, caption). A tightly-scoped, search-shaped how-to angle fits TikTok's **Awareness/discovery** role; a sprawling brand-story angle does not.
- **`_shared/platform-intelligence/{x,reels,shorts,youtube}.md` §3** — same pattern: read the platform's ranked signals, then assign the channel a role its algorithm actually supports. A channel whose algorithm rewards only top-funnel discovery cannot be assigned a Conversion role.

**channel-agent output framing:** every Social-media row in the Channel Hierarchy table traces its `Role` + `Rationale` to a named §3 signal.

### §7 CTA Placement Norms → conversion mechanics + Success Metric

§7 governs whether a Social-media channel can realistically own a **Conversion** role and what the Channel Execution Brief's `Success Metric` should be:

- **`_shared/platform-intelligence/linkedin.md` §7** — a link in the post body costs reach (~26% average, up to ~42% — Ordinal 900K-post study). A LinkedIn channel brief with a click-driven objective must spec link-in-first-comment, or accept the reach tax. A "DM me" CTA works only for high-trust/high-ticket B2B. The Success Metric and Budget Type fields reflect this.
- **`_shared/platform-intelligence/{tiktok,reels,shorts,youtube,x}.md` §7** — each platform's CTA mechanics differ (bio link, end-card, comment-pinned, overlay timing). The channel-agent reads §7 before assigning a Conversion role; if the platform's CTA path is weak, the channel is assigned Awareness/Trust and conversion is routed to an owned channel (email, landing page).

**channel-agent output framing:** a Social-media channel assigned a Conversion role must name the §7-supported CTA path in its Channel Execution Brief.

## News/launch channel → Product Hunt launch-channel pack

When the 9-channel evaluation **selects the News/launch channel for a Product Hunt launch**, the
channel-agent grounds it in [`_shared/platform-intelligence/producthunt.md`](_shared/platform-intelligence/producthunt.md)
(`pack_type: launch-channel`). Unlike the social packs (where `plan-campaign` consumes only the
planning-layer §2/§3/§7), a *launch* is a planning-layer event end-to-end, so the channel-agent
consumes the **launch sequence directly**:

- **§5 Playbook (the 10-step run-of-show)** → the Channel Execution Brief's launch-day sequence +
  the `launch-sequencing-agent`'s ORB phases (T−14d list-build → 12:01 PT go-live → all-day presence
  → T+24h measure). This is the one case where the campaign plan legitimately carries step-level tactics.
- **§6 Timing** → the timeline-agent's launch slot: live at **00:01 AM PT**, Top-5 decided by ~noon PT.
- **§3 Ranking Signals** → the channel `Role` (a launch is an Awareness+Conversion spike) + the
  `Success Metric` (rank, upvote/comment velocity, referral signups).
- **§4 Anti-Patterns (hard guard)** → **no vote-ask** in any plan output; the plan engineers earned
  velocity (notify → show → feedback ask), never solicited votes.

The plan output narrates the loaded pack + `last_verified` (legibility convention), and hands off to
the **Product Hunt launch chain** (`skills/meta/forsvn/references/chains/marketing.md` § Launch chains)
for execution. Staleness behaves as below (`DONE_WITH_CONCERNS`, never FAIL).

## What this catalog does NOT cover

- The 9-channel framework, growth-motion priority, habitat translation, content classification, Angle-to-Channel Fit Matrix — `references/channel-strategy.md` stays canonical for all of it.
- Hook archetypes and retention curves — `brief-shortform`'s production-layer concern (§1, §6 of the catalog).
- The non-social channels (Search/AEO, Store, Bounty, Forums, IRL, Mailbox, SMS) — out of platform-intelligence scope. **Exception:** the News/launch channel is now covered for **Product Hunt** via the `producthunt` launch-channel pack (mapped above); other launch venues remain out of scope until they get a pack.

## When to read this catalog

The channel-agent loads `platform-channels.md` (and the relevant `_shared/platform-intelligence/[platform].md` sections) **only when the Social-media channel is a selected channel**. If the 9-channel evaluation skips Social media, this catalog is not loaded.

**Staleness:** each `platform-intelligence/[platform].md` file carries a `last_verified` date and self-flags `DONE_WITH_CONCERNS` when it exceeds 90 days. If a Social-media channel brief is grounded in a stale file, the channel-agent surfaces it and the critic flags `DONE_WITH_CONCERNS` — it does not FAIL the plan (D23 sub-decision 3).
