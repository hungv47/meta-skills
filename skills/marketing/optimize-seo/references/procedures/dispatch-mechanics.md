# Procedure — Dispatch Mechanics (SEO)

> Load when the orchestrator is about to dispatch agents (Layer 1 + Layer 2 + critic) for a given route. Covers the pre-writing object, the 8-step Multi-Agent Dispatch flow, Single-Agent Fallback, and per-route Layer 1 / Layer 2 agent assignment.

---

## Pre-writing object (shared input across all agents)

Built by orchestrator in Step 3 of Dispatch Protocol. Every Layer 1 agent receives this verbatim:

```yaml
site_url: "[URL]"
site_type: "[SaaS / E-commerce / Content-Blog / Local / Hybrid]"
cms_framework: "[WordPress / Next.js / Webflow / Shopify / etc.]"
mode: "[audit | ai | programmatic | competitor | aso | full]"
known_issues: "[user-mentioned issues — verbatim]"
icp_data: "[summary from research/icp-research.md, or 'absent — proceed without audience-relevance scoring']"
competitors: "[competitor domains array]"
brand_name: "[brand]"
category: "[product category for AI search testing]"
```

For ASO mode, `site_url` is the app store / marketplace listing URL; `site_type` is `App` / `Marketplace-Listing`; `cms_framework` is `iOS-AppStore` / `Google-Play` / `G2` / `Capterra` / `Product-Hunt`.

---

## Multi-Agent Dispatch — 8 steps

Default execution path for `standard` and `deep` budget tiers.

1. **Gather context.** Read `research/product-context.md`, `research/icp-research.md`, `docs/forsvn/artifacts/marketing/campaign-plan.md`. Identify site type, CMS/framework, known issues. Resolve all four Pre-Dispatch dimensions (mode, site, audience, geo+language).

2. **Determine mode.** Apply the Step 1 routing table from SKILL.md. If unclear, ask one targeted question; "comprehensive SEO" → Route E (Full).

3. **Prepare pre-writing object** (per the YAML schema above).

4. **Dispatch Layer 1 agents in parallel** with the pre-writing object and absolute reference paths to the relevant `references/[mode].md` catalog. Per-route agent list below.

5. **Merge Layer 1 outputs** into the artifact template (`references/format-conventions.md`). Each agent maps to designated H3 sections under `## Findings`.

6. **Dispatch prioritization-agent** with the merged doc. Force-ranks all findings into Quick Wins / Strategic Investments / Low-Hanging Fruit / Backlog with timelines (P1-P4) and dependencies.

7. **Dispatch critic-agent** with the prioritized doc. 10-item quality gate (in `agents/critic-agent.md`).

8. **Apply verdict:**
   - PASS → deliver artifact at `docs/forsvn/artifacts/marketing/seo-[mode].md` (rename existing to `seo-[mode].v[N].md` first if present).
   - FAIL → re-dispatch named agent(s) per the critic's Rewrite Routing block with the critic's per-agent feedback as the `feedback` field. Max 2 cycles. After 2 FAIL → deliver with unresolved-items note + warn operator.

---

## Per-route Layer 1 dispatch

### Route A — Technical Audit

```
Layer 1 (parallel): crawl-agent + foundations-agent + content-quality-agent + authority-agent
       ↓ merge
Layer 2 (sequential): prioritization-agent → critic-agent
```

Reference files passed: `references/technical-audit.md` (all 4 agents) + `references/schema-reference.md` (content-quality-agent + ai-structure-agent if invoked).

### Route B — AI SEO (AEO)

```
Layer 1 (parallel): ai-structure-agent + ai-presence-agent
       ↓ merge
Layer 2 (sequential): prioritization-agent → critic-agent
```

Reference files: `references/ai-seo.md` (both agents) + `references/schema-reference.md` (ai-structure-agent).

### Route C — Programmatic SEO

```
Layer 1 (parallel): programmatic-template-agent + programmatic-quality-agent
       ↓ merge
Layer 2 (sequential): prioritization-agent → critic-agent
```

Reference files: `references/programmatic-seo.md` (both agents).

### Route D — Competitor Pages

```
Layer 1: comparison-page-agent
       ↓
Layer 2 (sequential): prioritization-agent → critic-agent
```

Reference files: `references/competitor-pages.md`.

### Route E — Full SEO (Technical + AI combined)

```
Layer 1 (parallel): crawl-agent + foundations-agent + content-quality-agent + authority-agent + ai-structure-agent + ai-presence-agent
       ↓ merge
Layer 2 (sequential): prioritization-agent → critic-agent
```

Reference files: `references/technical-audit.md` + `references/ai-seo.md` + `references/schema-reference.md`.

**Produces TWO artifacts:** `seo-audit.md` (Technical Audit findings) AND `seo-ai.md` (AI SEO findings). Each gets its own prioritization + critic pass. Operator may choose to merge into a single doc for stakeholder review, but the per-mode artifacts are the canonical record.

### Route F — ASO

```
Layer 1 (parallel): aso-keyword-agent + aso-listing-agent + aso-reviews-agent + aso-competitive-agent
       ↓ merge
Layer 2 (sequential): prioritization-agent → critic-agent
```

Reference files: `references/aso.md` (all 4 agents).

---

## Layer 2 — Prioritization

`prioritization-agent` ranks all Layer 1 findings into one action plan:

1. **Quick Wins** (High Impact, Low Effort) — execute first
2. **Strategic Investments** (High Impact, High Effort) — plan next
3. **Low-Hanging Fruit** (Medium Impact, Low Effort) — fill gaps
4. **Backlog** (Low Impact OR Very High Effort) — defer

**Phases:**
- P1 — Immediate (Week 1-2): Quick Wins
- P2 — Short-term (Month 1): Strategic Investments
- P3 — Medium-term (Month 2-3): Low-Hanging Fruit + remaining
- P4 — Ongoing: maintenance + monitoring + re-audit cadence

Dependencies MUST be mapped — no action recommended before its prerequisite (critic gate 6).

---

## Layer 2 — Critic Gate

`critic-agent` evaluates against the 10-item quality gate (canonical list in `agents/critic-agent.md`). Summary in `references/playbook.md`. Verdict is binary (PASS or FAIL).

**Max 2 rewrite cycles** per artifact. Pseudocode:

```
for cycle in 1..2:
    verdict = critic_agent(artifact, mode)
    if verdict == PASS: deliver(artifact); break
    re_dispatch(agents=verdict.named_agents, feedback=verdict.per_agent_feedback)
    artifact = re_merge_layer1() + re_prioritize()
else:
    deliver(artifact, status="done_with_concerns", note="2 cycles reached; some items unresolved")
```

On FAIL, the critic names the specific agent(s) to re-dispatch per the 11-row Rewrite Routing Table in `agents/critic-agent.md`. Re-dispatch ONLY the named agent(s) with the per-agent feedback — don't re-run the full Layer 1 pipeline.

---

## Single-Agent Fallback

When multi-agent dispatch is unavailable (e.g., environment without sub-agent capability):

1. Read this SKILL.md fully (including referenced sections)
2. Read reference files for the active mode (from per-route list above)
3. Follow the mode's audit steps (in `references/[mode].md` reference catalog)
4. Quality gate: every finding has Issue, Impact, Evidence, Fix, Priority — self-enforce
5. Produce the artifact using `references/format-conventions.md` template
6. End with "Ran in single-agent fallback mode; rerun with multi-agent dispatch for full critique."

Single-agent fallback DOES NOT bypass Critical Gates 1-4 (in body) — the single agent enforces them via self-check.

---

## --fast tier execution

Per `references/_shared/mode-resolver.md`, `--fast` bypasses Layer 2 entirely:

1. Resolve Pre-Dispatch (still ask Cold Start if context missing)
2. Dispatch ONE Layer 1 agent for the active mode (default: first agent in the route's Layer 1 list — e.g., crawl-agent for Route A, ai-structure-agent for Route B)
3. The agent writes the artifact directly using `references/format-conventions.md`
4. NO prioritization-agent, NO critic-agent, NO rewrite loops
5. End with "Ran in --fast mode; rerun without the flag for full critique."

`--fast` is for "I just want a quick technical scan" / "give me the AI SEO basics" use cases. The contract is "skip the heavy lift, not the guardrails" — Critical Gates 1-4 still apply.
