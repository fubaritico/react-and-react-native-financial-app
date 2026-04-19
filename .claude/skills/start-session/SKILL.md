---
name: start-session
description: Initialize a working session by loading context from CLAUDE.md, relevant rule files, and memory. Use at the beginning of every new conversation or session.
allowed-tools: Read
metadata:
  author: financial-app
  version: "1.0"
---

# Start Session

Gather all necessary written context from the previous session.

## Steps

1. Read `.claude/CLAUDE.md` to load current Session State and reference file list
2. Read memory files from the auto memory directory if they exist
3. Ask the user which rule files are needed for this session, based on what's in `### Next`
4. Read the relevant rule files and memorize their patterns
5. Remind the user of the next step from `### Next` in CLAUDE.md
