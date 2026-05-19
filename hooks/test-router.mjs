#!/usr/bin/env node
/**
 * Test harness for the skill router.
 * Runs test cases and reports pass/fail.
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOOK = join(__dirname, "user-prompt-submit-skill-router.mjs");

const tests = [
  ["I need to write some social media copy for LinkedIn", "social-copy"],
  ["Who is our target audience?", "icp-research"],
  ["Do a competitive analysis of the CRM market", "market-research"],
  ["Why is our signup rate dropping?", "diagnose"],
  ["What should we build next? Prioritize the options", "prioritize"],
  ["Model the funnel from traffic to revenue", "funnel-planner"],
  ["Create an eval loop for the new pricing page", "eval-loop"],
  ["Evaluate landing page analytics for the pricing page", "lp-eval"],
  ["Build our brand identity and voice guidelines", "brand-system"],
  ["Write copy for the hero section headline", "copywriting"],
  ["Plan our go to market strategy", "campaign-plan"],
  ["This text sounds like AI wrote it, humanize it", "humanize"],
  ["Polish this vietnamese text for bro tone", "vn-tone"],
  ["Do an SEO audit of our site", "seo"],
  ["Write Meta retargeting ad copy for this offer", "ad-copy"],
  ["Map the user flow for onboarding", "user-flow"],
  ["Design the tech stack and database schema", "system-architecture"],
  ["Clean up dead code in the codebase", "code-cleanup"],
  ["Write documentation for the API", "docs-writing"],
  ["I have an idea, help me scope this", "discover"],
  ["Debate this from multiple perspectives", "agents-panel"],
  ["Break this down into tasks with acceptance criteria", "task-breakdown"],
  ["Review this with fresh eyes", "fresh-eyes"],
  ["Which skill should I use for this?", "orchestrate-meta"],
];

let pass = 0;
let fail = 0;

for (const [prompt, expected] of tests) {
  const input = JSON.stringify({ prompt, session_id: "test" });
  try {
    const raw = execSync(`node "${HOOK}"`, {
      input,
      encoding: "utf-8",
      timeout: 5000,
    }).trim();

    let matched = "NONE";
    if (raw && raw !== "{}") {
      const json = JSON.parse(raw);
      const ctx = json.hookSpecificOutput?.additionalContext || "";
      const m = ctx.match(/skillRouter: ({.*})/);
      if (m) {
        const data = JSON.parse(m[1]);
        matched = data.matched?.[0] || "NONE";
      }
    }

    if (matched === expected) {
      console.log(`  ✓ ${expected}`);
      pass++;
    } else {
      console.log(`  ✗ Expected: ${expected}, Got: ${matched}`);
      console.log(`    Prompt: "${prompt}"`);
      fail++;
    }
  } catch (err) {
    console.log(`  ✗ ERROR for ${expected}: ${err.message}`);
    fail++;
  }
}

console.log(`\n${pass}/${pass + fail} passed`);
if (fail > 0) process.exit(1);
