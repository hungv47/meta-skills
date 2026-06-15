---
title: Short-Form Brief — End-to-End Walkthrough
lifecycle: canonical
status: stable
produced_by: short-form-brief
load_class: EXAMPLE
---

# Short-Form Brief — End-to-End Walkthrough

**Load when:** an operator (human or agent) wants a complete trace of how a hero brief + variant gets produced — Pre-Dispatch → Layer 1 → Layer 1.5 → Layer 2 → critic PASS/FAIL → polish → deliver.

For two condensed reference briefs covering different (market, brand_mode, platform) combinations, see [`_examples/example-1-vn-founder-tiktok.md`](../_examples/example-1-vn-founder-tiktok.md) and [`_examples/example-2-us-company-reels-shorts.md`](../_examples/example-2-us-company-reels-shorts.md). This walkthrough traces the full orchestration; the worked examples show the resulting artifacts.

---

## Scenario

- **Operator invocation:** `/brief-shortform --platforms tiktok,reels --brand-mode founder` with angle "We replaced standups with a bot. Output went up."
- **Existing context:**
  - `research/icp-research.md` exists (VN solo dev founder ICP)
  - `brand/BRAND.md` exists (founder archetype, semi-casual VN voice)
  - `docs/forsvn/artifacts/research/research-shortform/dev-tools-vn.md` exists (8d old trends, 22d old mechanics — fresh)
  - `docs/forsvn/artifacts/marketing/campaign-plan.md` does not match this angle
- **Resolved dimensions after Pre-Dispatch:**
  - Angle: "We replaced standups with a bot. Output went up."
  - Platforms: TikTok (hero) + Reels (variant)
  - Brand mode: founder (from BRAND.md)
  - Production mode: live-action (founder default)
  - Market: VN (from research artifact)
  - Polish chain: vn-tone (spoken-line + full body) per (VN, founder)

---

## Step 1 — Pre-Dispatch (warm-start path)

Orchestrator reads in order:

1. `docs/forsvn/artifacts/research/research-shortform/dev-tools-vn.md` → found, trends 8d (fresh), mechanics 22d (fresh)
2. `brand/BRAND.md` → archetype: founder (semi-casual VN, dev-tools register)
3. `research/icp-research.md` → 3 VoC phrases pulled to context
4. `docs/forsvn/experience/content.md` → prior brand_mode lock confirms founder
5. `docs/forsvn/artifacts/marketing/campaign-plan.md` → no matching slug; no inheritance

Emit warm-start summary:

```
Found context for short-form-brief:
- research artifact: dev-tools-vn.md (trends 8d, mechanics 22d — fresh)
- brand_mode: founder | production_mode: live-action | market: VN
- platforms in research: TikTok, Reels, Shorts
Missing: angle, target platforms for this brief.
```

Operator confirms angle + platforms. No further questions.

**Write-back:** brand_mode + production_mode already present in `content.md`; no append needed.

---

## Step 2 — Layer 1 dispatch (parallel)

Orchestrator spawns 3 agents in one message:

- **Format Agent** — reads `references/_shared/platform-intelligence/tiktok.md` + `reels.md`; outputs aspect (9:16), length sweet spot (15–60s for TikTok, 30–90s for Reels), safe zones, caption format, watermark rules, audio rules.
- **VoC Extraction Agent** — reads `icp-research.md` excerpt; extracts 3 buyer phrases ("Standup là họp lại để báo cáo lại", "Mỗi sáng làm việc thật thì không có thời gian", "Output đo bằng commit chứ không phải họp"), register (semi-casual VN), sensitivity flags (none — not a regulated niche).
- **Production Mode Agent** — reads `references/production-modes.md` for live-action template; outputs talent/gear/location notes scaffold.

All three return within one round-trip.

---

## Step 3 — Layer 1.5 dispatch (parallel)

After Layer 1 merges, orchestrator spawns 4 agents in one message:

- **Hook Agent** — reads `references/_shared/hook-archetypes.md` + research's TikTok archetype menu; produces 3 variations, each tagged with a catalog archetype (credential-flash / contrarian-truth / before-after), each passing 3Q test. Recommended: credential-flash ("10 năm code rồi, lần đầu mình thấy standup chỉ là họp").
- **Storyboard Agent** — reads `references/storyboard-grammar.md`; produces shot list with timing (0:00–0:01 ECU on terminal, 0:01–0:03 cut to MCU founder, 0:03–0:08 founder verbal + UI overlay, 0:08–0:15 product reveal beat), each shot specifying framing + action.
- **Audio Agent** — outputs VO direction (semi-casual VN, 165 wpm, mic close, sync points at 0:00 + 0:08); flags one optional named track from research ("Aesthetic Cafe" TikTok ID, low-decay).
- **Copy Pack Agent** — reads `references/caption-cta-rules.md` + research's caption norms; produces TikTok caption (first-line VoC, 4 lines max) + CTA (overlay at 0:14, end-card optional).

All four return.

---

## Step 4 — Layer 2 sequential (platform-tailor, then critic)

**Platform Tailor Agent** runs (because `len(platforms) >= 2`):
- Reads hero brief + research's Reels per-platform section
- Produces `variants/reels.md` with "What Changed From Hero" table:
  - Hook archetype: credential-flash → before-after (Reels VN dev-tools sample showed before-after dominates)
  - Audio: VO + optional named track → original beat-bed (Reels Originality Score)
  - Caption: 4-line VoC tease → 7-line storytelling (Reels deeper-scroll behavior)
  - CTA: overlay at 0:14 → end-card 0:55–1:00

**Critic Agent** runs (Layer 2 final):
- Hook critic: all 3 variations pass 3Q + archetype-tagged + no AI slop → PASS
- Production critic: storyboard has timing + framing + specific actions + named track or VO direction → PASS
- Algorithm-fit critic: TikTok 0:00–0:30 within 15–60s sweet spot; captions burned-in spec'd; Reels variant addresses Originality → PASS
- Brand-fit critic: 2 VoC phrases in hero caption + 1 VoC in hook verbal; voice matches BRAND.md archetype; no generic tropes; format-fit test = punchline (product reveal IS the format's payoff at 0:08) → PASS

**Overall: PASS, cycle 1.**

---

## Step 5 — Polish chain

Per (VN, founder): `polish-vn` Layer 2 on spoken-line section + full body.

`polish-vn` runs once (full-body pass), tightens hook verbal + VO direction + caption to semi-casual VN register (báo chí → semi-casual register shift), checks particles + pronoun consistency. Returns polished hero + polished variant. No re-dispatch of craft agents.

---

## Step 6 — Deliver

Orchestrator writes:

- `docs/forsvn/artifacts/marketing/brief-shortform/standup-bot/brief.md` (hero, 14 sections per `format-conventions.md`)
- `docs/forsvn/artifacts/marketing/brief-shortform/standup-bot/variants/reels.md` (variant, abbreviated 5-section set after "What Changed From Hero")
- Frontmatter `status: done`, `critic_loop_count: 1`, `polish_chain_applied: vn-tone`, `critic_passes: [hook, production, algorithm-fit, brand-fit]`

Returns inline to operator:
```
✓ Hero brief at docs/forsvn/artifacts/marketing/brief-shortform/standup-bot/brief.md
✓ Reels variant at docs/forsvn/artifacts/marketing/brief-shortform/standup-bot/variants/reels.md
Critic: 4/4 PASS cycle 1. Polish: vn-tone applied.
DONE.
```

---

## FAIL-handling variant (Brand-fit cycle 1 FAIL)

Same scenario, but cycle 1 critic returns Brand-fit FAIL:
- Generic trope detected: "Hey guys" in hook variation B → auto-FAIL
- VoC missing: caption first-line is paraphrased, not exact ICP quote

Critic routing:
- Brand-fit: generic trope → re-dispatch `hook-agent` + `copy-pack-agent` with feedback: "Hook variation B uses 'Hey guys' — replace with credential-flash archetype opener. Caption first-line paraphrases — use exact ICP quote 'Standup là họp lại để báo cáo lại'."

Both agents re-dispatched in parallel (cycle 2). Both return. Critic re-runs:
- Hook critic: variation B now reads "10 năm code, lần đầu mình bỏ standup" — credential-flash archetype, passes 3Q → PASS
- Brand-fit critic: caption first-line now exact ICP quote → PASS

**Overall: PASS, cycle 2.** Proceed to polish chain. Status: `done` (PASS within ≤2 cycles).

If cycle 2 had ALSO failed any sub-critic → ship `done_with_concerns` with the remaining failure(s) pinned in a "Critic Concerns" block at the top of the hero artifact, plus failed sub-critic listed in `critic_passes` frontmatter as `[hook, production, algorithm-fit]` (brand-fit absent).

---

## `--fast` variant

Same scenario, operator invokes with `--fast`:
- Pre-Dispatch warm-start runs (Critical Gates supersede `--fast`)
- Layer 1 + Layer 1.5: single-pass via single-agent fallback (orchestrator executes each agent's instructions sequentially in-context, NOT via Agent tool dispatch)
- Layer 2: critic SKIPPED, platform-tailor SKIPPED if multi-platform → operator gets hero only with no variant, no critic verdict
- Polish chain: SKIPPED
- Output ends with: `Ran in --fast mode; rerun without the flag for full critique.`

`--fast` is for "quick scratch brief I'll edit by hand" — not for shipping to producers without review.
