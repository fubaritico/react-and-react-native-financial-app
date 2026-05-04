import { Menu } from '@financial-app/ui/native'
import { useState } from 'react'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/Molecules/Menu',
  component: Menu,
  parameters: { layout: 'centered' },
  argTypes: {
    selectedValue: {
      control: 'inline-radio',
      options: ['none', 'latest', 'oldest', 'a-to-z', 'z-to-a'],
      mapping: { none: undefined },
    },
    variant: {
      control: 'inline-radio',
      options: ['light', 'dark'],
    },
  },
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'a-to-z', label: 'A to Z' },
  { value: 'z-to-a', label: 'Z to A' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' },
]

const PlaygroundComponent = (args: {
  selectedValue?: string
  variant?: 'light' | 'dark'
}) => {
  const [selected, setSelected] = useState(args.selectedValue)
  return (
    <View style={{ width: 200 }}>
      <Menu
        variant={args.variant ?? undefined}
        selectedValue={selected}
        onSelect={setSelected}
        accessibilityLabel="Sort options"
      >
        {sortOptions.map((opt, i) => (
          <Menu.Item key={opt.value} index={i} value={opt.value}>
            {opt.label}
          </Menu.Item>
        ))}
      </Menu>
    </View>
  )
}

/** Interactive playground with variant and selection controls. */
export const Playground: Story = {
  args: {
    selectedValue: 'latest',
    variant: 'light',
    children: null,
  },
  render: (args) => (
    <PlaygroundComponent
      selectedValue={args.selectedValue}
      variant={args.variant ?? undefined}
    />
  ),
}
