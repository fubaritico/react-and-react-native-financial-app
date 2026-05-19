---
name: end-session
description: Update the Session State in CLAUDE.md to reflect work done before closing a session. Use at the end of a conversation or when wrapping up work.
allowed-tools: Read Edit mcp__basic-memory__write_note mcp__basic-memory__edit_note mcp__basic-memory__search_notes
metadata:
  author: financial-app
  version: "1.0"
---

# End Session

Update the Session State in CLAUDE.md to reflect the current state of work before closing the session.

## Steps

1. Read `.claude/CLAUDE.md` to see the current Session State
2. Review the conversation history to identify:
   - What was completed this session (new items to add to `### Completed`)
   - What the next actionable step is (`### Next`)
   - Any new known issues surfaced (`### Known Issues`)
3. Edit the `## Session State` section in `.claude/CLAUDE.md`:
   - Append newly completed items to `### Completed` (keep existing entries, add new ones)
   - Replace `### Next` with the single most actionable next step
   - Update `### Known Issues` — add new ones, remove resolved ones
4. **Save session knowledge to Basic Memory** — review the conversation for:
   - Architectural decisions made → create or update a note
   - Non-obvious fixes found → create a `fix-*` note
   - New gotchas or pitfalls discovered → add to existing notes or create new ones
   - Patterns confirmed across multiple interactions → note them
   Use `mcp__basic-memory__search_notes` first to avoid duplicates, then `write_note` or `edit_note`.
5. If new known issues surfaced, update `.claude/known-issues.md`
6. Propose all changes to the user before writing — do not write without confirmation
