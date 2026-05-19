---
title: Testing Architecture Decisions
type: note
permalink: testing-architecture-decisions
tags: [decision, testing, architecture]
---

# Testing Architecture Decisions

## Observations

- [constraint] Vitest CANNOT render React Native components — `@testing-library/react-native` only works with Jest
- [decision] API tests use Vitest + Supertest + MSW (mocks Supabase REST at HTTP level)
- [decision] RN/Expo app tests use Jest with `react-native` preset — required by RNTL
- [decision] Pure TS packages (shared, tokens) use Vitest in node environment
- [pattern] `apps/api/src/app.ts` exports `createApp()` with no `.listen()` — supertest consumes the app directly
- [pattern] MSW intercepts HTTP that Supabase JS client sends: auth at `/auth/v1/user`, REST at `/rest/v1/<table>`
- [pattern] Supabase `.single()` sends `Accept: application/vnd.pgrst.object+json` — MSW handler must return object (not array) with `content-range` header
- [pattern] Supertest requests to `127.0.0.1` are passthrough via custom `onUnhandledRequest` filter
- [pattern] Handlers organized per entity with variants: `selectOne`, `upsert`, `empty`, `dbError`
- [pattern] Tests override default handlers via `server.use(handler.variant)` per test case
- [rule] ALL code pushed must have tests — no exceptions
- [rule] Never mock entire packages to null — find the real resolution issue

## Relations

- constrained_by [[Vitest vs Jest for RN]]
- uses [[MSW Supabase Mocking]]
- applies [[Debugging Mindset]]
