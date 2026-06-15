---
title: Outreach-Eval Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: evaluate-outreach
load_class: PROCEDURE
---

# Outreach-Eval Dispatch Mechanics

> Full dispatch + critic + side-effects procedure. Cited from SKILL.md "Dispatch" section. Body retains the 8-step Dispatch summary; this file holds the full per-agent dispatch tables + critic revision-cycle semantics + critic-override invocation + `append-loop-result.ts` helper invocation + manifest-sync invocation.

## How to spawn a sub-agent

1. **Read** agent instruction file — include FULL content in the Agent prompt
2. **Append** context (resolved cycle number + loop slug + channel+segment tag + read-order outputs from Pre-Dispatch + reply/deliverability/compliance evidence excerpts + prior cycle context from `results.tsv` (same channel+segment rows) + source write-outreach artifact content)
3. **Resolve** all file paths to absolute (rooted at the skill directory)
4. **Pass upstream artifacts by content** — orchestrator reads `program.md`, `context.md`, `results.tsv`, latest `strategy/`/`execution/`/`evals/` files + source write-outreach artifact FIRST and includes excerpts; sub-agents don't re-read these directly
5. If **critic feedback** exists (Layer 3 revision cycle), append with `## Critic Feedback — Address Every Point`

### Single-agent fallback

If multi-agent dispatch is unavailable, execute layers sequentially per the same Layer 1 → Layer 2 → Layer 3 order. There are no user-facing approval gates — the verdict is critic-gated. The critic revision cycle stays.

## Layer 1: Parallel ingest + diagnosis

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Metric Ingest Agent | program.md (primary metric + guardrails + channel/segment scope) + context.md (baselines) + channel+segment tag + reply evidence (current value + source + window + sends + reply breakdown) + deliverability/compliance evidence + results.tsv (prior cycles) + source write-outreach artifact path | — |
| Diagnosis Agent | Metric Ingest output (waited-on packet) + program.md hypothesis + execution delta + channel/segment scope + source write-outreach artifact (subject, opener, CTA, steps, hypothesis) + reply threads (sentiment, objections, step attribution) + canonical research (icp-research.md, BRAND.md) | `references/rubric.md` (for Reply-Quality + Deliverability & Compliance signal expectations) |

**Note on Layer 1 dependency:** Diagnosis consumes Metric Ingest's packet (channel/segment verification, reply breakdown, deliverability). Metric Ingest can run independently; Diagnosis waits for the packet before scoring. In single-agent mode, this collapses to sequential.

## Layer 2: Recommendation

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Recommendation Agent | Layer 1 outputs (Metric Ingest + Diagnosis) + program.md guardrails + prior cycles' verdicts (same channel+segment) + channel+segment tag | `references/rubric.md` (for routing-rule alignment) |

Output: proposed verdict (`keep | discard | watch | blocked`) + Confidence (`high | medium | low | blocked`) + channel+segment tag (echoed from Metric Ingest) + Decision sentence (includes the channel + segment) + Next Cycle Recommendation (component-granular Keep/Discard/Watch/Route-next-work-to lines) + Reply-Quality Decision block (meaningful_read + vanity_caution) + Deliverability/Compliance Gate (PASS or BLOCK-KEEP) + Results Row (8-column TSV with channel+segment in description) + Learning Promotion proposal (yes/no with channel/segment/offer-scoped lesson + expiry).

## Layer 3: Critic

| Agent | Pass These Inputs | Reference Files |
|---|---|---|
| Critic Agent | Full assembled eval artifact + Results Row proposal + Learning Promotion proposal + Layer 1 outputs + Layer 2 outputs + channel+segment tag + source write-outreach artifact path | `references/rubric.md` (canonical 7-dim 0-10 rubric — MUST load before scoring) |

Critic enforces the 7-dimension rubric (Loop Fit / Metric Integrity / Attribution Honesty / Decision Discipline / Reply-Quality Discrimination / Deliverability & Compliance / Ledger Correctness, each 0-10) + 3-tier verdict (PASS ≥49 AND no dim <6 / PASS_WITH_CONCERNS ≥42 AND no dim <6 + confidence/confounders surfaced / FAIL <42 OR any dim <6 OR any Hard Fail) + 12 Hard Fails (see critic-agent.md § Hard Fails — covers no loop / scored-a-draft / unreadable source sequence / missing-channel-segment or wrong-lane / cross-channel contamination / fabricated reply-or-compliance data / invalid ledger status / missing channel-segment in ledger description / vanity-spike learning promotion / no-baseline improvement / vanity-spike keep / deliverability-or-compliance red-flag keep).

### Revision cycle (1 cycle max)

| Critic outcome | Action |
|---|---|
| PASS or PASS_WITH_CONCERNS | Proceed to side effects (Critic Override Logging fires BEFORE side effect #2 if operator overrides on PASS_WITH_CONCERNS) |
| FAIL on first pass | Revise once — re-dispatch the agent(s) named in critic's `required_fixes`: Recommendation Agent for verdict/learning/routing/gate errors; Metric Ingest Agent for metric-integrity/channel-verification/reply-breakdown/deliverability errors; Diagnosis Agent for attribution-honesty/reply-quality/deliverability-read errors |
| FAIL after revision | Return BLOCKED with the missing-evidence list. **Write NO ledger row, NO learning promotion, NO eval artifact** (or write with `status: blocked` for audit trail per format-conventions). Operator may override via Critic Override Protocol — see below. |

### Critic Override Protocol (when operator ships despite FAIL or accepts PASS_WITH_CONCERNS)

When the operator explicitly decides to ship despite a critic FAIL OR accept a `pass-with-concerns` verdict, **log the override before any side effect fires**. The override log is the only mechanism that turns repeated operator pushback into a rubric-revision signal.

```bash
bun scripts/log-critic-override.ts \
  --skill evaluate-outreach \
  --dimension "<failed rubric dimension>" \
  --artifact "<project-relative path to the eval artifact under review>" \
  --critic-verdict <fail|pass-with-concerns> \
  --operator-decision <ship|revise|ignore> \
  --reason "<one sentence — why the override is justified>" \
  --follow-up "<none|watch metric|revise rubric|extract shared rubric>"
```

The script appends a dated block to `docs/forsvn/artifacts/meta/records/critic-overrides.md`. After three valid overrides on the same `evaluate-outreach:<dimension>` pair, the rubric should be revised (escalation handled by the dashboard's `rubrics[skill:dimension].action` field — see `_shared/quality-dashboard-spec.md`).

Only after the override is logged may side effect #2 (ledger append) proceed. The ledger row status MUST reflect actual cycle evidence — operator override does NOT promote a contested cycle to `keep`, and **never relaxes the deliverability/compliance gate**: a domain-burning or non-compliant sequence stays at `watch` or `discard`.

## Side effects (executed in order, ONLY after critic PASS or PASS_WITH_CONCERNS + override logged if applicable)

1. **Write eval artifact** at `.forsvn/loops/[slug]/evals/YYYY-MM-DD-cycle-N.md` per `format-conventions.md` template
2. **Append ledger row** via validated helper:

```bash
bun scripts/append-loop-result.ts "<loop slug>" \
  --artifact evals/YYYY-MM-DD-cycle-N.md \
  --metric "<primary metric>" \
  --value "<current value>" \
  --baseline "<baseline value>" \
  --status "<keep|discard|watch|blocked>" \
  --description "<one sentence — include channel + segment tag>"
```

The helper validates the 8-column standard schema. Custom 10+ column loops require hand-edit (see `format-conventions.md` § "Known limitation — custom schemas") — flag affected loops to the eval-loop owner BEFORE manual append.

3. **Update `learnings.md`** ONLY if critic approved promotion (high-confidence `keep`/`discard` AND lesson reusable beyond this exact sequence AND channel/segment/offer-scoped). Critic Hard Fail #9 enforces — promotion from low-confidence-or-blocked-or-vanity evidence triggers FAIL and skips this step.
4. **Run manifest sync:**

```bash
bun scripts/manifest-sync.ts
```

## 8-step Dispatch procedure (summary — full per-layer + side-effects above)

1. Resolve loop path + next cycle number + channel+segment scope. Cycle number is `last results.tsv cycle + 1`.
2. Layer 1 parallel: Metric Ingest + Diagnosis (Diagnosis waits on Metric Ingest's packet).
3. Layer 2: Recommendation consumes Layer 1 outputs and proposes verdict, reply-quality decision, deliverability/compliance gate, next-cycle routing, ledger row, learning promotion.
4. Layer 3: Critic validates artifact against the 7-dim rubric in `references/rubric.md`.
5. If Critic FAIL, revise once. If still failing, write no ledger row and return `BLOCKED` (or trigger Critic Override Protocol if operator chooses to ship).
6. Write eval artifact and append exactly one `results.tsv` row using `append-loop-result.ts`.
7. Promote learning only when Critic allows it.
8. Run manifest sync.

## Conventions

- **Cycle number resolution:** `last results.tsv cycle + 1`. Override only when the user explicitly names a cycle that has no existing eval artifact.
- **Source citation:** Every metric value cites its source (outreach tool / CRM / operator-supplied). Critic Hard Fail #6 catches fabricated values.
- **Confidence honesty:** Confidence is one of `high | medium | low | blocked`. Low-confidence and low-send findings ship as `watch` or `blocked`, not `keep`. Critic dimension "Attribution Honesty" enforces.
- **Reply-quality discipline:** Replies are always the categorized breakdown. A vanity headline (open rate / raw replies) never earns `keep`. Critic Hard Fail #11 enforces.
- **Deliverability/compliance discipline:** A deliverability red flag (bounce/spam above safe threshold, degraded reputation) or a compliance violation (opt-out not honored, CAN-SPAM/GDPR/ToS) caps the verdict at watch/discard. Critic Hard Fail #12 enforces — this gate is never relaxed, even by override.
- **Channel/segment discipline:** One cycle = one channel + segment. Critical Gate 4 + Critic Hard Fail #5 enforce. Secondary channels are Cross-Channel Context, never verdict input.
- **Boundary respect:** Recommendations route next work (e.g., "Route next work to: write-outreach --rev=N+1 — revise opener only, hold subject + CTA"). Do NOT propose specific copy — that's write-outreach's job. Critical Gate 8 + Critic dimension "Decision Discipline" enforce.
- **Component-granular recommendations:** Name the specific component to change (subject | opener | CTA | step | list), not "redo the outreach."
- **Learning promotion conservatism:** Default to NOT promote. Criteria: high-confidence + status keep/discard + lesson reusable beyond this exact sequence + channel/segment/offer-scoped.
- **Side effects ALL-OR-NOTHING on critic FAIL:** If critic FAILs after revision (and no override), skip ALL 4 side effects. Return BLOCKED with the missing-evidence list. If operator overrides, the override-log invocation fires BEFORE side effect #2; side effects #1, #2, #4 then proceed; side effect #3 (learning promotion) still requires critic PASS approval.
