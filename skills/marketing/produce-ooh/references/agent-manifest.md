# Agent Manifest — produce-ooh

Sequential 3-agent graph.

| # | Agent | File | In | Out |
|---|---|---|---|---|
| 1 | Concept | [`../agents/concept-agent.md`](../agents/concept-agent.md) | message + placement + brand | the one idea + dominant visual + the line |
| 2 | Spec & Legibility | [`../agents/spec-legibility-agent.md`](../agents/spec-legibility-agent.md) | concept + OOH type + placement | full OOH spec + render manifest + production notes |
| 3 | Critic | [`../agents/critic-agent.md`](../agents/critic-agent.md) | the spec | verdict; on PASS the artifact ships |

## Dispatch
- **Default (multi):** all 3 in sequence.
- **`--fast` (single):** Concept + core Spec inline (dimensions, type size, the line), skip the production-note depth; Critic still runs the drive-by test.
- **Revision:** Critic FAIL → one cycle (idea/copy → Concept; legibility/format → Spec). Second FAIL → BLOCKED.

## Rubric (5 dimensions, 0–10 each; pass ≥35/50, no dim 0)

1. **3-second read** — one message, legible at the placement's real viewing distance/speed (≤7 words for highway).
2. **Single idea** — exactly one message; no competition.
3. **Legibility** — letter height meets the distance math (~1 in / 10 ft, more for speed); high contrast; critical content inside safe margins.
4. **Format fidelity** — correct dimensions, bleed, resolution, file spec — matched to the vendor template, not guessed.
5. **Brand fidelity** — on-brand, matte, accent discipline (Leaf <10%; no gradient/glass).

The critic runs the drive-by (thumbnail-for-1-second) test every cycle.

## Render
Like `produce-asset`, this skill emits a render-ready prompt + manifest only — pixels come from an operator-connected engine via `references/_shared/execution-fork.md`. No API keys here.
