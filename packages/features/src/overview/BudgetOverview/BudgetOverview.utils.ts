import { resolveTokenColor } from '@financial-app/shared'

import type { IDonutSegment } from '@financial-app/ui'

import type { IBudgetOverviewItem } from './BudgetOverview'

/**
 * Builds donut chart segments from budget items.
 * Each segment's percentage is proportional to its maximum relative to the total maximum.
 * Colors are resolved from token names via the token pipeline.
 * @param budgets - Array of budget items with category, maximum, and color
 * @returns Array of donut segments with percentage, resolved hex color, and label
 */
export function buildDonutSegments(
  budgets: readonly IBudgetOverviewItem[]
): IDonutSegment[] {
  const totalMax = budgets.reduce((sum, b) => sum + b.maximum, 0)
  if (totalMax === 0) return []

  return budgets.map((b) => {
    const pct = Math.round((b.maximum / totalMax) * 100)
    return {
      percentage: (b.maximum / totalMax) * 100,
      color: resolveTokenColor(b.color),
      label: `${b.category}: ${String(pct)}%`,
    }
  })
}

/**
 * Sums the spent amounts across all budget items.
 * @param budgets - Array of budget items with spent values
 * @returns Total spent amount
 */
export function computeTotalSpent(
  budgets: readonly IBudgetOverviewItem[]
): number {
  return budgets.reduce((sum, b) => sum + b.spent, 0)
}

/**
 * Sums the maximum amounts across all budget items.
 * @param budgets - Array of budget items with maximum values
 * @returns Total budget limit
 */
export function computeTotalLimit(
  budgets: readonly IBudgetOverviewItem[]
): number {
  return budgets.reduce((sum, b) => sum + b.maximum, 0)
}
