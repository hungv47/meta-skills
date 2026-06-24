// fp-guards.mjs — the false-positive moat for the deterministic slop scanner (FOR-51 / S2).
//
// "A confident wrong flag costs far more than a miss" (slop-detector.md §2.1) — authority
// compounds slowly on correct calls and collapses on one confident wrong one. So the guards
// here are not polish, they ARE the feature: exempt-span suppression (code/quote/legal),
// >=N pattern-class thresholds, the forsvn-slop-disable inline-waiver grammar, and the
// frontmatter forsvn-slop-ignore key. The inline-directive grammar is ported verbatim from
// impeccable cli/engine/shared/inline-ignores.mjs (renamed forsvn-slop-*), so a waiver travels
// with the artifact when it leaves the repo (an exported/emailed standalone doc).

// ─── inline directive grammar (ported from impeccable, renamed) ───
//
//   forsvn-slop-disable <rule>[, <rule>...] [-- reason]   whole file
//   forsvn-slop-disable-line <rule>...      [-- reason]   the same line
//   forsvn-slop-disable-next-line <rule>... [-- reason]   the following line
//   forsvn-slop-disable                                   bare / `*` = every rule
//
// Comment-syntax-agnostic: the marker is matched as a raw token anywhere on a line, so it works
// in `<!-- -->` (Markdown), `//`, `#`, `{/* */}`. Trailing comment closers are stripped first.

const DIRECTIVE_RE = /forsvn-slop-(disable-next-line|disable-line|disable)\b[ \t]*([^\n\r]*)/gi;
const TRAILING_CLOSER_RE = /\s*(?:\*\/\}?|--+>|\*\}|#\}|%>|\}\})\s*$/;

function normalizeRule(token) {
  return String(token || '').trim().toLowerCase();
}

function parseRuleList(remainder) {
  let text = String(remainder || '').replace(TRAILING_CLOSER_RE, '').trim();
  const reasonSep = text.match(/\s*(?:--+|:)\s*/);
  if (reasonSep) text = text.slice(0, reasonSep.index);
  const tokens = text.split(/[\s,]+/).map(normalizeRule).filter(Boolean);
  if (tokens.length === 0 || tokens.includes('*')) return ['*'];
  return tokens;
}

function addRules(set, rules) { for (const r of rules) set.add(r); }
function getSet(map, key) { let s = map.get(key); if (!s) { s = new Set(); map.set(key, s); } return s; }

/** Parse every inline directive, keyed by the 1-based line each directive *targets*. */
export function parseInlineIgnores(content) {
  const result = { file: new Set(), line: new Map(), nextLine: new Map() };
  const text = typeof content === 'string' ? content : '';
  if (!/forsvn-slop-disable/i.test(text)) return result;
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    DIRECTIVE_RE.lastIndex = 0;
    let m;
    while ((m = DIRECTIVE_RE.exec(lines[i])) !== null) {
      const variant = m[1].toLowerCase();
      const rules = parseRuleList(m[2]);
      if (variant === 'disable') addRules(result.file, rules);
      else if (variant === 'disable-line') addRules(getSet(result.line, i + 1), rules);
      else addRules(getSet(result.nextLine, i + 2), rules); // disable-next-line on i+1 targets i+2
    }
  }
  return result;
}

function setMatches(set, rule) { return Boolean(set) && (set.has('*') || set.has(rule)); }

function isInlineIgnored(f, directives) {
  const rule = normalizeRule(f && f.antipattern);
  if (!rule) return false;
  if (setMatches(directives.file, rule)) return true;
  const line = Number(f && f.line) || 0;
  if (line > 0) {
    if (setMatches(directives.line.get(line), rule)) return true;
    if (setMatches(directives.nextLine.get(line), rule)) return true;
  }
  return false;
}

function hasDirectives(d) { return d.file.size > 0 || d.line.size > 0 || d.nextLine.size > 0; }

/**
 * Drop findings waived by (a) a `forsvn-slop-disable*` inline directive in the same raw text or
 * (b) a `forsvn-slop-ignore: [rule-id]` frontmatter key (whole-file, like a bare file directive).
 * `content` is the RAW file text so directive line keys line up with finding `line` values.
 */
export function applyInlineIgnores(findings, content, frontmatter = {}) {
  if (!Array.isArray(findings) || findings.length === 0) return findings;
  const directives = parseInlineIgnores(content);
  // frontmatter forsvn-slop-ignore: fold into the whole-file set
  const fmIgnore = frontmatter['forsvn-slop-ignore'];
  if (Array.isArray(fmIgnore)) addRules(directives.file, fmIgnore.map(normalizeRule));
  else if (typeof fmIgnore === 'string' && fmIgnore.trim()) addRules(directives.file, parseRuleList(fmIgnore));
  if (!hasDirectives(directives)) return findings;
  return findings.filter((f) => !isInlineIgnored(f, directives));
}

// ─── exempt-span + threshold helpers exposed on ctx.fpGuards ───

/** Build the per-scan guard helpers from the parsed artifact. */
export function makeFpGuards(artifact) {
  const { exemptMask } = artifact;
  return {
    exemptMask,
    /** True if an absolute line falls in an exempt span (code/quote/legal). */
    isExempt: (line) => line > 0 && exemptMask(line),
    /** Keep only matches whose line is NOT exempt. Each match = {line,...}. */
    dropExempt: (matches) => matches.filter((m) => !(Number(m.line) > 0 && exemptMask(m.line))),
  };
}

// ─── register / channel gating (two SEPARATE axes — never conflate) ───

// editorial relaxes the slop-strictness rules (em-dash, wall-of-text); legal is wholly exempt
// (handled in parse via exemptMask). Absent/unknown register => strict marketing default.
export function isEditorial(register) {
  return String(register || '').toLowerCase() === 'editorial';
}

const KNOWN_CHANNELS = new Set(['x', 'twitter', 'linkedin', 'tiktok', 'reels', 'shorts', 'instagram', 'facebook', 'youtube']);
export function normalizeChannel(channel) {
  const c = String(channel || '').toLowerCase().trim();
  if (c === 'twitter') return 'x';
  if (c === 'instagram-reels' || c === 'ig-reels') return 'reels';
  return c;
}
export function isKnownChannel(channel) {
  return KNOWN_CHANNELS.has(normalizeChannel(channel));
}
