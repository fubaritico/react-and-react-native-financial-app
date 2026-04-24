import { TransactionsOverview } from '@financial-app/ui/native'
import i18n from 'i18next'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const MOCK_TRANSACTIONS = [
  {
    avatar: 'https://i.pravatar.cc/80?u=emma',
    name: 'Emma Richardson',
    amount: 75.5,
    date: '19 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=savory',
    name: 'Savory Bites Bistro',
    amount: -55.5,
    date: '19 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=daniel',
    name: 'Daniel Carter',
    amount: -42.3,
    date: '18 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=sun',
    name: 'Sun Park',
    amount: 120.0,
    date: '17 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=urban',
    name: 'Urban Services Hub',
    amount: -65.0,
    date: '17 Aug 2024',
  },
]

const meta = {
  title: 'Native/Design System/Organisms/TransactionsOverview',
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
    <View style={{ maxWidth: 500, padding: 24, backgroundColor: '#F8F4F0' }}>
      <TransactionsOverview {...args} />
    </View>
  ),
}
