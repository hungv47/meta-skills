<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

# Playbook-Pack Contract (v2)

**Status:** canonical. **Enforced by:** `bun skills/bin/validate-packs.ts --strict` (pre-merge gate).
**Authoring template:** [`_template.md`](./_template.md). **Owner:** the FORSVN skills stack.

A *playbook pack* is a first-class, dated, gate-validated artifact that pack-aware skills load at
runtime and **narrate** (legibility convention, `../legibility-convention.md`). Skills never
hard-code the tactics inside a pack — the carrying cost of channel knowledge lives in the pack,
not the skill (KD4). This contract is what makes that safe: every pack is parseable, dated, typed,
and structurally complete, so a consuming skill (or the freshness pipeline) can rely on its shape.

This is the open-core wedge in artifact form: the **free** client ships a build-time *snapshot* of
every pack (mirrored into each consuming skill's `references/_shared/platform-intelligence/`); a <!-- lint:reference-ok mirror destination in consumers, not a file at source -->

**Pro** client fetches the *current* pack from the freshness pipeline (`backend/api/` U8). They
diverge automatically as a pack's `last_verified` ages — no DRM, just freshness.

---

## Frontmatter (required, all packs)

| Field | Type | Rule |
|---|---|---|
| `type` | literal | must be `platform-intelligence` |
| `platform` | kebab slug | unique per pack; matches the filename stem |
| `schema_version` | integer | `2` for packs on this contract (`1` = legacy video packs, validated under the v1 rules) |
| `pack_type` | enum | `shortform-video` \| `launch-channel` \| `asset-format` |
| `last_verified` | `YYYY-MM-DD` | the day the tactics were last checked against reality |
| `verifier` | string | who verified (`hungv47`, an agent name, or `internal`) |
| `status` | enum | `draft` \| `reviewed` \| `stale` — the lifecycle state |
| `source_basis` | string | how claims are cited (categorical inline vs URL ledger) |
| `summary` | string | one line, quotable — the legibility convention surfaces it **verbatim** to the user |

**Staleness is a warning, never a hard failure.** When `today − last_verified > 90 days`, the
validator warns and the consuming critic downgrades to `DONE_WITH_CONCERNS`. It does **not** fail
the gate — packs are *expected* to age (that aging is the subscription wedge); failing on it would
block every merge as time passes. A pack whose tactics are known-aged should set `status: stale`
to suppress the "verify me" nudge and signal the freshness pipeline to prioritize it.

## Required sections (by `pack_type`)

The validator checks for each required H2 by a keyword match (numbering and exact wording may
vary; the keyword must appear in an `## …` heading).

| Required heading keyword | shortform-video | launch-channel | asset-format |
|---|:-:|:-:|:-:|
| `When NOT to launch` (channel-fit veto) | optional | ✓ | optional |
| `Hook` (Taxonomy / Angles) | ✓ | ✓ | ✓ |
| `Format Constraints` | ✓ | ✓ | ✓ |
| `Signals` (Algorithm / Ranking) | ✓ | ✓ | optional |
| `Anti-Pattern` | ✓ | ✓ | ✓ |
| `Playbook` | ✓ | ✓ | ✓ |
| `Timing` (Cadence / Hook Window) | ✓ | ✓ | optional |
| `CTA` (or Conversion) | ✓ | ✓ | ✓ |
| `Open Questions` | ✓ | ✓ | ✓ |
| `Changelog` | ✓ | ✓ | ✓ |

`## 5. Playbook / Tactical Sequence` is the **spine of v2** — the ordered, timed, falsifiable play
a launch chain executes and a skill narrates. A pack without a real Playbook is not a playbook pack.

`## 0. When NOT to Launch Here` is the **channel-fit veto** (added 2026-06-19, S3.3) — **required for
`launch-channel` packs**. It is the scannable list of falsifiable bad-fit conditions `plan-campaign`
reads as a real *don't-launch-here* (the marketer who says no) during the 9-channel evaluation: a
launch channel whose §0 matches the campaign's product / ICP / goal / growth-motion is skipped
(pack-cited) or selected only with an explicit override justification. `shortform-video` packs carry
the equivalent as inline **Bad fit:** lines inside §1 angles (optional, not an H2) — so §0 is
`optional` for them and for `asset-format`.

## What the validator checks

1. **Frontmatter** — all required fields present; `type` literal; `status`/`pack_type`/`schema_version`
   enum-valid; `last_verified` is a real `YYYY-MM-DD`.
2. **Sections** — every required H2 for the declared `pack_type` is present (keyword match).
3. **Playbook non-emptiness** — the `Playbook` section contains a table or a numbered sequence
   (not just a heading).
4. **Staleness** — warns (does not fail) when older than 90 days and `status != stale`.
5. **Legacy v1** (`schema_version: 1`) — validated under the v1 section set (the six original
   video packs) so the contract change doesn't retroactively break them. New packs MUST be v2.

The validator scopes to the **source** dir (`skills/references/platform-intelligence/*.md`) only —
it never walks the generated `_shared/` mirrors (which carry a GENERATED header before their
frontmatter). `_template.md` and `CONTRACT.md` are skipped.

## Mirror sync

Packs are edited **at source** here and mirrored into every consuming skill's
`references/_shared/platform-intelligence/` by `node _dev/sync-skill-support.mjs` (whole-tree <!-- lint:reference-ok mirror destination in consumers, not a file at source -->
mirror, byte-level — new frontmatter fields ride along automatically). Run it after adding or
editing a pack; `node _dev/sync-skill-support.mjs --check` in the gate fails on drift. Never edit a
`_shared/` mirror directly.

## Adding a pack — checklist

1. Copy `_template.md` → `<platform>.md`; set `pack_type` and fill every required section.
2. Write a real Playbook (§5) with timings + falsifiable success markers.
3. Set `last_verified` to today, `status: draft` (or `reviewed` once a second pass lands).
4. Write a one-line `summary` the consuming skills can quote.
5. `bun skills/bin/validate-packs.ts --strict` → green.
6. `node _dev/sync-skill-support.mjs` → regenerate mirrors; commit source + mirrors together.
