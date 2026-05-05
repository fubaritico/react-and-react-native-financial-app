/** Props for the PotCard component. */
export interface IPotCardProps {
  /** User-defined pot name (e.g. "Savings"). */
  name: string
  /** Current total saved in the pot. */
  total: number
  /** Target savings amount. */
  target: number
  /** Token color name for the pot theme (e.g. "green", "cyan"). */
  color: string
  /** Label for the "Total Saved" line. */
  totalSavedLabel: string
  /** Label prefix for the target line (e.g. "Target of"). */
  targetOfLabel: string
  /** Label for the "+ Add Money" button. */
  addMoneyLabel: string
  /** Label for the "Withdraw" button. */
  withdrawLabel: string
  /** Label for the edit action in the ellipsis menu. */
  editLabel: string
  /** Label for the delete action in the ellipsis menu. */
  deleteLabel: string
  /** Callback when "+ Add Money" is pressed. */
  onAddMoney?: () => void
  /** Callback when "Withdraw" is pressed. */
  onWithdraw?: () => void
  /** Callback when "Edit Pot" is selected. */
  onEdit?: () => void
  /** Callback when "Delete Pot" is selected. */
  onDelete?: () => void
  /** Locale for currency formatting (e.g. "en-US"). */
  locale?: string
  /** Currency code for formatting (e.g. "USD"). */
  currency?: string
}
