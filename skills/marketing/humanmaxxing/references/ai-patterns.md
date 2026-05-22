# AI Writing Patterns — Detection & Fix Reference

47 patterns across 8 categories. Each pattern includes severity:
- **Hard Tell** — Immediately flags content as AI-generated. Fix before publishing.
- **Soft Tell** — Suspicious in clusters. Fix when 3+ appear in the same piece.

---

## High-Frequency AI Vocabulary

These words appear significantly more often in post-2023 AI-generated text than in human writing. A single instance is fine — clusters of 3+ in one piece are a signal.

> additionally, agentic, agentful, align (with), at scale, comprehensive, crucial, cutting-edge, deep dive, delve, dynamic, ecosystem, elevate, empower, endeavor, enhance, ensure, evolving, foster, furthermore, game-changer, garner, harness, highlight, holistic, implement, innovative, interplay, intricate, journey, landscape, leverage, load-bearing, meticulous, model-native, moreover, multifaceted, navigate, north star, notably, optimize, overarching, pain point, pivotal, realm, resonate, revolutionize, robust, seamless, showcase, space (as in "the AI space"), stakeholder, streamline, tapestry, testament, transformative, underscore, unlock, utilize, vibe shift, vibe-coded, vibrant

**Sophistication-seeking words** (above) are chosen to sound impressive. The list below covers a different failure mode:

**Lazy extremes** — false-authority words that substitute for evidence:

> always, every, everyone, everybody, never, nobody

These make claims sound definitive without providing proof. "Everyone struggles with onboarding" is unfalsifiable filler. "68% of trial users drop off before day 3" is a claim. Replace with specifics or scope the claim honestly.

**Rule:** When you spot 3+ of these in a paragraph, flag the paragraph for rewrite. Replace each with a plain-language equivalent or delete if the sentence works without it.

---

## High-Frequency AI Phrases

Exact phrases to search for. Unlike the vocabulary list (individual words that cluster), these are multi-word constructions that are almost always AI-generated.

### Emphasis Crutches (delete on sight)
- "Full stop."
- "Let that sink in."
- "Make no mistake"
- "Read that again."
- "And that's the point."

### Meta-Commentary (delete — the writing should speak for itself)
- "In this section, we'll..."
- "As we'll see..."
- "Let me walk you through..."
- "Before we dive in..."
- "Here's the thing:"

### Performative Emphasis (delete — if it needs a promise, it's not convincing)
- "I promise"
- "This is what X actually looks like"
- "X that actually Y" (any sentence using "actually" as emphasis)
- "And I mean that"
- "Seriously."
- "No, really."

### Rhetorical Questions as Hooks (delete — these perform curiosity instead of creating it)
- "Why?" (standalone)
- "The best part?"
- "So what does this mean?"
- "Sound familiar?"
- "But here's the question:"
- "Want to know the secret?"
- Any one-sentence question used as a paragraph opener to create false suspense. State the point directly instead.

### Filler Context Phrases (delete on sight — vague scene-setting that says nothing)
- "In today's [anything]" (environment, world, landscape, economy, market)
- "In the competitive business environment"
- "In an increasingly [anything] world"
- "As the world becomes more [anything]"
- "In this rapidly changing [anything]"
- "Being inclusive" (as a standalone virtue signal)
- Any sentence that could apply to any industry, any company, any decade

### False Insight Phrases (delete — these perform wisdom instead of providing it)
- "Imagine a world where..." / "Imagine if..."
- "Here's the kicker"
- "Spoiler alert:"
- "At the end of the day"
- "It goes without saying"
- "(yes, really)" / "(and that's okay)"
- "The short answer is..."
- "Let's be honest"
- "The reality is..."
- "Here's what most people get wrong"

### Business Jargon (replace with plain equivalents)
Note: "navigate" and "landscape" also appear in the vocabulary list above. The vocabulary list flags clusters; this table provides direct replacements.

| AI Jargon | Plain Equivalent |
|-----------|-----------------|
| navigate | handle |
| unpack | explain |
| lean into | accept |
| landscape | situation |
| deep dive | analysis |
| double down | commit |
| circle back | revisit |
| moving forward | next |

---

## Category 1: Content Structure

### 1. Predictable Paragraph Structure
**Severity:** Hard Tell
**Description:** Every paragraph follows the same template: topic sentence → explanation → example → transition. Human writing varies — some paragraphs are one sentence, others build through three ideas before landing.
**Example:**
> "Project management is essential for team success. It helps teams stay organized and meet deadlines. For example, companies using project management tools see 28% better results. This shows the importance of proper planning."
**Fix:** Vary paragraph length between 1-6 sentences. Let some paragraphs start with evidence, others with a question, others mid-thought. Delete the topic sentence entirely when the paragraph is clear without it.

### 2. Symmetric Lists
**Severity:** Soft Tell
**Description:** Every list item is the same length, same structure, same level of detail. Human lists are messy — the important item gets three lines, the obvious one gets four words.
**Example:**
> - **Communication:** Effective communication ensures all team members are aligned...
> - **Organization:** Strong organization skills help maintain project timelines...
> - **Leadership:** Good leadership inspires team members to perform...
**Fix:** Let list items vary in length. The most important point gets the most space. Some items can be a single phrase. Drop the bold label when the item is self-explanatory.

### 3. Section Uniformity
**Severity:** Soft Tell
**Description:** Every section is roughly the same length and follows the same internal structure. Human writers spend 500 words on the thing that matters and 50 on the thing that doesn't.
**Example:** A blog post where "Why It Matters," "How It Works," and "Getting Started" are each exactly 3 paragraphs with a subheading, a list, and a closing line.
**Fix:** Let section length reflect importance. Cut thin sections entirely or merge them into a stronger section. Not every section needs a subheading.

### 4. Template Transitions
**Severity:** Hard Tell
**Description:** Connective tissue between sections follows formulaic patterns: "Now that we've covered X, let's look at Y" or "With that in mind." Human writing either transitions implicitly or uses a single word.
**Example:**
> "Now that we've explored the benefits, let's dive into the implementation details."
**Fix:** Delete the transition entirely. If the reader can't follow without it, the section order is wrong. When a transition is genuinely needed: "But," "So," "Here's the thing," or just a line break.

### 5. Formulaic "Challenges and Future" Sections
**Severity:** Hard Tell
**Description:** AI-generated articles include formulaic sections that follow a predictable pattern: acknowledge challenges → "despite these challenges" → optimistic future outlook. The structure is: problem → pivot → hope.
**Example:**
> "Despite these challenges, the future of remote work looks promising. As technology continues to evolve, teams will find new and innovative ways to collaborate effectively. The possibilities are truly exciting."
**Fix:** If challenges are real, state them with specifics and consequences. If the future section adds nothing concrete (no dates, no plans, no evidence), delete it. "The future looks bright" is never a useful sentence.

---

## Category 2: Language Quirks

### 6. Paired Synonyms
**Severity:** Hard Tell
**Description:** Two words that mean the same thing joined by "and" — a verbal tic AI uses for emphasis that humans rarely do.
**Example:** "clear and concise," "robust and reliable," "innovative and cutting-edge," "simple and straightforward," "comprehensive and thorough"
**Fix:** Pick one. "Clear" or "concise" — never both. If you can't pick, neither word is specific enough. Replace with what you actually mean.

### 7. Copula Avoidance
**Severity:** Hard Tell
**Description:** Substituting elaborate constructions for simple "is/are": "serves as," "stands as," "represents," "marks," "boasts," "features," "offers." AI does this to sound more sophisticated; it just sounds bureaucratic.
**Example:**
> "Gallery 825 serves as LAAA's primary exhibition space and stands as a testament to the organization's commitment to the arts."
**Fix:** Use "is." "Gallery 825 is LAAA's exhibition space." Simple copulas are invisible to the reader — elaborate substitutes draw attention to themselves.

### 8. Hedge Stacking
**Severity:** Hard Tell
**Description:** Multiple hedges in one sentence: "It's worth noting that this could potentially help somewhat improve..." Human writers hedge once or commit.
**Example:**
> "It's important to note that this approach might potentially offer some benefits in certain situations."
**Fix:** Commit or cut. "This approach works when [specific condition]." One hedge per paragraph maximum. If you're not sure enough to state it, cut the claim entirely.

### 9. Superficial -ing Phrase Tacking
**Severity:** Hard Tell
**Description:** Appending present participle phrases to sentences to add fake analytical depth: "highlighting the importance of," "underscoring the need for," "showcasing the potential of," "reflecting broader trends in." The -ing phrase adds no information the sentence didn't already convey.
**Example:**
> "The temple's vibrant colors reflect centuries of regional tradition, showcasing the community's deep connection to its heritage and highlighting the enduring importance of cultural preservation."
**Fix:** Delete the -ing phrase. If the sentence still makes sense (it almost always does), the phrase was filler. If the -ing phrase genuinely adds new information, promote it to its own sentence.

### 10. Vague Attributions
**Severity:** Hard Tell
**Description:** Attributing claims to unnamed authorities: "Experts argue," "Industry reports suggest," "Observers have noted," "Some critics believe," "Studies show." Human writers name their sources.
**Example:**
> "Industry experts believe this technology will play a crucial role in the future of healthcare. Several studies have shown promising results."
**Fix:** Name the source and date. "A 2024 Stanford study found..." or "Kent Beck argues..." If you can't name the source, the claim is unsubstantiated — either find the source or cut the claim.

### 38. Load-Bearing X
**Severity:** Hard Tell
**Description:** Using "load-bearing" as an intensifier to claim a single word, assumption, or phrase is doing all the work in a sentence or argument. Originated as an engineering/architecture metaphor; post-2024 AI-generated criticism abuses it for instant analytical gravitas. The word it modifies is usually not actually load-bearing — the writer is performing precision, not demonstrating it.
**Example:**
> "The load-bearing word in that sentence is 'eventually.' Everything else is window dressing."
**Fix:** Either prove the claim with the delete-test ("remove X and the argument collapses because Y"), or cut "load-bearing" and state the actual point. If the word really is doing all the work, name what fails without it.

### 44. "Quietly" / "Silently" as Rebrand Intensifier
**Severity:** Soft Tell
**Description:** Modifying neutral verbs with "quietly" or "silently" to manufacture intrigue around an action that was, in fact, public, documented, or unremarkable. AI uses this to make routine product updates sound like covert operations. Common targets: "quietly shipped," "silently rolled out," "quietly raised," "silently became the default."
**Example:**
> "Notion quietly shipped a new pricing model. Anthropic silently became the default for code generation."
**Fix:** Drop the adverb if the move was announced ("Notion shipped a new pricing model — see their April changelog"). If the move really was unannounced, uses the evidence trail: "Notion shipped a new pricing model with no blog post, no email, no in-product notification — spotted by a user on April 12." "Quietly" without a trail is rumor dressed as reporting.

### 47. Agentic-Era Jargon Cluster
**Severity:** Soft Tell
**Description:** A specific post-2024 jargon family — *agentic, agentful, model-native, vibe-coded, vibe shift, the year of agents* — that LLMs cluster heavily in tech and AI commentary. Individual terms appear in the high-frequency vocabulary list above (single instances are fine). Three or more from this cluster in the same piece signals AI-generated trend commentary. Distinct from the general vocabulary check because the mechanism is domain-specific (AI-era discourse) and the cluster is named, not dispersed.
**Example:**
> "We're entering the agentic era — model-native workflows, agentful tooling, and a real vibe shift toward production-grade AI."
**Fix:** Pick the one term doing actual work and cut the rest. "Production-grade AI tooling is now competitive with hand-coded workflows for [specific task]." If the piece needs three or more of these terms to land its point, the point isn't real — it's vibe commentary masquerading as analysis.

---

## Category 3: Style Tells

### 11. Exclamation Inflation
**Severity:** Hard Tell
**Description:** Exclamation marks used for enthusiasm rather than genuine surprise or command. More than one per 500 words signals AI.
**Example:**
> "Great news! Our new feature is live! Try it today and see the difference!"
**Fix:** Remove all exclamation marks. Add back only where the sentence genuinely demands one (commands, actual surprise, direct quotes). Maximum one per 500 words.

### 12. Em-Dash Usage
**Severity:** Hard Tell
**Description:** Em dashes (—) are a hallmark of AI-generated text. AI uses them as a structural crutch to insert asides, create pauses, and connect clauses where commas, periods, or parentheses would work. Even a single em dash flags the content as AI.
**Example:**
> "Our platform — built for modern teams — offers real-time collaboration — making it easy to stay aligned — no matter where your team is located."
**Fix:** Replace ALL em dashes. Use commas, periods, parentheses, or restructure the sentence. Zero em dashes in the final output. No exceptions. If an aside is important enough to include, make it its own sentence. If it's not, cut it.

### 13. Emoji as Punctuation
**Severity:** Hard Tell
**Description:** Emojis used as bullet points, section markers, or emphasis rather than genuine expression. Especially: rocket, fire, check mark, point-right, lightbulb.
**Example:**
> "Key features: Speed, Reliability, Scale"
**Fix:** Remove all structural emojis. Use emojis only where the brand voice genuinely calls for them and only in casual channels (social, chat). Never in long-form content.

### 14. Bold-Keyword Highlighting
**Severity:** Soft Tell
**Description:** Bolding the "key term" in every paragraph as a scanning aid, or using inline bold headers ("**User Experience:** The user experience...") to structure prose. Human writers bold for emphasis on specific phrases, not systematically.
**Example:** Every paragraph has one **bolded keyword** that summarizes the point, or every list item starts with a **Bold Label:** followed by explanation.
**Fix:** Remove systematic bolding. Bold only when a specific phrase genuinely needs emphasis — max 2-3 per 1,000 words. Convert bold-label lists into flowing prose when the items aren't genuinely parallel.

### 15. Title Case in Headings
**Severity:** Soft Tell
**Description:** Capitalizing All Main Words In Every Heading. AI defaults to title case; most modern style guides and human writers use sentence case.
**Example:**
> "Strategic Negotiations And Global Partnerships In The Modern Era"
**Fix:** Use sentence case: "Strategic negotiations and global partnerships." Only capitalize the first word and proper nouns unless the brand style guide explicitly requires title case.

---

## Category 4: Communication Habits

### 16. False Empathy Opener
**Severity:** Hard Tell
**Description:** Opening with performed understanding: "I understand how frustrating this can be" or "That's a great point" before the actual response. Human empathy is specific, not formulaic.
**Example:**
> "I completely understand where you're coming from. This is indeed a challenging situation that many teams face."
**Fix:** Delete the empathy line. Start with the substance. If empathy is needed, make it specific: "Migrating mid-sprint is brutal" instead of "I understand how challenging that can be."

### 17. "Great Question" Prefix
**Severity:** Hard Tell
**Description:** Validating the reader before answering: "Great question!" "That's an excellent point." "This is such an important topic." Empty calories before the meal.
**Example:**
> "Great question! This is something many people wonder about. Let me break it down for you."
**Fix:** Delete entirely. Answer the question. The reader knows their question is good — they asked it.

### 18. Premature Certainty
**Severity:** Soft Tell
**Description:** Confident claims about contested or nuanced topics without qualification. AI tends toward definitive statements where humans would hedge appropriately.
**Example:**
> "The best approach is always to use microservices for any application that needs to scale."
**Fix:** Add genuine nuance — not hedge stacking (pattern #8), but actual conditions: "Microservices make sense when your team is large enough to own separate services. Below ~20 engineers, the coordination overhead usually costs more than the flexibility gains."

### 19. Caveat Avalanche
**Severity:** Hard Tell
**Description:** Excessive disclaimers and qualifiers, especially at the end: "Of course, results may vary. It's important to consider your specific situation. Always consult with a professional." CYA energy.
**Example:**
> "However, it's important to note that every situation is unique. Results may vary depending on your specific circumstances. Always consult with relevant stakeholders before making any decisions. This is not professional advice."
**Fix:** One caveat maximum, and only when it's genuinely important. Place it inline where it's relevant, not as a footer. If you need to disclaim, make it specific: "This won't work if your database is sharded" instead of "results may vary."

### 20. Permission-Seeking Closers
**Severity:** Hard Tell
**Description:** Ending with "Let me know if you'd like me to..." or "Would you like me to elaborate on any of these points?" or "Feel free to ask if you have any questions!" Signals assistant mode.
**Example:**
> "I hope this helps! Let me know if you'd like me to go deeper into any of these areas. Feel free to reach out if you have any other questions!"
**Fix:** End with the content. If there's a natural next step, state it as a recommendation, not an offer: "Next step: audit your top 5 pages against these patterns" instead of "Let me know if you'd like me to audit your pages."

---

## Category 5: Filler Patterns

### 21. Throat-Clearing Intros
**Severity:** Hard Tell
**Description:** One or more sentences before the actual content begins: "In today's fast-paced digital landscape..." or "When it comes to marketing..." These are warm-up sentences the writer (or AI) needed but the reader doesn't.
**Example:**
> "In today's rapidly evolving business landscape, companies of all sizes are discovering the importance of effective communication strategies."
**Fix:** Delete every sentence before the first one that says something specific. The right opening is usually your second or third sentence.

**Also flag these sentence starters** (common residual tells after stripping the obvious throat-clearers):
- **Wh- setup starters:** "What makes this hard is..." → State the constraint directly: "The constraint is..."
- **Paragraphs starting with "So"** — conversational filler disguised as a logical connector. Delete "So" or replace with the actual logical link.
- **Sentences starting with "Look,"** — performs directness rather than being direct. Delete "Look," and the sentence is already direct.

### 22. "Comprehensive" Promise
**Severity:** Hard Tell
**Description:** Promising completeness: "This comprehensive guide will cover everything you need to know about..." or "Here's a complete breakdown of..." Human writers rarely promise comprehensiveness because they know they can't deliver it.
**Example:**
> "This comprehensive guide will walk you through everything you need to know about content strategy, from planning to execution."
**Fix:** Delete the promise. Start with the content. The reader will judge completeness for themselves.

### 23. Redundant Bridges
**Severity:** Soft Tell
**Description:** Sentences that exist only to connect two ideas that don't need connecting: "With this in mind," "Building on that," "Taking it a step further," "That said." Bridge words are fine; bridge sentences are filler.
**Example:**
> "Taking all of this into consideration, it becomes clear that we need to think about the next step. Building on the foundation we've established, let's explore what this means in practice."
**Fix:** Delete the bridge sentence. If the next paragraph doesn't follow logically without it, the structure is wrong — reorganize rather than bridge.

### 24. Safety-Net Qualifier
**Severity:** Soft Tell
**Description:** Softening every recommendation: "You might want to consider..." "One approach could be..." "It may be worth exploring..." Human experts state their recommendation, then qualify only when genuinely uncertain.
**Example:**
> "You might want to consider looking into implementing some form of automated testing, as it could potentially help reduce bugs."
**Fix:** State the recommendation directly: "Add automated tests to your CI pipeline." Qualify only when the recommendation genuinely depends on context the reader has and you don't.

### 25. Generic Positive Conclusions
**Severity:** Hard Tell
**Description:** Vague upbeat endings that promise a bright future without specifics: "The future looks bright," "Exciting times lie ahead," "The possibilities are endless." Distinct from formulaic conclusions (#5) — this is specifically the empty optimism problem.
**Example:**
> "As we look to the future, the possibilities are truly exciting. With continued innovation and dedication, we can achieve remarkable things together."
**Fix:** Replace with a specific, measurable next step or prediction. "Q3 goal: reduce onboarding time to under 48 hours" instead of "the future looks bright." If there's no concrete forward-looking statement to make, end before the conclusion.

### 39. "It's Giving X"
**Severity:** Hard Tell
**Description:** Performative cultural signaling using TikTok-derived "it's giving" syntax to attach an aesthetic label to something. AI uses this to sound culturally fluent; the construction is so overused it now reads as cultural cosplay. Common variants attach to eras ("giving 2015 SaaS"), company-types ("giving startup-pivot"), or vibes ("giving collapse energy").
**Example:**
> "The new redesign is giving 2015 SaaS. The launch copy is giving startup-pivot energy."
**Fix:** State what's actually being observed. "The redesign uses a gradient hero, three feature columns, and a vague stock illustration — the same template every 2015 SaaS landing page used." Specific observation beats vibe-labeling. If you can't name the concrete element, the comparison is decorative.

### 41. "X Has Entered the Chat"
**Severity:** Hard Tell
**Description:** Meme-derived construction that anthropomorphizes an abstract concept arriving in a discussion. AI uses it to insert false momentum into prose. The phrase peaked in 2020 Slack culture and now reads as both lazy and dated. Especially common when the writer wants to claim a shift but lacks the data to back it.
**Example:**
> "Authenticity has entered the chat. Compliance has entered the chat. Reality has entered the chat."
**Fix:** State what changed and who noticed. "After three quarters of growth-at-all-costs, the finance team started asking about retention." Delete the meme frame entirely — the construction adds nothing the named actor and named change don't already say.

### 42. "What If I Told You"
**Severity:** Hard Tell
**Description:** Matrix-meme-derived false-insight opener that performs revelation. AI uses it to manufacture suspense before stating something the reader either already knows or could deduce. The phrase loads expectations the substance can't pay off, which is why it's almost always followed by a flat or obvious claim. Sibling to the False Insight Phrases list above; promoted to a numbered pattern because the construction is recognizable enough to scan for on sight.
**Example:**
> "What if I told you the most successful teams don't measure individual productivity at all?"
**Fix:** State the claim directly with evidence. "Stripe, Linear, and Vercel all stopped using individual productivity metrics by 2024 — they measure team-level shipping velocity instead." If the claim isn't strong enough to stand without a setup, the claim isn't strong enough to publish.

### 43. "X Is Having a Moment"
**Severity:** Hard Tell
**Description:** Trend manufacturing without evidence. AI uses "having a moment" / "is having its moment" to assert cultural relevance for something the writer wants to discuss. The phrase substitutes for the actual evidence of relevance (search trends, revenue data, named-instance examples). One instance per piece is suspicious; two or more is a confession.
**Example:**
> "Long-form newsletters are having a moment. Asynchronous communication is having its moment. Founder-led marketing is having a moment."
**Fix:** uses the actual signal. "Substack revenue grew 4x in 2024," or "Three of the top five YC W25 companies have founder-on-camera marketing as their primary acquisition channel." If no signal exists, the moment doesn't exist either — cut the sentence.

### 46. "X Is the New Y"
**Severity:** Soft Tell
**Description:** Trend-manufacturing template that asserts replacement without evidence. AI uses "X is the new Y" to invent generational shifts ("Vibe-coding is the new pair programming," "Async is the new sync," "Newsletters are the new blogs"). Same family as #43 ("having a moment") — substitutes phrasing for the actual signal that the replacement is happening. Flagged Soft rather than Hard because the construction has a legitimate human-writing pedigree ("orange is the new black"); the tell is volume and absence of data.
**Example:**
> "Threads is the new Twitter. Newsletters are the new blogs. Vibe-coding is the new pair programming."
**Fix:** uses the displacement — share-of-time, share-of-spend, share-of-attention numbers with sources. If the replacement is real, the data is loud. If it's not, "X is the new Y" is wishful thinking dressed as observation.

---

## Category 6: Structural Tics

### 26. Rule of Three Overuse
**Severity:** Soft Tell
**Description:** AI forces ideas into groups of three to appear comprehensive and rhythmic. Human writing groups by what actually exists, not by what sounds balanced.
**Example:**
> "The conference featured keynote sessions, panel discussions, and networking opportunities — creating a vibrant atmosphere of learning, collaboration, and innovation."
**Fix:** Use the actual number. If there are two things, list two. If there are five, list five (or the most important two). Don't pad to three or trim to three for rhythm.

### 27. Negative Parallelism
**Severity:** Hard Tell
**Description:** "It's not just X; it's Y" / "Not only...but also..." is one of the most recognizable AI writing patterns. It sounds profound but says nothing. Never use it.
**Example:**
> "It's not just about the technology; it's about the people. It's not just a tool; it's a movement."
**Common variants** (same construction, different wrapper):
- "Not because X. Because Y."
- "[X] isn't the problem. [Y] is."
- "The answer isn't X. It's Y."
- "It feels like X. It's actually Y."
- "stops being X and starts being Y"
- "X that actually Y" (using "actually" to reframe)

**Fix:** State the positive claim directly. "The value is in how teams use it" instead of "It's not just a tool; it's a movement." Do not use this construction or any of its variants. Zero instances in the final output.

### 28. Synonym Cycling
**Severity:** Soft Tell
**Description:** AI has repetition-penalty code that causes excessive synonym substitution. The same entity gets called "the platform," "the tool," "the solution," "the system," "the product" across consecutive paragraphs. Human writers repeat the same word or use pronouns.
**Example:** A product review that cycles through "the device," "the gadget," "the unit," "the hardware," "the product" when referring to the same phone.
**Fix:** Pick one term and stick with it. Use "it" for subsequent references in the same paragraph. Synonym cycling draws more attention than repetition — readers notice inconsistency more than they notice a word appearing twice.

### 29. False Ranges
**Severity:** Soft Tell
**Description:** Using "from X to Y" constructions where X and Y aren't meaningfully on a scale or spectrum. AI uses this to sound comprehensive.
**Example:**
> "The platform handles everything from the singularity of the Big Bang to the grand cosmic web of modern data infrastructure."
**Fix:** List the actual things. "The platform handles ingestion, transformation, and storage" is clearer than a false range. Use "from X to Y" only when X and Y are genuine endpoints of a meaningful spectrum.

### 30. Colon-List Dependency
**Severity:** Hard Tell
**Description:** Over-reliance on colons to introduce lists, explanations, or emphasis. AI uses colons as a structural crutch: "Here's what/why/how:" followed by a bulleted list, or "The answer: [dramatic reveal]." Colons in prose signal AI formatting habits. In humanmaxxed output, avoid colons entirely.
**Example:**
> "Here's why this matters:
> - Reason one
> - Reason two
> - Reason three"
**Fix:** Integrate items into a sentence. "This matters because [reason one], and teams that ignore it [consequence]." For technical documentation or tables, colons may be acceptable. In marketing copy, blog posts, and general prose, eliminate colons. Restructure "X: Y" constructions into natural sentences.

### 40. Anaphora Cascade
**Severity:** Hard Tell
**Description:** Three or more consecutive sentences or paragraphs starting with the same word or phrase. AI uses anaphora to manufacture rhetorical weight; one or two instances are rhetoric, three is a tell. Especially common with "We," "They," "This," "It's," "Imagine," "Every," "No." Distinct from #1 (predictable paragraph structure) — that's about internal paragraph templates; this is the opener-level case visible at a glance.
**Example:**
> "We believe in shipping fast. We believe in customer obsession. We believe in compound trust over time."
**Fix:** Vary the openers. Combine two sentences into one. If the rhetorical weight is genuinely needed, cap the anaphora at exactly two sentences — never three. The third repetition crosses from rhetoric into pattern, and pattern reads as AI.

### 45. "X, but Y" Headline Form
**Severity:** Soft Tell
**Description:** Positioning headline construction — "X, but Y" or "X for Y" — used to anchor a product to a known reference. Examples: "An IDE, but for AI." / "Notion, but fast." / "Slack, but quiet." Legitimate when X is the right anchor for the buyer's existing mental model; overused when X is unrelated to the buyer's actual workflow, or when two or more headlines on the same page use the same construction. Distinct from #37 staccato tagline — that's a fragmentary punch ("Analytics. Simplified."); this is an analogy clause.
**Example:**
> "A spreadsheet, but for AI. A CRM, but for builders. A database, but for vibes."
**Fix:** Use the form once per page maximum, and only when X is genuinely the buyer's current tool. Replace duplicates with claims grounded in your product's specific behavior. If X is wrong (e.g., positioning a dev tool against a consumer app), the headline is theater — pick a different anchor or write a direct claim.

### 37. Staccato Tagline Construction
**Severity:** Hard Tell
**Description:** Fragmentary headlines built from a noun (or "Your [noun]") paired with a past participle or adjective, separated by a comma or period. AI generates these to sound punchy and memorable, but they are so overused they have become an instant AI fingerprint. Two common forms: "Your X, Y'd" ("Your Workflows, Mapped") and "X. Y." ("Analytics. Simplified."). Often used as hero headlines, section headers, or taglines.
**Common variants (Hard Tell — flag on sight):**
- "Your [Noun], [Past Participle]." — "Your Data, Protected." / "Your Growth, Unlocked." / "Your Ideas, Realized."
- "[Noun]. [Past Participle/Adjective]." — "Analytics. Simplified." / "Code. Shipped." / "Compliance. Solved." / "Design. Elevated."

**Weaker variants (flag only when clustered with the above or repeated 2+ times in the same piece):**
- "[Noun]. [Noun]." — "Insight. Action." / "Speed. Scale."
- "[Adjective] [Noun]. [Adverb/Adjective] [Noun]." — "Better Data. Smarter Decisions."

These weaker forms predate AI and appear in legitimate human copywriting. A single instance in a slide deck or callout is not a tell. Two or more in the same piece, or one combined with the Hard Tell variants above, is a signal.
**Example:**
> "Your Workflows, Mapped" / "Insights. Delivered." / "Your Security, Simplified."
**Fix:** Write a headline that says something specific. "Your Workflows, Mapped" becomes "See every workflow in one view." "Analytics. Simplified." becomes "One dashboard instead of twelve." The fragmented form sounds clever but communicates nothing — it is a structure pretending to be a message.

---

## Category 7: Agency & Perspective Tells

### 31. False Agency
**Severity:** Hard Tell
**Description:** Inanimate things given human verbs — attributing intention, desire, or action to concepts, data, markets, or abstractions. AI does this to sound analytical; it reads as evasive because it hides who actually did the thing.
**Example:**
> "The data tells us that retention is declining. The culture shifts toward remote work. The market rewards companies that move fast."
**Fix:** Name the actor. "We looked at the data — retention dropped 12% in Q3." "More employees are choosing remote." "Customers are switching to faster competitors." If you can't name who does the verb, the sentence is too abstract.

### 32. Narrator-from-a-Distance
**Severity:** Soft Tell
**Description:** Floating above the scene, observing and commentating without being inside it. The writing reads like a documentary voiceover — omniscient, detached, slightly condescending. AI defaults to this because it has no actual position in the scene.
**Example:**
> "Nobody designed this to happen. This is simply how organizations evolve. People tend to avoid hard conversations until the cost becomes unavoidable."
**Fix:** Put the reader (or the writer) inside the scene. Replace "nobody" and "people" with "you" or "we." See the Reader Presence table in [voice-injection.md](voice-injection.md) for specific rewrites.

### 33. Vague Declaratives
**Severity:** Hard Tell
**Description:** Announcing that something is important, significant, or high-stakes without naming what it is or why. The sentence performs emphasis instead of providing it. AI uses these as paragraph openers to build false momentum.
**Example:**
> "The implications are significant. The stakes are high. This matters more than most people realize."
**Fix:** Replace with the actual implication, the actual stake, the actual reason it matters. "If this migration fails, we lose 3 months of pipeline data" instead of "The stakes are high." If you can't name the specific consequence, delete the sentence.

---

## Category 8: Number & Data Tells

### 34. AI-Typical "Random" Numbers
**Severity:** Hard Tell
**Description:** LLMs disproportionately select 47 and 73 when generating a "random" number. These are known AI fingerprints. If a number appears in content without a cited source and happens to be 47 or 73, it was likely AI-generated.
**Example:**
> "We surveyed 47 companies and found..." or "The team grew from 12 to 73 engineers in two years."
**Fix:** If the number comes from real data, uses the source. If the number was generated to sound specific, replace it with an actual data point or remove the false precision entirely.

### 35. Round Number Bias
**Severity:** Soft Tell
**Description:** AI defaults to clean, round figures: 50%, 30%, 10x, 100%, 3x. Real data has ugly numbers. When every stat in a piece is suspiciously round, the numbers were likely invented for rhetorical effect.
**Example:**
> "Companies see a 50% improvement in productivity and a 30% reduction in costs, delivering 10x ROI."
**Fix:** Use real numbers with their actual messiness: "47.3% improvement" or "2.7x ROI." If you don't have real data, remove the number rather than inventing a round one. One round number is fine; three in a row is a tell.

### 36. Fabricated Precision
**Severity:** Hard Tell
**Description:** AI invents specific-sounding statistics with no source. The number sounds precise enough to be real but was hallucinated. Often paired with vague attributions (pattern #10): "Studies show 73% of users prefer..." or "Research indicates a 4.2x improvement."
**Example:**
> "Studies show that 73% of users abandon onboarding before completing it, costing companies an average of $47,000 per quarter."
**Fix:** Every specific number needs a named source and date. "Mixpanel's 2024 benchmark found 68% of trial users drop before day 3." If you can't uses the source, remove the stat. Unsourced precision is worse than no number at all — it looks like a lie.

---

## Quick Scan Checklist

When auditing content, scan in this order (most obvious tells first):

1. **Hard Tells** — Any single one flags the content
 - [ ] Throat-clearing intro (21)
 - [ ] "Great question" / false empathy (16, 17)
 - [ ] Paired synonyms (6)
 - [ ] Copula avoidance (7)
 - [ ] Superficial -ing tacking (9)
 - [ ] Vague attributions (10)
 - [ ] Template transitions (4)
 - [ ] Formulaic "challenges and future" (5)
 - [ ] Permission-seeking closer (20)
 - [ ] Hedge stacking (8)
 - [ ] Exclamation inflation (11)
 - [ ] "Comprehensive" promise (22)
 - [ ] Emoji as punctuation (13)
 - [ ] Caveat avalanche (19)
 - [ ] Generic positive conclusion (25)
 - [ ] Predictable paragraph structure (1)
 - [ ] False agency (31)
 - [ ] Vague declaratives (33)
 - [ ] Em dashes — any instance (12)
 - [ ] Negative parallelism — "it's not just X, it's Y" and all variants (27)
 - [ ] Colon-list dependency — colons in prose (30)
 - [ ] Rhetorical questions as hooks — "Why?", "The best part?", "Sound familiar?" (phrases list)
 - [ ] "Actually" as emphasis — "X that actually Y" (phrases list)
 - [ ] Filler context — "In today's [anything]", "rapidly changing" (phrases list)
 - [ ] False insight phrases — "Imagine a world where...", "Here's the kicker", "Let's be honest" (phrases list)
 - [ ] AI-typical numbers — 47 or 73 as "random" numbers without cited source (34)
 - [ ] Fabricated precision — specific stats with no named source (36)
 - [ ] Staccato tagline — "Your X, Y'd" or "X. Y." fragmentary headlines (37)
 - [ ] Load-bearing X used as intensifier (38)
 - [ ] "It's giving X" / cultural-vibe label (39)
 - [ ] Anaphora cascade — 3+ consecutive same-opener sentences (40)
 - [ ] "X has entered the chat" — meme-arrival framing (41)
 - [ ] "What if I told you" — Matrix-meme opener (42)
 - [ ] "X is having a moment" — manufactured trend without evidence (43)

2. **Soft Tells** — Flag when 3+ appear in the same piece
 - [ ] Symmetric lists (2)
 - [ ] Section uniformity (3)
 - [ ] Premature certainty (18)
 - [ ] Bold-keyword highlighting (14)
 - [ ] Title case in headings (15)
 - [ ] Redundant bridges (23)
 - [ ] Safety-net qualifier (24)
 - [ ] Rule of three overuse (26)
 - [ ] Synonym cycling (28)
 - [ ] False ranges (29)
 - [ ] Narrator-from-a-distance (32)
 - [ ] Round number bias — all stats suspiciously clean (50%, 30%, 10x) (35)
 - [ ] "Quietly" / "silently" as rebrand intensifier without evidence trail (44)
 - [ ] "X, but Y" headline form — 2+ uses on same page or wrong anchor (45)
 - [ ] "X is the new Y" — replacement claim without displacement data (46)
 - [ ] Agentic-era jargon cluster — 3+ of *agentic / agentful / model-native / vibe-coded / vibe shift / the year of agents* (47)

3. **Vocabulary check** — Scan for 3+ high-frequency AI words in any single paragraph (see vocabulary list above)

---

## Speed Scan Checklist

A flat 27-item rapid-fire checklist for re-checking during final audit (Step 5). Covers the most common residual tells — patterns that survive initial stripping or get reintroduced during voice injection.

- [ ] Any em dash (—) anywhere? → Replace with comma, period, or parentheses. Zero allowed.
- [ ] Any "it's not just X, it's Y" or variant? → State the positive claim directly. Zero allowed.
- [ ] Any rhetorical question used as a hook? ("Why?", "The best part?", "Sound familiar?") → Delete. State the point.
- [ ] Any colon introducing a list or explanation in prose? → Restructure into a sentence.
- [ ] Any use of "actually" as emphasis? ("X that actually Y") → Delete "actually" or rewrite.
- [ ] Any "In today's [anything]" or "rapidly changing" filler? → Delete the entire phrase/sentence.
- [ ] Any sentence that sounds profound but says nothing specific? → Rewrite with facts.
- [ ] "Full stop." / "Let that sink in." / "Make no mistake" → Delete.
- [ ] Paragraph starting with "So" or "Look," → Delete the opener.
- [ ] Inanimate subject + human verb ("the data tells us") → Name the actor.
- [ ] "The implications are significant" or similar vague declarative → Name the implication.
- [ ] Three consecutive sentences within ±3 words of each other → Vary length.
- [ ] Lazy extreme (always/never/everyone/nobody) without evidence → Scope or uses.
- [ ] "Navigate," "unpack," "lean into," or "landscape" → Replace with plain equivalent.
- [ ] -ing phrase tacked onto the end of a sentence → Delete and check if meaning survives.
- [ ] Any sentence announcing what the text will do ("In this section...") → Delete.
- [ ] Number 47 or 73 used as a "random" value? → uses the source or replace with real data.
- [ ] Three or more round numbers (50%, 30%, 10x) in the same piece? → Replace with actual data or remove.
- [ ] Any "Your X, Y'd" or "X. Y." fragmentary headline? → Rewrite with a specific claim. Zero allowed.
- [ ] "Load-bearing X" used as intensifier? → Prove with the delete-test or remove the word.
- [ ] "It's giving X" or "X has entered the chat"? → Delete the meme frame; state what's actually being observed.
- [ ] Three or more consecutive sentences starting with the same word (anaphora cascade)? → Vary openers or combine sentences. Cap at two.
- [ ] "What if I told you" Matrix-meme opener? → State the claim directly with evidence.
- [ ] "X is having a moment" or "X is the new Y" without cited displacement data? → uses share-of-X numbers or delete.
- [ ] "Quietly shipped" / "silently rolled out" / "quietly became" without an evidence trail? → Drop the adverb or uses the unannounced trail.
- [ ] "X, but Y" headline used 2+ times on the same page, or X unrelated to buyer's current tool? → Keep one max with a buyer-fit anchor.
- [ ] Three or more of *agentic / agentful / model-native / vibe-coded / vibe shift / the year of agents* in one piece? → Cut the jargon scaffold; keep the one term doing real work.
