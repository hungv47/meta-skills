---
skill: run-eval-loop
version: 1
date: 2026-05-19
status: done
summary: "Content Demo measurable improvement loop — organic-content eval infra proof"
purpose: "Operating program for a measurable strategy -> execution -> evaluation loop for organic social content; synthetic loop scaffolded as D19 infrastructure proof for evaluate-content"
lifecycle: loop
use_when: "Coordinating repeated write-social authorship, publish, evaluation, and keep/discard decisions for organic content — one primary platform per cycle"
do_not_use_when: "Short-form video (use a separate loop with brief-shortform + evaluate-shortform); Meta paid ads (use a separate loop with write-ad + evaluate-ad); landing-page CRO work (use brief-landing-page + evaluate-landing-page)"
upstream: "operator intent, write-social source artifacts, native platform analytics, prior cycle baselines"
downstream: "write-social next-cycle copy, publish-social distribution retrospective, produce-asset when a visual-bottleneck signal surfaces"
---

# Content Demo Program

## Goal

Demonstrate the end-to-end evaluate-content loop infrastructure on a synthetic organic-content cycle. Proves: provenance frontmatter wired (D8 contract) → manual-metric-entry path → critic-override log capability → quality-dashboard capability → experience-promotion rule (platform/format-scoped).

This is an INFRASTRUCTURE PROOF loop, not a real content loop. The values in `evals/2026-05-19-cycle-1.md` are synthetic placeholders calibrated to exercise the 7-dim rubric. Real-content cycles should scaffold a fresh loop.

## Measurable Surface

A single synthetic organic LinkedIn carousel for a fictional vertical (subscription-app, $19/mo). The carousel tests a slide-1 hook that names the reader's job title against a generic-benefit slide-1 baseline. One primary platform per cycle — cycle 1 is `linkedin`. The same carousel also ran on Instagram; that result is Cross-Platform Context, not a verdict input.

## Primary Metric

**Save rate (saves ÷ reach)** — synthetic baseline 1.2% from a prior generic-slide-1 carousel (notional cycle 0). Cycle 1 measures the impact of a job-title slide-1 hook on save rate while holding carousel format, body, and CTA constant.

Secondary metrics surfaced in the Evidence table: engagement rate, the likes/saves/shares/comments breakdown, click-through, reach.

## Guardrail Metrics

- **Vanity-spike guard:** a `keep` requires meaningful engagement (saves + shares + comments) to carry the lift — a likes-only spike with flat saves/shares is a guardrail FAIL even if the blended engagement rate rose.
- **Reach confidence floor:** reach < ~1,000 = confidence auto-capped at `low`.
- **Baseline comparability:** baseline must come from the same platform AND same content type (a carousel baseline does not compare to a text-post cycle).

## Mutable Surface

Agents may change between cycles: slide-1 hook, slide copy, carousel slide count, visual design, CTA verb, hashtags, posting time. Frozen between cycles unless explicitly tested: platform (LinkedIn primary), content format (carousel), audience segment, offer ($19/mo subscription).

## Frozen Context

- Canonical brand/research constraints stay authoritative — see `brand/BRAND.md` and `research/icp-research.md`.
- Source write-social artifact lives at `.forsvn/artifacts/mkt/copy/linkedin-2026-05-12-job-title-hook.md` (synthetic).
- External execution systems (LinkedIn analytics, Instagram insights) remain outside this folder; this loop stores strategy, execution references, evals, and learning decisions only.

## Cycle Protocol

1. Read `context.md`, `learnings.md`, prior `results.tsv`, and the latest artifacts in `strategy/`, `execution/`, and `evals/` (scoped to the same primary platform).
2. Produce or revise one bounded strategy or execution artifact for the next cycle.
3. Run or ingest an evaluation snapshot after the measurement window closes via `/evaluate-content`. One cycle = one primary platform.
4. Record the cycle in `results.tsv` with status `keep`, `discard`, `watch`, or `blocked` — description MUST include the primary-platform tag.
5. Promote only platform/format-scoped, evidence-backed lessons to `learnings.md` (high-confidence + status keep/discard).

## Promotion Rule

- `keep` — clear primary-metric improvement vs same-platform same-content-type baseline, the engagement-quality read is `strong` or `mixed` (meaningful engagement carries the lift — not a vanity spike), confidence ≥ medium.
- `discard` — worse result OR a guardrail failed OR the lift was vanity-only (likes spike, saves/shares collapsed), AND change plausibly tied to the cycle.
- `watch` — positive or mixed signal but underpowered (reach below floor), weak baseline, material confounders, or mixed engagement-quality read.
- `blocked` — missing primary metric / source / window, contradictory data, broken tracking, OR no proof the cycle's content actually published.
