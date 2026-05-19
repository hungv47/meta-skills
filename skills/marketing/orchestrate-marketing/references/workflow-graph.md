# Marketing Stack Workflow Graph

Canonical pipeline definition for the marketing-skills stack. `orchestrate-marketing` reads this for routing decisions.

---

## The Pipeline

```
 ┌── copywriting (any surface)
 │
 ├── lp-brief ──→ design-brief (per slot)
 │
 ├── eval-loop ──→ lp-eval (post-launch page evidence)
brand-system ──→ campaign-plan ──→ content layer ───┤
 ├── seo (5 modes)
 │
 ├── short-form-brief ──→ social-copy (per platform)
 │ ↑
 │ └── consumes.agents/skill-artifacts/research/short-form-research/[slug].md (research-skills)
 │
 ├── ad-copy (per audience-temp — Meta only at v1)
 │
 └── cold-outreach (per touch)

 ↓
 humanize / vn-tone
 (terminal polish, optional)
```

**Foundation:** `brand-system` is the entry point. Produces `brand/BRAND.md` (voice, positioning, archetype) + `brand/DESIGN.md` (palette, tokens, components). Both consumed by every downstream content skill.

**Strategy layer:** `campaign-plan` consumes brand + ICP + (optionally) prioritize.md. Produces channel/calendar/GTM blueprint that informs the content layer.

**Content layer (parallel options):** copywriting, lp-brief, seo, short-form-brief, social-copy, ad-copy, cold-outreach. User picks based on the asset they need.

**Landing-page branch:** `lp-brief` owns new LPs, redesigns, and construction-time conversion best practices. `lp-eval` owns post-launch performance scoring, but only inside an existing `eval-loop` workspace.

**Polish layer (terminal):** `humanize` strips AI patterns from any text. `vn-tone` polishes already-translated Vietnamese into native register. Both run AFTER content production.

---

## Per-Skill Catalog

### brand-system

- **Job:** brand identity — narrative, voice, positioning, archetype, design tokens.
- **Produces:** `brand/BRAND.md`, `brand/DESIGN.md` (sometimes `brand/ASSETS.md`)
- **Consumes:** `research/product-context.md`
- **When to recommend:** no `brand/BRAND.md` AND user wants brand-foundation OR campaign-planning OR copy-production OR lp-page.
- **Cost:** $2–5 · 8 agents · deep budget · ~12 min
- **Foundation for:** every downstream marketing skill that produces customer-facing content.

### campaign-plan

- **Job:** integrated marketing plan — channel strategy, positioning, calendar, budget, GTM timeline.
- **Produces:** `.agents/skill-artifacts/mkt/campaign-plan.md`
- **Consumes:** `research/product-context.md`, `research/icp-research.md`, `.agents/skill-artifacts/meta/sketches/prioritize-*.md` (optional), `.agents/skill-artifacts/mkt/content-research.md` (optional)
- **When to recommend:** brand done; user wants campaign-planning intent.
- **Cost:** $1–3 · 6 agents · deep budget · ~10 min

### copywriting

- **Job:** write or evaluate persuasive copy — headlines, hooks, CTAs, taglines, section copy. Produces ranked alternatives with rubric scoring.
- **Produces:** `.agents/skill-artifacts/mkt/content/[slug].copy.md`
- **Consumes:** `research/product-context.md`, `research/icp-research.md`, `.agents/skill-artifacts/mkt/campaign-plan.md` (optional), `.agents/skill-artifacts/mkt/content-research.md` (optional)
- **When to recommend:** copy-production intent. Works without campaign-plan but sharper with it.
- **Cost:** $1–3 · 9 agents · deep budget · ~10 min

### lp-brief

- **Job:** campaign-grade landing page brief — hypothesis, surface rhythm, section spec, asset slots, copy candidates, hand-off prompts, conversion-principles gate.
- **Produces:** `.agents/skill-artifacts/mkt/lp-brief/[slug]/brief.md`, `.agents/skill-artifacts/mkt/lp-brief/[slug]/asset-slots/*.prompt.md`
- **Consumes:** `research/product-context.md`, `research/icp-research.md`, `brand/BRAND.md`, `brand/DESIGN.md`, `.agents/skill-artifacts/mkt/campaign-plan.md`, page state / post-launch evidence (optional)
- **When to recommend:** lp-page intent + brand done.
- **Cost:** $2–4 · 9 agents · deep budget · ~12 min
- **Hard-gated:** without brand artifacts, recommends brand-system first.

### lp-eval

- **Job:** post-launch landing-page evaluation from real metric evidence — conversion analytics, experiment results, recordings/heatmaps, form-funnel data, or operator-supplied metric notes.
- **Produces:** `skills-resources/loops/[slug]/evals/[date]-cycle-N.md`, appends `skills-resources/loops/[slug]/results.tsv`, may promote high-confidence lessons to `skills-resources/loops/[slug]/learnings.md`
- **Consumes:** `skills-resources/loops/[slug]/program.md`, `context.md`, prior `results.tsv`, loop `strategy/` + `execution/`, page URL/route, metric source/window/value
- **When to recommend:** lp-eval intent + existing eval loop. If no loop exists, recommend `eval-loop` first.
- **Cost:** $0.75–1.50 · 4 agents · standard budget · ~6 min
- **Hard-gated:** no existing loop, no primary metric value/source/window, or generic heuristic audit request without measurement evidence.

### design-brief

- **Job:** per-asset graphic design brief — IG carousel/post/story, LinkedIn doc/single, FB ad, YouTube thumbnail, X card, banner/display, OOH, OG card.
- **Produces:** `.agents/skill-artifacts/mkt/design-briefs/[slug].md`
- **Consumes:** `brand/BRAND.md`, `brand/DESIGN.md`, `brand/ASSETS.md`, `.agents/skill-artifacts/mkt/lp-brief/[slug]/asset-slots/*.md`, `.agents/skill-artifacts/mkt/content/[slug].copy.md`
- **When to recommend:** specific asset slot or graphic asset request. Often invoked after lp-brief on an asset slot.
- **Cost:** $1–2 · 7 agents · standard budget · ~6 min
- **Hard-gated:** without brand, recommends brand-system first.

### seo

- **Job:** search visibility — 5 modes (audit / ai / programmatic / competitor / aso).
- **Produces:** `.agents/skill-artifacts/mkt/seo-[mode].md`
- **Consumes:** `research/product-context.md`, `research/icp-research.md`, `.agents/skill-artifacts/mkt/campaign-plan.md` (optional)
- **When to recommend:** search-visibility intent. Ask user which mode.
- **Cost:** $2–5 · 11 agents · deep budget · ~15 min

### short-form-brief

- **Job:** production-ready video brief — hook, shot list, on-screen text, audio plan, caption, CTA, aspect, length. Live-action OR motion-graphic. Hero + max 2 platform variants per call.
- **Produces:** `.agents/skill-artifacts/mkt/short-form-brief/[slug]/brief.md`, `[slug]/variants/[platform].md`
- **Consumes:** matching `.agents/skill-artifacts/research/short-form-research/[slug].md` (from research-skills), `research/icp-research.md`, `brand/BRAND.md`
- **When to recommend:** short-form-video intent. Hard-gated on a matching short-form-research catalog.
- **Cost:** $1–3 · 9 agents · deep budget · ~10 min

### social-copy

- **Job:** platform-native social post copy — A/B hook variants, body, CTA, format spec for tiktok / reels / shorts / x / linkedin. Single-platform per invocation. Char-limit + CTA-truncation enforced; 5-dim critic rubric.
- **Produces:** `.agents/skill-artifacts/mkt/copy/[platform]-[date]-[slug].md`
- **Consumes:** `.agents/skill-artifacts/mkt/short-form-brief/[slug]/brief.md` OR inline topic; `brand/BRAND.md`; `references/_shared/platform-intelligence/[platform].md`
- **When to recommend:** social-post intent (user has a topic / brief and wants ready-to-publish copy for a specific platform). Distinct from `copywriting` (horizontal — any surface, no per-platform format enforcement) and `short-form-brief` (per-asset video brief, not the post copy itself).
- **Cost:** $0.50–1.50 · 3 agents · standard budget · ~5 min
- **Polish chain:** `polish_chain=humanize| internal |none` (default `none`).

### ad-copy

- **Job:** Meta paid-ad copy (retargeting + cold-traffic) — hero + 2 variants per audience-temperature with audience-temp framing, hard char-cap enforcement, policy/claim substantiation, 6-dim rubric scoring, automatic humanize terminal pass per variant.
- **Produces:** `.agents/skill-artifacts/mkt/ad-copy/[pattern-derived]-[date]-[slug].md`, `[slug].rationale.md`, `[slug].critic-score.md`
- **Consumes:** `research/product-context.md`, `research/icp-research.md`, `.agents/skill-artifacts/mkt/campaign-plan.md`, `brand/BRAND.md`; per-surface practitioner refs at `references/_shared/ad-intelligence/{meta-retargeting,meta-cold-traffic,creative-cadence}.md`
- **When to recommend:** paid-ads intent (Meta retargeting OR cold-traffic). Single audience-temperature per invocation — run twice for campaigns spanning both. Google RSA / LinkedIn / TikTok Ads NOT in v1 (refs not pre-staged).
- **Cost:** $1–2 · 5 agents · deep budget · ~10 min

### cold-outreach

- **Job:** cold email / LinkedIn DM / X DM / iMessage / SMS / proposal composition with signal-based personalization, 5-dimension rubric scoring, automatic humanize terminal pass.
- **Produces:** `.agents/skill-artifacts/mkt/cold-outreach/[slug].md`, `[slug].rationale.md`, `[slug].critic-score.md`
- **Consumes:** `research/product-context.md`, `research/icp-research.md`
- **When to recommend:** outbound intent. Hard requires icp-research.md.
- **Cost:** $0.50–1.50 · 8 agents · deep budget · ~8 min

### humanize

- **Job:** strip AI patterns, inject brand voice, compress (15%+ word reduction with zero idea loss).
- **Produces:** `.agents/skill-artifacts/mkt/content/[slug].humanized.md`
- **Consumes:** `research/product-context.md`, `.agents/skill-artifacts/mkt/content/[slug].md` (input text)
- **When to recommend:** text-polish intent OR after copywriting on user-facing copy.
- **Cost:** $0.15–0.40 · 6 agents · standard budget · ~3 min

### vn-tone

- **Job:** polish already-translated Vietnamese into native register (báo chí, semi-casual, bro, pop-marketing). Post-translation only — does NOT translate.
- **Produces:** `.agents/skill-artifacts/mkt/content/[slug].vn-tone.md`
- **Consumes:** `research/product-context.md`, `.agents/skill-artifacts/mkt/content/[slug].humanized.md` OR `[slug].md`
- **When to recommend:** vn-polish intent (text is already in VN, sounds translationese).
- **Cost:** $0.08–0.20 · 3 agents · standard budget · ~2 min

---

## Routing Rules (decision tree)

```
1. Read state. Critical gates:
 - no research/product-context.md → defer to /orchestrate-research
 - no brand/BRAND.md AND intent in {brand, campaign, copy, lp-page} → propose brand-system

2. Parse user intent → bucket (see Step 2 in SKILL.md)

3. Apply pipeline routing (first match):
 a. brand-foundation → brand-system
 b. campaign-planning → campaign-plan (gate: brand)
 c. copy-production → copywriting (soft-gate: brand + campaign)
 d. lp-page → lp-brief (gate: brand)
 e. lp-eval → lp-eval if loop exists; otherwise eval-loop first
 f. search-visibility → seo (ask mode)
 g. short-form-video → short-form-brief (gate: short-form-research)
 h. social-post → social-copy (soft-gate: short-form-brief OR brand; ask which platform)
 i. paid-ads → ad-copy (gate: icp; ask audience-temp — retargeting OR cold)
 j. outbound → cold-outreach (gate: icp)
 k. text-polish → humanize
 l. vn-polish → vn-tone

4. Polish chain hint:
 - If output of recommended skill is user-facing copy in EN → mention humanize as terminal step.
 - If output is in VN AND brand_mode=founder OR audience experience says VN market → mention vn-tone as terminal step.

5. Present (1–3 max). Wait for user confirmation. Append breadcrumb.
```

---

## Polish Chain Logic

After any content-producing skill, the natural terminal pass is:
- **EN content (any audience):** copywriting/lp-brief/cold-outreach → humanize
- **VN content (founder voice or VN market):** humanize → vn-tone
- **Cold-outreach:** automatic humanize terminal pass already runs inside cold-outreach itself; no need to recommend humanize after it. But mention vn-tone if VN.

`/orchestrate-marketing` should mention the polish chain in the proposal but NOT auto-include it. User decides whether to run polish after.

---

## Stale Detection

- `brand/BRAND.md` mtime > 180 days → flag stale.
- Brand positioning in `BRAND.md` contradicts current `CLAUDE.md` description → flag stale.
- `campaign-plan.md` mtime > 90 days → flag stale (campaigns expire fast).
- Stale = warning, not forced re-run.

---

## Re-Entry Behavior

`/orchestrate-marketing` is idempotent. When the breadcrumb shows "user confirmed: campaign-plan" and `.agents/skill-artifacts/mkt/campaign-plan.md` now exists, advance to the next step (typically copywriting or lp-brief based on current intent).

If recommended skill never produced its artifact, surface that.

---

## Anti-Patterns

- Don't recommend more than 3 skills.
- Don't lecture. Show only what's relevant.
- Don't auto-invoke. Always print `/skill-name` for the user to type.
- Don't recommend cross-stack skills directly (icp-research, prioritize) — defer to `/orchestrate-research`.
- Don't bypass the brand gate. The pipeline assumes brand foundation.
