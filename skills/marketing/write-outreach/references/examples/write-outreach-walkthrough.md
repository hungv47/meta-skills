---
title: Cold Outreach — End-to-End Walkthrough (Route A, email touch 1)
lifecycle: canonical
status: stable
produced_by: cold-outreach
load_class: EXAMPLE
---

# Cold Outreach — End-to-End Walkthrough

**Load when:** an operator (human or agent) wants a complete trace of how a Route A (compose) touch gets produced — Pre-Dispatch → Layer 1a signal-analyst solo → Layer 1b strategist + proof-selector parallel → Merge → Layer 2 sequential (composer → voice-auditor → critic) → terminal humanmaxxing + specificity regression → deliver.

This walkthrough covers Route A (operator slash-command for a first-touch cold email to a named target). Route B (reply handling) follows the same Layer 2 mechanics but replaces Layer 1 with `reply-classifier` and composer with `reply-composer` — short snippet at the end. Route C (called by `plan-campaign`) follows Route A mechanics but skips the AskUserQuestion fallbacks (calling skill resolves mode + channel + per-touch context before invocation).

---

## Scenario

- **Input:** Touch 1 cold email to a named target. Mode: services-sell (boutique analytics consulting). Channel: email.
- **Target:** Jane Doe, CFO at Acme Corp (mid-market SaaS, ~200 employees).
- **Trigger:** Jane published a LinkedIn post 4 days ago about "the close process taking 9 days every month and killing the team's morale." Signal strength: 4 (specific public post quoting concrete pain).
- **Desired outcome:** Reply with interest in a 1-line back-and-forth about close-time tactics (NOT a calendar booking in touch 1).
- **Bridge:** We help analytics + finance teams cut close time via process audit + tooling recommendations.
- **Available proof:** Ramp engagement (cut close time from 9 to 4 days), Linear engagement (cut from 7 to 3 days, lower confidence on attribution), 2 anonymous testimonials.
- **Operator invocation:** `/write-outreach` with the 7 Pre-Dispatch dimensions filled inline.

---

## Step 0 — Pre-Dispatch (warm-start path, partial)

Orchestrator reads in order:

1. `research/product-context.md` → voice adjectives "blunt, specific, technical"; accuracy constraint "never round Ramp's 9→4 days metric"
2. `research/icp-research.md` → CFO persona present, VoC pain phrase "the close" used 14x in interviews
3. `docs/forsvn/experience/product.md` → `Product — proof points` key has Ramp + Linear engagements already; Ramp is most-cited
4. No `docs/forsvn/artifacts/marketing/campaign-plan.md` (standalone outreach, not part of a campaign)

Emit warm-start summary:

```
Found:
- ICP context → "CFO at mid-market SaaS, ~200 employees"
- product proof → "Ramp 9→4 days, Linear 7→3 days, 2 anonymous testimonials"

Need before dispatching: target (name + role + company), trigger
(specific signal + strength), and channel?
```

Operator confirms target = Jane Doe @ Acme + trigger = LinkedIn post (strength 4) + channel = email. Cold-Start questions 3, 4 resolved inline; Q5 (desired outcome) defaulted to "1-line reply" per services-sell mode default; Q6 (bridge) confirmed; Q7 (proof) inherited from product-context.

**Write-back:** Ramp engagement already persisted; no append to experience/product.md needed.

---

## Step 1 — Layer 1a dispatch (signal-analyst solo)

Orchestrator spawns 1 agent with `agents/signal-analyst.md` + pre-writing + `references/frameworks/personalization-signals.md`.

**Signal Analyst returns:**

- `signal_strength: 4`
- Observation line draft: "Saw your post about close taking 9 days every month — the morale tax part landed."
- Notes: "Strength 4 because the post is public + named + quotes specific pain ('9 days', 'morale'). Not 5 because it's not a direct DM to us or a referral. Strategist should anchor on the trigger (touch 1 opener)."

Wait for output. Extract `signal_strength = 4` before Layer 1b.

---

## Step 2 — Layer 1b dispatch (strategist + proof-selector IN PARALLEL)

Orchestrator spawns 2 agents in one message:

**Strategist receives** pre-writing + `signal_strength=4` + reads `frameworks/structures.md` + `frameworks/saraev-four-step.md` + `frameworks/ctas.md` + `modes/services.md`.

**Strategist returns:**

- Structure: Observation → Problem → Proof → Ask (`structures.md` O→P→P→A)
- Angle: "We've cut close time at one mid-market SaaS from 9 to 4 days. Worth comparing notes?"
- CTA shape: low-friction interest question, NOT a calendar booking ("Worth a 1-line reply?")
- Subject line angle (email): pivot off the post — "close-time tax"
- Rationale: signal_strength 4 → trigger-anchored opener is right; framework's 4-step would also work but adds length unnecessary for a strength-4 signal where the trigger speaks for itself

**Proof Selector receives** pre-writing (esp. `available_proof[]`) + `signal_strength=4` + reads `proof-types.md`.

**Proof Selector returns:**

- Primary: Ramp engagement (cut close time from 9 to 4 days) — named logo + named metric + closest fit to Jane's pain (also 9 days starting state)
- Backup: Linear (7→3) — fallback if Ramp doesn't fit length OR if Acme has Ramp as competitor concern
- Rationale: Ramp is highest-tier (named logo + named metric AND the starting-state number matches Jane's verbatim "9 days" — strongest possible specificity anchor)

Both return.

---

## Step 3 — Merge Step

Orchestrator assembles the strategy brief from Layer 1a + 1b outputs (no creative synthesis — deterministic):

```markdown
# Strategy Brief

## Target
Jane Doe, CFO at Acme Corp (mid-market SaaS, ~200 employees)

## Signal (from signal-analyst)
- Strength: 4
- Observation line (draft): "Saw your post about close taking 9 days every month — the morale tax part landed."
- Notes: Strength 4, specific public post, anchor opener on trigger.

## Framework (from strategist)
- Structure: Observation → Problem → Proof → Ask (O→P→P→A)
- Angle: "We've cut close time at one mid-market SaaS from 9 to 4 days. Worth comparing notes?"
- CTA shape: low-friction interest question ("Worth a 1-line reply?")
- Subject line angle: pivot off the post — "close-time tax"

## Proof (from proof-selector)
- Primary: Ramp 9→4 days
- Backup: Linear 7→3 days

## Channel Rules (resolved from channels/email.md)
- Subject: ≤7 words, real (no fake Re:/Fwd:), pivot off trigger when possible
- Body: 4-6 sentences max
- Structure: O→P→P→A or framework's 4-step
- Sign-off: 2 lines max, casual ("Thanks,\n[name]")

## Mode Defaults (resolved from modes/services.md)
- CTA vocabulary: "compare notes", "Worth a 1-line reply?", "loom teardown"
- Proof shape: named client + named metric (revenue-tied or time-tied)
- Offer framing: outcome-oriented, NOT feature-oriented
```

No BLOCKED from Layer 1 → proceed to Layer 2.

---

## Step 4 — Layer 2 dispatch (composer → voice-auditor → critic SEQUENTIAL)

### 4a — Composer

Composer receives strategy brief + reads `channels/email.md` + `modes/services.md`. Returns:

```
Subject: close-time tax

Hi Jane,

Saw your post about close taking 9 days every month — the morale tax part landed. The team-morale piece is the under-counted cost of long close cycles. We've cut close time at one mid-market SaaS (Ramp) from 9 to 4 days through a 2-week audit + tooling change. Worth a 1-line reply on what's slowing yours down most?

Thanks,
[Sender]
```

Word count: 64 (well under the 6-sentence ceiling). Subject: 3 words. Sign-off: 2 lines.

### 4b — Voice Auditor

Voice-auditor receives composer draft + reads `anti-patterns.md`. Returns:

- 0 banned phrases found ("hope this finds you well", "leverage", "synergy", "best-in-class" all absent)
- 0 formal sign-offs ("Thanks," is casual peer register)
- 0 em-dashes — uses em-dash–like dashes correctly? Yes (uses single em-dash in "9 days every month — the morale tax part landed" which is one instance; voice-auditor flags it for critic to re-check against the em-dash threshold)
- "I/we" count: 2 ("we've cut", "we've"). "you/your" count: 3 ("your post", "your", "yours"). You>Me ratio: 1.5x — passes.
- First sentence (after salutation) does NOT start with "I" or "My" — starts with "Saw" — passes auto-fail check.
- Specificity: 2 named entities (Ramp, Acme implied via "your") + 2 named numbers (9 days, 4 days) — Specificity Floor of ≥2 verifiable specifics MET.
- No revisions needed. Passes to critic.

### 4c — Critic

Critic receives voice-audited draft + pre_writing verbatim + reads `anti-patterns.md` for banned-phrase auto-fail source.

**Critic verdict (cycle 1):**

| Dimension | Score (0-10) | Min | Notes |
|-----------|--------------|-----|-------|
| Peer voice | 9 | 6 | Contractions natural, casual sign-off, no AI telltales. One em-dash present (acceptable under threshold for emphasis use, not stylistic). |
| Signal connection | 9 | 6 | Observation line directly cites prospect's post + quotes the specific phrase ("morale tax") — remove-the-opener test PASSES (without "saw your post..." the rest doesn't make sense). |
| CTA friction | 9 | 6 | "Worth a 1-line reply on what's slowing yours down most?" is interest-question CTA — low-friction, no calendar. |
| You > me ratio | 8 | 6 | you-count 3, I/we-count 2; first sentence starts with "Saw" not "I" — passes auto-fail. Could be slightly higher with reader-first phrasing in P3 but not worth a rewrite. |
| Specificity | 9 | 6 | Specificity Floor MET (≥2 verifiable specifics): Ramp (named entity) + 9→4 days (named numbers + matches Jane's "9 days" verbatim). Trigger entity (Jane's post) traces back to pre_writing.Q2 — no signal fabrication. |

**Total: 44/50** (threshold: 35) — PASS. Proceed to Terminal Humanmaxxing.

Cycle 1 PASS. No rewrite needed.

---

## Step 5 — Terminal Humanmaxxing + Specificity Regression

Orchestrator invokes `humanmaxxing` with:

- Final message text (critic-approved draft above)
- `content-type: "short-outbound"` (per Content Type Calibration — light strip, full voice, 0-10% compression)
- Channel: `email`
- `protected_tokens`: `["Ramp", "9 days", "4 days", "Acme"]` (every named entity + number — humanmaxxing MUST preserve verbatim)

**Humanmaxxing returns** (Route C path — skips pattern-scanner since cold-outreach voice-auditor already cleaned banned phrases):

```
Subject: close-time tax

Hi Jane,

Saw your post about close taking 9 days every month, and the morale-tax part landed. That piece is the under-counted cost of long close cycles. We cut close time at Ramp (also a mid-market SaaS) from 9 to 4 days through a 2-week audit plus a tooling change. Worth a 1-line reply on what's slowing yours down most?

Thanks,
[Sender]
```

Word count: 65 (1 word more — humanmaxxing added "also a mid-market SaaS" for register-match specificity; net compression near 0% per short-outbound calibration). Em-dash converted to comma per humanmaxxing Absolute Prohibition #1.

**Specificity regression check (automatic):**

- Re-run critic's Specificity dim ONLY on humanmaxxed text.
- Specificity score: 9 (unchanged — Ramp still present, 9 days + 4 days still present)
- Protected tokens check: all 4 tokens present verbatim
- Verdict: PASS — ship humanmaxxed version.

---

## Step 6 — Write artifacts

Orchestrator writes 3 files to `docs/forsvn/artifacts/marketing/write-outreach/`:

- **`jane-acme-email-t1.md`** — final humanmaxxed text + frontmatter (`skill: write-outreach`, `version: 1`, `date: 2026-05-18`, `status: done`, `channel: email`, `mode: services-sell`, `touch: 1`, `route: compose`, `critic_total: 44/50`)
- **`jane-acme-email-t1.rationale.md`** — angle + framework + signal strength + CTA logic + channel craft + anti-patterns avoided + Pre-Dispatch dimensions resolved
- **`jane-acme-email-t1.critic-score.md`** — 5-dim scorecard + structural auto-fail checklist + cycle count (1) + post-humanmaxxing regression result

---

## Step 7 — Deliver inline

Orchestrator delivers the humanmaxxed message + 2-line rationale to operator. Scorecard not shown (no dim scored 6-7; operator can read it from `[slug].critic-score.md` if curious).

**Completion Status: DONE** — passed critic + humanmaxxing regression, ready-to-send.

---

## Cycle-2 FAIL variant (if critic had returned FAIL)

If critic cycle 1 had scored, say, Peer Voice = 5 ("uses 'leverage' in P3, 'I hope you're doing well' in opener") — FAIL regardless of total. Orchestrator re-dispatches FULL Layer 2 chain (composer → voice-auditor → critic) with feedback header `## Critic Feedback — Address Every Point` listing the 2 banned phrases + specific replacement guidance. Composer rewrites. Voice-auditor re-strips. Critic re-scores.

If cycle 2 still FAIL (e.g., total 32/50), orchestrator surfaces: "Critic couldn't reach threshold after 2 cycles — here's the best draft + scorecard + Peer Voice flagged at 5/10. Your call." Completion Status: `DONE_WITH_CONCERNS`.

**Voice-auditor BLOCKED separate path:** if voice-auditor returned `[BLOCKED: composer needs concrete proof — current draft cites "leading SaaS companies" generically]`, orchestrator does NOT consume a critic rewrite cycle. Re-dispatches composer with block reason + re-dispatches proof-selector in parallel with "need stronger proof so composer has a better pool." Same block repeats on second pass → escalate `NEEDS_CONTEXT` ("need a named client + number from product-context.md or operator").

---

## Route B (reply) variant — short snippet

**Scenario:** Jane replied with "Not the right time, swamped through close season — try me Q4." Operator pastes the reply, asks for response.

- **Step 1:** reply-classifier types as `later` (soft no with explicit future window).
- **Step 2:** reply-composer drafts a 2-line acknowledgement + Q4 follow-up commitment, NO re-pitch ("Got it — I'll circle back in October. Best of luck with the close."). Reads `frameworks/objections.md` for `later` template.
- **Step 3:** voice-auditor confirms casual peer register, no banned phrases.
- **Step 4:** critic uses reply-route rubric — "Signal connection" → "Tone match" (8/10, matches Jane's brief defensive register), "CTA friction" → "Next step clarity" (9/10, single specific Q4 commitment). Total 42/50, hard gate passes (no re-pitch after soft no). PASS.
- **Step 5:** Terminal humanmaxxing + specificity regression (no named entities in reply → tokens list empty, regression trivially passes).
- **Step 6:** Write artifacts (slug `jane-acme-email-t1-reply` to avoid collision with the original touch 1).
- **Completion Status: DONE.**
