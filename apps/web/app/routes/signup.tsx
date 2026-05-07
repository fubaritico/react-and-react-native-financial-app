import {
  isAuthenticatedAtom,
  parseValidationErrors,
  signupSchema,
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
 * Signup page — public route, no sidebar.
 * Redirects to Overview if already authenticated.
 */
export default function Signup() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  const [name, setName] = useState('')
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

    const result = signupSchema.safeParse({ name, email, password })
    if (!result.success) {
      setErrors(parseValidationErrors(result.error.issues, t))
      return
    }

    setLoading(true)
    const { error } = await authClient.signUp({
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
    })
    setLoading(false)

    if (error) {
      setServerError(error.message)
    }
  }, [name, email, password, t])

  return (
    <AuthLayout
      appName={t('app.name')}
      tagline={t('app.tagline')}
      description={t('app.description')}
    >
      <AuthCard
        title={t('auth.signup')}
        footer={
          <LinkText
            text={t('auth.alreadyHaveAccount')}
            linkLabel={t('auth.alreadyHaveAccountLink')}
            onLinkPress={() => {
              void navigate('/login')
            }}
          />
        }
      >
        {serverError ? <Alert severity="error" message={serverError} /> : null}
        <TextInput
          label={t('auth.name')}
          value={name}
          onChangeText={setName}
          placeholder={t('auth.namePlaceholder')}
          error={!!errors.name}
          helperText={errors.name}
        />
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
          title={loading ? t('auth.creatingAccount') : t('auth.signupButton')}
          onPress={() => {
            void handleSubmit()
          }}
          fullWidth
          disabled={loading}
        />
      </AuthCard>
    </AuthLayout>
  )
}
