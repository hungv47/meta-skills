// checks-heuristic.mjs — the 13 tier:'heuristic' rule implementations + the platform CAP table
// (FOR-51 / S2).
//
// Pure functions over the parsed ArtifactModel. Each metric formula is PINNED here (buried-lede
// index, hedge density, sentence-length burstiness, anaphora run-length, rule-of-three triads,
// symmetric-list shape, wall-of-text counts, reading-grade band, caveat count) so the rule is
// falsifiable and the golden corpus can be scored against it. Whole-file metrics emit line:0 (the
// report still localizes via region + snippet). Channel/register-gated rules NO-OP when the axis is
// unknown — protecting precision (a miss is cheaper than a confident false block, §2.1).
//
// CAP_TABLE is the hardcoded per-platform char-cap source (no x/tiktok pack exists yet; S8 can
// later source it from a pack's 'Truncation point' / 'Hard cap' rows). Imported by checks-regex
// for mkt-struct-headline-overflow.

import { finding } from '../finding.mjs';
import { applyIntent } from '../registry/intent.mjs';

export const CAP_TABLE = {
  x: { hard: 280 },
  twitter: { hard: 280 },
  linkedin: { fold: 210, foldMobile: 140, hard: 3000 },
  tiktok: { fold: 70, hard: 150 },
  reels: { fold: 70, hard: 150 },
  shorts: { fold: 70, hard: 150 },
};

// per-channel Flesch-Kincaid grade band [min,max] (mkt-voice-reading-grade-mismatch)
const GRADE_BAND = {
  tiktok: [3, 7], reels: [3, 7], shorts: [3, 7],
  x: [4, 8], linkedin: [7, 11], landing: [7, 11],
};
const SHORTFORM = new Set(['x', 'tiktok', 'reels', 'shorts', 'linkedin', 'instagram', 'facebook']);

function mk(id, ctx, snippet, line, evidence, sev) {
  const f = finding(id, ctx.file, snippet, line, evidence);
  if (sev) f.severity = sev;
  return f;
}
const words = (s) => s.split(/\s+/).filter(Boolean);
const wc = (s) => words(s).length;
// prose sentences only (skip list rows + exempt spans)
const prose = (a, ctx) => a.sentences.filter((s) => s.region !== 'list' && !ctx.fpGuards.isExempt(s.startLine));

function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  const groups = w.match(/[aeiouy]+/g);
  let n = groups ? groups.length : 1;
  if (w.length > 2 && w.endsWith('e')) n--; // silent e
  return Math.max(1, n);
}

const CONCRETE_VERB = /\b(cut|ship|save|saved|double|doubled|launch|launched|close|closed|win|won|grow|grew|reduce|reduced|boost|boosted|automate|replace|replaced|shipped|increase|increased|drop|dropped)\b/i;
const BUYER_NOUN = /\b(revenue|churn|conversion|deploy|deployment|onboarding|retention|pipeline|close rate|sign-?ups?|customers?|users?)\b/i;
const HEDGES = ['might', 'may', 'could', 'potentially', 'possibly', 'somewhat', 'perhaps', 'arguably', 'generally', 'often', 'just', 'quite', 'fairly', 'in some cases'];

export const HEURISTIC_CHECKS = {
  // metric: index of FIRST sentence containing a number / mid-sentence Cap token / concrete verb /
  // buyer-side noun. flag if index >= 2 (>=2 scene-setting sentences precede). evidence localizes.
  'mkt-hook-buried-lede': (a, _r, ctx) => {
    const ss = prose(a, ctx).filter((s) => s.region === 'hook' || s.region === 'headline' || s.region === 'body').slice(0, 8);
    if (ss.length < 3) return [];
    let idx = -1;
    for (let i = 0; i < ss.length; i++) {
      const t = ss[i].text;
      const specific = /\d/.test(t) || CONCRETE_VERB.test(t) || BUYER_NOUN.test(t) ||
        /[a-z,;:]\s[A-Z][a-zA-Z]{2,}/.test(t); // mid-sentence proper noun
      if (specific) { idx = i; break; }
    }
    if (idx >= 2) {
      return [mk('mkt-hook-buried-lede', ctx, ss[idx].text.slice(0, 70), ss[idx].startLine, `first specific claim at sentence ${idx + 1}; cut sentences 1..${idx}`)];
    }
    return [];
  },

  // metric: coordinate triad — three short (<=2-word) comma items closed by 'and'/period. nit.
  'mkt-slop-rule-of-three': (a, _r, ctx) => {
    const out = [];
    const re = /\b([A-Za-z]+(?:\s[A-Za-z]+)?), ([A-Za-z]+(?:\s[A-Za-z]+)?),? and ([A-Za-z]+(?:\s[A-Za-z]+)?)\b/;
    const head = /^([A-Za-z]+), ([A-Za-z]+),? (and )?([A-Za-z]+)[.!]?$/; // "Faster, simpler, smarter."
    let count = 0; let first = 0; let snip = '';
    for (const s of prose(a, ctx)) {
      const m = s.text.match(re) || s.text.match(head);
      if (m) { count++; if (!first) { first = s.startLine; snip = m[0].slice(0, 60); } }
    }
    if (count >= 1) return [mk('mkt-slop-rule-of-three', ctx, snip, first, `${count} coordinate triad${count > 1 ? 's' : ''} (forced rule-of-three cadence)`)];
    return [];
  },

  // metric: same first 1-2 tokens repeating >=3 consecutive sentences/lines. nit.
  'mkt-slop-anaphora-cascade': (a, _r, ctx) => {
    const ss = prose(a, ctx);
    const key = (t) => t.trim().split(/\s+/).slice(0, 2).join(' ').toLowerCase().replace(/[^a-z' ]/g, '');
    let run = 1, best = 1, startIdx = 0, bestStart = 0;
    for (let i = 1; i < ss.length; i++) {
      if (key(ss[i].text) && key(ss[i].text) === key(ss[i - 1].text)) {
        run++; if (run > best) { best = run; bestStart = startIdx; }
      } else { run = 1; startIdx = i; }
    }
    if (best >= 3) {
      const opener = key(ss[bestStart].text);
      return [mk('mkt-slop-anaphora-cascade', ctx, ss[bestStart].text.slice(0, 50), ss[bestStart].startLine, `same opener "${opener}" repeats ${best} consecutive sentences`)];
    }
    return [];
  },

  // metric: distinct primary action verbs at CTA-line start or after a connector, across cta region. >1 = block.
  'mkt-cta-multiple-competing': (a, _r, ctx) => {
    if (!a.regions.cta.length) return [];
    const VERBS = ['try', 'buy', 'book', 'download', 'subscribe', 'demo', 'share', 'start', 'get', 'join', 'upgrade', 'register', 'order'];
    const found = new Set(); let line = 0;
    for (const c of a.regions.cta) {
      if (ctx.fpGuards.isExempt(c.startLine)) continue;
      const segs = c.text.split(/\s*(?:also|and|then|&|→|>|\+|;)\s*/i);
      for (const seg of segs) {
        const first = seg.trim().toLowerCase().match(/^\**\[?([a-z]+(?:\s?up)?)/);
        if (first) {
          const v = first[1].replace(/\s/g, '');
          const norm = v === 'signup' ? 'sign up' : v;
          if (VERBS.includes(norm)) { found.add(norm); if (!line) line = c.startLine; }
        }
      }
    }
    if (found.size > 1) {
      const ov = applyIntent('mkt-cta-multiple-competing', ctx.intent);
      return [mk('mkt-cta-multiple-competing', ctx, [...found].join(' / '), line, `${found.size} competing primary CTAs: ${[...found].join(', ')}`, ov?.severity)];
    }
    return [];
  },

  // metric (cross-artifact): ad CTA verb vs landing-page CTA verb mismatch (frontmatter ad/lp ctas). warn.
  'mkt-cta-bait-and-switch': (a, _r, ctx) => {
    const adCta = a.frontmatter.cta || a.frontmatter.ad_cta;
    const lpCta = a.frontmatter.landing_cta || a.frontmatter.lp_cta;
    if (!adCta || !lpCta) return [];
    const verb = (s) => String(s).trim().toLowerCase().match(/^[a-z]+/)?.[0] || '';
    if (verb(adCta) && verb(lpCta) && verb(adCta) !== verb(lpCta)) {
      return [mk('mkt-cta-bait-and-switch', ctx, `${adCta} → ${lpCta}`, 0, `ad CTA "${verb(adCta)}" ≠ landing CTA "${verb(lpCta)}" — broken click-through promise`)];
    }
    return [];
  },

  // metric: hedge tokens per sentence from the fixed list. >=2 in one sentence = warn.
  'mkt-voice-hedge-stack': (a, _r, ctx) => {
    const out = [];
    for (const s of prose(a, ctx)) {
      const lc = ' ' + s.text.toLowerCase() + ' ';
      const hits = HEDGES.filter((h) => lc.includes(` ${h} `) || lc.includes(`${h},`) || lc.includes(`${h}.`));
      if (hits.length >= 2) out.push(mk('mkt-voice-hedge-stack', ctx, s.text.slice(0, 70), s.startLine, `${hits.length} hedges in one sentence: ${hits.join(', ')}`));
    }
    return out;
  },

  // metric: first clause of body opens with We/Our/I and no 'you/your' present. warn.
  'mkt-voice-sender-first': (a, _r, ctx) => {
    const ss = prose(a, ctx).filter((s) => s.region === 'hook' || s.region === 'body');
    if (!ss.length) return [];
    const first = ss[0];
    const head = first.text.slice(0, 40);
    if (/^\s*(we|our|i'?m|i)\b/i.test(first.text) && !/\byou(r)?\b/i.test(first.text)) {
      return [mk('mkt-voice-sender-first', ctx, head, first.startLine, 'opens sender-first (We/Our/I) with no you/prospect noun; re-front with the reader')];
    }
    return [];
  },

  // metric: Flesch-Kincaid grade vs per-channel band; >2 grades outside the band = nit. channel-gated.
  'mkt-voice-reading-grade-mismatch': (a, _r, ctx) => {
    const band = GRADE_BAND[ctx.channel] || (String(ctx.register || '').toLowerCase() === 'landing' ? GRADE_BAND.landing : null);
    if (!band) return [];
    const ss = prose(a, ctx);
    if (ss.length < 2) return [];
    const allWords = ss.flatMap((s) => words(s.text));
    const syl = allWords.reduce((n, w) => n + syllables(w), 0);
    const grade = 0.39 * (allWords.length / ss.length) + 11.8 * (syl / allWords.length) - 15.59;
    const g = Math.round(grade * 10) / 10;
    if (g > band[1] + 2) return [mk('mkt-voice-reading-grade-mismatch', ctx, '', ss[0].startLine, `reading grade ${g} vs ${ctx.channel || 'landing'} band ${band[0]}–${band[1]} (too complex)`)];
    // "too simple" only flags on professional/high-band surfaces (baby-talk on an enterprise page);
    // on short-form channels punchy low-grade copy is the goal, so a low grade is NOT a tell.
    if (band[0] >= 7 && g < band[0] - 2) return [mk('mkt-voice-reading-grade-mismatch', ctx, '', ss[0].startLine, `reading grade ${g} vs ${ctx.channel || 'landing'} band ${band[0]}–${band[1]} (too simple for this surface)`)];
    return [];
  },

  // metric: a prose block with >=8 sentences OR >300 chars (single paragraph). ad/social-scoped; editorial exempt.
  'mkt-struct-wall-of-text': (a, _r, ctx) => {
    const reg = String(ctx.register || '').toLowerCase();
    if (reg === 'editorial' || reg === 'long-form') return [];
    const scoped = SHORTFORM.has(ctx.channel) || reg === 'ad' || reg === 'social';
    if (!scoped) return [];
    const out = [];
    const ov = applyIntent('mkt-struct-wall-of-text', ctx.intent);
    for (const b of a.regions.body) {
      if (ctx.fpGuards.isExempt(b.startLine)) continue;
      const sentCount = (b.text.match(/[.!?]+(\s|$)/g) || []).length || 1;
      const chars = b.text.replace(/\n/g, ' ').length;
      if (sentCount >= 8 || chars > 300) {
        out.push(mk('mkt-struct-wall-of-text', ctx, b.text.slice(0, 60) + '…', b.startLine, `paragraph block: ${sentCount} sentences / ${chars} chars, no break`, ov?.severity));
      }
    }
    return out;
  },

  // metric: avg sentence >20 words AND a 200+ char unbroken span, OR SEO connectives. short-form-scoped. warn.
  'mkt-struct-no-scannability': (a, _r, ctx) => {
    if (!SHORTFORM.has(ctx.channel) && String(ctx.register || '').toLowerCase() !== 'social') return [];
    const ss = prose(a, ctx);
    if (!ss.length) return [];
    const avg = ss.reduce((n, s) => n + wc(s.text), 0) / ss.length;
    const longestRun = Math.max(0, ...a.regions.body.map((b) => b.text.replace(/\n/g, ' ').length));
    const seo = /\b(in conclusion|to summarize|furthermore|it is worth noting|moreover|in summary)\b/i.test(a.body);
    if ((avg > 20 && longestRun > 200) || seo) {
      const ev = seo ? 'SEO-essay connectives in short-form copy' : `avg sentence ${avg.toFixed(1)} words, ${longestRun}-char unbroken span`;
      return [mk('mkt-struct-no-scannability', ctx, '', ss[0].startLine, ev)];
    }
    return [];
  },

  // metric: 4+ consecutive sentences whose word counts span <=2 (metronomic rhythm). nit.
  'mkt-struct-monotone-cadence': (a, _r, ctx) => {
    const ss = prose(a, ctx);
    if (ss.length < 4) return [];
    const counts = ss.map((s) => wc(s.text));
    for (let i = 0; i + 3 < counts.length; i++) {
      const win = counts.slice(i, i + 4);
      if (Math.max(...win) - Math.min(...win) <= 2) {
        return [mk('mkt-struct-monotone-cadence', ctx, ss[i].text.slice(0, 50), ss[i].startLine, `4 consecutive sentences all ${Math.min(...win)}–${Math.max(...win)} words (metronomic cadence)`)];
      }
    }
    return [];
  },

  // metric: list with >=3 items sharing the '**Label:** explanation' shape. nit.
  'mkt-struct-symmetric-list': (a, _r, ctx) => {
    for (const block of a.regions.list) {
      const rows = block.text.split('\n').filter((l) => /^\s{0,3}([-*+]|\d+[.)])\s+/.test(l));
      const labeled = rows.filter((l) => /^\s{0,3}([-*+]|\d+[.)])\s+\*\*[^*]+:?\*\*:?\s+\S/.test(l) || /^\s{0,3}([-*+]|\d+[.)])\s+[A-Z][A-Za-z ]+:\s+\S/.test(l));
      if (labeled.length >= 3) {
        return [mk('mkt-struct-symmetric-list', ctx, labeled[0].trim().slice(0, 50), block.startLine, `${labeled.length} list items share the "Bold Label: explanation" shape`)];
      }
    }
    return [];
  },

  // metric: >=2 stacked disclaimer/qualifier sentences in the closing region. warn. register:legal exempt.
  'mkt-persuasion-caveat-avalanche': (a, _r, ctx) => {
    if (String(ctx.register || '').toLowerCase() === 'legal') return [];
    const re = /(results? may vary|every (situation|case) is (unique|different)|consult (a|your) (professional|attorney|advisor|doctor)|this is not (financial|legal|tax|medical|investment)? ?advice|depending on your (circumstances|situation)|individual results (may )?vary|no guarantee)/i;
    // bypass the exempt mask on purpose: caveat-avalanche is the rule that inspects caveats.
    const region = a.regions.closing;
    const scope = region ? a.sentences.filter((s) => s.startLine >= region.startLine && s.startLine <= region.endLine) : a.sentences;
    const hits = scope.filter((s) => re.test(s.text));
    if (hits.length >= 2) return [mk('mkt-persuasion-caveat-avalanche', ctx, hits[0].text.slice(0, 50), hits[0].startLine, `${hits.length} stacked caveats at the decision point`)];
    return [];
  },
};
