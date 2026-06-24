// finding.mjs — the shared finding() factory. The ONE place a detector turns a rule-id
// hit into a finding object; the scanner (S2), critic (S6), report (S5), and preview cards (S4)
// all emit this exact shape. Retargets Impeccable's findings.mjs: reads ap.whyBad (not
// description), carries tier + fixSkill, and adds `evidence` — the measured-evidence string
// ('em-dash count: 7') the report renders as proof, NEVER a bare verdict (slop-detector.md §1.1).
// No severity default: every registry rule carries an explicit block|warn|nit.

import { getAntipattern } from './registry/antipatterns.mjs';

/**
 * @param id       registry rule id (e.g. 'mkt-slop-em-dash-overuse')
 * @param file     artifact path the hit was found in
 * @param snippet  the offending span of copy
 * @param line     1-based line number (0 if unknown)
 * @param evidence measured-evidence string ('em-dash count: 3'); never a bare verdict
 */
export function finding(id, file, snippet, line = 0, evidence = '') {
  const ap = getAntipattern(id);
  if (!ap) throw new Error(`finding(): unknown antipattern id '${id}'`);
  return {
    antipattern: id,
    name: ap.name,
    whyBad: ap.whyBad,
    severity: ap.severity,
    tier: ap.tier,
    file,
    line,
    snippet,
    evidence,
    fixSkill: ap.fixSkill,
  };
}

export { getAntipattern as getAP } from './registry/antipatterns.mjs';
