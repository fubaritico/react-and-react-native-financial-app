/** Bill payment status. */
export type BillStatus = 'paid' | 'upcoming' | 'due-soon'

/** Props for the Status component. */
export interface IStatusProps {
  /** ISO date string to extract the ordinal day from. */
  date: string
  /** Bill payment status. */
  status: BillStatus
}
