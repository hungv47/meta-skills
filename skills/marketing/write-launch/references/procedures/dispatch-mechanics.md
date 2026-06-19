# Procedure — Dispatch Mechanics (launch-copy)

> Load at launch-copywriter-agent dispatch entry. Encodes how to spawn each sub-agent, the single-agent fallback, the sequential dispatch graph (launch-copywriter → guard-checker → critic), the guard-check bounce + GUARD_FAIL escalation, the post-write side effects, the polish-chain handoff, the chain position, and the mode-resolver interaction.

---

## How to spawn a sub-agent (5 steps)

For each agent dispatched below, use the **Agent tool** with a prompt built as follows:

1. **Read** the agent instruction file (e.g., `agents/launch-copywriter-agent.md`) — include FULL content in the Agent prompt.
2. **Append** brief + Pre-Dispatch answers + curated upstream context after instructions.
3. **Resolve paths to absolute**: replace relative paths with absolute paths rooted at this skill's directory (e.g., `references/_shared/platform-intelligence/producthunt.md` → `/abs/path/.../write-launch/references/_shared/platform-intelligence/producthunt.md`).
4. **Pass upstream artifacts by content, not path**: the orchestrator reads `brand/BRAND.md` + `research/icp-research.md` + `research/product-context.md` + the channel pack FIRST, then includes the relevant excerpts (voice, archetype, banned words, persona pain, the differentiator, §1 angles, §2 caps, §4 guards, §5 Playbook, §7 CTA norms) in context. Sub-agents do NOT read brand/icp files directly.
5. **Include load-class tags on cited refs** so agents under `--fast` know which are skip-eligible. PLAYBOOK + EXAMPLE refs are skip-eligible under `--fast`; PROCEDURE + ANTI-PATTERN + platform-intelligence + rubric refs are NOT — and the §4 hard guards are never skippable.

---

## Single-agent fallback

If multi-agent dispatch is unavailable (no Agent tool, single-agent runtime, context constraints), execute each agent's instructions sequentially in-context in this order:

- **launch-copywriter-agent** → generate the full bundle.
- **guard-checker-agent** → enforce §2 caps + §4 hard guards; bounce to copywriter once if REVISION_REQUIRED.
- **critic-agent** → score against the 5-dimension rubric; emit verdict table + anti-patterns + discrimination test.

Output quality is equivalent — the multi-agent pattern optimizes focus, not capability. The graph is sequential by design, so fallback overhead is minimal.

---

## Sequential dispatch graph

```
1. launch-copywriter-agent
     ↓
2. guard-checker-agent
     ↓ (if §2 cap OR §4 hard-guard violation)
   2a. launch-copywriter-agent (revision, max 1 cycle)
     ↓
   2b. guard-checker-agent (re-check)
     ↓ (two consecutive failures → GUARD_FAIL → escalate; status: blocked, NO critic)
3. critic-agent
     ↓
   PASS (score ≥35)        → assemble artifact → optional polish chain → DONE
   DONE_WITH_CONCERNS      → assemble artifact with concerns flagged
   FAIL (score <25)        → deliver artifact with critic annotations
     ↓
4. [Optional] Polish chain (humanmaxxing / vn-tone) — terminal, after a PASS / DWC verdict only
```

| Step | Agent | Instruction File | Receives |
|------|-------|-----------------|----------|
| 1 | launch-copywriter-agent | `agents/launch-copywriter-agent.md` | brief OR topic + brand-system excerpts + pack §1/§2/§4/§5/§7 + Pre-Dispatch answers (brand_mode + audience + goal + the differentiator) + variant_count |
| 2 | guard-checker-agent | `agents/guard-checker-agent.md` | the bundle from copywriter + pack §2 Format Constraints + §4 hard guards |
| 2a (if revision) | launch-copywriter-agent | (same as step 1) + violations under `## Guard-Checker Feedback — Address Every Violation` | All step 1 inputs + named violations |
| 2b (if revised) | guard-checker-agent | (same as step 2), `is_revision=true` | revised bundle + pack §2/§4 |
| 3 | critic-agent | `agents/critic-agent.md` | guard-passed bundle + brief + brand-voice excerpts + pack §1/§3/§5 + `references/rubric.md` + `references/anti-patterns.md` |

---

## Guard-check bounce rule

The guard-checker-agent returns one of three verdicts:

### PASSED
Bundle satisfies all §2 caps + every §4 hard guard. Proceed to critic-agent.

### REVISION_REQUIRED
At least one format-cap or hard-guard violation. Bounce to launch-copywriter ONCE with named violations under `## Guard-Checker Feedback — Address Every Violation`. Copywriter rewrites the violating component(s) and re-emits. Guard-checker re-checks (step 2b).

### GUARD_FAIL
Second consecutive REVISION_REQUIRED (the re-checked bundle still violates). Escalate to user: `GUARD_FAIL: [channel] [guard] — manual fix required before publish.` Do NOT proceed to critic. Artifact ships `status: blocked`, `critic_score: null`, `critic_verdict: null`. A hard-guard breach is the most common GUARD_FAIL cause — a launch that breaks the platform's rules is never shipped on craft.

**Max 1 revision cycle is load-bearing.** Multiple bounces rarely converge; the GUARD_FAIL escape valve preserves operator time. A hard-guard breach on the second attempt usually means a brief-vs-channel mismatch (e.g., the operator wants a vote-drive on a channel that bans it).

---

## Critic Gate (single-pass, no rewrite loop)

Critic returns one of three verdicts based on `references/rubric.md`:

- **PASS** — total ≥35 AND no individual dimension scores 0. Ships `status: done`, `critic_verdict: pass`.
- **DONE_WITH_CONCERNS** — 25–34 OR any dimension below 4 OR a stale pack. Ships `status: done_with_concerns` with annotated concerns.
- **FAIL** — total <25. Ships `status: done_with_concerns` + `critic_verdict: fail` (not `blocked` — FAIL artifacts ship annotated; operator decides whether to use, revise, or discard).

**No critic rewrite loop.** Launch copy regenerates fast; rewrite cycles add latency without proportional gain. Operator re-invokes with an adjusted brief if FAIL is unacceptable.

**Discrimination test (every run):** weak brief estimated score MUST be <25 (a vote-ask alone forces D2=0); strong brief MUST score ≥35. Both in the same zone → `RUBRIC INTEGRITY WARNING`.

---

## Post-write side effects (mandatory on PASS / DONE_WITH_CONCERNS / FAIL)

**NOT performed on GUARD_FAIL or NEEDS_CONTEXT.**

1. **Write `docs/forsvn/artifacts/marketing/launch/[channel]-[YYYY-MM-DD]-[slug].md`** with 16-field frontmatter + body per `format-conventions.md`.
2. **Experience write-back** per `pre-dispatch.md` Write-back map (topic → `content.md`; brand_mode → `brand.md` if novel; audience → `audience.md` if icp absent; goal → `goals.md`). Channel is routing-only, NOT persisted.
3. **Manifest sync (last step):** run `bun scripts/manifest-sync.ts` to refresh `.forsvn/index/manifest.json`. `type: launch-copy-artifact` is picked up automatically.

---

## Polish chain handoff

After a critic PASS or DONE_WITH_CONCERNS (NOT after FAIL or GUARD_FAIL):

- `--polish-chain humanmaxxing` → `humanmaxxing` reads the bundle's narrative components (`### Descriptor` + `### Anchor narrative` + `### Amplification`), rewrites in place (preserves the primary-identifier variants), updates `polish_chain_applied`, appends `## Polish chain notes`.
- `--polish-chain vn-tone` → `polish-vn` (register polish) on the same components.
- `--polish-chain none` → skip.

**FAIL + GUARD_FAIL artifacts do NOT auto-route to polish** — polishing doesn't fix a generic angle or a guard breach.

---

## Chain Position

**Previous:** `plan-campaign` (launch path: channel pick + run-of-show + timing) OR `research-icp` OR greenfield with Cold Start. **Next:** `publish-social` (distribute the finished bundle), then `measure-results` (post-launch read → pack write-back). **In the launch chain:** this is the launch-copy step when the channel has a `launch-channel` pack; `write-social` owns the same step for the 5 social feed platforms. **Re-run triggers:** new channel, brand-voice shift, angle A/B, post-launch underperformance.

---

## Mode-resolver interaction

`metadata.budget: standard` → modal path is the 3-agent sequential dispatch with max-1 guard-check revision loop and single-pass critic.

- `--fast` → guard-check revision loop collapses to ZERO (single-pass guard check; a hard-guard breach escalates GUARD_FAIL immediately without bouncing). The guard-check itself STILL runs; Cold Start STILL fires when context is missing. `--fast` skips orchestration weight, not the correctness floor or the §4 guards.
- `--deep` → guard-check revision loop bumped to MAX 2. Critic stays single-pass. Variant cap stays at 3.
- Otherwise: 3-agent sequential with max-1 guard-check revision is default.

Echo the chosen mode at the end of the Cold/Warm Start confirmation.

---

## Anti-patterns in dispatch

- **Skipping the guard-check on `--fast`.** `--fast` collapses the revision LOOP, not the guard-check. A vote-ask must be caught before critic or publish — that's a publish-blocking fail regardless of speed.
- **Bouncing to copywriter more than once.** Max 1 revision cycle is load-bearing — a second breach = GUARD_FAIL.
- **Dispatching critic before guard-check PASSes.** Critic Dimension 2 forces 0 on any guard breach — guard-check is a gate, not advisory.
- **Routing FAIL / GUARD_FAIL artifacts to polish.** Operator resolves manually first.
- **Skipping manifest sync after write.** Leaves the artifact invisible to downstream (measure-results, publish-social) until the next sync.
