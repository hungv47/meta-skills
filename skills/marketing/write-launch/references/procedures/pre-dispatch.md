# Procedure — Pre-Dispatch (launch-copy)

> Load when SKILL.md routes to Pre-Dispatch. Encodes the read order, the Warm Start path, the Cold Start prompt, the Write-back map, and the Cold-Start-under-`--fast` floor. Canonical Pre-Dispatch spec: [`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md) — this file is the launch-copy overlay.

---

## launch-copy Pre-Dispatch shape

write-launch is single-channel, single launch per invocation. Pre-Dispatch resolves 5 dimensions before dispatching the launch-copywriter-agent:

1. **Channel** — which launch channel (`producthunt / reddit / show-hn / …`). Routing-only — drives which `platform-intelligence/[channel].md` pack the agents read. Not persisted to experience/.
2. **Topic or brief** — a path (`./docs/forsvn/artifacts/marketing/campaign-plan.md` or a brief) OR an inline 1–2 sentence launch description. Persisted to `experience/content.md`.
3. **Brand mode** — `founder` (single-author personal voice — the highest-leverage PH/Reddit anchor) OR `company`. Persisted to `experience/brand.md` if novel.
4. **Audience** — who the launch reaches (role + one pain + the differentiator). Read from `research/icp-research.md` if present; otherwise asked + persisted to `experience/audience.md` if novel.
5. **Goal** — `feedback / signups / awareness / velocity`. Default `feedback` (the launch ask is a genuine/feedback ask, never a vote-ask). Persisted to `experience/goals.md`.

---

## Read order (in order)

1. **Pack first** — `references/_shared/platform-intelligence/[channel].md` for the requested channel. Resolve via the soft client (current pack if Pro, else the local mirror); record `pack_verified` + `status`. **No pack** → Critical Gate 2 transparent degrade (confirm with the operator before running un-tailored).
2. **Auto-scan for context:**
   - `research/product-context.md` — product, buyer, voice, primary CTA, the differentiator.
   - `research/icp-research.md` — personas + pain + voice. Resolves the **audience** dimension.
   - `brand/BRAND.md` + `brand/DESIGN.md` — brand_mode signal, archetype, lexicon, banned words.
3. **Pipeline (optional):** `docs/forsvn/artifacts/marketing/campaign-plan.md` — if the launch is part of a campaign, pull the channel pick, run-of-show, and timing. A campaign-plan covering this channel is a Warm Start.
4. **Experience (read, don't ask):** `content.md` / `audience.md` / `brand.md` / `goals.md`.

After scan + read, present findings and ask only about the gaps.

---

## Warm Start (campaign-plan or rich auto-scan)

```
campaign-plan found at [path]; producthunt pack verified 2026-06-16 (reviewed).
- channel → producthunt
- audience → indie founders, "launches sink without a list" (icp-research.md)
- run-of-show → 12:01 AM PT live, T−14d list build (pack §5/§6)
- goal → feedback (default)

Need before dispatching: brand_mode (founder / company) and variant_count
(default 2 — A/B on the tagline + first-comment opening; max 3)?
```

When a campaign-plan + icp-research + brand all resolve, skip the Cold Start — confirm + ask only the gaps.

---

## Cold Start (no brief, no scan signal — default for greenfield)

```
write-launch generates a launch channel's complete native copy bundle (identifier
+ descriptor + anchor narrative + amplification + metadata), with the channel's
hard guards enforced and critic scoring against the 5-dimension rubric. To start:

1. **Channel** — producthunt / reddit / show-hn? (which launch channel)
2. **Topic or brief** — paste a campaign-plan path OR describe the launch in 1–2 sentences.
3. **Brand mode** — founder (personal voice) or company (brand voice)?
4. **Audience** — who is this launch for? (role + one pain, OR "use research/icp-research.md")
5. **Goal** — feedback / signups / awareness / velocity? (default: feedback)

Answer 1-5 in one response. I'll dispatch the 3-agent chain (launch-copywriter →
guard-checker → critic) and return the bundle with critic verdict.
```

If the answer lacks signal to define the topic or audience, return `NEEDS_CONTEXT` — recommend running `plan-campaign` first (for the run-of-show + channel pick) or answering with a more specific launch + audience.

---

## Vietnamese-market auto-routing to vn-tone

When the market signal is Vietnamese (operator says "VN"/"Vietnam"; brief supplies Vietnamese source text; `research/icp-research.md` declares Vietnam geo), Pre-Dispatch sets `--polish-chain vn-tone` as the default IF the operator did not pass `--polish-chain` explicitly. Honor an explicit `--polish-chain none` / `humanmaxxing`. Echo any override in the Warm/Cold Start confirmation before dispatch.

---

## Cold Start STILL fires under `--fast`

Cold Start is a safety floor. Under `--fast`: orchestration collapses (guard-check revision loop = 0; the guard-check itself STILL runs), but the 5-question Cold Start STILL fires when context is missing. `--fast` does not authorize hallucinating audience or brand_mode, and never skips the §4 hard guards. If channel + topic + audience can be inferred from auto-scan alone, the Warm Start path applies.

---

## Write-back map

| Q | File | Key |
|---|---|---|
| 1. Channel | (routing only, not persisted) |
| 2. Topic or brief | `content.md` | `Content — recent launch topic` (append) |
| 3. Brand mode | `brand.md` if novel | `Brand — mode (founder/company)` |
| 4. Audience | `audience.md` if novel | `Audience — primary persona` (don't overwrite if icp-research populated) |
| 5. Goal | `goals.md` | `Goals — recent launch goal` |

**Q1 (Channel) is NOT persisted** — routing-only; "last channel" is not a meaningful persistence target.

---

## Required + Optional artifacts table

| Artifact | Source | If Missing |
|----------|--------|------------|
| `references/_shared/platform-intelligence/[channel].md` | the pack | Transparent degrade (Critical Gate 2) — confirm before running un-tailored |
| `brand/BRAND.md` OR `brand_mode=founder` fallback | create-brand | Ask Q3 in Cold Start; if unanswerable, `NEEDS_CONTEXT` |

| Artifact | Source | Benefit |
|----------|--------|---------|
| `campaign-plan.md` | plan-campaign | Locks channel + run-of-show + timing; reduces Cold Start to brand_mode + variant_count |
| `research/icp-research.md` | research-icp | Resolves audience; gives the critic + why-this-works richer signal |
| `research/product-context.md` | research-icp | Gives the copywriter the primary CTA + the differentiator |

---

## Anti-patterns in Pre-Dispatch

- **Skipping the pack read.** The pack is the depth this skill narrates — read it (or declare the degrade) FIRST.
- **Asking channel when the invocation already specified it.** `argument-hint` declares `<channel>`; don't re-ask Q1.
- **Hallucinating brand_mode.** Ask Q3 explicitly if neither BRAND.md nor input declares it.
- **Running a tailored claim with no pack.** No pack = transparent degrade, not invented tactics.
- **Running Cold Start under `--fast` without honoring it.** Cold Start fires when context is missing regardless of `--fast`.

## Performance Grounding (pre-generation)

Before dispatching the copywriter, ground on the operator's own history for the channel:

```bash
bun scripts/query-performance.ts <channel> --json
```

Obey the emitted `empty | sparse | sufficient` state + `guidance` — empty store is the normal first-launch state ("no own data yet — using priors"). Full read contract: [`../_shared/performance-grounding.md`](../_shared/performance-grounding.md). Own data informs direction; it never becomes a prescriptive element list, and a brand floor always outranks it.
