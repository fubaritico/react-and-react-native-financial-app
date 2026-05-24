import { TransactionsOverview } from '@financial-app/features'
import i18n from 'i18next'

import type { IconName } from '@financial-app/icons'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const MOCK_TRANSACTIONS: {
  categoryIcon: IconName
  categoryColor: string
  name: string
  amount: number
  date: string
}[] = [
  {
    categoryIcon: 'categoryGeneral',
    categoryColor: 'green',
    name: 'Emma Richardson',
    amount: 75.5,
    date: '19 Aug 2024',
  },
  {
    categoryIcon: 'categoryDiningOut',
    categoryColor: 'red',
    name: 'Savory Bites Bistro',
    amount: -55.5,
    date: '19 Aug 2024',
  },
  {
    categoryIcon: 'categoryGeneral',
    categoryColor: 'blue',
    name: 'Daniel Carter',
    amount: -42.3,
    date: '18 Aug 2024',
  },
  {
    categoryIcon: 'categoryGeneral',
    categoryColor: 'yellow',
    name: 'Sun Park',
    amount: 120.0,
    date: '17 Aug 2024',
  },
  {
    categoryIcon: 'categoryBills',
    categoryColor: 'cyan',
    name: 'Urban Services Hub',
    amount: -65.0,
    date: '17 Aug 2024',
  },
]

const meta = {
  title: 'Web/Features/Overview/TransactionsOverview',
  component: TransactionsOverview,
} satisfies Meta<typeof TransactionsOverview>

export default meta
type Story = StoryObj<typeof meta>

/** Realistic overview section as seen on the Overview page. */
export const Showcase: Story = {
  args: {
    title: i18n.t('transactionsOverview.title'),
    viewAllLabel: i18n.t('common.viewAll'),
    transactions: MOCK_TRANSACTIONS,
    onViewAll: () => undefined,
  },
  render: (args) => (
    <div style={{ maxWidth: 500, padding: 24, backgroundColor: '#F8F4F0' }}>
      <TransactionsOverview {...args} />
    </div>
  ),
}
