---
title: Fresh-Eyes — Anti-Patterns + Edge Cases
lifecycle: canonical
status: stable
produced_by: fresh-eyes
load_class: ANTI-PATTERN
---

# Anti-Patterns + Edge Cases

**Load when:** the orchestrator is about to construct a reviewer prompt that smells off, OR the resolver output looks suspicious before apply, OR an edge case fires (large code, agent failure, hallucinated finding). Re-read at any moment of doubt.

---

## Orchestration anti-patterns

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Adding a critic on top of the reviewer | fresh-eyes IS a critic by design; layering a second critic is theater (you'd be reviewing the reviewer's review of the implementation) | The reviewer-resolver loop IS the critique mechanism. Bound at max 2 rounds. If 2 rounds don't yield clean code, escalate to operator — that's a deeper-design problem critic-stacking can't fix. |
| Running fresh-eyes on a fresh-eyes report | Recursion. Reviewing a review is reviewing-the-reviewer, which is meta-theater. | Re-read the report directly. The operator's judgment is the tiebreaker on review quality, not another agent. |
| Giving the reviewer access to implementation reasoning | Defeats the entire point. Reviewer with bias = the original implementer. | Reviewer sees ONLY output + requirements + context. Never the chain-of-thought that produced the output. |
| Skipping the resolver when issues found | Reviewer's findings need synthesis (not just patches) — resolver sees BOTH original AND review. | If ISSUES_FOUND, run the resolver. If PASS, skip — but ISSUES_FOUND with no resolver is wrong. |
| Auto-applying without the self-regulation gate | Resolver-introduced regressions can ship silently | Check >30% modified, >10 findings, regression triggers BEFORE applying. If any trigger fires, surface to operator instead. |
| Running >2 loops | If 2 rounds don't converge, the design is the problem — review can't fix it | Stop at max 2 loops. Surface to operator with status DONE_WITH_CONCERNS or BLOCKED. |
| Rerunning a clean review to polish wording | Reruns verify fixes, not prose — a clean report that just gets reworded burns budget and adds zero signal | Rerun the review only when an Accepted fix changed code (`procedures/review-setup.md` § Closeout discipline). A clean report ships as written. |
| Padding the report with nits to look thorough | Suppresses signal under noise; trains operator to ignore future reports | Reviewer prompt enforces "suppress findings <5/10 confidence." Honor it. |

## Reviewer anti-patterns (the reviewer should avoid these — the prompt enforces them)

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Performative agreement / hedging in findings | "While this approach has merit, you might consider..." is sycophancy disguised as review | Direct: "POSITION: this is wrong because X. FIX: <show the corrected code>" |
| Suggesting fixes the codebase already has | Wastes resolver time, signals the reviewer didn't verify | Run the signal-vs-noise check: "is this already handled elsewhere?" Suppress if yes. |
| Inventing problems that don't exist | "Better safe than sorry" findings train operators to dismiss real ones | Don't invent. If the code is clean, say PASS. |
| Reporting cosmetic theoreticals as MAJOR | Severity inflation collapses the signal scale | Severity is calibrated to runtime impact. Cosmetic-only findings are NIT at best, often suppressed. |
| Pattern-matching without verification → CONFIDENCE 8+ | The whole point of confidence is calibration | If you can't cite a line, test, or proof, confidence is 5-7 max. |
| Free-form prose response | Can't be triaged by the orchestrator | Structured output: SEVERITY + CONFIDENCE + LOCATION + PROBLEM + FIX per finding. |

## Resolver anti-patterns

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Returning a diff instead of complete code | Forces orchestrator to do a careful 3-way merge; invites partial-fix thinking | Return COMPLETE corrected code/output. The full thing. |
| DECLINING a real finding because the fix is hard | Punts the bug to production | DECLINED is reserved for wrong-on-the-merits findings, not inconvenient ones. If critical/major is real, fix it. |
| Introducing new features while fixing reported issues | Scope creep — review didn't ask for them | "Do NOT introduce new features or refactor beyond what the review requested." Stay in scope. |
| Silently re-architecting | Resolver should patch, not redesign | If >30% of the artifact changed, the self-regulation gate halts apply. Surface to operator. |

## Specialist-mode anti-patterns

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Specialist consensus filtering | Each specialist is authoritative in their lane; intersecting findings loses signal | Merge unique findings, don't filter by "did 2 of 3 agree." |
| Using specialist mode for pure architecture review | Specialist focus areas (auth bypass, N+1 queries, race conditions) don't map to design docs | Use the generalist reviewer's architecture variant. |
| Skipping auto-escalation for "small auth change" | A 30-line auth change can still ship a bypass | Auto-escalation triggers fire regardless of diff size when the surface is auth/payments/data-mutations/PII. |

## Critic-consensus anti-patterns

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Averaging disagreement scores | 7/10 + 3/10 → mean 5/10 hides "violently disagreed" | Surface BOTH scores. The disagreement IS the signal. |
| Forcing tiebreaker on hard gates | Compliance / substantiation / policy aren't averageable | Resolve directly (fetch the source, run the policy check) OR return DONE_WITH_CONCERNS / BLOCKED. |
| Running consensus mode on code | Code has the 3-specialist mode for richer signal | Critic-consensus is for non-code (compliance copy, paid media, launches). |

## Scope-drift anti-patterns

| Anti-Pattern | Problem | INSTEAD |
|---|---|---|
| Auto-blocking on MISSING or UNPLANNED | Operator may have legitimate reasons (descope mid-build, follow-up PR, intentional cross-cutting cleanup) | Scope drift is INFORMATIONAL. Surface in dedicated section; operator decides. |
| Escalating UNPLANNED to MAJOR severity | Severity is for code-quality impact, not scope shape | UNPLANNED stays in scope-drift section. If the unplanned change ALSO has a code-quality problem, that gets its own MAJOR finding separately. |

## Edge cases (operational, not anti-patterns)

| Edge Case | Handling |
|---|---|
| Reviewer finds no issues | PASS. Don't force a resolve step. Write the report anyway — PASS is also audit trail. |
| Reviewer hallucinates issues | Resolver catches via DECLINED. If both agents agree on a non-issue, orchestrator's sanity check catches it. |
| Resolver introduces new bugs | Round 2 catches (for critical/complex code where max_loops=2). For non-critical, surface to operator at sanity check. |
| Reviewer and resolver disagree | Orchestrator breaks the tie. If the orchestrator can't decide, escalate to operator. |
| Code too large (>2000 lines) | Split into logical chunks; review each separately. Don't send 2000 lines in one prompt. |
| Existing reports at same date | Each run writes a NEW dated, slug-suffixed file. Never overwrite — reports are immutable audit trail. |
| Reviewer or resolver agent fails | Retry once with the same prompt. If it fails again, fall back to orchestrator's own review (single-agent mode). Note the failure in the report. |
| Architecture/design review (not code) | Adjust reviewer prompt — replace "code" with "design" / "architecture". The 5 review categories still apply. |
