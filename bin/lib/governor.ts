#!/usr/bin/env bun
// governor.ts — the chain governor (A6). The hard envelope on run-plan's auto-advance.
//
// Bounds an auto-run: max-steps, checkpoint-every-N, domain-jump re-confirm, and an
// optional summed budget. Config lives in `.forsvn/config.json` (net-new; all keys
// optional; conservative defaults when the file is absent).
//
// SAFETY INVARIANT — the governor only ever makes a run MORE restrictive. It cannot
// relax a gate. `loadGovernorConfig` reads ONLY the four envelope knobs and DROPS
// every other key, so `.forsvn/config.json` can never downgrade a `publish` gate to
// auto/review (that contract is A4's, hard-coded per capability in routing.yaml). A
// publish stop is absolute and lives in run-plan, before the governor is ever consulted.
//
// Used by skills/meta/run-plan (the lib) and as a CLI the executor calls per step:
//   bun bin/lib/governor.ts check --step-index N --running-domain D --next-domain D \
//       [--cost-so-far USD] [--next-cost USD | --next-skill ID] [--root DIR]
// Exit codes: 0 = proceed · 2 = stop (reason on stdout) · 1 = usage error.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type Domain = "meta" | "research" | "marketing" | "product";

// The two "doing" domains. A mid-chain jump BETWEEN them is the runaway case the
// re-confirm guards (a marketing chain wandering into product). `research` (a producer
// prefix that feeds everything) and `meta` (orchestration) never trigger a jump — a
// normal funnel legitimately runs research → marketing.
const EXEC_DOMAINS = new Set<Domain>(["marketing", "product"]);

export interface GovernorConfig {
  max_steps: number;
  checkpoint_every: number;
  domain_jump_reconfirm: boolean;
  max_cost_usd: number | null;
}

export const GOVERNOR_DEFAULTS: GovernorConfig = {
  max_steps: 6,
  checkpoint_every: 3,
  domain_jump_reconfirm: true,
  max_cost_usd: null,
};

export type StopReason = "max-steps" | "checkpoint" | "domain-jump" | "budget";
export interface GovDecision {
  proceed: boolean;
  stop_reason?: StopReason;
  detail?: string;
}

/**
 * Load the `.forsvn/config.json` governor block. Only the four known envelope knobs
 * are read; EVERY other key is dropped — including any attempt to override a gate
 * (e.g. `{"governor":{"gate_override":{"publish-social":"auto"}}}` is ignored). A
 * missing or malformed file yields the conservative defaults.
 */
export function loadGovernorConfig(root: string): GovernorConfig {
  const path = join(root, ".forsvn", "config.json");
  if (!existsSync(path)) return { ...GOVERNOR_DEFAULTS };
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return { ...GOVERNOR_DEFAULTS };
  }
  const g =
    raw && typeof raw === "object" && !Array.isArray(raw) &&
    (raw as Record<string, unknown>).governor &&
    typeof (raw as Record<string, unknown>).governor === "object"
      ? ((raw as Record<string, unknown>).governor as Record<string, unknown>)
      : {};

  const cfg: GovernorConfig = { ...GOVERNOR_DEFAULTS };
  if (typeof g.max_steps === "number" && g.max_steps > 0) cfg.max_steps = Math.floor(g.max_steps);
  if (typeof g.checkpoint_every === "number" && g.checkpoint_every > 0) cfg.checkpoint_every = Math.floor(g.checkpoint_every);
  if (typeof g.domain_jump_reconfirm === "boolean") cfg.domain_jump_reconfirm = g.domain_jump_reconfirm;
  if (g.max_cost_usd === null || (typeof g.max_cost_usd === "number" && g.max_cost_usd >= 0)) cfg.max_cost_usd = g.max_cost_usd as number | null;
  // Any other key in `g` is intentionally ignored — the governor cannot relax a gate.
  return cfg;
}

export interface EnvelopeState {
  stepIndex: number; // count of steps already completed this run (0-based)
  runningDomain: Domain; // the chain's primary execution domain
  nextDomain: Domain; // the next ready step's capability domain
  costSoFar: number; // summed estimated-cost (USD upper bound) of completed steps
  nextCost: number; // the next step's estimated-cost (USD upper bound)
}

/**
 * Check the envelope BEFORE running the next step. Hard stops (max-steps, budget) take
 * precedence over the domain-jump re-confirm, which takes precedence over the periodic
 * checkpoint. Returns the first reason that trips, else `{proceed:true}`.
 *
 * The governor is NEVER asked about gate class — run-plan stops a `publish` step before
 * it consults the governor, so a proceed here can never mean "publish".
 */
export function checkEnvelope(state: EnvelopeState, cfg: GovernorConfig): GovDecision {
  if (state.stepIndex >= cfg.max_steps)
    return { proceed: false, stop_reason: "max-steps", detail: `${state.stepIndex}/${cfg.max_steps} steps run` };

  if (cfg.max_cost_usd !== null && state.costSoFar + state.nextCost > cfg.max_cost_usd)
    return {
      proceed: false,
      stop_reason: "budget",
      detail: `$${(state.costSoFar + state.nextCost).toFixed(2)} would exceed $${cfg.max_cost_usd.toFixed(2)}`,
    };

  if (
    cfg.domain_jump_reconfirm &&
    state.nextDomain !== state.runningDomain &&
    EXEC_DOMAINS.has(state.runningDomain) &&
    EXEC_DOMAINS.has(state.nextDomain)
  )
    return { proceed: false, stop_reason: "domain-jump", detail: `${state.runningDomain} → ${state.nextDomain}` };

  if (cfg.checkpoint_every > 0 && state.stepIndex > 0 && state.stepIndex % cfg.checkpoint_every === 0)
    return { proceed: false, stop_reason: "checkpoint", detail: `${state.stepIndex} steps since the last checkpoint` };

  return { proceed: true };
}

/**
 * Upper-bound estimated cost (USD) for a skill, parsed from its SKILL.md frontmatter
 * `estimated-cost: "$0.20-0.90"` line (takes the largest number). Resolves the skill
 * dir from the capability index's `skill_path`. Returns 0 if unknown — budget is
 * opt-in, so an unresolvable cost never blocks a run that set no `max_cost_usd`.
 */
export function estimatedCostUpper(root: string, skillId: string): number {
  try {
    const idxPath = join(root, "references", "capability-index.json");
    const index = JSON.parse(readFileSync(idxPath, "utf8")).capabilities as Record<string, { skill_path?: string }>;
    const skillPath = index[skillId]?.skill_path;
    if (!skillPath) return 0;
    const skillMd = readFileSync(join(root, skillPath, "SKILL.md"), "utf8");
    const fm = skillMd.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const line = (fm ? fm[1] : skillMd).match(/estimated-cost:\s*["']?([^"'\n]+)/);
    if (!line) return 0;
    const nums = line[1].match(/[\d.]+/g);
    return nums ? Math.max(...nums.map(Number)) : 0;
  } catch {
    return 0;
  }
}

// --- CLI --------------------------------------------------------------------
if (import.meta.main) {
  const argv = process.argv.slice(2);
  const sub = argv.shift();
  const opt = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i !== -1 && i + 1 < argv.length ? argv[i + 1] : undefined;
  };
  const root = opt("--root") ?? join(dirname(fileURLToPath(import.meta.url)), "..", "..");

  if (sub === "show") {
    console.log(JSON.stringify(loadGovernorConfig(root), null, 2));
    process.exit(0);
  }
  if (sub !== "check") {
    console.error("Usage: bun bin/lib/governor.ts check --step-index N --running-domain D --next-domain D [--cost-so-far USD] [--next-cost USD | --next-skill ID] [--root DIR]");
    console.error("       bun bin/lib/governor.ts show [--root DIR]");
    process.exit(1);
  }

  const DOMAINS = new Set(["meta", "research", "marketing", "product"]);
  const stepIndex = Number(opt("--step-index"));
  const runningDomain = opt("--running-domain") as Domain;
  const nextDomain = opt("--next-domain") as Domain;
  if (!Number.isFinite(stepIndex) || !DOMAINS.has(runningDomain) || !DOMAINS.has(nextDomain)) {
    console.error("governor: check requires --step-index <n> --running-domain <d> --next-domain <d> (d ∈ meta|research|marketing|product)");
    process.exit(1);
  }
  const nextSkill = opt("--next-skill");
  const nextCost = opt("--next-cost") !== undefined ? Number(opt("--next-cost")) : nextSkill ? estimatedCostUpper(root, nextSkill) : 0;
  const costSoFar = opt("--cost-so-far") !== undefined ? Number(opt("--cost-so-far")) : 0;

  const cfg = loadGovernorConfig(root);
  const decision = checkEnvelope({ stepIndex, runningDomain, nextDomain, costSoFar, nextCost }, cfg);
  if (decision.proceed) {
    console.log("PROCEED");
    process.exit(0);
  }
  console.log(`STOP ${decision.stop_reason}${decision.detail ? ` — ${decision.detail}` : ""}`);
  process.exit(2);
}
