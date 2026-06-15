---
title: Ad-Eval Anti-Patterns
lifecycle: canonical
status: stable
load_class: ANTI-PATTERN
---

# Ad-Eval Anti-Patterns

> Re-read before any cycle artifact ships. Each row names the pattern, why it fails, and the fix. Critic Hard Fails are the enforcement teeth.

## Ad-eval-specific anti-patterns

### 1. Mixed-audience metric ingest
**Pattern:** Cold-traffic and retargeting metrics blended into one cycle artifact because the operator dumped a full-campaign export instead of an ad-group-scoped export.
**Why it fails:** A ROAS of 2.8× across blended audiences is meaningless — retargeting carries the number while cold drags. The keep/discard decision contaminates next cycle's creative direction.
**Fix:** Metric Ingest splits the metrics by ad-group / audience before scoring. If a clean split is impossible (operator-supplied screenshot summary doesn't break out by audience), BLOCK the cycle. Critic Hard Fail #4 enforces.

### 2. Confidence inflation on low-spend windows
**Pattern:** Spend window is $30 over 3 days; artifact claims `confidence: high` on the ROAS lift.
**Why it fails:** Meta's optimizer needs spend to learn — below ~$50 per ad-group + ~10k impressions, signal is noise. A high-confidence keep claim on a low-spend window will fund a fatigued creative for another cycle.
**Fix:** Attribution Honesty rubric dim caps confidence at `low` when spend falls below the floor. Critic Hard Fail #11 enforces (low-spend + claimed `keep` = FAIL).

### 3. Fabricated attribution
**Pattern:** "Cold-traffic CTR lifted 18% week-over-week" — but no source named, or source is a screenshot with no metadata, or operator inferred from a non-ad-attribution dashboard.
**Why it fails:** Without source-system attribution, the number is theater. Future cycles read the prior eval and build on theater.
**Fix:** Metric Integrity rubric dim requires named source + window + sample size. Critic Hard Fail #6 enforces.

### 4. Scope drift to "rewrite the campaign"
**Pattern:** Cycle's CTR was 0.7% (below 1.2% benchmark); recommendation_agent suggests "rewrite all 3 ad-groups + new offer + new LP."
**Why it fails:** Eval scope is creative diagnosis + next-cycle routing, not campaign-strategy maximalism. Maximalist recommendations are unfalsifiable — they always include the actual fix among 7 unrelated changes.
**Fix:** Routing must be to the smallest correct next skill (write-ad with hook-only refresh, not "rewrite everything"). Decision Discipline rubric dim catches this.

### 5. Scope drift to redesigning the LP under the ad
**Pattern:** Ad CTR is healthy (1.8%) but LP conversion is 0.3%. Cycle artifact recommends "redesign the LP hero + headline + CTA + form."
**Why it fails:** This is `brief-landing-page` territory, not `write-ad`. The eval should diagnose the LP-bottleneck signal and route to lp-brief — not author LP changes inside an ad-eval artifact.
**Fix:** Recommendation routing has explicit `brief-landing-page` as a route target. Diagnosis surfaces the high-CTR + low-CV signal; recommendation routes; lp-brief authors. Critical Gate 7 enforces.

### 6. Learning promotion from a fatigued window
**Pattern:** Cycle 5: ROAS dropped to 1.2× (from 2.4× cycle 1). Recommendation correctly flags fatigue + recommends rotation. Then promotes lesson "Cold-traffic audiences in [vertical] respond best to [hook archetype]."
**Why it fails:** The lesson was true in cycle 1; cycle 5's data proves the creative fatigued, not that the audience rejected the hook. Promoting from a fatigued window pollutes the learnings.md with stale insights.
**Fix:** Learning Promotion rule requires high-confidence + status = keep/discard. A fatigued cycle that gets `discard` for the creative does NOT promote the creative's hook archetype as a lesson — it promotes the fatigue trigger (frequency threshold + fatigue indicator pattern). Critic Hard Fail #9 catches the wrong-signal-promoted case.

### 7. Killing a cycle without baseline comparability
**Pattern:** Cycle 2: ROAS 1.6×. Baseline = cycle 1 ROAS 2.4×. Recommendation: `discard`. But cycle 1 ran on a different audience-temp (retargeting), cycle 2 ran cold-traffic — comparison invalid.
**Why it fails:** Cross-audience-temp comparison invents a fictitious decline. The cold cycle is actually performing fine for cold; the comparison just contaminates the verdict.
**Fix:** Audience-Temp Fidelity rubric dim catches this. Critic Hard Fail #5 enforces (baseline from different audience-temp).

### 8. Frequency unreported when fatigue claimed
**Pattern:** Diagnosis: "creative is fatigued, rotate." Evidence: ... nothing. No frequency_at_close, no CTR slope, no negative-feedback rate.
**Why it fails:** Fatigue is the most-misused word in ad-eval — every flat-performing creative gets called "fatigued" so the operator has a reason to rotate. Without falsifiable signals, "fatigued" means "I want to rotate."
**Fix:** Creative-Fatigue Awareness rubric dim requires ≥ 2 falsifiable inputs (frequency + slope OR frequency + negative-feedback). Critic Hard Fail #12 enforces.

### 9. Rotation recommendation without component granularity
**Pattern:** Fatigue observed; recommendation: "rotate creative." But which component — hook? hero? CTA? offer? Whole creative?
**Why it fails:** Component-vague rotation triggers `write-ad` to author a whole new creative when only the hero needed refresh. Wasteful and slows the loop.
**Fix:** Recommendation's Creative-Fatigue Decision block names the specific component. Decision Discipline rubric dim drops the score when rotation is campaign-level.

### 10. Source ad-copy artifact unverified
**Pattern:** Cycle artifact's provenance lists `input_artifacts: docs/forsvn/artifacts/marketing/write-ad/cold-traffic-2026-05-01-paint-pourer.md` — but the file doesn't exist (typo, moved, never written).
**Why it fails:** Without the source artifact, the eval is scoring against an imagined hypothesis. Future `write-ad --rev=N+1` runs read provenance + can't follow the chain.
**Fix:** Metric Ingest's Blockers section catches unreadable source paths. Critic Hard Fail #10 enforces.

## Cross-cutting marketing-stack rows

### Cross-stack contract drift
**Pattern:** Frontmatter schema, body section list, or Results Row columns diverged silently between evaluate-ad's format-conventions.md and `_shared/eval-loop-spec.md`.
**Why it fails:** Downstream consumers (dashboard, write-ad --rev=N+1, ledger-summary skills) break or silently miss fields. Manifest sync surfaces the drift, but only after a stale cycle ships.
**Fix:** Schema changes require atomic update across format-conventions + `_shared/eval-loop-spec.md` + write-ad's awareness of the contract. Document any drift in the loop's results.tsv `description` field for the cycle that introduced it.

### Sibling-skill confusion with evaluate-landing-page
**Pattern:** A high-CTR + low-LP-conversion cycle gets the LP bottleneck diagnosed inside evaluate-ad's artifact. Recommendation correctly routes to brief-landing-page, but the artifact tries to score LP signal alongside ad signal.
**Why it fails:** Two eval surfaces in one cycle artifact = polluted ledger row, polluted learnings, downstream confusion. evaluate-landing-page should run the LP cycle separately.
**Fix:** evaluate-ad's Evidence table covers ad-side signals only (CTR, CPA, ROAS, frequency, spend, conversions). LP-side signals (bounce, scroll, form-funnel) are routed to lp-eval. Critical Gate 7 + Boundary Control discipline enforces.

### Upstream context skipped — no loop scaffolded
**Pattern:** Operator runs `/evaluate-ad` without a loop ever created. Skill tries to write a cycle artifact into a path that doesn't exist.
**Why it fails:** Eval cycles assume a `program.md` + `context.md` defining primary metric + audience-temp scope + guardrails. Without those, scoring is heuristic.
**Fix:** Critical Gate 1 (existing eval loop required) blocks. Skill returns NEEDS_CONTEXT and recommends `/run-pipeline` to scaffold first.

### Polish-chain misroute
**Pattern:** Eval artifact is sent to humanmaxxing or polish-vn after writing.
**Why it fails:** Eval artifacts are evidence + decisions, not customer-facing copy. Humanmaxxing would smooth attribution caveats into more confident-sounding prose — exactly the opposite of what attribution discipline requires.
**Fix:** Eval artifacts skip the humanmaxxing/polish-vn polish chain. They ship as-is from critic PASS.
