import {
  BudgetOverview,
  PotsOverview,
  RecurringBillsOverview,
  TransactionsOverview,
} from '@financial-app/features'
import {
  formatCurrency,
  formatDate,
  mockBalance,
  mockBudgets,
  mockPots,
  mockTransactions,
} from '@financial-app/shared'
import { BalanceCard } from '@financial-app/ui'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text, View } from 'react-native'

import tw from '../lib/tw'

import type { TabParamList } from '../navigation/types'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

/**
 * Overview (home) tab — displays balance, pots, transactions, and recurring bills.
 * BudgetsOverview is deferred until DonutChart is ready (Track B).
 */
export function OverviewScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>()
  const { t } = useTranslation()

  const latestTransactions = mockTransactions.slice(0, 5).map((txn) => ({
    avatar: txn.avatar,
    name: txn.name,
    amount: txn.amount,
    date: formatDate(txn.date),
  }))

  const potItems = mockPots.map((pot) => ({
    name: pot.name,
    total: pot.total,
    color: pot.theme,
  }))

  const totalSaved = mockPots.reduce((sum, pot) => sum + pot.total, 0)

  const budgetItems = mockBudgets.map((budget) => {
    const spent = mockTransactions
      .filter((txn) => txn.category === budget.category && txn.amount < 0)
      .reduce((sum, txn) => sum + Math.abs(txn.amount), 0)
    return {
      category: budget.category,
      maximum: budget.maximum,
      spent,
      color: budget.theme,
    }
  })

  const recurringTransactions = mockTransactions.filter((txn) => txn.recurring)
  const paidBills = recurringTransactions.filter(
    (txn) => new Date(txn.date).getMonth() === 7
  )
  const paidTotal = paidBills.reduce(
    (sum, txn) => sum + Math.abs(txn.amount),
    0
  )
  const upcomingTotal = recurringTransactions
    .filter((txn) => new Date(txn.date).getMonth() === 6)
    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0)
  const dueSoonTotal = recurringTransactions
    .filter((txn) => {
      const day = new Date(txn.date).getDate()
      return day <= 5
    })
    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0)

  return (
    <ScrollView
      style={tw`flex-1 bg-beige-100`}
      contentContainerStyle={tw`p-4 pb-8`}
    >
      <Text style={tw`text-3xl font-bold mb-6 mt-10`}>
        {t('overview.title')}
      </Text>

      {/* Balance section */}
      <BalanceCard
        label={t('overview.currentBalance')}
        amount={formatCurrency(mockBalance.current)}
        tone="dark"
      />
      <View style={tw`flex-row gap-3 mt-3`}>
        <View style={tw`flex-1`}>
          <BalanceCard
            label={t('overview.income')}
            amount={formatCurrency(mockBalance.income)}
            tone="light"
          />
        </View>
        <View style={tw`flex-1`}>
          <BalanceCard
            label={t('overview.expenses')}
            amount={formatCurrency(mockBalance.expenses)}
            tone="light"
          />
        </View>
      </View>

      {/* Pots section */}
      <View style={tw`mt-6`}>
        <PotsOverview
          title={t('potsOverview.title')}
          seeDetailsLabel={t('common.seeDetails')}
          totalSavedLabel={t('potsOverview.totalSaved')}
          savingsIconLabel={t('accessibility.savingsIcon')}
          totalSaved={totalSaved}
          pots={potItems}
          onSeeDetails={() => {
            navigation.navigate('Pots')
          }}
        />
      </View>

      {/* Transactions section */}
      <View style={tw`mt-4`}>
        <TransactionsOverview
          title={t('transactionsOverview.title')}
          viewAllLabel={t('common.viewAll')}
          transactions={latestTransactions}
          onViewAll={() => {
            navigation.navigate('Transactions')
          }}
        />
      </View>

      {/* Recurring Bills section */}
      <View style={tw`mt-4`}>
        <RecurringBillsOverview
          title={t('recurringBillsOverview.title')}
          seeDetailsLabel={t('common.seeDetails')}
          paidBillsLabel={t('recurringBillsOverview.paidBills')}
          totalUpcomingLabel={t('recurringBillsOverview.totalUpcoming')}
          dueSoonLabel={t('recurringBillsOverview.dueSoon')}
          paid={formatCurrency(paidTotal)}
          upcoming={formatCurrency(upcomingTotal)}
          dueSoon={formatCurrency(dueSoonTotal)}
          onSeeDetails={() => {
            navigation.navigate('Recurring')
          }}
        />
      </View>

      {/* Budgets section */}
      <View style={tw`mt-4`}>
        <BudgetOverview
          title={t('budgets.title')}
          seeDetailsLabel={t('common.seeDetails')}
          budgets={budgetItems}
          onSeeDetails={() => {
            navigation.navigate('Budgets')
          }}
        />
      </View>
    </ScrollView>
  )
}
