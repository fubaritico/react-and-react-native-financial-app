import { AuthCard, AuthLayout, Button, Typography } from '@financial-app/ui'
import { useTranslation } from 'react-i18next'

import type { IAccountActivatedScreenProps } from './AccountActivatedScreen'

/**
 * Web implementation of the account activated confirmation screen.
 * Shown after email verification — navigates to TOTP enrollment.
 */
export function AccountActivatedScreen({
  onContinue,
}: Readonly<IAccountActivatedScreenProps>) {
  const { t } = useTranslation()

  return (
    <AuthLayout
      appName={t('app.name')}
      tagline={t('app.tagline')}
      description={t('app.description')}
    >
      <AuthCard title={t('auth.activated.title')}>
        <Typography variant="body" color="muted">
          {t('auth.activated.description')}
        </Typography>
        <Button
          title={t('auth.activated.continue')}
          onPress={onContinue}
          fullWidth
          centered
        />
      </AuthCard>
    </AuthLayout>
  )
}
