---
title: App Philosophy — Forecasting Not Ledger
type: note
permalink: app-philosophy-forecasting-not-ledger
tags: [decision, product, philosophy]
---

# App Philosophy — Forecasting Not Ledger

## Observations

- [principle] The app is a supplementary financial management / forecasting tool — it NEVER writes to the user's bank account
- [principle] In bank mode, data is copied as a working draft — the app works on copies, never originals
- [design] User controls month creation manually — typically when they get paid. Not automatic, not calendar-driven
- [design] Bank transactions are read-only copies — only recurrence field is editable, deletion not allowed
- [design] Manual transactions are fully editable + deletable — these are forecasts and predictions
- [design] Refresh merges bank + manual transactions, differentiating sources visually
- [design] Budgets are implicitly recurring — copied as independent records each new month (not shared references)
- [design] Pots are cumulative savings across months — same pot lives forever, no monthly reset
- [model] Balance = `reference - SUM(pots.total)` — reference is a stored snapshot, not a live bank balance
- [model] Current/income/expenses computed by RPC `get_balance(user_id, month?)` — not stored as fields
- [consequence] Two modes: "bank" (GoCardless connection, read-only source) and "manual" (user enters everything)
- [consequence] Onboarding flow asks user to choose mode before seeing any data

## Relations

- shapes [[Balance Computation Model]]
- shapes [[Transaction Source Model]]
- shapes [[Onboarding Flow Design]]
- future [[GoCardless Bank Connection]]
