---
domain: meta
absorbed-from: skills/meta/orchestrate-meta/ (deleted in 2.0.0 per D6)
consumed-by: /forsvn
---

# Meta Chain

How `/forsvn` routes process intent (scope, debate, decompose, review, loop). Domain dispatch (research / marketing / product) routes via `chains/<domain>.md`; this file covers the cross-cutting process skills.

## Pipeline

Meta is not a linear pipeline — it's a set of process tools wrapped around domain work.

```
discover           — scope unclear, conversation needed
breakdown-tasks    — spec/architecture done, need a buildable task list (forsvn-dev package)
debate-agents       — complex decision, multiple perspectives wanted
run-pipeline       — measurable initiative needs a staged loop workspace (eval-only or full produce-and-measure)
review-work        — post-implementation independent review
clean-artifacts    — .forsvn/ artifact tree needs grooming
```

## Intent → skill

| User says | Route |
|---|---|
| "scope this", "clarify", "what should we build", "requirements unclear" | `/discover` |
| "decompose", "task list", "break down", "implementation order" | `/breakdown-tasks` (forsvn-dev package) |
| "debate this", "multiple perspectives", "poll", "consensus" | `/debate-agents` |
| "generate ideas and rank them", "rank these ideas", "score the ideas" | `/prioritize` (ideation mode — ranking anchor replaces the diagnose gate) |
| "review my work", "second opinion", "did I miss anything" | `/review-work` |
| "improvement loop", "track metric", "experiment ledger" | `/run-pipeline` |
| "groom artifacts", "clean up .forsvn", "audit the artifact tree" | `/clean-artifacts` |

## Routing rules

1. **Single-domain (research/marketing/product)** → route via `chains/<domain>.md` directly to a leaf skill. Don't dispatch through a "meta" wrapper — `/forsvn` *is* the front door.
2. **Process intent** → propose the specific meta-skill with one-line rationale.
3. **Cross-stack** → propose a 2-3 step chain (max 3 hops; ≥5 means project too vague → recommend `/discover` first).
4. **`/breakdown-tasks` is hard-gated** — only recommend if `docs/forsvn/artifacts/meta/specs/*.md` OR `architecture/system-architecture.md` exists.
5. **Wrap-around:** if the recommendation touches security/auth/data-mutation/critical artifacts → append `(optional /review-work after)`.
6. **Don't `/discover` defensively** — patronizing when intent is clear; only recommend for genuinely unclear scope.
7. **`/run-pipeline`** is the prerequisite for `/evaluate-landing-page` and similar in-loop evaluations.

## Anti-patterns

- Routing to a "wrapper" skill when `/forsvn` can dispatch direct.
- Long cross-stack chains (≥5 hops) — recommend `/discover` instead.
- Defensive `/discover` on every ambiguous-seeming request.
- Recommending `/breakdown-tasks` without spec or architecture upstream.
