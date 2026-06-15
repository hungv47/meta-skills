# Procedure — Dispatch Mechanics (social-copy)

> Load at copywriter-agent dispatch entry. Encodes the 5-step Dispatch Protocol (how to spawn each sub-agent), the Single-agent fallback, the sequential dispatch graph (copywriter → format-checker → critic), the format-check bounce + FORMAT_FAIL escalation, the post-write side effects, the polish-chain handoff, the chain position, and the mode-resolver interaction.

---

## How to spawn a sub-agent (5 steps)

For each agent dispatched below, use the **Agent tool** with a prompt built as follows:

1. **Read** the agent instruction file (e.g., `agents/copywriter-agent.md`) — include FULL content in the Agent prompt.
2. **Append** brief + Pre-Dispatch answers + curated upstream context after instructions.
3. **Resolve paths to absolute**: replace relative paths with absolute paths rooted at this skill's directory (e.g., `references/_shared/platform-intelligence/tiktok.md` → `/path/to/social-copy/references/_shared/platform-intelligence/tiktok.md`). Tell agent: "Read reference file at [absolute path] for domain knowledge."
4. **Pass upstream artifacts by content, not path**: orchestrator reads `brand/BRAND.md` + `brand/DESIGN.md` + `research/icp-research.md` + `research/product-context.md` + `platform-intelligence/[platform].md` FIRST, then includes relevant excerpts (voice, archetype, lexicon, banned words, persona pain, primary CTA, Hook Taxonomy, Algorithm Signals) in context. Sub-agents do NOT read brand/icp files directly — orchestrator curates what each agent needs.
5. **Include load-class tags on cited refs** so agents under `--fast` know which refs are skip-eligible. PLAYBOOK + EXAMPLE refs are skip-eligible under `--fast`; PROCEDURE + ANTI-PATTERN + platform-intelligence + rubric refs are NOT.

---

## Single-agent fallback

If multi-agent dispatch unavailable (no Agent tool, single-agent runtime, context constraints), execute each agent's instructions sequentially in-context in this order:

- **copywriter-agent** instructions → generate hook variants + body + CTA + format spec
- **format-checker-agent** instructions → enforce hard caps + CTA placement + format compliance; bounce to copywriter section once if REVISION_REQUIRED
- **critic-agent** instructions → score against 5-dimension rubric; emit verdict table + Anti-Patterns triggered list

Output quality is equivalent — multi-agent pattern optimizes focus and parallelism, not capability. social-copy is sequential by design (no Layer 1 parallel), so fallback overhead is minimal.

---

## Sequential dispatch graph

```
1. copywriter-agent
     ↓
2. format-checker-agent
     ↓ (if hard-cap violation)
   2a. copywriter-agent (revision, max 1 cycle)
     ↓
   2b. format-checker-agent (re-check)
     ↓ (two consecutive failures → FORMAT_FAIL → escalate)
3. critic-agent
     ↓
   PASS (score ≥35)        → assemble artifact → optional polish chain → DONE
   DONE_WITH_CONCERNS      → assemble artifact with concerns flagged
   FAIL (score <25)        → deliver artifact with critic annotations
     ↓
4. [Optional] Polish chain
   polish_chain=humanmaxxing   → route to humanmaxxing skill (terminal pass)
   polish_chain=vn-tone    → route to polish-vn skill (terminal pass)
   polish_chain=none       → skip
```

| Step | Agent | Instruction File | Receives |
|------|-------|-----------------|----------|
| 1 | copywriter-agent | `agents/copywriter-agent.md` | brief OR topic + brand-system excerpts (voice + archetype + lexicon + banned words) + platform-intel §1 Hook Taxonomy + §3 Algorithm Signals + Pre-Dispatch answers (brand_mode + audience + goal) + variant_count |
| 2 | format-checker-agent | `agents/format-checker-agent.md` | structured-draft from copywriter + platform-intel §2 Format Constraints (hard caps + soft visible-window + truncation point) |
| 2a (if revision) | copywriter-agent | (same as step 1) + format-checker-feedback under header `## Format-Checker Feedback — Address Every Violation` | All step 1 inputs + named violations |
| 2b (if revised) | format-checker-agent | (same as step 2) | revised-draft + platform-intel §2 |
| 3 | critic-agent | `agents/critic-agent.md` | final-passed-draft + brief + brand-voice excerpts + `references/rubric.md` (full 5-dimension thresholds + per-platform calibration) + `references/anti-patterns.md` (14-pattern catalog) |

---

## Format-check bounce rule

The format-checker-agent returns one of three verdicts:

### PASS
Draft satisfies all hard caps + soft windows + CTA placement + format compliance. Proceed to critic-agent.

### REVISION_REQUIRED
At least one hard-cap or soft-window violation detected. Bounce to copywriter-agent ONCE with named violations under `## Format-Checker Feedback — Address Every Violation` header. Copywriter rewrites the violating element(s) and re-emits the draft. Format-checker re-checks (step 2b).

### FORMAT_FAIL
Second consecutive REVISION_REQUIRED (i.e., re-checked draft still violates). Escalate to user with explicit message: `Format-fail: [platform] [violation]. Manual fix required before publish.` Do NOT proceed to critic-agent. Artifact ships with `status: blocked`, `critic_score: null`, `critic_verdict: null` — operator resolves manually and re-runs critic via separate invocation.

**Max 1 revision cycle is load-bearing.** Multiple bounces compound and rarely converge; the FORMAT_FAIL escape valve preserves operator time. Format violations on a second attempt typically indicate a brief-vs-platform mismatch (e.g., brief asks for 500 chars on X where hard cap is 280) that copywriter alone can't fix.

---

## Critic Gate (single-pass, no rewrite loop)

Critic returns one of three verdicts based on `references/rubric.md`:

- **PASS** — total ≥35 AND no individual dimension scores 0. Artifact ships with `status: done` + `critic_verdict: pass`.
- **DONE_WITH_CONCERNS** — 25–34 OR any individual dimension below 4. Artifact ships with `status: done_with_concerns` + `critic_verdict: done_with_concerns` + annotated concerns inline (which dimensions and why).
- **FAIL** — total <25. Artifact ships with `status: done_with_concerns` + `critic_verdict: fail` (status is NOT `blocked` — FAIL artifacts still ship per locked decision; operator decides whether to use, revise, or discard).

**No critic rewrite loop in social-copy.** Unlike icp-research / market-research / prioritize (max 2 rewrite cycles), social-copy's critic verdict ships with the artifact regardless. Rationale: short-form copy is fast to regenerate; rewrite cycles add latency without proportional quality gain on a 280-char hook. Operator can re-invoke with adjusted brief or different variant_count if FAIL is unacceptable.

**Discrimination test (every run):** critic MUST verify the rubric discriminates. Weak brief estimated score MUST be <25; strong brief MUST score ≥35. If BOTH score in the same zone, flag: `RUBRIC INTEGRITY WARNING: discrimination test failed. Review Dimension [X].` See `references/rubric.md` § Discrimination Test for the full protocol.

---

## Post-write side effects (mandatory on PASS or done_with_concerns or fail)

After critic returns ANY verdict (pass / done_with_concerns / fail — but NOT after FORMAT_FAIL or NEEDS_CONTEXT):

1. **Write `docs/forsvn/artifacts/marketing/copy/[platform]-[YYYY-MM-DD]-[slug].md`** with 13-field frontmatter + 6-section body per `format-conventions.md`.
2. **Experience write-back** per `pre-dispatch.md` Write-back map:
   - Q1 (Platform) → NOT persisted (routing-only).
   - Q2 (Topic) → append to `experience/content.md` as `Content — recent topic`.
   - Q3 (Brand mode) → append to `experience/brand.md` as `Brand — mode (founder/company)` IF novel for the project (skip if already declared in `brand/BRAND.md`).
   - Q4 (Audience) → append to `experience/audience.md` as `Audience — primary persona` IF icp-research is absent AND audience was supplied via Cold Start.
   - Q5 (Goal) → append to `experience/goals.md` as `Goals — recent campaign goal`.
3. **Manifest sync (last step):** run `bun scripts/manifest-sync.ts` to refresh `.forsvn/index/manifest.json` with the new artifact entry. social-copy artifacts have `type: social-copy-artifact` so manifest-sync's classifier picks them up automatically.

**BLOCK + NEEDS_CONTEXT do NOT trigger write-back.** Partial runs that don't ship an artifact don't persist canonical state. The previous most-recent social-copy artifact (if any) remains the source of truth.

---

## Polish chain handoff

After critic verdict (PASS or DONE_WITH_CONCERNS — NOT after FAIL or FORMAT_FAIL):

- `--polish-chain humanmaxxing` → invoke `humanmaxxing` skill with the artifact path as input. humanmaxxing reads the artifact, rewrites `## Body` and `## CTA` in place (preserves Hook variants for A/B comparability), updates frontmatter `polish_chain_applied: humanmaxxing`, appends `## Polish chain notes` section.
- `--polish-chain vn-tone` → invoke `polish-vn` skill with the artifact path + target register (báo chí / semi-casual / bro / pop-marketing — operator answers register at vn-tone's own Cold Start). vn-tone rewrites Body + CTA, updates frontmatter, appends notes.
- `--polish-chain none` → skip. Artifact ships as-is.

**FAIL artifacts do NOT auto-route to polish.** Polishing a critic-failed copy doesn't fix the underlying issue (typically a generic hook or format mismatch — polish skills don't have rubric-scoring authority). Operator resolves FAIL manually before invoking polish.

---

## Chain Position

**Previous:** `brief-shortform` (when the brief locks platform / hook / audience / goal) OR `plan-campaign` (when the campaign plan declares the social cadence) OR none (greenfield invocation with Cold Start).

**Next:** `humanmaxxing` / `polish-vn` (polish chain, optional terminal pass) OR direct operator publish workflow (when polish_chain=none).

**Horizontal role:** social-copy is invoked at any stage of the marketing pipeline — after brief, after plan-campaign, or standalone. It does NOT have a foundational role (unlike icp-research / brand-system); it's a leaf-node producer in the pipeline.

**Re-run triggers (operator judgment):** new platform target, brand voice shift, hook A/B variant exploration, post-publish underperformance (re-run with different variant_count and/or different goal).

---

## Skill Deference

| Situation | Defer to |
|---|---|
| Paid Meta / Google / LinkedIn ad copy | `write-ad` |
| Full video brief with storyboard + audio + production spec | `brief-shortform` |
| Landing-page copy, headlines, taglines, section copy | `write-copy` |
| Email subject lines + body, newsletter | `email-copy` (parked) |
| Cold-outreach DMs (email, LinkedIn, Twitter, iMessage) | `write-outreach` |
| LinkedIn articles, Substack posts, blog content (long-form) | `write-copy` or `optimize-seo` |
| Vietnamese-market polish | `polish-vn` (terminal pass) |
| AI-pattern stripping post-generation | `humanmaxxing` (terminal pass) |

---

## Mode-resolver interaction

`metadata.budget: standard` → modal path is the 3-agent sequential dispatch (copywriter → format-checker → critic) with max-1 format-check revision loop and single-pass critic.

- `--fast` flag or "fast mode" / "quick pass" phrasing → format-check revision loop collapses to ZERO (single-pass format check; if hard-cap violation, escalate FORMAT_FAIL immediately without bouncing to copywriter). Critic gate still runs (it's already single-pass at baseline). Cold Start STILL fires when context is missing — `--fast` does not authorize hallucinating audience or brand_mode (Anti-Pattern #5 floor).
- `--deep` flag or "thorough analysis" / "full critique" phrasing → format-check revision loop bumped to MAX 2 cycles (vs 1 at baseline). Critic gate stays single-pass (no rewrite loop at baseline; --deep does NOT introduce one). Variant_count cap stays at 3 (no expansion under --deep — more variants dilutes critic discrimination test).
- Otherwise: 3-agent sequential with max-1 format-check revision is default.

Echo the chosen mode at the end of the Cold Start / Warm Start confirmation. Operator can override before dispatch.

---

## Anti-patterns in dispatch

- **Skipping format-check on `--fast`.** `--fast` collapses the revision LOOP (no bounce-to-copywriter cycle), but the format-check itself still runs. Hard-cap violations on X (>280 chars) MUST be caught before critic or publish — that's a hard structural fail regardless of speed mode.
- **Bouncing to copywriter more than once.** Max 1 revision cycle is load-bearing — second REVISION_REQUIRED = FORMAT_FAIL. Looping until the copy fits typically masks a brief-vs-platform mismatch and burns critic budget.
- **Routing FAIL artifacts to polish chain.** Polish (humanmaxxing / vn-tone) doesn't fix critic-fail issues (generic hook, format mismatch). Operator resolves FAIL manually before invoking polish.
- **Forcing a critic rewrite loop.** social-copy critic is single-pass by design — no rewrite cycles even under --deep. Short-form copy regenerates fast; rewrite cycles compound latency without proportional quality gain.
- **Dispatching critic before format-check PASSes.** Critic dimension 2 (Char/Word Limit Compliance) auto-fails if a hard-cap violation reaches it. Format-check is gate, not advisory.
- **Skipping manifest sync after write.** `.forsvn/index/manifest.json` is the index downstream skills (eval-loop, humanmaxxing, vn-tone, orchestrate-marketing) read for artifact discovery. Skipping sync leaves the new artifact invisible to downstream until the next manual sync.
