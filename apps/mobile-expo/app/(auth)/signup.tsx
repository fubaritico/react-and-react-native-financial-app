import { Text, View } from 'react-native'

/** Sign-up screen placeholder — will be replaced by AuthLayout + AuthCard components from Track B. */
export default function SignupScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F4F0',
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Sign Up</Text>
      <Text style={{ marginTop: 8, color: '#696868' }}>
        Placeholder - Phase 7.6
      </Text>
    </View>
  )
}
