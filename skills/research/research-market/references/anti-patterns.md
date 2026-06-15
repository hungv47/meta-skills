# Anti-Patterns — market-research

> 11 named anti-patterns that kill market-research validity. Each includes detection, why it fails, the fix, and the agent responsible for catching it (verified against `agents/critic-agent.md` Rewrite Routing Table). Critic-load reference — re-read before any output ships. The first 8 are the canonical body anti-patterns from the original SKILL.md, expanded with detection + bad/good examples + ownership; the remaining 3 are cross-cutting failures caught at the orchestrator or operator level.

---

## 1. Describing Without Concluding

**What it is:** Listing competitors and features without identifying gaps. Produces a Wikipedia article, not strategic intelligence.

**Detection:**
- Artifact has full Competitive Landscape but empty or thin Gaps & Opportunities section.
- Cross-analysis-agent output is missing or limited to restating competitor features as "things missing in others."
- No Top 3 Opportunities section, OR opportunities lack force-ranking with differentiation rationale.

**Why it fails:** Gaps & Opportunities is the POINT of the skill. Everything before (trends, sizing, competitor, consumer) is setup. Without synthesis, downstream prioritize has no opportunities to ICE-score, system-architecture has no whitespace to anchor build-vs-buy, and the operator gets a research dump instead of decision-quality intelligence.

**Fix:** Ensure cross-analysis-agent and opportunity-agent run. Skipping them = incomplete output. Route A (Quick Validation) is the only route where opportunity-agent is legitimately skipped (cross-analysis identifies gaps directly at Quick scope) — but cross-analysis itself is never skipped.

**Owned by:** orchestrator (dispatch enforcement) + critic-agent (gate 4 catch — Gaps & Opportunities ≥3 distinct opportunities with evidence).

---

## 2. Unsourced Market Sizing

**What it is:** "The market is worth $5B" without source or methodology is fiction.

**Detection:**
- Market Sizing table has `Estimate` filled but `Method` and/or `Source` columns empty.
- Confidence column reads "Medium" without reasoning.
- Estimates are point estimates (`$2.4B`) instead of ranges (`$2B–$3B`).
- No math shown for SAM and SOM derivation.

**Why it fails:** Unsourced sizing claims contaminate downstream prioritize ICE scores (the "Impact" dimension reads sizing for opportunity weighting). A made-up TAM produces made-up initiative rankings.

**Bad example:**
> | TAM | — | $5B | — | High |

**Good example:**
> | TAM | Top-down (Gartner 2025 DevOps spend × 8% AI-tools allocation) | $2.4B–$3.1B | Gartner DevOps Spending Forecast 2025 (gartner.com/...) | Medium (single-source; bottom-up validation pending) |

**Fix:** Every sizing claim needs source, methodology (top-down or bottom-up), and confidence with reasoning. See `references/market-sizing-guide.md`. Estimates expressed as ranges, not point estimates.

**Owned by:** sizing-agent (generation) + critic-agent (gate 10 catch — TAM/SAM/SOM shows methodology, not just numbers; expressed as ranges).

---

## 3. Recency Blindness

**What it is:** Using a 2022 report for a 2026 market. In fast categories, 18-month-old data is historical, not current.

**Detection:**
- Source citations include reports from >18 months ago without a historical flag.
- "Current state" framing applied to data that predates current market conditions.
- Pricing or competitor data sourced from training data rather than live WebSearch (especially common when an MCP isn't installed).

**Why it fails:** Critical Gate 1 explicitly forbids presenting >18-month sources as current. A 2022 competitor pricing table cited as 2026 truth produces wrong positioning recommendations.

**Fix:** Flag source dates prominently. Prioritize last-12-month sources. If a >18-month source is the best available, frame it explicitly: `(Historical — 2023 data, current state may differ)`.

**Owned by:** producing agent (trends/sizing/competitor/consumer-landscape) + critic-agent (gate 7 catch — Source recency check; explicitly called out in critic-agent.md as "most common quality issue").

---

## 4. Feature-Only Competitor Analysis

**What it is:** Comparing features while ignoring positioning, community, growth, and pricing produces an incomplete picture.

**Detection:**
- Competitive Landscape has Feature Comparison table but missing Overview + Adjacent + Pricing + Positioning + Community sub-sections.
- competitor-agent output focuses only on the feature matrix.

**Why it fails:** Features alone don't predict market dynamics. A company with weaker features but stronger community + faster growth + better positioning wins despite the feature gap. Downstream prioritize misses the threat if competitor analysis is feature-only.

**Fix:** competitor-agent covers all 6 sub-sections (Overview, Adjacent, Feature Comparison, Pricing, Positioning Map, Community & Mindshare). Don't accept feature-only output. Critic gates 3 (feature depth) and 11 (Stakes/Diff labeling) both check feature-side; gate 9 specifically checks Adjacent.

**Owned by:** competitor-agent (generation) + critic-agent (gates 2, 9, 11 catch).

---

## 5. Confirmation Bias in Gap Identification

**What it is:** Reverse-engineering "gaps" from your product's features is rationalization, not research.

**Detection:**
- Gaps & Opportunities entries suspiciously match the product's existing or planned features.
- Gap evidence is internal-claim-based rather than user-complaint-based.
- "Underserved segment" maps 1:1 to the operator's target segment.

**Why it fails:** Gaps that exist to justify the product (not because the market actually has them) produce a strategy that misses real opportunities. Downstream prioritize ranks initiatives against fictional gaps; campaign-plan messages benefits the market doesn't care about.

**Fix:** cross-analysis-agent identifies gaps from user complaints, switching reasons, and unmet needs FIRST, then checks product fit. The agent's domain instructions explicitly require evidence-from-users-not-internal-claims.

**Owned by:** cross-analysis-agent (generation) + critic-agent (gate 4 catch — Gaps don't trace to evidence; per Domain Instructions "confirmation bias check — gaps should not suspiciously match the product's features").

---

## 6. Treating All Competitors as Equal Threats

**What it is:** A $40M-funded company with 200 employees in your exact segment is not a Product Hunt side project. Treating them as equivalent threats produces resource-misallocated strategy.

**Detection:**
- Competitor Overview Threat column is uniformly "Medium" or blank.
- No justification for threat-level assignment.
- Resource-allocation downstream doesn't reflect threat asymmetry.

**Why it fails:** Without threat differentiation, every competitor gets equal attention in downstream prioritize, campaign-plan, and product decisions. Real strategy concentrates resources where the existential threats are.

**Fix:** competitor-agent assigns threat levels (Critical / High / Medium / Low / Watch) with justification per `references/competitor-analysis-framework.md`. Each threat-level call cites the factors (funding, team size, segment overlap, growth velocity, distribution).

**Owned by:** competitor-agent (generation) + critic-agent (per Validation Checks > Competitive Landscape — "Threat levels justified by specific factors").

---

## 7. Ignoring Adjacent Competitors

**What it is:** Biggest threats often come from adjacent categories expanding in (GitHub Copilot for code-review tools; Notion for project-management tools). Skipping the Adjacent Competitors section misses the highest-impact strategic risk.

**Detection:**
- Adjacent Competitors section is blank, skipped, or has <2 entries.
- "Adjacent Category" column reads platform-only ("Tech companies") without naming specific players.
- Likelihood + Signal to Watch columns missing.

**Why it fails:** Critical Gate 3 explicitly forbids skipping. critic gate 9 is dedicated to catching this (per agent file: "this is the most common skip, catch it"). When an adjacent enters, the entire competitive landscape shifts — strategy built on direct-only analysis becomes obsolete overnight.

**Fix:** competitor-agent always researches adjacent players (at least 2 entries). critic-agent specifically validates the section is populated. The Why They Could Enter column forces the agent to articulate the expansion logic, not just list categories.

**Owned by:** competitor-agent (generation) + critic-agent (gate 9 catch — "Adjacent competitors section populated with ≥2 entries — never blank or skipped").

---

## 8. Positioning Map with Self-Serving Axes

**What it is:** Axes should reflect what MATTERS to buyers, not what makes your product look good.

**Detection:**
- Positioning Map axes correspond to dimensions where the product is strongest.
- Axes weren't validated against buyer decision criteria (interview transcripts, win/loss notes, switching reasons).
- Competitors cluster in one quadrant — convenient for the product's positioning, but suspicious.

**Why it fails:** A self-serving map produces a "we're alone in the top-right" narrative that doesn't survive contact with actual buyer conversations. Downstream campaign-plan inherits the false positioning and messages benefits buyers don't shop on.

**Fix:** competitor-agent validates axes against what users compare when switching. Source the axes from VoC (icp-research output if available), win/loss data (operator-supplied at the Research Checkpoint), or analyst frameworks. If the resulting map is "we're alone in top-right," double-check — most healthy markets have multiple players within striking distance.

**Owned by:** competitor-agent (generation) + critic-agent (per Validation Checks > Competitive Landscape — "Positioning map axes are buyer-relevant").

---

## 9. Cross-stack contract drift

**What it is:** Renaming a section in the Artifact Template, reordering Market Trends / Sizing / Consumer / Competitive / Gaps / Top 3 / Limitations / Next Step, changing the 6 Competitive Landscape sub-sections, or substituting column names without atomic update of downstream consumers.

**Detection:**
- `docs/forsvn/canonical/research/MARKET.md` body has sections in unexpected order or with renamed headers.
- Downstream skill output references a section name that doesn't exist in the artifact (e.g., prioritize asks "where is the Top 3 Opportunities section?" — section was renamed to "Recommended Opportunities").
- Top 3 Opportunities columns differ from `format-conventions.md` schema (Evidence Source | Window | Risk | Why Now).

**Why it fails:** 5+ downstream consumers (prioritize, icp-research, system-architecture, campaign-plan, fundraising-deck readers) read this artifact's structure. A schema change ripples — silent drift means consumers either fail or substitute defaults.

**Drift modes:**
- Renaming `## Top 3 Opportunities` to `## Recommended Initiatives`.
- Reordering Competitive Landscape sub-sections (Overview must come first; Adjacent must come second per the never-skip rule visibility).
- Changing Adjacent Competitors columns (`Adjacent Category | Player | Why They Could Enter | Likelihood | Signal to Watch`).
- Removing `Next Step` block.
- Substituting `Critical / High / Medium / Low / Watch` threat levels with other strings.

**Fix:** Operator review against `references/format-conventions.md` before shipping any schema change. The 11-item critic gate inspects CONTENT within the schema but does NOT inspect schema drift — that's an operator-level integration check. If schema-drift catching matters more in the future, a 12th critic gate could be added (out of scope for the current refactor).

**Owned by:** operator review (no agent catches this in the current 11-gate critic).

---

## 10. Experience write-back skipped or partial

**What it is:** Q1-Q5 don't get appended to `experience/{product,business,goals,audience}.md` after PASS.

**Detection:**
- Artifact ships PASS but `experience/product.md` has no new `Product — category` entry.
- `experience/business.md` has no new `Business — geo + planning horizon` or `Business — known competitors` entries.
- Subsequent skill invocations re-ask for category / geo / competitors / B2B-B2C because experience is empty.

**Why it fails:** Without persistence, downstream skills (prioritize, icp-research, campaign-plan, system-architecture) re-ask the user for the same market context market-research already gathered. The cross-skill memory pattern relies on Pre-Dispatch answers persisting to per-domain experience files.

**Fix:** Post-write side effects mandatory on PASS — append Q1-Q5 to per-domain experience files per `procedures/pre-dispatch.md` Write-back map. No Q is omitted from persistence (unlike icp-research where Q5 — Route — is routing-only; all 5 of market-research's Pre-Dispatch Q's persist).

**Owned by:** orchestrator post-write step in `procedures/dispatch-mechanics.md`. Note: critic-agent does NOT catch this — gates inspect the artifact body, not on-disk side-effect files. Operator-level integration check.

---

## 11. Scope-blind critic evaluation

**What it is:** Failing a Quick validation for missing TAM/SAM/SOM, OR failing a Fundraising artifact for "only" 5 competitors. The critic ignores Route calibration.

**Detection:**
- Route A artifact ships with critic FAIL citing "Market Sizing skipped" (legitimately skipped per Route A).
- Route C artifact ships with critic FAIL citing competitor count when 12+ are present.
- Critic feedback doesn't reference the scope/route in its evaluation reasoning.

**Why it fails:** The 3 routes exist BECAUSE the depth needed varies by decision stakes. A critic that ignores route forces every artifact to Fundraising depth — wasting agent budget on Quick-validation work and producing rewrite loops on legitimate route-A skips.

**Fix:** critic-agent reads `pre-writing.scope` (Quick / Positioning / Fundraising) and applies the Scope Calibration tables in `format-conventions.md`. Route A artifacts don't need sizing; Route B artifacts can have optional sizing; Route C artifacts require sizing. The critic's Anti-Patterns section in `agents/critic-agent.md` explicitly calls this out: "Scope-blind evaluation — Don't fail a Quick validation for missing TAM/SAM/SOM. Don't fail a Fundraising artifact for having 'only' 5 competitors. Match expectations to scope."

**Owned by:** critic-agent (Domain Instructions Anti-Patterns row).
