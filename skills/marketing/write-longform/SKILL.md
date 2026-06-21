---
name: write-longform
description: "Writes longform / pillar content (blog posts, pillar pages, SEO-anchored essays) through a research, outline, draft, and critic pipeline with a structural-quality plus originality rubric. Use for 1500+ word pieces that argue one thesis and must earn their length — not write-copy on a long doc. Not for short conversion copy (use write-copy), social posts (use write-social), keyword/search strategy (use optimize-seo), ad copy (use write-ad), or a content calendar (use plan-campaign)."
argument-hint: "[topic + target reader + the claim the piece must own, e.g. 'async standups / eng managers / sync standups are a tax']"
allowed-tools: Read Grep Glob Bash WebSearch WebFetch
metadata:
  version: "1.0.0"
  budget: deep
  estimated-cost: "$2-3"
---

# Write Longform — Orchestrator

*Content — writes a longform / pillar piece via research → outline → draft → critic, scored on structure AND originality. NOT write-copy on a long doc. Capability metadata: [`routing.yaml`](routing.yaml). Methodology, philosophy, scope, the anti-collapse boundary: [`references/playbook.md`](references/playbook.md) [PLAYBOOK].*

**Core question:** "Does this piece make ONE argument the reader can't get from the first page of search results, supported by real evidence, structured so each section earns the next — or is it a long string of generic paragraphs?"

## Critical Gates — read first

1. **One thesis the piece must own.** A pillar piece argues ONE non-obvious claim, stated up front, defended throughout. "A guide to X" with no thesis is a list, not a pillar. No ownable thesis → BLOCK and ask.
2. **Research before outline, outline before draft.** The pipeline is strict-ordered: the research agent gathers real evidence (sources, data, examples, counter-arguments) BEFORE any structure; the outline commits the argument's spine BEFORE any prose. Drafting first produces generic filler — the exact write-copy-on-a-long-doc failure this skill exists to avoid.
3. **Every section earns its place.** Each section advances the thesis or it is cut. A section that could be deleted without weakening the argument is filler. The outline agent enforces section-level necessity.
4. **Originality is a gate, not a nicety.** The piece must contain ≥1 of: a non-obvious claim, a proprietary frame/model, original data/examples, or a contrarian-but-defended position. A piece that only restates consensus FAILs originality regardless of polish — this is the anti-collapse dimension (see `references/playbook.md` § "Why this isn't write-copy").
5. **Cited or marked.** Every factual claim is sourced or tagged `[author-assertion]`/`[pattern-derived]`. No invented statistics, no fake citations. Hard gate.

## Quality Gate — 7 dimensions

Full rubric + Pass/Fail bands: [`references/rubric.md`](references/rubric.md) [PROCEDURE]. Critic agent: [`agents/critic.md`](agents/critic.md).

- **Gate:** Total ≥36/49 AND every dim ≥4/7 AND the Originality dim ≥5 (the anti-collapse floor). Below → FAIL, route to the named agent, max 2 rewrite cycles.
- Dimensions: **Thesis clarity** · **Structural integrity** · **Evidence quality** · **Originality** · **Reader-fit** · **Prose quality** · **Search/AEO-readiness**.

## Before Starting

Per [`references/_shared/before-starting-check.md`](references/_shared/before-starting-check.md). Recommended context:

| Artifact | Source | Required? |
|---|---|---|
| `research/icp-research.md` | research-icp | Recommended — the target reader, their awareness stage, their VoC language |
| `research/product-context.md` | research-icp | Recommended — the proprietary frame / unique mechanism the piece can own |
| `brand/BRAND.md` | create-brand | Recommended — voice anchors + banned language |
| `docs/forsvn/artifacts/marketing/optimize-seo-*.md` | optimize-seo | Optional — the target keyword cluster + the pillar's place in a topic map |
| `docs/forsvn/artifacts/marketing/campaign-plan.md` | plan-campaign | Optional — the pillar's role in the content calendar |

## Pre-Dispatch + Mode

Run canonical Pre-Dispatch ([`references/_shared/pre-dispatch-protocol.md`](references/_shared/pre-dispatch-protocol.md)). **Needed dimensions:** topic · target reader (role + awareness stage) · the ownable thesis (the claim the piece defends) · piece-type (blog post / pillar page / essay) · target length · search intent (if SEO-anchored) · the proprietary angle (frame / data / experience the author brings). Missing thesis OR target reader → hard-block, ask one question. Full Cold Start + Missing-Input Hard Blocks: [`references/procedures/pre-dispatch.md`](references/procedures/pre-dispatch.md).

Mode ([`references/_shared/mode-resolver.md`](references/_shared/mode-resolver.md)): `budget: deep`. `--fast` collapses to research-lite → outline → single-draft (no rewrite loop). **`--fast` does NOT skip** Cold Start, Critical Gates 1-5, the research-before-outline order, or the cited-or-marked gate.

## Agents + Routes

4 sub-agents (research → outline → draft → critic) in a STRICT sequential pipeline (the order is the whole point). Two routes — A (compose a new piece), B (called by another skill, e.g. optimize-seo commissioning a pillar). Full manifest + dispatch graph: [`references/agent-manifest.md`](references/agent-manifest.md) [PROCEDURE].

## Artifact Contract

- **Path:** `docs/forsvn/artifacts/marketing/write-longform/[piece-type]-[date]-[slug].md`
- **Lifecycle:** `pipeline` — re-run on thesis change, new evidence, or a search-intent shift.
- **Frontmatter + body order + the source-ledger schema:** [`references/format-conventions.md`](references/format-conventions.md) [PROCEDURE].
- **Consumed by:** `evaluate-content` (scores the published piece), `optimize-seo` (the pillar in a topic map), `humanmaxxing` (terminal AI-tell polish pass).

## Anti-Patterns

[`references/anti-patterns.md`](references/anti-patterns.md) [ANTI-PATTERN]. Re-read before any piece ships: no-thesis listicle, draft-before-research, consensus-restatement (the collapse-into-write-copy tell), invented statistics, filler sections, keyword-stuffing, wall-of-text-no-structure, length-padding to hit a word count.

## Durable Rules (protected)

<!-- SLOW_UPDATE_START -->
<!-- No pinned rules yet. Populate via the slow-update workflow (references/slow-update-fence.md). -->
<!-- SLOW_UPDATE_END -->

## Completion Status

- **DONE** — research ledger + outline + draft written, critic PASS (Originality ≥5).
- **DONE_WITH_CONCERNS** — piece complete but with thin evidence or a borderline-original thesis; flagged in the artifact.
- **BLOCKED** — no ownable thesis exists for the topic (it's a pure how-to with no argument); recommend a different format or scope.
- **NEEDS_CONTEXT** — no target reader / proprietary angle definable; recommend `research-icp` first.

## Worked Example

End-to-end pillar piece (eng-manager audience, thesis "synchronous standups are a coordination tax", research ledger → outline → draft → critic PASS with a cycle-0 Originality FAIL the critic caught), plus the explicit side-by-side proving it is NOT write-copy: [`references/examples/longform-walkthrough.md`](references/examples/longform-walkthrough.md) [EXAMPLE].

## References

- `references/{playbook, rubric, format-conventions, anti-patterns, agent-manifest, research-method, structure-patterns}.md`
- `references/procedures/pre-dispatch.md` [PROCEDURE]
- `references/examples/longform-walkthrough.md` [EXAMPLE]
- `agents/{research, outline, draft, critic}.md`
- `references/_shared/{pre-dispatch-protocol, before-starting-check, mode-resolver, marketing-foundations}.md`
