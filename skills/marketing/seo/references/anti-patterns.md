# Anti-Patterns — SEO

> Load when drafting recommendations or evaluating critic-FAIL feedback. Detection rules tell you *how to catch* the failure mode; bad/good examples show *what counts*.

Pattern set: **9 SEO-specific (from baseline body) + 4 cross-cutting marketing-stack failures** = 13 patterns total.

Per-pattern ownership maps to `agents/critic-agent.md` Rewrite Routing Table; agent column tells you who to re-dispatch on critic FAIL.

---

## 1. "Do SEO" without diagnosis

**Detection:** orchestrator dispatched without a mode chosen, or mode declared as "generic SEO" / "full optimization" with no diagnosis sentence.

**Bad:** "Audit our SEO and fix what's broken."
**Good:** "Organic traffic dropped 30% last quarter, never been audited" → Route A (Technical Audit). OR "We want ChatGPT to cite our pricing page when people ask about [category]" → Route B (AI SEO).

**Owned by:** orchestrator (Step 2 routing). Critic gate 7 (Mode-appropriate coverage) catches downstream if mode was mismatched.

---

## 2. Keyword stuffing (traditional or AI)

**Detection:** findings recommend "include keyword X N times" / "repeat keyword in H1, H2, H3, meta, alt-text" / "density should be 2-3%."

**Bad:** "Use 'project management software' 8 times on the homepage and in every H2."
**Good:** "Update homepage H1 to 'Project management software for engineering teams' (currently 'Welcome to Acme'). The audience-fit phrase appears in 73% of comparison-tier queries per `references/ai-seo.md` line 142."

**Why it matters:** Cuts AI visibility ~10% (Princeton GEO/AEO study) and triggers Google spam detection.

**Owned by:** content-quality-agent (traditional) + ai-structure-agent (AI). Critic catches via gate 3 (no vague language) — keyword-density recommendations are also typically vague.

---

## 3. pSEO as a content farm

**Detection:** Programmatic SEO findings recommend "generate 10,000+ pages from [data source]" without per-page uniqueness threshold OR without a quality-gate sample evaluation.

**Bad:** "Build a page for every city × every service combination — 50,000 pages."
**Good:** "Build pages for top 500 city × service combos with: (a) ≥60% unique content per page (CMS plugin enforces); (b) 3 local-specific paragraphs per page; (c) verified data source. Reject the remaining 49,500 — they would be thin."

**Why it matters:** Helpful Content Update explicitly targets thin-template farms; one HCU hit drags entire domain quality.

**Owned by:** programmatic-template-agent (per-page uniqueness definition) + programmatic-quality-agent (sample evaluation + monitoring plan). Critic gate 8 (AI SEO recommendations platform-specific) doesn't catch this — programmatic-quality-agent's self-check does.

---

## 4. Ignoring third-party presence for AI SEO

**Detection:** AI SEO findings address only owned site (own blog, own pricing, own docs) — no G2 / Capterra / Trustpilot / Product Hunt / industry publication recommendations.

**Bad:** "Optimize your blog posts with FAQ schema to get cited by ChatGPT."
**Good:** "Build G2 profile to 50+ reviews (currently 12) — ChatGPT cites third-party review sites at 6.5x the rate of owned content for B2B SaaS queries (`references/ai-seo.md` line 218). Plus FAQ schema on owned blog."

**Why it matters:** Third-party drives ~6.5x more AI citations than owned content for B2B; owned-only optimization caps at ~13% of available citation surface.

**Owned by:** ai-presence-agent. Critic gate 8 (AI SEO recommendations platform-specific) catches if recommendations don't name the third-party platforms.

---

## 5. Blocking AI crawlers then expecting citations

**Detection:** findings include "improve AI visibility" without a robots.txt audit, OR robots.txt audit shows `Disallow` for AI crawlers (GPTBot, ClaudeBot, PerplexityBot, GoogleOther) but recommendation list doesn't propose unblocking.

**Bad:** "Add FAQ schema to drive ChatGPT citations." (robots.txt blocks GPTBot — citations physically impossible)
**Good:** "Unblock GPTBot, ClaudeBot, PerplexityBot, GoogleOther in robots.txt line 6 (currently `Disallow: /` for all bots). Then add FAQ schema."

**Owned by:** ai-presence-agent. Critic gate 8 enforces.

---

## 6. Flat competitor comparison tables

**Detection:** Comparison Pages mode findings show feature-by-feature tables with checkmarks (✓/✗) and no use-case context, no honest competitor strengths section.

**Bad:** Table with 30 features × 5 competitors, all checkmarks, no narrative.
**Good:** "Compare by use case: 'For teams under 10' → us (specific reasons), competitor-X (specific reasons), competitor-Y (specific reasons). Cells carry data ('Up to 25 users / $9/seat'), not symbols."

**Why it matters:** Flat tables don't answer "which is right for me?" — the actual searcher intent. Honest comparison pages rank because they're useful.

**Owned by:** comparison-page-agent. Critic catches via gate 1 (Evidence field; checkmarks = no evidence).

---

## 7. Schema false positives

**Detection:** AI Structure or Technical Audit findings flag "missing Product schema" / "missing FAQ schema" from raw HTML inspection without verifying via Google Rich Results Test or browser DevTools.

**Bad:** "Add Product schema to /pricing — currently missing." (CMS plugin injects via client-side JSON-LD; schema IS present in rendered HTML)
**Good:** "Verified via Rich Results Test: /pricing has Product schema injected client-side by CMS Schema Plugin v2.4. No action needed. /features missing FAQ schema (verified absent) — add via [specific method]."

**Owned by:** ai-structure-agent (AI mode) + foundations-agent (Technical mode) self-check — these agents must validate via Rich Results Test or DevTools BEFORE reporting. No critic gate catches this directly; agent self-check is the only safety net.

---

## 8. One-and-done audits

**Detection:** Next Step section is blank, or says "implement and you're done," or has no re-audit timeline.

**Bad:** "Implement the recommendations." (Next Step section)
**Good:** "Quarterly technical re-audit (next: 2026-08-18). Monthly AI visibility check (next: 2026-06-18). Re-run after next Google core update (subscribe to Search Liaison Twitter). When entering new keyword territory (e.g., expanding to EU), trigger full Route E."

**Owned by:** prioritization-agent (Phase 4 Ongoing in Implementation Plan) + `format-conventions.md` Next Step requirement (orchestrator-enforced at merge). No critic gate covers re-audit cadence directly — agent self-check + format template are the safety net.

---

## 9. "Consider improving" recommendations

**Detection:** any Fix field contains hedge words: "consider," "might want to," "could potentially," "it may help to," "think about," "you may want to," "perhaps."

**Bad:** "Consider improving your title tags."
**Good:** "Update the title tag on /pricing from 'Pricing' (7 chars) to 'Project Management Pricing | Plans from $9/mo' (48 chars). Expected: better SERP CTR (current 1.2%, target 3-4% based on industry benchmarks)."

**Owned by:** producing agent (whoever generated the finding). Critic gate 3 enforces.

---

## Cross-cutting marketing-stack failures (10-13)

These apply across all marketing-skills, not just seo. Same detection/fix shape; ownership clarified.

---

## 10. Polish-Chain on FAIL

**Detection:** Critic returned FAIL and orchestrator dispatched polish-chain (humanize, vn-tone) on findings that haven't been re-dispatched per Rewrite Routing.

**Bad:** Critic FAILs gate 1 ("Evidence missing in 3 findings") → orchestrator runs humanize on the whole doc.
**Good:** Critic FAILs gate 1 → orchestrator re-dispatches named agent (e.g., content-quality-agent) with specific feedback → produces revised findings → re-merge → critic re-evaluates. Polish chain ONLY after PASS.

**Owned by:** orchestrator (Step 8 of Dispatch Protocol). Polish-chain is post-PASS only.

---

## 11. Multi-mode in one invocation

**Detection:** invocation says "do audit + AI + programmatic" → orchestrator runs all routes in one pass and merges into one artifact.

**Bad:** One artifact mixing Technical Audit findings, AI SEO recommendations, and Programmatic SEO template specs.
**Good:** Three sequential invocations producing `seo-audit.md`, `seo-ai.md`, `seo-programmatic.md`. Mode is per-artifact. Operator chains: start with Audit (foundational), then AI, then Programmatic.

**Why it matters:** Each mode's critic checklist is mode-specific; mixing dilutes per-mode rigor. Also: per-mode artifact paths are part of the contract; downstream tools (manifest-sync, copywriting reads) expect one mode per file.

**Owned by:** orchestrator (Step 2). Use Route E (Full SEO) only for Technical+AI explicitly; that route produces TWO artifacts.

---

## 12. VN-market output without vn-tone

**Detection:** Cold Start Q4 (geo + language scope) declared a Vietnamese market and the artifact ships without a vn-tone polish pass on user-facing copy (Findings narrative, Priority Actions, Next Step).

**Bad:** Vietnamese-market SEO audit delivered in English-syntax-direct-translated Vietnamese (passive-voice calques, missing particles).
**Good:** Generate findings in English (agents are English-only), then route the artifact through `vn-tone` for the user-facing prose pass. Frontmatter `status: done_with_concerns` if vn-tone not run; recommend the polish step in Next Step.

**Owned by:** orchestrator (Step 8 deliver). Operator may override per scope.

---

## 13. Contract drift

**Detection:** artifact frontmatter missing one of (skill, mode, version, date, status), OR `mode` value not in the enum (audit / ai / programmatic / competitor / aso), OR body missing one of the H2 sections (Diagnosis / Findings / Priority Actions / Implementation Plan / Dependencies / Metrics to Track / Next Step).

**Bad:** Artifact with `mode: technical-audit` (not enum value), missing Dependencies section.
**Good:** `mode: audit` (enum), all 7 H2 sections present even if some are "(none for this mode)".

**Why it matters:** `manifest-sync.ts` reads frontmatter to index; `copywriting` reads body sections by name. Drift breaks downstream tools silently.

**Owned by:** orchestrator (Step 5 merge into artifact template). Critic gate 1 catches missing fields per finding but doesn't validate frontmatter — operator + sync-script catch frontmatter drift.
