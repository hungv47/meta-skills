// decision-reason.ts — the single source of the reason enum (C1).
//
// A Reject / Request-changes decision carries a one-tap reason chip from this
// fixed enum, written to `decision_reason` in the artifact frontmatter. An enum
// is countable where free text is not — `decision_reason` is the column the
// learning wire (C2/L1 verdicts.tsv) records and WS-L aggregates.
//
// This is the ONLY place the list is defined for TypeScript surfaces; every
// in-package surface imports it (the TTY prompt, the CLI /done handler, the
// preview-config injected into the browser chrome). Surfaces that cannot import
// TS restate it from the contract ref (references/artifact-contract-template.md
// § "Review fields") and the validator Set (bin/validate-artifacts.ts) — those
// are the only sanctioned restatements.
//
// The enum is fixed at 8. Adding/renaming a value is an artifact-contract change
// (full pre-merge gate), never a casual edit.

export const DECISION_REASONS = [
  "off-brief", "wrong-claim", "tone", "too-long",
  "weak-hook", "format", "factually-wrong", "other",
] as const;

export type DecisionReason = (typeof DECISION_REASONS)[number];

export function isDecisionReason(s: string): s is DecisionReason {
  return (DECISION_REASONS as readonly string[]).includes(s);
}
