import type { ReactNode } from 'react'

/** Props for the AuthCard component. */
export interface IAuthCardProps {
  /** Card title (e.g. "Login", "Sign Up"). */
  title: string
  /** Form content rendered inside the card. */
  children: ReactNode
  /** Optional footer content (e.g. LinkText). */
  footer?: ReactNode
}
