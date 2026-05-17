import type { IAuthClient } from '@financial-app/shared'

/** Props for the TotpChallengeScreen component */
export interface ITotpChallengeScreenProps {
  /** Auth client instance */
  authClient: IAuthClient
  /** Navigate to the app home after successful verification */
  onVerified: () => void
}
