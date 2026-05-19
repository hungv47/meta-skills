---
title: VN-Tone — Anti-Patterns Catalog
lifecycle: canonical
status: stable
produced_by: vn-tone
load_class: ANTI-PATTERN
---

# Anti-Patterns Catalog

Polishing failure modes the orchestrator, diagnostic-agent, polisher-agent, and critic-agent watch for.

**Load when:** diagnostic-agent assesses violations OR polisher-agent applies fixes OR critic-agent runs 36-point rubric OR re-dispatch heuristic kicks in (critic FAIL routes to polisher-agent with feedback). Re-read before any output ships as `done` or `done_with_concerns`.

---

## Polish-Pipeline Anti-Patterns

These are pipeline-mechanical failures — the polish goes wrong because the workflow itself was misapplied. Each routes to a re-do of the relevant stage.

### Polishing before diagnosing

**Problem:** Dispatching the polisher without a violation log. The polisher needs the diagnostic as a work order — without it, it rewrites by vibes and misses pronoun drift, particle ratios, and Hard Tells.

**INSTEAD:** Always run diagnostic-agent first. Route A enforces this; Route B may skip diagnostic only if the calling skill has already passed a prior VN polish (and even then, the critic still runs to verify nothing drifted).

### Guessing the register

**Problem:** Running the pipeline without confirming target register with the user or pulling it from brand voice. The register choice determines every subsequent decision (pronoun pair, particle density, vocabulary lean, rhythm).

**INSTEAD:** Resolve register in Pre-Dispatch (Register Resolution priority 1-3, ask at priority 4) or hard-block. Never silently default to a register without telling the user.

### Cross-contaminating subvariants

**Problem:** Polishing Otofun `em + cụ` text toward Voz `mình + ae` because "both are bro". They are distinct speech communities with non-interchangeable pronouns.

**INSTEAD:** Specify subvariant in Pre-Dispatch (Q3 of Cold Start fires when target register = bro). If subvariant missing, hard-block per `procedures/pre-dispatch.md`.

### Particle over-injection

**Problem:** Adding `nha/nhé/đấy` to every sentence in a pop rewrite. Target range is 15–25%. Every-sentence injection reads performative.

**INSTEAD:** Vary — some sentences end bare, some with particles. Critic Pass 2 flags >35% density as performative (treated same as under 10% — both fail register consistency).

### Clichés left standing

**Problem:** Polishing around `giải pháp toàn diện`, `trải nghiệm đột phá`, `chuyển đổi số` instead of deleting them. These are corporate-translationese fingerprints and must go in pop/casual registers.

**INSTEAD:** Delete the phrase, rewrite around what the product actually does. Absolute Prohibition #7 forbids stacking two clichés in one paragraph; polisher's job is to delete when stacked.

### Preserving em dashes

**Problem:** Thinking em dashes (`—`) are "just punctuation". They are English intrusion in VN.

**INSTEAD:** Convert every `—` to comma, period, parentheses, or restructure the sentence. Absolute Prohibition #1; critic Pass 5 (Typography Correctness) auto-deducts.

### Scope creep

**Problem:** Touching facts, numbers, or named examples to "improve flow". Polish is form-only.

**INSTEAD:** Preserve every factual anchor; flag rather than cut. Critical Gate 3 + critic Meaning Preservation Pass treat any dropped fact or altered number as auto-FAIL.

### Register cosplay

**Problem:** A corporate brand asking for `bro` register and the polisher dutifully producing Voz-slang output. Brands that try this register usually fail (the brand voice and the bro voice are incompatible; readers feel the mismatch).

**INSTEAD:** Flag the register choice as risky to the user before polishing; confirm they want it. If user confirms, polish to the requested register but include a `DONE_WITH_CONCERNS` note about register-brand mismatch risk.

### Ignoring the critic's FAIL

**Problem:** Delivering failed text because "it's mostly good". Hard Tells are binary.

**INSTEAD:** Re-dispatch the polisher with specific feedback. Max 2 cycles, then deliver with annotations + `DONE_WITH_CONCERNS` status. Never silently bypass the critic gate — the gate is load-bearing.

### One-pass polishing

**Problem:** Running diagnostic, polish, and critic all in one dispatch. Each pass has a different focus (detect / fix / verify). Combining them produces worse results.

**INSTEAD:** Follow the sequential pipeline (Layer 1 diagnostic → Layer 2 polisher → critic). Even in `--fast` mode where critic is skipped, the diagnostic-then-polish ordering holds.

### Loanword overscrub

**Problem:** Replacing every English loanword even in tech register where they belong. `API`, `webhook`, `gaming`, `router` are fine in semi-casual tech.

**INSTEAD:** Calibrate by register — drop loanwords in báo chí, keep them in semi-casual/pop where natural. The polisher does not "modernize" or "Vietnamize" loanwords that are already in widespread native use.

---

## Cross-Cutting Marketing-Stack Anti-Patterns

These patterns apply across the marketing stack — vn-tone, as the polish-chain endpoint for VN, sees them when invoked by upstream skills (Route B). Enforced via Pre-Dispatch wiring and critic verification.

### Upstream skill skipped vn-tone for VN-market output

**Problem:** `market = VN` resolved in an upstream skill's Pre-Dispatch but the polish chain bypasses vn-tone and ships the artifact with raw model VN. Spoken-line section reads as Vietnamese-by-Google-Translate — particles missing, pronoun drift, idioms calqued from English.

**INSTEAD:** Upstream skill's Pre-Dispatch (e.g., `short-form-brief/references/procedures/pre-dispatch.md` § "VN auto-routing") enforces vn-tone routing for VN founder/company per the Polish Chain table. This is upstream-side enforcement; vn-tone itself can't detect when it wasn't called. If discovered post-hoc (e.g., during eval), surface as a process bug in the upstream skill, not a vn-tone bug.

### Calling skill drops vn-tone output schema

**Problem:** Upstream skill invokes vn-tone (Route B), gets back the polished text + Polish Summary + Change Log, then discards the metadata when embedding in its own artifact. The polish history is lost; future re-runs can't tell whether the text was already polished.

**INSTEAD:** Calling skills SHOULD preserve at least `polish_chain_applied: vn-tone` + `critic_score: N/36` in their own artifact frontmatter. The Polish Summary table itself does not need to ship to the consumer; the metadata does. Documented in upstream skills' Polish Chain procedures.

### Cross-stack contract drift (Artifact Template schema)

**Problem:** A maintainer adds a new frontmatter field or body section to the vn-tone artifact without checking calling-skill consumers (`brief-shortform`, `write-social`, etc. that read `polish_chain_applied` from polish-vn output). Schema drifts; downstream parsers (if any are added) break.

**INSTEAD:** Artifact Template (8-field frontmatter + 4 body sections per `format-conventions.md`) is the contract. Schema changes require atomic update of `format-conventions.md` § "Frontmatter field order" + § "Body section headers (verbatim)" so the convention IS the contract. Flag to operator before changing. Currently no automated downstream consumer; the contract still matters for the day one gets built.

### Multi-market polish in one artifact

**Problem:** Operator pastes mixed-market VN text (e.g., VN expat content with US cultural references + VN local content with VN cultural references) and asks for one polish.

**INSTEAD:** vn-tone is single-market per artifact — VN target register implies one cultural target. If the input contains content for multiple cultural audiences, re-invoke per audience. The polisher cannot pick "blended" register without contradicting Register Resolution.
