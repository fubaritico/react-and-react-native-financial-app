---
name: note
description: Add a note to the Basic Memory knowledge base. Use when the user asks to remember something, when an important decision is made, when a non-obvious fix is found, or when any insight is worth preserving for the team. Can be triggered explicitly (/note) or autonomously by the agent.
allowed-tools: mcp__basic-memory__write_note mcp__basic-memory__edit_note mcp__basic-memory__read_note mcp__basic-memory__search_notes mcp__basic-memory__list_directory
metadata:
  author: financial-app
  version: "1.0"
---

# Note — Basic Memory Knowledge Base

Write or update a note in the project's shared knowledge base (`memory/` directory).
Notes are Markdown files versioned in git — any team member or AI agent can read them.

## When to use (autonomously or on request)

- **User says to remember something** — always note it
- **Architectural decision** — why we chose X over Y, trade-offs considered
- **Debugging insight** — a non-obvious root cause + fix that cost time to find
- **Pattern or convention** — a recurring approach the team settled on
- **Gotcha or pitfall** — something that surprised us and would surprise others
- **Integration lesson** — how two libraries/tools interact in our specific setup
- **Performance finding** — before/after measurements, what worked and what didn't

## When NOT to use

- Temporary, session-specific state (use `end-session` instead)
- Information already captured in `.claude/rules/` or `CLAUDE.md`
- Speculative conclusions from a single file read — verify first

## Steps

1. **Check for duplicates** — search existing notes to see if the topic is already covered
   ```
   mcp__basic-memory__search_notes(query: "topic keywords")
   ```
2. **If a note exists** — update it with `mcp__basic-memory__edit_note` (append or replace_section)
3. **If no note exists** — create one with `mcp__basic-memory__write_note`:
   - `title`: concise, descriptive (e.g. "Why we pin react-dom versions")
   - `directory`: always `"/"` (project root = `memory/`)
   - `project`: `"financial-app"`
   - `tags`: relevant categories (e.g. `"architecture,styling"`, `"debugging,jest"`, `"decision,auth"`)
   - `content`: structured Markdown with context, reasoning, and concrete details

## Note structure

```markdown
# Title

## Context
What situation or problem prompted this note.

## Decision / Finding / Fix
What was decided, discovered, or fixed — and why.

## Consequences
What this means going forward — trade-offs, things to watch for.
```

Keep notes focused on one topic. Prefer updating an existing note over creating a near-duplicate.

## Vendor skills (Basic Memory)

For more advanced workflows, use these installed vendor skills instead of raw MCP calls:

| Skill | When to use |
|-------|-------------|
| `/memory-notes` | Write well-structured notes with consistent formatting, links, and metadata |
| `/memory-tasks` | Track persistent tasks across conversations — continuity on ongoing work |
| `/memory-schema` | Learn and enforce note patterns for consistency over time |
| `/memory-reflect` | Review a conversation and capture key information as structured notes |
| `/memory-defrag` | Reorganize: split large notes, eliminate duplicates, clean up structure |
| `/memory-lifecycle` | Move notes through stages (draft → active → archive) using folders |
| `/memory-metadata-search` | Find notes by specific properties (status, tags, custom fields) |
| `/memory-ingest` | Transform transcripts, emails, or documents into organized notes |
| `/memory-research` | Research a topic on the web and save findings as notes |

Prefer these skills for structured operations. Use raw MCP calls (`mcp__basic-memory__write_note`) only for quick, simple notes.

## Tags taxonomy

Use consistent tags to keep the knowledge base searchable:

| Tag | When |
|-----|------|
| `architecture` | Structural decisions (layers, packages, patterns) |
| `debugging` | Root cause analysis, non-obvious fixes |
| `decision` | Explicit choice between alternatives |
| `styling` | twrnc, Tailwind, CVA, tokens |
| `testing` | Jest, Vitest, MSW, testing patterns |
| `auth` | Supabase auth, OAuth, TOTP |
| `api` | Express, routes, Supabase layer |
| `monorepo` | pnpm, workspaces, resolution |
| `expo` | Expo SDK, prebuild, Metro |
| `react-native` | RN-specific behavior, platform quirks |
| `web` | Vite, React Router, DOM-specific |
| `performance` | Optimization findings |
| `onboarding` | Onboarding flow, screens, preferences |
| `gotcha` | Surprising behavior, easy-to-miss pitfalls |
