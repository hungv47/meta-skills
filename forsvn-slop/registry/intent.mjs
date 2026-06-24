// intent.mjs — the brand-awareness | direct-response STRATEGY axis (FOR-57 / S8).
//
// `intent` is a coarse goal-axis ABOVE the shipped content-type `register` (editorial/landing/
// social/legal/ad). The two compose: a check resolves its `register` branch first (unchanged), then
// `intent` re-points severity/threshold for a SMALL declared set (INTENT_PROFILES) on top.
//
// THE LOAD-BEARING GUARANTEE (decision (a), 2026-06-24): when `intent` is UNSET, applyIntent returns
// null for every rule, so each check runs its original code path verbatim — the scanner output is
// byte-identical to pre-S8 and the 213-fixture golden corpus is NOT rebaselined. `intent` only ever
// shifts behavior when EXPLICITLY declared (--intent= / frontmatter intent: / BRAND.md ## Intent).
//
// INTENT_LOCKED (the claim-integrity block rules) can NEVER be re-pointed by intent — a fix may never
// weaken claims/numbers (the Post-Humanize Regression Check). They carry no profile and applyIntent
// refuses them defensively.
//
// Pure + node-importable (no Bun/process/Date/fs): scan-core.mjs imports this, and FOR-52's node hook
// imports scan-core, so this must stay plain ESM.

export const VALID_INTENTS = new Set(['brand-awareness', 'direct-response']);

// Claim-integrity floor: intent must never disable or down-severity these. Never appears in
// INTENT_PROFILES (asserted by registry.test.ts).
export const INTENT_LOCKED = new Set([
  'mkt-claim-fabricated-precision',
  'mkt-claim-hypothetical-as-measured',
]);

// The intent-sensitive set: per-rule, per-intent {severity?, threshold?, suppressWhenBacked?}
// OVERRIDES applied only when an intent is explicitly declared. A rule absent here is intent-invariant
// (fires at its registry default in every intent). Keep in lockstep with the `**Intent:**` lines in
// references/marketing-antipatterns.md (registry.test.ts enforces the biconditional).
export const INTENT_PROFILES = {
  // Long brand cadence tolerated (density, like register:editorial); DR stays tight (strict count).
  'mkt-slop-em-dash-overuse': {
    'brand-awareness': { severity: 'warn', threshold: { per1000Gte: 5 } },
    'direct-response': { severity: 'block', threshold: { countGte: 1 } },
  },
  // Urgency is off-brand for awareness; legitimate in DR only when backed by a real inventory/date.
  'mkt-cta-fake-urgency': {
    'brand-awareness': { severity: 'block' },
    'direct-response': { severity: 'warn', suppressWhenBacked: true },
  },
  // DR demands one dominant action; awareness tolerates a softer multi-link.
  'mkt-cta-multiple-competing': {
    'brand-awareness': { severity: 'warn' },
    'direct-response': { severity: 'block' },
  },
  // A deliberate aphoristic hook is allowed in awareness; a weak hook in DR.
  'mkt-hook-rhetorical-question': {
    'brand-awareness': { severity: 'warn' },
    'direct-response': { severity: 'block' },
  },
  // Colon-reveal is a brand stylistic move; a DR weak-tell.
  'mkt-slop-colon-reveal': {
    'brand-awareness': { severity: 'nit' },
    'direct-response': { severity: 'warn' },
  },
  // DR closes assumptively — no permission-asking.
  'mkt-voice-permission-closer': {
    'brand-awareness': { severity: 'warn' },
    'direct-response': { severity: 'block' },
  },
  // Long-form brand copy is allowed density; DR must scan.
  'mkt-struct-wall-of-text': {
    'brand-awareness': { severity: 'nit' },
    'direct-response': { severity: 'warn' },
  },
};

/** Coerce any value to a valid lowercased intent enum, else null (never throws). */
export function coerceIntent(v) {
  if (v == null) return null;
  const s = String(v).trim().toLowerCase();
  return VALID_INTENTS.has(s) ? s : null;
}

/**
 * Parse a brand-of-record intent from BRAND.md: find an `## Intent` heading, read the first
 * non-empty line (a lone bullet tolerated), accept ONLY the closed enum, else null. Never throws.
 */
export function parseIntent(brandMd) {
  if (!brandMd || typeof brandMd !== 'string') return null;
  const lines = brandMd.split(/\r?\n/);
  const i = lines.findIndex((l) => /^#{1,6}\s+intent\s*$/i.test(l.trim()));
  if (i < 0) return null;
  for (let j = i + 1; j < lines.length; j++) {
    const t = lines[j].trim();
    if (!t) continue;
    if (/^#{1,6}\s/.test(t)) return null; // next heading before a value
    return coerceIntent(t.replace(/^[-*]\s*/, ''));
  }
  return null;
}

/**
 * Resolve the effective intent by precedence: explicit override (CLI --intent=) > per-artifact
 * frontmatter intent: > BRAND.md ## Intent > unset. CLI wins a tie with frontmatter.
 * @returns {{intent: 'brand-awareness'|'direct-response'|null, source: 'override'|'frontmatter'|'brand-md'|'unset'}}
 */
export function resolveIntent({ override, frontmatter, brandMd } = {}) {
  let v = coerceIntent(override);
  if (v) return { intent: v, source: 'override' };
  v = coerceIntent(frontmatter);
  if (v) return { intent: v, source: 'frontmatter' };
  v = parseIntent(brandMd);
  if (v) return { intent: v, source: 'brand-md' };
  return { intent: null, source: 'unset' };
}

/**
 * The per-rule resolver a check calls inline. Returns the {severity?, threshold?, suppressWhenBacked?}
 * override for (ruleId, intent), or NULL when intent is unset/invalid, the rule is intent-invariant,
 * or the rule is INTENT_LOCKED. A null return means "run the original code path" — that is the
 * unset-intent identity guarantee. Never throws.
 */
export function applyIntent(ruleId, intent) {
  const key = coerceIntent(intent);
  if (!key) return null;
  if (INTENT_LOCKED.has(ruleId)) return null; // claim-integrity: never re-pointed
  const prof = INTENT_PROFILES[ruleId];
  return (prof && prof[key]) || null;
}
