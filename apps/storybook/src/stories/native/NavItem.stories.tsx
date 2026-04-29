import { iconNames } from '@financial-app/icons'
import { NavItem } from '@financial-app/ui/native'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Native/Design System/Atoms/NavItem',
  component: NavItem,
  argTypes: {
    icon: {
      control: 'select',
      options: iconNames,
    },
    label: { control: 'text' },
    active: { control: 'boolean' },
    collapsed: { control: 'boolean' },
    orientation: {
      control: 'select',
      options: ['row', 'column'],
    },
    onPress: { action: 'pressed' },
  },
  args: {
    icon: 'navOverview',
    label: 'Overview',
    active: false,
    collapsed: false,
    orientation: 'row',
    onPress: noop,
  },
  parameters: { backgrounds: 'dark' },
} satisfies Meta<typeof NavItem>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** All 5 nav icons in sidebar (row) orientation — active vs inactive. */
export const SidebarItems: Story = {
  render: () => (
    <View style={{ gap: 4, width: 300 }}>
      <NavItem
        icon="navOverview"
        label="Overview"
        active
        orientation="row"
        onPress={noop}
      />
      <NavItem
        icon="navTransactions"
        label="Transactions"
        orientation="row"
        onPress={noop}
      />
      <NavItem
        icon="navBudgets"
        label="Budgets"
        orientation="row"
        onPress={noop}
      />
      <NavItem icon="navPots" label="Pots" orientation="row" onPress={noop} />
      <NavItem
        icon="navRecurringBills"
        label="Recurring Bills"
        orientation="row"
        onPress={noop}
      />
    </View>
  ),
}

/** All 5 nav icons in bottom bar (column) orientation. */
export const BottomBarItems: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', width: 500 }}>
      <NavItem
        icon="navOverview"
        label="Overview"
        active
        orientation="column"
        onPress={noop}
      />
      <NavItem
        icon="navTransactions"
        label="Transactions"
        orientation="column"
        onPress={noop}
      />
      <NavItem
        icon="navBudgets"
        label="Budgets"
        orientation="column"
        onPress={noop}
      />
      <NavItem
        icon="navPots"
        label="Pots"
        orientation="column"
        onPress={noop}
      />
      <NavItem
        icon="navRecurringBills"
        label="Bills"
        orientation="column"
        onPress={noop}
      />
    </View>
  ),
}
