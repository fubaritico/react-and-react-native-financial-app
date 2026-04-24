import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import tw from '../../src/lib/tw'

/** Sign-up screen placeholder — will be replaced by AuthLayout + AuthCard components from Track B. */
export default function SignupScreen() {
  const { t } = useTranslation()

  return (
    <View style={tw`flex-1 justify-center items-center bg-beige-100`}>
      <Text style={tw`text-2xl font-bold`}>{t('auth.signup')}</Text>
      <Text style={tw`mt-2 text-grey-500`}>{t('common.placeholder')}</Text>
    </View>
  )
}
