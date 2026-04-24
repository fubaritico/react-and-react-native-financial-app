/** Props for the RecurringBillsOverview component. */
export interface IRecurringBillsOverviewProps {
  /** Section title (e.g., "Recurring Bills"). */
  title: string
  /** Label for the "See Details" link. */
  seeDetailsLabel: string
  /** Label for the "Paid Bills" row. */
  paidBillsLabel: string
  /** Label for the "Total Upcoming" row. */
  totalUpcomingLabel: string
  /** Label for the "Due Soon" row. */
  dueSoonLabel: string
  /** Amount for paid bills, formatted as currency string. */
  paid: string
  /** Amount for total upcoming bills, formatted as currency string. */
  upcoming: string
  /** Amount for bills due soon, formatted as currency string. */
  dueSoon: string
  /** Callback when "See Details" is pressed. */
  onSeeDetails: () => void
}
