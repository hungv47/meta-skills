# Procedure — Pre-Dispatch (funnel-planner)

> Load when SKILL.md routes to Pre-Dispatch. Encodes the hard-gate enforcement, the read order, the warm-start prompt, the write-back map, and the growth-motion fallback. Canonical Pre-Dispatch spec lives in [`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md) — this file is the funnel-planner-specific overlay.

---

## Hard gate (enforced before any agent dispatches)

`docs/forsvn/artifacts/meta/sketches/prioritize-*.md` must exist.

**Missing → return NEEDS_CONTEXT.** Recommend:

```
NEEDS_CONTEXT — funnel-planner requires docs/forsvn/artifacts/meta/sketches/prioritize-*.md.

Targets without a ranked initiative list are arbitrary. Run `prioritize` first
to produce the ICE-scored cut-line; funnel-planner then sets numeric targets
against those initiatives.

Do NOT substitute via interview — the ICE rigor (scoring, kill criteria,
cut-line) is what makes targets defensible.
```

The hard gate fires under `--fast` too. Safety gates supersede the mode-resolver downgrade.

---

## Read order (post-gate, in order)

1. **Pipeline (required):** `docs/forsvn/artifacts/meta/sketches/prioritize-*.md` — the ranked initiative list. Pull every initiative marked "Proceed" (above the cut-line).
2. **Pipeline (optional):** `research/product-context.md` — business profile (type, stage, sales cycle, revenue model). Improves benchmark selection in `references/benchmarks.md`. Missing → recommend `research-icp` but proceed without if user declines.
3. **Experience (read, don't ask):** `docs/forsvn/experience/business.md` — growth motion (PLG/SLG/Hybrid), funnel state, prior baselines. `docs/forsvn/experience/goals.md` — revenue target, time horizon.
4. **Prior targets (warm-start signal):** `docs/forsvn/artifacts/meta/records/targets-*.md` (newest). If present and same initiatives → consider Route C (Fast Bump).

---

## Staleness check

If upstream artifacts' `date` fields are >30 days old → surface as a warning before proceeding:

```
WARNING: prioritize-*.md is N days old (>30). Baselines may have drifted.
Consider re-running `prioritize` before setting targets, or proceed and
flag every target as "based on N-day-old initiative ranking."
```

User can proceed with the warning; the artifact will carry the staleness flag.

---

## Warm Start (default path — most invocations after the first)

Emit a single short summary. No bundled questions.

```
Funnel-planner — found:
  • prioritize.md → [N initiatives above cut line]
  • growth motion → [PLG | SLG | Hybrid] (from experience/business.md)
  • product-context.md → [present | missing — proceeding without]

Setting targets against these initiatives. Override growth motion, change
the initiative subset, or proceed?
```

If user proceeds (or stays silent past one beat), dispatch per the Route chosen in `procedures/dispatch-mechanics.md`.

---

## Cold Start (only when growth motion is unresolvable AND experience is empty)

Cold Start is rare for this skill — `prioritize` upstream usually populates experience. When it fires (e.g., experience/business.md missing AND product-context.md missing AND prioritize.md doesn't encode motion), emit one bundled prompt:

```
Funnel-planner needs a few facts before setting targets. Answer all in one
response — I'll confirm and dispatch.

1. Business type (one): SaaS · e-commerce · marketplace · B2B services · consumer app · other [specify]
2. Stage (one): pre-launch · early traction · growth · mature
3. Growth motion (one): PLG (self-serve drives acquisition) · SLG (sales/paid drives acquisition) · Hybrid (both, designate primary)
4. Active channels (multi-select from the 9-channel map): Search/GEO · Store/Listing · Bounty/Info · News · Forums/Communities · Social · IRL · Mailbox · SMS
5. Optional: any baselines you already know (conversion rate, signups/week, LTV, CAC)
```

Write answers to `docs/forsvn/experience/business.md` immediately (see Write-back map below).

---

## Write-back map

After dispatch completes, append to experience files. Never silently overwrite.

| Trigger | Append to | Key |
|---|---|---|
| Growth motion identified (or confirmed) | `experience/business.md` | `Growth motion: PLG | SLG | Hybrid (primary: X)` |
| Baseline collected for a metric | `experience/business.md` | `Funnel baseline: [stage] [metric] = [value] ([source], confidence: high/med/low, [date])` |
| Channel mapping decided | `experience/business.md` | `Active channels: [list from 9-channel map]` |
| Three-outcome coverage chosen | `experience/goals.md` | `Outcomes: Business=Covered, Brand=[Covered/Gap/N/A: reason], Community=[same]` |
| LTV:CAC computed | `experience/business.md` | `Unit economics: LTV=$X, CAC=$X, ratio=X:1, payback=X mo (date: YYYY-MM-DD)` |

The write-back is what amortizes context across the chain — `plan-campaign` and future `plan-funnel` re-runs read these without re-asking.

---

## Mode-resolver interaction

`metadata.budget: standard` → modal path is Route B (in `dispatch-mechanics.md`).

- `--fast` flag or "fast mode" / "quick pass" phrasing → force Route C (single-pass target-setter, no critic gate). If Route C conditions fail (no prior targets, multi-initiative, structural change) → fall back to Route B even under `--fast`. The hard gate above is non-negotiable regardless of `--fast`.
- `--deep` flag or "run thoroughly" / "full analysis" → force Route A (full Layer 1 parallel + Layer 2 sequential, all 6 agents).
- Otherwise: auto-select per `dispatch-mechanics.md` Route Selection table.

The route is chosen during Pre-Dispatch. Echo the chosen route in the Warm Start confirmation so the operator can override before dispatch.

---

## Anti-patterns in Pre-Dispatch

- **Asking the user for the growth motion when experience/business.md already encodes it.** Read first.
- **Skipping the staleness check on prioritize.md.** A 6-month-old ranking against this-quarter targets produces fiction.
- **Substituting interview for the hard gate.** "Tell me your initiatives" is not equivalent to ICE-scoring. Hard gate refuses.
- **Running Cold Start under `--fast` without honoring it.** Cold Start fires under `--fast` if context is truly missing — `--fast` doesn't authorize hallucinating against missing growth motion. Only the multi-agent orchestration is collapsed.
- **Writing back to experience BEFORE the artifact ships.** Write-back happens after the artifact is committed and critic PASSes (or done_with_concerns ships) — not earlier. Partial runs that BLOCK should not persist baselines.
