---
skill: run-eval-loop
version: 1
date: 2026-05-19
status: needs_context
summary: "Lp Demo measurable improvement loop"
purpose: "Operating program for a measurable strategy -> execution -> evaluation loop"
lifecycle: loop
use_when: "Coordinating repeated strategy, content/marketing execution, evaluation, and keep/discard decisions for this initiative"
do_not_use_when: "The work has no observable metric or the metric cannot be attributed to this loop"
upstream: "operator intent, prior artifacts, metric baseline"
downstream: "strategy skills, marketing/content execution skills, evaluation skills"
---

# Lp Demo Program

## Goal

TBD.

## Measurable Surface

TBD. Name the asset, campaign, channel, page, sequence, or content series this loop owns.

## Primary Metric

TBD. Choose one decision metric. Examples: conversion rate, CTR, qualified replies, completion rate, saves, signups, revenue.

## Guardrail Metrics

- TBD.

## Mutable Surface

TBD. Name what agents may change between cycles: copy, offer, targeting, creative angle, sequence order, CTA, post format, etc.

## Frozen Context

- Canonical brand/research constraints stay authoritative unless explicitly refreshed.
- External execution systems remain outside this folder; this loop stores strategy, produced marketing/content assets, evals, and learning decisions.

## Cycle Protocol

1. Read `context.md`, `learnings.md`, prior `results.tsv`, and the latest artifacts in `strategy/`, `execution/`, and `evals/`.
2. Produce or revise one bounded strategy or execution artifact.
3. Run or ingest an evaluation snapshot after the measurement window closes.
4. Record the cycle in `results.tsv` with status `keep`, `discard`, `watch`, or `blocked`.
5. Promote only reusable, evidence-backed lessons to `learnings.md`.

## Promotion Rule

- `keep` — clear metric improvement, useful simplification, or strong qualitative signal with adequate sample.
- `discard` — worse result, confounded test, or added complexity without measurable upside.
- `watch` — promising but underpowered; needs another cycle before changing defaults.
- `blocked` — missing data, attribution, execution proof, or measurement window.
