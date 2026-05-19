#!/usr/bin/env node
/**
 * Remove source-specific residue from public reference files.
 *
 * Public references should encode stack-owned patterns, rubrics, and examples.
 * Raw provenance belongs in private research notes, not shipped skill packages.
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const STACKS = ["research-skills", "marketing-skills", "product-skills", "meta-skills"];

const SOCIAL_URL_RE =
  /https?:\/\/(?:www\.)?(?:x|twitter)\.com\/[^)\s|>]+|https?:\/\/(?:www\.)?linkedin\.com\/posts\/[^)\s|>]+|https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/[^)\s|>]+|https?:\/\/(?:www\.)?youtube\.com\/shorts\/[^)\s|>]+|https?:\/\/(?:www\.)?tiktok\.com\/@[^)\s|>]+/gi;

const GENERIC_HANDLES = new Set([
  "brand",
  "creator",
  "handle",
  "tool",
  "kol",
  "kol_a",
  "partner",
  "partner_b",
  "chain_official",
  "dev_influencer",
  "indiehacker_voice",
  "framework_partner",
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(path);
  }
  return out;
}

function stripSourcesFromFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0] !== "---") return content;

  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "---") {
      end = i;
      break;
    }
  }
  if (end === -1) return content;

  const nextFrontmatter = [lines[0]];
  let skippingSources = false;
  for (let i = 1; i < end; i++) {
    const line = lines[i];
    if (/^sources:\s*$/.test(line)) {
      nextFrontmatter.push('source_basis: "Internal research synthesis; raw source ledger intentionally omitted from public skill package."');
      skippingSources = true;
      continue;
    }
    if (skippingSources && /^[a-zA-Z_][\w-]*:\s*/.test(line)) {
      skippingSources = false;
    }
    if (!skippingSources) nextFrontmatter.push(line);
  }

  return [...nextFrontmatter, lines[end], ...lines.slice(end + 1)].join("\n");
}

function sanitizeLine(line) {
  let out = line;

  // Drop raw source-ledger table rows and source URL fields.
  if (SOCIAL_URL_RE.test(out) && /^\s*(?:\||-|url:|source:|>)/i.test(out)) return "";
  SOCIAL_URL_RE.lastIndex = 0;
  out = out.replace(SOCIAL_URL_RE, "[internal research source]");

  out = out
    .replace(/\bVerbatim examples?\b/gi, "Pattern examples")
    .replace(/\bverbatim example\b/gi, "pattern example")
    .replace(/\bverbatim from source\b/gi, "pattern-derived")
    .replace(/\bboth rows verbatim from [^.]+/gi, "both rows are pattern-derived")
    .replace(/\bverbatim from [^.\])]+/gi, "pattern-derived")
    .replace(/\[verbatim(?:[^\]]*)\]/gi, "[pattern-derived]")
    .replace(/\[source:\s*[^\]]+\]/gi, "")
    .replace(/\[(?:adapted|pattern-derived);[^\]]+\]/gi, "")
    .replace(/\[pattern-observed;[^\]]+\]/gi, "[pattern-derived]")
    .replace(/\[(?:(?:hootsuite|tt|smt|later|opus|vidiq|shortimize|virvid|joyspace|paddy|tubebuddy|accio|admetrics|sproutsocial|jera|shorts)-[a-z0-9-]+|s\d+)(?:,\s*(?:(?:hootsuite|tt|smt|later|opus|vidiq|shortimize|virvid|joyspace|paddy|tubebuddy|accio|admetrics|sproutsocial|jera|shorts)-[a-z0-9-]+|s\d+))*\]/gi, "[pattern-derived]")
    .replace(/\[(?:src-[^\]]+|S\d+(?:,\s*S\d+)*)\]/g, "")
    .replace(/\|\s*(?:`?internal`?\s*,\s*)?(?:(?:hootsuite|tt|smt|later|opus|vidiq|shortimize|virvid|joyspace|paddy|tubebuddy|accio|admetrics|sproutsocial|jera|shorts)-[a-z0-9-]+|s\d+)(?:\s*[,;]\s*(?:(?:hootsuite|tt|smt|later|opus|vidiq|shortimize|virvid|joyspace|paddy|tubebuddy|accio|admetrics|sproutsocial|jera|shorts)-[a-z0-9-]+|s\d+))*\s*(?=\|)/gi, "| internal ")
    .replace(/\b(?:hootsuite|tt|smt|later|opus|vidiq|shortimize|virvid|joyspace|paddy|tubebuddy|accio|admetrics|sproutsocial|jera|shorts)-[a-z0-9-]+\b/gi, "internal")
    .replace(/\bsrc-[a-z0-9-]+\b/gi, "internal")
    .replace(/`s\d+`/gi, "`internal`")
    .replace(/\bs\d+\b/gi, "internal")
    .replace(/\b(?:yasser-chatbase|jibran-lightreel|willhenry-x|timon-comment|gstack-office-hours|slavingia-[a-z0-9-]+)\b/gi, "internal")
    .replace(/(^|[^A-Za-z0-9_])\[(?!pattern-derived\]|internal\]|TBD\])(?:hootsuite|tt|smt|later|opus|vidiq|shortimize|virvid|joyspace|paddy|tubebuddy|accio|admetrics|sproutsocial|jera|shorts)-[a-z0-9-]+\]/gi, "$1[pattern-derived]")
    .replace(/\bEvery claim cites a primary platform doc, an exec statement, or a named-cohort practitioner study\./gi, "Every claim is distilled into internal operating guidance.")
    .replace(/\bEvery claim cites a primary platform doc, a named-cohort practitioner study, or an in-house pattern-log entry\./gi, "Every claim is distilled into internal operating guidance.")
    .replace(/\bnamed-cohort\b/gi, "internal")
    .replace(/\bSahil Lavingia'?s?\b/g, "the minimalist-entrepreneur")
    .replace(/\bSahil Bloom-style\b/g, "creator-essay style")
    .replace(/\bSahil Bloom\b/g, "a creator-essay operator")
    .replace(/\bSahil'?s?\b/g, "the operator")
    .replace(/\bGumroad'?s?\b/g, "the creator-commerce company")
    .replace(/\bYasser Elsaid\b/g, "a B2B SaaS operator")
    .replace(/\bYasser'?s?\b/g, "the operator")
    .replace(/\bChatbase'?s?\b/g, "the AI-agent SaaS")
    .replace(/\bWill Henry'?s?\b/g, "the operator")
    .replace(/\bTimon Zimmermann\b/g, "an operator commenter")
    .replace(/\bOren John\b/g, "a distribution operator")
    .replace(/\bNick Saraev'?s?\b/g, "the outbound practitioner")
    .replace(/\bRoman Khaves\b/g, "a short-form operator")
    .replace(/\bJibran\b/g, "an app-growth operator")
    .replace(/\bJustin Welsh\b/g, "a creator-essay operator")
    .replace(/\bWelsh'?s?\b/g, "the creator-essay operator's")
    .replace(/\bPieter Levels\b/g, "an indie-founder operator")
    .replace(/\bLevels\b/g, "an indie-founder operator")
    .replace(/\bNaval\b/g, "a founder-creator operator")
    .replace(/\bTamilore Oladipo\b/g, "the platform-analysis operator")
    .replace(/\bMrBeast Shorts?\b/g, "large-channel shorts")
    .replace(/\bMrBeast\b/g, "a large-channel operator")
    .replace(/\bMr\.?\s*Beast'?s?\b/gi, "a large-channel operator")
    .replace(/\bJimmy Donaldson\b/g, "a large-channel operator")
    .replace(/\bAli Abdaal'?s?\b/gi, "an education-creator operator's")
    .replace(/\bSaf McLean\b/gi, "the operator's strategist")
    .replace(/\bCasey'?s?\b/gi, "the narrative operator's")
    .replace(/\bRene Ritchie\b/gi, "platform education leadership")
    .replace(/\bTodd Beaupré\b/gi, "platform discovery leadership")
    .replace(/\bRitchie\s*\+\s*Beaupré\b/gi, "platform education and discovery leadership")
    .replace(/\bRitchie\b/gi, "platform education leadership")
    .replace(/\bBeaupré\/Ritchie\b/gi, "platform education operators")
    .replace(/\bBeaupré\b/gi, "platform discovery leadership")
    .replace(/\bPaddy\b/gi, "a third-party benchmark")
    .replace(/\bThink Media\b/gi, "a third-party benchmark")
    .replace(/\bCapCut'?s?\b/gi, "the editing template library's")
    .replace(/\(template ID [^)]+\)/gi, "(template identifier omitted)")
    .replace(/\bleaked a large-channel operator doc\b/gi, "internal large-channel operating note")
    .replace(/\blarge-channel operator leaked production doc\b/gi, "large-channel operating note")
    .replace(/\bleaked doc\b/gi, "internal operating note")
    .replace(/\bVisa\s*\/\s*Coca-Cola\s*\/\s*Nike-style\b/g, "enterprise-brand-style")
    .replace(/\bVisa\b/g, "an enterprise brand")
    .replace(/\bCoca-Cola\b/g, "an enterprise brand")
    .replace(/\bNike-style\b/g, "enterprise-brand-style")
    .replace(/\bNike\b/g, "an enterprise brand")
    .replace(/\bHootsuite\b/gi, "a third-party benchmark")
    .replace(/\bOpusClip\b/gi, "a third-party benchmark")
    .replace(/\bGalloway'?s?\b/gi, "a third-party benchmark")
    .replace(/\bSprout Social'?s?\b/gi, "a third-party benchmark")
    .replace(/\bvidIQ\b/gi, "a third-party benchmark")
    .replace(/\bTubeBuddy\b/gi, "a third-party benchmark")
    .replace(/\bShortimize\b/gi, "a third-party benchmark")
    .replace(/\bAuthoredUp\b/gi, "a third-party benchmark")
    .replace(/\bvan der Blom'?s?\b/gi, "a third-party benchmark")
    .replace(/\bTypefully\b/gi, "a third-party benchmark")
    .replace(/\bMusk\b/g, "platform leadership")
    .replace(/\bMosseri-stated\b/g, "platform-stated")
    .replace(/\bMosseri'?s?\b/g, "platform leadership's")
    .replace(/\bManyChat-style\b/g, "DM-automation-style")
    .replace(/\bManyChat\b/g, "a DM automation tool")
    .replace(/\bTweet Archivist\b/g, "archive-tool")
    .replace(/\bBuffer'?s?\b/g, "third-party cohort")
    .replace(/\bLater'?s?\b/g, "third-party cohort")
    .replace(/\bSource:\s*https?:\/\/[^\s)]+/gi, "Pattern basis: internal research synthesis.")
    .replace(/\bSources?:\s*https?:\/\/[^\s)]+/gi, "Pattern basis: internal research synthesis.")
    .replace(/\*\*Pattern basis:\s*internal research synthesis\.[^*\n]*/gi, "**Pattern basis:** internal research synthesis.")
    .replace(/Pattern basis:\s*internal research synthesis\.[^*\n]*/gi, "Pattern basis: internal research synthesis.")
    .replace(/internal\s*\([^)\n]+\)/gi, "internal");

  out = out.replace(/\(@([A-Za-z0-9_.-]{3,})\)/g, (_, handle) => {
    return GENERIC_HANDLES.has(handle.toLowerCase()) ? `(@${handle})` : "(practitioner source)";
  });

  out = out.replace(/(^|[^A-Za-z0-9_])@([A-Za-z0-9_.-]{3,})/g, (match, prefix, handle) => {
    const lower = handle.toLowerCase();
    if (GENERIC_HANDLES.has(lower)) return `${prefix}@${handle}`;
    if (["context", "type", "font-face", "vercel"].includes(lower)) return match;
    return `${prefix}practitioner source`;
  });

  return out;
}

function sanitize(content) {
  content = stripSourcesFromFrontmatter(content);
  return content
    .split(/\r?\n/)
    .map(sanitizeLine)
    .filter((line, idx, lines) => !(line === "" && lines[idx - 1] === ""))
    .join("\n");
}

let changed = 0;
for (const stack of STACKS) {
  for (const file of walk(join(ROOT, stack, "skills"))) {
    const rel = relative(ROOT, file);
    if (!rel.includes("/references/")) continue;
    if (rel.includes("/references/_sources/") || rel.includes("/references/source-ledger/")) continue;

    const before = readFileSync(file, "utf8");
    const after = sanitize(before);
    if (after !== before) {
      writeFileSync(file, after);
      changed++;
    }
  }
}

console.log(`Sanitized ${changed} public reference files.`);
