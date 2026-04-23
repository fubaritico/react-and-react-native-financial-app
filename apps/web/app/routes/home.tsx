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

  return {
    balance: mockBalance,
    latestTransactions,
    potItems,
    totalSaved,
    paidTotal,
    upcomingTotal,
    dueSoonTotal,
    budgetCount: mockBudgets.length,
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate()

  const {
    balance,
    latestTransactions,
    potItems,
    totalSaved,
    paidTotal,
    upcomingTotal,
    dueSoonTotal,
    budgetCount,
  } = loaderData

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-preset-1 text-grey-900 mb-8">Overview</h1>

      {/* Balance cards — stack on mobile, row on md+ */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-6">
        <div className="md:flex-1">
          <BalanceCard
            label="Current Balance"
            amount={formatCurrency(balance.current)}
            tone="dark"
          />
        </div>
        <div className="md:flex-1">
          <BalanceCard
            label="Income"
            amount={formatCurrency(balance.income)}
            tone="light"
          />
        </div>
        <div className="md:flex-1">
          <BalanceCard
            label="Expenses"
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
            totalSaved={formatCurrency(totalSaved)}
            pots={potItems}
            onSeeDetails={() => {
              void navigate('/pots')
            }}
          />

          <TransactionsOverview
            transactions={latestTransactions}
            onViewAll={() => {
              void navigate('/transactions')
            }}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* BudgetsOverview placeholder — awaiting DonutChart from Track B */}
          <div className="bg-card rounded-xl p-6">
            <h2 className="text-preset-2 text-foreground">Budgets</h2>
            <p className="text-preset-4 text-foreground-muted mt-2">
              {budgetCount} budget{budgetCount !== 1 ? 's' : ''} — awaiting
              DonutChart
            </p>
          </div>

          <RecurringBillsOverview
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
