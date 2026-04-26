import { Button, Drawer, Menu, Typography } from '@financial-app/ui'
import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Web/Design System/Molecules/Drawer',
  component: Drawer,
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
} satisfies Meta<typeof Drawer>

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
    <>
      <Button
        title="Open Drawer"
        variant="primary"
        onPress={() => {
          setOpen(true)
        }}
      />
      <Drawer
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        variant={args.variant}
        overlay={args.overlay}
        accessibilityLabel="Sort options drawer"
      >
        <Drawer.Header closeLabel="Close">Sort by</Drawer.Header>
        <Drawer.Body>
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
        </Drawer.Body>
      </Drawer>
    </>
  )
}

/** Interactive playground — open drawer, pick a sort option. */
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

const ShowcaseComponent = () => {
  const [lightOpen, setLightOpen] = useState(false)
  const [darkOpen, setDarkOpen] = useState(false)
  const [scrollOpen, setScrollOpen] = useState(false)

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Button
        title="Light"
        variant="outline"
        onPress={() => {
          setLightOpen(true)
        }}
      />
      <Button
        title="Dark"
        variant="primary"
        onPress={() => {
          setDarkOpen(true)
        }}
      />
      <Button
        title="Scrollable"
        variant="secondary"
        onPress={() => {
          setScrollOpen(true)
        }}
      />

      <Drawer
        open={lightOpen}
        onClose={() => {
          setLightOpen(false)
        }}
        variant="light"
        overlay
        accessibilityLabel="Light drawer"
      >
        <Drawer.Header>Light Drawer</Drawer.Header>
        <Drawer.Body>
          <Typography variant="body" as="p">
            Light variant with overlay. Press Escape or click close to dismiss.
          </Typography>
        </Drawer.Body>
      </Drawer>

      <Drawer
        open={darkOpen}
        onClose={() => {
          setDarkOpen(false)
        }}
        variant="dark"
        overlay
        accessibilityLabel="Dark drawer"
      >
        <Drawer.Header>Dark Drawer</Drawer.Header>
        <Drawer.Body>
          <Typography variant="body" color="on-dark" as="p">
            Dark variant with grey-900 background and light text.
          </Typography>
        </Drawer.Body>
      </Drawer>

      <Drawer
        open={scrollOpen}
        onClose={() => {
          setScrollOpen(false)
        }}
        variant="dark"
        overlay
        accessibilityLabel="Scrollable drawer"
      >
        <Drawer.Header>Scrollable Content</Drawer.Header>
        <Drawer.Body>
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              style={{ padding: '8px 0', borderBottom: '1px solid #696868' }}
            >
              <Typography variant="body" color="on-dark" as="p">
                Item {String(i + 1)} — scroll to see more content
              </Typography>
            </div>
          ))}
        </Drawer.Body>
      </Drawer>
    </div>
  )
}

/** Light, dark, and scrollable drawer variants. */
export const Showcase: Story = {
  args: { open: false, onClose: noop, children: null },
  render: () => <ShowcaseComponent />,
  parameters: { controls: { disable: true } },
}
