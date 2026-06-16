#!/usr/bin/env bun
// ledger-report — read the T0 ledger and print YOUR OWN activation funnel,
// dogfood cadence, and the STOP-and-fix trigger state. Local-only; no network.
//
// This is the dogfood instrument the governing gate never had: it computes the
// ≥3-active-days/week cadence (the kill-criterion that was waived, not collected)
// straight from the local ledger. Runs `ledger-sync` first so the artifact tree
// is always reflected.
//
// Usage:
//   bun skills/bin/ledger-report.ts [--root <path>] [--json]
//
// Cadence definition + the STOP-and-fix trigger spec it evaluates:
//   docs/forsvn/experience/meta/dogfood-cadence.md

import { readEvents } from "./lib/ledger.mjs";
import { syncLedger } from "./ledger-sync";

const DAY = 86_400_000;
const CADENCE_BAR = 3; // active days/week — the waived kill-criterion
const FRICTION_RATE = 0.25; // blocked+needs_context share that trips a STOP
const FRICTION_WINDOW = 10; // last N completions to judge friction over
const ACTIVATION_STALL_DAYS = 14; // install → no chain within this = stalled

const i = process.argv.indexOf("--root");
const ROOT = i > -1 ? process.argv[i + 1] : process.cwd();
const asJson = process.argv.includes("--json");

syncLedger(ROOT);
const events = readEvents(ROOT) as Array<Record<string, any>>;

const day = (ts: string) => String(ts).slice(0, 10);
const ms = (ts: string) => Date.parse(ts);
const now = Date.now();

const produced = events.filter((e) => e.event === "artifact_produced");
const decisions = events.filter((e) => e.event === "decision_captured");
const chains = events.filter((e) => e.event === "workflow_chain");
const sessions = events.filter((e) => e.event === "session_start");

const firstTs = events.length ? Math.min(...events.map((e) => ms(e.ts))) : null;
const completed = produced.filter((e) => e.status === "done" || e.status === "done_with_concerns");

function earliest(list: Array<Record<string, any>>): string | null {
  if (!list.length) return null;
  return list.reduce((a, b) => (ms(a.ts) <= ms(b.ts) ? a : b)).ts;
}

const funnel = {
  sessions: sessions.length,
  first_skill_completed: earliest(completed),
  first_artifact_produced: earliest(produced),
  first_decision_captured: earliest(decisions),
  first_workflow_chain: earliest(chains),
};

// North-star: a workflow chain within 7 days of first activity.
const firstChain = funnel.first_workflow_chain;
const northStar =
  firstTs != null && firstChain != null && ms(firstChain) - firstTs <= 7 * DAY;

// Active days = distinct calendar days with any event.
const activeDays = new Set(events.map((e) => day(e.ts)));

// Rolling 7-day windows back from today.
function activeDaysInWindow(endMs: number): number {
  const startMs = endMs - 7 * DAY;
  const set = new Set<string>();
  for (const e of events) {
    const t = ms(e.ts);
    if (t > startMs && t <= endMs) set.add(day(e.ts));
  }
  return set.size;
}
const windows = Array.from({ length: 6 }, (_, k) => {
  const end = now - k * 7 * DAY;
  return { ending: new Date(end).toISOString().slice(0, 10), activeDays: activeDaysInWindow(end) };
});
const last7 = windows[0].activeDays;
const prev7 = windows[1].activeDays;

// Friction: blocked+needs_context share over the last N completions (by ts).
const recent = [...produced].sort((a, b) => ms(b.ts) - ms(a.ts)).slice(0, FRICTION_WINDOW);
const frictionHits = recent.filter((e) => e.status === "blocked" || e.status === "needs_context").length;
const frictionRate = recent.length ? frictionHits / recent.length : 0;

// Activation stall: installed >14d ago, still no chain.
const daysSinceFirst = firstTs != null ? (now - firstTs) / DAY : 0;
const stalled = firstTs != null && daysSinceFirst > ACTIVATION_STALL_DAYS && chains.length === 0;

// --- STOP-and-fix triggers ---------------------------------------------------
type Verdict = "PASS" | "WATCH" | "STOP";
const cadenceVerdict: Verdict =
  events.length === 0 ? "WATCH" : last7 >= CADENCE_BAR ? "PASS" : prev7 < CADENCE_BAR ? "STOP" : "WATCH";
const frictionVerdict: Verdict =
  recent.length < 3 ? "PASS" : frictionRate >= FRICTION_RATE ? "STOP" : frictionRate > 0 ? "WATCH" : "PASS";
const activationVerdict: Verdict = stalled ? "STOP" : chains.length > 0 ? "PASS" : "WATCH";

const triggers = [
  {
    id: "A-cadence",
    verdict: cadenceVerdict,
    detail: `last 7d: ${last7} active day(s), prior 7d: ${prev7} (bar ≥ ${CADENCE_BAR}/wk). STOP = two consecutive weeks under bar.`,
  },
  {
    id: "B-friction",
    verdict: frictionVerdict,
    detail: `${frictionHits}/${recent.length} recent completions blocked/needs_context (${Math.round(frictionRate * 100)}%; STOP ≥ ${FRICTION_RATE * 100}%).`,
  },
  {
    id: "C-activation",
    verdict: activationVerdict,
    detail:
      firstTs == null
        ? "no activity yet."
        : `${Math.floor(daysSinceFirst)}d since first activity, ${chains.length} workflow chain(s). STOP = >${ACTIVATION_STALL_DAYS}d with zero chains.`,
  },
];
const overall: Verdict = triggers.some((t) => t.verdict === "STOP")
  ? "STOP"
  : triggers.some((t) => t.verdict === "WATCH")
    ? "WATCH"
    : "PASS";

if (asJson) {
  console.log(JSON.stringify({ funnel, northStar, activeDays: activeDays.size, windows, triggers, overall }, null, 2));
} else {
  const tick = (s: string | null) => (s ? `✓ ${day(s)}` : "— not yet");
  console.log("FORSVN — T0 activation ledger (local, no network)\n");
  if (!events.length) {
    console.log("No events yet. Run a skill that produces an artifact, then re-run this.");
  } else {
    console.log("Activation funnel");
    console.log(`  sessions started ......... ${funnel.sessions}`);
    console.log(`  first skill completed .... ${tick(funnel.first_skill_completed)}`);
    console.log(`  first artifact produced .. ${tick(funnel.first_artifact_produced)}`);
    console.log(`  first decision captured .. ${tick(funnel.first_decision_captured)}`);
    console.log(`  first workflow chain ..... ${tick(funnel.first_workflow_chain)}`);
    console.log(`  ★ north-star (chain ≤7d of install): ${northStar ? "HIT" : "not yet"}\n`);

    console.log(`Cadence — active days per rolling 7-day window (bar ≥ ${CADENCE_BAR})`);
    for (const w of windows) {
      const bar = "█".repeat(w.activeDays) + "·".repeat(Math.max(0, 7 - w.activeDays));
      const flag = w.activeDays >= CADENCE_BAR ? "" : "  ⚠ under bar";
      console.log(`  wk ending ${w.ending}  ${bar}  ${w.activeDays}/7${flag}`);
    }
    console.log("");

    console.log("STOP-and-fix triggers");
    for (const t of triggers) console.log(`  [${t.verdict.padEnd(5)}] ${t.id}: ${t.detail}`);
    console.log(`\n  OVERALL: ${overall}` + (overall === "STOP" ? "  → halt paid build; investigate friction before monetizing." : ""));
  }
}
