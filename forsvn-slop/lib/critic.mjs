// critic.mjs — the LLM-critic emission + dedup seam (FOR-55 / S6). Pure + node-importable: no Bun,
// no process, no Date/random/network. The critic AGENT (critic-agent.md) is a prompt that returns a
// thin per-rule verdict; THIS module turns an `advise` verdict into the canonical advisory finding
// and dedupes the critic's findings against the deterministic scan. FOR-57's orchestrator imports it.
//
// THE LOAD-BEARING INVARIANT (the central trap, brief §"Edge cases"): the critic NEVER raises a
// block/warn. Several tier:'llm' rules carry a non-advisory CATALOG severity — mkt-claim-hypothetical-
// as-measured is [block] (its hard-block is owned by the DETERMINISTIC heuristic bridge-detector,
// the D-26/D-27 denylist), mkt-cta-no-value-or-urgency is [nit], the rest [warn]. The catalog severity
// is the DETERMINISTIC leg's. When the critic confirms the same rule, the emitted finding carries
// advisory:true ALWAYS (forces 'consider' rendering, forbids hard-block/auto-apply). criticFinding()
// makes that unconditional in code — the advisory invariant cannot be violated by a prompt edit.

import { finding, getAP } from '../finding.mjs';

const VERDICTS = new Set(['advise', 'silent']);

/**
 * Wrap one `advise` verdict from the critic agent into the canonical advisory finding. The agent
 * supplies ruleId + the quoted snippet + line + falsifiable evidence + verdict; finding() fills the
 * registry-derived name/whyBad/severity/tier/fixSkill; this stamps advisory:true + verdict.
 *
 * advisory is ALWAYS true regardless of the rule's catalog severity — that is the invariant.
 *
 * @param {string} id       a tier:'llm' registry rule id (e.g. 'mkt-hook-no-pattern-interrupt')
 * @param {string} file     artifact path
 * @param {string} snippet  the exact quoted offending span (+ named competitor / named-missing beat)
 * @param {number} line     1-based line of the snippet (0 if whole-artifact)
 * @param {string} evidence the falsifiable what-would-change-my-mind / named next-band evidence
 * @param {'advise'|'silent'} [verdict='advise']  the critic's per-rule call
 * @returns {object} finding() shape + { advisory:true, verdict }
 */
export function criticFinding(id, file, snippet, line = 0, evidence = '', verdict = 'advise') {
  if (!VERDICTS.has(verdict)) throw new Error(`criticFinding(): bad verdict '${verdict}' (advise|silent)`);
  const ap = getAP(id);
  if (!ap) throw new Error(`criticFinding(): unknown antipattern id '${id}'`);
  // The critic is the subjective tier — only tier:'llm' rules flow through it. A regex/heuristic id
  // here means a misrouted finding (the deterministic scan owns those), not an advisory one.
  if (ap.tier !== 'llm') throw new Error(`criticFinding(): '${id}' is tier '${ap.tier}', not 'llm' — the critic only emits llm rules`);
  const base = finding(id, file, snippet, line, evidence);
  return { ...base, advisory: true, verdict };
}

/**
 * Dedup the critic's findings against the deterministic scan (brief STEP 2 — synthesis): drop a
 * critic finding when its rule already fired deterministically (same antipattern id) OR its quoted
 * snippet sits within ±2 lines of ANY deterministic finding. Prevents laundering a regex hit into a
 * second 'the AI confirmed it' signal, and mirrors scan-core's own ±2-line dedupe window.
 *
 * @param {object[]} criticFindings        criticFinding() objects (advisory:true)
 * @param {object[]} deterministicFindings finding() objects from scanText().findings
 * @returns {object[]} the surviving critic findings
 */
export function dedupeCriticFindings(criticFindings, deterministicFindings = []) {
  const detIds = new Set(deterministicFindings.map((d) => d.antipattern));
  const detLines = deterministicFindings.map((d) => d.line).filter((n) => n > 0);
  return criticFindings.filter((f) => {
    if (detIds.has(f.antipattern)) return false;
    if (f.line > 0 && detLines.some((dl) => Math.abs(dl - f.line) <= 2)) return false;
    return true;
  });
}
