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
  /** Amount for paid bills (raw number — formatted in the component). */
  paid: number
  /** Amount for total upcoming bills (raw number — formatted in the component). */
  upcoming: number
  /** Amount for bills due soon (raw number — formatted in the component). */
  dueSoon: number
  /** Callback when "See Details" is pressed. */
  onSeeDetails: () => void
}
