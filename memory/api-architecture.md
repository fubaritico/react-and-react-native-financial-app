---
title: API Architecture
type: note
permalink: api-architecture
tags: [architecture, api, express, supabase]
---

# API Architecture

## Observations

- [stack] Express 5 + Zod validation + Supabase JS client (service role key) + Prisma types
- [pattern] One route file per entity (balance, transactions, budgets, pots, recurring-bills, user-preferences)
- [pattern] One schema file per entity — Zod schemas are the single source of truth for validation AND OpenAPI spec
- [pattern] One supabase layer file per entity — typed wrappers around all Supabase calls
- [rule] Route files NEVER import supabase client directly — always through `../supabase/index.js`
- [rule] `requireAuth` applied at router level via `.use()` — never per-handler (except /health)
- [rule] Every handler checks `if (result.error)` — never skip the error check
- [rule] Every error response uses `{ error: string }` shape — no other format
- [pattern] Auth via `supabase.auth.getUser(token)` — no local JWT verification, no `jsonwebtoken` dependency
- [pattern] `res.locals.userId` is the canonical way to access authenticated user ID in handlers
- [pattern] Service role key bypasses RLS — access control enforced via `.eq('user_id', userId)` in every query
- [pattern] No `/auth` routes — signup/login stays 100% client-side via Supabase SDK
- [docs] Swagger UI at `/docs` — auto-generated from Zod schemas via `@asteasolutions/zod-to-openapi`
- [testing] `app.ts` exports `createApp()` with no `.listen()` — supertest consumes directly

## Relations

- uses [[Why Supabase SDK Over Prisma ORM]]
- types_from [[Prisma Type Generation]]
- tested_by [[Testing Architecture Decisions]]
- validates_with [[Zod Schema Validation]]
- deployed_on [[Netlify Functions]]
