# Procedure — Pre-Dispatch (prioritize)

> Load when SKILL.md routes to Pre-Dispatch. Encodes the hard-gate enforcement, the read order, the constraint interview, the Warm Start template, and the route-selection conditions. Canonical Pre-Dispatch spec lives in [`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md) — this file is the prioritize-specific overlay.

---

## Entry-mode resolution (before the hard gate)

Two entry modes, resolved here at Pre-Dispatch:

| Mode | When | Gate |
|---|---|---|
| **Root-cause** (DEFAULT) | Anything not matching the ideation signals below. Behavior is unchanged — everything else in this file applies as written. | Hard gate below (`id:diagnose`) |
| **Ideation** | Input is a candidate set: a discover divergence shortlist, debate-agents poll/debate output, or a raw "generate as many ideas as possible and rank them" / "rank these ideas" ask. | **Ranking anchor** (below) replaces the diagnose hard gate |

Ideation mode is signal-gated, never assumed: a vague growth ask without a candidate set or explicit generate-and-rank intent stays in root-cause mode. Echo the resolved mode in the Warm Start summary so the operator can override.

### Ideation mode mechanics

1. **Ranking anchor (the mode's hard gate).** Capture a stated anchor — the goal/metric the ideas serve — before any agent dispatches. Source it from the handoff artifact (discover's chosen goal, the debate's decision question) or ask one question: "What goal/metric should these ideas be ranked against?" No anchor → NEEDS_CONTEXT. The anchor stands in for the root cause everywhere downstream: hypotheses tether to it, the anti-generic test runs against it, Impact scores against it.
2. **Phase 1 expands at volume.** The generation quota is a **parameter**: default 5-10 + 2-4 unconventional as usual; an explicit "as many as possible" / "20 ideas" ask sets the quota accordingly. Seed candidates from the input set are kept (deduplicated), expanded, then Phase 2 force-ranks and ICE-scores the whole set per [`references/_shared/idea-ranking-core.md`](../_shared/idea-ranking-core.md) [PLAYBOOK] — the ranking invariants are identical in both modes.
3. **Everything else unchanged.** Read order (minus the diagnose requirement), staleness check (on the source artifact if any), Constraint Interview, route selection, write-back map, and Out-of-Scope persistence apply as written.

---

## Hard gate (root-cause mode only — enforced before any agent dispatches)

`id:diagnose` must resolve (diagnose's output, via `find-artifacts --resolve diagnose`). In ideation mode this gate is replaced by the ranking anchor above.

**Unresolvable → return NEEDS_CONTEXT.** Recommend:

```
NEEDS_CONTEXT — prioritize requires id:diagnose (run `diagnose` first).

Initiative ranking against an unvalidated root cause produces a generic
growth playbook. Run `diagnose` first to identify the root cause; prioritize
then generates initiatives anchored to it.

Do NOT substitute via interview — the diagnostic rigor (hypothesis testing,
data-mapping, verdict) is what makes initiatives non-generic.
```

The hard gate fires under `--fast` too. Safety gates supersede the mode-resolver downgrade.

---

## Read order (post-gate, in order)

1. **Pipeline (required):** `id:diagnose` (the diagnosis artifact) — the validated root cause + gap percentages.
2. **Pipeline (optional):** `id:product-context` — business profile (constraints + capabilities). Improves impact estimation.
3. **Pipeline (optional):** `research/icp-research.md` — audience-fit scoring for customer-facing initiatives.
4. **Pipeline (optional):** `research/market-research.md` — market gaps + competitive intel sharpen initiative generation.
5. **Experience (read, don't ask):** `docs/forsvn/experience/{goals,business,product}.md` — team capacity, prior attempts, constraint context.
6. **Prior runs (warm-start signal):** `docs/forsvn/artifacts/meta/sketches/prioritize-*.md` (newest if any). If present and same root cause → flag staleness; new run will rename to `prioritize.v[N].md`.

(The Out-of-Scope directory at `docs/forsvn/artifacts/meta/out-of-scope/` is WRITTEN by this skill on Kill decisions — see `dispatch-mechanics.md` Out-of-Scope Persistence section. The original SKILL.md does NOT have prioritize self-read this directory; that read is delegated to downstream `discover` and `orchestrate-*` skills per the original "Why" rationale. A self-read here would be net-new behavior — deferred to v6.3.0 if the operator wants it.)

---

## Staleness check

If `diagnose-*.md` `date` field is >30 days old → surface as a warning before proceeding:

```
WARNING: diagnose-*.md is N days old (>30). The root-cause landscape may have shifted.
Consider re-running `diagnose` before generating initiatives, or proceed and
flag every initiative as "based on N-day-old root cause."
```

User can proceed with the warning; the artifact will carry the staleness flag.

---

## Warm Start (default path — most invocations after the first)

Emit a single short summary. No bundled questions unless constraint dimensions are missing.

```
prioritize — found:
  • diagnose verdict → "[top root causes from diagnose.md]"
  • product → "[from product-context.md or experience/product.md]"
  • team capacity → "[from experience/business.md]" (or "ask")

Generating initiatives against these root causes. Override the root cause
priority, change constraints, or proceed?
```

If user proceeds (or stays silent past one beat), run the **Constraint Interview** below (one bundled prompt if any constraint dimension is unresolved), then dispatch per the Route chosen in `procedures/dispatch-mechanics.md`.

---

## Constraint Interview (only if unresolved from experience/business.md or product-context.md)

```
Three constraints shape initiative scoring. Confirm or add:

1. Budget ceiling — "no ceiling", "<$5k", "<$50k", or specify.
2. Team size — number of people who can execute, with their roles (e.g., "3-person growth team: 1 PM, 2 engineers").
3. Hard deadlines — "none", or specific dates (e.g., "before Q3 board review on 2026-07-15").
4. Prior attempts — what's been tried for this root cause? What worked or didn't? (One sentence per attempt.)
```

Answers feed the dispatch as in-context input — they do NOT persist to experience/. The original SKILL.md explicitly states "prioritize doesn't seed dimensions to experience/ — initiatives are project-specific tactics, not stable user-profile state." Preserved here verbatim.

---

## Cold Start (only when diagnose verdict semantics are unresolvable)

Cold Start is rare — diagnose upstream produces a clear root cause statement. When it fires (e.g., diagnose verdict is genuinely ambiguous or the file is malformed), emit one bundled prompt:

```
prioritize needs clarification before generating initiatives. Answer all in
one response — I'll confirm and dispatch.

1. Restate the root cause(s) in one sentence each, from diagnose.md.
   (If multiple, list the gap % each represents.)
2. Confirm the goal this prioritize run is solving for — typically the
   metric named in diagnose.md, e.g., "weekly signups recovery to 300".
3. Constraints — budget, team, deadlines (see Constraint Interview).
4. Prior attempts — what's been tried for this root cause? (One per line.)
```

---

## Route Selection

| Trigger | Route | Why |
|---|---|---|
| Default — any non-trivial solution design | **A — Full Analysis** | research-agent + parallel initiative-generator + unconventional-agent + L2 sequential. The unconventional scan's expected value is high relative to its parallel cost |
| User explicitly requests speed AND has identified candidate approaches | **B — Quick Design** | Skip unconventional-agent; the user has signalled they want ranking not generation |
| `--fast` flag or "fast mode" phrasing | **B** with critic gate collapsed | Mode-resolver enforces single-pass after unconventional skip; hard gate still fires |
| `--deep` flag or "thorough analysis" phrasing | **A** with critic loop max 2 | Default route; phrasing reinforces willingness to iterate |

Echo the chosen route in the Warm Start summary (per above). Operator can override before dispatch.

---

## Write-back map

**Experience write-back: NONE.** Original SKILL.md is explicit: "prioritize doesn't seed dimensions to experience/ — initiatives are project-specific tactics, not stable user-profile state." Constraint Interview answers feed dispatch as in-context input only; they do not persist.

The Out-of-Scope persistence IS the long-lived record of what was decided. After dispatch completes AND artifact ships PASS or done_with_concerns, write one file per Kill to `docs/forsvn/artifacts/meta/out-of-scope/[kebab-name].md` per `dispatch-mechanics.md` Out-of-Scope Persistence section.

---

## Mode-resolver interaction

`metadata.budget: deep` → modal path is Route A (in `dispatch-mechanics.md`).

- `--fast` flag or "fast mode" phrasing → force Route B (skip unconventional-agent) with critic gate collapsed to single pass. Hard gate above non-negotiable.
- `--deep` flag or "thorough analysis" phrasing → Route A with critic loop max 2 cycles. (Same as default but reinforces willingness to iterate.)
- Otherwise: Route A is default per `dispatch-mechanics.md` Route Selection table.

The route is chosen during Pre-Dispatch. Echo the chosen route in the Warm Start confirmation so the operator can override before dispatch.

---

## Anti-patterns in Pre-Dispatch

- **Substituting interview for the hard gate.** "Tell me your root cause" is not equivalent to diagnose. Hard gate refuses.
- **Skipping the staleness check on diagnose.md.** A 6-month-old root cause against this-quarter initiatives produces fiction.
- **Skipping the out-of-scope read.** Re-debating a killed initiative wastes a full skill run. Read the directory first; surface to operator if any candidate would have surfaced again.
- **Running the Constraint Interview when experience/business.md already encodes the constraints.** Read first; ask only what's missing.
- **Running Cold Start under `--fast` without honoring it.** Cold Start fires under `--fast` if context is truly missing. `--fast` only collapses orchestration after context is resolved.
- **Writing to experience BEFORE the artifact ships.** Write-back happens after the artifact is committed and critic PASSes (or done_with_concerns ships). Partial runs that BLOCK should not persist constraints.
