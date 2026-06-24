#!/usr/bin/env node
/**
 * post-artifact-slop-scan — FORSVN Slop Detector S3 (FOR-52). The always-on on-save trigger.
 *
 * One file, two modes, dispatched on `hook_event_name`:
 *   PostToolUse — ADVISORY. After a Write/Edit to docs/forsvn/artifacts/**.md, run the FOR-51
 *                 deterministic scanner (zero-LLM) over the saved file and inject named findings as a
 *                 suggestion-only <system-reminder> (hookSpecificOutput.additionalContext). exit 0
 *                 ALWAYS. It NEVER auto-fixes, NEVER invokes a fix skill — it routes the human to one.
 *   PreToolUse  — DENY. Before the write lands, run a tiny 2-rule zero-tolerance denylist against the
 *                 PROPOSED content and deny the write (Claude Code permissionDecision:'deny') ONLY on a
 *                 hard-block hit. Everything else allows ({}).
 *
 * DETECT != FIX (D-25): this reports/blocks; it NEVER rewrites copy. The human owns every decision —
 * mirroring git-marketing-suggest.mjs's stance (it nudges; the human tags /forsvn to act).
 *
 * Contract (load-bearing): glob-gated to artifact paths, swallow-all, exit 0 on EVERY path. A hook
 * must never break the turn. The advisory path consumes the FOR-51 scanner; the deny path inlines its
 * two rules so a registry edit can never weaken the block.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ARTIFACT_RE = /(^|\/)docs\/forsvn\/artifacts\/.+\.md$/;
const MAX_CHARS = 8000;            // additionalContext budget; clamp by popping findings
const EDIT_COUNT_THRESHOLD = 6;    // after >6 saves of one file this session, suppress
const DENIAL_THRESHOLD = 6;        // after >6 denials of one file+signature, downgrade to allow

// ─── tiny utilities ───
const truthy = (v) => v != null && v !== '' && v !== '0' && String(v).toLowerCase() !== 'false';
const depthIsSet = (v) => v != null && v !== '';
const toPosix = (p) => String(p || '').replace(/\\/g, '/');
function djb2(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); }

function readStdin() {
  try {
    if (process.stdin.isTTY) return '';
    return readFileSync(0, 'utf8');
  } catch { return ''; }
}

// `{}` is the universal "nothing to say / allow" reply on both paths.
function emit(obj) { try { process.stdout.write(obj ? JSON.stringify(obj) : '{}'); } catch { /* ignore */ } process.exit(0); }
const NOTHING = () => emit({});

// Relative artifact path for display — never leak an absolute personal path into output.
function relArtifact(p) {
  const s = toPosix(p);
  const i = s.indexOf('docs/forsvn/artifacts/');
  return i >= 0 ? s.slice(i) : s.split('/').pop();
}

// ─── session cache (dedupe + edit-count + denial-count). Degrades to no-op on any failure. ───
function cachePath(cwd) { return join(cwd || process.cwd(), '.forsvn', 'slop', 'hook-cache.json'); }
function loadCache(cwd) { try { return JSON.parse(readFileSync(cachePath(cwd), 'utf8')); } catch { return {}; } }
function saveCache(cwd, cache) {
  try { const f = cachePath(cwd); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, JSON.stringify(cache)); } catch { /* degrade */ }
}
function sessionEntry(cache, sessionId) {
  const id = sessionId || 'no-session';
  cache[id] = cache[id] || { editCounts: {}, seen: {}, denials: {} };
  return cache[id];
}

// ════════════════════════ ADVISORY PATH (PostToolUse) ════════════════════════
async function runScanner(content, path) {
  // Test seam (env-gated, sanctioned by the brief): inject synthetic findings instead of importing
  // the scanner — lets the suite exercise llm-tier exclusion, dedupe, suppress, clamp deterministically.
  // A non-array / unparseable value simulates the scanner-throw path → null.
  if (process.env.FORSVN_SLOP_HOOK_INJECT != null) {
    try { const v = JSON.parse(process.env.FORSVN_SLOP_HOOK_INJECT); return Array.isArray(v) ? v : null; } catch { return null; }
  }
  const mod = await import(new URL('../forsvn-slop/lib/scan-core.mjs', import.meta.url)).catch(() => null);
  if (!mod || typeof mod.scanText !== 'function') return null;          // scanner-missing → skip
  try {
    const result = await mod.scanText(content, { file: path });        // scanner skips frontmatter; line nums file-relative
    return Array.isArray(result?.findings) ? result.findings : [];
  } catch { return null; }                                              // scanner-throw → skip
}

function fixSkillFor(f) {
  if (f.fixSkill) return f.fixSkill;                                    // registry already routed it
  return f.category === 'slop' ? 'humanmaxxing' : 'write-copy';        // fallback by category (taxonomy.autofixModel)
}

function renderAdvisory(findings, path) {
  const rel = relArtifact(path);
  const header = `[forsvn-slop] Deterministic slop scan (advisory — human owns the decision) — ${rel} (${findings.length} issue(s)):`;
  const footer = `These are advisory: a finding is not automatically a defect — use judgment, and don't silence a real one. Detect ≠ fix: nothing was changed. Run /forsvn audit for the full pass.`;
  const line = (f) => {
    const loc = f.line > 0 ? ` (line ${f.line})` : '';
    const desc = (f.evidence || f.snippet || '').toString().trim().replace(/\s+/g, ' ');
    return `- [${f.antipattern}] ${f.name}${loc}. ${desc}. → fix with /${fixSkillFor(f)}`;
  };
  let kept = findings.slice();
  const build = (list, omitted) => {
    const body = list.map(line);
    if (omitted > 0) body.push(`... and ${omitted} more (see /forsvn audit).`);
    return [header, ...body, footer].join('\n');
  };
  let text = build(kept, 0);
  let omitted = 0;
  while (text.length > MAX_CHARS && kept.length > 1) { kept.pop(); omitted++; text = build(kept, omitted); }
  return text;
}

async function advisoryPath(event) {
  const tin = event.tool_input || {};
  const path = tin.file_path ?? tin.notebook_path;
  if (!path || !ARTIFACT_RE.test(toPosix(path))) return NOTHING();      // GLOB GATE — the master scope rule

  let content;
  try { content = readFileSync(path, 'utf8'); } catch { return NOTHING(); }  // PostToolUse: file already written

  let findings = await runScanner(content, path);
  if (!Array.isArray(findings)) return NOTHING();                       // scanner missing / threw
  findings = findings.filter((f) => f && f.antipattern && f.tier !== 'llm');  // belt-and-suspenders: zero-LLM on the hook path

  // per-session dedupe + edit-count suppress
  const cwd = event.cwd;
  const cache = loadCache(cwd);
  const sess = sessionEntry(cache, event.session_id);
  const seen = (sess.seen[path] = sess.seen[path] || []);
  const sig = (f) => `${f.antipattern}:${djb2(String(f.snippet || f.evidence || ''))}`;
  const fresh = findings.filter((f) => !seen.includes(sig(f)));

  sess.editCounts[path] = (sess.editCounts[path] || 0) + 1;
  if (sess.editCounts[path] > EDIT_COUNT_THRESHOLD) {
    saveCache(cwd, cache);
    return emit({ hookSpecificOutput: { hookEventName: 'PostToolUse',
      additionalContext: `[forsvn-slop] Suppressing further hints on ${relArtifact(path)} (>${EDIT_COUNT_THRESHOLD} edits this session). Run /forsvn audit to revisit.` } });
  }
  for (const f of fresh) seen.push(sig(f));
  saveCache(cwd, cache);

  if (fresh.length === 0) return NOTHING();                            // silence on clean — no "all clear" ack
  return emit({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: renderAdvisory(fresh, path) } });
}

// ════════════════════════ DENY PATH (PreToolUse) ════════════════════════
// The 2-rule zero-tolerance denylist, inlined (no scanner dependency — a registry edit can't weaken it).
// Scope decision (deliberate, deviates from the literal brief): the fabricated-precision rule fires only
// on a figure in a CLAIM/OUTCOME context ("73% of users churn"), not on every bare figure — so "50% off",
// "100% free", "47 ways" are NOT hard-blocked. Asymmetric authority (brief §EdgeCases) makes a wrong block
// far costlier than a wrong advisory; the looser set still gets a PostToolUse advisory via the real scanner.
const SOURCE_RE = /\b(according to|per|source|cited|study|studies|survey|report|reports|research|data from|via)\b|\b(?:19|20)\d{2}\b|\([^)]*[A-Z][^)]*\)/;
const FIGURE_RE = /(\$\s?[\d,]+(?:\.\d+)?\s?(?:k|m|b|bn|million|billion|thousand)?|\b\d{1,3}(?:\.\d+)?\s?%|\b\d+(?:\.\d+)?x\b|\b(?:47|73)\b)/gi;
const CLAIM_CONTEXT_RE = /\b(users?|customers?|clients?|teams?|companies|businesses|people|founders?|developers?|churn|retention|conversion|abandon|growth|grew|grow|increase[ds]?|decrease[ds]?|reduc\w*|revenue|sales|productivity|faster|slower|higher|lower|save[ds]?|saving|cut|boost\w*|improv\w*|of (?:all )?(?:users|customers|teams|people|respondents))\b/i;

function fabricatedPrecisionHit(text) {
  let m;
  FIGURE_RE.lastIndex = 0;
  while ((m = FIGURE_RE.exec(text)) !== null) {
    const fig = m[0].trim();
    const ctxStart = Math.max(0, m.index - 60), ctxEnd = Math.min(text.length, m.index + fig.length + 60);
    const claimWindow = text.slice(ctxStart, ctxEnd);
    if (!CLAIM_CONTEXT_RE.test(claimWindow)) continue;                  // not a research/outcome claim → skip (e.g. "50% off")
    const srcStart = Math.max(0, m.index - 80), srcEnd = Math.min(text.length, m.index + fig.length + 80);
    if (!SOURCE_RE.test(text.slice(srcStart, srcEnd))) return fig;      // unsourced claim figure → block
  }
  return null;
}

// mkt-brand-locked-token (NEW local rule; the D-26 locked-brand / no-gradient analog — NOT one of the 52).
// Grounded in the absolute no-gradients rule + "Signal Lime #B7FF6E is retired" brand fidelity. Literals
// only; tiny; generic — no filesystem paths (the public mirror ships this file).
const BRAND_LOCKED = [
  { re: /signal\s*lime/i, label: 'retired brand token "Signal Lime"' },
  { re: /#?\bB7FF6E\b/i, label: 'retired brand color #B7FF6E' },
  { re: /\b(gradient|glow|frosted|glass(?:morphism)?)\b/i, label: 'banned styling (gradient/glow/glass)' },
];
function brandLockedHit(text) {
  for (const r of BRAND_LOCKED) { const m = text.match(r.re); if (m) return { snippet: m[0], label: r.label }; }
  return null;
}

function denyReply(reason) { return { hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } }; }

async function denyPath(event) {
  const tin = event.tool_input || {};
  const path = tin.file_path;
  if (!path || !ARTIFACT_RE.test(toPosix(path))) return NOTHING();     // GLOB GATE — never gate a non-artifact write
  const content = event.tool_name === 'Edit' ? tin.new_string : tin.content;  // PROPOSED content only; do NOT read disk
  if (typeof content !== 'string' || content.length === 0) return NOTHING();

  let reason = null, sigKey = null;
  const brand = brandLockedHit(content);
  if (brand) {
    reason = `forsvn-slop denylist — ${brand.label}: "${brand.snippet}". FORSVN uses Leaf #74B36B on dark, matte only; no gradients/glow (locked brand rule). Remove it, then re-save.`;
    sigKey = `brand:${djb2(brand.snippet.toLowerCase())}`;
  } else {
    const fig = fabricatedPrecisionHit(content);
    if (fig) {
      reason = `forsvn-slop denylist — fabricated/unsourced precision: "${fig}" states a measured claim with no named source within ~12 words. Cite it (e.g. "(per Gartner 2025)") or remove the figure, then re-save.`;
      sigKey = `stat:${djb2(fig.toLowerCase())}`;
    }
  }
  if (!reason) return NOTHING();                                       // no denylist hit → allow

  // anti-loop: after >6 denials of the same file+signature, downgrade to allow so a stuck agent isn't hard-blocked forever
  const cwd = event.cwd;
  const cache = loadCache(cwd);
  const sess = sessionEntry(cache, event.session_id);
  const dk = `${path}:${sigKey}`;
  sess.denials[dk] = (sess.denials[dk] || 0) + 1;
  const over = sess.denials[dk] > DENIAL_THRESHOLD;
  saveCache(cwd, cache);
  if (over) return NOTHING();                                          // downgrade to allow
  return emit(denyReply(reason));
}

// ════════════════════════ dispatch + swallow-all ════════════════════════
async function main() {
  // Snapshot inherited env FIRST, then mark depth (hygiene for any downstream write the agent triggers).
  const env = process.env;
  if (depthIsSet(env.FORSVN_SLOP_HOOK_DEPTH) || depthIsSet(env.CLAUDE_HOOK_DEPTH) || truthy(env.FORSVN_SLOP_HOOK_DISABLED)) return NOTHING();
  process.env.FORSVN_SLOP_HOOK_DEPTH = '1';

  const raw = readStdin();
  if (!raw.trim()) return NOTHING();
  let event;
  try { event = JSON.parse(raw); } catch { return NOTHING(); }

  if (event.hook_event_name === 'PreToolUse') return denyPath(event);
  return advisoryPath(event);                                          // PostToolUse (and any other event) → advisory
}

main().catch(() => NOTHING());
