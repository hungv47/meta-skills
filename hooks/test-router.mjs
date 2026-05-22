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
  ["I need to write some social media copy for LinkedIn", "write-social"],
  ["Who is our target audience?", "research-icp"],
  ["Do a competitive analysis of the CRM market", "research-market"],
  ["Why is our signup rate dropping?", "diagnose"],
  ["What should we build next? Prioritize the options", "prioritize"],
  ["Model the funnel from traffic to revenue", "plan-funnel"],
  ["Gather our platform analytics evidence for our X and YouTube accounts", "research-platform"],
  ["Create an eval loop for the new pricing page", "run-eval-loop"],
  ["Evaluate landing page analytics for the pricing page", "evaluate-landing-page"],
  ["Build our brand identity and voice guidelines", "create-brand"],
  ["Write copy for the hero section headline", "write-copy"],
  ["Plan our go to market strategy", "plan-campaign"],
  ["This text sounds like AI wrote it, humanize it", "humanmaxxing"],
  ["Polish this vietnamese text for bro tone", "polish-vn"],
  ["Do an SEO audit of our site", "optimize-seo"],
  ["Write Meta retargeting ad copy for this offer", "write-ad"],
  ["Map the user flow for onboarding", "map-user-flow"],
  ["Design the tech stack and database schema", "architect-system"],
  ["Clean up dead code in the codebase", "clean-code"],
  ["Write documentation for the API", "write-docs"],
  ["I have an idea, help me scope this", "discover"],
  ["Debate this from multiple perspectives", "debate-agents"],
  ["Break this down into tasks with acceptance criteria", "breakdown-tasks"],
  ["Review this with fresh eyes", "review-work"],
  ["Which skill should I use for this?", "forsvn"],
  ["Where do I start?", "forsvn"],
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
