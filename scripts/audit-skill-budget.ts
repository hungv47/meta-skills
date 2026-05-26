#!/usr/bin/env bun
// Measure the prompt budget cost of every skill in the stack.
//
// For each skill:
//   - description char count (always loaded into model context as part of the
//     skill list system reminder)
//   - SKILL.md body char count + rough token estimate (chars / 4)
//   - frontmatter total
//   - promptSignals phrase count and cross-skill duplicates
//
// Output: ranked report. `--json` emits machine-readable; `--out=path` writes
// the human report to disk for diffing across migrations.

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOMAINS = ["meta", "research", "marketing", "product"];

type SkillBudget = {
  domain: string;
  id: string;
  description: string;
  descriptionChars: number;
  bodyChars: number;
  bodyLines: number;
  bodyTokensEstimate: number;
  frontmatterChars: number;
  promptSignalPhrases: string[];
  hasRoutingYaml: boolean;
  hasCapabilitySection: boolean;
};

function estimateTokens(chars: number): number {
  return Math.ceil(chars / 4);
}

function splitFrontmatter(text: string): { frontmatter: string; body: string } {
  if (!text.startsWith("---")) return { frontmatter: "", body: text };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { frontmatter: "", body: text };
  return {
    frontmatter: text.slice(0, end + 4),
    body: text.slice(end + 4).replace(/^\s*\n/, ""),
  };
}

function extractDescription(frontmatter: string): string {
  const lines = frontmatter.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/^description:\s*(.*)$/);
    if (!match) continue;
    let value = match[1].trim();
    if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
      return value.slice(1, -1);
    }
    if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) {
      return value.slice(1, -1);
    }
    if (value === "" || value === ">" || value === "|") {
      const collected: string[] = [];
      for (let j = i + 1; j < lines.length; j += 1) {
        const next = lines[j];
        if (/^[a-zA-Z_-]+:/.test(next)) break;
        collected.push(next.trim());
      }
      return collected.join(" ").trim();
    }
    return value;
  }
  return "";
}

function extractPromptSignalPhrases(routingYaml: string): string[] {
  const lines = routingYaml.split("\n");
  const phrases: string[] = [];
  let inPhrases = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^\s*phrases:\s*$/.test(line)) {
      inPhrases = true;
      continue;
    }
    if (!inPhrases) continue;
    const dashMatch = line.match(/^\s+-\s+"?([^"]+)"?\s*$/);
    if (dashMatch) {
      phrases.push(dashMatch[1].trim());
      continue;
    }
    if (line.trim() !== "" && !line.startsWith("  ")) break;
    if (line.trim() === "") continue;
    if (/^\s*\w+:/.test(line)) {
      inPhrases = false;
    }
  }
  return phrases;
}

function gatherSkills(): SkillBudget[] {
  const out: SkillBudget[] = [];
  for (const domain of DOMAINS) {
    const domainDir = join(ROOT, "skills", domain);
    if (!existsSync(domainDir)) continue;
    for (const id of readdirSync(domainDir)) {
      const skillDir = join(domainDir, id);
      const skillPath = join(skillDir, "SKILL.md");
      if (!existsSync(skillPath)) continue;
      const raw = readFileSync(skillPath, "utf-8");
      const { frontmatter, body } = splitFrontmatter(raw);
      const description = extractDescription(frontmatter);
      const routingPath = join(skillDir, "routing.yaml");
      const routingText = existsSync(routingPath) ? readFileSync(routingPath, "utf-8") : "";
      const promptSignalPhrases = routingText ? extractPromptSignalPhrases(routingText) : [];
      const hasCapabilitySection = /^capability:\s*$/m.test(routingText);
      out.push({
        domain,
        id,
        description,
        descriptionChars: description.length,
        bodyChars: body.length,
        bodyLines: body.split("\n").length,
        bodyTokensEstimate: estimateTokens(body.length),
        frontmatterChars: frontmatter.length,
        promptSignalPhrases,
        hasRoutingYaml: existsSync(routingPath),
        hasCapabilitySection,
      });
    }
  }
  return out.sort((a, b) => `${a.domain}/${a.id}`.localeCompare(`${b.domain}/${b.id}`));
}

function findDuplicatePhrases(skills: SkillBudget[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const skill of skills) {
    for (const phrase of skill.promptSignalPhrases) {
      const owners = map.get(phrase) ?? [];
      owners.push(`${skill.domain}/${skill.id}`);
      map.set(phrase, owners);
    }
  }
  for (const [phrase, owners] of map) {
    if (owners.length < 2) map.delete(phrase);
  }
  return map;
}

function formatHumanReport(skills: SkillBudget[]): string {
  const totalDescChars = skills.reduce((sum, s) => sum + s.descriptionChars, 0);
  const totalBodyChars = skills.reduce((sum, s) => sum + s.bodyChars, 0);
  const totalBodyTokens = skills.reduce((sum, s) => sum + s.bodyTokensEstimate, 0);

  const longDescriptions = skills
    .filter((s) => s.descriptionChars > 450)
    .sort((a, b) => b.descriptionChars - a.descriptionChars);

  const longBodies = [...skills]
    .sort((a, b) => b.bodyChars - a.bodyChars)
    .slice(0, 15);

  const duplicates = findDuplicatePhrases(skills);

  const missingRouting = skills.filter((s) => !s.hasRoutingYaml);
  const skillsWithCapability = skills.filter((s) => s.hasCapabilitySection);

  const lines: string[] = [];
  lines.push("# Skill Budget Audit");
  lines.push("");
  lines.push(`Total skills: ${skills.length}`);
  lines.push(`Skills with routing.yaml: ${skills.length - missingRouting.length}`);
  lines.push(`Skills with capability section in routing.yaml: ${skillsWithCapability.length}`);
  lines.push("");
  lines.push("## Always-loaded cost (descriptions)");
  lines.push("");
  lines.push(`Total description chars: ${totalDescChars}`);
  lines.push(`Estimated tokens (chars/4): ${estimateTokens(totalDescChars)}`);
  lines.push("");
  lines.push(`Descriptions over 450 chars: ${longDescriptions.length}`);
  if (longDescriptions.length > 0) {
    lines.push("");
    lines.push("| Skill | Chars |");
    lines.push("|---|---:|");
    for (const skill of longDescriptions) {
      lines.push(`| ${skill.domain}/${skill.id} | ${skill.descriptionChars} |`);
    }
  }
  lines.push("");
  lines.push("## On-trigger body cost (SKILL.md bodies)");
  lines.push("");
  lines.push(`Total body chars: ${totalBodyChars}`);
  lines.push(`Estimated tokens (chars/4): ${totalBodyTokens}`);
  lines.push("");
  lines.push("Top 15 longest bodies:");
  lines.push("");
  lines.push("| Skill | Chars | Tokens~ | Lines |");
  lines.push("|---|---:|---:|---:|");
  for (const skill of longBodies) {
    lines.push(
      `| ${skill.domain}/${skill.id} | ${skill.bodyChars} | ${skill.bodyTokensEstimate} | ${skill.bodyLines} |`,
    );
  }
  lines.push("");
  lines.push("## Duplicate prompt-signal phrases");
  lines.push("");
  if (duplicates.size === 0) {
    lines.push("None.");
  } else {
    lines.push(`Phrases triggering more than one skill: ${duplicates.size}`);
    lines.push("");
    lines.push("| Phrase | Skills |");
    lines.push("|---|---|");
    for (const [phrase, owners] of [...duplicates.entries()].sort()) {
      lines.push(`| ${phrase} | ${owners.join(", ")} |`);
    }
  }
  lines.push("");
  if (missingRouting.length > 0) {
    lines.push("## Skills missing routing.yaml");
    lines.push("");
    for (const skill of missingRouting) {
      lines.push(`- ${skill.domain}/${skill.id}`);
    }
    lines.push("");
  }
  lines.push("## Per-skill breakdown");
  lines.push("");
  lines.push("| Skill | DescChars | BodyChars | BodyTokens~ | BodyLines | Phrases | Capability |");
  lines.push("|---|---:|---:|---:|---:|---:|:---:|");
  for (const skill of skills) {
    lines.push(
      `| ${skill.domain}/${skill.id} | ${skill.descriptionChars} | ${skill.bodyChars} | ${skill.bodyTokensEstimate} | ${skill.bodyLines} | ${skill.promptSignalPhrases.length} | ${skill.hasCapabilitySection ? "Y" : ""} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

function main(): void {
  const skills = gatherSkills();
  const json = process.argv.includes("--json");
  const outArg = process.argv.find((arg) => arg.startsWith("--out="));

  if (json) {
    process.stdout.write(JSON.stringify({ skills }, null, 2));
    return;
  }

  const report = formatHumanReport(skills);
  if (outArg) {
    const target = join(ROOT, outArg.slice("--out=".length));
    writeFileSync(target, report);
    console.log(`[audit-skill-budget] Wrote report to ${outArg.slice("--out=".length)}.`);
    return;
  }
  process.stdout.write(report);
}

main();
