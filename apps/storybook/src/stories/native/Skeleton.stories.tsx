import { Skeleton } from '@financial-app/ui/native'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/Atoms/Skeleton',
  component: Skeleton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['rectangle', 'circle', 'line'],
    },
    rounded: { control: 'boolean' },
    width: { control: 'text' },
    height: { control: 'text' },
    aspectRatio: { control: 'text' },
  },
  args: {
    variant: 'rectangle',
    width: 'w-64',
    height: 'h-32',
    rounded: true,
  },
  parameters: {
    backgrounds: 'white',
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Common skeleton shapes for loading states. */
export const Shapes: Story = {
  render: () => (
    <View style={{ gap: 16, maxWidth: 400 }}>
      <Skeleton variant="rectangle" width="w-full" height="h-32" />
      <Skeleton variant="circle" width="w-12" height="h-12" />
      <Skeleton variant="line" width="w-full" height="h-4" />
      <Skeleton variant="line" width="w-3/4" height="h-4" />
      <Skeleton variant="line" width="w-1/2" height="h-4" />
    </View>
  ),
}

/** Card-like skeleton placeholder. */
export const CardSkeleton: Story = {
  render: () => (
    <View style={{ gap: 12, padding: 20, maxWidth: 350 }}>
      <Skeleton variant="rectangle" width="w-full" height="h-40" />
      <Skeleton variant="line" width="w-3/4" height="h-5" />
      <Skeleton variant="line" width="w-full" height="h-4" />
      <Skeleton variant="line" width="w-2/3" height="h-4" />
    </View>
  ),
}

/** Profile / avatar skeleton placeholder. */
export const ProfileSkeleton: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Skeleton variant="circle" width="w-10" height="h-10" />
      <View style={{ gap: 8, flex: 1 }}>
        <Skeleton variant="line" width="w-32" height="h-4" />
        <Skeleton variant="line" width="w-20" height="h-3" />
      </View>
    </View>
  ),
}
