# Humanmaxxing Regression Suite

> Lightweight protocol for preventing humanmaxxing from stripping specificity or regressing into detector-visible patterns.

## When To Use

Use a regression fixture for:

- `short-outbound` content from `write-outreach` or `write-ad`,
- high-stakes public pages,
- repeated brand voice work,
- any content that previously triggered AI detection.

## Fixture Shape

```yaml
name: "[content type + scenario]"
Pattern basis: internal research synthesis.
content_type: "short-outbound | internal | blog | docs | internal"
protected_tokens:
 - "[named entity]"
 - "[number]"
 - "[URL]"
minimum_compression: "0-10% | 10-15% | 15-25% | 20-30%"
detector_gate:
 mode: "pangram | proxy"
 threshold: "public >=0.95 human_probability or <=0.05 ai_probability; high-stakes >=0.99 human_probability or <=0.01 ai_probability; operator policy if stricter"
expected:
 hard_tells: 0
 soft_tells_max: 2
 protected_tokens_preserved: true
 specificity_drop_max: 1
```

## Regression Rules

- Any protected token removed, rounded, or paraphrased is a FAIL.
- Any named proof point removed from short-outbound content is a FAIL.
- Specificity score may not drop by 2 or more from the upstream critic-approved draft.
- Detector/proxy failure after two rewrite cycles becomes `DONE_WITH_CONCERNS`, not an infinite loop.
- Never add fake anecdotes or fabricated imperfections to beat a detector.

## Report Fields

Every high-stakes humanmaxxing artifact should record:

- detector status: `not_run | proxy_pass | proxy_fail | pangram_pass | pangram_fail`;
- protected-token status;
- compression result;
- residual pattern counts;
- rewrite-cycle count.
