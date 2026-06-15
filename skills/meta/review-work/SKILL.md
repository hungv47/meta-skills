---
name: review-work
description: "Independent post-implementation review — an agent with no sunk-cost bias checks just-written code or an artifact against its requirements, then resolves the issues found (max 2 rounds). Use to verify a change before shipping, get a second opinion, or check what you missed; auto-triggers for security-sensitive and data-mutation code. Not for code refactoring (use clean-code) or decision analysis (use debate-agents)."
argument-hint: "[code or artifact to verify]"
allowed-tools: Read Grep Glob Bash
user-invocable: true
metadata:
  version: "1.0.1"
  budget: standard
  estimated-cost: "$0.15-0.50"
---

# Review Chain — Fresh-Eyes Post-Implementation Quality

Independent reviewer + resolver loop for code, artifacts, plans, or shipped work. Reviewer has no implementation context; resolver synthesizes. Routing in [`routing.yaml`](routing.yaml); methodology + "no critic on critic" in [`references/playbook.md`](references/playbook.md).

**Core:** What would a senior reviewer with no sunk-cost bias catch?

## Critical Gates — load first

1. **Reviewer has NO access to implementation reasoning** — only the output + requirements.
2. **Resolver sees BOTH original + review** — synthesizes, not patches.
3. **Max 2 loops.** Not clean after 2 cycles → flag user; may be a design problem review can't fix.
4. **Auto-trigger for critical code** — security, auth, crypto, data mutations, money, PII. Don't wait to be asked.
5. **Quality feedback** — repeated misses, critic overrides, post-humanmaxxing regressions feed [`_shared/quality-feedback-protocol.md`](references/_shared/quality-feedback-protocol.md), not just this report.
6. **Noise-filter before report-write.** Every finding passes [`noise-filter.md`](references/noise-filter.md): Layer 1 (real-vs-fake per `procedures/reviewer.md § Verification rules`) then Layer 2 (Accepted / Rejected / Deferred — three report subsections). Accepted clears fix-then-rerun before Verified.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Then:

- **Mode** (`references/_shared/mode-resolver.md`): default `standard`; auto-escalate to `deep` for auth/sessions/access-control/payments/financial-data/migrations/bulk-mutations/PII OR diff >500 lines; auto-downgrade to `fast` for typos/log lines/config tweaks.
- `references/_shared/execution-policy.md` — session execution profile (single-vs-multi)
- Read `docs/forsvn/artifacts/meta/specs/*.md` + `tasks.md` if present — enables scope-drift detection per [`procedures/scope-drift.md`](references/procedures/scope-drift.md).
- Read `docs/forsvn/artifacts/meta/records/learned-rules.md` — append to reviewer CONTEXT.

Mode map: `fast` = generalist, skip resolver if PASS; `standard` = generalist + resolver loop; `deep` = 3 specialists parallel OR critic-consensus (non-code).

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/meta/records/[YYYY-MM-DD]-fresh-eyes-<slug>.md` (dated, immutable per-run)
- **Lifecycle:** `snapshot` — accumulates, never overwritten
- **Frontmatter:** `skill`, `produced_by`, `version`, `date`, `status`, `mode`, `rounds`, `verdict` (PASS/FIXED/CRITICAL), `provenance`. Template: [`references/report-template.md`](references/report-template.md)
- **Sections:** Verdict · Issues Found · Input Quality · Scope Drift · Simplifications · Changes Made · Self-Regulation Gate · Reviewer Summary · Resolver Notes · Specialist Verdicts (deep) · Critic Disagreements (critic-consensus)
- **Consumed by:** operator audit; future fresh-eyes runs; commit/PR creation (PASS gate)
- **Eval workspace:** none — fresh-eyes IS the eval mechanism.

## Pre-Dispatch + Execution

- Pre-dispatch + Warm/Cold Start: `references/_shared/pre-dispatch-protocol.md`, `references/procedures/pre-dispatch.md`.
- Reviewer + resolver built per-use from [`procedures/reviewer.md`](references/procedures/reviewer.md), [`resolver.md`](references/procedures/resolver.md) — no static agents dir.
- 8-step loop (identify → spawn → evaluate → resolve → self-regulation gate → loop → report → deliver) + Configuration: [`procedures/execution.md`](references/procedures/execution.md).

## Auto-trigger rules

Run proactively for: security-sensitive code (auth, crypto, access control); data-mutation code (migrations, bulk updates, deletes); complex/uncertain implementations; money or PII.

Do NOT for: trivial changes (typos, config, log lines), "just do it quick" code, read-only ops.

## Anti-Patterns + Edge Cases

Read [`references/anti-patterns.md`](references/anti-patterns.md) before: stacking a critic on the reviewer (banned), giving reviewer implementation reasoning, skipping resolver, auto-applying past self-regulation gate, >2 loops, nit-padding. Edge cases (hallucinations, regressions, oversized code, agent failures, architecture reviews) live there too.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

- **DONE** — findings resolved or accepted; PASS gate met.
- **DONE_WITH_CONCERNS** — non-blocking issues flagged; report names deferred + why.
- **BLOCKED** — critical issue (security/data-loss/broken contract) OR self-regulation gate fired; resolver did NOT apply; operator judgment required.
- **NEEDS_CONTEXT** — requirements unclear; missing spec/intent/acceptance criteria.

## References

- [`playbook.md`](references/playbook.md), [`report-template.md`](references/report-template.md), [`noise-filter.md`](references/noise-filter.md), [`anti-patterns.md`](references/anti-patterns.md)
- `_shared/`: [`before-starting-check`](references/_shared/before-starting-check.md), [`mode-resolver`](references/_shared/mode-resolver.md), [`pre-dispatch-protocol`](references/_shared/pre-dispatch-protocol.md), [`quality-feedback-protocol`](references/_shared/quality-feedback-protocol.md)
- `procedures/`: [`reviewer`](references/procedures/reviewer.md), [`resolver`](references/procedures/resolver.md), [`review-setup`](references/procedures/review-setup.md), [`specialist-mode`](references/procedures/specialist-mode.md), [`critic-consensus`](references/procedures/critic-consensus.md), [`scope-drift`](references/procedures/scope-drift.md), [`pre-dispatch`](references/procedures/pre-dispatch.md), [`execution`](references/procedures/execution.md)
