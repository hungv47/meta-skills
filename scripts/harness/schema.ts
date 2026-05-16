// Harness output schema — single source of truth for what each invocation logs.
// Matches the format documented in implementation-roadmap/refactor/03-harness.md.

export const HARNESS_VERSION = "0.1.0";

export type ModeName = "fast" | "standard" | "deep";
export type FixtureKind = "minimal" | "standard" | "stretch";

export interface RunMarker {
  run_id: string;
  started_at: string;
  skill: string;
  stack: string;
  skill_version: string | null;
  mode_resolved: ModeName;
  mode_source: "auto-resolver" | "operator-flag" | "default";
  mode_resolver_reasoning: string;
  fixture_path: string | null;
  fixture_kind: FixtureKind | null;
  user_prompt_chars: number;
  user_prompt_hash: string;
  skill_md_path: string;
  skill_md_lines: number;
  skill_md_chars: number;
  notes: string;
}

export interface ToolEvent {
  ts: string;
  phase: "pre" | "post";
  tool_name: string;
  tool_input: Record<string, unknown>;
  tool_response_size?: number;
  file_path?: string;
  file_chars?: number;
  file_lines?: number;
  subagent_type?: string;
  subagent_description?: string;
  subagent_prompt_chars?: number;
  subagent_output_chars?: number;
  bash_command_preview?: string;
}

export interface RefLoad {
  path: string;
  loaded_at_step: number;
  lines: number;
  chars: number;
}

export interface AgentSpawn {
  name: string;
  spawned_at_step: number;
  input_chars: number;
  output_chars: number;
  output_changed_main_thread: boolean | null;
}

export interface OutputArtifact {
  path: string;
  exists: boolean;
  lifecycle: string | null;
  status: string | null;
  frontmatter_hash: string | null;
  section_header_hash: string | null;
  contract_hash: string | null;
  bytes: number;
}

export interface RunResult {
  run_id: string;
  timestamp: string;
  skill: string;
  stack: string;
  skill_version: string | null;
  fixture: { path: string | null; kind: FixtureKind | null };
  mode: {
    resolved: ModeName;
    source: "auto-resolver" | "operator-flag" | "default";
    resolver_reasoning: string;
  };
  input: {
    user_prompt_chars: number;
    user_prompt_hash: string;
    referenced_artifact_paths: string[];
  };
  context_load: {
    skill_md_path: string;
    skill_md_lines: number;
    skill_md_chars: number;
    refs_read_in_order: RefLoad[];
    total_default_chars: number;
    total_with_refs_chars: number;
  };
  agents_spawned: AgentSpawn[];
  tool_calls: number;
  bash_calls: number;
  read_calls: number;
  write_calls: number;
  edit_calls: number;
  output_artifacts: OutputArtifact[];
  wall_time_ms: number;
  notes: string;
  harness_version: string;
}

export interface SkillReport {
  skill: string;
  stack: string;
  sample_size: number;
  date_range: { from: string; to: string };
  modes: Record<ModeName, number>;
  body_lines: number;
  always_loaded_refs: { path: string; lines: number; chars: number }[];
  sometimes_loaded_refs: { path: string; load_rate: number; avg_chars: number }[];
  default_load_chars_avg: number;
  with_refs_load_chars_avg: number;
  // verdict is USE-rate bucketing, NOT the protocol's KEEP/REVIEW/DROP ROI verdict.
  // ROI verdict requires changed_output_rate which is v0.2. Confirm with blind diff.
  agent_roi: { name: string; fire_rate: number; changed_output_rate: number | null; verdict: "HIGH_USE" | "MED_USE" | "LOW_USE" | "UNKNOWN" }[];
  artifact_contract_stability: { path: string; stable: boolean; hashes_seen: number }[];
  recommendations: string[];
}

export interface DiffReport {
  skill: string;
  pre_run_ids: string[];
  post_run_ids: string[];
  body_lines: { pre: number; post: number; delta_pct: number };
  default_load_chars: { pre_avg: number; post_avg: number; delta_pct: number };
  agents: { name: string; pre_fire_rate: number; post_fire_rate: number; verdict: string }[];
  contract_hashes: { path: string; pre: string | null; post: string | null; preserved: boolean }[];
  passes_gate_1: boolean;
  gate_1_failures: string[];
  notes: string[];
}
