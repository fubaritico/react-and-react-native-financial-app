import { Text, View } from 'react-native'

import tw from '../lib/tw'

/** Login screen placeholder — will be replaced by AuthLayout + AuthCard components from Track B. */
export function LoginScreen() {
  return (
    <View style={tw`flex-1 justify-center items-center bg-beige-100`}>
      <Text style={tw`text-2xl font-bold`}>Login</Text>
      <Text style={tw`mt-2 text-grey-500`}>Placeholder</Text>
    </View>
  )
}
