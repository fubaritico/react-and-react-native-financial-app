import { useCurrency } from '@financial-app/shared'
import {
  Card,
  ColorBarItem,
  Divider,
  DonutChart,
  Icon,
  SectionLink,
  Typography,
  cn,
} from '@financial-app/ui'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { CHART_SIZE } from './BudgetOverview.constants'
import { shared, web } from './BudgetOverview.styles'
import {
  buildDonutSegments,
  computeTotalLimit,
  computeTotalSpent,
} from './BudgetOverview.utils'

import type { IBudgetOverviewProps } from './BudgetOverview'

/**
 * Web implementation of the BudgetOverview component.
 * @param props - Budget overview data and callbacks
 * @returns The budget overview card
 */
export function BudgetOverview({
  title,
  seeDetailsLabel,
  onSeeDetails,
  budgets,
  showSpentAmount = false,
  ofLabel,
  limitLabel,
  spendingSummaryTitle,
}: Readonly<IBudgetOverviewProps>) {
  const { t } = useTranslation()
  const segments = buildDonutSegments(budgets)
  const totalSpent = computeTotalSpent(budgets)
  const totalLimit = computeTotalLimit(budgets)

  const { format } = useCurrency()

  const centerLabel = format(totalSpent)
  const centerSubLabel = `${ofLabel} ${format(totalLimit)} ${limitLabel}`

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

      {budgets.length > 0 ? (
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
                  <div
                    className={showSpentAmount ? web.spendingItem : undefined}
                  >
                    <ColorBarItem
                      label={budget.category}
                      amount={showSpentAmount ? budget.spent : budget.maximum}
                      color={budget.color}
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
      ) : (
        <button
          className={shared.noDataButton}
          onClick={onSeeDetails}
          aria-label={seeDetailsLabel}
        >
          <div className={shared.noData}>
            <div className="text-foreground-muted">
              <Icon name="navBudgets" iconSize="5xl" />
            </div>
            <Typography variant="body" color="muted">
              {t('budgetOverview.empty')}
            </Typography>
          </div>
        </button>
      )}
    </Card>
  )
}
