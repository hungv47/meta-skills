# Worked Example — Launch Walkthrough

Two worked bundles: a Product Hunt launch (founder voice, strong) and a Reddit contrast (the same product, a different channel's native shape). Both show the full dispatch (Cold Start → launch-copywriter → guard-checker → critic) and the required Legibility + Why-this-works blocks. The product is a fictional dev tool, `Tracebook` (a flaky-test triage tool), so the example ships OSS-clean.

---

## Example A — Product Hunt (founder voice, PASS)

### Cold Start (resolved)

```
1. Channel → producthunt
2. Topic → "Launching Tracebook: it watches your CI and tells you which test is flaky and why, with a one-click quarantine."
3. Brand mode → founder
4. Audience → backend engineers on teams with a flaky CI suite; pain: "we rerun the pipeline 3x and merge on red."
5. Goal → feedback
```

Pack: `producthunt` · verified 2026-06-16 · `reviewed`. Performance store: `empty` (first launch — using priors).

### launch-copywriter-agent → guard-checker-agent (PASSED) → critic-agent (the bundle)

```markdown
## Launch bundle — producthunt

### Primary identifier
Tracebook — Flaky-test triage for CI, built for backend teams
**Char count:** 56 / 60
**Launch angle:** Angle 1 — category-killer tagline (producthunt §1)

### Descriptor
Tracebook watches your CI, finds the test that's actually flaky (not the one that
failed last), explains why, and lets you quarantine it in one click — so you stop
rerunning the pipeline 3× and merging on red.
**Char count:** 233 / ~260

### Anchor narrative
Hey PH 👋 I'm Mai, I build Tracebook. For two years my team's deploy ritual was:
push, watch CI go red, rerun, rerun again, then merge on a hope. The flake was never
the test that failed — it was three tests upstream sharing a fixture. I got tired of
being the person who "knew which ones to ignore," so I built the thing that knows.
Tracebook ranks your flakes by blast radius, shows the shared-state cause, and
quarantines with one click and an auto-filed issue. It's rough at the edges — the
monorepo support is new. **What's the flaky test that's haunting your team right now?
I'll tell you if Tracebook would catch it.**
**Pack tactic:** Angle 2 founder-story first comment (producthunt §1) + §5 step 6 (pin within 60s)
**Feedback ask (never a vote-ask):** "What's the flaky test haunting your team? I'll tell you if Tracebook would catch it."

### Amplification
- **Notify copy:** "We just went live on Product Hunt 🚀 Tracebook — the flaky-test triage tool I've been telling you about. Would love your honest read in the first few hours: [link]." (no upvote/vote string)
- **Cross-post copy:** "We launched Tracebook on Product Hunt today: it finds *which* test is flaky and why, then quarantines it in one click. Built it after one too many merge-on-red Fridays. [link]"

### Channel metadata + compliance
- Topics: Developer Tools · Productivity · GitHub
- Go-live window: 12:01 AM PT (producthunt §6) — full 24h runway
- Optional offer: 3-month Pro free for PH (code on the page)
- Gallery: slot 1 = 5s demo loop (red CI → ranked flake → one-click quarantine) — brief via `brief-graphic` (producthunt §1 Angle 3, §2 1270×760)

**Legibility — applied expertise**
- Pack: `producthunt` · verified 2026-06-16 · status reviewed
- Tactics applied: category-killer tagline ≤60 (§1 Angle 1) · pinned founder-story first comment ending in a feedback ask (§1 Angle 2, §5 step 6) · 12:01 AM PT go-live (§6) · notify-don't-beg, zero vote-ask (§4) · demo-loop gallery slot 1 (§1 Angle 3)
- Why these: PH ranks the daily leaderboard on first-4-hour upvote + comment velocity, decided before noon PT (producthunt §3.1–3.2); the first comment is a first-class comment signal and the tagline drives the click-in that precedes the upvote.

**Why this works**
- The bet: backend engineers feel the "merge on red" pain sharply enough that a tool naming *which* test is flaky earns first-window comments — if they don't recognize the ritual, the launch falls flat.
- For this product: leads on the exact ICP pain ("rerun 3× and merge on red", `icp-research.md`), in their words, not "improve your CI reliability."
- For this product: the founder-story names a *specific* technical cause (shared fixture, blast radius) — proof the maker lived it, which `PRODUCT-CONTEXT.md` positions as the wedge vs generic CI dashboards.
- The differentiator: a generic "CI analytics" competitor can't run this first comment — it hinges on the shared-fixture root-cause story that's specific to Tracebook's diff-blast-radius approach.

## Critic verdict
| Dimension | Score | Notes |
|---|---|---|
| Angle fit / clarity | 9 | Tagline = "[category] for [audience]" in 56/60; first comment = Angle 2 with a specific cause |
| Format + hard-guard compliance | 10 | ≤60 tagline; zero vote-ask across all components; topics ≤3 |
| Velocity-earning structure | 9 | Pinned founder comment + notify-don't-beg + co-maker reach; ends in a reply-driving question |
| Channel-native voice / culture fit | 9 | First-person maker tone, names a real pain, "rough at the edges" honesty |
| Bundle completeness + coherence | 9 | Tagline, descriptor, anchor tell one story; metadata aligns with §6 |
| **Total** | 46 / 50 | pass ≥ 35; done_with_concerns 25-34; fail < 25 |

## Anti-patterns triggered (if any)
- None
```

**Discrimination test:** weak-brief sim ("Check out Tracebook! Please upvote us 🙏") → vote-ask forces D2=0, no angle, no anchor → ~14/50 (<25, VALID). Strong observed 46 (≥35, VALID).

**Verdict:** PASS → `status: done`, `guard_status: passed`. Artifact: `docs/forsvn/artifacts/marketing/launch/producthunt-2026-06-19-tracebook.md`.

---

## Example B — Reddit (same product, the native shape, PASS)

The same launch on `r/devops` is a *different bundle*: the unit is a value-first post in one subreddit, not a leaderboard play.

```markdown
## Launch bundle — reddit

### Primary identifier
I analyzed 6 months of our CI flakes — the test that fails is almost never the one that's broken
**Char count:** 96 / 300 (aim ≤100)
**Launch angle:** Angle 1 — value-first post (reddit §1)

### Descriptor
(value-first self-post body) Over 6 months I logged every flaky failure on our suite.
~70% of the time the test that went red shared a fixture with a *different* test that
mutated global state two files away. Here's the breakdown of the patterns, the three
fixes that killed most of them, and — disclosure, I'm the founder — the tool I built
out of this, Tracebook, which ranks flakes by blast radius and quarantines in one click.
The analysis stands on its own; the tool's just where it led. Repo + data in comments.
**Char count:** 487 / value-first (links contextual)

### Anchor narrative
(founder disclosure + reply readiness) I'm the founder — saying that up front so this
isn't a stealth pitch. I'll be in the comments all morning; if you paste a flaky failure
you're fighting, I'll tell you the likely shared-state cause whether or not you ever touch
Tracebook. **What's the flakiest test in your suite right now?**
**Pack tactic:** Angle 2 transparent founder ask (reddit §1) + §5 step 6 (engage hard, first hour)
**Feedback ask (never a vote-ask):** "What's the flakiest test in your suite right now?"

### Amplification
- **Notify copy:** (sparing — Reddit punishes blasting) one DM to the two community members who asked about flake tooling last month: "posted the flake teardown we talked about in r/devops if it's useful."
- **Cross-post copy:** none day-of (blanket crossposting trips the spam flag — reddit §4); if it lands, tailor a separate r/QualityAssurance post next week.

### Channel metadata + compliance
- Target subreddit: r/devops — why: ICP lives there; top-month posts are teardowns/data, which this matches
- Allowed lane: value-post (not a self-promo-day pitch); flair: "Discussion"
- Posting window: weekday 8am ET (reddit §6)
- Founder disclosure: present, in the body and the anchor
- 9:1: account has months of genuine comments in the sub (reddit §2 account gates cleared)

**Legibility — applied expertise**
- Pack: `reddit` · verified 2026-06-16 · status reviewed
- Tactics applied: value-first post that stands alone if the link were removed (§1 Angle 1) · explicit founder disclosure (§4) · one allowed sub + correct flair, no blanket crosspost (§2, §4) · reply-readiness in the first hour (§5 step 6) · weekday-morning window (§6)
- Why these: Reddit's "hot" sort rewards first-hour upvotes + real comment depth (reddit §3.1–3.2), and the 9:1 + sub-rule guards mean a cold link-drop is removal + ban (§4) — value-first + disclosure is what survives.

**Why this works**
- The bet: r/devops rewards a genuine teardown with data; if the analysis isn't independently useful, the founder disclosure reads as a pitch and the post dies on ratio.
- For this product: the data *is* the product's thesis (blast-radius root cause, `PRODUCT-CONTEXT.md`) — so leading with the analysis and disclosing the tool is honest, not a bait.
- For this product: the ICP ("merge on red", `icp-research.md`) is exactly r/devops's audience, so the teardown speaks to their lived ritual.
- The differentiator: a generic CI tool can't post this teardown — it depends on the shared-fixture dataset that only Tracebook's approach produces.

## Critic verdict
| Dimension | Score | Notes |
|---|---|---|
| Angle fit / clarity | 9 | Value-claim title (§1 Angle 1); analysis stands alone |
| Format + hard-guard compliance | 10 | Founder disclosure present; value-first (no cold link-drop); right sub + flair; zero vote-ask |
| Velocity-earning structure | 8 | Genuine question + first-hour reply readiness; one DM, no blast |
| Channel-native voice / culture fit | 9 | Non-defensive, value-first, sub-appropriate; discloses like a community member |
| Bundle completeness + coherence | 8 | Title, body, anchor consistent; sparing amplification is correct for Reddit |
| **Total** | 44 / 50 | pass ≥ 35; done_with_concerns 25-34; fail < 25 |

## Anti-patterns triggered (if any)
- None
```

**Contrast — the weak Reddit version** (what the guard-checker would GUARD_FAIL): title "Check out Tracebook — the best flaky-test tool!", body is the pitch + link, no disclosure, posted to r/programming with no flair. Breaches: undisclosed founder (HARD GUARD), cold link-drop (HARD GUARD), sub-rule/flair (HARD GUARD) → REVISION_REQUIRED → GUARD_FAIL → `status: blocked`. Critic never runs; the launch would have been removed + the account risked.

---

## What the two examples teach

- **Same product, different bundles.** The PH bundle is a leaderboard play (tagline + pinned first comment + notify-the-list); the Reddit bundle is a value-first post in one sub. The skill instantiates the channel's native components from the pack — it does not template one shape onto both. That is why it's pack-driven, not per-channel-cloned.
- **The hard guard is the load-bearing difference from write-social.** Both bundles clear "zero vote-ask"; the Reddit one additionally clears founder-disclosure + value-stands-alone + sub-fit. A breach is publish-blocking (GUARD_FAIL), not a quality ding.
- **Legibility + why-this-works are both present, adjacent and distinct:** Legibility = why it fits the *channel* (pack tactics); Why this works = why it wins for *this product* (ICP/positioning).
