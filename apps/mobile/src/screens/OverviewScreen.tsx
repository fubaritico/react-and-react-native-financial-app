import {
  formatCurrency,
  formatDate,
  mockBalance,
  mockBudgets,
  mockPots,
  mockTransactions,
} from '@financial-app/shared'
import {
  BalanceCard,
  PotsOverview,
  RecurringBillsOverview,
  TransactionsOverview,
} from '@financial-app/ui'
import { useNavigation } from '@react-navigation/native'
import { ScrollView, Text, View } from 'react-native'

import type { TabParamList } from '../navigation/types'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

/**
 * Overview (home) tab — displays balance, pots, transactions, and recurring bills.
 * BudgetsOverview is deferred until DonutChart is ready (Track B).
 */
export function OverviewScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>()

  const latestTransactions = mockTransactions.slice(0, 5).map((txn) => ({
    avatar: txn.avatar,
    name: txn.name,
    amount: txn.amount,
    date: formatDate(txn.date),
  }))

  const potItems = mockPots.map((pot) => ({
    name: pot.name,
    total: formatCurrency(pot.total),
    color: pot.theme,
  }))

  const totalSaved = mockPots.reduce((sum, pot) => sum + pot.total, 0)

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
      style={{ flex: 1, backgroundColor: '#F8F4F0' }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          marginBottom: 24,
          marginTop: 40,
        }}
      >
        Overview
      </Text>

      {/* Balance section */}
      <BalanceCard
        label="Current Balance"
        amount={formatCurrency(mockBalance.current)}
        tone="dark"
      />
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
        <View style={{ flex: 1 }}>
          <BalanceCard
            label="Income"
            amount={formatCurrency(mockBalance.income)}
            tone="light"
          />
        </View>
        <View style={{ flex: 1 }}>
          <BalanceCard
            label="Expenses"
            amount={formatCurrency(mockBalance.expenses)}
            tone="light"
          />
        </View>
      </View>

      {/* Pots section */}
      <View style={{ marginTop: 24 }}>
        <PotsOverview
          totalSaved={formatCurrency(totalSaved)}
          pots={potItems}
          onSeeDetails={() => {
            navigation.navigate('Pots')
          }}
        />
      </View>

      {/* Transactions section */}
      <View style={{ marginTop: 16 }}>
        <TransactionsOverview
          transactions={latestTransactions}
          onViewAll={() => {
            navigation.navigate('Transactions')
          }}
        />
      </View>

      {/* Recurring Bills section */}
      <View style={{ marginTop: 16 }}>
        <RecurringBillsOverview
          paid={formatCurrency(paidTotal)}
          upcoming={formatCurrency(upcomingTotal)}
          dueSoon={formatCurrency(dueSoonTotal)}
          onSeeDetails={() => {
            navigation.navigate('Recurring')
          }}
        />
      </View>

      {/* BudgetsOverview placeholder — awaiting DonutChart from Track B */}
      <View
        style={{
          marginTop: 16,
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Budgets</Text>
        <Text style={{ color: '#696868', marginTop: 8 }}>
          {mockBudgets.length} budget
          {mockBudgets.length !== 1 ? 's' : ''} — awaiting DonutChart
        </Text>
      </View>
    </ScrollView>
  )
}
