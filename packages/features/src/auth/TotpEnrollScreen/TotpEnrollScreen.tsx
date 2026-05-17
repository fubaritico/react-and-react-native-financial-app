import type { IAuthClient } from '@financial-app/shared'

/** Props for the TotpEnrollScreen component */
export interface ITotpEnrollScreenProps {
  /** Auth client instance */
  authClient: IAuthClient
  /** Navigate to the app home */
  onContinue: () => void
  /** Skip enrollment and go to the app */
  onSkip: () => void
}
