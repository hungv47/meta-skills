# Worked Example — Short-Form Eval Cycle Walkthrough

A full `evaluate-shortform` run on a published FORSVN LinkedIn native-video post, traced from
operator invocation through the critic PASS. Scores the post on HOLD-RATE / RETENTION against the
matching `research-shortform` platform-intelligence catalog and the `brief-shortform` hypothesis
that produced it. **Illustrative — every metric, hold-curve point, and engagement count below is
synthetic-but-plausible, constructed for the example.** A real cycle cites a live post URL + panel
screenshot for each number.

---

## Setup

**Operator invocation:** `/forsvn:evaluate-shortform forsvn-demo-loop https://www.linkedin.com/posts/forsvn_agents-leave-receipts-activity-7338120044556 docs/forsvn/artifacts/marketing/brief-shortform-2026-05-30-agents-leave-receipts.md`

- **Loop slug:** `forsvn-demo-loop` (existing workspace under `.forsvn/loops/forsvn-demo-loop/`)
- **Post:** FORSVN LinkedIn native video, "Your coding agent already left the receipts" (47s)
- **Brief:** the `brief-shortform` hypothesis the post executed
- **Run date:** 2026-06-13

## Pre-Dispatch (Warm Start)

Read order per `procedures/pre-dispatch.md` resolved cleanly — Warm Start:

```
Found:
- brief: docs/forsvn/artifacts/marketing/brief-shortform-2026-05-30-agents-leave-receipts.md
  (topic="agent work-capture / receipts", market="US/global English", platform=linkedin)
- loop: .forsvn/loops/forsvn-demo-loop/
- catalog: docs/forsvn/artifacts/research/research-shortform/2026-05-12-linkedin-b2b-devtools.md
  (last refreshed 2026-05-12)
- prior cycles in results.tsv: 0 → this is cycle 1
- post URL: https://www.linkedin.com/posts/forsvn_agents-leave-receipts-activity-7338120044556

Cycle 1 reminder: 70% observation / 30% scoring. Rubric is provisional v0.1.

Proceed with eval, or override?
```

Operator: **Proceed.** Brief's stated hook claim = **Process-tease frame** ("Watch this in 45s —
how your agent's own pushes become an audit trail"). Catalog freshness from
`.forsvn/index/manifest.json`: `mechanics_sources_verified` 32d (≤90d window) and
`trend_signals_date` 32d (>14d trend window) → **`catalog_freshness: warn`** (one window stale;
note in §6, don't block).

## Layer 1 — parallel (`hook-strength-agent` + `eval-runner-agent`)

### hook-strength-agent → PARTIAL_MATCH

> **Observed opening 1-3s:** 0:00-0:01 on-screen text over Forest Shadow background (`#0A120D`),
> Leaf `#74B36B` underline animating in: "Your agent already left the receipts." Voice-over starts
> 0:02: "Every push your coding agent makes is a decision — here's the 45-second version of why
> that's a paper trail." (post URL @0:00-0:03)
>
> **Verdict:** PARTIAL_MATCH. Brief committed to Process-tease frame (Archetype 3, catalog n=9 OK).
> Catalog defines it as *caption first line carrying (a) numeric outcome + (b) time frame + (c)
> process verb, video opening with on-screen text restating the deliverable.* Post delivered the
> time frame ("45-second version") and the process framing, but the **numeric outcome** the
> archetype wants ("cut X by Y%") was absent — the deliverable is qualitative ("a paper trail").
> Timing landed in-window (on-screen text at 0:00, well inside LinkedIn's ~3s autoplay preview gate).
>
> **Refutable seed claim:** A Process-tease hook missing the numeric-outcome leg but keeping the
> time-frame + process-verb legs still clears the 0-3s gate but under-performs the catalog's hold
> benchmark — a future cycle pairing the same hook *with* a number scoring a stronger hold would
> refute this.

### eval-runner-agent → retention packet + provisional scores (cycle-1: observation-heavy)

> **Retention packet (synthetic, illustrative; cited to LinkedIn creator-analytics panel
> screenshot 2026-06-13 09:40, archived at `.forsvn/loops/forsvn-demo-loop/evidence/li-panel-cycle1.png`):**
>
> | Checkpoint | This post | Catalog benchmark (LinkedIn B2B devtools, n=9) | Delta |
> |---|---|---|---|
> | 3s autoplay hold-rate | 61% | 68% (median) | −7pp |
> | 0:10 retention | 44% | 52% | −8pp |
> | 50% mid-video checkpoint | 29% | 31% | −2pp |
> | 100% completion | 18% | 17% | +1pp |
>
> **Hold-rate diagnosis:** The curve's whole deficit is **front-loaded** — the post leaks 7pp at the
> 3s gate and another 8pp by 0:10, then tracks the benchmark almost exactly from the 50% checkpoint
> on. Translation: whoever stayed past 0:10 watched like a benchmark viewer; the loss is entirely at
> the hook. This is the signature of a hook that *frames* correctly (cleared the autoplay gate at 61%)
> but doesn't *promise hard enough* to convert the gate-clearers into 0:10 committers — consistent
> with the missing numeric-outcome leg hook-strength-agent flagged.

Provisional scores (cycle-1 weighting honored — observation prose above ≫ scoring prose):

```
brief-fidelity: 2/3 — Brief committed to Process-tease with a numeric outcome; post delivered the time-frame + process legs but dropped the number. Falsifiable: brief §Hook line names "cut X by Y%" intent; post deliverable is qualitative.
hook-strength-vs-platform-intel: 2/3 — Matched Archetype 3 (catalog n=9 OK) but execution slipped on the numeric-outcome leg; delivery timing in-window. Falsifiable: catalog Archetype-3 identifying-signal row requires all three legs.
pattern-log-entry-shape: 3/3 — Front-loaded hold deficit vs benchmark yields a clean refutable delta. Falsifiable: §5 block inspection.
platform-signal-freshness-flag: 2/3 — Catalog trend_signals_date 32d > 14d trend window (mechanics fresh at 32d ≤ 90d); post-ship hold variance plausibly partly traces to the stale trend leg. Falsifiable: catalog frontmatter dates vs brief ship date 2026-05-30.
author-discretion: 2/3 — Forest-brand cold-open (Leaf underline on Forest Shadow, no face) read as on-brand-distinctive but may itself cost the 3s gate vs a face-led open. Lower weight per playbook. Falsifiable: subjective by design.
```

> **§Friction Notes:** Dimension 2 score 2 felt slightly harsh — the hook cleared the gate and only
> the *number* leg was missing, yet the rubric collapses "missing one of three legs" to PARTIAL_MATCH
> with no partial credit between 2 and 3. Flag for the cycle-2-3 revision: should Archetype-3 leg-count
> be its own sub-score?

## Layer 2 — sequential (`pattern-extractor` → `critic`)

### pattern-extractor-agent → one atomic pattern-log entry

Combines hook-strength's PARTIAL_MATCH seed with eval-runner's front-loaded-deficit read into the
canonical 4-line block (see §5 of the produced artifact below).

### critic-agent → PASS

> **Overall: PASS** (cycle 1)
> 1. **Citation Discipline — PASS.** Spot-checked 61% 3s hold, −8pp 0:10 delta, n=9 catalog sample;
>    all carry panel-screenshot or catalog-path citations.
> 2. **Score Justification Falsifiability — PASS.** All five justifications name what evidence would
>    move the score (brief leg-count, catalog rows, frontmatter dates).
> 3. **Pattern-Block Shape — PASS.** Claim / Evidence / Refutability / Expiry all present; refutability
>    names an observable counter-example (same hook + number, stronger hold); expiry is a condition.
> 4. **Cycle-1 Weighting Honored — PASS.** Observation prose ≈2.3× scoring prose; claim language
>    hedges ("this cycle suggests"). **Domain gate (HOLD-RATE) checked: retention packet present, hook
>    deficit diagnosed against benchmark, not vibes.**

---

## Produced Eval Artifact (in full)

**Path:** `.forsvn/loops/forsvn-demo-loop/evals/2026-06-13-cycle-1.md`

```markdown
---
skill: evaluate-shortform
type: short-form-eval
status: done
date: 2026-06-13
stack: research
review_surface: none
cycle: 1
loop: forsvn-demo-loop
post_url: https://www.linkedin.com/posts/forsvn_agents-leave-receipts-activity-7338120044556
brief_path: docs/forsvn/artifacts/marketing/brief-shortform-2026-05-30-agents-leave-receipts.md
catalog_path: docs/forsvn/artifacts/research/research-shortform/2026-05-12-linkedin-b2b-devtools.md
catalog_freshness: warn
topic: agent work-capture / receipts
market: US/global English
platform: linkedin
rubric_version: "0.1"
rubric_status: provisional
weighting: cycle-1-70-obs-30-score
scores: {brief-fidelity: 2, hook-strength-vs-platform-intel: 2, pattern-log-entry-shape: 3, platform-signal-freshness-flag: 2, author-discretion: 2}
---

## TL;DR

The post cleared LinkedIn's 3s autoplay gate (hold-rate 61% vs 68% catalog benchmark) but its hold
deficit is entirely front-loaded — −7pp at 3s, −8pp at 0:10, then tracks the benchmark from the 50%
checkpoint on (post panel @2026-06-13 09:40). The Process-tease hook executed two of three catalog
legs (time-frame + process-verb) but dropped the numeric-outcome leg, which this cycle suggests is
the cause of the early leak. Cycle 1 — scores are provisional context, not a verdict.

## Observation

The video opens on a Forest Shadow (`#0A120D`) card, a Leaf (`#74B36B`) underline animating under
"Your agent already left the receipts" at 0:00; voice-over enters at 0:02 with the 45-second promise
(post URL @0:00-0:03). It is a clean, on-brand cold-open — no face, no "Hi everyone." The retention
curve (panel screenshot 2026-06-13 09:40, archived at
`.forsvn/loops/forsvn-demo-loop/evidence/li-panel-cycle1.png`) shows 3s autoplay hold-rate 61%,
0:10 retention 44%, 50% checkpoint 29%, 100% completion 18%. The matching catalog benchmark for
LinkedIn B2B devtools (n=9 OK) sits at 68% / 52% / 31% / 17%. The shape of the gap is the finding:
the post bleeds at the front (the hook and the first 10 seconds) and then retains like a benchmark
post — the 50%-and-beyond curve is within 2pp. A viewer who survived the hook behaved normally; the
hook simply converted fewer gate-clearers into committed watchers. Engagement panel: 71 reactions,
14 comments (9 indirect / idea-engaging, 5 tag-or-praise), 22 saves (saves/reactions 0.31) (post
panel @2026-06-13 09:40). Saves over-indexing relative to reactions is the Archetype-3 signature the
catalog predicts — consistent with the hook framing landing even where the hold leaked.

## Brief vs Observed

| Brief commitment | Observed | Verdict |
|---|---|---|
| Process-tease hook (Archetype 3) | Time-frame + process-verb legs present; numeric-outcome leg absent | Partial — 2 of 3 legs |
| 45s runtime, promised in hook | 47s, promised at 0:02 | Honored |
| Burned-in captions (≈80% mute viewing) | Present from 0:00 | Honored |
| CTA in first comment, not post body | CTA link in first comment | Honored |
| On-brand Forest cold-open | Forest Shadow + Leaf underline, no face | Honored (author-discretion note: may itself tax the 3s gate) |

The single material deviation is the dropped numeric-outcome leg — the brief's §Hook line named a
"cut X by Y%" intent the post rendered qualitatively ("a paper trail").

## Rubric Scores (v0.1, provisional)

- **brief-fidelity: 2/3** — Most commitments honored; the one deviation (missing numeric-outcome leg)
  is specific and unexplained. Falsifiable: brief §Hook names the numeric intent.
- **hook-strength-vs-platform-intel: 2/3** — Matched Archetype 3 (catalog n=9 OK) but slipped on the
  numeric-outcome leg; timing in-window. Falsifiable: catalog Archetype-3 identifying-signal requires
  all three legs.
- **pattern-log-entry-shape: 3/3** — Front-loaded hold deficit yields a clean refutable delta.
  Falsifiable: §5 block inspection.
- **platform-signal-freshness-flag: 2/3** — Trend leg stale (32d > 14d) at brief ship; mechanics fresh
  (32d ≤ 90d). Falsifiable: catalog frontmatter vs brief ship date 2026-05-30.
- **author-discretion: 2/3** — Faceless on-brand cold-open may itself cost the 3s gate vs a face-led
  open; lower weight. Falsifiable: subjective by design.

## Pattern-Log Entry

### Pattern: process-tease-missing-number-leaks-at-hook

**Claim:** This cycle suggests a LinkedIn Process-tease hook (Archetype 3) that keeps the time-frame
and process-verb legs but drops the numeric-outcome leg still clears the 3s autoplay gate yet
under-performs the catalog hold benchmark specifically in the 0-10s window (−7pp at 3s, −8pp at 0:10),
while 50%+ retention tracks benchmark.

**Evidence:**
- 3s hold 61% vs 68% catalog median; 0:10 retention 44% vs 52% (panel screenshot 2026-06-13 09:40, archived at `.forsvn/loops/forsvn-demo-loop/evidence/li-panel-cycle1.png`)
- 50% checkpoint 29% vs 31%; 100% 18% vs 17% — within 2pp from mid-video on (same panel)
- Hook executed 2 of 3 Archetype-3 legs; numeric-outcome absent (post URL @0:00-0:03; catalog Archetype-3 row, n=9 OK)

**Refutability:** A future cycle on a LinkedIn Process-tease post that *includes* the numeric-outcome
leg and still shows a ≥7pp 3s-hold deficit vs benchmark would refute the "missing number leaks at the
hook" causal read.

**Expiry:** Re-test when the same brief tier ships its next post with the numeric leg restored, OR
when the catalog refreshes its trend leg (currently 32d stale) — whichever comes first.

## Open Risks & Caveats

- **Catalog freshness `warn`:** trend leg 32d > 14d window at brief ship; part of the hold variance may
  trace to a fading trend reference rather than the hook itself. Recommend trend refresh before cycle 2.
- **Single calibration pair:** cycle 1, n=1. The causal read (missing number → front-loaded leak) is a
  directional bet, not a confirmation. The cycle-2-3 boundary is the first real variance check.
- **Faceless-open confound:** the author-discretion note (on-brand cold-open may itself tax the gate) is
  an alternate explanation for the 3s deficit not isolated this cycle.

## Recommendations for next cycle / catalog

1. Re-ship the same brief tier with the numeric-outcome leg restored; hold the Forest cold-open constant
   to isolate the number's effect on 3s hold.
2. Refresh the `research-shortform` LinkedIn B2B devtools catalog's trend leg (32d stale) before cycle 2.
3. **Rubric-revision watch:** §Friction Notes flagged that Archetype-3 leg-count has no partial credit
   between scores 2 and 3 — carry to the mandatory cycle-2-3 revision pass.
```

## Side effects (post-write, both mandatory)

```bash
bun scripts/append-loop-result.ts forsvn-demo-loop \
  --artifact evals/2026-06-13-cycle-1.md \
  --metric hold_rate_3s \
  --value 61% \
  --baseline 68% \
  --status watch \
  --description "Process-tease cleared 3s gate but front-loaded hold deficit; missing numeric leg suspected"
bun scripts/manifest-sync.ts
```

### `results.tsv` row (exact column order)

```
cycle	date	artifact	primary_metric	value	baseline	status	description
1	2026-06-13	evals/2026-06-13-cycle-1.md	hold_rate_3s	61%	68%	watch	Process-tease cleared 3s gate but front-loaded hold deficit; missing numeric leg suspected
```

`status: watch` (not `keep`/`discard`) — the post under-performed on hold but the cause is a testable
hypothesis, not a settled win or loss; cycle 2 with the numeric leg restored resolves it.

---

## FAIL → fix variant (illustrative)

Suppose pattern-extractor had first drafted free-form prose instead of the canonical block:

> "Credential-style hooks seem to hold better on LinkedIn; this one leaked early so the number probably
> matters."

**Critic Rubric #3 (Pattern-Block Shape) → FAIL.** Evidence: "No Claim/Evidence/Refutability/Expiry
lines; refutability absent; claim is unfalsifiable prose." **Route:** re-dispatch
`pattern-extractor-agent` with feedback: *"Re-author §5 in the canonical 4-line shape; the refutability
line must name an observable counter-example (e.g., a Process-tease post WITH the numeric leg that still
leaks ≥7pp at 3s), not 'the number probably matters.'"* Cycle 2 produced the block shown above and the
critic returned PASS — within the 2-cycle cap.

---

## Completion Status

**DONE** — all 4 critic rubrics PASS within 1 cycle. One pattern-log entry in canonical shape. Cycle-1
70/30 weighting honored. Carried forward to §7: catalog trend-leg refresh + the Archetype-3 leg-count
rubric-revision flag for the cycle-2-3 boundary.
