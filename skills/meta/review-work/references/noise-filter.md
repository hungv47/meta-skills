---
title: Noise Filter — actionable-only finding triage for review-work
lifecycle: canonical
status: stable
produced_by: review-work
provenance:
  extracted_from: implementation-roadmap/execution-evaluation/brief-pack/06-operator-quality-integrations.md § Review Workflow + sources/IDEA-3.md § Review noise filtering
  extracted_at: 2026-05-19
consumers: review-work SKILL.md + procedures/reviewer.md + references/report-template.md
load_class: PROCEDURE
---

# Noise Filter — Actionable-Only Triage

**The second filter on top of signal-vs-noise verification. After `procedures/reviewer.md § Verification rules` sorts real-vs-fake, this filter sorts actionable-vs-not. Three-category output: Accepted / Rejected / Deferred. The point is to surface decisions the operator can act on, not to drown them in chatter.**

> Why this exists: brief 06 § Review Workflow names noise filtering "the highest-leverage part" of the review closeout. Without it, reviewers either (a) report every nit and train the operator to skim, or (b) suppress findings they should have surfaced. The 3-category model gives operators a scan-friendly report where Accepted = "fix is done, here's what changed," Rejected = "I considered this and discarded as not real / not worth surfacing," Deferred = "real issue, but not for this pass — log a follow-up."

---

## Two-layer model

```
Reviewer surfaces a candidate finding.
   │
   ▼
Layer 1: real-vs-fake (procedures/reviewer.md § Verification rules)
   │   ─ Already handled elsewhere? → drop (fake)
   │   ─ Already implemented under another name/location? → drop (fake)
   │   ─ Code path equivalent to current? → drop (fake)
   │   ─ Otherwise → real, pass to Layer 2
   ▼
Layer 2: actionable-vs-not (THIS FILE)
   │   ─ Real + worth fixing in THIS pass → Accepted
   │   ─ Real + worth fixing but OUT OF SCOPE for THIS pass → Deferred
   │   ─ Real but actually not worth a fix (preference / opinion / out-of-budget) → Rejected
   ▼
Reviewer report carries 3 sections: Accepted (fixed) / Rejected (filtered) / Deferred (follow-up).
```

Layer 1 + Layer 2 are sequential. A finding only reaches Layer 2 if it survives Layer 1. Findings rejected at Layer 1 do NOT appear in the report (they were never real — surfacing them is the noise brief 06 warns against). Findings at Layer 2 ALL appear in the report, sorted into the 3 categories.

---

## Finding state taxonomy

Every finding the reviewer surfaces ends in **exactly one** of four terminal states. The two-layer model decides *which*; this table is the canonical vocabulary for it — use these tokens in finding records, the report, and `quality-feedback-protocol` logs.

| State | Layer | Meaning | In the report? |
|-------|-------|---------|----------------|
| `rejected_not_real` | Layer 1 | Already handled / equivalent to current code / hallucinated. Never was a real defect. | No — dropped pre-report. |
| `accepted_fixed` | Layer 2 | Real, in-scope this pass, fixed, and cleared `§ Fix-then-rerun protocol`. | Yes — **Accepted (fixed)**. |
| `accepted_deferred` | Layer 2 | Real and actionable, but out-of-scope this pass (or an Accepted fix was rolled back); follow-up logged. | Yes — **Deferred**. |
| `rejected_not_worth_it` | Layer 2 | Real-or-borderline but not worth a fix: pure preference, fix cost disproportionate to value, or <5/10 reviewer confidence. | Yes — **Rejected (filtered as noise)**, one line each. |

Rules:

- **Exactly one state per finding.** A "half-actionable" finding is *split* into two findings, each with its own state (see Borderline cases) — never one finding carrying two states.
- `rejected_not_real` is the only state that does not reach the report. The other three all appear, in their named subsection.
- An `accepted_fixed` finding whose fix fails its rerun is **re-stated** as `accepted_deferred` ("Attempted, Rolled Back") — it never silently stays `accepted_fixed`.
- The three report subsections map 1:1: `accepted_fixed` → Accepted, `accepted_deferred` → Deferred, `rejected_not_worth_it` → Rejected.

---

## Category definitions

### Accepted — `accepted_fixed`

**Real, actionable, in-scope for THIS review pass.** The resolver will fix it; the report shows what changed.

Examples:
- Security review on auth code surfaces a SQL injection in the auth handler → Accepted.
- Bug-fix review surfaces a missing null-check on the fix's call path → Accepted (in-scope to the fix).
- Performance review surfaces a hot-path O(n²) loop → Accepted (in-scope to the perf brief).

Acceptance criteria (all must hold):
1. Finding survived Layer 1 (real, not already handled).
2. Finding is materially related to the review's stated scope (security review = security findings; perf review = perf findings; general closeout = anything in the diff).
3. Fix cost is proportional to fix value. A 4-hour fix on a 1-line lint nit is not proportional; it's a Reject.
4. Fix can land in this commit without expanding the review pass into a redesign.

### Rejected (filtered as noise) — `rejected_not_worth_it`

**Real OR borderline, but not worth surfacing or fixing.** Suppressed from the report's primary narrative, but optionally listed in the Rejected subsection with a one-line suppression reason so the operator can verify the reviewer's judgment.

Examples:
- Style preference disagreements where the existing code follows project conventions → Rejected.
- "This function could be split into 3 smaller functions" when the function is 20 lines and the project doesn't have a length convention → Rejected.
- "Variable name could be more descriptive" when the existing name is unambiguous in context → Rejected.
- A finding the reviewer is <5/10 confident about (per the reviewer's existing confidence rule) → Rejected.

Rejection criteria (any one suffices):
1. Confidence <5/10 (reuse the existing reviewer confidence floor).
2. Pure preference / opinion with no falsifiable cost.
3. Fix cost wildly disproportionate to fix value.
4. Already addressed in a separate convention elsewhere in the codebase.

**Rejected findings ARE listed in the report's Rejected subsection** — brief, one-line each with the suppression reason. This lets the operator audit the reviewer's judgment without padding the main narrative.

### Deferred — `accepted_deferred`

**Real, actionable, but OUT OF SCOPE for THIS review pass.** Surfaced for operator awareness; not fixed now; should produce a follow-up task or issue.

Examples:
- Security review on auth code notices that documentation is stale on an UNRELATED module → Deferred (real, but unrelated to auth security).
- Bug-fix review notices a refactoring opportunity that would touch 12 unrelated files → Deferred (real, but exceeds the bug-fix scope).
- Performance review surfaces a UX issue that's also worth fixing → Deferred (real, but a different review pass).

Deferral criteria (all must hold):
1. Finding is real and actionable (would pass Accepted criteria 1-2-3).
2. Fix would expand THIS pass's scope materially (criterion 4 of Accepted fails).
3. There's a credible follow-up path (separate review pass, separate ticket, future refactor sprint).

Deferred findings appear in the report's Deferred subsection with a one-line rationale and a follow-up pointer.

---

## Borderline cases

### "Half-actionable" findings

Sometimes a finding is partially in-scope. Example: security review finds a SQL injection (in scope = Accept) plus the same handler has a documentation gap (out of scope = Defer).

**Resolution:** Split the finding into separate entries. Accept the security part; Defer the doc part. Never accept-or-defer the whole bundle — that creates either scope creep (full accept) or silent loss (full defer).

### Repeated patterns

If the same finding appears 5 times across a diff (e.g., 5 instances of the same null-check oversight), the reviewer should:
1. Accept ONE instance with a representative example.
2. Note in the Accepted entry: "This pattern appears 5x in the diff; resolver should apply the fix to all instances."
3. Do NOT create 5 separate Accepted entries — that's the padding brief 06 warns against.

### Findings against the reviewer's own confidence floor

Findings the reviewer flagged with <5/10 confidence are Rejected by default per the existing reviewer rule. If the operator wants to see suppressed-low-confidence findings, they can run review-work with `--show-low-confidence` and the report includes them in the Rejected subsection with the confidence score visible.

---

## Fix-then-rerun protocol (Accepted only)

For every Accepted finding, the loop is:

```
1. Reviewer flags the finding → Accepted category.
2. Resolver implements the fix (per existing resolver agent procedures/resolver.md).
3. Rerun the relevant checks for this finding:
   - Code change → relevant test suite + type-check + build
   - Doc change → linter / Markdown validator
   - Config change → schema validator + dependent-service smoke test
4. If reruns pass → mark Accepted entry as "Fixed + Verified" with the rerun commands run.
5. If reruns FAIL → the fix introduced a regression. Two options:
   a. Roll back the fix; mark the Accepted entry as "Attempted, Rolled Back" with rationale; downgrade to Deferred (`accepted_deferred`) for follow-up.
   b. Operator decides to ship the regression knowingly (rare); critic override log per scripts/log-critic-override.ts captures the decision.
```

The fix-then-rerun loop is NOT optional for Accepted findings. The whole point of review-work is "fix is verified by the rerun, not by the reviewer's intuition that the fix works." Brief 06 § Review Workflow: "fix accepted findings, rerun relevant checks."

---

## Severity rubric + quantitative verdict gate

Every finding that reaches the report carries a **severity** — the `[Severity]` token in the report template. Severity is assigned from observable impact, not reviewer mood, so two independent reviewers converge on the same verdict.

| Severity | Criteria (any one) | Verdict weight |
|---|---|---|
| **Blocker** | Exploitable security hole, data loss/corruption, money/PII exposure, broken public contract, or a failing acceptance criterion. | auto-fail |
| **Major** | Wrong behavior on a supported path, missing error handling on an I/O / auth boundary, or a regression no test catches. | counts toward the unresolved-Major gate |
| **Minor** | Correct but fragile: narrow edge case, weak assertion, missing non-critical guard. | advisory |
| **Nit** | Style / preference with no falsifiable cost. | suppress to Rejected unless trivially free |

**Quantitative verdict gate** — compute the verdict from severity counts *after* the fix-then-rerun loop, not from prose impression:

- **PASS** requires **0** unresolved Blockers AND **0** unresolved Majors AND reviewer confidence **≥ 5/10** on every Accepted finding.
- **FIXED** = started with **≥ 1** Accepted Blocker/Major, all now cleared their rerun (`accepted_fixed`, verified).
- **CRITICAL** (auto-fail the PASS gate) = **≥ 1** unresolved Blocker, OR a Blocker fix failed its rerun, OR the self-regulation gate fired. CRITICAL never downgrades to PASS without a logged critic override, and an override never converts a Blocker to resolved.

**Noise gate** (auto-fail the *report*, not the code): if a pass surfaces **≥ 5** findings and **0** are Blocker/Major, the report is nit-padded — collapse the Nits to one Rejected line and re-state the verdict. A wall of nits with no substantive finding is itself a review failure (anti-pattern 2).

**Pre-verdict checklist** — run before writing the verdict block:

- [ ] Every Accepted / Deferred finding carries an explicit severity from the table above.
- [ ] Blocker count and unresolved-Major count computed; the verdict matches the gate above.
- [ ] Every Accepted Blocker/Major shows a passed rerun (`Fixed + Verified`), or is re-stated as Deferred.
- [ ] Findings below the 5/10 confidence floor moved to Rejected, not Accepted.
- [ ] If ≥ 5 findings and 0 Blocker/Major, the noise gate was applied.

---

## Report convention

The final report (`references/report-template.md` body template) carries 3 subsections under "Issues Found":

```markdown
## Issues Found

### Accepted (fixed)

For each: [Severity] **[Title]** — [one-paragraph problem] — **Fix:** [one-paragraph fix] — **Verified:** [rerun commands] ✓

### Rejected (filtered as noise)

Brief, one-line each with suppression reason. Optional but recommended for audit transparency.

For each: **[Title]** — _suppressed: [reason in one sentence]_

### Deferred (real but out-of-scope for this pass)

For each: [Severity] **[Title]** — [one-paragraph problem] — **Defer rationale:** [why this isn't in scope NOW] — **Follow-up:** [pointer: separate review pass, ticket ID, future refactor sprint]
```

Empty subsections are allowed — if no findings deferred, the section reads "_None._" rather than being omitted (consistency for downstream parsers).

---

## Anti-patterns

1. **Surfacing low-confidence findings as Accepted to look thorough.** Confidence <5/10 → Reject. The reviewer's existing confidence floor (5/10) is non-negotiable.
2. **Padding the Rejected subsection.** Rejected entries are one-line each with a reason. Long-form rejected findings = noise about noise = double-failure.
3. **Silent deferral.** If a finding is real and the reviewer chooses not to fix it now, it goes in Deferred WITH a follow-up pointer. Real findings are never silently dropped.
4. **Bundling unrelated findings into one Accepted entry.** Each Accepted finding is one fix with one rerun verification. Bundled = harder to verify, harder to roll back.
5. **Skipping the rerun verification.** Accepted findings without rerun-passed are not Accepted; they're at-best Attempted. The protocol is the rule, not a guideline.
6. **Letting Accepted scope creep into a redesign.** If fixing an Accepted finding requires touching >10 unrelated files, it should have been Deferred. Re-evaluate.

---

## Related refs

- [[reviewer]] — Layer 1 verification (real-vs-fake); noise-filter layers on top
- [[resolver]] — implements Accepted fixes
- [[report-template]] — body-template carries the 3-section structure
- [[anti-patterns]] — overlaps with rows on "padding with nits" and "running >2 loops"
