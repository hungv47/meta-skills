# Produce-Video Agent Manifest

Loaded by the orchestrator at dispatch.

## Agents

| Agent | Layer | File | Focus |
|---|---|---|---|
| Prompt Author | 1 | `agents/prompt-author-agent.md` | Per-shot prompt (visual + OST + voice spec) + HyperFrames scaffold + Remotion scaffold + vercel-ai-cli README + post.md stage + a recommended production lane. Assembles the full bundle. |
| Critic | 2 (final) | `agents/critic-agent.md` | 4 gates (shortform) or 7 gates (app-preview). Schema-and-CTA · Brand-mark fidelity · Caption-pace · Narrative arc · (app-preview only) Screenshot grounding · Interaction-vocabulary + mask-transform · Pointer-and-caption-band fidelity. |

Intentionally lean: sequential prompt-author → critic. Mirrors the shared production pattern ([`_shared/production-pattern.md`](_shared/production-pattern.md) § 4). Per-shot parallelism and long-video narrative coherence are out of scope — this skill targets short-form.

## Routes

Two routes — discriminated by input brief's `type` frontmatter at pre-dispatch.

### Route A — shortform mode

```
1. Pre-Dispatch — locate brief-shortform artifact (or schema-compliant video-brief);
   read brand/BRAND.md + brand/DESIGN.md; validate against video-brief-schema.md
   (general validation rules 1-3 + shortform rules 4-7)
2. Dispatch: prompt-author-agent (assembles full bundle in shortform mode)
3. Dispatch: critic-agent on the assembled bundle (Gates 1-4)
4. Critic FAIL on Gate 1/2/3 → re-dispatch prompt-author-agent with feedback (max 2 cycles)
5. Critic FAIL on Gate 4 only → ship done_with_concerns
6. Critic PASS → write bundle to docs/forsvn/artifacts/marketing/produced-videos/[slug]/
7. Return bundle path + shot count + recommended production lane + lane choices
```

### Route B — app-preview mode

```
1. Pre-Dispatch — locate brief-app-preview's handoff-produce-video.md (or accept brief.md and
   resolve the sibling handoff); read companion brief.md + assets.md; verify every source_id
   resolves to a file on disk; validate against video-brief-schema.md
   (general validation rules 1-3 + app-preview rules A-K).
   If brand_source: brand-md → read brand/BRAND.md + brand/DESIGN.md.
   If brand_source: cold-start-hint → skip brand-file read, sample colors per-beat from source screenshots.
2. Dispatch: prompt-author-agent (assembles full bundle in app-preview mode — composition-operation
   prompts, full Remotion + HyperFrames scaffold parity, collapsed vercel-ai-cli.md)
3. Dispatch: critic-agent on the assembled bundle (Gates 1-7; Gates 5/6/7 are app-preview-only hard FAILs)
4. Critic FAIL on any hard gate → re-dispatch prompt-author-agent with feedback (max 2 cycles)
5. Critic FAIL on Gate 4 only → ship done_with_concerns
6. Critic PASS → write bundle to docs/forsvn/artifacts/marketing/produced-videos/[slug]/
7. Return bundle path + shot count + lane choices ("App-preview narrows to the code-render lane —
   hyperframes/scaffold.html via `hyperframes preview` OR remotion/scaffold.tsx via `npx remotion preview` —
   then post.md to assemble + caption. Explainer / generative / avatar do NOT apply — visuals are real screenshots.")
```

## Critic Gates

**Shortform mode — 4 gates:**

- **Gate 1 — Schema-and-CTA:** manifest validates against `video-brief-schema.md`; per-shot durations sum to total length; CTA copy present verbatim in BOTH the final shot's `on_screen_text` AND the manifest's `cta` field; `post.md` stage present (assembly order matches the Shot List) + a recommended-lane line in Runtime Choices.
- **Gate 2 — Brand-mark fidelity:** every per-shot prompt cites brand tokens from `brand/DESIGN.md` only; no fabricated hex/token names; placeholder rule active for missing assets; sacred elements from `brand/BRAND.md` respected.
- **Gate 3 — Caption-pace:** for every shot, `words(on_screen_text) ÷ duration_seconds ≤ 3.0`. Flagged shots → fix instruction (shorten copy OR extend duration).
- **Gate 4 — Narrative arc:** shot 1 reads as a hook; middle shots build (problem → mechanism / proof / contrast); final shot closes with CTA. **Soft check** — FAILs are warnings, not blocks.

**App-preview mode — 7 gates** (1-4 above mode-aware, plus 3 new hard FAILs):

- **Gate 5 — Screenshot grounding (hard FAIL):** every `source_screenshot` path exists on disk; every Visual Prompt is a composition operation (not a synthesis prompt); crop rectangles match the handoff; no invented UI.
- **Gate 6 — Interaction-vocabulary + mask-transform compliance (hard FAIL):** every `interaction_verb` is in the canonical 10; every `mask_transform` is in the canonical 6; verb-duration coherence.
- **Gate 7 — Pointer-and-caption-band fidelity (hard FAIL):** pointer color cited (hex + token OR `(cold-start-sampled)`); pointer position crop-relative and inside the crop rect; caption-band geometry matches the handoff; no synthetic effects (gradient / glow / neon).

Critic FAIL on any hard gate → re-dispatch prompt-author with specific feedback (max 2 cycles). Critic FAIL on Gate 4 only → ship `done_with_concerns` with arc concerns pinned. Critic PASS twice with operator override → log override via `scripts/log-critic-override.ts`.

## Pattern Catalogs (consumed by named agents)

| Reference | Consumed by | Purpose |
|---|---|---|
| `references/video-brief-schema.md` | prompt-author, critic | Input contract — shortform field map + App-Preview Mode Extension. |
| `references/format-conventions.md` | prompt-author | Manifest + per-shot prompt + scaffold schemas for both modes. |
| `references/_shared/production-pattern.md` | orchestrator | Tool-agnostic export-mode floor, brand-mark fidelity, lean 2-agent dispatch, pipeline lifecycle. |
| `references/_shared/platform-intelligence/` | prompt-author (shortform) | Per-platform format compliance (TikTok / Reels / Shorts). |
| `references/anti-patterns.md` | critic | 6 orchestrator + 3 app-preview + 4 cross-cutting marketing-stack. |

Full mechanics: shared production pattern + scaffold conventions in [`_shared/production-pattern.md`](_shared/production-pattern.md).
