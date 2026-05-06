import './src/i18n'

import { API_URL } from '@env'
import { client } from '@financial-app/http-client/client'
import {
  createAppQueryClient,
  useAuthListener,
  useConfigureHttpClient,
} from '@financial-app/shared'
import { PortalProvider } from '@financial-app/ui/native'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { useState } from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { DevBadge } from './src/components/DevBadge'
import { authClient } from './src/lib/supabase'
import { RootNavigator } from './src/navigation/RootNavigator'

import type { ReactNode } from 'react'

const apiUrl = API_URL ?? 'http://localhost:3001'

/** Bootstraps auth listener and HTTP client configuration */
function AuthBootstrap({ children }: Readonly<{ children: ReactNode }>) {
  useAuthListener(authClient)
  useConfigureHttpClient(client, authClient, apiUrl)
  return children
}

/** Root component — provider stack + navigation */
function App() {
  const [queryClient] = useState(createAppQueryClient)

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <PortalProvider>
          <SafeAreaProvider>
            <AuthBootstrap>
              <StatusBar barStyle="light-content" />
              <DevBadge />
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </AuthBootstrap>
          </SafeAreaProvider>
        </PortalProvider>
      </QueryClientProvider>
    </JotaiProvider>
  )
}

export default App
