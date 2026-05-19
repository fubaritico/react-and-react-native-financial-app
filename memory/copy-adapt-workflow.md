---
title: Copy/Adapt Workflow for Reference Code
type: note
permalink: copy-adapt-workflow
tags: [principle, workflow, lesson]
---

# Copy/Adapt Workflow for Reference Code

## Observations

- [principle] When a reference file/project exists, ALWAYS read it first — every single file
- [principle] Copy the structure, naming, and logic from reference BEFORE adapting
- [principle] Then adapt for cross-platform (split into .native.tsx / .web.tsx)
- [principle] NEVER invent from scratch when a reference exists
- [principle] NEVER make incremental guesses — read ALL reference files before writing ANY code
- [reason] Inventing from scratch leads to inconsistency and missed patterns that were already solved
- [reason] Incremental guessing leads to backtracking when the reference had a different approach
- [reference] `vite-mf-monorepo/packages/tokens/` — proven Style Dictionary DTCG setup (TW v4 / web-only), adapted for cross-platform
- [reference] `vite-mf-monorepo/packages/ui/` — proven UI package with tsup + tsc + Tailwind CSS build pipeline, adapted for cross-platform
- [applied] Token pipeline setup — copied structure then added native output + TW v3 JS map
- [applied] UI package build pipeline — copied tsup/tsc/PostCSS setup then added RN externals + file extension split

## Relations

- applied_to [[Token Pipeline Architecture]]
- applied_to [[UI Package Build Pipeline]]
- references [[vite-mf-monorepo]]
