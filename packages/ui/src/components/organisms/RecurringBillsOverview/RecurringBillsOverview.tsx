/** Props for the RecurringBillsOverview component. */
export interface IRecurringBillsOverviewProps {
  /** Amount for paid bills, formatted as currency string. */
  paid: string
  /** Amount for total upcoming bills, formatted as currency string. */
  upcoming: string
  /** Amount for bills due soon, formatted as currency string. */
  dueSoon: string
  /** Callback when "See Details" is pressed. */
  onSeeDetails: () => void
}
