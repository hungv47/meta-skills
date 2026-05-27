---
title: Humanmaxxing — Critical Gates (load-first)
lifecycle: canonical
status: stable
produced_by: humanmaxxing
load_class: PROCEDURE
---

# Critical Gates — load first

Load before dispatching any sub-agent. Each gate is a non-negotiable preflight.

## 1. Do NOT skip the pattern scan

Step 2 (strip) needs the diagnosis. Without it, strip-agent is guessing. Always run pattern-scanner-agent first. Route C may skip ONLY when content already passed copywriting's Seven-Sweeps upstream.

## 2. ZERO em dashes in final output

Absolute prohibition. No exceptions. Every em dash → comma, period, or parentheses. Restructure if needed.

## 3. Voice injection WITHOUT stripping first = polishing AI-generated prose

Strip always comes first. Soul-injection receives clean text, not AI-patterned text. Pipeline order is strip → soul-injection → compression → critic (Route B); never reorder.

## 4. Content type matters

Documentation gets a lighter touch than marketing copy. Check the Content Type Calibration table in `agent-manifest.md` before dispatching. Short-outbound caps compression at 0-10% to protect tokens.

## 5. Detector resistance is structural, not lexical

Pangram-style classifiers catch synonym-swapped prose. For high-stakes public content, prior detector failures, or explicit detector-sensitive requests, use the detector-resistance pass after the normal critic and record the threshold used. See `references/detector-resistance.md`.

---

## `--fast` does NOT skip

Cold Start questions, Critical Gates 1-5, or any Absolute Prohibition. `--fast` only collapses orchestration weight (Route B → Route A: skip voice-extractor + soul-injection + compression; run pattern-scanner + strip + critic only).
