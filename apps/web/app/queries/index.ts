import {
  getBalanceOptions,
  getBudgetsOptions,
  getPotsOptions,
  getRecurringBillsOptions,
  getTransactionsOptions,
} from '@financial-app/http-client'
import { getCurrentBudgetMonth } from '@financial-app/shared'

import { TRANSACTION_FETCH_LIMIT } from '../lib/constants'

import type { QueryClient } from '@tanstack/react-query'

/** @param queryClient - QueryClient instance (server or client)
 *  @returns Prefetched balance data */
export const balanceQuery = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(getBalanceOptions())

/** @param queryClient - QueryClient instance (server or client)
 *  @returns Prefetched transactions data */
export const transactionsQuery = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(
    getTransactionsOptions({
      query: { limit: TRANSACTION_FETCH_LIMIT, sort: 'latest' },
    })
  )

/** @param queryClient - QueryClient instance (server or client)
 *  @returns Prefetched pots data */
export const potsQuery = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(getPotsOptions())

/** @param queryClient - QueryClient instance (server or client)
 *  @returns Prefetched budgets data for the current month */
export const budgetsQuery = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(
    getBudgetsOptions({ query: { month: getCurrentBudgetMonth() } })
  )

/** @param queryClient - QueryClient instance (server or client)
 *  @returns Prefetched recurring bills data */
export const recurringBillsQuery = (queryClient: QueryClient) =>
  queryClient.ensureQueryData(getRecurringBillsOptions())
