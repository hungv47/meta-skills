<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Legibility Convention

**Status:** canonical cross-stack contract. **Consumed by:** every pack-aware skill
(`write-social`, `write-launch`, `publish-social`, `brief-shortform`, `plan-campaign`, `measure-results`, the launch chains).
**Pairs with:** the playbook-pack contract ([`platform-intelligence/CONTRACT.md`](platform-intelligence/CONTRACT.md)).

## Why this exists

AI commoditized *production*; the scarce, trust-bearing layer is **applied judgment** — the right
play for *this* channel. When a skill silently applies channel expertise, the output reads as
generic and the expertise is invisible, so it earns no trust (origin brainstorm R5/R6). The fix is
**legibility**: every pack-consuming skill must make its applied expertise *visible* — which pack
it loaded, when that pack was last verified, and the **specific** tactics it applied — and must
**degrade transparently** when no pack covers the channel.

This is also the surface where the open-core wedge becomes felt: a Pro client narrates a *current*
pack (`pack_verified` = recent, from the freshness pipeline); a free client narrates an *aging
snapshot*. The user sees the difference in the narration, not in a paywall. Which source is used is
decided by the soft client (`references/hosted-pack-client.md` → `skills/bin/forsvn-hosted.ts`): it
fetches the current pack/context **only** when a hosted key is present and fresher, and otherwise
degrades silently to the local mirror — a key check never gates the run.

## The narration block (required output)

A pack-consuming skill emits a **Legibility** block in its Markdown output and mirrors the same
facts into artifact frontmatter. The block has exactly three shapes, by pack state:

### 1. Packed (a current pack covers this channel)

```
**Legibility — applied expertise**
- Pack: `producthunt` · verified 2026-06-16 · status reviewed
- Tactics applied: first-comment maker note (pinned) · 12:01 PT post window · pre-lined upvoter list · tagline ≤60 chars
- Why these: PH ranks the daily leaderboard on first-4-hour upvote velocity, decided before noon PT (pack §3).
```

Rules:
- **Concrete, never a label.** "Product Hunt first-comment + 12:01 PT timing" — NOT "tailored for
  Product Hunt" (R6). Name the actual tactics from the pack's Playbook (§5), not the channel.
- Quote the pack's one-line `summary` (frontmatter) when a headline is wanted — it is written to be
  quoted verbatim.
- Cite the pack section that justifies a tactic (`pack §3`) so the claim is checkable.

### 2. Stale (a pack covers it, but `last_verified` > 90 days or `status: stale`)

Same block, plus a flag — never present aged tactics as current:

```
**Legibility — applied expertise (⚠ stale pack)**
- Pack: `reddit` · verified 2026-01-02 · 165d old — tactics may have drifted
- Tactics applied: … (treat as a prior, re-verify before publishing)
```

The consuming critic downgrades to `DONE_WITH_CONCERNS` on a stale pack (matches the 90-day clock
in `CONTRACT.md`). A Pro client should have been served a fresher copy — if it's stale on Pro, say so.

### 3. Absent (no pack covers this channel)

Transparent degrade — **no tailored claim** (R7). Do not pretend channel expertise you don't have:

```
**Legibility — applied expertise**
- No depth pack for this channel yet — using general copy/marketing principles only.
- Not channel-tailored: format limits and ranking signals were NOT specialized.
```

## Artifact frontmatter fields

Pack-consuming skills carry these alongside the existing `platform_intel_version`:

| Field | Type | Meaning |
|---|---|---|
| `platform_intel_version` | string | the pack's `schema_version` / identity (existing field) |
| `pack_verified` | `YYYY-MM-DD` \| `none` | the loaded pack's `last_verified`; `none` when no pack covered the channel |
| `applied_tactics` | list | the specific tactics narrated (e.g. `[first-comment, 12:01-PT-window, tagline-<=60]`) — empty when absent |

`pack_verified: none` + empty `applied_tactics` is the machine-readable form of the "absent /
transparent degrade" state, so a reviewer (and the metrics loop) can tell tailored output from
general output without re-reading the body.

## Hard rules

1. **Markdown + frontmatter only** — no new desktop-app UI panel (legibility rides existing
   surfaces, KTD6/KTD3). The app may later surface these fields, but skills don't depend on it.
2. **Never fabricate a pack.** If you didn't load a pack, you are in state 3. A "tailored for X"
   claim without a `pack_verified` date is a lie and a gate failure of this convention.
3. **Tactics, not vibes.** Each narrated tactic must trace to a Playbook step or a ranking signal
   in the pack. "Optimized the hook" is not a tactic; "applied the reply-bait hook archetype (pack
   §1) to hit X's +75 reply-engaged-by-author signal" is.
4. **Staleness is disclosed, not hidden** — see state 2.
