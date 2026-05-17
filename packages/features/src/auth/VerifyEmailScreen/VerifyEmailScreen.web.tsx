import {
  Alert,
  AuthCard,
  AuthLayout,
  Button,
  Typography,
} from '@financial-app/ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { IVerifyEmailScreenProps } from './VerifyEmailScreen'

type ResendStatus = 'idle' | 'sending' | 'sent'

/**
 * SEC-004: Cooldown period in seconds before resend is allowed again.
 * Prevents email bombing by rate-limiting resend requests client-side.
 * Without this, an attacker could spam the resend button to flood a victim's inbox.
 * OWASP A04:2021 — Insecure Design (missing rate limiting).
 */
const RESEND_COOLDOWN_SECONDS = 60

/**
 * Web implementation of the email verification screen.
 * Shown after signup — listens for auth state change to auto-navigate.
 */
export function VerifyEmailScreen({
  authClient,
  email,
  onVerified,
  onBackToLogin,
}: Readonly<IVerifyEmailScreenProps>) {
  const { t } = useTranslation()
  const [resendStatus, setResendStatus] = useState<ResendStatus>('idle')
  const [serverError, setServerError] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Listen for email confirmation via auth state change
  useEffect(() => {
    const { unsubscribe } = authClient.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        onVerified()
      }
    })
    return unsubscribe
  }, [authClient, onVerified])

  // Cooldown timer cleanup
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current)
    }
  }, [])

  const startCooldown = useCallback(() => {
    setCooldown(RESEND_COOLDOWN_SECONDS)
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current)
          setResendStatus('idle')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const handleResend = useCallback(async () => {
    if (!email || cooldown > 0) return
    setResendStatus('sending')
    setServerError('')

    const { error } = await authClient.signUp({
      name: '',
      email,
      password: '',
    })

    if (error) {
      setServerError(error.message)
      setResendStatus('idle')
      return
    }

    setResendStatus('sent')
    startCooldown()
  }, [email, authClient, cooldown, startCooldown])

  const handleResendPress = useCallback(() => {
    void handleResend()
  }, [handleResend])

  const resendLabel =
    resendStatus === 'sending'
      ? t('auth.verification.resending')
      : resendStatus === 'sent'
        ? t('auth.verification.resentWithCooldown', { count: cooldown })
        : t('auth.verification.resend')

  return (
    <AuthLayout
      appName={t('app.name')}
      tagline={t('app.tagline')}
      description={t('app.description')}
    >
      <AuthCard title={t('auth.verification.title')}>
        {serverError ? <Alert severity="error" message={serverError} /> : null}
        <Typography variant="body" color="muted">
          {t('auth.verification.description', { email })}
        </Typography>
        <Button
          title={resendLabel}
          onPress={handleResendPress}
          variant="secondary"
          fullWidth
          disabled={resendStatus === 'sending' || resendStatus === 'sent'}
          centered
        />
        <Button
          title={t('auth.backToChoice')}
          onPress={onBackToLogin}
          variant="tertiary"
          fullWidth
          centered
        />
      </AuthCard>
    </AuthLayout>
  )
}
