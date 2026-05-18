import type { IAuthClient } from '@financial-app/shared'

/** Props for the SignupForm component */
export interface ISignupFormProps {
  /** Auth client instance */
  authClient: IAuthClient
  /** Navigate to verify-email screen after successful signup */
  onSignupSuccess: (email: string) => void
  /** Navigate to login screen */
  onNavigateToLogin: () => void
}
