import illustrationSrc from '@financial-app/shared/assets/illustration-welcome.png'
import { Button, Typography } from '@financial-app/ui'
import { useTranslation } from 'react-i18next'

import { web } from './WelcomeScreen.styles'

import type { IWelcomeScreenProps } from './WelcomeScreen'

/**
 * Web implementation of the welcome screen.
 * Full-screen illustration background with a semi-transparent card overlay.
 * @param props - Screen props with get-started callback
 * @returns The welcome screen
 */
export function WelcomeScreen({ onGetStarted }: Readonly<IWelcomeScreenProps>) {
  const { t } = useTranslation()

  return (
    <div
      className={web.background}
      style={{ backgroundImage: `url(${illustrationSrc})` }}
    >
      <div className={web.card}>
        <h2 className={web.heading}>
          <Typography variant="heading-lg" as="span">
            {t('onboarding.welcome.title')}
          </Typography>
        </h2>
        <p className={web.description}>
          <Typography variant="body" color="muted" as="span">
            {t('onboarding.welcome.description')}
          </Typography>
        </p>
        <div className={web.ctaWrapper}>
          <Button
            title={t('onboarding.welcome.getStarted')}
            onPress={onGetStarted}
            fullWidth
            centered
          />
        </div>
      </div>
    </div>
  )
}
