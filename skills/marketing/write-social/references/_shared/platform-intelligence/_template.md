<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
type: platform-intelligence
platform: <linkedin | tiktok | reels | shorts | x | youtube | producthunt | reddit | facebook | motion-background | founder-demo | ugc>
schema_version: 2
pack_type: <shortform-video | launch-channel | asset-format>
last_verified: <YYYY-MM-DD>
verifier: <hungv47 | agent-name | internal>
status: <draft | reviewed | stale>
source_basis: "Per-claim categorical citations inline (platform docs, third-party studies, [pattern-derived]). URL-level master ledger not maintained — promote to URL citations as claims are re-verified."
summary: "<one line a consuming skill can quote verbatim — what this pack grounds and the single sharpest tactic. e.g. 'Product Hunt launch-day playbook: first-comment + 12:01 PT post + hunter relationships drive the leaderboard.'>"
---

# Platform Intelligence — <Platform>

> **Pack contract v2.** This template is the authoring source for a *playbook pack* — a
> first-class, dated, gate-validated artifact that pack-consuming skills load at runtime and
> **narrate** (legibility convention). Skills never hard-code the tactics below; they cite the
> pack + its `last_verified` date. Validate with `bun skills/bin/validate-packs.ts --strict`.
> Full schema + per-`pack_type` section map: [`CONTRACT.md`](./CONTRACT.md).

Practitioner-grade reference consumed by pack-aware skills (`brief-shortform`, `write-social`, `publish-social`, `plan-campaign`, the launch chains) to ground hooks/angles, format compliance, algorithm/ranking fit, the tactical playbook, and anti-pattern checks. **Not generic marketing advice.** Every claim is distilled into internal operating guidance.

When this doc's `last_verified` exceeds 90 days, `validate-packs.ts` warns and the consuming critic flags `DONE_WITH_CONCERNS` with "platform signal may be stale — verify before publishing." A Pro client fetches the *current* pack from the freshness pipeline; a free client keeps this build-time snapshot, which ages.

**Section map by `pack_type`** (the validator enforces the required set per type — see `CONTRACT.md` § "Required sections"):

| Section | shortform-video | launch-channel | asset-format |
|---|:-:|:-:|:-:|
| 0. When NOT to Launch Here (channel-fit veto) | — (inline `Bad fit:`) | ✓ | — (optional) |
| 1. Hook Taxonomy / Angles | ✓ | ✓ | ✓ |
| 2. Format Constraints | ✓ | ✓ | ✓ |
| 3. Algorithm / Ranking Signals | ✓ | ✓ | — (optional) |
| 4. Anti-Patterns | ✓ | ✓ | ✓ |
| 5. Playbook / Tactical Sequence | ✓ | ✓ | ✓ |
| 6. Timing & Cadence (launch) / Retention Curve (video) | ✓ | ✓ | — (optional) |
| 7. CTA / Conversion Norms | ✓ | ✓ | ✓ |
| 8. Open Questions / Known Unknowns | ✓ | ✓ | ✓ |
| 9. Changelog | ✓ | ✓ | ✓ |

---

## 0. When NOT to Launch Here  *(launch-channel — required; the channel-fit veto)*

A scannable list of falsifiable bad-fit conditions — the situations where this channel is the *wrong*
launch surface. `plan-campaign` reads this as a real **veto** ("the marketer who says no"): when the
campaign's product / ICP / goal / growth-motion matches a condition, the channel is skipped with the
cited reason unless the operator records an explicit override. Lead with the channel-fit-veto callout,
then 4–5 conditions, each `**[Condition]** — [why it's a bad fit / what to do instead]`. (Omit for
`shortform-video` packs — they carry the equivalent as inline **Bad fit:** lines inside §1 angles.)

---

## 1. Hook Taxonomy

Minimum **3** archetypes specific to this platform/channel. Each archetype must include:

- **Definition** — one sentence
- **Identifying signal** — concrete patterns a human or LLM can detect
- **Pattern examples** — ≥2 real public examples per archetype with creator handle + post URL/date when retrievable; mark `[anonymized]` only when source explicitly required
- **Engagement-signal rationale** — *why* this archetype fits this platform's algorithm + audience
- **Best for** — niche / brand_mode / content type fit

Archetypes catalogued here may overlap with the six base archetypes in `../hook-archetypes.md` (Credential flash, Pattern interrupt, Question hook, Pre-reveal tease, Contrarian claim, Data point), but **must add platform-specific framing or surface platform-native variants** — do not just rename the base set. (For `launch-channel` packs, frame these as *launch angles* — the first-comment angle, the founder-story angle, the asset-led angle — not video hooks.)

### Archetype 1 — <Name>

- **Definition:**...
- **Identifying signal:**...
- **Pattern examples A:** "<exact opening line/visual cue>" — @handle, <date>, <url> — engagement: <metric if known>
- **Pattern examples B:** "<exact opening line/visual cue>" — @handle, <date>, <url> — engagement: <metric if known>
- **Engagement-signal rationale:**...
- **Best for:**...

### Archetype 2 — <Name>

(repeat structure)

### Archetype 3 — <Name>

(repeat structure)

---

## 2. Format Constraints

Hard specs an agent or critic can enforce. Prefer numeric over prose.

| Constraint | Value | reference |
|---|---|---|
| Duration / length sweet spot | <e.g., 21–34s · 60-char tagline> | <source id> |
| Hard cap | <e.g., 10 min · 260-char tagline> | <source id> |
| Aspect ratio / dimensions | <9:16 · 1270×760 gallery> | <source id> |
| Asset count / gallery | <e.g., 1 thumbnail + ≤8 gallery images> | <source id> |
| Caption / copy limit | <number> | <source id> |
| Truncation point | <e.g., 125 chars before "...more"> | <source id> |
| Required fields | <e.g., tagline, description, topics, first comment> | <source id> |
| Hashtag / topic norm | <count + placement convention> | <source id> |
| Cover/thumbnail | <required / recommended / ignored> | <source id> |

Add platform-specific rows when relevant (e.g., LinkedIn's "first-3-line preview", Product Hunt's "tagline ≤60 chars", Reddit's "self-post vs link-post ranking difference").

---

## 3. Algorithm / Ranking Signals (Ranked by Impact)

Ordered list — strongest ranking signal first. For each:

- **Signal name** + concrete metric the algorithm/leaderboard reads
- **Why it matters** — one sentence, uses source
- **Operator lever** — what the brief/playbook can spec to move this signal
- **Source tier** — primary (platform doc / exec statement) or secondary (practitioner cohort study, named N)

Example shape (Product Hunt):

> 1. **Upvote velocity in the first 4 hours** — upvotes/hour against the day's cohort. *Why:* PH ranks the daily leaderboard on momentum, not raw count, and the top-5 cutoff is usually decided before noon PT. *Lever:* pre-line a launch list to convert in the 12:01–04:00 PT window; never buy votes (downranked). *Tier:* secondary (maker cohort consensus; PH does not publish the exact formula).

Cap at the top **5–7** signals; more is noise. (For `asset-format` packs this section is optional — replace with "Distribution surfaces" if the asset has no native ranking.)

---

## 4. Anti-Patterns

What the algorithm penalizes or what audiences punish. Each entry:

- **Pattern** — specific behavior or content trait
- **Penalty observed** — distribution drop, downrank, shadow throttle, audience drop-off, leaderboard removal — with reference if public
- **Detection rule** — how a critic agent can spot this in a brief/asset before publish
- **Source** — primary if platform-stated; secondary if practitioner-observed

Be specific. "Don't be salesy" is not an anti-pattern — it's a fortune cookie. (Product Hunt: vote-buying / incentivized upvotes → leaderboard removal. Reddit: link-post into a discussion sub → auto-removal + ban risk.)

---

## 5. Playbook / Tactical Sequence

**The new spine of the v2 contract.** The ordered, concrete play for this channel — the thing a
launch chain executes step-by-step and a skill narrates back ("running the Product Hunt
first-comment + 12:01 PT playbook"). NOT a vibe; a sequence with timings, owners, and a
falsifiable success marker per step.

| # | Step | When | Concrete action | Success marker |
|---|---|---|---|---|
| 1 | <e.g., Pre-line the list> | <T-7d> | <exact action> | <e.g., ≥30 committed upvoters> |
| 2 | <e.g., Post at 12:01 PT> | <T-0> | <exact action> | <e.g., live before the cohort wakes> |
| 3 | <e.g., First comment> | <T+0:01> | <exact maker-comment structure> | <pinned, ≥3 replies in hour 1> |
| … | | | | |

State the **single highest-leverage tactic** in one bold line at the top — it is what the
`summary` frontmatter field quotes and what `write-social`/`publish-social` narrate.

---

## 6. Timing & Cadence  *(launch-channel)*  /  Hook Window + Retention Curve  *(shortform-video)*

For `shortform-video`:
- **First-second goal:** <what the hook must accomplish by 0:01>
- **Critical drop-off point:** <0:03? 0:07? 0:10?> + reference
- **Retention checkpoint(s):** <e.g., 50% retention at 0:15 = strong signal>
- **Loop / replay behavior:** <does this platform reward loops? swipe-back?>

For `launch-channel`:
- **Best post window:** <e.g., 12:01 AM PT for Product Hunt; weekday morning for Reddit> + reference
- **Decision window:** <when the outcome is effectively locked — e.g., PH top-5 by ~noon PT>
- **Cadence:** <one-shot launch vs sustained presence; re-engagement rhythm>

If the data isn't public, state that explicitly and use the best practitioner estimate available.

---

## 7. CTA / Conversion Norms

Where CTAs land best on this platform — overlay, end-card, caption first line, comment-pinned, bio link, first-comment link, end-of-thread.

| CTA placement | When it works | When it fails | Source |
|---|---|---|---|
| <Overlay 0:18-0:22 / First maker comment> | <context> | <context> | <id> |
| <End card / Pinned reply> | <context> | <context> | <id> |
| <Caption first line> | <context> | <context> | <id> |

---

## 8. Open Questions / Known Unknowns

What this doc *does not* answer well — gaps the verifier flagged. Each entry is a one-liner.

- E.g., "Product Hunt's exact ranking weights: not published; maker-cohort estimates only."
- E.g., "LinkedIn dwell-time threshold for 'qualified view': unstated by platform; practitioner consensus 6s but no cited cohort."

Naming the unknowns is mandatory. A doc with zero open questions is either complete (rare) or hiding gaps.

---

## 9. Changelog

| Date | Change | By |
|---|---|---|
| <YYYY-MM-DD> | Initial draft | <verifier> |

---

## Authoring rules (delete from per-platform doc; keep here in template)

1. **No fortune cookies.** "Be authentic" is banned. Every claim must be falsifiable.
2. **Cite or don't write.** A claim without a source basis doesn't ship. Tier sources honestly.
3. **Verbatim, not paraphrased.** Hook examples are exact opening lines / visual cues, not summaries.
4. **Numeric > prose.** "21–34s sweet spot" beats "moderate length."
5. **Platform-native framing.** A "Question hook" on LinkedIn behaves differently than on TikTok — surface that, don't recycle.
6. **The Playbook is the product.** §5 is what makes a pack a *playbook* pack and what skills narrate. A pack whose §5 is vague is not shippable.
7. **Date everything.** `last_verified` + per-source `accessed` dates. Algorithm signals decay; the date is how downstream skills know to reverify, and the freshness pipeline serves the latest to Pro clients.
8. **Open questions are required.** Section 8 is non-negotiable. If you have nothing to put there, you didn't research hard enough.
9. **`summary` is a contract.** Keep it one line, quotable, and current — the legibility convention surfaces it verbatim to the end user.
