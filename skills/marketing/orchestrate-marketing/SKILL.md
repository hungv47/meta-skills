---
name: orchestrate-marketing
description: "Stack orchestrator for marketing-skills. Reads what's already done in `brand/`, `research/`, `.agents/skill-artifacts/mkt/`, and `skills-resources/loops/`, parses your intent, and proposes the next 1–3 skills in the marketing pipeline (brand-system → campaign-plan → copywriting / lp-brief / lp-eval / seo / cold-outreach / short-form-brief / ad-copy / social-copy → humanize / vn-tone). Use when you don't know which marketing skill to invoke, or want a guided run from brand foundation through content production and measurable evaluation. Not for executing the work itself — it routes to the skill that does. Not for cross-stack workflows (use orchestrate-meta or invoke skills directly). Renamed from `start-marketing` in v4.0.0."
argument-hint: "[free-form ask, or empty to be guided]"
allowed-tools: Read Grep Glob Bash
user-invocable: true
license: MIT
metadata:
  author: hungv47
  version: "1.0.0"
  budget: fast
  estimated-cost: "$0.03-0.10"
  refactor_history:
    - refactored_at: 2026-05-18
      refactored_for: implementation-roadmap v6 Phase 2 Wave 1 (marketing-stack slot 2 — router pattern proven 3x prior)
      body_before: 265
      body_after: 151
      body_delta_pct: -43.0
      note: |
        Body-only line counts (frontmatter excluded). Mirrors orchestrate-research
        post-refactor structure exactly (which mirrors orchestrate-product, which
        mirrors orchestrate-meta). 4 new refs (playbook, state-map-template,
        output-formats, anti-patterns); workflow-graph.md unchanged. 12 baseline
        intent rows + 12 baseline routing rules preserved verbatim;
        sibling-parity additions per orchestrate-research wave-1: social-post
        (→ social-copy), asset-design (→ design-brief), discovery (→ discover)
        intent rows + rules 11-12 (social-post + asset-design) + rule 18
        wrap-around `/fresh-eyes` suggestion + rule 20 cross-route restriction
        with `/discover` exception. Format 4 scoping prompt grew Option 6
        (state-snapshot fallback). Snapshot path bug fix: baseline's
        `.agents/skill-artifacts/mkt/loops` (path doesn't exist per CLAUDE.md
        taxonomy) corrected to `skills-resources/loops`. Pipeline lifecycle
        violation flag preserved per Phase 2 cleanup (orchestrate-* workflow
        state should move to `meta/orchestrator-state/`). Cross-stack contract
        preserved byte-identical. Full inventory in `references/playbook.md
        § History`.
promptSignals:
  phrases:
    - "where do i start with marketing"
    - "i want to do marketing"
    - "help me plan marketing"
    - "what skill should i use for marketing"
    - "start marketing"
    - "begin marketing"
    - "marketing workflow"
    - "marketing pipeline"
  allOf:
    - [where, start, marketing]
    - [what, skill, marketing]
  anyOf:
    - "marketing workflow"
    - "marketing pipeline"
    - "guide me through marketing"
    - "set up brand"
    - "build a campaign"
  noneOf:
    - "code review"
    - "system architecture"
    - "user flow"
  minScore: 5
routing:
  intent-tags:
    - marketing-orchestration
    - workflow-routing
    - stack-entry-point
    - marketing-guide
  position: orchestrator
  lifecycle: pipeline
  produces:
    - skills-resources/experience/marketing-workflow.md
  side-effects:
    - manifest-sync
  consumes:
    - research/product-context.md
    - research/icp-research.md
    - brand/BRAND.md
    - brand/DESIGN.md
    - brand/ASSETS.md
    - .agents/skill-artifacts/mkt/campaign-plan.md
    - .agents/skill-artifacts/mkt/content/*.md
    - .agents/skill-artifacts/mkt/lp-brief/**/brief.md
    - skills-resources/loops/*/evals/*.md
    - skills-resources/loops/*/results.tsv
    - .agents/skill-artifacts/mkt/seo-*.md
    - .agents/skill-artifacts/mkt/cold-outreach/*.md
    - .agents/skill-artifacts/mkt/ad-copy/*.md
    - .agents/skill-artifacts/mkt/short-form-brief/**/brief.md
    - .agents/skill-artifacts/mkt/copy/*.md
    - .agents/skill-artifacts/mkt/design-briefs/*.md
    - skills-resources/experience/*.md
  requires: []
  defers-to:
    - skill: brand-system
      when: "no brand foundation — entry point of the marketing pipeline"
    - skill: campaign-plan
      when: "brand done, no integrated campaign yet"
    - skill: copywriting
      when: "need specific copy — headline, hook, CTA, section"
    - skill: lp-brief
      when: "building or redesigning a landing page against construction-time conversion best practices"
    - skill: lp-eval
      when: "evaluating launched landing-page performance from analytics, experiments, recordings, or metric notes inside an eval loop"
    - skill: eval-loop
      when: "landing-page performance evaluation is requested but no measurable loop workspace exists"
    - skill: seo
      when: "search visibility — keyword research, AI search, programmatic, technical"
    - skill: short-form-brief
      when: "TikTok / Reels / Shorts video brief"
    - skill: ad-copy
      when: "Meta paid ads — retargeting or cold-traffic primary text"
    - skill: cold-outreach
      when: "cold email, LinkedIn DM, X DM, proposal"
    - skill: social-copy
      when: "platform-native organic social post (tiktok / reels / shorts / x / linkedin caption + hook + CTA)"
    - skill: design-brief
      when: "per-asset graphic-design brief (carousel / thumbnail / banner / OG card)"
    - skill: humanize
      when: "AI-sounding text needs to be stripped and compressed"
    - skill: vn-tone
      when: "Vietnamese text needs native-register polish"
  parallel-with: []
  interactive: true
  estimated-complexity: low
---

# Orchestrate Marketing — Router

*Meta — Stack orchestrator. Reads marketing-stack state, parses your ask, points at the right next skill. Does NOT execute work; that's the skill it routes you to.*

**Core Question:** "Given the brand foundation, the campaign state, and what you just asked, which marketing skill produces the highest-leverage next artifact?"

[Read `references/playbook.md` [PLAYBOOK] to understand why this skill does what it does — methodology, principles, when NOT to use.]

## When To Use

- Just installed marketing-skills and don't know what to type.
- Mid-project and forget which skill is next.
- Vague need ("I need a landing page", "I want to send cold email", "we need to look on-brand", "write a tweet about X") and want guided routing.
- Resuming across sessions — re-running `/orchestrate-marketing` re-reads state and resumes from the next step.

## When NOT To Use

- You already know which skill to run.
- Task is cross-stack (e.g., research → marketing → product) — use `/orchestrate-meta` or compose conversationally.
- You want execution rather than routing.

## Before Starting

Apply the [before-starting-check](references/_shared/before-starting-check.md) [PLAYBOOK]:

0. **Mode declaration** — this skill is `budget: fast` with no escalation path (no sub-agents, no critic gate, no `--apply`-style modes). The mode-resolver ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE]) resolves to `fast` and runs. No emit-and-wait prompt — there's no meaningful mode to escalate to. The resolver's load-bearing job here is enforcing "safety gates don't skip under `--fast`": state snapshot still runs; routing still produces a hand-off; no auto-invoke regardless.
1. Read `implementation-roadmap/canonical-paths.md` if present — verify this skill's output path matches the canonical inventory.
2. Read `.agents/manifest.json` + `.agents/artifact-index.md` (marketing-skill foundation files).
3. `skills-resources/experience/*.md` files are read as **state input** (per `routing.consumes`) — not as cold-start dimension resolution. This skill IS the entry point that produces `skills-resources/experience/marketing-workflow.md`, so Pre-Dispatch's experience-dimension read doesn't apply.
4. If `.agents/manifest.json` is missing AND no filesystem fallback paths exist (fresh project) → use the empty-ask fallback in [`references/output-formats.md`](references/output-formats.md) [PROCEDURE] Format 4 to scope.

## Artifact Contract

- **Path:** `skills-resources/experience/marketing-workflow.md` (append-only breadcrumb log)
- **Lifecycle:** `pipeline` (⚠️ canonical-paths.md flags this as a lifecycle violation — orchestrate-* workflow state should move to `meta/orchestrator-state/` per Phase 2 cleanup; current behavior preserved verbatim for backwards-compat)
- **Frontmatter fields:** none required on the file itself; each append is timestamped + decision-tagged
- **Required sections per append:** `## Session YYYY-MM-DD` heading + bullet list (Read state / User intent / Recommended / User confirmed)
- **Consumed by:** future `/orchestrate-marketing` invocations (precedent + re-entry detection), operator (breadcrumb history). No machine consumer parses this today.
- **Side effect:** appends one block; no overwrite, no delete.

## Decision Tree (the routing core)

### Step 1 — Marketing-stack state snapshot

Render the disk snapshot inline. Shell-bang interpolation fires at slash-command invocation per `CLAUDE.md` §"Inline shell interpolation":

```
Artifacts by domain:
! `[ -d .agents/skill-artifacts ] && find .agents/skill-artifacts -mindepth 2 -name "*.md" -type f 2>/dev/null | awk -F/ '{print $3}' | sort | uniq -c | sort -rn | grep . || echo "  (no .agents/skill-artifacts/ yet)"`

Eval loops:
! `find skills-resources/loops -maxdepth 2 -type f 2>/dev/null | sed 's#^#  #' | head -30 | grep . || echo "  (no skills-resources/loops/ yet)"`

Top-level canonical folders present:
! `found=0; for d in research brand architecture; do [ -d "$d" ] && { echo "  $d/ ✓"; found=1; }; done; [ $found -eq 0 ] && echo "  (none yet)" || true`

Last 5 commits in this repo:
! `git log --oneline -5 2>/dev/null | grep . || echo "no git history"`
```

Then read `.agents/manifest.json` (canonical). If missing or stale (>24h per `updated_at`), run `bun scripts/manifest-sync.ts` first. Build the structured state map per [`references/state-map-template.md`](references/state-map-template.md) [PROCEDURE] (manifest signal interpretation, filesystem fallback paths, state-map structure, stale-detection rules, project-fit check, re-entry behavior all live there).

### Step 2 — Classify the ask

Parse the user's argument into one of these:

| User says | Classification | Pipeline position |
|---|---|---|
| "set up brand", "brand identity", "voice", "logo system", "design tokens", "BRAND.md" | brand-foundation | `/brand-system` |
| "campaign", "marketing plan", "channel strategy", "content calendar", "GTM" | campaign-planning | `/campaign-plan` |
| "write copy", "headline", "tagline", "CTA", "hook", "section copy" | copy-production | `/copywriting` |
| "landing page", "redesign my LP", "new landing page", "LP brief", "page architecture", "hero section", "section spec" | lp-page | `/lp-brief` |
| "landing page analytics", "LP results", "post-launch CRO", "conversion rate changed", "experiment results", "GA4 says", "heatmap / recordings" | lp-eval | `/lp-eval` (hard-gated on eval-loop) |
| "SEO", "keywords", "AI search", "programmatic SEO", "ASO", "search rank" | search-visibility | `/seo` |
| "TikTok video brief", "Reels brief", "Shorts brief", "short-form video brief", "video storyboard" | short-form-video | `/short-form-brief` (cross-stack on short-form-research) |
| "Meta ads", "Facebook ads", "Instagram ads", "retargeting ads", "primary text", "ad headline", "paid social", "ad creative copy" | paid-ads | `/ad-copy` (hard-gated on ICP) |
| "cold email", "LinkedIn DM", "outbound", "proposal", "first-touch" | outbound | `/cold-outreach` (hard-gated on ICP) |
| "tweet", "linkedin post", "tiktok caption", "reels caption", "shorts caption", "social post", "social copy" | social-post | `/social-copy` (single-platform-per-invocation) |
| "carousel", "thumbnail", "OG card", "banner", "OOH", "asset brief", "design brief" | asset-design | `/design-brief` |
| "this sounds AI-generated", "humanize this", "strip the slop", "make it sound human" | text-polish | `/humanize` |
| "Vietnamese tone", "polish VN", "this Vietnamese sounds translated" | vn-polish | `/vn-tone` |
| "scope this", "clarify requirements", "what should we build" | discovery | `/discover` (meta) |
| Empty or ambiguous | unknown | emit Format 4 scoping prompt |

### Step 3 — Apply routing rules

Apply in order; first match wins:

1. **ICP-foundation gate (cross-stack):** any content-or-campaign intent AND no `research/product-context.md` → defer to `/orchestrate-research` (specifically `/icp-research`). Rationale: 13+ marketing skills consume this artifact; skipping produces hollow output everywhere.
2. **Brand-foundation gate:** any content / campaign / LP / ad / outreach / social / design intent AND no `brand/BRAND.md` → propose `/brand-system` first. Rationale: brand voice + design tokens feed every downstream content skill.
3. **Brand done + intent: campaign-planning** → `/campaign-plan`.
4. **Brand done + intent: copy-production** → `/copywriting`. If campaign-plan missing, note: "copywriting works without it but is sharper with campaign positioning context."
5. **Brand done + intent: lp-page** → `/lp-brief`. Rationale: it owns landing-page construction and redesign briefs, with conversion principles applied before launch.
6. **Intent: lp-eval** → if a matching `skills-resources/loops/[slug]/` exists, propose `/lp-eval`; otherwise propose `/eval-loop` first and explain that `/lp-eval` writes into an existing loop. Rationale: post-launch page evidence belongs in the loop ledger, not a one-off audit.
7. **Intent: search-visibility** → `/seo`. Ask user which mode (audit / ai / programmatic / competitor / aso).
8. **Intent: short-form-video** → `/short-form-brief`. Requires matching `.agents/skill-artifacts/research/short-form-research/[slug].md` catalog (from research-skills); if missing, flag cross-stack handoff to `/short-form-research`.
9. **Intent: paid-ads** → `/ad-copy`. Hard requires `research/icp-research.md`. Ask which audience-temperature (retargeting / cold) — single-temp per invocation; run twice for campaigns spanning both. Meta-only at v1.
10. **Intent: outbound** → `/cold-outreach`. Hard requires `research/icp-research.md`.
11. **Intent: social-post** → `/social-copy`. Single-platform-per-invocation. Ask which platform (tiktok / reels / shorts / x / linkedin).
12. **Intent: asset-design** → `/design-brief`. Per-asset (carousel / thumbnail / banner / OG card / hero illustration).
13. **Intent: text-polish** → `/humanize`. Trivial — no gate.
14. **Intent: vn-polish** → `/vn-tone`. Post-translation only, runs on already-translated VN text.
15. **No clear intent + everything done** → marketing stack exhausted. Recommend `/orchestrate-product` or `/orchestrate-research` or `/orchestrate-meta` (Format 3).
16. **Stale brand** (warn-but-don't-block per state-map-template): include staleness warning, offer refresh, route forward if operator chooses.
17. **Skip-rules:** operator explicitly says "I just want X" without upstream → respect it, route to X, include the quality-drop caveat in the recommendation.
18. **Wrap-around:** recommendations gating high-stakes downstream work (e.g., lp-brief feeding a launch, ad-copy feeding a paid campaign) → append `(optional /fresh-eyes after)`.
19. **Polish chain mention:** if user is producing copy AND a `skills-resources/experience/content.md` says brand_mode=founder OR market includes Vietnamese, mention humanize/vn-tone as the terminal step after the generation skill.
20. **Don't cross-route** outside `/discover` — research/product/other meta-skills go through `/orchestrate-meta`.

**Ambiguity rule:** if user's intent matches 2+ buckets ("I need content for my new product"), propose 2 options with rationale. Don't pick for them.

### Step 4 — Present + confirm

Emit one of the four formats in [`references/output-formats.md`](references/output-formats.md) [PROCEDURE]: single-route (Format 1), combined-path (Format 2), cross-stack process route (Format 3), or empty-ask scoping fallback (Format 4). Never auto-invoke; always print `→  /skill-name` for the operator to type.

### Step 5 — Persist + hand off

Append to `skills-resources/experience/marketing-workflow.md`:

```markdown
## Session YYYY-MM-DD
- Read state: <one-line summary>
- User intent: <classification>
- Recommended: /<skill>
- User confirmed: <yes / pending / redirected>
```

Then print the hand-off line and exit. Operator types the next slash command.

## Anti-Patterns

Critic-load reference: [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before emitting any recommendation that smells off — routing past missing ICP / brand, recommending hard-gated skills (ad-copy, cold-outreach, lp-eval) without upstream, conflating lp-brief vs lp-eval, conflating copywriting vs humanize, recommending social-copy as multi-platform, recommending ad-copy without audience-temperature prompt.

## Completion Status

- **DONE** — recommendation given, hand-off printed, breadcrumb appended.
- **BLOCKED** — couldn't read project state (manifest missing AND no fallback paths AND fresh-project bootstrap unclear).
- **NEEDS_CONTEXT** — empty ask + state too sparse to infer. Emit Format 4 scoping prompt and exit (operator re-runs with answer).

## References

- [`references/playbook.md`](references/playbook.md) [PLAYBOOK] — why this skill exists, methodology, principles, when NOT to use
- [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md) [PLAYBOOK] — pre-Pre-Dispatch read pattern (canonical at `references/`, synced)
- [`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md) [PROCEDURE] — `--fast` behavior contract
- [`references/state-map-template.md`](references/state-map-template.md) [PROCEDURE] — manifest signals + filesystem fallback paths + state map structure + stale detection + re-entry
- [`references/output-formats.md`](references/output-formats.md) [PROCEDURE] — the 4 output shapes (single-route, combined-path, cross-stack-process, scoping fallback)
- [`references/workflow-graph.md`](references/workflow-graph.md) — full marketing-stack pipeline + per-skill catalog + decision rules
- [`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN] — failure modes
- [`references/_shared/manifest-spec.md`](references/_shared/manifest-spec.md) [PROCEDURE] — manifest contract Step 1 reads
- `marketing-skills/CLAUDE.md` §"Manifest Spec" + §"Complexity Routing" — stack-level conventions this skill inherits
