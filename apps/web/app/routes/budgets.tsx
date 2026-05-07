import { BudgetCategoryCard, BudgetOverview } from '@financial-app/features'
import {
  getBudgetsOptions,
  getTransactionsOptions,
} from '@financial-app/http-client'
import { buildBudgetPageData, getErrorMessage } from '@financial-app/shared'
import { Alert, Button, Skeleton, Spinner, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { queryClient } from '../lib/query-client'

import type { Route } from './+types/budgets'

/** Current budget month — matches seed data. */
const BUDGET_MONTH = '2024-08'

// eslint-disable-next-line @typescript-eslint/no-empty-function -- disabled button, wired in CRUD phase
const noop = () => {}

const budgetsOpts = getBudgetsOptions({ query: { month: BUDGET_MONTH } })
const txnOpts = getTransactionsOptions({ query: { limit: 1000 } })

export async function clientLoader() {
  const [budgets, txn] = await Promise.all([
    queryClient.ensureQueryData(budgetsOpts).catch(() => undefined),
    queryClient.ensureQueryData(txnOpts).catch(() => undefined),
  ])
  return { budgets, txn }
}

export function HydrateFallback() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-center justify-between">
        <Skeleton variant="line" width="w-40" height="h-8" />
        <Skeleton variant="rectangle" width="w-36" height="h-10" />
      </div>
      <div className="grid grid-cols-1 gap-6 @[1100px]:grid-cols-[1fr_1.5fr]">
        <Skeleton variant="rectangle" height="h-72" />
        <div className="flex flex-col gap-6">
          <Skeleton variant="rectangle" height="h-64" />
          <Skeleton variant="rectangle" height="h-64" />
        </div>
      </div>
    </div>
  )
}

export default function Budgets({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()

  const {
    data: budgets,
    error: budgetsError,
    isLoading: budgetsLoading,
  } = useQuery({
    ...budgetsOpts,
    initialData: loaderData.budgets,
  })
  const { data: txnResult, error: txnError } = useQuery({
    ...txnOpts,
    initialData: loaderData.txn,
  })

  const { budgetItems, categoryCards } = useMemo(
    () => buildBudgetPageData(budgets ?? [], txnResult?.data ?? []),
    [budgets, txnResult]
  )

  if (budgetsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <Spinner />
      </div>
    )
  }

  const error = budgetsError ?? txnError
  if (error) {
    return (
      <div className="p-6 lg:p-10">
        <Typography variant="page-title" as="h1" className="mb-4">
          {t('budgets.title')}
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
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Typography variant="page-title" as="h1">
          {t('budgets.title')}
        </Typography>
        <Button
          title={t('budgets.addNewBudget')}
          onPress={noop}
          variant="primary"
          disabled
        />
      </div>

      {/* 2-col when content area >= 1100px (desktop with sidebar expanded/collapsed) */}
      <div className="grid grid-cols-1 gap-6 @[1100px]:grid-cols-[1fr_1.5fr]">
        {/* Left — Budget Overview */}
        <div className="@[1100px]:self-start">
          <BudgetOverview
            budgets={budgetItems}
            showSpentAmount
            spendingSummaryTitle={t(
              'budgets.spendingSummary',
              'Spending Summary'
            )}
          />
        </div>

        {/* Right — Category Cards */}
        <div className="flex flex-col gap-6">
          {categoryCards.map((card) => (
            <BudgetCategoryCard
              key={card.category}
              category={card.category}
              maximum={card.maximum}
              spent={card.spent}
              color={card.color}
              items={card.items}
              maximumOfLabel={t('budgets.maximumOf')}
              spentLabel={t('budgets.spent')}
              remainingLabel={t('budgets.remaining')}
              latestSpendingTitle={t('budgets.latestSpending')}
              seeAllLabel={t('budgets.seeAll')}
              editLabel={t('budgets.editBudget')}
              deleteLabel={t('budgets.deleteBudget')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
