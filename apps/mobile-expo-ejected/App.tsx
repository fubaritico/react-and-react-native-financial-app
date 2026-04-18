import { Button, Card, Header } from '@financial-app/ui'
import { StatusBar } from 'expo-status-bar'
import { ScrollView, StyleSheet, View } from 'react-native'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Header title="Expo Ejected" subtitle="Design System partagé" />
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
              alert('Primary!')
            }}
            style={styles.button}
          />
          <Button
            title="Secondary"
            variant="secondary"
            onPress={() => {
              alert('Secondary!')
            }}
            style={styles.button}
          />
          <Button
            title="Outline"
            variant="outline"
            onPress={() => {
              alert('Outline!')
            }}
          />
        </Card>
      </ScrollView>
    </View>
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
