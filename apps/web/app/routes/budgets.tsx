import {
  BudgetCategoryCard,
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
import { Alert, Button, Skeleton, Spinner, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type {
  BudgetFormValues,
  IBudgetFormBridge,
} from '@financial-app/features'
import type { IBudget, ITransaction } from '@financial-app/shared'
import type { IBudgetCategoryCard } from '@financial-app/shared'

import { queryClient } from '../lib/query-client'

import type { Route } from './+types/budgets'

/** Props for the BudgetCardItem wrapper */
interface IBudgetCardItemProps {
  /** Budget card data */
  card: IBudgetCategoryCard
  /** Callback receiving the card to edit */
  onEdit: (card: IBudgetCategoryCard) => void
  /** Callback receiving the card to delete */
  onDelete: (card: IBudgetCategoryCard) => void
  /** Label for "Maximum of $X" */
  maximumOfLabel: string
  /** Label for the spent amount */
  spentLabel: string
  /** Label for the remaining amount */
  remainingLabel: string
  /** Title for the latest spending section */
  latestSpendingTitle: string
  /** Label for the "See All" link */
  seeAllLabel: string
  /** Label for the edit action in dropdown */
  editLabel: string
  /** Label for the delete action in dropdown */
  deleteLabel: string
}

/**
 * Wrapper that memoizes the onEdit/onDelete callbacks per card (avoids inline arrow in map).
 * @param props - Budget card data with edit/delete handlers and labels
 * @returns Memoized BudgetCategoryCard JSX
 */
function BudgetCardItem({
  card,
  onEdit,
  onDelete,
  ...labels
}: Readonly<IBudgetCardItemProps>) {
  const handleEdit = useCallback(() => {
    onEdit(card)
  }, [card, onEdit])

  const handleDelete = useCallback(() => {
    onDelete(card)
  }, [card, onDelete])

  return (
    <BudgetCategoryCard
      category={card.category}
      maximum={card.maximum}
      spent={card.spent}
      color={card.color}
      items={card.items}
      onEdit={handleEdit}
      onDelete={handleDelete}
      {...labels}
    />
  )
}

/** @returns Query options for budgets and transactions used by this route. */
function fetchQueryOptions() {
  const budgetsOpts = getBudgetsOptions({
    query: { month: getCurrentBudgetMonth() },
  })
  const txnOpts = getTransactionsOptions({ query: { limit: 1000 } })
  return { budgetsOpts, txnOpts }
}

/** @returns Prefetched budgets and transactions data for hydration. */
export async function clientLoader() {
  const { budgetsOpts, txnOpts } = fetchQueryOptions()
  const [budgets, txn] = await Promise.all([
    queryClient.ensureQueryData(budgetsOpts).catch(() => undefined),
    queryClient.ensureQueryData(txnOpts).catch(() => undefined),
  ])
  return { budgets, txn }
}

/** @returns Skeleton fallback rendered while clientLoader is in flight. */
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

/** @returns Budgets page with overview chart, category cards, and CRUD modals. */
export default function Budgets({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const modal = useModal()
  const formRef = useRef<HTMLFormElement>(null)
  const { budgetsOpts, txnOpts } = fetchQueryOptions()

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

  /** Maps API categories to dropdown options */
  const categoryOptions = useMemo(
    () =>
      (categoriesData ?? []).map((c) => ({
        value: c.id,
        label: c.name,
        color: c.color,
        icon: c.icon,
      })),
    [categoriesData]
  )

  /** Reads form data from the dataset on the form element */
  const getFormData = useCallback((): BudgetFormValues | null => {
    const ref = formRef.current
    if (!ref?.dataset.formData) return null
    const data = structuredClone(
      JSON.parse(ref.dataset.formData) as BudgetFormValues
    )
    delete ref.dataset.formData
    return data
  }, [])

  /** Whether the form has validation errors (dataset-based) */
  const hasFormErrors = useCallback(
    () => formRef.current?.dataset.error === 'true',
    []
  )

  /** Triggers native form validation to show field errors */
  const triggerValidation = useCallback(() => {
    formRef.current?.requestSubmit()
  }, [])

  const formBridge: IBudgetFormBridge = useMemo(
    () => ({ getFormData, hasErrors: hasFormErrors, triggerValidation }),
    [getFormData, hasFormErrors, triggerValidation]
  )

  const { showSuccess, showError } = useFeedbackModals(modal)
  const { renderDeleteBody } = useDeleteBodyRenderer()

  /** Renders the budget form with platform-specific ref and current existing lists */
  const renderForm = useCallback(
    (props?: { initialValues?: BudgetFormValues; description?: string }) => (
      <BudgetFormContent
        ref={formRef}
        initialValues={props?.initialValues}
        categories={categoryOptions}
        existingCategories={existingCategories}
        categoryLabel={t('budgets.form.categoryLabel')}
        maximumLabel={t('budgets.form.maximumLabel')}
        maximumPlaceholder={t('budgets.form.maximumPlaceholder')}
        description={props?.description}
      />
    ),
    [categoryOptions, existingCategories, t]
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
  )
}
