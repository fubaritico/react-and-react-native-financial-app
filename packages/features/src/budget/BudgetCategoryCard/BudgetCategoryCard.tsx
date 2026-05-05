import type { ILatestSpendingItem } from '@financial-app/ui'

/** Props for the BudgetCategoryCard component. */
export interface IBudgetCategoryCardProps {
  /** Budget category name (e.g. "Entertainment"). */
  category: string
  /** Maximum budget amount. */
  maximum: number
  /** Amount spent so far. */
  spent: number
  /** Token color name for the budget theme (e.g. "green", "cyan"). */
  color: string
  /** Latest transaction items to display in the spending sub-card. */
  items: readonly ILatestSpendingItem[]
  /** Label prefix for the maximum line (e.g. "Maximum of"). */
  maximumOfLabel: string
  /** Label for the spent column (e.g. "Spent"). */
  spentLabel: string
  /** Label for the remaining column (e.g. "Remaining"). */
  remainingLabel: string
  /** Title for the latest spending section (e.g. "Latest Spending"). */
  latestSpendingTitle: string
  /** Label for the "See All" link. */
  seeAllLabel: string
  /** Label for the edit action in the ellipsis menu. */
  editLabel: string
  /** Label for the delete action in the ellipsis menu. */
  deleteLabel: string
  /** Callback when "See All" is pressed. */
  onSeeAll?: () => void
  /** Callback when "Edit Budget" is selected. */
  onEdit?: () => void
  /** Callback when "Delete Budget" is selected. */
  onDelete?: () => void
  /** Locale for currency formatting (e.g. "en-US"). */
  locale?: string
  /** Currency code for formatting (e.g. "USD"). */
  currency?: string
}
