import {
  BudgetOverview,
  PotsOverview,
  RecurringBillsOverview,
  TransactionsOverview,
} from '@financial-app/features'
import {
  getBalanceOptions,
  getBudgetsOptions,
  getPotsOptions,
  getRecurringBillsOptions,
  getTransactionsOptions,
} from '@financial-app/http-client'
import {
  buildRecurringBillsPageData,
  formatDate,
  getCurrentBudgetMonth,
  getErrorMessage,
} from '@financial-app/shared'
import { Alert, BalanceCard, Spinner, Typography } from '@financial-app/ui'
import { HydrationBoundary, dehydrate, useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import type { IconName } from '@financial-app/icons'
import type { ITransaction } from '@financial-app/shared'

import { createServerQueryClient } from '../lib/query-client.server'
import {
  balanceQuery,
  budgetsQuery,
  potsQuery,
  recurringBillsQuery,
  transactionsQuery,
} from '../queries'

import type { Route } from './+types/home'

/** @returns Prefetched overview data via server-side dehydration. */
export async function loader() {
  const t0 = performance.now()
  const queryClient = createServerQueryClient()

  const [, , , ,] = await Promise.all([
    balanceQuery(queryClient).then((r) => {
      console.warn(
        `[SSR] [HOME] balance=${(performance.now() - t0).toFixed(0)}ms`
      )
      return r
    }),
    transactionsQuery(queryClient).then((r) => {
      console.warn(
        `[SSR] [HOME] transactions=${(performance.now() - t0).toFixed(0)}ms`
      )
      return r
    }),
    potsQuery(queryClient).then((r) => {
      console.warn(`[SSR] [HOME] pots=${(performance.now() - t0).toFixed(0)}ms`)
      return r
    }),
    budgetsQuery(queryClient).then((r) => {
      console.warn(
        `[SSR] [HOME] budgets=${(performance.now() - t0).toFixed(0)}ms`
      )
      return r
    }),
    recurringBillsQuery(queryClient).then((r) => {
      console.warn(
        `[SSR] [HOME] recurring=${(performance.now() - t0).toFixed(0)}ms`
      )
      return r
    }),
  ])

  console.warn(
    `[SSR] [HOME] loader TOTAL=${(performance.now() - t0).toFixed(0)}ms`
  )
  return { dehydratedState: dehydrate(queryClient) }
}

/** @returns Overview page with balance cards, pots, transactions, budgets, and recurring bills. */
export default function Home({ loaderData }: Route.ComponentProps) {
  useEffect(() => {
    console.warn('[CLIENT] [HOME] component MOUNTED — page visible')
  }, [])

  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    data: balance,
    error: balanceError,
    isLoading: balanceLoading,
  } = useQuery(getBalanceOptions())

  const { data: transactions, error: txnError } = useQuery(
    getTransactionsOptions({ query: { limit: 1000, sort: 'latest' } })
  )
  const { data: pots, error: potsError } = useQuery(getPotsOptions())
  const { data: budgets, error: budgetsError } = useQuery(
    getBudgetsOptions({ query: { month: getCurrentBudgetMonth() } })
  )
  const { data: recurringBills, error: recurringError } = useQuery(
    getRecurringBillsOptions()
  )

  const latestTransactions = useMemo(
    () =>
      (transactions?.data ?? []).map((txn) => ({
        name: txn.name,
        amount: txn.amount,
        date: formatDate(txn.date),
        categoryIcon: txn.category_icon as IconName,
        categoryColor: txn.category_color,
      })),
    [transactions]
  )

  const potItems = useMemo(
    () =>
      (pots ?? []).map((pot) => ({
        name: pot.name,
        total: pot.total,
        color: pot.theme,
      })),
    [pots]
  )

  const totalSaved = useMemo(
    () => (pots ?? []).reduce((sum, pot) => sum + pot.total, 0),
    [pots]
  )

  const budgetItems = useMemo(
    () =>
      (budgets ?? []).map((budget) => ({
        category: budget.category_name,
        maximum: budget.maximum,
        spent: budget.spent,
        color: budget.category_color,
      })),
    [budgets]
  )

  const recurringData = useMemo(
    () =>
      recurringBills
        ? buildRecurringBillsPageData(recurringBills as ITransaction[])
        : null,
    [recurringBills]
  )

  const handleNavigatePots = useCallback(() => {
    void navigate('/pots')
  }, [navigate])

  const handleNavigateTransactions = useCallback(() => {
    void navigate('/transactions')
  }, [navigate])

  const handleNavigateBudgets = useCallback(() => {
    void navigate('/budgets')
  }, [navigate])

  const handleNavigateRecurring = useCallback(() => {
    void navigate('/recurring')
  }, [navigate])

  const isLoading = balanceLoading

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center min-h-screen justify-center p-6 lg:p-10">
        <Spinner />
      </div>
    )
  }

  const error =
    balanceError ?? txnError ?? potsError ?? budgetsError ?? recurringError

  if (error) {
    return (
      <div className="p-6 lg:p-10">
        <Typography variant="page-title" as="h1" className="mb-4">
          {t('overview.title')}
        </Typography>
        <Alert
          severity="error"
          message={t('common.errorLoading')}
          description={import.meta.env.DEV ? getErrorMessage(error) : undefined}
        />
      </div>
    )
  }

  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <div className="p-6 lg:p-10">
        <Typography variant="page-title" as="h1" className="mb-8">
          {t('overview.title')}
        </Typography>

        {/* Balance cards — stack on mobile, row on md+ */}
        {balance && (
          <div className="flex flex-col gap-3 md:flex-row md:gap-6">
            <div className="md:flex-1">
              <BalanceCard
                label={t('overview.currentBalance')}
                amount={balance.current}
                tone="dark"
              />
            </div>
            <div className="md:flex-1">
              <BalanceCard
                label={t('overview.income')}
                amount={balance.income}
                tone="light"
                shadow
              />
            </div>
            <div className="md:flex-1">
              <BalanceCard
                label={t('overview.expenses')}
                amount={balance.expenses}
                tone="light"
                shadow
              />
            </div>
          </div>
        )}

        {/* Main sections — single column on mobile, 2-col grid on lg+ */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <PotsOverview
              title={t('potsOverview.title')}
              seeDetailsLabel={t('common.seeDetails')}
              totalSavedLabel={t('potsOverview.totalSaved')}
              savingsIconLabel={t('accessibility.savingsIcon')}
              totalSaved={totalSaved}
              pots={potItems}
              onSeeDetails={handleNavigatePots}
            />

            <TransactionsOverview
              title={t('transactionsOverview.title')}
              viewAllLabel={t('common.viewAll')}
              transactions={latestTransactions}
              onViewAll={handleNavigateTransactions}
            />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <BudgetOverview
              title={t('budgets.title')}
              seeDetailsLabel={t('common.seeDetails')}
              budgets={budgetItems}
              ofLabel={t('budgets.of')}
              limitLabel={t('budgets.limit')}
              onSeeDetails={handleNavigateBudgets}
            />

            {recurringData && (
              <RecurringBillsOverview
                title={t('recurringBillsOverview.title')}
                seeDetailsLabel={t('common.seeDetails')}
                paidBillsLabel={t('recurringBillsOverview.paidBills')}
                totalUpcomingLabel={t('recurringBillsOverview.totalUpcoming')}
                dueSoonLabel={t('recurringBillsOverview.dueSoon')}
                paid={recurringData.paidTotal}
                upcoming={recurringData.upcomingTotal}
                dueSoon={recurringData.dueSoonTotal}
                onSeeDetails={handleNavigateRecurring}
              />
            )}
          </div>
        </div>
      </div>
    </HydrationBoundary>
  )
}
