/** A single transaction entry in the Latest Spending list. */
export interface ILatestSpendingItem {
  /** URL or local path to the counterparty avatar. */
  avatar: string
  /** Counterparty name. */
  name: string
  /** Formatted amount string (e.g. "-$10.00"). */
  amount: string
  /** Formatted date string (e.g. "16 Aug 2024"). */
  date: string
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
  /** Whether to show avatars next to names. Defaults to true. */
  showAvatars?: boolean
}
