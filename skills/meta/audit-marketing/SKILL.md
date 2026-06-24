---
name: audit-marketing
description: "Metricless front door to the FORSVN slop detector — judge marketing copy before it ships. `audit` scans an artifact or the whole tree for AI-slop antipatterns → a severity-grouped 'reads like AI?' report with named rule IDs and a routed fix per finding. `polish` chains audit → fixers → a conservative re-verify gate that reverts any fix weakening a claim/number/CTA. Detect ≠ fix; human-owned. Not for code review (review-work), new copy (write-copy), or metrics/CRO (evaluate-*)."
argument-hint: "[audit|polish] [target artifact, or empty = whole tree]"
allowed-tools: Read Grep Glob Bash Skill
user-invocable: true
metadata:
  version: "1.0.0"
  budget: standard
  estimated-cost: "$0.05-0.40"
---

# Audit-Marketing — Is This Slop? (the pre-ship verdict)

The on-demand + whole-tree front door to the marketing-antipattern registry. Sits on the deterministic floor (`forsvn-slop/scan.ts`, S2) and the shared registry (`registry/antipatterns.mjs`, S1) and wires them into the two human-facing verbs `/forsvn audit` and `/forsvn polish`. Routing in [`routing.yaml`](routing.yaml).

**Core:** would a sharp marketer say this reads like AI — and which named tell proves it?

This is the *deliberate* path. The always-on annotate-only nudge on every save is the S3 hook (`hooks/post-artifact-slop-scan.mjs`), a separate seam.

## Critical Gates — load first

1. **Detect ≠ fix (D-25).** `audit` NEVER edits the audited artifact. `polish` edits but lands `decision_state: pending` — there is NO accept-tool on the agent channel; only the human approves on `/forsvn:review`. Never write `decision_state: approved`; never append to `.forsvn/learning/verdicts.tsv`.
2. **The scanner is the only detector.** Every finding's id/severity/tier/fixSkill comes from `scan.ts --json` (which reads the S1 registry). Never invent a rule id; never hand-judge severity. Vocabulary is `mkt-*` ids + `block | warn | nit` — never `rule:copy-*` / `warning|advisory`.
3. **Noise-filter before report-write.** Every finding passes [`noise-filter.md`](references/noise-filter.md): Layer-1 real-vs-fake (drop FPs), then Layer-2 Accepted / Rejected / Deferred. Noise gate: ≥5 findings & 0 `block` → collapse nits to one Rejected line.
4. **The re-verify gate is conservative-by-construction (polish).** A fix is accepted ONLY if the severity-weighted score strictly improves AND the firing rule is gone AND no new finding appears AND the Post-Humanize Regression Check passes (entities/URLs/numbers/prices/dates/claims/CTA unchanged). Any doubt → roll back the section, re-state Deferred. Authority is asymmetric: one confident wrong fix that weakens a claim costs far more than a missed tell. Max 2 rounds.
5. **Block-severity ≠ denylist.** Ten rules are `block` (top of the report); only the tiny D-26 denylist — `mkt-claim-fabricated-precision` + the locked-brand-token/no-gradient analog — escalates `/polish` to BLOCKED. The other eight block rules are annotate-only.

## Sub-commands

First word selects the flow (Impeccable sub-command model); no arg → `audit` the whole tree. Sub-commands don't re-invoke the parent.

| First word | Flow | Loads |
|---|---|---|
| `audit` (or none) | one-shot, metricless scan → severity-grouped report. NEVER fixes. | [`references/audit-flow.md`](references/audit-flow.md) |
| `polish` | audit → dispatch fixers (Route C) → re-verify gate → land `decision_state: pending`. Max 2 rounds. | [`references/polish-flow.md`](references/polish-flow.md) |

Category→fixer routing: [`references/fix-routing.md`](references/fix-routing.md). The re-verify exit gate: [`references/reverify-gate.md`](references/reverify-gate.md). Mode + shared protocols: [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md), [`references/_shared/quality-feedback-protocol.md`](references/_shared/quality-feedback-protocol.md).

## Before Starting

- **Mode** ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)): default `standard`. A single named artifact → `fast` is fine; a whole-tree `polish` → keep `standard` (the re-verify gate is non-negotiable regardless of mode).
- Confirm the scanner exists: `forsvn-slop/scan.ts`. If absent, this skill cannot run a real scan — report `NEEDS_CONTEXT` naming S1/S2 as the missing dependency.
- The advisory LLM-critic tier (S6) is optional. If its agent isn't present, deterministic-only is a complete, authoritative run — the report notes `advisory tier not run`.

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/meta/records/[YYYY-MM-DD]-audit-marketing-<slug>.md` (dated, immutable per-run)
- **Lifecycle:** `snapshot` — accumulates, never overwritten
- **Frontmatter + body:** [`references/report-template.md`](references/report-template.md) — carries `skill`, `id`, `type: record`, `keywords`, `stack: meta`, `review_surface`, `verb`, `rounds`, `score_before`/`score_after`, `verdict`, `provenance`. Score/rounds live HERE, never in `verdicts.tsv`. Passes `validate-artifacts --strict`.

## Anti-Patterns

- Auto-fixing on the agent channel, or writing `decision_state: approved` / a `verdicts.tsv` row — forbidden (human-owned review).
- Treating a clean scan as proof of quality, or any single antipattern instance as auto-fail — only the explicit `block` rules + the denylist are zero-tolerance; everything else is threshold-gated in the registry, not here.
- Flagging a quoted testimonial, a regulated-industry legal disclaimer, or an intentional bad-example block — the FP guards exempt them; the report must not.
- Confidently auto-fixing a cross-artifact rule (`mkt-cta-bait-and-switch`, `mkt-persuasion-no-social-proof`) when the paired artifact isn't in scope → route to a human-review note instead.
- Looping past 2 rounds — a draft that won't clean in 2 is flagged for the operator as a possible structural problem, not looped.

## Completion Status

- **DONE** — `audit`: zero findings across all targets. `polish`: all Accepted findings fixed + verified.
- **DONE_WITH_CONCERNS** — `audit`: findings reported (the normal case — audit never fixes). `polish`: some findings rolled back to Deferred, or the 2-round cap hit.
- **BLOCKED** — `polish`: a denylist finding is unresolved after 2 rounds. (`audit` never blocks a write — it reports.)
- **NEEDS_CONTEXT** — the scanner (S1/S2) isn't present, or the named target can't be resolved.
