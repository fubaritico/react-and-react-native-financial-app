import { Text, View } from 'react-native'

export function PotsScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F4F0',
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Pots</Text>
      <Text style={{ marginTop: 8, color: '#696868' }}>Placeholder</Text>
    </View>
  )
}
