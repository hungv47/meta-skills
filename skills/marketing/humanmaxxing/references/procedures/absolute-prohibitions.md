---
title: Humanmaxxing — Absolute Prohibitions
lifecycle: canonical
status: stable
produced_by: humanmaxxing
load_class: PROCEDURE
---

# Absolute Prohibitions — zero tolerance

A single instance ruins credibility. Critic auto-FAILs any output containing these. Apply universally regardless of route, mode, or `--fast` flag.

## 1. No em dashes (—)

Every em dash → comma / period / parentheses. Restructure if needed. See Critical Gate 2.

## 2. No "it's not just X, it's Y" or variants

Includes: "not because X, because Y", "X isn't the problem, Y is", "stops being X and starts being Y". State the positive claim directly.

## 3. No rhetorical questions as hooks

"Why?", "The best part?", "Sound familiar?", "So what does this mean?" — state the point.

## 4. No colons in prose

Not in marketing copy or blog content. Restructure into natural sentences.

## 5. No "actually" as emphasis

"X that actually Y" — delete "actually" or rewrite.

## 6. No filler context phrases

"In today's …", "in the competitive business environment", "rapidly changing", "in an increasingly … world." Delete the entire phrase or sentence.

## 7. No emojis

Any content type.

## 8. No unsourced 47 or 73

Known LLM number biases. Any 47 / 73 must cite a real-world source or be replaced/removed.

## 9. No staccato taglines

"Your X, Y'd" / "X. Y." Rewrite with a specific claim.

---

## Enforcement

- Pattern-scanner-agent flags every instance in its diagnostic report.
- Strip-agent removes every flagged instance unconditionally.
- Critic-agent re-scans the final output before delivery; any surviving instance = auto-FAIL with `BLOCKED` status until re-dispatch resolves.
- `--fast` flag does NOT relax any of these 9.
