import { Card, LatestSpending } from '@financial-app/ui/native'
import { View } from 'react-native'

import type { ILatestSpendingItem } from '@financial-app/ui/native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const sampleItems: readonly ILatestSpendingItem[] = [
  {
    categoryIcon: 'categoryGeneral',
    categoryColor: 'green',
    name: 'Papa Software',
    amount: -10,
    date: '16 Aug 2024',
  },
  {
    categoryIcon: 'categoryBills',
    categoryColor: 'cyan',
    name: 'Quebec Services',
    amount: -5,
    date: '12 Aug 2024',
  },
  {
    categoryIcon: 'categoryGeneral',
    categoryColor: 'navy',
    name: 'Romeo Cloud Service',
    amount: -10,
    date: '5 Aug 2024',
  },
]

const meta = {
  title: 'Native/Design System/Molecules/LatestSpending',
  component: LatestSpending,
  parameters: { backgrounds: 'white' },
  argTypes: {
    title: { control: 'text' },
    seeAllLabel: { control: 'text' },
  },
  args: {
    title: 'Latest Spending',
    seeAllLabel: 'See All',
    onSeeAll: () => undefined,
    items: sampleItems,
  },
} satisfies Meta<typeof LatestSpending>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {
  render: (args) => (
    <View style={{ width: 600 }}>
      <Card>
        <LatestSpending {...args} />
      </Card>
    </View>
  ),
}

/** Standard display with category icons. */
export const WithCategoryIcons: Story = {
  render: () => (
    <View style={{ width: 600 }}>
      <Card title="Entertainment">
        <LatestSpending
          title="Latest Spending"
          seeAllLabel="See All"
          onSeeAll={() => undefined}
          items={sampleItems}
        />
      </Card>
    </View>
  ),
}

const longLabelItems: readonly ILatestSpendingItem[] = [
  {
    categoryIcon: 'categoryGeneral',
    categoryColor: 'green',
    name: 'International Cloud Computing Solutions & Services Ltd.',
    amount: -1250,
    date: '16 Aug 2024',
  },
  {
    categoryIcon: 'categoryTransportation',
    categoryColor: 'blue',
    name: 'Metropolitan Transportation Authority Subscription',
    amount: -99999.99,
    date: '12 Aug 2024',
  },
  {
    categoryIcon: 'categoryBills',
    categoryColor: 'cyan',
    name: 'Transcontinental Telecommunications Group Holdings Inc.',
    amount: -500,
    date: '5 Aug 2024',
  },
]

/** Long labels — tests text truncation with ellipsis. */
export const LongLabels: Story = {
  render: () => (
    <View style={{ width: 380 }}>
      <Card title="Entertainment">
        <LatestSpending
          title="Latest Spending"
          seeAllLabel="See All"
          onSeeAll={() => undefined}
          items={longLabelItems}
        />
      </Card>
    </View>
  ),
}
