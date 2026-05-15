/** A single budget item for the BudgetOverview component. */
export interface IBudgetOverviewItem {
  /** Budget category name (e.g. "Entertainment", "Bills"). */
  category: string
  /** Maximum budgeted amount for the period. */
  maximum: number
  /** Amount spent in this category. */
  spent: number
  /** Token color name for the segment/bar (e.g. "green", "cyan"). */
  color: string
}

/** Props for the BudgetOverview component. */
export interface IBudgetOverviewProps {
  /** Section title (e.g. "Budgets"). Omit for Budget page mode. */
  title?: string
  /** Label for the "See Details" link. Omit for Budget page mode. */
  seeDetailsLabel?: string
  /** Callback when "See Details" is pressed. */
  onSeeDetails?: () => void
  /** Budget items to display. */
  budgets: readonly IBudgetOverviewItem[]
  /** Show spent amount with "of $max" context (Budget page). When false, shows only max (Overview). */
  showSpentAmount?: boolean
  /** Label between spent and max amounts (e.g. "of"). */
  ofLabel: string
  /** Subtext template for the donut center (e.g. "of $975 limit"). */
  limitLabel: string
  /** BCP 47 locale tag (defaults to 'en-US'). */
  locale?: string
  /** ISO 4217 currency code (defaults to 'USD'). */
  currency?: string
  /** Heading for the spending summary section (e.g. "Spending Summary"). */
  spendingSummaryTitle?: string
}
