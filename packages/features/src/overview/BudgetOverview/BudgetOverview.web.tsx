import { formatCurrency } from '@financial-app/shared'
import {
  Card,
  ColorBarItem,
  Divider,
  DonutChart,
  SectionLink,
  Typography,
  cn,
} from '@financial-app/ui'
import { Fragment } from 'react'

import { CHART_SIZE } from './BudgetOverview.constants'
import { shared, web } from './BudgetOverview.styles'
import {
  buildDonutSegments,
  computeTotalLimit,
  computeTotalSpent,
} from './BudgetOverview.utils'

import type { IBudgetOverviewProps } from './BudgetOverview'

/** Web implementation of the BudgetOverview component. */
export function BudgetOverview({
  title,
  seeDetailsLabel,
  onSeeDetails,
  budgets,
  showSpentAmount = false,
  ofLabel = 'of',
  limitLabel = 'limit',
  locale = 'en-US',
  currency = 'USD',
  spendingSummaryTitle,
}: Readonly<IBudgetOverviewProps>) {
  const segments = buildDonutSegments(budgets)
  const totalSpent = computeTotalSpent(budgets)
  const totalLimit = computeTotalLimit(budgets)

  const centerLabel = formatCurrency(totalSpent, {
    locale,
    currency,
    digits: 0,
  })
  const centerSubLabel = `${ofLabel} ${formatCurrency(totalLimit, {
    locale,
    currency,
    digits: 0,
  })} ${limitLabel}`

  const hasHeader = title && seeDetailsLabel && onSeeDetails

  return (
    <Card>
      {hasHeader && (
        <div className={cn('flex', shared.header)}>
          <Typography variant="subsection-title" as="h3">
            {title}
          </Typography>
          <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
        </div>
      )}

      <div className={web.content}>
        <div className={web.chart}>
          <DonutChart
            segments={segments}
            centerLabel={centerLabel}
            centerSubLabel={centerSubLabel}
            size={CHART_SIZE}
          />
        </div>

        <div className={showSpentAmount ? web.spendingList : web.budgetList}>
          {showSpentAmount && spendingSummaryTitle && (
            <Typography variant="section-title" as="h4" className="mb-4">
              {spendingSummaryTitle}
            </Typography>
          )}

          <div
            className={
              showSpentAmount ? web.legendSpending : web.legendOverview
            }
          >
            {budgets.map((budget, index) => (
              <Fragment key={budget.category}>
                {index !== 0 && showSpentAmount && <Divider spacing="sm" />}
                <div className={showSpentAmount ? web.spendingItem : undefined}>
                  <ColorBarItem
                    label={budget.category}
                    amount={showSpentAmount ? budget.spent : budget.maximum}
                    color={budget.color}
                    locale={locale}
                    currency={currency}
                    secondaryAmount={
                      showSpentAmount ? budget.maximum : undefined
                    }
                    secondaryLabel={ofLabel}
                  />
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
