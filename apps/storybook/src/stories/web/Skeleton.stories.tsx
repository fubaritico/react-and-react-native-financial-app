import { Skeleton } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/Atoms/Skeleton',
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        maxWidth: 400,
      }}
    >
      <Skeleton variant="rectangle" width="w-full" height="h-32" />
      <Skeleton variant="circle" width="w-12" height="h-12" />
      <Skeleton variant="line" width="w-full" height="h-4" />
      <Skeleton variant="line" width="w-3/4" height="h-4" />
      <Skeleton variant="line" width="w-1/2" height="h-4" />
    </div>
  ),
}

/** Card-like skeleton placeholder. */
export const CardSkeleton: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 20,
        maxWidth: 350,
        borderRadius: 8,
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Skeleton variant="rectangle" width="w-full" height="h-40" />
      <Skeleton variant="line" width="w-3/4" height="h-5" />
      <Skeleton variant="line" width="w-full" height="h-4" />
      <Skeleton variant="line" width="w-2/3" height="h-4" />
    </div>
  ),
}

/** Profile / avatar skeleton placeholder. */
export const ProfileSkeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Skeleton variant="circle" width="w-10" height="h-10" />
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}
      >
        <Skeleton variant="line" width="w-32" height="h-4" />
        <Skeleton variant="line" width="w-20" height="h-3" />
      </div>
    </div>
  ),
}
