# Rules — Decision Tree (BEFORE any action)

> This file is loaded in context. Check it BEFORE writing any file.

## Skill Triggers — NEVER bypass

| I'm about to... | Invoke |
|-----------------|--------|
| Write a test | `Skill: /test ComponentName` |
| Write a story | `Skill: /story ComponentName` |
| Create a component | `Skill: /new-component ComponentName` |
| Commit | `Skill: /commit` |
| Review code | `Skill: /review` |
| Work on API routes | `Skill: /api-openapi` |
| End session | `Skill: /end-session` |
| Start session | `Skill: /start-session` |

## Pre-flight — BEFORE writing code

1. Query Basic Memory for relevant context
2. Check if a skill handles this task (table above)
3. If yes → use the Skill tool, do NOT write manually
4. If no → write code, then `npx prettier --write <path>` before lint

## Rule

**NEVER write a file that a skill can generate.** Invoke the Skill tool instead.
