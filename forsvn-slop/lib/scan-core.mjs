// scan-core.mjs — the deterministic slop-scan engine (FOR-51 / S2). THE S3 SEAM.
//
// Pure + node-importable: no Bun, no process, no Date/random/network/cwd. This is the load-bearing
// dependency FOR-52's PostToolUse hook (a node .mjs) imports — it cannot import a Bun .ts, which is
// why the engine lives here and scan.ts is only a thin CLI shell over it.
//
// Pipeline (slop-detector.md Part 3 step 2): parse → resolve register/channel → select the 42
// regex|heuristic registry rules → run each check (verbatim-from-`detection` patterns + pinned
// metric formulas) → FP guards (exempt spans handled in-check; inline waivers + provider gating +
// dedup here) → finding() objects with measured evidence. Zero LLM: the 10 tier:'llm' rules are
// S6/FOR-55. DETECT != FIX: this reports and exits; it never rewrites (D-25).

import { getRulesForTier, filterByProviders } from '../registry/antipatterns.mjs';
import { resolveIntent } from '../registry/intent.mjs';
import { parse } from './parse.mjs';
import { makeFpGuards, applyInlineIgnores, normalizeChannel } from './fp-guards.mjs';
import { REGEX_CHECKS } from './checks-regex.mjs';
import { HEURISTIC_CHECKS } from './checks-heuristic.mjs';

const SEV_ORDER = { block: 0, warn: 1, nit: 2 };

/**
 * Scan one marketing-copy artifact and return its per-file ScanResult.
 * @param {string} text raw file contents
 * @param {{file?:string, register?:string|null, channel?:string|null, intent?:string|null, brandMd?:string|null, providers?:string[]}} [opts]
 * @returns {Promise<{file:string, findings:object[], counts:{block:number,warn:number,nit:number}, regions:string[]}>}
 */
export async function scanText(text, opts = {}) {
  const file = opts.file || '<input>';
  const artifact = parse(text);
  const fm = artifact.frontmatter;

  // register and channel are SEPARATE axes. opts override frontmatter; else null/unknown.
  const register = opts.register ?? (fm.register != null ? String(fm.register) : null);
  const channel = normalizeChannel(opts.channel ?? fm.channel ?? fm.platform ?? null) || null;
  // intent (brand-awareness | direct-response) is an ADDITIVE strategy axis above register. UNSET
  // (the common case) ⇒ null ⇒ every check runs its original path (the goldens-intact guarantee).
  const intent = resolveIntent({ override: opts.intent, frontmatter: fm.intent, brandMd: opts.brandMd }).intent;
  const providers = opts.providers ?? [];

  const ctx = { file, register, channel, intent, providers, fpGuards: makeFpGuards(artifact) };

  // Select the deterministic-strict tier only (42 = 29 regex + 13 heuristic). The 10 llm rules
  // are not scanned here. Iterate the registry — never hardcode a rule id.
  let findings = [];
  for (const rule of getRulesForTier('regex')) {
    const fn = REGEX_CHECKS[rule.id];
    if (fn) findings.push(...fn(artifact, rule, ctx));
  }
  for (const rule of getRulesForTier('heuristic')) {
    const fn = HEURISTIC_CHECKS[rule.id];
    if (fn) findings.push(...fn(artifact, rule, ctx));
  }

  // FP guards: inline waivers (forsvn-slop-disable + frontmatter forsvn-slop-ignore) then provider
  // gating. (Exempt-span suppression already applied per-check; caveat-avalanche opts out by design.)
  findings = applyInlineIgnores(findings, text, fm);
  findings = filterByProviders(findings, providers);
  findings = dedupe(findings);

  // deterministic order: by line (whole-file line:0 last), then severity, then id, then snippet.
  findings.sort((x, y) =>
    (x.line || Infinity) - (y.line || Infinity) ||
    SEV_ORDER[x.severity] - SEV_ORDER[y.severity] ||
    x.antipattern.localeCompare(y.antipattern) ||
    String(x.snippet).localeCompare(String(y.snippet)));

  const counts = { block: 0, warn: 0, nit: 0 };
  for (const f of findings) counts[f.severity]++;

  return { file, findings, counts, regions: artifact.regionNames };
}

// dedupe key = antipattern + snippet, collapsing lines within a 2-line window (both >0);
// line:0 whole-file findings dedupe on exact antipattern+snippet.
function dedupe(findings) {
  const kept = [];
  for (const f of findings) {
    const dup = kept.find((k) =>
      k.antipattern === f.antipattern &&
      String(k.snippet) === String(f.snippet) &&
      ((k.line === 0 && f.line === 0) || (k.line > 0 && f.line > 0 && Math.abs(k.line - f.line) <= 2)));
    if (!dup) kept.push(f);
  }
  return kept;
}
