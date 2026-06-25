// dismissal-scope.ts — the single source of the slop-dismissal scope enum (FOR-56 / S7).
//
// When a human dismisses a slop suggestion card, the dismissal carries a `scope` chip
// answering "is the RULE wrong, or is THIS artifact a legit one-off?". The two cases are
// structurally different signals and must never be conflated:
//
//   'exception'  = this artifact is a legitimate one-off (a quote/testimonial/legal line,
//                  a deliberate stylistic choice). RECORDED for the taste corpus, but NEVER
//                  counted toward revising the rule. This is the FAIL-SAFE default —
//                  a missing or out-of-enum scope reads as 'exception', so an ambiguous
//                  dismissal can never auto-flag a rule.
//   'rule-wrong' = the rule itself is mis-calibrated. COUNTED toward the >=3-dismissal
//                  revision threshold (rule-dismissals.ts).
//
// This is the ONLY place the list is defined for TypeScript surfaces. The reader
// (rule-dismissals.ts) and the producer-side writer (dismissals.ts) import it. The
// forsvn-preview POST /dismiss handler restates the two values inline (the only sanctioned
// restatement) so it never load-depends on forsvn-slop — see the comment there.
//
// Mirrors lib/decision-reason.ts in shape EXACTLY. Adding/renaming a value is a co-owned
// schema change to slop-dismissals.tsv (a schema_version bump), never a casual edit.

export const DISMISSAL_SCOPES = ["exception", "rule-wrong"] as const;

export type DismissalScope = (typeof DISMISSAL_SCOPES)[number];

export function isDismissalScope(s: string): s is DismissalScope {
  return (DISMISSAL_SCOPES as readonly string[]).includes(s);
}

/** Fail-safe normalize: a missing / out-of-enum scope becomes 'exception' (never counted). */
export function normalizeScope(s: string | undefined | null): DismissalScope {
  return s != null && isDismissalScope(s) ? s : "exception";
}
