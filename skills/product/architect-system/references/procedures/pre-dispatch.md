---
type: procedure
skill: architect-system
purpose: "Pre-dispatch read order, dimensions to extract, and interview pointers."
---

# Architect-System — Pre-Dispatch

Run the canonical Pre-Dispatch protocol ([`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md)).

## Needed Dimensions

- Spec/PRD reference.
- Scale targets (users / RPS / data).
- Constraints (budget / team skills / latency / compliance).
- Deployment context (greenfield / brownfield / migration).

## Read Order

1. **Pipeline:** `docs/forsvn/artifacts/meta/specs/*.md`, `docs/forsvn/artifacts/meta/sketches/prioritize-*.md`, `docs/forsvn/artifacts/product/flow/*.md`, existing `architecture/system-architecture.md` (if re-run).
2. **Codebase:** package manifest, existing schema files, framework signals.
3. **Experience:** `docs/forsvn/experience/technical.md` for stack history + constraints.

## Interview Prompts

Warm Start, Cold Start, and the 8-question Architecture Interview live in [`../pre-dispatch-prompts.md`](../pre-dispatch-prompts.md).

## Before-Starting Context

- **Mode resolution:** `budget: deep`. Auto-downgrades to `fast` for simple products (<3 user types AND <5 data entities) → Single-Agent Fallback. `--fast` forces single-agent regardless of scope. All 8 Critical Gates fire in every mode.
- Read `research/product-context.md`. Missing → interview for product dimensions or recommend `/research-icp`. `date` >30 days → recommend refresh.
- Read `.forsvn/index/manifest.json` for prior runs + downstream task state.
- Read `docs/forsvn/experience/technical.md` for stack history + constraints.
