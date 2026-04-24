import type { ReactNode } from 'react'

/** Props for the AuthLayout component. */
export interface IAuthLayoutProps {
  /** The auth card content (AuthCard). */
  children: ReactNode
  /** App name displayed in the logo area. */
  appName: string
  /** Tagline displayed in the desktop aside panel. */
  tagline?: string
  /** Description displayed below the tagline. */
  description?: string
}
