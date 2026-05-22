---
title: Copywriting — Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: copywriting
load_class: PROCEDURE
---

# Dispatch Mechanics

**Load when:** Route classification (A/B/C) is selected OR Layer 1 (parallel section writers) / Layer 2 (sequential craft refiners) dispatch begins. Mechanics for spawning sub-agents per the orchestrator's Agent Manifest + Routes A/B/C, plus the Merge Step with both narrative section-order tables.

---

## How to spawn a sub-agent

For each agent dispatched, use the **Agent tool** with a prompt constructed as follows:

1. **Read** the agent instruction file (e.g., `agents/hook-agent.md`) — include its FULL content in the Agent prompt
2. **Append** the brief and pre-writing context after the instructions
3. **Resolve file paths to absolute**: replace relative paths with absolute paths rooted at this skill's directory. Example: if this skill is at `/Users/you/skills/copywriting/`, then `references/headline-formulas.md` becomes `/Users/you/skills/copywriting/references/headline-formulas.md`. Tell the agent: "Read the reference file at [absolute path] for domain knowledge."
4. **Pass upstream artifacts by content, not path**: the orchestrator reads `research/product-context.md` and `research/icp-research.md` FIRST, then includes relevant excerpts (VoC quotes, voice adjectives, pain language) in the pre-writing object. Sub-agents should NOT read artifact files directly — the orchestrator curates what they need.
5. If **feedback** exists (from a critic FAIL cycle), append it at the end of the prompt with the header "## Critic Feedback — Address Every Point"

## Single-agent fallback

If multi-agent dispatch is unavailable (no Agent tool, single-agent runtime, or context constraints), execute each agent's instructions sequentially in-context:
- Layer 1: run each agent's domain instructions one at a time, writing each section
- Layer 2: apply each refinement pass to the full document in order
- Critic: self-evaluate using the critic-agent's rubric and quality gate

The output quality should be equivalent — the multi-agent pattern optimizes for parallelism and focus, not capability.

---

## Route A — Single Key Line

**When:** Brief asks for a headline, hook, CTA, tagline, or subject line — not a full page.

```
1. Pre-dispatch: Gather context (per procedures/pre-dispatch.md)
2. Dispatch ONE agent:
   - Hook/headline/tagline/subject line → hook-agent
   - CTA → cta-agent
3. Dispatch: critic-agent (on the single agent's output)
4. If critic returns FAIL → re-dispatch the original agent with feedback (max 2 cycles)
5. Deliver annotated key lines
```

**Note:** Route A skips variant-agent. Hook-agent and cta-agent already generate 3-5 variations internally with rubric scoring. Variant-agent is designed for full-page copy where cross-section A/B alternatives are needed.

## Route B — Full-Page Copy

**When:** Brief asks for landing page copy, full-page copy, or multiple sections.

```
1. Pre-dispatch: Gather context (per procedures/pre-dispatch.md)
2. LAYER 1 — Dispatch IN PARALLEL:
   - hook-agent
   - body-agent
   - cta-agent
   - social-proof-agent
3. MERGE: Assemble Layer 1 outputs into page structure (see Merge Step below)
4. Dispatch: variant-agent (on merged output)
5. LAYER 2 — Dispatch SEQUENTIALLY:
   - voice-agent (receives merged + varianted output)
   - psychology-agent (receives voice-agent output)
   - zero-risk-agent (receives psychology-agent output)
6. Dispatch: critic-agent (receives zero-risk-agent output)
7. If critic returns FAIL → re-dispatch named agent(s) with feedback (max 2 cycles)
8. Deliver final artifact
```

## Route C — Called by Another Skill

**When:** Invoked by `plan-campaign` or `brief-landing-page` for inline copy work.

```
1. Pre-dispatch: Read context from calling skill's artifacts
2. Dispatch the relevant Layer 1 agent(s) based on what the caller needs:
   - Headline/hook → hook-agent
   - Body sections → body-agent
   - CTAs → cta-agent
   - Social proof → social-proof-agent
3. Dispatch: critic-agent
4. Return annotated output to the calling skill
```

---

## Layer 1: Parallel Section Writers (Route B)

Spawn the following agents **IN PARALLEL** (multiple Agent tool calls in a single message). For each agent, follow the Dispatch Protocol above.

| Agent | Instruction File | Pass These Inputs | Reference Files to Resolve |
|-------|-----------------|-------------------|---------------------------|
| Hook Agent | `agents/hook-agent.md` | brief + pre-writing | `references/headline-formulas.md`, `references/research-workflow.md`, `references/emotional-triggers.md` (TOF/lead-magnet hooks), `references/belief-disruption.md` (problem-unaware audience), `references/lead-magnet-stack.md` (lead-magnet posts) |
| Body Agent | `agents/body-agent.md` | brief + pre-writing | `references/page-sections.md`, `references/research-workflow.md` |
| CTA Agent | `agents/cta-agent.md` | brief + pre-writing | `references/lead-magnet-stack.md` (lead-magnet CTAs only) |
| Social Proof Agent | `agents/social-proof-agent.md` | brief + pre-writing + available proof points | `references/page-sections.md`, `references/discovery-story.md`, `references/lead-magnet-stack.md` (FOMO layer 1-2 social-proof patterns) |

**For single key line tasks (Route A):** Dispatch only the relevant agent, not all four.

---

## Merge Step

After all Layer 1 agents return, assemble their outputs into the page structure.

### Section Order (full-page copy)

**Awareness-building narrative** (Body Agent chose Problem → Solution → How It Works):

1. **Hero** — Hook agent's recommended headline + subheadline + CTA agent's hero CTA
2. **Social Proof Bar** — Social proof agent's bar element
3. **Problem** — Body agent's Problem section
4. **Solution** — Body agent's Solution section
5. **How It Works** — Body agent's How It Works section
6. **Testimonials** — Social proof agent's testimonials
7. **Key Stats** — Social proof agent's stats (if applicable)
8. **Final CTA** — CTA agent's final CTA + risk reversal

**Direct-response narrative** (Body Agent chose 6 Necessary Beliefs):

1. **Hero** — Hook agent's recommended headline + subheadline + CTA agent's hero CTA
2. **Social Proof Bar** — Social proof agent's bar element
3. **Necessary Beliefs** — Body agent's belief sequence, preserving the Problem / Mechanism / Superiority / Proof / Fit / Opportunity order
4. **Mechanism Close** — Body agent's Unique Mechanism close
5. **Testimonials** — Social proof agent's testimonials
6. **Key Stats** — Social proof agent's stats (if applicable)
7. **Final CTA** — CTA agent's final CTA + risk reversal

### Assembly Rules

The merge is deterministic assembly, not creative synthesis. Slot each agent's output into the template by ownership:

**Awareness-building narrative:**

| Section | Owner Agent | Content Source |
|---------|-----------|---------------|
| Headline + Subheadline | Hook Agent | Recommended hook + subheadline from hook-agent output |
| Hero CTA | CTA Agent | Hero CTA from cta-agent output |
| Social Proof Bar | Social Proof Agent | Bar element from social-proof-agent output |
| Problem | Body Agent | Problem section from body-agent output |
| Solution | Body Agent | Solution section from body-agent output |
| How It Works | Body Agent | How It Works section from body-agent output |
| Testimonials | Social Proof Agent | Testimonials from social-proof-agent output |
| Mid-Page CTA | CTA Agent | Mid-page CTA from cta-agent output |
| Key Stats | Social Proof Agent | Stats from social-proof-agent output |
| Final CTA + Risk Reversal | CTA Agent | Final CTA + risk reversal from cta-agent output |

**Direct-response narrative:**

| Section | Owner Agent | Content Source |
|---------|-----------|---------------|
| Headline + Subheadline | Hook Agent | Recommended hook + subheadline from hook-agent output |
| Hero CTA | CTA Agent | Hero CTA from cta-agent output |
| Social Proof Bar | Social Proof Agent | Bar element from social-proof-agent output |
| Necessary Beliefs | Body Agent | Necessary Beliefs section from body-agent output |
| Mechanism Close | Body Agent | Mechanism Close from body-agent output |
| Testimonials | Social Proof Agent | Testimonials from social-proof-agent output |
| Key Stats | Social Proof Agent | Stats from social-proof-agent output |
| Final CTA + Risk Reversal | CTA Agent | Final CTA + risk reversal from cta-agent output |

If the Body Agent chose Direct-Response 6 Necessary Beliefs, do not force its output back into Problem / Solution / How It Works slots. Preserve the belief sequence as the persuasive body architecture.

### Conflict Resolution

- Each agent owns specific sections (table above). If two agents mention the same fact (e.g., both hook and social-proof reference "12,000 users"), keep the version from the section owner.
- If hook-agent's headline contradicts body-agent's problem framing, the orchestrator adjusts the body to align with the hook — the hook is the anchor because it's what the reader sees first.

### After Merge: Variant Agent

Dispatch the **variant-agent** with the assembled document as `upstream`. It returns A/B alternatives for key sections. Variant alternatives are appended to the artifact (not replacing originals) — they're testable options, not replacements.

---

## Layer 2: Sequential Craft Refiners (Route B)

Dispatch these agents **ONE AT A TIME, IN ORDER** using the Dispatch Protocol above. Each receives the previous agent's full output as the `upstream` field.

```
voice-agent → psychology-agent → zero-risk-agent → critic-agent
```

| Step | Agent | Instruction File | Receives | Reference Files to Resolve |
|------|-------|-----------------|----------|---------------------------|
| 1 | Voice Agent | `agents/voice-agent.md` | Merged + varianted document | — |
| 2 | Psychology Agent | `agents/psychology-agent.md` | Voice agent's output | `references/emotional-triggers.md`, `references/belief-disruption.md` (TOF copy only) |
| 3 | Zero-Risk Agent | `agents/zero-risk-agent.md` | Psychology agent's output | — |
| 4 | Critic Agent | `agents/critic-agent.md` | Zero-risk agent's output | `references/emotional-triggers.md` (trigger density gate) |

Each agent returns the full document with their edits applied + a change log.

---

## Critic Gate

The critic agent returns one of two verdicts:

### PASS

The copy meets all quality standards. Deliver the critic's annotated output as the final artifact.

### FAIL

The critic returns specific failures with:
- Which lines failed and on which dimension (Visual / Falsifiable / Uniquely-Ours + trigger density + authenticity filter)
- Specific fix instructions
- Which agent to re-dispatch (per critic-agent's re-dispatch routing table)

**Rewrite loop:**

1. Read the critic's failure report
2. Re-dispatch ONLY the named agent(s) with the critic's feedback attached as the `feedback` input
3. Run the modified output back through the critic
4. **Maximum 2 rewrite cycles.** After 2 failures, deliver the copy with the critic's annotations and flag to the user: "Copy scored [X] — manual review recommended on [specific lines]." Status: `DONE_WITH_CONCERNS`.

---

## Chain Position

Horizontal — called by `plan-campaign`, `brief-landing-page`. Can run standalone.

**Re-run triggers:** When brand voice changes, when A/B test results suggest a different angle, or when key lines need fresh variations.

### Skill Deference

- **Content reads as AI-generated?** → Run `humanmaxxing` after (terminal polish-chain auto-route)
- **Optimizing for search/AI citations?** → Coordinate with `optimize-seo`
- **Need page architecture (not just copy)?** → `brief-landing-page` first, then copywriting per section
- **Need full campaign orchestration?** → `plan-campaign` first, then copywriting per touchpoint
