# Nearest-match — computing the gap line (terminal state *b*)

A read-only procedure the dispatcher runs **inline** (no script) when a turn lands in the **gap**
terminal state: the ask is *capability-shaped* (an imperative to produce / evaluate / plan a
marketing, research, or product job) but matches no Step-3 intent row, no `chains/<domain>.md` rule,
and no capability in the index. The rule: **do not answer a capability-shaped ask from general
knowledge** — name the gap and the nearest real capabilities instead.

> Capability-shaped vs not: "design my Figma component library", "write my YC application",
> "build me a Notion dashboard" are capability-shaped (FORSVN is asked to *do* a job). A pure factual
> question — "what's a good email CTR?", "what does AOV mean?" — is answered normally and is **not** a
> miss.

## Source of truth

The stack catalog: [`../../../../../references/capability-index.json`](../../../../../references/capability-index.json)
(the generated capability index, at the package root). Scan only `public: true` capabilities. Use the
`command`, `summary`, `aliases`, and `route.use_when` fields. **Never** print a skill count or total —
name specific commands only.

## Scoring (inline heuristic, same style as the classify flow)

1. Extract the **salient tokens** from the ask — the verbs and nouns naming the job
   (e.g. *design · component · library*), dropping stopwords.
2. For each `public: true` cap, score the overlap of those tokens against its
   `summary` + `aliases` + `route.use_when` (alias/exact-noun hits weigh most; `use_when` phrase
   overlap next; `summary` token overlap last).
3. Take the **top 1–2** caps by score. If the best score is still weak, keep just the single closest —
   one honest near-miss beats two stretches.

## Render the gap line — exact shape

```
FORSVN has no capability for <one-clause restatement of the ask>.
Nearest: /<cap-a> (<≤8-word summary>) · /<cap-b> (<≤8-word summary>).
Want me to run one of those, or is this out of scope for the stack?
```

- One clause restating the ask; no apology, no padding.
- 1–2 nearest commands, each with a ≤8-word plain-language gloss drawn from its `summary`.
- No skill count, no per-domain total, no "the stack has N skills" — names only.
- This is terminal state **b** (gap), **not** a clarify: it ends the turn unless the operator picks
  one of the offered caps.

## Worked example

Ask: *"design my Figma component library."* No Step-3 row, no chain rule, no index match — but it is
capability-shaped (a *design / produce* imperative). Salient tokens: *design · component · library*.
Nearest by `summary`/`use_when` overlap: `/brief-graphic` (briefs visual/graphic assets) and
`/create-brand` (brand system + design tokens). Output:

```
FORSVN has no capability for designing a Figma component library.
Nearest: /brief-graphic (briefs a visual/graphic asset) · /create-brand (brand + design tokens).
Want me to run one of those, or is this out of scope for the stack?
```
