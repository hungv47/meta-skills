---
title: Campaign-Eval Anti-Patterns
lifecycle: canonical
status: stable
load_class: ANTI-PATTERN
---

# Campaign-Eval Anti-Patterns

> Re-read before any cycle artifact ships. Each row names the pattern, why it fails, and the fix. Critic Hard Fails are the enforcement teeth.

## Campaign-eval-specific anti-patterns

### 1. Rider-channel contamination of the verdict
**Pattern:** The campaign ran paid-social + organic-LinkedIn + content-SEO + an email send to the existing trial list. Email shows 70 conversions; the artifact counts all 70 as campaign-driven net-new and claims `keep`.
**Why it fails:** Those 70 were already-warm trial users in-funnel before the campaign launched. The email rode along on demand the campaign did not create. Counting borrowed credit as a campaign win funds a channel that never drove net-new.
**Fix:** Channel-Mix Discrimination rubric dim requires every channel classified driver / rider / mixed with a causation reason; rider conversions are excluded from the campaign-driven net-new count. Critic Hard Fail #4 enforces.

### 2. Blended-CAC laundering of an underwater paid channel
**Pattern:** Blended CAC is $22 against a $19/mo price — looks healthy; the artifact claims `keep` for the whole campaign including paid-social. Paid CAC alone is $61.
**Why it fails:** The blend is propped up by free organic + content conversions. Paid-social at $61 CAC against a $19/mo price has a payback period over 3 months and is underwater. A keep on the blend keeps funding a losing channel.
**Fix:** Unit-Economics Discipline rubric dim requires blended CAC and paid CAC as distinct numbers + payback against the product's price. Critic Hard Fail #11 — a keep resting on the blend while paid CAC is underwater FAILs.

### 3. Missing-channel breakdown
**Pattern:** The campaign ran on 4 channels; the artifact's breakdown table has 3. The fourth (a small influencer spend) is silently dropped.
**Why it fails:** A campaign cannot be honestly scored with a channel omitted — the dropped channel's spend still counts against CAC, and its contribution (or lack of one) is part of the channel-mix verdict.
**Fix:** Metric Integrity + Channel-Mix Discrimination dims require every channel that received spend OR effort in the breakdown table. Diagnosis's `breakdown_completeness` field flags omissions.

### 4. Fabricated revenue attribution
**Pattern:** "The campaign drove $48,000 in revenue" — but the attribution model is last-click, an organic baseline already produced steady revenue, and no subtraction was done.
**Why it fails:** Last-click over-credits the final touch; not netting out the organic baseline attributes revenue the campaign did not create. Inflated revenue attribution makes a losing campaign look like a winner.
**Fix:** Attribution Honesty dim requires the attribution model named + its bias flagged; Unit-Economics Discipline requires revenue net of the organic baseline (or labeled an upper bound). Critic Hard Fail #6 (fabricated number) enforces the worst case.

### 5. Scope drift to "re-plan the whole campaign"
**Pattern:** The primary metric missed; recommendation suggests "new objective + new channel mix + new budget split + new sequencing + new creative direction."
**Why it fails:** Eval scope is campaign diagnosis + next-cycle routing, not campaign-strategy maximalism. Maximalist recommendations are unfalsifiable — they always include the actual fix among 5 unrelated changes.
**Fix:** Routing must be to the smallest correct next skill (plan-campaign with a budget-reallocation scope, not "re-plan everything"). Decision Discipline rubric dim catches this.

### 6. Lane drift into asset-level eval territory
**Pattern:** The operator wants a single Meta ad scored; evaluate-campaign scores it anyway by treating one ad as a one-channel "campaign."
**Why it fails:** A single ad needs paid-attribution discipline and audience-temp scoring (`evaluate-ad`). A single post needs engagement-quality discrimination (`evaluate-content`). Scoring them through the campaign-aggregate rubric applies the wrong lens.
**Fix:** Critical Gate 2 + Critic Hard Fail #3. Metric Ingest's scope check STOPs on a single-asset request and routes to the asset-level sibling.

### 7. Learning promotion from a seasonal or concurrent-campaign spike
**Pattern:** The campaign launched into Black Friday week; conversions 3×'d. The cycle promotes "this channel mix is a winner" to learnings.md.
**Why it fails:** The spike proves the season surfaced demand, not that the channel mix is durable. Promoting from a spike window pollutes learnings.md with stale insight.
**Fix:** Learning Promotion requires high-confidence + status keep/discard + a lesson reusable beyond this campaign. A spike-driven cycle ships `watch`, not a promoted lesson. Critic Hard Fail #9 catches the wrong-signal-promoted case.

### 8. Killing a cycle without a comparable-campaign baseline
**Pattern:** Cycle 2 (a 4-channel launch campaign) blended CAC $30. Baseline = cycle 1 (a single-channel always-on retargeting campaign) CAC $14. Recommendation: `discard`.
**Why it fails:** A launch campaign acquiring net-new customers across 4 channels is not comparable to an always-on retargeting campaign converting warm traffic. The comparison invents a fictitious decline.
**Fix:** Attribution Honesty rubric dim catches this — baseline must be a comparable campaign type AND a comparable channel mix. Critic Hard Fail #5 enforces.

### 9. Campaign reported as one blended number
**Pattern:** The artifact reports "campaign CAC: $24, 180 conversions" and stops there — no per-channel breakdown.
**Why it fails:** A blended campaign number hides which channels drove the result and which dragged. The verdict cannot discriminate; the next budget decision is blind.
**Fix:** The per-channel breakdown table in Diagnosis § Channel-Mix Signals is mandatory. Channel-Mix Discrimination rubric dim drops to 0-2 on a breakdown-free artifact.

### 10. Source plan-campaign artifact unverified
**Pattern:** The cycle artifact's provenance lists `input_artifacts: docs/forsvn/artifacts/marketing/campaign-plan.md` — but the file doesn't exist or is a different campaign's plan.
**Why it fails:** Without the source artifact, the eval scores against an imagined hypothesis. Future `plan-campaign --rev=N+1` runs read provenance and can't follow the chain.
**Fix:** Metric Ingest's Blockers section catches unreadable source paths. Critic Hard Fail #10 enforces.

### 11. Confidence inflation on a single-week window
**Pattern:** The campaign ran 7 days; the artifact claims `confidence: high` on a CAC improvement.
**Why it fails:** A single week of campaign data — especially with a launch ramp — is noise. A high-confidence keep on a one-week window funds a channel mix on a coin flip.
**Fix:** Attribution Honesty rubric dim caps confidence on sub-floor spend/sample windows; a low-sample `keep` is Critic Hard Fail #12.

## Cross-cutting marketing-stack rows

### Cross-stack contract drift
**Pattern:** Frontmatter schema, body section list, the Channel Breakdown table columns, or Results Row columns diverged silently between evaluate-campaign's format-conventions.md and `_shared/eval-loop-spec.md`.
**Why it fails:** Downstream consumers (dashboard, plan-campaign --rev=N+1, ledger-summary skills) break or silently miss fields.
**Fix:** Schema changes require atomic update across format-conventions + `_shared/eval-loop-spec.md` + plan-campaign's awareness of the contract.

### Sibling-skill confusion with the asset-level eval skills
**Pattern:** A campaign loop's eval cycle tries to re-score every ad, post, and landing page the campaign used inside one campaign-eval artifact.
**Why it fails:** evaluate-campaign is aggregate-only. Re-scoring assets duplicates evaluate-ad / evaluate-content / evaluate-landing-page work, applies the wrong rubric, and bloats the cycle artifact.
**Fix:** evaluate-campaign cites per-asset eval artifacts as context only. The assets are scored in their own loops/cycles by the asset-level skills. Critical Gate 2 enforces.

### Upstream context skipped — no loop scaffolded
**Pattern:** Operator runs `/evaluate-campaign` without a loop ever created.
**Why it fails:** Eval cycles assume a `program.md` + `context.md` defining the primary metric + channel set + guardrails. Without those, scoring is heuristic.
**Fix:** Critical Gate 1 blocks. Skill returns NEEDS_CONTEXT and recommends `/run-pipeline` to scaffold first.

### Polish-chain misroute
**Pattern:** Eval artifact is sent to humanmaxxing or polish-vn after writing.
**Why it fails:** Eval artifacts are evidence + decisions, not customer-facing copy. Humanmaxxing would smooth attribution caveats into more confident-sounding prose — exactly the opposite of what attribution discipline requires.
**Fix:** Eval artifacts skip the humanmaxxing/polish-vn polish chain. They ship as-is from critic PASS.
