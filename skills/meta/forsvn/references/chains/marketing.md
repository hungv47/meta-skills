---
domain: marketing
absorbed-from: skills/marketing/orchestrate-marketing/ (deleted in 2.0.0 per D6)
consumed-by: /forsvn
---

# Marketing Chain

How `/forsvn` routes marketing intent. New verb-first names throughout.

## Pipeline

```
create-brand → plan-campaign → write-copy / brief-landing-page / optimize-seo /
                                write-outreach / brief-shortform / write-ad /
                                write-social / brief-graphic
                              ↓
                              humanmaxxing / polish-vn (terminal polish)
                              evaluate-landing-page (post-launch, in eval loop)
```

`create-brand` is the foundation (D5 proving workflow). Every content skill reads `brand/BRAND.md` + `brand/DESIGN.md`.

## Intent → skill

| User says | Route |
|---|---|
| "set up brand", "brand identity", "voice", "design tokens", "BRAND.md" | `/create-brand` |
| "campaign", "marketing plan", "channel strategy", "content calendar", "GTM" | `/plan-campaign` |
| "write copy", "headline", "tagline", "CTA", "hook", "section copy" | `/write-copy` |
| "landing page", "redesign LP", "LP brief", "hero section", "section spec" | `/brief-landing-page` |
| "LP analytics", "LP results", "post-launch CRO", "GA4 says", "heatmap" | `/evaluate-landing-page` (hard-gated on `/run-eval-loop`) |
| "SEO", "keywords", "AI search", "programmatic SEO", "ASO", "search rank" | `/optimize-seo` |
| "TikTok video brief", "Reels brief", "Shorts brief", "video storyboard" | `/brief-shortform` |
| "Meta ads", "retargeting ads", "primary text", "paid social", "ad creative" | `/write-ad` (hard-gated on ICP) |
| "cold email", "LinkedIn DM", "outbound", "proposal" | `/write-outreach` (hard-gated on ICP) |
| "tweet", "linkedin post", "tiktok caption", "social post" | `/write-social` (single-platform per invocation) |
| "carousel", "thumbnail", "OG card", "banner", "asset brief" | `/brief-graphic` |
| "humanize this", "humanmax this", "sounds AI-generated", "strip the slop" | `/humanmaxxing` |
| "Vietnamese tone", "polish VN" | `/polish-vn` |
| "scope this", "clarify requirements" | `/discover` |

## Routing rules (first match wins)

1. **ICP-foundation gate (cross-chain):** any content/campaign intent AND no `research/product-context.md` → defer to research chain (`/research-icp`).
2. **Brand-foundation gate (D5):** any content/campaign/LP/ad/outreach/social/design intent AND no `brand/BRAND.md` → `/create-brand` first.
3. **Brand done + campaign intent** → `/plan-campaign`.
4. **Brand done + copy intent** → `/write-copy`. If `/plan-campaign` missing, note: "sharper with campaign positioning context."
5. **Brand done + LP intent** → `/brief-landing-page`.
6. **LP-eval intent** → if matching `.forsvn/loops/[slug]/` exists, propose `/evaluate-landing-page`; otherwise propose `/run-eval-loop` first.
7. **SEO intent** → `/optimize-seo`. Ask which mode (audit / ai / programmatic / competitor / aso).
8. **Short-form-video intent** → `/brief-shortform`. Requires matching `.forsvn/artifacts/research/research-shortform/*.md`; if missing, flag cross-chain handoff.
9. **Paid-ads intent** → `/write-ad`. Hard requires `research/icp-research.md`. Ask audience-temperature (retargeting / cold) — single-temp per invocation.
10. **Outbound intent** → `/write-outreach`. Hard requires `research/icp-research.md`.
11. **Social-post intent** → `/write-social`. Single-platform per invocation; ask which platform.
12. **Asset-design intent** → `/brief-graphic`. Per-asset (carousel/thumbnail/banner/OG card).
13. **Text-polish intent** → `/humanmaxxing`. Trivial, no gate.
14. **VN-polish intent** → `/polish-vn`. Post-translation only.
15. **No clear intent + everything done** → marketing stack exhausted. Suggest crossing to product or research chain.
16. **Stale brand:** include warning, offer refresh, route forward if operator chooses.
17. **Skip-rules:** "I just want X" without upstream → respect it, route, include the quality-drop caveat.
18. **Wrap-around:** `/brief-landing-page` feeding a launch, `/write-ad` feeding a paid campaign → append `(optional /review-work after)`.
19. **Polish chain mention:** if producing copy AND `brand_mode=founder` or market includes Vietnamese → mention `/humanmaxxing` or `/polish-vn` as terminal step.
20. **Ambiguity:** intent matches 2+ buckets → propose 2 options with rationale, let operator pick.

## Anti-patterns

- Routing past missing ICP / brand.
- Recommending hard-gated skills (`/write-ad`, `/write-outreach`, `/evaluate-landing-page`) without upstream.
- Conflating `/brief-landing-page` (pre-launch) vs `/evaluate-landing-page` (post-launch eval).
- Conflating `/write-copy` (generation) vs `/humanmaxxing` (polish).
- Recommending `/write-social` as multi-platform.
- Recommending `/write-ad` without asking audience-temperature.
