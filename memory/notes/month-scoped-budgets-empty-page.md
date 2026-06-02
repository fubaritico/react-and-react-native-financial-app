---
title: month-scoped-budgets-empty-page
type: note
permalink: financial-app/notes/month-scoped-budgets-empty-page
tags:
- budgets
- gotcha
- web
- months
---

# month-scoped-budgets-empty-page

## Symptom
The web **budgets page opens but is empty** even though budgets exist in the DB. Same data shows nothing after a month rollover.

## Root cause
Budgets are **month-scoped**. The budgets route + Home query with `getBudgetsOptions({ query: { month: getCurrentBudgetMonth() } })` (`getCurrentBudgetMonth()` returns today's `YYYY-MM`). The `get_budgets_with_spent` / `get_balance` RPCs filter transactions by `to_char(t.date,'YYYY-MM') = p_month`. If the budgets/transactions rows are stored for a **different month** than the current one, the query returns nothing. Transactions/pots are NOT month-filtered — that's why only budgets looked broken.

## Observations
- [gotcha] On the 1st of a new month, last month's budgets won't appear until budgets exist for the new month. There is no "months" feature / month switcher yet.
- [fix-dev] Repeatable: `pnpm seed` (`apps/api/src/supabase/seed.ts` shifts all mock dates to the current month, destructive reset). Non-destructive: `UPDATE budgets SET month = '<YYYY-MM>'` + shift transaction dates `+ interval '1 month'` (scoped to the user).
- [not-a-bug] This is the documented month-scoped design (app = forecasting tool, user controls month creation rhythm), not a code bug.
- [next] Proper fix = a `months` table + month switcher (see CLAUDE.md `### Next` "Months feature").

## Relations
- relates to [[Balance Model — get_balance RPC Fix]]
- relates to [[Known Issues Registry]]
