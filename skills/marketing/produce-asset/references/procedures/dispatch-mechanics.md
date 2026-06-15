# Dispatch Mechanics — produce-asset

Canonical orchestration for produce-asset. Single route (export-mode).

## Route A — export-mode (default + only)

```
1. Pre-Dispatch
   - Read brief-graphic artifact (docs/forsvn/artifacts/marketing/design-briefs/[slug].md)
   - Read brand/BRAND.md + brand/DESIGN.md
   - If brief missing → return NEEDS_CONTEXT (defer to brief-graphic)
   - If brand files missing → return NEEDS_CONTEXT (defer to create-brand)
   - If --publish / --api-render passed → return BLOCKED with the export-mode floor message

2. Dispatch: prompt-author-agent for EACH slot in the brief
   - Sequential by default; --parallel flag fans out per-slot
   - Each call carries: slot spec, brand tokens, platform spec, copy-to-render verbatim

3. Dispatch: critic-agent on the assembled manifest + all prompts
   - Verifies the 6 Quality Gate checks

4. Critic FAIL → re-dispatch prompt-author-agent for the failing slot(s) with feedback
   - Max 2 cycles
   - Critic PASS twice with operator override → log via scripts/log-critic-override.ts

5. Critic PASS → write manifest.md + prompts/[slot-id].md files

6. Return:
   - manifest path
   - slot count
   - operator's next-step: "Run the prompts through your chosen renderer; mark the manifest's verification checklist when each slot is on-spec."
```

## Why intentionally lean

The work IS the prompt + manifest, not multi-perspective synthesis. A single prompt-author → critic pipeline is sufficient. No parallel Layer 1, no merge step, no variant agent. This is the shared 2-agent dispatch pattern — see [`../_shared/production-pattern.md`](../_shared/production-pattern.md) § 4.

## Re-run triggers

- brief-graphic re-emitted
- brand/DESIGN.md tokens updated
- target platforms changed
- operator rejected a rendered asset and wants a sharpened prompt

## Chain position

- **Previous:** `brief-graphic` (required), `create-brand` (required for brand tokens)
- **Next:** operator runs prompts through chosen renderer; rendered asset feeds future `evaluate-content` / `evaluate-ad` cycles
