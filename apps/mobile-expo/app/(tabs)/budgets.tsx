import {
  BudgetCategoryCard,
  BudgetFormContent,
  BudgetOverview,
  useBudgetCrud,
} from '@financial-app/features'
import {
  getBudgetsOptions,
  getTransactionsOptions,
} from '@financial-app/http-client'
import {
  buildBudgetPageData,
  getCurrentBudgetMonth,
  getErrorMessage,
  useModal,
} from '@financial-app/shared'
import { Alert, Button, Spinner, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import type {
  BudgetFormValues,
  IBudgetFormBridge,
  IBudgetFormRef,
} from '@financial-app/features'
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

/** @returns Budgets tab screen with overview chart, category cards, and CRUD modals. */
export default function BudgetsScreen() {
  const { t } = useTranslation()
  const modal = useModal()
  const formRef = useRef<IBudgetFormRef>(null)

  const budgetsOpts = getBudgetsOptions({
    query: { month: getCurrentBudgetMonth() },
  })

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

  /** Reads form data from the native imperative ref */
  const getFormData = useCallback(
    (): BudgetFormValues | null => formRef.current?.getValues() ?? null,
    []
  )

  /** Whether the form has validation errors (ref-based) */
  const hasFormErrors = useCallback(
    () => formRef.current?.hasErrors ?? false,
    []
  )

  /** Triggers full form validation to display all field errors */
  const triggerValidation = useCallback(() => {
    formRef.current?.validate()
  }, [])

  const formBridge: IBudgetFormBridge = useMemo(
    () => ({ getFormData, hasErrors: hasFormErrors, triggerValidation }),
    [getFormData, hasFormErrors, triggerValidation]
  )

  /** Opens a brief confirmation modal after a successful mutation */
  const showSuccess = useCallback(
    (message: string) => {
      modal.open({
        body: (
          <Typography
            variant="subsection-title"
            color="foreground"
            style={tw`text-center`}
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
  const showError = useCallback(
    (err: unknown) => {
      modal.open({
        body: (
          <Typography
            variant="subsection-title"
            color="foreground"
            style={tw`text-center`}
          >
            {__DEV__ ? getErrorMessage(err) : t('common.somethingWentWrong')}
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

  /** Renders the budget form with native ref and current existing lists */
  const renderForm = useCallback(
    (props?: { initialValues?: BudgetFormValues; description?: string }) => (
      <BudgetFormContent
        ref={formRef}
        initialValues={props?.initialValues}
        existingCategories={existingCategories}
        existingThemes={existingThemes}
        categoryLabel={t('budgets.form.categoryLabel')}
        maximumLabel={t('budgets.form.maximumLabel')}
        themeLabel={t('budgets.form.themeLabel')}
        maximumPlaceholder={t('budgets.form.maximumPlaceholder')}
        alreadyUsedLabel={t('budgets.form.alreadyUsed')}
        description={props?.description}
      />
    ),
    [existingCategories, existingThemes, t]
  )

  /** Renders the delete modal body */
  const renderDeleteBody = useCallback(
    (description: string) => (
      <Typography variant="body" color="muted">
        {description}
      </Typography>
    ),
    []
  )

  const { handleAdd, handleEdit, handleDelete } = useBudgetCrud({
    modal,
    formBridge,
    showSuccess,
    showError,
    renderForm,
    renderDeleteBody,
  })

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
          onPress={handleAdd}
          variant="primary"
        />
      </View>

      {/* Budget Overview */}
      <BudgetOverview
        budgets={budgetItems}
        showSpentAmount
        spendingSummaryTitle={t('budgets.spendingSummary')}
        ofLabel={t('budgets.of')}
        limitLabel={t('budgets.limit')}
      />

      {/* Category Cards */}
      {categoryCards.map((card) => (
        <View key={card.category} style={tw`mt-4`}>
          <BudgetCardItem
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
        </View>
      ))}
    </ScrollView>
  )
}
