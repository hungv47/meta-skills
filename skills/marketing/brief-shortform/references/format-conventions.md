---
title: Short-Form Brief — Format Conventions
lifecycle: canonical
status: stable
produced_by: short-form-brief
load_class: PROCEDURE
---

# Format Conventions

**Load when:** synthesis/storyboard/hook/copy-pack agents are composing artifact content OR critic agent is verifying formatting. These conventions are enforced by critic Production + Algorithm-fit + Brand-fit sub-critics.

---

## Date format

All dates ISO 8601 (`YYYY-MM-DD`). No locale variants, no "May 18, 2026" prose. Frontmatter date fields + inline `last_updated` citations both use this format.

## Timing format

All shot/scene timings in seconds, using the `0:XX–0:YY` range syntax (en-dash, not hyphen-minus):

```
0:00–0:01 — Hook visual hits (ECU on hand pulling latch)
0:03–0:05 — Latch click audible; cut to MCU on founder face
0:05–0:08 — Founder verbal: "Standup là họp lại để báo cáo lại"
```

Vague phrases like "early on," "after the hook," "near the end" auto-FAIL on critic Production. Every shot/scene block has a timing range; total brief length sums to the platform sweet spot from research catalog.

## Framing tags

All shots specify framing per `references/storyboard-grammar.md`:

- ECU — Extreme Close-Up
- CU — Close-Up
- MCU — Medium Close-Up
- MS — Medium Shot
- MLS — Medium Long Shot
- LS — Long Shot
- WS — Wide Shot
- EWS — Extreme Wide Shot

"Close-up" alone is ambiguous — specify ECU/CU/MCU. Motion-graphic scenes use composition tags (full-frame, split-frame, layered) instead of framing tags; the storyboard-agent picks the convention per resolved production_mode.

## Action specificity

All actions are verb + object, not vague labels. Auto-FAIL on critic Production:

- ❌ "Show product"
- ❌ "Talk to camera"
- ❌ "Transition"
- ❌ "Cutaway"
- ❌ "B-roll"

Pass examples:

- ✓ "Hand pulls latch on case; latch click audible at 0:03"
- ✓ "Founder makes eye contact, leans into MCU framing"
- ✓ "Cut on impact — match-cut from product reveal to UI screenshot"

## Audio specification

Every audio block names either a track OR VO direction — never "use trending music" or "background music."

**Named track:**
```
Track: "Aesthetic Cafe" (TikTok ID: 7298xxxxxxxxxxx, last verified 2026-05-08)
Usage: full-piece bed, sync drop to product reveal at 0:05
```

**VO direction:**
```
VO: Founder voice, semi-casual register, mic close (less than 6 inches), slight room tone preserved.
Pacing: 165–175 wpm. Sync: line 1 lands 0:00–0:03, line 2 lands 0:05–0:08.
```

## Hook archetype tagging

Every hook variation tags an archetype from the research catalog's per-platform archetype menu:

```
Variation A: credential-flash archetype (TikTok VN dev-tools, 8/12 sample) — "10 năm code rồi, lần đầu mình..."
Variation B: contrarian-truth archetype (TikTok VN, 5/12 sample) — "Standup không phải dành cho dev. Đây là lý do."
Variation C: before-after archetype (Reels, generic) — visual cold-open of chaos → product reveal
```

If the research catalog doesn't list an archetype that fits the angle, the hook-agent flags `archetype-not-in-catalog` — orchestrator escalates to operator before shipping (it usually means the research catalog needs re-running for this niche, not that the hook is creative).

## VoC exact-quote rule

Every audience quote in the brief is reproduced VERBATIM from `research/icp-research.md`. No paraphrasing, no "tightening," no translation. Critic Brand-fit checks character-for-character match.

If a quote needs translation (e.g., VN ICP quote → EN brief for a multi-market campaign — though Critical Gate 2 of short-form-research forbids mixing markets, this skill can still produce briefs in a market different from ICP language), the brief includes BOTH the original and the translation, attributed:

```
"Standup là họp lại để báo cáo lại" (VN ICP, voice-of-customer §2.3)
  → "Standup is just meeting to report back" (translation, brief-internal)
```

## Variant "What Changed From Hero" guard

Every `variants/[platform].md` opens with a "What Changed From Hero" block. The block is the structural defense against caption-only resizing:

```
## What Changed From Hero

| Element | Hero (TikTok) | Variant (Reels) | Why |
|---|---|---|---|
| Hook archetype | credential-flash | before-after | Reels US e-com niche favors visual cold-open (9/14 sample) |
| Audio | trending track "Aesthetic Cafe" | original beat-bed | Reels Originality Score penalty (Jan 2025) on naked trending reuse |
| Caption format | first-line VoC, 4 lines max | first-line hook tease, 7 lines max | Reels caption truncation at line 4 in feed; full caption on tap |
| CTA placement | overlay at 0:20–0:25 | end-card 0:55–1:00 | Reels end-card dominance for skincare niche (sample) |
```

If the table only shows caption changes → critic Algorithm-fit auto-FAIL on the variant → re-dispatch platform-tailor-agent.

## Frontmatter field order

Per the Output Artifact Structure block in SKILL.md body. Required fields (in this order):

```yaml
type: short-form-brief
role: hero | variant
status: done | done_with_concerns | blocked | needs_context
stack: marketing
review_surface: md         # html | md | none
decision_state: not_required # pending | approved | denied | suggested | not_required
review_tool: inline        # proof | inline | roughdraft | none
reviewed_at:               # YYYY-MM-DD — empty until reviewed
reviewer:                  # who recorded the review — empty until reviewed
date: YYYY-MM-DD
slug: <kebab-case>
angle: <free text, 1 sentence>
brand_mode: founder | company
production_mode: live-action | motion-graphic | mixed
market: <region>
hero_platform: tiktok | reels | shorts | x | linkedin
variants: [list]
research_artifact: docs/forsvn/artifacts/research/research-shortform/[slug].md
research_trend_signals_date: YYYY-MM-DD
research_mechanics_date: YYYY-MM-DD
campaign_tie_in: <slug or null>
frame_direction: present | absent   # whether brand/FRAME.md grounded the frame composition
critic_passes: [hook, production, algorithm-fit, brand-fit]
critic_loop_count: 1 | 2
polish_chain_applied: vn-tone | humanmaxxing | none
pack_verified:               # YYYY-MM-DD | none — loaded platform pack's last_verified; `none` when no pack covers hero_platform (legibility)
applied_tactics: []          # specific §1/§2 tactics narrated in Format Specification; empty when pack_verified: none (legibility)
```

For variant artifacts, `role: variant` and additional field `variant_platform: <platform>`. The four review fields apply to the **hero `brief.md`** only — variant artifacts do not carry them.

The `decision_state` / `review_tool` / `reviewed_at` / `reviewer` fields are the human-review layer per [`reviewable-artifact-contract`](_shared/reviewable-artifact-contract.md). The short-form brief is a `pipeline` artifact, so `decision_state` defaults to `not_required` — most briefs are regenerable drafts. The fields and the `## Review Gate` body section ship in the hero template so the operator (or an eval loop) can opt a run into review by setting `decision_state: pending`; the procedure for running that review is [`roughdraft-review-protocol`](_shared/roughdraft-review-protocol.md). The fields are flat (the `manifest-sync` parser reads flat YAML) and additive/orthogonal to the existing schema.

## Body section headers (verbatim)

The 15 hero body sections appear in this order with these exact headers (downstream consumers — currently human producers; potentially `evaluate-shortform` if it expands — match on H2):

1. `## TL;DR for the Producer`
2. `## What This Brief Bets On`
3. `## Audience & Voice`
4. `## Format Specification`
5. `## Hook`
6. `## Storyboard`
7. `## On-Screen Text Choreography`
8. `## Audio Plan`
9. `## Caption`
10. `## CTA`
11. `## Production Notes`
12. `## What NOT To Do`
13. `## Success Criteria`
14. `## Variant Roadmap`
15. `## Review Gate`

Variant artifacts start with `## What Changed From Hero` (per Variant guard above) followed by an abbreviated section set: Hook (recut), Storyboard (delta from hero), Audio Plan, Caption, CTA. Producer reads hero + variant together; variant doesn't repeat unchanged sections. The `## Review Gate` section is on the **hero `brief.md`** only — variant artifacts do not carry it.

## Legibility block (within Format Specification)

`## Format Specification` ends with the `**Legibility — applied expertise**` block from [`_shared/legibility-convention.md`](_shared/legibility-convention.md) — it is **not** a new top-level H2 (the section count stays 15), it lives at the foot of the Format Specification body. It names the loaded platform pack + its `pack_verified` date and the **specific** tactics the brief applied (the §1 hook taxonomy + §2 format constraints the format-agent consumed — e.g., "Shorts 3-sec hook-window + burned-in caption per §2; curiosity-gap hook archetype per §1"), each traceable to a pack section, never the vibe ("optimized for Shorts"). Three states, by pack freshness:

- **Packed** — current pack: name pack, `pack_verified`, tactics, one-line why.
- **Stale** (⚠) — pack `last_verified` > 90d: same block flagged stale; treat tactics as a prior; the critic downgrades to `done_with_concerns`.
- **Absent** — no pack covers `hero_platform`: the Absent shape (general short-form principles only); **never** a native-to-platform claim. Set `pack_verified: none` + `applied_tactics: []`.

Mirror the narrated facts into the artifact's `pack_verified` / `applied_tactics` frontmatter. Each variant recut narrates its own platform's pack at the foot of its delta.

## Why-this-works block (`## What This Brief Bets On`)

Section 2, `## What This Brief Bets On`, **is** this brief's why-this-works block per
[`_shared/why-this-works-convention.md`](_shared/why-this-works-convention.md) — the brief-style
"the bet" opening the convention explicitly allows. It carries **product-fit** reasoning (distinct
from the channel-fit Legibility block in Format Specification): the one core wager, then the 2-4
load-bearing creative choices each traced to a real source — the ICP pain / VoC phrase
(`research/icp-research.md`), the brand voice/positioning (`BRAND.md` / `CREATIVE-DIRECTION.md`), or
the campaign tie-in. The bet must be **falsifiable** (what would make this video flop), so
`evaluate-shortform` can test it next cycle. No foundation → the convention's Absent state (general
principles only; never a fabricated pain or VoC quote). It stays short — it must not bury the brief.

## Review Gate block (hero only)

The hero `brief.md` ends with a `## Review Gate` block as its final section, after `## Variant Roadmap`:

```markdown
## Review Gate

- [ ] Approve
- [ ] Reject
- [ ] Suggest changes

Comments and suggested edits use Proof or inline CriticMarkup, depending on `review_tool`.
```

This is the human-review layer per [`reviewable-artifact-contract`](_shared/reviewable-artifact-contract.md); [`roughdraft-review-protocol`](_shared/roughdraft-review-protocol.md) is only the optional Markdown UI fallback. The short-form brief is a `pipeline` artifact, so frontmatter `decision_state` defaults to `not_required` — most briefs are regenerable drafts. The block and the four review frontmatter fields ship in the hero template so the operator (or a loop) can opt a run into review by setting `decision_state: pending`. The operator checks exactly one box; the agent reads it to set `decision_state`. The block and review fields are additive and orthogonal — downstream consumers match sections by H2 heading, so a new trailing heading does not affect them.

## When critic catches a format violation

Critic FAIL → re-dispatch the named source agent with the specific format rule cited. Format violations are usually one-shot fixes; do not loop past cycle 1 for format-only issues unless the underlying craft is also failing.
