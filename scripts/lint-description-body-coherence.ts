#!/usr/bin/env bun
// Lint description-body coherence per `references/slow-update-fence.md` neighbor
// concern: the router sees `routing.yaml` (promptSignals + capability.summary +
// route.use_when / not_when); the agent sees SKILL.md body. They can quietly
// disagree (koylan, X 2026-05-26: "Description and body are two different
// surfaces. They can quietly disagree, and only end-to-end task tests catch it.")
//
// Static lint catches the worst of it. It does not replace end-to-end eval
// (Phase 2). It catches:
//
//   1. promptSignals phrases the SKILL.md body never references.
//      Router fires the skill on a trigger the body has no procedure for.
//
//   2. capability.summary noun phrases missing from the body.
//      The agent gets a body that does not match what was promised in the router.
//
//   3. route.not_when targets the body never mentions as exclusions.
//      The router knows "don't use for X"; the body should too — otherwise
//      the agent may drift into out-of-scope work once activated.
//
//   4. Description (frontmatter) mentions a sibling skill the routing.yaml
//      does not list in not_when. Cross-stack hygiene.
//
// Run modes:
//   - default: structural report, exit 0 (informational)
//   - --strict: exit 1 if any HIGH-severity issue found
//   - --json: machine-readable output
//
// LLM-judge layer (open-ended semantic coherence) is deferred to Phase 2
// alongside per-skill eval sets — that is where end-to-end coherence actually
// gets tested.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOMAINS = ["meta", "research", "marketing", "product"];

type Severity = "high" | "medium" | "low";

type Issue = {
  skill: string;
  severity: Severity;
  kind: string;
  detail: string;
};

type SkillContext = {
  id: string;
  domain: string;
  description: string;
  body: string;
  routing: string;
  promptPhrases: string[];
  capabilitySummary: string;
  useWhen: string[];
  notWhen: string[];
};

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
  const m = frontmatter.match(/^description:\s*"([^"]*)"/m);
  return m ? m[1] : "";
}

function extractYamlListUnder(yaml: string, parentPath: string[]): string[] {
  // Walk YAML by indent. parentPath is the key chain to descend into.
  // Returns dash-list items. Strings only.
  const lines = yaml.split("\n");
  let depth = 0;
  let i = 0;
  for (const key of parentPath) {
    const wanted = new RegExp(`^${"  ".repeat(depth)}${key}:\\s*$`);
    while (i < lines.length && !wanted.test(lines[i])) i += 1;
    if (i === lines.length) return [];
    i += 1;
    depth += 1;
  }
  const out: string[] = [];
  const dashRe = new RegExp(`^${"  ".repeat(depth)}-\\s+["']?(.+?)["']?\\s*$`);
  for (; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === "") continue;
    if (line.startsWith(" ".repeat(depth * 2)) && !line.startsWith(" ".repeat((depth + 1) * 2))) {
      // peer key at the parent's level — stop
      if (!dashRe.test(line)) break;
    }
    const m = line.match(dashRe);
    if (m) {
      out.push(m[1].trim());
      continue;
    }
    // line less indented than expected — section ended
    if (!line.startsWith(" ".repeat(depth * 2))) break;
  }
  return out;
}

function extractCapabilitySummary(yaml: string): string {
  const m = yaml.match(/^\s{2}summary:\s*"([^"]*)"/m);
  return m ? m[1] : "";
}

function gatherSkillIds(): Set<string> {
  const ids = new Set<string>();
  for (const domain of DOMAINS) {
    const domainDir = join(ROOT, "skills", domain);
    if (!existsSync(domainDir)) continue;
    for (const id of readdirSync(domainDir)) {
      if (existsSync(join(domainDir, id, "SKILL.md"))) ids.add(id);
    }
  }
  return ids;
}

let KNOWN_SKILL_IDS: Set<string> = new Set();

function gatherContexts(): SkillContext[] {
  KNOWN_SKILL_IDS = gatherSkillIds();
  const out: SkillContext[] = [];
  for (const domain of DOMAINS) {
    const domainDir = join(ROOT, "skills", domain);
    if (!existsSync(domainDir)) continue;
    for (const id of readdirSync(domainDir)) {
      const skillDir = join(domainDir, id);
      const skillPath = join(skillDir, "SKILL.md");
      const routingPath = join(skillDir, "routing.yaml");
      if (!existsSync(skillPath) || !existsSync(routingPath)) continue;
      const raw = readFileSync(skillPath, "utf-8");
      const { frontmatter, body } = splitFrontmatter(raw);
      const routing = readFileSync(routingPath, "utf-8");
      out.push({
        id,
        domain,
        description: extractDescription(frontmatter),
        body,
        routing,
        promptPhrases: extractYamlListUnder(routing, ["promptSignals", "phrases"]),
        capabilitySummary: extractCapabilitySummary(routing),
        useWhen: extractYamlListUnder(routing, ["capability", "route", "use_when"]),
        notWhen: extractYamlListUnder(routing, ["capability", "route", "not_when"]),
      });
    }
  }
  return out.sort((a, b) => `${a.domain}/${a.id}`.localeCompare(`${b.domain}/${b.id}`));
}

function bodyMentions(body: string, phrase: string): boolean {
  // Match phrase against lower-cased body. Skip stopword-only phrases.
  const lower = body.toLowerCase();
  const target = phrase.toLowerCase().trim();
  if (target.length < 3) return true;
  // Word-boundary search for short phrases; substring for longer ones.
  if (target.split(/\s+/).length === 1) {
    const re = new RegExp(`\\b${target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    return re.test(lower);
  }
  return lower.includes(target);
}

function nounPhrasesFrom(summary: string): string[] {
  // Heuristic: pick noun-phrasey tokens — anything that is 4+ chars, not in a
  // stopword list, not all caps. Good enough for "did the body talk about it"
  // without a full NLP stack.
  const stop = new Set([
    "with","from","that","this","when","what","into","over","under","also",
    "have","than","then","such","each","most","more","less","only","just",
    "they","them","their","which","while","where","whose","whom","both",
    "should","could","would","will","might","must","being","does","done",
  ]);
  return summary
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !stop.has(w));
}

function checkSkill(skill: SkillContext): Issue[] {
  const id = `${skill.domain}/${skill.id}`;
  const issues: Issue[] = [];

  // 1. promptPhrases the body never references at the *concept* level.
  // We decompose each trigger phrase into noun tokens. A phrase counts as
  // covered if AT LEAST ONE token (length >= 4, non-stopword) appears in the
  // body. This avoids over-triggering on verbatim-mismatch ("should we kill
  // this ad" vs body using "ad performance"). What we are after is full-phrase
  // orphaning — the body never even acknowledges the conceptual area.
  const orphanPhrases = skill.promptPhrases.filter((p) => {
    if (bodyMentions(skill.body, p)) return false;
    const tokens = nounPhrasesFrom(p);
    if (tokens.length === 0) return false;
    const anyHit = tokens.some((t) => bodyMentions(skill.body, t));
    return !anyHit;
  });

  // Severity: HIGH only when this is systemic (>= 50% of phrases orphaned AND
  // at least 3 orphans). Otherwise individual orphans are MEDIUM — they may
  // signal trigger drift but not router-agent divergence at the skill level.
  const total = skill.promptPhrases.length;
  const systemic = total >= 3 && orphanPhrases.length >= 3 && orphanPhrases.length / total >= 0.5;
  if (systemic) {
    issues.push({
      skill: id,
      severity: "high",
      kind: "systemic-trigger-drift",
      detail: `${orphanPhrases.length} of ${total} routing.yaml trigger phrases have zero conceptual overlap with the SKILL.md body. Examples: ${orphanPhrases.slice(0, 4).map((p) => `"${p}"`).join(", ")}`,
    });
  } else {
    for (const phrase of orphanPhrases) {
      issues.push({
        skill: id,
        severity: "medium",
        kind: "orphan-prompt-phrase",
        detail: `routing.yaml triggers on "${phrase}" but no concept-level overlap with body.`,
      });
    }
  }

  // 2. capability.summary noun phrases missing from body.
  const summaryNouns = [...new Set(nounPhrasesFrom(skill.capabilitySummary))];
  const missingNouns = summaryNouns.filter((n) => !bodyMentions(skill.body, n));
  if (summaryNouns.length > 0 && missingNouns.length / summaryNouns.length > 0.5) {
    issues.push({
      skill: id,
      severity: "high",
      kind: "summary-body-divergence",
      detail: `capability.summary nouns mostly absent from body: ${missingNouns.slice(0, 6).join(", ")}`,
    });
  } else if (missingNouns.length >= 3) {
    issues.push({
      skill: id,
      severity: "medium",
      kind: "summary-body-divergence",
      detail: `capability.summary nouns absent from body: ${missingNouns.slice(0, 6).join(", ")}`,
    });
  }

  // 3. not_when references sibling SKILLS that neither the body nor the
  // frontmatter description acknowledges. The agent sees both surfaces once
  // activated, so a sibling mentioned in the description counts as
  // acknowledged. We only flag captured tokens that match a real skill ID —
  // avoids false positives like "-> out of scope" capturing "out".
  const bodyPlusDescription = `${skill.description}\n${skill.body}`;
  for (const nw of skill.notWhen) {
    const m = nw.match(/->\s*([\w-]+)/);
    if (!m) continue;
    const sibling = m[1];
    if (!KNOWN_SKILL_IDS.has(sibling)) continue;
    if (sibling === skill.id) continue;
    if (!bodyMentions(bodyPlusDescription, sibling)) {
      issues.push({
        skill: id,
        severity: "medium",
        kind: "unacknowledged-not-when",
        detail: `routing.yaml says "not for X -> ${sibling}" but neither body nor description mentions ${sibling}.`,
      });
    }
  }

  // 4. Frontmatter description hints at exclusions not in routing.yaml.
  // Heuristic: description contains "Not for" / "Not when" but routing.yaml
  // not_when is empty.
  if (/not\s+for|not\s+when/i.test(skill.description) && skill.notWhen.length === 0) {
    issues.push({
      skill: id,
      severity: "low",
      kind: "description-exclusion-not-routed",
      detail: "frontmatter description names exclusions but routing.yaml not_when is empty.",
    });
  }

  return issues;
}

function main(): void {
  const json = process.argv.includes("--json");
  const strict = process.argv.includes("--strict");
  const skills = gatherContexts();
  const issues: Issue[] = skills.flatMap(checkSkill);

  if (json) {
    process.stdout.write(JSON.stringify({ skills: skills.length, issues }, null, 2));
    if (strict && issues.some((i) => i.severity === "high")) process.exit(1);
    return;
  }

  const bySeverity: Record<Severity, Issue[]> = { high: [], medium: [], low: [] };
  for (const issue of issues) bySeverity[issue.severity].push(issue);

  const lines: string[] = [];
  lines.push("# Description-Body Coherence Lint");
  lines.push("");
  lines.push(`Skills scanned: ${skills.length}`);
  lines.push(`Issues: ${issues.length} (high: ${bySeverity.high.length}, medium: ${bySeverity.medium.length}, low: ${bySeverity.low.length})`);
  lines.push("");
  lines.push(
    "Convention: router sees routing.yaml (promptSignals + capability.summary + route.use_when/not_when). Agent sees SKILL.md body. They can quietly disagree; this lint catches the worst.",
  );
  lines.push("");
  for (const sev of ["high", "medium", "low"] as Severity[]) {
    const group = bySeverity[sev];
    if (group.length === 0) continue;
    lines.push(`## ${sev.toUpperCase()} (${group.length})`);
    lines.push("");
    lines.push("| Skill | Kind | Detail |");
    lines.push("|---|---|---|");
    for (const issue of group) {
      lines.push(`| ${issue.skill} | ${issue.kind} | ${issue.detail.replace(/\|/g, "\\|")} |`);
    }
    lines.push("");
  }
  process.stdout.write(lines.join("\n"));

  if (strict && bySeverity.high.length > 0) {
    console.error("");
    console.error(`[lint-description-body-coherence] FAIL — ${bySeverity.high.length} HIGH-severity issue(s).`);
    process.exit(1);
  }
}

main();
