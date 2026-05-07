import { isAuthLoadingAtom, isAuthenticatedAtom } from '@financial-app/shared'
import { useAtomValue } from 'jotai'

import { AuthStack } from './AuthStack'
import { TabNavigator } from './TabNavigator'

/**
 * Root navigator — auth gate.
 * Reads isAuthenticatedAtom from Jotai and conditionally
 * renders AuthStack (login/signup) or TabNavigator (app).
 * Waits for first auth callback to avoid redirect flicker on cold start.
 */
export function RootNavigator() {
  const isAuthLoading = useAtomValue(isAuthLoadingAtom)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  if (isAuthLoading) return null

  return isAuthenticated ? <TabNavigator /> : <AuthStack />
}
