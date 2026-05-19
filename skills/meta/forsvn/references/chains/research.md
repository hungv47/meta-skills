---
domain: research
absorbed-from: skills/research/orchestrate-research/ (deleted in 2.0.0 per D6)
consumed-by: /forsvn
---

# Research Chain

How `/forsvn` routes research intent. New verb-first names throughout.

## Pipeline

```
research-icp → research-market → diagnose → prioritize → plan-funnel
                              ↘
                                research-shortform (standalone, per-platform)
```

`research-icp` is the foundation — 13+ downstream skills consume `research/product-context.md` + `research/icp-research.md`. Skipping produces hollow output everywhere.

## Intent → skill

| User says | Route |
|---|---|
| "audience", "ICP", "personas", "who buys this", "voice of customer" | `/research-icp` |
| "market sizing", "TAM/SAM/SOM", "competitors", "whitespace" | `/research-market` |
| "why is X dropping", "root cause", "metric decline" | `/diagnose` |
| "prioritize features", "ICE score", "options ranking" | `/prioritize` |
| "revenue targets", "funnel math", "traffic needed" | `/plan-funnel` |
| "research short-form for X", "TikTok trends", "what's working on Reels" | `/research-shortform` |
| "scope this", "clarify requirements" | `/discover` |

## Routing rules (first match wins)

1. **Audience-foundation gate:** any audience/strategy intent AND no `research/product-context.md` → `/research-icp` first.
2. **ICP done + market intent** → `/research-market`.
3. **ICP done + diagnose intent** → `/diagnose` (require a specific metric/problem; push back on "things feel off").
4. **ICP + (market OR diagnose) done + prioritize intent** → `/prioritize` (hard-gated on both).
5. **Prioritize done + targets intent** → `/plan-funnel` (hard-gated on prioritize).
6. **ICP done + ambiguous intent** → propose 2 options (typically `/research-market` and `/diagnose`); let operator pick.
7. **Short-form-research intent** → `/research-shortform` as standalone. Never bundle into the audience/market/strategy pipeline.
8. **Everything done, no clear intent** → research stack exhausted. Suggest crossing to marketing or product chain.
9. **Stale ICP** (>90 days): include warning, offer refresh, route forward if operator chooses.
10. **Skip-rules:** "I just want X" without upstream → respect it, route to X, include the quality-drop caveat.
11. **Wrap-around:** prioritize feeding a launch → append `(optional /review-work after)`.
12. **Don't cross-route** outside `/discover` — marketing/product domains route via their own chain files.

## Anti-patterns

- Routing past missing ICP/product-context.
- Recommending hard-gated skills (`/prioritize`, `/plan-funnel`) without upstream.
- Defaulting to `/research-icp` on every empty ask — check existing state first.
- Bundling `/research-shortform` into the audience/market pipeline.
