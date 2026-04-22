import {
  AuthCard,
  Button,
  LinkText,
  PasswordInput,
  TextInput,
} from '@financial-app/ui/native'
import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { Text, View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const LoginForm = () => {
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

const SignUpForm = () => {
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
  title: 'Native/Design System/AuthCard',
  component: AuthCard,
  argTypes: {
    title: { control: 'text' },
  },
  args: {
    title: 'Login',
    children: <Text>Form content goes here</Text>,
  },
} satisfies Meta<typeof AuthCard>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground. */
export const Playground: Story = {}

/** Login and Sign Up cards with real components. */
export const Showcase: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32, alignItems: 'flex-start' }}>
      <LoginForm />
      <SignUpForm />
    </View>
  ),
}
