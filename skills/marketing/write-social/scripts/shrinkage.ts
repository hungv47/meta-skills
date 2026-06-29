// GENERATED SUPPORT FILE. Do not edit here. Run `node _dev/sync-skill-support.mjs` from the forsvn/skills root.
// shrinkage.ts — the SINGLE definition of the evidence-weighted shrinkage weight
// (L4). Spec: ops/strategy/specs/WS-L-learning.md § L4.
//
//   weight = n / (n + k)
//
// `weight ∈ [0,1)`: how much own-data is trusted vs the platform prior, blended
// continuously instead of snapping on at a hard floor.
//   n = eligible in-window observations
//   k = prior strength (default 8 — the former hard `sufficient_floor`)
//   n=0  → 0    (pure prior — a thin/empty store CANNOT move the prior)
//   n=2  → 0.20 (two posts literally can't override a prior)
//   n=8  → 0.50 (own-data and prior weigh equally)
//   n=24 → 0.75
//   n→∞  → 1    (own-data dominates)
//
// This is the ONE place the formula lives. L3 (distill-priors.ts) writes it into
// priors.json; L4 (query-performance.ts) emits it alongside the 3-state bucket;
// query-verdicts callers and L7 (check-learning-hygiene.ts) import it to re-derive
// or audit a weight. NEVER copy the arithmetic — import this. A second copy is the
// exact drift this module exists to prevent (mirrors performance-data.md: the floor
// was the only knob; k is its smooth replacement, and there are no other tunables).
//
// Blending contract, for a producer deciding how hard to follow own-data:
//   effective = weight * ownDataSignal + (1 - weight) * priorSignal
// Floors are NEVER blended — a `floor: true` dimension ignores weight entirely
// (brand / safety / platform-mechanics). See L4 § "Preserve the floors".

export const DEFAULT_SHRINKAGE_K = 8;

/** weight = n / (n + k). n,k ≥ 0; k=0 with n=0 is defined as 0 (no evidence). */
export function shrinkageWeight(n: number, k: number = DEFAULT_SHRINKAGE_K): number {
  if (!Number.isFinite(n) || n < 0) throw new RangeError(`shrinkageWeight: n must be a finite number ≥ 0, got ${n}`);
  if (!Number.isFinite(k) || k < 0) throw new RangeError(`shrinkageWeight: k must be a finite number ≥ 0, got ${k}`);
  const denom = n + k;
  return denom === 0 ? 0 : n / denom;
}

/** weight rounded to 3 dp — the value written to JSON / shown in a recall line. */
export function shrinkageWeightRounded(n: number, k: number = DEFAULT_SHRINKAGE_K): number {
  return Number(shrinkageWeight(n, k).toFixed(3));
}

/**
 * Human-readable anecdote-vs-account weighting bucket for the 3-state label that
 * producers and the recall blocks still cite. Kept here so the bucket boundaries
 * track k (weight ≥ 0.5 ⇔ n ≥ k): below k is anecdote-weight.
 */
export function weightBucket(n: number, k: number = DEFAULT_SHRINKAGE_K): "empty" | "sparse" | "sufficient" {
  if (n <= 0) return "empty";
  return n >= k ? "sufficient" : "sparse";
}
