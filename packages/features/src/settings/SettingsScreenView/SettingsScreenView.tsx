/** Values submitted by the settings form. */
export interface ISettingsFormValues {
  /** Updated reference balance */
  balance: number
  /** Updated language code ('en' | 'fr') */
  language: string
}

/** Props for the SettingsScreenView component. */
export interface ISettingsScreenViewProps {
  /** Initial reference balance value (from API) */
  initialBalance: number
  /** Current language code ('en' or 'fr') */
  currentLanguage: string
  /** Callback when the user submits the form via "Change settings" */
  onSubmit: (values: ISettingsFormValues) => void
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
