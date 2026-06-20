---
type: policy-floor
schema_version: 1
last_verified: 2026-05-11
verifier: hungv47
note: Meta's policy review evolves continuously. The rules below reflect operator-vault knowledge at v0.1 and should be re-verified against Meta's current Advertising Standards docs at next ad-copy invocation. Trigger for re-verification — when ad-copy skill is invoked on a real campaign OR Meta announces a policy change.
---

# Per-Network Policy Floor — Banned Wording + Substantiation Hedging

Reference for `format-checker.md` (hard-gate) and `critic.md` (Policy dim auto-fail conditions). The format-checker reads the **universal floors** PLUS the **section for the resolved `network`**.

**Universal floors (every network enforces a version):** health claims (§1), finance/income claims (§2), protected-class/discriminatory targeting (§4), and the substantiation conventions (§8) below apply on Meta, Google, TikTok, and LinkedIn alike — a fabricated or unhedged measured claim FORMAT_FAILs on any network. The per-network sections add each platform's **distinctive** policy (trademark, restricted industries, disclosure, professional-content) on top of these.

---

# Network: Meta (Facebook + Instagram)

> Rules below cover the most common Meta auto-rejection categories. Not exhaustive — when in doubt, defer to Meta's full Advertising Standards (https://transparency.meta.com/policies/ad-standards/).

## 1. Health Claims

Meta's health-claim review is strict. Auto-rejection categories:

### Banned wording

| Banned phrase | Why | Substitution |
|---------------|-----|--------------|
| "guaranteed [health outcome]" | Meta auto-rejects unconditional health guarantees | "In our [study/cohort], N customers reported..." |
| "cure [disease/condition]" | Unsubstantiated medical claim | "Customers managing [condition] have used..." (avoid "cure" entirely) |
| "treat [disease]" | Medical claim requires FDA / health-authority backing | "Designed to support [behavior/outcome]" (non-disease-specific) |
| "FDA-approved" (without approval) | Misrepresentation | If actually approved: include certification ID. Otherwise omit. |
| "Lose [N] lbs in [N] days" (unhedged) | Implied unconditional outcome | "Customers in our 30-day cohort averaged N lbs" |
| "Proven to cure / prevent / treat..." | Unsubstantiated medical claim | "In our [study], customers reported..." |
| "Doctors hate this" / "What doctors don't want you to know" | Click-bait + misleading | Remove; replace with substantiated claim |
| "Burn fat while you sleep" | Unsubstantiated physiological claim | "Supports [behavior]" or omit |

### Required hedges on health-adjacent claims

If your ad claims any health-related outcome (weight, energy, sleep, recovery, etc.):

| Claim type | Required hedge |
|-----------|----------------|
| Aggregated customer outcome | "In our [study/cohort/customer group], customers reported..." |
| Individual customer testimonial | "Individual results vary" OR "Testimonial from one customer; results not typical" |
| Behavioral product (vs. medical) | "Designed to support [behavior]" (not "treats [condition]") |
| Time-bound result | Add timeframe specificity AND hedge: "30-day cohort averaged N..." |

---

## 2. Finance Claims

### Banned wording

| Banned phrase | Substitution |
|---------------|--------------|
| "Guaranteed returns" | "Historical returns averaged..." (with timeframe disclosure) |
| "Risk-free" | Remove or qualify: "Returns are not guaranteed; past performance..." |
| "[N]% APR" (without TILA disclosure) | Include legally-required disclosures inline OR redirect to LP with full disclosures |
| "Make $[N] in [N] days" | "Customers in our [cohort] earned $N over [timeframe]; results not typical" |
| "Get rich quick" / "Financial freedom in [N] days" | Remove |
| "Beat the market" / "Outperform [index]" (without disclosure) | "Historical performance: [specific numbers] vs [benchmark]; past performance not indicative" |

### Required hedges on finance claims

- Any return / performance claim → "Past performance is not indicative of future results"
- Any income / earnings claim → "Results not typical; individual results vary based on [factors]"
- Any product offering credit, lending, or investment → include licensing / regulatory disclosure (varies by jurisdiction)

---

## 3. Political and Social Issue

### v1 policy

**Out of scope for ad-copy v1.** Political ads (candidate-naming, election-related, issue-advocacy without disclaimers) require:
- Meta-specific authorization (advertiser identity verification)
- Country-specific paid-for-by disclaimers
- Issue-advocacy categorization

If the operator's offer touches political / social issue advertising, escalate to operator with: "ad-copy v1 doesn't handle political / issue-advocacy ad rules. Operator must verify Meta's current political-ad authorization requirements before drafting."

---

## 4. Protected-Class Targeting Language

### Banned wording

Meta prohibits ad copy that targets, excludes, or implies preference based on protected classes:

| Banned pattern | Why |
|----------------|-----|
| "Are you [race / religion / national origin]?" | Discriminatory targeting |
| "For [protected-class people]" framing | Discrimination claim |
| "Single mothers", "Single dads", "Young women" as the explicit audience | Familial status / age / gender discrimination |
| "[Age range] people only" | Age discrimination (esp. housing, employment, credit) |
| "Christians", "Muslims", "Jews" (or any religion) as targeting framing | Religious discrimination |
| "[Disability]-friendly" as exclusionary framing | Disability discrimination |

### Substitution path

Re-frame around **behavior, interest, or product use**, not identity:
- ❌ "Are you a busy mom looking for..." → ✅ "If you spend 10+ hours/week on..."
- ❌ "Christian businesses choose [product]" → ✅ "Small businesses serving close-knit communities choose..."
- ❌ "Veterans-only discount" → ✅ Use Meta's veteran-targeting audience setting, not in-copy targeting; copy stays universal.

**Special category note:** for housing, employment, or credit-related ads, Meta requires special-ad-category designation that restricts targeting AND limits in-copy framing. Operator must designate before launch.

---

## 5. Engagement Bait

### Banned wording

| Banned phrase | Why | Substitution |
|---------------|-----|--------------|
| "Like if you agree" | Engagement bait | Remove; use real CTA |
| "Comment YES below" | Engagement bait | "[CTA verb] now" with destination |
| "Tag a friend" | Engagement bait | Use share button (organic), not in copy |
| "Share if you...", "Vote in comments" | Engagement bait | Remove |
| "Click [emoji] for [response]" | Bait pattern | Remove |
| "Drop a [emoji] if..." | Bait pattern | Remove |

### Why it matters

Meta deprioritizes engagement-bait ads in feed AND can apply account-level penalties. The pattern looks innocuous but compounds against your account quality score.

---

## 6. Click Bait

### Banned wording

| Banned phrase | Why | Substitution |
|---------------|-----|--------------|
| "You won't believe..." | Click bait | Use the specific claim directly |
| "Shocking secret..." | Click bait | Use the specific claim directly |
| "[N] tricks to..." (unsubstantiated) | Click bait | "[N] [methods/approaches/changes] our customers used" |
| "Doctors hate this" | Click bait + misleading | Remove entirely |
| "This one weird trick..." | Click bait | Use the specific approach |
| "Wait until you see..." | Click bait | Lead with the substance |

---

## 7. Misleading Buttons

### Rule

The CTA button verb must match the destination's primary action. Examples of misleading buttons:

| Ad button | Actual destination | Verdict |
|-----------|--------------------|---------|
| "Download" | Email-capture form (no download until email submitted) | **Misleading** — Meta auto-rejects |
| "Start free trial" | Pricing page (no trial-start button) | **Misleading** |
| "Buy now" | Catalog browse (multi-step before purchase) | **Misleading** |
| "Learn more" | Same as destination's intent (no specific action implied) | OK |
| "Sign up" | Sign-up form | OK |

### Critic check

CTA-LP-match dim (rubric dim 3) scores this directly. Format-checker also flags as REVISION_REQUIRED if the CTA button verb doesn't appear on the LP description's primary-action vocabulary.

---

## 8. Substantiation Conventions

Every measured claim ("55% lift", "9 → 4 day close", "$50K saved") must:

1. **Map to a source** in `available_proof[]` via composer's `claim_list`
2. **Match the source's wording scope** (don't generalize a single-customer outcome to "average customer")
3. **Carry a hedge if it's an aggregate or testimonial** ("in our cohort", "individual results vary", "up to N", "in [N]-month study")

### Hedging templates

| Source type | Hedge template |
|-------------|----------------|
| Single customer testimonial | "Customer [X] reported [outcome]" OR "Testimonial: '[quote]' — [Customer X]; individual results vary" |
| Aggregated cohort (≥20 customers) | "In our [N]-customer cohort, customers averaged..." |
| Internal study | "In our [N]-week / [N]-month study, [metric]" |
| Third-party research | "[Source name] [year] found..." |
| Hypothetical illustration | "If you could [outcome]..." — clearly framed as hypothetical, not measured |

### Anti-patterns

- **"Results may vary" appended to a definitive claim.** "Lose 20 lbs in 30 days. Results may vary." is not real hedging — the claim is still definitive. Real hedging changes the structure.
- **"Up to N..." with no actual N.** "Up to 55% faster" with no benchmark, no customer cohort, no source is functionally a fabricated stat.
- **"Backed by science" / "Research-backed" / "Studies show"** without naming the science / research / studies. Generic substantiation = no substantiation.

---

## 9. All-Caps + ExCessIVe PunCtuaTion!!!

### Banned patterns

- Headline in ALL CAPS — Meta auto-rejects
- More than one exclamation point per sentence
- Excessive emoji (3+ in headline; 5+ in primary text)
- "!!!" / "???" runs
- Mixed-case "wAcKy" patterns to evade filters

---

## 10. Quick Reference Table — Format-Checker Hard-Gate

| Violation type | Severity | Action |
|---|---|---|
| Banned phrase per §1-7 | Hard | REVISION_REQUIRED |
| Missing substantiation hedge on aggregate claim | Hard | REVISION_REQUIRED |
| Fabricated claim (no source in available_proof[]) | Hard | REVISION_REQUIRED |
| Protected-class targeting language | Hard | REVISION_REQUIRED |
| Engagement bait CTA | Hard | REVISION_REQUIRED |
| Click-bait wording | Hard | REVISION_REQUIRED |
| Misleading button verb | Hard | REVISION_REQUIRED |
| ALL-CAPS headline | Hard | REVISION_REQUIRED |
| Repurposed-UGC ceiling warning missing from artifact (when creative_format=repurposed-ugc) | Soft | Advisory note in change log |

---

# Network: Google Ads

Beyond the universal floors, Google's editorial + trademark review is the load-bearing gate (RSA assets are typed at intent and reviewed per-asset).

| Category | Rule | Format-checker action |
|---|---|---|
| **Editorial / punctuation** | No ALL-CAPS words, no repeated/gimmicky punctuation (`!!!`, `F.R.E.E`), no symbol/number substitution (`B3ST`), no phone numbers in headlines. | FORMAT_FAIL |
| **Trademark** | Don't use a competitor's/other brand's trademark in ad text unless a reseller/informational exception applies; Google removes on complaint. | FORMAT_FAIL on known TM misuse |
| **Superlatives** | "best", "#1", "world's leading" need objective on-page substantiation (a cited ranking/award); otherwise drop. | REVISION_REQUIRED |
| **Restricted categories** | Gambling, healthcare/medicines, financial services, alcohol, political content carry country-specific certification/limits. | Escalate to operator |
| **Misrepresentation** | No unrealistic guarantees ("guaranteed page-1"), no fake countdowns/urgency, no destination mismatch (final URL must match the ad's promise). | FORMAT_FAIL |

Re-verify: Google Ads policies — https://support.google.com/adspolicy.

---

# Network: TikTok Ads

Beyond the universal floors, TikTok's distinctive gates are disclosure + restricted-industry + the native mandate.

| Category | Rule | Format-checker action |
|---|---|---|
| **Paid-partnership disclosure** | Creator/whitelisted content run as paid MUST carry the paid-partnership disclosure (platform + FTC). | FORMAT_FAIL if omitted |
| **Restricted / prohibited industries** | Financial services, health/supplements, weight-loss before/after, alcohol, and others are restricted or prohibited; many regions bar before/after body imagery + "guaranteed results". | FORMAT_FAIL / escalate |
| **Native mandate** | TV-voiceover phrasing ("Introducing the revolutionary…") underperforms + reads as non-native. | REVISION_REQUIRED |
| **Misleading claims** | No fabricated metrics, no guaranteed-outcome framing, no emoji-only text. | FORMAT_FAIL |

Re-verify: TikTok Advertising Policies — https://ads.tiktok.com/help (Advertising Policies).

---

# Network: LinkedIn Ads

Beyond the universal floors, LinkedIn's distinctive gate is the professional-content + unbacked-ROI floor (a B2B audience + policy both punish hype).

| Category | Rule | Format-checker action |
|---|---|---|
| **Unbacked ROI / income claims** | A quantified business outcome ("cut CAC 40%", "$30k MRR in 60 days") needs an on-page case study / source. | FORMAT_FAIL |
| **Professional content** | No sensational/clickbait framing, no ALL-CAPS headlines, no personal-attribute call-outs ("As a 50-year-old…"). | REVISION_REQUIRED → FORMAT_FAIL on personal-attribute targeting |
| **Restricted industries** | Crypto, gambling, political, and some financial/health categories are restricted or barred. | Escalate to operator |
| **Targeting-language** | Don't imply targeting by protected attributes; use Campaign Manager targeting, keep copy universal (mirrors §4). | FORMAT_FAIL |

Re-verify: LinkedIn Advertising Policies — https://www.linkedin.com/legal/ads-policy.

---

**Last verified:** 2026-06-20 (v0.2 — multi-network). Re-verify at: next ad-copy invocation on a given network OR that network's policy announcement (whichever first).
