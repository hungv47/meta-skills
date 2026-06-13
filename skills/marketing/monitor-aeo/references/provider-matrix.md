---
last_verified: 2026-06-13
verifier: audit-wave2
churn: high
---

# Provider Matrix — AEO Surfaces, Inputs, Crawlers

> Canonical list of providers/surfaces the monitor measures, the input shapes each accepts, and the crawler user-agents that feed each provider's training/retrieval. Used by query-set-agent (provider mapping), provider-readiness-agent (ledger inventory), citation-monitor / geo-monitor / traffic-monitor / readiness (per-provider behavior).

This matrix is updated as the AI-search surface evolves. Operators with bespoke provider needs (e.g., enterprise Bedrock deployment) extend it locally.

---

## Chat-provider surfaces (citation-monitor)

| Provider | Models commonly probed | Input shape | Citation type observed | Referral host |
|---|---|---|---|---|
| OpenAI ChatGPT | gpt-4o, gpt-4.1, o-series | export of chat-turn JSON: prompt + completion + cited URLs | linked citations in answer text + linked sources panel (when ChatGPT search enabled) | chat.openai.com, chatgpt.com |
| Perplexity | sonar-pro, sonar-medium, sonar-small | export from Perplexity API / Pro logs: prompt + answer + cited sources | always-on linked citations | perplexity.ai |
| Anthropic Claude | claude-sonnet-4-6, claude-opus-4-7, claude-haiku-4-5 | export of chat-turn JSON; web search results when claude.ai search enabled | linked citations in answer text when web search ran | claude.ai |
| Google Gemini | gemini-2.5-pro, gemini-2.5-flash | export from Gemini API / app | linked citations in answer text + grounding sources | gemini.google.com |
| Microsoft Copilot | gpt-4o via Copilot, Bing-backed | export from Copilot history / Bing Webmaster | linked citations + sidebar sources | copilot.microsoft.com |
| xAI Grok | grok-3, grok-3-mini | export from x.ai API / app | linked citations (when Grok search enabled) | grok.com, x.ai |
| You.com | Smart, Genius modes | export from You.com Chat / API | linked citations | you.com |
| Phind | Phind-V10 | export from Phind logs | always-on linked citations | phind.com |
| Mistral Le Chat | mistral-large, codestral | export from Le Chat | citations when web search enabled | mistral.ai |
| Kagi Assistant | Sonnet / GPT-4 backed | Kagi paid feature; export from Kagi history | linked citations | kagi.com |
| Meta AI | llama-3.x, llama-4 | export from meta.ai | citations when web-search mode | meta.ai |
| Arc Search | summary-only | screenshot/transcription (no API) | summary with linked sources | arc.net |

---

## Generative-search SERP surfaces (geo-monitor)

| Surface | Input shape | Provider attribution | Geo behavior |
|---|---|---|---|
| Google AI Overview (formerly SGE) | DataForSEO `serp/google/ai_overview` JSON, Sistrix SGE module dump, Semrush GEO tracker export, or manual screenshot transcription | Google AI Overview | Heavy geo + language variance; tag every row |
| Bing Generative Search | DataForSEO `serp/bing/generative` JSON or Bing dashboard export | Bing Copilot in SERP | Less geo variance but rapidly evolving |
| Yandex Neuro (RU) | Yandex SERP export | Yandex Neuro | RU-only; out of scope unless RU is target market |
| Baidu AI Search (CN) | Baidu SERP export | Baidu | CN-only; out of scope unless CN is target market |

---

## AI-referrer hosts (traffic-monitor)

The canonical AI-referrer host list. Extend per emerging products.

```
chat.openai.com
chatgpt.com
perplexity.ai
copilot.microsoft.com
gemini.google.com
claude.ai
you.com
phind.com
grok.com
x.ai
kagi.com
arc.net
meta.ai
mistral.ai
www.bing.com (Generative Search)
duckduckgo.com (DuckAssist)
brave.com (Brave AI Answers)
```

Sub-host groupings for the provider roll-up:

| Provider rollup | Sub-hosts |
|---|---|
| OpenAI ChatGPT | chat.openai.com, chatgpt.com |
| Perplexity | perplexity.ai |
| Microsoft Copilot | copilot.microsoft.com, www.bing.com (if Generative Search) |
| Google Gemini | gemini.google.com |
| Anthropic Claude | claude.ai |
| xAI Grok | grok.com, x.ai |

---

## AI crawler user-agents (readiness)

The canonical list of crawler user-agents that feed AI training, retrieval, or live answer-engine indices. `readiness-agent` parses `robots.txt` against this list.

| User-agent | Operator | Powers | Block effect |
|---|---|---|---|
| GPTBot | OpenAI | training + (separate) OAI-SearchBot powers retrieval | Blocks training only; OAI-SearchBot is separate |
| OAI-SearchBot | OpenAI | ChatGPT search retrieval | Blocks ChatGPT search citations |
| ChatGPT-User | OpenAI | user-initiated browsing actions in ChatGPT | Blocks user-triggered browse cites |
| PerplexityBot | Perplexity | retrieval | Blocks Perplexity citations |
| Perplexity-User | Perplexity | user-initiated | Blocks user-triggered retrieval |
| ClaudeBot | Anthropic | training + retrieval (claude.ai web search) | Blocks Claude web search citations |
| Claude-Web | Anthropic | (legacy) | Same |
| Google-Extended | Google | Bard/Gemini training, separate from Googlebot | Blocks Gemini training only — Googlebot still indexes |
| CCBot | Common Crawl | feeds many training corpora | Blocks Common Crawl access broadly |
| Bytespider | ByteDance | TikTok/Doubao indexing | Blocks ByteDance AI products |
| Applebot-Extended | Apple | Apple Intelligence training | Blocks Apple training only |
| Amazonbot | Amazon | Alexa / Bedrock | Blocks Amazon AI surface |
| FacebookBot / Meta-ExternalAgent | Meta | Meta AI | Blocks Meta AI training/retrieval |
| Diffbot | Diffbot | knowledge-graph commercial | Blocks Diffbot consumers |
| YouBot | You.com | retrieval | Blocks You.com citations |

Several of these are legitimately blocked intentionally (CCBot, Bytespider, Diffbot are commonly blocked for non-AEO reasons). `readiness-agent` records the block as `missing` from an AEO-readiness lens but notes operator-decision in the resolves-with column.

---

## Provider mapping by query intent (query-set-agent)

Default mapping. Operators override per query in the matrix.

| Intent class | Default providers |
|---|---|
| informational | OpenAI, Perplexity, Google AI Overview, Bing Generative |
| comparison | OpenAI, Perplexity, Anthropic, Microsoft Copilot |
| navigational | (skip — navigational queries are usually no-op for AEO) |
| transactional | Perplexity, Microsoft Copilot (commercial intent strongest here) |
| troubleshooting | OpenAI, Anthropic, Phind, Perplexity |

---

## Extending the matrix

When the operator targets a provider not listed here:

1. Add a row to the chat-provider / SERP table with input shape and citation type.
2. Add the referral host to the traffic-monitor list and the appropriate provider rollup.
3. Add the user-agent to the crawler readiness list.
4. Update `query-set-agent`'s default mapping for the relevant intent class.

These extensions live in this file (not in agent SKILL.md bodies). Agents always read this file at dispatch.
