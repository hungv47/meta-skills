// suggestions.ts — the pure finding→card mapper for the forsvn-preview suggestion
// surface (FOR-53 / S4). Turns deterministic slop findings into the card shape
// chrome.js attachSuggestions() already consumes — { author?, at?, old, new, note?,
// staged?, ruleId? } — pre-staging ONLY a tiny allowlist of mechanically meaning-
// preserving fixes and rendering everything else as a non-accept "consider" note.
//
// THE FALSE-POSITIVE MOAT LIVES HERE (D-26). A pre-staged card is a one-click
// CONVENIENCE, not an auto-fix: Accept routes through POST /edit and leaves the
// artifact decision_state: pending (Accept != approve). A staged old→new may NEVER
// weaken a claim / number / entity / CTA (the Post-Humanize Regression Check), so the
// only edits that earn a card are a fixed context-free punctuation swap (clause-glue
// em-dash → comma) and a pure deletion of a scene-setting opener that is its own
// sentence. When in doubt → note-only.
//
// PURE: no I/O, no Date, no randomness — golden-tested. Output order is deterministic.
//
// CONTRACT NOTE (reconciled against the real S2 engine, forsvn-slop/finding.mjs):
// the scanner's finding is FLAT and AGGREGATE — { antipattern, name, severity, tier:
// 'regex'|'heuristic'|'llm', line, snippet, evidence, fixSkill }. It carries NO exact
// match span and NO char offset, and the em-dash finding reports a whole-artifact
// count with a single trimmed sample line. So a STAGED card cannot be derived from the
// finding alone — the mapper RE-LOCATES the fixable spans in the live `body` itself
// (the same bytes chrome.js Accept does body.indexOf(old) against), which makes
// "card.old is present and uniquely locatable in the body" true by construction.

/** The flat finding shape emitted by forsvn-slop/finding.mjs (the real S2 contract). */
export interface Finding {
  antipattern: string;                     // the mkt-* rule id (== finding identity)
  name: string;
  whyBad?: string;
  severity: "block" | "warn" | "nit";
  tier: "regex" | "heuristic" | "llm";
  file?: string;
  line: number;                            // 1-based; 0 if whole-file
  snippet: string;                         // an offending span of copy (trimmed, may be sliced)
  evidence?: string;                       // measured evidence ('em-dash count: 3')
  fixSkill?: string;
}

/** The card chrome.js attachSuggestions() consumes. `old`/`new` MUST be strings or the
 *  browser skips the card (chrome.js :407). A NOTE-ONLY card sets staged:false and
 *  new===old (so the gate passes); chrome.js branches on staged===false to drop the
 *  Accept button + del/ins and render only the note. `at` is intentionally omitted —
 *  stamping it would make this mapper non-deterministic; the card header tolerates it. */
export interface Suggestion {
  author?: string;
  at?: string;
  old: string;
  new: string;
  note?: string;
  staged?: boolean;
  ruleId?: string;
}

// EXACTLY two rules earn a one-click card — the only ones whose fix is mechanically
// meaning-preserving. Everything else (hype-verb, not-just-x, weak-cta, …) is note-only
// because its fix needs context = human-owned.
export const PRE_STAGEABLE: ReadonlySet<string> = new Set([
  "mkt-slop-em-dash-overuse",
  "mkt-slop-throat-clearing",
]);

const AUTHOR = "forsvn-slop";
const MAX_CARDS = 12;
const SEV_ORDER: Record<string, number> = { block: 0, warn: 1, nit: 2 };

// The two clause-glue cores we will swap for a comma. BOTH carry flanking spaces, so the
// swap touches exactly three characters and never a content token. A tight em-dash
// (word—word, no spaces) and an en-dash are deliberately NOT staged (note-only): adding
// or removing a space is a judgment call, not a mechanical swap.
const EM_CORE = " — "; // space EM-DASH (U+2014) space
const HY_CORE = " - ";      // space HYPHEN space (the scanner's ' - ' clause-glue variant)

/**
 * Map a scan's findings to suggestion cards. PURE.
 * @param findings the deterministic findings (tier 'regex'|'heuristic'; 'llm' is dropped)
 * @param body     the artifact BODY (frontmatter stripped) — the bytes cards locate against
 */
export function findingsToSuggestions(findings: Finding[], body: string): Suggestion[] {
  const staged: Suggestion[] = [];
  const notes: Array<Suggestion & { _sev: number; _line: number }> = [];

  // Which pre-stageable rules fired (the scanner already applied register / channel /
  // exempt-span / provider / waiver gating — we TRUST that and only act when it fired).
  let emDashFinding: Finding | undefined;
  let throatFinding: Finding | undefined;
  const noteFindings: Finding[] = [];

  for (const f of findings) {
    if (f.tier === "llm") continue;                 // S6 owns these — no card, no note
    if (!PRE_STAGEABLE.has(f.antipattern)) { noteFindings.push(f); continue; }
    // A pre-stageable rule routes to its bespoke deriver; one without a deriver yet
    // falls through to note-only (safe default), never a blind stage.
    if (f.antipattern === "mkt-slop-em-dash-overuse") emDashFinding = emDashFinding ?? f;
    else if (f.antipattern === "mkt-slop-throat-clearing") throatFinding = throatFinding ?? f;
    else noteFindings.push(f);
  }

  // Pre-stage em-dash: one card per safe, uniquely-locatable clause-glue site.
  if (emDashFinding) {
    const cards = deriveEmDashCards(body, emDashFinding);
    if (cards.length) staged.push(...cards);
    else notes.push(noteCard(emDashFinding));        // fired, but nothing safe to stage
  }

  // Pre-stage throat-clearing: a pure deletion, only when the opener is its own sentence.
  if (throatFinding) {
    const card = deriveThroatClearingCard(body, throatFinding);
    if (card) staged.push(card);
    else notes.push(noteCard(throatFinding));
  }

  for (const f of noteFindings) notes.push(noteCard(f));

  // Dedupe notes by (ruleId, note); engine already deduped findings, this is belt-and-braces.
  const seen = new Set<string>();
  const dedupedNotes = notes.filter((n) => {
    const k = `${n.ruleId}\u0000${n.note}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  // Severity then line, for a stable, meaningful note order.
  dedupedNotes.sort((a, b) => a._sev - b._sev || a._line - b._line);

  const ordered: Suggestion[] = [
    ...staged,
    ...dedupedNotes.map(({ _sev, _line, ...card }) => card),
  ];
  // Cap: staged-first survives the slice; the rest belong to the audit / on-save surface.
  return ordered.slice(0, MAX_CARDS);
}

function noteCard(f: Finding): Suggestion & { _sev: number; _line: number } {
  const why = f.evidence && f.evidence.trim() ? f.evidence.trim() : f.snippet;
  return {
    author: AUTHOR,
    old: f.snippet,
    new: f.snippet,           // new === old so chrome.js renders; staged:false hides the diff
    note: `${f.name} — ${why}`,
    staged: false,
    ruleId: f.antipattern,
    _sev: SEV_ORDER[f.severity] ?? 1,
    _line: f.line || Number.MAX_SAFE_INTEGER,
  };
}

// ── em-dash → comma ─────────────────────────────────────────────────────────────────
// Find each clause-glue site in the body, skip the unsafe ones, and emit one card per
// site with a context-extended `old` that is unique in the body.
function deriveEmDashCards(body: string, finding: Finding): Suggestion[] {
  const protectedRanges = computeProtectedRanges(body);
  const out: Suggestion[] = [];
  const seenOld = new Set<string>();

  for (const core of [EM_CORE, HY_CORE]) {
    let from = 0;
    for (;;) {
      const idx = body.indexOf(core, from);
      if (idx === -1) break;
      from = idx + core.length;
      const coreEnd = idx + core.length;
      if (isProtected(protectedRanges, idx, coreEnd)) continue;

      const before = body[idx - 1];
      const after = body[coreEnd];
      // Adjacency guard: never create doubled punctuation, and never touch a numeric
      // range ("9 - 5", "$10 - $20") whose comma-swap would change meaning.
      if (before === undefined || after === undefined) continue;
      if (!/[\p{L}\p{N}%$)\]'"]/u.test(before)) continue;
      if (!/[\p{L}\p{N}$([{'"]/u.test(after)) continue;
      if (/[0-9]/.test(before) && /[0-9]/.test(after)) continue;

      const span = uniqueSpan(body, idx, coreEnd);
      if (!span) continue;                          // could not make it uniquely locatable
      const oldText = body.slice(span.start, span.end);
      if (seenOld.has(oldText)) continue;
      seenOld.add(oldText);
      const newText =
        body.slice(span.start, idx) + ", " + body.slice(coreEnd, span.end);

      out.push({
        author: AUTHOR,
        old: oldText,
        new: newText,
        note: noteFor(finding, "em-dash used as clause glue — a comma reads cleaner"),
        staged: true,
        ruleId: finding.antipattern,
      });
      if (out.length >= MAX_CARDS) return out;
    }
  }
  return out;
}

// Extend a [coreStart, coreEnd) glue span outward by whole words until the resulting
// slice occurs exactly once in the body. Returns null if it cannot be made unique within
// a small word budget (then the site falls back to note-only via the aggregate finding).
function uniqueSpan(
  body: string,
  coreStart: number,
  coreEnd: number,
): { start: number; end: number } | null {
  let start = coreStart;
  let end = coreEnd;
  for (let i = 0; i < 4; i++) {
    start = extendWordLeft(body, start);
    end = extendWordRight(body, end);
    const slice = body.slice(start, end);
    if (body.indexOf(slice) === body.lastIndexOf(slice)) return { start, end };
  }
  return null;
}

function extendWordLeft(body: string, start: number): number {
  let i = start;
  while (i > 0 && /\s/.test(body[i - 1])) i--;        // skip whitespace
  while (i > 0 && !/\s/.test(body[i - 1])) i--;        // consume the word
  return i;
}
function extendWordRight(body: string, end: number): number {
  let i = end;
  while (i < body.length && /\s/.test(body[i])) i++;
  while (i < body.length && !/\s/.test(body[i])) i++;
  return i;
}

// ── throat-clearing → deletion ──────────────────────────────────────────────────────
// The scanner's opener regex, applied to the first non-empty body line (heading/list
// markers stripped). We stage a deletion ONLY when the matched scene-setting phrase is
// IMMEDIATELY followed by sentence-ending punctuation + a capitalized real sentence —
// i.e. the opener is its own throwaway sentence. A comma-spliced opener (the common
// case) is note-only, because deleting to the next period would destroy real content.
const THROAT_RE =
  /^(in (today'?s|an? (increasingly|ever-)|the (competitive|modern|current)|this (rapidly|fast))[^.]{0,40}(world|landscape|environment|economy|market|era|age)|as the world becomes more|when it comes to)/i;
const MARKER_RE = /^(\s*(?:#{1,6}|[-*+]|>)\s+)/;

function deriveThroatClearingCard(body: string, finding: Finding): Suggestion | null {
  // first non-empty line + its absolute start offset
  let lineStart = 0;
  let line = "";
  let found = false;
  for (let i = 0; i <= body.length; i++) {
    if (i === body.length || body[i] === "\n") {
      const candidate = body.slice(lineStart, i);
      if (candidate.trim()) { line = candidate; found = true; break; }
      lineStart = i + 1;
    }
  }
  if (!found) return null;

  const marker = MARKER_RE.exec(line);
  const prefixLen = marker ? marker[1].length : (line.length - line.trimStart().length);
  const phraseStart = lineStart + prefixLen;
  const rest = body.slice(phraseStart);
  const m = THROAT_RE.exec(rest);
  if (!m) return null;

  const phraseEnd = phraseStart + m[0].length;
  // What immediately follows the scene-setting phrase must be sentence-ending punctuation,
  // then whitespace, then an uppercase letter — proving the opener is its own sentence.
  const tail = body.slice(phraseEnd);
  const close = /^([.!?]+)(\s+)([A-Z])/.exec(tail);
  if (!close) return null;

  const oldEnd = phraseEnd + close[1].length + close[2].length; // include the trailing space
  const oldText = body.slice(phraseStart, oldEnd);
  if (body.indexOf(oldText) !== body.lastIndexOf(oldText)) return null; // must be unique

  return {
    author: AUTHOR,
    old: oldText,
    new: "",                                    // pure deletion; the next sentence stands alone
    note: noteFor(finding, "scene-setting opener — delete it and lead with the real first sentence"),
    staged: true,
    ruleId: finding.antipattern,
  };
}

function noteFor(finding: Finding, fallback: string): string {
  return finding.evidence && finding.evidence.trim() ? finding.evidence.trim() : fallback;
}

// ── protected spans (belt-and-suspenders FP guard) ───────────────────────────────────
// The scanner already exempts code/quote/legal spans; the mapper re-guards markdown
// blockquotes, fenced code, and inline code because a wrong MECHANICAL edit there is the
// worst false positive. Offsets are exact and line-ending agnostic (\r stays inside the
// line). Returns absolute [start, end) ranges that a staged span may not overlap.
function computeProtectedRanges(body: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  let lineStart = 0;
  let inFence = false;
  for (let i = 0; i <= body.length; i++) {
    if (i === body.length || body[i] === "\n") {
      const line = body.slice(lineStart, i);
      const isFence = /^\s*(```|~~~)/.test(line);
      if (isFence) {
        ranges.push([lineStart, i]);
        inFence = !inFence;
      } else if (inFence || /^\s*>/.test(line)) {
        ranges.push([lineStart, i]);
      } else {
        // inline code spans within the line
        const re = /`+[^`]*`+/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(line)) !== null) {
          ranges.push([lineStart + m.index, lineStart + m.index + m[0].length]);
        }
      }
      lineStart = i + 1;
    }
  }
  return ranges;
}

function isProtected(ranges: Array<[number, number]>, start: number, end: number): boolean {
  return ranges.some(([s, e]) => start < e && end > s);
}
