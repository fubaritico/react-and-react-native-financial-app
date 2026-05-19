---
title: Supabase Data Access Layer Pattern
type: note
permalink: supabase-layer-pattern
tags: [pattern, api, supabase, architecture]
---

# Supabase Data Access Layer Pattern

## Observations

- [pattern] All Supabase calls encapsulated in typed wrapper functions in `src/supabase/`
- [pattern] Return types use discriminated unions: `SupabaseResult<T>` (single), `SupabaseListResult<T>` (list+count), `SupabaseDeleteResult`, `ISupabaseErrorOnly`
- [pattern] Use `const result = await supabase...` — no destructuring to avoid `any` spreading from untyped client
- [pattern] Single `as TypeRow` cast after the error guard — this is the ONLY place casts exist in the codebase
- [pattern] Row types from Prisma: `import type { budgetsModel } from '@financial-app/prisma'`
- [pattern] Payload interfaces use explicit `number`/`string` — NOT `Pick<Model>` because Prisma uses `Decimal`/`Date`
- [rule] ALWAYS filter by `user_id` — service role key bypasses RLS so this IS the access control
- [rule] Use `data ?? []` for list endpoints — Supabase can return null
- [rule] Use `.single()` for endpoints returning one record
- [rule] Use `.select()` after `.insert()` / `.update()` to return the modified record
- [pattern] RPCs for complex queries: `supabase.rpc('function_name', { params })`
- [pattern] RPCs for atomic mutations (race-condition safe): `update_pot_total` handles read+write in single SQL transaction
- [pattern] `SORT_MAP` lives in supabase layer file, not in routes — keeps sort logic with data access
- [pattern] Pagination: supabase layer receives `{ page, limit }`, calculates `from/to` range internally

## Relations

- part_of [[API Architecture]]
- uses [[Why Supabase SDK Over Prisma ORM]]
- types_from [[Prisma Type Generation]]
- tested_by [[Testing Architecture Decisions]]
