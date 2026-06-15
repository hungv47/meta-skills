---
type: ad-intelligence
surface: meta-retargeting
schema_version: 1
last_verified: 2026-05-10
verifier: hungv47
source_basis: "Internal research synthesis; raw source ledger intentionally omitted from public skill package."
status: seedbank # pre-staged for ad-copy skill build (skill scaffold pending)
---

# Meta Retargeting — Warm Audience System

Per-surface reference for the **Meta retargeting** ad layer. Will be consumed by the future `write-ad` skill (not yet scaffolded — see `docs/forsvn/artifacts/meta/roadmap.md` REB-3). Until then: practitioner-grade source-of-truth for retargeting setup, warm-creative differentiation, and budget pacing.

> Scope: organic-content-driven warm audiences (IG engagers, IG followers, FB page engagers from cold-traffic ads). Not purchase-pixel retargeting (that's a different surface — abandoned cart / view-product / add-to-cart sequences). Not lookalike audiences (those are cold-traffic structure, see `meta-cold-traffic.md`).

---

## 1. Why Retargeting Diverges From Cold Traffic

The trust gap drives every downstream difference (audience structure, creative tone, offer directness, budget logic).

**Cold prospect:** zero prior exposure. Every claim evaluated with high skepticism. Ad must do positioning, trust-building, and CTA in one impression. Per Pattern basis: internal research synthesis.

**Warm prospect:** has made a *micro-commitment* — watched 60s of organic content, engaged with a post, or clicked a cold-traffic ad. The trust gap is partially closed before the first retargeting ad lands. Practical result per Pattern basis: internal research synthesis.* [pattern-derived]

**Operator implication:** retargeting creative does NOT need positioning + trust-building work. Re-using cold-creative as retargeting creative wastes the warm-audience advantage and underperforms purpose-built retargeting creative.

---

## 2. The 3 Custom Audiences

Build all three. Each captures a distinct warm-prospect segment with minimal overlap. Source advocates the trio as covering "the full surface area of the warm audience your organic content and paid ads are generating." [pattern-derived]

### Audience A — Instagram Engagers (180-day window)

| Field | Value |
|---|---|
| Source object | Instagram professional account |
| Engagement events captured | profile visits, post likes, comments, shares, saves, story interactions, DMs |
| Window | **180 days** (recommended over 30 / 365) |
| Volume profile | broadest of the three audiences |

**Why 180 specifically:** 30 days produces audiences too small for meaningful impression volume at reasonable budget; 365 includes prospects whose familiarity has faded. 180 is the recency-vs-volume balance per source. [pattern-derived]

**Compounding:** for accounts posting consistently, this audience grows monthly without additional ad-side investment.

### Audience B — Instagram Followers

| Field | Value |
|---|---|
| Source object | Instagram professional account |
| Selector | "people who follow your account" |
| Window | n/a (follow state, not event-window) |
| Intent signal | strongest of the three audiences |

**Why this differs from engagers:** a like or profile visit can be momentary. Pressing **follow** is a deliberate decision to stay in the loop on an ongoing basis — meaningfully higher intent. Per Pattern basis: internal research synthesis.

**Best-fit creative posture:** direct offer + clear CTA (book call / start trial). No warm-up needed.

### Audience C — Facebook Page Engagers

| Field | Value |
|---|---|
| Source object | Facebook page (the page running your ads) |
| Engagement events captured | clicks, comments, post interactions on cold-traffic ads |
| Window | 180 days |
| Distinct from A/B | captures cold-traffic clickers who didn't convert |

**Why this matters:** per source, *"cold traffic audiences who clicked an ad but didn't book a call are arguably the warmest non-converting prospects in your entire funnel. They saw the offer, showed enough interest to take an action, and then left without converting."* [pattern-derived]

**Best-fit timing:** retargeting impression `24-72 hours` after the original cold-ad interaction, while initial exposure is still recent. [pattern-derived]

---

## 3. Creative & Offer Requirements

### Warm vs cold objection map

The objections at the retargeting stage are NOT the cold-traffic objections. Routing creative to the wrong objection set is the most common silent failure.

| Stage | Primary objections | Creative posture |
|---|---|---|
| Cold | "I don't know who this is" / "I don't understand what they do" | positioning + trust-building + offer |
| Warm (retargeting) | **fit** ("is this right for *my* situation"), **deeper credibility** ("have they done this for someone like me specifically"), **timing** ("is right now the right time to act") | direct offer, specific case-study evidence, clear reason to act now |

**Anti-pattern:** rerunning cold-creative as retargeting creative. Burns the warm-audience advantage; under-converts.

### Offer–positioning consistency

Per Pattern basis: internal research synthesis.* [pattern-derived]

**Operator check before launch:** if the retargeting offer wouldn't read as a natural next step from the last 4-6 organic posts the audience saw, rewrite the offer or the recent organic — don't ship the mismatch.

### Format-fit shortlist (B2B agency context)

Per source, top performers for B2B agency retargeting specifically: [pattern-derived]
1. **Talking-head ads** — direct address; reference the content the audience has been watching.
2. **Social-proof-forward ads** — lead with a specific client result, NOT a positioning statement.
3. **Direct-offer ads** — present service / deliverable / CTA with minimal warm-up.

Cross-vertical applicability: format shortlist is B2B-agency-specific. Don't blindly transfer to DTC/SaaS/apps without re-validating against retargeting creative observed in those verticals.

---

## 4. Budget Allocation

Retargeting has a **natural ceiling** set by audience size — too much spend against a small audience drives frequency up, engagement down, and burns the audience.

| Stage | Daily budget | Audience-size context | Frequency target |
|---|---|---|---|
| Starter | `$20-50/day` | small warm audiences (early posting + early cold-traffic) | <2-3 impressions per person per week |
| Mature | `$100-200/day` | thousands across all 3 audiences combined; consistent posting + meaningful cold spend over 6-12 months | same frequency target — refresh creative or pull back budget if exceeded |

[clem-2026 — both ranges]

**Frequency monitor:** check weekly. Above 2-3 impressions per person per week = either creative refresh or pull back budget. [pattern-derived]

### Allocation sanity check

Source frames this as an illustrative ratio, not a benchmark to copy:

> *"If your cold traffic CAC is $2,000 and your retargeting CAC is $500, the retargeting budget is generating 4x the clients per dollar of spend, and the allocation should reflect that efficiency difference rather than being treated as a small supplementary spend on top of the cold traffic budget."* [pattern-derived]

**The numbers are illustrative.** Do not import the `$2k / $500 / 4x` figures as in-house benchmarks — they're a teaching example, not a measured median. The principle (allocate proportional to measured efficiency, not by tradition) is what travels.

---

## 5. Setup — Meta Ads Manager (4 steps)

Per source, full setup completes in a few hours the first time through. [pattern-derived]

1. **Create the 3 custom audiences.** Audiences → Create Audience → Custom Audience.
 - IG Engagers: source `Instagram account` → "everyone who engaged with your professional account" → 180-day window.
 - IG Followers: source `Instagram account` → "people who follow your account."
 - FB Page Engagers: source `Facebook page` → "everyone who engaged with your page" → 180-day window.
2. **Build the retargeting campaign.** New campaign with `conversions` or `leads` objective (depending on whether optimizing for booked calls or form fills). Ad-set audience targeting → select all 3 custom audiences. **Exclude existing client list** to avoid spending retargeting budget on already-converted prospects.
3. **Build creative.** ≥2-3 retargeting-specific creatives, distinct from cold creative in tone (shorter, more direct).
4. **Set budget + monitor frequency.** Start at the starter range above; adjust after week 1 based on frequency.

---

## 6. Compounding Effect

The retargeting system improves as a proportion of total marketing spend over time, because the warm-audience pools grow continuously without additional acquisition-side investment as long as you keep posting organic + running cold traffic. Per Pattern basis: internal research synthesis.* [pattern-derived]

**Operator implication:** set retargeting up early, while audiences are small, to build the creative-iteration history that makes the system productive once audiences scale. Don't wait for audiences to be "big enough" — the iteration history is the unlock, not the audience size at launch.

---

## 7. Failure Modes

| Pattern | Symptom | Root cause | Fix |
|---|---|---|---|
| Cold-creative reused as retargeting | low conversion despite warm audience | creative addresses cold objections (awareness, positioning) when warm objections are different (fit, credibility, timing) | rebuild retargeting creative against the warm-objection map (§3) |
| Frequency creep | engagement drops over weeks; CPM rises | audience too small for budget; same people seeing same ads | refresh creative OR pull budget until audiences grow |
| Offer–content mismatch | warm audience clicks at low rate even on direct offers | retargeting offer doesn't read as next step from recent organic | rewrite offer or align organic; don't ship the mismatch |
| Treating retargeting as supplementary | small fixed budget regardless of efficiency | allocation by tradition, not measured CPA | re-allocate proportional to retargeting-vs-cold CAC delta |
| Window-too-tight (30d) | audience too small to sustain campaign | recency over-prioritized vs volume | use 180d default; only tighten if audience size genuinely allows |
| Window-too-loose (365d) | low conversion at full budget | stale prospects whose familiarity has faded | tighten back to 180d |
| No exclusion of existing clients | retargeting budget converting people who already converted | ad-set audience targeting omitted client-list exclusion | exclude client list at ad-set level |

---

## 8. Sources

**Source confidence:** secondary (named practitioner, disclosed cohort + scale, but single-source for the audience-specific claims). Pair with platform-doc verification before adopting any specific budget threshold or window as an in-house default. Numeric examples (`$2k cold / $500 retargeting / 4x`) are illustrative, not benchmarks.

**Last verified:** 2026-05-10. Next verification trigger: when ad-copy skill scaffolds OR Meta makes a material attribution / audience-window change (whichever first).
