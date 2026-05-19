---
title: VN-Tone — Format Conventions
lifecycle: canonical
status: stable
produced_by: vn-tone
load_class: PROCEDURE
---

# Format Conventions

**Load when:** polisher-agent composes artifact content OR critic-agent verifies typography/formatting. These conventions are enforced by critic Pass 3 (Typography Correctness, scored 0-5) and Absolute Prohibitions #1, #3, and the typography line in the Quality Gate.

---

## Date format

All dates in **DD/MM/YYYY** (VN-native). No ISO 8601 in the artifact body or quoted dates; no "May 18, 2026" prose; no `5/18/2026` (US-style).

Frontmatter `date:` field uses ISO 8601 (`YYYY-MM-DD`) for machine-readable consistency with the rest of the artifact ecosystem; that's metadata, not content. Content dates (in the polished text, in the Change Log "Before/After" cells) follow VN-native DD/MM/YYYY.

## Pronouns and pronoun pair

The polisher picks ONE pronoun pair (self ↔ reader) at the start of the polish and holds it to the end. This is the load-bearing register decision. Pair options per register:

| Register | Self | Reader | Notes |
|---|---|---|---|
| báo chí | (none — no first person) | (none — no direct address) | Third parties get `ông`/`bà` + title on first mention |
| semi-casual | `mình` (or `tôi` essayist) | `bạn` / `mọi người` | Most common for blogs, SaaS docs, tech community |
| bro-otofun | `em` | `cụ` (singular), `cụ-mợ` (mixed) | Hanoi auto enthusiast forum |
| bro-voz | `mình` | `ae` (singular), `ae-thím` (mixed) | Tech enthusiast forum (Voz) |
| pop-marketing | `chúng mình` (brand) / `mình` (founder) | `bạn` | Consumer marketing, lifestyle, viral |

Brand mode `quý khách` / `quý vị` is reserved for explicit corporate formal notices (airline safety announcements, legal/compliance) — Absolute Prohibition #2 forbids outside those contexts.

Pair drift mid-text = critic Pass 2 auto-FAIL at 3+ drifts (one drift = 6/10, two = 3/10, three = 0/10 + gate auto-FAIL).

## Particle density per register

Sentence-final particles (`ạ`, `nhé`, `nhỉ`, `nha`, `à`, `đấy`, `ấy`):

| Register | Target density | Critic auto-FAIL trigger |
|---|---|---|
| báo chí | 0% (zero) | Any particle (Absolute Prohibition #4) |
| semi-casual | 15–25% (1 in 4-7 sentences) | <10% (too stiff) OR >35% (performative) |
| bro-otofun | 15–25% with `cụ ạ` / `nhé cụ` | Same range |
| bro-voz | 15–25% with `nhé ae` / `đấy thím` | Same range |
| pop-marketing | 15–25% with `nha`/`nhé`/`đấy` | Same range |

Mid-sentence vocatives like `bạn ơi` (mid-clause address) do NOT count toward particle density — only sentence-final particles do.

## Typography rules (Critic Pass 5 — 0-5 binary points)

| Rule | Points | Detection |
|---|---|---|
| No em dashes (`—`) | 1 | Grep for `—` (U+2014). VN uses comma, period, parentheses, or restructure. Absolute Prohibition #1. |
| No Oxford comma before `và` | 1 | Pattern: `, và ` in middle of list. VN lists use `, ` without Oxford comma. |
| No title-case headlines | 1 | Heading checks: sentence case only, proper nouns capitalized. Absolute Prohibition #3. |
| Dates in DD/MM/YYYY | 1 | Pattern: `\d{4}-\d{2}-\d{2}` in body content (frontmatter exempt). |
| VN-native currency / number format | 1 | `1.000.000 ₫` not `1,000,000 VND`; `25 triệu` not `25 million`. |

Score 5/5 = clean; deduct 1 per violation; minimum 0.

## Curly quotes vs straight quotes

Straight quotes (`"..."`) preferred for inline scare quotes (báo chí pattern: `"đình trệ"`, `"hành vi cướp biển"`). Smart curly quotes (`"..."` / `'...'`) are an English-typography intrusion in VN; convert to straight on polish.

Block quotes (offset paragraphs) follow markdown `>` convention; no smart-quote substitution required.

## Frontmatter field order (Artifact Template)

Per the Artifact Template block in SKILL.md body. Required fields in this order:

```yaml
skill: polish-vn
version: 1
date: YYYY-MM-DD
status: done | done_with_concerns | blocked | needs_context
target_register: bao-chi | semi-casual | bro | pop-marketing
subvariant: bro-otofun | bro-voz | null
dialect: north | south | neutral
critic_score: N/36
```

For Route B (called by another skill), `version` may carry the calling skill's version semantics (e.g., `version: short-form-brief-v1`) — orchestrator sets at compile time.

## Body section headers (verbatim)

The polished artifact body sections appear in this order with these exact headers (downstream consumers — currently human readers + upstream calling skills — match on H2):

1. `## Polish Summary` (8-row table: Original words / Polished words / Hard Tells found / Hard Tells fixed / Soft Tells fixed / Pronoun pair / Particle density / Critic score / Cycles used)
2. `## Change Log` (4-column table: Location / Before / After / Rule)
3. `## Polished Text` (full rewritten VN, ready to ship)
4. `## Status` (DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT verdict with concerns/blocking note)

On re-run: rename existing artifact to `[slug].vn-tone.v[N].md` and create new with incremented version (`vN+1`).

## Change Log row format

Each row in the Change Log table is one fix instance:

```
| Location (P-S ref) | "[original quote]" | "[polished quote]" | [rule ID from translation-artifacts.md or vn-tone-corpus.md] |
```

- **Location:** paragraph-sentence reference (e.g., `P2-S3` = paragraph 2, sentence 3)
- **Before / After:** exact verbatim quotes; no paraphrasing
- **Rule:** cite the category + ID (e.g., `A2` for "Wrong formality register for you"; `F1` for em dash; `I2` for throat-clearing) — the critic verifies rule citations are concrete, not vibes-based

## When critic catches a format violation

Critic FAIL on Pass 5 (Typography Correctness) → re-dispatch polisher-agent with the specific Absolute Prohibition or typography rule cited. Format violations are usually one-shot fixes; do not loop past cycle 1 for format-only issues unless other passes also fail.
