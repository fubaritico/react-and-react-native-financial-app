---
title: Why Supabase SDK Over Prisma ORM
type: note
permalink: why-supabase-sdk-over-prisma-orm
tags: [decision, api, database, architecture]
---

# Why Supabase SDK Over Prisma ORM

## Observations

- [decision] API uses Supabase JS client (service role key) for data access, NOT Prisma as an ORM
- [reason] Frontend already uses Supabase JS SDK for auth — same protocol (PostgREST HTTP) end to end
- [reason] Supabase RPCs (`get_balance`, `get_budgets_with_spent`) are SQL functions exposed via PostgREST — PrismaClient can't call them without `$queryRaw` rewrites
- [reason] PrismaClient opens direct TCP connections to Postgres — a completely different access path than PostgREST HTTP. Two clients to the same DB = more complexity, zero gain
- [reason] Future realtime subscriptions would use the same Supabase JS SDK — unified client strategy
- [tradeoff] Supabase JS client returns untyped data — we compensate with Prisma-generated types used as `type` imports only
- [pattern] Prisma does `db pull` + `generate` for TypeScript types — zero runtime dependency, pure type generation
- [pattern] Single `as TypeRow` cast in supabase layer after error guard — only place casts exist
- [consequence] Service role key bypasses RLS — access control enforced manually via `.eq('user_id', userId)` in every query

## Relations

- shaped_by [[App Philosophy — Forecasting Not Ledger]]
- types_from [[Prisma Type Generation]]
- implemented_in [[API Supabase Layer Pattern]]
