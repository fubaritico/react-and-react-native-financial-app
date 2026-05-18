import { AuthLayout, ModeCard, Typography } from '@financial-app/ui'
import { useTranslation } from 'react-i18next'

import type { IModeChoiceScreenProps } from './ModeChoiceScreen'

/**
 * Web implementation of the mode choice screen.
 * Shown after auth flow — user picks Manual (active) or Bank (disabled).
 * Desktop: cards side by side. Mobile/tablet: cards stacked.
 * @param props - Screen props with navigation callback
 * @returns The mode choice screen
 */
export function ModeChoiceScreen({
  onSelectManual,
}: Readonly<IModeChoiceScreenProps>) {
  const { t } = useTranslation()

  return (
    <AuthLayout
      appName={t('app.name')}
      tagline={t('app.tagline')}
      description={t('app.description')}
    >
      <div className="w-full max-w-2xl px-4">
        <Typography variant="heading-lg" as="h1" align="center">
          {t('onboarding.modeChoice.title')}
        </Typography>
        <div className="mt-8 flex flex-col lg:flex-row gap-6 justify-center">
          <div className="flex-1 max-w-sm">
            <ModeCard
              icon="manual"
              title={t('onboarding.modeChoice.manualTitle')}
              description={t('onboarding.modeChoice.manualDescription')}
              onPress={onSelectManual}
            />
          </div>
          <div className="flex-1 max-w-sm">
            <ModeCard
              icon="bank"
              title={t('onboarding.modeChoice.bankTitle')}
              description={t('onboarding.modeChoice.bankDescription')}
              disabled
              badge={t('onboarding.modeChoice.comingSoon')}
              onPress={onSelectManual}
            />
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
