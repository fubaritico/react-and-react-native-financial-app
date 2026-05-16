import '../src/i18n'

import { ModalRenderer } from '@financial-app/features/shared'
import { createAppQueryClient } from '@financial-app/shared'
import { PortalProvider } from '@financial-app/ui/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { Slot } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Provider as JotaiProvider } from 'jotai'
import { useCallback, useState } from 'react'

import { AnimatedSplash } from '../src/components/AnimatedSplash'
import { AuthBootstrap } from '../src/components/AuthBootstrap'
import { AuthGate } from '../src/components/AuthGate'
import { DevBadge } from '../src/components/DevBadge'

/** Module-level flag — survives remounts, prevents splash from replaying */
let splashShown = false

/**
 * Root layout — splash then auth gate.
 * Shows animated splash on first launch only, then hands off to the router.
 */
export default function RootLayout() {
  const [queryClient] = useState(createAppQueryClient)
  const [showSplash, setShowSplash] = useState(() => !splashShown)

  const handleSplashFinish = useCallback(() => {
    splashShown = true
    setShowSplash(false)
  }, [])

  if (showSplash) {
    return <AnimatedSplash onFinish={handleSplashFinish} />
  }

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <PortalProvider>
          <AuthBootstrap>
            <AuthGate>
              <ModalRenderer>
                <StatusBar style="dark" />
                <DevBadge />
                <Slot />
              </ModalRenderer>
            </AuthGate>
          </AuthBootstrap>
        </PortalProvider>
      </QueryClientProvider>
    </JotaiProvider>
  )
}
