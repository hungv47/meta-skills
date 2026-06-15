---
name: optimize-seo
description: "Audits and plans search visibility across six modes — technical SEO audit, AI/answer-engine optimization (AEO), programmatic SEO, competitor comparison pages, full SEO strategy, and app store optimization (ASO). Covers keyword research, on-page and technical fixes, link-building strategy, and structured data. Use to diagnose a traffic drop, plan search growth, or get found by AI search. Not for landing-page conversion brief work (use brief-landing-page) or writing the page copy (use write-copy)."
argument-hint: "[url or mode]"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.1.1"
  budget: deep
  estimated-cost: "$2-5"
---

# SEO — Orchestrator

*Communication — Horizontal. Covers the full SEO surface: technical foundations, AI/agent engine optimization, programmatic page generation, app store optimization, and competitor comparison content.*

**Core Question:** "How do we get found — by both search engines and AI models?"

> Why this skill exists, when NOT to use it, 10-item quality gate summary, six routes by mode: `references/playbook.md` [PLAYBOOK].

## Philosophy

SEO mixes hard technical constraints (CWV thresholds, character limits, schema validation) with strategic judgment. Platform specs are constraints; strategic recommendations are defaults with deviation context. **Specific > Vague > Comprehensive > Generic** — every recommendation names exact page, exact change, expected impact.

---

## Critical Gates

Before delivering, all must hold:

1. **Every recommendation names exact page, exact change, expected impact.** No "consider" / "you might."
2. **AI SEO is additive, not alternative.** No point optimizing for AI citations if crawlers can't reach content.
3. **Source recency.** AI platform behavior shifts fast — verify no deprecated practices, outdated crawlers, stale metrics.
4. **Mode is diagnosis-driven**, not a generic "do SEO" deliverable.
5. **Platform-native modes cite platform-intelligence.** When mode is AI SEO, Programmatic, Competitor Pages, or ASO, recommendations affecting platform-native search surfaces (TikTok / YouTube / LinkedIn / X / Reels / App Store) cite the relevant §§ from `references/_shared/platform-intelligence/[platform].md` (mapped per agent in `references/platform-search.md`). Generic "post on LinkedIn" is not sufficient — recommendation references §1/§2/§3/§4 of the platform-intelligence catalog by section.

---

## Before Starting

Per `references/_shared/before-starting-check.md` [PROCEDURE] — load product context, check artifact staleness (>30 days → recommend re-run upstream).

| Artifact | Source | Required? |
|---|---|---|
| `icp-research.md` | research-icp | Recommended — audience search behavior drives strategy |
| `campaign-plan.md` | plan-campaign | Optional — pillars inform topic clusters |
| `product-context.md` | research-icp | Optional — positioning context |

---

## Pre-Dispatch

Canonical Pre-Dispatch: `references/_shared/pre-dispatch-protocol.md` [PROCEDURE].

**Needed dimensions:** mode (audit / ai / programmatic / competitor / aso), site or property, audience, geographic + language scope.

Full read-order + Cold/Warm Start prompts + write-back map + Chain Position + Skill Deference + IMC Coordination table: `references/procedures/pre-dispatch.md` [PROCEDURE].

---

## Mode Resolution

Per `references/_shared/mode-resolver.md` [PROCEDURE] — auto-downgrade ≤3 sentences, no prior artifacts; `--fast` skips Layer 2 (no prioritization, no critic), runs single-agent. **`--fast` does NOT skip Cold Start or Critical Gates 1-4.**
Session execution profile (single-vs-multi): inherit per `references/_shared/execution-policy.md`.

**Route-collapse default (multi-route deep override):** a ≤3-sentence single-scope ask (one mode's keywords, no prior artifacts) auto-resolves to that mode's minimal Route (A/B/C/D/F) + critic — never Route E "Full SEO" — without needing `--fast`. Cross-mode asks, or an upward override ("full strategy", "thorough"), use the full multi-mode orchestration.

---

## Agent Manifest

15 sub-agents across two layers (13 Layer 1 domain agents — crawl / foundations / content-quality / authority / ai-structure / ai-presence / programmatic-template / programmatic-quality / comparison-page / aso-keyword / aso-listing / aso-reviews / aso-competitive — + Layer 2 prioritization → critic). Full table with per-agent focus + per-route composition: `references/agent-manifest.md` [PROCEDURE].

---

## Routing Logic — Mode-Based Dispatch

Diagnose first, then enter the right mode. Modes can run sequentially. **Start with Technical Audit if never audited** — no point optimizing for AI citations if crawlers can't reach content (Critical Gate 2).

| Situation | Mode | Route |
|-----------|------|-------|
| Technical issues / traffic dropped / never audited | **Technical Audit** | Route A |
| Want citations from ChatGPT / Perplexity / AI search | **AI SEO (AEO)** | Route B |
| Structured data, want to generate pages at scale | **Programmatic SEO** | Route C |
| Rank for competitor comparison queries | **Competitor Pages** | Route D |
| Comprehensive SEO strategy | **Full SEO** (Technical + AI) | Route E |
| Distribute via app stores / listings (App Store, Play Store, G2, Capterra, Product Hunt) | **ASO** | Route F |

Per-route Layer 1 + Layer 2 composition: `references/agent-manifest.md` § "Per-route composition". **Route E produces TWO artifacts** (`seo-audit.md` + `seo-ai.md`). Full pre-writing object schema, 8-step Multi-Agent Dispatch flow, Single-Agent Fallback, prioritization mechanics (Quick Wins → Strategic Investments → Low-Hanging Fruit → Backlog; P1-P4 phasing; dependency mapping), critic gate mechanics (10-item rubric, binary PASS/FAIL, max 2 rewrite cycles, 11-row Rewrite Routing Table), `--fast` execution path: `references/procedures/dispatch-mechanics.md` [PROCEDURE].

**Route B control surface.** Bing backs ChatGPT/Perplexity/Copilot — confirm Bing readiness before AI-citation tactics for those products (`references/platform-intelligence/bing-readiness.md`), then score extractability (distinct from on-page) with `references/geo-citation-readiness-checklist.md`.

**Route C selectors.** Pick the archetype from the 12-playbook taxonomy (`references/programmatic-template-playbooks.md` + the design/defensibility rules in `references/programmatic-seo.md`); for a proprietary-data play, run the build-vs-pitch-direct classifier in `references/linkable-asset-playbook.md`.

---

## Artifact Contract

Output path: `docs/forsvn/artifacts/marketing/seo-[mode].md` (mode ∈ {audit, ai, programmatic, competitor, aso}). On re-run, rename existing to `seo-[mode].v[N].md` and create new with incremented version.

Frontmatter (REQUIRED): `skill: optimize-seo`, `mode`, `version` (int), `date`, `status`.

Body sections (REQUIRED): Diagnosis / Findings / Priority Actions / Implementation Plan / Dependencies / Metrics to Track / Next Step.

Full template + finding format (Issue / Impact / Evidence / Fix / Priority) + per-mode metrics defaults: `references/format-conventions.md` [PROCEDURE].

---

## Anti-Patterns

17 patterns (9 SEO-specific + 4 retrieval-layer + 4 cross-cutting marketing-stack) with detection rules, bad/good examples, and per-pattern agent ownership verified against critic-agent.md Rewrite Routing: `references/anti-patterns.md` [ANTI-PATTERN].

Most common in practice: "Consider improving" (gate 3 hedge-language), "Do SEO" without diagnosis (no mode chosen), Ignoring third-party presence for AI SEO (gate 8 — third-party drives ~6.5x more AI citations than owned), AI-SEO work before technical crawl/index fixes (#13 — retrieval-layer optimization on uncrawlable pages is wasted work).

---

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (see references/slow-update-fence.md). Each pinned rule must (a) be procedural not instance-specific, (b) be earned from a regression or critic-flagged failure, (c) cite the artifact / decision record that justified pinning. -->
<!-- SLOW_UPDATE_END -->


## Completion Status

Every run ends with explicit status:

- **DONE** — selected mode executed end-to-end, recommendations specific and prioritized, critic PASS within 2 cycles
- **DONE_WITH_CONCERNS** — analysis delivered with data gaps (rank tracker unavailable, GSC not connected, low-confidence competitor data); recommendations annotated
- **BLOCKED** — site/property inaccessible (auth wall, robots block, no URL provided); cannot scan. State exactly what's blocked + what unblocks.
- **NEEDS_CONTEXT** — audience or product context missing for relevance scoring; recommend `research-icp` or proceed with explicit scope reduction

---

## Worked Example

End-to-end Route A walkthrough (Pre-Dispatch → parallel Layer 1 → merge → prioritization → critic PASS → deliver → FAIL handling → `--fast` variant): `references/examples/seo-walkthrough.md` [EXAMPLE].

---

## References

- **Playbook:** `references/playbook.md` [PLAYBOOK]
- **Format:** `references/format-conventions.md` [PROCEDURE]
- **Anti-patterns:** `references/anti-patterns.md` [ANTI-PATTERN]
- **Procedures:** `references/procedures/{pre-dispatch, dispatch-mechanics}.md` + `references/agent-manifest.md` [PROCEDURE]
- **Example:** `references/examples/seo-walkthrough.md` [EXAMPLE]
- **Domain catalogs** (loaded by agents at dispatch, not orchestrator): `references/{technical-audit, technical-crawler-checklist, ai-seo, retrieval-layer-seo, live-serp-remediation, programmatic-seo, programmatic-template-playbooks, geo-citation-readiness-checklist, linkable-asset-playbook, competitor-pages, schema-reference, aso, platform-search}.md`. Shared: `references/_shared/evidence-classes.md` (canonical: `skills/marketing/_shared/evidence-classes.md`, shared with `monitor-aeo`).
- **AI-search control surface:** `references/platform-intelligence/bing-readiness.md` (Route B). See also Route B/C hooks under Routing Logic.
- **Platform intelligence** (loaded by ai-presence-agent, programmatic-template-agent, comparison-page-agent, aso-keyword-agent, aso-listing-agent when their mode is active): `references/_shared/platform-intelligence/{tiktok, reels, shorts, linkedin, x, youtube}.md` — canonical at top-level `references/platform-intelligence/` (D13). Agent-to-section map in `references/platform-search.md`.
- **Shared:** `references/_shared/{before-starting-check, manifest-spec, mode-resolver, pre-dispatch-protocol}.md`
- **Agents:** 15 sub-agents in `agents/` — see Agent Manifest above. `critic-agent.md` holds the canonical 10-item quality gate + 11-row Rewrite Routing Table.
