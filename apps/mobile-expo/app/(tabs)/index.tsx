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
  formatCurrency,
  formatDate,
  getErrorMessage,
} from '@financial-app/shared'
import { Alert, BalanceCard, Spinner, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import tw from '../../src/lib/tw'

/** Current budget month — matches seed data. */
const BUDGET_MONTH = '2024-08'

/**
 * Overview (home) tab — displays balance, pots, transactions, budgets, and recurring bills.
 * All data fetched via TanStack Query from the API.
 */
export default function OverviewScreen() {
  const router = useRouter()
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
  } = useQuery(getBudgetsOptions({ query: { month: BUDGET_MONTH } }))
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

  const hasError =
    balanceError ?? txnError ?? potsError ?? budgetsError ?? recurringError

  const latestTransactions = useMemo(
    () =>
      (txnResult?.data ?? []).map((txn) => ({
        avatar: txn.avatar,
        name: txn.name,
        amount: txn.amount,
        date: formatDate(txn.date),
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
        category: budget.category,
        maximum: budget.maximum,
        spent: budget.spent,
        color: budget.theme,
      })),
    [budgets]
  )

  const recurringData = useMemo(
    () => (recurringBills ? buildRecurringBillsPageData(recurringBills) : null),
    [recurringBills]
  )

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-beige-100`}>
        <Spinner />
      </View>
    )
  }

  if (hasError) {
    return (
      <View style={tw`flex-1 bg-beige-100 px-6 justify-center`}>
        <Alert
          severity="error"
          message={t('common.errorLoading')}
          description={__DEV__ ? getErrorMessage(hasError) : undefined}
        />
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
            amount={formatCurrency(balance.current)}
            tone="dark"
          />
          <View style={tw`flex-row gap-3 mt-3`}>
            <View style={tw`flex-1`}>
              <BalanceCard
                label={t('overview.income')}
                amount={formatCurrency(balance.income)}
                tone="light"
              />
            </View>
            <View style={tw`flex-1`}>
              <BalanceCard
                label={t('overview.expenses')}
                amount={formatCurrency(balance.expenses)}
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
          onSeeDetails={() => {
            router.push('/(tabs)/pots')
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
            router.push('/(tabs)/transactions')
          }}
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
            onSeeDetails={() => {
              router.push('/(tabs)/recurring')
            }}
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
          onSeeDetails={() => {
            router.push('/(tabs)/budgets')
          }}
        />
      </View>
    </ScrollView>
  )
}
