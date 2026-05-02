import './src/i18n'

import { PortalProvider } from '@financial-app/ui/native'
import { NavigationContainer } from '@react-navigation/native'
import { Provider as JotaiProvider } from 'jotai'
import { StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { DevBadge } from './src/components/DevBadge'
import { RootNavigator } from './src/navigation/RootNavigator'

function App() {
  return (
    <JotaiProvider>
      <PortalProvider>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" />
          <DevBadge />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PortalProvider>
    </JotaiProvider>
  )
}

export default App
