// checks-regex.mjs — the 29 tier:'regex' rule implementations (FOR-51 / S2).
//
// One function per registry id, keyed in REGEX_CHECKS. Each pattern is sourced VERBATIM from
// that rule's `detection` string in registry/antipatterns.mjs (quoted in the header comment),
// run only over NON-exempt lines (code/quote/legal spans are skipped by the FP mask), and turned
// into a finding() with MEASURED evidence ('3 hype verbs: unlock, supercharge, elevate'), never a
// bare verdict. Severity defaults to the registry value; a few rules adjust it by register/channel
// (hype-verb nit↔warn, engagement-bait/all-caps/headline-overflow block↔warn) — the only place
// severity is computed, documented per rule. DETECT != FIX: these only report.

import { finding } from '../finding.mjs';
import { CAP_TABLE } from './checks-heuristic.mjs';

// finding() + optional severity override (channel/register-dynamic rules only).
function mk(id, ctx, snippet, line, evidence, sev) {
  const f = finding(id, ctx.file, snippet, line, evidence);
  if (sev) f.severity = sev;
  return f;
}

function* nonExemptLines(a, ctx) {
  for (const l of a.lines) {
    if (!l.text.trim()) continue;
    if (ctx.fpGuards.isExempt(l.n)) continue;
    yield l;
  }
}
const heroText = (a) => [a.regions.headline?.text, a.regions.hook?.text].filter(Boolean).join(' \n ');
const isHeroLine = (a, n) =>
  (a.regions.headline && n === a.regions.headline.startLine) ||
  (a.regions.hook && n === a.regions.hook.startLine);
const opener = (a) => a.regions.hook || a.regions.headline;
const inClosing = (a, n) => a.regions.closing && n >= a.regions.closing.startLine && n <= a.regions.closing.endLine;
// a "proof token" inside a clause: a digit, $/%, or a mid-sentence Capitalized proper noun
const hasProof = (s) => /\d/.test(s) || /[$%]/.test(s) || /\b[A-Z][a-zA-Z]{2,}/.test(s.replace(/^[^A-Za-z]*[A-Z]/, ''));
const properNounIn = (s) => /(?:^|[a-z,;:]\s)([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/.test(s);

const HYPE = ['unlock', 'leverage', 'supercharge', 'elevate', 'seamless', 'streamline', 'robust', 'world-class', 'best-in-class', 'cutting-edge', 'game-changer', 'transformative', 'revolutionize', 'harness', 'empower', 'delve', 'optimize', 'frictionless', 'next-level', 'holistic'];

export const REGEX_CHECKS = {
  // detection: /^(have you ever|did you know|in this (post|video|article)|...|here are \d+ (tips|ways|things|reasons)|...)/i on the opener
  'mkt-hook-generic-opener': (a, _r, ctx) => {
    const o = opener(a);
    if (!o) return [];
    const re = /^(have you ever|did you know|in this (post|video|article)|i'?m going to show you|today (i want to talk about|we'?ll)|here are \d+ (tips|ways|things|reasons)|\d+ (things|ways) (about|to)|looking for|are you tired of|curious about)/i;
    const m = o.text.match(re);
    return m ? [mk('mkt-hook-generic-opener', ctx, o.text.slice(0, 80), o.startLine, `anti-archetype opener: "${m[0]}"`)] : [];
  },

  // detection: an opener line ending in '?' matching the rhetorical family. block when literal first line of ad/hero.
  'mkt-hook-rhetorical-question': (a, _r, ctx) => {
    const o = opener(a);
    if (!o) return [];
    const t = o.text.trim();
    const re = /^(what if i told you|ever wondered|sound familiar|why\?|the best part\?|so what does this mean|but here'?s the question|want to know the secret|imagine if|curious)/i;
    if (re.test(t) || /\?$/.test(t)) {
      return [mk('mkt-hook-rhetorical-question', ctx, t.slice(0, 80), o.startLine, 'opener is a rhetorical question (performs curiosity instead of creating it)')];
    }
    return [];
  },

  // detection: word-boundary lexicon. 1 in body=nit; >=3 OR any in hero=warn. evidence lists matched terms+count.
  'mkt-slop-hype-verb': (a, _r, ctx) => {
    const hits = [];
    let heroHit = false, firstLine = 0;
    for (const l of nonExemptLines(a, ctx)) {
      for (const w of HYPE) {
        const re = new RegExp(`\\b${w.replace(/[-]/g, '[- ]')}\\b`, 'gi');
        if (re.test(l.text)) {
          hits.push(w);
          if (!firstLine) firstLine = l.n;
          if (isHeroLine(a, l.n)) heroHit = true;
        }
      }
    }
    if (hits.length === 0) return [];
    const uniq = [...new Set(hits)];
    const sev = hits.length >= 3 || heroHit ? 'warn' : 'nit';
    return [mk('mkt-slop-hype-verb', ctx, uniq.slice(0, 6).join(', '), firstLine, `${hits.length} hype verb${hits.length > 1 ? 's' : ''}: ${uniq.join(', ')}${heroHit ? ' (in hero)' : ''}`, sev)];
  },

  // detection: /it'?s not (just )?...it'?s.../ family. ANY instance = block.
  'mkt-slop-not-just-x': (a, _r, ctx) => {
    const out = [];
    const res = [
      /it'?s not (just )?(a |an |about )?[^.,;]{1,40}[,.;]\s*(it'?s |a |an )/i,
      /isn'?t the problem\.?\s+[^.]{1,30} is/i,
      /the answer isn'?t [^.]{1,30}\.?\s+it'?s/i,
      /stops being [^.]{1,30} and starts being/i,
      /not because [^.]{1,30}\.?\s+because/i,
    ];
    for (const l of nonExemptLines(a, ctx)) {
      for (const re of res) {
        const m = l.text.match(re);
        if (m) { out.push(mk('mkt-slop-not-just-x', ctx, m[0].slice(0, 80), l.n, 'negative-parallelism cadence ("not just X, it\'s Y")')); break; }
      }
    }
    return out;
  },

  // detection: count U+2014 + ' - ' clause glue. ad/social/hero: >=1=block. editorial: >=5/1000w=warn.
  'mkt-slop-em-dash-overuse': (a, _r, ctx) => {
    let count = 0, firstLine = 0, sample = '';
    for (const l of nonExemptLines(a, ctx)) {
      const m = l.text.match(/—|(?<=\S) - (?=\S)/g);
      if (m) { count += m.length; if (!firstLine) { firstLine = l.n; sample = l.text.trim().slice(0, 80); } }
    }
    if (count === 0) return [];
    const editorial = String(ctx.register || '').toLowerCase() === 'editorial';
    if (editorial) {
      const words = a.body.split(/\s+/).filter(Boolean).length || 1;
      const per1000 = (count / words) * 1000;
      if (per1000 < 5) return [];
      return [mk('mkt-slop-em-dash-overuse', ctx, sample, firstLine, `em-dash density: ${per1000.toFixed(1)}/1000w (editorial cap 5)`, 'warn')];
    }
    return [mk('mkt-slop-em-dash-overuse', ctx, sample, firstLine, `em-dash count: ${count} (marketing copy cap 0)`)];
  },

  // detection: /whether you'?re A or B/i. (the from-X-to-Y variant defers to the LLM tiebreak — not run here.)
  'mkt-slop-whether-youre': (a, _r, ctx) => {
    const out = [];
    for (const l of nonExemptLines(a, ctx)) {
      const m = l.text.match(/whether you'?re (an? |a )?[^.,;]{2,40} or (an? |a )?[^.,;]{2,40}/i);
      if (m) out.push(mk('mkt-slop-whether-youre', ctx, m[0].slice(0, 80), l.n, 'false-range "whether you\'re A or B" (addresses everyone, so no one)'));
    }
    return out;
  },

  // detection: opener filler /^(in (today'?s|...)...(world|landscape|...))/i + 'as the world becomes more','when it comes to'. block when first sentence.
  'mkt-slop-throat-clearing': (a, _r, ctx) => {
    const o = opener(a);
    if (!o) return [];
    const re = /^(in (today'?s|an? (increasingly|ever-)|the (competitive|modern|current)|this (rapidly|fast))[^.]{0,40}(world|landscape|environment|economy|market|era|age)|as the world becomes more|when it comes to)/i;
    const m = o.text.match(re);
    return m ? [mk('mkt-slop-throat-clearing', ctx, o.text.slice(0, 80), o.startLine, `scene-setting opener: "${m[0].slice(0, 50)}"`)] : [];
  },

  // detection: curated synonym-pair set. Any hit = warn.
  'mkt-slop-paired-synonyms': (a, _r, ctx) => {
    const out = [];
    const re = /(clear and concise|robust and reliable|simple and straightforward|comprehensive and thorough|fast and efficient|innovative and cutting-edge|powerful and flexible|safe and secure)/i;
    for (const l of nonExemptLines(a, ctx)) {
      const m = l.text.match(re);
      if (m) out.push(mk('mkt-slop-paired-synonyms', ctx, m[0], l.n, `paired synonyms: "${m[0]}"`));
    }
    return out;
  },

  // detection: /^your X, Yed\.?$/i and /^X. Yed.$/i on headline/tagline slots. Hard variants = warn single.
  'mkt-slop-staccato-tagline': (a, _r, ctx) => {
    const out = [];
    const cands = [a.regions.headline, a.regions.hook].filter(Boolean);
    // also short standalone lines
    for (const l of nonExemptLines(a, ctx)) if (l.text.trim().length <= 40) cands.push({ text: l.text.trim(), startLine: l.n });
    const seen = new Set();
    for (const c of cands) {
      if (seen.has(c.startLine)) continue;
      const t = c.text.trim();
      if (/^your [a-z]+,\s+[a-z]+(ed|d)\.?$/i.test(t) || /^[a-z]+\.\s+[a-z]+(ed|ied|fied|d)\.?$/i.test(t)) {
        out.push(mk('mkt-slop-staccato-tagline', ctx, t, c.startLine, `staccato tagline form: "${t}"`));
        seen.add(c.startLine);
      }
    }
    return out;
  },

  // detection: /\b(here'?s (why|what|how|the)|the (answer|secret|truth|point|reason))\s*:/i in prose.
  'mkt-slop-colon-reveal': (a, _r, ctx) => {
    const out = [];
    const re = /\b(here'?s (why|what|how|the)|the (answer|secret|truth|point|reason))\s*:/i;
    for (const l of nonExemptLines(a, ctx)) {
      const m = l.text.match(re);
      if (m) out.push(mk('mkt-slop-colon-reveal', ctx, m[0], l.n, `colon-reveal crutch: "${m[0]}"`));
    }
    return out;
  },

  // detection (trend): /(has entered the chat|is having (a|its) moment|is the new |it'?s giving )/i. is-the-new = nit; others warn.
  'mkt-slop-meme-frame': (a, _r, ctx) => {
    const out = [];
    for (const l of nonExemptLines(a, ctx)) {
      const hard = l.text.match(/(has entered the chat|having (a|its) moment|it'?s giving )/i);
      if (hard) { out.push(mk('mkt-slop-meme-frame', ctx, hard[0], l.n, `dead-meme frame: "${hard[0].trim()}"`)); continue; }
      const soft = l.text.match(/ is the new \w/i);
      if (soft) out.push(mk('mkt-slop-meme-frame', ctx, soft[0].trim(), l.n, `manufactured-trend frame: "${soft[0].trim()}" (no displacement data)`, 'nit'));
    }
    return out;
  },

  // detection: absolutes WITHOUT an adjacent number/named entity/citation in the clause. warn; block if hero.
  'mkt-claim-unfalsifiable-superlative': (a, _r, ctx) => {
    const out = [];
    const re = /\b(the world'?s most|best-in-class|world-class|industry-leading|the (?:#1|number one)|trusted by everyone|most powerful|most intuitive|the leading|the best)\b/i;
    for (const s of a.sentences) {
      if (ctx.fpGuards.isExempt(s.startLine)) continue;
      const m = s.text.match(re);
      if (m && !/\d/.test(s.text)) {
        const sev = s.region === 'headline' || s.region === 'hook' ? 'block' : 'warn';
        out.push(mk('mkt-claim-unfalsifiable-superlative', ctx, m[0], s.startLine, `unfalsifiable superlative "${m[0]}" with no proof in clause`, sev));
      }
    }
    return out;
  },

  // detection: a %/precise figure NOT within ~12 words of a NAMED source; hard sub-rule for unsourced 47/73. block.
  'mkt-claim-fabricated-precision': (a, _r, ctx) => {
    const out = [];
    const SOURCE = /(according to|per |source:|\b(19|20)\d{2}\b|\b[A-Z][a-zA-Z]+ (Inc|Labs|Research|University|Institute|Report|Survey|Study|Analytics)\b|\b[A-Z][a-zA-Z]+'s (report|study|survey|data))/;
    for (const s of a.sentences) {
      if (ctx.fpGuards.isExempt(s.startLine)) continue;
      const pct = s.text.match(/\b\d{1,3}(?:\.\d+)?%/);
      const hardNum = s.text.match(/\b(47|73)\b/);
      const statFrame = /(studies|study|research|data|survey|report|users?|customers?|teams?|people)\b/i.test(s.text);
      if ((pct || (hardNum && statFrame)) && !SOURCE.test(s.text)) {
        const ev = pct ? `unsourced stat ${pct[0]} (no named source in clause)` : `unsourced ${hardNum[0]} — a known LLM number fingerprint, stat-framed without a source`;
        out.push(mk('mkt-claim-fabricated-precision', ctx, (pct || hardNum)[0], s.startLine, ev));
      }
    }
    return out;
  },

  // detection: /(experts?|...|studies|research|...)\s+(say|argue|agree|...)/i with no proper-noun source in the sentence. warn.
  'mkt-claim-vague-attribution': (a, _r, ctx) => {
    const out = [];
    const re = /\b(experts?|analysts?|observers?|critics?|studies|research|industry (reports?|data)|some people|many people|sources?)\s+(say|argue|agree|suggest|believe|note|show|find|report)/i;
    for (const s of a.sentences) {
      if (ctx.fpGuards.isExempt(s.startLine)) continue;
      const m = s.text.match(re);
      if (m && !/(according to [A-Z]|[A-Z][a-zA-Z]+ (Inc|Labs|Research|University|Institute))/.test(s.text)) {
        out.push(mk('mkt-claim-vague-attribution', ctx, m[0], s.startLine, `unnamed authority: "${m[0]}"`));
      }
    }
    return out;
  },

  // detection: empty declaratives /(the (results?|impact|...) (are|is) (significant|...))|this (matters|...)/i with no adjacent concrete consequence. warn.
  'mkt-claim-telling-not-showing': (a, _r, ctx) => {
    const out = [];
    const re = /(the (results?|impact|implications?|stakes|difference) (are|is) (significant|huge|game-changing|massive|real|undeniable))|this (matters|changes everything|is a big deal)/i;
    for (const s of a.sentences) {
      if (ctx.fpGuards.isExempt(s.startLine)) continue;
      const m = s.text.match(re);
      if (m && !/\d/.test(s.text)) out.push(mk('mkt-claim-telling-not-showing', ctx, m[0], s.startLine, `announces importance without naming it: "${m[0]}"`));
    }
    return out;
  },

  // detection: button/CTA slot exactly a weak verb /^(learn more|click here|submit|...)\.?$/i with no value clause. warn.
  'mkt-cta-weak-verb': (a, _r, ctx) => {
    const out = [];
    const re = /^(learn more|click here|submit|get started|read more|find out more|sign up|continue)\.?$/i;
    for (const c of a.regions.cta) {
      const t = c.text.replace(/^\**\[?|\]?\(?.*$/g, '').trim() || c.text.trim();
      if (re.test(c.text.trim()) || re.test(t)) out.push(mk('mkt-cta-weak-verb', ctx, c.text.trim(), c.startLine, `default CTA verb with no value framing: "${c.text.trim()}"`));
    }
    return out;
  },

  // detection: /(only \d+ (spots?|seats?|left)|act (now|fast) before|ends (tonight|at midnight|soon)|last chance|don'?t miss out|limited time only)/i. warn.
  'mkt-cta-fake-urgency': (a, _r, ctx) => {
    const out = [];
    const re = /(only \d+ (spots?|seats?) (left|remaining)|act (now|fast) before|ends (tonight|at midnight|soon)|last chance|don'?t miss out|limited time only)/i;
    for (const l of nonExemptLines(a, ctx)) {
      const m = l.text.match(re);
      if (m) out.push(mk('mkt-cta-fake-urgency', ctx, m[0], l.n, `manufactured urgency: "${m[0]}"`));
    }
    return out;
  },

  // detection (trend): /(like (this )?if you|comment (yes|done|[a-z]+ below)|share to win|tag a friend|follow for more|smash that)/i. block on tiktok/reels/linkedin; warn on x/unknown.
  'mkt-cta-engagement-bait': (a, _r, ctx) => {
    const out = [];
    const re = /(like (this )?if you|comment (yes|done|[a-z]+ below)|share to win|tag a friend|follow for more|smash that|drop a \w+ below)/i;
    const penalty = new Set(['tiktok', 'reels', 'shorts', 'linkedin', 'instagram', 'facebook']);
    const sev = penalty.has(ctx.channel) ? 'block' : 'warn'; // x or unknown => advisory warn
    for (const l of nonExemptLines(a, ctx)) {
      const m = l.text.match(re);
      if (m) out.push(mk('mkt-cta-engagement-bait', ctx, m[0], l.n, `engagement-bait phrasing: "${m[0]}"${sev === 'warn' ? ' (advisory on this channel)' : ' (algorithm-penalized here)'}`, sev));
    }
    return out;
  },

  // detection: passive 'it (has been|is) (determined|...)' + announcement frames + copula-avoidance. warn.
  'mkt-voice-corporate-passive': (a, _r, ctx) => {
    const out = [];
    const re = /(it (has been|is) (determined|noted|believed)|introducing the (all-new|new)|we'?re (proud|excited|thrilled) to announce|welcome to a new era|usher in|is a testament to|stands as a|serves as a)/i;
    for (const l of nonExemptLines(a, ctx)) {
      const m = l.text.match(re);
      if (m) out.push(mk('mkt-voice-corporate-passive', ctx, m[0], l.n, `corporate/announcement voice: "${m[0]}"`));
    }
    return out;
  },

  // detection: /(in this (section|post|guide),? we'?ll|let me walk you through|let'?s (dive in|explore|get started)|...)/i. warn.
  'mkt-voice-on-the-nose-meta': (a, _r, ctx) => {
    const out = [];
    const re = /(in this (section|post|guide),? we'?ll|let me walk you through|let'?s (dive in|explore|get started)|before we (dive in|begin)|here'?s the thing:|this (comprehensive|complete) guide (will|covers))/i;
    for (const l of nonExemptLines(a, ctx)) {
      const m = l.text.match(re);
      if (m) out.push(mk('mkt-voice-on-the-nose-meta', ctx, m[0], l.n, `meta-narration: "${m[0]}"`));
    }
    return out;
  },

  // detection: closing block /(i hope this helps|let me know if you'?d like|feel free to (reach out|ask)|...)/i. warn.
  'mkt-voice-permission-closer': (a, _r, ctx) => {
    const out = [];
    const re = /(i hope this helps|let me know if you'?d like|feel free to (reach out|ask)|would you like me to|don'?t hesitate to)/i;
    for (const l of nonExemptLines(a, ctx)) {
      const m = l.text.match(re);
      if (m) out.push(mk('mkt-voice-permission-closer', ctx, m[0], l.n, `assistant-mode closer: "${m[0]}"`));
    }
    return out;
  },

  // detection: measure headline/hook char length vs per-platform cap (CAP_TABLE). UNKNOWN channel = no-op.
  'mkt-struct-headline-overflow': (a, _r, ctx) => {
    const ch = ctx.channel;
    const cap = CAP_TABLE[ch];
    if (!cap) return []; // unknown channel => no-op (require a should-pass golden)
    const o = a.regions.headline || a.regions.hook;
    if (!o) return [];
    const len = o.text.length;
    if (cap.hard && len > cap.hard) return [mk('mkt-struct-headline-overflow', ctx, o.text.slice(0, 60) + '…', o.startLine, `headline ${len} chars vs ${ch} hard cap ${cap.hard}`)];
    if (cap.fold && len > cap.fold) return [mk('mkt-struct-headline-overflow', ctx, o.text.slice(0, 60) + '…', o.startLine, `tension at char ${len} past ${ch} fold ${cap.fold}`, 'warn')];
    return [];
  },

  // detection: thread markers in single-post / blog ## headings in a video caption. warn.
  'mkt-channel-format-mismatch': (a, _r, ctx) => {
    const ch = ctx.channel;
    const out = [];
    const singlePost = new Set(['linkedin', 'tiktok', 'reels', 'shorts', 'instagram', 'facebook']);
    if (singlePost.has(ch)) {
      for (const l of nonExemptLines(a, ctx)) {
        if (/^\s*\d+\/(\d+)?\s/.test(l.text)) { out.push(mk('mkt-channel-format-mismatch', ctx, l.text.trim().slice(0, 60), l.n, `thread marker "${l.text.trim().slice(0, 10)}" in a single-post ${ch} artifact`)); break; }
      }
    }
    if (ch === 'tiktok' || ch === 'reels' || ch === 'shorts') {
      for (const l of nonExemptLines(a, ctx)) {
        if (/^\s{0,3}#{2,}\s+\S/.test(l.text)) { out.push(mk('mkt-channel-format-mismatch', ctx, l.text.trim().slice(0, 60), l.n, `blog-style ## heading in a ${ch} video caption`)); break; }
      }
    }
    return out;
  },

  // detection (trend): /(🧵|a (mega-?)?thread (on|about)|let'?s go\.?\s*\d+\/|bookmark this|read till the end|here'?s everything)/i in an X artifact. warn.
  'mkt-channel-thread-bait': (a, _r, ctx) => {
    const ch = ctx.channel;
    if (ch && ch !== 'x') return []; // X-only; explicit non-x suppresses
    const out = [];
    const re = /(🧵|a (mega-?)?thread (on|about)|let'?s go\.?\s*\d+\/|bookmark this|read till the end|here'?s everything)/i;
    for (const l of nonExemptLines(a, ctx)) {
      const m = l.text.match(re);
      if (m) { out.push(mk('mkt-channel-thread-bait', ctx, m[0], l.n, `thread-bait scaffolding: "${m[0].trim()}"${ch ? '' : ' (channel unknown)'}`)); break; }
    }
    return out;
  },

  // detection: emoji as line-leading bullet / >=3 in headline / >=5 in primary text. landing/long-form: any structural emoji=block.
  'mkt-channel-emoji-spam': (a, _r, ctx) => {
    const EMOJI = /\p{Extended_Pictographic}/gu;
    let total = 0, firstLine = 0, leading = false;
    for (const l of nonExemptLines(a, ctx)) {
      const m = l.text.match(EMOJI);
      if (m) { total += m.length; if (!firstLine) firstLine = l.n; }
      if (/^\s*\p{Extended_Pictographic}/u.test(l.text)) { leading = true; if (!firstLine) firstLine = l.n; }
    }
    const heroEmoji = (heroText(a).match(EMOJI) || []).length;
    const reg = String(ctx.register || '').toLowerCase();
    const longform = reg === 'landing' || reg === 'long-form' || reg === 'editorial';
    if (leading || heroEmoji >= 3 || total >= 5) {
      const sev = longform && (leading || total >= 1) ? 'block' : 'warn';
      return [mk('mkt-channel-emoji-spam', ctx, '', firstLine, `${total} emoji${leading ? ', used as structure/bullets' : ''}${heroEmoji >= 3 ? `, ${heroEmoji} in hero` : ''}`, sev)];
    }
    return [];
  },

  // detection: raw URL in first 3 lines of an X/LinkedIn native post. warn. N/A on tiktok/reels/shorts.
  'mkt-channel-early-external-link': (a, _r, ctx) => {
    const ch = ctx.channel;
    if (ch !== 'x' && ch !== 'linkedin') return [];
    const firstThree = a.lines.filter((l) => l.text.trim()).slice(0, 3);
    for (const l of firstThree) {
      if (ctx.fpGuards.isExempt(l.n)) continue;
      const m = l.text.match(/https?:\/\/\S+/);
      if (m) return [mk('mkt-channel-early-external-link', ctx, m[0], l.n, `raw external link above the fold on ${ch} (reach-suppressed; use the first comment)`)];
    }
    return [];
  },

  // detection: >=3 consecutive ALL-CAPS words (acronym allowlist excepted). block on paid-ad, warn elsewhere.
  'mkt-channel-all-caps': (a, _r, ctx) => {
    const ALLOW = new Set(['API', 'SAAS', 'CRM', 'AI', 'B2B', 'B2C', 'SEO', 'CEO', 'CTA', 'ROI', 'KPI', 'USA', 'UK', 'EU', 'PDF', 'URL', 'MVP']);
    const out = [];
    const cands = [a.regions.headline, a.regions.hook, ...a.regions.cta].filter(Boolean);
    const reg = String(ctx.register || '').toLowerCase();
    const paid = reg === 'ad' || reg === 'paid' || ctx.channel === 'meta' || a.frontmatter.paid === 'true' || a.frontmatter.paid === true;
    for (const c of cands) {
      const words = c.text.match(/\b[A-Z][A-Z'-]{1,}\b/g) || [];
      let run = 0, max = 0, runWords = [];
      const tokens = c.text.split(/\s+/);
      let curRun = [];
      for (const tk of tokens) {
        const clean = tk.replace(/[^A-Za-z]/g, '');
        if (clean.length >= 2 && clean === clean.toUpperCase() && /[A-Z]/.test(clean) && !ALLOW.has(clean.toUpperCase())) {
          curRun.push(tk);
          if (curRun.length > max) { max = curRun.length; runWords = [...curRun]; }
        } else curRun = [];
      }
      if (max >= 3) {
        out.push(mk('mkt-channel-all-caps', ctx, runWords.join(' ').slice(0, 60), c.startLine, `${max} consecutive all-caps words${paid ? ' (paid-ad policy auto-reject)' : ''}`, paid ? 'block' : 'warn'));
      }
    }
    return out;
  },

  // detection: /(trusted by|used by|loved by|join (thousands|millions)|leading (companies|teams|brands))/i NOT followed by a named entity/number. warn.
  'mkt-persuasion-no-social-proof': (a, _r, ctx) => {
    const out = [];
    const re = /(trusted by|used by|loved by|join (thousands|millions)|leading (companies|teams|brands))/i;
    for (const l of nonExemptLines(a, ctx)) {
      const m = l.text.match(re);
      if (!m) continue;
      const tail = l.text.slice(l.text.toLowerCase().indexOf(m[0].toLowerCase()) + m[0].length);
      const hasNamed = /[A-Z][a-zA-Z]{2,}/.test(tail) || /\d/.test(tail);
      if (!hasNamed) out.push(mk('mkt-persuasion-no-social-proof', ctx, m[0], l.n, `empty proof slot "${m[0]}" — no named customer/number/logo`));
    }
    return out;
  },

  // detection: closing block /(the future (looks|is) bright|possibilities are (endless|exciting)|exciting times (lie )?ahead|...)/i. warn.
  'mkt-persuasion-generic-conclusion': (a, _r, ctx) => {
    const out = [];
    const re = /(the future (looks bright|is bright)|possibilities are (endless|exciting)|exciting times (lie )?ahead|the sky'?s the limit|we can achieve (great|remarkable) things)/i;
    for (const l of nonExemptLines(a, ctx)) {
      if (a.regions.closing && (l.n < a.regions.closing.startLine || l.n > a.regions.closing.endLine)) {
        // generic conclusions matter most in the closing; still flag elsewhere but prefer closing
      }
      const m = l.text.match(re);
      if (m) out.push(mk('mkt-persuasion-generic-conclusion', ctx, m[0], l.n, `empty upbeat ending with no next step: "${m[0]}"`));
    }
    return out;
  },
};
