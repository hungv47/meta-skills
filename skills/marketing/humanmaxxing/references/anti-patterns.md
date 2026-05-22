---
title: Humanmaxxing — Anti-Patterns Catalog
lifecycle: canonical
status: stable
produced_by: humanmaxxing
load_class: ANTI-PATTERN
---

# Anti-Patterns Catalog

Polish-pipeline failure modes the orchestrator, sub-agents, and critic-agent watch for.

**Load when:** any sub-agent (pattern-scanner / voice-extractor / strip / soul-injection / compression) is operating OR critic-agent runs 5-dimension rubric OR re-dispatch heuristic kicks in (critic FAIL routes named source agent). Re-read before any output ships as `done` or `done_with_concerns`.

---

## Polish-Pipeline Anti-Patterns

These are pipeline-mechanical failures — the polish goes wrong because the workflow itself was misapplied. Each routes to a re-do of the relevant stage.

### Skipping the pattern scan

**Problem:** Dispatching strip-agent without a diagnosis. Strip-agent needs the violation log as its work order. Without it, edits are guesswork.

**INSTEAD:** Always run pattern-scanner-agent first. Route A enforces this even for short text. Route C may skip ONLY when content already passed copywriting's Seven-Sweeps (patterns already cleaned by upstream).

### Voice injection before stripping

**Problem:** Applying brand voice to AI-patterned text. You are polishing a turd. The soul-injection-agent expects clean, pattern-free input.

**INSTEAD:** Strip first, inject second. Always. Pipeline order is strip → soul-injection → compression → critic (Route B); never reorder.

### Mechanical pattern-matching without judgment

**Problem:** Not every instance of a Soft Tell pattern needs fixing. A single hedge before a genuinely uncertain claim is honest. Treating the 47-pattern catalog as find-and-replace produces sterile prose. Exception: the 9 Absolute Prohibitions are always enforced with zero tolerance.

**INSTEAD:** Fix Hard Tells and Absolute Prohibitions unconditionally; apply judgment to Soft Tells. The Quality Gate allows up to 2 Soft Tells remaining (acknowledging judgment beats zero-tolerance on Soft Tells).

### Sterile output

**Problem:** Content that has been stripped of AI patterns but has no personality. If the output reads like a legal document, soul-injection-agent was skipped or under-applied. Clean does not equal good.

**INSTEAD:** Always run soul-injection-agent after strip-agent (Route B). Route A skips soul-injection only because short text has limited voice-injection ROI; if user requests voice on short text, upgrade to Route B.

### Surface compression

**Problem:** Cutting depth instead of filler. Removing a data point to save 8 words is the opposite of what compression should do.

**INSTEAD:** Check every deletion against the Depth Preservation Rules in `conciseness-rules.md`. Critic dimension Density catches this — every paragraph must contain at least one concrete fact, number, or named example.

### Voice cosplay

**Problem:** Injecting a personality that does not match the brand. A fintech compliance tool should not sound like a DTC sneaker brand.

**INSTEAD:** Read the voice adjectives from `product-context.md`. They are constraints, not suggestions. Voice-extractor-agent reads them; soul-injection-agent applies them; critic dimension Authenticity verifies fit.

### One-pass editing

**Problem:** Running all steps simultaneously. Each step has a different focus: detect, strip, voice, compress, verify. Combining them produces worse results because you are optimizing for conflicting goals simultaneously.

**INSTEAD:** Follow the sequential pipeline. Each agent has one job. The orchestrator passes complete outputs between agents, not partial drafts.

### Ignoring the critic's FAIL

**Problem:** If the critic fails the text, the orchestrator MUST re-dispatch. Delivering failed text breaks the quality contract.

**INSTEAD:** Re-dispatch the named agent(s) with the critic's feedback. Max 2 cycles, then deliver with annotations + `DONE_WITH_CONCERNS` status. Never silently bypass the critic gate.

### Destroying structure in the name of conciseness

**Problem:** Removing all subheadings, merging all sections, eliminating all lists because "shorter is better." Structure aids scanning.

**INSTEAD:** Compress within structure before eliminating structure. The 15% word reduction floor is a content target, not a layout target.

### Over-compressing introductions

**Problem:** The opening carries disproportionate weight. A 50% compressed intro that loses its hook is worse than a 20% compressed intro that keeps it.

**INSTEAD:** Compress introductions last and most carefully. Save the lede for last in the compression pass.

---

## Cross-Cutting Marketing-Stack Anti-Patterns

These patterns apply across the marketing stack — humanmaxxing, as the EN polish-chain endpoint, sees them when invoked by upstream skills (Route C). Enforced via Pre-Dispatch wiring + critic verification + cross-skill contract.

### Upstream skill skipped humanmaxxing for EN-market output that needed it

**Problem:** Upstream skill (e.g., `write-copy`, `write-ad`, `write-outreach`) produces EN prose that contains AI fingerprints and ships without auto-routing to humanmaxxing. Output reaches the user / publisher / detector with patterns intact.

**INSTEAD:** Upstream skill's Pre-Dispatch SHOULD wire humanmaxxing auto-routing for EN content that has AI-generated origins (e.g., when the copywriting agent itself uses LLM generation, the polish chain SHOULD include humanmaxxing before delivery). This is upstream-side enforcement; humanmaxxing itself can't detect when it wasn't called. If discovered post-hoc (e.g., during eval), surface as a process bug in the upstream skill, not a humanmaxxing bug. Sibling pattern to vn-tone's "Upstream skill skipped vn-tone for VN-market output."

### Calling skill drops protected_tokens contract

**Problem:** Upstream skill (e.g., `write-outreach`) passes a `protected_tokens` list including a named entity ("Acme Corp") + a number ("$2.3M ARR") + a URL. humanmaxxing processes the polish but the resulting Change Log shows compression-agent paraphrased "$2.3M ARR" to "millions in ARR" or compression-agent dropped the URL. The proof point that earned the cold email reply is now gone.

**INSTEAD:** Protected-token regression runs in Detector-Resistance Verification BEFORE delivery. Any missing or paraphrased token = critic auto-FAIL with `protected_tokens_preserved: false`; re-dispatch responsible agent (typically compression-agent or strip-agent, not soul-injection which usually adds rather than removes). Per Content Type Calibration, short-outbound caps compression at 0-10% precisely to protect tokens.

### Cross-stack contract drift (Artifact Template schema)

**Problem:** A maintainer adds a new frontmatter field or body section to the humanmaxxing artifact without checking calling-skill consumers (`write-copy`, `write-ad`, etc. that read `detector_status`, `protected_tokens_preserved`, `compression` percentage from humanmaxxing output). Schema drifts; downstream parsers (if any are added) break.

**INSTEAD:** Artifact Template (8-field frontmatter + 3 body sections per `format-conventions.md`) is the contract. Schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Body section headers (verbatim)" so the convention IS the contract. Currently no automated downstream consumer reads humanmaxxing artifacts (calling skills receive the polished text directly via Route C return value), but the contract still matters for the day one gets built.

### Detector-status fabrication

**Problem:** Operator requests `detector_mode: pangram` but no `PANGRAM_API_KEY` is configured. humanmaxxing completes the polish, then writes `detector_status: pangram_pass` without actually running the classifier (because Pass 1 of the proxy checklist seemed clean). Frontmatter LIES about classifier verification.

**INSTEAD:** Pre-Dispatch hard-block detects missing PANGRAM_API_KEY and either downgrades to `detector_mode: proxy` (with operator warning) or BLOCKs the run. Only ever write `pangram_pass` / `pangram_fail` when an actual Pangram classifier was invoked. Use `proxy_pass` / `proxy_fail` when the proxy checklist was run. Use `not_run` only when detector mode is explicitly disabled or content is low-stakes internal material. Never fabricate.
