---
title: Outreach-Eval Anti-Patterns
lifecycle: canonical
status: stable
load_class: ANTI-PATTERN
---

# Outreach-Eval Anti-Patterns

> Re-read before any cycle artifact ships. Each row names the pattern, why it fails, and the fix. Critic Hard Fails are the enforcement teeth.

## Outreach-eval-specific anti-patterns

### 1. Open-rate vanity read as success
**Pattern:** The sequence hit a 68% open rate; the artifact claims `keep`. Positive replies: 0. Meetings booked: 0.
**Why it fails:** Opens are cheap and increasingly fake — Apple Mail Privacy Protection pre-fetches images and inflates opens. An open is not interest; a reply that books a meeting is. A keep on opens funds a sequence that talks to no one.
**Fix:** Reply-Quality Discrimination dim requires the categorized reply breakdown + the meaningful-vs-vanity read. A vanity-heavy headline cannot earn `keep`. Critic Hard Fail #11 enforces.

### 2. Reply-winning sequence that is burning the domain
**Pattern:** The sequence booked 9 meetings; the artifact claims `keep`. Bounce rate: 9%. Spam complaints: 0.4%. Sender reputation: degraded.
**Why it fails:** A sequence that elevates bounce/spam rates is destroying the sending domain's deliverability — next month every email lands in spam, and the meetings stop. Replies today do not offset a blacklisted domain tomorrow.
**Fix:** Deliverability & Compliance dim caps the verdict at watch/discard when bounce/spam is above the safe threshold or reputation is degraded. Critic Hard Fail #12 enforces — replies never rescue a burning domain.

### 3. Ignoring opt-out / compliance
**Pattern:** Contacts who replied "unsubscribe" got the next sequence step anyway; the artifact scores `keep` on reply rate.
**Why it fails:** Continuing to mail an opt-out is a CAN-SPAM / GDPR / platform-ToS violation with legal exposure — and it generates spam complaints that compound the deliverability problem.
**Fix:** Deliverability & Compliance dim requires opt-out/regime status. A compliance violation caps the verdict at watch/discard regardless of replies. Critic Hard Fail #12 enforces.

### 4. Scoring a draft
**Pattern:** The operator runs `/evaluate-outreach` on a sequence that has not been sent — there is no reply or bounce data.
**Why it fails:** Eval requires sent + measured evidence. Scoring a draft is a best-practice audit, not an evaluation — that is write-outreach's job.
**Fix:** Critical Gate 2 + Critic Hard Fail #2. Metric Ingest STOPs on a not-sent sequence and routes to `write-outreach`.

### 5. Cross-channel contamination of the verdict
**Pattern:** The offer ran via cold email AND LinkedIn DM; the artifact averages reply rates across both and scores the verdict on the blend.
**Why it fails:** Each channel runs different mechanics, benchmarks, and deliverability models. A blend lets a strong LinkedIn-DM result mask a dead cold-email cycle — the keep/discard decision contaminates next cycle on both channels.
**Fix:** One cycle = one channel + segment. Secondary channels live in Cross-Channel Context and never enter `current_value` or the verdict. Critical Gate 4 + Critic Hard Fail #5 enforce.

### 6. Fabricated reply sentiment or meetings
**Pattern:** "Replies were overwhelmingly positive" — but no replies are quoted, or "11 meetings booked" with no CRM trace.
**Why it fails:** Reply quality is the easiest evidence to invent. Inferred sentiment or phantom meetings that future cycles read as fact scale a sequence that never converted.
**Fix:** Diagnosis quotes actual replies when it cites sentiment; meetings trace to a named tool/CRM. Critic Hard Fail #6 enforces.

### 7. Scope drift to "rewrite the whole program"
**Pattern:** Positive-reply rate dipped; recommendation suggests "new subject + new opener + new value prop + new sequence length + new channel + new list."
**Why it fails:** Eval scope is sequence diagnosis + next-cycle routing, not outreach-strategy maximalism. Maximalist recommendations always hide the actual fix among 6 unrelated changes.
**Fix:** Routing must be to the smallest correct next skill (write-outreach subject-only revision, or research-icp for a list fix). Decision Discipline dim catches this.

### 8. Killing a cycle without same-channel+segment baseline
**Pattern:** Cycle 2 (LinkedIn DM to ops) positive-reply 0.4%. Baseline = cycle 1 (cold email to founders) 0.9%. Recommendation: `discard`.
**Why it fails:** Cross-channel, cross-segment comparison invents a fictitious decline. LinkedIn DM and cold email have different benchmarks; ops and founders respond differently.
**Fix:** Attribution Honesty dim requires same channel AND same segment for a baseline. Critic Hard Fail #10 enforces.

### 9. Source write-outreach artifact unverified
**Pattern:** The cycle's provenance lists `input_artifacts: write-outreach/email-2026-05-01-founders.md` — but the file doesn't exist.
**Why it fails:** Without the source sequence, the eval scores against an imagined hypothesis; future `write-outreach --rev=N+1` runs can't follow the chain.
**Fix:** Metric Ingest's Blockers section catches unreadable source paths. Critic Hard Fail #3 enforces.

### 10. Confidence inflation on tiny sends
**Pattern:** The sequence went to 40 contacts; the artifact claims `confidence: high` on a positive-reply lift.
**Why it fails:** Small send volume makes reply rates noise. A high-confidence keep on 40 sends funds a sequence direction on a coin flip.
**Fix:** Attribution Honesty dim caps confidence on sub-floor sends; a low-send keep ships as `watch`.

## Cross-cutting marketing-stack rows

### Cross-stack contract drift
**Pattern:** Frontmatter schema, body section list, or Results Row columns diverged silently between evaluate-outreach's format-conventions.md and `_shared/eval-loop-spec.md`.
**Why it fails:** Downstream consumers (dashboard, write-outreach --rev=N+1, ledger-summary skills) break or silently miss fields.
**Fix:** Schema changes require atomic update across format-conventions + `_shared/eval-loop-spec.md` + downstream callers.

### Sibling-skill confusion with the eval lanes
**Pattern:** A campaign bundle contained cold emails AND organic posts; one evaluate-outreach cycle tries to score both.
**Why it fails:** Two lanes in one cycle artifact = polluted ledger row, polluted learnings, wrong rubric on the post.
**Fix:** evaluate-outreach's cycle covers sent outreach only. The posts are a separate `evaluate-content` cycle. Critical Gate 4 enforces.

### Upstream context skipped — no loop scaffolded
**Pattern:** Operator runs `/evaluate-outreach` without a loop ever created.
**Why it fails:** Eval cycles assume a `program.md` + `context.md` defining primary metric + channel/segment scope + guardrails. Without those, scoring is heuristic.
**Fix:** Critical Gate 1 blocks. Skill returns NEEDS_CONTEXT and recommends `/run-pipeline` to scaffold first.

### Polish-chain misroute
**Pattern:** Eval artifact is sent to humanmaxxing or polish-vn after writing.
**Why it fails:** Eval artifacts are evidence + decisions, not customer-facing copy. Humanmaxxing would smooth attribution + deliverability caveats into more confident-sounding prose — the opposite of attribution discipline.
**Fix:** Eval artifacts skip the humanmaxxing/polish-vn polish chain. They ship as-is from critic PASS.
