/** A single row in the bills summary card. */
export interface IBillsSummaryRow {
  /** Translated label (e.g. "Paid Bills") */
  label: string
  /** Number of bills in this category */
  count: number
  /** Total amount for this category (in base currency USD) */
  total: number
  /** Typography color for this row */
  color?: 'muted' | 'destructive'
}

/** Props for the BillsSummary component. */
export interface IBillsSummaryProps {
  /** Card heading (e.g. "Summary") */
  title: string
  /** Summary rows to display */
  rows: IBillsSummaryRow[]
}
