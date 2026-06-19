# Worked Example — a Product Hunt launch, end to end

`/run-launch producthunt "Cadence — a standup bot that writes itself"` — founder brand mode,
goal = signups. Shows pack resolution, the 7 steps narrated, the transparent degrade at the
unwired steps, the stop at the publish gate, and the handoff to `measure-results`.

---

## Cold Start (Pre-Dispatch)

- **Channel:** `producthunt` → `pack_type: launch-channel` → copy step routes to `write-launch`.
- **Product/topic:** "Cadence — a standup bot that writes itself." Brief path: none → greenfield.
- **Brand mode:** founder. **Goal:** signups.
- Foundations found: `research/icp-research.md` ✓, `brand/BRAND.md` ✓. No `plan-campaign` output yet.

## Pack resolution

Soft client: no hosted key → local mirror. Resolved `producthunt` · `last_verified: 2026-06-16`
· `status: reviewed` (12 days old — fresh). `summary` quoted to the operator:

> "Product Hunt launch-day playbook: a pinned first maker-comment + a 12:01 AM PT post + a
> pre-lined (never vote-ringed) support list drive first-4-hour upvote+comment velocity, which
> decides the daily Top-5 before noon PT."

## The run-of-show (architect plan)

| # | step | leaf | pack § | gate / status |
|---|---|---|---|---|
| 1 | audience | research-icp | — | have `icp-research.md` → skip |
| 2 | plan | plan-campaign (+pack §5/§6, degrade) | §5 §6 | review gate / **current** |
| 3 | asset brief | brief-graphic | §1 Angle 3 · §2 (1270×760, thumb 240×240) | review gate / pending |
| 4 | launch copy | write-launch | §1 · §2 caps · §4 no-vote-ask · §5 first comment | review gate / pending |
| 5 | comms plan | plan-campaign run-of-show (+pack §5 timings) | §5 (T−14d → T+24h) | review gate / pending |
| 6 | publish | publish-social (+§4 §7 re-assert) | §7 news-framed · §4 no-vote-ask | fork + gate / pending |
| 7 | measure | measure-results | §9 / §5 write-back | — |

**Current step:** 2 (plan). **Next action:** dispatch `plan-campaign` (launch path), then await the human gate.

## Step-by-step narration (legibility visible)

- **Step 2 — plan.** Dispatched `plan-campaign`. ⚠ **Transparent degrade:** `plan-campaign` does
  not bind the launch pack yet (S3.2/S3.3) — so `run-launch` read `producthunt` §5 (the 10-step
  run-of-show) + §6 (12:01 AM PT post window; Top-5 decided ~noon PT) **directly** to ground the
  plan. Applied: 12:01 PT live time · first-4-hour support window · co-makers lined up. *Stops at
  the review gate.*
- **Step 3 — asset brief.** Dispatched `brief-graphic`. Applied pack §1 **Angle 3** ("show, don't
  tell" demo loop as gallery slot 1) + §2 format (gallery 1270×760, thumbnail 240×240, demo GIF
  shows the core action in <6s). *Stops at the gate.*
- **Step 4 — launch copy.** Dispatched `write-launch` (launch-channel pack). Emitted the full
  native bundle: tagline ≤60 ("Cadence — standups that write themselves, for async teams", §1
  Angle 1) · 80–150-word founder-story first comment ending in a feedback ask (§1 Angle 2, §5
  step 3) · notify copy ("we're live, take a look" — **no vote-ask**, §4) · cross-post copy ·
  topics/metadata (§2). Guard-checker PASS (no "upvote" string anywhere). *Stops at the gate.*
- **Step 5 — comms plan.** The `plan-campaign` launch-day run-of-show artifact, grounded in §5
  timings (T−14d build the list → T−2d draft first comment → T−0 00:01 PT go live → T+0:01 pin →
  T+0:05–04:00 notify → all-day reply). Same degrade note as step 2. *Stops at the gate.*
- **Step 6 — publish.** Hands to `publish-social`. ⚠ **Transparent degrade:** `publish-social`
  does not bind the launch pack — `run-launch` **re-asserted** §4 (no vote-ask anywhere in the
  cross-post copy) + §7 (news-framed CTA: "we launched [link]", never "go upvote") before the
  gate. `list_tools(publish)` → 0 verified engines → **Brief-only**: emits the dispatch plan +
  the connectable engines. **Stops. The human publishes.** No auto-publish.
- **Step 7 — measure.** After the launch day, dispatch `measure-results producthunt <results>` —
  it attributes the result to the §5/§3 tactics, writes a dated entry back into the pack §9, and
  appends a row to `.forsvn/performance/producthunt.tsv`. **Loop closed.**

## The bundle (excerpt)

```
**Legibility — applied expertise**
- Pack: `producthunt` · verified 2026-06-16 · status reviewed
- Tactics applied: 12:01 PT live (§6) · first-comment founder story pinned (§1.2/§5.3/§5.6) ·
  demo-loop gallery slot 1 (§1.3) · tagline ≤60 (§2) · notify-to-look, never upvote (§4/§7)
- Why these: PH ranks the daily leaderboard on first-4-hour upvote+comment velocity, decided
  before noon PT (§3.1) — the whole bundle concentrates genuine support into that window.
- Degrade: step 2 (plan) + step 6 (publish) — plan-campaign / publish-social don't bind the
  launch pack yet (S3.2/S3.3); run-launch read §5/§6/§4/§7 directly and re-asserted the guards.

**Why this works**
- The bet: a founder-story first comment + a 12:01 PT window earns enough first-4-hour velocity
  to land Top-5 without a single vote-ask — falsified if signups/rank come in flat with high traffic.
- For this product: leads on the async-standup pain your ICP ranked #1 (`icp-research.md` §pains),
  in their words ("standup is a tax on makers").
- The differentiator: the demo loop shows the bot writing a real standup — a competitor's static
  hero can't make that claim, so the angle wouldn't survive a name-swap.

## Critic Verdict — run-launch
**Result:** PASS  (Chain integrity ✓ · Pack legibility ✓ · Gate discipline ✓ · Bundle coherence ✓ · Loop closure ✓)
```

**Status:** DONE_WITH_CONCERNS until step 7 runs (loop open until `measure-results` writes back) —
the runner flags this explicitly at the publish gate.
