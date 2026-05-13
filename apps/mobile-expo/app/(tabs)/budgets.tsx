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
import { Alert, Button, Spinner, Typography } from '@financial-app/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import type { IBudgetFormRef } from '@financial-app/features'
import type { IBudgetCategoryCard } from '@financial-app/shared'

import tw from '../../src/lib/tw'

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

/** Wrapper that memoizes the onEdit/onDelete callbacks per card (avoids inline arrow in map) */
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

export default function BudgetsScreen() {
  const { t } = useTranslation()
  const modal = useModal()
  const qc = useQueryClient()
  const formRef = useRef<IBudgetFormRef>(null)

  const budgetsOpts = getBudgetsOptions({ query: { month: BUDGET_MONTH } })

  const {
    data: budgets,
    isLoading: budgetsLoading,
    error: budgetsError,
  } = useQuery(budgetsOpts)
  const {
    data: txnResult,
    isLoading: txnLoading,
    error: txnError,
  } = useQuery(getTransactionsOptions({ query: { limit: 1000 } }))

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

  const { mutate: createBudget } = useMutation({
    ...postBudgetsMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: budgetsOpts.queryKey })
      modal.close()
    },
  })

  const { mutate: updateBudget } = useMutation({
    ...putBudgetsByIdMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: budgetsOpts.queryKey })
      modal.close()
    },
  })

  const { mutate: deleteBudget } = useMutation({
    ...deleteBudgetsByIdMutation(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: budgetsOpts.queryKey })
      modal.close()
    },
  })

  const handleSubmitBudget = useCallback(() => {
    const values = formRef.current?.getValues()
    if (!values) return
    const parsed = Number(values.maximum)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    createBudget({
      body: {
        category: values.category,
        maximum: parsed,
        theme: values.theme,
        month: BUDGET_MONTH,
      },
    })
  }, [createBudget])

  const handleSubmitEditBudget = useCallback(() => {
    const values = formRef.current?.getValues()
    const budgetId = editingBudgetIdRef.current
    if (!values || !budgetId) return
    const parsed = Number(values.maximum)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    updateBudget({
      path: { id: budgetId },
      body: {
        category: values.category,
        maximum: parsed,
        theme: values.theme,
      },
    })
  }, [updateBudget])

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

  if (budgetsLoading || txnLoading) {
    return (
      <View style={tw`flex-1 bg-beige-100`}>
        <Spinner />
      </View>
    )
  }

  const budgetError = budgetsError ?? txnError
  if (budgetError) {
    return (
      <View style={tw`flex-1 bg-beige-100 px-6 justify-center`}>
        <Alert
          severity="error"
          message={t('common.errorLoading')}
          description={__DEV__ ? getErrorMessage(budgetError) : undefined}
        />
      </View>
    )
  }

  return (
    <ScrollView
      style={tw`flex-1 bg-beige-100`}
      contentContainerStyle={tw`p-4 pb-8`}
    >
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mb-6 mt-10`}>
        <Typography variant="page-title">{t('budgets.title')}</Typography>
        <Button
          title={t('budgets.addNewBudget')}
          onPress={handleAddBudget}
          variant="primary"
        />
      </View>

      {/* Budget Overview */}
      <BudgetOverview
        budgets={budgetItems}
        showSpentAmount
        spendingSummaryTitle={t('budgets.spendingSummary', 'Spending Summary')}
      />

      {/* Category Cards */}
      {categoryCards.map((card) => (
        <View key={card.category} style={tw`mt-4`}>
          <BudgetCardItem
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
        </View>
      ))}
    </ScrollView>
  )
}
