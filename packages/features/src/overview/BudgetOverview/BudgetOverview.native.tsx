import { useCurrency } from '@financial-app/shared'
import {
  Card,
  ColorBarItem,
  Divider,
  DonutChart,
  Icon,
  SectionLink,
  Typography,
  tw,
} from '@financial-app/ui/native'
import { useTranslation } from 'react-i18next'
import { Pressable, View, useWindowDimensions } from 'react-native'

import { CHART_SIZE, TABLET_BREAKPOINT } from './BudgetOverview.constants'
import { native, shared } from './BudgetOverview.styles'
import {
  buildDonutSegments,
  computeTotalLimit,
  computeTotalSpent,
} from './BudgetOverview.utils'

import type { IBudgetOverviewProps } from './BudgetOverview'

/**
 * Native implementation of the BudgetOverview component.
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
  const { width } = useWindowDimensions()
  const isHorizontal = width >= TABLET_BREAKPOINT

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
        <View style={tw`${shared.header}`}>
          <Typography variant="subsection-title" accessibilityRole="header">
            {title}
          </Typography>
          <SectionLink label={seeDetailsLabel} onPress={onSeeDetails} />
        </View>
      )}

      {budgets.length > 1 ? (
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
            style={
              isHorizontal ? tw`${native.budgetListHorizontal}` : undefined
            }
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
                    secondaryAmount={
                      showSpentAmount ? budget.maximum : undefined
                    }
                    secondaryLabel={ofLabel}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={onSeeDetails}
          accessibilityRole="button"
          accessibilityLabel={seeDetailsLabel}
          accessibilityState={{ disabled: false }}
        >
          <View style={tw`${shared.noData}`}>
            <Icon name="navBudgets" iconSize="5xl" color="muted" />
            <Typography variant="body" color="muted" align="center">
              {t('budgetOverview.empty')}
            </Typography>
          </View>
        </Pressable>
      )}
    </Card>
  )
}
