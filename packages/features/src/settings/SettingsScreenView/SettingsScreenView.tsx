import type { SupportedCurrency } from '@financial-app/shared'

/** Values submitted by the settings form. */
export interface ISettingsFormValues {
  /** Updated reference balance */
  balance: number
  /** Updated language code ('en' | 'fr') */
  language: string
  /** Updated currency code ('USD' | 'EUR' | 'GBP') */
  currency: SupportedCurrency
}

/** Props for the SettingsScreenView component. */
export interface ISettingsScreenViewProps {
  /** Initial reference balance value (from API) */
  initialBalance: number
  /** Current language code ('en' or 'fr') */
  currentLanguage: string
  /** Current currency code ('USD' | 'EUR' | 'GBP') */
  currentCurrency: SupportedCurrency
  /** Callback when the user submits the form via "Change settings" */
  onSubmit: (values: ISettingsFormValues) => void | Promise<void>
  /** Whether the submit mutation is in progress */
  isSubmitting: boolean
  /** Callback when the user confirms account deletion */
  onDeleteAccount: () => void
  /** Whether the delete account mutation is in progress */
  isDeleting: boolean
  /** Callback when the user taps disconnect (sign out) */
  onDisconnect: () => void
  /** Callback to navigate back to the previous screen (referrer) */
  onGoBack: () => void
}
