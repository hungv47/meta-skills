# Playbook — Why Social Copy Exists

> Load this when you want to teach the skill to a new operator, when you're deciding whether to run this skill at all, or when a downstream surface (live post, ad rotation) is underperforming and you suspect the copy is platform-blind.

---

## Core Question

> **"Does this copy stop the scroll, clear all platform limits, and earn the click — on THIS platform?"**

social-copy is a horizontal marketing skill: 1 platform per artifact, 1 brief or topic per artifact, 1–3 hook variants per artifact. Its single job: turn a brief (from `brief-shortform` or `plan-campaign`) or an inline topic into platform-native social copy with enforced char/word limits, CTA placement validated against the algorithm truncation point, hook archetype compliance, and rubric scoring. 5 platforms at launch: `tiktok`, `reels`, `shorts`, `x`, `linkedin`. YouTube long-form excluded.

---

## Why this skill exists at all

Four failure modes it prevents:

1. **Platform-blind writing.** Generic hooks ("Have you ever…", "Did you know…", "In this video I'll…") that match no Tier 1 or Tier 2 archetype on any platform. Reader's brain has learned to skip them; algorithm has no differentiated signal to act on. Captured as Anti-Pattern #1 (Generic Hook Opener).
2. **Algorithm-blind CTAs.** CTA placed below the truncation line on X (280 chars visible) or LinkedIn (first 2–3 lines visible). For `goal=click`, this is a functional zero — reader never reaches the ask. Captured as Anti-Pattern #2 (Algorithm-Blind CTA).
3. **Format mismatch + char-limit-blind copy.** Carousel content delivered as a thread; long-form blog prose dropped into a vertical-video caption slot; copy written to 500 chars when the platform truncates at 280. Captured as Anti-Patterns #3 + #4.
4. **Brand-voice + format collisions.** Corporate-cliché copy when `brand_mode=founder`, or first-person diary voice when `brand_mode=company`. Pattern-interrupt monotony (same interrupt type 3+ times in a row) that flattens platform-native rhythm. Captured as Anti-Patterns #5 + #6.

The structural answer is a 3-agent dispatch (copywriter → format-checker → critic), per-platform reference catalogs at `references/_shared/platform-intelligence/[platform].md`, and a 5-dimension rubric (`references/rubric.md`).

---

## Philosophy

Short-form is the surface. Platform-intelligence is the substrate. Per-platform reference catalogs document Hook Taxonomy (Tier 1 / Tier 2 archetypes), Format Constraints (hard caps + soft visible-window), Algorithm Signals (the top-5 metrics the platform optimizes for), and Anti-Patterns (platform-specific bait penalties). Copywriter agent picks archetype + targets a signal; format-checker enforces hard caps + truncation discipline; critic scores against the 5-dimension rubric with discrimination test (weak brief MUST score <25; strong brief MUST score ≥35 — if both pass or both fail, the rubric is broken).

This is a **creative-leaning skill on the production side** (hook variants are craft — the copywriter's voice and brand-mode awareness matter more than mechanical templating). It is **structural on the format-check side** (char caps + CTA placement + format compliance are binary PASS/FAIL — the platform either accepts the copy at the specified length or it doesn't). The 5-dimension rubric checks craft floor (no generic opener, no truncation-blind CTA, no format mismatch) but doesn't enforce a house-style ceiling on hook phrasing.

---

## When NOT to use this skill

- **Paid Meta / Google / LinkedIn ad copy.** That's `write-ad` — audience-temp framing, claim substantiation, policy compliance, 7-dimension rubric, 3-variant aggregate. social-copy is organic / native only.
- **Full video brief with storyboard.** That's `brief-shortform` — hook + shot list + on-screen text + audio plan + caption + CTA + aspect + length for live-action OR motion-graphic production. social-copy generates the caption layer; short-form-brief owns the video.
- **Landing-page copy, headlines, taglines.** That's `write-copy` — horizontal across any surface (LP hero, section copy, CTA, social-proof block). social-copy is platform-native social-only.
- **Email subject lines + body, newsletter, cold-outreach DMs.** That's `email-copy` (deliverability, sequence logic) or `write-outreach` (signal-based personalization, per-channel craft).
- **LinkedIn articles, Substack posts, blog content.** Long-form prose. social-copy is short-form only — 1 visible-fold hook + body + CTA per post.
- **Multi-platform in one invocation.** Re-invoke once per platform. The platform-intelligence catalog is single-platform per artifact for a reason: Tier 1 archetypes on TikTok are not the same as Tier 1 archetypes on LinkedIn; pattern-interrupt density calibration differs per platform.
- **Multi-market in one invocation.** Re-invoke per market. Vietnamese-market copy routes through `polish-vn` via `--polish-chain vn-tone` as a terminal pass.

---

## The 5-dimension rubric

Lives in `references/rubric.md`. Summary (full thresholds + per-platform calibration in the rubric file):

| # | Dimension | Scored against |
|---|---|---|
| 1 | Hook Scroll-Stop Strength | platform-intelligence/[platform].md §1 Hook Taxonomy (Tier 1 / Tier 2 archetypes) |
| 2 | Char/Word Limit Compliance | platform-intelligence/[platform].md §2 Format Constraints (hard caps + soft visible-window) |
| 3 | CTA Placement vs Algorithm Truncation | Documented truncation point: X (280 chars), LinkedIn (~2-3 lines). TikTok/Reels/Shorts default 10 (verbal CTA). |
| 4 | Pattern-Interruption Density | Per-platform calibration: TikTok 3+/100, LinkedIn 1-2/100. Over-density penalty for LinkedIn. |
| 5 | Format Compliance | Correct surface for goal: thread vs single post (X), carousel vs text post (LinkedIn), vertical-video caption (TikTok/Reels/Shorts). |

Pass = total ≥35/50 AND no dimension scores 0. DWC = 25–34 OR any dimension below 4. Fail < 25. Critic also runs the **discrimination test** — weak brief MUST score <25, strong brief MUST score ≥35; if both pass or both fail, rubric is broken (flag).

Max 1 format-check revision loop on hard-cap violation. Two consecutive violations = FORMAT_FAIL escalated to user. No critic rewrite loop (single-pass scoring; critic verdict ships with the artifact regardless).

---

## Single-platform per artifact (load-bearing)

Multi-platform = re-invoke with a different `platform` argument. This is not editorial — Tier 1 hook archetypes are platform-specific (TikTok's POV Callout Cliffhanger doesn't exist on LinkedIn; LinkedIn's pattern-interrupt expectation is 1–2/100 vs TikTok's 3+/100). A single artifact that tries to cover multiple platforms produces compromise copy that's optimal for none. Same logic for single-market — Vietnamese register polish requires a terminal `polish-vn` pass that English-market copy doesn't need.

---

## Polish chain

Default `none`. Two opt-in terminal passes after critic verdict:

- `--polish-chain humanmaxxing` → routes critic-passed copy through `humanmaxxing` skill (AI-pattern stripping, voice injection, 15% compression target). Use for any platform where audience sensitivity to AI tells is high.
- `--polish-chain vn-tone` → routes critic-passed copy through `polish-vn` skill (Vietnamese register polish: báo chí, semi-casual, bro, pop-marketing). Required for Vietnamese-market copy.

Polish chain runs ONLY after critic verdict (`pass` or `done_with_concerns`). FORMAT_FAIL artifacts do NOT auto-route — operator must resolve format-fail manually before invoking the polish skill.

---

## Cross-stack contract (consumed downstream)

Output artifact at `docs/forsvn/artifacts/marketing/copy/[platform]-[date]-[slug].md` is consumed by:

- **Operator publish workflow** — frontmatter `platform` + `goal` + `critic_verdict` fields drive publish decisions; body sections (Hook variants A/B + Body + CTA + Format spec + Critic verdict) are the publishable payload.
- **`humanmaxxing` / `polish-vn`** (polish chain) — read the `## Body` and `## CTA` sections; rewrite in place; preserve frontmatter except adding `polish_chain_applied` field.
- **eval-loop** (when invoked inside a measurable initiative) — frontmatter `critic_score` + `critic_verdict` fields fed into `.forsvn/loops/[slug]/results.tsv` for keep/discard/watch/blocked decisions on social-copy variants.

Schema changes to the artifact frontmatter or required body sections require atomic update of polish-chain consumers and eval-loop infra. Renaming a section breaks downstream readers.

---

## Refactor history

- **2026-05-18 (v6 Phase 2 Wave 1 — marketing-stack slot 1):** body refactored 224 → 156 lines (-30.4%, 68 lines saved — smallest absolute cut in v6 program by design; baseline was already lean at 224 lines, well under marketing-stack's ≤220 target). 5 new refs: this playbook, `procedures/pre-dispatch.md`, `procedures/dispatch-mechanics.md`, `format-conventions.md`, `examples/social-walkthrough.md`. Existing `anti-patterns.md` (10 patterns) extended with 4 cross-cutting failures: #11 Polish-Chain Routed on FORMAT_FAIL/FAIL artifact; #12 Multi-Platform in One Invocation; #13 Vietnamese-Market Copy Without vn-tone Polish; #14 Cross-Stack Contract Drift. Existing `rubric.md` + `examples.md` + 7 `_shared/platform-intelligence/*.md` files untouched. 3 sub-agents (`agents/`) untouched — including the canonical 5-dimension rubric in critic-agent.md. **Creative-leaning ref pattern applied** per `implementation-roadmap/refactor/stacks/marketing.md` § "Creative ↔ structural split" — copywriter side framed as opinions/examples (Tier 1 archetypes are craft, not formulas), format-checker side strict structural (hard caps are binary). Cross-stack contract preserved BYTE-IDENTICAL:
  - 13-field frontmatter schema (type, platform, date, slug, brand_mode, goal, variant_count, brief_source, platform_intel_version, critic_score, critic_verdict, status, polish_chain_applied)
  - Body sectioned schema (Hook variants A/B + Body + CTA + Format spec + Critic verdict 6-row table + Anti-patterns triggered)
  - 5-dimension rubric (0-10 each, total /50, pass ≥35, DWC 25-34, fail <25)
  - 3-agent dispatch graph (copywriter → format-checker → critic) with max-1 format-check revision loop
  - FORMAT_FAIL escalation pattern (two consecutive violations → user)
  - Discrimination test (weak brief <25, strong brief ≥35)
  - Single-platform + single-market per artifact constraint
  - Polish chain default `none`; humanmaxxing / vn-tone terminal pass routing
  - Completion Status 4-tier (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT)
  - 5-question Cold Start prompt (platform / topic-or-brief / brand-mode / audience / goal) + Write-back map
