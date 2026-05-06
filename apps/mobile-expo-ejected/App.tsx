import { client } from '@financial-app/http-client/client'
import {
  createAppQueryClient,
  useAuthListener,
  useConfigureHttpClient,
} from '@financial-app/shared'
import { Button, Card, Header, PortalProvider } from '@financial-app/ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { Provider as JotaiProvider } from 'jotai'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'

import { DevBadge } from './src/components/DevBadge'
import { authClient } from './src/lib/supabase'
import tw from './src/lib/tw'

import type { ReactNode } from 'react'

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'

/** Bootstraps auth listener and HTTP client configuration */
function AuthBootstrap({ children }: Readonly<{ children: ReactNode }>) {
  useAuthListener(authClient)
  useConfigureHttpClient(client, authClient, API_URL)
  return children
}

/** Root component — provider stack + design system shell */
export default function App() {
  const [queryClient] = useState(createAppQueryClient)

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <PortalProvider>
          <AuthBootstrap>
            <View style={tw`flex-1 bg-background`}>
              <StatusBar style="light" />
              <DevBadge />
              <Header title="Expo Ejected" subtitle="Design System partagé" />
              <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4`}>
                <Card
                  title="Bienvenue"
                  text="Ceci est une carte du design-system partagé."
                  style={tw`mb-4`}
                />
                <Card title="Actions" style={tw`mb-4`}>
                  <Button
                    title="Primary"
                    onPress={() => {
                      alert('Primary!')
                    }}
                    style={tw`mb-2`}
                  />
                  <Button
                    title="Secondary"
                    variant="secondary"
                    onPress={() => {
                      alert('Secondary!')
                    }}
                    style={tw`mb-2`}
                  />
                  <Button
                    title="Tertiary"
                    variant="tertiary"
                    onPress={() => {
                      alert('Tertiary!')
                    }}
                  />
                </Card>
              </ScrollView>
            </View>
          </AuthBootstrap>
        </PortalProvider>
      </QueryClientProvider>
    </JotaiProvider>
  )
}
