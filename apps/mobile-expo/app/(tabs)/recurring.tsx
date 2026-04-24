import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import tw from '../../src/lib/tw'

export default function RecurringBillsScreen() {
  const { t } = useTranslation()

  return (
    <View style={tw`flex-1 justify-center items-center bg-beige-100`}>
      <Text style={tw`text-2xl font-bold`}>{t('recurring.title')}</Text>
      <Text style={tw`mt-2 text-grey-500`}>{t('common.placeholder')}</Text>
    </View>
  )
}
