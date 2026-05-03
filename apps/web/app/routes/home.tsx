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
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import type { Route } from './+types/home'

// TODO (Phase 8): replace mock data with real API call via requireAuth + HTTP client
export function loader() {
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

  return {
    balance: mockBalance,
    latestTransactions,
    potItems,
    totalSaved,
    budgetItems,
    paidTotal,
    upcomingTotal,
    dueSoonTotal,
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    balance,
    latestTransactions,
    potItems,
    totalSaved,
    budgetItems,
    paidTotal,
    upcomingTotal,
    dueSoonTotal,
  } = loaderData

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-preset-1 text-grey-900 mb-8">
        {t('overview.title')}
      </h1>

      {/* Balance cards — stack on mobile, row on md+ */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-6">
        <div className="md:flex-1">
          <BalanceCard
            label={t('overview.currentBalance')}
            amount={formatCurrency(balance.current)}
            tone="dark"
          />
        </div>
        <div className="md:flex-1">
          <BalanceCard
            label={t('overview.income')}
            amount={formatCurrency(balance.income)}
            tone="light"
          />
        </div>
        <div className="md:flex-1">
          <BalanceCard
            label={t('overview.expenses')}
            amount={formatCurrency(balance.expenses)}
            tone="light"
          />
        </div>
      </div>

      {/* Main sections — single column on mobile, 2-col grid on lg+ */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <PotsOverview
            title={t('potsOverview.title')}
            seeDetailsLabel={t('common.seeDetails')}
            totalSavedLabel={t('potsOverview.totalSaved')}
            savingsIconLabel={t('accessibility.savingsIcon')}
            totalSaved={totalSaved}
            pots={potItems}
            onSeeDetails={() => {
              void navigate('/pots')
            }}
          />

          <TransactionsOverview
            title={t('transactionsOverview.title')}
            viewAllLabel={t('common.viewAll')}
            transactions={latestTransactions}
            onViewAll={() => {
              void navigate('/transactions')
            }}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <BudgetOverview
            title={t('budgets.title')}
            seeDetailsLabel={t('common.seeDetails')}
            budgets={budgetItems}
            onSeeDetails={() => {
              void navigate('/budgets')
            }}
          />

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
              void navigate('/recurring')
            }}
          />
        </div>
      </div>
    </div>
  )
}
