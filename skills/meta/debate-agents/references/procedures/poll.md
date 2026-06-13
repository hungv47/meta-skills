---
title: Agents-Panel — Poll Procedure (Mode B)
lifecycle: canonical
status: stable
produced_by: agents-panel
load_class: PROCEDURE
---

# Mode B: Poll

**Load when:** the body's Mode Routing table resolves to poll, OR the operator explicitly requests "poll / consensus / vote / what do agents think / multiple opinions."

Spawn N agents (default 10) with identical context and varied framings. Each independently analyzes and produces structured output. Aggregate by consensus, divergence, and outlier.

**Why it works:** Exploits stochastic variation. Like polling 10 experts separately. Filters hallucinations and individual biases. Divergences reveal genuine judgment calls.

---

## B1. Design Structured Output Schema

**Agent count N** — default 10 (override: "5 agents" / "15 agents"). **If mode resolved to `fast`: N=5.** If mode resolved to `deep`: N=15. Mode resolution per body Step 0; explicit operator override wins.

Each agent must return structured output that can be mechanically compared. Pick the schema that matches the question shape:

| Output Type | When | Schema |
|---|---|---|
| **Ranking** | Predefined options | "Rank these 5 options 1-5" |
| **Recommendation** | Open-ended | "Top 3 recommendations with confidence 1-10" |
| **Binary** | Yes/no decision | "YES or NO, top 3 reasons" |
| **Scoring** | Multi-criteria | "Score each option 1-10 on [criteria]" |

Ranking/Scoring schemas follow the stack ranking invariants — evidence-cited scores, no naked numbers ([`../_shared/idea-ranking-core.md`](../_shared/idea-ranking-core.md)); the std-dev discipline in B4 already covers differentiation. Free-form prose can't be aggregated. If the operator asks "what do you think about X," propose the most-fitting schema and confirm before spawning.

## B2. Generate Framing Variations

N slightly different prompts. Core problem + schema identical — only framing varies:

1. Neutral baseline
2. Risk-averse analyst
3. Growth-oriented strategist
4. Contrarian (challenge conventional wisdom)
5. First-principles reasoner
6. User-empathy focus
7. Resource-constrained optimizer
8. Long-term (5-year) optimizer
9. Data-driven (measurable only)
10. Systems thinker (second/third-order effects)

For N < 10, use the first N. For N > 10, cycle.

## B3. Spawn All N Agents in Parallel

One-pass — no convergence detection. Independent samples give better statistical signal than iterative refinement. All agents see the same problem + schema; only the framing prefix differs.

## B4. Aggregate Results

Different schemas aggregate differently:

| Schema | Aggregation method |
|---|---|
| **Rankings** | Borda count (1st = N points, 2nd = N-1, etc.) — total points decide overall rank |
| **Recommendations** | Group similar, count occurrences. **Consensus** (70%+ agreement), **Divergence** (40-69%), **Outlier** (<40%) |
| **Scoring** | Mean, median, standard deviation per option. Flag high-variance options — those are the genuine judgment calls |
| **Binary** | Count YES/NO. Summarize strongest arguments from each side |

## B5. Synthesize

Output sections for the report: Consensus (X+/N agreed), Divergences (split X/Y), Outliers (Z/N), Raw Rankings/Scores. Template: [`../report-template.md`](../report-template.md) [PROCEDURE].

**Anti-pattern:** averaging away the disagreement. If 5 agents scored an option 9/10 and 5 scored it 2/10, the mean is 5.5 but the truth is "violently disagreed." Report the std-dev AND flag the option as high-variance, don't pretend the mean represents anything.

**When to fall back to debate:** if a poll shows high-variance on the top 2 options (the operator's actual decision), suggest a follow-up debate scoped to just those 2 options. Poll surfaces the disagreement; debate resolves it.
