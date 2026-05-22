---
title: Humanmaxxing — Format Conventions
lifecycle: canonical
status: stable
produced_by: humanmaxxing
load_class: PROCEDURE
---

# Format Conventions

**Load when:** compression-agent / soul-injection-agent / strip-agent compose artifact content OR critic-agent verifies typography/format. These conventions are enforced by critic Pass 1 (Absolute Prohibitions binary gate) and Pass 3 (Density + Authenticity dimensions).

---

## Date format

Frontmatter `date:` field uses ISO 8601 (`YYYY-MM-DD`) for machine-readable consistency with the rest of the artifact ecosystem. Content dates inside the humanmaxxed text follow the source convention (don't reformat dates inside quoted passages or named-entity references).

## Typography rules (load-bearing — critic Pass 1 binary gate)

| Rule | Detection | Source |
|---|---|---|
| Zero em dashes (`—` U+2014) | Grep for `—` in final output. ZERO allowed. | Absolute Prohibition #1 |
| No "it's not just X, it's Y" | Grep for patterns: `not just .{1,50} it's`, `isn't .{1,30} is`, `stops being .{1,30} starts being`, `not because .{1,30} because` | Absolute Prohibition #2 |
| No standalone rhetorical questions as hooks | Pattern: paragraph-leading `Why?`, `The best part?`, `Sound familiar?`, `So what does this mean?` | Absolute Prohibition #3 |
| No colons in prose | Pattern: `: ` after non-list, non-heading content in marketing/blog copy (documentation exempt) | Absolute Prohibition #4 |
| No "actually" as emphasis | Pattern: `X that actually Y`, `but actually`, standalone `actually,` | Absolute Prohibition #5 |
| No filler context phrases | Pattern: `In today's`, `in the competitive`, `rapidly changing`, `in an increasingly` | Absolute Prohibition #6 |
| No emojis | Any emoji code point | Absolute Prohibition #7 |
| No unsourced 47 or 73 | Pattern: bare numbers `47` or `73` in body without inline citation | Absolute Prohibition #8 |
| No staccato taglines | Pattern: `Your X, Y'd` (e.g., "Your Workflows, Mapped") or `X. Y.` two-word fragmentary headlines | Absolute Prohibition #9 |

A single violation of any Absolute Prohibition = critic Pass 1 auto-FAIL regardless of total score.

## Frontmatter field order (Artifact Template)

Per the Artifact Template block in SKILL.md body. Required fields in this order:

```yaml
skill: humanmaxxing
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
compression: N%
detector_status: not_run | proxy_pass | proxy_fail | pangram_pass | pangram_fail
protected_tokens_preserved: true | false | N/A
```

For Route C (called by another skill), `version` may carry the calling skill's version semantics (e.g., `version: copywriting-v2`); orchestrator sets at compile time.

## Body section headers (verbatim)

The polished artifact body sections appear in this order with these exact headers (downstream consumers — currently human readers + upstream calling skills — match on H2):

1. `## Humanization Summary` (10-row table: Words original / Words humanmaxxed / Compression / AI patterns found / AI patterns fixed / Hard Tells remaining / Soft Tells remaining / Quality score / Detector status / Protected tokens preserved)
2. `## Change Log` (4-column table: Location / Original / Change / Rule)
3. (Humanmaxxed content body — H2 sections from the original preserved as-is, no re-titling)

On re-run: rename existing artifact to `[slug].humanmaxxed.v[N].md` and create new with incremented version (`vN+1`).

## Change Log row format

Each row in the Change Log table is one edit:

```
| Location (para/section) | "[original text]" | "[new text]" or [deleted] | Pattern #[N] / Compression / Voice |
```

- **Location:** paragraph-section reference (e.g., `Para 1, S1` = paragraph 1, sentence 1; or `H2 "Onboarding section"`)
- **Original / Change:** exact verbatim quotes from before/after; for deletions, write `[deleted]` in the Change cell
- **Rule:** cite the rule by ID (e.g., `Pattern #21` from `ai-patterns.md`; `Compression: setup elimination` from `conciseness-rules.md`; `Voice: specificity` from `voice-injection.md`) — the critic verifies rule citations are concrete, not vibes-based

## Quality score format

Frontmatter `quality_score` (also shown in Humanization Summary table) follows this format:

```
Quality score | [X]/50 (Di:[n] R:[n] T:[n] A:[n] De:[n])
```

Where:
- Di = Directness (0-10) — strip-agent owns
- R = Rhythm (0-10) — soul-injection-agent owns
- T = Trust (0-10) — soul-injection or strip owns (depending on cause)
- A = Authenticity (0-10) — soul-injection-agent owns
- De = Density (0-10) — soul-injection (add specificity) or revert compression owns

PASS threshold: total ≥35/50 AND zero Absolute Prohibition violations. Below either → FAIL → re-dispatch named agent.

## detector_status field values (Detector-Resistance Verification)

The frontmatter `detector_status:` field MUST be one of these 5 values (per `detector-resistance.md`):

| Value | When |
|---|---|
| `not_run` | Detector mode explicitly disabled OR low-stakes internal material (default for Route A, internal docs) |
| `proxy_pass` | Detector mode = `proxy` AND proxy checklist passed (argument shape / specificity source / register variance / semantic compression / human imperfection all clean) |
| `proxy_fail` | Detector mode = `proxy` AND proxy checklist found at least one structural fingerprint remaining |
| `pangram_pass` | Detector mode = `pangram` AND classifier returned ≥configured threshold (default 0.95 marketing / 0.99 admissions) |
| `pangram_fail` | Detector mode = `pangram` AND classifier returned below threshold |

Never fabricate a value — if no detector was run AND not explicitly disabled, the run is BLOCKED until a mode is set.

## protected_tokens_preserved field values

| Value | When |
|---|---|
| `true` | `protected_tokens` list was passed by upstream caller AND every token appears verbatim in final output |
| `false` | `protected_tokens` list was passed BUT one or more tokens missing or paraphrased in final output (= critic auto-FAIL, re-dispatch responsible agent) |
| `N/A` | No `protected_tokens` list passed (typical for Route A and Route B without upstream caller) |

## When critic catches a format violation

Critic FAIL on Absolute Prohibitions (Pass 1) → re-dispatch strip-agent with the specific prohibition cited. Format violations are usually one-shot fixes; do not loop past cycle 1 for format-only issues unless other dimensions also fail.

Critic FAIL on Detector-Resistance Verification (after normal critic PASS) → re-dispatch soul-injection-agent for structural variance + specificity repair, then compression-agent, then critic-agent. Max 2 cycles total per the rewrite loop.
