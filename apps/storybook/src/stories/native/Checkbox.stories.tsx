import { Checkbox } from '@financial-app/ui/native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Native/Design System/Atoms/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md'] },
    label: { control: 'text' },
    error: { control: 'text' },
    accessibilityLabel: { control: 'text' },
    onChange: { action: 'changed' },
  },
  args: {
    checked: false,
    onChange: noop,
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}
