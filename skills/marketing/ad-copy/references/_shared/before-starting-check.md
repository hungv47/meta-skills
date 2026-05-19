<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

---
title: Before-Starting Check — pre-execution read pattern every skill applies
lifecycle: canonical
status: stable
produced_by: meta-skills (Phase 1C; Phase 2 refactors adopt into each skill body)
provenance:
  derived_from: implementation-roadmap/execution-evaluation/briefs.md § 1.1 (auto-draft + "Before Starting" check)
  complements: references/_shared/pre-dispatch-protocol.md (this is a pre-step of that protocol's "Read before asking")
  authored_at: 2026-05-16
consumers: every skill (the pre-pre-dispatch step Phase 2 refactors add to each SKILL.md body)
load_class: PLAYBOOK
---

# Before-Starting Check

**The first thing every skill does after invocation, before any question, before any agent dispatch. Reads canonical artifacts + experience substrate. Short-circuits to NEEDS_CONTEXT when foundation is missing.**

This is the *pre-Pre-Dispatch step* — what to read on disk so Pre-Dispatch knows whether to run Warm or Cold Start. Skills cite this file rather than re-explaining the read sequence. Pairs with [pre-dispatch-protocol.md](pre-dispatch-protocol.md) which takes over once the check completes.

---

## The check (4 steps, in order)

### Step 1 — Read canonical-paths.md (once per session)

Verify the skill knows its own artifact contract:

```
Read: implementation-roadmap/canonical-paths.md (if present in repo)
Confirm: skill's declared output path matches the canonical inventory.
If mismatch: stop. Surface "artifact path drift" to operator before proceeding.
```

If `canonical-paths.md` doesn't exist (e.g., user installed only one skill via `npx skills add`), skip — the per-skill SKILL.md is the authoritative contract.

### Step 2 — Read the foundation files (per skill domain)

Each skill reads the canonical files its domain depends on. **Marketing and product skills:**

```
Read: research/product-context.md (the 12-section context — see product-marketing-context-schema.md)
Check frontmatter:
  - `sections_completed: [...]` — which sections are filled vs stubbed
  - `confidence: high | medium | low | mixed` — overall reliability
  - `last_validated: YYYY-MM-DD` — staleness check
Read: brand/BRAND.md (creative marketing skills) or architecture/system-architecture.md (product skills)
```

**Research skills:** Read prior `research/*.md` files in domain.

**Meta skills:** Read `.agents/manifest.json` + `.agents/artifact-index.md` for state.

### Step 3 — Read skills-resources/experience/{relevant-dim}.md

Per the skill's domain, read the matching experience dimension file. Skill-to-dimension mapping:

| Skill domain | Reads experience dimension(s) |
|---|---|
| Marketing creative (copywriting, ad-copy, cold-outreach, social-copy, vn-tone, humanize) | `audience.md`, `brand.md`, `content.md`, `business.md` |
| Marketing brief/system (brand-system, lp-brief, design-brief, short-form-brief, campaign-plan) | `audience.md`, `brand.md`, `business.md`, `goals.md` |
| Marketing eval (lp-eval, seo) | `audience.md`, `content.md`, `goals.md` |
| Product (system-architecture, user-flow, code-cleanup, machine-cleanup, docs-writing) | `product.md`, `technical.md`, `patterns.md` |
| Research (icp-research, market-research, diagnose, prioritize, funnel-planner, short-form-research, short-form-eval) | `audience.md`, `business.md`, `goals.md`, `patterns.md` |
| Meta (eval-loop, agents-panel, task-breakdown, discover, fresh-eyes, cleanup-artifacts, orchestrate-*) | depends per-invocation; typically `patterns.md` + domain-specific |

Read **only** the dimensions the skill needs. Reading all 8 every time bloats Pre-Dispatch.

### Step 4 — Route to Pre-Dispatch (Warm vs Cold)

After steps 1-3, the skill has a complete picture of what's resolvable from disk. Route per [pre-dispatch-protocol.md](pre-dispatch-protocol.md):

- **All needed dimensions resolvable** → Warm Start (short summary + override invitation).
- **≥1 needed dimension missing** → Cold Start (single bundled prompt, 3-5 questions).
- **Foundation file missing AND `--fast` flag NOT set** → NEEDS_CONTEXT (short-circuit; don't fabricate).

---

## Short-circuit conditions (return NEEDS_CONTEXT immediately)

The check fails-fast (returns NEEDS_CONTEXT, no dispatch) when ANY apply:

1. **Foundation file missing for skill domain.**
   - Marketing/product skill called with no `research/product-context.md` → NEEDS_CONTEXT. Route operator to icp-research.
   - Creative marketing skill called with no `brand/BRAND.md` → NEEDS_CONTEXT. Route to brand-system.
   - Product skill called with no `architecture/system-architecture.md` (when product-shape requires it) → NEEDS_CONTEXT. Route to system-architecture.

   **Per-project caveat:** these foundation files (`research/`, `brand/`, `architecture/`) materialize per-project where the stack is installed, not in the agent-skills repo itself. When a skill runs from the agent-skills repo (maintainer context, no host project) and these files are absent, treat as fresh-project bootstrap — do NOT short-circuit. The short-circuit applies only when a skill runs in a project context that should have these files but doesn't.
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
- Steps 1 + 2 (canonical-paths + foundation files). Without these, the skill can't produce sensible output even in `--fast` mode.
- The NEEDS_CONTEXT short-circuit on missing foundation file (condition #1 above). `--fast` produces reduced rigor; it does not produce hallucination.

---

## How skills cite this ref

**At the top of every SKILL.md body** (before any other procedure):

```markdown
## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:
1. Read canonical-paths.md.
2. Read research/product-context.md + brand/BRAND.md.
3. Read skills-resources/experience/{audience,brand,content}.md.
4. If any required foundation is missing → NEEDS_CONTEXT.
5. Otherwise route to Pre-Dispatch per pre-dispatch-protocol.md.

This skill requires sections: <list>. This skill requires brand context: <yes/no>.
```

Skill-specific details (which sections required, which experience dimensions read) go inline. The check pattern itself stays in the ref.

---

## Anti-patterns

1. **Skipping Step 1 because "canonical-paths is too much to read."** It's a 240-line table; agent reads it once per session and caches. Cost is trivial.
2. **Reading all 8 experience dimensions.** Bloats Pre-Dispatch. Read only what the skill needs per the mapping table.
3. **Soft NEEDS_CONTEXT.** Returning `done_with_concerns` when foundation is missing is a sycophancy failure (see [anti-sycophancy.md](anti-sycophancy.md) § "PASS-with-caveats inflation"). If foundation is missing, status is `needs_context`, period.
4. **Re-asking questions answered in product-context.md.** Pre-Dispatch's Cold Start should never re-ask Section 1-12 content if those sections are filled. If a skill is doing this, the check is broken.
5. **`--fast` skipping foundation reads.** `--fast` skips orchestration weight, not correctness floor. Steps 1 + 2 always run.
6. **Treating the check as optional.** Every skill applies it. No exceptions. Skills that "just produce output" without the check are the ones that hallucinate.

---

## Related refs

- [[pre-dispatch-protocol]] — the canonical Pre-Dispatch contract this check feeds into
- [[product-marketing-context-schema]] — the 12-section schema this check reads
- [[mode-resolver]] — `--fast` behavior contract
- [[anti-sycophancy]] — why soft-NEEDS_CONTEXT is failure
- [[artifact-contract-template]] — frontmatter conventions for the files this check reads
- `implementation-roadmap/canonical-paths.md` — Step 1 read target
