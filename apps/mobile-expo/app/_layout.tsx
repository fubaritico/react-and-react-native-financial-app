import '../src/i18n'

import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { DevBadge } from '../src/components/DevBadge'

/**
 * Root layout — auth gate.
 *
 * During Phase 7, auth is bypassed: the app goes straight to (tabs).
 * When Google OAuth is configured, this layout will read isAuthenticatedAtom
 * from Jotai and conditionally render (auth) or (tabs) stack.
 */
export default function RootLayout() {
  // TODO (Phase 7.6): wire auth gate with isAuthenticatedAtom
  // const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  return (
    <>
      <StatusBar style="light" />
      <DevBadge />
      <Slot />
    </>
  )
}
