# Detector-Resistance Reference

> Humanize must survive classifier-style AI detectors, not just remove obvious LLM phrases. Pangram-style detectors are trained on semantic and structural signals; synonym swapping is not enough.

## What Changes

Traditional humanizers optimize surface texture:

- replace AI vocabulary,
- vary sentence length,
- remove obvious phrases,
- add contractions.

Classifier-style detectors can still catch that because the underlying document keeps the same uniform argument flow, overly balanced structure, generic specificity, and polished consistency.

Detector-resistant humanization changes the document at four levels:

1. **Structure:** rearrange the argument when the original flow is template-shaped.
2. **Semantics:** replace generic claims with context-specific evidence, caveats, and lived observations.
3. **Rhythm:** create real variation, including short fragments, longer qualified sentences, and occasional imperfect transitions.
4. **Register:** allow controlled human inconsistency where it matches the author, channel, and stakes.

## Pangram-Aware Gate

If a real detector integration is available, the orchestrator runs it after critic PASS for high-stakes public content, prior detector failures, admissions/application copy, paid acquisition assets, and any user request that explicitly names detector resistance.

Expected environment:

- `PANGRAM_API_KEY` or equivalent detector credential.
- A detector CLI/script configured by the operator.
- A threshold defined by the operator or the content policy.

If no credential or detector script exists, do not fabricate a score. Run the proxy checklist below and mark detector status as `proxy_pass` or `proxy_fail`. Use `not_run` only when detector mode is disabled or the content is low-stakes internal material.

## Threshold Guidance

Detector thresholds must preserve a low false-positive posture. The skill optimizes for genuinely authored, specific writing, not for tricks that make detector scores look better while increasing the chance of falsely marking human text as AI.

Use this default policy unless the operator supplies a stricter one:

| Content stakes | Gate | Default threshold | Result handling |
|---|---|---|---|
| Internal or low-stakes | Proxy only unless requested | No external detector required | Record `not_run` or `proxy_pass`; do not over-edit. |
| Public marketing / thought leadership | Pangram if available, proxy fallback | `human_probability >= 0.95` OR `ai_probability <= 0.05` | If below threshold, run one detector-resistance rewrite cycle. |
| Admissions, applications, compliance-sensitive, reputation-sensitive | Pangram required when credentials exist; proxy fallback only if unavailable | `human_probability >= 0.99` OR `ai_probability <= 0.01` | If below threshold after 2 cycles, return `DONE_WITH_CONCERNS`. |
| Policy-capped environments | internal | Honor the stricter policy, commonly a false-positive cap around `0.5%` | Do not claim compliance unless the detector result and policy threshold are recorded. |

When the detector API reports both a label and probabilities, use the probability threshold, not the label alone. When it reports only a label, treat `likely_ai` or stronger as `pangram_fail` for high-stakes content. When it reports confidence intervals or calibration warnings, record them in the artifact and avoid binary compliance claims.

**Failure rule:** For high-stakes content with `detector_mode: pangram`, a real detector failure is a critic FAIL even if the 5-dimension humanmaxxing score passes. For low-stakes content, a detector failure may ship as `DONE_WITH_CONCERNS` only when the operator explicitly accepts the risk.

## Proxy Checklist

Use this when an external detector cannot run.

| Signal | Pass | Fail |
|---|---|---|
| **Argument shape** | The flow has a human reason for its order; not every section follows claim -> explanation -> example -> transition. | The piece keeps a symmetrical template after editing. |
| **Specificity source** | Specifics come from the original, brand context, cited examples, or clearly marked placeholders. | Specifics feel bolted on or invented. |
| **Register variance** | Formality shifts naturally by section and channel. | Every paragraph is uniformly polished. |
| **Semantic compression** | Filler is removed while ideas become sharper. | The same generic idea survives in fewer words. |
| **Human imperfection** | Minor asymmetry, directness, or bluntness appears where a real editor would leave it. | The output is immaculate, balanced, and generic. |

## Regression Fixture Pattern

For recurring content types, keep a small local fixture set:

- original AI-ish input,
- expected protected tokens,
- expected minimum compression range,
- expected detector/proxy result,
- final approved output.

The goal is not to game a detector. The goal is to prevent regressions where humanmaxxing drifts back into synonym-swapping, over-polishing, or deleting specificity.

## Multi-Pass Escalation

Use only when the critic or detector proxy still sees AI residue:

1. **Generate:** start from original text and preserve all facts.
2. **Strip:** remove known AI patterns.
3. **Restructure:** reorder template-shaped argument flow.
4. **Revoice:** add author/channel-specific rhythm and experience markers.
5. **Compress:** cut filler after structure and voice are stable.
6. **Verify:** critic, protected-token regression, and detector/proxy gate.

Do not loop indefinitely. After two failed verification cycles, return `DONE_WITH_CONCERNS` with the detector/proxy findings.
