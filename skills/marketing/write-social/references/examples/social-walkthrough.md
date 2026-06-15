# Examples — social-copy Walkthrough (LinkedIn, Founder Voice)

> Illustrative end-to-end run through the 3-agent dispatch graph (copywriter → format-checker → critic). Not prescriptive — copy choices below show CRAFT decisions a strong agent would make, not a template to reproduce. The procedural shape (Cold Start → dispatch → format-check → critic → artifact assembly → polish-chain decision) IS the contract.

Per `references/examples.md` for the per-platform strong/weak example catalog (1 strong + 1 weak per platform × 5 platforms = 10 examples). This walkthrough complements the catalog by tracing the orchestrator's dispatch sequence end-to-end on a single representative run.

---

## 0. Invocation

```
/write-social linkedin --variants 2 --goal click
```

Topic supplied in conversation: *"explain why our 3-person team retired the entire HubSpot stack for a $200/mo founder-built workflow."*

---

## 1. Pre-Dispatch — auto-scan + Warm/Cold Start

Orchestrator auto-scans:

- `research/product-context.md` — found. Product: `solo-built CRM workflow`; Voice: `direct, technical, warm`; Primary CTA: `Start free trial`.
- `research/icp-research.md` — found. Persona 1: `The Overwhelmed Founder` (3–10 person startup teams, "I can't justify $1K/mo for software my 3 people barely use"). Pain Profile: "HubSpot bills shock us monthly," "We use 5% of the features."
- `brand/BRAND.md` — found. Mode: `founder` (declared explicitly). Lexicon: prefer "founder," "solo-built," "ship," "stack." Banned: "leverage," "synergy," "innovative."
- `experience/goals.md` — found. Recent campaign goal: `click` (consistent with operator's --goal flag).

Resolution: Warm Start. Platform (linkedin) + audience (Overwhelmed Founder) + brand_mode (founder) + goal (click) resolved from scan + flag. Topic was supplied inline. Cold Start questions 1, 3, 4, 5 skipped; Q2 was the operator's inline topic.

**Warm Start prompt emitted:**

```
Found:
- platform → linkedin (from /write-social flag)
- audience → "The Overwhelmed Founder" (from research/icp-research.md)
- brand_mode → founder (from brand/BRAND.md)
- goal → click (from --goal flag)
- topic → "explain why our 3-person team retired HubSpot for $200/mo
  founder-built workflow"

Confirm + proceed with variant_count=2 (A/B)?
```

Operator: `proceed`.

---

## 2. Dispatch — copywriter-agent (Step 1)

Orchestrator builds prompt:

- agents/copywriter-agent.md (full content)
- Curated context: topic + voice (`direct, technical, warm`) + lexicon + banned words + persona pain ("HubSpot bills shock us monthly") + LinkedIn §1 Hook Taxonomy excerpt (Tier 1: Contrarian Cohort Callout, Cliffhanger Numeric, Founder Receipt) + LinkedIn §3 Algorithm Signals (Dwell time / Comment density / Save rate / Share rate / Reply depth)
- variant_count: 2, goal: click

Copywriter returns:

```markdown
## Hook variants
### Variant A
Our HubSpot bill hit $1,847/month for a 3-person team using ~5% of the features.

We replaced it last quarter with a $200/mo founder-built workflow that does
more of what we actually need.

**Char count:** 196 / 3000
**Hook archetype:** Founder Receipt (Tier 1, LinkedIn) — opens with a specific
dollar figure + cohort callout (3-person team) before the reveal
**Algorithm signal targeted:** Save rate (LinkedIn §3, Signal 4) — founders
save spec/cost comparisons for later evaluation

### Variant B
If you're a founder paying for software your team barely uses, this 5-min
read might save you $20K/year.

The 3 tools, the workflow, the cost breakdown — below.

**Char count:** 175 / 3000
**Hook archetype:** Contrarian Cohort Callout (Tier 1, LinkedIn) — addresses
a specific cohort with a quantified outcome before the body
**Algorithm signal targeted:** Comment density (LinkedIn §3, Signal 2) —
"this 5-min read" framing invites in-thread back-and-forth on cost reality

## Body
The full breakdown:

1. Outbound (replaced HubSpot Marketing Hub, $720/mo) → Apollo + Lemlist:
   $97/mo combined.
2. Pipeline + lightweight CRM (replaced Sales Hub, $450/mo) → Attio: $34/mo.
3. Email + meeting scheduling (replaced Service Hub, $677/mo) → Postmark +
   Cal.com: $59/mo.

Total: $190/mo. Was: $1,847/mo. Saved: ~$20K/year.

Catch? Setup took a weekend. After that, less than HubSpot's "low-code
workflows" ever asked for.

Honest take: HubSpot is genuinely better if you're 50+ people. Below 10,
you're paying for the brand and the sales rep.

**Char count:** 614 / 3000

## CTA
Want the full setup guide (the 3 tools + how I wired them)? Comment "GUIDE"
and I'll DM it.

**Placement:** Line 14 of 16; CTA is below the ~3-line LinkedIn fold but the
opening "$1,847/month for a 3-person team" creates fold-peek pressure to
expand. Fold-peek signal validated.

## Format spec
- Format: native LinkedIn text post (no carousel)
- Aspect ratio: N/A (text post)
- Pattern-interruption density: 4 interrupts in 990 chars total = 0.4 per 100
  (numbered list × 3 = 3 format-break interrupts + 1 contrarian beat "Honest
  take") — within LinkedIn 0.5–0.9 calibration range for score 5–7, near low
  end; CTA + parenthetical aside push toward middle of range.
```

---

## 3. Dispatch — format-checker-agent (Step 2)

Orchestrator passes copywriter draft + LinkedIn §2 (hard cap 3,000 chars / soft window ~140–210 chars / truncation ~2–3 lines).

Format-checker checks:

| Rule | Result |
|---|---|
| Hard cap not exceeded | PASS (total body ~990 chars vs 3000 hard cap) |
| Hook visible in soft window | PASS (Variant A: "$1,847/month for a 3-person team" lands in first 70 chars; Variant B: cohort callout in first 80 chars) |
| CTA above truncation OR fold-peek signal | PASS (CTA below fold but "$1,847" hook creates explicit fold-peek pressure; both variants explicitly tease the body) |
| Variant char counts present + accurate | PASS (counts verified) |
| Format spec surface matches platform | PASS (native LinkedIn text post is valid) |
| Algorithm signal one of platform-intel top-5 | PASS (Save rate + Comment density both in LinkedIn §3 top-5) |

Verdict: PASS. Proceed to critic-agent.

---

## 4. Dispatch — critic-agent (Step 3)

Orchestrator passes final draft + brief + voice excerpts + `references/rubric.md` + `references/anti-patterns.md`.

Critic scores:

| Dimension | Score | Notes |
|---|---|---|
| Hook scroll-stop strength | 9 | Variant A is a textbook Founder Receipt — specific dollar figure + cohort + reveal in <200 chars. Variant B Contrarian Cohort Callout is solid but slightly weaker (no specific dollar figure until body). |
| Char/word limit compliance | 10 | All within LinkedIn 3000-char hard cap. Hook lands in soft window for both variants. |
| CTA placement vs truncation | 8 | CTA below fold but fold-peek signal is explicit + load-bearing ("$1,847/month" in hook line forces tap-to-expand for cost-curious founders). 8 not 10 because CTA is line 14 — deeper than ideal but justified by the body structure. |
| Pattern-interruption density | 7 | 0.4/100 sits at low end of LinkedIn 0.5–0.9 range for score 5–7; the contrarian beat ("Honest take") and parenthetical aside push toward middle. No over-density penalty (LinkedIn over-density is >3/100; this is well under). |
| Format compliance | 10 | Native LinkedIn text post format, hook lines visible above fold, numbered breakdown structure, CTA inline at end. No format mismatch. |
| **Total** | **44 / 50** | **pass** |

Anti-patterns triggered:
- None.

**Discrimination test:** weak brief variant ("Have you ever wondered how to save on software costs? Here are 3 tools to try.") estimated at score ~14 (Generic Hook Opener + no archetype + no algorithm signal). Strong brief (above) scored 44. Discrimination interval = 30 — passes (strong/weak zones are well-separated; rubric is calibrated).

Verdict: PASS.

---

## 5. Artifact Assembly

Orchestrator writes:

**Path:** `docs/forsvn/artifacts/marketing/copy/linkedin-2026-05-18-fire-the-hubspot-stack.md`

**Frontmatter:**

```yaml
type: social-copy-artifact
platform: linkedin
date: 2026-05-18
slug: fire-the-hubspot-stack
brand_mode: founder
goal: click
variant_count: 2
brief_source: "inline-topic: explain why our 3-person team retired HubSpot for $200/mo founder-built workflow"
platform_intel_version: 2026-05-09
critic_score: 44
critic_verdict: pass
status: done
polish_chain_applied: none
```

**Body:** the 6 sections verbatim from the critic-passed draft (Hook variants A + B, Body, CTA, Format spec, Critic verdict table, Anti-patterns triggered).

---

## 6. Post-Write Side Effects

1. Experience write-back:
   - Q2 (Topic) → append to `experience/content.md`: `Content — recent topic — "retiring HubSpot for founder-built stack"`
   - Q3 (Brand mode) → SKIPPED (already in `brand/BRAND.md`)
   - Q4 (Audience) → SKIPPED (already in `research/icp-research.md`)
   - Q5 (Goal) → append to `experience/goals.md`: `Goals — recent campaign goal — click`
2. Manifest sync: `bun scripts/manifest-sync.ts` runs; new artifact entry indexed with `type: social-copy-artifact`.

---

## 7. Polish Chain Decision

Operator did not pass `--polish-chain humanmaxxing` or `--polish-chain vn-tone`. Default `none` applies. Artifact ships as-is. Frontmatter `polish_chain_applied: none`.

If operator had passed `--polish-chain humanmaxxing`, orchestrator would invoke `humanmaxxing` skill with the artifact path. humanmaxxing would rewrite Body + CTA (preserving Hook variants A + B for A/B comparability), update frontmatter to `polish_chain_applied: humanmaxxing`, append `## Polish chain notes` section summarizing changes.

---

## 8. Completion Status

Status: **DONE**. Critic verdict `pass` (44/50, no individual dimension < 4). variant_count 2 fulfilled. No anti-patterns triggered.

---

## What this walkthrough demonstrates

- **Warm Start path** when 4 of 5 dimensions are already in artifacts (icp-research + brand-system + recent goals + invocation flag). Cold Start only for the inline topic — no 5-question grilling.
- **Tier 1 archetype + algorithm signal pairing** as the copywriter's craft decision (not a formula — the Founder Receipt + Save rate combination is specific to founder voice + LinkedIn audience; a generic agent would pick a Tier 2 archetype and miss the cohort callout).
- **Format-check as gate, not advisory** — every rule explicitly PASSes before critic sees the draft. No revision cycle needed in this walkthrough (clean copywriter output) but the rule is "max 1 revision" not "zero revisions."
- **Critic discrimination test** runs every time — the weak-brief estimation isn't optional. If both weak and strong landed in the same verdict zone, critic would flag rubric integrity, NOT silently ship a passing score.
- **Polish chain decision is operator-flag-driven** — orchestrator does NOT auto-route to humanmaxxing / vn-tone based on critic verdict. Default is `none` unless flag supplied.
- **Experience write-back is conditional** — skip when canonical sources (brand/BRAND.md, research/icp-research.md) already declare the answer. Don't overwrite icp-research-populated audience with a one-line Cold Start fallback.
