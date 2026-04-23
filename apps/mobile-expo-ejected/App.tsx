import { Button, Card, Header } from '@financial-app/ui'
import { StatusBar } from 'expo-status-bar'
import { ScrollView, View } from 'react-native'

import { DevBadge } from './src/components/DevBadge'
import tw from './src/lib/tw'

export default function App() {
  return (
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
  )
}
