import { BottomSheet, Button, Menu } from '@financial-app/ui/native'
import { useState } from 'react'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Native/Design System/Molecules/BottomSheet',
  component: BottomSheet,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['light', 'dark'],
    },
    overlay: { control: 'boolean' },
    open: { table: { disable: true } },
    onClose: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof BottomSheet>

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
  variant?: 'light' | 'dark'
  overlay?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('latest')

  return (
    <View>
      <Button
        title="Open BottomSheet"
        variant="primary"
        onPress={() => {
          setOpen(true)
        }}
      />
      <BottomSheet
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        variant={args.variant}
        overlay={args.overlay}
        accessibilityLabel="Sort options bottom sheet"
      >
        <BottomSheet.Header closeLabel="Close">Sort by</BottomSheet.Header>
        <BottomSheet.Body>
          <Menu
            variant={args.variant}
            selectedValue={selected}
            onSelect={(value) => {
              setSelected(value)
              setOpen(false)
            }}
            accessibilityLabel="Sort options"
            className="border-0 p-0"
          >
            {sortOptions.map((opt, i) => (
              <Menu.Item key={opt.value} index={i} value={opt.value}>
                {opt.label}
              </Menu.Item>
            ))}
          </Menu>
        </BottomSheet.Body>
      </BottomSheet>
    </View>
  )
}

/** Interactive playground — open bottom sheet, pick a sort option. */
export const Playground: Story = {
  args: {
    open: false,
    onClose: noop,
    variant: 'dark',
    overlay: true,
    children: null,
  },
  render: (args) => (
    <PlaygroundComponent variant={args.variant} overlay={args.overlay} />
  ),
}
