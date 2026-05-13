import {
  isAuthenticatedAtom,
  loginSchema,
  parseValidationErrors,
} from '@financial-app/shared'
import {
  Alert,
  AuthCard,
  AuthLayout,
  Button,
  LinkText,
  PasswordInput,
  TextInput,
} from '@financial-app/ui'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { authClient } from '../lib/supabase'

/**
 * Login page — public route, no sidebar.
 * Redirects to Overview if already authenticated.
 */
export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      void navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = useCallback(async () => {
    setErrors({})
    setServerError('')

    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      setErrors(parseValidationErrors(result.error.issues, t))
      return
    }

    setLoading(true)
    const { error } = await authClient.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    })
    setLoading(false)

    if (error) {
      setServerError(error.message)
    }
  }, [email, password, t])

  return (
    <AuthLayout
      appName={t('app.name')}
      tagline={t('app.tagline')}
      description={t('app.description')}
    >
      <AuthCard
        title={t('auth.login')}
        footer={
          <LinkText
            text={t('auth.needAccount')}
            linkLabel={t('auth.needAccountLink')}
            onLinkPress={() => {
              void navigate('/signup')
            }}
          />
        }
      >
        {serverError ? <Alert severity="error" message={serverError} /> : null}
        <TextInput
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.emailPlaceholder')}
          autoCapitalize="none"
          keyboardType="email-address"
          error={!!errors.email}
          helperText={errors.email}
        />
        <PasswordInput
          label={t('auth.password')}
          value={password}
          onChangeText={setPassword}
          placeholder={t('auth.passwordPlaceholder')}
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button
          title={loading ? t('auth.signingIn') : t('auth.loginButton')}
          onPress={() => {
            void handleSubmit()
          }}
          fullWidth
          disabled={loading}
          centered
        />
      </AuthCard>
    </AuthLayout>
  )
}
