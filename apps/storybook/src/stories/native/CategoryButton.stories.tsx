import { CategoryButton } from '@financial-app/ui/native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/Atoms/CategoryButton',
  component: CategoryButton,
  argTypes: {
    color: {
      control: 'select',
      options: [
        'green',
        'cyan',
        'navy',
        'blue',
        'purple',
        'magenta',
        'brown',
        'orange',
        'gold',
        'turquoise',
      ],
    },
    isDeletable: { control: 'boolean' },
    isDeleting: { control: 'boolean' },
  },
  args: {
    icon: 'categoryGeneral',
    color: 'green',
    name: 'General',
    accessibilityLabel: 'General',
  },
} satisfies Meta<typeof CategoryButton>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}
