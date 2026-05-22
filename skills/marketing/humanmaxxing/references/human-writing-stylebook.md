---
title: Human-Writing Stylebook
lifecycle: canonical
status: stable
produced_by: humanmaxxing
load_class: STYLEBOOK
---

# Human-Writing Stylebook

The 47-pattern catalog tells you what AI writing *looks like* and how to strip it. This stylebook tells you what human writing *is* — the register, rhythm, and structural habits the stripped text should land in. Stripping produces clean text; clean is not the same as written-by-a-person. This file is the doctrine that closes that gap.

It is read after diagnosis, during voice injection and compression, and at the critic gate. It does not replace the four domain catalogs — it organizes them and adds what they miss: forum-native register, per-content-type register profiles, and the no-generic-long-form gate.

## How this fits the reference set

| Reference | Owns | Role |
|---|---|---|
| `ai-patterns.md` | The 47 AI patterns + high-frequency vocabulary | Detection + strip data |
| `voice-injection.md` | Voice-adjective framework, rhythm, specificity, reader presence | Voice technique |
| `conciseness-rules.md` | Filler tables, density rules, depth preservation | Compression technique |
| `detector-resistance.md` | Pangram protocol, proxy checklist, thresholds | Classifier-risk repair |
| **`human-writing-stylebook.md`** (this file) | **Human-writing doctrine, 8 register profiles, the no-generic-long-form gate** | **Target state — what stripped text becomes** |

The catalogs answer "what is wrong and how do I fix the mechanics." This file answers "what should it sound like when I'm done, for *this* content type."

## What makes writing read human

Five properties. Stripping removes AI tells; these are what you inject and verify in their place.

1. **A position, committed.** A human writer decided something and says it. AI hedges toward the center of every question. Take the position the evidence supports, state it once, qualify only where a real condition exists — not for balance.
2. **Specificity that proves the writer was there.** Not only data — texture. The named tool, the exact week, the detail that serves no rhetorical purpose except that it actually happened. Numbers prove a claim; lived detail proves a person.
3. **Rhythm with intent.** Sentence and paragraph length vary because the writer is emphasizing something, not because a template said to. A short sentence lands because the ones around it are long.
4. **Structure that mirrors importance, not symmetry.** The idea that matters gets four paragraphs; the obvious point gets one line. AI gives every section the same weight. Humans don't.
5. **Register matched to the channel.** A forum reply, a landing page, and an internal memo are three different registers. AI writes all three in the same mid-formal essay voice. The register profiles below are the fix.

## Forum-derived rules

Public forum and social writing — Hacker News, Reddit, Lobsters, X, founder LinkedIn — is the most reliably human-sounding prose on the open internet, because the medium punishes essay-mode. Four habits port to all non-formal content.

### Short paragraphs

Forum-native writing breaks every one to three sentences. A wall of text reads as essay-mode, which is the AI default. Default to 1-4 sentence paragraphs; reserve five or more only for a genuinely developed idea. A one-sentence paragraph is legitimate emphasis, not an error. This is the structural side of `ai-patterns.md` Pattern 1 (predictable paragraph structure) — vary the *length*, not just the internal template.

### Fewer formal transitions

"Furthermore," "Moreover," "In conclusion," "It is worth noting that," "Building on that" — these are essay scaffolding. People writing in forums and posts cut the connective sentence and let the line break carry the logic, or use a bare "But," "So," "And." If the next paragraph does not follow without a transition sentence, the section order is wrong — reorder rather than bridge. Cross-references `ai-patterns.md` Pattern 4 (template transitions) and Pattern 23 (redundant bridges).

### Concrete lived detail

The strongest single signal of human authorship is a detail only someone who was there would include. "We shipped it on a Friday and spent the weekend rolling it back" beats "the launch encountered challenges." This is distinct from specificity-as-data: a number proves the *claim*, a lived detail proves the *writer*. Pull lived detail from real product context and brand history — never invent it. Where no real detail exists, fall back to data specificity rather than fabricate texture.

### Less balanced two-sidedness

AI hedges toward symmetry: "on one hand X, on the other Y," every claim shadowed by its counter, every section ending in a measured both-sides wrap. Humans commit. Take the position, acknowledge the single strongest real counter once if one exists, then move on. Do not manufacture a counterargument for balance. This is the inverse of `ai-patterns.md` Pattern 18 (premature certainty) — the fix for unfounded certainty is a *real* condition, not a decorative both-sides. It also reads as the "Argument shape" row of the `detector-resistance.md` proxy: a human reason for the order, not a symmetrical template.

## Content-type register profiles

Eight profiles. Each names the register, rhythm, person, compression target, imperfection posture, and what to encourage or avoid. The orchestrator resolves the content type in Pre-Dispatch; voice-extractor selects the matching profile; soul-injection applies it; critic verifies fit.

### Forum comment

A reply on HN, Reddit, Lobsters, or a Slack/Discord thread. The most human register in the set — the medium rewards bluntness and punishes essays.

- **Register:** casual. Contractions always. Colloquialism fine; jargon fine when the audience uses it.
- **Rhythm:** 1-3 sentence paragraphs. Fragments allowed. Often opens mid-thought.
- **Person:** first-person, freely — "I tried this," "we hit the same thing."
- **Compression:** light (0-10%) — already short; cutting further strips the point.
- **Imperfection:** ON (controlled). Blunt, asymmetric, one-sided is correct here.
- **Encourage:** a single concrete experience; direct agreement or disagreement; the detail that proves you have done the thing.
- **Avoid:** throat-clearing, "Great question," summary closers, balanced both-sides framing, anything that reads like a blog intro.

### Founder post

A building-in-public post on X or LinkedIn, founder voice.

- **Register:** conversational, first-person. The founder's own voice leads; brand voice is secondary.
- **Rhythm:** short paragraphs, one per beat. One story or one number anchors the post.
- **Person:** "I" / "we"; address the reader as "you" sparingly.
- **Compression:** moderate (15-25%).
- **Imperfection:** light-ON. A blunt admission reads as honest.
- **Encourage:** one specific moment — a number, a decision, a mistake; a stated lesson, not a vague one.
- **Avoid:** "thrilled to announce," vision-statement abstraction, rule-of-three, the humble-brag arc.

### Cold DM

Cold email, LinkedIn DM, or Upwork proposal — `content-type: "short-outbound"`.

- **Register:** professional-conversational.
- **Rhythm:** 3-6 sentences total, one or two short paragraphs.
- **Person:** "I" / "we," moving quickly to "you" and the reader's situation.
- **Compression:** 0-10% — every word is load-bearing; `protected_tokens` stay verbatim.
- **Imperfection:** OFF — too short to carry controlled asymmetry; looseness here reads as sloppy.
- **Encourage:** a named entity and a number doing the work; one specific reason you are writing *this* person.
- **Avoid:** filler openers, permission-seeking closers ("let me know if…"), a multi-paragraph pitch, paraphrasing any protected token.

### Blog

A thought-leadership or long-form article.

- **Register:** professional. Author voice, not brand voice.
- **Rhythm:** 2-5 sentence paragraphs; section length varies by importance.
- **Person:** "I" / "we" for thought leadership; reader presence ("you") where the reader is genuinely the subject.
- **Compression:** 15-25%.
- **Imperfection:** OFF — asymmetry comes from rhythm and section weighting, not register looseness.
- **Encourage:** a named example per section; a committed thesis. The no-generic-long-form gate applies.
- **Avoid:** the comprehensive promise, throat-clearing intros, generic positive conclusions, the formulaic challenges-and-future section.

### Docs

Technical documentation, reference, or an API guide.

- **Register:** neutral-professional. Accuracy over personality.
- **Rhythm:** even structure is fine here — predictability aids the reader. Do not vary for its own sake.
- **Person:** second-person imperative ("Run the migration") or neutral.
- **Compression:** 10-15% — cut filler, never coverage.
- **Imperfection:** OFF.
- **Encourage:** precise terms, inline definitions for lay readers, complete edge-case coverage.
- **Avoid:** marketing voice, experience markers, jokes, vague value claims. Colons and structural lists are *acceptable* in docs — Absolute Prohibition #4 targets colons in prose, not reference structure.

### Ad

Paid acquisition copy — a Meta or Google ad, short paid social.

- **Register:** punchy, brand voice.
- **Rhythm:** very short. One claim, one proof, one action.
- **Person:** "you."
- **Compression:** 10-20% — already tight; word-level substitution.
- **Imperfection:** OFF.
- **Encourage:** one concrete claim with a proof point; a single clear action.
- **Avoid:** staccato taglines (Absolute Prohibition #9), feature lists, hedges, the "X but Y" form used more than once.

### Landing-page section

A hero, feature block, or CTA section. humanmaxxing runs on individual sections *after* `brief-landing-page` produces them — never on whole-page architecture.

- **Register:** brand voice, conversion-focused.
- **Rhythm:** scannable and short — a headline plus 1-3 supporting lines.
- **Person:** "you" / "your."
- **Compression:** 25-40% — every word competes for attention.
- **Imperfection:** OFF.
- **Encourage:** a specific value claim tied to the product's real behavior; at most one anchor analogy.
- **Avoid:** staccato taglines, paired synonyms, vague value props, the "X but Y" form used more than once on the page.

### Internal memo

A team-facing decision doc, update, or proposal.

- **Register:** plain, direct, low-ceremony.
- **Rhythm:** short paragraphs; lead with the decision or the ask.
- **Person:** "we" / "I."
- **Compression:** 30-50% — nobody reads long internal docs; compress hard.
- **Imperfection:** light-ON — blunt is fine and fast internally.
- **Encourage:** decision first, then rationale; named owners and dates.
- **Avoid:** corporate hedging, the caveat avalanche, performative warmth, burying the ask.

**Types not listed** inherit the nearest profile: academic / white paper → **Docs** register (formal, accuracy-first), but compression 5-10% — lighter than docs, Hard Tells only; case study → **Blog**; generic marketing copy → **Ad** or **Landing-page section** by length.

## Imperfection as a controlled register option

Imperfection is **off by default** and is **never typos.** It does not mean misspellings, broken grammar, or fabricated mistakes — those read as careless, and a classifier is not fooled by noise. It is never a fake anecdote.

When a register profile marks imperfection ON — forum comment, founder post, internal memo, the casual first-person registers — it means a small, deliberate set of moves a real editor would leave in:

- a blunt one-clause sentence where AI would write a balanced one;
- a paragraph that starts mid-thought instead of with a topic sentence;
- an asymmetric structure — one point gets four sentences, the next gets four words;
- a dropped transition, where the line break carries the logic;
- a stated opinion left one-sided, because the writer actually holds it.

Imperfection is OFF for blog, docs, ad, landing-page section, and cold DM. In long-form and public marketing copy, human texture comes from rhythm, specificity, and section weighting — not register looseness. In cold DM and ad the text is too short to carry controlled asymmetry, and looseness there reads as sloppy.

This is the "Human imperfection" row of the `detector-resistance.md` proxy checklist, made explicit per content type. It never overrides an Absolute Prohibition — em dashes, rhetorical-question hooks, and the rest stay banned in every register.

## The no-generic-long-form gate

A piece can pass the 15% compression floor and still be generic long-form: padded, evenly bloated, saying little per paragraph. The floor measures the cut *from the original*; it does not measure whether the *output* is dense.

**The gate:** take the delivered text and ask — *could this lose another 40% of its words without losing a single unique idea, datum, example, or nuance?* If yes, it is still generic long-form. FAIL, route to compression-agent.

- **Applies to** long-form content: blog, docs, internal memo, white paper, case study.
- **Does not apply to** forum comment, cold DM, ad, or landing-page section — the calibration table's compression caps already govern those, and a 40% test on a 5-sentence cold DM is meaningless.
- **The 40% is a judgment threshold, not a measured cut.** The critic does not produce the shorter version; it judges whether one could exist with equal meaning. If it can, the compression pass under-delivered.
- This is independent of the depth-preservation rule. Depth preservation forbids cutting *meaning*; this gate forbids *keeping filler*. A piece satisfies both only by being genuinely dense.

The compression-agent self-applies this gate before returning (its self-check). The critic verifies it as a hard Quality-Gate item, folded into compression verification.

## How agents read this stylebook

| Agent | Reads this file for |
|---|---|
| voice-extractor | Selecting the content-type register profile; mapping it alongside the voice adjectives |
| soul-injection | Applying the register profile + the forum-derived rules + the imperfection lever (when ON) |
| compression | Self-applying the no-generic-long-form gate; honoring the profile's compression target |
| critic | Verifying register fit + the no-generic-long-form gate as a Quality-Gate item |

Strip-agent and pattern-scanner work from `ai-patterns.md`; the forum-derived rules here cross-reference patterns 1, 4, 18, 23, and 32 rather than restating them.
