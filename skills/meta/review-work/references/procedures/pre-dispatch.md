# Pre-Dispatch — Warm/Cold Start Prompts

Pre-dispatch protocol for review-work. Loaded at orchestration time, not into SKILL.md context.

Run [`../_shared/pre-dispatch-protocol.md`](../_shared/pre-dispatch-protocol.md) first. Needed dimensions: diff/branch reference, risk class (security / performance / correctness / all), prior reviewer feedback if any, requirements the work was supposed to implement.

## Warm Start (invoked at end of build session, spec known)

```
Git state:
! `git status --short 2>/dev/null | head -10 | grep . || echo "(working tree clean)"`

Branch / recent commits:
! `{ git branch --show-current; git log --oneline -5; } 2>/dev/null | grep . || echo "(no git history)"`

Target auto-detected per review-setup.md § Target detection (working-tree vs branch-vs-base vs last-commit) — confirm or adjust below.
Reviewing against [spec.md / tasks.md / inline requirements].
Risk class: [auto-detected: security touched, money/PII flag, etc.] — adjust?
```

## Cold Start (no upstream session)

```
fresh-eyes runs an independent post-implementation review. Before I dispatch:

1. What to review — diff, branch, file paths, or paste.
2. Risk class — security / performance / correctness / consistency / all.
   Auto-trigger applies for security / auth / crypto / money / PII regardless.
3. Original intent — paste the spec or one-paragraph description of what this
   code is supposed to do. Without this, review only catches obvious bugs, not
   goal-fit problems.

Answer 1-3 in one response. I'll dispatch reviewer + resolver.
```
