import { Navigation } from '@financial-app/ui'
import { useState } from 'react'

import type { INavItemConfig } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const NAV_ITEMS: readonly INavItemConfig[] = [
  { icon: 'navOverview', label: 'Overview', href: '/' },
  { icon: 'navTransactions', label: 'Transactions', href: '/transactions' },
  { icon: 'navBudgets', label: 'Budgets', href: '/budgets' },
  { icon: 'navPots', label: 'Pots', href: '/pots' },
  {
    icon: 'navRecurringBills',
    label: 'Recurring Bills',
    href: '/recurring-bills',
  },
]

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

/** Wrapper component for the Interactive story (hooks require a component scope). */
function InteractiveNavigation() {
  const [activeHref, setActiveHref] = useState('/')
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Navigation
        items={NAV_ITEMS}
        activeHref={activeHref}
        onNavigate={setActiveHref}
        collapsed={collapsed}
        onToggleCollapse={() => {
          setCollapsed((c) => !c)
        }}
        minimizeLabel={collapsed ? 'Expand Menu' : 'Minimize Menu'}
      />
      <main style={{ flex: 1, padding: 40 }}>
        <p
          style={{
            color: '#696868',
            fontFamily: 'Public Sans Variable, sans-serif',
          }}
        >
          Active route: <strong>{activeHref}</strong>
          {' | '}Sidebar:{' '}
          <strong>{collapsed ? 'collapsed' : 'expanded'}</strong>
        </p>
      </main>
    </div>
  )
}

const meta = {
  title: 'Web/Design System/Organisms/Navigation',
  component: Navigation,
  argTypes: {
    collapsed: { control: 'boolean' },
    activeHref: {
      control: 'select',
      options: ['/', '/transactions', '/budgets', '/pots', '/recurring-bills'],
    },
    minimizeLabel: { control: 'text' },
  },
  args: {
    items: NAV_ITEMS,
    activeHref: '/',
    collapsed: false,
    minimizeLabel: 'Minimize Menu',
    onNavigate: noop,
    onToggleCollapse: noop,
  },
  parameters: { backgrounds: 'white' },
} satisfies Meta<typeof Navigation>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Fully interactive Navigation — click items to navigate, toggle collapse. */
export const Interactive: Story = {
  render: () => <InteractiveNavigation />,
}

/** Expanded sidebar — desktop layout. */
export const Expanded: Story = {
  render: () => (
    <div style={{ height: '100vh' }}>
      <Navigation
        items={NAV_ITEMS}
        activeHref="/transactions"
        onNavigate={noop}
        collapsed={false}
        onToggleCollapse={noop}
        minimizeLabel="Minimize Menu"
      />
    </div>
  ),
}

/** Collapsed sidebar — icons only. */
export const Collapsed: Story = {
  render: () => (
    <div style={{ height: '100vh' }}>
      <Navigation
        items={NAV_ITEMS}
        activeHref="/budgets"
        onNavigate={noop}
        collapsed
        onToggleCollapse={noop}
        minimizeLabel="Expand Menu"
      />
    </div>
  ),
}
