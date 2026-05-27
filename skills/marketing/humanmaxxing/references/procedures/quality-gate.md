---
title: Humanmaxxing — Quality Gate Checklist
lifecycle: canonical
status: stable
produced_by: humanmaxxing
load_class: PROCEDURE
---

# Quality Gate

Critic-agent runs this checklist before delivery. Any unchecked item = critic FAIL → re-dispatch named source agent (max 2 cycles, then deliver with annotations + `DONE_WITH_CONCERNS`).

## Checklist (10 items)

- [ ] **Zero Hard Tells.** No instances from the 47-pattern Hard Tell tier (`references/ai-patterns.md`).
- [ ] **≤2 Soft Tells total** across the entire piece (judgment-allowed tier).
- [ ] **No 3+ AI-vocab clusters.** No paragraph contains 3 or more high-frequency AI-vocabulary words bunched together.
- [ ] **≥15% word reduction** from original input (Route B; Route A measures pattern fixes not word count).
- [ ] **No-generic-long-form** (long-form only): the output cannot lose another 40% of its words without losing a unique idea, datum, example, or nuance. If it can, compression was surface-only.
- [ ] **Zero idea loss.** No unique ideas, data, examples, or nuance removed vs. original. Cross-check against pre-strip diff.
- [ ] **Read-aloud test.** No stumbles, no robotic rhythm, no clause-pile.
- [ ] **Density floor.** Every paragraph contains at least one concrete fact, number, or named example.
- [ ] **Detector status recorded.** One of: `not_run` · `proxy_pass` · `pangram_pass` · `proxy_fail` · `pangram_fail`. For high-stakes public content the proxy must PASS; if `detector_mode: pangram`, the configured probability threshold from `references/detector-resistance.md` must be met or critic records `pangram_fail`.
- [ ] **Protected tokens preserved verbatim.** All Route-C `protected_tokens` (named entities, numbers, URLs) present and unparaphrased post-pipeline. Missing or paraphrased = auto-FAIL with `protected_tokens_preserved: false`.

## Re-dispatch routing on FAIL

| Failing item | Re-dispatch |
|---|---|
| Hard Tells / Soft Tells / AI-vocab clusters | strip-agent (re-scan + re-strip) |
| Word reduction / no-generic-long-form / density | compression-agent |
| Idea loss / protected tokens missing | revert to critic-approved pre-compression draft; compression-agent re-runs with stricter caps |
| Read-aloud rhythm | soul-injection-agent |
| Detector failure | detector-resistance pass (`references/detector-resistance.md`) |

Cycle cap: 2. After cycle 2, deliver `DONE_WITH_CONCERNS` with the failing dimensions annotated in artifact frontmatter.
