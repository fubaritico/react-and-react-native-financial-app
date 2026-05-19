---
title: Skills System
type: note
permalink: skills-system
tags: [tooling, workflow, claude]
---

# Skills System

## Observations

- [location] Skills live in `.claude/skills/` — replaced `.claude/commands/`
- [count] 18 custom skills + 7 vendor skills (Expo, Callstack, Supabase)
- [workflow] `/skill-name` invokes a skill — expanded to full prompt by Claude Code
- [key-skills] `new-component` — scaffolds cross-platform UI component with all files
- [key-skills] `commit` — conventional commit preparation
- [key-skills] `review` — multi-agent code reviewer with 5 parallel subagents
- [key-skills] `story` — creates Storybook story (mandatory after every component)
- [key-skills] `build-tokens` — rebuilds Style Dictionary outputs
- [key-skills] `api-openapi` — OpenAPI + HeyAPI HTTP client workflow
- [key-skills] `start-session` / `end-session` — session context management
- [key-skills] `monorepo-check` — validates dependency graph and workspace health
- [skipped] expo-api-routes (we use Express), expo-tailwind-setup (we use twrnc), expo-ui-swift-ui/jetpack-compose (SDK 55, we're on 54)
- [spec] Skills follow agentskills.io specification
- [mandatory] `/review` runs after every code change — part of the type-check/lint/test/review cycle

## Relations

- automates [[Cross-Platform File Extension Split]]
- automates [[Token Pipeline Architecture]]
- enforces [[Post-Code Mandatory Sequence]]
