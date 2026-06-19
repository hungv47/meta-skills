# Format Conventions — launch-copy

> Load when the orchestrator assembles the final artifact OR when guard-checker-agent validates structural + hard-guard compliance. Encodes the artifact path, the 16-field frontmatter schema, the body sectioned schema, the guard-check rules, and date/number/citation conventions.

The schemas in this file are **cross-stack contracts**. The frontmatter `critic_score` + `critic_verdict` + `guard_status` feed `humanmaxxing` / `polish-vn` and `run-pipeline` / `measure-results` ingestion. Renaming a field or reordering body sections requires atomic update of downstream consumers per `anti-patterns.md` row "Cross-stack contract drift."

---

## Artifact path

```
docs/forsvn/artifacts/marketing/launch/[channel]-[YYYY-MM-DD]-[slug].md
```

Where:
- `[channel]` = the launch channel, matching the pack stem (`producthunt | reddit | show-hn | …`) — one per artifact; multi-channel = re-invoke.
- `[YYYY-MM-DD]` = ISO-8601 date of generation.
- `[slug]` = short-kebab-case slug from the launch topic (max 4 words; e.g. `forsvn-ph-launch`, `tauri-devtool`).

Same-day same-slug collision → suffix `-v2`, `-v3` (variant exploration).

---

## Frontmatter schema (16 fields, verbatim — match exactly, in order)

```yaml
type: launch-copy-artifact
channel: producthunt | reddit | show-hn | <launch channel>
date: YYYY-MM-DD
slug: short-kebab-slug
brand_mode: founder | company
goal: feedback | signups | awareness | velocity
variant_count: 1-3
brief_source: <path or inline-topic>
platform_intel_version: <last_verified date from platform-intelligence/[channel].md, or none>
pack_verified: <YYYY-MM-DD or none>   # legibility: loaded pack's last_verified; `none` when no pack covers this channel
applied_tactics: [<tactic>, ...]      # legibility: specific tactics narrated (empty when pack_verified: none)
guard_status: passed | failed         # the §4 hard-guard outcome from guard-checker (failed only on a shipped FAIL artifact; GUARD_FAIL ships status: blocked)
critic_score: <numeric, 0-50 across 5 dimensions × 0-10>
critic_verdict: pass | done_with_concerns | fail
status: done | done_with_concerns | blocked | needs_context
polish_chain_applied: vn-tone | humanmaxxing | none
```

**Field semantics:**

- `type` — fixed string `launch-copy-artifact`. Used by manifest-sync to classify.
- `channel` — single value; drives which platform-intelligence/[channel].md the agents read. `none`-pack channels keep their slug but set `pack_verified: none`.
- `goal` — one of 4 values; default `feedback` (the launch ask is a feedback/genuine ask, never a vote-ask).
- `variant_count` — integer 1–3. Default 2. Applies to the primary identifier + anchor-narrative opening.
- `platform_intel_version` — `last_verified` date from the pack consumed (or `none`).
- `pack_verified` / `applied_tactics` — the legibility convention's machine-readable fields. `pack_verified: none` + empty `applied_tactics` = transparent-degrade (no pack).
- `guard_status` — `passed` when every §4 hard guard cleared. A `GUARD_FAIL` does NOT write a `failed` artifact — it ships `status: blocked` with no critic. `failed` appears only if a critic-FAIL artifact ships with a residual soft issue noted; the normal shipped artifact is `guard_status: passed`.
- `critic_score` — integer 0–50.
- `critic_verdict` — `pass` (≥35 AND no zero), `done_with_concerns` (25–34 OR any dim < 4), `fail` (< 25).
- `status` — Completion Status from SKILL.md. Matches `critic_verdict` unless BLOCKED / NEEDS_CONTEXT.
- `polish_chain_applied` — `none` (default), `humanmaxxing`, or `polish-vn`.

---

## Body schema (sectioned markdown — match exactly)

```markdown
## Launch bundle — [channel]

### Primary identifier
<tagline (PH, ≤60) | post title (Reddit, ≤300) | Show HN title>
**Char count:** N / [pack §2 cap]
**Launch angle:** <named §1 angle>
[### Primary identifier — Variant B … only if variant_count>1]

### Descriptor
<PH description (~260) | Reddit value-first body>
**Char count:** N / [pack §2 cap or recommendation]

### Anchor narrative
<PH pinned first comment (80–150 words) | Reddit founder-disclosure value lead>
**Pack tactic:** <§1 angle + §5 step>
**Feedback ask (never a vote-ask):** <the closing question>

### Amplification
- **Notify copy:** <off-channel "we're live, take a look" — no upvote/vote string>
- **Cross-post copy:** <news-framed "we launched [link]">

### Channel metadata + compliance
- <PH: topics ≤3 · go-live window (§6) · optional offer · gallery slot-1 demo-loop note (→ brief-graphic)>
- <Reddit: target subreddit(s) + why · allowed lane · required flair · posting window (§6) · founder disclosure present>

**Legibility — applied expertise**
- Pack: `[channel]` · verified [YYYY-MM-DD] · status [reviewed|draft|stale]
- Tactics applied: <specific tactics from §5 — concrete, never "tailored for [channel]">
- Why these: <the ranking signal / §-cite that justifies them>

**Why this works**
- The bet: <the falsifiable wager this launch makes>
- For this product: <choice → ICP pain / VoC phrase / positioning — name the source>
- For this product: <a second load-bearing choice → its product-specific reason>
- The differentiator: <why this wouldn't work verbatim for a competitor>

## Critic verdict
| Dimension | Score | Notes |
|---|---|---|
| Angle fit / clarity | 0-10 | scored vs pack §1 launch angles |
| Format + hard-guard compliance | 0-10 | §2 caps + §4 guards (0 on any guard breach) |
| Velocity-earning structure | 0-10 | §3/§5; no vote-ask |
| Channel-native voice / culture fit | 0-10 | native vs press-release |
| Bundle completeness + coherence | 0-10 | all components present + consistent |
| **Total** | / 50 | pass ≥ 35; done_with_concerns 25-34; fail < 25 |

## Anti-patterns triggered (if any)
- <list of detected anti-patterns from references/anti-patterns.md, by name>
```

---

## Required body sections (cross-stack contract)

In order. Renaming or reordering breaks polish-chain readers and eval-loop / measure-results ingestion.

1. **Launch bundle** — the channel-instantiated components (Primary identifier · Descriptor · Anchor narrative · Amplification · Channel metadata + compliance). `variant_count` = the number of `### Primary identifier` variant blocks.
2. **Legibility** — the channel-fit block per [`_shared/legibility-convention.md`](_shared/legibility-convention.md): pack loaded + `pack_verified` + the specific tactics narrated (`applied_tactics`), or the transparent-degrade statement when no pack covers the channel. Placed just before Why this works.
3. **Why this works** — the product-fit rationale block per [`_shared/why-this-works-convention.md`](_shared/why-this-works-convention.md): the falsifiable bet + 2-4 load-bearing choices traced to ICP pain / VoC / positioning, Competitor-Swap-clean. Distinct from the channel-fit Legibility block above. No ICP/brand foundation → the convention's Absent state.
4. **Critic verdict** — 6-row markdown table (5 dimensions + Total).
5. **Anti-patterns triggered (if any)** — bullet list by name from `anti-patterns.md`. If none, the header is still present with `- None` (explicit empty is the contract).

---

## Guard-check rules

The guard-checker-agent enforces these in order. A **format cap** violation = REVISION_REQUIRED. A **hard guard** breach = REVISION_REQUIRED (1st) → GUARD_FAIL (2nd, publish-blocking).

| Rule | Class | Channel | Detection |
|---|---|---|---|
| No vote-ask in ANY component | HARD GUARD | PH / Reddit / Show HN | case-insensitive `upvote` / `vote for` / `vote us` / `give us a vote` in identifier, descriptor, anchor, notify, OR cross-post |
| Founder disclosure present | HARD GUARD | Reddit | first-person founder disclosure line in the body |
| Value stands alone (no cold link-drop) | HARD GUARD | Reddit | the post delivers value if the link were removed; link is contextual |
| Sub-rule / flair / lane fit | HARD GUARD | Reddit | target sub named + allowed lane + required flair noted |
| Primary identifier within cap | format cap | all | tagline ≤60 (PH) / title ≤300 (Reddit) per §2 |
| Bundle component present | format cap | all | identifier + descriptor + anchor + amplification + metadata all present |
| First comment 80–150 words | soft | PH | advisory; flag, do not block |
| Go-live / posting window present | soft | all | advisory |

---

## Date / Number / Citation Format

- **Dates:** ISO-8601 (`YYYY-MM-DD`). `date`, `platform_intel_version`, `pack_verified` fields.
- **Char counts:** integer + ` / ` + integer limit. Example: `**Char count:** 47 / 60`.
- **Score values:** integer 0–10 per dimension; integer 0–50 total.
- **Tactic cites:** name + section. Example: `pinned founder-story first comment (producthunt §5 step 6)`.
- **Anti-pattern citations:** name (not number) as listed in `anti-patterns.md`.

---

## Cross-stack consumers (reference, not contract change)

| Consumer | What it reads |
|---|---|
| humanmaxxing | `### Descriptor` + `### Anchor narrative` + `### Amplification` (rewrites in place); frontmatter `polish_chain_applied` |
| polish-vn | Same, plus the primary-identifier variants for register check |
| publish-social | The amplification copy (notify + cross-post) + the on-channel components to render the distribution drafts |
| measure-results | Frontmatter `channel` + `critic_verdict` + `applied_tactics` to read the result against the same pack and write back |
| run-pipeline | `critic_score` + `critic_verdict` + `goal` + `channel`; pipes into `results.tsv` |

Schema drift in this file ripples to these consumers. Operator review required before any structural change.
