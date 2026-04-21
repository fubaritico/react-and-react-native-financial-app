// TODO: wire auth gate with isAuthenticatedAtom
// import { AuthStack } from './AuthStack'
// const isAuthenticated = useAtomValue(isAuthenticatedAtom)
// return isAuthenticated ? <TabNavigator /> : <AuthStack />

import { TabNavigator } from './TabNavigator'

/**
 * Root navigator — auth gate.
 *
 * During initial setup, auth is bypassed: the app goes straight to tabs.
 * When Google OAuth is configured, this will read isAuthenticatedAtom
 * from Jotai and conditionally render AuthStack or TabNavigator.
 */
export function RootNavigator() {
  return <TabNavigator />
}
