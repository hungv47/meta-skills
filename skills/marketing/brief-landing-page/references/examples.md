# Examples — Worked LP-Brief Walkthroughs

> Three worked examples — one per route — showing how the agents move information through the pipeline. **These are illustrative**, not template-perfect; real outputs will be longer per section.

---

## Example 1 — Route A: Fresh LP

**Scenario:** Indie founder is launching a new SaaS (`acmeflow.com`). No existing pricing page. ICP research and brand-system both done last week. Wants `/pricing` for q3-launch.

**Invocation:** `/brief-landing-page /pricing`

### Step 0: Pre-Dispatch
- BRAND.md + DESIGN.md present (fresh).
- ICP at `research/icp-research.md` (last week).
- Product context at `research/product-context.md` (last week).
- Tier: primary.
- **Route: A** (fresh page, no prior brief).

### Layer 1 (parallel)

**evidence-anchor-agent** (fresh page, pulling signals from ICP and campaign context):
> ICP top 3 objections:
> 1. "Pricing is opaque on most SaaS — I need to see numbers fast."
> 2. "Will this scale to 50 people without re-platforming?"
> 3. "What's the catch — what features are gated behind enterprise?"
> Top VoC phrases: "show me the price", "no contact-sales runaround", "honest pricing", "before I commit".

**brand-anchor-agent**:
> Palette anchors: #2D5A3D (primary), #F5F4EE (warm-neutral background), #FFC857 (accent).
> Type: Geist Sans display, Inter body.
> Surface: matte. **Anti-glass sacred.**
> Sacred: logo geometry, tagline ("Pricing without the runaround"), warm-neutral background as default surface.
> Voice forbidden: "leverage", "unlock", "seamlessly", "robust", "enterprise-grade", "best-in-class".
> Voice preferred: direct, specific, no-runaround.

### Layer 1.5: Hypothesis (3 candidates)

**Hypothesis A — "Receipt as hero"** (3/3)
- Claim: Buyers in this ICP arrive expecting opaque SaaS pricing. Presenting the full pricing receipt as the hero metaphor matches the tagline and lifts trust-stage conversion ≥15% on direct traffic in 4 weeks.
- Visual: Y (receipt UI as hero asset)
- Falsifiable: Y (15% lift, 4 weeks, direct traffic)
- Uniquely ours: Y (line-item billing engine + tagline both reinforce)
- Anchor: ICP objection #1 + tagline alignment.

**Hypothesis B — "Three-tier comparison-led"** (2/3)
- Claim: Show 3 tiers with full feature comparison above-fold; lifts decision speed by ≥20% on first-visit conversions.
- Visual: Y (3-column comparison)
- Falsifiable: Y
- Uniquely ours: N (every SaaS does this; not specifically anchored)
- Anchor: ICP objection #3 (gated features).

**Hypothesis C — "Calculator-led ROI"** (1/3)
- Calculator above fold → 0/3 on Uniquely Ours; we don't have unique data backing.

User picks **A** at Approval Gate 1.

### Layer 2: Architecture
- Pattern: SR-03 (Receipt / Transparency Rhythm)
- Section list: Hero (receipt) → Why Honest Pricing → 3-tier breakdown → FAQ → CTA Block (5 sections)
- Total scroll: ~440vh desktop
- Mobile: receipt hero condensed to 3-line preview + "see full receipt" tap-target above fold; CTA visible.

User approves at Approval Gate 2.

### Layer 3 (parallel)

**section-spec-agent** writes 5 section specs, each with 3 copy candidates, conversion checklist, asset slot references. Total: ~280 lines.

**asset-slot-agent** writes 4 slots:
- `hero-receipt` (1920×1080, WebP, generative via brief-graphic → image-gen)
- `og-image` (1200×630, PNG, generative)
- `tier-icon-set` (3 SVG, manual)
- `founder-portrait` (600×600, WebP, real photo)

### Layer 4: Hand-Off

handoff-agent writes 2 blocks (target = `claude-design` + `designer`):
- `handoff-claude-design.md` (~140 lines)
- `handoff-designer.md` (~210 lines)

### Layer 5 (parallel)

**Conversion critic:**
- 11/11 hard gates PASS; CP-06 n/a (no narrative ≥3 lines); CP-10 NOTE (no manufactured scarcity — advisory only)
- VERDICT: PASS

**Brand-voice critic:**
- 9/9 PASS
- Brief envelope: 412 lines (within 250–500)
- VERDICT: PASS

User approves at Approval Gate 3.

### Output
- `docs/forsvn/artifacts/marketing/brief-landing-page/pricing/brief.md` (412 lines)
- `docs/forsvn/artifacts/marketing/brief-landing-page/pricing/handoff-claude-design.md`
- `docs/forsvn/artifacts/marketing/brief-landing-page/pricing/handoff-designer.md`
- `docs/forsvn/artifacts/marketing/brief-landing-page/pricing/asset-slots/hero-receipt.prompt.md`
- `docs/forsvn/artifacts/marketing/brief-landing-page/pricing/asset-slots/og-image.prompt.md`
- Status: **DONE**

---

## Example 2 — Route B: Evidence-Anchored Redesign

**Scenario:** Same product 6 weeks post-launch. `/pricing` rev 1 underperformed. Analytics, heatmap notes, and support-ticket notes are available. Time for rev 2.

**Invocation:** `/brief-landing-page /pricing --rev=2`

### Step 0: Pre-Dispatch
- BRAND.md + DESIGN.md present.
- Post-launch evidence notes present: mobile heatmap summary, CTA click split, support-ticket themes.
- Prior brief: `docs/forsvn/artifacts/marketing/brief-landing-page/pricing/v1/brief.md`.
- **Route: B** (evidence-anchored).
- Tier: primary.

### Layer 1 (parallel)

**evidence-anchor-agent** (with post-launch evidence):
> Evidence signals (rev 1 weaknesses):
> 1. Hero receipt visual was too dense — mobile users tapped away before parsing (heatmap evidence).
> 2. CTA copy "Get my honest price" — message-match scoring fine but action ambiguity (do I see price or get a quote?).
> 3. FAQ section omitted question: "What happens if my team grows mid-cycle?" (12% of support tickets in rev 1 period asked it).
> ICP signals (refreshed): cycle/team-growth question now top objection.

**brand-anchor-agent** returns same digest as Example 1.

### Layer 1.5: Hypothesis (3 candidates)

**Hypothesis A — "Mobile-first receipt simplification"** (3/3)
- Claim: Rev 1's dense receipt hero killed mobile parse. Simplified 3-line receipt preview with progressive disclosure on tap lifts mobile conversion ≥18% in 3 weeks.
- Anchor: evidence signal #1.

**Hypothesis B — "Action-clarified CTA"** (2/3)
- Claim: Rev 1's CTA ambiguity reduced direct-action click. Splitting into "See full pricing" vs "Get my custom quote" lifts intent-routed conversion ≥12% in 3 weeks.
- Anchor: evidence signal #2.

**Hypothesis C — "Team-growth FAQ as objection section"** (3/3)
- Claim: Team-growth question is the top unaddressed objection. Promoting it from FAQ to dedicated Objection section lifts conversion on growing-team segment ≥20% in 4 weeks.
- Anchor: evidence signal #3 + ICP refresh.

User picks **C**.

### Architecture (Layer 2)

Pattern: SR-06 (Objection-Led Rhythm), since the bet is structural objection promotion.

Section list (5): Hero (receipt — kept from rev 1, simpler) → Team-Growth Objection (NEW dedicated section) → Counter-evidence (case study + cycle math) → 3-tier breakdown → CTA Block.

Mobile note: receipt hero adopts hypothesis-A-style simplification as a side effect (since A's mobile fix was right even though we picked C).

### Layer 3, 4, 5 proceed as Example 1.

**Critic outputs:**
- Conversion: 11/11 hard gates PASS (rev 2 addresses evidence signals 1, 2 partially via simplified hero; signal 3 fully via new section).
- Brand-voice: 9/9 PASS, envelope 438 lines.

### Output
- `docs/forsvn/artifacts/marketing/brief-landing-page/pricing/v2/brief.md` (438 lines)
- Companion files at `v2/`
- Status: **DONE**

---

## Example 3 — Route C: Re-run with --rev=N (mixed-critic verdict)

**Scenario:** Same product 8 weeks later. Rev 2 of `/pricing` underperformed on enterprise-tier conversion. New analytics and sales-call notes show the tier breakdown was confusing. Time for rev 3.

**Invocation:** `/brief-landing-page /pricing --rev=3`

### Step 0: Pre-Dispatch + diff
- New evidence notes: enterprise conversion segment, sales-call objections, tier-click data.
- Prior briefs: v1, v2 at `docs/forsvn/artifacts/marketing/brief-landing-page/pricing/`.
- **Route: B** (existing page redesign, evidence present).
- The `--rev=3` flag tells orchestrator to read v2 brief and diff against new evidence.

### Pipeline runs as Example 2, with one difference:

**Layer 5 — mixed verdict:**
- Conversion critic: 1 FAIL (FM-13 in features section: tier comparison table missing benefit translation per row). Verdict: FAIL.
- Brand-voice critic: 9/9 PASS. Verdict: PASS.

**Cycle 2:** orchestrator re-dispatches section-spec-agent with conversion critic feedback (only the failing CP cited).

**Cycle 2 critics:**
- Conversion: PASS (11/11 hard gates pass; CP-06 + CP-10 advisory only — tier table fixed).
- Brand-voice: FAIL (G6 envelope — brief grew to 522 lines after cycle-2 expansion).

**Cycle 2 still mixed.** Per SKILL.md verdict logic: cycle 2 mixed → DONE_WITH_CONCERNS. Brief written with the brand-voice critic's envelope concern pinned at top of `brief.md` under `## Concerns`. User shown both reports at Approval Gate 3.

User decides to ship as-is (envelope is 522 — only 22 over the ceiling, designer can absorb).

### Output
- `docs/forsvn/artifacts/marketing/brief-landing-page/pricing/v3/brief.md` (522 lines)
- `## Concerns` block at top: "Brand-voice critic G6 — brief envelope 522 lines (ceiling 500). Cycle-2 expansion to fix conversion FM-13 pushed over. Designer should skim past the conversion checklists, focus on copy slots and asset references."
- Status: **DONE_WITH_CONCERNS**

---

## What These Examples Show

1. **Route A is real-world for new products.** Don't pretend you have post-launch evidence when you don't.
2. **Route B gets stronger with real evidence.** Anchored hypotheses are sharper than vibe-hypotheses. Use analytics, recordings, experiments, support tickets, and sales-call notes when a live page exists; do not block on a separate heuristic audit.
3. **Mixed-critic verdict is normal at cycle 2.** The DONE_WITH_CONCERNS path with concerns pinned at top is the correct off-ramp — don't loop forever trying to chase 11/11 + 9/9.
4. **The brief's job is to be paste-ready.** Once approved, the user (or claude-design / designer) can build without follow-up questions. If they're asking questions, the brief failed.

---

## Anti-Examples

These would NOT pass critics:

**Anti-Hypothesis** — "We need a redesign" (no claim, no falsifiability, no anchor). Hypothesis-agent rejects; doesn't surface.

**Anti-Architecture** — Hero, value-prop, features, testimonials, FAQ, footer — generic template-default order regardless of hypothesis. Critic flags FM-16 (generic hypothesis bleed-through).

**Anti-Section-Spec** — "Hero: punchy headline." Single bare line per section, no candidates, no checklist. Auto-FAIL via FM-01.

**Anti-Asset-Slot** — Single slot named "image", no dimensions, no path, no fallback. Cannot be rendered.

**Anti-Hand-Off** — "Build a great pricing page using our brand." Target tool has nothing to work with.

If the brief looks like any of these, restart from the upstream layer.
