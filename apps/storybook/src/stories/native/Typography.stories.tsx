import { Typography } from '@financial-app/ui/native'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <View>
        <Typography variant="page-title">Page Title</Typography>
        <Typography variant="caption" color="muted">
          variant=&quot;page-title&quot; — Preset 1: 32px, bold, leading-tight
        </Typography>
      </View>

      <View>
        <Typography variant="display">$4,836.00</Typography>
        <Typography variant="caption" color="muted">
          variant=&quot;display&quot; — Preset 1: 32px, bold, leading-tight (for
          large amounts)
        </Typography>
      </View>

      <View>
        <Typography variant="section-title">Section Title</Typography>
        <Typography variant="caption" color="muted">
          variant=&quot;section-title&quot; — Preset 2: 20px, bold,
          leading-tight
        </Typography>
      </View>

      <View>
        <Typography variant="subsection-title">Subsection Title</Typography>
        <Typography variant="caption" color="muted">
          variant=&quot;subsection-title&quot; — Preset 3: 16px, bold,
          leading-normal
        </Typography>
      </View>

      <View>
        <Typography variant="body">
          Body text — Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
        <Typography variant="caption" color="muted">
          variant=&quot;body&quot; — Preset 4: 14px, normal, leading-normal
        </Typography>
      </View>

      <View>
        <Typography variant="body-bold">
          Body bold — Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Typography>
        <Typography variant="caption" color="muted">
          variant=&quot;body-bold&quot; — Preset 4Bold: 14px, bold,
          leading-normal
        </Typography>
      </View>

      <View>
        <Typography variant="label">Email</Typography>
        <Typography variant="caption" color="muted">
          variant=&quot;label&quot; — 12px, bold, leading-normal (for form
          fields)
        </Typography>
      </View>

      <View>
        <Typography variant="caption">Caption or helper text</Typography>
        <Typography variant="caption" color="muted">
          variant=&quot;caption&quot; — Preset 5: 12px, normal, leading-normal
        </Typography>
      </View>

      <View>
        <Typography variant="caption-bold">Caption bold text</Typography>
        <Typography variant="caption" color="muted">
          variant=&quot;caption-bold&quot; — Preset 5Bold: 12px, bold,
          leading-normal
        </Typography>
      </View>
    </View>
  ),
}

export const PageTitle: Story = {
  args: {
    variant: 'page-title',
    children: 'The quick brown fox jumps over the lazy dog',
  },
}

export const SectionTitle: Story = {
  args: {
    variant: 'section-title',
    children: 'The quick brown fox jumps over the lazy dog',
  },
}

export const SubsectionTitle: Story = {
  args: {
    variant: 'subsection-title',
    children: 'The quick brown fox jumps over the lazy dog',
  },
}

export const Body: Story = {
  args: {
    variant: 'body',
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  },
}

export const Colors: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Typography variant="body-bold" color="foreground">
        Foreground (default)
      </Typography>
      <Typography variant="body-bold" color="muted">
        Muted
      </Typography>
      <Typography variant="body-bold" color="success">
        Success (+$75.50)
      </Typography>
      <Typography variant="body-bold" color="destructive">
        Destructive (-$55.50)
      </Typography>
      <View
        style={{
          backgroundColor: '#201f24',
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Typography variant="body-bold" color="inverse">
          Inverse (on dark background)
        </Typography>
      </View>
    </View>
  ),
}

export const Composition: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Typography variant="page-title">Overview</Typography>
      <Typography variant="section-title">Pots</Typography>
      <Typography variant="body" color="muted">
        Total Saved
      </Typography>
      <Typography variant="display">$850</Typography>
      <Typography variant="caption" color="muted">
        Savings
      </Typography>
      <Typography variant="caption-bold">$159</Typography>
      <Typography variant="section-title">Transactions</Typography>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body-bold">Emma Richardson</Typography>
        <Typography variant="body-bold" color="success">
          +$75.50
        </Typography>
      </View>
      <Typography variant="caption" color="muted">
        19 Aug 2024
      </Typography>
    </View>
  ),
}
