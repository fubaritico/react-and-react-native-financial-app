import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="account-activated" />
      <Stack.Screen name="totp-enroll" />
      <Stack.Screen name="totp-challenge" />
      <Stack.Screen name="mode-choice" />
      <Stack.Screen name="initial-balance" />
      <Stack.Screen name="welcome" />
    </Stack>
  )
}
