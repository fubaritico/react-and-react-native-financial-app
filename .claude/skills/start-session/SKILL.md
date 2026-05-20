---
name: start-session
description: Initialize a working session by loading context from CLAUDE.md, relevant rule files, and memory. Use at the beginning of every new conversation or session.
allowed-tools: Read mcp__basic-memory__recent_activity mcp__basic-memory__search_notes mcp__basic-memory__read_note mcp__basic-memory__build_context
metadata:
  author: financial-app
  version: "1.0"
---

# Start Session

Gather all necessary written context from the previous session.

## Steps

1. Read `.claude/CLAUDE.md` to load current Session State and reference file list
2. Read memory files from the auto memory directory if they exist
3. **Load Basic Memory context** — query the knowledge base for recent activity and notes relevant to the current task:
   ```
   mcp__basic-memory__recent_activity(project: "financial-app", timeframe: "7d")
   ```
   Then read any notes directly related to the upcoming work (based on `### Next` in CLAUDE.md):
   ```
   mcp__basic-memory__search_notes(query: "<topic from Next>", project: "financial-app")
   ```
4. **Determine which rule files to load autonomously** — based on the task (user-specified or default from `### Next`), decide which `.claude/rules/*.md` files are relevant and load them. Never ask the user — rules and skills are tools at your disposal, you decide what you need.
5. Remind the user of the next step from `### Next` in CLAUDE.md
