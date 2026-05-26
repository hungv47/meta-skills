#!/usr/bin/env bun
// Trigger-eval harness.
//
// Loads tests/triggers/<skill>.jsonl fixtures and exercises the production
// prompt-router scorer (hooks/skill-router-core.mjs) against each prompt.
//
// Fixture record:
//   {"prompt": "...", "expect": "trigger" | "skip", "reason": "..."}
//
// For each fixture under tests/triggers/<skill>.jsonl:
//   - expect="trigger" passes if <skill> is the TOP match for the prompt across
//     the entire registry (not just any match — top match wins routing).
//   - expect="skip" passes if <skill> is NOT a match for the prompt (score
//     below its own minScore OR suppressed by noneOf).
//
// Exits 0 on full pass, 1 on any mismatch. Wire into CI as a gate on routing /
// promptSignals changes.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  normalizePromptText,
  compilePromptSignals,
  matchPromptWithReason,
} from "../hooks/skill-router-core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REGISTRY_PATH = join(ROOT, "hooks", "skill-registry.json");
const FIXTURES_DIR = join(ROOT, "tests", "triggers");

type Expect = "trigger" | "skip";

type Fixture = {
  prompt: string;
  expect: Expect;
  reason: string;
};

type Outcome = {
  skill: string;
  prompt: string;
  expect: Expect;
  reason: string;
  pass: boolean;
  diagnostic: string;
};

type CompiledRegistry = Record<string, ReturnType<typeof compilePromptSignals>>;

function loadRegistry(): CompiledRegistry {
  const raw = readFileSync(REGISTRY_PATH, "utf-8");
  const data = JSON.parse(raw) as { skills: Record<string, unknown> };
  const compiled: CompiledRegistry = {};
  for (const [name, signals] of Object.entries(data.skills)) {
    compiled[name] = compilePromptSignals(signals as Record<string, unknown>);
  }
  return compiled;
}

function loadFixtures(skill: string): Fixture[] {
  const path = join(FIXTURES_DIR, `${skill}.jsonl`);
  if (!existsSync(path)) return [];
  const raw = readFileSync(path, "utf-8");
  return raw
    .split(/\r?\n/)
    .map((line, idx) => ({ line: line.trim(), idx: idx + 1 }))
    .filter((entry) => entry.line.length > 0 && !entry.line.startsWith("//"))
    .map((entry) => {
      let parsed: Fixture;
      try {
        parsed = JSON.parse(entry.line) as Fixture;
      } catch (err) {
        throw new Error(`${skill}.jsonl line ${entry.idx}: ${(err as Error).message}`);
      }
      if (typeof parsed.prompt !== "string" || !parsed.prompt) {
        throw new Error(`${skill}.jsonl line ${entry.idx}: 'prompt' must be a non-empty string`);
      }
      if (parsed.expect !== "trigger" && parsed.expect !== "skip") {
        throw new Error(`${skill}.jsonl line ${entry.idx}: 'expect' must be 'trigger' or 'skip'`);
      }
      if (typeof parsed.reason !== "string" || !parsed.reason) {
        throw new Error(`${skill}.jsonl line ${entry.idx}: 'reason' must be a non-empty string`);
      }
      return parsed;
    });
}

function scoreAll(prompt: string, registry: CompiledRegistry): Array<{ skill: string; score: number; reason: string; matched: boolean }> {
  const normalized = normalizePromptText(prompt);
  const out: Array<{ skill: string; score: number; reason: string; matched: boolean }> = [];
  for (const [skill, compiled] of Object.entries(registry)) {
    const result = matchPromptWithReason(normalized, compiled);
    out.push({ skill, score: result.score, reason: result.reason, matched: result.matched });
  }
  return out;
}

function evaluate(skill: string, fixture: Fixture, registry: CompiledRegistry): Outcome {
  const scored = scoreAll(fixture.prompt, registry);
  const matched = scored.filter((s) => s.matched).sort((a, b) => b.score - a.score);
  const self = scored.find((s) => s.skill === skill);
  if (!self) {
    return {
      skill,
      prompt: fixture.prompt,
      expect: fixture.expect,
      reason: fixture.reason,
      pass: false,
      diagnostic: `skill not found in registry`,
    };
  }

  if (fixture.expect === "trigger") {
    if (!self.matched) {
      return {
        skill,
        prompt: fixture.prompt,
        expect: fixture.expect,
        reason: fixture.reason,
        pass: false,
        diagnostic: `expected trigger but ${skill} did not match: ${self.reason}`,
      };
    }
    const top = matched[0];
    if (top.skill !== skill) {
      // Tie at top — pass if our skill is tied for first.
      if (top.score === self.score) {
        const tiedSkills = matched.filter((m) => m.score === self.score).map((m) => m.skill);
        return {
          skill,
          prompt: fixture.prompt,
          expect: fixture.expect,
          reason: fixture.reason,
          pass: true,
          diagnostic: `tied at top (${self.score}) with: ${tiedSkills.join(", ")}`,
        };
      }
      return {
        skill,
        prompt: fixture.prompt,
        expect: fixture.expect,
        reason: fixture.reason,
        pass: false,
        diagnostic: `expected ${skill} to win, but ${top.skill} won (${top.score} vs ${self.score})`,
      };
    }
    return {
      skill,
      prompt: fixture.prompt,
      expect: fixture.expect,
      reason: fixture.reason,
      pass: true,
      diagnostic: `top match @${self.score}: ${self.reason}`,
    };
  }

  // expect === "skip"
  if (self.matched) {
    return {
      skill,
      prompt: fixture.prompt,
      expect: fixture.expect,
      reason: fixture.reason,
      pass: false,
      diagnostic: `expected skip but ${skill} matched: ${self.reason}`,
    };
  }
  return {
    skill,
    prompt: fixture.prompt,
    expect: fixture.expect,
    reason: fixture.reason,
    pass: true,
    diagnostic: `correctly skipped: ${self.reason}`,
  };
}

function ensureRegistryFresh(): void {
  // Hard-fail if the registry is older than any routing.yaml — eval results
  // would be against stale rules. Surface the fix, don't paper over it.
  const registryMtime = statSync(REGISTRY_PATH).mtimeMs;
  const skillDirs = ["skills/meta", "skills/research", "skills/marketing", "skills/product"];
  for (const dir of skillDirs) {
    const entries = readdirSync(join(ROOT, dir));
    for (const entry of entries) {
      const routingPath = join(ROOT, dir, entry, "routing.yaml");
      if (!existsSync(routingPath)) continue;
      const mtime = statSync(routingPath).mtimeMs;
      if (mtime > registryMtime) {
        console.error(`[eval-triggers] Registry is stale: ${dir}/${entry}/routing.yaml is newer than hooks/skill-registry.json.`);
        console.error(`[eval-triggers] Run: node hooks/build-registry.mjs`);
        process.exit(2);
      }
    }
  }
}

function main(): void {
  ensureRegistryFresh();

  const registry = loadRegistry();
  const skills = Object.keys(registry).sort();
  const outcomes: Outcome[] = [];
  const missing: string[] = [];

  for (const skill of skills) {
    const fixtures = loadFixtures(skill);
    if (fixtures.length === 0) {
      missing.push(skill);
      continue;
    }
    for (const fixture of fixtures) {
      outcomes.push(evaluate(skill, fixture, registry));
    }
  }

  const failed = outcomes.filter((o) => !o.pass);
  const passed = outcomes.length - failed.length;

  // Per-skill summary
  const bySkill = new Map<string, Outcome[]>();
  for (const o of outcomes) {
    if (!bySkill.has(o.skill)) bySkill.set(o.skill, []);
    bySkill.get(o.skill)!.push(o);
  }

  console.log(`[eval-triggers] ${skills.length} skills, ${outcomes.length} fixtures.`);
  for (const skill of [...bySkill.keys()].sort()) {
    const list = bySkill.get(skill)!;
    const skillFailed = list.filter((o) => !o.pass);
    const marker = skillFailed.length === 0 ? "PASS" : "FAIL";
    const pos = list.filter((o) => o.expect === "trigger").length;
    const neg = list.filter((o) => o.expect === "skip").length;
    console.log(`  [${marker}] ${skill}: ${list.length - skillFailed.length}/${list.length} (${pos} pos + ${neg} skip)`);
    for (const f of skillFailed) {
      console.log(`         × ${f.expect} "${f.prompt}" — ${f.diagnostic}`);
    }
  }

  if (missing.length > 0) {
    console.log(`[eval-triggers] ${missing.length} skill(s) without fixtures:`);
    for (const skill of missing) console.log(`  - ${skill}`);
  }

  if (failed.length > 0) {
    console.error(`[eval-triggers] FAIL — ${failed.length}/${outcomes.length} mismatch(es).`);
    process.exit(1);
  }

  if (process.argv.includes("--require-all") && missing.length > 0) {
    console.error(`[eval-triggers] FAIL — ${missing.length} skill(s) missing fixtures under --require-all.`);
    process.exit(1);
  }

  console.log(`[eval-triggers] PASS — ${passed}/${outcomes.length} fixtures.`);
}

main();
