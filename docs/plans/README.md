# Implementation Plans — Index

> These plans are written for Claude Code. Read the relevant plan before starting a phase.
> Each plan is self-contained with exact file contents, commands, and completion checklists.
> Plans must be executed in order — each phase has dependencies on the previous.

## Phase Overview

| Phase | Plan | Goal | Depends On |
|-------|------|------|------------|
| 0 | phase-0-cleanup.md | Canonical app decision, restructure to apps/ | nothing |
| 1 | phase-1-tokens.md | Style Dictionary token pipeline | Phase 0 |
| 2 | phase-2-tailwind-config.md | Shared Tailwind config package | Phase 1 |
| 3 | phase-3-ui.md | Cross-platform file extension split + CVA | Phase 2 |
| 4 | phase-4-web-app.md | React Router + Vite web app scaffold | Phase 3 |
| 5 | phase-5-shared.md | Supabase, Jotai, TanStack Query shared package | Phase 4 |
| 6 | phase-6-turborepo.md | Turborepo pipeline + build orchestration | Phase 7 (absorbed) |
| 7 | phase-7-home-page.md | Turborepo + routing + mock data + Home page | Phase 5 |
| 8 | phase-8-api-and-http-client.md | Express API (OpenAPI) + HeyAPI HTTP client | Phase 7 |

## Current Status

- [x] Project scanned and analysed
- [x] .claude/ folder created with rules and commands
- [x] All phase plans written
- [ ] Phase 0 — not started
- [ ] Phase 1 — not started
- [ ] Phase 2 — not started
- [ ] Phase 3 — not started
- [ ] Phase 4 — not started
- [ ] Phase 5 — not started
- [ ] Phase 6 — absorbed into Phase 7
- [ ] Phase 7 — not started
- [ ] Phase 8 — not started

## Key Reminders Before Starting Any Phase

1. Always read `.claude/CLAUDE.md` for full context
2. Run `pnpm install` after any package.json change
3. Run `/build-tokens` after any token source change
4. Never hardcode colors — always trace back to `packages/tokens/src/`
5. When creating a component, use the `/new-component` command pattern

## Architecture Reference

```
tokens/src/*.json          (edit here for design values)
       ↓ style-dictionary
tokens/build/              (never edit — generated)
       ↓
tailwind-config/index.js   (thin wrapper)
ui/lib/tw.ts    (RN singleton)
       ↓
ui/variants/    (CVA objects — shared contract)
       ↓
ui/components/
  *.native.tsx             (twrnc — consumed by apps/mobile)
  *.web.tsx                (Tailwind CSS + cn() — consumed by apps/web)
       ↓
apps/mobile + apps/web     (never touch ui internals)
```
