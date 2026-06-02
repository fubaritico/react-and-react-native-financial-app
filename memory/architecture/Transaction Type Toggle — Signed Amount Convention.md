---
title: Transaction Type Toggle — Signed Amount Convention
type: architecture
permalink: financial-app/architecture/transaction-type-toggle-signed-amount-convention
tags:
- transactions
- forms
- ui
---

# Transaction Type Toggle — Signed Amount Convention

## Context
The transaction form shows an expense/income `SegmentedControl`, but the DB/API keep a single **signed** `amount` (positive = income, negative = expense). No DB/API change was made — the toggle is a pure presentation layer over the sign.

## Observations
- [decision] The form (`TransactionFormData`) holds TWO fields: `transactionType: 'expense' | 'income'` and `amount: string` as the **absolute** value (no sign). The amount input sanitizes with `/[^0-9.]/g` (the `-` is dropped).
- [pattern] Sign↔type recomposition lives ONLY in `useTransactionCrud`, never in the form: submit → `toSignedAmount(amount, type)` (`expense → -abs`, `income → +abs`, returns `null` for 0/NaN → no mutate); edit-init → `transactionType = transaction.amount < 0 ? 'expense' : 'income'` and `amount = String(Math.abs(transaction.amount))`.
- [location] util `packages/features/src/transactions/TransactionFormContent/TransactionFormContent.utils.ts` (`toSignedAmount`).
- [gotcha] `useFormValidation.validateField(field, value: unknown)` takes `unknown` — so the SegmentedControl `onChange` (string) needs NO cast; Zod (`z.enum(['expense','income'])`) enforces it at runtime.
- [decision] Zod schema also rejects `amount === 0` (`validation.amountZero`) and `DEFAULT_TRANSACTION_FORM` became a factory `createDefaultTransactionForm()` so the default `date` isn't frozen at module load.
- [decision] Amount placeholder shows decimals (`45.50`) to signal the decimal format is accepted.

## Relations
- relates to [[Balance Model — get_balance RPC Fix]]
- relates to [[Custom Categories — Frontend Adaptation]]
