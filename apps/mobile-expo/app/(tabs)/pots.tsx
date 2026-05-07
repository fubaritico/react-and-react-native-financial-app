import { PotCard } from '@financial-app/features'
import { getPotsOptions } from '@financial-app/http-client'
import { getErrorMessage } from '@financial-app/shared'
import { Alert, Button, Spinner, Typography } from '@financial-app/ui'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import tw from '../../src/lib/tw'

// eslint-disable-next-line @typescript-eslint/no-empty-function -- disabled button, wired in CRUD phase
const noop = () => {}

export default function PotsScreen() {
  const { t } = useTranslation()

  const { data: pots, isLoading, error } = useQuery(getPotsOptions())

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-beige-100`}>
        <Spinner />
      </View>
    )
  }

  if (error) {
    return (
      <View style={tw`flex-1 bg-beige-100 px-6 justify-center`}>
        <Alert
          severity="error"
          message={t('common.errorLoading')}
          description={__DEV__ ? getErrorMessage(error) : undefined}
        />
      </View>
    )
  }

  return (
    <ScrollView
      style={tw`flex-1 bg-beige-100`}
      contentContainerStyle={tw`p-4 pb-8`}
    >
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mb-6 mt-10`}>
        <Typography variant="page-title">{t('pots.title')}</Typography>
        <Button
          title={t('pots.addNewPot')}
          onPress={noop}
          variant="primary"
          disabled
        />
      </View>

      {/* Pot Cards */}
      {(pots ?? []).map((pot) => (
        <View key={pot.id} style={tw`mt-4`}>
          <PotCard
            name={pot.name}
            total={pot.total}
            target={pot.target}
            color={pot.theme}
            totalSavedLabel={t('pots.totalSaved')}
            targetOfLabel={t('pots.targetOf')}
            addMoneyLabel={t('pots.addMoney')}
            withdrawLabel={t('pots.withdraw')}
            editLabel={t('pots.editPot')}
            deleteLabel={t('pots.deletePot')}
          />
        </View>
      ))}
    </ScrollView>
  )
}
