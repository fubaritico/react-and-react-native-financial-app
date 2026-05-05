import { BudgetCategoryCard } from '@financial-app/features/budget/native'
import i18n from 'i18next'
import { View } from 'react-native'

import type { ILatestSpendingItem } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const noop = () => undefined

/** Entertainment budget — 3 latest transactions from the design. */
const entertainmentItems: readonly ILatestSpendingItem[] = [
  {
    avatar: 'https://i.pravatar.cc/80?u=james-thompson',
    name: 'James Thompson',
    amount: '-$5.00',
    date: '11 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=pixel-playground',
    name: 'Pixel Playground',
    amount: '-$9.00',
    date: '11 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=rina-sato',
    name: 'Rina Sato',
    amount: '-$9.00',
    date: '13 Jul 2024',
  },
]

/** Bills budget — 3 latest transactions from the design. */
const billsItems: readonly ILatestSpendingItem[] = [
  {
    avatar: 'https://i.pravatar.cc/80?u=spark-electric',
    name: 'Spark Electric Solutions',
    amount: '-$100.00',
    date: '2 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=rina-sato-bills',
    name: 'Rina Sato',
    amount: '-$50.00',
    date: '2 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=aqua-flow',
    name: 'Aqua Flow Utilities',
    amount: '-$100.00',
    date: '30 Jul 2024',
  },
]

/** Dining Out budget — 3 latest transactions from the design. */
const diningOutItems: readonly ILatestSpendingItem[] = [
  {
    avatar: 'https://i.pravatar.cc/80?u=savory-bites',
    name: 'Savory Bites Bistro',
    amount: '-$55.50',
    date: '19 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=ethan-clark',
    name: 'Ethan Clark',
    amount: '-$32.50',
    date: '20 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=ella-phillips',
    name: 'Ella Phillips',
    amount: '-$45.00',
    date: '19 Aug 2024',
  },
]

const meta = {
  title: 'Native/Features/Budget/BudgetCategoryCard',
  component: BudgetCategoryCard,
  parameters: { backgrounds: 'beige' },
  args: {
    category: 'Entertainment',
    maximum: 50,
    spent: 15,
    color: 'green',
    items: entertainmentItems,
    maximumOfLabel: i18n.t('budgets.maximumOf'),
    spentLabel: i18n.t('budgets.spent'),
    remainingLabel: i18n.t('budgets.remaining'),
    latestSpendingTitle: i18n.t('budgets.latestSpending'),
    seeAllLabel: i18n.t('budgets.seeAll'),
    editLabel: i18n.t('budgets.editBudget'),
    deleteLabel: i18n.t('budgets.deleteBudget'),
    onSeeAll: noop,
    onEdit: noop,
    onDelete: noop,
  },
  argTypes: {
    category: { control: 'text' },
    maximum: { control: 'number' },
    spent: { control: 'number' },
    color: { control: 'text' },
  },
} satisfies Meta<typeof BudgetCategoryCard>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {
  render: (args) => (
    <View style={{ width: 600 }}>
      <BudgetCategoryCard {...args} />
    </View>
  ),
}

/** Entertainment — $15 spent of $50, green theme. */
export const Entertainment: Story = {
  render: (args) => (
    <View style={{ width: 600 }}>
      <BudgetCategoryCard {...args} />
    </View>
  ),
}

/** Bills — $150 spent of $750, cyan theme. */
export const Bills: Story = {
  args: {
    category: 'Bills',
    maximum: 750,
    spent: 150,
    color: 'cyan',
    items: billsItems,
  },
  render: (args) => (
    <View style={{ width: 600 }}>
      <BudgetCategoryCard {...args} />
    </View>
  ),
}

/** Dining Out — $133.75 spent of $75, over budget. */
export const DiningOutOverBudget: Story = {
  args: {
    category: 'Dining Out',
    maximum: 75,
    spent: 133.75,
    color: 'yellow',
    items: diningOutItems,
  },
  render: (args) => (
    <View style={{ width: 600 }}>
      <BudgetCategoryCard {...args} />
    </View>
  ),
}

/** No spending items — LatestSpending section hidden. */
export const NoItems: Story = {
  args: {
    category: 'Personal Care',
    maximum: 100,
    spent: 40,
    color: 'navy',
    items: [],
  },
  render: (args) => (
    <View style={{ width: 600 }}>
      <BudgetCategoryCard {...args} />
    </View>
  ),
}
