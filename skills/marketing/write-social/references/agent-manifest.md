# Write-Social Agent Manifest

Loaded by the orchestrator at copywriter-agent dispatch entry.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Copywriter Agent | 1 (solo) | `agents/copywriter-agent.md` | Hook variants (A/B/C) + body + CTA + format spec. Platform-aware. Hook MUST match Tier 1 or Tier 2 archetype from platform-intelligence Hook Taxonomy. |
| Format Checker Agent | 2 (sequential) | `agents/format-checker-agent.md` | Hard caps + soft visible-window + CTA placement vs truncation + format-spec correctness. Hard-cap violations bounce back to copywriter (max 1 revision cycle). |
| Critic Agent | 3 (final, single-pass) | `agents/critic-agent.md` | Scores against 5-dim rubric. Outputs per-dimension table + verdict + anti-patterns triggered. No rewrite loop (single-pass by design — short-form regenerates fast). |

**Why 3 agents:** Splitting into more (hook + body + CTA separately) introduces collision risk during merge. Three is the floor for multi-agent dispatch and the ceiling for short-form-craft skills.

**Hook variants are a DELIVERY set** (tier A — [`_shared/options-selection.md`](_shared/options-selection.md)): `--variants N` is operator-controlled and already loose; present + regenerate (`more` / `swap K`), and every variant still clears the 5-dim rubric. Nothing is discarded — the set ships together.

## Dispatch Graph

```
copywriter-agent (hook variants + body + CTA + format spec)
  → format-checker-agent
       PASS → critic-agent
       REVISION_REQUIRED (1st) → bounce to copywriter with named violations under
                                 `## Format-Checker Feedback — Address Every Violation`
       REVISION_REQUIRED (2nd) → FORMAT_FAIL → escalate to user, ship `status: blocked`,
                                  critic NOT dispatched
  → critic-agent (single-pass; 5-dim rubric + discrimination test)
       PASS / DONE_WITH_CONCERNS / FAIL → write artifact + run side effects
```

## 5-Dimension Critic Rubric

Full rubric + per-platform calibration + thresholds: [`rubric.md`](rubric.md).

- Hook scroll-stop strength (scored against platform-intel §1 Hook Taxonomy Tier 1 / Tier 2 archetypes).
- Char/word limit compliance (hard caps + soft visible-window per platform-intel §2).
- CTA placement vs algorithm truncation (X / LinkedIn; TikTok/Reels/Shorts default 10 — verbal CTA).
- Pattern-interruption density (per-platform calibration; LinkedIn over-density penalty).
- Format compliance (correct surface for goal — single post vs thread vs carousel vs vertical-video caption).

**Pass:** total ≥35/50 AND no individual dimension scores 0. **Done with concerns:** 25-34 OR any individual dimension below 4. **Fail:** <25.

**Discrimination test (mandatory every run):** weak brief MUST score <25; strong brief MUST score ≥35. If both pass or both fail, flag `RUBRIC INTEGRITY WARNING`.

## Pattern Catalogs

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/_shared/platform-intelligence/{tiktok,reels,shorts,x,linkedin,youtube}.md` | copywriter, format-checker, critic | §1 Hook Taxonomy (Tier 1 / Tier 2) · §2 Format Constraints (hard caps + soft window + truncation) · §3 Algorithm Signals (top-5) · §4 Anti-Patterns (platform-specific bait penalties). |
| `references/_shared/marketing-foundations.md` | copywriter | 9-channel framework, funnel-stage vocabulary, 3Q content test, CTA formula, VoC principles. |
| `references/format-conventions.md` | format-checker | Per-platform hard caps + soft windows + format-check rules table. |
| `references/examples.md` | copywriter | 10 per-platform strong/weak examples (1 strong + 1 weak × 5 platforms). |
| `references/anti-patterns.md` | critic | 14 named anti-patterns (10 from original + 4 cross-cutting failures) with detection rule + platform calibration + agent ownership. |

Polish-chain handoff: `humanmaxxing` and `polish-vn` read `## Body` + `## CTA`, rewrite in place, preserve Hook variants for A/B comparability, update `polish_chain_applied`. Side effects (artifact write + experience write-back + `manifest-sync.ts`) fire on PASS / DONE_WITH_CONCERNS / FAIL — NOT on FORMAT_FAIL or NEEDS_CONTEXT.

Full mechanics: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
