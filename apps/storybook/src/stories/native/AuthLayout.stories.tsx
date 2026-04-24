import {
  AuthCard,
  AuthLayout,
  Button,
  LinkText,
  PasswordInput,
  TextInput,
} from '@financial-app/ui/native'
import i18n from 'i18next'
import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const LoginContent = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <AuthCard
      title="Login"
      footer={
        <LinkText
          text="Need to create an account?"
          linkLabel="Sign Up"
          onLinkPress={noop}
        />
      }
    >
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="e.g. john@example.com"
      />
      <PasswordInput
        label="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" variant="primary" fullWidth onPress={noop} />
    </AuthCard>
  )
}

const SignUpContent = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <AuthCard
      title="Sign Up"
      footer={
        <LinkText
          text="Already have an account?"
          linkLabel="Login"
          onLinkPress={noop}
        />
      }
    >
      <TextInput label="Name" value={name} onChangeText={setName} />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="e.g. john@example.com"
      />
      <PasswordInput
        label="Create Password"
        value={password}
        onChangeText={setPassword}
        helperText="Passwords must be at least 8 characters"
      />
      <Button
        title="Create Account"
        variant="primary"
        fullWidth
        onPress={noop}
      />
    </AuthCard>
  )
}

const meta = {
  title: 'Native/Design System/Templates/AuthLayout',
  component: AuthLayout,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    children: <LoginContent />,
    appName: i18n.t('app.name'),
    tagline: i18n.t('app.tagline'),
    description: i18n.t('app.description'),
  },
} satisfies Meta<typeof AuthLayout>

export default meta
type Story = StoryObj<typeof meta>

/** Login page layout. */
export const Login: Story = {
  args: {
    children: <LoginContent />,
  },
}

/** Sign Up page layout. */
export const SignUp: Story = {
  args: {
    children: <SignUpContent />,
  },
}
