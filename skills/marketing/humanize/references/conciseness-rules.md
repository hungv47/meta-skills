# Conciseness Rules

Conciseness is not about fewer words — it's about more signal per word. Dense writing respects the reader's time without sacrificing depth.

---

## The Density Principle

**Measure quality by information per word, not word count.**

A 200-word paragraph with 5 insights is denser than a 100-word paragraph with 1. Compression means removing words that carry zero information — not cutting ideas.

The goal: every word either advances an argument, delivers evidence, or provides necessary context. Words that do none of these are candidates for removal.

---

## Sentence-Level Compression

Replace filler phrases with shorter forms that carry the same meaning:

| Filler Phrase | Replacement |
|--------------|-------------|
| "in order to" | "to" |
| "due to the fact that" | "because" |
| "at this point in time" | "now" |
| "in the event that" | "if" |
| "it is important to note that" | [delete — just state the thing] |
| "a large number of" | "many" or the actual number |
| "the vast majority of" | "most" or the actual percentage |
| "on a daily basis" | "daily" |
| "has the ability to" | "can" |
| "in terms of" | [restructure sentence] |
| "for the purpose of" | "to" or "for" |
| "in spite of the fact that" | "although" |
| "with regard to" | "about" or "on" |
| "at the end of the day" | [delete — filler phrase masquerading as a conclusion] |

**Process:** Search-and-replace these mechanically as a first pass. Then read aloud — if a replacement sounds unnatural in context, revert it.

---

## Paragraph-Level Rules

### The Merge Test
If two consecutive paragraphs make the same point with different examples, merge them. Keep the stronger example, cut the weaker one.

### The Redundancy Test
Read the last sentence of each paragraph, then the first sentence of the next. If they say the same thing in different words, delete one. This catches the "end-summary → beginning-restatement" pattern that inflates word count 10-15%.

### Setup Elimination
Paragraphs that exist only to set up the next paragraph ("Before we discuss X, it's important to understand Y") can usually be deleted. If Y is genuinely necessary context, integrate it into the paragraph about X.

### Inline Evidence
Instead of:
> "Studies show this approach works. For example, Company X saw a 40% increase in retention after implementing this strategy."

Write:
> "Company X saw 40% higher retention after implementing this."

The evidence IS the proof — you don't need a sentence announcing that evidence follows.

---

## Section-Level Rules

### The Earn-Your-Place Test
Every section must pass: "If I delete this section entirely, does the piece lose something the reader needs?" If no, delete it. Common casualties:
- "Background" sections that explain things the target audience already knows
- "Why This Matters" sections that argue for relevance the reader already accepts (they're reading the piece — they know it matters)
- Summary sections that repeat content from above

### Hierarchy Compression
If a section has one paragraph, it probably doesn't need to be its own section. Merge it into an adjacent section or promote its content to the parent level.

### List Compression
Lists with 2-3 items are usually better as a sentence. "Key factors: speed, reliability, and cost" beats a three-item bulleted list. Reserve bulleted/numbered lists for 4+ genuinely parallel items.

---

## The Conciseness Spectrum

| Level | Signal-to-Word Ratio | Description | Reader Experience |
|-------|---------------------|-------------|-------------------|
| **Bloated** | Low | Filler, repetition, unnecessary hedges | "Get to the point" |
| **Comfortable** | internal | Readable but padded — could lose 20% without harm | "Fine but long" |
| **Dense** | internal | Every paragraph earns its place, minimal filler | "Efficient and clear" |
| **Compressed** | High | Technical density — requires active reading | "I need to slow down" |
| **Cryptic** | Extreme | Missing context, unclear references | "What does this mean?" |

**Target: Dense.** Dense writing respects the reader without requiring them to decode. Most AI-generated content lands at Comfortable; most business writing lands between Comfortable and Bloated.

---

## Content-Type Density Targets

Target compression % represents how much to cut from a typical AI-generated draft:

| Content Type | Target Compression | Rationale |
|-------------|-------------------|-----------|
| Blog post | 20-30% | Readers skim — density helps, but some breathing room aids retention |
| Landing page | 25-40% | Every word competes for attention; dead weight kills conversion |
| Social post | 15-25% | Already short — over-compression loses voice |
| Email (marketing) | 20-35% | Inbox fatigue is real; shorter emails get read |
| Email (internal) | 30-50% | Nobody reads long internal emails; compress aggressively |
| Documentation | 15-25% | Completeness matters — compress filler, not coverage |
| Case study | 20-30% | Cut setup and summary padding; preserve data and quotes |
| Ad copy | 10-20% | Already tight — focus on word-level substitution |
| White paper | 15-25% | Density aids credibility; don't cut nuance |

---

## Depth Preservation Rules

What you must NOT cut, even when compressing:

### Numbers and Data
Specific numbers are the highest-density words in any piece. "40% improvement" carries more information than the entire sentence that typically surrounds it. Never round aggressively (40.2% → 40% is fine; 40% → "significant improvement" is not).

### Named Examples
"Shopify migrated their checkout flow" is denser than "companies have found success with this approach." Named examples do triple duty: proof, specificity, and credibility.

### Nuance and Conditions
"This works for teams over 20 people" is not a hedge — it's precision. Cut hedges ("it might possibly work"), keep conditions ("works when X, breaks when Y").

### Rationale
"We chose Postgres over Mongo because our access patterns are relational" justifies a decision in one sentence. Cutting rationale saves words but creates questions — the reader's mental overhead exceeds the word savings.

### Counterarguments
Acknowledging limitations increases credibility and density simultaneously. "This doesn't solve cold-start problems" is worth its word cost because it preempts the reader's objection.

---

## Compression Process

1. **Mechanical pass** — Search for filler phrases from the sentence-level table. Replace or delete.
2. **Paragraph audit** — Apply merge test, redundancy test, setup elimination to each paragraph.
3. **Section audit** — Apply earn-your-place test to each section. Merge thin sections.
4. **Read aloud** — If you stumble, the compression went too far at that point. Restore natural rhythm.
5. **Count** — Calculate compression %. If below target for the content type, do another paragraph-level pass. If above target, verify you haven't cut depth (check against preservation rules).
