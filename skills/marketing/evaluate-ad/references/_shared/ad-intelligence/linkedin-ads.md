<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: ad-intelligence
surface: linkedin-ads
schema_version: 1
last_verified: 2026-06-20
verifier: hungv47
source_basis: "LinkedIn Campaign Manager + Advertising Policies (linkedin.com/legal/ads-policy, business.linkedin.com) synthesized with practitioner B2B paid structure (targeting modes, Lead Gen Forms, CPC economics); raw source ledger intentionally omitted from the public skill package. Convention-level mechanics tagged [pattern-derived]."
status: draft
---

# LinkedIn Ads — Ad-Intelligence Surface

Per-network reference for **paid LinkedIn**. Loaded by `write-ad` when `network: linkedin-ads`. LinkedIn is **B2B, high-CPC, account-targeted**: you pay a premium ($5–$15+ CPC is normal) to reach a precise professional, so the copy must earn the click with a **job-relevant, substantiated** claim — hype is punished by both the audience and the policy floor. The strategist branches on **targeting-mode** (§0), not audience-temp.

> Scope: Single Image / Document / Sponsored Content + an aside on Message/Conversation ads. The indie B2B ICP's first LinkedIn move. Dynamic, Text, and Event ads are deferred (§6).

---

## 0. Framing axis — targeting-mode (the strategist branch)

Who you reach sets the angle, the proof, and whether the spend is justified:

| targeting-mode | What it is | Copy job |
|---|---|---|
| **job-title / function + seniority** | reach a role (e.g. "Head of RevOps", Director+) | speak to that role's KPI; the proof must be the metric they're measured on |
| **company-list (ABM)** | upload a named account list | named-account relevance; reference the segment ("for Series-A fintechs") — tightest, most expensive |
| **matched-audience (retargeting)** | site visitors / contact-list / engaged | warm; the only LinkedIn tier where a harder CTA fits |

One targeting-mode per artifact. A single ad written for "everyone in SaaS" wastes LinkedIn's one advantage — precision.

---

## 1. Pre-conditions — is paid LinkedIn the move here?

LinkedIn's floor CPCs make it the **wrong** channel for most low-ACV / consumer offers. [pattern-derived]

| Condition | Why it gates |
|---|---|
| **ACV / LTV absorbs a high CPC + long-ish cycle** | at $8–$12 CPC and B2B CVRs, a low-ticket product can't make the math work — **veto**; send them to Search/Meta |
| The buyer is **identifiable by professional attributes** | if "job title + company" doesn't describe your buyer, LinkedIn's targeting premium is wasted |
| You have a **substantiated business claim** (case study / metric) | LinkedIn's audience + policy both reject unbacked ROI; with nothing to substantiate, the ad can't clear the floor — **veto** |
| There's a real B2B consideration motion (demo / content → nurture) | LinkedIn rarely closes cold; budget it as pipeline, not last-click |

If ACV is low OR the buyer isn't role-identifiable OR there's no substantiated claim, recommend `plan-campaign` / a cheaper channel — do not draft. This is the channel-fit veto for LinkedIn.

---

## 2. Campaign structure + formats

| Format | Best for |
|---|---|
| **Single Image (Sponsored)** | the workhorse — one strong claim + image; start here |
| **Document ad** | gated value (a teardown/checklist) — strong for lead capture + dwell time |
| **Conversation / Message ad** | warm/ABM lists; a direct, opt-in-feeling DM (respect frequency — easy to annoy) |

- **Intro-text discipline:** the hook + the substantiated claim must land in the **first ~150 characters** (before "…see more"); the headline (≤~70 visible) does the standalone work. (Caps: `format-spec.md` § LinkedIn.)
- **Hero + 2 variants, each a different angle** over the same offer (KPI-benefit / proof-case-study / objection-handle), within ONE targeting-mode.
- **Frequency:** LinkedIn audiences are small and expensive — cap frequency and refresh creative before fatigue (a stale ad to a 20k-account audience burns fast).

---

## 3. Conversion event + the Lead-Gen-Form tradeoff

| Lever | Guidance |
|---|---|
| **Lead Gen Form vs landing page** | native **Lead Gen Forms** pre-fill from the profile → higher CVR + lower CPL, but **lower lead quality** (one-tap, low intent). A landing page filters for intent at the cost of CVR. Note the tradeoff in rationale; for high-ACV, an LP's intent filter often wins on *pipeline*, not CPL. [pattern-derived] |
| **Objective** | optimize to the real downstream event (qualified lead / demo-booked), not raw form-fills, or you buy cheap junk leads |
| **CPC reality** | expect $5–$15+ CPC; judge on cost-per-qualified-lead / pipeline, never CTR or CPL alone |
| **Bidding** | start manual/max-delivery to gather data; the small audiences mean automated bidding needs patience |

---

## 4. Anti-patterns (falsifiable — the critic applies each detection rule)

| Anti-pattern | Detection rule (critic-applicable) | Why it fails |
|---|---|---|
| **Unbacked ROI/income claim** | a quantified outcome ("cut CAC 40%") with no on-page case study/source | policy FORMAT_FAIL + audience distrust |
| **Consumer/hype tone** | clickbait/sensational framing, ALL-CAPS headline | non-professional; REVISION → FAIL |
| **Personal-attribute call-out** | "As a 50-year-old founder…" / targeting-by-attribute language | policy fail (personal attributes) |
| **Low-ACV offer on LinkedIn** | CPC > viable CPA given the product's ACV | burns budget; wrong channel |
| **Claim buried past 150 chars** | the substantiated claim isn't in the first ~150 of intro text | truncated before the hook lands |
| **Lead Gen Form for a low-intent top-funnel ask with no quality filter** | LGF used + objective = raw form-fills + high-ACV product | cheap junk leads, no pipeline |
| **One ad for "everyone in SaaS"** | targeting spans many roles/industries in one artifact | wastes LinkedIn's precision premium |
| **Stale creative to a small audience** | no refresh cadence on a <50k audience | fast fatigue, rising CPL |

"Be professional and add value" is a fortune cookie. Each row is a detection rule a critic runs against a draft.

---

## 5. Source basis

Targeting modes, format set, Lead Gen Form economics, intro-text truncation, CPC ranges, and the professional-content/unbacked-ROI policy floor are synthesized from LinkedIn Campaign Manager + Advertising Policies (`business.linkedin.com`, `linkedin.com/legal/ads-policy`) and practitioner B2B paid structure. Convention-level mechanics (targeting-mode-per-artifact, the LGF↔LP tradeoff, CPC floor reality) are tagged `[pattern-derived]`. Re-verify caps/policy on next linkedin-ads invocation.

---

## 6. Open Questions (deferred — do not author yet)

- **Dynamic / Text / Spotlight ads** — lower-leverage formats; deferred until a user needs them.
- **Event + Thought-Leader (personal-profile) ads** — promising for founder-led B2B; capture when there's demand.
- **CAPI / offline-conversion import** — measurement upgrade; out of the first-move scope.
