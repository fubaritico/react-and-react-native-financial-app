import {
  BudgetCategoryCard,
  BudgetFormContent,
  BudgetOverview,
  createAddBudgetModalConfig,
  createDeleteBudgetModalConfig,
  createEditBudgetModalConfig,
} from '@financial-app/features'
import {
  deleteBudgetsByIdMutation,
  getBudgetsOptions,
  getTransactionsOptions,
  postBudgetsMutation,
  putBudgetsByIdMutation,
} from '@financial-app/http-client'
import {
  BUDGET_MONTH,
  buildBudgetPageData,
  getErrorMessage,
  useModal,
} from '@financial-app/shared'
import { Alert, Button, Skeleton, Spinner, Typography } from '@financial-app/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { IBudgetFormRef } from '@financial-app/features'
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

/** Wrapper that memoizes the onEdit callback per card (avoids inline arrow in map) */
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
  const modal = useModal()
  const qc = useQueryClient()
  const formRef = useRef<IBudgetFormRef>(null)

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

  const existingCategories = useMemo(
    () => (budgets ?? []).map((b) => b.category),
    [budgets]
  )
  const existingThemes = useMemo(
    () => (budgets ?? []).map((b) => b.theme),
    [budgets]
  )

  /** ID of the budget currently being edited (stable ref to avoid stale closures) */
  const editingBudgetIdRef = useRef<string | null>(null)

  /** Opens a brief confirmation modal after a successful mutation */
  const showSuccessModal = useCallback(
    (message: string) => {
      modal.open({
        body: (
          <Typography
            variant="subsection-title"
            color="foreground"
            className="text-center"
          >
            {message}
          </Typography>
        ),
        actions: [
          {
            label: t('common.ok'),
            variant: 'primary',
            onPress: () => {
              modal.close()
            },
          },
        ],
        dismissable: false,
      })
    },
    [modal, t]
  )

  /** Opens an error modal after a failed mutation */
  const showErrorModal = useCallback(
    (err: unknown) => {
      modal.open({
        body: (
          <Typography
            variant="subsection-title"
            color="foreground"
            className="text-center"
          >
            {import.meta.env.DEV
              ? getErrorMessage(err)
              : t('common.somethingWentWrong')}
          </Typography>
        ),
        actions: [
          {
            label: t('common.ok'),
            variant: 'destroy',
            onPress: () => {
              modal.close()
            },
          },
        ],
        dismissable: false,
      })
    },
    [modal, t]
  )

  const { mutate: createBudget } = useMutation({
    ...postBudgetsMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: budgetsOpts.queryKey })
      modal.close()
      showSuccessModal(t('common.budgetAdded'))
    },
    onError: (err) => {
      modal.close()
      showErrorModal(err)
    },
  })

  const { mutate: updateBudget } = useMutation({
    ...putBudgetsByIdMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: budgetsOpts.queryKey })
      modal.close()
      showSuccessModal(t('common.budgetUpdated'))
    },
    onError: (err) => {
      modal.close()
      showErrorModal(err)
    },
  })

  const { mutate: deleteBudget } = useMutation({
    ...deleteBudgetsByIdMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: budgetsOpts.queryKey })
      modal.close()
      showSuccessModal(t('common.budgetDeleted'))
    },
    onError: (err) => {
      modal.close()
      showErrorModal(err)
    },
  })

  const handleSubmitBudget = useCallback(() => {
    const values = formRef.current?.getValues()
    if (!values) return
    const parsed = Number(values.maximum)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    modal.setSubmitting(true)
    createBudget({
      body: {
        category: values.category,
        maximum: parsed,
        theme: values.theme,
        month: BUDGET_MONTH,
      },
    })
  }, [createBudget, modal])

  const handleSubmitEditBudget = useCallback(() => {
    const values = formRef.current?.getValues()
    const budgetId = editingBudgetIdRef.current
    if (!values || !budgetId) return
    const parsed = Number(values.maximum)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    modal.setSubmitting(true)
    updateBudget({
      path: { id: budgetId },
      body: {
        category: values.category,
        maximum: parsed,
        theme: values.theme,
      },
    })
  }, [updateBudget, modal])

  const handleAddBudget = useCallback(() => {
    const config = createAddBudgetModalConfig(
      <BudgetFormContent
        ref={formRef}
        existingCategories={existingCategories}
        existingThemes={existingThemes}
        categoryLabel={t('budgets.form.categoryLabel')}
        maximumLabel={t('budgets.form.maximumLabel')}
        themeLabel={t('budgets.form.themeLabel')}
        maximumPlaceholder={t('budgets.form.maximumPlaceholder')}
        alreadyUsedLabel={t('budgets.form.alreadyUsed')}
        description={t('budgets.addModal.description')}
      />,
      handleSubmitBudget,
      {
        title: t('budgets.addModal.title'),
        submitLabel: t('budgets.addModal.submitLabel'),
      }
    )
    modal.open(config)
  }, [existingCategories, existingThemes, t, modal, handleSubmitBudget])

  /** Opens the Edit Budget modal for the given card */
  const handleEditBudget = useCallback(
    (card: IBudgetCategoryCard) => {
      editingBudgetIdRef.current = card.id
      const config = createEditBudgetModalConfig(
        <BudgetFormContent
          ref={formRef}
          initialValues={{
            category: card.category,
            maximum: String(card.maximum),
            theme: card.color,
          }}
          existingCategories={existingCategories}
          existingThemes={existingThemes}
          categoryLabel={t('budgets.form.categoryLabel')}
          maximumLabel={t('budgets.form.maximumLabel')}
          themeLabel={t('budgets.form.themeLabel')}
          maximumPlaceholder={t('budgets.form.maximumPlaceholder')}
          alreadyUsedLabel={t('budgets.form.alreadyUsed')}
          description={t('budgets.editModal.description')}
        />,
        handleSubmitEditBudget,
        {
          title: t('budgets.editModal.title'),
          submitLabel: t('budgets.editModal.submitLabel'),
        }
      )
      modal.open(config)
    },
    [existingCategories, existingThemes, t, modal, handleSubmitEditBudget]
  )

  /** Opens the Delete Budget confirmation modal for the given card */
  const handleDeleteBudget = useCallback(
    (card: IBudgetCategoryCard) => {
      const config = createDeleteBudgetModalConfig(
        card.category,
        <Typography variant="body" color="muted">
          {t('budgets.deleteModal.description')}
        </Typography>,
        () => {
          modal.setSubmitting(true)
          deleteBudget({ path: { id: card.id } })
        },
        {
          title: (name) => t('budgets.deleteModal.title', { name }),
          confirmLabel: t('budgets.deleteModal.confirmLabel'),
          cancelLabel: t('budgets.deleteModal.cancelLabel'),
        }
      )
      modal.open(config)
    },
    [t, modal, deleteBudget]
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
          onPress={handleAddBudget}
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
              key={card.category}
              card={card}
              onEdit={handleEditBudget}
              onDelete={handleDeleteBudget}
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
