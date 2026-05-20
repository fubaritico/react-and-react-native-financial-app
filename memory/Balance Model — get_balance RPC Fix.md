---
title: Balance Model — get_balance RPC Fix
type: note
permalink: financial-app/balance-model-get-balance-rpc-fix
tags:
- api
- decision
- debugging
- architecture
---

# Balance Model — get_balance RPC Fix

## Context

The `get_balance` Supabase RPC had an incorrect formula for calculating `current` balance.

## The Balance Model

Three distinct concepts:

1. **Solde réel** = `reference + income - expenses` — factual, based on real transactions
2. **Argent réservé** = `sum(pots.total)` — money voluntarily set aside for goals
3. **Solde disponible (current)** = `reference + income - expenses - pots`

Budgets are NOT part of the balance calculation — they are spending limits per category, not actual money.

## The Bug

Old formula: `current = reference - pots`
Transactions (income/expenses) were calculated for display but **never impacted** `current`.

## The Fix

New formula: `current = reference + income - expenses - pots`

Applied via `CREATE OR REPLACE FUNCTION` in Supabase SQL Editor (2026-05-20).

## Verified Live

| Field | Value |
|-------|-------|
| reference | 5000 |
| income | 3814.25 |
| expenses | 1699.75 |
| pots | 930 |
| current | 6184.50 |

`5000 + 3814.25 - 1699.75 - 930 = 6184.50` — correct.

## Next

- Align `data.json` mock to match the corrected formula
- Full RPC analysis in `~/Desktop/get_balance_rpc.md`