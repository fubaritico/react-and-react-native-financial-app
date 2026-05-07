import { loginSchema, parseValidationErrors } from '@financial-app/shared'
import {
  Alert,
  AuthCard,
  AuthLayout,
  Button,
  LinkText,
  PasswordInput,
  TextInput,
} from '@financial-app/ui/native'
import { useNavigation } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { authClient } from '../lib/supabase'

import type { AuthStackParamList } from '../navigation/types'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

/** Login screen — email/password form with validation. */
export function LoginScreen() {
  const { t } = useTranslation()
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

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
    <AuthLayout appName={t('app.name')}>
      <AuthCard
        title={t('auth.login')}
        footer={
          <LinkText
            text={t('auth.needAccount')}
            linkLabel={t('auth.needAccountLink')}
            onLinkPress={() => {
              navigation.replace('Signup')
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
        />
      </AuthCard>
    </AuthLayout>
  )
}
