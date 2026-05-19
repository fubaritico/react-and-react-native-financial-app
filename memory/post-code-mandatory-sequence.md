---
title: Post-Code Mandatory Sequence
type: note
permalink: post-code-mandatory-sequence
tags: [rule, workflow, quality]
---

# Post-Code Mandatory Sequence

## Observations

- [rule] After EVERY code change, run ALL 4 steps — no exceptions, never skip any
- [step-1] `pnpm type-check` — TypeScript strict across entire monorepo
- [step-2] `pnpm lint` — ESLint with JSDoc enforcement, import order, no-raw-text
- [step-3] `pnpm test` — all test suites across all packages
- [step-4] `/review` — multi-agent code review (5 subagents in parallel)
- [reason] Catching issues immediately prevents accumulation — a lint warning today becomes 50 tomorrow
- [reason] Type-check catches cross-platform import leaks before they reach CI
- [reason] Review catches architectural violations (wrong atomic level, missing JSDoc, style leaks)
- [rule] Fix ALL lint warnings before delivering — warnings are not "acceptable noise"
- [rule] JSDoc on EVERY interface property, EVERY function, EVERY hook, EVERY type, EVERY constant — no exception

## Relations

- enforced_by [[Skills System]]
- catches [[Fix — Cross-Platform Import Leak]]
- ensures [[Component Design Lessons]]
