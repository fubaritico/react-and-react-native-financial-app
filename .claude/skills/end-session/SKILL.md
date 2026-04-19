---
name: end-session
description: Update the Session State in CLAUDE.md to reflect work done before closing a session. Use at the end of a conversation or when wrapping up work.
allowed-tools: Read Edit
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
4. If a new architectural decision or stable pattern was established this session, update the relevant memory file
5. Propose all changes to the user before writing — do not write without confirmation
