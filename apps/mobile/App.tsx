import { Button, Card, Header } from '@financial-app/ui'
import { Alert, ScrollView, StatusBar, StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { DevBadge } from './src/components/DevBadge'

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" />
        <DevBadge />
        <Header title="Mobile CLI" subtitle="Design System partagé" />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <Card
            title="Bienvenue"
            text="Ceci est une carte du design-system partagé."
            style={styles.card}
          />
          <Card title="Actions" style={styles.card}>
            <Button
              title="Primary"
              onPress={() => {
                Alert.alert('Primary!')
              }}
              style={styles.button}
            />
            <Button
              title="Secondary"
              variant="secondary"
              onPress={() => {
                Alert.alert('Secondary!')
              }}
              style={styles.button}
            />
            <Button
              title="Tertiary"
              variant="tertiary"
              onPress={() => {
                Alert.alert('Tertiary!')
              }}
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 8,
  },
})

export default App
