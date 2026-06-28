// parse.mjs — the artifact parser for the deterministic slop scanner (FOR-51 / S2).
//
// Pure + node-importable (no Bun/process). Turns a marketing-copy Markdown file into the
// ArtifactModel the checks run over: frontmatter (scalars + inline arrays), absolute-in-file
// line numbers, region segmentation (hook/headline/body/cta/list/closing), a sentence/line
// tokenizer with abbreviation/decimal/URL guards, and the exempt-span mask (fenced/inline
// code, blockquote/testimonial, legal/disclaimer) the FP moat reads. (brief FOR-51 §parse.)
//
// Frontmatter regex is the EXACT one from bin/validate-packs.ts so line accounting matches the
// rest of the stack. All Span line numbers are absolute (offset past the frontmatter).

// The validate-packs.ts frontmatter regex, verbatim.
const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;

// Sentence-final abbreviations that must NOT end a sentence even when followed by a space.
const ABBREV = new Set([
  'e.g', 'i.e', 'eg', 'ie', 'vs', 'etc', 'inc', 'co', 'corp', 'ltd', 'mr', 'mrs',
  'ms', 'dr', 'prof', 'sr', 'jr', 'st', 'no', 'vol', 'fig', 'al', 'approx', 'dept',
]);

/** Parse a minimal frontmatter block: `key: value` scalars + inline `[a, b]` arrays. */
function parseFrontmatter(fm) {
  const out = {};
  for (const raw of fm.split('\n')) {
    const m = raw.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      out[key] = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      out[key] = val.replace(/^["']|["']$/g, '');
    }
  }
  return out;
}

/** Count of `\n` in `s` — the number of full lines before an offset. */
function countNewlines(s) {
  let n = 0;
  for (let i = 0; i < s.length; i++) if (s[i] === '\n') n++;
  return n;
}

/**
 * Split body text into sentences, returning {text,start,end} char offsets within `body`.
 * Guards: never split a '.' that sits between word chars (decimals 4.5, URLs example.com,
 * initials U.S.A), nor after a known abbreviation, nor unless the next non-space char is an
 * uppercase letter / quote / opener / end-of-text. '!' and '?' always close (outside words).
 */
function splitSentences(body) {
  const out = [];
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch !== '.' && ch !== '!' && ch !== '?') continue;
    const before = body[i - 1];
    const after = body[i + 1];
    const wordBefore = before && /\w/.test(before);
    const wordAfter = after && /\w/.test(after);
    if (ch === '.' && wordBefore && wordAfter) continue; // decimal / URL / initial
    // trailing run of .!? then closing quotes/brackets
    let j = i;
    while (j + 1 < body.length && /[.!?]/.test(body[j + 1])) j++;
    while (j + 1 < body.length && /["')\]]/.test(body[j + 1])) j++;
    // abbreviation guard (only for a lone '.')
    if (ch === '.' && body[i + 1] !== '.') {
      const tokenMatch = body.slice(start, i).match(/([A-Za-z.]+)$/);
      const token = tokenMatch ? tokenMatch[1].toLowerCase().replace(/^\.+|\.+$/g, '') : '';
      if (ABBREV.has(token)) continue;
    }
    const next = body.slice(j + 1).match(/^\s*(\S)/);
    const nextChar = next ? next[1] : '';
    const isBoundary =
      ch !== '.' || // ! and ? always close
      nextChar === '' ||
      /[A-Z"'(\[]/.test(nextChar);
    if (!isBoundary) continue;
    const raw = body.slice(start, j + 1);
    const text = raw.trim();
    // anchor the reported start on the first non-whitespace char so the line maps to the
    // sentence's real opening, not the previous sentence's trailing newline.
    if (text) out.push({ text, start: start + (raw.length - raw.trimStart().length), end: j + 1 });
    start = j + 1;
  }
  const rawTail = body.slice(start);
  const tail = rawTail.trim();
  if (tail) out.push({ text: tail, start: start + (rawTail.length - rawTail.trimStart().length), end: body.length });
  return out;
}

/** Build line-start char offsets for `body` so a char offset maps to a 1-based body line. */
function lineMapper(body) {
  const starts = [0];
  for (let i = 0; i < body.length; i++) if (body[i] === '\n') starts.push(i + 1);
  return (offset) => {
    // binary-search the last start <= offset
    let lo = 0, hi = starts.length - 1, ans = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (starts[mid] <= offset) { ans = mid; lo = mid + 1; } else hi = mid - 1;
    }
    return ans + 1; // 1-based body line
  };
}

const HEADING_RE = /^\s{0,3}(#{1,6})\s+(.*)$/;
const LIST_RE = /^\s{0,3}([-*+]|\d+[.)])\s+\S/;
const FENCE_RE = /^\s*(```|~~~)/;
const BLOCKQUOTE_RE = /^\s*>/;
const LEGAL_RE = /(results? may vary|not (financial|legal|tax|investment|medical) advice|consult (a|your) (professional|attorney|advisor|doctor)|terms (and conditions )?apply|past performance|©|all rights reserved)/i;

/**
 * Parse marketing copy into the ArtifactModel.
 * @param {string} text raw file contents
 * @returns {{
 *   frontmatter: Record<string,unknown>, fmLineCount: number,
 *   regions: {hook?:Span, headline?:Span, body:Span[], cta:Span[], list:Span[], closing?:Span},
 *   regionNames: string[],
 *   sentences: {text:string,startLine:number,endLine:number,region:string}[],
 *   lines: {text:string, n:number}[],
 *   exemptMask: (line:number)=>boolean,
 *   body: string, structured: boolean,
 * }} where Span = {text,startLine,endLine}
 */
export function parse(text) {
  const fmMatch = text.match(FRONTMATTER_RE);
  const frontmatter = fmMatch ? parseFrontmatter(fmMatch[1]) : {};
  const body = fmMatch ? fmMatch[2] : text;
  const fmLineCount = fmMatch ? countNewlines(text.slice(0, text.length - body.length)) : 0;

  const bodyLines = body.split('\n');
  const lines = bodyLines.map((t, i) => ({ text: t, n: fmLineCount + i + 1 }));
  const toAbs = (bodyLine1) => fmLineCount + bodyLine1; // body 1-based -> absolute
  const charToLine = lineMapper(body);

  // ── exempt-span mask: collect the set of absolute lines that are exempt ──
  const exempt = new Set();
  {
    let inFence = false;
    for (let i = 0; i < bodyLines.length; i++) {
      const abs = fmLineCount + i + 1;
      const ln = bodyLines[i];
      if (FENCE_RE.test(ln)) { exempt.add(abs); inFence = !inFence; continue; }
      if (inFence) { exempt.add(abs); continue; }
      if (BLOCKQUOTE_RE.test(ln)) exempt.add(abs); // blockquote / testimonial
    }
    // legal/disclaimer: a contiguous trailing region OR any line that is itself a disclaimer
    for (let i = 0; i < bodyLines.length; i++) {
      if (LEGAL_RE.test(bodyLines[i])) exempt.add(fmLineCount + i + 1);
    }
    // register:legal exempts the whole doc from slop scanning of prose
    if (String(frontmatter.register || '').toLowerCase() === 'legal') {
      for (let i = 0; i < bodyLines.length; i++) exempt.add(fmLineCount + i + 1);
    }
    // register:copy-analysis (write-copy artifacts): the doc is a copy *analysis*, not shippable
    // copy. Only `**Selected:** "..."` lines are the candidate copy that actually ships; every other
    // line (Pre-Writing, Rule:/Score: annotations, cut-alternatives, A/B notes, Why-this-works, the
    // verdict table) is analysis prose. Exempt all non-Selected lines so the marketing rules judge
    // ONLY what ships. write-copy/references/format-conventions.md owns the `**Selected:**` marker.
    if (String(frontmatter.register || '').toLowerCase() === 'copy-analysis') {
      const SELECTED_RE = /^\s*\*\*Selected:\*\*/;
      for (let i = 0; i < bodyLines.length; i++) {
        if (!SELECTED_RE.test(bodyLines[i])) exempt.add(fmLineCount + i + 1);
      }
    }
  }
  // inline-code backtick spans: mask only matters for whole-line regex; approximate by
  // exempting a line that is wholly inline code. (Fenced blocks already handled above.)
  const inlineCodeOnly = (ln) => /^\s*`[^`]+`\s*$/.test(ln);
  for (let i = 0; i < bodyLines.length; i++) {
    if (inlineCodeOnly(bodyLines[i])) exempt.add(fmLineCount + i + 1);
  }
  const exemptMask = (line) => exempt.has(line);

  // ── blocks: paragraphs split on blank lines, each {text,startLine,endLine,lines[]} ──
  const blocks = [];
  let cur = null;
  for (let i = 0; i < bodyLines.length; i++) {
    const abs = fmLineCount + i + 1;
    const ln = bodyLines[i];
    if (ln.trim() === '') { if (cur) { blocks.push(cur); cur = null; } continue; }
    if (!cur) cur = { startLine: abs, endLine: abs, lines: [] };
    cur.endLine = abs;
    cur.lines.push({ text: ln, n: abs });
  }
  if (cur) blocks.push(cur);
  const blockSpan = (b) => ({
    text: b.lines.map((l) => l.text).join('\n').trim(),
    startLine: b.startLine,
    endLine: b.endLine,
  });

  // ── regions ──
  const headingBlocks = blocks.filter((b) => HEADING_RE.test(b.lines[0].text));
  const listBlocks = blocks.filter((b) => b.lines.some((l) => LIST_RE.test(l.text)));
  const proseBlocks = blocks.filter(
    (b) => !HEADING_RE.test(b.lines[0].text) && !b.lines.some((l) => LIST_RE.test(l.text)),
  );

  let headline;
  if (frontmatter.headline || frontmatter.hook) {
    const key = frontmatter.headline ? 'headline' : 'hook';
    const fmLine = fmMatch ? findFmLine(text, key) : 0;
    headline = { text: String(frontmatter[key]), startLine: fmLine, endLine: fmLine };
  } else if (headingBlocks.length) {
    const h = headingBlocks[0];
    const m = h.lines[0].text.match(HEADING_RE);
    headline = { text: m[2].trim(), startLine: h.startLine, endLine: h.startLine };
  }

  let hook;
  if (proseBlocks.length) {
    const b = proseBlocks[0];
    hook = { text: b.lines[0].text.trim(), startLine: b.startLine, endLine: b.startLine };
  } else if (frontmatter.hook) {
    const fmLine = fmMatch ? findFmLine(text, 'hook') : 0;
    hook = { text: String(frontmatter.hook), startLine: fmLine, endLine: fmLine };
  }

  // CTA lines: short imperative-led lines, Markdown links/buttons, or `cta` frontmatter.
  const cta = [];
  const CTA_VERB = /^\s{0,3}(\**\[?)?(try|buy|book|start|get|download|sign\s?up|subscribe|join|claim|grab|shop|order|register|demo|share|learn more|click here|submit|continue|read more)\b/i;
  const MD_LINK = /\[[^\]]+\]\([^)]+\)/;
  for (const b of blocks) {
    for (const l of b.lines) {
      const t = l.text.trim();
      if (!t) continue;
      const short = t.length <= 60;
      if ((short && CTA_VERB.test(t)) || (short && MD_LINK.test(t))) {
        cta.push({ text: t, startLine: l.n, endLine: l.n });
      }
    }
  }
  if (frontmatter.cta) {
    const fmLine = fmMatch ? findFmLine(text, 'cta') : 0;
    cta.push({ text: String(frontmatter.cta), startLine: fmLine, endLine: fmLine });
  }

  // register:copy-analysis (write-copy artifacts): the shippable copy is the `**Selected:**` lines,
  // never the analysis prose or list blocks (the Pre-Writing block, the verdict table). Collect the
  // Selected units up front, then derive EVERY region from them so the region- and body-based rules
  // judge only what ships. Gated on the register; a normal artifact derives its regions from
  // prose/list blocks unchanged (selectedUnits stays empty).
  const isCopyAnalysis = String(frontmatter.register || '').toLowerCase() === 'copy-analysis';
  const SELECTED_LINE_RE = /^\s*\*\*Selected:\*\*\s*/;
  const stripSelected = (ln) =>
    ln.replace(SELECTED_LINE_RE, '').trim().replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').trim();
  const selectedUnits = [];
  if (isCopyAnalysis) {
    for (let i = 0; i < bodyLines.length; i++) {
      if (!SELECTED_LINE_RE.test(bodyLines[i])) continue;
      const copy = stripSelected(bodyLines[i]);
      if (copy) selectedUnits.push({ text: copy, startLine: fmLineCount + i + 1 });
    }
  }
  const selectedSpans = selectedUnits.map((u) => ({ text: u.text, startLine: u.startLine, endLine: u.startLine }));

  // regions. copy-analysis: first Selected = hero (headline), the rest = body, last = closing,
  // list = [] (lists are always analysis here). This points the body/closing region rules
  // (wall-of-text, no-scannability, caveat-avalanche) at the Selected copy — NOT a blanket clear,
  // which would drop the shippable copy out of `body` and turn those rules into false negatives.
  const closing = isCopyAnalysis
    ? selectedSpans[selectedSpans.length - 1]
    : (proseBlocks.length ? blockSpan(proseBlocks[proseBlocks.length - 1]) : undefined);
  const bodySpans = isCopyAnalysis ? selectedSpans.slice(1) : proseBlocks.map(blockSpan);
  const listSpans = isCopyAnalysis ? [] : listBlocks.map(blockSpan);
  const structured = blocks.length > 0 && (headingBlocks.length > 0 || blocks.length > 1);
  // returned body string: copy-analysis exposes only the Selected copy, so the a.body probes
  // (no-scannability's seo connectives, em-dash density denominator) measure what ships, not the
  // analysis prose. `body` (internal) stays full-doc for line mapping; only the returned value scopes.
  const bodyOut = isCopyAnalysis ? selectedUnits.map((u) => u.text).join('\n') : body;

  // register:copy-analysis — model the `**Selected:**` lines AS the shippable artifact. The exempt
  // mask already hides analysis prose from line-based rules; here we point the hero/cta REGIONS at
  // the Selected copy (the SENTENCE set is rebuilt below). Without this the sentence- and region-
  // based block rules (fabricated-precision, unfalsifiable-superlative, rhetorical-question,
  // throat-clearing, headline-overflow, cta-*) skip the very copy that ships: a `**Selected:**` line
  // is never a sentence START (the `**` prefix isn't a boundary char), so its copy gets absorbed
  // into a sentence that begins on an exempt analysis line and is dropped by isExempt(s.startLine).
  if (isCopyAnalysis) {
    const first = selectedUnits[0];
    headline = first ? { text: first.text, startLine: first.startLine, endLine: first.startLine } : undefined;
    hook = undefined; // the first Selected line is the single hero; no separate analysis hook
    cta.length = 0; // analysis CTAs (in cut-alternatives / the verdict table) don't ship
    for (const u of selectedUnits) {
      if (u.text.length <= 60 && (CTA_VERB.test(u.text) || MD_LINK.test(u.text))) {
        cta.push({ text: u.text, startLine: u.startLine, endLine: u.startLine });
      }
    }
  }

  // ── sentences with region tags ──
  let sentences = splitSentences(body).map((s) => {
    const startLine = toAbs(charToLine(s.start));
    const endLine = toAbs(charToLine(Math.max(s.start, s.end - 1)));
    return { text: s.text, startLine, endLine, region: regionOf(startLine) };
  });
  if (isCopyAnalysis) {
    // Rebuild the sentence set from the Selected copy alone, each anchored on its own (non-exempt)
    // Selected line so the sentence-based block rules judge it. First Selected = headline region.
    sentences = selectedUnits.flatMap((u, idx) =>
      splitSentences(u.text).map((s) => ({
        text: s.text, startLine: u.startLine, endLine: u.startLine,
        region: idx === 0 ? 'headline' : 'body',
      })),
    );
  }

  function regionOf(absLine) {
    if (headline && absLine === headline.startLine) return 'headline';
    if (hook && absLine === hook.startLine) return 'hook';
    if (closing && absLine >= closing.startLine && absLine <= closing.endLine) return 'closing';
    if (listSpans.some((s) => absLine >= s.startLine && absLine <= s.endLine)) return 'list';
    if (cta.some((s) => absLine === s.startLine)) return 'cta';
    return 'body';
  }

  const regionNames = [];
  if (hook) regionNames.push('hook');
  if (headline) regionNames.push('headline');
  if (bodySpans.length) regionNames.push('body');
  if (cta.length) regionNames.push('cta');
  if (listSpans.length) regionNames.push('list');
  if (closing) regionNames.push('closing');

  return {
    frontmatter,
    fmLineCount,
    regions: { hook, headline, body: bodySpans, cta, list: listSpans, closing },
    regionNames,
    sentences,
    lines,
    exemptMask,
    body: bodyOut,
    structured,
  };
}

/** Absolute line number of a `key:` in the original frontmatter (1-based), or 0. */
function findFmLine(text, key) {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (new RegExp(`^${key}:`).test(lines[i])) return i + 1;
  }
  return 0;
}

export { splitSentences, parseFrontmatter };
