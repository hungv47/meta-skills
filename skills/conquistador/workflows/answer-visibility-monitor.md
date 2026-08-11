# Answer visibility monitoring workflow

Use privately for an on-demand, dated audit of whether a product/source appears or is cited in AI
answer systems.

1. Use `optimize-search` to define a fixed query set, inspect source eligibility/extractability, and
   diagnose organic versus answer-surface evidence separately.
2. Use `measure-growth` to compare dated observations, confounders, and keep/revise decisions.

Record exact query, date, locale/personalization context when knowable, provider/model, answer,
citation, and source URL. Unknown remains unknown. Do not infer citations from organic traffic or
claim that schema, `llms.txt`, or one content change caused provider behavior.

Repeat the same measurement ritual each time so snapshots stay comparable: identical fixed query set,
same provider/model and locale, the same recording template, and the same diagnosis steps. Date every
observation and re-run on the stated cadence only when the decision calls for it; otherwise treat
each audit as a one-off. Between snapshots, record what changed and what stayed unknown.

This is an on-demand workflow, never a background monitor.

