---
title: Seven Sweeps — unified copy-editing framework for write-copy
lifecycle: canonical
status: stable
produced_by: write-copy
provenance:
  extracted_from: implementation-roadmap/execution-evaluation/brief-pack/03-capability-upgrades.md § Copywriting upgrades + sources/IDEA-5.md § 3 (Seven Sweeps)
  extracted_at: 2026-05-19
consumers: write-copy SKILL.md + 4 agents (voice / psychology / zero-risk / critic) + downstream evaluators that score against Seven Sweeps completion
load_class: PROCEDURE
---

# Seven Sweeps — Unified Copy-Editing Framework

**A 7-pass editing discipline applied between copy generation and humanmaxxing. Each pass owns one quality dimension; back-checking between passes prevents regression. Currently distributed across 4 agents — this file is the unified vocabulary.**

> Why this exists: write-copy already runs the 7 passes, just under different labels in different agents. Without a unified doc, downstream evaluators couldn't score "Seven Sweeps completion" without re-deriving which agent owns which pass. The framework predates this skill (Corey Haines marketing-skills repo, IDEA-5 § 3); this ref is the import.

---

## The Seven Sweeps

Order matters — earlier sweeps establish floors that later sweeps must not violate.

| # | Sweep | Question | Owning agent today |
|---|---|---|---|
| 1 | **Clarity** | Can a first-read reader understand every sentence in isolation? | `agents/voice-agent.md § Sweep 1: Clarity` |
| 2 | **Voice & Tone** | Does it sound like the brand wrote it, consistently? | `agents/voice-agent.md § Sweep 2: Voice & Tone` |
| 3 | **So What** | Does every claim answer "why should the reader care?" | `agents/psychology-agent.md` + `critic-agent.md` V/F/U "Useful" dim |
| 4 | **Prove It** | Does every claim carry verifiable evidence (number, case, citation)? | `critic-agent.md` V/F/U "Verifiable" + substantiation dim |
| 5 | **Specificity** | Is the language concrete enough that a competitor couldn't run it unchanged? | `critic-agent.md` specificity dim + voice-agent AI-slop list |
| 6 | **Heightened Emotion** | Does the reader feel the cost of inaction and the relief of the outcome? | `agents/psychology-agent.md` + `references/emotional-triggers.md` |
| 7 | **Zero Risk** | Is every barrier to action neutralized (guarantee, easy out, low commitment)? | `agents/zero-risk-agent.md` |

---

## Back-checking protocol

Between each sweep, verify the prior sweep's floor is intact. The dispatch pipeline runs sweeps roughly in this order via Layer 1 (parallel: hook + body + cta + social-proof) → Merge → Layer 2 (sequential: voice → psychology → zero-risk → critic), so back-checking happens at the agent boundaries.

### Hard rules

- **Sweep 2 must not break Sweep 1.** Voice edits never trade clarity for personality. If a "brand-voice" rewrite makes a sentence harder to parse, revert.
- **Sweep 4 must not break Sweep 3.** Adding proof must not bury the "so what" under a wall of stats. Proof reinforces the answer; it is not the answer.
- **Sweep 5 must not break Sweeps 1-4.** Specificity edits cannot reintroduce jargon (Sweep 1) or off-brand language (Sweep 2). Concrete ≠ technical.
- **Sweep 6 must not break Sweep 5.** Emotional amplification cannot replace concrete details with adjectives. "10× faster" is specific; "lightning-fast" is generic.
- **Sweep 7 must not break Sweep 4.** Risk-reversal language must not soften a proven claim. "No risk" is not a substitute for "saved $42k in Q3."

### Back-check trigger

If any sweep produces an edit that violates an earlier sweep's checklist, **revert the edit** and produce a narrower variant. Do not preserve a "stronger" edit that fails an upstream gate. The critic agent enforces this at Layer 2 — see `agents/critic-agent.md` for the rewrite-loop semantics.

---

## Canonical word-level-cut list

Words to remove or replace, unless they carry irreplaceable meaning in context. Cross-stack reference — also consumed by `humanmaxxing` and `vn-tone`.

### Filler / intensifiers (Sweep 1 cuts)

- `very`, `really`, `quite`, `actually`, `basically`, `simply`, `just` (when used as a hedge), `that` (when grammatically optional)

### Corporate-speak (Sweep 2 cuts)

- `utilize` → use
- `leverage` → use, build on
- `synergy`, `ecosystem`, `holistic`, `robust`, `seamless`, `streamline`, `frictionless`
- `best-in-class`, `world-class`, `cutting-edge`, `state-of-the-art`
- `unlock`, `supercharge`, `revolutionize`, `transform` (when paired with a generic noun)
- `elevate`, `harness`, `embrace` (when functioning as empty amplifiers)

### AI-tells (Sweep 5 cuts)

- `delve`, `testament`, `tapestry`, `landscape`, `realm`, `paradigm`, `intricate`, `nuanced`, `intersection`, `dive deep`
- `In today's [fast-paced] world`, `In the ever-evolving landscape of`, `Whether you're a X or a Y`
- `At the end of the day`, `It goes without saying`, `That being said`, `With that in mind`
- `Let's dive in`, `Let's explore`, `Have you ever wondered`

For the broader AI-tell list (formatting tells, structural tells, conversational LLM patterns) see [`references/_shared/../../../humanmaxxing/references/ai-patterns.md`](../../humanmaxxing/references/ai-patterns.md) in humanize. Seven Sweeps cuts target upstream filler/corporate-speak; humanize cuts target downstream AI-tells. Some overlap is expected; this list is the authoritative source for what should die at Sweep 1-2, humanize's list is the authoritative source for what should die in the terminal polish pass.

### Em-dash policy

Per brief 03 humanmaxxing: em dashes are an AI tell when overused as filler punctuation. Allowed in real parenthetical context; disallowed as default sentence-joining glue. Voice-agent enforces; critic flags.

---

## Expert Panel Scoring (optional high-stakes mode)

For irreversible high-spend deliverables (landing-page hero, ad headlines with five-figure budget, public announcements), run an Expert Panel pass after the seven sweeps:

1. **Pick 3–5 personas** matching the target audience (e.g., for B2B SaaS pricing-page hero: skeptical CFO, time-poor engineering manager, growth-marketer practitioner). Use `agents-panel` skill if installed, otherwise dispatch inline.
2. **Each persona scores the copy 1–10** on a single dimension: "Would I take the next action after reading this?"
3. **Revise based on the lowest score** with that persona's stated objection in mind.
4. **Re-score** against the same panel. Ship when the floor crosses 7/10 or the operator accepts the trade-off (log via `scripts/log-critic-override.ts` if a critic FAIL stands).

Expert Panel Scoring is gated by `--high-stakes` mode or by `lp-brief` / `plan-campaign` upstream signaling that this is a hero deliverable. Default invocations skip it — the standard 7 sweeps + critic gate are sufficient for most copy.

---

## Critic dim: "Seven Sweeps completion" (optional)

When the operator requests the full 7-pass discipline (via `--seven-sweeps` or `--high-stakes` mode), `critic-agent.md` adds an optional rubric dimension. Pass criteria:

- Every claim in the copy maps to a Sweep-3 ("so what") answer that's not pure restatement.
- Every numeric or causal claim maps to a Sweep-4 proof point on-disk or in `research/product-context.md`.
- The Sweep-5 "competitor swap test" passes: substitute the brand name with a top-3 competitor and the copy still reads as plausible — if yes, FAIL specificity.
- The Sweep-6 hook contains at least one concrete cost-of-inaction or relief detail.
- The Sweep-7 closing block names the easy-out: refund, free trial, opt-out path, or low-commitment first step.

The dim is OPTIONAL — when the operator did not request Seven Sweeps mode, the critic skips it. No hard gate, no behavior change for standard write-copy invocations.

---

## When NOT to run Seven Sweeps

- **Quick first draft, expected to iterate.** Seven Sweeps is for near-final copy; running it on a v0 wastes effort.
- **Single key-line work (Route A).** A single hook variant doesn't need the full 7-pass discipline — the critic's V/F/U + competitor-swap test handles it.
- **Internal-tooling copy.** Sweep 7 (Zero Risk) is irrelevant when there's no purchase decision; skip it.
- **Translation polish.** `polish-vn` and `humanmaxxing` run different rubrics. Don't double-pass.

---

## Anti-patterns

1. **Running all 7 sweeps on every invocation regardless of mode.** Cost without value. Use mode flags.
2. **Skipping back-checks.** Sweep-by-sweep without verification produces over-edited copy that fails earlier gates.
3. **Substituting one AI pattern for another.** "Unlock the power of" → "Harness the potential of" is not a fix (see voice-agent § AI Slop Patterns).
4. **Letting Sweep 6 swallow Sweep 5.** Emotional intensity without specificity is generic.
5. **Treating Expert Panel Scoring as a default.** It's a high-stakes mode. Standard copy ships on the 7 sweeps + critic gate alone.

---

## Related refs

- [[ai-patterns]] (in humanmaxxing) — terminal AI-tell list, cross-linked from Sweep 5 cuts
- [[discovery-story]] — alternative social-proof pattern that can ride alongside Sweep 7
- [[emotional-triggers]] — Sweep 6 source material
- [[research-workflow]] — Pre-Dispatch step that grounds Sweeps 3 + 4 + 5 in real evidence
- [[shared-critic-rubrics]] — shared V/F/U dim definitions used by Sweep 4
