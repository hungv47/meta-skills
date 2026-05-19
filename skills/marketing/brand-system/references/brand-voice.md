# Brand Voice & Messaging

Frameworks for defining how a brand speaks, what it says, and how tone shifts across contexts.

## Voice vs. Tone

**Voice** is constant — the brand's personality expressed through language. It never changes regardless of channel or context. If the brand were a person, voice is their personality.

**Tone** is variable — it shifts depending on who you're talking to, what you're saying, and where you're saying it. Same person, different situations. A doctor is professional in a consultation and casual at a barbecue — same voice, different tone.

## Voice Framework

### The Voice Chart

The standard documentation format. Define 3-5 voice attributes, each with four columns:

| Attribute | Description | Do | Don't |
|-----------|-------------|-----|-------|
| [Trait 1] | What this means for our brand specifically | Specific real-world example of doing it right | Specific example of doing it wrong |
| [Trait 2] | What this means | Do example | Don't example |
| [Trait 3] | What this means | Do example | Don't example |

**Rules for voice attributes:**
- 3-5 attributes maximum. More creates confusion.
- Each attribute must be specific to *your* brand, not generic ("we're friendly" says nothing — HOW are you friendly?)
- Use the "but not" qualifier: "Confident but not arrogant," "Playful but not childish," "Direct but not cold"
- Include real before/after copy examples for each attribute
- Test: could a competitor claim the exact same attributes? If yes, they're too generic.

### Example Voice Chart

For a fintech app targeting young professionals:

| Attribute | Description | Do | Don't |
|-----------|-------------|-----|-------|
| **Straight-talking** | We explain money clearly without jargon or condescension. We respect your intelligence. | "Your savings rate is 4.2%. Here's what that actually means for you." | "Leverage our innovative yield optimization engine for maximum returns." |
| **Encouraging** | We celebrate progress without being patronizing. We acknowledge that money is stressful. | "You saved $200 more than last month. That's real momentum." | "Great job, buddy! You're such a good saver! 🎉🎉🎉" |
| **Honest** | We tell the truth even when it's uncomfortable. We never hide fees, risks, or limitations. | "This investment carries risk. Here's what could go wrong." | "Guaranteed returns! No risk! Sign up now!" |

## Tone Spectrum

### The Four Dimensions (NN/g Model)

Every piece of brand writing sits on four independent spectra:

```
Formal ←————————→ Casual
Serious ←————————→ Funny
Respectful ←————————→ Irreverent
Enthusiastic ←———————→ Matter-of-fact
```

Plot your brand's **default position** on each spectrum, then document how tone shifts across contexts.

### Tone by Context

| Context | Formal/Casual | Serious/Funny | Respectful/Irreverent | Enthusiastic/Matter-of-fact |
|---------|:---:|:---:|:---:|:---:|
| Homepage/marketing | Casual | Neutral | Respectful | Enthusiastic |
| Product UI | Casual | Neutral | Respectful | internal |
| Onboarding | Casual | Light humor | Respectful | Enthusiastic |
| Error messages | Casual | Serious | Respectful | internal |
| Help documentation | Neutral | Serious | Respectful | internal |
| Social media | Casual | Funny | Slightly irreverent | Enthusiastic |
| Legal/compliance | Formal | Serious | Respectful | internal |
| Success/celebration | Casual | Light humor | Respectful | Enthusiastic |
| Customer support | Casual | Serious | Respectful | Neutral |

### Tone Shift Examples

Show the same message across different tones:

**Informing user of a system outage:**
- Marketing voice: "We're experiencing issues right now. We're on it and will update you soon."
- Support voice: "We know this is frustrating. Our team is actively working on the issue. Here's what we know so far..."
- Technical voice: "Service degradation detected at 14:32 UTC. Incident response in progress. Status: investigating."

**Confirming a successful action:**
- Product UI: "Done. Your changes are saved."
- Email: "Your account is all set. Here's what you can do next."
- Social: "You're in! Welcome to the crew."

## Writing Guidelines

### General Rules

**Sentence structure:**
- Active voice by default ("We shipped your order" not "Your order has been shipped")
- Short sentences for clarity. Long sentences for nuance. Vary for rhythm.
- One idea per sentence in UI copy
- Front-load the important information

**Word choice:**
- Plain English over jargon
- Specific over vague ("3 minutes" not "shortly")
- Positive framing over negative ("Save your work" not "Don't lose your work")
- Action verbs for CTAs ("Start free trial" not "Submit" or "Click here")

**Pronouns:**
- "You" for the user (second person)
- "We" for the brand (first person plural) — or "I" if brand personality is very personal
- Avoid "the user" or third-person references to the audience

**Punctuation and mechanics:**
- Sentence case for headings (not Title Case)
- Oxford comma (or explicitly no Oxford comma — pick one and be consistent)
- Contractions are [okay / not okay] — define based on formality level
- Exclamation marks: [sparingly / never / context-specific] — define the policy
- Emoji: [permitted in social only / never / context-specific]

### On-Brand vs. Off-Brand Examples

Provide side-by-side comparisons for common scenarios:

| Scenario | internal | internal |
|----------|----------|-----------|
| **Welcome message** | "Welcome. Let's get you set up — it takes about 2 minutes." | "Welcome to [Product]!!! We're SO excited you're here! 🎉" |
| **Error message** | "Something went wrong loading your data. Try refreshing, or contact us if it keeps happening." | "Error 500: Internal Server Error. Contact system administrator." |
| **Empty state** | "No projects yet. Create your first one to get started." | "Oops! Looks like there's nothing here. Why not add something? 😊" |
| **Feature announcement** | "You can now export to PDF. Here's how." | "EXCITING NEWS! We're THRILLED to announce our revolutionary new PDF export feature!" |
| **Upgrade prompt** | "This feature is on the Pro plan. See what's included." | "UPGRADE NOW to unlock this premium feature! Limited time offer!" |
| **Confirmation** | "Deleted. You can undo this for the next 30 seconds." | "Are you sure you want to delete this? This action cannot be undone! ⚠️" |

## Messaging Architecture

The hierarchy of what the brand says, organized from most compressed to most expanded.

### Hierarchy Structure

```
 ┌─────────┐
 │ Tagline │ ← 2-7 words, maximum compression
 └────┬────┘
 ┌───────┴────────┐
 │ Elevator Pitch │ ← 25 words / 20 seconds
 └───────┬────────┘
 ┌────────────┴──────────────┐
 │ Value Proposition │ ← 1-2 sentences
 └────────────┬──────────────┘
 ┌─────────────────┴────────────────────┐
 │ Messaging Pillars (3-5) │ ← Core themes + proof points
 └─────────────────┬────────────────────┘
 ┌──────────────────────┴───────────────────────────┐
 │ Boilerplate Descriptions (multiple lengths) │ ← Full narrative
 └──────────────────────────────────────────────────┘
```

### Component Specifications

**Tagline** (2-7 words):
- The big idea, compressed to its essence
- Must be memorable, ownable, and evocative
- Not a description of what you do — a crystallization of what you stand for
- Test: can a competitor use this tagline? If yes, it's not distinctive enough

**Elevator pitch** (~25 words / ~20 seconds spoken):
- What you do, for whom, and why it matters
- Must be deliverable in one breath
- Structure: [What you do] + [for whom] + [key differentiation]

**Value proposition** (1-2 sentences):
- Articulates both functional AND emotional benefits
- Structure: "We help [who] do [what] by [how], so they can [outcome]"
- Must answer: "Why should I choose you over alternatives?"

**Messaging pillars** (3-5):
- Core strategic themes that support the value proposition
- Each pillar has: headline, supporting narrative (2-3 sentences), proof points (3-5)
- Pillars should be mutually exclusive, collectively exhaustive (MECE)
- Test: if you removed one pillar, would the value proposition still stand?

**Boilerplate descriptions** (multiple lengths):
- One-liner (~10 words): For social bios, footers
- Short (~50 words): For email signatures, brief mentions
- Standard (~100 words): For press releases, about pages
- Full (~200 words): For partner materials, comprehensive about sections

### Audience-Specific Messaging

Different audiences care about different things. Map messaging variations:

| Audience Segment | Primary Message | Proof Points to Emphasize | Tone Adjustment |
|-----------------|----------------|--------------------------|-----------------|
| [Segment A] | [What matters most to them] | [Which evidence resonates] | [How tone shifts] |
| [Segment B] | [What matters most] | [Which evidence] | [Tone shift] |

## Voice Audit Checklist

Use this to evaluate whether a piece of content is on-brand:

- [ ] Does it sound like our brand personality (archetype)?
- [ ] Does it match our voice attributes?
- [ ] Is the tone appropriate for this specific context?
- [ ] Active voice used (unless passive is intentionally chosen)?
- [ ] Plain English — no unnecessary jargon?
- [ ] Specific over vague?
- [ ] Positive framing where possible?
- [ ] Consistent with our pronoun and punctuation rules?
- [ ] Would the audience feel respected after reading this?
- [ ] Could a competitor write this exact same thing? (If yes, it's not distinctive enough)
