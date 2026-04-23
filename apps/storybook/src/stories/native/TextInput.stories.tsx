import { iconNames } from '@financial-app/icons'
import { TextInput } from '@financial-app/ui/native'
import { useState } from 'react'
import { View } from 'react-native'

import type { ITextInputProps } from '@financial-app/ui/native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const PlaygroundWrapper = (args: ITextInputProps) => {
  const [value, setValue] = useState(args.value)
  return <TextInput {...args} value={value} onChangeText={setValue} />
}

const ShowcaseWrapper = () => {
  const [values, setValues] = useState({
    basic: '',
    prefix: '',
    helper: '',
    error: '',
  })
  const update = (key: keyof typeof values) => (text: string) => {
    setValues((prev) => ({ ...prev, [key]: text }))
  }

  return (
    <View style={{ gap: 24, width: 360 }}>
      <TextInput
        label="Basic Field"
        value={values.basic}
        onChangeText={update('basic')}
        placeholder="Placeholder"
      />
      <TextInput
        label="Field With Prefix"
        value={values.prefix}
        onChangeText={update('prefix')}
        placeholder="Placeholder"
        prefix="$"
      />
      <TextInput
        label="With Helper Text"
        value={values.helper}
        onChangeText={update('helper')}
        placeholder="Placeholder"
        helperText="Helper text"
      />
      <TextInput
        label="Error State"
        value={values.error}
        onChangeText={update('error')}
        placeholder="Placeholder"
        helperText="This field is required"
        error
      />
    </View>
  )
}

const meta = {
  title: 'Native/Design System/Molecules/TextInput',
  component: TextInput,
  argTypes: {
    icon: {
      control: 'select',
      options: [undefined, ...iconNames],
    },
    error: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    prefix: { control: 'text' },
  },
  args: {
    label: 'Email',
    value: '',
    onChangeText: noop,
    placeholder: 'e.g. john@example.com',
  },
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {
  render: (args) => <PlaygroundWrapper {...args} />,
}

/** All field variants. */
export const Showcase: Story = {
  render: () => <ShowcaseWrapper />,
}
