---
name: review-work
description: "Independent post-implementation review — an agent with no sunk-cost bias checks just-written code or an artifact against its requirements, then resolves the issues found (max 2 rounds). Use to verify a change before shipping, get a second opinion, or check what you missed; auto-triggers for security-sensitive and data-mutation code. Not for code refactoring (use clean-code) or decision analysis (use debate-agents)."
argument-hint: "[code or artifact to verify]"
allowed-tools: Read Grep Glob Bash
user-invocable: true
metadata:
  version: "1.1.0"
  budget: standard
  estimated-cost: "$0.15-0.50"
---

# Review Chain — Fresh-Eyes Post-Implementation Quality

*Meta — Dynamic Multi-Agent. Reviewer-resolver loop with auto-trigger for security/auth/data-mutation/money/PII code.*

**Core Question:** "What would a senior reviewer with no sunk-cost bias catch?"

[Read `references/playbook.md` [PLAYBOOK] to understand methodology (reviewer-with-no-context / resolver-with-both), principles, why-no-critic-on-critic, when NOT to use.]

## Critical Gates — Read First

1. **Reviewer has NO access to implementation reasoning** — only the output and the requirements. This is intentional: fresh eyes, no bias.
2. **Resolver sees BOTH original + review** — it synthesizes, not just patches.
3. **Max 2 loops** — if code isn't clean after 2 review cycles, flag to the user. There may be a deeper design problem that review can't fix.
4. **Auto-trigger for critical code** — security, auth, crypto, data mutations, money, PII. Don't wait to be asked.
5. **Quality feedback applies** — repeated reviewer misses, critic overrides, and post-humanmaxxing regressions feed the shared quality system instead of staying trapped in one report.
6. **Noise-filter pass before report-write.** Every reviewer finding goes through the two-layer filter from [`references/noise-filter.md`](references/noise-filter.md): Layer 1 (real-vs-fake per `procedures/reviewer.md § Verification rules`), then Layer 2 (actionable-vs-not — Accepted / Rejected / Deferred categories). The final report has 3 subsections matching the categories. Brief 06 § Review Workflow calls this "the highest-leverage part" — without it, reviewers either drown the operator in nits or silently drop real findings. Accepted findings MUST clear the fix-then-rerun protocol (`noise-filter.md § Fix-then-rerun protocol`) before being marked Verified.

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode resolution** — load [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]. `budget: standard` is default. **Auto-escalate to deep** (specialist dispatch per [`references/procedures/specialist-mode.md`](references/procedures/specialist-mode.md) [PROCEDURE]) when code touches auth/sessions/access-control/payments/financial-data/migrations/bulk-mutations/PII OR diff exceeds 500 lines. **Auto-downgrade to fast** when reviewing trivial changes (typos, log lines, config tweaks). Mode map: `fast` = generalist reviewer, skip resolver if PASS; `standard` = full generalist reviewer + resolver loop; `deep` = 3 specialists in parallel OR critic-consensus for non-code. Emit:
   ```
   Resolved mode: <fast|standard|deep> (<reason>). Run as <mode>? [Y / fast / standard / deep]
   ```
1. Read `implementation-roadmap/canonical-paths.md` if present — verify output path matches inventory.
2. Read `.forsvn/artifacts/meta/specs/*.md` + `tasks.md` if they exist — enables scope-drift detection per [`references/procedures/scope-drift.md`](references/procedures/scope-drift.md) [PROCEDURE].
3. Read `.forsvn/artifacts/meta/records/learned-rules.md` for rules to append to reviewer's CONTEXT.

## Artifact Contract

- **Path:** `.forsvn/artifacts/meta/records/[YYYY-MM-DD]-fresh-eyes-<slug>.md` (dated, slug-suffixed, immutable per-run)
- **Lifecycle:** `snapshot` (audit trail; accumulates; never overwritten)
- **Frontmatter fields:** `skill`, `produced_by`, `version`, `date`, `status`, `mode` (generalist/specialist/critic-consensus), `rounds`, `verdict` (PASS/FIXED/CRITICAL), `provenance` (skill + run_date + input_artifacts + config_sources + null output_eval). Full template: [`references/report-template.md`](references/report-template.md) [PROCEDURE].
- **Required sections:** Verdict, Issues Found (table), Input Quality Assessment, Scope Drift (if applicable), Simplifications, Changes Made, Self-Regulation Gate, Reviewer's Summary, Resolver's Notes, Specialist Verdicts (if mode=specialist), Critic Disagreements (if mode=critic-consensus)
- **Consumed by:** operator (the report IS the audit trail); future fresh-eyes runs (precedent — was this issue raised before?); commit/PR creation (PASS gate hands off to `gh pr create` etc.).
- **Eval workspace:** none — fresh-eyes IS the eval mechanism for code/artifacts; no downstream eval skill.

## Pre-Dispatch

Run the Pre-Dispatch protocol ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) [PROCEDURE]) before spawning reviewer/resolver agents.

**Needed dimensions:** diff/branch reference (what to review), risk class (security / performance / correctness / all), prior reviewer feedback if any, requirements or spec the work was supposed to implement.

**Warm Start** (invoked at end of build session, spec known):

```
Git state:
! `git status --short 2>/dev/null | head -10 | grep . || echo "(working tree clean)"`

Branch / recent commits:
! `{ git branch --show-current; git log --oneline -5; } 2>/dev/null | grep . || echo "(no git history)"`

Target auto-detected per review-setup.md § Target detection (working-tree vs branch-vs-base vs last-commit) — confirm or adjust below.
Reviewing against [spec.md / tasks.md / inline requirements].
Risk class: [auto-detected: security touched, money/PII flag, etc.] — adjust?
```

Shell-bang interpolation per `CLAUDE.md` §"Inline shell interpolation" — fires at slash-command invocation; stays in body (would not fire from a ref).

**Cold Start** (no upstream session, user invoking standalone):

```
fresh-eyes runs an independent post-implementation review. Before I dispatch:

1. **What to review** — diff, branch name, file paths, or paste of the artifact.
2. **Risk class** — security / performance / correctness / consistency / all.
   Auto-trigger applies for security, auth, crypto, money, PII regardless.
3. **Original intent** — paste the spec, requirements, or one-paragraph
   description of what this code is supposed to do. Without this, the review
   only catches obvious bugs, not goal-fit problems.

Answer 1-3 in one response. I'll dispatch reviewer + resolver.
```

**Write-back:** none. Reports are dated snapshot files; never persisted to experience/.

## Orchestration Pattern: Dynamic Agent Spawning

Runtime-defined agents (reviewer, resolver), NOT static agent roster. Agent prompts constructed per-use from the templates in [`references/procedures/reviewer.md`](references/procedures/reviewer.md) [PROCEDURE] + [`references/procedures/resolver.md`](references/procedures/resolver.md) [PROCEDURE]. No `agents/` directory.

## Execution

### 1. Identify what to verify

**Detect the target from git state first** — run [`references/procedures/review-setup.md`](references/procedures/review-setup.md) [PROCEDURE] § Target detection: classify working-tree changes vs branch-vs-base vs last-commit, then confirm with the operator. Don't assume `main...HEAD`.

What needs review:
- **Code just written** — most common case. You just implemented something, verify it.
- **Architecture/design decision** — verify a plan before implementing (per [`reviewer.md`](references/procedures/reviewer.md) §"Architecture/design-review variant").
- **User-provided code** — user asks you to review their code.
- **Any prior output** — user says "double-check that" or "verify this".

Gather: the artifact itself + original requirements + relevant context (surrounding files, API contracts, tests).

### 2. Spawn the Reviewer (or Specialists if deep mode)

**Launch tests concurrently** — per [`references/procedures/review-setup.md`](references/procedures/review-setup.md) § Concurrent test execution: detect the project's test command and start it in the background as the reviewer is spawned, so the suite runs in parallel with the review. Fold any failures into the finding set when the reviewer returns.

- **Generalist (fast/standard):** spawn one reviewer per [`references/procedures/reviewer.md`](references/procedures/reviewer.md) [PROCEDURE]. Prompt template + pre-construction reads (learned-rules, quality-feedback-protocol, shared-critic-rubrics) live in the ref.
- **Specialist (deep, --thorough, or auto-escalated):** spawn 3 specialists in parallel per [`references/procedures/specialist-mode.md`](references/procedures/specialist-mode.md) [PROCEDURE] — security + performance + correctness. Merge findings; aggregate verdict (any CRITICAL → CRITICAL; any ISSUES_FOUND → ISSUES_FOUND; all PASS → PASS).
- **Critic consensus (deep, non-code high-stakes):** for compliance copy / paid media / launches / canonical research, use [`references/procedures/critic-consensus.md`](references/procedures/critic-consensus.md) [PROCEDURE] — 2 critics on highest-risk dimensions, merge agreement + disagreements.

### 3. Evaluate the review

Read the reviewer's output. Three paths:

- **Path A: PASS** — no issues. Done. Write the dated report; report to user "Verified by independent reviewer — no issues found"; include reviewer's summary.
- **Path B: ISSUES_FOUND** — non-critical. Classify each finding:
  - **AUTO_FIX**: confidence 9+ AND severity minor/nit → resolver applies without asking
  - **ASK**: everything else → resolver fixes but flags for operator judgment
- **Path C: CRITICAL** — security vulnerability, data loss, completely wrong logic. **Flag immediately to user before resolving** — they may want to change approach entirely.

### 4. Spawn the Resolver (if issues found)

Per [`references/procedures/resolver.md`](references/procedures/resolver.md) [PROCEDURE]. Resolver sees BOTH original code AND reviewer's full output. Returns FIXED/DECLINED per finding + COMPLETE corrected output.

### 5. Apply the resolution (with self-regulation gate)

**Self-regulation gate** — before applying resolver output, check:

- **Resolver modified >30% of the original artifact** → STOP. "This artifact may need a redesign rather than incremental fixes."
- **Resolver addressed >10 findings in a single pass** → STOP. Too many changes at once increases regression risk.
- **Resolver's output introduces new issues that the reviewer didn't find in the original (regression)** → STOP. "The resolver is making things worse."

Any trigger → do NOT apply; surface to operator with the gate name. This bounds the loop from grinding indefinitely on a fundamentally-broken artifact.

If gate passes + sanity-check (resolver addressed all critical/major, didn't break anything original got right, DECLINED decisions reasonable) → apply to disk.

### 6. Optional: Loop (for critical or complex code)

For high-stakes code (auth, payments, data migrations), run a second verification loop on the resolver's output. **Max loops: 2.** If code isn't clean after 2 review cycles, stop and flag to user.

```
Round 1: Implement → Review → Resolve → Apply
Round 2 (only if critical/complex): Resolved output → Review → Resolve → Apply (if clean)
```

### 7. Write the report

Per [`references/report-template.md`](references/report-template.md) [PROCEDURE]. Path: `.forsvn/artifacts/meta/records/[YYYY-MM-DD]-fresh-eyes-<slug>.md` — dated, immutable, never overwritten.

### 8. Deliver results

Present to user: **Verdict** (PASS/FIXED/CRITICAL), **issue count** (X found, Y fixed, Z declined), **key fix** (most important catch), **file path to report**.

## When to Trigger Automatically

Use fresh-eyes proactively (without the user asking) when:
- Writing security-sensitive code (auth, crypto, access control)
- Writing data-mutation code (migrations, bulk updates, deletes)
- The implementation was complex or you felt uncertain
- The code handles money or PII

Do NOT auto-trigger for:
- Trivial changes (typos, config tweaks, adding a log line)
- Code the user explicitly said "just do it quick"
- Read-only operations

## Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| model | sonnet | Model for reviewer and resolver |
| max_loops | 1 | Review cycles (auto-set to 2 for critical/complex code per Step 6) |
| severity_threshold | minor | Minimum severity to fix (minor / major / critical) |
| auto_apply | true | Apply fixes automatically or show diff first |
| thorough | false | Force specialist dispatch (auto-escalates regardless) |

Override examples: "review this with opus" / "do 2 rounds of verification" / "review this thoroughly".

## Cost Considerations

- 1 round (reviewer + resolver) with sonnet: ~$0.10-0.20
- 1 round with opus: ~$0.50-1.00
- 2 rounds doubles the cost
- Specialist dispatch (3 parallel): 3× single-reviewer cost (~$0.30-0.50)
- Critic consensus: 2× (~$0.20-0.40)
- Cheap relative to catching a production bug — default to 1 round for non-trivial code.

## Anti-Patterns + Edge Cases

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any of: adding a critic on top of the reviewer (banned — fresh-eyes IS the critic), giving reviewer implementation reasoning, skipping the resolver when issues found, auto-applying without self-regulation gate, running >2 loops, padding the report with nits. Edge cases (reviewer hallucinations, resolver regressions, code too large, agent failures, architecture-not-code reviews) all live in the same ref.

## Completion Status

Every run ends with explicit status:
- **DONE** — all reviewer findings resolved or explicitly marked acceptable; PASS gate met.
- **DONE_WITH_CONCERNS** — non-blocking issues flagged for follow-up; report names what was deferred and why (scope drift, declined findings worth a second look, critic disagreements not fully resolved).
- **BLOCKED** — critical issue (security, data-loss, broken contract) OR self-regulation gate triggered. Resolver did NOT apply; operator judgment required.
- **NEEDS_CONTEXT** — review requirements unclear; missing spec, intent, or acceptance criteria the implementation should be checked against.

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why this skill, methodology, principles, "no critic on critic" rationale, when NOT to use
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern (synced from references/)
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — fast/standard/deep semantics for this skill
- [`references/procedures/reviewer.md`](references/procedures/reviewer.md) [PROCEDURE] — full reviewer agent prompt template + confidence rules + signal-vs-noise verification
- [`references/procedures/resolver.md`](references/procedures/resolver.md) [PROCEDURE] — full resolver agent prompt template + FIXED/DECLINED structure
- [`references/procedures/review-setup.md`](references/procedures/review-setup.md) [PROCEDURE] — target detection from git state + concurrent test execution (pre-review setup)
- [`references/procedures/specialist-mode.md`](references/procedures/specialist-mode.md) [PROCEDURE] — 3-specialist parallel dispatch + auto-escalation triggers
- [`references/procedures/critic-consensus.md`](references/procedures/critic-consensus.md) [PROCEDURE] — high-stakes non-code (compliance copy, paid media, launches)
- [`references/procedures/scope-drift.md`](references/procedures/scope-drift.md) [PROCEDURE] — MISSING + UNPLANNED detection when tasks.md or spec.md exists
- [`references/report-template.md`](references/report-template.md) [PROCEDURE] — output template + slug convention + status semantics
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — orchestration + reviewer + resolver + specialist + critic-consensus + scope-drift anti-patterns + edge cases
- [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md) [PROCEDURE] — canonical Pre-Dispatch contract
- [`references/_shared/quality-feedback-protocol.md`](references/_shared/quality-feedback-protocol.md) — when to log critic overrides / repeated disagreements / post-humanize regressions
- `agent-skills/CLAUDE.md` §"Artifact Placement" — lifecycle taxonomy (umbrella dependency; not shipped under `npx skills add` standalone install; the `snapshot` lifecycle this skill emits is fully documented inline in the Artifact Contract block above)
