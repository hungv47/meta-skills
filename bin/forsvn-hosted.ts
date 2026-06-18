#!/usr/bin/env bun
// forsvn-hosted — the soft-client CLI a pack-consuming skill calls to (maybe)
// upgrade to hosted Pro data (U9). Open-core: with no key it degrades to local,
// prints a clear LOCAL marker, and exits 0 — it NEVER blocks a skill run.
//
// Usage:
//   bun skills/bin/forsvn-hosted.ts status
//   bun skills/bin/forsvn-hosted.ts pack producthunt --local-verified 2026-01-01 [--json]
//   bun skills/bin/forsvn-hosted.ts context [key] [--json]
//   bun skills/bin/forsvn-hosted.ts meter render_relay [1]
//
// `pack`: prints the CURRENT pack to stdout when entitled AND fresher than the
// client snapshot; otherwise prints `LOCAL <reason>` to stderr and nothing to
// stdout (the skill then reads its build-time mirror). Always exit 0.

import { fetchCurrentPack, fetchContextBundle, meter, status } from "./lib/hosted-api.ts";

function flag(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}
const JSON_OUT = process.argv.includes("--json");
const [cmd, arg] = process.argv.slice(2).filter((a) => !a.startsWith("--"));

async function main() {
  switch (cmd) {
    case "status": {
      const s = await status();
      if (JSON_OUT) return void console.log(JSON.stringify(s));
      if (!s.entitled) return void console.log("free / local-only (no hosted entitlement — packs + context come from local snapshots)");
      console.log(`Pro (${s.plan}) — credits ${s.balance?.remaining}/${s.balance?.included} remaining${s.balance?.overage ? `, overage ${s.balance.overage}` : ""}`);
      return;
    }
    case "pack": {
      if (!arg) return fail("pack requires a <platform>");
      const r = await fetchCurrentPack(arg, flag("local-verified") ?? null);
      if (JSON_OUT) return void console.log(JSON.stringify(r));
      if (r.source === "hosted") {
        process.stderr.write(`HOSTED ${arg} (current, verified ${r.lastVerified})\n`);
        process.stdout.write(r.content);
      } else {
        process.stderr.write(`LOCAL ${r.reason}\n`); // skill reads its mirror
      }
      return;
    }
    case "context": {
      const r = await fetchContextBundle();
      if (JSON_OUT) return void console.log(JSON.stringify(r));
      if (r.source !== "hosted") return void process.stderr.write(`LOCAL ${r.reason}\n`);
      if (arg) return void process.stdout.write(r.context[arg] ?? "");
      for (const [k, v] of Object.entries(r.context)) console.log(`## ${k}\n\n${v}\n`);
      return;
    }
    case "meter": {
      if (!arg) return fail("meter requires an <action>");
      const units = flag("units") ? Number(flag("units")) : undefined;
      const r = await meter(arg, units);
      console.log(JSON.stringify(r ?? { metered: false, reason: "no_key_or_unreachable" }));
      return;
    }
    default:
      return fail(`unknown command "${cmd ?? ""}". Use: status | pack | context | meter`);
  }
}

function fail(msg: string) {
  console.error(`forsvn-hosted: ${msg}`);
  process.exit(2);
}

main().catch((e) => {
  // Even an unexpected error must not block the skill — degrade to local.
  process.stderr.write(`LOCAL error (${e instanceof Error ? e.message : "unknown"})\n`);
  process.exit(0);
});
