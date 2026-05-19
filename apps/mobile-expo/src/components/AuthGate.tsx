import { Redirect } from 'expo-router'

import { useAuthRedirect } from '../hooks/useAuthRedirect'

import type { ReactNode } from 'react'

/** Redirects based on auth state — must be inside JotaiProvider + AuthBootstrap */
export function AuthGate({ children }: Readonly<{ children: ReactNode }>) {
  const result = useAuthRedirect()

  if (result.status === 'loading') return null
  if (result.status === 'redirect') return <Redirect href={result.href} />
  return children
}
