---
title: Custom Categories — Session 1 DB Decisions
type: note
permalink: financial-app/custom-categories-session-1-db-decisions
tags:
- categories
- db-migration
- architecture
- decisions
---

# Custom Categories — Session 1 DB Decisions

## Observations

- [decision] Category `color` column stores DS token keys (`"blue"`, `"cyan"`, `"army-green"`) not hex values — varchar(20). Components resolve via `bg-${category.color}` in Tailwind/twrnc. Constrained to 19 palette colors from `packages/tokens/src/base/color.json`.
- [decision] `balances` table consolidated into `user_preferences.reference_balance` (numeric 12,2) — eliminates a whole table, simplifies `setInitialBalance()` from 3 sequential writes to 1 UPDATE.
- [decision] `GET/PUT /balance/reference` endpoints removed — reference balance now editable via `PUT /users/me/preferences` with `reference_balance` field.
- [migration] 10 default system categories seeded per user: General(blue), Dining Out(brown), Groceries(army-green), Entertainment(red), Transportation(navy-grey), Lifestyle(navy), Personal Care(yellow), Education(cyan), Bills(blue), Shopping(magenta).
- [migration] `avatar` dropped from transactions, `theme` + `category` (string) dropped from budgets, `category` (string) dropped from transactions — replaced by `category_id` FK.
- [migration] RPCs `get_budgets_with_spent` and `get_recurring_bills` updated to JOIN on `categories` table — return `category_name`, `category_icon`, `category_color`.
- [migration] `get_balance` RPC updated to read from `user_preferences.reference_balance` instead of `balances.reference`.
- [status] API code partially updated but `pnpm type-check` fails — session 2 must complete supabase layer + schema + route refactor for transactions/budgets/recurring-bills.

## Relations

- continues [[Custom Categories Feature Plan]]
- modifies [[API Architecture]]
- modifies [[Supabase Database Schema]]
- relates to [[Styling — The Five Layers]]
