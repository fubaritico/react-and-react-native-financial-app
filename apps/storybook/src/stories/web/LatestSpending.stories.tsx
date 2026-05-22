import { Card, LatestSpending } from '@financial-app/ui'

import type { ILatestSpendingItem } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const sampleItems: readonly ILatestSpendingItem[] = [
  {
    avatar: 'https://i.pravatar.cc/80?u=papa-software',
    name: 'Papa Software',
    amount: -10,
    date: '16 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=quebec-services',
    name: 'Quebec Services',
    amount: -5,
    date: '12 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=romeo-cloud',
    name: 'Romeo Cloud Service',
    amount: -10,
    date: '5 Aug 2024',
  },
]

const meta = {
  title: 'Web/Design System/Molecules/LatestSpending',
  component: LatestSpending,
  argTypes: {
    title: { control: 'text' },
    seeAllLabel: { control: 'text' },
    showAvatars: { control: 'boolean' },
  },
  args: {
    title: 'Latest Spending',
    seeAllLabel: 'See All',
    onSeeAll: () => undefined,
    items: sampleItems,
    showAvatars: true,
  },
} satisfies Meta<typeof LatestSpending>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 600 }}>
      <Card>
        <LatestSpending {...args} />
      </Card>
    </div>
  ),
}

/** With avatars visible (desktop mode). */
export const WithAvatars: Story = {
  render: () => (
    <div style={{ width: 600 }}>
      <Card title="Entertainment">
        <LatestSpending
          title="Latest Spending"
          seeAllLabel="See All"
          onSeeAll={() => undefined}
          items={sampleItems}
          showAvatars
        />
      </Card>
    </div>
  ),
}

/** Without avatars (mobile mode). */
export const WithoutAvatars: Story = {
  render: () => (
    <div style={{ width: 380 }}>
      <Card title="Entertainment">
        <LatestSpending
          title="Latest Spending"
          seeAllLabel="See All"
          onSeeAll={() => undefined}
          items={sampleItems}
        />
      </Card>
    </div>
  ),
}

const longLabelItems: readonly ILatestSpendingItem[] = [
  {
    avatar: 'https://i.pravatar.cc/80?u=alpha-long',
    name: 'International Cloud Computing Solutions & Services Ltd.',
    amount: -1250,
    date: '16 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=bravo-long',
    name: 'Metropolitan Transportation Authority Subscription',
    amount: -99999.99,
    date: '12 Aug 2024',
  },
  {
    avatar: 'https://i.pravatar.cc/80?u=charlie-long',
    name: 'Transcontinental Telecommunications Group Holdings Inc.',
    amount: -500,
    date: '5 Aug 2024',
  },
]

/** Long labels — tests text truncation with ellipsis. */
export const LongLabels: Story = {
  render: () => (
    <div style={{ width: 380 }}>
      <Card title="Entertainment">
        <LatestSpending
          title="Latest Spending"
          seeAllLabel="See All"
          onSeeAll={() => undefined}
          items={longLabelItems}
          showAvatars
        />
      </Card>
    </div>
  ),
}
