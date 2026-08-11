# Measured initiative loop

Use privately for a campaign or growth initiative that must learn across more than one cycle.

1. Use `plan-campaign` to define one segment, hypothesis, intervention, primary signal, guardrails,
   scope, and stop rule.
2. Use the relevant creation skill, such as `write-outreach`, for Cycle 1.
3. Use `measure-growth` to decide keep/revise/stop from actual results.
4. Change one hypothesis for Cycle 2 only when Cycle 1 evidence supports continuing.

Run every cycle idempotently: each run starts from the same recorded baseline and contract and
re-derives the same state, so re-runs do not drift. Self-check the recorded contract, evidence, and
decision before continuing to a new cycle. Set both a stop rule and a kill-switch: a pre-agreed early
condition (for example a defined below-threshold signal or a safety/compliance failure) that ends the
initiative outright rather than triggering another revision. Never promote a two-cycle observation
into a universal rule.

The workflow must work in the current conversation. Optional persistence is one plain Markdown record
of the program contract, cycle evidence, decision, and bounded learning. No manifest, graph, router,
database, or background runtime is required.

