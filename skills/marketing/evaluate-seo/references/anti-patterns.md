---
title: SEO/AEO-Eval Anti-Patterns
lifecycle: canonical
status: stable
load_class: ANTI-PATTERN
---

# SEO/AEO-Eval Anti-Patterns

> Re-read before any cycle artifact ships. Each row names the pattern, why it fails, and the fix. Critic Hard Fails are the enforcement teeth.

## SEO-eval-specific anti-patterns

### 1. Impression vanity read as success
**Pattern:** GSC impressions rose 10×; the artifact claims `keep`. Target-keyword position: unchanged. Organic clicks: flat.
**Why it fails:** Impressions grow when a page surfaces for more (often irrelevant) queries or catches a low-value SERP feature. They are not ranking gains and nobody clicked. A keep on impressions funds a change that moved nothing meaningful.
**Fix:** Visibility-Signal Discrimination dim requires the meaningful-vs-vanity breakdown. An impression spike with flat clicks cannot earn `keep`. Critic Hard Fail #11 enforces.

### 2. Short-window ranking blip scored as keep
**Pattern:** Five days after a content edit, the target keyword jumped from position 12 to 6; the artifact claims `keep`.
**Why it fails:** Rankings fluctuate day to day; a 5-day move is inside the noise band and routinely reverts. SEO signals lag — a real read needs weeks.
**Fix:** Lag & Volatility Discipline dim checks the window against the loop's lag floor (default ≥28 days). A sub-floor window caps the verdict at `watch`. Critic Hard Fail #12 enforces.

### 3. Core-update updraft mistaken for the change working
**Pattern:** Rankings improved during a confirmed Google core update; the artifact attributes the gain to the on-page change and scores `keep`.
**Why it fails:** Core updates reshuffle the SERP independent of your work. A move during one is confounded — you cannot tell your change from the update.
**Fix:** Metric Ingest records core-update dates in the window; Attribution Honesty + Lag & Volatility dims cap a core-update-overlapping move at `watch`, to re-measure after it settles. Critic Hard Fail #12 enforces.

### 4. Scope drift to "redo the SEO strategy"
**Pattern:** A target keyword dipped; recommendation suggests "new title + new content + new internal links + new schema + new cluster + technical migration."
**Why it fails:** Eval scope is visibility diagnosis + next-target routing, not SEO-strategy maximalism. Maximalist recommendations always hide the actual fix among six unrelated changes.
**Fix:** Routing must be to the smallest correct next skill (optimize-seo with a specific on-page target, not "redo everything"). Decision Discipline dim catches this.

### 5. Cross-surface contamination of the verdict
**Pattern:** The cluster gained AI-answer citations AND lost organic-SERP position; the artifact blends them and scores `keep` on the citation gain.
**Why it fails:** Organic SERP and AI answers are different surfaces with different mechanics. Blending lets a citation win mask an organic loss — the next-target decision contaminates both surfaces.
**Fix:** One cycle = one keyword cluster + surface. The other surface lives in Cross-Surface Context and never enters `current_value`. Critical Gate 4 + Critic Hard Fail #5 enforce.

### 6. Fabricated ranking / citation data
**Pattern:** "We now rank #3 for the head term" — with no GSC/rank-tracker pull, or "cited in ChatGPT" with no AEO-monitor record.
**Why it fails:** Ranking and citation claims are easy to assert and hard to verify after the fact; future cycles read them as fact and double down on a phantom win.
**Fix:** Metric Ingest requires every value to trace to a named tool + dated pull. Critic Hard Fail #6 enforces.

### 7. Killing a cycle without same-cluster+surface baseline
**Pattern:** Cycle 2 (AI-answers, cluster B) citation rate 8%. Baseline = cycle 1 (organic-SERP, cluster A) position 5. Recommendation: `discard`.
**Why it fails:** Cross-cluster, cross-surface comparison invents a fictitious decline. Different clusters and surfaces are not comparable.
**Fix:** Attribution Honesty dim requires same cluster AND same surface for a baseline. Critic Hard Fail #10 enforces.

### 8. Source optimize-seo / monitor-aeo artifact unverified
**Pattern:** The cycle's provenance lists `input_artifacts: optimize-seo/2026-05-01-pricing.md` — but the file doesn't exist, so "what changed" is invented.
**Why it fails:** Without the source change, the eval scores against an imagined intervention; the verdict is unfalsifiable.
**Fix:** Metric Ingest's Blockers section catches unreadable source paths. Critic Hard Fail #3 enforces.

### 9. Confidence inflation on a volatile SERP
**Pattern:** The SERP for the cluster is churning weekly (heavy SERP-feature changes); the artifact claims `confidence: high` on a one-window position gain.
**Why it fails:** A volatile SERP makes any single-window read unreliable. High confidence on a churning SERP funds a target on noise.
**Fix:** Lag & Volatility dim caps confidence when volatility is high; a volatile-SERP gain ships as `watch`.

### 10. Audit dressed up as an eval
**Pattern:** The operator runs `/evaluate-seo` but supplies no measurement data — just "the page should rank better, here's what to fix."
**Why it fails:** That is `optimize-seo`'s job. An eval without ranking data is a heuristic audit, not an evaluation.
**Fix:** Critical Gate 2 + Critic Hard Fail #2. Missing measurement evidence → BLOCKED with a route to `optimize-seo` for the audit.

## Cross-cutting marketing-stack rows

### Cross-stack contract drift
**Pattern:** Frontmatter schema, body section list, or Results Row columns diverged silently between evaluate-seo's format-conventions.md and `_shared/eval-loop-spec.md`.
**Why it fails:** Downstream consumers (dashboard, optimize-seo next-target, ledger-summary skills) break or silently miss fields.
**Fix:** Schema changes require atomic update across format-conventions + `_shared/eval-loop-spec.md` + downstream callers.

### Sibling-skill confusion with the eval lanes
**Pattern:** A growth bundle mixed organic SERP ranking AND organic-post engagement; one evaluate-seo cycle tries to score both.
**Why it fails:** Two lanes in one cycle artifact = polluted ledger row, polluted learnings, wrong rubric on the post.
**Fix:** evaluate-seo's cycle covers SEO/AEO visibility only. The posts are a separate `evaluate-content` cycle. Critical Gate 4 enforces.

### Upstream context skipped — no loop scaffolded
**Pattern:** Operator runs `/evaluate-seo` without a loop ever created.
**Why it fails:** Eval cycles assume a `program.md` + `context.md` defining primary metric + cluster/surface scope + the lag floor + guardrails. Without those, scoring is heuristic.
**Fix:** Critical Gate 1 blocks. Skill returns NEEDS_CONTEXT and recommends `/run-pipeline` to scaffold first.

### Polish-chain misroute
**Pattern:** Eval artifact is sent to humanmaxxing or polish-vn after writing.
**Why it fails:** Eval artifacts are evidence + decisions, not customer-facing copy. Humanmaxxing would smooth attribution + lag caveats into more confident-sounding prose — the opposite of attribution discipline.
**Fix:** Eval artifacts skip the humanmaxxing/polish-vn polish chain. They ship as-is from critic PASS.
