import {
  BudgetFormContent,
  BudgetOverview,
  useBudgetCrud,
  useDeleteBodyRenderer,
  useFeedbackModals,
} from '@financial-app/features'
import {
  getBudgetsOptions,
  getCategoriesOptions,
  getTransactionsOptions,
} from '@financial-app/http-client'
import {
  buildBudgetPageData,
  getCurrentBudgetMonth,
  getErrorMessage,
  useModal,
} from '@financial-app/shared'
import { Alert, Button, Spinner, Typography } from '@financial-app/ui'
import { HydrationBoundary, dehydrate, useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type {
  BudgetFormValues,
  IBudgetFormBridge,
} from '@financial-app/features'
import type { IBudget, ICategory, ITransaction } from '@financial-app/shared'

import BudgetCardItem from '../components/BudgetCardItem'
import { TRANSACTION_FETCH_LIMIT } from '../lib/constants'
import { createServerQueryClient } from '../lib/query-client.server'
import { skipServerHop } from '../lib/skip-server-hop'
import { useFormBridge } from '../lib/use-form-bridge'
import { budgetsQuery, transactionsQuery } from '../queries'

import type { Route } from './+types/budgets'

/** @returns Prefetched budgets and transactions data via server-side dehydration. */
export async function loader() {
  const queryClient = createServerQueryClient()

  await Promise.all([budgetsQuery(queryClient), transactionsQuery(queryClient)])

  return { dehydratedState: dehydrate(queryClient) }
}

/** Client-navigation loader — skips the server hop; useQuery drives data client-side. */
export const clientLoader = skipServerHop

/**
 * @param props - Route component props including the dehydrated query state
 * @returns Budgets page with overview chart, category cards, and CRUD modals
 */
export default function Budgets({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const modal = useModal()
  const formRef = useRef<HTMLFormElement>(null)

  const {
    data: budgets,
    error: budgetsError,
    isLoading: budgetsLoading,
  } = useQuery(getBudgetsOptions({ query: { month: getCurrentBudgetMonth() } }))

  const { data: txnResult, error: txnError } = useQuery(
    getTransactionsOptions({
      query: { limit: TRANSACTION_FETCH_LIMIT, sort: 'latest' },
    })
  )

  const { budgetItems, categoryCards } = useMemo(
    () =>
      buildBudgetPageData(
        (budgets ?? []) as IBudget[],
        (txnResult?.data ?? []) as ITransaction[]
      ),
    [budgets, txnResult]
  )

  const existingCategories = useMemo(
    () => (budgets ?? []).map((b) => b.category_id),
    [budgets]
  )

  // ── Categories ───────────────────────────────────────────────
  const { data: categoriesData } = useQuery(getCategoriesOptions())

  const { getFormData, hasErrors, triggerValidation } =
    useFormBridge<BudgetFormValues>(formRef)

  const formBridge: IBudgetFormBridge = useMemo(
    () => ({ getFormData, hasErrors, triggerValidation }),
    [getFormData, hasErrors, triggerValidation]
  )

  const { showSuccess, showError } = useFeedbackModals(modal)
  const { renderDeleteBody } = useDeleteBodyRenderer()

  /**
   * Renders the budget form with platform-specific ref and existing-name lists.
   * @param props - Optional initial values and description to prefill the form
   * @returns The BudgetFormContent element
   */
  const renderForm = useCallback(
    (props?: { initialValues?: BudgetFormValues; description?: string }) => (
      <BudgetFormContent
        ref={formRef}
        initialValues={props?.initialValues}
        categories={(categoriesData ?? []) as ICategory[]}
        existingCategoryIds={existingCategories}
        categoryLabel={t('budgets.form.categoryLabel')}
        maximumLabel={t('budgets.form.maximumLabel')}
        maximumPlaceholder={t('budgets.form.maximumPlaceholder')}
        description={props?.description}
      />
    ),
    [categoriesData, existingCategories, t]
  )

  const { handleAdd, handleEdit, handleDelete } = useBudgetCrud({
    modal,
    formBridge,
    showSuccess,
    showError,
    renderForm,
    renderDeleteBody,
  })

  if (budgetsLoading) {
    return (
      <div className="flex flex-1 items-center min-h-screen justify-center p-6 lg:p-10">
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
    <HydrationBoundary state={loaderData.dehydratedState}>
      <div className="p-6 lg:p-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Typography variant="page-title" as="h1">
            {t('budgets.title')}
          </Typography>
          <Button
            title={t('budgets.addNewBudget')}
            onPress={handleAdd}
            size="lg"
            variant="primary"
          />
        </div>

        {/* 2-col when content area >= 1100px (desktop with sidebar expanded/collapsed) */}
        <div className="grid grid-cols-1 gap-6 @[1100px]:grid-cols-[1fr_1.5fr]">
          {/* Left — Budget Overview */}
          <div className="@[1100px]:self-start">
            <BudgetOverview
              budgets={budgetItems}
              showSpentAmount
              spendingSummaryTitle={t('budgets.spendingSummary')}
              ofLabel={t('budgets.of')}
              limitLabel={t('budgets.limit')}
            />
          </div>

          {/* Right — Category Cards */}
          <div className="flex flex-col gap-6">
            {categoryCards.map((card) => (
              <BudgetCardItem
                key={card.id}
                card={card}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
    </HydrationBoundary>
  )
}
