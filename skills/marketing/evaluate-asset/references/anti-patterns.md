---
title: Asset-Eval Anti-Patterns
lifecycle: canonical
status: stable
load_class: ANTI-PATTERN
---

# Asset-Eval Anti-Patterns

> Re-read before any cycle artifact ships. Each row names the pattern, why it fails, and the fix. Critic Hard Fails are the enforcement teeth.

## Asset-eval-specific anti-patterns

### 1. Scoring the prompt instead of the render
**Pattern:** The cycle scores `produce-asset`'s emitted prompt ("this should produce a clean hero") — no rendered asset was ever re-ingested.
**Why it fails:** A prompt is an intention, not an output. The render is where the engine drifts off-spec; scoring the prompt scores the brief twice and never closes the loop.
**Fix:** Critical Gate 2 + Critic Hard Fail #2. Metric Ingest confirms the asset is re-ingested + viewable before any scoring; only-a-prompt → NEEDS_CONTEXT routing to `produce-asset` + re-ingest.

### 2. Pretty render, missed hard constraint, scored keep
**Pattern:** The render is striking; the artifact claims `keep`. The brief required a 4:5 portrait; the render is 1:1. Required headline copy slot is absent.
**Why it fails:** A beautiful asset that misses a hard acceptance criterion cannot be used where the brief needed it. Keeping it funds a render direction that fails in production.
**Fix:** Brief-Fidelity Discrimination dim requires every hard criterion checked against the render; a hard miss blocks `keep`. Critic Hard Fail #11 enforces.

### 3. Off-brand render kept on visual appeal
**Pattern:** The render uses a vivid palette that drifts off the brand tokens, or floods the frame with Leaf; the artifact keeps it because "it pops."
**Why it fails:** Off-brand assets erode the brand system the loop is supposed to protect. Leaf is a state-cue (<10%), not a fill.
**Fix:** Render-Quality & Brand-Fit dim checks palette adherence, the Leaf <10% rule, type, and logo safe-zone against the brand tokens. Critic Hard Fail #12 enforces a brand-fit failure under a `keep`.

### 4. Scope drift to "re-render everything"
**Pattern:** One copy slot was mangled; recommendation suggests "new composition + new palette + new engine + new aspect ratio + new brief."
**Why it fails:** Eval scope is render diagnosis + next-cycle routing, not art-direction maximalism. Maximalist recommendations always include the actual fix among 6 unrelated changes — unfalsifiable.
**Fix:** Routing must be to the smallest correct next skill (produce-asset re-render with a tightened prompt, not "redo everything"). Decision Discipline dim catches this.

### 5. Lane drift into evaluate-shortform / evaluate-landing-page / evaluate-content territory
**Pattern:** The asset under evaluation is a video cut, a full landing page, or a live post; evaluate-asset scores it anyway.
**Why it fails:** Video needs the short-form lens (`evaluate-shortform`); a landing page needs conversion discipline (`evaluate-landing-page`); a live post's engagement needs analytics (`evaluate-content` / `evaluate-ad`). Scoring them here applies the wrong rubric.
**Fix:** Critical Gate 4 + Critic Hard Fail #4. Metric Ingest's lane check STOPs on video / landing page / live-post-engagement and routes to the sibling skill.

### 6. Fabricated visual detail
**Pattern:** "The headline is crisp and centered" — but the orchestrator never opened the image, or the render has no headline.
**Why it fails:** Hallucinated visual detail is the easiest evidence to invent in a render eval; future cycles read it as fact and ship an off-spec asset.
**Fix:** Diagnosis judges only what is visible in the attached render (Read the image). Critic Hard Fail #6 (fabricated claim) enforces.

### 7. Variant ambiguity — scored "the asset" with a set present
**Pattern:** The engine returned 6 variants; the cycle scores "the render" without naming which one.
**Why it fails:** A 6-variant blend has no single verdict — keep/discard is meaningless when the scored object is undefined, and downstream skills can't reference the kept asset.
**Fix:** Metric Ingest identifies the picked variant (`asset_picked`); the cycle scores that one. Critic Hard Fail #10 enforces.

### 8. Confidence inflation on a single render with no baseline
**Pattern:** First render in a new loop; the artifact claims `confidence: high` keep with nothing to compare against.
**Why it fails:** A single render with no prior comparable is a starting point, not a validated win. High-confidence promotion from it pollutes learnings.md.
**Fix:** Attribution Honesty caps confidence when no baseline exists; a no-baseline keep ships as `watch`. Learning promotion requires a baseline (Critic Hard Fail #9).

### 9. Source brief unverified
**Pattern:** The cycle's provenance lists `input_artifacts: design-briefs/launch-hero.md` — but the file doesn't exist, so "fidelity" is scored against an imagined spec.
**Why it fails:** Without the source brief, the acceptance criteria are invented; the verdict is unfalsifiable.
**Fix:** Metric Ingest's Blockers section catches unreadable source paths. Critic Hard Fail #5 (missing/fabricated criteria) + #3 (unreadable brief) enforce.

### 10. Soft preference treated as a hard failure
**Pattern:** The render meets every hard constraint but the operator "wanted a warmer mood"; the cycle scores `discard`.
**Why it fails:** Killing a spec-compliant render on a soft taste preference wastes a good asset and trains the loop to chase un-falsifiable taste.
**Fix:** Metric Ingest tags criteria hard/soft; soft preferences route to a `watch` + a soft-criteria note, not a `discard`. Brief-Fidelity Discrimination dim keeps the hard/soft split honest.

## Cross-cutting marketing-stack rows

### Cross-stack contract drift
**Pattern:** Frontmatter schema, body section list, or Results Row columns diverged silently between evaluate-asset's format-conventions.md and `_shared/eval-loop-spec.md`.
**Why it fails:** Downstream consumers (dashboard, produce-asset --rev=N+1, ledger-summary skills) break or silently miss fields.
**Fix:** Schema changes require atomic update across format-conventions + `_shared/eval-loop-spec.md` + downstream callers.

### Sibling-skill confusion with the eval lanes
**Pattern:** A produced-assets bundle contained a static graphic AND a video cut; one evaluate-asset cycle tries to score both.
**Why it fails:** Two asset lanes in one cycle artifact = polluted ledger row, polluted learnings, wrong rubric on the video.
**Fix:** evaluate-asset's cycle covers one static render only. The video is a separate `evaluate-shortform` cycle. Critical Gate 4 enforces.

### Upstream context skipped — no loop scaffolded
**Pattern:** Operator runs `/evaluate-asset` without a loop ever created.
**Why it fails:** Eval cycles assume a `program.md` + `context.md` defining primary metric + asset scope + guardrails. Without those, scoring is heuristic.
**Fix:** Critical Gate 1 blocks. Skill returns NEEDS_CONTEXT and recommends `/run-pipeline` to scaffold first.

### Polish-chain misroute
**Pattern:** Eval artifact is sent to humanmaxxing or polish-vn after writing.
**Why it fails:** Eval artifacts are evidence + decisions, not customer-facing copy. Humanmaxxing would smooth attribution caveats into more confident-sounding prose — the opposite of attribution discipline.
**Fix:** Eval artifacts skip the humanmaxxing/polish-vn polish chain. They ship as-is from critic PASS.
