import type { IAuthClient } from '@financial-app/shared'

/** Props for the VerifyEmailScreen component */
export interface IVerifyEmailScreenProps {
  /** Auth client instance */
  authClient: IAuthClient
  /** Email address that was used to sign up */
  email: string
  /** Navigate to the account-activated screen */
  onVerified: () => void
  /** Navigate back to login */
  onBackToLogin: () => void
}
