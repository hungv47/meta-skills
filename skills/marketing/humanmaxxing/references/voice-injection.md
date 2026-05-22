# Voice Injection

Stripping AI patterns produces clean copy. Clean is not the same as good. Content that's been scrubbed but not re-voiced reads like a legal document — technically correct, completely forgettable. This reference covers how to inject personality after stripping.

---

## The Sterility Problem

AI-stripped content has a specific failure mode: it reads like no one wrote it. There's no perspective, no rhythm variation, no word that surprises you. The copy is correct but anonymous.

Signs of sterile copy:
- Every sentence is 12-18 words (uniform length)
- No first-person or experience markers
- No colloquialisms or informal language
- No sentence fragments or one-word paragraphs
- Every paragraph could be attributed to any brand in the industry
- It reads like a Wikipedia article, not a person talking

Sterile copy passes the AI pattern audit but fails the human test: "Would I forward this to a colleague with 'you should read this'?"

---

## Voice Adjective Framework

Voice is defined by 3-5 adjectives from product context. Each adjective has concrete implications for writing:

| Adjective | Sentence Length | Word Choice | Allowed Moves |
|-----------|----------------|-------------|---------------|
| **Direct** | Short (6-12 words avg) | Anglo-Saxon over Latin roots | Imperatives, fragments, one-sentence paragraphs |
| **Warm** | Medium (10-18 words) | Inclusive pronouns, conversational | "You" and "we," rhetorical questions, asides |
| **Technical** | Varies by concept | Domain-specific, precise | Jargon when accurate, inline definitions for lay readers |
| **Playful** | Short-medium, varied | Unexpected word pairings | Analogies, pop culture, deliberate rule-breaking |
| **Authoritative** | Medium-long (12-20 words) | Definitive verbs (is, does, requires) | Data reference, named sources, declarative statements |
| **Honest** | internal | Plain language, no euphemisms | Admitting limitations, "we don't know yet" |
| **Provocative** | Short, punchy | Contrarian framing | Bold claims (backed by evidence), challenging assumptions |
| **Empathetic** | Medium, natural rhythm | Feeling words, acknowledgment | Naming the reader's frustration before solving it |

**How to use:** Read the voice adjectives from `research/product-context.md`. For each adjective, apply its column constraints. Where adjectives conflict (e.g., "direct" + "warm"), alternate — a warm sentence followed by a direct one creates rhythm.

---

## Rhythm and Variation

AI writes in metronome rhythm: every sentence is roughly the same length, every paragraph is 3-4 sentences, every section follows the same pattern. Human writing breathes.

### Sentence Rhythm
Vary sentence length deliberately:

**Bad (AI rhythm):**
> "Our platform helps teams collaborate effectively. It provides real-time updates across all channels. Teams can track progress without switching between tools. This saves time and reduces friction in daily workflows."

Every sentence: 7-9 words. Monotone.

**Good (human rhythm):**
> "Teams waste hours switching between tools just to figure out who's doing what. Our platform kills that. One screen, real-time updates, no tab-juggling. The average team saves 6 hours a week, mostly from meetings they no longer need."

Sentence lengths: 15, 4, 7, 17. The short sentence ("Our platform kills that.") lands hard because the sentences around it are longer.

### The 1-3-1 Pattern
A useful rhythm template (not a rule — vary it):
- 1 short sentence (punch)
- 3 medium sentences (development)
- 1 short sentence (landing)

### Paragraph Rhythm
Not every paragraph needs to be the same length. Let the important idea get 4-5 sentences. Let the obvious point get one.

---

## Specificity as Personality

The fastest path from anonymous copy to distinctive writing is specificity. Vague writing sounds like AI. Specific writing sounds like someone who was there.

| Generic (AI) | Specific (Human) |
|--------------|-----------------|
| "Many companies have seen success" | "Stripe cut their deploy time from 4 hours to 15 minutes" |
| "This approach improves efficiency" | "Engineers ship 3x more PRs per week without working longer hours" |
| "Leading industry experts agree" | "Kent Beck called it 'the first testing framework I actually like'" |
| "A significant improvement" | "Error rates dropped from 12% to 0.3%" |
| "In today's competitive landscape" | "In a market where Figma, Canva, and Adobe are all racing to ship AI features" |

**Rule:** If a sentence could appear in any company's content, it's not specific enough. Replace every abstract claim with a concrete one — a name, a number, a date, a place.

---

## First-Person and Experience Markers

Human writing has a point of view. A person wrote it, and that person has opinions, experiences, and things they've seen.

Experience markers that signal human authorship:
- "We tried X and it didn't work because..."
- "In my experience..."
- "I've seen teams make this mistake..."
- "When we launched..."
- "The thing nobody tells you about X is..."

**Usage rules:**
- Use first-person when the brand voice allows it (most B2B SaaS, blogs, social)
- Avoid first-person in documentation, legal, formal reports
- "We" for company perspective, "I" for individual thought leadership
- Don't fabricate experiences — use real company stories from product context

---

## Reader Presence

AI defaults to third-person generalization — floating above the scene, narrating from a distance. Human writing puts the reader inside the scene. This technique replaces distant observations with direct address.

| Distant (AI) | Present (Human) |
|--------------|-----------------|
| "Nobody designed this." | "You didn't sit down and design this." |
| "People tend to avoid hard conversations." | "You avoid the hard conversation. Everyone does." |
| "The industry is shifting toward X." | "Your competitors shipped X last quarter." |
| "Organizations struggle with retention." | "You're losing people. You probably know exactly who's next." |
| "This happens because teams lack alignment." | "Your team isn't aligned — and the standups aren't fixing it." |

**When to apply:**
- Any sentence where "people," "organizations," "teams," or "companies" could be replaced with "you" or "your"
- Any sentence where "nobody" or "everyone" creates false universality — scope it to the reader's experience
- Any declarative observation that would hit harder as a direct statement

**When NOT to apply:**
- Documentation and technical writing (maintain neutral register)
- Academic or research content (maintain formal distance)
- When the reader genuinely isn't the subject — don't force "you" into sentences about third parties

This technique pairs with Pattern 32 (Narrator-from-a-Distance) in [ai-patterns.md](ai-patterns.md). Use Pattern 32 to detect, this section to fix.

---

## Colloquialism Calibration

The right level of informal language depends on the content type and audience:

| Level | Examples | Use For |
|-------|---------|---------|
| **Formal** | No contractions, no colloquialisms | White papers, enterprise proposals, legal |
| **Professional** | Contractions OK, minimal slang | Blog posts, case studies, email marketing |
| **Conversational** | Contractions, idioms, rhetorical questions | Social posts, newsletters, community content |
| **Casual** | Slang, sentence fragments, internet-native | Social media, internal comms, community forums |

**Key rule:** Contractions ("don't" vs "do not") are the easiest lever. Formal writing avoids them. Everything else uses them. AI-generated content under-uses contractions — this alone makes copy sound robotic.

Colloquialisms to use with care:
- Idioms ("move the needle," "low-hanging fruit") — fine in conversation, stale in writing
- Internet-native ("TLDR," "hot take") — only in casual channels
- Industry slang ("dogfooding," "bikeshedding") — only when audience uses it themselves

---

## Voice Injection Anti-Patterns

### Forced Humor
Don't add jokes to be "relatable." Bad humor is worse than no humor. If a line isn't genuinely funny, it reads as trying too hard.

### Exclamation Marks as Energy
Adding exclamation marks does not make copy energetic. It makes it loud. Energy comes from short sentences, strong verbs, and unexpected specificity.

### Filler for Warmth
"We're really excited to share..." is not warmth — it's filler. Warmth comes from acknowledging the reader's reality: "You've been asking for this since Q2. Here it is."

### Copy-Paste Personality
Using the same voice markers in every piece. If every blog post starts with a one-word paragraph and ends with a callback joke, the pattern becomes as predictable as AI. Vary your moves.

### Voice Cosplay
Adopting a personality that doesn't match the brand. A fintech compliance tool shouldn't sound like a skate brand. Read the voice adjectives — they're constraints, not suggestions.

### Over-Personality
Not every sentence needs flavor. Let data, evidence, and straightforward statements carry themselves. Season, don't smother.
