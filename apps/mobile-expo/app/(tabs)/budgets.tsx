import {
  BudgetCategoryCard,
  BudgetFormContent,
  BudgetOverview,
  createAddBudgetModalConfig,
} from '@financial-app/features'
import {
  getBudgetsOptions,
  getTransactionsOptions,
  postBudgetsMutation,
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

import tw from '../../src/lib/tw'

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

  const { mutate: createBudget } = useMutation({
    ...postBudgetsMutation(),
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
          <BudgetCategoryCard
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
        </View>
      ))}
    </ScrollView>
  )
}
