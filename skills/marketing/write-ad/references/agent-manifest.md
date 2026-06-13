# Write-Ad Agent Manifest

Loaded by the orchestrator at Layer 1 dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Strategist | 1 (solo) | `agents/strategist.md` | Picks angle archetype, audience-temperature framing (warm-obj-map vs cold-obj-map), CTA verb, creative-format implications, anchor-proof slot per variant. Surfaces spend-ceiling warning if `creative_format=repurposed-ugc`. |
| Composer | 2 (sequential) | `agents/composer.md` | Drafts hero (primary text + headline + description) + Variant A + Variant B, each with a distinct anchor. Applies Meta-specific char-cap discipline (visible-window economy). |
| Format Checker | 2 (sequential, hard-gate) | `agents/format-checker.md` | Hard-bounces on Meta char-cap violation, policy banned-phrase hit, missing substantiation on measured claims. PASS / REVISION_REQUIRED / FORMAT_FAIL. |
| Voice Auditor | 2 (sequential) | `agents/voice-auditor.md` | Peer-voice audit — strips vendor-speak, AI tells, em-dashes, generic "leading provider" language. Same auto-fail discipline as write-outreach voice-auditor, scoped to ad copy. |
| Critic | 2 (sequential, gate) | `agents/critic.md` | Rubric scoring across 7 dimensions, PASS/FAIL with per-variant scorecards. |

## Routes

### Route A — compose (single audience-temp)

```
1. Pre-Dispatch (per procedures/pre-dispatch.md)
2. LAYER 1 — strategist SOLO (3 distinct angle archetypes + 3 distinct anchor proofs)
3. LAYER 2 — SEQUENTIAL: composer → format-checker → voice-auditor → critic
4. Critic FAIL → re-dispatch FULL Layer 2 chain with feedback (max 2 cycles)
4a. Format-checker FORMAT_FAIL (second pass) → escalate to user
4b. Format-checker REVISION_REQUIRED → re-dispatch composer (does NOT consume critic cycle)
5. TERMINAL: humanmaxxing per variant (3 invocations) with content-type "short-outbound" + audience-temp + protected_tokens (named entities + numbers + URLs)
6. POST-HUMANMAXXING REGRESSION: re-run critic's Specificity dim only per variant
7. Write 3 artifacts ([slug].md + .rationale.md + .critic-score.md)
8. Deliver hero + 2 variants + rationale inline
```

### Route B — called by plan-campaign

```
1. Pre-Dispatch: read campaign context from calling skill's artifact
2. Execute Route A per audience-temperature requested (one invocation per temp — not stacked)
3. Return annotated hero + 2 variants + rationale to calling skill
```

## 7-Dim Critic Rubric

Total ≥49/70 AND every dim ≥6 = PASS. Total 49-55 with all dims ≥6 = `DONE_WITH_CONCERNS`. Any dim <6 = FAIL.

1. **Hook scroll-stop** — first line + headline stop a thumb; pattern-interrupt; no generic openers ("Looking for a better way?", "Are you tired of...").
2. **Component-char compliance** — primary text uses ~125-char visible-before-truncation window; headline ≤40 chars; description ≤30 chars; hard caps respected (3000 / 40 / 30 per Meta spec).
3. **CTA-LP match** — ad promise = LP promise; CTA verb matches LP primary action; no bait-and-switch.
4. **Pattern-interruption density** — hero + 2 variants are genuinely distinct (different angle archetype OR anchor proof OR audience-objection); surface-level paraphrase = FAIL.
5. **Policy + claim compliance** — no banned wording (health / finance / political — `policy-floor.md`); measured claims have substantiating source or are hedged; no fabricated stats; no protected-class targeting.
6. **Specificity** — Specificity Floor ≥2 verifiable specifics per variant (named entity OR named number-with-context OR named research); generic flavor ("leading", "trusted") does not count.
7. **Transmutation fit** — assigned format (AI UGC / native static / AI animation / advertorial pre-lander / Chad Funnel) is followed, proof-safe, isolates one test variable.

After critic PASS, `humanmaxxing` runs as terminal pass on each variant with `protected_tokens` including URL. Orchestrator then re-runs critic Specificity dim only — drop ≥2 OR named entity/number/URL absent post-humanmaxxing → flag THAT variant's delta + the removed specific for operator review (critic-approved version kept alongside; operator picks).

## Pattern Catalogs

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/rubric.md` | critic | 7-dim band definitions. |
| `references/policy-floor.md` | format-checker, critic | Banned policy wording (health / finance / political). |
| `references/format-spec.md` | composer, format-checker | Meta char-cap discipline. |
| `references/message-transmutation.md` | strategist | AI UGC / native static / AI animation / advertorial / Chad Funnel. |
| `references/ad-intelligence/meta-retargeting.md` | strategist | Warm objection map. |
| `references/ad-intelligence/meta-cold-traffic.md` | strategist | Cold objection map. |
| `references/ad-intelligence/creative-cadence.md` | strategist, anti-pattern | Auto-pause + creative-fatigue triggers. |
| `references/examples.md` | composer | Hero + variant patterns by archetype. |
| `references/anti-patterns.md` | critic, voice-auditor | 8 inherited + §9 orchestrator-level + §10 cross-cutting. |

Full mechanics: [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md).
