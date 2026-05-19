# Research Stack Workflow Graph

Canonical pipeline definition for the research-skills stack. `orchestrate-research` reads this to make routing decisions.

---

## The Pipeline

```
 ┌──→ market-research ──┐
icp-research ─────┤ ├──→ prioritize ──→ funnel-planner
 └──→ diagnose ──────────┘

(short-form-research is parallel, content-side, not in main pipeline)
```

**Foundation:** `icp-research` is the entry point. It produces `research/product-context.md` and `research/icp-research.md`, both consumed by 13+ downstream skills across all 4 stacks.

**Branch point after icp:** `market-research` (proactive — what's the landscape?) and `diagnose` (reactive — why is this metric moving?). Either or both can run.

**Convergence:** `prioritize` consumes the upstream branches. It can run with just one (icp + market, OR icp + diagnose) but is strongest with both.

**Targets:** `funnel-planner` consumes `prioritize.md` and produces `targets.md` (numeric goals).

---

## Per-Skill Catalog

### icp-research

- **Job:** build ideal customer profile + voice-of-customer + pain analysis.
- **Produces:** `research/product-context.md`, `research/icp-research.md`
- **Consumes:** nothing (entry point)
- **When to recommend:** no `research/product-context.md` exists, or it exists but is stale, or user's intent is audience-side ("who buys", "personas", "VoC").
- **Cost:** $1–3 · 7 agents · deep budget · ~10 min
- **Hard prerequisite for:** market-research, diagnose, prioritize, funnel-planner, brand-system, copywriting, campaign-plan, lp-brief, lp-eval, cold-outreach, ad-copy, seo, system-architecture (13+ downstream consumers).

### market-research

- **Job:** map market landscape, competitors, TAM/SAM/SOM, whitespace.
- **Produces:** `research/market-research.md`
- **Consumes:** `research/product-context.md`
- **When to recommend:** icp done; user's intent is landscape-side ("competitors", "market sizing", "whitespace", "trends").
- **Cost:** $1–3 · 7 agents · deep budget · ~10 min
- **Defers to icp-research** if `product-context.md` missing.

### diagnose

- **Job:** root-cause a specific problem with logic trees + testable hypotheses.
- **Produces:** `.agents/skill-artifacts/meta/records/diagnose-*.md`
- **Consumes:** `research/product-context.md`
- **When to recommend:** icp done; user has a specific metric or problem ("why is signup conversion dropping", "why are users churning at week 2").
- **Cost:** $1–3 · 6 agents · deep budget · ~8 min
- **Hard requirement:** specific problem statement. Do NOT recommend for "things feel off" — push back and ask for a metric first.

### prioritize

- **Job:** generate strategic options, ICE-score, draw the cut line.
- **Produces:** `.agents/skill-artifacts/meta/sketches/prioritize-*.md`
- **Consumes:** `research/product-context.md` + at least one of `market-research.md` or `.agents/skill-artifacts/meta/records/diagnose-*.md`
- **When to recommend:** at least one upstream artifact exists; user intent is "what should we do next", "rank these options", "which initiative to bet on".
- **Cost:** $1–3 · 7 agents · deep budget · ~10 min
- **Hard-gated:** if no upstream artifact, skill itself recommends running market-research or diagnose first.

### funnel-planner

- **Job:** model funnels backward from revenue goal → traffic, conversion, unit economics.
- **Produces:** `.agents/skill-artifacts/meta/records/targets-*.md`
- **Consumes:** `research/product-context.md`, `.agents/skill-artifacts/meta/sketches/prioritize-*.md`
- **When to recommend:** prioritize is done; user intent is "set targets", "how much traffic", "LTV/CAC", "revenue math".
- **Cost:** $1–3 · 6 agents · deep budget · ~8 min
- **Hard-gated:** without prioritize.md, recommends running prioritize first.

### short-form-research (off-pipeline)

- **Job:** discover what's working on TikTok/Reels/Shorts for a topic right now.
- **Produces:** `.agents/skill-artifacts/research/short-form-research/[slug].md`
- **Consumes:** nothing (uses live web)
- **When to recommend:** user is content-side, not strategy-side — "what's trending", "TikTok research", "shorts best practices", "what hooks are working".
- **Cost:** $1–3 · 6 agents · deep budget · ~10 min
- **Note:** parallel to the main strategy pipeline. Doesn't consume product-context. Output is consumed by `short-form-brief` in marketing-skills.

---

## Routing Rules (decision tree)

```
1. Read state: which artifacts exist? Are any stale?

2. Parse user intent → bucket:
 - audience-research → icp-research
 - market-mapping → market-research
 - problem-diagnosis → diagnose
 - option-ranking → prioritize
 - target-setting → funnel-planner
 - short-form-content → short-form-research
 - empty / ambiguous → ask scoping question

3. Apply gates (in order, first match wins):
 a. Intent needs upstream artifact that's missing?
 → recommend the upstream skill first, with rationale.
 b. Intent matches a skill whose upstream is done?
 → recommend that skill.
 c. Intent ambiguous AND multiple downstream skills available?
 → propose 2 options with one-line rationale each.
 d. All 5 core artifacts done?
 → user is past the pipeline. Suggest cross-stack (orchestrate-marketing / orchestrate-product).

4. Present (1–3 options max). Wait for user confirmation.

5. On confirmation, append breadcrumb toskills-resources/experience/research-workflow.md.
```

---

## Stale Detection

Mark an artifact stale if:
- File mtime > 90 days old, OR
- `research/product-context.md` describes a product that contradicts the current `CLAUDE.md` or the user's stated project, OR
- The user explicitly says "the old research is wrong" / "we pivoted".

Stale artifacts get a warning, not a forced re-run. User decides.

---

## Re-Entry Behavior

`/orchestrate-research` is idempotent — running it twice in a row produces the same proposal (assuming no other work happened between).

When the breadcrumb file shows a prior session ended on "user confirmed: market-research" and `research/market-research.md` now exists, the next `/orchestrate-research` should:

1. Acknowledge: "Last session you ran market-research. It's now in place."
2. Advance: propose the next step (typically `prioritize` if upstream is sufficient).

If the prior recommended skill never produced its artifact, surface that: "Last session I recommended `market-research`, but `research/market-research.md` doesn't exist. Did you skip it, or did it fail?"

---

## Anti-Patterns to Avoid

- Don't recommend more than 3 skills in one proposal. Pick the most-relevant 1–3.
- Don't lecture. The user invoked this because they need a quick decision, not a tutorial.
- Don't auto-invoke. Always print the `/skill-name` command and let the user type it.
- Don't recommend skills outside this stack. If user's intent is marketing or product, say so and point at `/orchestrate-marketing` or `/orchestrate-product`.
