# Marketing Antipatterns — the one catalog

The human-readable twin of [`forsvn-slop/registry/antipatterns.mjs`](../forsvn-slop/registry/antipatterns.mjs).
The registry is the machine source of truth; this file is its readable face. **They must stay in
lockstep** — a docs-integrity test asserts every rule below resolves to a registry entry (by its
heading anchor, which equals the rule id) and that this catalog's `Count:` line equals the registry core count. If you add,
rename, or retire a rule, change **both** in the same commit.

Each rule maps a named marketing-copy antipattern to a `severity` (block | warn | nit), a detection
`tier` (regex | heuristic | llm), and a `fix` route (humanmaxxing | write-copy | polish-vn). The
engine never rewrites — it routes a finding to its fix skill and stays human-gated (DETECT ≠ FIX).
The 3 gated provider-tell rules (Claude/GPT/Gemini) live in the registry only and are **not** part
of this 52-rule catalog.

Severity vocabulary: **block** = high-confidence zero-tolerance hard fail · **warn** = a real
defect needing judgment · **nit** = stylistic / clustered-only. Tiers split the engine by
determinism: **regex/heuristic** are strict and exit-coded (authority earned on correct calls);
**llm** is advisory and never auto-edits voice.

---

## Hook / Lede Failures

### Buried Lede {#mkt-hook-buried-lede}
- **id:** `mkt-hook-buried-lede` · **category:** quality · **severity:** warn · **tier:** heuristic · **fix:** write-copy · **volatility:** stable
- **Bad:** In today's competitive SaaS environment, companies of all sizes are increasingly realizing the importance of efficient workflows. That's why we built Acme: cut your close time in half.
- **Why:** The first specific, interesting claim is sentence 3. Readers decide in <1s; everything before the first concrete sentence is throat-clearing the writer needed and the reader skips.
- **Detect:** heuristic — index of the first sentence with a number/named entity/concrete verb/buyer-side noun is ≥2 (≥2 scene-setting sentences precede it).
- **Source:** humanmaxxing/ai-patterns.md #21

### Generic / Anti-Archetype Hook {#mkt-hook-generic-opener}
- **id:** `mkt-hook-generic-opener` · **category:** quality · **severity:** warn · **tier:** regex · **fix:** write-copy · **volatility:** stable
- **Bad:** Have you ever wondered how to grow your business? Here are 5 tips that will change everything.
- **Why:** Matches a Tier-0 anti-archetype hook every platform has seen for years; the algorithm has no differentiated signal and the reader auto-skips.
- **Detect:** deterministic-regex on first line — "have you ever / did you know / in this post / here are N tips / are you tired of X".
- **Source:** write-social/SKILL.md #1

### Rhetorical Question Hook {#mkt-hook-rhetorical-question}
- **id:** `mkt-hook-rhetorical-question` · **category:** quality · **severity:** block · **tier:** regex · **fix:** write-copy · **volatility:** stable
- **Bad:** What if I told you the best teams don't track individual productivity at all?
- **Why:** Performs curiosity instead of creating it; loads an expectation the flat follow-up can't pay off. Real people don't open with "What if I told you" / "Sound familiar?".
- **Detect:** deterministic-regex — opener line ending in "?" matching "what if i told you / ever wondered / sound familiar / want to know the secret". block when it is the literal first line of an ad/hero.
- **Source:** humanmaxxing/ai-patterns.md phrase list; write-ad/SKILL.md §2b; Absolute Prohibition #3

### No Pattern Interrupt / No Tension {#mkt-hook-no-pattern-interrupt}
- **id:** `mkt-hook-no-pattern-interrupt` · **category:** quality · **severity:** warn · **tier:** llm · **fix:** write-copy · **volatility:** stable
- **Bad:** Our platform helps teams collaborate more effectively and stay organized.
- **Why:** Hook contains no tension, no specificity, no stake, no surprise — a flat capability statement that could open any product's page. Fails the 3-second window.
- **Detect:** llm-critic (after the deterministic hook rules pass) — does the first line create tension/surprise/stake/concrete that stops a scroll?
- **Source:** write-social/SKILL.md — 3-second hook window

### Hook–Body Disconnect {#mkt-hook-body-disconnect}
- **id:** `mkt-hook-body-disconnect` · **category:** quality · **severity:** warn · **tier:** llm · **fix:** write-copy · **volatility:** stable
- **Bad:** Hook: "The #1 mistake killing your retention." Body: generic advice about "focusing on your customers" that names no mistake.
- **Why:** Hook promises a specific reveal/cohort/contrarian claim; body delivers generic filler that doesn't fulfill it. Bait-and-switch kills trust and the CTA.
- **Detect:** llm-critic — parse the hook's explicit promise; does the body deliver THAT specific thing or a generic response applicable to any reader?
- **Source:** write-social/SKILL.md #10

## AI-Slop Lexicon & Cadence

### Hype-Verb / Vendor-Speak Stack {#mkt-slop-hype-verb}
- **id:** `mkt-slop-hype-verb` · **category:** slop · **severity:** warn · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** Unlock seamless workflows and supercharge your team to elevate productivity at scale.
- **Why:** "unlock / supercharge / elevate / seamless / leverage / streamline" are sophistication-seeking amplifiers that substitute for a concrete outcome. One is forgivable; a cluster is an instant AI/vendor-speak tell.
- **Detect:** deterministic-regex word-boundary match against the canonical hype lexicon. Single hit in body = nit; ≥3 hits OR any hit in a hero headline = warn.
- **Source:** write-ad/SKILL.md §1 banned list; humanmaxxing/ai-patterns.md vocab list; write-copy Sweep-2

### Negative-Parallelism ('It's not just X, it's Y') {#mkt-slop-not-just-x}
- **id:** `mkt-slop-not-just-x` · **category:** slop · **severity:** block · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** It's not just a tool. It's a movement.
- **Why:** The single most recognizable AI cadence. Sounds profound, says nothing, and never survives the "state the positive claim directly" test.
- **Detect:** deterministic-regex covering the "it's not (just) X … it's Y" family + variants ("the answer isn't X. it's Y", "stops being X and starts being Y"). ANY single instance = block (zero-tolerance).
- **Source:** humanmaxxing Absolute Prohibition #2; ai-patterns.md #27

### Em-Dash Crutch {#mkt-slop-em-dash-overuse}
- **id:** `mkt-slop-em-dash-overuse` · **category:** slop · **severity:** block · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** Our platform — built for teams — makes collaboration easy — wherever you are.
- **Why:** Em dashes used as structural glue for asides/pauses are a hallmark AI tell. FORSVN policy is zero in final marketing output; even one in short copy flags.
- **Detect:** deterministic-regex — count "—" (U+2014) and " - " as clause glue. In ad/social/hero: ≥1 = block. Long-form editorial: ≥5 per 1000 words = warn (register-gated; quoted em-dashes exempt).
- **Source:** humanmaxxing Absolute Prohibition #1; ai-patterns.md #12

### Rule-of-Three Reflex {#mkt-slop-rule-of-three}
- **id:** `mkt-slop-rule-of-three` · **category:** slop · **severity:** nit · **tier:** heuristic · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** Faster, simpler, smarter. We create learning, collaboration, and innovation.
- **Why:** Ideas forced into groups of three for rhythm rather than because three things exist. Padding to or trimming to three reads as AI cadence.
- **Detect:** heuristic — coordinate triads (three short adjectives/noun-phrases). Flag at ≥2 triads in one artifact OR a triad in the hero. Single triad in body = nit.
- **Source:** humanmaxxing/ai-patterns.md #26

### 'Whether you're A or B' False-Range {#mkt-slop-whether-youre}
- **id:** `mkt-slop-whether-youre` · **category:** slop · **severity:** warn · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** Whether you're a solo founder or a Fortune 500 CMO, our platform scales with you.
- **Why:** Fake-inclusivity construction that pretends to address everyone and therefore addresses no one; A and B usually aren't real endpoints of a spectrum.
- **Detect:** deterministic-regex — "whether you're A or B" / "from X to Y" where endpoints aren't a real scale. Downgrade to nit if the poles are a genuine spectrum (llm tiebreak only when ambiguous).
- **Source:** write-copy Sweep-5; ai-patterns.md #29

### Throat-Clearing / Filler-Context Opener {#mkt-slop-throat-clearing}
- **id:** `mkt-slop-throat-clearing` · **category:** slop · **severity:** block · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** In today's fast-paced, ever-evolving digital landscape, businesses must adapt.
- **Why:** Scene-setting that says nothing and could apply to any company, any decade. The reader's real entry point is 2-3 sentences later.
- **Detect:** deterministic-regex on opener — "in today's / in an increasingly / in the competitive … world|landscape|economy|era" + "as the world becomes more", "when it comes to". block when it is the literal first sentence.
- **Source:** humanmaxxing Absolute Prohibition #6; ai-patterns.md #21

### Paired Synonyms {#mkt-slop-paired-synonyms}
- **id:** `mkt-slop-paired-synonyms` · **category:** slop · **severity:** warn · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** A clear and concise, robust and reliable, simple and straightforward solution.
- **Why:** Two words meaning the same thing joined by "and" — an AI emphasis tic humans rarely use. If you can't pick one, neither is specific enough.
- **Detect:** deterministic-regex against a curated synonym-pair set (clear and concise / robust and reliable / safe and secure …). Any hit = warn.
- **Source:** humanmaxxing/ai-patterns.md #6

### Staccato Tagline ('Your X, Y'd' / 'X. Y.') {#mkt-slop-staccato-tagline}
- **id:** `mkt-slop-staccato-tagline` · **category:** slop · **severity:** warn · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** Your Workflows, Mapped. Analytics. Simplified.
- **Why:** Fragmentary noun+participle taglines are so overused they're an instant AI fingerprint; the form pretends to be a message but communicates nothing specific.
- **Detect:** deterministic-regex on headline/tagline slots — "Your Data, Protected" / "Analytics. Simplified." Hard variants = warn on a single instance; weaker noun-noun forms flag at 2+.
- **Source:** humanmaxxing Absolute Prohibition #9; ai-patterns.md #37

### Anaphora Cascade {#mkt-slop-anaphora-cascade}
- **id:** `mkt-slop-anaphora-cascade` · **category:** slop · **severity:** nit · **tier:** heuristic · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** We believe in speed. We believe in trust. We believe in compounding.
- **Why:** Three+ consecutive sentences with the same opener manufacture rhetorical weight; two is rhetoric, three is a tell.
- **Detect:** heuristic — same first 1-2 tokens (We/They/This/Imagine/Every) repeats ≥3 times in a row. Cap-at-two is the fix.
- **Source:** humanmaxxing/ai-patterns.md #40

### Colon-List / Colon-Reveal Dependency {#mkt-slop-colon-reveal}
- **id:** `mkt-slop-colon-reveal` · **category:** slop · **severity:** warn · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** Here's why this matters: speed, trust, scale. The answer: automation.
- **Why:** Colons used as a structural crutch to introduce dramatic reveals or lists in prose marketing copy.
- **Detect:** deterministic-regex — "here's why|what|how : " / "the answer|secret|truth : " or ": " before a bulleted list in body prose (technical docs exempt).
- **Source:** humanmaxxing Absolute Prohibition #4; ai-patterns.md #30

### Dead-Meme / Trend-Manufacture Frame {#mkt-slop-meme-frame}
- **id:** `mkt-slop-meme-frame` · **category:** slop · **severity:** warn · **tier:** regex · **fix:** humanmaxxing · **volatility:** trend · **asOf:** 2026-06-23
- **Bad:** Async has entered the chat. Newsletters are having a moment. Long-form is the new short-form.
- **Why:** "X has entered the chat / is having a moment / is the new Y / it's giving X" assert cultural momentum with no evidence — they substitute a meme for the actual signal (revenue, search-trend, named instances).
- **Detect:** deterministic-regex — "has entered the chat | is having a moment | is the new | it's giving". "is the new" is nit unless 2+ or no displacement data nearby.
- **Source:** humanmaxxing/ai-patterns.md #39/#41/#43/#46

## Claim Quality

### Unfalsifiable Superlative {#mkt-claim-unfalsifiable-superlative}
- **id:** `mkt-claim-unfalsifiable-superlative` · **category:** quality · **severity:** warn · **tier:** regex · **fix:** write-copy · **volatility:** stable
- **Bad:** The world's most powerful, most intuitive platform — trusted by everyone.
- **Why:** Lazy extremes (best, most, everyone, always, never, leading) make a claim sound definitive without proof; unfalsifiable filler a competitor could copy verbatim.
- **Detect:** deterministic-regex for absolutes WITHOUT an adjacent number/named entity/citation in the same clause. warn; block if it's the hero claim.
- **Source:** humanmaxxing/ai-patterns.md lazy-extremes; write-ad/SKILL.md §3a

### Competitor-Swap Failure (No Specificity) {#mkt-claim-competitor-swap-fail}
- **id:** `mkt-claim-competitor-swap-fail` · **category:** quality · **severity:** warn · **tier:** llm · **fix:** write-copy · **volatility:** stable
- **Bad:** We help businesses grow faster with powerful, easy-to-use tools.
- **Why:** Swap the brand name for a top-3 competitor and the copy still reads as plausible — so it says nothing specific to THIS product. The core specificity gate.
- **Detect:** llm-critic (the canonical write-copy test) — replace the brand with a named competitor; if it still reads true, FAIL specificity. Pre-filter: zero numbers AND zero named entities auto-routes here.
- **Source:** write-copy Sweep-5 — competitor-swap test

### Feature-Not-Benefit (No 'So What') {#mkt-claim-feature-not-benefit}
- **id:** `mkt-claim-feature-not-benefit` · **category:** quality · **severity:** warn · **tier:** llm · **fix:** write-copy · **volatility:** stable
- **Bad:** Built on a distributed event-sourced architecture with 99.99% uptime SLA.
- **Why:** States what the product IS/HAS without answering "why should the reader care?". Every claim must map to a "so what" that isn't restatement.
- **Detect:** llm-critic — for each top claim, is there a reader-side outcome stated or one step away? Heuristic prior: spec-noun density with no outcome verbs raises priority.
- **Source:** write-copy Sweep-3

### Fabricated / Unsourced Precision {#mkt-claim-fabricated-precision}
- **id:** `mkt-claim-fabricated-precision` · **category:** quality · **severity:** block · **tier:** regex · **fix:** write-copy · **volatility:** stable
- **Bad:** Studies show 73% of users abandon onboarding, costing teams $47,000 a quarter.
- **Why:** Specific-sounding stat with no named source — often hallucinated; 47/73 are known LLM number fingerprints. Unsourced precision is worse than no number; it looks like a lie.
- **Detect:** deterministic-regex — a percentage/precise figure NOT within ~12 words of a source token, plus a hard sub-rule flagging unsourced 47 or 73. block.
- **Source:** humanmaxxing/ai-patterns.md #34/#36; write-ad/SKILL.md §3b; Absolute Prohibition #8

### Vague Attribution {#mkt-claim-vague-attribution}
- **id:** `mkt-claim-vague-attribution` · **category:** quality · **severity:** warn · **tier:** regex · **fix:** write-copy · **volatility:** stable
- **Bad:** Experts agree this is the future. Industry reports suggest strong growth.
- **Why:** Claims attributed to unnamed authorities ("experts say", "studies show", "observers note") — humans name their sources.
- **Detect:** deterministic-regex — "experts|analysts|studies|research|industry reports … say|argue|agree|suggest|show" with no proper-noun source in the same sentence.
- **Source:** humanmaxxing/ai-patterns.md #10

### Telling-Not-Showing / Vague Declarative {#mkt-claim-telling-not-showing}
- **id:** `mkt-claim-telling-not-showing` · **category:** quality · **severity:** warn · **tier:** regex · **fix:** write-copy · **volatility:** stable
- **Bad:** The results are game-changing. The impact is significant. This matters.
- **Why:** Announces that something is important/significant without naming what or why — performs emphasis instead of providing it.
- **Detect:** deterministic-regex for empty declaratives — "the results|impact|stakes are significant|huge|game-changing" / "this matters|changes everything" with no adjacent concrete consequence.
- **Source:** humanmaxxing/ai-patterns.md #33

### Hypothetical Framed as Measured Result {#mkt-claim-hypothetical-as-measured}
- **id:** `mkt-claim-hypothetical-as-measured` · **category:** quality · **severity:** block · **tier:** llm · **fix:** write-copy · **volatility:** stable
- **Bad:** Imagine cutting close time 55% — that's exactly what our customers do.
- **Why:** Frames a hypothetical as if it were a measured outcome, or generalizes one customer's result as typical. Borderline-deceptive.
- **Detect:** heuristic + llm-critic — detect "imagine [outcome] — that's what our customers do" bridges and single-testimonial outcomes stated without cohort scoping; llm confirms typical-vs-illustrative. block when an outcome number is implied-typical without cohort data.
- **Source:** write-ad/SKILL.md §3c/§3d

## CTA Failures

### Weak / Default CTA Verb {#mkt-cta-weak-verb}
- **id:** `mkt-cta-weak-verb` · **category:** quality · **severity:** warn · **tier:** regex · **fix:** write-copy · **volatility:** stable
- **Bad:** Learn more. Click here. Submit.
- **Why:** "Learn more / Click here / Submit" carry no value framing and no momentum; they name the mechanism, not the payoff.
- **Detect:** deterministic-regex on the button/CTA slot — bare default verb with no value clause. Pair the verb with the outcome.
- **Source:** write-ad/SKILL.md §5g

### Multiple Competing CTAs {#mkt-cta-multiple-competing}
- **id:** `mkt-cta-multiple-competing` · **category:** quality · **severity:** block · **tier:** heuristic · **fix:** write-copy · **volatility:** stable
- **Bad:** Try free → then upgrade! Also book a demo AND share with your team.
- **Why:** More than one primary action splits intent and degrades the conversion signal; one ad/section, one CTA.
- **Detect:** deterministic-heuristic — count distinct primary action verbs in the CTA + hero region. >1 in one ad variant / landing-section = block. Secondary text links exempt.
- **Source:** write-ad/SKILL.md §5a

### CTA Without Value or Reason-to-Act-Now {#mkt-cta-no-value-or-urgency}
- **id:** `mkt-cta-no-value-or-urgency` · **category:** quality · **severity:** nit · **tier:** llm · **fix:** write-copy · **volatility:** stable
- **Bad:** Get started today.
- **Why:** No statement of what the reader gets or why now; "today" is hollow urgency with no anchor.
- **Detect:** llm-critic (gated behind the regex passes) — does the CTA state what the reader gets AND a real reason to act now? Rejects manufactured urgency. nit unless it's the hero CTA.
- **Source:** write-copy — CTA value + reason-to-act

### Manufactured / Fake Urgency {#mkt-cta-fake-urgency}
- **id:** `mkt-cta-fake-urgency` · **category:** quality · **severity:** warn · **tier:** regex · **fix:** write-copy · **volatility:** stable
- **Bad:** Only 2 spots left! Offer ends at midnight! Act now before it's gone!
- **Why:** Countdown/scarcity with no real basis is a trust-eroding dark-pattern tell; readers are inoculated and it cheapens the brand.
- **Detect:** deterministic-regex — "only N spots left / act now before / ends at midnight / last chance / limited time only" NOT backed by a verifiable constraint nearby. block if repeated or in a B2B/luxury register.
- **Source:** write-ad/SKILL.md §5 — fake-urgency dark pattern

### Engagement-Bait CTA {#mkt-cta-engagement-bait}
- **id:** `mkt-cta-engagement-bait` · **category:** quality · **severity:** block · **tier:** regex · **fix:** write-copy · **volatility:** trend · **asOf:** 2026-06-23
- **Bad:** Comment YES if you agree. Like if this helped. Follow for more.
- **Why:** Explicit bait phrasing that TikTok/Meta/LinkedIn algorithms detect and deprioritize as inauthentic engagement; underperforms even where not penalized.
- **Detect:** deterministic-regex — "like if you / comment yes / tag a friend / follow for more / smash that". block on tiktok/reels/linkedin; warn on x.
- **Source:** write-social/SKILL.md #8

### Bait-and-Switch CTA {#mkt-cta-bait-and-switch}
- **id:** `mkt-cta-bait-and-switch` · **category:** quality · **severity:** warn · **tier:** heuristic · **fix:** write-copy · **volatility:** stable
- **Bad:** Ad CTA says "Start free trial"; the landing-page button says "Request a demo".
- **Why:** CTA verb doesn't match the destination's primary action; the mismatch breaks the click-through promise and tanks conversion + Quality Score.
- **Detect:** heuristic (cross-artifact) — when both ad copy and its landing-page target are in scope, compare the ad CTA verb against the LP primary button verb; flag mismatch.
- **Source:** write-ad/SKILL.md §5f

## Voice / Register

### Hedge Stacking {#mkt-voice-hedge-stack}
- **id:** `mkt-voice-hedge-stack` · **category:** slop · **severity:** warn · **tier:** heuristic · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** This approach might potentially offer some benefits in certain situations.
- **Why:** Multiple hedges in one sentence ("might potentially… some… certain") drain all conviction; experts commit or cut.
- **Detect:** deterministic-heuristic — count hedge tokens per sentence (might/may/could/potentially/possibly/somewhat/just/quite). ≥2 in one sentence = warn; single "just"/"quick" hedge in ad copy = nit.
- **Source:** humanmaxxing/ai-patterns.md #8; write-ad/SKILL.md §2c

### Corporate Passive / Announcement Voice {#mkt-voice-corporate-passive}
- **id:** `mkt-voice-corporate-passive` · **category:** slop · **severity:** warn · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** It has been determined that our solution is leveraged by leading enterprises.
- **Why:** Passive "it has been determined" and press-release "we're proud to announce / introducing the all-new" hide the actor and read as a press release, not a person.
- **Detect:** deterministic-regex — passive-by-X / "it has been determined|noted|believed" + announcement frames + copula-avoidance openers (serves as / stands as / boasts).
- **Source:** write-ad/SKILL.md §7b; humanmaxxing/ai-patterns.md #7

### On-the-Nose Meta-Copy {#mkt-voice-on-the-nose-meta}
- **id:** `mkt-voice-on-the-nose-meta` · **category:** slop · **severity:** warn · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** In this section, we'll walk you through everything you need to know. Let's dive in.
- **Why:** Copy narrating its own structure ("in this section", "let me walk you through", "let's dive in") — assistant-mode filler; the writing should just do the thing.
- **Detect:** deterministic-regex — "in this section we'll / let me walk you through / let's dive in / here's the thing: / this comprehensive guide will".
- **Source:** humanmaxxing/ai-patterns.md meta-commentary; #22

### Sender-First / We-Not-You Framing {#mkt-voice-sender-first}
- **id:** `mkt-voice-sender-first` · **category:** slop · **severity:** warn · **tier:** heuristic · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** We help teams do more. Our platform is the leading solution. I'm reaching out because...
- **Why:** Opens about the sender/product instead of the reader's situation; the first 30 chars should be "you" or a prospect-side noun.
- **Detect:** deterministic-heuristic — first ~30 chars / first clause has "We/Our/I/[ProductName]" as subject with no "you/your" present.
- **Source:** write-ad/SKILL.md §7a

### Brand-Voice Inconsistency {#mkt-voice-brand-inconsistent}
- **id:** `mkt-voice-brand-inconsistent` · **category:** slop · **severity:** warn · **tier:** llm · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** Founder-mode brand posts "Our company is committed to delivering innovative, scalable, best-in-class solutions."
- **Why:** Voice register contradicts the declared brand_mode — corporate cliché in a founder voice, or confessional "I" in a company voice. Erodes trust fastest on social.
- **Detect:** heuristic keyed to brand_mode + llm-critic — founder mode flags corporate-passive/buzzword-stack clusters; company mode flags first-person/off-register slang. Requires BRAND.md; skipped with a note if absent.
- **Source:** write-social/SKILL.md #5

### Wrong Reading Grade for Channel {#mkt-voice-reading-grade-mismatch}
- **id:** `mkt-voice-reading-grade-mismatch` · **category:** slop · **severity:** nit · **tier:** heuristic · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** Our platform facilitates the optimization of organizational productivity paradigms. (in a consumer TikTok caption)
- **Why:** Sentence complexity / grade level wrong for the audience and channel — PhD-grade prose in a Gen-Z slot, or baby-talk in an enterprise security page. Friction = scroll.
- **Detect:** heuristic — Flesch-Kincaid grade + mean sentence length vs a per-channel target band; flag when >2 bands off. Legal exempt.
- **Source:** write-social/SKILL.md — channel reading-grade band

### Permission-Seeking / Assistant Closer {#mkt-voice-permission-closer}
- **id:** `mkt-voice-permission-closer` · **category:** slop · **severity:** warn · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** I hope this helps! Let me know if you'd like me to elaborate. Feel free to reach out!
- **Why:** Ends in assistant-mode offers ("let me know if", "feel free to", "hope this helps") instead of a recommendation or next step. Dead giveaway of LLM authorship.
- **Detect:** deterministic-regex on the closing block — "i hope this helps / let me know if you'd like / feel free to reach out / would you like me to". warn (block in published-asset register).
- **Source:** humanmaxxing/ai-patterns.md #20

## Structure & Scannability

### Wall of Text / Paragraph Wall {#mkt-struct-wall-of-text}
- **id:** `mkt-struct-wall-of-text` · **category:** slop · **severity:** warn · **tier:** heuristic · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** A single 9-sentence paragraph of primary text with no line breaks in a mobile ad.
- **Why:** Long unbroken blocks fail the scroll-stop test on every subsequent line; mobile feeds render short lines and reward dwell.
- **Detect:** deterministic-heuristic — any block ≥8 sentences OR >300 chars with no line break, scoped to ad/social/hero (long-form editorial exempt).
- **Source:** write-ad/SKILL.md §5b; write-social/SKILL.md #7

### No Scannability (Pasted-From-Blog) {#mkt-struct-no-scannability}
- **id:** `mkt-struct-no-scannability` · **category:** slop · **severity:** warn · **tier:** heuristic · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** Mean sentence length 24 words, zero line breaks, "In conclusion," and "Furthermore," in a social caption.
- **Why:** Blog prose dropped into a short-form surface without compression; reads like homework, kills dwell/completion.
- **Detect:** heuristic — avg sentence length >20 words AND no visual break in any 200+ char span AND/OR SEO-essay connectives (In conclusion / Furthermore / It is worth noting). Short-form scoped.
- **Source:** write-social/SKILL.md #7

### Headline / Char-Cap Overflow {#mkt-struct-headline-overflow}
- **id:** `mkt-struct-headline-overflow` · **category:** slop · **severity:** block · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** A 240-char X post; a LinkedIn hook whose tension only appears at char 260 (past the ~210 fold).
- **Why:** Tension/CTA lands past the platform's visible-before-truncation window or hard cap; the expand-or-scroll decision is made in <1s on the visible window.
- **Detect:** deterministic-regex/measure against per-platform caps (X hard 280; TikTok/Reels ~70-80 hook; LinkedIn ~140-210 fold). Tension/CTA after the cap = block on hard-cap (X), warn on soft.
- **Source:** write-social/SKILL.md #2/#4

### Every-Section/Sentence-the-Same Cadence {#mkt-struct-monotone-cadence}
- **id:** `mkt-struct-monotone-cadence` · **category:** slop · **severity:** nit · **tier:** heuristic · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** Five sections each exactly 3 paragraphs; or 5 sentences all 11-13 words.
- **Why:** Uniform section length and metronomic sentence rhythm read as machine-generated; humans spend words where it matters and vary cadence.
- **Detect:** heuristic — sentence-length variance / burstiness; flag when 4+ consecutive sentences fall within 2 words of each other OR section-length stdev is near-zero across ≥3 sections.
- **Source:** humanmaxxing/ai-patterns.md #1/#3; write-ad/SKILL.md §2f

### Symmetric / Bold-Label List {#mkt-struct-symmetric-list}
- **id:** `mkt-struct-symmetric-list` · **category:** slop · **severity:** nit · **tier:** heuristic · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** "- Communication: Effective communication ensures alignment… / - Organization: Strong organization keeps timelines…"
- **Why:** Every list item same length, same "Bold Label: explanation" structure; human lists are messy and weight the important item.
- **Detect:** heuristic — lists where ≥3 items share the "**Label:** sentence" shape AND item lengths sit in a tight band.
- **Source:** humanmaxxing/ai-patterns.md #2/#14

## Channel-Fit Violations

### Platform Format Mismatch {#mkt-channel-format-mismatch}
- **id:** `mkt-channel-format-mismatch` · **category:** slop · **severity:** warn · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** Thread markers ("1/", "2/") inside a single-post slot; a LinkedIn "carousel" written as one prose paragraph.
- **Why:** Copy written in a format the declared surface doesn't support won't be distributed as intended regardless of copy quality.
- **Detect:** deterministic-regex keyed to declared platform+format — thread markers in a single post; carousel with no slide demarcation; ## headings in a vertical-video caption; a format that doesn't exist on the platform.
- **Source:** write-social/SKILL.md #3

### LinkedIn-Cringe / Broetry {#mkt-channel-linkedin-cringe}
- **id:** `mkt-channel-linkedin-cringe` · **category:** slop · **severity:** warn · **tier:** llm · **fix:** humanmaxxing · **volatility:** trend · **asOf:** 2026-06-23
- **Bad:** "I fired my best employee today. / Here's why. / (it was the best decision I ever made) / Agree?"
- **Why:** Manufactured-vulnerability one-line-per-paragraph "broetry" with a fake-shock hook and an engagement-bait tail — the saturated, reflex-reject LinkedIn format the audience now distrusts.
- **Detect:** heuristic + llm-critic — ≥4 one-sentence paragraphs separated by blank lines + a shock/confession opener + a single-word reaction-bait closer; llm confirms the fake-vulnerability read. Legitimate short-line storytelling without the bait isn't flagged.
- **Source:** write-social/SKILL.md — broetry/LinkedIn register

### Twitter Thread-Bait {#mkt-channel-thread-bait}
- **id:** `mkt-channel-thread-bait` · **category:** slop · **severity:** warn · **tier:** regex · **fix:** humanmaxxing · **volatility:** trend · **asOf:** 2026-06-23
- **Bad:** 🧵 A thread on why most founders fail (and how to fix it). 1/ Let's go.
- **Why:** Listicle thread-bait scaffolding ("🧵 a thread on", "a mega-thread", "1/ Let's go", "bookmark this") is platform-saturated and reads as engagement farming, not insight.
- **Detect:** deterministic-regex — "🧵 / a thread on / let's go N/ / bookmark this / read till the end / here's everything" in an X artifact.
- **Source:** write-social/SKILL.md — X thread-bait saturation

### Emoji-as-Structure / Emoji Spam {#mkt-channel-emoji-spam}
- **id:** `mkt-channel-emoji-spam` · **category:** slop · **severity:** warn · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** 🚀 Key features: ⚡ Speed ✅ Reliability 🔥 Scale 👉 Try it now!
- **Why:** Emojis used as bullets/section markers/emphasis are a structural AI tell and read as low-effort in any serious channel.
- **Detect:** deterministic-regex/count — emoji as a line-leading bullet, ≥3 emoji in a headline / ≥5 in primary text. Long-form/landing: any structural emoji = block. Register-gated.
- **Source:** humanmaxxing/ai-patterns.md #13; write-ad/SKILL.md §5d; Absolute Prohibition #7

### Reach-Suppressing Early External Link {#mkt-channel-early-external-link}
- **id:** `mkt-channel-early-external-link` · **category:** slop · **severity:** warn · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** Big news! Read the full post at example.com/blog 👇 (as the first line of a LinkedIn/X post)
- **Why:** Raw external URL in the post body / above the fold where the platform documents reach suppression; first-comment link is the native move.
- **Detect:** deterministic-regex — raw URL in tweet-1 / first 3 lines of a LinkedIn native post. warn on X/LinkedIn; N/A on TikTok/Reels/Shorts (link-in-bio).
- **Source:** write-social/SKILL.md #9

### ALL-CAPS Headline (Policy/Readability) {#mkt-channel-all-caps}
- **id:** `mkt-channel-all-caps` · **category:** slop · **severity:** block · **tier:** regex · **fix:** humanmaxxing · **volatility:** stable
- **Bad:** GET 50% OFF NOW — LIMITED TIME ONLY!!!
- **Why:** All-caps headlines are a Meta-policy auto-reject and read as shouting; also screen-reader hostile.
- **Detect:** deterministic-regex — ≥3 consecutive ALL-CAPS words (acronym allowlist: API, SaaS, CRM, AI, B2B). block on paid-ad surfaces, warn elsewhere.
- **Source:** write-ad/SKILL.md §5e

## Persuasion Structure

### No PAS/AIDA Spine {#mkt-persuasion-no-spine}
- **id:** `mkt-persuasion-no-spine` · **category:** quality · **severity:** warn · **tier:** llm · **fix:** write-copy · **volatility:** stable
- **Bad:** A landing page that lists 6 features and a price, with no problem stated, no desired outcome, and no single conversion path.
- **Why:** Persuasive copy needs a spine — Problem→Agitate→Solution or Attention→Interest→Desire→Action. A feature dump with no problem framing gives the reader no reason to move.
- **Detect:** llm-critic over the full artifact — is there (1) a stated problem, (2) stakes/desire, (3) solution-as-resolution, (4) one action? Name the missing beats. Heuristic prior: features but no problem/outcome language raises priority.
- **Source:** write-copy — PAS/AIDA spine

### Missing Objection Handling {#mkt-persuasion-no-objection-handling}
- **id:** `mkt-persuasion-no-objection-handling` · **category:** quality · **severity:** warn · **tier:** llm · **fix:** write-copy · **volatility:** stable
- **Bad:** A pricing page asking for a credit card with no mention of cancellation, security, migration effort, or money-back.
- **Why:** The reader's top blockers (risk, switching cost, trust, price) go unaddressed, so the CTA asks for a leap with no bridge.
- **Detect:** llm-critic — list the 2-3 likely objections; does the copy neutralize each (guarantee, easy out, security proof, migration help)? Deterministic prior: a signup CTA with no risk-reversal token nearby flags for this critic.
- **Source:** write-copy Sweep-7 — Zero-Risk

### Empty / Missing Social-Proof Slot {#mkt-persuasion-no-social-proof}
- **id:** `mkt-persuasion-no-social-proof` · **category:** quality · **severity:** warn · **tier:** regex · **fix:** write-copy · **volatility:** stable
- **Bad:** Trusted by leading companies. (no logos, no names, no numbers)
- **Why:** A claim of trust with no named customer, number, logo, or quote is an empty slot — it signals the proof exists but withholds it, which reads as weaker than no claim.
- **Detect:** deterministic-regex — "trusted by / used by / join thousands / leading companies" NOT followed by a named entity / specific number within the section. A real logo wall or named quote nearby clears it.
- **Source:** write-ad/SKILL.md §3a

### Caveat Avalanche {#mkt-persuasion-caveat-avalanche}
- **id:** `mkt-persuasion-caveat-avalanche` · **category:** quality · **severity:** warn · **tier:** heuristic · **fix:** write-copy · **volatility:** stable
- **Bad:** Results may vary. Every situation is unique. Always consult a professional. This is not advice.
- **Why:** A footer pile of disclaimers/qualifiers kills momentum at the exact moment of decision; CYA energy that reads as no-confidence.
- **Detect:** deterministic-heuristic — count qualifier/disclaimer sentences in the closing region. ≥2 stacked = warn. Genuine legal/regulated-industry disclaimers are exempt by register.
- **Source:** humanmaxxing/ai-patterns.md #19

### Generic Positive Conclusion {#mkt-persuasion-generic-conclusion}
- **id:** `mkt-persuasion-generic-conclusion` · **category:** quality · **severity:** warn · **tier:** regex · **fix:** write-copy · **volatility:** stable
- **Bad:** The future looks bright. The possibilities are endless. Exciting times lie ahead.
- **Why:** Empty upbeat ending with no concrete next step or prediction; says nothing and replaces the CTA's job.
- **Detect:** deterministic-regex — "the future looks bright / possibilities are endless / exciting times lie ahead / the sky's the limit" in the closing block. Replace with a measurable next step.
- **Source:** humanmaxxing/ai-patterns.md #25/#5

---

Count: 52 checks
