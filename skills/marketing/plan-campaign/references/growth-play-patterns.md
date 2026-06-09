# Growth Play Patterns

Durable, reusable growth plays — encoded as *mechanisms*, not as one-off campaign instances.

[PLAYBOOK] — a tactical pattern library the channel-agent + timeline-agent draw on when proposing per-channel execution. Each entry is a play you can drop into a plan when its *when-it-fits* line matches the situation. These are levers, not mandates: a play only earns a slot when the ICP, growth motion, and funnel stage make its mechanism live.

These patterns are testable hypotheses, not guarantees. Every play below ships as a measurable test (the **Measure this** line), not a blanket change — see the swap test in `references/anti-patterns.md` and the 3Q anti-generic test before promoting any play into the plan.

---

## How to read an entry

Each play carries five fields:

- **Mechanism** — *why* the play works (the causal lever it pulls).
- **When it fits** — the situation that makes the lever live; skip the play when this is false.
- **First step** — the smallest action that starts the test.
- **Effort / impact** — a rough build cost and an expected-lift sense (directional, not a promise).
- **Measure this** — the one metric, at a fixed horizon, that tells you whether the play worked. Ship as a test, not a blanket change.

---

## 1. Free-trial-length A/B (trial-to-paid lever)

- **Mechanism** — A longer free trial gives committed users time to reach the value moment before the paywall, lifting trial-to-paid. The catch most teams fear — more days means more cancellation exposure — is weak: trial cancellations cluster heavily on day 0, so extending the *back* of the trial adds little new cancellation risk while adding real activation runway.
- **When it fits** — Any subscription / free-trial funnel where the value moment plausibly lands *after* the current trial window. Strongest when activation is multi-session or the product takes a few days to demonstrate worth.
- **First step** — Take the current trial length, double it for a randomized half of new signups, hold everything else constant.
- **Effort / impact** — Effort: S (a trial-length flag + cohort split). Impact: potentially high — it moves trial-to-paid, the core conversion metric, directly.
- **Measure this** — Trial-to-paid conversion at a fixed horizon (e.g. D30 from signup), control vs. longer-trial cohort. Watch day-0 cancellation rate to confirm the added days don't add proportional churn. Ship as an A/B test, not a blanket trial-length change.

## 2. Lifecycle winback (lapsed + opted-in re-engagement)

- **Mechanism** — Cancelled and lapsed-but-opted-in subscribers are an audience you already paid to acquire and are legally clear to email — yet most funnels never message them. A short, sequenced winback (value reminder → offer → last call) recovers a slice of that dormant revenue at near-zero marginal acquisition cost.
- **When it fits** — You have a segment of cancelled or lapsed users who opted in to email, and you are not currently running any reactivation sequence to them. The bigger the silent segment relative to active revenue, the higher the ceiling.
- **First step** — Pull the cancelled + lapsed-but-opted-in segment, then draft a short sequence: (1) remind them of the value / what's new, (2) make a concrete offer, (3) send a last-call before sunsetting the touch.
- **Effort / impact** — Effort: M (segment query + a 3-touch sequence; a one-evening build for most stacks). Impact: medium-high — recovered revenue from already-acquired users.
- **Measure this** — Reactivation rate (and recovered revenue) from the targeted segment over the sequence window vs. the do-nothing baseline.

## 3. "+reddit" organic search-seeding

- **Mechanism** — A growing share of buyers append "reddit" to searches to skip SEO spam and find peer opinion, and forum threads rank highly for "[category] + reddit" queries. Landing one *genuinely useful* comment in a thread that already ranks page 1 puts your product in front of high-intent searchers — organic, compounding, and free — without buying ads or building new pages.
- **When it fits** — Organic / community-led acquisition for a product whose category has active forum threads ranking for "[category] + reddit" searches. Best when your team can contribute real expertise to the thread, not just a plug.
- **First step** — List the "[our category] + reddit" queries a target buyer would actually run, find the threads ranking page 1, and plan exactly one authentic, value-add comment per thread that helps the asker first and mentions the product only where it genuinely fits.
- **Effort / impact** — Effort: M (research + careful, human-written contributions). Impact: medium — a slow, compounding build, not a spike.
- **Measure this** — Referral traffic and assisted conversions from the seeded threads over time. Guardrail: avoid spam-flag behavior (no copy-paste plugs, no thread-flooding, no fake accounts) — a removed comment or a ban erases the play.

## 4. Keyword-level paid-revenue audit *(conditional)*

> **Conditional — only run this play when you are actively spending on paid search or app-store search ads.** With no paid-search spend live, skip it entirely; park it until a campaign exists.

- **Mechanism** — Paid-search performance averaged across a campaign hides the truth at the keyword level: some keywords drive paying customers, others quietly fund traffic for competitor-brand terms or low-intent queries that never convert at the paywall. Auditing revenue *per keyword* — then cutting the losers and re-pointing spend (and the paywall/offer the keyword's intent deserves) — can lift net revenue without raising total spend.
- **When it fits** — A paid-search or app-store-search ad campaign is live with enough conversion history to attribute revenue to individual keywords. Highest leverage when spend is spread across many keywords with uneven intent.
- **First step** — Pull revenue (not just clicks/installs) by keyword, flag spend funding competitor-brand or low-intent terms, and connect each keeper keyword's intent to the right paywall / offer.
- **Effort / impact** — Effort: M (keyword-level attribution + reallocation). Impact: high *when applicable* — net-revenue lift at flat spend; otherwise N/A.
- **Measure this** — Net revenue per keyword and blended cost-per-acquisition before vs. after reallocation, at constant total spend.
