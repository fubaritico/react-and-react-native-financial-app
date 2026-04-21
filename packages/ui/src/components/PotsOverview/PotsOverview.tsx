import type { ReactNode } from 'react'

/** Individual pot data. */
export interface IPotItem {
  /** Pot name (e.g., "Savings", "Gift"). */
  name: string
  /** Pot total, formatted as currency string (e.g., "$159"). */
  total: string
  /** Token color name for the left border (e.g., "green", "navy"). */
  color: string
}

/** Props for the PotsOverview component. */
export interface IPotsOverviewProps {
  /** Total saved across all pots, formatted as currency string. */
  totalSaved: string
  /** Array of pot items to display in the grid. */
  pots: IPotItem[]
  /** Callback when "See Details" is pressed. */
  onSeeDetails: () => void
  /** Optional icon for the Total Saved box. */
  icon?: ReactNode
}
