---
title: Cold Outreach — Format Conventions
lifecycle: canonical
status: stable
produced_by: cold-outreach
load_class: PROCEDURE
---

# Format Conventions

**Load when:** composer / voice-auditor / critic compose artifact content OR critic verifies banned-phrase / format compliance. These conventions are enforced by critic's structural auto-fails (Peer Voice section) and the orchestrator's 3-file artifact contract.

---

## Date format

Frontmatter `date:` field uses ISO 8601 (`YYYY-MM-DD`) for machine-readable consistency with the rest of the artifact ecosystem. Content dates inside the outreach text follow the source convention (don't reformat dates inside quoted passages from prospect's posts or named-entity references).

## Slug derivation

Slug is derived from `target + channel + touch` and lives in the filenames:

- **Format:** `[target-slug]-[channel]-t[N]` (touch 1 may omit `-t1` per operator preference, but multi-touch always includes touch suffix)
- **Examples:** `jane-acme-email-t1`, `jane-acme-linkedin-dm`, `jane-acme-email-t2-followup`, `mark-ramp-twitter-reply`, `lin-stripe-upwork-proposal`
- **`-followup` suffix** appended manually when the touch is a follow-up to a non-reply (semantically equivalent to `-t2` but more readable in slug lists)
- **`-breakup` suffix** appended for breakup-mode touches (final touch acknowledging silence + offering future re-engagement)

The slug propagates to all 3 artifact files (`[slug].md`, `[slug].rationale.md`, `[slug].critic-score.md`).

## Frontmatter field order (Artifact Template)

Per the Artifact Template block in SKILL.md body. Required fields in this order:

```yaml
skill: write-outreach
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
channel: email | linkedin-dm | linkedin-connection | twitter-reply | twitter-dm | imessage | sms | upwork-proposal | other-platform
mode: services-sell | saas-sell | partnership-sell | community-sell
touch: integer | "breakup"
route: compose | reply
critic_total: N/50
```

For Route C (called by `plan-campaign`), `version` may carry the calling skill's version semantics (e.g., `version: campaign-plan-v2`); orchestrator sets at compile time.

## Output file structure (3 files per run)

Every run produces THREE files in `docs/forsvn/artifacts/marketing/write-outreach/`:

| File | Content | Consumer |
|------|---------|----------|
| `[slug].md` | Final ready-to-send draft (+ subject line for email, + connection-note variant for LinkedIn). Full frontmatter above. | Human (sender), `plan-campaign` (Route C) |
| `[slug].rationale.md` | Angle chosen, framework used, signal selected, CTA logic, channel craft rules applied, anti-patterns avoided. Per-target dimensions from Pre-Dispatch (mode/channel/target/trigger/desired-outcome/bridge). | Human (sender review), maintainer (audit) |
| `[slug].critic-score.md` | Rubric scorecard across 5 dimensions (for iteration). PASS/FAIL verdict + per-dim scores + structural auto-fail checklist results + cycle count. | Maintainer (audit), `plan-campaign` (sequencing — picks PASS scores ≥40 for highest-priority touches) |

## Field values — channel

The 9 supported channels:

| Value | Surface |
|---|---|
| `email` | Cold email; subject line required + body ≤6 sentences |
| `linkedin-dm` | LinkedIn direct message (post-connection-accept); ~40-55 char teaser preview window |
| `linkedin-connection` | LinkedIn connection-request note (≤300 chars HARD CAP) |
| `twitter-reply` | Public reply on X/Twitter; demand-signal-driven |
| `twitter-dm` | Twitter direct message; ~40-55 char teaser preview window |
| `imessage` | iMessage (blue bubble); ~90-char teaser preview, write ≥135 chars to force open |
| `sms` | SMS (green bubble); same teaser preview as iMessage; trust signal differs from blue bubble |
| `upwork-proposal` | Upwork proposal; pitching into declared need (different rubric — `references/channels/platform-proposals.md`) |
| `other-platform` | Fiverr, Toptal, similar platform proposals; reuses upwork-proposal craft rules |

## Field values — mode

| Value | Business motion |
|---|---|
| `services-sell` | Consulting / agency / freelance — revenue-tied problems, audit/loom/teardown CTAs, value-based positioning |
| `saas-sell` | SaaS / product — product-led framing, trial/demo CTAs, ROI proof shapes |
| `partnership-sell` | B2B partnership / collab / integration |
| `community-sell` | Low-ask value-first (helpful note, resource offer); no monetary motion in touch 1 |

## Field values — touch

- **Integer (1, 2, 3, 4+)** — touch number in sequence
- **`"breakup"`** (string literal) — final touch acknowledging silence + offering future re-engagement (no further touches expected without inbound reply)

## Field values — route

- **`compose`** — Route A (first-touch or follow-up); user supplied target + trigger + proof, orchestrator dispatched Layer 1a → 1b → 2 → terminal humanmaxxing
- **`reply`** — Route B (reply handling); user pasted inbound, orchestrator dispatched reply-classifier → reply-composer → voice-auditor → critic → terminal humanmaxxing

## critic_total format

Frontmatter `critic_total` follows this format:

```
critic_total: N/50
```

Where N is the sum across 5 dimensions (Peer Voice + Signal Connection + CTA Friction + You>Me Ratio + Specificity). Reply route substitutes "Signal Connection" → "Tone Match" and "CTA Friction" → "Next Step Clarity"; the substitutions don't change the format.

PASS threshold: total ≥35/50 AND every dim ≥6. Total 35-39 with all dims ≥6 = PASS as `DONE_WITH_CONCERNS`. Any dim <6 = FAIL regardless of total.

Reply route adds a hard gate (not scored, overrides all 5 dim scores): re-pitching after clear "not interested" / hostile inbound >2 lines / fabricated referent → auto-FAIL.

## Re-run convention

On re-run for the SAME (target, channel, touch) tuple: overwrite the existing 3 files (cold outreach is a single-best-attempt artifact, not a versioned history — earlier drafts live in git history if needed). For NEW touches in a multi-touch sequence to the same target, increment touch number in the slug (`-t1` → `-t2` → `-t3`) and write fresh files; do not overwrite earlier touches (composer needs them as `prior_touches` input for touch 2+).

## When critic catches a format violation

Critic FAIL on structural auto-fails (banned phrase, formal sign-off, em-dash overuse, fake Re:/Fwd: subject, fact-free paragraph, setup-sentence opener, "just" hedge, padding-sentence, rhetorical-question hook) → re-dispatch composer with the specific structural fail cited via voice-auditor. Format violations are usually one-shot fixes; do not loop past cycle 1 for format-only issues unless other dimensions also fail.

Specificity Floor violations (fewer than 2 verifiable specifics in body) → re-dispatch composer + parallel proof-selector with "need stronger proof so composer has more anchors." Per `dispatch-mechanics.md` § "Route A step 6a" — voice-auditor BLOCKED on proof gap is separate from critic FAIL cycles and does NOT consume a critic rewrite cycle.
