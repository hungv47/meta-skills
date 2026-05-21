/**
 * Shared scoring core for the skill router.
 *
 * Imported by BOTH the live hook (user-prompt-submit-skill-router.mjs) and the
 * explainer CLI (scripts/explain-skill-route.ts) so the two can never drift —
 * the explainer scores a prompt exactly the way the hook does.
 *
 * Scoring:
 *   phrases:  +6 per exact substring hit (case-insensitive)
 *   allOf:    +4 per conjunction group where ALL terms match
 *   anyOf:    +1 per hit, capped at +2
 *   noneOf:   hard suppress (score -> -Infinity)
 *   Threshold: score >= minScore (default 6)
 */

// ---------------------------------------------------------------------------
// Contraction expansion
// ---------------------------------------------------------------------------

export const CONTRACTIONS = {
  "it's": "it is", "what's": "what is", "where's": "where is",
  "that's": "that is", "there's": "there is", "who's": "who is",
  "how's": "how is", "isn't": "is not", "aren't": "are not",
  "wasn't": "was not", "weren't": "were not", "doesn't": "does not",
  "don't": "do not", "didn't": "did not", "won't": "will not",
  "can't": "cannot", "couldn't": "could not", "wouldn't": "would not",
  "shouldn't": "should not", "hasn't": "has not", "haven't": "have not",
  "i'm": "i am", "we're": "we are", "they're": "they are",
  "you're": "you are", "i've": "i have", "we've": "we have",
  "i'd": "i would", "we'd": "we would", "let's": "let us",
};

export function expandContractions(text) {
  let t = text.replace(/[‘’′]/g, "'");
  for (const [contraction, expansion] of Object.entries(CONTRACTIONS)) {
    if (t.includes(contraction)) {
      t = t.replaceAll(contraction, expansion);
    }
  }
  return t;
}

// ---------------------------------------------------------------------------
// Normalize
// ---------------------------------------------------------------------------

export function normalizePromptText(text) {
  if (typeof text !== "string") return "";
  let t = text.toLowerCase();
  t = expandContractions(t);
  return t.replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------------------
// Compile prompt signals (normalize all terms)
// ---------------------------------------------------------------------------

export function compilePromptSignals(signals) {
  const norm = (s) => expandContractions(s.toLowerCase());
  return {
    phrases: (signals.phrases || []).map(norm),
    allOf: (signals.allOf || []).map((group) => group.map(norm)),
    anyOf: (signals.anyOf || []).map(norm),
    noneOf: (signals.noneOf || []).map(norm),
    minScore: typeof signals.minScore === "number" ? signals.minScore : 6,
  };
}

// ---------------------------------------------------------------------------
// Score a prompt against one skill's compiled signals
// ---------------------------------------------------------------------------

export function matchPromptWithReason(normalizedPrompt, compiled) {
  if (!normalizedPrompt) {
    return { matched: false, score: 0, reason: "empty prompt" };
  }

  // noneOf: hard suppress (substring match, same as phrases/allOf/anyOf)
  for (const term of compiled.noneOf) {
    if (normalizedPrompt.includes(term)) {
      return { matched: false, score: -Infinity, reason: `suppressed by noneOf "${term}"` };
    }
  }

  let score = 0;
  const reasons = [];

  // phrases: +6 each
  for (const phrase of compiled.phrases) {
    if (normalizedPrompt.includes(phrase)) {
      score += 6;
      reasons.push(`phrase "${phrase}" +6`);
    }
  }

  // allOf: +4 per fully-matching group
  for (const group of compiled.allOf) {
    if (group.every((term) => normalizedPrompt.includes(term))) {
      score += 4;
      reasons.push(`allOf [${group.join(", ")}] +4`);
    }
  }

  // anyOf: +1 each, capped at +2
  let anyOfScore = 0;
  for (const term of compiled.anyOf) {
    if (normalizedPrompt.includes(term)) {
      anyOfScore += 1;
      if (anyOfScore <= 2) reasons.push(`anyOf "${term}" +1`);
    }
  }
  score += Math.min(anyOfScore, 2);

  const matched = score >= compiled.minScore;
  if (!matched) {
    const detail = reasons.length > 0 ? ` (${reasons.join("; ")})` : "";
    return { matched: false, score, reason: `below threshold: ${score} < ${compiled.minScore}${detail}` };
  }

  return { matched: true, score, reason: reasons.join("; ") };
}
