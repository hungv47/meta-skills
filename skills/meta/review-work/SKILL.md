---
name: review-work
description: "Independent post-implementation review — an agent with no sunk-cost bias checks just-written code or an artifact against its requirements, then resolves the issues found (max 2 rounds). Use to verify a change before shipping, get a second opinion, or check what you missed; auto-triggers for security-sensitive and data-mutation code. Not for code refactoring (use clean-code) or decision analysis (use debate-agents)."
argument-hint: "[code or artifact to verify]"
allowed-tools: Read Grep Glob Bash
user-invocable: true
metadata:
  version: "1.2.0"
  budget: standard
  estimated-cost: "$0.15-0.50"
---

# Review Chain — Fresh-Eyes Post-Implementation Quality

Reviewer + resolver loop. Reviewer has no implementation context; resolver synthesizes. Capability metadata (route triggers, prerequisites, load map, artifact contract) lives in [`routing.yaml`](routing.yaml). Methodology, principles, and "no critic on critic" rationale: [`references/playbook.md`](references/playbook.md).

**Core question:** What would a senior reviewer with no sunk-cost bias catch?

## Critical Gates — load first

1. **Reviewer has NO access to implementation reasoning** — only the output and the requirements.
2. **Resolver sees BOTH original + review** — it synthesizes, not just patches.
3. **Max 2 loops.** If code isn't clean after 2 review cycles, flag to the user — there may be a design problem review can't fix.
4. **Auto-trigger for critical code** — security, auth, crypto, data mutations, money, PII. Don't wait to be asked.
5. **Quality feedback applies.** Repeated reviewer misses, critic overrides, and post-humanmaxxing regressions feed the shared quality system (`references/_shared/quality-feedback-protocol.md`), not just this report.
6. **Noise-filter before report-write.** Every reviewer finding passes through [`references/noise-filter.md`](references/noise-filter.md): Layer 1 (real-vs-fake per `procedures/reviewer.md § Verification rules`), then Layer 2 (Accepted / Rejected / Deferred). Report has those 3 subsections. Accepted findings clear the fix-then-rerun protocol before being marked Verified.

## Before Starting

Apply [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Then:

- **Mode resolution** ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)). Default `standard`. Auto-escalate to `deep` when code touches auth / sessions / access-control / payments / financial-data / migrations / bulk-mutations / PII OR diff exceeds 500 lines. Auto-downgrade to `fast` for typos / log lines / config tweaks.
- Read `.forsvn/artifacts/meta/specs/*.md` + `tasks.md` if present — enables scope-drift detection per `references/procedures/scope-drift.md`.
- Read `.forsvn/artifacts/meta/records/learned-rules.md` — rules to append to reviewer's CONTEXT.

Mode map: `fast` = generalist, skip resolver if PASS; `standard` = full generalist + resolver loop; `deep` = 3 specialists in parallel OR critic-consensus for non-code.

## Artifact Contract

- **Path:** `.forsvn/artifacts/meta/records/[YYYY-MM-DD]-fresh-eyes-<slug>.md` (dated, immutable per-run)
- **Lifecycle:** `snapshot` — accumulates; never overwritten
- **Frontmatter:** `skill`, `produced_by`, `version`, `date`, `status`, `mode`, `rounds`, `verdict` (PASS/FIXED/CRITICAL), `provenance`. Full template: [`references/report-template.md`](references/report-template.md)
- **Required sections:** Verdict · Issues Found (table) · Input Quality Assessment · Scope Drift (if any) · Simplifications · Changes Made · Self-Regulation Gate · Reviewer's Summary · Resolver's Notes · Specialist Verdicts (deep) · Critic Disagreements (critic-consensus)
- **Consumed by:** operator (audit trail); future fresh-eyes runs (was this raised before?); commit/PR creation (PASS gate)
- **Eval workspace:** none — fresh-eyes IS the eval mechanism for code/artifacts.

## Pre-Dispatch

Run [`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md). Needed dimensions: diff/branch reference, risk class (security / performance / correctness / all), prior reviewer feedback if any, requirements the work was supposed to implement.

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

**Cold Start** (no upstream session):

```
fresh-eyes runs an independent post-implementation review. Before I dispatch:

1. What to review — diff, branch, file paths, or paste.
2. Risk class — security / performance / correctness / consistency / all.
   Auto-trigger applies for security / auth / crypto / money / PII regardless.
3. Original intent — paste the spec or one-paragraph description of what this
   code is supposed to do. Without this, review only catches obvious bugs, not
   goal-fit problems.

Answer 1-3 in one response. I'll dispatch reviewer + resolver.
```

## Orchestration — dynamic agent spawning

Reviewer + resolver agents are constructed per-use from the templates in [`references/procedures/reviewer.md`](references/procedures/reviewer.md) and [`references/procedures/resolver.md`](references/procedures/resolver.md). No static `agents/` directory.

## Execution

### 1. Identify what to verify

Detect the target from git state first per [`references/procedures/review-setup.md`](references/procedures/review-setup.md) § Target detection. Don't assume `main...HEAD`.

What needs review: code just written (most common) · architecture/design decision (per `reviewer.md § Architecture variant`) · user-provided code · prior output ("double-check that").

Gather: artifact + original requirements + relevant context.

### 2. Spawn the reviewer (or specialists if deep)

Before dispatch: per `review-setup.md` § Closeout discipline, if the target is uncommitted work and a formatter is detected, offer to run it (operator-confirmed) so findings cite stable line numbers. Per § Concurrent test execution, start the test suite in the background as the reviewer is spawned; fold failures into the finding set.

- **Generalist** (fast / standard) — one reviewer per `procedures/reviewer.md`.
- **Specialist** (deep / `--thorough` / auto-escalated) — 3 in parallel per `procedures/specialist-mode.md` (security + performance + correctness). Merge findings; aggregate verdict (any CRITICAL → CRITICAL; any ISSUES_FOUND → ISSUES_FOUND; all PASS → PASS).
- **Critic consensus** (deep, non-code high-stakes — compliance copy / paid media / launches / canonical research) per `procedures/critic-consensus.md`.

### 3. Evaluate the review

- **PASS** — write dated report; "Verified by independent reviewer — no issues found"; include summary.
- **ISSUES_FOUND** — classify each finding: AUTO_FIX (confidence 9+ AND severity minor/nit) vs ASK (everything else, resolver fixes but flags for operator).
- **CRITICAL** — security vuln / data loss / wrong logic. Flag to user BEFORE resolving; they may want to change approach.

### 4. Spawn the resolver (if issues found)

Per [`references/procedures/resolver.md`](references/procedures/resolver.md). Resolver sees BOTH original code AND reviewer's full output. Returns FIXED/DECLINED per finding + COMPLETE corrected output.

### 5. Apply with self-regulation gate

Before applying resolver output, STOP if any:

- Resolver modified >30% of the original artifact — "may need a redesign rather than incremental fixes."
- Resolver addressed >10 findings in a single pass — regression risk too high.
- Resolver output introduces new issues that the reviewer didn't find in the original — "the resolver is making things worse."

Any trigger → surface to operator with the gate name; do NOT apply.

If gate passes + sanity-check (all critical/major addressed, nothing original got right is broken, DECLINED decisions reasonable) → apply to disk.

### 6. Loop (for critical or complex code)

Max 2 loops. Round 2 review runs only when an Accepted fix changed code in a way that could introduce a new defect — not for mechanical fixes (unused import, typo) and never to re-polish wording. Fix-then-rerun checks (tests / type-check / build per Accepted finding) are separate and always run. Stop when final review + tests are both clean. Full discipline in `review-setup.md § Closeout discipline`.

### 7. Write the report

Per [`references/report-template.md`](references/report-template.md). Path: `.forsvn/artifacts/meta/records/[YYYY-MM-DD]-fresh-eyes-<slug>.md` — dated, immutable, never overwritten.

### 8. Deliver

**Verdict** (PASS / FIXED / CRITICAL) · **issue count** (X found, Y fixed, Z declined) · **key fix** (most important catch) · **path to report**.

## Auto-trigger rules

Run fresh-eyes proactively (without the user asking) when:

- Writing security-sensitive code (auth, crypto, access control).
- Writing data-mutation code (migrations, bulk updates, deletes).
- Implementation was complex or felt uncertain.
- Code handles money or PII.

Do NOT auto-trigger for trivial changes (typos, config tweaks, log lines), code the user said "just do it quick", or read-only operations.

## Configuration

| Parameter | Default | Description |
|---|---|---|
| model | sonnet | Reviewer + resolver model |
| max_loops | 1 | Auto-set to 2 for critical/complex code |
| severity_threshold | minor | Minimum severity to fix (minor / major / critical) |
| auto_apply | true | Apply fixes automatically or show diff first |
| thorough | false | Force specialist dispatch (auto-escalates regardless) |

Override examples: "review this with opus" / "do 2 rounds of verification" / "review this thoroughly".

## Anti-Patterns + Edge Cases

Read [`references/anti-patterns.md`](references/anti-patterns.md) before any of: adding a critic on top of the reviewer (banned — fresh-eyes IS the critic), giving reviewer implementation reasoning, skipping the resolver when issues found, auto-applying without the self-regulation gate, running >2 loops, padding the report with nits. Edge cases (reviewer hallucinations, resolver regressions, code too large, agent failures, architecture-not-code reviews) live in the same file.

## Completion Status

- **DONE** — all reviewer findings resolved or explicitly accepted; PASS gate met.
- **DONE_WITH_CONCERNS** — non-blocking issues flagged for follow-up; report names what was deferred and why.
- **BLOCKED** — critical issue (security / data-loss / broken contract) OR self-regulation gate triggered. Resolver did NOT apply; operator judgment required.
- **NEEDS_CONTEXT** — review requirements unclear; missing spec, intent, or acceptance criteria.

## References

- [`references/playbook.md`](references/playbook.md) — why this skill, methodology, "no critic on critic" rationale, when NOT to use
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md), [`mode-resolver.md`](references/_shared/mode-resolver.md), [`pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md), [`quality-feedback-protocol.md`](references/_shared/quality-feedback-protocol.md)
- [`references/procedures/reviewer.md`](references/procedures/reviewer.md), [`resolver.md`](references/procedures/resolver.md), [`review-setup.md`](references/procedures/review-setup.md), [`specialist-mode.md`](references/procedures/specialist-mode.md), [`critic-consensus.md`](references/procedures/critic-consensus.md), [`scope-drift.md`](references/procedures/scope-drift.md)
- [`references/report-template.md`](references/report-template.md), [`noise-filter.md`](references/noise-filter.md), [`anti-patterns.md`](references/anti-patterns.md)
