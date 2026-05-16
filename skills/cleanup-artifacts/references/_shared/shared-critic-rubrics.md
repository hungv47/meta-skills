<!-- GENERATED SUPPORT FILE. Do not edit here. Run `node scripts/sync-skill-support.mjs` from the agent-skills repo root. -->

# Shared Critic Rubrics

Reusable rubric dimensions for skills that need consistent cross-stack quality gates. Skill-specific critics should import only the dimensions that genuinely apply, then add domain-specific thresholds and examples locally.

## Claim Substantiation

Use when an artifact makes factual, numeric, comparative, medical, financial, legal, performance, or customer-result claims.

| Score | Standard |
|---|---|
| 9-10 | Every material claim traces to a named source, artifact, customer proof point, or clearly marked operator-provided input. Caveats are preserved. |
| 7-8 | Claims are mostly substantiated, with minor source/context gaps that do not change buying or implementation decisions. |
| 5-6 | Claims are plausible but thinly sourced; acceptable only as `DONE_WITH_CONCERNS` for low-risk drafts. |
| 3-4 | Important claims lack evidence, overstate certainty, or blur sourced and inferred statements. |
| 0-2 | Fabricated, unverifiable, or policy-sensitive claims presented as fact. |

Auto-fail: invented customer result, unverifiable quantified promise, missing legal/compliance caveat, or source attribution removed during rewrite.

## Protected-Token Preservation

Use when an upstream skill provides exact names, numbers, URLs, citations, disclaimers, prices, dates, or claims that must survive downstream rewriting.

| Score | Standard |
|---|---|
| 9-10 | All protected tokens preserved exactly and placed where they still make sense. |
| 7-8 | All tokens preserved, but one or two feel awkwardly placed. |
| 5-6 | All tokens present, but surrounding copy weakens context or proof force. |
| 3-4 | A token is paraphrased, rounded, moved into ambiguity, or stripped of context. |
| 0-2 | A protected token is missing or contradicted. |

Auto-fail: any missing protected token when the caller marked it mandatory.

## Audience Specificity

Use when an artifact should speak to a defined ICP, persona, buyer state, or audience temperature.

| Score | Standard |
|---|---|
| 9-10 | Uses the audience's situation, vocabulary, constraints, objections, and buying trigger in a way a generic competitor could not copy unchanged. |
| 7-8 | Clearly audience-specific, with one or two generic passages. |
| 5-6 | Identifies the audience but relies on broad category language. |
| 3-4 | Could apply to several unrelated audiences with minimal edits. |
| 0-2 | Audience is missing, wrong, or contradicted by the artifact. |

## Mechanism Distinctness

Use when the offer depends on a Unique Mechanism or proprietary process.

| Score | Standard |
|---|---|
| 9-10 | Mechanism is named or unmistakably implied, causally explains the outcome, and is defended by proof/process detail. |
| 7-8 | Mechanism is distinct and causal, but proof or contrast could be sharper. |
| 5-6 | Mechanism exists but reads close to a commodity feature. |
| 3-4 | Copy names a feature or benefit but does not explain the proprietary "how." |
| 0-2 | No mechanism, or any competitor could run the same argument unchanged. |

Auto-fail: calling a generic label like "AI-powered", "personalized", or "done-for-you" a mechanism without explaining the causal difference.

## Pattern-Interruption Specificity

Use for paid ads, hooks, short-form, subject lines, and any surface competing in a crowded feed or inbox.

| Score | Standard |
|---|---|
| 9-10 | Breaks the specific competitor/category pattern while remaining clear, relevant, and proof-safe. |
| 7-8 | Breaks common pattern, but competitor-specific contrast could be sharper. |
| 5-6 | Noticeably different from sibling variants, but still category-familiar. |
| 3-4 | Mostly a paraphrase of common category promises. |
| 0-2 | Generic opener, curiosity bait, or competitor-copyable angle. |

Auto-fail: all variants use the same opening structure, proof anchor, or angle archetype.

## Humanize Regression

Use when a draft passes through a terminal humanize step.

| Score | Standard |
|---|---|
| 9-10 | AI-patterns reduced while claim force, specificity, protected tokens, CTA, and structure remain intact. |
| 7-8 | Meaning preserved with minor loss of sharpness. |
| 5-6 | Readability improved but specificity weakened; acceptable only with concerns. |
| 3-4 | Humanize removed proof, caveats, mechanism detail, or conversion logic. |
| 0-2 | Output is smoother but materially less true, less specific, or less useful. |

Auto-fail: protected-token loss, quantified proof removed, CTA changed, or compliance caveat compressed away.
