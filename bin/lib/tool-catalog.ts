// tool-catalog — the seed catalog the tool-registry discovery maps against.
//
// CLOSED-LOOP.md §2.1 / §3: the registry is *discovery-first*. It reads what the
// operator already connected (MCP servers + env keys) and classifies each find
// against this catalog. Categories are FIXED (anti-sprawl, §11 R1); engines are
// discovered, never hand-maintained per-project. This file is the only place that
// knows "what an engine IS" — capabilities, auth model, the env var that powers it,
// docs, and rough cost/latency. Discovery decides "is it present"; this says "what."
//
// Adding an engine here does NOT connect it — it only lets discovery recognise a
// server/key when the operator connects one. Keep entries factual and conservative.

export const CATEGORIES = [
  "research",
  "design",
  "image",
  "video",
  "publish",
  "analytics",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type AuthModel = "none" | "env" | "oauth" | "mcp-connected";
export type CostHint = "free" | "low" | "medium" | "high" | "n/a";
export type LatencyHint = "instant" | "fast" | "seconds" | "minutes" | "n/a";

export type CatalogEngine = {
  /** Canonical engine slug (kebab). Stable identity in tools.json. */
  name: string;
  /** Primary category (used for display grouping). */
  category: Category;
  /** Every category this engine serves — list_tools(cat) matches against this. */
  categories: Category[];
  capabilities: string[];
  /** The auth model when connected via its own API key. `mcp-connected` is set at
   *  discovery time when the engine is found as a connected MCP server instead. */
  auth: AuthModel;
  /** Env vars that power the engine when auth: env. Probed for PRESENCE only. */
  env_keys: string[];
  docs_url: string;
  cost_hint: CostHint;
  latency_hint: LatencyHint;
};

// The seed catalog. Sourced from CLOSED-LOOP.md §2.1; conservative metadata.
export const KNOWN_ENGINES: CatalogEngine[] = [
  // --- research ---
  { name: "firecrawl", category: "research", categories: ["research"], capabilities: ["scrape", "crawl", "search", "extract", "map"], auth: "env", env_keys: ["FIRECRAWL_API_KEY"], docs_url: "https://docs.firecrawl.dev", cost_hint: "low", latency_hint: "seconds" },
  { name: "exa", category: "research", categories: ["research"], capabilities: ["search", "find-similar", "web-fetch"], auth: "env", env_keys: ["EXA_API_KEY"], docs_url: "https://docs.exa.ai", cost_hint: "low", latency_hint: "seconds" },
  { name: "brave", category: "research", categories: ["research"], capabilities: ["search"], auth: "env", env_keys: ["BRAVE_API_KEY"], docs_url: "https://brave.com/search/api/", cost_hint: "low", latency_hint: "fast" },
  { name: "tavily", category: "research", categories: ["research"], capabilities: ["search", "extract"], auth: "env", env_keys: ["TAVILY_API_KEY"], docs_url: "https://docs.tavily.com", cost_hint: "low", latency_hint: "seconds" },
  { name: "chrome-devtools-mcp", category: "research", categories: ["research"], capabilities: ["browser-inspect", "screenshot", "dom-read"], auth: "none", env_keys: [], docs_url: "https://github.com/ChromeDevTools/chrome-devtools-mcp", cost_hint: "free", latency_hint: "seconds" },
  { name: "browserbase", category: "research", categories: ["research"], capabilities: ["headless-browser", "automation"], auth: "env", env_keys: ["BROWSERBASE_API_KEY", "BROWSERBASE_PROJECT_ID"], docs_url: "https://docs.browserbase.com", cost_hint: "medium", latency_hint: "seconds" },
  { name: "browser-use", category: "research", categories: ["research"], capabilities: ["browser-automation"], auth: "env", env_keys: ["OPENAI_API_KEY"], docs_url: "https://github.com/browser-use/browser-use", cost_hint: "medium", latency_hint: "seconds" },

  // --- design ---
  { name: "figma", category: "design", categories: ["design"], capabilities: ["design-files", "components", "code-connect"], auth: "oauth", env_keys: ["FIGMA_ACCESS_TOKEN"], docs_url: "https://www.figma.com/developers/api", cost_hint: "n/a", latency_hint: "seconds" },
  { name: "paper", category: "design", categories: ["design"], capabilities: ["code-to-design", "design-to-code"], auth: "mcp-connected", env_keys: [], docs_url: "https://paper.design", cost_hint: "n/a", latency_hint: "seconds" },
  { name: "stitch", category: "design", categories: ["design"], capabilities: ["screen-generation", "design-system", "variants"], auth: "mcp-connected", env_keys: [], docs_url: "https://stitch.withgoogle.com", cost_hint: "low", latency_hint: "seconds" },
  { name: "canva", category: "design", categories: ["design", "image"], capabilities: ["design", "templates", "resize", "translate"], auth: "oauth", env_keys: [], docs_url: "https://www.canva.dev", cost_hint: "low", latency_hint: "seconds" },
  { name: "claude-design", category: "design", categories: ["design"], capabilities: ["design-generation"], auth: "none", env_keys: [], docs_url: "https://www.anthropic.com", cost_hint: "n/a", latency_hint: "seconds" },
  { name: "pencil", category: "design", categories: ["design"], capabilities: ["design"], auth: "oauth", env_keys: [], docs_url: "https://www.pencil.ai", cost_hint: "n/a", latency_hint: "n/a" },
  // open-design: local-first design workspace (MCP `open-design` + `od` CLI). docs_url left blank — fill with the canonical URL when confirmed.
  { name: "open-design", category: "design", categories: ["design"], capabilities: ["design-generation", "design-systems", "artifact-files", "skills-library", "code-export"], auth: "mcp-connected", env_keys: [], docs_url: "", cost_hint: "n/a", latency_hint: "seconds" },

  // --- image ---
  { name: "fal", category: "image", categories: ["image", "video"], capabilities: ["text-to-image", "image-to-image", "upscale", "text-to-video"], auth: "env", env_keys: ["FAL_KEY"], docs_url: "https://fal.ai/docs", cost_hint: "low", latency_hint: "seconds" },
  { name: "replicate", category: "image", categories: ["image", "video"], capabilities: ["text-to-image", "image-to-image", "models"], auth: "env", env_keys: ["REPLICATE_API_TOKEN"], docs_url: "https://replicate.com/docs", cost_hint: "medium", latency_hint: "seconds" },
  { name: "imagen", category: "image", categories: ["image"], capabilities: ["text-to-image"], auth: "env", env_keys: ["GEMINI_API_KEY", "GOOGLE_API_KEY"], docs_url: "https://ai.google.dev/gemini-api/docs/imagen", cost_hint: "medium", latency_hint: "seconds" },
  { name: "dall-e", category: "image", categories: ["image"], capabilities: ["text-to-image", "image-edit"], auth: "env", env_keys: ["OPENAI_API_KEY"], docs_url: "https://platform.openai.com/docs/guides/images", cost_hint: "medium", latency_hint: "seconds" },
  { name: "midjourney", category: "image", categories: ["image"], capabilities: ["text-to-image"], auth: "none", env_keys: [], docs_url: "https://docs.midjourney.com", cost_hint: "medium", latency_hint: "minutes" },
  { name: "ideogram", category: "image", categories: ["image"], capabilities: ["text-to-image", "typography"], auth: "env", env_keys: ["IDEOGRAM_API_KEY"], docs_url: "https://developer.ideogram.ai", cost_hint: "low", latency_hint: "seconds" },

  // --- video ---
  { name: "hyperframes", category: "video", categories: ["video"], capabilities: ["motion", "animation"], auth: "mcp-connected", env_keys: [], docs_url: "https://hyperframes.ai", cost_hint: "low", latency_hint: "seconds" },
  { name: "remotion", category: "video", categories: ["video"], capabilities: ["programmatic-video"], auth: "none", env_keys: [], docs_url: "https://www.remotion.dev/docs", cost_hint: "low", latency_hint: "minutes" },
  { name: "sora", category: "video", categories: ["video"], capabilities: ["text-to-video"], auth: "env", env_keys: ["OPENAI_API_KEY"], docs_url: "https://openai.com/sora", cost_hint: "high", latency_hint: "minutes" },
  { name: "veo", category: "video", categories: ["video"], capabilities: ["text-to-video"], auth: "env", env_keys: ["GEMINI_API_KEY", "GOOGLE_API_KEY"], docs_url: "https://deepmind.google/technologies/veo/", cost_hint: "high", latency_hint: "minutes" },
  { name: "invideo", category: "video", categories: ["video"], capabilities: ["script-to-video"], auth: "mcp-connected", env_keys: [], docs_url: "https://invideo.io", cost_hint: "medium", latency_hint: "minutes" },
  { name: "heygen", category: "video", categories: ["video"], capabilities: ["avatar-video", "talking-head"], auth: "env", env_keys: ["HEYGEN_API_KEY"], docs_url: "https://docs.heygen.com", cost_hint: "medium", latency_hint: "minutes" },

  // --- publish ---
  { name: "typefully", category: "publish", categories: ["publish"], capabilities: ["schedule-threads", "publish"], auth: "env", env_keys: ["TYPEFULLY_API_KEY"], docs_url: "https://support.typefully.com/en/articles/8718287-typefully-api", cost_hint: "low", latency_hint: "fast" },
  // postbridge (Post Bridge): multi-platform social scheduler. docs_url left blank — fill with the canonical URL when confirmed.
  { name: "postbridge", category: "publish", categories: ["publish"], capabilities: ["schedule", "publish", "multi-platform"], auth: "env", env_keys: ["POSTBRIDGE_API_KEY"], docs_url: "", cost_hint: "low", latency_hint: "fast" },
  { name: "buffer", category: "publish", categories: ["publish"], capabilities: ["schedule", "publish"], auth: "oauth", env_keys: [], docs_url: "https://buffer.com/developers/api", cost_hint: "low", latency_hint: "fast" },
  { name: "hootsuite", category: "publish", categories: ["publish"], capabilities: ["schedule", "publish"], auth: "oauth", env_keys: [], docs_url: "https://developer.hootsuite.com", cost_hint: "medium", latency_hint: "fast" },
  { name: "meta-ads", category: "publish", categories: ["publish"], capabilities: ["ad-campaigns", "ad-sets"], auth: "oauth", env_keys: [], docs_url: "https://developers.facebook.com/docs/marketing-apis", cost_hint: "n/a", latency_hint: "n/a" },
  { name: "manual-export", category: "publish", categories: ["publish", "analytics"], capabilities: ["copy-paste", "file-export"], auth: "none", env_keys: [], docs_url: "", cost_hint: "free", latency_hint: "instant" },

  // --- analytics ---
  { name: "ga4", category: "analytics", categories: ["analytics"], capabilities: ["traffic", "conversions", "events"], auth: "oauth", env_keys: [], docs_url: "https://developers.google.com/analytics/devguides/reporting/data/v1", cost_hint: "n/a", latency_hint: "fast" },
  { name: "plausible", category: "analytics", categories: ["analytics"], capabilities: ["traffic", "goals"], auth: "env", env_keys: ["PLAUSIBLE_API_KEY"], docs_url: "https://plausible.io/docs/stats-api", cost_hint: "low", latency_hint: "fast" },
  { name: "posthog", category: "analytics", categories: ["analytics"], capabilities: ["product-analytics", "events", "funnels"], auth: "env", env_keys: ["POSTHOG_API_KEY"], docs_url: "https://posthog.com/docs/api", cost_hint: "low", latency_hint: "fast" },
  { name: "mixpanel", category: "analytics", categories: ["analytics"], capabilities: ["product-analytics", "events", "funnels", "retention"], auth: "env", env_keys: ["MIXPANEL_API_SECRET"], docs_url: "https://developer.mixpanel.com/reference/overview", cost_hint: "low", latency_hint: "fast" },
  { name: "amplitude", category: "analytics", categories: ["analytics"], capabilities: ["product-analytics", "events", "cohorts", "funnels"], auth: "env", env_keys: ["AMPLITUDE_API_KEY", "AMPLITUDE_SECRET_KEY"], docs_url: "https://amplitude.com/docs/apis", cost_hint: "n/a", latency_hint: "fast" },
];

// Explicit aliases: an MCP server / config name → a canonical engine slug. Applied
// AFTER normalization (lowercase, strip `claude_ai_` prefix + trailing `-mcp`/`_mcp`,
// `_`→`-`). A normalized name that equals an engine `name` needs no alias.
export const SERVER_ALIASES: Record<string, string> = {
  "dalle": "dall-e",
  "dall-e-3": "dall-e",
  "gpt-image": "dall-e",
  "openai-image": "dall-e",
  "google-analytics": "ga4",
  "googleanalytics": "ga4",
  "facebook-ads": "meta-ads",
  "metaads": "meta-ads",
  "chrome-devtools": "chrome-devtools-mcp",
  "chromedevtools": "chrome-devtools-mcp",
  "browseruse": "browser-use",
  "figma-dev-mode": "figma",
  "figma-developer": "figma",
  "opendesign": "open-design",
  "od": "open-design",
  "amplitude-eu": "amplitude",
  "post-bridge": "postbridge",
};

const ENGINE_BY_NAME = new Map(KNOWN_ENGINES.map((e) => [e.name, e]));

/** Normalize a raw MCP server / config key to a comparable slug. */
export function normalizeServerName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^claude_ai_/, "")
    .replace(/[_\s]+/g, "-")
    .replace(/-mcp$/, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Resolve a raw server/config name to a catalog engine, or null if unknown. */
export function matchEngine(raw: string): CatalogEngine | null {
  const norm = normalizeServerName(raw);
  const aliased = SERVER_ALIASES[norm] ?? norm;
  return ENGINE_BY_NAME.get(aliased) ?? null;
}
