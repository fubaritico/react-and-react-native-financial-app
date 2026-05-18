import { AuthLayout, ModeCard, Typography } from '@financial-app/ui/native'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { IModeChoiceScreenProps } from './ModeChoiceScreen'

/**
 * Native implementation of the mode choice screen.
 * Shown after auth flow — user picks Manual (active) or Bank (disabled).
 * @param props - Screen props with navigation callback
 * @returns The mode choice screen
 */
export function ModeChoiceScreen({
  onSelectManual,
}: Readonly<IModeChoiceScreenProps>) {
  const { t } = useTranslation()

  return (
    <AuthLayout appName={t('app.name')}>
      <View style={{ width: '100%', paddingHorizontal: 8 }}>
        <Typography variant="heading-lg" align="center">
          {t('onboarding.modeChoice.title')}
        </Typography>
        <View style={{ marginTop: 24, gap: 8 }}>
          <ModeCard
            icon="manual"
            title={t('onboarding.modeChoice.manualTitle')}
            description={t('onboarding.modeChoice.manualDescription')}
            onPress={onSelectManual}
          />
          <ModeCard
            icon="bank"
            title={t('onboarding.modeChoice.bankTitle')}
            description={t('onboarding.modeChoice.bankDescription')}
            disabled
            badge={t('onboarding.modeChoice.comingSoon')}
            onPress={onSelectManual}
          />
        </View>
      </View>
    </AuthLayout>
  )
}
