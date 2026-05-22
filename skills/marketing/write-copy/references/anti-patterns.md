---
title: Copywriting Anti-Patterns
lifecycle: canonical
status: stable
produced_by: copywriting
load_class: ANTI-PATTERN
---

# Copywriting Anti-Patterns

**Load when:** orchestrator, any Layer 1 / Layer 2 agent, or critic verifies output. Re-read before any output ships. These patterns are pipeline-level failure modes — they describe how the orchestrator can fail to produce shippable copy even when individual agents succeed in isolation.

---

## Orchestrator-Level Anti-Patterns

### Skipping the pre-writing

**Problem:** Dispatching Layer 1 agents without answering the 7 Cold Start questions (surface / audience / shift / proof / Unique Mechanism / belief sequence / traffic source). Every agent needs this context to write relevant copy — without it, hook-agent guesses the audience, body-agent invents a Unique Mechanism, critic can't enforce Competitive Uniqueness.

**INSTEAD:** Pre-Dispatch hard-block conditions (per `procedures/pre-dispatch.md`) fire when surface / audience / shift are missing. NEEDS_CONTEXT escalation when proof + Unique Mechanism both missing AND no product-context. Cold Start always fires when context unresolvable from warm-start, even under `--fast`.

### Dispatching all agents for a single key line

**Problem:** A user asks for a single headline and the orchestrator dispatches hook + body + cta + social-proof + variant + voice + psychology + zero-risk + critic (Route B). 8 of those produce zero value for a single-line task; the body-agent's "Necessary Beliefs" output isn't even consumable by the deliverable.

**INSTEAD:** Route A exists for a reason. Classify the task at Step 1 of Pre-Dispatch. A single key line only needs one Layer 1 agent (hook-agent for headline/hook/tagline/subject; cta-agent for CTA) + critic-agent. hook-agent and cta-agent already generate 3-5 variations internally with rubric scoring — variant-agent is for cross-section A/B alternatives, not single-line variants.

### Ignoring the critic's FAIL

**Problem:** Critic-agent returns FAIL with specific line-level feedback and a re-dispatch target ("Specificity 2 on hero headline — re-dispatch hook-agent with feedback to replace 'leading provider' with named-client + named-metric"). The orchestrator delivers the failed copy anyway because "it's close enough."

**INSTEAD:** Critic FAIL → re-dispatch is non-negotiable. Quality contract is "PASS or BLOCK with reason," not "best-effort delivery." Per Critic Gate procedure: read failure report, re-dispatch named agent(s) with feedback, run modified output back through critic. Status DONE only after critic PASS.

### Re-dispatching the wrong agent

**Problem:** Critic says "Trigger density 0/6 — route to psychology-agent to fold in primary lever" and orchestrator re-dispatches hook-agent. Hook-agent doesn't own emotional-triggers density (psychology-agent does); the rewrite produces no improvement; cycle 2 also fails for the same reason; orchestrator ships DWC.

**INSTEAD:** Read the critic's re-dispatch table carefully. critic-agent.md has explicit routing rules: V/F/U FAIL → hook-agent or body-agent (depending on which section); Trigger Density 0-2 → psychology-agent; Trigger Density 5-6 → psychology-agent (cut, not add); Authenticity filter FAIL → voice-agent. Wrong-agent re-dispatch wastes both cycles allowed by the 2-cycle cap.

### More than 2 rewrite cycles

**Problem:** Critic FAILs cycle 1 and cycle 2, both for related but different reasons. Orchestrator runs cycle 3 "to try one more time" because the copy is "almost there." Diminishing returns kick in — each cycle past 2 has lower expected improvement than annotating the failure and surfacing to the user.

**INSTEAD:** **Maximum 2 rewrite cycles** per Critic Gate procedure. After 2 failures, deliver copy with annotations + flag to user: "Copy scored [X] — manual review recommended on [specific lines]." Status: `DONE_WITH_CONCERNS`. The user decides whether to manually revise or accept; the orchestrator doesn't burn additional cycles on diminishing returns.

---

## Pipeline-Level Anti-Patterns

### Voice-agent run before Layer 1 returns

**Problem:** voice-agent applies brand-voice + AI-slop removal to merged Layer 1 output. If dispatched too early (e.g., as part of Layer 1 parallel), it has no body to operate on; output is empty or hallucinated.

**INSTEAD:** voice-agent is Layer 2 sequential, step 1 — receives `merged + varianted document` per the Layer 2 table. Never dispatch voice-agent during Layer 1.

### Psychology-agent skipping the trigger-density check

**Problem:** psychology-agent applies emotional-trigger work (Identity Validation, Status Signaling, Tribal Belonging, Productive Discomfort, Curiosity Gap, Aspiration+Believability) but doesn't count triggers fired. Output stacks 5-6 triggers → critic flags as GURU-ENERGY RISK → FAIL.

**INSTEAD:** psychology-agent.md targets density 3-4 (WEAK at 0-2, GURU-ENERGY at 5-6). For TOF belief-disruption (per `references/belief-disruption.md`): Identity Validation + Productive Discomfort + Tribal Belonging baseline, ≤4 total. For lead-magnet posts (per `references/lead-magnet-stack.md`): the 5-element stack naturally pulls 5 triggers — verify each is doing real work or cut.

### Zero-risk-agent adding risk-reversal where it doesn't belong

**Problem:** zero-risk-agent applies "no credit card required" / "cancel anytime" / "30-day money back" to every CTA including info-grab CTAs ("Download the guide") where the reader isn't risking anything in the first place. Output reads as paranoid; risk-reversal density dilutes the genuine asks.

**INSTEAD:** zero-risk-agent operates on conversion-points where the reader IS risking something (money, time commitment, account creation). Info-grab CTAs ("Download", "Read more") don't need risk-reversal; trial/purchase/demo CTAs do. zero-risk-agent.md scoping is per-CTA, not blanket.

### Variant-agent generating gratuitous variants

**Problem:** variant-agent returns A/B alternatives for every section regardless of variance value. Output bloats the artifact with 8 variants when 2 (hero + final CTA) carry the actual test priority.

**INSTEAD:** variant-agent prioritizes high-leverage sections — hero, final CTA, primary social-proof — for A/B variants. Mid-page sections get variants only if a specific hypothesis exists. Quantity ≠ quality; an artifact with 2 well-hypothesized variants beats 8 untested alternatives.

---

## Cross-Cutting Marketing-Stack Anti-Patterns

These patterns apply across the marketing stack — copywriting is called by `plan-campaign` (Route C campaign touchpoints) and `brief-landing-page` (Route C per-section copy), and routes to `humanmaxxing` for terminal AI-pattern cleanup. Enforced via Pre-Dispatch wiring + critic verification + cross-skill contract.

### Calling skill drops voice + audience context in Route C

**Problem:** `brief-landing-page` dispatches copywriting Route C for a hero-section headline but passes only the brief, no voice adjectives, no audience VoC quotes, no Unique Mechanism. copywriting's Pre-Dispatch hits the Cold Start fallback and surfaces 7-question Cold Start mid-flow — jarring for the user who's mid-lp-brief flow.

**INSTEAD:** Route C calling skills (campaign-plan, lp-brief) MUST resolve audience + voice + Unique Mechanism + the one shift BEFORE invoking copywriting per section. copywriting Route C is NOT the right place to interrogate the user on cross-section decisions. If calling skill passes incomplete context, copywriting Route C should escalate `NEEDS_CONTEXT` back to caller, not break flow with mid-stream AskUserQuestion.

### brand-system absent → voice fabrication

**Problem:** No `brand/BRAND.md` exists; copywriting's voice-agent has no canonical voice adjectives to enforce. Output drifts to a generic "professional, clear, friendly" voice that matches no brand. critic-agent has no ground truth for the Authenticity filter ("would you say it in person") and approves bland output as PASS.

**INSTEAD:** Pre-Dispatch warm-start scan reads `research/product-context.md` for voice adjectives. If absent AND no `brand/BRAND.md`, default to "clear, specific, human" + flag in pre-writing as `voice_source: default` (not brand-derived). NEEDS_CONTEXT escalation when voice + Unique Mechanism both unresolvable — recommend `create-brand` first. Do NOT silently fabricate brand voice.

### humanmaxxing chain skipped for AI-sounding output

**Problem:** copywriting completes Route B → critic PASS → deliver. Output reads as AI-generated (em-dashes, "it's not just X, it's Y", rhetorical-question hooks). User asks "did this go through humanmaxxing?" — answer: no, the orchestrator skipped the terminal polish-chain because critic-agent's Authenticity filter scored a PASS.

**INSTEAD:** copywriting's terminal pass SHOULD auto-route to `humanmaxxing` for EN-market copy that's persuasion-heavy (landing page, ad copy, sales email). The Authenticity filter catches some AI patterns but is not equivalent to humanmaxxing's 47-pattern catalog. For TOF / lead-magnet / sales-page copy: terminal humanmaxxing is recommended; copywriting's "Next Step: Run humanmaxxing to refine voice and compress" is the contract pointer. Sibling pattern to `write-outreach` which calls humanmaxxing as terminal pass with `protected_tokens`.

### Cross-stack contract drift (Artifact Template schema)

**Problem:** A maintainer adds a new frontmatter field to copywriting's `[slug].copy.md` artifact (e.g., `awareness_stage: unaware | problem-aware | solution-aware | product-aware | most-aware`) without checking calling-skill consumers (`brief-landing-page` reads `pre_writing.unique_mechanism` + `key_lines.*.score` from write-copy output to sequence next section refinements; `plan-campaign` reads `surface` + `audience` for campaign coherence).

**INSTEAD:** Artifact Template (4-field frontmatter + Pre-Writing 5-item block + Key Lines structure with V/F/U scores + A/B Variants section per `format-conventions.md`) is the contract. Schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Pre-Writing block format" + § "Key Lines block format" so the convention IS the contract. Add new fields at the END of frontmatter to avoid breaking existing positional readers.
