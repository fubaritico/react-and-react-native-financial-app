import {
  BudgetOverview,
  PotsOverview,
  RecurringBillsOverview,
  TransactionsOverview,
} from '@financial-app/features'
import {
  getBalanceOptions,
  getBudgetsOptions,
  getPotsOptions,
  getRecurringBillsOptions,
  getTransactionsOptions,
} from '@financial-app/http-client'
import {
  buildRecurringBillsPageData,
  formatDate,
  getCurrentBudgetMonth,
} from '@financial-app/shared'
import { Alert, BalanceCard, Spinner, Typography } from '@financial-app/ui'
import { useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import type { IconName } from '@financial-app/icons'
import type { ITransaction } from '@financial-app/shared'

import tw from '../lib/tw'

import type { TabParamList } from '../navigation/types'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

/**
 * Overview (home) tab — displays balance, pots, transactions, budgets, and recurring bills.
 * All data fetched via TanStack Query from the API.
 * @returns Overview screen JSX
 */
export function OverviewScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>()
  const { t } = useTranslation()

  const {
    data: balance,
    isLoading: balanceLoading,
    error: balanceError,
  } = useQuery(getBalanceOptions())
  const {
    data: txnResult,
    isLoading: txnLoading,
    error: txnError,
  } = useQuery(getTransactionsOptions({ query: { limit: 5, sort: 'latest' } }))
  const {
    data: pots,
    isLoading: potsLoading,
    error: potsError,
  } = useQuery(getPotsOptions())
  const {
    data: budgets,
    isLoading: budgetsLoading,
    error: budgetsError,
  } = useQuery(getBudgetsOptions({ query: { month: getCurrentBudgetMonth() } }))
  const {
    data: recurringBills,
    isLoading: recurringLoading,
    error: recurringError,
  } = useQuery(getRecurringBillsOptions())

  const isLoading =
    balanceLoading ||
    txnLoading ||
    potsLoading ||
    budgetsLoading ||
    recurringLoading

  const latestTransactions = useMemo(
    () =>
      (txnResult?.data ?? []).map((txn) => ({
        name: txn.name,
        amount: txn.amount,
        date: formatDate(txn.date),
        categoryIcon: txn.category_icon as IconName,
        categoryColor: txn.category_color,
      })),
    [txnResult]
  )

  const potItems = useMemo(
    () =>
      (pots ?? []).map((pot) => ({
        name: pot.name,
        total: pot.total,
        color: pot.theme,
      })),
    [pots]
  )

  const totalSaved = useMemo(
    () => (pots ?? []).reduce((sum, pot) => sum + pot.total, 0),
    [pots]
  )

  const budgetItems = useMemo(
    () =>
      (budgets ?? []).map((budget) => ({
        category: budget.category_name,
        maximum: budget.maximum,
        spent: budget.spent,
        color: budget.category_color,
      })),
    [budgets]
  )

  const recurringData = useMemo(
    () =>
      recurringBills
        ? buildRecurringBillsPageData(recurringBills as ITransaction[])
        : null,
    [recurringBills]
  )

  const hasError =
    balanceError ?? txnError ?? potsError ?? budgetsError ?? recurringError

  const handleNavigatePots = useCallback(() => {
    navigation.navigate('Pots')
  }, [navigation])

  const handleNavigateTransactions = useCallback(() => {
    navigation.navigate('Transactions')
  }, [navigation])

  const handleNavigateRecurring = useCallback(() => {
    navigation.navigate('Recurring')
  }, [navigation])

  const handleNavigateBudgets = useCallback(() => {
    navigation.navigate('Budgets')
  }, [navigation])

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-beige-100`}>
        <Spinner />
      </View>
    )
  }

  if (hasError) {
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
      <Typography variant="page-title" style={tw`mb-6 mt-10`}>
        {t('overview.title')}
      </Typography>

      {/* Balance section */}
      {balance && (
        <>
          <BalanceCard
            label={t('overview.currentBalance')}
            amount={balance.current}
            tone="dark"
          />
          <View style={tw`flex-row gap-3 mt-3`}>
            <View style={tw`flex-1`}>
              <BalanceCard
                label={t('overview.income')}
                amount={balance.income}
                tone="light"
              />
            </View>
            <View style={tw`flex-1`}>
              <BalanceCard
                label={t('overview.expenses')}
                amount={balance.expenses}
                tone="light"
              />
            </View>
          </View>
        </>
      )}

      {/* Pots section */}
      <View style={tw`mt-6`}>
        <PotsOverview
          title={t('potsOverview.title')}
          seeDetailsLabel={t('common.seeDetails')}
          totalSavedLabel={t('potsOverview.totalSaved')}
          savingsIconLabel={t('accessibility.savingsIcon')}
          totalSaved={totalSaved}
          pots={potItems}
          onSeeDetails={handleNavigatePots}
        />
      </View>

      {/* Transactions section */}
      <View style={tw`mt-4`}>
        <TransactionsOverview
          title={t('transactionsOverview.title')}
          viewAllLabel={t('common.viewAll')}
          transactions={latestTransactions}
          onViewAll={handleNavigateTransactions}
        />
      </View>

      {/* Recurring Bills section */}
      {recurringData && (
        <View style={tw`mt-4`}>
          <RecurringBillsOverview
            title={t('recurringBillsOverview.title')}
            seeDetailsLabel={t('common.seeDetails')}
            paidBillsLabel={t('recurringBillsOverview.paidBills')}
            totalUpcomingLabel={t('recurringBillsOverview.totalUpcoming')}
            dueSoonLabel={t('recurringBillsOverview.dueSoon')}
            paid={recurringData.paidTotal}
            upcoming={recurringData.upcomingTotal}
            dueSoon={recurringData.dueSoonTotal}
            onSeeDetails={handleNavigateRecurring}
          />
        </View>
      )}

      {/* Budgets section */}
      <View style={tw`mt-4`}>
        <BudgetOverview
          title={t('budgets.title')}
          seeDetailsLabel={t('common.seeDetails')}
          budgets={budgetItems}
          ofLabel={t('budgets.of')}
          limitLabel={t('budgets.limit')}
          onSeeDetails={handleNavigateBudgets}
        />
      </View>
    </ScrollView>
  )
}
