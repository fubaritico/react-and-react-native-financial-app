---
title: Basic Memory Integration
type: note
permalink: financial-app/basic-memory-integration
tags:
- architecture
- decision
- tooling
---

# Basic Memory Integration

## Context
The project needed a shareable, git-tracked knowledge base that AI agents could query during coding sessions. The auto-memory (MEMORY.md) was capped at 200 lines and couldn't scale.

## Decision
Adopted Basic Memory as an MCP server with notes stored in `memory/` directory. Chose this over a full RAG pipeline for simplicity — plain Markdown files, no embedding infrastructure.

## Setup
- MCP config: `.mcp.json` (project-level, committed as `.mcp.json.example`)
- Permissions: `.claude/settings.local.json` (committed as `.example`)
- `/note` skill for writing notes (autonomous or on request)
- 10 vendor skills from `basicmachines-co/basic-memory-skills` (defrag, reflect, tasks, etc.)
- `/start-session` queries recent activity + relevant notes
- `/end-session` saves session knowledge to Basic Memory
- CLAUDE.md rule: "Always query Basic Memory before coding"

## Consequences
- MEMORY.md is now a 68-line lean index, not a full knowledge dump
- Knowledge survives context compaction and session boundaries
- New developers can query the knowledge base on day one
- Notes are git-tracked and sharable across the team
