---
title: VN-Tone — Dispatch Mechanics
lifecycle: canonical
status: stable
produced_by: vn-tone
load_class: PROCEDURE
---

# Dispatch Mechanics

**Load when:** Layer 1 (diagnostic) or Layer 2 (polisher → critic) dispatch begins. Mechanics for spawning sub-agents per the orchestrator's Agent Manifest.

---

## How to spawn a sub-agent

For each agent dispatched, use the **Agent tool** with a prompt built as follows:

1. **Read** the agent instruction file (e.g., `agents/diagnostic-agent.md`) — include FULL content in the Agent prompt
2. **Append** the brief and Pre-Writing context after the instructions
3. **Resolve reference paths to absolute** — replace relative paths with absolute paths rooted at this skill's directory (e.g., `references/vn-tone-corpus.md` becomes `/Users/you/marketing-skills/skills/vn-tone/references/vn-tone-corpus.md`)
4. **Pass original text as `brief`**, not as a file path — agents operate on text directly, not on file reads
5. If **feedback** exists (critic FAIL cycle), append at end with header "## Critic Feedback — Address Every Point"

## Single-agent fallback

If multi-agent dispatch unavailable, execute the pipeline in-context:

1. **Diagnose:** Read the target register profile in `vn-tone-corpus.md` and the violation catalog in `translation-artifacts.md`. Scan the input for Hard Tells, pronoun drift, and register gaps. Produce a violation log.
2. **Polish:** Apply the fixes from the log. Lock one pronoun pair. Walk the text sentence by sentence. Preserve all facts.
3. **Critic:** Run three passes (Hard Tells binary, register consistency, read-aloud). Score against the 36-point rubric. Re-polish once if needed.

Output quality should be equivalent — multi-agent optimizes for focus, not capability.

---

## Route A — Standard Polish (default)

**When:** User provides Vietnamese text and target register (via slash command).

```
1. Pre-Dispatch (per procedures/pre-dispatch.md)
2. LAYER 1 — Dispatch diagnostic-agent
3. Present diagnosis briefly to user:
   "Found [N] Hard Tells, [N] Soft Tells. Top priority: [3 bullets].
    Estimated rewrite: [light/moderate/heavy]. Proceed?"
4. LAYER 2 — Dispatch SEQUENTIALLY:
   - polisher-agent (receives diagnostic output + original text + user directives)
   - critic-agent (receives polisher output + original for side-by-side meaning check)
5. If critic returns FAIL → re-dispatch polisher-agent with critic feedback (max 2 cycles)
6. Deliver artifact
```

## Route B — Called by Another Skill

**When:** Invoked by `brief-shortform`, `write-social`, `write-copy`, `write-ad`, `write-outreach`, `optimize-seo`, `brief-landing-page`, `create-brand`, `brief-graphic`, `plan-campaign`, or any upstream skill that produces Vietnamese output and auto-routes to vn-tone when `market = VN` per its Pre-Dispatch wiring.

```
1. Pre-Dispatch: Read context from calling skill's brief — pull target register from brand voice or user directive (calling skill resolves Register before invoking vn-tone)
2. If content passed a prior VN polish already: skip diagnostic, dispatch polisher-agent + critic-agent only
3. Otherwise: Follow Route A (full pipeline)
4. Return polished output to calling skill (no separate artifact file written by vn-tone in Route B — the calling skill embeds the polished text in its own artifact)
```

Route B does NOT fire the Cold Start question bundle unless the calling skill explicitly delegates Register Resolution to vn-tone.

---

## Layer 1: Diagnosis (single agent)

Spawn the diagnostic agent. Pass:
- `brief` = the Vietnamese input text
- `pre-writing` = the assembled context from Pre-Dispatch (target_register, source_language, brand_glossary, dialect_preference, user_directives, original_text)
- `references` = absolute paths to `vn-tone-corpus.md` and `translation-artifacts.md`
- `upstream` = null (Layer 1)

After the agent returns, **present a brief diagnosis to the user** before proceeding (Route A only; Route B skips user checkpoint):

- Hard Tell count + Soft Tell count
- Top 3 priority fixes (one line each)
- Rewrite scope estimate (light / moderate / heavy)
- Register gap summary (e.g., "currently corporate formal, needs to reach pop-marketing")

Ask: **"Proceed with the polish, or review specific flagged items first?"**

If the user wants to review, walk through each Hard Tell and confirm which to fix vs. keep (e.g., "keep `quý khách` — luxury brand directive"). Pass the user's decisions to polisher-agent as `user_directives` in pre-writing.

---

## Layer 2: Sequential Pipeline

Dispatch these agents **ONE AT A TIME, IN ORDER**:

```
polisher-agent → critic-agent
```

| Step | Agent | File | Receives |
|---|---|---|---|
| 1 | Polisher | `agents/polisher-agent.md` | Diagnostic output (upstream) + original text (brief) + user directives (pre-writing) |
| 2 | Critic | `agents/critic-agent.md` | Polisher output (upstream) + original text (brief) for side-by-side meaning check |

Each agent returns the full document + a change log. The orchestrator passes the complete polisher output to the critic.

---

## Critic Gate

The critic returns one of two verdicts (per `agents/critic-agent.md` 36-point rubric):

### PASS

Text meets all quality standards. Score ≥28/36 AND Hard Tells cleared = 1. Deliver the critic's approved output as the final artifact.

### FAIL

Critic returns specific failures with:

- Which text failed and on which dimension
- Specific fix instructions with rule citations (Category + ID from `translation-artifacts.md` or named convention from `vn-tone-corpus.md`)
- Which agent to re-dispatch (always `polisher-agent` for this skill — vn-tone has no multi-target routing table; single re-dispatch target)

**Rewrite loop:**

1. Read critic's failure report
2. Re-dispatch polisher-agent with critic feedback as the `feedback` input
3. Run the modified output back through the critic
4. **Maximum 2 rewrite cycles.** After 2 failures, deliver the text with critic annotations and flag to the user: "Scored [X]/36 — manual review recommended on [specific issues]." Status: `DONE_WITH_CONCERNS`.

## Chain Position

Horizontal — polishes the output of any skill that produced Vietnamese text. vn-tone is the polish-chain endpoint for Vietnamese; it does NOT route back to any other skill (no `defers-to` chain after polish).

**Typical upstream callers (Route B):** `brief-shortform`, `write-social`, `write-copy`, `write-ad`, `write-outreach`, `optimize-seo`, `brief-landing-page`, `create-brand`, `brief-graphic`, `plan-campaign` — any marketing-skill that produces VN prose and has VN auto-routing wired in its Pre-Dispatch.

**Typical upstream callers (Route A):** external translation tool output, AI translator output, or human non-native VN writer output, manually piped through vn-tone via slash command.

**Re-run triggers:**

- Target register changed (e.g., "actually we want pop-marketing, not semi-casual")
- Brand voice updated in `product-context.md`
- Corpus reference refreshed with new sources (rare — `vn-tone-corpus.md` and `translation-artifacts.md` are stable)

**Skill deference:**

- Source text is in English and needs AI-pattern/voice work before translation → `humanmaxxing` on the English first, translate, then run `polish-vn` on the result
- Need new Vietnamese copy from scratch → `write-copy` with VN voice directives
- Already well-polished but needs A/B variants → `write-copy` variant agent
- Source text is in any non-VN language → translate first (vn-tone is not a translator)
