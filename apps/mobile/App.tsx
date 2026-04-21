import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { DevBadge } from './src/components/DevBadge'
import { RootNavigator } from './src/navigation/RootNavigator'

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <DevBadge />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App
