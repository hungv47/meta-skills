#!/usr/bin/env bun
// test-yaml-parser — unit tests for scripts/lib/simple-yaml.ts.
//
// Covers the inputs that routing.yaml currently uses (allOf, anyOf, noneOf,
// nested blocks) plus the quoted-comma inline-array case the prior parser
// mis-handled. Also asserts parity with the hooks/build-registry.mjs parser
// for promptSignals — the two parsers must agree on shared inputs since they
// both read routing.yaml.
//
// Usage: bun scripts/test-yaml-parser.ts   (exits 0 on pass, 1 on fail)

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseSimpleYaml } from "./lib/simple-yaml";
// @ts-ignore — .mjs module without ambient types
import { parsePromptSignals } from "../hooks/build-registry.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD_REGISTRY = join(__dirname, "..", "hooks", "build-registry.mjs");

type Case = { name: string; input: string; expected: unknown };

const cases: Case[] = [
  {
    name: "inline array with bareword tokens (current routing.yaml shape)",
    input: "allOf:\n  - [code, cleanup]\n  - [dead, code]\n",
    expected: { allOf: [["code", "cleanup"], ["dead", "code"]] },
  },
  {
    name: "inline array with quoted-comma string (latent landmine)",
    input: 'aliases: ["clean,up", code-cleanup, "dead-code"]\n',
    expected: { aliases: ["clean,up", "code-cleanup", "dead-code"] },
  },
  {
    name: "inline array with nested brackets",
    input: "matrix: [[1, 2], [3, 4]]\n",
    expected: { matrix: [[1, 2], [3, 4]] },
  },
  {
    name: "inline array with single-quoted comma",
    input: "labels: ['a,b', 'c', d]\n",
    expected: { labels: ["a,b", "c", "d"] },
  },
  {
    name: "empty inline array",
    input: "items: []\n",
    expected: { items: [] },
  },
  {
    name: "block-style array of quoted strings",
    input: 'phrases:\n  - "dead code"\n  - "remove unused"\n',
    expected: { phrases: ["dead code", "remove unused"] },
  },
];

let failed = 0;
for (const tc of cases) {
  try {
    const got = parseSimpleYaml(tc.input);
    const gotJson = JSON.stringify(got);
    const expJson = JSON.stringify(tc.expected);
    if (gotJson !== expJson) {
      console.error(`[FAIL] ${tc.name}`);
      console.error(`  expected: ${expJson}`);
      console.error(`  got:      ${gotJson}`);
      failed++;
    } else {
      console.log(`[PASS] ${tc.name}`);
    }
  } catch (err) {
    console.error(`[FAIL] ${tc.name} threw: ${(err as Error).message}`);
    failed++;
  }
}

// Parity test: directly invoke both parsers on the same routing.yaml input
// and compare. They are two implementations of the same grammar; drift
// between them silently corrupts the skill registry vs. capability-index.
// `parsePromptSignals` (.mjs, used by hooks/skill-registry.json) returns an
// object shaped like { phrases, allOf, anyOf, noneOf, minScore }; the .ts
// parser returns the same shape under `.promptSignals` when fed the full
// routing.yaml. Compare both.
const parityInputs: { name: string; yaml: string }[] = [
  {
    name: "baseline routing.yaml shape (block lists + inline-array allOf)",
    yaml: [
      "promptSignals:",
      "  phrases:",
      '    - "alpha"',
      '    - "beta gamma"',
      "  allOf:",
      "    - [code, cleanup]",
      "    - [dead, code]",
      "  anyOf:",
      '    - "refactor"',
      "  noneOf:",
      '    - "system design"',
      "  minScore: 6",
      "",
    ].join("\n"),
  },
  {
    name: "inline-array allOf with double-quoted comma (JSON.parse path on .mjs side)",
    yaml: [
      "promptSignals:",
      "  phrases:",
      '    - "a"',
      "  allOf:",
      '    - ["weight,1", "weight,2"]',
      "  anyOf: []",
      "  noneOf: []",
      "  minScore: 6",
      "",
    ].join("\n"),
  },
  {
    name: "inline-array allOf with single-quoted comma (fallback splitter path on .mjs side)",
    yaml: [
      "promptSignals:",
      "  phrases:",
      '    - "a"',
      "  allOf:",
      "    - ['weight,1', 'weight,2']",
      "  anyOf: []",
      "  noneOf: []",
      "  minScore: 6",
      "",
    ].join("\n"),
  },
  {
    name: "minScore default (7 when omitted on .ts side, 6 on .mjs side)",
    // NOTE: this case is asymmetric by design — parsers use different
    // defaults when minScore is absent. We probe with minScore present
    // to assert structural parity only.
    yaml: [
      "promptSignals:",
      "  phrases:",
      '    - "single"',
      "  allOf: []",
      "  anyOf: []",
      "  noneOf: []",
      "  minScore: 8",
      "",
    ].join("\n"),
  },
];

for (const tc of parityInputs) {
  const tsAll = parseSimpleYaml(tc.yaml) as { promptSignals: Record<string, unknown> };
  const tsSignals = tsAll.promptSignals;
  const mjsSignals = parsePromptSignals(tc.yaml);

  // Normalize: .mjs `parsePromptSignals` always emits the 5 keys even if
  // empty; the .ts parser surfaces only what's declared. Compare on the
  // common-keys union, treating missing as empty/default.
  const normalized = (sig: any) => ({
    phrases: sig?.phrases ?? [],
    allOf: sig?.allOf ?? [],
    anyOf: sig?.anyOf ?? [],
    noneOf: sig?.noneOf ?? [],
    minScore: sig?.minScore ?? null,
  });

  const ts = normalized(tsSignals);
  const mjs = normalized(mjsSignals);
  const tsJson = JSON.stringify(ts);
  const mjsJson = JSON.stringify(mjs);
  if (tsJson !== mjsJson) {
    console.error(`[FAIL] parity (${tc.name}): simple-yaml and build-registry.mjs disagree`);
    console.error(`  simple-yaml (.ts): ${tsJson}`);
    console.error(`  build-registry (.mjs): ${mjsJson}`);
    failed++;
  } else {
    console.log(`[PASS] parity (${tc.name}): both parsers produce ${tsJson}`);
  }
}

// Sanity: confirm hooks/build-registry.mjs --check still passes against the
// real repo (registry stays in sync). Defends against changes to either
// parser that would silently diverge from the committed registry.
const check = spawnSync("node", [BUILD_REGISTRY, "--check"], { encoding: "utf8" });
if (check.status !== 0) {
  console.error("[FAIL] hooks/build-registry.mjs --check failed:");
  console.error(check.stdout);
  console.error(check.stderr);
  failed++;
} else {
  console.log("[PASS] hooks/build-registry.mjs --check (registry is current)");
}

if (failed > 0) {
  console.error(`\n[test-yaml-parser] ${failed} failure(s)`);
  process.exit(1);
}
console.log(`\n[test-yaml-parser] PASS — ${cases.length + parityInputs.length + 1} assertions`);
