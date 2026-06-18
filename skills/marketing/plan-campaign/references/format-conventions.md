# Format Conventions — Campaign-Plan

> Artifact template details, frontmatter rules, slug conventions, re-run versioning, table schemas.

[PROCEDURE] — loaded by orchestrator at artifact-assembly time.

## Output path

Single artifact per run:

```
docs/forsvn/artifacts/marketing/campaign-plan.md
```

Pipeline lifecycle — overwrite on re-run unless version preservation is requested (see Re-run convention below).

## Frontmatter — required fields

Every artifact starts with:

```yaml
---
skill: plan-campaign
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
stack: marketing
review_surface: md         # html | md | none
decision_state: not_required    # pending | approved | denied | suggested | not_required
review_tool: inline           # proof | inline | roughdraft | none
reviewed_at:                  # YYYY-MM-DD — empty until reviewed
reviewer:                     # who recorded the review — empty until reviewed
pack_verified:                # YYYY-MM-DD | none — freshness of the loaded channel packs; `none` when no selected channel had a pack (legibility)
applied_tactics: []           # union of the specific tactics narrated across the Channel Execution Briefs; empty when no pack loaded (legibility)
---
```

| Field | Rule |
|---|---|
| `skill` | Always `plan-campaign` |
| `version` | Integer; increment when re-running with preserved history (see Re-run convention) |
| `date` | ISO `YYYY-MM-DD`; the date the orchestrator started the run, not the date the campaign launches |
| `status` | One of the four values; **never** omit, never invent new values |
| `decision_state` | Human acceptance state. Defaults to `not_required` — this is a `pipeline` artifact and most runs are regenerable drafts. The operator or a loop opts a run into review by setting `pending`. Independent of `status` (skill quality gate). Field semantics: `references/_shared/reviewable-artifact-contract.md`. |
| `review_tool` | `inline` (default) / `proof` / `roughdraft` / `none`. Where the review happens. |
| `reviewed_at` | ISO `YYYY-MM-DD`; empty until a human review is recorded. |
| `reviewer` | Who recorded the review; empty until reviewed. |
| `pack_verified` | Legibility (`references/_shared/legibility-convention.md`): freshness of the loaded channel packs; `none` when no selected channel had a pack. Per-channel truth lives in each Channel Execution Brief's Legibility block. |
| `applied_tactics` | Legibility: union of the specific tactics narrated across the Channel Execution Briefs; `[]` when no pack loaded. Tactics, not vibes — each traces to a pack section. |

Optional fields permitted (orchestrator may add when relevant): `campaign_name`, `goal`, `audience`, `growth_motion`, `team_size`, `budget_tier`, `duration_days`.

The four review fields are additive and orthogonal to the campaign-plan body schema — downstream consumers (lp-brief, cold-outreach, ad-copy, seo, short-form-brief, funnel-planner) jump to body sections by heading match and do not parse review fields, so this addition does **not** require updating downstream consumer skills. Review procedure: `references/_shared/roughdraft-review-protocol.md`.

## Body section order — fixed

The Artifact Template prescribes a fixed section order. Do **not** reorder; downstream skills (lp-brief, cold-outreach, ad-copy, seo, short-form-brief, funnel-planner) jump to sections by heading match.

1. `# IMC Plan: [Campaign / Product Name]` — H1
2. Metadata block (`**Date:**` / `**Skill:**` / `**Goal:**` / `**Audience:**`)
3. `## Growth Motion` — Motion / Primary acquisition lever / Channel weighting rationale
4. `## Foundation` — Core message (one sentence) / Awareness distribution (% per stage)
5. `## Creative Direction` — per-campaign art direction, inherited from the house `CREATIVE-DIRECTION.md` and tuned to this campaign (see "Creative Direction section" below). Present whenever a house CD exists; omitted with an inline note when it does not.
6. `## Pillars` — table with columns: `#`, `Pillar`, `Type`, `%`, `Stage`, `Evidence`
7. `## Angle Bank` — table with columns: `#`, `Angle`, `Hook`, `Stage`, `Trigger`, `Score`, `Class`, `Pillar`
8. `## Channel Assignments` — table with columns: `Channel`, `Type`, `Angle`, `Role`, `Cadence`
   - Followed by the 9-Channel Evaluation note (lists all 9 channels by name)
9. `## Channel Execution Briefs` — table with columns: `Channel`, `Objective`, `Tactic`, `Budget Type`, `Success Metric`, `Owner`, `First Milestone`
   - Followed by execution notes for offline channels when selected (IRL, SMS, OOH)
10. `## Timeline` — table with columns: `Week`, `Phase`, `Channel`, `Angle`, `Format`, `Status`
11. `## Launch Sequence` — table with columns: `Phase`, `Timing`, `Channels`, `Action`
12. `## Why This Works` — the why-this-works block (after the plan, before the Review Gate; see "Why This Works section" below)
13. `## Review Gate` — final section; the human-review decision block (see "Review Gate block" below)

## Creative Direction section

The per-campaign tier of creative direction (tier 2). It **inherits** the evergreen house `docs/forsvn/canonical/marketing/CREATIVE-DIRECTION.md` (tier 1, owned by `create-brand`) and tunes it to this campaign's angle, audience, season, platform mix, and offer. It does **not** re-derive the brand world or restate every house rule — it names the deltas and the campaign-specific calls.

Subsections (in order):

1. **Inherited from house direction** — one line naming the house CD it inherits (`source: CREATIVE-DIRECTION.md vN`) and the house movements/light/palette it carries unchanged.
2. **Campaign tuning** — how the house direction bends for *this* campaign: which movement leads (e.g. Trail for a launch push), seasonal/temporal shift, platform emphasis, offer-driven mood. 3-6 bullets.
3. **Hero concept direction** — the art-direction call for the campaign's flagship visual(s): subject, framing, light, the one image it's built around.
4. **Per-channel art-direction cues** — a short table (`Channel` · `Art-direction cue`) for the selected channels, so each `brief-*` inherits a coherent, tuned cue rather than re-improvising.

**Inheritance rule (hard):** every campaign-specific art call must be a *tuning of* a house-CD element, not a contradiction of it. A cue that violates the house direction (new palette, off-world light, a betrayed anti-pattern) is a soft-check failure — ships `done_with_concerns` with the conflict named.

**No house CD present:** omit the hero/per-channel depth, emit a one-line `## Creative Direction` note ("No house CREATIVE-DIRECTION.md — art direction deferred to per-asset briefs against DESIGN.md tokens; run `create-brand` to add the house layer"), and flag `done_with_concerns`. Never fabricate a brand world here.

Consumed by the visual brief skills (`brief-graphic`, `brief-shortform`, `brief-landing-page`, `brief-app-preview`, `write-ad`) by heading match, alongside the house CD.

## Pillar table

- **Count:** 3-5 rows. Below 3 = under-committed strategy. Above 5 = diluted message.
- **Type values:** Problem | Transformation | Alternative | Trust | Social. One per row; rotation across types is healthier than 5 Problem pillars.
- **% column:** weighting of content allocation across pillars. Must sum to 100.
- **Stage column:** Unaware | Problem Aware | Solution Aware | Product Aware | Most Aware (Schwartz awareness stages). A pillar can span stages (write "All").
- **Evidence column:** specific ICP source (pain quote, VoC, workaround pattern). "ICP says X" without a source = fail the critic.

## Angle Bank table

- **Count:** 3+ angles per pillar (so 9-15+ total in a 3-5 pillar plan). Below 3/pillar = under-explored.
- **Hook column:** Data / How-to / Story / Contrarian / Listicle / Question / Other.
- **Trigger column:** Fear / Greed / Curiosity / Pride / Belonging / Hope / Anger / Surprise (Cialdini-style emotional anchors).
- **Score column:** 0-25 from 3D framework rubric. **Below 15 = cut**, no exceptions. Cut angles do not ship in the artifact.
- **Class column:** Shareable / Searchable / Conversational / Authoritative — drives the channel-agent's assignment logic.
- **Pillar column:** must name a pillar from the Pillars table. Orphan angles (no parent) = critic FAIL.

## Channel Assignments table

- **All 9 channels evaluated.** Selected channels appear as rows; skipped channels appear with their skip rationale below the table (or in the 9-Channel Evaluation note).
- **One specific angle per channel.** "Content about productivity" = category, not angle. Use a specific angle from the Angle Bank.
- **Role column:** Primary / Secondary / Supporting / Ecosystem. Drives weight in the timeline.
- **Cadence column:** posts/week or equivalent. Match to team capacity (see capacity-vs-cadence anti-pattern).

## Channel Execution Briefs table

Required for **every selected channel**. Skipped channels do not appear here.

- **Budget Type values:** Paid / Organic / Paid + Organic / Bartered / In-kind.
- **Success Metric:** name the metric AND the threshold (e.g., "CTR ≥ 1.5%", not "good CTR"). If funnel-planner has set targets, mirror them here.
- **Owner:** named person or role (e.g., "Marketing lead" / "Founder"). "TBD" is acceptable only on Sustain-phase channels.
- **First Milestone:** the first verifiable shipped output (e.g., "First campaign live by W2", not "Set up Meta ads"). Drives accountability.
- **Legibility block (per channel):** immediately under each channel's brief, emit the `**Legibility — applied expertise**` block from [`_shared/legibility-convention.md`](_shared/legibility-convention.md) — name the loaded pack + `pack_verified` date, the **specific** tactics applied (from the pack's §3 signals / §5 Playbook, not the channel name), and the one-line why. Use the **Stale** shape (⚠) when the pack is >90d old, and the **Absent** shape (no tailored claim) for a channel with no pack. The critic FAILs a channel whose brief claims tailoring without a pack-grounded Legibility block.

### Offline channel execution notes (when selected)

When IRL, SMS, or OOH appear in Channel Assignments, the Channel Execution Briefs table is followed by per-channel execution notes:

- **IRL:** Vendor/location requirements, lead capture method (QR code, signup form), follow-up workflow.
- **SMS:** Compliance requirements (TCPA/GDPR opt-in), character limits (160 GSM-7 / 70 UCS-2), unsubscribe mechanism.
- **OOH:** Readability specs (font size for viewing distance), vanity URL / QR for tracking, legal disclaimers.

These notes are non-optional when the channel is selected — the orchestrator writes them inline from channel-agent output. The critic gate fails if an offline channel is selected without these notes.

## Timeline table

- **3 phases minimum:** Pre-launch / Launch / Sustain. Plans without phase differentiation = critic FAIL.
- **Awareness progression:** Pre-launch = Problem/Educational content. Launch = Transformation/Trust. Sustain = Trust/Social. Reversed progression = critic FAIL.
- **Pillar rotation:** no pillar dominates >2 consecutive weeks. Same pillar for 4+ weeks = critic FAIL.
- **Capacity fit:** total weekly output across all channels must match declared team size. 10 pieces/week for 2-person team = critic FAIL.
- **Status column values:** Planned (default) / Live / Done.

## Launch Sequence table

- **5 phases (ORB-style):** Internal / Email list alpha / Partner posts / Public launch / PR + paid amplification.
- **Timing format:** `T-Nw` (weeks before launch) / `Day 0` (launch day) / `T+Nw` (weeks after).
- **Channels column:** the channel(s) activated in that phase, drawn from Channel Assignments.
- **Action column:** specific verifiable action ("Invite 50 alpha users to private Slack" not "Activate email list").

## Why This Works section

The `## Why This Works` block (section 12, after Launch Sequence, before Review Gate) follows
[`_shared/why-this-works-convention.md`](_shared/why-this-works-convention.md) — **product-fit**
rationale for the plan as a whole (distinct from the per-channel channel-fit Legibility blocks in
Channel Execution Briefs): the bet (the one wager this campaign makes, falsifiable so `measure-results`
can test it), then 2-4 load-bearing choices — pillar emphasis, channel mix, the lead angle — each
traced to a source (`ICP.md` pain/VoC, `PRODUCT-CONTEXT.md` positioning, the growth motion). Each
line must fail the Competitor Swap Test. No ICP/brand foundation → the convention's Absent state
(general principles only; never a fabricated pain or positioning claim).

## Review Gate block

The campaign-plan artifact ends with a `## Review Gate` section — the final body section, after `## Launch Sequence`:

```markdown
## Review Gate

- [ ] Approve
- [ ] Reject
- [ ] Suggest changes

Comments and suggested edits use Proof or inline CriticMarkup, depending on `review_tool`.
```

This `pipeline` artifact ships the block in every run, but `decision_state` defaults to `not_required` — most campaign plans are regenerable drafts. The operator (or a loop) opts a run into review by setting `decision_state: pending` in frontmatter and running the review per `references/_shared/roughdraft-review-protocol.md`. When a review completes, the agent reads the checked box, sets `decision_state` accordingly (Approve → `approved`, Deny → `denied`, Suggest changes → `suggested`), and fills `reviewed_at` + `reviewer`. Field semantics: `references/_shared/reviewable-artifact-contract.md`.

## Re-run convention

When re-running the skill on the same product/campaign:

1. **Default behavior:** overwrite `docs/forsvn/artifacts/marketing/campaign-plan.md` with `version: 1` (or current version), updated `date`.
2. **Preserve history mode:** rename existing artifact to `campaign-plan.v[N].md` (e.g., `campaign-plan.v1.md`) before writing the new version. New artifact gets `version: 2`, etc.
3. **Re-run triggers:** ICP research updated (>30d freshness recommendation), new product/campaign launch, channel performance data suggests reallocation, growth motion changes (PLG → Hybrid, etc.).
4. **Cite the trigger** in the Foundation section's core message rationale when re-running, so the diff vs. prior version is obvious.

## Critic verdict file (optional)

When the critic-agent fails on cycle 1 + 2 (max cycles exhausted) and the orchestrator delivers as `DONE_WITH_CONCERNS`, an optional sidecar may be written:

```
docs/forsvn/artifacts/marketing/campaign-plan.critic-notes.md
```

Contents: full critic feedback per cycle, named re-dispatch targets, what was fixed / what wasn't. Not mandatory; useful when handing off to a human reviewer.

## Anti-drift checks

Before the orchestrator writes the artifact:

- All 9 channels appear in Channel Assignments OR in a skip-rationale list. Missing channels = critic FAIL.
- Every angle in Angle Bank names a pillar from the Pillars table. Orphan angle = critic FAIL.
- Every channel in Timeline appears in Channel Assignments. New channel introduced at Timeline stage = critic FAIL.
- Every selected channel has a row in Channel Execution Briefs. Missing brief = critic FAIL.
- Pillar % sums to 100. Awareness distribution % sums to 100.
- Cadence × team size sanity check passes. Capacity overrun = critic FAIL.
