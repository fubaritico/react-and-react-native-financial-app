import { BudgetCategoryCard, BudgetOverview } from '@financial-app/features'
import {
  getBudgetsOptions,
  getTransactionsOptions,
} from '@financial-app/http-client'
import { buildBudgetPageData } from '@financial-app/shared'
import { Alert, Button, Spinner, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import tw from '../lib/tw'

/** Current budget month — matches seed data. */
const BUDGET_MONTH = '2024-08'

// eslint-disable-next-line @typescript-eslint/no-empty-function -- disabled button, wired in CRUD phase
const noop = () => {}

export function BudgetsScreen() {
  const { t } = useTranslation()

  const {
    data: budgets,
    isLoading: budgetsLoading,
    error: budgetsError,
  } = useQuery(getBudgetsOptions({ query: { month: BUDGET_MONTH } }))
  const {
    data: txnResult,
    isLoading: txnLoading,
    error: txnError,
  } = useQuery(getTransactionsOptions({ query: { limit: 1000 } }))

  const { budgetItems, categoryCards } = useMemo(
    () => buildBudgetPageData(budgets ?? [], txnResult?.data ?? []),
    [budgets, txnResult]
  )

  if (budgetsLoading || txnLoading) {
    return (
      <View style={tw`flex-1 bg-beige-100`}>
        <Spinner />
      </View>
    )
  }

  if (budgetsError ?? txnError) {
    return (
      <View style={tw`flex-1 bg-beige-100 p-6`}>
        <Alert severity="error" message={t('common.errorLoading')} />
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
          onPress={noop}
          variant="primary"
          disabled
        />
      </View>

      {/* Budget Overview */}
      <BudgetOverview
        budgets={budgetItems}
        showSpentAmount
        ofLabel={t('budgets.of')}
        limitLabel={t('budgets.limit')}
        spendingSummaryTitle={t('budgets.spendingSummary')}
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
