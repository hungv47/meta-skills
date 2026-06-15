---
type: ad-intelligence
surface: meta-cold-traffic
schema_version: 1
last_verified: 2026-05-10
verifier: hungv47
source_basis: "Internal research synthesis; raw source ledger intentionally omitted from public skill package."
status: seedbank # pre-staged for ad-copy skill build (skill scaffold pending)
---

# Meta Cold Traffic — Subscription Apps Playbook

Per-surface reference for **Meta cold-traffic acquisition**, specifically subscription apps. Will be consumed by the future `write-ad` skill (not yet scaffolded — see `docs/forsvn/artifacts/meta/roadmap.md` REB-3). Until then: practitioner-grade source-of-truth for campaign structure, conversion-event choice, and attribution against subscription-app unit economics.

> Scope: subscription apps (free trial → paid annual). Not B2C ecom (different attribution surface, different LTV math). Not B2B SaaS (different conversion event, different sales cycle). Cross-vertical applicability of structural choices (2-campaign structure, broad targeting) noted in §6 with explicit caveats.

---

## 1. Pre-Conditions Before Cold Paid

Per source, paid is **not the first move**. Three contiguous bullets from the source make the case (rendered here as separate quotes to preserve source's bullet boundaries — see §7 source-attribution convention): [pattern-derived]

> *"Don't start with paid ads if you're broke — start with organic/UGC first."*
> *"Paid ads work best as a second channel after you already have brand awareness."*
> *"Having influencer content everywhere first = warmer audiences when ads hit."*

| internal | Why |
|---|---|
| Brand-awareness layer (organic / UGC / influencer) is producing measurable reach | warm audiences convert from paid at materially higher rates than fully cold ones |
| Product is profitable on first-year revenue (or close) at expected CPA | source frame: "Must be profitable on first-year revenue, especially if bootstrapped" [pattern-derived] |
| Founder has spent `$50-100/day` learning the platform hands-on | source recommendation: "Spend $50-100/day just experimenting and learning how the platforms work" → "learn the 20% that drives 80% of results" before hiring [pattern-derived] |

**Operator implication:** the source frames the influencer→paid-ads sequence as the unlock. Combined revenue (`$2M/mo influencer-only → $5.7M/mo with paid added`) is presented as evidence that the combination scales beyond either channel alone. [pattern-derived]

---

## 2. Campaign Structure (Two Campaigns, Always)

Per source, the entire scaled-app paid-Meta structure is two campaigns. No more. [pattern-derived]

| Campaign | Type | Purpose |
|---|---|---|
| **Scale** | CBO (Campaign Budget Optimization) | where the money lives; runs proven creative |
| **Testing** | (separate) | where new creative gets tested before graduating winners to Scale |

**What is explicitly out:**
- No interest-group targeting.
- No lookalike audiences.
- No retargeting *settings* (handled differently — see §3 below).

Per Pattern basis: internal research synthesis.* [pattern-derived]

### Targeting

**Broad targeting**, full geography of the launch market. Source frames the algorithm change explicitly: post-Andromeda Meta update, the algorithm is good enough to find the right people via creative — not via settings. [pattern-derived]

**Operator check:** the "broad targeting" recommendation is current as of source date (2026-05-08 source dump). When ad-copy skill scaffolds, re-verify that Andromeda-era guidance still holds — Meta's algorithm posture shifts on quarter cadences.

### Retargeting Without Settings

Per Pattern basis: internal research synthesis.* — the algorithm naturally serves to people who've engaged before. Source claims this is *"simpler and often works better than technical retargeting setups"* for subscription apps specifically. [pattern-derived]

**Cross-link:** for B2B agency retargeting (different surface, different setup, different objection map), see `meta-retargeting.md`. Don't conflate the two — Cali's "in-creative retargeting" is an apps-specific shortcut; Clem's 3-audience retargeting is a B2B-agency formal structure. Different verticals, different answers.

---

## 3. Conversion-Event Choice (Trial-Start, Not Purchase)

The single highest-leverage configuration choice for subscription apps. Optimize for **start a free trial**, NOT for purchase.

**Why** (source-stated, three contiguous bullets — preserved as separate quotes per §7 convention): [pattern-derived]

> *"Apple's privacy rules only allow high-quality signal data in the first 24 hours."*
> *"With a 3-day free trial, purchase data arrives too late for Facebook to learn from."*
> *"So optimize for trial starts, then model out: 'at X cost per trial start, we know it's profitable.'"*

### Operator workflow

1. Set conversion event = `trial_start`.
2. Measure CPA against trial starts (the only signal Meta's algorithm gets in the 24h window).
3. Maintain a separate model: `trial_start → paid_conversion` rate (your own measurement, not Meta's).
4. Forward-model profitability: `trial_start_CPA × (1 / trial→paid_rate) < first_year_revenue` → green.

### Source-disclosed unit economics example

Per source, illustrative for the company in question (NOT a generic benchmark):

| Metric | Value (cali-apps source) |
|---|---|
| Subscription price | $30/year |
| Industry retention (annual health/fitness subs) | ~30% (70% churn) |
| Profitability frame | first-year revenue must cover CPA |

Use these as a worked example, not as your in-house defaults. Vertical-specific (health/fitness apps) and timeframe-specific. [pattern-derived]

---

## 4. Attribution

Subscription apps need 3-layer attribution. Per source, no single layer is sufficient. [pattern-derived]

### Layer A — Custom Product Pages (the "key sauce" per source)

| Mechanism | Detail |
|---|---|
| Source | App Store custom product pages |
| Setup | each ad set's destination URL points to a unique custom product page |
| Tracking | each custom product page tracks its own revenue independently |
| Adjustment | source heuristic: multiply tracked revenue by `~1.3x` (accounts for ~30% who see ad, don't click, search app store manually later) [pattern-derived] |
| Best use case | separating influencer revenue from paid-ad revenue (paid ads → custom page; organic → main App Store page) |
| Limitation | hard to manage at scale with hundreds of ads |

**Operator check on the 1.3x:** source-stated rule of thumb, presented without disclosed methodology. Treat as starting heuristic; calibrate against your own incrementality test (Layer C) within first 60 days of paid spend.

### Layer B — MMP (Mobile Measurement Partner)

Per Pattern basis: internal research synthesis.

> *"Supposed to give clear data but there's significant drop-off."*
> *"Still necessary — you need an MMP for apps."*

### Layer C — Incrementality Testing (the noise-cutter)

Per source — simple, powerful, source's recommended noise-cut on attribution disputes: [pattern-derived]
1. Turn off a channel for a few days.
2. Turn it back on.
3. Measure the revenue difference.

The delta is the channel's true incremental value. *"Cuts through all the attribution noise."*

---

## 5. Anti-Patterns (Source-Tagged)

| Pattern | Why it fails | Source |
|---|---|---|
| Agency before learning the basics | Agency capped at `$5K/day` for source — couldn't scale further. *"Agencies never care as much as someone living and breathing the product daily."* | [pattern-derived] |
| Overcomplicated campaign structure | "Most toggles are traps." Settings drag attention away from the actual lever (creative). | [pattern-derived] |
| Lookalike audiences (post-Andromeda) | "5 years ago: lookalike audiences were everything. Now: creative is everything." Algorithm targets via creative. | [pattern-derived] |
| Optimizing for purchase on a 3-day trial subscription | Apple privacy 24h signal window — purchase data arrives too late for Meta to learn from. Burns optimization signal. | [pattern-derived] |
| Repurposing influencer UGC as ads | Capped at `$10-15K/day` spend ceiling for source. Too subtle for paid placement. (See `creative-cadence.md` for full creative-format treatment.) | [pattern-derived] |
| Skipping MMP because it's "lossy" | MMP is structurally lossy but still required for apps; pair with custom product pages + incrementality. | [pattern-derived] |

---

## 6. Cross-Vertical Applicability

Per-element transferability when ad-copy expands beyond subscription apps:

| Element | Apps (source vertical) | DTC ecom | B2B SaaS |
|---|---|---|---|
| 2-campaign structure (Scale CBO + Testing) | ✓ direct | ✓ direct (well-established in DTC) | partial — long sales cycle changes optimization unit |
| Broad targeting + algo-via-creative | ✓ direct | ✓ direct | partial — niche B2B audiences may still benefit from interest seeds |
| Trial-start conversion event | ✓ apps-specific (Apple 24h signal) | n/a — purchase is the event | n/a — different funnel (demo / signup / SQL) |
| Custom product pages | ✓ apps-only (App Store mechanic) | n/a — equivalent is product-page UTMs | n/a |
| MMP (AppsFlyer) | ✓ apps-only | n/a — pixel is enough | n/a |
| Incrementality testing | ✓ universal | ✓ universal | ✓ universal |
| In-creative retargeting | ✓ source-validated for apps | unknown — re-verify | unknown — for B2B see `meta-retargeting.md` instead |

**Operator implication:** when ad-copy skill builds, do not silently extend apps-specific mechanics (trial-start, custom product pages, MMP) to other verticals. They're load-bearing for subscription apps and irrelevant or replaceable elsewhere.

---

## 7. Sources

- **cali-apps** — "Paid Ads for Apps" notes from operator's idea vault, attributed to Cali (subscription-app operator who scaled `$2M/mo influencer-only` → `$5.7M/mo` with paid layer; in-house ads run by named individual Zach after agency $5K/day cap). Local file: `playbook-apps-paid-ads.md`. Accessed 2026-05-08.

**Source-attribution convention.** The cali-apps source is structured as bulleted notes; this doc preserves the bullet boundaries when quoting (each source bullet renders as its own blockquote, in source order). Quotes are never stitched across bullet boundaries with sentence punctuation — that would render as a contiguous-prose quote when the source uses bullets, which violates the stack's anti-fabrication rule (every direct quote in a blockquote must actually appear in the named source). When multiple bullets carry one logical claim, they appear as a sequence of adjacent blockquotes.

**Source confidence:** secondary (named practitioner with explicit before/after revenue delta and scale disclosure: `$40K/day spend` ceiling reached with dedicated ad creative). Single-source for the apps-specific mechanics; the structural patterns (2-campaign, broad targeting, incrementality) are echoed in adjacent practitioner sources but not independently verified inside this stack at v0.1 of this seedbank.

**Last verified:** 2026-05-10. Next verification trigger: when ad-copy skill scaffolds OR Apple changes app-attribution privacy rules OR Meta makes a material algorithm change post-Andromeda (whichever first).
