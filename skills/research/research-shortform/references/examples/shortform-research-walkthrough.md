# Worked Example — Short-Form Research Walkthrough

A full `research-shortform` run on a realistic topic + market, traced from the operator
invocation through the 6-agent flow to the produced catalog and its completion status. Shows
the two-window freshness model, per-platform sample-size flags (OK / LOW_SAMPLE), a conditional
audio agent firing, and a critic FAIL caught and fixed. **Illustrative — every URL, metric, and
sound name below is synthetic, constructed for the example; do not cite them as real findings.**

---

## Setup

**Operator ask:** `/forsvn:research-shortform AI dev-tools for solo founders`
**Resolved topic:** "AI dev-tools for solo founders" · **Market:** VN · **Platforms:** default 3
(TikTok + Reels + Shorts; no `--all`, so X/LinkedIn video stay out of scope) · **Run date:** 2026-06-13.

Brand context (read from `_biz-ops/forsvn-ops/brand/BRAND.md` for the Audience Fit register):
Forest Shadow `#0A120D` canvas, Leaf `#74B36B` as the single dark-mode accent — never Signal Lime.
That tone constraint flows into the spoken-line register, not into platform mechanics.

## Pre-Dispatch

`.forsvn/index/manifest.json` scan → no prior short-form-research artifact under (this topic, VN) →
**Cold Start**. The bundled prompt resolves the two missing dimensions and the audience source:

1. Topic: AI dev-tools for solo founders
2. Market: VN (single market — no US/VN mixing per Critical Gate 2)
3. Platforms: default 3 (operator declined `--all`)
4. Audience source: `research/research-icp.md` **absent** → operator supplies a cold-start hint:
   *"Solo founders building dev tools, mostly in Vietnam, posting on TikTok."* → `icp_referenced: no`.

Two freshness windows opened: `trend_signals_date: 2026-06-13` (14d/30d warn) and
`platform_mechanics_date: 2026-06-13` (90d/180d warn). `budget: deep`, no `--fast` → full critic loop armed.

## Layer 1 — parallel (platform-scout × 3 + audience-fit)

**platform-scout — TikTok → SAMPLE: OK (n=11).** Strongest live scene. Synthetic captures:

- `https://www.tiktok.com/@buildinpublic.vn/video/7390000000000000001?si=ex1` — @buildinpublic.vn,
  184k views, 9.2k saves. Opening 0–1.5s: hard cut to terminal, overlay "Tôi tự build cái này trong 2 tiếng."
- `https://www.tiktok.com/@codeordie.vn/video/7390000000000000002?si=ex2` — @codeordie.vn, 92k views,
  credential-flash open ("3 năm làm dev, đây là tool tôi tự viết").

**platform-scout — Reels → SAMPLE: OK (n=9).** Trending-audio reuse heavy.
**platform-scout — Shorts → SAMPLE: LOW_SAMPLE (n=5).** Thin VN dev-tool scene; flag carries forward.

**audience-fit-agent → cold-start path.** No ICP, so it grounds on the hint, maps (VN, founder,
creator audience) → register **semi-casual / bro**, polish chain **`polish-vn` Layer 2 on spoken-line
section**, and flags the missing ICP in Gaps. VoC phrases tagged `[inferred from cold-start hint — verify]`.

## Layer 2 — sequential (pattern-extractor → audio-trend → synthesis → critic)

**pattern-extractor** mines the scout reports into recurring archetypes with sample counts:
TikTok "credential-flash in 0–1.5s" 8/11; Reels "before/after build reveal" 6/9; Shorts INSUFFICIENT for
any archetype past 1 (n=5 only yields observed examples, no n≥3 archetype claim survives honestly).

**audio-trend-agent** fires (TikTok + Reels in scope) → two synthetic trending sounds with usage counts
and a decay estimate. Skipped entirely for the Shorts-only path would have been correct; here it runs.

**synthesis-agent** assembles the artifact below. **critic-agent — cycle 1: FAIL** on rubric #3
(the Reels recommendation "use a strong hook" was portable to TikTok unchanged) → re-dispatch synthesis
with the cited rule. **cycle 2: PASS** — all 5 rubrics green. Ships **DONE**.

---

## Produced Artifact (rendered in full)

> Written to `docs/forsvn/artifacts/research/research-shortform/research-shortform-2026-06-13-ai-devtools-solo-founders-vn.md`

```markdown
---
skill: research-shortform
type: short-form-research
status: done
date: 2026-06-13
stack: research
review_surface: md
topic: AI dev-tools for solo founders
market: VN
platforms_analyzed: [tiktok, reels, shorts]
platform_mechanics_date: 2026-06-13
mechanics_sources_verified:
  - source: TikTok Creator Portal — Algorithm Updates
    url: https://newsroom.tiktok.com/
    last_updated: 2026-05-29
  - source: Instagram Creators — Reels Ranking
    url: https://creators.instagram.com/
    last_updated: 2026-04-18
  - source: YouTube Creator Insider — Shorts
    url: https://www.youtube.com/@CreatorInsider
    last_updated: 2026-05-02
trend_signals_date: 2026-06-13
sample_size_per_platform:
  tiktok: { n: 11, flag: OK }
  reels: { n: 9, flag: OK }
  shorts: { n: 5, flag: LOW_SAMPLE }
icp_referenced: no — using cold-start audience hint
---

# Short-Form Research — AI dev-tools for solo founders — VN

## TL;DR — Top 5 Recommendations for the Brief Skill

1. TikTok: open with credential-flash archetype in 0–1.5s — 8/11 in sample (e.g., [synthetic](https://www.tiktok.com/@codeordie.vn/video/7390000000000000002?si=ex2)); fits the 1–2s hook window ([TikTok Creator Portal — Algorithm Updates, last_updated 2026-05-29](https://newsroom.tiktok.com/)).
2. Reels: lead with a before/after build reveal in the first 2s — 6/9 in sample; ride trending audio for the originality-weighted boost ([Instagram Creators — Reels Ranking, last_updated 2026-04-18](https://creators.instagram.com/)).
3. TikTok: target ≥70% completion via a pattern interrupt every 3–5s — sub-70% rarely breaks 10k views ([TikTok Creator Portal — Algorithm Updates, last_updated 2026-05-29](https://newsroom.tiktok.com/)).
4. TikTok + Reels: place a save-prompt CTA as an overlay at 0:18–0:24, not a follow-prompt — high-save synthetic samples cluster here.
5. Shorts: DIRECTIONAL ONLY — LOW_SAMPLE (n=5). Treat any Shorts pattern as a hypothesis; re-run before betting a brief on it.

## Audience Fit

**Source:** cold-start audience hint
**ICP referenced:** no — using cold-start hint

### Primary Buyer
[from hint] Solo founders building dev tools, mostly in Vietnam, posting on TikTok — pragmatic,
ship-fast, allergic to corporate polish.

### Register
**Primary:** semi-casual / bro
**Why:** Audience signal (solo founder + creator-native platform) + VN founder-content norm.

### Language Polish Routing
- Market: VN · Brand mode signal: founder
- Required polish chain: `polish-vn` Layer 2 on the spoken-line section.

### VoC Phrases
1. "Build cái này tự nhiên 2 tiếng" — [inferred from cold-start hint — verify]
2. "Tool nào cũng đắt, tự viết cho nhanh" — [inferred from cold-start hint — verify]
3. "Không cần team, một mình vẫn ship" — [inferred from cold-start hint — verify]

### Sensitivity Flags
- Avoid implying the audience can't code — they self-identify as builders.
- No medical/financial overclaims on "productivity gains."

### Gaps
- ICP missing — recommend running `research-icp` before the next refresh. VoC phrases are inferred, not citable.

## Per-Platform Findings

### TikTok — SAMPLE: OK (n=11)

**Top performers analyzed:**
- [synthetic](https://www.tiktok.com/@buildinpublic.vn/video/7390000000000000001?si=ex1) — @buildinpublic.vn, 184k views / 9.2k saves; terminal hard-cut open.
- [synthetic](https://www.tiktok.com/@codeordie.vn/video/7390000000000000002?si=ex2) — @codeordie.vn, 92k views; credential-flash open.

**Recurring hook archetypes (≥3 occurrences):**
- Credential-flash in 0–1.5s — 8/11.
- "POV: tôi tự build" first-person framing — 5/11.

**Algorithm signals observed in sample:** high-save entries cluster around an overlay save-prompt; sub-70% completion entries did not break 10k views ([TikTok Creator Portal — Algorithm Updates, last_updated 2026-05-29](https://newsroom.tiktok.com/)).

**Audio patterns:** trending-sound use in 7/11; see Trending Audio.
**Caption norms:** first 50–80 chars carry the claim; 3–5 hashtags (1 broad + 2 niche).
**CTA placement:** overlay save-prompt at 0:18–0:24 in 9/11.
**Failure modes:** generic openers ("hey mọi người…") in the 3 lowest-view entries.

SAMPLE: OK (n=11)

### Instagram Reels — SAMPLE: OK (n=9)

**Top performers analyzed:**
- [synthetic](https://www.instagram.com/reel/EX9devtoolvn001/) — before/after build reveal, trending audio.

**Recurring hook archetypes (≥3 occurrences):** before/after build reveal — 6/9.
**Algorithm signals observed:** original-audio + trending-audio reuse correlates with the higher-reach entries.
**Audio patterns:** trending-sound reuse in 8/9; see Trending Audio.
**Caption norms:** shorter than TikTok; emoji-led first line.
**CTA placement:** caption-embedded "Save ↓" last line — 6/9.
**Failure modes:** static talking-head past 8s with no cut.

SAMPLE: OK (n=9)

### YouTube Shorts — SAMPLE: LOW_SAMPLE (n=5)

**Top performers analyzed:** 5 entries captured; VN dev-tool Shorts scene is thin.
**Recurring hook archetypes:** INSUFFICIENT for a claimed archetype (no pattern reaches n≥3 honestly) — observed examples only.
**Audio patterns:** original audio dominant (Shorts norm); no trend dependence.
**CTA placement:** end-screen subscribe — observed in 3/5.
**Failure modes:** cross-posted TikTok watermark in 2/5 (downrank risk).

SAMPLE: LOW_SAMPLE (n=5)

## Cross-Platform Comparison

| Element | TikTok | Reels | Shorts |
|---|---|---|---|
| Hook window (cited mechanic) | 1–2s ([TikTok, 2026-05-29](https://newsroom.tiktok.com/)) | ~3s ([IG, 2026-04-18](https://creators.instagram.com/)) | ~3s ([YT, 2026-05-02](https://www.youtube.com/@CreatorInsider)) |
| Length sweet spot (observed) | 22–34s (sample n=11) | 18–28s (sample n=9) | 20–40s (sample n=5, directional) |
| Audio rule dominant | trending | trending + original | silent-friendly / original |
| Caption norm (this niche) | claim in first 80 chars (sample) | emoji-led, short (sample) | minimal (sample, directional) |
| CTA placement (this niche) | overlay save 0:18–0:24 (sample) | caption "Save ↓" (sample) | end-screen subscribe (sample) |
| Failure mode unique here | generic opener (sample) | static head past 8s (sample) | cross-post watermark (sample) |

## Trending Audio

*(Synthetic — illustrative track names; verify decay before briefing.)*
- "Lo-fi Build Session" — ~310k synthetic uses; estimated decay by ~2026-06-30 — use on TikTok within ~2 weeks.
- "Cafe Code Beat" — ~190k synthetic uses, rising on Reels; lower decay risk this window.

## Recommendations for short-form-brief

**TikTok:**
- Open with credential-flash in 0–1.5s; text overlay + verbal + visual interrupt together.
- 22–34s length; pattern interrupt every 3–5s to clear ~70% completion.
- Audio: "Lo-fi Build Session" if briefing within ~2 weeks, else VO-led.
- Caption: claim in first 80 chars; 3–5 hashtags (1 broad + 2 niche).
- CTA: overlay save-prompt at 0:18–0:24.
- Do NOT use a generic "hey mọi người" opener.

**Reels:**
- Open with a before/after build reveal in the first 2s (NOT portable to TikTok — Reels' originality weighting rewards the reveal-on-trending-audio combo specifically).
- 18–28s; ride a trending sound for the originality boost.
- CTA: caption-embedded "Save ↓" last line.

**Shorts:** DIRECTIONAL (LOW_SAMPLE). Hypotheses only: original audio, end-screen subscribe, strip any cross-post watermark. Re-run before committing a brief.

## Open Risks & Caveats

- Shorts is LOW_SAMPLE (n=5) — treat every Shorts line as directional.
- Trending audio decays fast; "Lo-fi Build Session" listed will likely be tired by ~2026-06-30 — re-run before briefing past then.
- Mechanics docs verified within the 90d window; oldest is Reels (2026-04-18), comfortably inside the 180d warn line.
- ICP absent — Audience Fit ran on a cold-start hint; register and VoC are directional.
- Single-market artifact (VN). Re-run per market — do not reuse for US.

## What This Research Doesn't Cover

- Long-form video patterns (different research).
- Static visual / carousel patterns — use `brief-graphic`.
- Other markets — re-run per market.
- Paid ad creative norms — separate scope.
- Predictions about future trends — this describes the captured sample window only.
```

---

## Downstream handoff

`brief-shortform` (marketing stack) consumes this artifact per asset: it reads §6 Recommendations
for the platform it's briefing and the frontmatter `sample_size_per_platform` flags. Because Shorts
is `LOW_SAMPLE`, any Shorts brief inherits a "directional — n=5" warning automatically; TikTok and
Reels briefs cite the OK-flagged archetypes verbatim. `evaluate-shortform` later scores published
posts against §3 Per-Platform Findings + the frontmatter — the catalog is the scoring rubric.

## What the example demonstrates

- **Specificity is the contract.** The good TL;DR bullet names platform + archetype + N/X evidence + a
  cited mechanic — not "strong hooks matter." That precision is what the brief skill bets on.
- **A LOW_SAMPLE platform still ships.** Shorts (n=5) is delivered honestly with a directional flag that
  carries downstream, rather than padded to a fake OK — and `INSUFFICIENT` archetypes claim nothing.
- **The conditional audio agent earned its run.** TikTok + Reels in scope → `audio-trend-agent` fired and
  produced a decay-dated track list; it would have been correctly skipped on a Shorts-only path.
- **The critic gates portability, not polish.** Cycle 1 failed on rubric #3 because the Reels
  recommendation could be pasted into the TikTok section unchanged — per-platform non-fungibility is
  the value, and the fix made the reveal-on-trending-audio combo Reels-specific.
- **Two windows, two timestamps.** `trend_signals_date` and `platform_mechanics_date` are recorded
  separately so a fresh trend date can't mask a stale mechanics doc.
