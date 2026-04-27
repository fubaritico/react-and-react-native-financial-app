import './src/i18n'

import { NavigationContainer } from '@react-navigation/native'
import { Provider as JotaiProvider } from 'jotai'
import { StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { DevBadge } from './src/components/DevBadge'
import { RootNavigator } from './src/navigation/RootNavigator'

function App() {
  return (
    <JotaiProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <DevBadge />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </JotaiProvider>
  )
}

export default App
