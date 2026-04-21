import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'

import { AuthCard } from '../AuthCard/AuthCard.web'
import { Button } from '../Button/Button.web'
import { LinkText } from '../LinkText/LinkText.web'
import { PasswordInput } from '../PasswordInput/PasswordInput.web'
import { TextInput } from '../TextInput/TextInput.web'

import { AuthLayout } from './AuthLayout.web'

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
  title: 'Components/AuthLayout',
  component: AuthLayout,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    children: <LoginContent />,
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
