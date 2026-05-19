# Playbook — Why Funnel-Planner Exists

> Load this when you want to teach the skill to a new operator, when you're deciding whether to run this skill at all, or when something feels off about the targets coming out.

---

## Core Question

> **"Do the numbers actually work?"**

Funnel-planner is Strategy Step 3 of 4. It sits between `prioritize` (the ranked initiative list) and downstream measurement (campaign-plan / eval-loop). Its single job: turn each initiative on the cut-line into a defensible numeric target tied to a funnel stage, a baseline, and an evidence-backed improvement factor.

---

## Why this skill exists at all

Three failure modes it prevents:

1. **Aspirational math.** "Let's get to 100k MRR" with no baseline, no stage mapping, and no improvement factor. Targets that vanish on contact with a Monday standup.
2. **Theatre numbers.** Tracking vanity metrics — followers, page views, MQLs that never convert — because they're the easy thing to count. The 70% test exists to kill these.
3. **Acquisition pressure on broken economics.** Setting a "double signups" target when LTV:CAC is already 1.5:1. The skill loses money faster the more "successful" it is. Gate 4 (LTV:CAC ≥ 3:1) refuses to ship.

The structural answer is the hard-gate on `prioritize-*.md`. Without a ranked initiative list, every target is arbitrary. That's why this skill cannot Cold Start — it refuses to substitute interview for the ICE-scoring rigor that produced the cut-line.

---

## Philosophy

Improvement factors and benchmarks in `benchmarks.md`, `unit-economics.md`, and the agents are **evidence-backed starting points, not ceilings or floors.** Actual achievable improvement depends on baseline, team capability, market context, and how broken the current state is. Use the defaults as sanity checks:

| Scenario | Default lift |
|---|---|
| Mature, well-tuned funnel | 5-10% |
| Basic optimization already done | 10-15% |
| No optimization yet (new surface) | 20-30% |
| Major redesign / restoring known-broken | 30-50% |

A team fixing a recently-broken page may see 100%+ recovery; a team optimizing an excellent funnel may see 2-3%. The number is the conversation starter, not the verdict.

---

## When NOT to use this skill

- **No prioritized initiative list.** Run `prioritize` first. Hard gate enforced — skill returns NEEDS_CONTEXT.
- **"Help me set goals" without specifics.** Targets without initiatives are wishes. Route to `discover` or `prioritize`.
- **TAM/SAM/SOM market sizing.** That's `research-market`. Funnel-planner sets achievable lifts off current baselines, not theoretical ceilings.
- **Diagnosing why a metric dropped.** That's `diagnose`. Funnel-planner sets forward targets, not root-cause analysis.
- **Pure unit-economics audit.** Run baseline-collector inline or read `references/unit-economics.md`. Doesn't need the full orchestration.

---

## Growth motion identification — the load-bearing pre-gate

Before any funnel model is selected, the skill must classify the business as **PLG / SLG / Hybrid**. Funnel model choice flows from this.

| Motion | Indicators | Default funnel |
|---|---|---|
| **PLG** (Product-Led Growth) | Free tier exists, self-serve checkout, low-touch onboarding, product virality, expansion revenue dominant | PLG Funnel or AARRR |
| **SLG** (Sales-Led Growth) | Sales team, high ACV, demo-required, paid channels primary, lead handoff explicit | SLG Funnel or TOFU-MOFU-BOFU |
| **Hybrid** | Both motions coexist (e.g., self-serve SMB + sales-assisted enterprise) | Designate one primary for target-setting; document both |

Don't ask the user the motion if their `experience/business.md` or `research/product-context.md` already encodes it — read first.

---

## The 9-channel reference (cited in artifact)

When setting channel → funnel stage mappings, the skill references a 9-channel map:

1. Search engines / GEO (Google, Bing, generative-engine optimization)
2. Store / Listing platforms (App Store, G2, Capterra, Amazon)
3. Bounty / Info platforms (affiliate, lead-gen)
4. News (PR, earned media)
5. Forums / Communities (Reddit, Hacker News, niche subreddits, Discord)
6. Social media (organic + paid: TikTok, IG, LinkedIn, X, YouTube)
7. IRL (OOH, events, point-of-sale)
8. Mailbox (email — newsletter, lifecycle, cold)
9. SMS

Include only channels actually active in strategy. If a channel is used differently than its default tactic (e.g., paid Reddit ads vs. organic forum engagement), document as a separate row.

---

## Three-outcome validation — Business / Brand / Community

Both PLG and SLG motions feed three outcomes. The artifact validates coverage:

- **Business** (revenue, conversion, unit economics) — must always be Covered. No exceptions.
- **Brand** (branded search volume, social mentions, NPS, share of voice) — Covered / Gap / N/A. N/A requires justification ("B2B enterprise; brand tracked via branded search only").
- **Community** (active members, engagement rate, UGC volume, forum activity) — Covered / Gap / N/A. Same justification rule.

Gaps without justification are flagged. The point is not to force all three; it's to make the operator explicit about which they're choosing to ignore.

---

## The 70% test (mandatory)

Every target must pass: **"Is hitting 70% of this target still valuable?"**

If the answer is "no, only 100% counts" → the target is wrong. Either:
- the target is too aggressive (split it into staged milestones),
- the metric is binary (rephrase as a binary success criterion, not a quantitative target),
- or the metric isn't the real outcome (vanity metric — find the underlying revenue-connected metric).

Apply context rules per metric type:
- **Higher-is-better:** 70% of the lift from baseline → target (e.g., baseline 2%, target 5% → 70% = 4.1%)
- **Lower-is-better:** 70% of the reduction from baseline → target (e.g., baseline 50% bounce, target 30% → 70% = 36%)
- **Binary:** rephrase as quantitative or accept it's a yes/no, not a target

---

## LTV:CAC ≥ 3:1 — non-negotiable for acquisition targets

If targets involve acquisition (paid spend, channel investment, sales-team scaling), baseline LTV:CAC must be ≥3:1 or the artifact must explicitly flag the unhealthy ratio with a remediation plan.

Why: setting "double our paid spend" targets at 1.5:1 economics doesn't fail elegantly — it accelerates losses linearly with the target. The fix is unit economics first, acquisition second.

---

## Skill deference

| Situation | Defer to |
|---|---|
| Prioritize.md missing | `prioritize` (hard gate) |
| No baseline data and unit economics blocking | `diagnose` first to root-cause the LTV:CAC issue |
| Targets exist; need to figure out *which channels* | `plan-campaign` (this skill's downstream) |
| Targets exist; need to *measure* | downstream measurement (eval-loop, dashboards) |

---

## When the critic returns FAIL

Max 2 rewrite cycles. The critic's report names the specific gate, the fix, and the agent to re-dispatch — not you. Read the routing table in `agents/critic-agent.md` if unsure which agent owns the gate.

After 2 FAIL cycles → deliver with a "Known Issues" section listing unresolved gate failures. Don't loop indefinitely.

---

## Refactor history

- **2026-05-17 (v6 Phase 2 Wave 2):** body refactored 382 → 108 lines (-71.7%, 274 lines saved). 5 new refs: this playbook, `procedures/pre-dispatch.md`, `procedures/dispatch-mechanics.md`, `format-conventions.md`, `examples/funnel-planner-walkthrough.md`. Existing 5 data-catalog refs (benchmarks, funnel-models, stress-tests, unit-economics, anti-patterns) unchanged. 6 sub-agents (`agents/`) unchanged. Cross-stack contract preserved byte-identical: 6 Critical Gates, frontmatter, Target Table schema, Channel→Stage Map schema, Three-Outcome Validation table, Validation section, Baselines paragraph.
