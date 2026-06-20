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
  ["Create an eval loop for the new pricing page", "run-pipeline"],
  ["Evaluate landing page analytics for the pricing page", "evaluate-landing-page"],
  // P0-C eval<->brief separation: bare eval phrasings (no "analytics" crutch)
  // must reach evaluate-landing-page, not brief-landing-page; and pure brief
  // phrasings must still reach brief-landing-page. Pre-fix, the first three
  // routed to brief-landing-page (phrase "landing page" +6, no "evaluate" veto).
  ["Evaluate my landing page", "evaluate-landing-page"],
  ["Can you evaluate the landing page?", "evaluate-landing-page"],
  ["evaluate this landing page for me", "evaluate-landing-page"],
  ["I need a landing page brief", "brief-landing-page"],
  ["Write a new landing page brief for the launch", "brief-landing-page"],
  ["Build our brand identity and voice guidelines", "create-brand"],
  ["Write copy for the hero section headline", "write-copy"],
  ["Plan our go to market strategy", "plan-campaign"],
  ["This text sounds like AI wrote it, humanize it", "humanmaxxing"],
  ["Polish this vietnamese text for bro tone", "polish-vn"],
  ["Do an SEO audit of our site", "optimize-seo"],
  ["Track our AI Overview citations and AI referral traffic", "monitor-aeo"],
  ["Build an app store preview brief with screenshots and interaction beats", "brief-app-preview"],
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

// ---------------------------------------------------------------------------
// A8 — /forsvn nudge: a cross-domain / multi-step ask nudges the brain (target
// "forsvn"); a clean single-domain ask keeps its leaf suggestion.
// ---------------------------------------------------------------------------

function routeTelemetry(prompt) {
  const input = JSON.stringify({ prompt, session_id: "test" });
  const raw = execSync(`node "${HOOK}"`, { input, encoding: "utf-8", timeout: 5000 }).trim();
  if (!raw || raw === "{}") return { data: null, ctx: "" };
  const json = JSON.parse(raw);
  const ctx = json.hookSpecificOutput?.additionalContext || "";
  const m = ctx.match(/skillRouter: ({.*})/);
  return { data: m ? JSON.parse(m[1]) : null, ctx };
}

const nudgeTests = [
  // cross-domain (marketing write-ad + research-icp) → nudge
  { prompt: "write meta ads and figure out our target audience and ICP", nudge: true },
  // multi-step + high-confidence single domain → nudge (write-ad scores >=10 via
  // two phrase hits; "ship this" makes it multi-step-shaped)
  { prompt: "ship this campaign — write the primary text and the ad headline", nudge: true },
  // clean single-domain ad ask → leaf, no nudge
  { prompt: "Write Meta retargeting ad copy for this offer", nudge: false },
];

for (const { prompt, nudge } of nudgeTests) {
  try {
    const { data, ctx } = routeTelemetry(prompt);
    const isNudge = data?.target === "forsvn" && /Skill\(forsvn\)/.test(ctx);
    if (isNudge === nudge) {
      console.log(`  ✓ A8 ${nudge ? "nudge" : "leaf"}: "${prompt.slice(0, 40)}…"`);
      pass++;
    } else {
      console.log(`  ✗ A8 expected ${nudge ? "nudge" : "leaf"}, got ${isNudge ? "nudge" : "leaf"}`);
      console.log(`    Prompt: "${prompt}"`);
      fail++;
    }
  } catch (err) {
    console.log(`  ✗ A8 ERROR: ${err.message}`);
    fail++;
  }
}

console.log(`\n${pass}/${pass + fail} passed`);
if (fail > 0) process.exit(1);
