---
title: Supabase Database Schema
type: note
permalink: supabase-database-schema
tags: [database, supabase, schema]
---

# Supabase Database Schema

## Observations

- [table] `balances` — reference balance per user, used as starting point for computation
- [table] `transactions` — source field: `manual` or `bank`. Manual = fully editable, bank = read-only copies
- [table] `budgets` — per month, copied as independent records each new month (implicitly recurring)
- [table] `pots` — cumulative savings, same pot lives across months (no monthly reset)
- [table] `user_preferences` — onboarding state: mode (manual/bank), has_seen_onboarding, initial_balance_set
- [rpc] `get_balance(user_id, month?)` — computes current = reference - SUM(pots.total), plus income/expenses
- [rpc] `get_budgets_with_spent(user_id, month)` — returns budgets with spent amounts computed from transactions
- [model] Balance is NOT a stored current value — it's computed: `current = reference - SUM(pots.total)`
- [setup] Schema in `supabase/setup.sql` (4 tables, RLS, indexes, 2 RPCs)
- [seed] Mock data in `supabase/seed.sql` (from data.json)
- [guide] Setup guide: `docs/modus-operandi/supabase-setup.md`
- [security] RLS enabled on all tables — but API uses service role key (bypasses RLS), enforces access via middleware

## Relations

- queried_by [[Supabase Layer Pattern]]
- modeled_by [[App Philosophy — Forecasting Not Ledger]]
- types_from [[Prisma Type Generation]]
- seeded_from [[Mock Data]]
