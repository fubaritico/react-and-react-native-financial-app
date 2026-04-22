import { PasswordInput } from '@financial-app/ui/native'
import type { IPasswordInputProps } from '@financial-app/ui/native'
import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const PlaygroundWrapper = (args: IPasswordInputProps) => {
  const [value, setValue] = useState(args.value)
  return <PasswordInput {...args} value={value} onChangeText={setValue} />
}

const ShowcaseWrapper = () => {
  const [values, setValues] = useState({ normal: '', helper: '', error: '' })
  const update = (key: keyof typeof values) => (text: string) => {
    setValues((prev) => ({ ...prev, [key]: text }))
  }

  return (
    <View style={{ gap: 24, width: 360 }}>
      <PasswordInput
        label="Password"
        value={values.normal}
        onChangeText={update('normal')}
        placeholder="Enter password"
      />
      <PasswordInput
        label="Create Password"
        value={values.helper}
        onChangeText={update('helper')}
        helperText="Passwords must be at least 8 characters"
      />
      <PasswordInput
        label="Error State"
        value={values.error}
        onChangeText={update('error')}
        helperText="Password is required"
        error
      />
    </View>
  )
}

const meta = {
  title: 'Native/Design System/PasswordInput',
  component: PasswordInput,
  argTypes: {
    error: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    showToggle: { control: 'boolean' },
  },
  args: {
    label: 'Password',
    value: '',
    onChangeText: noop,
    showToggle: true,
  },
} satisfies Meta<typeof PasswordInput>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {
  render: (args) => <PlaygroundWrapper {...args} />,
}

/** All states. */
export const Showcase: Story = {
  render: () => <ShowcaseWrapper />,
}
