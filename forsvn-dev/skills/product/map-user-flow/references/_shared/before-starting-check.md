<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root. -->

---
title: Before-Starting Check — pre-execution read pattern every skill applies
lifecycle: canonical
status: stable
produced_by: forsvn-skills
provenance:
  derived_from: shared pre-execution context-read convention
  complements: references/_shared/pre-dispatch-protocol.md (this is a pre-step of that protocol's "Read before asking")
  authored_at: 2026-05-16
consumers: every skill
load_class: PLAYBOOK
---

# Before-Starting Check

**The first thing every skill does after invocation, before any question, before any agent dispatch. Reads canonical artifacts + experience substrate. Short-circuits to NEEDS_CONTEXT when foundation is missing.**

This is the *pre-Pre-Dispatch step* — what to read on disk so Pre-Dispatch knows whether to run Warm or Cold Start. Skills cite this file rather than re-explaining the read sequence. Pairs with [pre-dispatch-protocol.md](pre-dispatch-protocol.md) which takes over once the check completes.

---

## The check (4 steps, in order)

### Step 1 — Read the skill contract (once per session)

Verify the skill knows its own artifact contract:

```
Read: the invoking skill's SKILL.md frontmatter and routing.yaml (capability section if present).
Confirm: the declared output path matches the skill's documented artifact contract.
If mismatch: stop. Surface "artifact path drift" to operator before proceeding.
```

If the command is routed through `/forsvn`, treat `skills/meta/forsvn/routing.yaml` and the generated `references/capability-index.json` as the routing contract. The per-skill SKILL.md remains authoritative for artifact output; the capability section in `routing.yaml` declares the machine-readable mirror that the index ships to consumers.

### Step 2 — Resolve the foundation artifacts by id (per skill domain)

Foundation artifacts are addressed by **stable logical id**, never by path — the
manifest's `by_id` map resolves an id to its current location (move-safe). Resolve
one with `find-artifacts --resolve <id>`, or get all three layers (TRUTH + OUTPUT +
MEMORY) in a single call with `find-artifacts --context [--stack <stack>]`.

`<stack>` is the optional domain namespace (`meta` · `research` · `marketing` · `product`); omit it to resolve across all stacks. Both commands exit non-zero with no artifact payload when the id (or stack) is unresolvable — treat that as the NEEDS_CONTEXT signal below, not a transient error to retry.

**Marketing and product skills** resolve `id:product-context` (the 12-section context
— see product-marketing-context-schema.md). Check its frontmatter:
  - `sections_completed: [...]` — which sections are filled vs stubbed
  - `confidence: high | medium | low | mixed` — overall reliability
  - `last_validated: YYYY-MM-DD` — staleness check

Creative marketing skills also resolve `id:brand` (+ `id:design`); product skills
resolve `id:architecture` when the work requires it.

**Research skills:** resolve the domain's canonical research artifact by id
(`id:icp-research`, `id:market-research`, `id:diagnose`).

**Meta skills:** read `.forsvn/index/manifest.json` (or `find-artifacts --context`) for state.

An id that does not resolve = the prerequisite has not been produced → route to its
producer skill (NEEDS_CONTEXT). The id is stable; only its path in `by_id` moves.

### Step 3 — Read docs/forsvn/experience/{relevant-dim}.md

Per the skill's domain, read the matching experience dimension file. Skill-to-dimension mapping:

| Skill domain | Reads experience dimension(s) |
|---|---|
| Marketing creative (write-copy, write-ad, write-outreach, write-social, polish-vn, humanmaxxing) | `audience.md`, `brand.md`, `content.md`, `business.md` |
| Marketing brief/system (create-brand, brief-landing-page, brief-graphic, brief-shortform, plan-campaign) | `audience.md`, `brand.md`, `business.md`, `goals.md` |
| Marketing eval (evaluate-landing-page, optimize-seo) | `audience.md`, `content.md`, `goals.md` |
| Product (architect-system, map-user-flow, clean-code, clean-machine, write-docs) | `product.md`, `technical.md`, `patterns.md` |
| Research (research-icp, research-market, diagnose, prioritize, plan-funnel, research-shortform, evaluate-shortform) | `audience.md`, `business.md`, `goals.md`, `patterns.md` |
| Meta (forsvn, run-pipeline, debate-agents, breakdown-tasks, discover, review-work, clean-artifacts) | depends per-invocation; typically `patterns.md` + domain-specific |

Read **only** the dimensions the skill needs. Reading all 8 every time bloats Pre-Dispatch.

### Step 4 — Route to Pre-Dispatch (Warm vs Cold)

After steps 1-3, the skill has a complete picture of what's resolvable from disk. Route per [pre-dispatch-protocol.md](pre-dispatch-protocol.md):

- **All needed dimensions resolvable** → Warm Start (short summary + override invitation).
- **≥1 needed dimension missing** → Cold Start (single bundled prompt, 3-5 questions).
- **Foundation id unresolvable** → NEEDS_CONTEXT (short-circuit; don't fabricate). `--fast` does **not** bypass this — see § "`--fast` behavior".

---

## Short-circuit conditions (return NEEDS_CONTEXT immediately)

The check fails-fast (returns NEEDS_CONTEXT, no dispatch) when ANY apply:

1. **Foundation artifact unresolvable for skill domain.**
   - Marketing/product skill and `id:product-context` does not resolve → NEEDS_CONTEXT. Route operator to research-icp.
   - Creative marketing skill and `id:brand` does not resolve → NEEDS_CONTEXT. Route to create-brand.
   - Product skill and `id:architecture` does not resolve (when product-shape requires it) → NEEDS_CONTEXT. Route to architect-system.

   **Per-project caveat:** these foundation artifacts materialize per-project where the stack is installed, not in the agent-skills repo itself. When a skill runs from the agent-skills repo (maintainer context, no host project) and these files are absent, treat as fresh-project bootstrap — do NOT short-circuit. The short-circuit applies only when a skill runs in a project context that should have these files but doesn't.
2. **`sections_completed` lacks a section the skill requires.**
   - Example: ad-copy needs sections 2, 4, 7, 9, 10. If 7 (Objections) is missing → NEEDS_CONTEXT.
3. **`confidence: low` AND skill is `deep`-budget.**
   - Deep-tier creative work demands reliable foundation. Don't deep-mode on hypotheses.
4. **`last_validated` >180 days old AND skill is `deep`-budget.**
   - Stale context → re-validate before deep work.

For 3 and 4, `--fast` mode is the operator's escape hatch — `--fast` skips these freshness gates (since `--fast` accepts reduced rigor). See [mode-resolver.md](mode-resolver.md) § "What `--fast` does NOT skip" — Cold Start is preserved; freshness gates are bypassable.

---

## `--fast` behavior

`--fast` skips:
- Step 3 dimension reads beyond the strict minimum (skill reads only the single most-critical dimension)
- Confidence + freshness gates (steps short-circuit 3 + 4 above)

`--fast` does NOT skip:
- Steps 1 + 2 (skill contract + id-resolved foundation artifacts). Without these, the skill can't produce sensible output even in `--fast` mode.
- The NEEDS_CONTEXT short-circuit on an unresolvable foundation id (condition #1 above). `--fast` produces reduced rigor; it does not produce hallucination.

---

## How skills cite this ref

**At the top of every SKILL.md body** (before any other procedure):

```markdown
## Before Starting

Apply the [[before-starting-check]] [PLAYBOOK]:
1. Resolve foundation by id: `find-artifacts --context [--stack <domain>]` (one call → TRUTH + OUTPUT + MEMORY), or `find-artifacts --resolve <id>` per prerequisite.
2. For each required prerequisite (e.g. `id:product-context`, `id:brand`), confirm it resolves; read its frontmatter `status` (`done` · `done_with_concerns` · `blocked` · `needs_context`) + staleness (`last_validated`).
3. Read the experience dimensions your domain needs (Step 3 mapping).
4. If any required prerequisite is unresolvable → NEEDS_CONTEXT (recommend its producer).
5. Otherwise route to Pre-Dispatch per pre-dispatch-protocol.md.

This skill requires artifacts: <id-list>. This skill requires brand context: <yes/no>.
```

Skill-specific details (which sections required, which experience dimensions read) go inline. The check pattern itself stays in the ref.

---

## Anti-patterns

1. **Skipping the manifest read because "it's too much."** `find-artifacts --context` is one call; the manifest is a single small JSON. Read it once per session and cache.
2. **Reading all 8 experience dimensions.** Bloats Pre-Dispatch. Read only what the skill needs per the mapping table.
3. **Soft NEEDS_CONTEXT.** Returning `done_with_concerns` when foundation is missing is a sycophancy failure (see [anti-sycophancy.md](anti-sycophancy.md) § "PASS-with-caveats inflation"). If foundation is missing, status is `needs_context`, period.
4. **Re-asking questions answered in `id:product-context`.** Pre-Dispatch's Cold Start should never re-ask Section 1-12 content if those sections are filled. If a skill is doing this, the check is broken.
5. **`--fast` skipping foundation reads.** `--fast` skips orchestration weight, not correctness floor. Steps 1 + 2 always run.
6. **Treating the check as optional.** Every skill applies it. No exceptions. Skills that "just produce output" without the check are the ones that hallucinate.

---

## Related refs

- [[pre-dispatch-protocol]] — the canonical Pre-Dispatch contract this check feeds into
- [[product-marketing-context-schema]] — the 12-section schema this check reads
- [[mode-resolver]] — `--fast` behavior contract
- [[anti-sycophancy]] — why soft-NEEDS_CONTEXT is failure
- [[artifact-contract-template]] — frontmatter conventions for the files this check reads
- `skills/meta/forsvn/routing.yaml` — `/forsvn` capability + prompt-signal routing contract
- `references/capability-index.json` — generated machine-readable capability registry
