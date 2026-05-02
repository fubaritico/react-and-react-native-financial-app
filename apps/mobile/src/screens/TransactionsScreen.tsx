import { TransactionsDataTable } from '@financial-app/features'
import { mockTransactions } from '@financial-app/shared'
import { Typography } from '@financial-app/ui'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import tw from '../lib/tw'

/**
 * Transactions screen — displays the full transactions list with search, sort, and category filter.
 * TODO (Phase 8): replace mockTransactions with real API data.
 */
export function TransactionsScreen() {
  const { t, i18n } = useTranslation()

  return (
    <ScrollView
      style={tw`flex-1 bg-beige-100`}
      contentContainerStyle={tw`p-4 pb-8`}
    >
      <Typography variant="page-title" style={tw`mb-4 mt-10`}>
        {t('transactions.title')}
      </Typography>
      <View>
        <TransactionsDataTable data={mockTransactions} locale={i18n.language} />
      </View>
    </ScrollView>
  )
}
