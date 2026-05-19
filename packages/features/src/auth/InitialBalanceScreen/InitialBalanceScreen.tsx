/** Props for the InitialBalanceScreen component. */
export interface IInitialBalanceScreenProps {
  /** Called when the user submits the initial balance amount. */
  onSubmit: (amount: number) => void
  /** Called when the user taps "Back to choice". */
  onBack: () => void
  /** Whether the submit mutation is in progress. */
  isSubmitting: boolean
  /** Server error message to display (e.g. 409 already set). */
  error?: string
}
