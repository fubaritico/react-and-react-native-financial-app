import { Menu } from '@financial-app/ui'
import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/Molecules/Menu',
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
    <div style={{ width: 200 }}>
      <Menu
        variant={args.variant}
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
    </div>
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
      variant={args.variant}
    />
  ),
}

const ShowcaseComponent = () => {
  const [lightSelected, setLightSelected] = useState('latest')
  const [darkSelected, setDarkSelected] = useState('latest')

  const categoryOptions = [
    'All Transactions',
    'Entertainment',
    'Bills',
    'Groceries',
    'Dining Out',
    'Transportation',
    'Personal Care',
  ]

  return (
    <div style={{ width: 700 }}>
      <div style={{ display: 'flex', gap: 40 }}>
        {/* Light — Sort */}
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: '#696868',
            }}
          >
            Dropdown - Sort
          </p>
          <div style={{ width: 180 }}>
            <Menu
              selectedValue={lightSelected}
              onSelect={setLightSelected}
              variant="light"
              accessibilityLabel="Sort by"
            >
              {sortOptions.map((opt, i) => (
                <Menu.Item key={opt.value} index={i} value={opt.value}>
                  {opt.label}
                </Menu.Item>
              ))}
            </Menu>
          </div>
        </div>

        {/* Light — Category */}
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: '#696868',
            }}
          >
            Dropdown - Category
          </p>
          <div style={{ width: 220 }}>
            <Menu
              selectedValue="All Transactions"
              variant="light"
              accessibilityLabel="Category"
            >
              {categoryOptions.map((cat, i) => (
                <Menu.Item key={cat} index={i} value={cat}>
                  {cat}
                </Menu.Item>
              ))}
            </Menu>
          </div>
        </div>
      </div>

      {/* Dark variant */}
      <div style={{ marginTop: 40 }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 8,
            color: '#696868',
          }}
        >
          Dark variant
        </p>
        <div style={{ display: 'flex', gap: 40 }}>
          <div style={{ width: 180 }}>
            <Menu
              variant="dark"
              selectedValue={darkSelected}
              onSelect={setDarkSelected}
              accessibilityLabel="Sort by (dark)"
            >
              {sortOptions.map((opt, i) => (
                <Menu.Item key={opt.value} index={i} value={opt.value}>
                  {opt.label}
                </Menu.Item>
              ))}
            </Menu>
          </div>
          <div style={{ width: 180 }}>
            <Menu variant="dark" accessibilityLabel="With disabled items">
              <Menu.Item index={0} value="latest">
                Latest
              </Menu.Item>
              <Menu.Item index={1} value="oldest" disabled>
                Oldest (disabled)
              </Menu.Item>
              <Menu.Item index={2} value="a-to-z">
                A to Z
              </Menu.Item>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Side-by-side light/dark, sort/category menus matching Figma design. */
export const Showcase: Story = {
  args: { children: null },
  render: () => <ShowcaseComponent />,
  parameters: { controls: { disable: true } },
}
