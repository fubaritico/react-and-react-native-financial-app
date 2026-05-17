import { useTotpEnroll } from '@financial-app/shared'
import {
  Alert,
  AuthCard,
  AuthLayout,
  Button,
  OtpInput,
  Typography,
} from '@financial-app/ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { ITotpEnrollScreenProps } from './TotpEnrollScreen'

/**
 * Web implementation of the TOTP enrollment screen.
 * Displays QR code, secret, OTP input, and skip option.
 */
export function TotpEnrollScreen({
  authClient,
  onContinue,
  onSkip,
}: Readonly<ITotpEnrollScreenProps>) {
  const { t } = useTranslation()
  const { status, factor, code, setCode, serverError, loading, verify } =
    useTotpEnroll(authClient)

  const handleVerify = useCallback(() => {
    void verify()
  }, [verify])

  if (status === 'enrolling') {
    return (
      <AuthLayout
        appName={t('app.name')}
        tagline={t('app.tagline')}
        description={t('app.description')}
      >
        <AuthCard title={t('auth.totp.enrollTitle')}>
          <Typography variant="body" color="muted">
            {t('auth.creatingAccount')}
          </Typography>
        </AuthCard>
      </AuthLayout>
    )
  }

  if (status === 'enrolled') {
    return (
      <AuthLayout
        appName={t('app.name')}
        tagline={t('app.tagline')}
        description={t('app.description')}
      >
        <AuthCard title={t('auth.totp.title')}>
          <Typography variant="body" color="success">
            {t('auth.totp.nextStep')}
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

  return (
    <AuthLayout
      appName={t('app.name')}
      tagline={t('app.tagline')}
      description={t('app.description')}
    >
      <AuthCard title={t('auth.totp.enrollTitle')}>
        {serverError ? (
          <Alert severity="error" message={t(serverError)} />
        ) : null}
        <Typography variant="body" color="muted">
          {t('auth.totp.enrollDescription')}
        </Typography>
        {factor?.totp?.qr_code ? (
          <img
            src={factor.totp.qr_code}
            alt={t('auth.totp.qrAccessibilityLabel')}
            className="h-[200px] w-[200px] self-center"
          />
        ) : null}
        {factor?.totp?.secret ? (
          <>
            <Typography variant="body" color="muted">
              {t('auth.totp.manualEntry')}
            </Typography>
            <Typography variant="body-bold">{factor.totp.secret}</Typography>
          </>
        ) : null}
        <OtpInput
          value={code}
          onChangeText={setCode}
          onComplete={handleVerify}
          hasError={!!serverError}
          disabled={loading}
          accessibilityLabel={t('auth.totp.codeLabel')}
        />
        <Button
          title={
            loading
              ? t('auth.totp.authenticating')
              : t('auth.totp.authenticate')
          }
          onPress={handleVerify}
          fullWidth
          disabled={loading || code.length !== 6}
          centered
        />
        <Button
          title={t('auth.totp.skip')}
          onPress={onSkip}
          variant="tertiary"
          fullWidth
          centered
        />
      </AuthCard>
    </AuthLayout>
  )
}
