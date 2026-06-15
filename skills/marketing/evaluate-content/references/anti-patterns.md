---
title: Content-Eval Anti-Patterns
lifecycle: canonical
status: stable
load_class: ANTI-PATTERN
---

# Content-Eval Anti-Patterns

> Re-read before any cycle artifact ships. Each row names the pattern, why it fails, and the fix. Critic Hard Fails are the enforcement teeth.

## Content-eval-specific anti-patterns

### 1. Vanity-metric inflation
**Pattern:** The post got 5,000 likes and 80,000 impressions; the artifact claims `keep`. Saves: 4. Shares: 1. Comments: 2.
**Why it fails:** Likes and impressions are cheap — the algorithm hands them out for engagement-bait and the operator's own network. They do not signal that the content moved anyone. A keep built on a vanity spike funds a content direction that does not convert.
**Fix:** Engagement-Quality Discrimination rubric dim requires the 4-way breakdown + the meaningful-to-vanity ratio. A vanity-heavy headline metric cannot earn `keep`. Critic Hard Fail #11 enforces.

### 2. Cross-platform contamination of the verdict
**Pattern:** The content ran on LinkedIn + Instagram + X. The artifact averages engagement across all three into one number and scores the verdict on the blend.
**Why it fails:** Each platform runs a different algorithm with a different engagement-rate denominator. A blend lets a strong LinkedIn result mask a dead Instagram result — the keep/discard decision contaminates next cycle's direction on every platform.
**Fix:** One cycle = one primary platform. Secondary-platform metrics live in the Cross-Platform Context subsection and never enter `current_value` or the verdict. Critical Gate 5 + Critic Hard Fail #4 enforce.

### 3. Fabricated qualitative sentiment
**Pattern:** "Comment sentiment was overwhelmingly positive" — but no comments are quoted, or the post had 3 comments and 2 were tagged friends.
**Why it fails:** Qualitative feedback is the easiest evidence to invent. Inferred sentiment that is not in the comments is theater; future cycles read it as fact.
**Fix:** Diagnosis quotes actual comments when it cites sentiment, and does not let two loud voices stand in for the audience. Critic Hard Fail #6 (fabricated claim) enforces.

### 4. Scope drift to "redo the content plan"
**Pattern:** Engagement rate was below baseline; recommendation suggests "new hook + new format + new visual + new posting schedule + new platform mix."
**Why it fails:** Eval scope is content diagnosis + next-cycle routing, not content-strategy maximalism. Maximalist recommendations are unfalsifiable — they always include the actual fix among 6 unrelated changes.
**Fix:** Routing must be to the smallest correct next skill (write-social with a hook-only revision, not "redo everything"). Decision Discipline rubric dim catches this.

### 5. Lane drift into evaluate-shortform / evaluate-ad territory
**Pattern:** The content under evaluation is a Reel or a boosted post; evaluate-content scores it anyway.
**Why it fails:** Short-form video needs the short-form-research platform-intelligence lens (`evaluate-shortform`). Paid placements need paid-attribution discipline (`evaluate-ad`). Scoring them here applies the wrong rubric.
**Fix:** Critical Gate 2 + Critic Hard Fail #3. Metric Ingest's content-type check STOPs on video/paid and routes to the sibling skill.

### 6. Learning promotion from an algorithm-spike window
**Pattern:** A post caught an algorithm boost and 10×'d its usual reach. The cycle promotes "this hook archetype is a winner" to learnings.md.
**Why it fails:** The spike proves the algorithm surfaced the post, not that the hook is durable. Promoting from a spike window pollutes learnings.md with stale insight.
**Fix:** Learning Promotion requires high-confidence + status keep/discard + a lesson reusable beyond this content piece. A spike-driven cycle ships `watch`, not a promoted lesson. Critic Hard Fail #9 catches the wrong-signal-promoted case.

### 7. Killing a cycle without same-platform baseline comparability
**Pattern:** Cycle 2 (Instagram carousel) engagement 1.4%. Baseline = cycle 1 (LinkedIn text post) engagement 3.2%. Recommendation: `discard`.
**Why it fails:** Cross-platform, cross-format comparison invents a fictitious decline. The Instagram carousel may be performing fine for an Instagram carousel.
**Fix:** Attribution Honesty + Platform-Fit rubric dims catch this — baseline must be same platform AND same content type. Critic Hard Fail #5 enforces.

### 8. Engagement reported as one blended number
**Pattern:** The artifact reports "engagement: 4.1%" and stops there.
**Why it fails:** A blended engagement number hides whether the 4.1% is saves+shares (meaningful) or likes (vanity). The verdict cannot discriminate.
**Fix:** Metric Ingest always reports the 4-way breakdown (likes / saves / shares / comments). Metric Integrity rubric dim drops to 0-2 on a blended-only number.

### 9. Source write-social artifact unverified
**Pattern:** The cycle artifact's provenance lists `input_artifacts: docs/forsvn/artifacts/marketing/copy/linkedin-2026-05-01-launch.md` — but the file doesn't exist.
**Why it fails:** Without the source artifact, the eval scores against an imagined hypothesis. Future `write-social --rev=N+1` runs read provenance and can't follow the chain.
**Fix:** Metric Ingest's Blockers section catches unreadable source paths. Critic Hard Fail #10 enforces.

### 10. Confidence inflation on tiny reach
**Pattern:** A post reached 220 accounts; the artifact claims `confidence: high` on a save-rate lift.
**Why it fails:** Small reach is noise. A high-confidence keep on a tiny-reach window funds a content direction on a coin flip.
**Fix:** Attribution Honesty rubric dim caps confidence on sub-floor reach; a low-reach `keep` is Critic Hard Fail #12.

## Cross-cutting marketing-stack rows

### Cross-stack contract drift
**Pattern:** Frontmatter schema, body section list, or Results Row columns diverged silently between evaluate-content's format-conventions.md and `_shared/eval-loop-spec.md`.
**Why it fails:** Downstream consumers (dashboard, write-social --rev=N+1, ledger-summary skills) break or silently miss fields.
**Fix:** Schema changes require atomic update across format-conventions + `_shared/eval-loop-spec.md` + write-social's awareness of the contract.

### Sibling-skill confusion with evaluate-shortform / evaluate-ad
**Pattern:** A publish-social bundle contained text posts AND Reels; one evaluate-content cycle tries to score both.
**Why it fails:** Two content lanes in one cycle artifact = polluted ledger row, polluted learnings, wrong rubric on the video.
**Fix:** evaluate-content's cycle covers organic text/image/carousel only. The Reels are a separate `evaluate-shortform` cycle. Critical Gate 2 enforces.

### Upstream context skipped — no loop scaffolded
**Pattern:** Operator runs `/evaluate-content` without a loop ever created.
**Why it fails:** Eval cycles assume a `program.md` + `context.md` defining primary metric + platform scope + guardrails. Without those, scoring is heuristic.
**Fix:** Critical Gate 1 blocks. Skill returns NEEDS_CONTEXT and recommends `/run-pipeline` to scaffold first.

### Polish-chain misroute
**Pattern:** Eval artifact is sent to humanmaxxing or polish-vn after writing.
**Why it fails:** Eval artifacts are evidence + decisions, not customer-facing copy. Humanmaxxing would smooth attribution caveats into more confident-sounding prose — exactly the opposite of what attribution discipline requires.
**Fix:** Eval artifacts skip the humanmaxxing/polish-vn polish chain. They ship as-is from critic PASS.
