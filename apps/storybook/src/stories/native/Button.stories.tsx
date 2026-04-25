import { iconNames } from '@financial-app/icons'
import { Button } from '@financial-app/ui/native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Native/Design System/Atoms/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destroy', 'outline'],
    },
    size: {
      control: 'select',
      options: ['md', 'sm', 'nav'],
    },
    icon: {
      control: 'select',
      options: [undefined, ...iconNames],
    },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    title: { control: 'text' },
    onPress: { action: 'pressed' },
  },
  args: {
    title: 'Button',
    onPress: noop,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}
