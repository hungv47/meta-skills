---
title: Platform Evidence Research Playbook
lifecycle: canonical
status: stable
produced_by: research-platform
load_class: PLAYBOOK
---

# Platform Evidence Research Playbook

## Why this skill exists

Social, SEO, short-form, and evaluation skills make recommendations about platforms — what to post, when, in what format, how to read a result. Too often those recommendations rest on intuition, last quarter's gut feel, or a benchmark borrowed from the wrong cohort. The operator's own accounts are usually instrumented — X Analytics, YouTube Studio, LinkedIn page analytics, TikTok and Instagram insights all produce real numbers — but that evidence sits in screenshots and exports nobody folds back into the work.

`research-platform` is the skill that folds it back in. It takes the evidence the operator actually has — owned analytics, public metrics, manual exports, qualitative observations, prior eval outcomes — and turns it into a sourced, tagged, per-platform evidence base. Every metric carries where it came from and when it was measured. Every recommendation names the platform, the evidence source, the freshness window, and the confidence behind it. The artifact replaces "I think our LinkedIn does better on Tuesdays" with "engagement_rate by weekday, owned_analytics, measured 2026-05-10, confidence H."

The output is not a survey of the platform. It is a **measured base for decisions** — the thing a downstream skill reads so its recommendation is grounded in what happened on the operator's accounts, not in what tends to happen on accounts in general.

## The evidence-not-intuition doctrine

The skill exists to enforce one rule: **a recommendation about a platform must trace to measured evidence, or it does not ship.** Everything in the skill — the source-type tags, the coverage flags, the four-part recommendation attribution, the critic's five rubrics — exists to make that rule mechanical rather than aspirational.

Three corollaries:

- **A guess is a fabrication.** A number with no source and no date is fabricated even when it is plausible. Plausibility is not provenance. The skill never lets a guess wear the clothes of a measurement.
- **A gap is a finding.** "We have no retention data for TikTok" is real, useful output. It tells a downstream skill what it cannot claim and tells the operator what to export. The skill surfaces gaps; it never fills them with estimates.
- **Honesty beats coverage.** An evidence base that flags two platforms NO_EVIDENCE is more valuable than one that pads them with confident, unsourced numbers. The critic scores provenance, not polish.

## The credential-free posture

This skill **never holds platform credentials and never wires a live API.** It is an evidence-intake-and-synthesis skill, not an integration.

- The operator supplies evidence — exports, screenshots-as-text, analytics figures pasted into the conversation. The skill structures, tags, validates, and synthesizes it.
- Public metrics (figures visible on a public post or profile page) are retrievable with the skill's normal web tools — no login.
- The platform APIs (X API v2 metrics, YouTube Analytics API, LinkedIn Marketing/Community APIs) are documented in the per-platform schemas as an **optional enrichment the operator can run themselves and paste in** — the skill describes what each API exposes and its limits, but does not call it.
- Missing API access is never a blocker for the skill's design. It degrades to `NEEDS_CONTEXT` or a flagged gap — never to an invented number.

This posture is deliberate. A credential-holding integration is a larger, fragile, platform-dependent build; TikTok and Instagram stay constrained regardless of how much OAuth is wired. An intake-and-synthesis skill works today, on every platform, with whatever evidence the operator can produce — and it cannot leak a credential it never held.

## Methodology

**Evidence base, not a dashboard.** The artifact's job is to give a downstream skill a tagged, sourced, current set of facts to reason from — with honest coverage flags about how solid each platform's facts are. A metric at `owned_analytics`, confidence H carries different weight than the same metric at `public_metrics`, confidence L — both are reportable, the tags keep them distinguishable.

**Source-type is provenance.** Every datum is tagged with one of five source types — `owned_analytics`, `public_metrics`, `manual_export`, `forum_observation`, `prior_eval`. The tag travels with the number all the way downstream so a consumer three skills away still knows exactly how solid it is. See [`evidence-protocol.md`](evidence-protocol.md).

**Coverage flag gates recommendations.** Each platform gets MEASURED, PARTIAL, or NO_EVIDENCE. MEASURED → recommend normally. PARTIAL → recommend, capped at confidence M, directional. NO_EVIDENCE → recommend nothing. The gate is mechanical.

**Two freshness windows.** Performance metrics decay on a 30-day window (warn at 60d). Platform-mechanic context decays on a 90-day window (warn at 180d). Two timestamps in the frontmatter, so one fresh date can never mask a stale truth.

**Benchmarks interpret; they do not become the evidence.** External benchmark ranges let an owned number be read as high or low. They are context — never transcribed into the account's evidence base, never the basis of a recommendation on a NO_EVIDENCE platform.

## When NOT to use this skill

- **Discovering what's working in the wild** — viral hook archetypes, trending formats, what other creators do. Use `research-shortform`; it looks outward at public performers. `research-platform` looks at the operator's *own* measured performance. The two are complements: `research-shortform` can consume this artifact to ground its discovery against the operator's real numbers.
- **Competitive or market analysis** — competitor positioning, TAM/SAM/SOM, whitespace. Use `research-market`.
- **Audience research** — who the customer is, what they feel. Use `research-icp`.
- **Scoring a specific published post or campaign against its brief** — use `evaluate-content` or `evaluate-shortform`. Their cycle outputs can feed *into* this skill as a `prior_eval` evidence source, but the scoring itself is theirs.
- **When the operator has, and can supply, no evidence at all, for any platform** — the skill will return `NEEDS_CONTEXT` and tell the operator what to export. That is the correct outcome, but it means a run now is premature.

## Distinction from research-shortform — at a glance

| | `research-shortform` | `research-platform` |
|---|---|---|
| Looks at | Public performers, in the wild | The operator's own accounts |
| Evidence | Observable public videos + platform docs | Owned analytics, exports, public metrics, prior evals |
| Answers | "What hook/format is working right now?" | "What does our measured performance say?" |
| Output | Catalog of bets to brief from | Evidence base to ground decisions in |
| Relationship | Can consume `platform-evidence` to ground discovery | Lists `research-shortform` as a consumer |

## History / origin

- **v1.0.0 — initial release.** 5-agent orchestration (evidence-intake × N parallel + benchmark parallel → synthesis → recommendation → critic). Five-source-type evidence model, three-tier coverage flag, two-window freshness model, and the 5-rubric critic gate established at launch. Built as WS6 of the incremental-reviewable-artifacts program — the platform-evidence gap identified in the program's D7 decision. Credential-free evidence-intake posture (over a live-API build) locked by operator decision at the WS6 interview.

## Further reading

- [`evidence-protocol.md`](evidence-protocol.md) [PROCEDURE] — the 5 evidence-source types, intake and validation rules, source-type tagging, coverage-flag thresholds
- [`procedures/pre-dispatch.md`](procedures/pre-dispatch.md) [PROCEDURE] — needed dimensions, the evidence-intake prompt, warm/cold start, write-back map
- [`procedures/dispatch-mechanics.md`](procedures/dispatch-mechanics.md) [PROCEDURE] — Layer 1/2 spawn mechanics, critic routing, chain position
- [`scoring-rubrics.md`](scoring-rubrics.md) — coverage-flag thresholds, freshness windows, the 5 critic rubrics
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes
- [`format-conventions.md`](format-conventions.md) — frontmatter schema, citation format, section order
- [`platforms/`](platforms/) — per-platform evidence schemas (x, linkedin, tiktok, youtube, instagram)
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (this skill is `budget: deep`; `--fast` collapses to single-pass intake + synthesis with the critic skipped, Critical Gates still enforced)
