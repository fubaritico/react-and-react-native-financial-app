import { BudgetCategoryCard, BudgetOverview } from '@financial-app/features'
import {
  buildBudgetPageData,
  mockBudgets,
  mockTransactions,
} from '@financial-app/shared'
import { Button, Typography } from '@financial-app/ui'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import tw from '../../src/lib/tw'

// eslint-disable-next-line @typescript-eslint/no-empty-function -- disabled button, wired in CRUD phase
const noop = () => {}

export default function BudgetsScreen() {
  const { t } = useTranslation()

  const { budgetItems, categoryCards } = useMemo(
    () => buildBudgetPageData(mockBudgets, mockTransactions),
    []
  )

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
