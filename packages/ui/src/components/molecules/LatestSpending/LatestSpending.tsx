import type { IconName } from '@financial-app/icons'

/** A single transaction entry in the Latest Spending list. */
export interface ILatestSpendingItem {
  /** Counterparty name. */
  name: string
  /** Numeric amount in base currency (e.g. -10). */
  amount: number
  /** Formatted date string (e.g. "16 Aug 2024"). */
  date: string
  /** Category icon identifier (e.g. "categoryGeneral"). */
  categoryIcon: IconName
  /** Category color token key (e.g. "blue", "army-green"). */
  categoryColor: string
}

/** Props for the LatestSpending component. */
export interface ILatestSpendingProps {
  /** Section title (e.g. "Latest Spending"). */
  title: string
  /** Label for the "See All" link. */
  seeAllLabel: string
  /** Callback when "See All" is pressed. */
  onSeeAll: () => void
  /** Transaction items to display. */
  items: readonly ILatestSpendingItem[]
}
