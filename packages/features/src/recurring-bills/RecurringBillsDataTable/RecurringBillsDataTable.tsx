import type { IRecurringBill } from '@financial-app/shared'

/** Props for the RecurringBillsDataTable component. */
export interface IRecurringBillsDataTableProps {
  /** Recurring bill data to display. */
  data: IRecurringBill[]
  /** Show loading skeleton state. */
  loading?: boolean
  /** BCP 47 locale tag for date/currency formatting (defaults to 'en-US'). */
  locale?: string
}
