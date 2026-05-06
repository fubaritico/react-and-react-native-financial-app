import type { AlertVariants } from './Alert.variants'

/** Alert severity levels */
export type AlertSeverity = 'success' | 'warning' | 'error' | 'info'

export interface IAlertProps extends AlertVariants {
  /** Severity level — controls icon, text color, and background */
  severity: AlertSeverity
  /** Message to display */
  message: string
}
