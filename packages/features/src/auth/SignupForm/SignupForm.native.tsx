import {
  parseValidationErrors,
  signupSchema,
  usePasswordRules,
} from '@financial-app/shared'
import {
  Alert,
  AuthCard,
  AuthLayout,
  Button,
  LinkText,
  PasswordInput,
  PasswordRulesList,
  TextInput,
} from '@financial-app/ui/native'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { IPasswordRule } from '@financial-app/ui/native'

import type { ISignupFormProps } from './SignupForm'

/**
 * SignupForm — full signup screen with name/email/password/confirm,
 * live password rules validation, and duplicate email check (native).
 */
export function SignupForm({
  authClient,
  onSignupSuccess,
  onNavigateToLogin,
}: Readonly<ISignupFormProps>) {
  const { t } = useTranslation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const { rules, allValid } = usePasswordRules(password, confirmPassword)

  /** Map rule keys to translated labels for PasswordRulesList */
  const translatedRules: IPasswordRule[] = useMemo(
    () =>
      rules.map((rule) => ({
        label: t(`auth.passwordRules.${rule.key}`),
        state: rule.state,
      })),
    [rules, t]
  )

  const handleSubmit = useCallback(async () => {
    setErrors({})
    setServerError('')

    const result = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    })
    if (!result.success) {
      setErrors(parseValidationErrors(result.error.issues, t))
      return
    }

    if (!allValid) return

    setLoading(true)
    const { error, isExistingEmail } = await authClient.signUp({
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
    })
    setLoading(false)

    if (isExistingEmail) {
      setServerError(t('auth.emailAlreadyRegistered'))
      return
    }

    if (error) {
      setServerError(error.message)
      return
    }

    onSignupSuccess(result.data.email)
  }, [
    name,
    email,
    password,
    confirmPassword,
    t,
    allValid,
    authClient,
    onSignupSuccess,
  ])

  const handleSubmitPress = useCallback(() => {
    void handleSubmit()
  }, [handleSubmit])

  return (
    <AuthLayout appName={t('app.name')}>
      <AuthCard
        title={t('auth.signup')}
        footer={
          <LinkText
            text={t('auth.alreadyHaveAccount')}
            linkLabel={t('auth.alreadyHaveAccountLink')}
            onLinkPress={onNavigateToLogin}
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
        <PasswordInput
          label={t('auth.confirmPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t('auth.confirmPasswordPlaceholder')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
        <PasswordRulesList rules={translatedRules} />
        <Button
          title={loading ? t('auth.creatingAccount') : t('auth.signupButton')}
          onPress={handleSubmitPress}
          fullWidth
          disabled={loading || !allValid}
          centered
        />
      </AuthCard>
    </AuthLayout>
  )
}
