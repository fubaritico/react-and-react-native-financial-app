---
name: restart-session
description: Properly end the current session, then guide through clear and restart. Use when switching tasks or refreshing context.
allowed-tools: Read Edit
user-invocable: true
metadata:
  author: financial-app
  version: "1.0"
---

# Restart Session

Properly end, clear, and restart a session in the correct order.

## Steps

### Phase 1 — End Session (automatic)

1. Read `@.claude/CLAUDE.md` to see the current Session State
2. Review the conversation history to identify:
   - What was completed this session (new items to add to `### Completed`)
   - What the next actionable step is (`### Next`)
   - Any new known issues surfaced (`### Known Issues`)
3. Edit the `## Session State` section in `.claude/CLAUDE.md`:
   - Append newly completed items to `### Completed` (keep existing entries, add new ones)
   - Replace `### Next` with the single most actionable next step
   - Update `### Known Issues` — add new ones, remove resolved ones
4. If a new architectural decision or stable pattern was established this session, update the relevant memory file in `.claude/projects/.../memory/`
5. Propose all changes to the user before writing — do not write without confirmation

### Phase 2 — Clear and Restart (user action required)

After Phase 1 is complete, instruct the user:

> Session state saved. To complete the restart:
> 1. Run `/clear` to reset the context window
> 2. Run `/start-session` to load fresh context

Do NOT attempt to run `/clear` or `/start-session` — these are user-initiated commands.
