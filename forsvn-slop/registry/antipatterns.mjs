// antipatterns.mjs — the FORSVN marketing-antipattern registry (the ONE source of truth).
//
// The machine twin of references/marketing-antipatterns.md. Every downstream surface —
// the deterministic scanner (S2), the LLM critic (S6), the /forsvn audit report (S5), and the
// forsvn-preview suggestion cards (S4) — reads name/whyBad/severity/tier/fixSkill from HERE, so
// the catalog and the four surfaces can never drift. Retargets Impeccable's one-registry→four-
// surfaces moat from design tells to marketing copy. (slop-detector.md §1.1, §2.3; brief FOR-50.)
//
// SCHEMA (RegistryEntry):
//   id          'mkt-...'  — == the taxonomy ruleId for the 52 core rules; 'mkt-provider-*' for
//                            the 3 gated provider starters. Unique across the whole array.
//   category    'slop' | 'quality'   — SLOP = AI-tell lexicon/cadence/structure; QUALITY =
//                            persuasion/conversion defect (taxonomy.overview).
//   severity    'block' | 'warn' | 'nit'   — the SPEC vocabulary (10 block / 36 warn / 6 nit).
//                            NOT Impeccable's warning|advisory; D-26 and the report group by this.
//   tier        'regex' | 'heuristic' | 'llm'   — the determinism split (§2.1). 42 strict
//                            (regex|heuristic, exit-coded) + 10 advisory (llm). Derived per-rule
//                            from the taxonomy `detection` string by the LOCKED 4→3 mapping:
//                              detection contains 'llm-critic' ANYWHERE → 'llm'
//                                  EXCEPT mkt-slop-whether-youre (llm is tiebreak-only) → 'regex';
//                              else detection starts 'deterministic-regex' (incl /measure,/count) → 'regex';
//                              else ('deterministic-heuristic' | 'heuristic')                      → 'heuristic'.
//   volatility  'stable' | 'trend'   — 'trend' for the 4 meme/saturation core rules + the 3
//                            provider rules (carry asOf); 'stable' otherwise (no asOf).
//   source      string   — human-readable citation into the source skill (verbatim from the
//                            taxonomy whyBad/detection). NOT a resolvable anchor — only `section` is.
//   asOf        'YYYY-MM-DD'   — REQUIRED iff volatility==='trend'; omitted otherwise.
//   section     string   — == id; the {#anchor} slug into references/marketing-antipatterns.md.
//   name/badExample/whyBad/detection   — verbatim from taxonomy.categories[].antipatterns[].
//                            `detection` is CARRIED, never executed in S1 (S2 runs the regex subset).
//   fixSkill    'humanmaxxing' | 'write-copy' | 'polish-vn'   — the fix ROUTE (taxonomy.autofixModel).
//                            DETECT != FIX: the registry routes; it never rewrites. polish-vn is in
//                            the enum so the (EN-centric v1) VN extension slots in with no migration.
//   gated       'claude' | 'gpt' | 'gemini'   — only on the 3 provider rules; OFF by default.
//   calibrated  boolean   — ADDED FOR-55/S6, ONLY on the 10 tier:'llm' rules. Set programmatically
//                            from CALIBRATED_LLM_IDS (below) — the critic fires a tier:'llm' rule
//                            ONLY when calibrated===true (it cleared calibrate-critic.ts's judge-
//                            variance bound). Default OFF: an un-calibrated subjective rule never
//                            speaks (D-26 calibrate-before-ship; slop-detector.md §2.1). Evidence
//                            pinned in tests/goldens/critic-llm/calibration-report.json; the gate
//                            test (_dev/test-critic-calibration.ts) enforces registry⟺report agreement.
//
// CORE_COUNT = 52 (the taxonomy rules; the catalog + the 'N checks' claim count THESE).
// ANTIPATTERNS.length = 55 (52 core + 3 gated provider starters). Assert getCoreRules().length,
// NOT ANTIPATTERNS.length.

export const CORE_COUNT = 52;

export const ANTIPATTERNS = [
  // ─── hook-lede — Hook / Lede Failures (5) — category: quality, fix: write-copy ───
  {
    id: 'mkt-hook-buried-lede', category: 'quality', severity: 'warn', tier: 'heuristic',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #21`, section: 'mkt-hook-buried-lede',
    name: `Buried Lede`,
    badExample: `In today's competitive SaaS environment, companies of all sizes are increasingly realizing the importance of efficient workflows. That's why we built Acme: cut your close time in half.`,
    whyBad: `The first specific, interesting claim ('cut close time in half') is sentence 3. Readers decide in <1s; everything before the first concrete sentence is throat-clearing the writer needed and the reader skips. Maps to ai-patterns #21.`,
    detection: `heuristic: tokenize into sentences; compute index of the FIRST sentence containing a number, named entity, concrete verb (cut/ship/save/double), or a buyer-side noun. If that index >=2 (i.e. >=2 generic/scene-setting sentences precede it), flag with snippet 'first specific claim at sentence N; cut sentences 1..N-1'. Reinforced by deterministic-regex pre-pass for opener filler (see mkt-slop-throat-clearing).`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-hook-generic-opener', category: 'quality', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `write-social/SKILL.md #1`, section: 'mkt-hook-generic-opener',
    name: `Generic / Anti-Archetype Hook`,
    badExample: `Have you ever wondered how to grow your business? Here are 5 tips that will change everything.`,
    whyBad: `Matches a Tier-0 anti-archetype hook ('Have you ever', 'Did you know', 'Here are N tips') that every platform has seen for years; the algorithm has no differentiated signal and the reader's brain auto-skips. Direct lift of write-social anti-pattern #1.`,
    detection: `deterministic-regex on the first 15 words / first line: /^(have you ever|did you know|in this (post|video|article)|i'?m going to show you|today (i want to talk about|we'?ll)|here are \\d+ (tips|ways|things|reasons)|\\d+ (things|ways) (about|to))/i — also 'looking for X?', 'are you tired of X?', 'curious about'. Snippet quotes the matched opener.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-hook-rhetorical-question', category: 'quality', severity: 'block', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md phrase list; write-ad/SKILL.md §2b; Absolute Prohibition #3`, section: 'mkt-hook-rhetorical-question',
    name: `Rhetorical Question Hook`,
    badExample: `What if I told you the best teams don't track individual productivity at all?`,
    whyBad: `Performs curiosity instead of creating it; loads an expectation the flat follow-up can't pay off. Real people don't open with 'What if I told you' / 'Sound familiar?'. ai-patterns phrase list + write-ad 2b + Absolute Prohibition #3.`,
    detection: `deterministic-regex: a line ending in '?' that is the opener AND matches /^(what if i told you|ever wondered|sound familiar|why\\?$|the best part\\?|so what does this mean|but here'?s the question|want to know the secret|imagine if|curious)/i OR any standalone one-sentence question used as a paragraph opener. block-severity when it is the literal first line of an ad/hero.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-hook-no-pattern-interrupt', category: 'quality', severity: 'warn', tier: 'llm',
    volatility: 'stable', source: `write-social/SKILL.md — 3-second hook window`, section: 'mkt-hook-no-pattern-interrupt',
    name: `No Pattern Interrupt / No Tension`,
    badExample: `Our platform helps teams collaborate more effectively and stay organized.`,
    whyBad: `Hook contains no tension, no specificity, no stake, no surprise — nothing that stops a scroll. A flat capability statement that could open any product's page. Fails the 3-second window.`,
    detection: `llm-critic (after lexicon/heuristic passes clear): prompt 'Does the first line create tension, surprise, a stake, or a concrete specific that would stop a scroll? Answer stop|skip and name the single mechanism. If skip, what specific from the proof set would create one?' Gated to fire only when the deterministic hook rules did NOT already flag, so it isn't redundant.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-hook-body-disconnect', category: 'quality', severity: 'warn', tier: 'llm',
    volatility: 'stable', source: `write-social/SKILL.md #10`, section: 'mkt-hook-body-disconnect',
    name: `Hook–Body Disconnect`,
    badExample: `Hook: 'The #1 mistake killing your retention.' Body: generic advice about 'focusing on your customers' that names no mistake.`,
    whyBad: `Hook promises a specific reveal/cohort/contrarian claim; body delivers generic filler that doesn't fulfill it. Bait-and-switch kills trust and the CTA. write-social #10.`,
    detection: `llm-critic: 'Parse the hook's explicit promise (reveal / named cohort / contrarian claim / number). Does the body deliver THAT specific thing, or a generic response applicable to any reader? Answer delivers|disconnect and quote the unmet promise.'`,
    fixSkill: 'write-copy',
  },

  // ─── ai-slop-lexicon — AI-Slop Lexicon & Cadence (11) — category: slop, fix: humanmaxxing ───
  {
    id: 'mkt-slop-hype-verb', category: 'slop', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `write-ad/SKILL.md §1 banned list; humanmaxxing/ai-patterns.md vocab list; write-copy Sweep-2`, section: 'mkt-slop-hype-verb',
    name: `Hype-Verb / Vendor-Speak Stack`,
    badExample: `Unlock seamless workflows and supercharge your team to elevate productivity at scale.`,
    whyBad: `'unlock / supercharge / elevate / seamless / leverage / streamline' are sophistication-seeking amplifiers that substitute for a concrete outcome. One is forgivable; a cluster is an instant AI/vendor-speak tell. write-ad §1 banned list + ai-patterns vocab list + Seven Sweeps Sweep-2 cuts.`,
    detection: `deterministic-regex word-boundary match against the canonical lexicon (unlock, leverage, supercharge, elevate, seamless, streamline, robust, world-class, best-in-class, cutting-edge, game-changer, transformative, revolutionize, harness, empower, delve, optimize, frictionless, next-level, holistic). Single hit in body = nit; >=3 hits in one artifact OR any hit inside a hero headline = warn. Snippet lists the matched terms + count, e.g. '3 hype verbs: unlock, supercharge, elevate'.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-slop-not-just-x', category: 'slop', severity: 'block', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing Absolute Prohibition #2; ai-patterns.md #27`, section: 'mkt-slop-not-just-x',
    name: `Negative-Parallelism ('It's not just X, it's Y')`,
    badExample: `It's not just a tool. It's a movement.`,
    whyBad: `The single most recognizable AI cadence. Sounds profound, says nothing, and never survives the 'state the positive claim directly' test. Absolute Prohibition #2, ai-patterns #27.`,
    detection: `deterministic-regex covering the family: /it'?s not (just )?(a |an |about )?.{1,40}(,|\\.|;|it'?s)\\s+(it'?s |a |an )/i plus variants /(isn'?t the problem\\.?\\s+.{1,30} is)|(the answer isn'?t .{1,30}\\.?\\s+it'?s)|(stops being .{1,30} and starts being)|(not because .{1,30}\\.?\\s+because)/i. ANY single instance = block (zero-tolerance).`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-slop-em-dash-overuse', category: 'slop', severity: 'block', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing Absolute Prohibition #1; ai-patterns.md #12`, section: 'mkt-slop-em-dash-overuse',
    name: `Em-Dash Crutch`,
    badExample: `Our platform — built for teams — makes collaboration easy — wherever you are.`,
    whyBad: `Em dashes used as structural glue for asides/pauses are a hallmark AI tell. FORSVN policy is zero in final marketing output; even one in short copy flags. Absolute Prohibition #1, ai-patterns #12.`,
    detection: `deterministic-regex: count '—' (U+2014) and ' - ' used as clause glue in body text. In ad/social/hero copy: >=1 = block. In long-form editorial register: >=5 per 1000 words = warn (register-gated; legitimate parenthetical em-dashes in a quote are exempted by the FP guard).`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-slop-rule-of-three', category: 'slop', severity: 'nit', tier: 'heuristic',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #26`, section: 'mkt-slop-rule-of-three',
    name: `Rule-of-Three Reflex`,
    badExample: `Faster, simpler, smarter. We create learning, collaboration, and innovation.`,
    whyBad: `Ideas forced into groups of three for rhythm rather than because three things exist. Padding to or trimming to three reads as AI cadence. ai-patterns #26.`,
    detection: `heuristic: detect coordinate triads — three comma-separated single-word/short adjectives or noun phrases terminated by 'and'/period, especially adjective triads in headlines. Flag when >=2 such triads appear in one artifact OR a triad sits in the hero. Single triad in body = nit. Snippet quotes the triad.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-slop-whether-youre', category: 'slop', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `write-copy Sweep-5; ai-patterns.md #29`, section: 'mkt-slop-whether-youre',
    name: `'Whether you're A or B' False-Range`,
    badExample: `Whether you're a solo founder or a Fortune 500 CMO, our platform scales with you.`,
    whyBad: `Fake-inclusivity construction that pretends to address everyone and therefore addresses no one; A and B usually aren't real endpoints of a spectrum. Seven Sweeps Sweep-5 list + ai-patterns #29 (false ranges).`,
    detection: `deterministic-regex: /whether you'?re (an? |a )?.{2,40} or (an? |a )?.{2,40}/i and /from .{2,30} to .{2,30}/ where endpoints are not a real scale. Flag on match; downgrade to nit if the two endpoints are genuine spectrum poles (LLM-critic tiebreak only when ambiguous).`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-slop-throat-clearing', category: 'slop', severity: 'block', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing Absolute Prohibition #6; ai-patterns.md #21`, section: 'mkt-slop-throat-clearing',
    name: `Throat-Clearing / Filler-Context Opener`,
    badExample: `In today's fast-paced, ever-evolving digital landscape, businesses must adapt.`,
    whyBad: `Scene-setting that says nothing and could apply to any company, any decade. The reader's real entry point is 2-3 sentences later. Absolute Prohibition #6, ai-patterns #21.`,
    detection: `deterministic-regex on opener: /^(in (today'?s|an? (increasingly|ever-)|the (competitive|modern|current)|this (rapidly|fast)).{0,40}(world|landscape|environment|economy|market|era|age))/i plus 'as the world becomes more', 'when it comes to'. block when it is the literal first sentence.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-slop-paired-synonyms', category: 'slop', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #6`, section: 'mkt-slop-paired-synonyms',
    name: `Paired Synonyms`,
    badExample: `A clear and concise, robust and reliable, simple and straightforward solution.`,
    whyBad: `Two words meaning the same thing joined by 'and' — an AI emphasis tic humans rarely use. If you can't pick one, neither is specific enough. ai-patterns #6.`,
    detection: `deterministic-regex against a curated synonym-pair set: /(clear and concise|robust and reliable|simple and straightforward|comprehensive and thorough|fast and efficient|innovative and cutting-edge|powerful and flexible|safe and secure)/i. Any hit = warn (Hard Tell). Snippet quotes the pair.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-slop-staccato-tagline', category: 'slop', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing Absolute Prohibition #9; ai-patterns.md #37`, section: 'mkt-slop-staccato-tagline',
    name: `Staccato Tagline ('Your X, Y'd' / 'X. Y.')`,
    badExample: `Your Workflows, Mapped. Analytics. Simplified.`,
    whyBad: `Fragmentary noun+participle taglines are so overused they're an instant AI fingerprint; the form pretends to be a message but communicates nothing specific. Absolute Prohibition #9, ai-patterns #37.`,
    detection: `deterministic-regex on headline/tagline slots: /^your [a-z]+,\\s+[a-z]+(ed|d)\\.?$/i (Your Data, Protected) and /^[a-z]+\\.\\s+[a-z]+(ed|ied|fied|d)\\.?$/i (Analytics. Simplified.). Hard variants = warn on a single instance; weaker noun-noun forms ('Speed. Scale.') flag only when 2+ per piece (FP guard: one in a deck callout is human-legit).`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-slop-anaphora-cascade', category: 'slop', severity: 'nit', tier: 'heuristic',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #40`, section: 'mkt-slop-anaphora-cascade',
    name: `Anaphora Cascade`,
    badExample: `We believe in speed. We believe in trust. We believe in compounding.`,
    whyBad: `Three+ consecutive sentences with the same opener manufacture rhetorical weight; two is rhetoric, three is a tell. ai-patterns #40.`,
    detection: `heuristic: extract first 1-2 tokens of each consecutive sentence/line; if the same opener (We/They/This/It's/Imagine/Every/No) repeats >=3 times in a row, flag. Snippet shows the repeated opener + count. Cap-at-two is the fix.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-slop-colon-reveal', category: 'slop', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing Absolute Prohibition #4; ai-patterns.md #30`, section: 'mkt-slop-colon-reveal',
    name: `Colon-List / Colon-Reveal Dependency`,
    badExample: `Here's why this matters: speed, trust, scale. The answer: automation.`,
    whyBad: `Colons used as a structural crutch to introduce dramatic reveals or lists in prose marketing copy. Absolute Prohibition #4, ai-patterns #30.`,
    detection: `deterministic-regex: prose lines matching /\\b(here'?s (why|what|how|the)|the (answer|secret|truth|point|reason))\\s*:/i or any ': ' followed immediately by a bulleted list in body prose (not in technical docs/specs, which are exempt by FP guard). warn in marketing register.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-slop-meme-frame', category: 'slop', severity: 'warn', tier: 'regex',
    volatility: 'trend', asOf: '2026-06-23', source: `humanmaxxing/ai-patterns.md #39/#41/#43/#46`, section: 'mkt-slop-meme-frame',
    name: `Dead-Meme / Trend-Manufacture Frame`,
    badExample: `Async has entered the chat. Newsletters are having a moment. Long-form is the new short-form.`,
    whyBad: `'X has entered the chat' / 'X is having a moment' / 'X is the new Y' / 'it's giving X' assert cultural momentum with no evidence — they substitute a meme for the actual signal (revenue, search-trend, named instances). ai-patterns #39/41/43/46.`,
    detection: `deterministic-regex: /(has entered the chat|is having (a|its) moment|is the new |it'?s giving )/i. Hard variants = warn on first hit; '...is the new...' is nit unless 2+ or no displacement data nearby. Snippet flags the missing evidence.`,
    fixSkill: 'humanmaxxing',
  },

  // ─── claim-quality — Claim Quality (7) — category: quality, fix: write-copy ───
  {
    id: 'mkt-claim-unfalsifiable-superlative', category: 'quality', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md lazy-extremes; write-ad/SKILL.md §3a`, section: 'mkt-claim-unfalsifiable-superlative',
    name: `Unfalsifiable Superlative`,
    badExample: `The world's most powerful, most intuitive platform — trusted by everyone.`,
    whyBad: `Lazy extremes (best, most, everyone, always, never, leading) make a claim sound definitive without proof; unfalsifiable filler a competitor could copy verbatim. ai-patterns 'lazy extremes' list + write-ad §3a false-specificity.`,
    detection: `deterministic-regex for absolutes (best|most|#1|world-class|industry-leading|leading|everyone|always|never|guaranteed) WITHOUT an adjacent number, named entity, or citation within the same clause. heuristic confirm: claim has a superlative token and no proof token within N words. warn; block if it's the hero claim.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-claim-competitor-swap-fail', category: 'quality', severity: 'warn', tier: 'llm',
    volatility: 'stable', source: `write-copy Sweep-5 — competitor-swap test`, section: 'mkt-claim-competitor-swap-fail',
    name: `Competitor-Swap Failure (No Specificity)`,
    badExample: `We help businesses grow faster with powerful, easy-to-use tools.`,
    whyBad: `Swap the brand name for a top-3 competitor and the copy still reads as plausible — so it says nothing specific to THIS product. write-copy's Sweep-5 competitor-swap test; the core specificity gate.`,
    detection: `llm-critic (the canonical write-copy test): 'Replace the brand name with [named competitor]. Does the copy still read as true and plausible? If yes, FAIL specificity and name the one detail that would make it brand-unique.' Deterministic pre-filter: artifacts with zero numbers AND zero named entities in the body are auto-routed to this critic.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-claim-feature-not-benefit', category: 'quality', severity: 'warn', tier: 'llm',
    volatility: 'stable', source: `write-copy Sweep-3`, section: 'mkt-claim-feature-not-benefit',
    name: `Feature-Not-Benefit (No 'So What')`,
    badExample: `Built on a distributed event-sourced architecture with 99.99% uptime SLA.`,
    whyBad: `States what the product IS/HAS without answering 'why should the reader care?'. Every claim must map to a Sweep-3 'so what' that isn't restatement. write-copy Sweep-3.`,
    detection: `llm-critic: 'For each top claim, is there a reader-side outcome (saves time/money, removes a named friction, reduces a risk) stated or one step away? Answer benefit|feature-only per claim and supply the missing so-what.' Heuristic prior: high density of spec nouns (architecture, API, SLA, integration) with no outcome verbs (save/cut/win/avoid) raises priority.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-claim-fabricated-precision', category: 'quality', severity: 'block', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #34/#36; write-ad/SKILL.md §3b; Absolute Prohibition #8`, section: 'mkt-claim-fabricated-precision',
    name: `Fabricated / Unsourced Precision`,
    badExample: `Studies show 73% of users abandon onboarding, costing teams $47,000 a quarter.`,
    whyBad: `Specific-sounding stat with no named source — often hallucinated; 47/73 are known LLM number fingerprints. Unsourced precision is worse than no number; it looks like a lie. ai-patterns #34/#36, write-ad §3b, Absolute Prohibition #8.`,
    detection: `deterministic-regex: a percentage or precise figure NOT within ~12 words of a source token (named company/study/'according to'/year/citation); plus a hard sub-rule flagging unsourced 47 or 73. write-ad makes stat-without-source auto-fail. block.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-claim-vague-attribution', category: 'quality', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #10`, section: 'mkt-claim-vague-attribution',
    name: `Vague Attribution`,
    badExample: `Experts agree this is the future. Industry reports suggest strong growth.`,
    whyBad: `Claims attributed to unnamed authorities ('experts say', 'studies show', 'observers note') — humans name their sources. ai-patterns #10.`,
    detection: `deterministic-regex: /(experts?|analysts?|observers?|critics?|studies|research|industry (reports?|data)|some people)\\s+(say|argue|agree|suggest|believe|note|show|find)/i with no proper-noun source in the same sentence. warn.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-claim-telling-not-showing', category: 'quality', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #33`, section: 'mkt-claim-telling-not-showing',
    name: `Telling-Not-Showing / Vague Declarative`,
    badExample: `The results are game-changing. The impact is significant. This matters.`,
    whyBad: `Announces that something is important/significant without naming what or why — performs emphasis instead of providing it. ai-patterns #33.`,
    detection: `deterministic-regex for empty declaratives: /(the (results?|impact|implications?|stakes|difference) (are|is) (significant|huge|game-changing|massive|real|undeniable))|this (matters|changes everything|is a big deal)/i with no adjacent concrete consequence (number/named outcome). warn.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-claim-hypothetical-as-measured', category: 'quality', severity: 'block', tier: 'llm',
    volatility: 'stable', source: `write-ad/SKILL.md §3c/§3d`, section: 'mkt-claim-hypothetical-as-measured',
    name: `Hypothetical Framed as Measured Result`,
    badExample: `Imagine cutting close time 55% — that's exactly what our customers do.`,
    whyBad: `Frames a hypothetical as if it were a measured outcome, or generalizes one customer's result as typical. Borderline-deceptive; write-ad §3c/§3d auto-fail.`,
    detection: `heuristic + llm-critic: detect 'imagine/what if [outcome] — that's what our customers do' bridges and single-testimonial outcomes stated without '(one customer)'/cohort scoping. llm-critic confirms whether the number is presented as typical vs illustrative. block when an outcome number is implied-typical without cohort data.`,
    fixSkill: 'write-copy',
  },

  // ─── cta — CTA Failures (6) — category: quality, fix: write-copy ───
  {
    id: 'mkt-cta-weak-verb', category: 'quality', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `write-ad/SKILL.md §5g`, section: 'mkt-cta-weak-verb',
    name: `Weak / Default CTA Verb`,
    badExample: `Learn more. Click here. Submit.`,
    whyBad: `'Learn more' / 'Click here' / 'Submit' carry no value framing and no momentum; they name the mechanism, not the payoff. write-ad §5g.`,
    detection: `deterministic-regex on button/CTA slot: /^(learn more|click here|submit|get started|read more|find out more|sign up|continue)\\.?$/i with no value clause. warn; pair the verb with the outcome ('Start a 14-day trial', 'See your first report').`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-cta-multiple-competing', category: 'quality', severity: 'block', tier: 'heuristic',
    volatility: 'stable', source: `write-ad/SKILL.md §5a`, section: 'mkt-cta-multiple-competing',
    name: `Multiple Competing CTAs`,
    badExample: `Try free → then upgrade! Also book a demo AND share with your team.`,
    whyBad: `More than one primary action splits intent and degrades the conversion signal; one ad/section, one CTA. write-ad §5a auto-fail.`,
    detection: `deterministic-heuristic: count distinct primary action verbs in CTA + hero region (try/buy/book/download/sign up/demo/share). >1 in a single ad variant or a single landing-section = block. Secondary/text links exempted by FP guard (only button-weight CTAs count).`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-cta-no-value-or-urgency', category: 'quality', severity: 'nit', tier: 'llm',
    volatility: 'stable', source: `write-copy — CTA value + reason-to-act`, section: 'mkt-cta-no-value-or-urgency',
    name: `CTA Without Value or Reason-to-Act-Now`,
    badExample: `Get started today.`,
    whyBad: `No statement of what the reader gets or why now; 'today' is hollow urgency with no anchor. A CTA should pair an action verb with a concrete payoff or a real, non-manufactured reason.`,
    detection: `llm-critic gated behind the regex passes: 'Does the CTA state (a) what the reader gets and (b) a real reason it's worth doing now? Flag if either is missing; reject manufactured urgency (see mkt-cta-fake-urgency).' nit unless it's the hero CTA.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-cta-fake-urgency', category: 'quality', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `write-ad/SKILL.md §5 — fake-urgency dark pattern`, section: 'mkt-cta-fake-urgency',
    name: `Manufactured / Fake Urgency`,
    badExample: `Only 2 spots left! Offer ends at midnight! Act now before it's gone!`,
    whyBad: `Countdown/scarcity with no real basis is a trust-eroding dark-pattern tell; readers are inoculated and it cheapens the brand. The marketing analog of Impeccable's 'theater' slop.`,
    detection: `deterministic-regex: /(only \\d+ (spots?|seats?|left)|act (now|fast) before|ends (tonight|at midnight|soon)|last chance|don'?t miss out|limited time only)/i NOT backed by a verifiable constraint (real inventory/date token nearby). warn; block if repeated or in a register (B2B/luxury) where it's off-brand.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-cta-engagement-bait', category: 'quality', severity: 'block', tier: 'regex',
    volatility: 'trend', asOf: '2026-06-23', source: `write-social/SKILL.md #8`, section: 'mkt-cta-engagement-bait',
    name: `Engagement-Bait CTA`,
    badExample: `Comment YES if you agree. Like if this helped. Follow for more.`,
    whyBad: `Explicit bait phrasing that TikTok/Meta/LinkedIn algorithms detect and deprioritize as inauthentic engagement; underperforms even where not penalized. write-social #8.`,
    detection: `deterministic-regex: /(like (this )?if you|comment (yes|done|[a-z]+ below)|share to win|tag a friend|follow for more|smash that)/i. block on tiktok/reels/linkedin (documented penalty); warn (advisory) on x.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-cta-bait-and-switch', category: 'quality', severity: 'warn', tier: 'heuristic',
    volatility: 'stable', source: `write-ad/SKILL.md §5f`, section: 'mkt-cta-bait-and-switch',
    name: `Bait-and-Switch CTA`,
    badExample: `Ad CTA says 'Start free trial'; the landing-page button says 'Request a demo'.`,
    whyBad: `CTA verb doesn't match the destination's primary action; the mismatch breaks the click-through promise and tanks conversion + Quality Score. write-ad §5f.`,
    detection: `heuristic (cross-artifact): when both ad copy and its landing-page target are in scope, compare the ad CTA verb against the LP primary button verb; flag mismatch. Snippet shows both verbs. warn.`,
    fixSkill: 'write-copy',
  },

  // ─── voice-register — Voice / Register (7) — category: slop, fix: humanmaxxing ───
  {
    id: 'mkt-voice-hedge-stack', category: 'slop', severity: 'warn', tier: 'heuristic',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #8; write-ad/SKILL.md §2c`, section: 'mkt-voice-hedge-stack',
    name: `Hedge Stacking`,
    badExample: `This approach might potentially offer some benefits in certain situations.`,
    whyBad: `Multiple hedges in one sentence ('might potentially... some... certain') drain all conviction; experts commit or cut. ai-patterns #8, write-ad §2c ('just'/'quick' softeners).`,
    detection: `deterministic-heuristic: count hedge tokens per sentence (might, may, could, potentially, possibly, somewhat, perhaps, arguably, generally, often, just, quite, fairly, in some cases). >=2 in one sentence = warn. Plus single 'just'/'quick' as a hedge in ad copy = nit fix-in-place.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-voice-corporate-passive', category: 'slop', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `write-ad/SKILL.md §7b; humanmaxxing/ai-patterns.md #7`, section: 'mkt-voice-corporate-passive',
    name: `Corporate Passive / Announcement Voice`,
    badExample: `It has been determined that our solution is leveraged by leading enterprises.`,
    whyBad: `Passive 'it has been determined', press-release 'we're proud to announce / introducing the all-new' hides the actor and reads as a press release, not a person. write-ad §7b + copula-avoidance ai-patterns #7.`,
    detection: `deterministic-regex: passive-by-X / 'it (has been|is) (determined|noted|believed)', plus announcement frames /(introducing the (all-new|new)|we'?re (proud|excited|thrilled) to announce|welcome to a new era|usher in)/i. Also copula-avoidance verbs as subject-heavy openers (serves as / stands as / boasts / is a testament to). warn.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-voice-on-the-nose-meta', category: 'slop', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md meta-commentary; #22`, section: 'mkt-voice-on-the-nose-meta',
    name: `On-the-Nose Meta-Copy`,
    badExample: `In this section, we'll walk you through everything you need to know. Let's dive in.`,
    whyBad: `Copy narrating its own structure ('in this section', 'let me walk you through', 'let's dive in') — assistant-mode filler; the writing should just do the thing. ai-patterns meta-commentary list + #22 comprehensive-promise.`,
    detection: `deterministic-regex: /(in this (section|post|guide),? we'?ll|let me walk you through|let'?s (dive in|explore|get started)|before we (dive in|begin)|here'?s the thing:|this (comprehensive|complete) guide (will|covers))/i. warn.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-voice-sender-first', category: 'slop', severity: 'warn', tier: 'heuristic',
    volatility: 'stable', source: `write-ad/SKILL.md §7a`, section: 'mkt-voice-sender-first',
    name: `Sender-First / We-Not-You Framing`,
    badExample: `We help teams do more. Our platform is the leading solution. I'm reaching out because...`,
    whyBad: `Opens about the sender/product instead of the reader's situation; the first 30 chars should be 'you' or a prospect-side noun. write-ad §7a.`,
    detection: `deterministic-heuristic: scan first ~30 chars / first clause of body for 'We/Our/I/[ProductName]' as subject with no 'you/your' present. Flag. Snippet 'opens sender-first; re-front with you/prospect noun'. warn.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-voice-brand-inconsistent', category: 'slop', severity: 'warn', tier: 'llm',
    volatility: 'stable', source: `write-social/SKILL.md #5`, section: 'mkt-voice-brand-inconsistent',
    name: `Brand-Voice Inconsistency`,
    badExample: `Founder-mode brand posts 'Our company is committed to delivering innovative, scalable, best-in-class solutions.'`,
    whyBad: `Voice register contradicts the declared brand_mode — corporate cliché in a founder voice, or confessional 'I' in a company voice. Erodes trust fastest on social. write-social #5.`,
    detection: `heuristic keyed to declared brand_mode + llm-critic: founder mode flags 3+ of {corporate-passive, third-person brand ref, mission-statement filler, buzzword stack}; company mode flags 3+ of {first-person-singular brand voice, off-register slang}. Requires brand-voice context (BRAND.md) to be loaded; skipped with a note if absent.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-voice-reading-grade-mismatch', category: 'slop', severity: 'nit', tier: 'heuristic',
    volatility: 'stable', source: `write-social/SKILL.md — channel reading-grade band`, section: 'mkt-voice-reading-grade-mismatch',
    name: `Wrong Reading Grade for Channel`,
    badExample: `Our platform facilitates the optimization of organizational productivity paradigms. (in a consumer TikTok caption)`,
    whyBad: `Sentence complexity / grade level wrong for the audience and channel — PhD-grade prose in a Gen-Z social slot, or baby-talk in an enterprise security page. Friction = scroll.`,
    detection: `heuristic: compute Flesch-Kincaid grade + mean sentence length; compare to a per-channel target band (tiktok/reels ~grade 5-7 short sentences; B2B landing ~grade 8-11; legal exempt). Flag when grade is >2 bands off target. Snippet reports measured grade vs target. nit (advisory).`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-voice-permission-closer', category: 'slop', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #20`, section: 'mkt-voice-permission-closer',
    name: `Permission-Seeking / Assistant Closer`,
    badExample: `I hope this helps! Let me know if you'd like me to elaborate. Feel free to reach out!`,
    whyBad: `Ends in assistant-mode offers ('let me know if', 'feel free to', 'hope this helps') instead of a recommendation or next step. Dead giveaway of LLM authorship. ai-patterns #20.`,
    detection: `deterministic-regex on the closing block: /(i hope this helps|let me know if you'?d like|feel free to (reach out|ask)|would you like me to|don'?t hesitate to)/i. warn (block in published-asset register).`,
    fixSkill: 'humanmaxxing',
  },

  // ─── structure — Structure & Scannability (5) — category: slop, fix: humanmaxxing ───
  {
    id: 'mkt-struct-wall-of-text', category: 'slop', severity: 'warn', tier: 'heuristic',
    volatility: 'stable', source: `write-ad/SKILL.md §5b; write-social/SKILL.md #7`, section: 'mkt-struct-wall-of-text',
    name: `Wall of Text / Paragraph Wall`,
    badExample: `A single 9-sentence paragraph of primary text with no line breaks in a mobile ad.`,
    whyBad: `Long unbroken blocks fail the scroll-stop test on every subsequent line; mobile feeds render short lines and reward dwell. write-ad §5b, write-social #7.`,
    detection: `deterministic-heuristic: flag any paragraph/primary-text block with >=8 sentences OR >300 chars with no line break, scoped to ad/social/hero (long-form editorial exempt). Snippet reports sentence/char count. warn.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-struct-no-scannability', category: 'slop', severity: 'warn', tier: 'heuristic',
    volatility: 'stable', source: `write-social/SKILL.md #7`, section: 'mkt-struct-no-scannability',
    name: `No Scannability (Pasted-From-Blog)`,
    badExample: `Mean sentence length 24 words, zero line breaks, 'In conclusion,' and 'Furthermore,' in a social caption.`,
    whyBad: `Blog prose dropped into a short-form surface without compression; reads like homework, kills dwell/completion. write-social #7.`,
    detection: `heuristic: (avg sentence length >20 words) AND (no visual break in any 200+ char span) AND/OR presence of SEO-essay connectives (In conclusion / To summarize / Furthermore / It is worth noting). Channel-scoped to short-form. warn.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-struct-headline-overflow', category: 'slop', severity: 'block', tier: 'regex',
    volatility: 'stable', source: `write-social/SKILL.md #2/#4`, section: 'mkt-struct-headline-overflow',
    name: `Headline / Char-Cap Overflow`,
    badExample: `A 240-char X post; a LinkedIn hook whose tension only appears at char 260 (past the ~210 fold).`,
    whyBad: `Tension/CTA lands past the platform's visible-before-truncation window or hard cap; the expand-or-scroll decision is made in <1s on the visible window. The copy analog of Impeccable's text-overflow. write-social #2/#4.`,
    detection: `deterministic-regex/measure against per-platform caps from platform-intelligence: X hard 280; TikTok/Reels soft ~70-80 for the hook; LinkedIn soft ~140-210 to the fold. Hook tension or CTA after the cap with no fold-peek signal = block on hard-cap platforms (X), warn on soft. Snippet reports char position vs cap.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-struct-monotone-cadence', category: 'slop', severity: 'nit', tier: 'heuristic',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #1/#3; write-ad/SKILL.md §2f`, section: 'mkt-struct-monotone-cadence',
    name: `Every-Section/Sentence-the-Same Cadence`,
    badExample: `Five sections each exactly 3 paragraphs with a subhead, a list, and a closing line; or 5 sentences all 11-13 words.`,
    whyBad: `Uniform section length and metronomic sentence rhythm read as machine-generated; humans spend words where it matters and vary cadence. ai-patterns #1/#3, write-ad §2f metronomic rhythm.`,
    detection: `heuristic: compute sentence-length variance / burstiness; flag when 4+ consecutive sentences fall within 2 words of each other (write-ad rule) OR section-length stdev is near-zero across >=3 sections. Snippet reports the low-variance run. nit (warn when it co-occurs with other slop).`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-struct-symmetric-list', category: 'slop', severity: 'nit', tier: 'heuristic',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #2/#14`, section: 'mkt-struct-symmetric-list',
    name: `Symmetric / Bold-Label List`,
    badExample: `- Communication: Effective communication ensures alignment...\n- Organization: Strong organization keeps timelines...`,
    whyBad: `Every list item same length, same 'Bold Label: explanation' structure; human lists are messy and weight the important item. ai-patterns #2/#14.`,
    detection: `heuristic: detect lists where >=3 items share the '**Label:** sentence' shape AND item lengths are within a tight band. Snippet quotes the uniform items. nit.`,
    fixSkill: 'humanmaxxing',
  },

  // ─── channel-fit — Channel-Fit Violations (6) — category: slop, fix: humanmaxxing ───
  {
    id: 'mkt-channel-format-mismatch', category: 'slop', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `write-social/SKILL.md #3`, section: 'mkt-channel-format-mismatch',
    name: `Platform Format Mismatch`,
    badExample: `Thread markers ('1/', '2/') inside a single-post slot; a LinkedIn 'carousel' written as one prose paragraph.`,
    whyBad: `Copy written in a format the declared surface doesn't support won't be distributed as intended regardless of copy quality. write-social #3.`,
    detection: `deterministic-regex keyed to declared platform+format: thread markers in a single-post artifact; carousel format with no slide demarcation; vertical-video caption containing ## headings (blog structure); a format that doesn't exist on the platform (thread on TikTok). warn.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-channel-linkedin-cringe', category: 'slop', severity: 'warn', tier: 'llm',
    volatility: 'trend', asOf: '2026-06-23', source: `write-social/SKILL.md — broetry/LinkedIn register`, section: 'mkt-channel-linkedin-cringe',
    name: `LinkedIn-Cringe / Broetry`,
    badExample: `I fired my best employee today.\n\nHere's why.\n\n(it was the best decision I ever made)\n\nAgree?`,
    whyBad: `Manufactured-vulnerability one-line-per-paragraph 'broetry' with a fake-shock hook and an engagement-bait tail — the saturated, reflex-reject LinkedIn format the audience now distrusts.`,
    detection: `heuristic + llm-critic: detect the structural fingerprint (>=4 one-sentence paragraphs separated by blank lines) + a shock/confession opener + a single-word reaction-bait closer; llm-critic confirms the 'fake-vulnerability hook' read. warn. Register FP guard: legitimate short-line storytelling without the bait isn't flagged.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-channel-thread-bait', category: 'slop', severity: 'warn', tier: 'regex',
    volatility: 'trend', asOf: '2026-06-23', source: `write-social/SKILL.md — X thread-bait saturation`, section: 'mkt-channel-thread-bait',
    name: `Twitter Thread-Bait`,
    badExample: `🧵 A thread on why most founders fail (and how to fix it). 1/ Let's go.`,
    whyBad: `Listicle thread-bait scaffolding ('🧵 a thread on', 'a mega-thread', '1/ Let's go', 'bookmark this') is platform-saturated and reads as engagement farming, not insight.`,
    detection: `deterministic-regex: /(🧵|a (mega-?)?thread (on|about)|let'?s go\\.?\\s*\\d+\\/|bookmark this|read till the end|here'?s everything)/i in an X artifact. warn.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-channel-emoji-spam', category: 'slop', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #13; write-ad/SKILL.md §5d; Absolute Prohibition #7`, section: 'mkt-channel-emoji-spam',
    name: `Emoji-as-Structure / Emoji Spam`,
    badExample: `🚀 Key features: ⚡ Speed ✅ Reliability 🔥 Scale 👉 Try it now!`,
    whyBad: `Emojis used as bullets/section markers/emphasis (rocket, fire, check, point-right) are a structural AI tell and read as low-effort in any serious channel. ai-patterns #13, write-ad §5d, Absolute Prohibition #7.`,
    detection: `deterministic-regex/count: emoji used as a line-leading bullet or >=3 emoji in a headline / >=5 in primary text. In long-form/landing: any structural emoji = block. In casual social where brand voice permits: only spam-density flags. Register-gated.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-channel-early-external-link', category: 'slop', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `write-social/SKILL.md #9`, section: 'mkt-channel-early-external-link',
    name: `Reach-Suppressing Early External Link`,
    badExample: `Big news! Read the full post at example.com/blog 👇 (as the first line of a LinkedIn/X post)`,
    whyBad: `Raw external URL in the post body / above the fold where the platform documents reach suppression; first-comment link is the native move. write-social #9.`,
    detection: `deterministic-regex: raw URL in tweet-1 / first 3 lines of a LinkedIn native post. warn on X/LinkedIn; not applicable on TikTok/Reels/Shorts (link-in-bio convention) per FP guard.`,
    fixSkill: 'humanmaxxing',
  },
  {
    id: 'mkt-channel-all-caps', category: 'slop', severity: 'block', tier: 'regex',
    volatility: 'stable', source: `write-ad/SKILL.md §5e`, section: 'mkt-channel-all-caps',
    name: `ALL-CAPS Headline (Policy/Readability)`,
    badExample: `GET 50% OFF NOW — LIMITED TIME ONLY!!!`,
    whyBad: `All-caps headlines are a Meta-policy auto-reject and read as shouting; also screen-reader hostile. write-ad §5e.`,
    detection: `deterministic-regex: headline/CTA token run that is >=3 consecutive ALL-CAPS words (excluding known acronyms via an allowlist FP guard: API, SaaS, CRM, AI, B2B). block on paid-ad surfaces, warn elsewhere.`,
    fixSkill: 'humanmaxxing',
  },

  // ─── persuasion-structure — Persuasion Structure (5) — category: quality, fix: write-copy ───
  {
    id: 'mkt-persuasion-no-spine', category: 'quality', severity: 'warn', tier: 'llm',
    volatility: 'stable', source: `write-copy — PAS/AIDA spine`, section: 'mkt-persuasion-no-spine',
    name: `No PAS/AIDA Spine`,
    badExample: `A landing page that lists 6 features and a price, with no problem stated, no desired outcome, and no single conversion path.`,
    whyBad: `Persuasive copy needs a spine — Problem→Agitate→Solution or Attention→Interest→Desire→Action. A feature dump with no problem framing and no progression gives the reader no reason to move.`,
    detection: `llm-critic over the full artifact: 'Identify the persuasion structure. Is there (1) a stated problem/attention grab, (2) stakes/desire, (3) the solution-as-resolution, (4) one action? Name which beats are missing.' Heuristic prior: a landing page with a features section but no problem/outcome language raises priority.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-persuasion-no-objection-handling', category: 'quality', severity: 'warn', tier: 'llm',
    volatility: 'stable', source: `write-copy Sweep-7 — Zero-Risk`, section: 'mkt-persuasion-no-objection-handling',
    name: `Missing Objection Handling`,
    badExample: `A pricing page asking for a credit card with no mention of cancellation, security, migration effort, or money-back.`,
    whyBad: `The reader's top blockers (risk, switching cost, trust, price) go unaddressed, so the CTA asks for a leap with no bridge. write-copy Sweep-7 Zero-Risk: every barrier to action should be neutralized.`,
    detection: `llm-critic: 'List the 2-3 likely objections for this audience+offer. Does the copy neutralize each (guarantee, easy out, security proof, migration help, low first step)? Name unhandled objections.' Deterministic prior: a purchase/signup CTA with no risk-reversal token (free trial, refund, cancel anytime, no card) nearby flags for this critic.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-persuasion-no-social-proof', category: 'quality', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `write-ad/SKILL.md §3a`, section: 'mkt-persuasion-no-social-proof',
    name: `Empty / Missing Social-Proof Slot`,
    badExample: `Trusted by leading companies. (no logos, no names, no numbers)`,
    whyBad: `A claim of trust with no named customer, number, logo, or quote is an empty slot — it signals the proof exists but withholds it, which reads as weaker than no claim. write-ad §3a false-specificity.`,
    detection: `deterministic-regex: /(trusted by|used by|loved by|join (thousands|millions)|leading (companies|teams|brands))/i NOT followed by a named entity / specific number within the section. warn. (FP guard: a real logo wall or named quote nearby clears it.)`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-persuasion-caveat-avalanche', category: 'quality', severity: 'warn', tier: 'heuristic',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #19`, section: 'mkt-persuasion-caveat-avalanche',
    name: `Caveat Avalanche`,
    badExample: `Results may vary. Every situation is unique. Always consult a professional. This is not advice.`,
    whyBad: `A footer pile of disclaimers/qualifiers kills momentum at the exact moment of decision; CYA energy that reads as no-confidence. ai-patterns #19.`,
    detection: `deterministic-heuristic: count qualifier/disclaimer sentences in the closing region (results may vary / every situation is unique / consult a professional / this is not X advice / depending on your circumstances). >=2 stacked = warn. FP guard: genuine legal/regulated-industry disclaimers are exempt by register.`,
    fixSkill: 'write-copy',
  },
  {
    id: 'mkt-persuasion-generic-conclusion', category: 'quality', severity: 'warn', tier: 'regex',
    volatility: 'stable', source: `humanmaxxing/ai-patterns.md #25/#5`, section: 'mkt-persuasion-generic-conclusion',
    name: `Generic Positive Conclusion`,
    badExample: `The future looks bright. The possibilities are endless. Exciting times lie ahead.`,
    whyBad: `Empty upbeat ending with no concrete next step or prediction; says nothing and replaces the CTA's job. ai-patterns #25/#5.`,
    detection: `deterministic-regex: /(the future (looks bright|is bright)|possibilities are (endless|exciting)|exciting times (lie ) ?ahead|the sky'?s the limit|we can achieve (great|remarkable) things)/i in the closing block. warn — replace with a measurable next step.`,
    fixSkill: 'write-copy',
  },

  // ─── gated provider-tell starters (3) — NOT taxonomy rules, NOT in the catalog, NOT in the 52.
  //     Mirror Impeccable's provider blocks: OFF by default, enabled per-harness via --claude/--gpt/--gemini.
  {
    id: 'mkt-provider-claude-tell', category: 'slop', severity: 'warn', tier: 'heuristic',
    volatility: 'trend', asOf: '2026-06-23', source: `taxonomy.modelSpecificTells — Claude`, section: 'mkt-provider-claude-tell',
    name: `Claude copy-tells (em-dash glue, tricolon, not-just-X, fairness-hedge)`,
    badExample: `Our platform — built for teams — isn't just a tool, it's a movement. To be fair, while it's powerful, it's also worth noting it's simple.`,
    whyBad: `Claude's signature copy tells cluster: em-dash-as-clause-glue, the tricolon/rule-of-three reflex, the 'it's not just X, it's Y' negative-parallelism cadence, warm hedged 'to be fair / I want to be clear' fairness-framing, balanced both-sides 'while X, it's also worth noting Y' structures, and over-polished low-burstiness even cadence.`,
    detection: `heuristic: em-dash clause-glue, tricolon reflex, not-just-X cadence, fairness-hedge openers, both-sides framing, low-burstiness even cadence. Gated --claude; compiled per-harness so a non-Claude run never sees this block.`,
    fixSkill: 'humanmaxxing', gated: 'claude',
  },
  {
    id: 'mkt-provider-gpt-tell', category: 'slop', severity: 'warn', tier: 'heuristic',
    volatility: 'trend', asOf: '2026-06-23', source: `taxonomy.modelSpecificTells — GPT`, section: 'mkt-provider-gpt-tell',
    name: `GPT theater/scaffolding tells`,
    badExample: `Most people think growth is hard. They're wrong. Here's the thing: it's giving founder-mode. Let's dive in — 10x your results, guaranteed.`,
    whyBad: `GPT's tells: the 'theater'/strawman framing (manufacture a wrong belief to knock down), heavy bolded-keyword scaffolding and colon-reveal lists, aphoristic staccato taglines, dead-meme frames ('has entered the chat', 'it's giving'), exclamation/emoji inflation, 'let's dive in / let's break it down' meta-narration, and rounded confident stats (50%/30%/10x).`,
    detection: `heuristic: strawman theater, colon-reveal scaffolding, dead-meme frames, rounded confident stats. Gated --gpt; compiled per-harness.`,
    fixSkill: 'humanmaxxing', gated: 'gpt',
  },
  {
    id: 'mkt-provider-gemini-tell', category: 'slop', severity: 'warn', tier: 'heuristic',
    volatility: 'trend', asOf: '2026-06-23', source: `taxonomy.modelSpecificTells — Gemini`, section: 'mkt-provider-gemini-tell',
    name: `Gemini list-maximalism/hedge tells`,
    badExample: `This comprehensive guide will cover everything. It's important to note, however, that results may vary. The platform / the tool / the solution delivers.`,
    whyBad: `Gemini's tells: list-maximalism and symmetric/bold-label lists (every item the same shape), over-hedging and caveat avalanches ('it's important to note', 'however, results may vary'), encyclopedic comprehensive-promise intros, Title-Case-Everything headings, and synonym-cycling the same entity across paragraphs (the platform/the tool/the solution/the system).`,
    detection: `heuristic: list-maximalism, symmetric bold-label lists, hedge/caveat avalanche, comprehensive-promise intro, title-case headings, entity synonym-cycling. Gated --gemini; compiled per-harness.`,
    fixSkill: 'humanmaxxing', gated: 'gemini',
  },
];

// ─── FOR-55/S6: critic calibration status (the calibrate-before-ship gate) ───
// The 10 tier:'llm' rules are the SUBJECTIVE tier. Authority is asymmetric — one confident wrong
// 'this hook is weak' collapses operator trust (slop-detector.md §2.1). So a tier:'llm' rule speaks
// ONLY after it clears a judge-variance bound (margin > 2×variance && margin ≥ 0.5) on the S6 golden
// corpus, measured by forsvn-slop/scripts/calibrate-critic.ts (operator-run; makes LLM calls). The
// cleared ids are listed HERE — one place, no per-entry drift — and stamped onto each rule as
// `.calibrated`. An un-calibrated rule is gated OFF, NOT shipped advisory-with-low-confidence.
//
// Pinned evidence: tests/goldens/critic-llm/calibration-report.json (shippable flags). The gate test
// _dev/test-critic-calibration.ts asserts this set === the report's shippable:true set, so the two
// can never drift. To calibrate: run calibrate-critic.ts, then add each newly-shippable id below in
// the SAME commit that re-pins the report.
//
// EMPTY at ship: S6 lands the critic + machinery; calibration is the operator's gated next step.
export const CALIBRATED_LLM_IDS = new Set([
  // (none yet — run `bun forsvn-slop/scripts/calibrate-critic.ts` to populate)
]);

for (const r of ANTIPATTERNS) {
  if (r.tier === 'llm') r.calibrated = CALIBRATED_LLM_IDS.has(r.id);
}

// ─── Accessors (the contract every downstream surface reads through) ───

/** Find one registry entry by id (core or gated). Returns undefined if unknown. */
export function getAntipattern(id) {
  return ANTIPATTERNS.find((r) => r.id === id);
}

/** The 52 taxonomy-derived core rules (excludes the 3 gated provider starters). */
export function getCoreRules() {
  return ANTIPATTERNS.filter((r) => !r.gated);
}

/** Core rules in a category ('slop' | 'quality'). */
export function getRulesForCategory(category) {
  return getCoreRules().filter((r) => r.category === category);
}

/** Core rules in a tier ('regex' | 'heuristic' | 'llm'). */
export function getRulesForTier(tier) {
  return getCoreRules().filter((r) => r.tier === tier);
}

/**
 * The tier:'llm' rules the critic (S6) is CLEARED to fire — calibrated===true only. Empty until the
 * operator runs calibrate-critic.ts and lists the cleared ids in CALIBRATED_LLM_IDS. FOR-57's
 * orchestrator constructs the critic input from exactly this set; an un-calibrated rule never speaks.
 */
export function getCalibratedLlmRules() {
  return getCoreRules().filter((r) => r.tier === 'llm' && r.calibrated === true);
}

/** The zero-tolerance denylist: core rules with severity 'block' (the 10). */
export function getDenylist() {
  return getCoreRules().filter((r) => r.severity === 'block');
}

/** The set of providers any rule is gated to — {claude, gpt, gemini} with the starters. */
export const GATED_PROVIDERS = new Set(ANTIPATTERNS.map((r) => r.gated).filter(Boolean));

/**
 * Drop findings whose rule is gated to a provider that is not enabled. Copies
 * Impeccable's mechanic: when no rule is gated, pass everything through; otherwise
 * keep a finding unless its rule.gated is set and not in the enabled set.
 * @param findings array of finding() objects (each carries `.antipattern` = rule id)
 * @param providers enabled provider list, e.g. ['gpt']; default [] = all gated rules off
 */
export function filterByProviders(findings, providers = []) {
  if (GATED_PROVIDERS.size === 0) return findings;
  const enabled = new Set(providers);
  return findings.filter((f) => {
    const rule = getAntipattern(f.antipattern);
    if (!rule || !rule.gated) return true;
    return enabled.has(rule.gated);
  });
}
