import { useTotpChallenge } from '@financial-app/shared'
import {
  Alert,
  AuthCard,
  AuthLayout,
  Button,
  OtpInput,
  Typography,
} from '@financial-app/ui/native'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { ITotpChallengeScreenProps } from './TotpChallengeScreen'

/**
 * Native implementation of the TOTP challenge screen.
 * Shown on login when MFA is enrolled — user enters 6-digit code.
 */
export function TotpChallengeScreen({
  authClient,
  onVerified,
}: Readonly<ITotpChallengeScreenProps>) {
  const { t } = useTranslation()
  const {
    code,
    setCode,
    serverError,
    loading,
    lockedOut,
    remainingAttempts,
    verify,
  } = useTotpChallenge(authClient)

  const handlePress = useCallback(() => {
    void (async () => {
      const success = await verify()
      if (success) onVerified()
    })()
  }, [verify, onVerified])

  return (
    <AuthLayout appName={t('app.name')}>
      <AuthCard title={t('auth.totp.challengeTitle')}>
        {serverError ? (
          <Alert severity="error" message={t(serverError)} />
        ) : null}
        <Typography variant="body" color="muted">
          {t('auth.totp.challengeDescription')}
        </Typography>
        <OtpInput
          value={code}
          onChangeText={setCode}
          onComplete={handlePress}
          hasError={!!serverError}
          disabled={loading || lockedOut}
          accessibilityLabel={t('auth.totp.codeLabel')}
        />
        {remainingAttempts !== null ? (
          <Typography variant="caption" color="destructive">
            {t('auth.totp.remainingAttempts', { count: remainingAttempts })}
          </Typography>
        ) : null}
        <Button
          title={
            loading
              ? t('auth.totp.authenticating')
              : t('auth.totp.authenticate')
          }
          onPress={handlePress}
          fullWidth
          disabled={loading || lockedOut || code.length !== 6}
          centered
        />
      </AuthCard>
    </AuthLayout>
  )
}
