import { formatCurrency } from '@financial-app/shared'
import {
  Card,
  ColorBarItem,
  Divider,
  DonutChart,
  SectionLink,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { View, useWindowDimensions } from 'react-native'

import { CHART_SIZE, TABLET_BREAKPOINT } from './BudgetOverview.constants'
import { native, shared } from './BudgetOverview.styles'
import {
  buildDonutSegments,
  computeTotalLimit,
  computeTotalSpent,
} from './BudgetOverview.utils'

import type { IBudgetOverviewProps } from './BudgetOverview'

/** Native implementation of the BudgetOverview component. */
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
  const { width } = useWindowDimensions()
  const isHorizontal = width >= TABLET_BREAKPOINT

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
        <View style={tw`${shared.header}`}>
          <Typography variant="subsection-title" accessibilityRole="header">
            {title}
          </Typography>
          <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
        </View>
      )}

      <View style={isHorizontal ? tw`${native.horizontal}` : undefined}>
        <View
          style={
            isHorizontal
              ? tw`${native.chartHorizontal}`
              : tw`${native.chartVertical}`
          }
        >
          <DonutChart
            segments={segments}
            centerLabel={centerLabel}
            centerSubLabel={centerSubLabel}
            size={CHART_SIZE}
          />
        </View>

        <View
          style={isHorizontal ? tw`${native.budgetListHorizontal}` : undefined}
        >
          {showSpentAmount && spendingSummaryTitle && (
            <Typography variant="subsection-title" accessibilityRole="header">
              {spendingSummaryTitle}
            </Typography>
          )}

          <View
            style={
              isHorizontal
                ? tw`${native.legendHorizontal}`
                : showSpentAmount
                  ? tw`${native.legendList}`
                  : tw`${native.legendGrid}`
            }
          >
            {budgets.map((budget, index) => (
              <View
                key={budget.category}
                style={
                  showSpentAmount || isHorizontal
                    ? tw`${native.legendItem}`
                    : tw`${native.legendGridItem}`
                }
              >
                {showSpentAmount && index > 0 && <Divider />}
                <ColorBarItem
                  label={budget.category}
                  amount={showSpentAmount ? budget.spent : budget.maximum}
                  color={budget.color}
                  locale={locale}
                  currency={currency}
                  secondaryAmount={showSpentAmount ? budget.maximum : undefined}
                  secondaryLabel={ofLabel}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </Card>
  )
}
