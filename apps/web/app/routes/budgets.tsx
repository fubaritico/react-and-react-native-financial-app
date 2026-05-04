import { BudgetCategoryCard, BudgetOverview } from '@financial-app/features'
import {
  buildBudgetPageData,
  mockBudgets,
  mockTransactions,
} from '@financial-app/shared'
import { Button, Typography } from '@financial-app/ui'
import { useTranslation } from 'react-i18next'

import type { Route } from './+types/budgets'

// eslint-disable-next-line @typescript-eslint/no-empty-function -- disabled button, wired in CRUD phase
const noop = () => {}

// TODO (Phase 8): replace mock data with real API call via requireAuth + HTTP client
export function loader() {
  return buildBudgetPageData(mockBudgets, mockTransactions)
}

export default function Budgets({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const { budgetItems, categoryCards } = loaderData

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Typography variant="page-title" as="h1">
          {t('budgets.title')}
        </Typography>
        <Button
          title={t('budgets.addNewBudget')}
          onPress={noop}
          variant="primary"
          disabled
        />
      </div>

      {/* 2-col when content area >= 1100px (desktop with sidebar expanded/collapsed) */}
      <div className="grid grid-cols-1 gap-6 @[1100px]:grid-cols-[1fr_1.5fr]">
        {/* Left — Budget Overview */}
        <div className="@[1100px]:self-start">
          <BudgetOverview
            budgets={budgetItems}
            showSpentAmount
            spendingSummaryTitle={t(
              'budgets.spendingSummary',
              'Spending Summary'
            )}
          />
        </div>

        {/* Right — Category Cards */}
        <div className="flex flex-col gap-6">
          {categoryCards.map((card) => (
            <BudgetCategoryCard
              key={card.category}
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
          ))}
        </div>
      </div>
    </div>
  )
}
