---
title: Orchestrate-Marketing Playbook
lifecycle: canonical
status: stable
produced_by: orchestrate-marketing
load_class: PLAYBOOK
---

# Orchestrate-Marketing Playbook

## Why this skill exists

The marketing-skills stack has 14 skills — `brand-system`, `campaign-plan`, `copywriting`, `lp-brief`, `lp-eval`, `seo`, `short-form-brief`, `ad-copy`, `cold-outreach`, `humanize`, `vn-tone`, `social-copy`, `design-brief`, plus this router. The pipeline isn't strictly linear: `brand-system` is foundation (voice + design tokens feed every content skill); `campaign-plan` consumes brand + ICP and produces channel strategy + calendar; `lp-brief` / `copywriting` / `seo` / `short-form-brief` / `cold-outreach` / `ad-copy` / `social-copy` / `design-brief` are parallel content-production skills hanging off campaign positioning; `lp-eval` runs post-launch inside an eval loop; `humanize` / `vn-tone` run as terminal polish passes. An operator picking up the stack — or a returning one with a fresh ask — should not have to remember which skill solves what. They type `/orchestrate-marketing` and the router reads marketing-stack state, parses the ask, and points at the right next step.

The cost of bad routing isn't immediate failure; it's running `campaign-plan` against no brand foundation and getting a channel mix disconnected from voice/visual identity, or recommending `lp-brief` without ICP and getting a hypothesis built from prompt-only guesses. Or running `ad-copy` without ICP and producing audience-blind primary text that fails Meta's relevance test. This skill exists because the alternative — operator-memorizes-the-catalog — doesn't scale and isn't what skills are for. Skills are entry points; routing should be cheap and proactive.

## Methodology

**Read state first, parse intent second, route third — never invert.** The marketing-stack snapshot (`brand/BRAND.md`, `brand/DESIGN.md`, `brand/ASSETS.md`, `research/product-context.md`, `research/icp-research.md`, `.agents/skill-artifacts/mkt/campaign-plan.md`, `.agents/skill-artifacts/mkt/content/*.md`, `.agents/skill-artifacts/mkt/lp-brief/**/brief.md`, `skills-resources/loops/*/evals/*.md`, `skills-resources/experience/{brand,audience,content,goals}.md`) shapes how to interpret the ask. "I want a landing page" with no brand routes to `/brand-system` first; same ask with brand done routes straight to `/lp-brief`.

**ICP-foundation gate is the highest-priority load-bearing rule.** 13+ marketing-stack skills consume `research/product-context.md` (created by `/icp-research` in research-skills). The router's most common correct intervention is "you asked for campaign / copy / LP / ad / outreach but have no ICP foundation — start in research-skills." Skipping ICP produces hollow marketing output everywhere; the router defers to `/orchestrate-research` (specifically `/icp-research`) before routing any marketing intent.

**Brand-foundation gate is the second-priority load-bearing rule.** brand-system produces BRAND.md (voice/positioning/archetype) + DESIGN.md (visual system + tokens) + ASSETS.md (per-platform inventory). Every content-production skill (campaign-plan, copywriting, lp-brief, design-brief, short-form-brief, ad-copy, cold-outreach, social-copy) reads brand artifacts for voice + visual ground truth. Skipping brand-system produces voice-inconsistent copy + token-blind design briefs.

**`ad-copy` is hard-gated on ICP; `cold-outreach` is hard-gated on ICP; `lp-eval` is hard-gated on an existing eval-loop workspace.** Their Pre-Dispatch refuses to run without upstream artifacts. The router enforces the same gate at routing time: recommend the upstream skill (`/icp-research` for ad-copy/cold-outreach; `/eval-loop` for lp-eval) instead of letting the downstream skill block on its own gate.

**`lp-brief` vs `lp-eval` separation is load-bearing.** `lp-brief` owns construction-time conversion best practices for new pages and redesigns. `lp-eval` owns post-launch scoring, ONLY inside an existing eval-loop workspace. Don't conflate — the router uses intent signals ("redesign my LP" → lp-brief; "LP analytics / experiment results / heatmap" → lp-eval).

**`copywriting` and `humanize` are not interchangeable.** Copywriting writes NEW copy from scratch (horizontal — headlines, hooks, CTAs, taglines, section copy across any surface). Humanize strips AI patterns from EXISTING text + injects voice + compresses. They run in sequence (copywriting → humanize), not in parallel. The router never recommends them as alternatives.

**`social-copy` is platform-native and single-platform-per-invocation.** It's the leaf-node copy producer for organic social. ad-copy is for paid Meta; short-form-brief is for video production. Don't conflate. The router uses intent signals ("write a tweet / tiktok caption / linkedin post" → social-copy; "Meta ads / paid social" → ad-copy; "video brief / storyboard" → short-form-brief).

**Print hand-off, never auto-invoke.** Operator types the next slash command. This surfaces the choice, gives the operator a chance to redirect, leaves an audit trail.

## Principles

- **State drives routing.** A snapshot is required before any classification. Skip the snapshot and routing becomes guessing.
- **The manifest is canonical state.** `.agents/manifest.json` is read first; filesystem scans are a fallback when the manifest is missing or stale.
- **ICP is the cross-stack spine.** `research/product-context.md` (created by `/icp-research` in research-skills) is read by 13+ marketing skills. The router treats "no ICP" as a hard precondition for any campaign-or-content ask.
- **Brand is the marketing-stack spine.** `brand/BRAND.md` + `brand/DESIGN.md` are read by every content-production skill. The router treats "no brand" as a hard precondition for any content ask.
- **`lp-brief` and `lp-eval` are siblings, not sequential within the same loop.** lp-brief writes new page briefs; lp-eval scores launched pages. Both touch landing pages but serve opposite-direction intents (build vs measure). Route to one OR the other based on intent signal.
- **`eval-loop` is the gateway for any measurable initiative.** lp-eval / ad-eval (future) / email-eval (future) all live inside `skills-resources/loops/[slug]/`. If operator asks for evaluation but no loop workspace exists, propose `/eval-loop` first.
- **Stale brand is warn-but-don't-block.** If `brand/BRAND.md` is older than 180 days OR doesn't match recent campaign context, surface the staleness and offer refresh — don't force a rerun.
- **Skip-rules:** if the operator explicitly says "I just want copywriting" without brand-system, respect it BUT note the output quality drop ("Without brand-system, copywriting will rely on whatever voice signal you put in the prompt").
- **Don't cross-route except to `orchestrate-research`, `orchestrate-product`, and `orchestrate-meta`.** When the stack is exhausted (brand + campaign + content + eval all done), recommend a different stack orchestrator. Otherwise routes stay inside marketing.
- **`humanize` and `vn-tone` are terminal-only.** They polish existing copy, not generate new. Route to them only AFTER a generation skill has produced copy, OR when operator's ask is explicitly "fix this AI-sounding text" / "polish this Vietnamese."
- **No critic gate, no sub-agents.** This is `budget: fast` — pure router. The premium-orchestration substrate lives in the skills this router proposes; running it here would be theater.

## History / origin

- **v4.0.0 rename** from `start-marketing` to `orchestrate-marketing` — aligned naming with `/orchestrate-meta`, `/orchestrate-research`, `/orchestrate-product` siblings (all routers, all named the same way).
- **v6 Phase 2 Wave 1 refactor — marketing-stack slot 2 (May 18, 2026, still v1.0.0):** body trimmed 265 → 151 (-43.0%) per the v6 program (target ≤150 router lines, 1-line over); state-map template, output-formats, anti-patterns extracted to refs; mode-resolver wired; Before-Starting check + Artifact Contract block added per Step 7.5. **12 baseline intent rows + 12 baseline routing rules preserved verbatim;** sibling-parity additions per orchestrate-research wave-1 documented in SKILL.md refactor_history note: social-post (→ social-copy), asset-design (→ design-brief), discovery (→ discover) intent rows + rules 11-12 + rule 18 wrap-around `/fresh-eyes` + rule 20 cross-route with `/discover` exception. Format 4 scoping prompt grew Option 6 (state-snapshot fallback). **Snapshot path bug fix:** baseline `.agents/skill-artifacts/mkt/loops` (path doesn't exist per CLAUDE.md taxonomy) corrected to `skills-resources/loops`. No version bump — refactor lands on the marketing-skills 2.0 base as a commit, not a release. Mirrors orchestrate-research's post-refactor structure exactly (and orchestrate-research mirrors orchestrate-product, which mirrors orchestrate-meta). Marketing-stack refactor slot 2 (after social-copy slot 1; 12 marketing skills remaining).

## When NOT to use this skill

- **You already know your skill** → invoke it directly (`/brand-system`, `/campaign-plan`, `/copywriting`, `/lp-brief`, `/lp-eval`, `/seo`, `/short-form-brief`, `/ad-copy`, `/cold-outreach`, `/social-copy`, `/design-brief`, `/humanize`, `/vn-tone`).
- **Your task is cross-stack** (e.g., needs research + marketing or product + marketing) → use `/orchestrate-meta`.
- **You're mid-pipeline in clear sequence** — e.g., brand done, ready for campaign-plan. Go straight to `/campaign-plan`. Re-entering the router adds latency.
- **You want to learn the catalog** — read `marketing-skills/CLAUDE.md` + `references/workflow-graph.md` directly. The router is for routing, not browsing.

## Further reading

- [`workflow-graph.md`](workflow-graph.md) — full marketing-stack pipeline + per-skill catalog + decision rules
- [`output-formats.md`](output-formats.md) [PROCEDURE] — the four output shapes (single-route, combined-path, cross-stack process route, scoping fallback)
- [`state-map-template.md`](state-map-template.md) [PROCEDURE] — manifest signals + filesystem fallback paths + state map structure
- [`anti-patterns.md`](anti-patterns.md) [ANTI-PATTERN] — failure modes
- [`_shared/manifest-spec.md`](_shared/manifest-spec.md) — manifest contract Step 1 reads
- [`_shared/mode-resolver.md`](_shared/mode-resolver.md) — `--fast` behavior (orchestrate-marketing is already `budget: fast`, so the resolver's job is mostly enforcing the safety-gates-don't-skip rule)
