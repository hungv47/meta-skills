---
title: Run Eval Loop — Pre-Dispatch Procedure
lifecycle: canonical
status: stable
produced_by: run-eval-loop
load_class: PROCEDURE
---

# Pre-Dispatch Procedure

**Load when:** orchestrator enters Pre-Dispatch (before scaffold or Layer 1 dispatch). Implements the canonical Pre-Dispatch protocol (`_shared/pre-dispatch-protocol.md`) for this skill's needed dimensions.

---

## Skill-specific entry

1. Read `.forsvn/index/manifest.json`. If missing/stale: `bun scripts/manifest-sync.ts`.
2. Inspect existing loops: `find .forsvn/loops -maxdepth 2 -type f 2>/dev/null | sort`.

## Warm Start (matching loop found)

```text
Found:
- loop: .forsvn/loops/[slug]/
- program status: [status]
- latest strategy / execution / eval: [paths or none]
- latest result row: [status + metric or none]

Proceeding to resume this loop. Anything to override?
```

Then dispatch based on the ask: setup, context refresh, next-cycle planning, loop audit, or per-cycle evaluator routing.

## Cold Start (no loop / missing dimensions)

Ask one bundled set (do NOT skip under `--fast` — safety gates supersede mode downgrade):

1. **Measurable surface?** page / campaign / ad set / email sequence / social series / other
2. **Primary metric and source?** e.g. conversion rate from GA, CTR from Meta, replies from CRM
3. **Domain?** default-infer from the surface — ask only if ambiguous: `marketing` for pages/campaigns/ads/email/social, `product` for in-product UX/activation/retention, `research` for recurring research motions
4. **Mutable surface?** what can change between cycles — copy / offer / CTA / targeting / creative angle / sequence / format / UX surface
5. **Frozen surface?** what must stay fixed — brand, audience, budget, channel, product facts, compliance
6. **Baseline or first measurement window?** "unknown yet" allowed if source is known

Write answers to `context.md`, update `program.md`, then dispatch.
