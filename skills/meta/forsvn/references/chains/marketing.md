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
| "LP analytics", "LP results", "post-launch CRO", "GA4 says", "heatmap" | `/evaluate-landing-page` (hard-gated on `/run-pipeline`) |
| "SEO", "keywords", "AI search", "programmatic SEO", "ASO", "search rank" | `/optimize-seo` |
| "TikTok video brief", "Reels brief", "Shorts brief", "video storyboard" | `/brief-shortform` |
| "Meta ads", "retargeting ads", "primary text", "paid social", "ad creative" | `/write-ad` (hard-gated on ICP) |
| "cold email", "LinkedIn DM", "outbound", "proposal" | `/write-outreach` (hard-gated on ICP) |
| "launch on Product Hunt", "PH launch", "Product Hunt", "launch day" | `/run-launch producthunt` — the per-channel launch **orchestrator** (sequences the chain; see § Launch chains) |
| "tweet", "linkedin post", "tiktok caption", "social post" | `/write-social` (single-platform per invocation) |
| "PH launch copy", "first comment", "reddit launch post", "show HN post", "launch tagline" | `/write-launch` (the launch channel's native copy bundle, single-channel per invocation) |
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
6. **LP-eval intent** → if matching `.forsvn/loops/[slug]/` exists, propose `/evaluate-landing-page`; otherwise propose `/run-pipeline` first.
7. **SEO intent** → `/optimize-seo`. Ask which mode (audit / ai / programmatic / competitor / aso).
8. **Short-form-video intent** → `/brief-shortform`. Requires matching `docs/forsvn/artifacts/research/research-shortform/*.md`; if missing, flag cross-chain handoff.
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
21. **Launch intent (per-channel):** "launch on <channel>" (Product Hunt, Reddit, …) → `/run-launch <channel>` — the runnable **orchestrator** that sequences the generic per-channel launch chain (§ Launch chains) around that channel's pack, narrating each step's applied play and stopping at the human gate (never auto-publishes; D-8). Multi-channel launch → `/plan-campaign` selects channels, then `/run-launch` runs once per channel, each closing its own loop via `/measure-results`. Same ICP/brand gates; each channel's pack §4 hard guards apply at every step. (Want the copy bundle alone, not the whole chain? → `/write-launch`.)

## Launch chains (per-channel)

A **launch chain** sequences existing skills around a single channel's playbook pack
(`skills/references/platform-intelligence/<channel>.md`), loading the pack at **every** step and
**narrating** the applied tactics (legibility convention). Each step emits the Legibility block, so
the applied expertise is visible end-to-end. The loop closes at the last step (`/measure-results`),
which writes the result back into the channel pack so the **next** launch on that channel compounds.

**`/run-launch <channel>` is the runnable form of this chain** (the D-7 launch runner, not a
per-channel clone): it resolves the pack, dispatches the leaf skills below in order, narrates each
step's applied play + the launch's bet, assembles one bundle, and stops at the human review gate —
never auto-publishing (D-8). Where a leaf does not yet bind the launch pack (`/plan-campaign`,
`/publish-social` — S3.2/S3.3), `/run-launch` reads the pack's §5/§6/§4/§7 directly and says so
(transparent degrade), rather than rewiring those leaves. The doc table below is the spine it runs.

The launch-copy step (4) routes to **`/write-launch`** when the channel has a `launch-channel` pack
(Product Hunt, Reddit, Show HN, …) — it emits that channel's complete native copy bundle (identifier
+ descriptor + anchor narrative + notify + cross-post + metadata) and enforces the pack's §4 hard
guards (PH no vote-ask; Reddit founder-disclosure + sub-fit). For a social **feed** channel the step
stays `/write-social` (a single post). Neither clones per channel: `write-launch` is one pack-driven
emitter for all launch channels.

### Generic per-channel launch chain (U11)

Works for **any channel that has a `launch-channel` (or applicable) pack**. The 7-step skeleton is
channel-agnostic; each step binds to the channel's own pack sections:

| Step | Skill | Binds to (pack) | Narrates |
|---|---|---|---|
| 1. Audience | `/research-icp` (if `research/product-context.md` absent) | — | who the launch reaches |
| 2. Plan | `/plan-campaign` (launch path) | §5 Playbook + §6 timing | the channel's run-of-show + best window |
| 3. Asset brief | `/brief-graphic` (or `/brief-shortform` for video channels) | §1 angles + §2 format constraints | the asset spec it applied |
| 4. Launch copy | `/write-launch` (launch-channel pack) · `/write-social` (social feed channel) | §1 angles + §2 caps + §4 hard guards + §5 anchor narrative | the channel-native bundle + the specific tactics applied |
| 5. Comms plan | `/plan-campaign` launch-day run-of-show artifact | §5 timings | the dated sequence + owners |
| 6. Publish | `/publish-social` | §7 CTA/conversion norms + §4 hard guards | cross-post copy + the channel's guards |
| 7. Measure | `/measure-results` | writes a dated entry back into §9/§5 | the result → feeds the next launch (loop closed) |

**Channel selection:** the chain resolves the pack via the soft client (current pack if Pro, else
the local mirror) and narrates `pack_verified`. **No pack for the channel?** the chain still runs on
general principles and says so (transparent degrade) — it does not fake channel tailoring.

**Multi-channel fan-out:** for a launch spanning N channels, `/plan-campaign` selects the channels
(its 9-channel evaluation) and the marketing agent runs the per-channel chain **once per channel** —
each grounded in its own pack, each closing its own loop. The plans share the campaign's pillars +
positioning but diverge on channel tactics. Each channel's `/measure-results` feeds only its own pack.

### Product Hunt launch chain (worked instance)

Pack: [`producthunt.md`](../../../../../references/platform-intelligence/producthunt.md) (`launch-channel`). Each step loads it and narrates which §5 Playbook step / §3 ranking signal it is acting on.

| Step | Skill | Loads from the PH pack | Narrates |
|---|---|---|---|
| 1. Audience | `/research-icp` (if `research/product-context.md` absent) | — | who the launch-day support list is |
| 2. Plan | `/plan-campaign` (Product Hunt path) | §5 Playbook (the 10-step run-of-show) + §6 timing | "12:01 AM PT live, Top-5 decided by ~noon PT" |
| 3. Gallery brief | `/brief-graphic` | §1 Angle 3 (demo-loop slot 1) + §2 (1270×760, thumbnail 240×240) | the gallery/thumbnail spec it applied |
| 4. Launch copy | `/write-launch` | §1 angles + §2 caps + §4 hard guards (no vote-ask) + §5 first comment | the full native bundle: tagline ≤60 + founder-story first comment + notify + cross-post |
| 5. Comms plan | `/plan-campaign` output (launch-day run-of-show artifact) | §5 timings (T−14d → T+24h) | the dated launch-day sequence + owners |
| 6. Publish | `/publish-social` | §7 CTA norms (news-framed, never "upvote") | cross-post copy + the no-vote-ask guard |
| 7. Measure | `/measure-results` (U10) | writes a dated entry back into §9 changelog / what-worked | the result → feeds the next launch (loop) |

**Hard guard (from the pack §4):** no step may emit copy containing a vote-ask ("upvote", "vote for
us"). The launch is engineered to *earn* velocity (notify → show → ask for feedback), never to solicit votes.

## Anti-patterns

- Routing past missing ICP / brand.
- Recommending hard-gated skills (`/write-ad`, `/write-outreach`, `/evaluate-landing-page`) without upstream.
- Conflating `/brief-landing-page` (pre-launch) vs `/evaluate-landing-page` (post-launch eval).
- Conflating `/write-copy` (generation) vs `/humanmaxxing` (polish).
- Recommending `/write-social` as multi-platform.
- Recommending `/write-ad` without asking audience-temperature.
