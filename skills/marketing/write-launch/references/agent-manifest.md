# Write-Launch Agent Manifest

Loaded by the orchestrator at launch-copywriter-agent dispatch entry.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Launch Copywriter Agent | 1 (solo) | `agents/launch-copywriter-agent.md` | The complete native launch bundle (primary identifier + descriptor + anchor narrative + amplification + metadata). Channel-instantiated from the pack. Every identifier/anchor MUST name a §1 launch angle. |
| Guard Checker Agent | 2 (sequential) | `agents/guard-checker-agent.md` | §2 format caps + the §4 **hard guards** (PH no-vote-ask; Reddit founder-disclosure + 9:1 + sub-rule/flair fit). A hard-guard breach bounces to the copywriter (max 1 revision); a breach on the 2nd check = `GUARD_FAIL` (publish-blocking). |
| Critic Agent | 3 (final, single-pass) | `agents/critic-agent.md` | Scores against the 5-dim rubric. A §4 hard-guard breach forces Dimension 2 to 0. Outputs per-dimension table + verdict + anti-patterns + discrimination test. No rewrite loop. |

**Why 3 agents:** the same floor as `write-social` — generation, structural+policy compliance, and scoring are distinct concerns that collide if fused. The guard-checker (not just a format-checker) exists because launch channels have **publish-blocking** rules, not only caps.

**Variants are a DELIVERY set** (tier A — [`_shared/options-selection.md`](_shared/options-selection.md)): `--variants N` is operator-controlled; the identifier + anchor-narrative variants ship together, each clearing the rubric.

## Dispatch Graph

```
launch-copywriter-agent (full bundle: identifier + descriptor + anchor + amplification + metadata)
  → guard-checker-agent
       PASSED → critic-agent
       REVISION_REQUIRED (1st) → bounce to copywriter with named violations under
                                 `## Guard-Checker Feedback — Address Every Violation`
       REVISION_REQUIRED / hard-guard breach (2nd) → GUARD_FAIL → escalate to user,
                                 ship `status: blocked`, critic NOT dispatched
  → critic-agent (single-pass; 5-dim rubric + discrimination test)
       PASS / DONE_WITH_CONCERNS / FAIL → write artifact + run side effects
```

## 5-Dimension Critic Rubric

Full rubric + per-channel calibration + thresholds: [`rubric.md`](rubric.md).

- Angle fit / clarity (identifier + anchor match a pack §1 launch angle; clarity over cleverness).
- Format + hard-guard compliance (§2 caps + §4 hard guards — a guard breach scores 0).
- Velocity-earning structure (engineers earned first-window velocity per §3/§5; never a vote-ask/beg).
- Channel-native voice / culture fit (reads native, not press-release/promo; respects channel culture).
- Bundle completeness + coherence (all native components present + mutually consistent + run-of-show aligned).

**Pass:** total ≥35/50 AND no individual dimension scores 0. **Done with concerns:** 25-34 OR any dimension below 4. **Fail:** <25.

**Discrimination test (mandatory every run):** weak brief MUST score <25 (a vote-ask alone forces D2=0); strong brief MUST score ≥35. If both pass or both fail, flag `RUBRIC INTEGRITY WARNING`.

## Pattern Catalogs

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/_shared/platform-intelligence/{producthunt,reddit,…}.md` | copywriter, guard-checker, critic | §1 Launch Angles · §2 Format Constraints · §3 Ranking Signals · §4 Anti-Patterns/hard guards · §5 Playbook · §6 Timing · §7 CTA norms. |
| `references/_shared/marketing-foundations.md` | copywriter | 9-channel framework, funnel-stage vocabulary, CTA formula, VoC principles. |
| `references/format-conventions.md` | guard-checker | §2 caps + the hard-guard check rules table + the 16-field frontmatter + body schema. |
| `references/examples/launch-walkthrough.md` | copywriter | Worked PH + Reddit bundles (strong / weak). |
| `references/anti-patterns.md` | critic | 10 named anti-patterns (6 launch-craft + 4 cross-cutting) with detection rule + channel calibration + agent ownership. |

Polish-chain handoff: `humanmaxxing` / `polish-vn` read the bundle's narrative components (`### Descriptor`, `### Anchor narrative`, `### Amplification`), rewrite in place, preserve the primary-identifier variants, update `polish_chain_applied`. Side effects (artifact write + experience write-back + `manifest-sync.ts`) fire on PASS / DONE_WITH_CONCERNS / FAIL — NOT on GUARD_FAIL or NEEDS_CONTEXT.

Full mechanics: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
