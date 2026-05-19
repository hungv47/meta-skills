# Execution & Evaluation — Idea Catalog

All ideas for closing the strategy → execution → evaluation loop. Deduplicated and ordered by dependency.

---

## LAYER 1 — Shared Context Foundation

These establish the common context surface that all other skills read before dispatching. Without this layer, every skill cold-starts independently and users answer the same questions repeatedly.

### 1.1 — Product-Marketing Context File

**Source:** IDEA-5 §1 (Corey Haines `product-marketing` skill)

**What:** A single 12-section context file that every marketing and product skill reads before asking any questions. Eliminates redundant cold starts across skills.

**12 sections:**
1. Product Overview — one-liner, category, platform, pricing
2. Target Audience — who buys, who uses, who decides
3. Personas — JTBD roles: User, Champion, Decision Maker, Financial Buyer, Technical Influencer
4. Problems & Pain Points — functional, emotional, social
5. Competitive Landscape — 3-5 competitors with positioning
6. Differentiation — unique claims, unfair advantages
7. Objections & Anti-Personas — common reasons not to buy, who would never buy
8. Switching Dynamics — JTBD Four Forces: Push, Pull, Habit, Anxiety
9. Customer Language — verbatim quotes, not polished descriptions
10. Brand Voice — formality, personality, banned words, examples
11. Proof Points — stats, case studies, awards, integrations
12. Goals — current targets, north-star metric

**Auto-draft sources:**
- `README.md` → Product Overview, Goals
- `package.json` → Product Overview (name, description, version)
- Landing page URL → Positioning, Differentiation, Target Audience
- `research/product-context.md` → Problems, Competitive Landscape
- `brand/BRAND.md` → Brand Voice, Proof Points

**Implementation:**
- Define schema with YAML frontmatter for machine-readability
- Write acquisition script that auto-drafts from common sources
- Add "Before Starting" check to every marketing/product skill: read context file, if missing ask to create
- Wire eval-loop learnings to propagate back to context file

---

### 1.2 — Create `experience/` Directory

**Source:** IDEA-4c §1

**What:** Canonical directory where cross-skill knowledge accumulates. Eval loops promote high-confidence findings here so all skills can read them on next invocation.

**Structure:**
```
skills-resources/experience/
├── README.md
├── content.md        # What copy/messaging works for this audience
├── product.md        # What product positioning resonates
├── audience.md       # Behavioral insights from eval data
├── patterns.md       # Reusable patterns discovered across runs
└── business.md       # Business constraints, pricing, funnel insights
```

**Implementation:** Create directories + README. Seed empty. Content accumulates as eval loops promote findings.

---

### 1.3 — Fix Canonical Path in AGENTS.md

**Source:** IDEA-4c §2

**What:** Update AGENTS.md to reference `skills-resources/experience/` consistently. Currently skills reference both `.agents/experience/` and `skills-resources/experience/` — neither exists on disk.

---

## LAYER 2 — Skill Quality Improvements

Upgrades to existing skills. No new skills — richer methodology, deeper construction frameworks, better critic dimensions.

### 2.1 — Copywriting: Unique Mechanism

**Source:** IDEA-2 §2A (Foundational Docs Engineering Playbook §2)

**What:** Add Unique Mechanism as a required pre-dispatch dimension. The copy must hinge on a proprietary "how" that differentiates from competitors. Critic checks: could any competitor run this copy unchanged? If yes, FAIL.

**Status:** Done. Core concept in SKILL.md, cold-start questions, body architecture.

---

### 2.2 — Copywriting: 6 Necessary Beliefs

**Source:** IDEA-2 §2A (Foundational Docs Engineering Playbook §3)

**What:** Alternative body-agent architecture for direct-response narrative. Instead of Problem → Solution → How It Works, the body installs the 6 beliefs the reader must hold to convert.

**Status:** Done. Direct-Response narrative mode in body-agent.

---

### 2.3 — Copywriting: Argument Engineering

**Source:** IDEA-2 §2A (Foundational Docs Engineering Playbook §1)

**What:** Build hooks as the lead of an airtight logical case, not a word-choice exercise. The hook is the first premise of an argument, not a clever phrase.

**Status:** Done. Surfaced in SKILL.md philosophy, quality gate, agent manifest, and belief-sequence pre-dispatch.

---

### 2.4 — Copywriting: Discovery Story

**Source:** IDEA-2 §2A (AI Ads Scale Playbook §2)

**What:** Alternative social-proof pattern. Narrative arc that builds trust through a discovery story rather than testimonials, stats, or logos.

**Status:** Done. Dedicated `references/discovery-story.md`.

---

### 2.5 — Copywriting: Seven Sweeps Editing

**Source:** IDEA-5 §3 (Corey Haines `copy-editing` skill)

**What:** Optional post-generation critic-gate mode. Seven sequential editing passes with back-checking between sweeps:

1. Clarity — can reader understand?
2. Voice and Tone — consistent personality?
3. So What — every claim answers "why care?"
4. Prove It — every claim has evidence
5. Specificity — concrete enough to be compelling
6. Heightened Emotion — does it make reader feel?
7. Zero Risk — remove every barrier to action

Plus Expert Panel Scoring (3-5 personas, 1-10, revise, re-score) and word-level checks (cut: very, really, utilize, leverage, etc.).

**Implementation:** Add as optional critic-gate mode in copywriting (post-generation, pre-humanize). Create `references/seven-sweeps.md` with framework details.

---

### 2.6 — Ad-Copy: 4-Step Filtering Process

**Source:** IDEA-2 §2B (Meta Algorithm Mastery Playbook §1-2)

**What:** Strategist agent understands how Meta ranks each variant at each stage: Retrieval → Light Ranking → Heavy Ranking → Auction. Optimizes copy for each stage, not just the final auction.

**Status:** Done. Strategist assigns Retrieval / Light Ranking / Heavy Ranking / Auction per variant with Total Value Equation explanation.

---

### 2.7 — Ad-Copy: Message Transmutation

**Source:** IDEA-2 §2B (AI Ads Scale Playbook §5)

**What:** Strategist picks variant format by transmutation type: AI UGC, Native Static, AI Animation. Each format has its own structural template.

**Status:** Done. Dedicated `references/message-transmutation.md`.

---

### 2.8 — Ad-Copy: Advertorial Pre-Lander / Chad Funnel

**Source:** IDEA-2 §2B (AI Money Printing Playbook §4)

**What:** Cold-traffic variants optionally structured as advertorials that install beliefs before showing price. Native ad → advertorial → product/PDP → signup/order handoff.

**Status:** Done. Added as message-transmutation variant.

---

### 2.9 — Ad-Copy: AI UGC VSSL

**Source:** IDEA-2 §2B (AI Ads Scale Playbook §5A)

**What:** Dedicated cold-traffic variant structure: "I was just like you, but worse" narrative arc for AI-generated UGC-style video ad copy.

**Status:** Done. In message-transmutation ref.

---

### 2.10 — Ad-Copy: Contrast Principle

**Source:** IDEA-2 §2B (Marketing Mastery Playbook §1)

**What:** Hook breaks the specific competitor pattern in the vertical, not just a generic pattern-interrupt. Identify competitor hooks → do polar opposite. Critic adds Contrast Ratio check: does each variant stand out from competitors, not just from each other?

**Status:** Done. Surfaced in SKILL.md construction framing and composer/critic checks.

---

### 2.11 — Ad-Copy: Variable Subtraction

**Source:** IDEA-2 §2B (Marketing Mastery Playbook §5)

**What:** When cold-traffic results are ambiguous, strategist recommends isolating 1 variable (creative vs funnel vs offer) instead of changing all 3.

**Status:** Done. In message-transmutation ref + SKILL.md debugging table.

---

### 2.12 — Shared Research Workflow

**Source:** IDEA-2 §2C

**What:** 4-phase SOP shared by copywriting and ad-copy:

1. Research Doc — compile 6+ pages of intelligence on product, market, competition
2. Avatar & Offer Brief — define the "who" (psychographic depth, levels of awareness) and "what" (offer architecture)
3. Belief Engineering — extract the 6 Necessary Beliefs required for conversion
4. Unique Mechanism — identify the proprietary "how" that differentiates

**Location:** `marketing-skills/skills/copywriting/references/research-workflow.md` (shared by reference from ad-copy).

**Status:** Done. `references/research-workflow.md` consumed by both copywriting and ad-copy.

---

### 2.13 — ICP Research: Confidence Labeling

**Source:** IDEA-5 §4 (Corey Haines `customer-research` skill)

**What:** Every finding tagged High/Medium/Low with rationale based on source count and consistency. Upgrades research artifacts from "here's what we found" to "here's what we found and how sure we are."

---

### 2.14 — ICP Research: Digital Watering Hole

**Source:** IDEA-5 §4 (Corey Haines `customer-research` skill)

**What:** Per-ICP-type source guide added to pre-dispatch questions:
- B2B SaaS → Reddit, G2, Hacker News
- B2C → App Store reviews, Reddit lifestyle subs
- Enterprise → LinkedIn, analyst reports

---

### 2.15 — ICP Research: Sample Bias Checks

**Source:** IDEA-5 §4 (Corey Haines `customer-research` skill)

**What:** Critic-gate dimension for source bias. Online reviewers skew power users. Support tickets skew problems. Reddit skews technical. Minimum viable sample: don't draw conclusions from <5 independent data points per segment.

---

## LAYER 3 — New Skills

Entirely new capabilities the stack doesn't have.

### 3.1 — AI-SEO

**Source:** IDEA-5 §2 (Corey Haines `ai-seo` skill)

**What:** Optimize content for AI search engines (Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini, Copilot). Distinct methodology from traditional SEO — different crawlers, different ranking signals, different optimization techniques.

**Three pillars:**
- Structure — make extractable (definition blocks, step-by-step, comparison tables, FAQ schema)
- Authority — make citable (cite sources +40% citation rate, add statistics +37%, add quotations +30%)
- Presence — be where AI looks (bot-by-bot robots.txt analysis: GPTBot vs PerplexityBot vs ClaudeBot)

**Key patterns:**
- Machine-readable fallback files: `/pricing.md`, `/docs/llms.txt`, structured data JSON
- AI visibility audit matrix: query × platform × extraction-success table
- Content structure patterns: definition blocks (extractable), step-by-step (ranked), comparison tables (cited)
- Robots.txt bot-by-bot: granular allow/deny per AI crawler

**Budget:** `deep`. **Location:** `marketing-skills/skills/ai-seo/`.

---

### 3.2 — Programmatic SEO

**Source:** IDEA-5 §5 (Corey Haines `programmatic-seo` skill)

**What:** 12-playbook taxonomy for creating SEO-driven pages at scale. Add as section within existing `seo` skill.

**12 playbooks:**
1. Templates, Curation, Conversions, Comparisons, Examples
2. Locations, Personas, Integrations, Glossary
3. Translations, Directory, Profiles

**Data hierarchy:** Proprietary > Product-derived > User-generated > Licensed > Public.

**URL structure rules:** subfolders not subdomains, hub-and-spoke internal linking.

---

### 3.3 — Asset Produce

**Source:** IDEA-4a §1

**What:** Takes a `design-brief` output and produces the actual visual asset.

**Tools layer** (choose by available MCP/API):
- Image generation via GPT-4o / Imagen / Midjourney API
- Figma document creation via Figma MCP
- Programmatic SVG/vector rendering for logos, icons, illustrations

**Architecture:**
- Budget: `standard`
- Pre-dispatch: reads design-brief artifact, extracts concept direction, platform specs, color tokens, copy to render
- Quality gate: render preview, check against brief specs (aspect ratio, legibility, color fidelity). If off-spec, regenerate with specific feedback.
- Output: saves to `skills-resources/marketing/design-briefs/[slug]/assets/` with platform-named files

**Anti-patterns:**
- Don't produce every variant — let user pick platforms from brief
- Don't hallucinate logos or brand marks that don't exist
- Don't strip EXIF or override aspect ratios without warning

---

### 3.4 — Social Publish

**Source:** IDEA-4a §2

**What:** Takes a `social-copy` output and publishes it to the target platform.

**Execution modes:**
- `publish` — posts live (requires credentials)
- `draft` — creates a draft / saves to platform (requires credentials)
- `export` — produces a text file with platform-native formatting (no credentials needed)

**Architecture:**
- Budget: `fast` (single-agent, procedural — complexity is in API auth, not reasoning)
- Pre-dispatch: reads social-copy artifact, extracts platform, copy variants, media attachments
- Auth layer: stores platform credentials in environment variables or config file. If not configured, produces publish-ready file instead.
- Safety gate: confirm before publish

**Platform priority:**
1. Twitter/X (Typefully API — simplest)
2. LinkedIn (browser automation — most requested for B2B)
3. Instagram (browser or API)
4. YouTube (API or browser)
5. TikTok (API)

---

### 3.5 — Video Produce

**Source:** IDEA-4a §3

**What:** Takes a `short-form-brief` and produces the actual video.

**Rendering layer** (routes to available video tool):
- HyperFrames: scaffold `.html` composition, add text overlays, transitions, timing
- Remotion: scaffold React composition with audio track
- Browser recording: navigate pages, record with voiceover

**Architecture:**
- Budget: `deep` (video production is expensive in tokens + compute)
- Pre-dispatch: reads short-form-brief artifact (hook, shot list, on-screen text, audio plan, captions, CTA)
- Voiceover: uses `hyperframes-media` for Kokoro TTS or Whisper transcription
- Caption sync: burns captions into video using timed text
- Quality gate: check duration matches brief spec, check text legibility, check CTA visibility
- Output: saves video file to `skills-resources/marketing/short-form/[slug]/[date]-output.mp4`

**Caveats:**
- Video production is expensive. First version produces preview-quality render, user opts into full render.
- HyperFrames must be installed. If not, fall back to detailed render script.
- Remotion is optional.

---

### 3.6 — Ad Eval

**Source:** IDEA-4b §2.1

**What:** Evaluates published Meta ad campaigns (cold-traffic and retargeting).

**Measurable metrics:** CTR, CPA, ROAS, frequency / saturation signals, creative fatigue indicators.

**How it works:**
- Reads the ad-copy artifact that was used to create the ads
- User inputs real campaign results (CTR, CPA, spend, conversions)
- Scores creative performance against the brief's hypothesis
- Writes evaluation to the campaign's eval-loop workspace

**Location:** `marketing-skills/skills/ad-eval/`.

---

### 3.7 — Content Eval

**Source:** IDEA-4b §2.2

**What:** Evaluates published marketing copy (landing page sections, email sequences, website copy).

**Measurable metrics:** Engagement rate (time on page, scroll depth), click-through to next action, conversion rate (if trackable), qualitative audience surveys or feedback.

**How it works:**
- Reads the copywriting or lp-brief artifact used
- User inputs real engagement/conversion data
- Scores copy effectiveness against the brief's hypotheses
- Writes to the relevant eval-loop

**Location:** `marketing-skills/skills/content-eval/`.

---

### 3.8 — Campaign Eval

**Source:** IDEA-4b §2.3

**What:** Evaluates multi-channel campaign performance.

**Measurable metrics:** Total reach / impressions, lead volume and quality, revenue attributed, CAC, channel-level breakdown.

**How it works:**
- Reads the campaign-plan artifact
- User inputs multi-channel results
- Scores channel performance, messaging effectiveness, budget allocation
- Recommends budget reallocation for next cycle
- Writes to the campaign eval-loop

**Location:** `marketing-skills/skills/campaign-eval/`.

---

### 3.9 — Extract Service Layer

**Source:** IDEA-3 §1 (michaelshimeles `code-structure` skill)

**What:** New product skill. Given repeated logic across files (e.g., sandbox-creation logic copy-pasted across GitHub Actions handlers), produces a step-by-step migration plan to extract into a service layer.

**Pattern:** Two-layer separation between Actions (orchestration / domain rules — "why/when") and service layer (shared operational mechanics — "how"). Composability over monoliths, explicit params, structured returns.

**Migration checklist:** extract one block → replace one caller → verify → migrate rest. Caller-by-caller verification at each step.

**Budget:** `fast` (single-agent, procedural recipe). **Location:** `product-skills/skills/extract-service-layer/`.

---

## LAYER 4 — Evaluation Infrastructure

The plumbing that makes skills self-improve across runs. Eval findings propagate back to skills so the next invocation produces better output.

### 4.1 — Short-Form-Eval Rubric on Disk

**Source:** IDEA-4b §1.1

**What:** Extract the 4-dimension provisional rubric from short-form-eval SKILL.md into `references/rubric.md`.

**Contents:**
- 4 dimensions with definitions and scoring criteria (0-10)
- Falsifiability guidelines per dimension
- Example of strong score justification vs weak
- Revision protocol (mandatory after cycle 2-3)

**Location:** `marketing-skills/skills/short-form-eval/references/rubric.md`.

---

### 4.2 — Quality Dashboard Spec

**Source:** IDEA-4b §1.2, IDEA-4c §4

**What:** Reference doc defining the quality dashboard schema and update instructions.

**Format:** `dashboard.tsv` with columns:
- date
- skill
- invocation_count
- critic_pass_count
- critic_fail_count
- avg_rewrite_cycles
- avg_rubric_score

**Location:** `meta-skills/references/quality-dashboard-spec.md`.

---

### 4.3 — Critic-Introspection Protocol

**Source:** IDEA-4b §1.3, IDEA-2 §3

**What:** When an operator overrides a critic FAIL (accepts output the critic rejected), the system records:
- Which skill + which run
- Which critic dimension failed
- Operator's reason (if given)
- Timestamp

After >3 overrides for the same dimension without a rubric revision, flag the critic for recalibration.

**Data file:** `skills-resources/meta/critic-overrides.tsv`.

---

### 4.4 — Promote Eval Findings to `experience/`

**Source:** IDEA-4c §2, IDEA-2 §3

**What:** Promotion criteria for moving eval-loop findings into the shared `experience/` directory:

- **Promote:** ≥3 consecutive "keep" ratings in results.tsv across separate cycles, OR a single finding with explicit operator confirmation ("this is reusable")
- **Don't promote:** "discard" items even once; "watch" items only after they resolve to "keep"
- **Format:** dated entry in the relevant `experience/{domain}.md` file with backlink to the originating eval cycle report

---

### 4.5 — Cross-Skill Learning Propagation

**Source:** IDEA-4c §5

**What:** Tag findings with relevant skill domains so pre-dispatch surfaces them across skills. A conversion insight about the pricing page should benefit every skill that touches pricing copy — lp-brief, ad-copy, short-form-brief, etc.

**Example:** "Pricing page converts 2x better with annual billing highlighted" → tagged `content`, `pricing` → loaded when ANY content or pricing skill runs next.

---

### 4.6 — Artifact Provenance Frontmatter

**Source:** IDEA-4c §6

**What:** Every artifact links back to its source skill run and forward to its eval data.

```yaml
provenance:
  skill: lp-brief
  run_date: 2026-05-14
  input_artifacts:
    - research/icp-research.md
    - research/product-context.md
  output_eval:
    - skills-resources/marketing/loops/pricing-page-redesign/evals/2026-06-01-cycle-1.md
```

Enables trace: artifact → eval → next run reads both.

---

### 4.7 — Generalize Post-Humanize Regression Check

**Source:** IDEA-2 §3

**What:** Extract the post-humanize regression check from cold-outreach into a shared pattern applied by all skills that go through humanize. Guards against humanize stripping specificity.

---

### 4.8 — Eval for Research Artifacts

**Source:** IDEA-2 §3

**What:** Lightweight poll via agents-panel after N downstream consumptions of ICP/market research. ICP and market research currently have no systematic quality measurement.

---

### 4.9 — Critic-Consensus Mode for High-Stakes Outputs

**Source:** IDEA-2 §3

**What:** When budget is `deep` and output is irreversible, dispatch two critics with different rubrics and flag disagreements to the operator.

---

### 4.10 — Rubric Revision Trigger

**Source:** IDEA-4b Phase 3

**What:** Each eval skill auto-flags its rubric for revision when:
- >3 consecutive scores are within 1 point of each other (rubric not discriminating)
- Operator overrides critic >3 times for the same dimension
- New platform feature changes what's measurable (e.g., TikTok removes swipe-up)

---

### 4.11 — Autoresearch Improvement Protocol

**Source:** IDEA-4b Phase 3

**What:** Karpathy pattern applied to all evaluation loops:

1. Run skill → produce artifact
2. Execution happens (outside stack or via production layer)
3. Collect real results (user provides metrics)
4. Evaluation skill scores output against results
5. Eval outputs get promoted:
   - High-confidence findings → `experience/{domain}.md`
   - Low-confidence → stay in loop `learnings.md`
   - Quality metrics → quality dashboard
6. Next skill invocation reads: previous artifacts + previous eval data + current context
7. Skill generates improved output based on all of the above

**Constraint:** Evaluation skills do NOT require full automation. User provides real-world metrics. If the user has no metrics, the eval doesn't run.

---

## LAYER 5 — Code Quality Infrastructure

Upgrades to `fresh-eyes` and `code-cleanup` for post-edit verification.

### 5.1 — Fresh-Eyes: Noise-Filtering Subagent

**Source:** IDEA-3 §2

**What:** After review runs, a subagent pass filters review output to actionable-only before presenting to the operator. Solves the "review tool said 30 things, which matter?" problem.

---

### 5.2 — Fresh-Eyes: Target Auto-Detection

**Source:** IDEA-3 §2

**What:** Determine what to review based on git state: dirty uncommitted, PR branch vs base, or committed single change.

---

### 5.3 — Fresh-Eyes: Parallel Test/Review

**Source:** IDEA-3 §2

**What:** Don't block review on test completion. Run tests and review concurrently.

---

### 5.4 — Fresh-Eyes: Iteration Protocol

**Source:** IDEA-3 §2

**What:** Fix findings → rerun relevant tests + rerun review → repeat until clean.

---

### 5.5 — Fresh-Eyes: Final Report Convention

**Source:** IDEA-3 §2

**What:** Structured closeout: review mechanism used, findings accepted/rejected with brief reasons, clean exit.

---

### 5.6 — Code-Cleanup: Structural Extraction Mode

**Source:** IDEA-3 §1

**What:** Look for repeated operational chunks across action files and recommend service layer extraction. Uses the migration checklist pattern from brief 3.9.

---

## LAYER 6 — External Integrations

### 6.1 — Pangram API Integration

**Source:** IDEA-2 §1

**What:** Acquire Pangram API access for programmatic testing. Wire project-specific detector command. Run live detector regression fixtures against humanize output.

**Context:** Pangram is a proprietary deep learning classifier (not perplexity-based) trained on millions of documents. Explicitly claims to detect humanized text. The only detector meeting 0.5% FPR policy caps without degrading detection capability.

**Pangram details:**
- Founded 2024 by ex-Google and ex-Tesla ML engineers (Max Spero, Bradley Emi). Raised $4M seed.
- Validated by University of Chicago Booth and University of Maryland as most accurate AI detector.
- False positive rate: ~0-0.8% (vs GPTZero 0-2.4%, Originality.ai 0-2.2%, RoBERTa 30.6-77.8%).
- **Detects humanized text** — FNR remained low even after passages run through StealthGPT. Simple synonym-swapping won't work.
- Detection-evasion requires: structural variance, authentic specificity, inconsistent formality register, strategic imperfections.

**Next steps:**
1. Acquire Pangram API access for programmatic testing
2. Build regression test suite that scores humanize output against Pangram
3. Research detection-evasion techniques for classifier-based detectors
4. Implement critic gate that runs Pangram on output and loops until score drops below threshold
5. Consider multi-pass approach: generate → humanize → restructure → rephrase with variable temperature

---

### 6.2 — Human Review Gate for Production Skills

**Source:** IDEA-4a cross-cutting

**What:** All three production skills (asset-produce, social-publish, video-produce) include a mandatory human review step:

1. Produces output — renders the asset, posts a draft, or creates a video
2. Shows the user — displays a preview (image, video thumbnail, or draft URL)
3. Waits for confirmation — "Approve? [y/N/reject with feedback]"
4. On reject — takes user feedback, regenerates with specific changes, shows again
5. On approve — marks as final, saves to the artifact tree

---

## NEW IDEAS — 2026-05-17

Three new operator requests. Not yet implemented.

### N-1 — Core Skill Audit + `.forsvn` Consolidation

**What:** Audit all 35+ SKILL.md files across all 4 stacks. Make bodies short, concise, and actionable for coding agents. Execution details should live in `references/` or `scripts/` — not in the body.

**Frontmatter audit:** Frontmatter is loaded into every session. Must be lean, effective, and achieve routing without crowding the context window. Review each field (name, description, argument-hint, allowed-tools, license, metadata, promptSignals, routing) for necessity.

**`.forsvn` consolidation:** Scaffold this folder on every skill invocation. Every artifact, result, eval, and document lives within subfolders of each stack or each skill inside `.forsvn`. Consistent placement. Avoid throwing anything into the `.agents/` folder (infrastructure like manifest.json stays).

**Scope:**
- All `research-skills/skills/*/SKILL.md`
- All `marketing-skills/skills/*/SKILL.md`
- All `product-skills/skills/*/SKILL.md`
- All `meta-skills/skills/*/SKILL.md`
- `AGENTS.md` files for each stack (artifact path references)

---

### N-2 — Humanmaxxing Skill (replaces "humanize")

**What:** Replace the "humanize" skill with an "humanmaxxing" skill. The current humanized output is long, generic, and robotic. Humanmaxxing produces short, concise, human writing.

**Style rules:**
- Short, concise — compress aggressively
- Minor typos allowed (occasional missing comma, lowercase start, casual abbreviations)
- **No em-dashes** — big red flag, instant AI tell
- Variable sentence length — not uniform rhythm
- Inconsistent formality — humans shift register mid-paragraph
- Concrete specificity over abstract claims
- No "very", "really", "utilize", "leverage", "delve", "testament"

**Human writing reference:** Build a comprehensive reference of how normal humans write. Source from forums, Reddit, real social posts, casual writing. Not polished corporate copy.

**Detection awareness:** Pangram research still applies. Simple synonym-swapping doesn't work. Must restructure at the semantic level.

**Scope:**
- Replace or rename `marketing-skills/skills/humanize/SKILL.md`
- Create `references/human-writing-patterns.md` with real examples and analysis
- Update all skills that call `humanize` as terminal pass to call `era-write`

---

### N-3 — Platform-Specific Content Strategy

**What:** Each social platform (X, TikTok, YouTube, Instagram Reels, LinkedIn) requires distinct content strategy backed by platform-specific research. Currently we have generic research and content creation.

**Platform research layer** — for each platform, gather evidence using platform APIs or account data:

- **X (Twitter):** X API for engagement patterns, optimal post length, thread vs single, timing, hashtag strategy
- **TikTok:** Algorithm signals, hook patterns, video length, caption strategy, trending audio
- **YouTube:** SEO patterns, title/thumbnail strategy, description optimization, tags
- **Instagram Reels:** Hook patterns, caption length, hashtag strategy, audio trends
- **LinkedIn:** Post format (text vs carousel vs video), engagement patterns, professional tone calibration

**Platform-specific skill modes:**
- `social-copy` already has platform modes but needs deeper platform intelligence beyond format checking
- `short-form-brief` needs platform-specific research consumption
- `seo` needs platform-specific optimization (X SEO, YouTube SEO, LinkedIn SEO)

**Research workflow per platform** — each platform gets its own research brief that content skills consume:
- Platform algorithm signals
- Content format preferences
- Engagement patterns
- Optimal posting cadence
- Audience behavior

**Scope:**
- `marketing-skills/skills/social-copy/SKILL.md`
- `marketing-skills/skills/short-form-brief/SKILL.md`
- `marketing-skills/skills/seo/SKILL.md`
- `research-skills/skills/short-form-research/SKILL.md`

---

## Dependency Map

```
Layer 1 (context + experience/)
  ├── Layer 2 (skill improvements read context file)
  ├── Layer 3 (new skills read context file)
  └── Layer 4 (eval promotes findings to experience/)

Layer 2 (skill improvements)
  └── Layer 3.6, 3.7, 3.8 (eval skills need artifacts to evaluate)

Layer 3 (new skills)
  └── Layer 4 (eval infrastructure measures their output)

Layer 4 (eval infrastructure)
  └── Layer 6.1 (Pangram is an eval-specific detector for humanize)

Layer 5 (code quality)
  └── Independent — no cross-layer dependencies

New Ideas (N-1, N-2, N-3)
  ├── N-1 affects all SKILL.md files and artifact paths — run first
  ├── N-2 replaces humanize, affects all skills with terminal humanize pass
  └── N-3 enhances existing skills — independent of N-1, N-2
```
