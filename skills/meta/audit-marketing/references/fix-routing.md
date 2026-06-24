---
title: Audit-Marketing — category → fixer routing
lifecycle: canonical
status: stable
produced_by: audit-marketing
load_class: PROCEDURE
---

# Fix routing — which fixer repairs which antipattern family

**The per-finding `fixSkill` (carried on every scanner finding, sourced from the S1 registry) is authoritative.** This table is its documented mirror — the registry and the table agree by construction; if they ever disagree at runtime, **the finding's `fixSkill` wins**. Use the table only to reason about a family when no finding is in hand.

The nine antipattern families are identified by the `mkt-*` id prefix (the registry's own `category` field is the coarser `slop | quality` — do not use it for routing).

| Family (id prefix) | Fixer | Why |
|---|---|---|
| `mkt-slop-*` — AI-slop lexicon & cadence | `/humanmaxxing` | strip the tell, preserve the claim |
| `mkt-voice-*` — voice / register | `/humanmaxxing` | re-register without changing the message |
| `mkt-struct-*` — structure & scannability | `/humanmaxxing` | re-shape for the surface |
| `mkt-channel-*` — channel-fit | `/humanmaxxing` | adapt to the platform's format |
| `mkt-provider-*` — model-identity tells (claude/gpt/gemini fingerprints) | `/humanmaxxing` | strip the provider tell, keep the message |
| `mkt-hook-*` — hook / lede | `/write-copy` | regenerate the weak unit, not a synonym swap |
| `mkt-claim-*` — claim quality | `/write-copy` | re-ground the claim in proof |
| `mkt-cta-*` — CTA | `/write-copy` | pair the action with a payoff |
| `mkt-persuasion-*` — persuasion structure | `/write-copy` | restore the PAS/AIDA spine |

**VN override.** A finding tagged Vietnamese-register / translation-artifact routes to `/polish-vn` regardless of family default — Vietnamese tone is its own fixer of record.

## Cross-artifact / structural-only → human-review (never a confident auto-fix)

These need context a single in-scope artifact can't supply, or are structural decisions the fixers shouldn't make blind. Route them to a **human-review note** in the report's Deferred subsection:

- `mkt-cta-bait-and-switch` — needs the paired ad + landing page both in scope to compare verbs.
- `mkt-claim-competitor-swap-fail` — when the paired/comparison artifact is absent.
- `mkt-persuasion-no-social-proof` — the fix is *supplying* a named proof, not rewording; a human owns which proof.
- `mkt-struct-headline-overflow` — the fix is a length/placement decision against the platform cap; surface the measured overage, let the human cut.

## Route C invocation contract (per fixer)

Dispatch via the Skill tool, embedded + caller-driven, **passing `protected_tokens`** so the fixer preserves every number / URL / entity / CTA verb-phrase. Group Accepted findings by `fixSkill` → **one fixer run per artifact**, listing the target rule ids. The fixer returns its Change Log `{ Location, Original, Change, Rule }`, which the re-verify gate diffs. The fixers already implement Route C + protected tokens — reuse verbatim; this skill adds no fix code.
